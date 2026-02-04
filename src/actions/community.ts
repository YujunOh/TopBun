'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createCommunityPost(formData: FormData) {
  try {
    const title = (formData.get('title') as string)?.trim();
    const content = (formData.get('content') as string)?.trim();
    const author = (formData.get('author') as string)?.trim() || '게스트';
    const imageUrl = (formData.get('imageUrl') as string)?.trim();
    const userIdRaw = (formData.get('userId') as string)?.trim();

    const userId = userIdRaw ? parseInt(userIdRaw) : null;
    if (userIdRaw && Number.isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    await prisma.communityPost.create({
      data: {
        title,
        content,
        author,
        imageUrl: imageUrl || null,
        userId,
      },
    });

    revalidatePath('/community');
    return { success: true };
  } catch (error) {
    console.error('Failed to create community post:', error);
    return { error: 'Failed to create community post' };
  }
}

export async function updateCommunityPost(formData: FormData) {
  try {
    const postIdRaw = (formData.get('postId') as string)?.trim();
    const title = (formData.get('title') as string)?.trim();
    const content = (formData.get('content') as string)?.trim();
    const userIdRaw = (formData.get('userId') as string)?.trim();

    if (!postIdRaw || !title || !content || !userIdRaw) {
      return { error: 'Post ID, title, content, and user ID are required' };
    }

    const postId = parseInt(postIdRaw);
    const userId = parseInt(userIdRaw);
    if (Number.isNaN(postId) || Number.isNaN(userId)) {
      return { error: 'Invalid post ID or user ID' };
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post || post.userId !== userId) {
      return { error: 'Unauthorized to update this post' };
    }

    await prisma.communityPost.update({
      where: { id: postId },
      data: { title, content },
    });

    revalidatePath('/community');
    revalidatePath(`/community/${postId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update community post:', error);
    return { error: 'Failed to update community post' };
  }
}

export async function deleteCommunityPost(formData: FormData) {
  try {
    const postIdRaw = (formData.get('postId') as string)?.trim();
    const userIdRaw = (formData.get('userId') as string)?.trim();

    if (!postIdRaw || !userIdRaw) {
      return { error: 'Post ID and user ID are required' };
    }

    const postId = parseInt(postIdRaw);
    const userId = parseInt(userIdRaw);
    if (Number.isNaN(postId) || Number.isNaN(userId)) {
      return { error: 'Invalid post ID or user ID' };
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post || post.userId !== userId) {
      return { error: 'Unauthorized to delete this post' };
    }

    await prisma.communityPost.delete({
      where: { id: postId },
    });

    revalidatePath('/community');
    revalidatePath(`/community/${postId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete community post:', error);
    return { error: 'Failed to delete community post' };
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
