'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { createBurger } from '@/actions/burgers';

const categories = ['classic', 'premium', 'handmade', 'korean'] as const;

export default function NewBurgerPage() {
  const t = useTranslations('review');
  const locale = useLocale();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-text">{t('addBurger')}</h1>

      <form action={createBurger} className="flex flex-col gap-5 rounded-2xl bg-surface p-6">
        <input type="hidden" name="locale" value={locale} />

        {/* Name */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-text">
              {t('form.name')} *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text placeholder-text-muted focus:border-primary focus:outline-none"
              placeholder={t('form.name')}
            />
          </div>
          <div>
            <label htmlFor="nameEn" className="mb-1 block text-sm font-medium text-text">
              {t('form.nameEn')}
            </label>
            <input
              id="nameEn"
              name="nameEn"
              type="text"
              className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text placeholder-text-muted focus:border-primary focus:outline-none"
              placeholder={t('form.nameEn')}
            />
          </div>
        </div>

        {/* Brand */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="brand" className="mb-1 block text-sm font-medium text-text">
              {t('form.brand')} *
            </label>
            <input
              id="brand"
              name="brand"
              type="text"
              required
              className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text placeholder-text-muted focus:border-primary focus:outline-none"
              placeholder={t('form.brand')}
            />
          </div>
          <div>
            <label htmlFor="brandEn" className="mb-1 block text-sm font-medium text-text">
              {t('form.brandEn')}
            </label>
            <input
              id="brandEn"
              name="brandEn"
              type="text"
              className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text placeholder-text-muted focus:border-primary focus:outline-none"
              placeholder={t('form.brandEn')}
            />
          </div>
        </div>

        {/* Description */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-text">
              {t('form.description')}
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text placeholder-text-muted focus:border-primary focus:outline-none"
              placeholder={t('form.description')}
            />
          </div>
          <div>
            <label htmlFor="descriptionEn" className="mb-1 block text-sm font-medium text-text">
              {t('form.descriptionEn')}
            </label>
            <textarea
              id="descriptionEn"
              name="descriptionEn"
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text placeholder-text-muted focus:border-primary focus:outline-none"
              placeholder={t('form.descriptionEn')}
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="mb-1 block text-sm font-medium text-text">
            {t('form.imageUrl')}
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text placeholder-text-muted focus:border-primary focus:outline-none"
            placeholder="/images/default-burger.svg"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-text">
            {t('form.category')}
          </label>
          <select
            id="category"
            name="category"
            defaultValue="classic"
            className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text focus:border-primary focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {t(`filter.${cat}`)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="self-start rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent"
        >
          {t('submit')}
        </button>
      </form>
    </div>
  );
}
