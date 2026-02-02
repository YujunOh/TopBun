import { getTranslations, getLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ReviewForm } from './ReviewForm';
import Image from 'next/image';

export default async function BurgerDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations('review');
  const locale = await getLocale();

  const burger = await prisma.burger.findUnique({
    where: { id: parseInt(id) },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!burger) notFound();

  const displayName = locale === 'en' && burger.nameEn ? burger.nameEn : burger.name;
  const displayBrand = locale === 'en' && burger.brandEn ? burger.brandEn : burger.brand;
  const displayDesc =
    locale === 'en' && burger.descriptionEn ? burger.descriptionEn : burger.description;

  const avgRating =
    burger.reviews.length > 0
      ? burger.reviews.reduce((sum, r) => sum + r.rating, 0) / burger.reviews.length
      : 0;

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (i < rating ? '\u2605' : '\u2606')).join('');

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Burger Detail */}
      <div className="mb-10 flex flex-col gap-6 rounded-2xl bg-surface p-6 sm:flex-row">
        <div className="aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-bg sm:w-64">
          <Image
            src={burger.imageUrl || '/images/default-burger.svg'}
            alt={displayName}
            width={600}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-text">{displayName}</h1>
          <p className="text-lg text-text-muted">{displayBrand}</p>
          {displayDesc && <p className="text-sm text-text-muted">{displayDesc}</p>}
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-text-muted">
            <span className="rounded-full bg-surface-light px-3 py-1">{burger.category}</span>
            <span>ELO: {burger.eloRating.toFixed(0)}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-2xl text-accent">{renderStars(Math.round(avgRating))}</span>
            {avgRating > 0 && (
              <span className="text-lg text-text-muted">{avgRating.toFixed(1)}</span>
            )}
            <span className="text-sm text-text-muted">
              ({burger.reviews.length} {burger.reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
      </div>

      {/* Write Review */}
      <div className="mb-10 rounded-2xl bg-surface p-6">
        <h2 className="mb-4 text-xl font-semibold text-text">{t('writeReview')}</h2>
        <ReviewForm burgerId={burger.id} locale={locale} />
      </div>

      {/* Reviews List */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-text">
          {t('title')} ({burger.reviews.length})
        </h2>
        {burger.reviews.length === 0 ? (
          <p className="text-text-muted">{t('noReviews')}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {burger.reviews.map((review) => (
              <div key={review.id} className="rounded-xl bg-surface p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-text">{review.author}</span>
                    <span className="text-lg text-accent">{renderStars(review.rating)}</span>
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(review.createdAt).toLocaleDateString(locale)}
                  </span>
                </div>
                <p className="text-sm text-text-muted">{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
