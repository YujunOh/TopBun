import { Skeleton } from '@/components/ui/Skeleton';

export default function DealsLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Deal Form Skeleton */}
      <div className="rounded-2xl bg-surface p-6 mb-8">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Active Deals Header */}
      <div className="mb-4">
        <Skeleton className="h-7 w-64" />
      </div>

      {/* Deal Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-surface overflow-hidden">
            {/* Image */}
            <Skeleton className="h-40 w-full" />
            
            <div className="p-4">
              {/* Brand */}
              <Skeleton className="h-3 w-20 mb-2" />
              
              {/* Title */}
              <Skeleton className="h-6 w-full mb-2" />
              
              {/* Description */}
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              
              {/* Price */}
              <div className="flex items-baseline gap-2 mb-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              
              {/* Meta info */}
              <div className="flex gap-3">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
