"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { LocaleSwitcher } from './LocaleSwitcher';
import Image from 'next/image';

const navItems = [
  { key: 'reviews', href: '/reviews' },
  { key: 'rankings', href: '/rankings' },
  { key: 'community', href: '/community' },
  { key: 'worldcup', href: '/worldcup' },
  { key: 'tierlist', href: '/tierlist' },
  { key: 'builder', href: '/builder' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const { user, status, openLogin, logout } = useAuth();
  const displayName = user?.name ?? tAuth('guest');

  return (
    <nav data-testid="main-nav" className="bg-[var(--color-surface)] border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[var(--color-primary)] hover:opacity-90 transition">
          <Image
            src="/brand/topbun-mark.svg"
            alt="TopBun"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          TopBun
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              data-testid={`nav-${item.key}`}
              className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition"
            >
              {t(item.key)}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <LocaleSwitcher />
          <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--color-text-muted)]">
            {user?.image ? (
              <Image
                src={user.image}
                alt={displayName}
                width={20}
                height={20}
                className="h-5 w-5 rounded-full"
              />
            ) : (
              <User size={16} />
            )}
            <span>{displayName}</span>
            {status === 'authenticated' ? (
              <button onClick={logout} className="ml-1 text-xs text-[var(--color-accent)] hover:underline">
                {tAuth('logout')}
              </button>
            ) : (
              <button onClick={openLogin} className="ml-1 text-xs text-[var(--color-accent)] hover:underline">
                {tAuth('login')}
              </button>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[var(--color-text)]"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-[var(--color-surface)] pb-4">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              data-testid={`nav-${item.key}`}
              onClick={() => setMobileOpen(false)}
              className="block px-6 py-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5"
            >
              {t(item.key)}
            </Link>
          ))}
            <div className="px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={displayName}
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full"
                  />
                ) : (
                  <User size={16} />
                )}
                <span>{displayName}</span>
              </div>
              {status === 'authenticated' ? (
                <button onClick={logout} className="text-xs text-[var(--color-accent)] hover:underline">
                  {tAuth('logout')}
                </button>
              ) : (
                <button onClick={openLogin} className="text-xs text-[var(--color-accent)] hover:underline">
                  {tAuth('login')}
                </button>
              )}
              <LocaleSwitcher />
            </div>
          </div>
        )}
    </nav>
  );
}
