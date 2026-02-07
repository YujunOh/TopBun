'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface UpdateProfileData {
  name?: string;
}

export async function updateProfile(data: UpdateProfileData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const userId = parseInt(session.user.id, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name?.trim() || null,
      },
    });

    revalidatePath('/profile');

    return { success: true };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}
