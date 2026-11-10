"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, Check, Mail, MapPin, Phone, Send } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { SocialGlyph } from "@/components/ui/SocialGlyph";
import { content, socialLinks } from "@/data";
import { hasContent } from "@/lib/has-content";
import { sectionEyebrow } from "@/lib/sections";

// Zod's JIT probes `new Function`, which the production CSP blocks and reports. Four fields don't need it.
z.config({ jitless: true });

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter a name with at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  subject: z.string().trim().min(5, "Add a subject with at least 5 characters."),
  message: z.string().trim().min(20, "Tell me a little more — at least 20 characters."),
  // Honeypot: hidden from people, but naive bots fill every input they find.
  _gotcha: z.string().optional(),
});
type ContactFormData = z.infer<typeof contactSchema>;
type VisibleField = Exclude<keyof ContactFormData, "_gotcha">;
const labels: Record<VisibleField, string> = { name: "Name", email: "Email", subject: "Subject", message: "Message" };

function Field({ name, error, children }: { name: VisibleField; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1"><label htmlFor={"contact-" + name} className="text-sm font-semibold text-ink">{labels[name]}</label><span className="text-text-muted" aria-hidden="true">*</span></div>
      {children}
      {error && <p id={"contact-" + name + "-error"} className="text-error text-sm">{error}</p>}
    </div>
  );
}

function Detail({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="contact-detail">
      <span className="glass-icon" aria-hidden="true">{icon}</span>
      <p className="text-meta">{label}</p>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema), shouldFocusError: false });
  const errorFields = (Object.keys(labels) as VisibleField[]).filter(key => errors[key]);
  const { phone } = content.contact;
  const fieldProps = (name: VisibleField) => ({
    id: "contact-" + name,
    className: "contact-input",
    required: true,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? "contact-" + name + "-error" : undefined,
  });

  const onInvalid = () => {
    requestAnimationFrame(() => summaryRef.current?.focus());
  };

  const onSubmit = async (data: ContactFormData) => {
    if (data._gotcha) {
      // A bot filled the honeypot: show the usual confirmation but send nothing.
      setSubmitted(true);
      reset();
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    setSubmitNotice(null);
    try {
      if (formspreeId) {
        const response = await fetch("https://formspree.io/f/" + formspreeId, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name: data.name, email: data.email, subject: data.subject, message: data.message }),
        });
        if (!response.ok) throw new Error("Submission failed");
        setSubmitted(true);
        reset();
      } else {
        const body = "Name: " + data.name + "\nEmail: " + data.email + "\n\n" + data.message;
        window.location.assign("mailto:" + content.contact.email + "?subject=" + encodeURIComponent(data.subject) + "&body=" + encodeURIComponent(body));
        setSubmitNotice("An email draft should open in your mail app. Send it there to complete your message. If nothing opens, email " + content.contact.email + " directly.");
      }
    } catch {
      setSubmitError("Your message couldn’t be sent. Please try again, or email me directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="contact" className="section-border" labelledBy="contact-title">
      <span id="cta" className="block" aria-hidden="true" />
      <div className="container-section">
        <SectionHeader eyebrow={sectionEyebrow("contact")} title={content.contact.title} titleId="contact-title" description={content.contact.description} />
        <div className="grid lg:grid-cols-[.85fr_1.15fr] gap-10 lg:gap-16">
          <div className="space-y-8" data-reveal="">
            <p className="inline-flex items-center gap-2.5 text-sm font-medium text-success"><span className="status-dot" aria-hidden="true" />{content.contact.availability}</p>
            <p className="text-text-secondary text-[1.0625rem] max-w-md">{content.contact.intro}</p>
            <div className="space-y-5">
              <Detail icon={<Mail size={18} />} label="Email">
                <a href={"mailto:" + content.contact.email} className="text-link [overflow-wrap:anywhere]"><span className="min-w-0">{content.contact.email}</span><ArrowUpRight size={15} className="shrink-0" aria-hidden="true" /></a>
              </Detail>
              {hasContent(phone) && (
                <Detail icon={<Phone size={18} />} label="Phone">
                  <a href={"tel:" + phone!.replace(/[^+\d]/g, "")} className="text-link">{phone}<ArrowUpRight size={15} className="shrink-0" aria-hidden="true" /></a>
                </Detail>
              )}
              <Detail icon={<MapPin size={18} />} label="Based in">
                <p className="text-sm font-semibold text-ink">{content.contact.location}</p>
              </Detail>
            </div>
            <div className="flex flex-wrap gap-2.5">{socialLinks.filter(s => s.icon !== "mail").map(social => <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" className="icon-link" aria-label={social.label}><SocialGlyph icon={social.icon} /></a>)}</div>
          </div>
          {submitted ? (
            <div className="glass-strong card-elevated p-8 sm:p-10 flex flex-col items-start justify-center gap-5" role="status">
              <span className="size-12 rounded-full bg-success/10 text-success flex items-center justify-center"><Check size={24} aria-hidden="true" /></span>
              <h3 className="text-subheadline">Thanks for reaching out.</h3>
              <p className="text-text-secondary">Your message is on its way. I&apos;ll reply as soon as I can.</p>
              <Button type="button" variant="secondary" onClick={() => setSubmitted(false)}>Send another message</Button>
            </div>
          ) : (
            <form onSubmit={event => handleSubmit(onSubmit, onInvalid)(event)} className="card-elevated p-5 sm:p-8 space-y-5" noValidate aria-labelledby="contact-form-heading" data-reveal="" style={{ "--i": 1 } as React.CSSProperties}>
              <div><h3 id="contact-form-heading" className="text-subheadline">{content.contact.formTitle}</h3><p className="text-sm text-text-muted mt-2">{formspreeId ? "All fields are required." : "This opens a draft in your mail app. All fields are required."}</p></div>
              {errorFields.length > 0 && <div ref={summaryRef} tabIndex={-1} className="rounded-2xl border border-error/40 bg-error/[.05] p-4 text-sm" role="alert" aria-labelledby="contact-errors-heading">
                <p id="contact-errors-heading" className="text-error font-semibold">Please check the following fields:</p>
                <ul className="mt-2 space-y-1">{errorFields.map(key => <li key={key}><a href={"#contact-" + key} className="inline-flex min-h-11 items-center text-error underline" onClick={() => document.getElementById("contact-" + key)?.focus()}>{labels[key]}: {errors[key]?.message}</a></li>)}</ul>
              </div>}
              <div className="grid sm:grid-cols-2 gap-5">
                <Field name="name" error={errors.name?.message}><input {...register("name")} {...fieldProps("name")} type="text" autoComplete="name" placeholder="Your name" /></Field>
                <Field name="email" error={errors.email?.message}><input {...register("email")} {...fieldProps("email")} type="email" autoComplete="email" placeholder="you@example.com" /></Field>
              </div>
              <Field name="subject" error={errors.subject?.message}><input {...register("subject")} {...fieldProps("subject")} type="text" placeholder="What’s on your mind?" /></Field>
              <Field name="message" error={errors.message?.message}><textarea {...register("message")} {...fieldProps("message")} rows={5} placeholder="Tell me about your project, opportunity, or question…" /></Field>
              <input {...register("_gotcha")} type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              {submitError && <p role="alert" className="text-error text-sm">{submitError} <a className="underline inline-flex min-h-11 items-center" href={"mailto:" + content.contact.email}>Email {content.hero.firstName}</a></p>}
              {submitNotice && <p role="status" className="text-text-secondary text-sm">{submitNotice}</p>}
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>{submitting ? <><span className="spinner" aria-hidden="true" />Sending…</> : <>{formspreeId ? "Send message" : "Open email draft"}<Send size={16} aria-hidden="true" /></>}</Button>
            </form>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
