'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { togglePostLike } from '@/actions/community';
import { toast } from 'sonner';

interface LikeButtonProps {
  postId: number;
  initialLikeCount: number;
  initialIsLiked: boolean;
  isLoggedIn: boolean;
}

export function LikeButton({
  postId,
  initialLikeCount,
  initialIsLiked,
  isLoggedIn,
}: LikeButtonProps) {
  const t = useTranslations('community');
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!isLoggedIn) {
      toast(t('loginToLike'));
      return;
    }

    startTransition(async () => {
      const result = await togglePostLike(postId);
      if (result.success) {
        setIsLiked(result.liked ?? !isLiked);
        setLikeCount((prev) => (result.liked ? prev + 1 : prev - 1));
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${
        isLiked
          ? 'bg-red-500/20 text-red-400'
          : 'bg-surface-light text-text-muted hover:bg-surface-light/80'
      } disabled:cursor-not-allowed disabled:opacity-50`}
      aria-label={t('like')}
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      <span>{likeCount}</span>
    </button>
  );
}
