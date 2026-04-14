"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fadeUp } from "@/lib/motion";

export function CTABanner() {
  const handleScroll = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="cta"
      className="relative overflow-hidden border-y border-border"
      aria-label="Call to action"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-bg-secondary" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(123,110,246,0.12) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      {/* Gold corner radial */}
      <div
        className="absolute bottom-0 right-0 w-96 h-96 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 80% 100%, rgba(196,154,60,0.25) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 py-24 sm:py-32 text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0 }}
          className="text-eyebrow mb-5"
        >
          Ready to connect?
        </motion.p>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-display text-text-primary mb-6"
        >
          Let&apos;s{" "}
          <span className="gradient-text-gold">collaborate</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-text-secondary sm:text-lg leading-relaxed max-w-xl mx-auto mb-10"
        >
          I&apos;m always open to internship opportunities, exciting collaborations,
          and conversations with people building interesting things. If something here
          caught your eye, I&apos;d love to hear from you.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            variant="gold"
            size="xl"
            onClick={() => handleScroll("#contact")}
            className="group"
          >
            Get in Touch
            <ArrowUpRight
              size={20}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Button>
          <Button
            variant="secondary"
            size="xl"
            asChild
          >
            <a href="mailto:janudawithanage@gmail.com">
              Send an Email
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
