"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Award, BadgeCheck, HeartHandshake, ChevronDown } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import type { RecognitionContent } from "@/types";

const categories = [
  { key: "awards", title: "Awards & Achievements", icon: Award },
  { key: "certifications", title: "Certifications", icon: BadgeCheck },
  { key: "volunteering", title: "Volunteering & Leadership", icon: HeartHandshake },
] as const;

export function Recognition({ data }: { data: RecognitionContent }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  if (!categories.some(({ key }) => data[key].length)) return null;
  return (
    <SectionWrapper id="recognition" className="section-border">
      <div className="container-section">
        <SectionHeader eyebrow="06 / Recognition" title={data.title} description={data.description} />
        <div className="recognition-categories">
          {categories.filter(({ key }) => data[key].length).map(({ key, title, icon: Icon }) => (
            <div className="recognition-category" key={key}>
              <div className="recognition-heading"><h3 className="text-subheadline"><Icon size={22} className="text-accent" aria-hidden="true" />{title}</h3><span>{String(data[key].length).padStart(2, "0")} entries</span></div>
              <div id={`recognition-${key}`} className={key === "volunteering" ? "recognition-timeline" : "recognition-grid"}>
                {data[key].map((entry, index) => (
                  <article className="recognition-entry" key={entry.id} hidden={index >= 6 && !expanded[key]}>
                    {entry.image && <div className="recognition-image"><Image src={entry.image} alt={`${entry.title} — ${entry.organisation}`} width={640} height={400} sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, calc(100vw - 4rem)" /></div>}
                    <div className="recognition-content">
                      <p className="recognition-date">{entry.date}</p>
                      <h4>{entry.title}</h4>
                      <p className="text-sm text-text-secondary">{entry.organisation}</p>
                      {entry.description && <p className="text-sm text-text-secondary whitespace-pre-line">{entry.description}</p>}
                      {entry.url && <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-link">{key === "certifications" ? "View credential" : "View details"}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> for {entry.title}</span></a>}
                    </div>
                  </article>
                ))}
              </div>
              {data[key].length > 6 && <Button type="button" variant="outline" className="mt-6" aria-expanded={Boolean(expanded[key])} aria-controls={`recognition-${key}`} onClick={() => setExpanded(value => ({ ...value, [key]: !value[key] }))}>{expanded[key] ? "Show fewer" : `Show all ${data[key].length} entries`}<ChevronDown size={16} aria-hidden="true" className={expanded[key] ? "rotate-180" : ""} /></Button>}
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
