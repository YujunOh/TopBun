'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';

interface DealFiltersProps {
  activeBrand: string;
  activeDiscount: string;
  activeSort: string;
  brands: string[];
}

export function DealFilters({ activeBrand, activeDiscount, activeSort, brands }: DealFiltersProps) {
  const t = useTranslations('deals.filter');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const discountOptions = ['all', '20', '30', '50'] as const;
  const sortOptions = ['importance', 'endDate', 'discount', 'newest'] as const;

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl bg-surface p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        {/* Brand Filter */}
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-text">
            {t('brand')}
          </label>
          <select
            value={activeBrand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="w-full rounded-lg border border-surface-light bg-bg px-4 py-2 text-sm text-text transition-colors hover:border-primary focus:border-primary focus:outline-none"
          >
            <option value="all">{t('allBrands')}</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-text">
            {t('sortBy')}
          </label>
          <select
            value={activeSort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="w-full rounded-lg border border-surface-light bg-bg px-4 py-2 text-sm text-text transition-colors hover:border-primary focus:border-primary focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {t(option)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Discount Filter */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text">
          {t('discount')}
        </label>
        <div className="flex flex-wrap gap-2">
          {discountOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleFilterChange('discount', option)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeDiscount === option
                  ? 'bg-primary text-white'
                  : 'bg-bg text-text-muted hover:bg-surface-light hover:text-text'
              }`}
            >
              {option === 'all' ? t('allDiscounts') : t(`discount${option}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
