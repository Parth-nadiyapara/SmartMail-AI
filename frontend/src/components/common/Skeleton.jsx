export function Skeleton({ className = "" }) {
  return <div className={`skeleton animate-shimmer rounded-md ${className}`} />;
}

export function EmailRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-border dark:border-dark-border">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

export function DashboardStatSkeleton() {
  return (
    <div className="rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface p-5 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-14" />
    </div>
  );
}

export function CardListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-card border border-surface-border dark:border-dark-border bg-surface dark:bg-dark-surface p-4 space-y-2"
        >
          <Skeleton className="h-3.5 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}
