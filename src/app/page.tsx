import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { Recognition } from "@/components/sections/Recognition";
import { content } from "@/data";
import { visibleSections } from "@/lib/sections";
import type { SectionId } from "@/types";

const sections: Partial<Record<SectionId, () => React.ReactNode>> = {
  about: About,
  education: Education,
  skills: Skills,
  projects: Projects,
  experience: Experience,
  recognition: () => <Recognition data={content.recognition} />,
};

/** Hero first, Contact last; everything between follows the editor's order and skips empty sections. */
export default function Home() {
  return (
    <>
      <Hero />
      {visibleSections.map(id => {
        const Section = sections[id];
        return Section ? <Section key={id} /> : null;
      })}
      <Contact />
    </>
  );
}
