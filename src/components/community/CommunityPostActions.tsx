"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { deleteCommunityPost, updateCommunityPost } from '@/actions/community';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from '@/i18n/navigation';

type CommunityPostActionsProps = {
  postId: number;
  currentTitle: string;
  currentContent: string;
  currentImageUrl?: string | null;
};

export function CommunityPostActions({
  postId,
  currentTitle,
  currentContent,
  currentImageUrl,
}: CommunityPostActionsProps) {
  const t = useTranslations('community');
  const { user } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [content, setContent] = useState(currentContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setTitle(currentTitle);
      setContent(currentContent);
    }
  }, [currentTitle, currentContent, isEditing]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id) {
      toast.error(t('form.error'));
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('postId', String(postId));
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      formData.append('userId', user.id);

      const result = await updateCommunityPost(formData);
      if (result?.error) {
        toast.error(t('form.error'));
        return;
      }

      toast.success(t('form.success'));
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t('form.error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id) {
      toast.error(t('form.error'));
      return;
    }

    const confirmed = window.confirm(t('actions.confirmDelete'));
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append('postId', String(postId));
      formData.append('userId', user.id);
      const result = await deleteCommunityPost(formData);
      if (result?.error) {
        toast.error(t('form.error'));
        return;
      }

      toast.success(t('form.success'));
      router.push('/community');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t('form.error'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-6 border-t border-white/10 pt-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setIsEditing((current) => !current)}
          className="rounded-xl border border-primary/30 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary"
        >
          {t('actions.edit')}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-xl border border-red-400/40 px-4 py-2 text-sm font-semibold text-red-300 transition hover:border-red-400 disabled:opacity-70"
        >
          {isDeleting ? t('form.uploading') : t('actions.delete')}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="mt-4 rounded-2xl bg-surface-light p-5">
          {currentImageUrl ? (
            <div className="mb-4">
              <label className="mb-2 block text-xs font-semibold text-text-muted">{t('form.image')}</label>
              <img
                src={currentImageUrl}
                alt={currentTitle}
                className="h-36 w-full rounded-2xl object-cover"
              />
            </div>
          ) : null}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold text-text">{t('form.title')}</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl bg-surface px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isSaving}
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold text-text">{t('form.content')}</label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              className="w-full rounded-xl bg-surface px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isSaving}
              required
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-70"
            >
              {isSaving ? t('form.uploading') : t('actions.save')}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-text-muted transition hover:border-white/20"
            >
              {t('actions.cancel')}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
