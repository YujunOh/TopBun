import { prisma } from '@/lib/prisma';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { CommunityCommentForm } from '@/components/community/CommunityCommentForm';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  
  const post = await prisma.communityPost.findUnique({
    where: { id: parseInt(id) },
  });

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested community post could not be found.',
    };
  }

  const excerpt = post.content.length > 160 
    ? post.content.substring(0, 157) + '...'
    : post.content;

  return {
    title: `${post.title} | TopBun Community`,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: excerpt,
    },
  };
}

export default async function CommunityPostPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations('community');
  const locale = await getLocale();

  const post = await prisma.communityPost.findUnique({
    where: { id: parseInt(id) },
    include: {
      comments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/community" className="text-sm text-accent hover:underline">
        {t('back')}
      </Link>
      <div className="mt-4 rounded-3xl bg-surface p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">{post.title}</h1>
          <span className="text-xs text-text-muted">
            {post.createdAt.toLocaleDateString(locale)}
          </span>
        </div>
        <p className="mt-2 text-sm text-text-muted">{t('by', { author: post.author })}</p>
        <div className="mt-6 whitespace-pre-wrap text-text">{post.content}</div>
      </div>

      <div className="mt-8">
        <CommunityCommentForm postId={post.id} />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-text">
          {t('comments.title', { count: post.comments.length })}
        </h2>
        {post.comments.length === 0 ? (
          <div className="rounded-2xl bg-surface p-6 text-center text-text-muted">
            {t('comments.empty')}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="rounded-2xl bg-surface p-5">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>{t('by', { author: comment.author })}</span>
                  <span>{comment.createdAt.toLocaleDateString(locale)}</span>
                </div>
                <p className="mt-3 text-sm text-text">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
