import { ArrowUpRight, Trophy } from "lucide-react";
import { content } from "@/data";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Expandable } from "@/components/ui/Expandable";
import { hasContent } from "@/lib/has-content";
import { sectionEyebrow } from "@/lib/sections";
import type { SecurityContent } from "@/types";

export function Security({ data = content.security }: { data?: SecurityContent }) {
  if (!hasContent(data.entries)) return null;
  return (
    <SectionWrapper id="security" className="section-border" labelledBy="security-title">
      <div className="container-section">
        <SectionHeader eyebrow={sectionEyebrow("security")} title={data.title} titleId="security-title" description={data.description} />
        <Expandable id="security-list" noun="events" className="list-grid" items={data.entries.map(entry => (
          <article key={entry.id} className="glass row-card" data-tilt="">
            <div className="min-w-0 space-y-2.5">
              <p className="text-meta">{entry.date}</p>
              <h3 className="text-subheadline">{entry.title}</h3>
              {hasContent(entry.description) && <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{entry.description}</p>}
              {hasContent(entry.tags) && <ul className="flex flex-wrap gap-2 pt-1" aria-label={entry.title + " topics"}>{entry.tags.map(tag => <li key={tag}><span className="chip chip-plain">{tag}</span></li>)}</ul>}
            </div>
            {(hasContent(entry.result) || hasContent(entry.url)) && (
              <div className="row-card-aside">
                {hasContent(entry.result) && <p className="result-chip !py-1.5 !px-3.5 text-sm font-semibold"><Trophy size={15} className="self-center" aria-hidden="true" /><span className="sr-only">Result: </span>{entry.result}</p>}
                {hasContent(entry.url) && <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-link">Read write-up<span className="sr-only"> for {entry.title}</span><ArrowUpRight size={15} aria-hidden="true" /></a>}
              </div>
            )}
          </article>
        ))} />
      </div>
    </SectionWrapper>
  );
}
