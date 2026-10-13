import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

// Reading never depends on a scroll animation or JavaScript hydration.
export function SectionWrapper({ id, className, children }: SectionWrapperProps) {
  return <section id={id} tabIndex={-1} className={cn("section-padding", className)}>{children}</section>;
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("section-heading", className)}>
      {eyebrow && <p className="text-eyebrow">{eyebrow}</p>}
      <div className="section-heading-content">
        <h2 className="text-headline">{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
