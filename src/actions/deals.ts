"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

interface GetDealsOptions {
  brand?: string;
  discount?: string;
  sort?: string;
}

export async function getDeals(options: GetDealsOptions = {}) {
  const now = new Date();
  const { brand, discount, sort } = options;

  // Build where clause
  const where: {
    isActive: boolean;
    endDate: { gte: Date };
    brand?: string;
    discountRate?: { gte: number };
  } = {
    isActive: true,
    endDate: { gte: now },
  };

  if (brand && brand !== 'all') {
    where.brand = brand;
  }

  if (discount && discount !== 'all') {
    where.discountRate = { gte: parseInt(discount) };
  }

  // Build orderBy clause
  type OrderByType = { importance?: 'desc' | 'asc'; endDate?: 'desc' | 'asc'; discountRate?: 'desc' | 'asc'; createdAt?: 'desc' | 'asc' };
  let orderBy: OrderByType[] = [{ importance: "desc" }, { endDate: "asc" }];

  if (sort === 'endDate') {
    orderBy = [{ endDate: "asc" }];
  } else if (sort === 'discount') {
    orderBy = [{ discountRate: "desc" }];
  } else if (sort === 'newest') {
    orderBy = [{ createdAt: "desc" }];
  }

  return prisma.deal.findMany({
    where,
    include: {
      burger: true,
      user: { select: { name: true, image: true } },
    },
    orderBy,
  });
}

export async function getDealBrands() {
  const deals = await prisma.deal.findMany({
    where: { isActive: true },
    select: { brand: true },
    distinct: ['brand'],
  });
  return deals.map(d => d.brand).filter(Boolean);
}

export async function getExpiredDeals() {
  const now = new Date();
  return prisma.deal.findMany({
    where: {
      OR: [
        { isActive: false },
        { endDate: { lt: now } },
      ],
    },
    include: {
      burger: true,
    },
    orderBy: { endDate: "desc" },
    take: 10,
  });
}

export async function createDeal(formData: FormData) {
   const title = formData.get("title") as string;
   const description = formData.get("description") as string;
   const brand = formData.get("brand") as string;
   const discountRate = formData.get("discountRate") ? parseInt(formData.get("discountRate") as string) : null;
   const originalPrice = formData.get("originalPrice") ? parseInt(formData.get("originalPrice") as string) : null;
   const dealPrice = formData.get("dealPrice") ? parseInt(formData.get("dealPrice") as string) : null;
   const imageUrl = formData.get("imageUrl") as string | null;
   const startDate = new Date(formData.get("startDate") as string);
   const endDate = new Date(formData.get("endDate") as string);
   const importance = parseInt(formData.get("importance") as string) || 3;
   const source = formData.get("source") as string | null;
   const userId = formData.get("userId") ? parseInt(formData.get("userId") as string) : null;
   const burgerId = formData.get("burgerId") ? parseInt(formData.get("burgerId") as string) : null;

   if (!title || !description || !brand) {
     return { error: "Missing required fields: title, description, and brand are required" };
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
    await prisma.deal.create({
      data: {
        title,
        description,
        brand,
        discountRate,
        originalPrice,
        dealPrice,
        imageUrl,
        startDate,
        endDate,
        importance,
        source,
        userId,
        burgerId,
      },
    });

    revalidatePath("/deals");
    return { success: true };
  } catch (error) {
    console.error("Failed to create deal:", error);
    return { error: "Failed to create deal" };
  }
}

export async function deleteDeal(dealId: number, userId: string) {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
    });

    if (!deal) {
      return { error: "Deal not found" };
    }

    if (deal.userId !== parseInt(userId)) {
      return { error: "Unauthorized" };
    }

    await prisma.deal.delete({
      where: { id: dealId },
    });

    revalidatePath("/deals");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete deal:", error);
    return { error: "Failed to delete deal" };
  }
}
