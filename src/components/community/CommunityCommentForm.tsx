"use client";

import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/auth/AuthProvider';
import { createCommunityComment } from '@/actions/community';

export function CommunityCommentForm({ postId }: { postId: number }) {
  const t = useTranslations('community');
  const tAuth = useTranslations('auth');
  const { user } = useAuth();
  const author = user?.name || tAuth('guest');

  return (
    <form action={createCommunityComment} className="rounded-2xl bg-surface p-6">
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="author" value={author} />
      <label className="mb-2 block text-sm font-semibold text-text">{t('comments.write')}</label>
      <textarea
        name="content"
        required
        rows={4}
        placeholder={t('comments.placeholder')}
        className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
      />
      <button
        type="submit"
        className="mt-4 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
      >
        {t('comments.submit')}
      </button>
    </form>
  );
}
