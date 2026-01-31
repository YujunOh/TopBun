"use client";
import { useLocale } from 'next-intl';
import { usePathname, Link } from '@/i18n/navigation';
import { Globe } from 'lucide-react';

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const nextLocale = locale === 'ko' ? 'en' : 'ko';

  return (
    <Link
      href={pathname}
      locale={nextLocale}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition"
    >
      <Globe size={16} />
      {nextLocale.toUpperCase()}
    </Link>
  );
}
