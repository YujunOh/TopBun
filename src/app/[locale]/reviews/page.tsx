import { getTranslations, getLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/navigation';
import { CategoryFilter } from './CategoryFilter';

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const t = await getTranslations('review');
  const locale = await getLocale();
  const { category } = await searchParams;
  const activeCategory = category || 'all';

  const where = activeCategory !== 'all' ? { category: activeCategory } : {};

  const burgers = await prisma.burger.findMany({
    where,
    include: {
      reviews: {
        select: { rating: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const burgersWithStats = burgers.map((burger) => {
    const reviewCount = burger.reviews.length;
    const avgRating =
      reviewCount > 0
        ? burger.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;
    return { ...burger, reviewCount, avgRating };
  });

  const displayName = (burger: { name: string; nameEn: string | null }) =>
    locale === 'en' && burger.nameEn ? burger.nameEn : burger.name;

  const displayBrand = (burger: { brand: string; brandEn: string | null }) =>
    locale === 'en' && burger.brandEn ? burger.brandEn : burger.brand;

  const renderStars = (avg: number) => {
    const full = Math.round(avg);
    return Array.from({ length: 5 }, (_, i) => (i < full ? '\u2605' : '\u2606')).join('');
  };

  return (
    <div data-testid="reviews-page" className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-text">{t('title')}</h1>
        <Link
          href="/reviews/new"
          className="inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent"
        >
          + {t('addBurger')}
        </Link>
      </div>

      <CategoryFilter active={activeCategory} />

      <div data-testid="burger-grid" className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {burgersWithStats.map((burger) => (
          <Link
            key={burger.id}
            href={`/reviews/${burger.id}`}
            className="group rounded-2xl bg-surface p-4 transition-transform hover:scale-[1.02] hover:bg-surface-light"
          >
            <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-bg">
              <img
                src={burger.imageUrl}
                alt={displayName(burger)}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-text group-hover:text-primary">
              {displayName(burger)}
            </h3>
            <p className="text-sm text-text-muted">{displayBrand(burger)}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-lg text-accent">{renderStars(burger.avgRating)}</span>
              <span className="text-sm text-text-muted">
                {burger.avgRating > 0 ? burger.avgRating.toFixed(1) : ''}
              </span>
            </div>
            <p className="mt-1 text-xs text-text-muted">
              {burger.reviewCount > 0
                ? `${burger.reviewCount} ${burger.reviewCount === 1 ? 'review' : 'reviews'}`
                : t('noReviews')}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
