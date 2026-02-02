import { prisma } from '@/lib/prisma';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';

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
    </div>
  );
}
