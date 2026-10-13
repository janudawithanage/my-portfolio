import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { educationData } from "@/data";

export function Education() {
  return (
    <SectionWrapper id="education" className="section-border">
      <div className="container-section">
        <SectionHeader eyebrow="05 / Education" title="A foundation to build on." description="From Physical Science at Rahula College to Computer Science at the University of Colombo School of Computing." />
        <div className="grid md:grid-cols-2 gap-5">
          {educationData.map(edu => (
            <article key={edu.id} className="card p-5 sm:p-7">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                {edu.logo ? (
                  <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-white p-2">
                    <Image src={edu.logo} alt={edu.institution + " logo"} width={64} height={64} sizes="64px" className="h-full w-full object-contain" />
                  </div>
                ) : <GraduationCap size={25} className="text-accent" strokeWidth={1.5} aria-hidden="true" />}
                <div className="flex flex-wrap gap-2">
                  <Badge variant={edu.endDate === "Present" ? "accent" : "default"}>{edu.endDate === "Present" ? "Currently studying" : "Completed"}</Badge>
                  {edu.gpa && <Badge variant="gold">GPA {edu.gpa}</Badge>}
                </div>
              </div>
              <h3 className="text-subheadline">{edu.institution}</h3>
              <p className="text-accent text-sm font-medium mt-2">{edu.degree === "G.C.E. A/L" ? edu.degree + " " + edu.field + " (" + edu.endDate + ")" : edu.degree + " in " + edu.field}</p>
              <p className="text-sm text-text-muted mt-3">{edu.startDate} — {edu.endDate}<br />{edu.location}</p>
              <p className="text-text-secondary mt-5">{edu.description}</p>
              {edu.result && <div className="mt-5 border-t border-border pt-5"><p className="text-xs text-text-muted uppercase tracking-wider">G.C.E. A/L result</p><p className="font-display text-2xl font-semibold text-accent mt-1">{edu.result}</p></div>}
              {edu.highlights.length > 0 && <ul className="mt-5 space-y-2 text-sm text-text-secondary border-t border-border pt-5">{edu.highlights.map(h => <li className="flex gap-3" key={h}><span className="text-accent" aria-hidden="true">—</span><span>{h}</span></li>)}</ul>}
            </article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
