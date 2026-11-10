import { ArrowUpRight, FileText, Mic, Presentation, Wrench } from "lucide-react";
import { content } from "@/data";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Expandable } from "@/components/ui/Expandable";
import { hasContent } from "@/lib/has-content";
import { sectionEyebrow } from "@/lib/sections";
import type { TalksContent, TalkType } from "@/types";

const types: Record<TalkType, { label: string; icon: typeof Mic }> = {
  talk: { label: "Talk", icon: Mic },
  paper: { label: "Paper", icon: FileText },
  poster: { label: "Poster", icon: Presentation },
  workshop: { label: "Workshop", icon: Wrench },
};

export function Talks({ data = content.talks }: { data?: TalksContent }) {
  if (!hasContent(data.entries)) return null;
  return (
    <SectionWrapper id="talks" className="section-border" labelledBy="talks-title">
      <div className="container-section">
        <SectionHeader eyebrow={sectionEyebrow("talks")} title={data.title} titleId="talks-title" description={data.description} />
        <Expandable id="talks-list" noun="talks and publications" className="list-grid list-grid-2" items={data.entries.map(entry => {
          const type = types[entry.type] ?? types.talk;
          const Icon = type.icon;
          return (
            <article key={entry.id} className="glass row-card" data-tilt="">
              <div className="flex gap-4 min-w-0">
                <span className="glass-icon" aria-hidden="true"><Icon size={19} strokeWidth={1.7} /></span>
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5"><Badge variant="accent">{type.label}</Badge><span className="text-meta">{entry.date}</span></div>
                  <h3 className="text-subheadline">{entry.title}</h3>
                  <p className="text-sm font-medium text-text-secondary">{entry.venue}</p>
                  {hasContent(entry.description) && <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{entry.description}</p>}
                  {hasContent(entry.url) && <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-link">View {type.label.toLowerCase()}<span className="sr-only"> — {entry.title}</span><ArrowUpRight size={15} aria-hidden="true" /></a>}
                </div>
              </div>
            </article>
          );
        })} />
      </div>
    </SectionWrapper>
  );
}
