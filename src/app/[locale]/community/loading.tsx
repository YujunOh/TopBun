import { PostListSkeleton } from '@/components/ui/Skeleton';

export default function CommunityLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8 space-y-4">
        <div className="h-10 w-48 bg-[var(--color-surface-light)] rounded-lg animate-pulse" />
        <div className="h-10 w-full max-w-md bg-[var(--color-surface-light)] rounded-lg animate-pulse" />
      </div>
      
      {/* Post form skeleton */}
      <div className="mb-8 p-6 bg-[var(--color-surface)] rounded-2xl space-y-4">
        <div className="h-10 w-full bg-[var(--color-surface-light)] rounded-lg animate-pulse" />
        <div className="h-24 w-full bg-[var(--color-surface-light)] rounded-lg animate-pulse" />
        <div className="h-10 w-24 bg-[var(--color-surface-light)] rounded-lg animate-pulse" />
      </div>
      
      {/* Post list skeleton */}
      <PostListSkeleton count={5} />
    </div>
  );
}
