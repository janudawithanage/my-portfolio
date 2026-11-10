"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ExpandableProps {
  /** Id of the region the toggle controls; it wraps every item. */
  id: string;
  items: React.ReactNode[];
  /** Items shown before "View N more". */
  initial?: number;
  /** Layout class for the item containers, e.g. a grid. */
  className: string;
  /** What the list holds, for screen readers: "View 2 more certifications". */
  noun: string;
  buttonClassName?: string;
}

/**
 * Shows the first items and reveals the rest with a height animation
 * (grid rows 0fr → 1fr). Collapsed items are inert and visibility-hidden,
 * so they are skipped by keyboard, screen readers and find-in-page.
 */
export function Expandable({ id, items, initial = 6, className, noun, buttonClassName }: ExpandableProps) {
  const [open, setOpen] = useState(false);
  const rest = items.slice(initial);
  return (
    <>
      <div id={id}>
        <div className={className} data-stagger="">{items.slice(0, initial)}</div>
        {rest.length > 0 && (
          <div className="expander" data-open={open ? "" : undefined} inert={!open}>
            <div><div className={cn(className, "expander-gap")} data-stagger="">{rest}</div></div>
          </div>
        )}
      </div>
      {rest.length > 0 && (
        <Button type="button" variant="secondary" className={cn("expander-toggle mt-8", buttonClassName)} aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}>
          {open ? "Show fewer" : `View ${rest.length} more`}<span className="sr-only"> {noun}</span><ChevronDown size={16} aria-hidden="true" />
        </Button>
      )}
    </>
  );
}
