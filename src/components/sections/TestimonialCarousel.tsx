"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { hasContent } from "@/lib/has-content";
import type { Testimonial } from "@/types";

const ROTATE_MS = 7000;
const initials = (name: string) => name.trim().split(/\s+/).map(word => word[0]).slice(0, 2).join("").toUpperCase();

/**
 * One quote at a time. Auto-advance pauses on hover and keyboard focus, when the
 * tab is hidden, after the Pause button, and never runs with reduced motion.
 * Arrow keys move between quotes while the carousel has focus.
 */
export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);
  const multiple = items.length > 1;
  const rotating = multiple && playing && !hovered && !focused && !hidden && !reduced;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    const visibility = () => setHidden(document.hidden);
    const first = setTimeout(update, 0);
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    return () => { clearTimeout(first); media.removeEventListener("change", update); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = setTimeout(() => setIndex(current => (current + 1) % items.length), ROTATE_MS);
    return () => clearTimeout(timer);
  }, [rotating, index, items.length]);

  const go = (next: number) => setIndex((next + items.length) % items.length);

  return (
    <div
      className="glass overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
      onKeyDown={event => {
        if (!multiple) return;
        if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1); }
      }}
    >
      <div className="testimonial-stage" aria-live={rotating ? "off" : "polite"}>
        {items.map((item, i) => {
          const detail = [item.role, item.company].filter(hasContent).join(" · ");
          return (
            <figure key={item.id} className="testimonial-slide" data-active={i === index ? "" : undefined} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`} inert={i !== index}>
              <span className="testimonial-mark" aria-hidden="true">“</span>
              <blockquote className="testimonial-quote"><p>{item.quote}</p></blockquote>
              <figcaption className="testimonial-person">
                <span className="glass-icon testimonial-avatar" aria-hidden="true">
                  {hasContent(item.avatar) ? <Image src={item.avatar!} alt="" width={52} height={52} sizes="52px" /> : initials(item.name)}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-ink">
                    {hasContent(item.url) ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center transition-colors hover:text-accent">{item.name}</a> : item.name}
                  </span>
                  {hasContent(detail) && <span className="block text-sm text-text-muted">{detail}</span>}
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      {multiple && (
        <div className="carousel-controls border-t border-border px-4 py-2 sm:px-8">
          <div className="carousel-dots">
            {items.map((item, i) => (
              <button key={item.id} type="button" className="carousel-dot" aria-label={`Show testimonial ${i + 1} of ${items.length}`} aria-current={i === index} onClick={() => go(i)} />
            ))}
          </div>
          <div className="flex gap-2">
            {!reduced && (
              <button type="button" className="icon-link" aria-label={playing ? "Pause testimonials" : "Play testimonials"} onClick={() => setPlaying(value => !value)}>
                {playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
              </button>
            )}
            <button type="button" className="icon-link" aria-label="Previous testimonial" onClick={() => go(index - 1)}><ChevronLeft size={18} aria-hidden="true" /></button>
            <button type="button" className="icon-link" aria-label="Next testimonial" onClick={() => go(index + 1)}><ChevronRight size={18} aria-hidden="true" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
