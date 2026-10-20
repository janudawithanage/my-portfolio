import { content } from "@/data";
import Image from "next/image";
import { ArrowUpRight, GraduationCap, MapPin } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";

export function About() {
  return (
    <SectionWrapper id="about" className="section-border">
      <div className="container-section">
        <SectionHeader eyebrow="01 / A little about me" title={content.about.title} description={content.about.description} />
        <div className="grid md:grid-cols-[.75fr_1.25fr] gap-8 lg:gap-16 items-start">
          <div className="relative aspect-[4/3] md:aspect-[4/4.5] max-w-md w-full overflow-hidden rounded-2xl border border-border">
            <Image src={content.about.image} alt={content.about.imageAlt} fill sizes="(min-width: 1280px) 426px, (min-width: 768px) 35vw, calc(100vw - 32px)" className="object-cover object-center" />
          </div>
          <div className="space-y-5">
            <p className="text-xl lg:text-2xl font-medium leading-relaxed text-text-primary">{content.about.lead}</p>
            {content.about.paragraphs.map((paragraph, index) => <p className="text-text-secondary" key={index}>{paragraph}</p>)}
            <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 text-sm text-text-secondary">
              <span className="flex items-center gap-2"><GraduationCap size={17} className="text-accent" aria-hidden="true" />{content.about.study}</span>
              <span className="flex items-center gap-2"><MapPin size={17} className="text-accent" aria-hidden="true" />{content.about.location}</span>
            </div>
            <a href="#contact" className="text-link">{content.about.linkLabel}<ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
