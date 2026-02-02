'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { createBurger } from '@/actions/burgers';
import Image from 'next/image';

const categories = ['classic', 'premium', 'handmade', 'korean'] as const;

export default function NewBurgerPage() {
  const t = useTranslations('review');
  const locale = useLocale();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validateFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowed.includes(file.type)) {
      return 'invalidType';
    }

    if (file.size > maxSize) {
      return 'fileTooLarge';
    }

    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFileError(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      return;
    }

    const error = validateFile(file);
    if (error) {
      setFileError(error);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      return;
    }

    setFileError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (fileError) {
      event.preventDefault();
      return;
    }
    setIsSubmitting(true);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-text">{t('addBurger')}</h1>

      <form
        action={createBurger}
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-2xl bg-surface p-6"
      >
        <input type="hidden" name="locale" value={locale} />

        {/* Name */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-text">
              {t('form.name')} *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text placeholder-text-muted focus:border-primary focus:outline-none"
              placeholder={t('form.name')}
            />
          </div>
          <div>
            <label htmlFor="nameEn" className="mb-1 block text-sm font-medium text-text">
              {t('form.nameEn')}
            </label>
            <input
              id="nameEn"
              name="nameEn"
              type="text"
              className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text placeholder-text-muted focus:border-primary focus:outline-none"
              placeholder={t('form.nameEn')}
            />
          </div>
        </div>

        {/* Brand */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="brand" className="mb-1 block text-sm font-medium text-text">
              {t('form.brand')} *
            </label>
            <input
              id="brand"
              name="brand"
              type="text"
              required
              className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text placeholder-text-muted focus:border-primary focus:outline-none"
              placeholder={t('form.brand')}
            />
          </div>
          <div>
            <label htmlFor="brandEn" className="mb-1 block text-sm font-medium text-text">
              {t('form.brandEn')}
            </label>
            <input
              id="brandEn"
              name="brandEn"
              type="text"
              className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text placeholder-text-muted focus:border-primary focus:outline-none"
              placeholder={t('form.brandEn')}
            />
          </div>
        </div>

        {/* Description */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-text">
              {t('form.description')}
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text placeholder-text-muted focus:border-primary focus:outline-none"
              placeholder={t('form.description')}
            />
          </div>
          <div>
            <label htmlFor="descriptionEn" className="mb-1 block text-sm font-medium text-text">
              {t('form.descriptionEn')}
            </label>
            <textarea
              id="descriptionEn"
              name="descriptionEn"
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text placeholder-text-muted focus:border-primary focus:outline-none"
              placeholder={t('form.descriptionEn')}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="file" className="mb-1 block text-sm font-medium text-text">
            {t('uploadImage')}
          </label>
          <div className="rounded-xl border border-dashed border-white/20 bg-bg/50 p-4">
            <input
              id="file"
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="w-full text-sm text-text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-white file:font-semibold hover:file:bg-accent"
            />
            <p className="mt-2 text-xs text-text-muted">{t('maxSize')}</p>
            {fileError && (
              <p className="mt-2 text-xs text-red-300">{t(fileError as never)}</p>
            )}
            {previewUrl && (
              <div className="mt-3 overflow-hidden rounded-lg border border-white/10">
                <Image
                  src={previewUrl}
                  alt={t('uploadImage')}
                  width={640}
                  height={360}
                  unoptimized
                  className="h-48 w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-text">
            {t('form.category')}
          </label>
          <select
            id="category"
            name="category"
            defaultValue="classic"
            className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-text focus:border-primary focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {t(`filter.${cat}`)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !!fileError}
          className="self-start rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {t('submit')}
        </button>
      </form>
    </div>
  );
}
