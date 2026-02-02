"use client";
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useAuth } from './AuthProvider';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';

export function LoginModal() {
  const { isLoginOpen, setLoginOpen } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const t = useTranslations('auth');

  const handleSignIn = (provider: 'google' | 'github') => {
    setLoadingProvider(provider);
    void signIn(provider);
  };

  return (
    <Dialog.Root open={isLoginOpen} onOpenChange={setLoginOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-surface)] rounded-xl p-6 w-[90%] max-w-md z-50 border border-white/10">
          <Dialog.Title className="text-xl font-bold text-[var(--color-text)] mb-2">
            {t('welcome')}
          </Dialog.Title>
          <Dialog.Description className="text-[var(--color-text-muted)] mb-4">
            {t('loginDescription')}
          </Dialog.Description>
          <div className="flex flex-col gap-3">
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
