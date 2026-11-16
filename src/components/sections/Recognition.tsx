import Image from "next/image";
import { ArrowUpRight, Award, BadgeCheck, HeartHandshake, Maximize2, type LucideIcon } from "lucide-react";
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

/**
 * `framed`: at least half the category has images, so cards without one get a matching frame
 * (their logo, or the category icon) and every card in the grid lines up. Otherwise an image
 * sits beside the text, keeping the card as compact as its neighbours.
 */
function RecognitionCard({ entry, kind, framed, icon: Icon }: { entry: RecognitionEntry; kind: CategoryKey; framed: boolean; icon: LucideIcon }) {
  const placeholder = framed && !hasContent(entry.image);
  const inline = !framed && hasContent(entry.image);
  return (
    <article className={inline ? "glass recognition-entry recognition-inline" : "glass recognition-entry"} data-tilt="">
      {placeholder && (
        <div className="recognition-image recognition-placeholder" aria-hidden="true">
          {hasContent(entry.logo)
            ? <span className="recognition-placeholder-logo"><Image src={entry.logo!} alt="" width={96} height={96} sizes="96px" /></span>
            : <span className="glass-icon"><Icon size={28} strokeWidth={1.5} /></span>}
        </div>
      )}
      {hasContent(entry.image) && (
        <a href={entry.image} target="_blank" rel="noopener noreferrer" className="recognition-image" aria-label={`Open the full image for ${entry.title} in a new tab`}>
          {/* A blurred copy fills the frame behind the whole, uncropped image. */}
          <span className="recognition-backdrop" aria-hidden="true"><Image src={entry.image!} alt="" fill sizes="64px" /></span>
          <Image src={entry.image!} alt={`${entry.title} — ${entry.organisation}`} fill sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, calc(100vw - 3rem)" className="recognition-photo" />
          <span className="recognition-zoom" aria-hidden="true"><Maximize2 size={14} />View full size</span>
        </a>
      )}
      <div className="recognition-content">
        <div className="recognition-top">
          {!placeholder && (hasContent(entry.logo)
            ? <span className="glass-icon recognition-logo"><Image src={entry.logo!} alt={`${entry.organisation} logo`} width={40} height={40} sizes="40px" /></span>
            : <span className="glass-icon recognition-logo" aria-hidden="true"><Icon size={17} strokeWidth={1.7} /></span>)}
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
                <Expandable id={`recognition-${key}`} noun={noun} className="auto-grid md-2 lg-3" items={entries.map(entry => <RecognitionCard key={entry.id} entry={entry} kind={key} icon={Icon} framed={entries.filter(item => hasContent(item.image)).length * 2 >= entries.length} />)} />
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
