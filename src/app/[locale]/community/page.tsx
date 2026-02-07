import { prisma } from '@/lib/prisma';
import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { CommunityForm } from '@/components/community/CommunityForm';
import { SearchInput } from '@/components/ui/SearchInput';
import { Heart } from 'lucide-react';

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const t = await getTranslations('community');
  const tSearch = await getTranslations('search');
  const locale = await getLocale();
  const { q } = await searchParams;
  const searchQuery = q?.trim() || '';

  const where = searchQuery
    ? {
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' as const } },
          { content: { contains: searchQuery, mode: 'insensitive' as const } },
          { author: { contains: searchQuery, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const posts = await prisma.communityPost.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { likes: true } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-text">{t('title')}</h1>
      <p className="mt-2 text-text-muted">{t('subtitle')}</p>

      <div className="mt-8">
        <CommunityForm />
      </div>

      <div className="mt-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-text">{t('recent')}</h2>
          <SearchInput 
            placeholder={tSearch('searchPosts')} 
            className="w-full sm:w-64" 
          />
        </div>
        
        {searchQuery && (
          <p className="mb-4 text-sm text-text-muted">
            {tSearch('resultsCount', { count: posts.length })}
          </p>
        )}
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
                <div className="flex items-start gap-4">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-text">{post.title}</h3>
                      <span className="text-xs text-text-muted">
                        {post.createdAt.toLocaleDateString(locale)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-text-muted line-clamp-2">{post.content}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
                      <span>{t('by', { author: post.author })}</span>
                      {post._count.likes > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post._count.likes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
