'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/auth/AuthProvider';
import { createReview } from '@/actions/burgers';

export function ReviewForm({ burgerId, locale }: { burgerId: number; locale: string }) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const t = useTranslations('review');
  const { userName } = useAuth();

  return (
    <form action={createReview} className="flex flex-col gap-4">
      <input type="hidden" name="burgerId" value={burgerId} />
      <input type="hidden" name="author" value={userName || '게스트'} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="rating" value={rating} />

      {/* Star Rating */}
      <div>
        <label className="mb-1 block text-sm font-medium text-text">{t('rating')}</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="text-3xl transition-colors"
              style={{
                color:
                  star <= (hoveredStar || rating)
                    ? 'var(--color-accent)'
                    : 'var(--color-text-muted)',
              }}
            >
              {star <= (hoveredStar || rating) ? '\u2605' : '\u2606'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-medium text-text">
          {t('form.content')}
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          required
          className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text placeholder-text-muted focus:border-primary focus:outline-none"
          placeholder={t('form.content')}
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0}
        className="self-start rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t('submit')}
      </button>
    </form>
  );
}
