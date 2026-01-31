'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';

const categories = ['all', 'classic', 'premium', 'handmade', 'korean'] as const;

export function CategoryFilter({ active }: { active: string }) {
  const t = useTranslations('review.filter');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'all') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === cat
              ? 'bg-primary text-white'
              : 'bg-surface text-text-muted hover:bg-surface-light hover:text-text'
          }`}
        >
          {t(cat)}
        </button>
      ))}
    </div>
  );
}
