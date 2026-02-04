"use client";
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useAuth } from './AuthProvider';

const providers = ['naver', 'kakao', 'google', 'github'] as const;

type ProviderId = (typeof providers)[number] | 'credentials';

type Mode = 'login' | 'register';

export function LoginModal() {
  const { isLoginOpen, setLoginOpen } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<ProviderId | null>(null);
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const t = useTranslations('auth');

  const handleSignIn = (provider: ProviderId) => {
    setLoadingProvider(provider);
    void signIn(provider);
  };

  const handleCredentials = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loadingProvider) return;

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      toast(mode === 'register' ? t('registerError') : t('loginError'));
      return;
    }

    if (mode === 'register' && password !== passwordConfirm) {
      toast(t('passwordMismatch'));
      return;
    }

    setLoadingProvider('credentials');

    try {
      if (mode === 'register') {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, password }),
        });

        if (!response.ok) {
          toast(t('registerError'));
          return;
        }

        toast(t('registerSuccess'));
      }

      const result = await signIn('credentials', { email: trimmedEmail, password, redirect: false });
      if (result?.error) {
        toast(t('loginError'));
        return;
      }

      setLoginOpen(false);
    } catch {
      toast(mode === 'register' ? t('registerError') : t('loginError'));
    } finally {
      setLoadingProvider(null);
    }
  };

  const setTab = (nextMode: Mode) => {
    if (loadingProvider) return;
    setMode(nextMode);
    setPassword('');
    setPasswordConfirm('');
  };

  return (
    <Dialog.Root open={isLoginOpen} onOpenChange={setLoginOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-surface)] rounded-xl p-6 w-[90%] max-w-md z-50 border border-white/10">
          <div className="flex items-center justify-between rounded-xl bg-white/5 p-1 mb-5">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                mode === 'login'
                  ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {t('loginTab')}
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                mode === 'register'
                  ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {t('registerTab')}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleSignIn('naver')}
              disabled={loadingProvider !== null}
              className="w-full py-2 rounded-lg bg-[#03C75A] text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loadingProvider === 'naver' ? t('loggingIn') : t('loginWithNaver')}
            </button>
            <button
              type="button"
              onClick={() => handleSignIn('kakao')}
              disabled={loadingProvider !== null}
              className="w-full py-2 rounded-lg bg-[#FEE500] text-[#191919] font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loadingProvider === 'kakao' ? t('loggingIn') : t('loginWithKakao')}
            </button>
            <button
              type="button"
              onClick={() => handleSignIn('google')}
              disabled={loadingProvider !== null}
              className="w-full py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loadingProvider === 'google' ? t('loggingIn') : t('loginWithGoogle')}
            </button>
            <button
              type="button"
              onClick={() => handleSignIn('github')}
              disabled={loadingProvider !== null}
              className="w-full py-2 rounded-lg border border-white/10 text-[var(--color-text)] font-semibold hover:bg-white/5 transition disabled:opacity-60"
            >
              {loadingProvider === 'github' ? t('loggingIn') : t('loginWithGithub')}
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            <span className="h-px flex-1 bg-white/10" />
            {t('orDivider')}
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleCredentials} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm text-[var(--color-text-muted)]">
              {t('email')}
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                placeholder={t('email')}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[var(--color-text-muted)]">
              {t('password')}
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                placeholder={t('password')}
              />
            </label>
            {mode === 'register' && (
              <label className="flex flex-col gap-1 text-sm text-[var(--color-text-muted)]">
                {t('passwordConfirm')}
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                  placeholder={t('passwordConfirm')}
                />
              </label>
            )}
            <button
              type="submit"
              disabled={loadingProvider !== null}
              className="w-full py-2 rounded-lg border border-white/10 text-[var(--color-text)] font-semibold hover:bg-white/5 transition disabled:opacity-60"
            >
              {loadingProvider === 'credentials'
                ? t('loggingIn')
                : mode === 'register'
                  ? t('register')
                  : t('loginTab')}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
