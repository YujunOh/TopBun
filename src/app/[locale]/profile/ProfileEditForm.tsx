'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Edit2, X, Check, Loader2 } from 'lucide-react';
import { updateProfile } from '@/actions/profile';
import { toast } from 'sonner';

interface ProfileEditFormProps {
  user: {
    id: number;
    name: string | null;
    image: string | null;
  };
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const t = useTranslations('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user.name || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateProfile({ name });
      if (result.success) {
        toast.success(t('updateSuccess'));
        setIsEditing(false);
      } else {
        toast.error(result.error || t('updateError'));
      }
    } catch {
      toast.error(t('updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user.name || '');
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
      >
        <Edit2 className="h-4 w-4" />
        {t('editProfile')}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-text-muted">
          {t('name')}
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-bg px-3 py-2 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder={t('name')}
          disabled={isLoading}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {t('save')}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="flex items-center gap-1 rounded-lg bg-surface-light px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-white/10"
        >
          <X className="h-4 w-4" />
          {t('cancel')}
        </button>
      </div>
    </form>
  );
}
