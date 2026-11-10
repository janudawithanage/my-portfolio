import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Stats } from "@/components/sections/Stats";
import { Now } from "@/components/sections/Now";
import { Education } from "@/components/sections/Education";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Security } from "@/components/sections/Security";
import { Recognition } from "@/components/sections/Recognition";
import { Writing } from "@/components/sections/Writing";
import { Talks } from "@/components/sections/Talks";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { content } from "@/data";
import { visibleSections } from "@/lib/sections";
import type { SectionId } from "@/types";

const sections: Record<SectionId, () => React.ReactNode> = {
  about: About,
  stats: () => <Stats />,
  now: () => <Now />,
  education: Education,
  skills: Skills,
  projects: Projects,
  experience: Experience,
  security: () => <Security />,
  recognition: () => <Recognition data={content.recognition} />,
  writing: () => <Writing />,
  talks: () => <Talks />,
  testimonials: () => <Testimonials />,
};

/** Hero first, Contact last; everything between follows the editor's order and skips empty sections. */
export default function Home() {
  return (
    <>
      <Hero />
      {visibleSections.map(id => {
        const Section = sections[id];
        return <Section key={id} />;
      })}
      <Contact />
    </>
  );
}
