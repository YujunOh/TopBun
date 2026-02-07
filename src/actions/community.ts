'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function createCommunityPost(formData: FormData) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id) : null;
    const author = session?.user?.name || (formData.get('author') as string)?.trim() || '게스트';

    const title = (formData.get('title') as string)?.trim();
    const content = (formData.get('content') as string)?.trim();
    const imageUrl = (formData.get('imageUrl') as string)?.trim();

    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    await prisma.communityPost.create({
      data: {
        title,
        content,
        author,
        imageUrl: imageUrl || null,
        userId: userId && !Number.isNaN(userId) ? userId : null,
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
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'Login required' };
    }

    const userId = parseInt(session.user.id);
    if (Number.isNaN(userId)) {
      return { error: 'Invalid user' };
    }

    const postIdRaw = (formData.get('postId') as string)?.trim();
    const title = (formData.get('title') as string)?.trim();
    const content = (formData.get('content') as string)?.trim();

    if (!postIdRaw || !title || !content) {
      return { error: 'Post ID, title, and content are required' };
    }

    const postId = parseInt(postIdRaw);
    if (Number.isNaN(postId)) {
      return { error: 'Invalid post ID' };
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
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'Login required' };
    }

    const userId = parseInt(session.user.id);
    if (Number.isNaN(userId)) {
      return { error: 'Invalid user' };
    }

    const postIdRaw = (formData.get('postId') as string)?.trim();
    if (!postIdRaw) {
      return { error: 'Post ID is required' };
    }

    const postId = parseInt(postIdRaw);
    if (Number.isNaN(postId)) {
      return { error: 'Invalid post ID' };
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

export async function togglePostLike(postId: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'Login required' };
    }

    const userId = parseInt(session.user.id);
    if (Number.isNaN(userId)) {
      return { error: 'Invalid user' };
    }

    const existingLike = await prisma.postLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: { id: existingLike.id },
      });
    } else {
      await prisma.postLike.create({
        data: { postId, userId },
      });
    }

    revalidatePath('/community');
    revalidatePath(`/community/${postId}`);
    return { success: true, liked: !existingLike };
  } catch (error) {
    console.error('Failed to toggle like:', error);
    return { error: 'Failed to toggle like' };
  }
}

export async function getPostLikeStatus(postId: number) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id) : null;

    const likeCount = await prisma.postLike.count({
      where: { postId },
    });

    let isLiked = false;
    if (userId && !Number.isNaN(userId)) {
      const existingLike = await prisma.postLike.findUnique({
        where: { postId_userId: { postId, userId } },
      });
      isLiked = !!existingLike;
    }

    return { likeCount, isLiked };
  } catch (error) {
    console.error('Failed to get like status:', error);
    return { likeCount: 0, isLiked: false };
  }
}
