"use client";

import { useTranslations } from 'next-intl';
import { createCommunityPost } from '@/actions/community';
import { useAuth } from '@/components/auth/AuthProvider';

export function CommunityForm() {
  const t = useTranslations('community');
  const tAuth = useTranslations('auth');
  const { user } = useAuth();
  const author = user?.name || tAuth('guest');

  return (
    <form action={createCommunityPost} className="rounded-2xl bg-surface p-6">
      <input type="hidden" name="author" value={author} />
      <div className="mb-4">
        <label className="mb-1 block text-sm font-semibold text-text">{t('form.title')}</label>
        <input
          name="title"
          required
          className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
          placeholder={t('form.titlePlaceholder')}
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm font-semibold text-text">{t('form.content')}</label>
        <textarea
          name="content"
          required
          rows={5}
          className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
          placeholder={t('form.contentPlaceholder')}
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
      >
        {t('form.submit')}
      </button>
    </form>
  );
}
