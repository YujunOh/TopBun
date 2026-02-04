import { getTranslations, getLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, Trophy, Flame, BarChart3, Layers, Globe } from 'lucide-react';

export default async function Home() {
  const t = await getTranslations('common');
  const tHome = await getTranslations('home');
  const locale = await getLocale();

  const burgerCount = await prisma.burger.count();
  const reviewCount = await prisma.review.count();
  const matchAgg = await prisma.burger.aggregate({ _sum: { matchCount: true } });
  const matchCount = Math.floor((matchAgg._sum.matchCount ?? 0) / 2);

  const features = [
    { key: 'review', icon: MessageSquare, href: '/reviews' },
    { key: 'ranking', icon: Trophy, href: '/rankings' },
    { key: 'worldcup', icon: Flame, href: '/worldcup' },
    { key: 'tierlist', icon: BarChart3, href: '/tierlist' },
    { key: 'builder', icon: Layers, href: '/builder' },
    { key: 'i18n', icon: Globe, href: locale === 'ko' ? '/en' : '/ko' },
  ] as const;

  return (
    <div data-testid="landing-page" className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center md:py-32">
        <div className="flex items-center justify-center gap-4">
          <Image
            src="/brand/topbun-mark.svg"
            alt="TopBun"
            width={56}
            height={56}
            className="h-14 w-14"
          />
          <h1 className="text-5xl font-extrabold tracking-tight text-primary md:text-7xl">
            {t('title')}
          </h1>
        </div>
        <p className="max-w-2xl text-xl text-text-muted md:text-2xl">
          {tHome('heroSubtitle')}
        </p>
        <Link
          href="/reviews"
          data-testid="hero-cta"
          className="mt-4 inline-block rounded-full bg-primary px-8 py-3 text-lg font-semibold text-white transition-transform hover:scale-105 hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Get started with burger reviews"
        >
          {tHome('cta')}
        </Link>
      </section>

      {/* Stats Section */}
      <section
        data-testid="stats-section"
        className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-4 py-12 sm:grid-cols-3"
      >
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface p-8">
          <span className="text-4xl font-bold text-primary">{burgerCount}</span>
          <span className="text-text-muted">{tHome('stats.burgers')}</span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface p-8">
          <span className="text-4xl font-bold text-accent">{reviewCount}</span>
          <span className="text-text-muted">{tHome('stats.reviews')}</span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface p-8">
          <span className="text-4xl font-bold text-primary">{matchCount}</span>
          <span className="text-text-muted">{tHome('stats.matches')}</span>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ key, icon: Icon, href }) => (
            <Link
              key={key}
              href={href}
              className="rounded-2xl bg-surface p-6 transition-transform hover:scale-[1.02] hover:bg-surface-light"
            >
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-text">
                {tHome(`features.${key}`)}
              </h3>
              <p className="mt-1 text-sm text-text-muted">
                {tHome(`features.${key}Desc`)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
