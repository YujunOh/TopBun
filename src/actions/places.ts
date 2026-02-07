"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

interface GetPlacesOptions {
  brand?: string;
  type?: string;
  sort?: string;
}

export async function getPlaces(options: GetPlacesOptions = {}) {
  const { brand, type, sort } = options;

  // Build where clause
  const where: {
    brand?: string;
    isHandmade?: boolean;
  } = {};

  if (brand && brand !== 'all') {
    where.brand = brand;
  }

  if (type === 'handmade') {
    where.isHandmade = true;
  } else if (type === 'franchise') {
    where.isHandmade = false;
  }

  // Build orderBy clause
  type OrderByType = { rating?: 'desc' | 'asc'; reviewCount?: 'desc' | 'asc'; createdAt?: 'desc' | 'asc' };
  let orderBy: OrderByType[] = [{ reviewCount: "desc" }, { rating: "desc" }, { createdAt: "desc" }];

  if (sort === 'rating') {
    orderBy = [{ rating: "desc" }];
  } else if (sort === 'reviews') {
    orderBy = [{ reviewCount: "desc" }];
  } else if (sort === 'newest') {
    orderBy = [{ createdAt: "desc" }];
  }

  return prisma.burgerPlace.findMany({
    where,
    include: {
      user: { select: { name: true, image: true } },
      photos: {
        take: 4,
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { photos: true, events: true },
      },
    },
    orderBy,
  });
}

export async function getPlaceBrands() {
  const places = await prisma.burgerPlace.findMany({
    select: { brand: true },
    distinct: ['brand'],
  });
  return places.map(p => p.brand).filter((b): b is string => b !== null);
}

export async function getPlaceById(id: number) {
  return prisma.burgerPlace.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, image: true } },
      photos: {
        include: {
          user: { select: { name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      events: {
        where: {
          endDate: { gte: new Date() },
        },
        orderBy: { startDate: "asc" },
      },
    },
  });
}

export async function createPlace(formData: FormData) {
  const name = formData.get("name") as string;
  const nameEn = formData.get("nameEn") as string | null;
  const brand = formData.get("brand") as string | null;
  const address = formData.get("address") as string;
  const naverMapUrl = formData.get("naverMapUrl") as string | null;
  const kakaoMapUrl = formData.get("kakaoMapUrl") as string | null;
  const phone = formData.get("phone") as string | null;
  const isHandmade = formData.get("isHandmade") === "true";
  const userId = formData.get("userId") ? parseInt(formData.get("userId") as string) : null;

  if (!name || !address) {
    return { error: "Missing required fields" };
  }

  try {
    await prisma.burgerPlace.create({
      data: {
        name,
        nameEn,
        brand,
        address,
        naverMapUrl,
        kakaoMapUrl,
        phone,
        isHandmade,
        userId,
      },
    });

    revalidatePath("/places");
    return { success: true };
  } catch (error) {
    console.error("Failed to create place:", error);
    return { error: "Failed to create place" };
  }
}

export async function createPlacePhoto(formData: FormData) {
  const placeId = parseInt(formData.get("placeId") as string);
  const userId = parseInt(formData.get("userId") as string);
  const imageUrl = formData.get("imageUrl") as string;
  const photoType = formData.get("photoType") as string;
  const caption = formData.get("caption") as string | null;

  if (!placeId || !userId || !imageUrl || !photoType) {
    return { error: "Missing required fields" };
  }

  try {
    // Create photo
    await prisma.placePhoto.create({
      data: {
        placeId,
        userId,
        imageUrl,
        photoType,
        caption,
        points: 10,
      },
    });

    // Award points to user
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: { increment: 10 },
      },
    });

    // Update place photo count
    const photoCount = await prisma.placePhoto.count({
      where: { placeId },
    });

    if (photoCount >= 10) {
      // If 10+ photos, mark user as enthusiast
      await prisma.user.update({
        where: { id: userId },
        data: { badge: "enthusiast" },
      });
    }

    revalidatePath(`/places/${placeId}`);
    revalidatePath("/places");
    return { success: true };
  } catch (error) {
    console.error("Failed to create photo:", error);
    return { error: "Failed to create photo" };
  }
}

export async function createEvent(formData: FormData) {
   const title = formData.get("title") as string;
   const description = formData.get("description") as string;
   const brand = formData.get("brand") as string | null;
   const placeId = formData.get("placeId") ? parseInt(formData.get("placeId") as string) : null;
   const imageUrl = formData.get("imageUrl") as string | null;
   const startDate = new Date(formData.get("startDate") as string);
   const endDate = new Date(formData.get("endDate") as string);
   const eventType = formData.get("eventType") as string;
   const userId = formData.get("userId") ? parseInt(formData.get("userId") as string) : null;

   if (!title || !description || !eventType) {
     return { error: "Missing required fields: title, description, and eventType are required" };
   }

   if (!formData.get("startDate") || !formData.get("endDate")) {
     return { error: "Missing required fields: startDate and endDate are required" };
   }

   if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
     return { error: "Invalid date format: startDate and endDate must be valid dates" };
   }

   if (startDate >= endDate) {
     return { error: "Invalid date range: startDate must be before endDate" };
   }

  try {
    await prisma.burgerEvent.create({
      data: {
        title,
        description,
        brand,
        placeId,
        imageUrl,
        startDate,
        endDate,
        eventType,
        userId,
      },
    });

    revalidatePath("/places");
    return { success: true };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { error: "Failed to create event" };
  }
}

export async function getEvents() {
  const now = new Date();
  return prisma.burgerEvent.findMany({
    where: {
      endDate: { gte: now },
    },
    include: {
      place: { select: { name: true, address: true } },
      user: { select: { name: true, image: true } },
    },
    orderBy: [
      { startDate: "asc" },
    ],
  });
}
