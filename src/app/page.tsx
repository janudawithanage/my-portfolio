import { Hero }           from "@/components/sections/Hero";
import { MarqueeStrip }   from "@/components/sections/MarqueeStrip";
import { About }          from "@/components/sections/About";
import { Skills }         from "@/components/sections/Skills";
import { Experience }     from "@/components/sections/Experience";
import { Projects }       from "@/components/sections/Projects";
import { GithubProjects } from "@/components/sections/GithubProjects";
import { Education }      from "@/components/sections/Education";
import { CTABanner }      from "@/components/sections/CTABanner";
import { Contact }        from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <GithubProjects />
      <Education />
      <CTABanner />
      <Contact />
    </>
  );
}
