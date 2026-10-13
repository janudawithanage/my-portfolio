import { cn } from "@/lib/utils";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";

interface GithubProjectsSkeletonProps { count?: number; className?: string; }

export function GithubProjectsSkeleton({ count = 6, className }: GithubProjectsSkeletonProps) {
  return (
    <SectionWrapper id="github" className={cn("section-border bg-bg-secondary", className)}>
      <div className="container-section" aria-busy="true" aria-label="Loading GitHub repositories">
        <SectionHeader eyebrow="06 / Open source & experiments" title="There’s more in the repositories." description="Coursework, side projects, and experiments. A look at what I’m exploring and building beyond the selected work." />
        <div className="h-5 w-48 max-w-full skeleton rounded mb-5" aria-hidden="true" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-hidden="true">
          {Array.from({ length: count }, (_, index) => <div key={index} className="card p-6 min-h-64 space-y-5"><div className="size-5 skeleton rounded" /><div className="h-5 w-4/5 skeleton rounded" /><div className="space-y-2"><div className="h-4 skeleton rounded" /><div className="h-4 w-4/5 skeleton rounded" /><div className="h-4 w-3/5 skeleton rounded" /></div><div className="h-4 w-3/4 skeleton rounded mt-6" /></div>)}
        </div>
      </div>
    </SectionWrapper>
  );
}
