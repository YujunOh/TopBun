import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('common');
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)]">
      <h1 className="text-4xl font-bold text-[var(--color-primary)]">{t('title')} 🍔</h1>
      <p className="mt-4 text-[var(--color-text-muted)]">{t('comingSoon')}</p>
    </main>
  );
}
