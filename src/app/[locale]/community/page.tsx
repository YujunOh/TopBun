import { prisma } from '@/lib/prisma';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { CommunityForm } from '@/components/community/CommunityForm';

export default async function CommunityPage() {
  const t = await getTranslations('community');
  const locale = await getLocale();

  const posts = await prisma.communityPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-text">{t('title')}</h1>
      <p className="mt-2 text-text-muted">{t('subtitle')}</p>

      <div className="mt-8">
        <CommunityForm />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-text">{t('recent')}</h2>
        {posts.length === 0 ? (
          <div className="rounded-2xl bg-surface p-6 text-center text-text-muted">
            {t('empty')}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="rounded-2xl bg-surface p-6 transition hover:bg-surface-light"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text">{post.title}</h3>
                  <span className="text-xs text-text-muted">
                    {post.createdAt.toLocaleDateString(locale)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-text-muted line-clamp-2">{post.content}</p>
                <p className="mt-3 text-xs text-text-muted">
                  {t('by', { author: post.author })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
