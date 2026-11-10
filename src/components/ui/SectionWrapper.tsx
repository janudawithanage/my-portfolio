import { cn } from "@/lib/utils";
import { hasContent } from "@/lib/has-content";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  /** Id of the heading that names this section for assistive technology. */
  labelledBy?: string;
}

// Content is in the server HTML; motion only enhances it after hydration.
export function SectionWrapper({ id, className, children, labelledBy }: SectionWrapperProps) {
  return <section id={id} tabIndex={-1} aria-labelledby={labelledBy} className={cn("section-padding", className)}>{children}</section>;
}

interface SectionHeaderProps {
  /** "01 — Label" renders the number in the accent colour. */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Id for the heading, so the section can reference it. */
  titleId?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, titleId, className }: SectionHeaderProps) {
  const numbered = eyebrow?.match(/^(\d+) — (.+)$/);
  return (
    <div className={cn("section-heading", className)} data-reveal="">
      {eyebrow && <p className="text-eyebrow"><span>{numbered ? <><span className="eyebrow-number">{numbered[1]}</span> — {numbered[2]}</> : eyebrow}</span></p>}
      <div className="section-heading-content">
        <h2 id={titleId} className="text-headline">{title}</h2>
        {hasContent(description) && <p>{description}</p>}
      </div>
    </div>
  );
}
