import { getTranslations, getLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { User, Mail, Calendar, Shield, MessageSquare, Heart, Star } from 'lucide-react';
import { ProfileEditForm } from './ProfileEditForm';

export default async function ProfilePage() {
  const t = await getTranslations('profile');
  const locale = await getLocale();
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="rounded-2xl bg-surface p-12">
          <User className="mx-auto mb-4 h-16 w-16 text-text-muted" />
          <h1 className="text-2xl font-bold text-text">{t('loginRequired')}</h1>
          <p className="mt-2 text-text-muted">{t('loginToView')}</p>
        </div>
      </div>
    );
  }

  const userId = parseInt(session.user.id, 10);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      reviews: {
        include: {
          burger: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      communityPosts: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      postLikes: {
        include: {
          post: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      _count: {
        select: {
          reviews: true,
          communityPosts: true,
          postLikes: true,
        },
      },
    },
  });

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="rounded-2xl bg-surface p-12">
          <User className="mx-auto mb-4 h-16 w-16 text-text-muted" />
          <h1 className="text-2xl font-bold text-text">{t('loginRequired')}</h1>
        </div>
      </div>
    );
  }

  const providerName = t(`providers.${user.provider}` as Parameters<typeof t>[0]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const displayBurgerName = (burger: { name: string; nameEn: string | null }) =>
    locale === 'en' && burger.nameEn ? burger.nameEn : burger.name;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-text">{t('title')}</h1>
      <p className="mb-8 text-text-muted">{t('subtitle')}</p>

      {/* Profile Card */}
      <div className="mb-8 rounded-2xl bg-surface p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || ''}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <User className="h-12 w-12 text-primary" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-text-muted" />
              <span className="text-sm text-text-muted">{t('name')}</span>
              <span className="font-medium text-text">{user.name || '-'}</span>
            </div>
            {user.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-text-muted" />
                <span className="text-sm text-text-muted">{t('email')}</span>
                <span className="font-medium text-text">{user.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-text-muted" />
              <span className="text-sm text-text-muted">{t('provider')}</span>
              <span className="font-medium text-text">{providerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-text-muted" />
              <span className="text-sm text-text-muted">{t('joinDate')}</span>
              <span className="font-medium text-text">{formatDate(user.createdAt)}</span>
            </div>
          </div>

          {/* Edit Button */}
          <ProfileEditForm user={{ id: user.id, name: user.name, image: user.image }} />
        </div>
      </div>

      {/* Activity Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-surface p-4 text-center">
          <Star className="mx-auto mb-2 h-6 w-6 text-accent" />
          <div className="text-2xl font-bold text-primary">{user._count.reviews}</div>
          <div className="text-sm text-text-muted">{t('myReviews')}</div>
        </div>
        <div className="rounded-2xl bg-surface p-4 text-center">
          <MessageSquare className="mx-auto mb-2 h-6 w-6 text-accent" />
          <div className="text-2xl font-bold text-primary">{user._count.communityPosts}</div>
          <div className="text-sm text-text-muted">{t('myPosts')}</div>
        </div>
        <div className="rounded-2xl bg-surface p-4 text-center">
          <Heart className="mx-auto mb-2 h-6 w-6 text-accent" />
          <div className="text-2xl font-bold text-primary">{user._count.postLikes}</div>
          <div className="text-sm text-text-muted">{t('myLikes')}</div>
        </div>
      </div>

      {/* Activity Tabs */}
      <div className="space-y-6">
        {/* My Reviews */}
        <div className="rounded-2xl bg-surface p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text">
            <Star className="h-5 w-5 text-accent" />
            {t('myReviews')}
          </h2>
          {user.reviews.length === 0 ? (
            <p className="text-center text-text-muted py-4">{t('noReviews')}</p>
          ) : (
            <div className="space-y-3">
              {user.reviews.map((review) => (
                <Link
                  key={review.id}
                  href={`/reviews/${review.burgerId}`}
                  className="flex items-center gap-4 rounded-xl bg-bg p-3 transition-colors hover:bg-surface-light"
                >
                  <Image
                    src={review.burger.imageUrl || '/images/default-burger.svg'}
                    alt={displayBurgerName(review.burger)}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-text truncate">
                      {displayBurgerName(review.burger)}
                    </div>
                    <div className="text-sm text-text-muted truncate">{review.content}</div>
                  </div>
                  <div className="flex items-center gap-1 text-accent">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Posts */}
        <div className="rounded-2xl bg-surface p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text">
            <MessageSquare className="h-5 w-5 text-accent" />
            {t('myPosts')}
          </h2>
          {user.communityPosts.length === 0 ? (
            <p className="text-center text-text-muted py-4">{t('noPosts')}</p>
          ) : (
            <div className="space-y-3">
              {user.communityPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/community/${post.id}`}
                  className="block rounded-xl bg-bg p-3 transition-colors hover:bg-surface-light"
                >
                  <div className="font-medium text-text">{post.title}</div>
                  <div className="mt-1 text-sm text-text-muted line-clamp-2">{post.content}</div>
                  <div className="mt-2 text-xs text-text-muted">{formatDate(post.createdAt)}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Liked Posts */}
        <div className="rounded-2xl bg-surface p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text">
            <Heart className="h-5 w-5 text-accent" />
            {t('myLikes')}
          </h2>
          {user.postLikes.length === 0 ? (
            <p className="text-center text-text-muted py-4">{t('noLikes')}</p>
          ) : (
            <div className="space-y-3">
              {user.postLikes.map((like) => (
                <Link
                  key={like.id}
                  href={`/community/${like.postId}`}
                  className="block rounded-xl bg-bg p-3 transition-colors hover:bg-surface-light"
                >
                  <div className="font-medium text-text">{like.post.title}</div>
                  <div className="mt-1 text-sm text-text-muted line-clamp-2">{like.post.content}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
