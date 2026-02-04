"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { createCommunityPost } from '@/actions/community';
import { uploadImage } from '@/actions/upload';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from '@/i18n/navigation';

export function CommunityForm() {
  const t = useTranslations('community');
  const tAuth = useTranslations('auth');
  const { user } = useAuth();
  const router = useRouter();
  const author = user?.name || tAuth('guest');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error(t('form.error'));
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        const uploadResult = await uploadImage(uploadFormData);
        if (uploadResult.error) {
          toast.error(t('form.error'));
          return;
        }
        imageUrl = uploadResult.url;
      }

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      formData.append('author', author);
      if (imageUrl) formData.append('imageUrl', imageUrl);
      if (user?.id) formData.append('userId', user.id);

      const result = await createCommunityPost(formData);
      if (result?.error) {
        toast.error(t('form.error'));
        return;
      }

      toast.success(t('form.success'));
      setTitle('');
      setContent('');
      setImageFile(null);
      setImagePreview(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t('form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-surface p-6">
      <input type="hidden" name="author" value={author} />
      <div className="mb-4">
        <label className="mb-1 block text-sm font-semibold text-text">{t('form.title')}</label>
        <input
          name="title"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
          placeholder={t('form.titlePlaceholder')}
          disabled={isSubmitting}
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm font-semibold text-text">{t('form.content')}</label>
        <textarea
          name="content"
          required
          rows={5}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="w-full rounded-xl bg-surface-light px-4 py-3 text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/50"
          placeholder={t('form.contentPlaceholder')}
          disabled={isSubmitting}
        />
      </div>
      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-text">{t('form.image')}</label>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-text-muted/40 bg-surface-light px-4 py-6 text-sm text-text-muted transition hover:border-primary/60">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImageChange}
            disabled={isSubmitting}
          />
          <span>{imageFile ? imageFile.name : t('form.image')}</span>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt={t('form.image')}
              className="h-32 w-full rounded-2xl object-cover"
            />
          ) : null}
        </label>
      </div>
      <button
        type="submit"
        className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? t('form.uploading') : t('form.submit')}
      </button>
    </form>
  );
}
