const field = (name, label, type = "text", extra = {}) => ({ name, label, type, ...extra });
const optional = (name, label, type = "text", extra = {}) => field(name, label, type, { optional: true, ...extra });
const header = [field("title", "Section title"), field("description", "Section introduction", "textarea", { optional: true, keepEmpty: true })];
const collection = (name, label, fields, initial, itemLabel, extra = {}) => field(name, label, "collection", { fields, initial, itemLabel, ...extra });
const dates = [field("startDate", "Start date"), field("endDate", "End date (or Present)")];
const recognitionFields = [field("title", "Title / role"), field("organisation", "Organisation / issuer"), field("date", "Date / date range"), optional("description", "Description (optional)", "textarea"), optional("url", "Credential / supporting URL (optional)", "url"), optional("logo", "Organisation logo (optional)", "image"), optional("image", "Supporting image (optional)", "image")];
const emptyListHelp = "Empty lists stay hidden on your portfolio until you save their first entry.";

/** Section names, used by the order & visibility screen. Keep in sync with src/lib/sections.ts. */
export const sectionNames = {
  about: "A little about me", stats: "Stats band", now: "Now", education: "Education", skills: "The toolkit",
  projects: "Selected work", experience: "Experience", security: "Security & CTF", recognition: "Recognition",
  writing: "Writing", talks: "Talks & publications", testimonials: "Testimonials",
};
const socialIconOptions = [["github", "GitHub"], ["linkedin", "LinkedIn"], ["x", "X / Twitter"], ["medium", "Medium"], ["devto", "Dev.to"], ["youtube", "YouTube"], ["instagram", "Instagram"], ["facebook", "Facebook"], ["dribbble", "Dribbble"], ["website", "Website / other"]];

export const contentFields = {
  layout: {
    label: "Section order & visibility",
    help: "Hero always comes first and Get in touch always comes last. Reorder the sections in between and switch any of them off. Sections without content stay hidden automatically, even when switched on, and section numbers follow the sections that are shown.",
    fields: [collection("sectionOrder", "Sections, top to bottom", [field("visible", "Show this section", "checkbox")], null, "section", { fixed: true, itemTitle: entry => (sectionNames[entry.id] ?? entry.id) + (entry.visible ? "" : " — switched off") })],
  },
  hero: { label: "Hero", fields: [field("firstName", "First name"), field("lastName", "Last name"), field("role", "Role / tagline"), field("bio", "Introduction", "textarea"), field("availability", "Availability text"), field("location", "Location"), field("image", "Hero photo", "image"), field("imageAlt", "Photo description"), field("primaryLabel", "Work button label"), field("secondaryLabel", "Contact button label"), field("cvLabel", "CV button label"), field("cvUrl", "CV PDF path or URL"), field("githubUrl", "GitHub profile URL", "url"), field("linkedinUrl", "LinkedIn profile URL", "url"), collection("facts", "Hero facts", [field("value", "Value"), field("label", "Label")], { value: "", label: "" }, "fact"), field("capabilities", "Areas of focus (one per line)", "lines"), field("marquee", "Moving skills strip (one per line)", "lines")] },
  about: { label: "A little about me", fields: [...header, field("lead", "Lead paragraph", "textarea"), field("paragraphs", "About paragraphs (one per line)", "lines"), field("image", "About photo", "image"), field("imageAlt", "Photo description"), field("study", "Study / qualification"), field("location", "Location"), field("linkLabel", "Contact link label")] },
  stats: {
    label: "Stats band", help: "A row of headline numbers that count up as they scroll into view. " + emptyListHelp,
    fields: [field("title", "Band name (read by screen readers)"), collection("items", "Stats", [field("value", "Value", "text", { placeholder: "15+" }), field("label", "Label", "text", { placeholder: "projects shipped" })], { value: "", label: "" }, "stat")],
  },
  now: {
    label: "Now", help: "Short notes on what you are building, learning and reading. " + emptyListHelp,
    fields: [...header, optional("updated", "Last updated (optional)", "text", { placeholder: "November 2026" }), collection("items", "Now items", [field("kind", "Type", "select", { options: [["building", "Building"], ["learning", "Learning"], ["reading", "Reading"], ["exploring", "Exploring"]] }), field("text", "What it is", "textarea"), optional("emoji", "Emoji (optional, replaces the icon)"), optional("url", "Link (optional)", "url")], { kind: "building", text: "" }, "now item")],
  },
  education: { label: "Education", fields: [...header, collection("entries", "Education entries", [field("institution", "Institution"), field("degree", "Degree / qualification"), field("field", "Field of study"), ...dates, field("location", "Location"), optional("description", "Description", "textarea", { keepEmpty: true }), field("highlights", "Highlights (one per line)", "lines"), optional("gpa", "GPA (optional)"), optional("result", "Result (optional)", "text", { placeholder: "AAA · Island rank 221" }), optional("logo", "Institution logo (optional)", "image")], { institution: "", degree: "", field: "", startDate: "", endDate: "Present", location: "", description: "", highlights: [] }, "education entry")] },
  skills: { label: "The toolkit", fields: [...header, collection("entries", "Skill categories", [field("title", "Category title"), field("icon", "Category icon", "select", { options: [["monitor", "Frontend / monitor"], ["server", "Backend / server"], ["cloud", "Cloud"], ["shield", "Security / shield"]] }), optional("description", "Category introduction", "textarea", { keepEmpty: true }), field("skills", "Skills (one per line)", "skills")], { title: "", icon: "monitor", description: "", skills: [] }, "skill category")] },
  projects: { label: "Selected Work heading", fields: [...header, field("linkLabel", "GitHub link label")] },
  experience: { label: "Experience", fields: [...header, collection("entries", "Experience entries", [field("company", "Company / organisation"), field("role", "Role"), ...dates, field("location", "Location"), field("type", "Experience type", "select", { options: [["full-time", "Full-time"], ["part-time", "Part-time"], ["internship", "Internship"], ["contract", "Contract"], ["freelance", "Freelance"], ["university", "University project"], ["personal", "Personal project"]] }), optional("description", "Description", "textarea", { keepEmpty: true }), field("highlights", "Highlights (one per line)", "lines"), field("tech", "Technologies (one per line)", "lines")], { company: "", role: "", startDate: "", endDate: "Present", location: "", type: "personal", description: "", highlights: [], tech: [] }, "experience entry")] },
  security: {
    label: "Security & CTF", help: "CTF events, challenge platforms and write-ups. " + emptyListHelp,
    fields: [...header, collection("entries", "Events & platforms", [field("title", "Event / platform"), optional("result", "Rank or result (optional)", "text", { placeholder: "Top 5% · 3rd place · 40 challenges solved" }), field("date", "Date / date range"), optional("description", "Description (optional)", "textarea"), optional("url", "Write-up URL (optional)", "url"), field("tags", "Tags (one per line)", "lines")], { title: "", date: "", tags: [] }, "CTF entry")],
  },
  recognition: { label: "Recognition", help: "Add your own awards, certifications and volunteering. Empty categories stay hidden on your portfolio until you save their first entry.", fields: [...header, ...[["awards", "Awards & Achievements"], ["certifications", "Certifications"], ["volunteering", "Volunteering & Leadership"]].map(([key, title]) => collection(key, title, recognitionFields, { title: "", organisation: "", date: "" }, key === "awards" ? "award" : key === "certifications" ? "certification" : "volunteering role"))] },
  writing: {
    label: "Writing", help: "Articles you have published anywhere. " + emptyListHelp,
    fields: [...header, collection("posts", "Articles", [field("title", "Title"), optional("platform", "Platform (optional)", "text", { placeholder: "Medium, Dev.to, Personal blog…" }), field("date", "Published date"), optional("excerpt", "Excerpt (optional)", "textarea"), field("url", "Article URL", "url"), optional("cover", "Cover image (optional)", "image")], { title: "", date: "", url: "" }, "article")],
  },
  talks: {
    label: "Talks & publications", help: "Talks, papers, posters and workshops. " + emptyListHelp,
    fields: [...header, collection("entries", "Talks & publications", [field("title", "Title"), field("type", "Type", "select", { options: [["talk", "Talk"], ["paper", "Paper"], ["poster", "Poster"], ["workshop", "Workshop"]] }), field("venue", "Venue / event"), field("date", "Date"), optional("description", "Description (optional)", "textarea"), optional("url", "Link to slides, paper or recording (optional)", "url")], { title: "", type: "talk", venue: "", date: "" }, "talk or publication")],
  },
  testimonials: {
    label: "Testimonials", help: "Quotes from people you have worked with. Add only words they have agreed to share. " + emptyListHelp,
    fields: [...header, collection("items", "Testimonials", [field("quote", "Quote", "textarea"), field("name", "Name"), optional("role", "Role (optional)"), optional("company", "Company (optional)"), optional("avatar", "Photo (optional)", "image"), optional("url", "Profile link (optional)", "url")], { quote: "", name: "" }, "testimonial")],
  },
  contact: { label: "Get in touch", fields: [...header, field("availability", "Availability text"), field("intro", "Contact introduction", "textarea"), field("email", "Contact email", "email"), optional("phone", "Phone (optional)", "tel"), field("location", "Location"), field("formTitle", "Form heading"), field("footerText", "Footer introduction", "textarea"), collection("socials", "More profiles (shown with GitHub and LinkedIn)", [field("label", "Label"), field("url", "Profile URL", "url"), field("icon", "Icon", "select", { options: socialIconOptions })], { label: "", url: "", icon: "website" }, "profile")] },
};
