import { cn } from "@/lib/utils";

// ─── Single skeleton card ──────────────────────────────────────────────────────

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <div
      className="card flex flex-col p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Title row */}
      <div className="h-4 skeleton rounded w-3/5 mb-3" />

      {/* Description */}
      <div className="space-y-1.5 mb-4 flex-1">
        <div className="h-3 skeleton rounded w-full" />
        <div className="h-3 skeleton rounded w-4/5" />
      </div>

      {/* Topic chips */}
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-14 skeleton rounded-full" />
        <div className="h-5 w-10 skeleton rounded-full" />
        <div className="h-5 w-16 skeleton rounded-full" />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <div className="h-3 w-16 skeleton rounded" />
        <div className="h-3 w-8  skeleton rounded" />
        <div className="h-3 w-8  skeleton rounded" />
        <div className="h-3 w-14 skeleton rounded ml-auto" />
      </div>
    </div>
  );
}

// ─── Skeleton grid (public export — used as Suspense fallback) ─────────────────

interface GithubProjectsSkeletonProps {
  /** Number of placeholder cards. Defaults to 6 (two full rows on desktop). */
  count?: number;
  className?: string;
}

export function GithubProjectsSkeleton({
  count = 6,
  className,
}: GithubProjectsSkeletonProps) {
  return (
    <div className={cn("max-w-6xl mx-auto section-padding px-4 sm:px-6 lg:px-8", className)}>
      {/* ── Section header skeleton ── */}
      <div className="mb-16 text-center space-y-4">
        {/* Eyebrow */}
        <div className="h-3 w-16 skeleton rounded-full mx-auto" />
        {/* Title */}
        <div className="h-9 w-72 skeleton rounded mx-auto" />
        {/* Description */}
        <div className="space-y-2 max-w-md mx-auto">
          <div className="h-4 skeleton rounded w-full" />
          <div className="h-4 skeleton rounded w-3/4 mx-auto" />
        </div>
      </div>

      {/* ── Sync indicator row skeleton ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8 px-1">
        <div className="h-3 w-40 skeleton rounded" />
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full skeleton" />
          <div className="h-3 w-36 skeleton rounded" />
          <div className="h-3 w-28 skeleton rounded hidden sm:block" />
        </div>
      </div>

      {/* ── Card grid skeleton ── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
        aria-busy="true"
        aria-label="Loading GitHub repositories…"
      >
        {Array.from({ length: count }, (_, i) => (
          <SkeletonCard key={i} delay={i * 65} />
        ))}
      </div>

      {/* ── CTA button skeleton ── */}
      <div className="flex justify-center">
        <div className="h-11 w-48 skeleton rounded-xl" />
      </div>
    </div>
  );
}

