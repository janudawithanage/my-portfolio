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
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
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

const socialIconMap: Record<string, React.ElementType> = {
  github:   GithubIcon,
  linkedin: LinkedinIcon,
  mail:     Mail,
};

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-text-secondary">
        {label}
        <span className="text-accent ml-1" aria-hidden="true">*</span>
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
  "w-full px-4 py-3 rounded-lg bg-surface border border-border-subtle text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors";

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

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Formspree integration — set NEXT_PUBLIC_FORMSPREE_ID in .env.local
      // Sign up free at https://formspree.io and create a form to get your ID
      const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

      if (formspreeId) {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Submission failed");
      } else {
        // Fallback: open mailto link when Formspree is not configured
        window.location.href = `mailto:janudawithanage@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`Name: ${data.name}\n\n${data.message}`)}`;
      }

      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 6000);
    } catch {
      setSubmitError("Something went wrong. Please try emailing me directly at janudawithanage@gmail.com");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="contact">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Get in Touch"
          title="Let&apos;s work together"
          description="Whether it&apos;s an internship opportunity, a collaboration on an interesting project, or just a conversation about technology — I&apos;d love to hear from you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left — info */}
          <motion.div variants={staggerItem} className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              {[
                { icon: Mail,    label: "Email",    value: "janudawithanage@gmail.com",        href: "mailto:janudawithanage@gmail.com" },
                { icon: MapPin,  label: "Location", value: "Colombo, Sri Lanka",               href: null },
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
                      className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/30 hover:bg-surface-raised transition-all duration-200"
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
                Open to internships, collaborations, and project opportunities in
                full-stack development, cloud engineering (Azure), or cybersecurity.
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
                    <Field label="Name" htmlFor="contact-name" error={errors.name?.message}>
                      <input
                        {...register("name")}
                        id="contact-name"
                        type="text"
                        placeholder="Your full name"
                        autoComplete="name"
                        className={cn(inputClass, errors.name && "border-error focus:border-error focus:ring-error/30")}
                      />
                    </Field>
                    <Field label="Email" htmlFor="contact-email" error={errors.email?.message}>
                      <input
                        {...register("email")}
                        id="contact-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className={cn(inputClass, errors.email && "border-error focus:border-error focus:ring-error/30")}
                      />
                    </Field>
                  </div>

                  <Field label="Subject" htmlFor="contact-subject" error={errors.subject?.message}>
                    <input
                      {...register("subject")}
                      id="contact-subject"
                      type="text"
                      placeholder="What's this about?"
                      className={cn(inputClass, errors.subject && "border-error focus:border-error focus:ring-error/30")}
                    />
                  </Field>

                  <Field label="Message" htmlFor="contact-message" error={errors.message?.message}>
                    <textarea
                      {...register("message")}
                      id="contact-message"
                      rows={5}
                      placeholder="Tell me about your project, opportunity, or question..."
                      className={cn(
                        inputClass,
                        "resize-none",
                        errors.message && "border-error focus:border-error focus:ring-error/30"
                      )}
                    />
                  </Field>

                  {submitError && (
                    <p className="text-error text-xs text-center leading-relaxed" role="alert">
                      {submitError}
                    </p>
                  )}

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
