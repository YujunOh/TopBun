"use client";
import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useAuth } from './AuthProvider';
import { useTranslations } from 'next-intl';

export function LoginModal() {
  const { userName, setUserName } = useAuth();
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const t = useTranslations('auth');

  useEffect(() => {
    if (userName === null) {
      const timer = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [userName]);

  const handleSubmit = () => {
    if (input.trim()) {
      setUserName(input.trim());
      setOpen(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-surface)] rounded-xl p-6 w-[90%] max-w-md z-50 border border-white/10">
          <Dialog.Title className="text-xl font-bold text-[var(--color-text)] mb-2">
            {t('welcome')}
          </Dialog.Title>
          <Dialog.Description className="text-[var(--color-text-muted)] mb-4">
            {t('enterName')}
          </Dialog.Description>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={t('name')}
            className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg)] border border-white/10 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] mb-4"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            className="w-full py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition"
          >
            {t('confirm')}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
