import Image from "next/image";
import { ArrowUpRight, GraduationCap, MapPin } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";

export function About() {
  return (
    <SectionWrapper id="about" className="section-border">
      <div className="container-section">
        <SectionHeader eyebrow="02 / A little about me" title="Curious by nature. Builder by choice." description="I enjoy connecting the dots between a good interface, a dependable backend, and the systems behind it." />
        <div className="grid md:grid-cols-[.75fr_1.25fr] gap-8 lg:gap-16 items-start">
          <div className="relative aspect-[4/3] md:aspect-[4/4.5] max-w-md w-full overflow-hidden rounded-2xl border border-border">
            <Image src="/images/photo2.png" alt="Januda Withanage outdoors" fill sizes="(min-width: 1280px) 426px, (min-width: 768px) 35vw, calc(100vw - 32px)" className="object-cover object-center" />
          </div>
          <div className="space-y-5">
            <p className="text-xl lg:text-2xl font-medium leading-relaxed text-text-primary">I&apos;m Januda, a Computer Science student at the University of Colombo School of Computing.</p>
            <p className="text-text-secondary">My studies inform my work across frontend, backend, and cloud. Recent projects include a Node.js microservices system with RabbitMQ and Kong, a TypeScript sports betting platform, and an ESP32 monitoring dashboard.</p>
            <p className="text-text-secondary">Alongside development, I study web application security, work through CTF challenges, and explore system design and open-source tools. I also work with Azure and container-based deployment workflows.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 text-sm text-text-secondary">
              <span className="flex items-center gap-2"><GraduationCap size={17} className="text-accent" aria-hidden="true" />UCSC · Computer Science</span>
              <span className="flex items-center gap-2"><MapPin size={17} className="text-accent" aria-hidden="true" />Colombo, Sri Lanka</span>
            </div>
            <a href="#contact" className="text-link">Have something in mind? Let&apos;s connect<ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
