"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { staggerItem } from "@/lib/motion";
import { testimonialsData } from "@/data";

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="fill-gold text-gold" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <SectionWrapper id="testimonials" className="bg-bg-secondary overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Testimonials"
          title="Trusted by clients"
          description="Kind words from people I have had the privilege of working with."
        />

        {/* Stats bar */}
        <motion.div
          variants={staggerItem}
          className="flex flex-wrap items-center justify-center gap-8 mb-14 py-6 rounded-2xl bg-surface border border-border"
        >
          {[
            { value: "5.0", label: "Average Rating" },
            { value: "6+",  label: "Satisfied Clients" },
            { value: "100%", label: "On-time Delivery" },
            { value: "0",   label: "Unhappy Returns" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center px-4">
              <div
                className="text-3xl font-extrabold gradient-text-gold"
                style={{ fontFamily: "var(--font-syne, sans-serif)" }}
              >
                {value}
              </div>
              <div className="text-text-muted text-xs tracking-wider uppercase mt-1">
                {label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonialsData.map((t) => (
            <motion.div
              key={t.id}
              variants={staggerItem}
              className="card-elevated p-6 flex flex-col gap-4"
            >
              <StarRow count={t.rating} />
              <blockquote className="text-text-secondary text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-accent">
                    {t.author.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-text-primary text-sm font-semibold">{t.author}</p>
                  <p className="text-text-muted text-xs">{t.role} &middot; {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
