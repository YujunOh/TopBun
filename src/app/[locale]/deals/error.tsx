"use client";

import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations('error');

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4" role="alert">
      <h2 className="text-2xl font-bold text-[var(--color-primary)]">
        {t('title')}
      </h2>
      <p className="text-[var(--color-text-muted)]">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label="Try again"
      >
        {t('tryAgain')}
      </button>
    </div>
  );
}
