'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/actions/upload';

export async function createBurger(formData: FormData) {
  const name = formData.get('name') as string;
  const brand = formData.get('brand') as string;
  const locale = (formData.get('locale') as string) || 'ko';

  if (!name || !brand) return;

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
    if ('error' in uploadResult) return;
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
}

export async function createReview(formData: FormData) {
  const burgerId = parseInt(formData.get('burgerId') as string);
  const rating = parseInt(formData.get('rating') as string);
  const content = formData.get('content') as string;
  const author = (formData.get('author') as string) || '게스트';
  const userIdRaw = formData.get('userId') as string | null;
  const userId = userIdRaw && !Number.isNaN(parseInt(userIdRaw)) ? parseInt(userIdRaw) : null;
  const locale = (formData.get('locale') as string) || 'ko';

  if (!content || !rating || !burgerId) return;

  await prisma.review.create({
    data: { burgerId, rating, content, author, userId },
  });

  revalidatePath(`/${locale}/reviews/${burgerId}`);
  revalidatePath(`/${locale}/reviews`);
  redirect(`/${locale}/reviews/${burgerId}`);
}
