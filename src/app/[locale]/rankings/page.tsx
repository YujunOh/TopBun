import { getTranslations, getLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Trophy } from 'lucide-react';

export default async function RankingsPage() {
  const t = await getTranslations('ranking');
  const locale = await getLocale();

  const burgers = await prisma.burger.findMany({
    orderBy: { eloRating: 'desc' },
  });

  const displayName = (burger: { name: string; nameEn: string | null }) =>
    locale === 'en' && burger.nameEn ? burger.nameEn : burger.name;

  const displayBrand = (burger: { brand: string; brandEn: string | null }) =>
    locale === 'en' && burger.brandEn ? burger.brandEn : burger.brand;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-text">{t('title')}</h1>

      <div className="overflow-x-auto rounded-2xl bg-surface">
        <table data-testid="ranking-table" className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-sm text-text-muted">
              <th className="px-6 py-4 font-semibold">{t('rank')}</th>
              <th className="px-6 py-4 font-semibold">{t('burger')}</th>
              <th className="px-6 py-4 font-semibold">{t('brand')}</th>
              <th className="px-6 py-4 font-semibold text-right">{t('elo')}</th>
              <th className="px-6 py-4 font-semibold text-right">{t('matches')}</th>
              <th className="px-6 py-4 font-semibold text-right">{t('change')}</th>
            </tr>
          </thead>
          <tbody>
            {burgers.map((burger, index) => {
              const rank = index + 1;
              const delta = burger.lastEloDelta;
              const isTop3 = rank <= 3;

              return (
                <tr
                  key={burger.id}
                  className={`border-b border-white/5 transition-colors hover:bg-surface-light ${
                    isTop3 ? 'bg-surface-light/50' : ''
                  }`}
                >
                  <td className="px-6 py-4 font-bold text-text">
                    {isTop3 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                        <Trophy size={14} />
                        {rank}
                      </span>
                    ) : (
                      rank
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-text">
                    {displayName(burger)}
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {displayBrand(burger)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-primary">
                    {Math.round(burger.eloRating)}
                  </td>
                  <td className="px-6 py-4 text-right text-text-muted">
                    {burger.matchCount}
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    {delta > 0 ? (
                      <span className="text-green-400">▲ {Math.round(delta)}</span>
                    ) : delta < 0 ? (
                      <span className="text-red-400">▼ {Math.abs(Math.round(delta))}</span>
                    ) : (
                      <span className="text-text-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
