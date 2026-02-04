'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createCommunityPost(formData: FormData) {
  try {
    const title = (formData.get('title') as string)?.trim();
    const content = (formData.get('content') as string)?.trim();
    const author = (formData.get('author') as string)?.trim() || '게스트';

    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    await prisma.communityPost.create({
      data: { title, content, author },
    });

    revalidatePath('/community');
  } catch (error) {
    console.error('Failed to create community post:', error);
    throw error;
  }
}

export async function createCommunityComment(formData: FormData) {
  try {
    const postIdRaw = formData.get('postId') as string;
    const content = (formData.get('content') as string)?.trim();
    const author = (formData.get('author') as string)?.trim() || '게스트';

    if (!postIdRaw || !content) {
      throw new Error('Post ID and content are required');
    }

    const postId = parseInt(postIdRaw);
    if (Number.isNaN(postId)) {
      throw new Error('Invalid post ID');
    }

    await prisma.communityComment.create({
      data: { postId, content, author },
    });

    revalidatePath(`/community/${postId}`);
  } catch (error) {
    console.error('Failed to create community comment:', error);
    throw error;
  }
}
