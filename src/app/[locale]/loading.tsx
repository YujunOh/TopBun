export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-primary)] border-t-transparent" role="status" aria-label="Loading"></div>
        <p className="text-sm text-[var(--color-text-muted)] animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
