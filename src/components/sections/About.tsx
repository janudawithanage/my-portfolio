import Image from "next/image";
import { ArrowUpRight, GraduationCap, MapPin } from "lucide-react";
import { content } from "@/data";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Reveal } from "@/components/motion/Reveal";
import { hasContent } from "@/lib/has-content";
import { sectionEyebrow } from "@/lib/sections";

export function About() {
  const { about } = content;
  return (
    <SectionWrapper id="about" className="section-border" labelledBy="about-title">
      <div className="container-section">
        <SectionHeader eyebrow={sectionEyebrow("about")} title={about.title} titleId="about-title" description={about.description} />
        <div className="grid md:grid-cols-[.8fr_1.2fr] gap-10 lg:gap-20 items-start">
          {hasContent(about.image) && (
            <Reveal className="photo-frame max-w-md w-full">
              <div className="aspect-[4/3] md:aspect-[4/4.6]">
                <Image src={about.image} alt={about.imageAlt} fill sizes="(min-width: 1280px) 420px, (min-width: 768px) 34vw, calc(100vw - 52px)" className="object-cover object-center" />
              </div>
            </Reveal>
          )}
          <Reveal className="space-y-6" index={1}>
            {hasContent(about.lead) && <p className="about-lead">{about.lead}</p>}
            {about.paragraphs.filter(hasContent).map((paragraph, index) => <p className="text-text-secondary text-[1.0625rem]" key={index}>{paragraph}</p>)}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {hasContent(about.study) && <span className="chip chip-plain"><GraduationCap size={15} className="text-accent" aria-hidden="true" />{about.study}</span>}
              {hasContent(about.location) && <span className="chip chip-plain"><MapPin size={15} className="text-accent" aria-hidden="true" />{about.location}</span>}
            </div>
            {hasContent(about.linkLabel) && <a href="#contact" className="text-link">{about.linkLabel}<ArrowUpRight size={16} aria-hidden="true" /></a>}
          </Reveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
