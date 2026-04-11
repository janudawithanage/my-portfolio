"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Send, Check } from "lucide-react";
import Link from "next/link";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { socialLinks } from "@/data";

// ─── Form schema ──────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters"),
  email:   z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ─── Icon helpers ─────────────────────────────────────────────────────────────
function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

const socialIconMap: Record<string, React.ElementType> = {
  github:   GithubIcon,
  linkedin: LinkedinIcon,
  mail:     Mail,
  twitter:  TwitterIcon,
};

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-secondary">
        {label}
        <span className="text-accent ml-1">*</span>
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-error text-xs"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-surface border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors";

// ─── Component ────────────────────────────────────────────────────────────────
export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    // TODO: Replace with your preferred email API (Resend, EmailJS, Formspree, etc.)
    await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate API call
    console.log("Form data:", data);
    setSubmitting(false);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <SectionWrapper id="contact">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Contact"
          title="Let's build something great"
          description="Whether you have an opportunity, a project idea, or just want to connect — my inbox is always open."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left — info */}
          <motion.div variants={staggerItem} className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              {[
                { icon: Mail,    label: "Email",    value: "januda@example.com",     href: "mailto:januda@example.com" },
                { icon: MapPin,  label: "Location", value: "Santa Cruz, CA",          href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-accent" />
                  </span>
                  <div>
                    <p className="text-text-muted text-xs uppercase tracking-wider">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="text-text-primary text-sm font-medium hover:text-accent transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-text-primary text-sm font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-text-muted text-xs uppercase tracking-widest mb-3">
                Find me on
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = socialIconMap[social.icon] ?? Mail;
                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/30 hover:bg-surface-hover transition-all duration-200"
                    >
                      <Icon />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Availability card */}
            <div className="p-4 rounded-xl border border-success/25 bg-success/5">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-success text-sm font-semibold">Available for Opportunities</span>
              </div>
              <p className="text-text-muted text-xs leading-relaxed">
                Looking for Summer 2025 internships in full-stack, cloud, or security engineering.
              </p>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div variants={staggerItem} className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center gap-4 py-16 text-center p-8 rounded-2xl border border-success/20 bg-success/5"
                >
                  <span className="w-16 h-16 rounded-full bg-success/15 border border-success/30 flex items-center justify-center">
                    <Check size={28} className="text-success" />
                  </span>
                  <div>
                    <h3 className="font-bold text-text-primary text-xl mb-1">
                      Message sent!
                    </h3>
                    <p className="text-text-secondary text-sm">
                      Thank you for reaching out. I&apos;ll get back to you within 24–48 hours.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-6 sm:p-8 rounded-2xl border border-border bg-surface space-y-5"
                  noValidate
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Name" error={errors.name?.message}>
                      <input
                        {...register("name")}
                        type="text"
                        placeholder="Your full name"
                        autoComplete="name"
                        className={cn(inputClass, errors.name && "border-error focus:border-error focus:ring-error/30")}
                      />
                    </Field>
                    <Field label="Email" error={errors.email?.message}>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className={cn(inputClass, errors.email && "border-error focus:border-error focus:ring-error/30")}
                      />
                    </Field>
                  </div>

                  <Field label="Subject" error={errors.subject?.message}>
                    <input
                      {...register("subject")}
                      type="text"
                      placeholder="What's this about?"
                      className={cn(inputClass, errors.subject && "border-error focus:border-error focus:ring-error/30")}
                    />
                  </Field>

                  <Field label="Message" error={errors.message?.message}>
                    <textarea
                      {...register("message")}
                      rows={5}
                      placeholder="Tell me about your project, opportunity, or question..."
                      className={cn(
                        inputClass,
                        "resize-none",
                        errors.message && "border-error focus:border-error focus:ring-error/30"
                      )}
                    />
                  </Field>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={16} />
                      </>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
