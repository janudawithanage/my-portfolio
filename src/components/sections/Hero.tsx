import Image from "next/image";
import { ArrowDown, ArrowUpRight, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { content, fullName, featuredProjects, socialLinks } from "@/data";

export function Hero() {
  return (
    <section id="hero" className="hero-section" aria-labelledby="hero-name">
      <div className="container-section">
        <div className="hero-layout">
          <div className="min-w-0">
            <p className="hero-availability"><span className="status-dot" aria-hidden="true" />{content.hero.availability}</p>
            <h1 id="hero-name" className="hero-name"><span>{content.hero.firstName}</span><span>{content.hero.lastName}.</span></h1>
            <p className="hero-role">{content.hero.role}</p>
            <p className="hero-bio">{content.hero.bio}</p>
            <div className="hero-actions">
              <Button asChild size="lg"><a href="#projects">{content.hero.primaryLabel}<ArrowDown size={17} aria-hidden="true" /></a></Button>
              <Button asChild variant="secondary" size="lg"><a href="#contact">{content.hero.secondaryLabel}<ArrowUpRight size={17} aria-hidden="true" /></a></Button>
              <Button asChild variant="secondary" size="lg"><a href={content.hero.cvUrl} download>{content.hero.cvLabel}<Download size={17} aria-hidden="true" /></a></Button>
            </div>
            <div className="hero-facts">
              {content.hero.facts.slice(0, 1).map(fact => <span key={fact.label}><strong>{fact.value}</strong> {fact.label}</span>)}
              <span><strong>{featuredProjects.length}</strong> selected projects</span>
              {content.hero.facts.slice(1).map(fact => <span key={fact.label}><strong>{fact.value}</strong> {fact.label}</span>)}
            </div>
          </div>
          <figure className="hero-portrait-shell">
            <div className="hero-portrait">
              <Image src={content.hero.image} alt={content.hero.imageAlt} fill sizes="(min-width: 1280px) 390px, (min-width: 1024px) 35vw, (min-width: 640px) 390px, calc(100vw - 58px)" className="object-cover" priority />
            </div>
            <figcaption className="portrait-caption">
              <span className="flex items-center gap-1.5"><MapPin size={13} aria-hidden="true" />{content.hero.location}</span>
              <div className="flex gap-2">
                <a href={socialLinks[0].href} target="_blank" rel="noopener noreferrer" aria-label={fullName + " on GitHub"} className="icon-link"><GithubIcon size={17} /></a>
                <a href={socialLinks[1].href} target="_blank" rel="noopener noreferrer" aria-label={fullName + " on LinkedIn"} className="icon-link"><LinkedinIcon size={17} /></a>
              </div>
            </figcaption>
          </figure>
        </div>
        <div className="hero-capabilities" aria-label="Areas of focus">
          {content.hero.capabilities.map(item => <span key={item}>{item}</span>)}
        </div>
      </div>
    </section>
  );
}
