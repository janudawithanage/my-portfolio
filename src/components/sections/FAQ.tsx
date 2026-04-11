"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { staggerItem } from "@/lib/motion";
import { faqData } from "@/data";
import { cn } from "@/lib/utils";

type FAQItemProps = {
  item: (typeof faqData)[0];
  openId: string | null;
  setOpenId: (id: string | null) => void;
};

function Item({ item, openId, setOpenId }: FAQItemProps) {
  const isOpen = openId === item.id;
  return (
    <motion.div variants={staggerItem} className="border-b border-border last:border-none">
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer group"
        onClick={() => setOpenId(isOpen ? null : item.id)}
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "text-sm font-semibold transition-colors",
            isOpen ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"
          )}
        >
          {item.question}
        </span>
        <span
          className={cn(
            "w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all",
            isOpen
              ? "bg-gold border-gold text-base"
              : "border-border-subtle text-text-muted group-hover:border-accent/40"
          )}
        >
          {isOpen ? <Minus size={11} /> : <Plus size={11} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-text-muted text-sm leading-relaxed pr-4">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(faqData[0].id);

  const half = Math.ceil(faqData.length / 2);
  const col1 = faqData.slice(0, half);
  const col2 = faqData.slice(half);

  return (
    <SectionWrapper id="faq">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left heading */}
          <div className="lg:sticky lg:top-28">
            <SectionHeader
              eyebrow="Support"
              title="FAQs"
              description="Everything you might want to know before we start working together."
              align="left"
              className="mb-6"
            />
          </div>

          {/* Two-column accordion */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-10">
            <div>
              {col1.map((item) => (
                <Item key={item.id} item={item} openId={openId} setOpenId={setOpenId} />
              ))}
            </div>
            <div>
              {col2.map((item) => (
                <Item key={item.id} item={item} openId={openId} setOpenId={setOpenId} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
