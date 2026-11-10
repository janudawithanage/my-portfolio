import Image from "next/image";
import { ArrowUpRight, Award, BadgeCheck, HeartHandshake } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Expandable } from "@/components/ui/Expandable";
import { hasContent } from "@/lib/has-content";
import { sectionEyebrow } from "@/lib/sections";
import type { RecognitionContent, RecognitionEntry } from "@/types";

const categories = [
  { key: "awards", title: "Awards & Achievements", icon: Award, noun: "awards" },
  { key: "certifications", title: "Certifications", icon: BadgeCheck, noun: "certifications" },
  { key: "volunteering", title: "Volunteering & Leadership", icon: HeartHandshake, noun: "roles" },
] as const;

type CategoryKey = (typeof categories)[number]["key"];

function RecognitionCard({ entry, kind }: { entry: RecognitionEntry; kind: CategoryKey }) {
  return (
    <article className="glass recognition-entry" data-tilt="">
      {hasContent(entry.image) && <div className="recognition-image"><Image src={entry.image!} alt={`${entry.title} — ${entry.organisation}`} width={640} height={400} sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, calc(100vw - 4rem)" /></div>}
      <div className="recognition-content">
        <div className="recognition-top">
          {hasContent(entry.logo) && <span className="glass-icon recognition-logo"><Image src={entry.logo!} alt={`${entry.organisation} logo`} width={40} height={40} sizes="40px" /></span>}
          <p className="recognition-date">{entry.date}</p>
        </div>
        <h4>{entry.title}</h4>
        <p className="text-sm font-medium text-text-secondary">{entry.organisation}</p>
        {hasContent(entry.description) && <p className="text-sm text-text-secondary whitespace-pre-line">{entry.description}</p>}
        {hasContent(entry.url) && <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-link">{kind === "certifications" ? "View credential" : "View details"}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> for {entry.title}</span></a>}
      </div>
    </article>
  );
}

export function Recognition({ data }: { data: RecognitionContent }) {
  const visible = categories.filter(({ key }) => hasContent(data[key]));
  if (!visible.length) return null;
  return (
    <SectionWrapper id="recognition" className="section-border" labelledBy="recognition-title">
      <div className="container-section">
        <SectionHeader eyebrow={sectionEyebrow("recognition")} title={data.title} titleId="recognition-title" description={data.description} />
        <div className="recognition-categories">
          {visible.map(({ key, title, icon: Icon, noun }) => {
            const entries = data[key];
            return (
              <div className="recognition-category" key={key}>
                <div className="recognition-heading" data-reveal="">
                  <h3 className="text-subheadline"><span className="glass-icon" aria-hidden="true"><Icon size={19} strokeWidth={1.7} /></span>{title}</h3>
                  <Badge variant="gold">{String(entries.length).padStart(2, "0")} {entries.length === 1 ? "entry" : "entries"}</Badge>
                </div>
                {key === "volunteering" ? (
                  <Expandable id={`recognition-${key}`} noun={noun} className="timeline recognition-timeline" items={entries.map(entry => (
                    <div className="timeline-item" key={entry.id}>
                      <div className="timeline-node" aria-hidden="true"><span className="timeline-dot" /></div>
                      <RecognitionCard entry={entry} kind={key} />
                    </div>
                  ))} />
                ) : (
                  <Expandable id={`recognition-${key}`} noun={noun} className="recognition-grid" items={entries.map(entry => <RecognitionCard key={entry.id} entry={entry} kind={key} />)} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
