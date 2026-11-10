import { existsSync } from "node:fs";
import path from "node:path";
import { Fragment } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/motion/CountUp";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { content, fullName, featuredProjects } from "@/data";
import { hasContent } from "@/lib/has-content";

/** A site-relative CV only gets a button once its PDF exists in public/, so the link never 404s. */
function isCvAvailable(cvUrl: string) {
  return /^https?:\/\//i.test(cvUrl) || existsSync(path.join(process.cwd(), "public", cvUrl));
}

const enter = (index: number) => ({ "--i": index }) as React.CSSProperties;

export function Hero() {
  const { hero } = content;
  const cvAvailable = isCvAvailable(hero.cvUrl);
  const facts = [...hero.facts.slice(0, 1), { value: String(featuredProjects.length), label: "selected projects" }, ...hero.facts.slice(1)].filter(fact => hasContent(fact.value));
  const marquee = <>{hero.marquee.map(item => <Fragment key={item}>{item} <i aria-hidden="true">✦</i> </Fragment>)}</>;
  return (
    <section id="hero" className="hero-section" aria-labelledby="hero-name">
      <div className="container-section">
        <div className="hero-layout">
          <div className="min-w-0">
            <p className="hero-availability hero-enter" style={enter(0)}><span className="status-dot" aria-hidden="true" />{hero.availability}</p>
            <h1 id="hero-name" className="hero-name"><span><span>{hero.firstName}</span></span><span><span>{hero.lastName}.</span></span></h1>
            <p className="hero-role hero-enter" style={enter(1)}>{hero.role}</p>
            <p className="hero-bio hero-enter" style={enter(2)}>{hero.bio}</p>
            <div className="hero-actions hero-enter" style={enter(3)}>
              <Button asChild size="lg" magnetic><a href="#projects">{hero.primaryLabel}<ArrowDown size={17} aria-hidden="true" /></a></Button>
              <Button asChild variant="secondary" size="lg" magnetic><a href="#contact">{hero.secondaryLabel}<ArrowUpRight size={17} aria-hidden="true" /></a></Button>
              {cvAvailable && <Button asChild variant="secondary" size="lg"><a href={hero.cvUrl} download>{hero.cvLabel}<Download size={17} aria-hidden="true" /></a></Button>}
            </div>
            {facts.length > 0 && (
              <div className="hero-facts hero-enter" style={enter(4)}>
                {facts.map(fact => <span key={fact.label}><strong><CountUp value={fact.value} delay={650} /></strong> {fact.label}</span>)}
              </div>
            )}
          </div>
          <div className="hero-visual">
            <figure className="hero-portrait-shell">
              <div className="hero-portrait">
                <Image src={hero.image} alt={hero.imageAlt} fill sizes="(min-width: 1280px) 408px, (min-width: 1024px) 34vw, (min-width: 640px) 408px, calc(100vw - 58px)" className="object-cover" priority />
              </div>
              <figcaption className="portrait-caption">
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-accent" aria-hidden="true" />{hero.location}</span>
                <div className="flex gap-2">
                  <a href={hero.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={fullName + " on GitHub"} className="icon-link"><GithubIcon size={17} /></a>
                  <a href={hero.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={fullName + " on LinkedIn"} className="icon-link"><LinkedinIcon size={17} /></a>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
        {hasContent(hero.capabilities) && (
          <div className="hero-capabilities hero-enter" style={enter(5)} aria-label="Areas of focus">
            {hero.capabilities.map(item => <span key={item}>{item}</span>)}
          </div>
        )}
      </div>
      {hasContent(hero.marquee) && (
        <div className="hero-tech-strip hero-enter" style={enter(6)} role="region" aria-label="Skills and areas of focus" tabIndex={0}>
          <div className="hero-tech-track">
            <span>{marquee}</span>
            <span aria-hidden="true">{marquee}</span>
          </div>
        </div>
      )}
    </section>
  );
}
