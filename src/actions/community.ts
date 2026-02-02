'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createCommunityPost(formData: FormData) {
  const title = (formData.get('title') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();
  const author = (formData.get('author') as string)?.trim() || '게스트';

  if (!title || !content) return;

  await prisma.communityPost.create({
    data: { title, content, author },
  });

  revalidatePath('/community');
}
