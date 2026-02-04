'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/actions/upload';

export async function createBurger(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const brand = formData.get('brand') as string;
    const locale = (formData.get('locale') as string) || 'ko';

    if (!name || !brand) {
      throw new Error('Name and brand are required');
    }

    const nameEn = (formData.get('nameEn') as string) || null;
    const brandEn = (formData.get('brandEn') as string) || null;
    const description = (formData.get('description') as string) || null;
    const descriptionEn = (formData.get('descriptionEn') as string) || null;
    let imageUrl = '/images/default-burger.svg';
    const imageFile = formData.get('file');
    if (imageFile instanceof File && imageFile.size > 0) {
      const uploadData = new FormData();
      uploadData.set('file', imageFile);
      const uploadResult = await uploadImage(uploadData);
      if ('error' in uploadResult) {
        throw new Error(uploadResult.error);
      }
      imageUrl = uploadResult.url;
    }
    const rawCategory = (formData.get('category') as string) || 'classic';
    const category = ['classic', 'premium', 'handmade', 'korean'].includes(rawCategory)
      ? rawCategory
      : 'classic';

    await prisma.burger.create({
      data: { name, nameEn, brand, brandEn, description, descriptionEn, imageUrl, category },
    });

    revalidatePath(`/${locale}/reviews`);
    revalidatePath(`/${locale}/rankings`);
    redirect(`/${locale}/reviews`);
  } catch (error) {
    console.error('Failed to create burger:', error);
    throw error;
  }
}

export async function createReview(formData: FormData) {
  try {
    const burgerId = parseInt(formData.get('burgerId') as string);
    const rating = parseInt(formData.get('rating') as string);
    const content = formData.get('content') as string;
    const author = (formData.get('author') as string) || '게스트';
    const userIdRaw = formData.get('userId') as string | null;
    const userId = userIdRaw && !Number.isNaN(parseInt(userIdRaw)) ? parseInt(userIdRaw) : null;
    const locale = (formData.get('locale') as string) || 'ko';

    if (!content || !rating || !burgerId) {
      throw new Error('Content, rating, and burger ID are required');
    }

    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    await prisma.review.create({
      data: { burgerId, rating, content, author, userId },
    });

    revalidatePath(`/${locale}/reviews/${burgerId}`);
    revalidatePath(`/${locale}/reviews`);
    redirect(`/${locale}/reviews/${burgerId}`);
  } catch (error) {
    console.error('Failed to create review:', error);
    throw error;
  }
}
