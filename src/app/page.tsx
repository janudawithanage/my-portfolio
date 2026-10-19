import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { MarqueeStrip } from "@/components/sections/MarqueeStrip";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { GithubProjects } from "@/components/sections/GithubProjects";
import { GithubProjectsSkeleton } from "@/components/sections/GithubProjectsSkeleton";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <Projects />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Suspense fallback={<GithubProjectsSkeleton />}>
        <GithubProjects />
      </Suspense>
      <Contact />
    </>
  );
}
