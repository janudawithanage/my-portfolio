import { ArrowUpRight, BookOpen, Compass, GraduationCap, Hammer } from "lucide-react";
import { content } from "@/data";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { hasContent } from "@/lib/has-content";
import { sectionEyebrow } from "@/lib/sections";
import type { NowContent, NowKind } from "@/types";

const kinds: Record<NowKind, { label: string; icon: typeof Hammer }> = {
  building: { label: "Building", icon: Hammer },
  learning: { label: "Learning", icon: GraduationCap },
  reading: { label: "Reading", icon: BookOpen },
  exploring: { label: "Exploring", icon: Compass },
};

export function Now({ data = content.now }: { data?: NowContent }) {
  const items = data.items.filter(item => hasContent(item.text));
  if (!items.length) return null;
  return (
    <SectionWrapper id="now" className="section-border" labelledBy="now-title">
      <div className="container-section">
        <SectionHeader eyebrow={sectionEyebrow("now")} title={data.title} titleId="now-title" description={data.description} />
        {hasContent(data.updated) && <p className="text-meta -mt-4 mb-8" data-reveal="">Updated {data.updated}</p>}
        <ul className="now-grid" data-stagger="">
          {items.map(item => {
            const kind = kinds[item.kind] ?? kinds.building;
            const Icon = kind.icon;
            return (
              <li key={item.id} className="glass now-card" data-tilt="">
                <span className="glass-icon" aria-hidden="true">{hasContent(item.emoji) ? item.emoji : <Icon size={20} strokeWidth={1.6} />}</span>
                <div className="min-w-0 space-y-1.5">
                  <p className="text-meta">{kind.label}</p>
                  {hasContent(item.url)
                    ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline font-medium text-ink hover:text-accent transition-colors">{item.text}<ArrowUpRight size={15} className="inline ml-1 align-[-2px]" aria-hidden="true" /></a>
                    : <p className="font-medium text-ink">{item.text}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </SectionWrapper>
  );
}
