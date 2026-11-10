import Image from "next/image";
import { GraduationCap, MapPin } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { content, educationData } from "@/data";
import { hasContent } from "@/lib/has-content";
import { sectionEyebrow } from "@/lib/sections";

export function Education() {
  if (!hasContent(educationData)) return null;
  return (
    <SectionWrapper id="education" className="section-border" labelledBy="education-title">
      <div className="container-section">
        <SectionHeader eyebrow={sectionEyebrow("education")} title={content.education.title} titleId="education-title" description={content.education.description} />
        <ol className="timeline" data-stagger="">
          {educationData.map(edu => {
            const current = edu.endDate === "Present";
            return (
              <li key={edu.id} className="timeline-item">
                <div className="timeline-node" aria-hidden="true">
                  {edu.logo
                    ? <span className="glass-icon timeline-logo"><Image src={edu.logo} alt="" width={48} height={48} sizes="48px" /></span>
                    : <span className="glass-icon"><GraduationCap size={20} strokeWidth={1.6} /></span>}
                </div>
                <article className="glass timeline-card" data-tilt="">
                  <div className="timeline-card-top">
                    <p className="text-meta">{edu.startDate} — {edu.endDate}</p>
                    <Badge variant={current ? "accent" : "default"}>{current ? "Currently studying" : "Completed"}</Badge>
                  </div>
                  <h3 className="text-subheadline">{edu.institution}</h3>
                  <p className="text-accent text-sm font-semibold mt-1.5">{edu.degree === "G.C.E. A/L" ? edu.degree + " " + edu.field + " (" + edu.endDate + ")" : edu.degree + " in " + edu.field}</p>
                  {hasContent(edu.location) && <p className="flex items-center gap-1.5 text-sm text-text-muted mt-2"><MapPin size={13} aria-hidden="true" />{edu.location}</p>}
                  {hasContent(edu.description) && <p className="text-text-secondary mt-4">{edu.description}</p>}
                  {(hasContent(edu.result) || hasContent(edu.gpa)) && (
                    <div className="flex flex-wrap gap-3 mt-5">
                      {hasContent(edu.result) && <p className="result-chip"><span className="text-xs font-semibold uppercase tracking-[.12em]">Result</span><strong>{edu.result}</strong></p>}
                      {hasContent(edu.gpa) && <p className="result-chip"><span className="text-xs font-semibold uppercase tracking-[.12em]">GPA</span><strong>{edu.gpa}</strong></p>}
                    </div>
                  )}
                  {hasContent(edu.highlights) && <ul className="arrow-list text-sm mt-5">{edu.highlights.map(h => <li key={h}><span>{h}</span></li>)}</ul>}
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </SectionWrapper>
  );
}
