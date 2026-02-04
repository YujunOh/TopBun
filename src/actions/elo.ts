'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { calculateElo } from '@/lib/elo';

export async function updateEloAfterMatch(winnerId: number, loserId: number, locale: string) {
  try {
    const winner = await prisma.burger.findUnique({ where: { id: winnerId } });
    const loser = await prisma.burger.findUnique({ where: { id: loserId } });
    
    if (!winner || !loser) {
      throw new Error('Winner or loser not found');
    }

    const [newWinnerElo, newLoserElo] = calculateElo(winner.eloRating, loser.eloRating, 1, 0);
    const winnerDelta = newWinnerElo - winner.eloRating;
    const loserDelta = newLoserElo - loser.eloRating;

    await prisma.burger.update({
      where: { id: winnerId },
      data: { eloRating: newWinnerElo, lastEloDelta: winnerDelta, matchCount: { increment: 1 } },
    });
    await prisma.burger.update({
      where: { id: loserId },
      data: { eloRating: newLoserElo, lastEloDelta: loserDelta, matchCount: { increment: 1 } },
    });

    revalidatePath(`/${locale}/rankings`);
  } catch (error) {
    console.error('Failed to update ELO:', error);
    throw error;
  }
}
