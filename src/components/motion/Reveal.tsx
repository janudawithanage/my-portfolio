type RevealTag = "div" | "section" | "ul" | "ol" | "li" | "article" | "p" | "figure" | "header";

type RevealProps = React.HTMLAttributes<HTMLElement> & {
  as?: RevealTag;
  /** Reveal the direct children one after another instead of the element itself. */
  stagger?: boolean;
  /** Extra delay steps (90ms each) for an element revealed on its own. */
  index?: number;
};

/**
 * Marks content for the shared scroll reveal (see MotionRoot). Works in server
 * components: it only adds data attributes, and content stays visible without
 * JavaScript, for print, and when reduced motion turns the reveal into a fade.
 */
export function Reveal({ as: Tag = "div", stagger = false, index, style, children, ...props }: RevealProps) {
  const attributes = stagger ? { "data-stagger": "" } : { "data-reveal": "" };
  const delay = index ? ({ "--i": index } as React.CSSProperties) : undefined;
  return <Tag {...props} {...attributes} style={delay ? { ...style, ...delay } : style}>{children}</Tag>;
}
