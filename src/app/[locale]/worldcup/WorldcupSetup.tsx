'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { createBurger } from '@/actions/burgers';
import { createTournament } from '@/lib/tournament';
import type { BurgerDTO } from '@/lib/tournament';

const SIZES = [16, 8, 4] as const;
const SIZE_KEYS: Record<number, string> = { 16: 'round16', 8: 'round8', 4: 'round4' };

export function WorldcupSetup({ burgers }: { burgers: BurgerDTO[] }) {
  const t = useTranslations('worldcup');
  const router = useRouter();
  const [size, setSize] = useState<number>(
    burgers.length >= 16 ? 16 : burgers.length >= 8 ? 8 : 4,
  );
  const [isPending, startTransition] = useTransition();

  const availableSizes = SIZES.filter(s => burgers.length >= s);
  const canStart = burgers.length >= 4;

  function handleStart() {
    const state = createTournament(burgers, size);
    sessionStorage.setItem('topbun-worldcup', JSON.stringify(state));
    router.push('/worldcup/play');
  }

  function handleQuickAdd(formData: FormData) {
    startTransition(async () => {
      await createBurger(formData);
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-text">{t('title')}</h1>
      <p className="mb-8 text-text-muted">{t('subtitle')}</p>

      {/* Round selection */}
      {canStart && (
        <div className="mb-8">
          <div className="flex gap-3">
            {availableSizes.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-xl px-6 py-3 text-sm font-bold transition ${
                  size === s
                    ? 'bg-primary text-white'
                    : 'bg-surface-light text-text-muted hover:bg-surface-light/70'
                }`}
              >
                {t(SIZE_KEYS[s])}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Start button */}
      {canStart ? (
        <button
          data-testid="worldcup-start-button"
          onClick={handleStart}
          className="mb-10 w-full rounded-2xl bg-primary py-4 text-lg font-bold text-white transition hover:bg-primary/90"
        >
          {t('start')}
        </button>
      ) : (
        <p className="mb-10 rounded-2xl bg-surface p-6 text-center text-text-muted">
          {t('notEnough')}
        </p>
      )}

      {/* Quick-add form */}
      <div className="rounded-2xl bg-surface p-6">
        <h2 className="mb-4 text-lg font-bold text-text">{t('quickAdd')}</h2>
        <form action={handleQuickAdd} className="flex flex-col gap-3 sm:flex-row">
          <input type="hidden" name="brand" value="Unknown" />
          <input type="hidden" name="locale" value="ko" />
          <input
            name="name"
            placeholder={t('name')}
            required
            className="flex-1 rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            name="imageUrl"
            placeholder={t('imageUrl')}
            className="flex-1 rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-accent px-6 py-3 font-bold text-white transition hover:bg-accent/90 disabled:opacity-50"
          >
            {t('addBurger')}
          </button>
        </form>
      </div>
    </div>
  );
}
