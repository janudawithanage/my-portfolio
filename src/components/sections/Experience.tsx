import { ChevronDown, MapPin } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { content, experienceData } from "@/data";

const labels: Record<string, string> = { "full-time": "Full-time", "part-time": "Part-time", internship: "Internship", contract: "Contract", freelance: "Freelance", university: "University project", personal: "Personal project" };

export function Experience() {
  return (
    <SectionWrapper id="experience" className="section-border bg-bg-secondary">
      <div className="container-section">
        <SectionHeader eyebrow="05 / Experience" title={content.experience.title} description={content.experience.description} />
        <div>
          {experienceData.map(exp => (
            <article key={exp.id} className="journey-item">
              <div className="space-y-2">
                <p className="text-sm text-text-secondary">{exp.startDate} — {exp.endDate}</p>
                <p className="text-sm text-text-muted">{exp.company}</p>
                <p className="flex items-center gap-1.5 text-xs text-text-muted"><MapPin size={13} aria-hidden="true" />{exp.location}</p>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap gap-3 items-start justify-between"><h3 className="text-subheadline">{exp.role}</h3><Badge>{labels[exp.type] ?? exp.type}</Badge></div>
                <p className="text-text-secondary mt-3">{exp.description}</p>
                <ul className="flex flex-wrap gap-2 mt-4" aria-label={exp.role + " technologies"}>{exp.tech.map(t => <li key={t}><Badge variant="outline">{t}</Badge></li>)}</ul>
                <details className="journey-details">
                  <summary>Project highlights<ChevronDown size={15} aria-hidden="true" /></summary>
                  <ul className="mt-2 space-y-2 text-text-secondary">{exp.highlights.map(h => <li key={h} className="flex gap-3"><span className="text-accent" aria-hidden="true">—</span><span>{h}</span></li>)}</ul>
                </details>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
