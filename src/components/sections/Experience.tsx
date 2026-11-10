import { ChevronDown, MapPin } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { content, experienceData } from "@/data";
import { hasContent } from "@/lib/has-content";
import { sectionEyebrow } from "@/lib/sections";

const labels: Record<string, string> = { "full-time": "Full-time", "part-time": "Part-time", internship: "Internship", contract: "Contract", freelance: "Freelance", university: "University project", personal: "Personal project" };

export function Experience() {
  if (!hasContent(experienceData)) return null;
  return (
    <SectionWrapper id="experience" className="section-border" labelledBy="experience-title">
      <div className="container-section">
        <SectionHeader eyebrow={sectionEyebrow("experience")} title={content.experience.title} titleId="experience-title" description={content.experience.description} />
        <ol className="timeline" data-stagger="">
          {experienceData.map(exp => (
            <li key={exp.id} className="timeline-item">
              <div className="timeline-node" aria-hidden="true"><span className="timeline-dot" /></div>
              <article className="glass timeline-card" data-tilt="">
                <div className="timeline-card-top">
                  <p className="text-meta">{exp.startDate} — {exp.endDate}</p>
                  <Badge>{labels[exp.type] ?? exp.type}</Badge>
                </div>
                <h3 className="text-subheadline">{exp.role}</h3>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="font-semibold text-ink">{exp.company}</span>
                  {hasContent(exp.location) && <span className="flex items-center gap-1.5 text-text-muted"><MapPin size={13} aria-hidden="true" />{exp.location}</span>}
                </p>
                {hasContent(exp.description) && <p className="text-text-secondary mt-4">{exp.description}</p>}
                {hasContent(exp.tech) && <ul className="flex flex-wrap gap-2 mt-5" aria-label={exp.role + " technologies"}>{exp.tech.map(t => <li key={t}><span className="chip chip-plain">{t}</span></li>)}</ul>}
                {hasContent(exp.highlights) && (
                  <details className="journey-details">
                    <summary>Highlights<ChevronDown size={15} aria-hidden="true" /></summary>
                    <ul className="arrow-list mt-2">{exp.highlights.map(h => <li key={h}><span>{h}</span></li>)}</ul>
                  </details>
                )}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </SectionWrapper>
  );
}
