import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  const tCommon = await getTranslations('common');

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 px-4">
      <h1 className="text-6xl font-bold text-[var(--color-primary)]">404</h1>
      <p className="text-xl text-[var(--color-text-muted)] text-center">
        {t('title')}
      </p>
      <Link
        href="/"
        className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-accent"
      >
        {tCommon('title')}
      </Link>
    </div>
  );
}
