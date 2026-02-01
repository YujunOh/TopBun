import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h1 className="text-6xl font-bold text-[var(--color-primary)]">404</h1>
      <p className="text-xl text-[var(--color-text-muted)]">
        {t('title')}
      </p>
    </div>
  );
}
