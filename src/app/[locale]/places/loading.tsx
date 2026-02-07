import { Skeleton } from '@/components/ui/Skeleton';

export default function PlacesLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Place Form Skeleton */}
      <div className="rounded-2xl bg-surface p-6 mb-8">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Registered Places Header */}
      <div className="mb-4">
        <Skeleton className="h-7 w-64" />
      </div>

      {/* Place Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-surface overflow-hidden">
            {/* Photo Gallery */}
            <div className="grid h-40 grid-cols-2 gap-0.5">
              <Skeleton className="h-full w-full" />
              <Skeleton className="h-full w-full" />
              <Skeleton className="h-full w-full" />
              <Skeleton className="h-full w-full" />
            </div>
            
            <div className="p-4">
              {/* Brand */}
              <Skeleton className="h-3 w-20 mb-1" />
              
              {/* Name */}
              <Skeleton className="h-6 w-full mb-2" />
              
              {/* Address */}
              <div className="flex items-start gap-2 mb-2">
                <Skeleton className="h-4 w-4 mt-0.5" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              
              {/* Phone */}
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
              
              {/* Stats */}
              <div className="flex gap-4 mb-3">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-16" />
              </div>
              
              {/* Map Links */}
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
