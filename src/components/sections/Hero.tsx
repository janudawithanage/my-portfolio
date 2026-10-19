import Image from "next/image";
import { ArrowDown, ArrowUpRight, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { featuredProjects, socialLinks } from "@/data";

export function Hero() {
  return (
    <section id="hero" className="hero-section" aria-labelledby="hero-name">
      <div className="container-section">
        <div className="hero-layout">
          <div className="min-w-0">
            <p className="hero-availability"><span className="status-dot" aria-hidden="true" />Open to opportunities &amp; collaboration</p>
            <h1 id="hero-name" className="hero-name"><span>Januda</span><span>Withanage.</span></h1>
            <p className="hero-role">Software engineer. Full-stack builder.</p>
            <p className="hero-bio">I build thoughtful web applications and cloud-backed services. Bringing together code, systems, and a growing focus on security.</p>
            <div className="hero-actions">
              <Button asChild size="lg"><a href="#projects">Explore my work<ArrowDown size={17} aria-hidden="true" /></a></Button>
              <Button asChild variant="secondary" size="lg"><a href="#contact">Let&apos;s talk<ArrowUpRight size={17} aria-hidden="true" /></a></Button>
              <Button asChild variant="secondary" size="lg"><a href="/Januda-Withanage-CV.pdf" download="Januda-Withanage-CV.pdf">Download CV<Download size={17} aria-hidden="true" /></a></Button>
            </div>
            <div className="hero-facts">
              <span><strong>3+</strong> years coding</span>
              <span><strong>{featuredProjects.length}</strong> selected projects</span>
              <span><strong>UCSC</strong> Computer Science</span>
            </div>
          </div>
          <figure className="hero-portrait-shell">
            <div className="hero-portrait">
              <Image src="/images/photo1.png" alt="Januda Withanage" fill sizes="(min-width: 1280px) 390px, (min-width: 1024px) 35vw, (min-width: 640px) 390px, calc(100vw - 58px)" className="object-cover" priority />
            </div>
            <figcaption className="portrait-caption">
              <span className="flex items-center gap-1.5"><MapPin size={13} aria-hidden="true" />Colombo, Sri Lanka</span>
              <div className="flex gap-2">
                <a href={socialLinks[0].href} target="_blank" rel="noopener noreferrer" aria-label="Januda on GitHub" className="icon-link"><GithubIcon size={17} /></a>
                <a href={socialLinks[1].href} target="_blank" rel="noopener noreferrer" aria-label="Januda on LinkedIn" className="icon-link"><LinkedinIcon size={17} /></a>
              </div>
            </figcaption>
          </figure>
        </div>
        <div className="hero-capabilities" aria-label="Areas of focus">
          <span>Full-stack development</span><span>Cloud &amp; distributed systems</span><span>Connected devices</span><span>Application security</span>
        </div>
      </div>
    </section>
  );
}
