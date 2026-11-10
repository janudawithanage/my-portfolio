import { content } from "@/data";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Reveal } from "@/components/motion/Reveal";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { hasContent } from "@/lib/has-content";
import { sectionEyebrow } from "@/lib/sections";
import type { TestimonialsContent } from "@/types";

export function Testimonials({ data = content.testimonials }: { data?: TestimonialsContent }) {
  const items = data.items.filter(item => hasContent(item.quote) && hasContent(item.name));
  if (!items.length) return null;
  return (
    <SectionWrapper id="testimonials" className="section-border" labelledBy="testimonials-title">
      <div className="container-section">
        <SectionHeader eyebrow={sectionEyebrow("testimonials")} title={data.title} titleId="testimonials-title" description={data.description} />
        <Reveal className="max-w-4xl"><TestimonialCarousel items={items} /></Reveal>
      </div>
    </SectionWrapper>
  );
}
