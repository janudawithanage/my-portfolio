"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Mail, MapPin, Send } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { content, hasRecognition, socialLinks } from "@/data";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter a name with at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  subject: z.string().trim().min(5, "Add a subject with at least 5 characters."),
  message: z.string().trim().min(20, "Tell me a little more — at least 20 characters."),
});
type ContactFormData = z.infer<typeof contactSchema>;
const labels: Record<keyof ContactFormData, string> = { name: "Name", email: "Email", subject: "Subject", message: "Message" };

function Field({ name, error, children }: { name: keyof ContactFormData; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1"><label htmlFor={"contact-" + name} className="text-sm font-medium">{labels[name]}</label><span className="text-text-muted" aria-hidden="true">*</span></div>
      {children}
      {error && <p id={"contact-" + name + "-error"} className="text-error text-sm">{error}</p>}
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
  const errorFields = (Object.keys(labels) as (keyof ContactFormData)[]).filter(key => errors[key]);
  const fieldProps = (name: keyof ContactFormData) => ({
    id: "contact-" + name,
    className: "contact-input",
    required: true,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? "contact-" + name + "-error" : undefined,
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    setSubmitError(null);
    setSubmitNotice(null);
    try {
      if (formspreeId) {
        const response = await fetch("https://formspree.io/f/" + formspreeId, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Submission failed");
        setSubmitted(true);
        reset();
      } else {
        const body = "Name: " + data.name + "\nEmail: " + data.email + "\n\n" + data.message;
        window.location.href = "mailto:" + content.contact.email + "?subject=" + encodeURIComponent(data.subject) + "&body=" + encodeURIComponent(body);
        setSubmitNotice("An email draft should open in your mail app. Send it there to complete your message.");
      }
    } catch {
      setSubmitError("Your message couldn’t be sent. Please try again, or email me directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="contact" className="section-border">
      <span id="cta" className="block" aria-hidden="true" />
      <div className="container-section">
        <SectionHeader eyebrow={(hasRecognition ? "07" : "06") + " / Get in touch"} title={content.contact.title} description={content.contact.description} />
        <div className="grid lg:grid-cols-[.85fr_1.15fr] gap-8 lg:gap-16">
          <div className="space-y-7">
            <div className="flex items-center gap-2 text-sm text-success"><span className="status-dot" aria-hidden="true" />{content.contact.availability}</div>
            <p className="text-text-secondary max-w-md">{content.contact.intro}</p>
            <div className="space-y-4">
              <div><p className="text-xs text-text-muted mb-1">EMAIL</p><a href={"mailto:" + content.contact.email} className="text-link [overflow-wrap:anywhere]"><Mail size={17} className="shrink-0 text-accent" aria-hidden="true" /><span className="min-w-0">{content.contact.email}</span><ArrowUpRight size={15} className="shrink-0" aria-hidden="true" /></a></div>
              <div><p className="text-xs text-text-muted mb-2">BASED IN</p><p className="flex items-center gap-2 text-text-secondary"><MapPin size={17} className="text-accent" aria-hidden="true" />{content.contact.location}</p></div>
            </div>
            <div className="flex gap-3">{socialLinks.filter(s => s.icon !== "mail").map(social => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="icon-link" aria-label={social.label}>{social.icon === "github" ? <GithubIcon size={18} /> : <LinkedinIcon size={18} />}</a>)}</div>
          </div>
          {submitted ? (
            <motion.div initial={false} animate={{ opacity: 1 }} className="card p-8 sm:p-10 flex flex-col items-start justify-center gap-5" role="status">
              <span className="size-12 rounded-full bg-success/10 text-success flex items-center justify-center"><Check size={24} aria-hidden="true" /></span>
              <h3 className="text-subheadline">Thanks for reaching out.</h3>
              <p className="text-text-secondary">Your message is on its way. I&apos;ll reply as soon as I can.</p>
              <Button type="button" variant="secondary" onClick={() => setSubmitted(false)}>Send another message</Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit, () => requestAnimationFrame(() => summaryRef.current?.focus()))} className="card p-5 sm:p-7 space-y-5" noValidate aria-labelledby="contact-form-heading">
              <div><h3 id="contact-form-heading" className="text-subheadline">{content.contact.formTitle}</h3><p className="text-sm text-text-muted mt-2">{formspreeId ? "All fields are required." : "This opens a draft in your mail app. All fields are required."}</p></div>
              {errorFields.length > 0 && <div ref={summaryRef} tabIndex={-1} className="rounded-lg border border-error/50 bg-error/5 p-4 text-sm" role="alert" aria-labelledby="contact-errors-heading">
                <p id="contact-errors-heading" className="text-error font-medium">Please check the following fields:</p>
                <ul className="mt-2 space-y-1">{errorFields.map(key => <li key={key}><a href={"#contact-" + key} className="inline-flex min-h-11 items-center text-error underline" onClick={() => document.getElementById("contact-" + key)?.focus()}>{labels[key]}: {errors[key]?.message}</a></li>)}</ul>
              </div>}
              <div className="grid sm:grid-cols-2 gap-5">
                <Field name="name" error={errors.name?.message}><input {...register("name")} {...fieldProps("name")} type="text" autoComplete="name" placeholder="Your name" /></Field>
                <Field name="email" error={errors.email?.message}><input {...register("email")} {...fieldProps("email")} type="email" autoComplete="email" placeholder="you@example.com" /></Field>
              </div>
              <Field name="subject" error={errors.subject?.message}><input {...register("subject")} {...fieldProps("subject")} type="text" placeholder="What’s on your mind?" /></Field>
              <Field name="message" error={errors.message?.message}><textarea {...register("message")} {...fieldProps("message")} rows={5} placeholder="Tell me about your project, opportunity, or question…" /></Field>
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
