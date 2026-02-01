'use client';

import { useEffect, useState, useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { updateEloAfterMatch } from '@/actions/elo';
import {
  advanceWinner,
  getCurrentMatch,
  getRoundLabel,
  getWinner,
  isTournamentComplete,
} from '@/lib/tournament';
import type { TournamentState, BurgerDTO } from '@/lib/tournament';
import Image from 'next/image';

const STORAGE_KEY = 'topbun-worldcup';

export default function WorldcupPlayPage() {
  const t = useTranslations('worldcup');
  const locale = useLocale();
  const router = useRouter();
  const [state, setState] = useState<TournamentState | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load from sessionStorage
  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      router.replace('/worldcup');
      return;
    }
    setState(JSON.parse(raw) as TournamentState);
  }, [router]);

  if (!state) return null;

  const complete = isTournamentComplete(state);
  const winner = getWinner(state);
  const match = getCurrentMatch(state);
  const roundLabel = !complete ? getRoundLabel(state) : '';
  const round = state.rounds[state.currentRound];
  const matchIndex = state.currentMatch;
  const totalMatches = round ? round.matches.length : 0;

  function displayName(burger: BurgerDTO) {
    return locale === 'en' && burger.nameEn ? burger.nameEn : burger.name;
  }

  function handlePick(winnerId: number, loserId: number) {
    startTransition(async () => {
      await updateEloAfterMatch(winnerId, loserId, locale);
      const next = advanceWinner(state!, winnerId);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setState(next);
    });
  }

  function handlePlayAgain() {
    sessionStorage.removeItem(STORAGE_KEY);
    router.push('/worldcup');
  }

  // --- Winner celebration ---
  if (complete && winner) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center">
        <div className="mb-6 text-6xl">🎉🏆</div>
        <h1 className="mb-2 text-3xl font-bold text-text">{t('congratulations')}</h1>
        <div className="my-8 rounded-2xl bg-surface p-8 shadow-lg">
          <div className="relative mx-auto mb-4 h-48 w-48 overflow-hidden rounded-xl">
            <Image
              src={winner.imageUrl}
              alt={displayName(winner)}
              fill
              className="object-cover"
            />
          </div>
          <p className="text-2xl font-bold text-primary">{displayName(winner)}</p>
          <p className="mt-1 text-lg text-accent">{t('winner')}</p>
        </div>
        <button
          onClick={handlePlayAgain}
          className="rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-white transition hover:bg-primary/90"
        >
          {t('playAgain')}
        </button>
      </div>
    );
  }

  // --- Match play ---
  if (!match) return null;

   return (
     <div className="relative mx-auto max-w-4xl px-4 py-10">
      {/* Progress */}
      <div className="mb-8 text-center">
        <span className="rounded-full bg-surface px-4 py-2 text-sm font-bold text-text-muted">
          {roundLabel} {matchIndex + 1}/{totalMatches}
        </span>
      </div>

      {/* Two cards */}
      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        {([match.burgerA, match.burgerB] as const).map(burger => (
          <button
            key={burger.id}
            disabled={isPending}
            onClick={() =>
              handlePick(
                burger.id,
                burger.id === match.burgerA.id ? match.burgerB.id : match.burgerA.id,
              )
            }
            className="group flex flex-col items-center rounded-2xl bg-surface p-4 sm:p-6 transition hover:ring-2 hover:ring-primary disabled:opacity-60"
          >
            <div className="relative mb-4 h-36 w-36 sm:h-48 sm:w-48 overflow-hidden rounded-xl">
              <Image
                src={burger.imageUrl}
                alt={displayName(burger)}
                fill
                className="object-cover transition group-hover:scale-105"
              />
            </div>
            <p className="text-lg font-bold text-text">{displayName(burger)}</p>
            <p className="text-xs text-text-muted">ELO {Math.round(burger.eloRating)}</p>
          </button>
        ))}
      </div>

      {/* VS label */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-black text-primary/60 hidden sm:block">
        {t('vs')}
      </div>
    </div>
  );
}
