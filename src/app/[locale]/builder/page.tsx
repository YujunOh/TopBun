import { getTranslations } from 'next-intl/server';
import { BurgerBuilder } from '@/components/builder/BurgerBuilder';

export default async function BuilderPage() {
  const t = await getTranslations('builder');

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-text">{t('title')}</h1>
      <p className="mb-8 text-text-muted">{t('subtitle')}</p>
      <BurgerBuilder />
    </div>
  );
}
