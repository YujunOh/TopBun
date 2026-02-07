import { RankingListSkeleton } from '@/components/ui/Skeleton';

export default function RankingsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8 space-y-4">
        <div className="h-10 w-48 bg-[var(--color-surface-light)] rounded-lg animate-pulse" />
        <div className="flex gap-4">
          <div className="h-10 flex-1 max-w-md bg-[var(--color-surface-light)] rounded-lg animate-pulse" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-20 bg-[var(--color-surface-light)] rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      
      {/* Ranking list skeleton */}
      <RankingListSkeleton count={10} />
    </div>
  );
}
