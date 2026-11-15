import Image from "next/image";
import { GraduationCap, MapPin } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { content, educationData } from "@/data";
import { hasContent } from "@/lib/has-content";
import { sectionEyebrow } from "@/lib/sections";

/** "3.2 / 4.0" with a thin bar when the scale is known. */
function GpaScore({ gpa, scale, current }: { gpa: string; scale?: string; current: boolean }) {
  const ratio = Number(gpa) / Number(scale);
  const fill = Number.isFinite(ratio) && ratio > 0 ? Math.min(ratio, 1) : null;
  return (
    <div className="edu-score">
      <dt>{current ? "Current GPA" : "Final GPA"}</dt>
      <dd>
        <span><strong>{gpa}</strong>{hasContent(scale) && <span className="edu-score-scale"> / {scale}</span>}</span>
        {fill !== null && <span className="edu-score-bar" aria-hidden="true"><span style={{ "--fill": fill } as React.CSSProperties} /></span>}
      </dd>
    </div>
  );
}

/** Letter grades (A/L style "AAB") get one small tile each; any other result is shown as written. */
function ResultScore({ result }: { result: string }) {
  const compact = result.replace(/\s+/g, "");
  const grades = /^[ABCSF]{1,6}$/i.test(compact) ? [...compact.toUpperCase()] : null;
  return (
    <div className="edu-score">
      <dt>{grades ? "Results" : "Result"}</dt>
      <dd>
        {grades
          ? <span className="edu-grades" role="img" aria-label={"Grades " + grades.join(", ")}>{grades.map((grade, index) => <span key={index}>{grade}</span>)}</span>
          : <strong>{result}</strong>}
      </dd>
    </div>
  );
}

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
                <div className="timeline-node" aria-hidden="true"><span className="timeline-dot" /></div>
                <article className="glass timeline-card" data-tilt="">
                  <div className="timeline-card-top">
                    <p className="text-meta">{edu.startDate} — {edu.endDate}</p>
                    <Badge variant={current ? "accent" : "default"}>{current ? "Currently studying" : "Completed"}</Badge>
                  </div>
                  <div className="edu-head">
                    {edu.logo
                      ? <span className="edu-logo"><Image src={edu.logo} alt="" width={112} height={112} sizes="112px" /></span>
                      : <span className="edu-logo text-accent" aria-hidden="true"><GraduationCap size={26} strokeWidth={1.6} /></span>}
                    <div className="min-w-0">
                      <h3 className="text-subheadline">{edu.institution}</h3>
                      <p className="text-accent text-sm font-semibold mt-1">{edu.degree === "G.C.E. A/L" ? edu.degree + " " + edu.field + " (" + edu.endDate + ")" : edu.degree + " in " + edu.field}</p>
                      {hasContent(edu.location) && <p className="flex items-center gap-1.5 text-sm text-text-muted mt-1.5"><MapPin size={13} aria-hidden="true" />{edu.location}</p>}
                    </div>
                  </div>
                  {hasContent(edu.description) && <p className="text-text-secondary mt-4">{edu.description}</p>}
                  {hasContent(edu.highlights) && <ul className="arrow-list text-sm mt-5">{edu.highlights.map(h => <li key={h}><span>{h}</span></li>)}</ul>}
                  {(hasContent(edu.gpa) || hasContent(edu.result)) && (
                    <dl className="edu-scores">
                      {hasContent(edu.gpa) && <GpaScore gpa={edu.gpa!} scale={edu.gpaScale} current={current} />}
                      {hasContent(edu.result) && <ResultScore result={edu.result!} />}
                    </dl>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </SectionWrapper>
  );
}
