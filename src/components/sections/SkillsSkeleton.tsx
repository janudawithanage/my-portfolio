import { cn } from "@/lib/utils";

// ─── Category button skeleton ─────────────────────────────────────────────────

function SkeletonCategoryBtn({ active = false }: { active?: boolean }) {
  return (
    <div
      className={cn(
        "w-full p-5 rounded-xl border",
        active ? "border-accent/20 bg-surface-raised" : "border-border bg-surface"
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg skeleton" />
        <div className="h-4 w-20 skeleton rounded" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 skeleton rounded w-full" />
        <div className="h-3 skeleton rounded w-3/4" />
      </div>
    </div>
  );
}

// ─── Skill bar skeleton ───────────────────────────────────────────────────────

function SkeletonSkillBar({ width }: { width: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="h-3.5 skeleton rounded" style={{ width }} />
        <div className="h-3 w-8 skeleton rounded" />
      </div>
      <div className="h-0.75 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full skeleton rounded-full" style={{ width }} />
      </div>
    </div>
  );
}

// ─── Full section skeleton (public export) ────────────────────────────────────

export function SkillsSkeleton({ className }: { className?: string }) {
  const barWidths = ["55%", "72%", "80%", "65%", "48%", "58%"];

  return (
    <div
      className={cn(
        "section-padding px-4 sm:px-6 lg:px-8",
        className
      )}
      aria-busy="true"
      aria-label="Loading skills…"
    >
      {/* ── Section header ── */}
      <div className="max-w-6xl mx-auto mb-16 text-center space-y-4">
        <div className="h-3 w-12 skeleton rounded-full mx-auto" />
        <div className="h-9 w-64 skeleton rounded mx-auto" />
        <div className="space-y-2 max-w-lg mx-auto">
          <div className="h-4 skeleton rounded w-full" />
          <div className="h-4 skeleton rounded w-4/5 mx-auto" />
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Category buttons */}
        <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-3">
          <SkeletonCategoryBtn active />
          <SkeletonCategoryBtn />
          <SkeletonCategoryBtn />
          <SkeletonCategoryBtn />
        </div>

        {/* Skill bars panel */}
        <div className="lg:col-span-3 card-elevated p-6 space-y-5">
          {/* Panel header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg skeleton" />
            <div className="space-y-1.5">
              <div className="h-4 w-28 skeleton rounded" />
              <div className="h-3 w-44 skeleton rounded" />
            </div>
          </div>

          {/* Skill bars */}
          <div className="space-y-4">
            {barWidths.map((w, i) => (
              <SkeletonSkillBar key={i} width={w} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
