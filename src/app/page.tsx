import { Suspense }        from "react";
import { Hero }           from "@/components/sections/Hero";
import { MarqueeStrip }   from "@/components/sections/MarqueeStrip";
import { About }          from "@/components/sections/About";
import { Skills }                from "@/components/sections/Skills";
import { SkillsSkeleton }        from "@/components/sections/SkillsSkeleton";
import { Experience }            from "@/components/sections/Experience";
import { Projects }       from "@/components/sections/Projects";
import { GithubProjects } from "@/components/sections/GithubProjects";
import { GithubProjectsSkeleton } from "@/components/sections/GithubProjectsSkeleton";
import { Education }      from "@/components/sections/Education";
import { CTABanner }      from "@/components/sections/CTABanner";
import { Contact }        from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <About />
      <Suspense fallback={<SkillsSkeleton />}>
        <Skills />
      </Suspense>
      <Experience />
      <Projects />
      {/*
        Suspense boundary enables React streaming: the rest of the page renders
        immediately while GithubProjects awaits its GitHub API fetch.
        GithubProjectsSkeleton is shown only on the very first request before
        the ISR cache is warm — subsequent visitors see instant HTML.
      */}
      <Suspense fallback={<GithubProjectsSkeleton />}>
        <GithubProjects />
      </Suspense>
      <Education />
      <CTABanner />
      <Contact />
    </>
  );
}
