import { readFile, writeFile, mkdir, rename, rm, lstat, realpath } from "node:fs/promises";
import { randomUUID, createHash } from "node:crypto";
import path from "node:path";
import { z } from "zod";

const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const text = max => z.string().trim().min(1).max(max);
const optionalText = max => z.string().trim().max(max).optional();
const id = z.string().regex(/^[a-z0-9][a-z0-9._-]{0,159}$/);
const strings = z.array(text(1000)).max(60);
const image = z.string().max(240).regex(/^\/(?:images\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:png|jpe?g|webp)|staged\/[a-f0-9-]+)$/i, "Use an uploaded image.");
const url = z.string().max(2048).refine(value => {
  try { const parsed = new URL(value); return ["http:", "https:"].includes(parsed.protocol) && !parsed.username && !parsed.password; } catch { return false; }
}, "Enter a complete http:// or https:// URL.");
const header = { title: text(200), description: z.string().trim().max(3000) };
const entries = schema => z.array(schema).max(200).superRefine((items, ctx) => {
  const ids = new Set();
  for (const item of items) { if (ids.has(item.id)) ctx.addIssue({ code: "custom", message: "Each entry needs a unique ID." }); ids.add(item.id); }
});
const recognitionEntry = z.object({ id, title: text(160), organisation: text(200), date: text(120), description: optionalText(5000), url: url.optional(), image: image.optional() }).strict();
export const contentSchemas = {
  hero: z.object({ firstName: text(100), lastName: text(100), role: text(200), bio: text(3000), availability: text(200), location: text(200), image, imageAlt: text(250), cvUrl: z.union([url, z.string().regex(/^\/[a-zA-Z0-9/_-]+\.pdf$/i)]), primaryLabel: text(80), secondaryLabel: text(80), cvLabel: text(80), facts: z.array(z.object({ value: text(80), label: text(120) }).strict()).max(10), capabilities: strings, marquee: strings, githubUrl: url, linkedinUrl: url }).strict(),
  about: z.object({ ...header, lead: text(3000), paragraphs: z.array(text(5000)).max(20), image, imageAlt: text(250), study: text(200), location: text(200), linkLabel: text(200) }).strict(),
  education: z.object({ ...header, entries: entries(z.object({ id, institution: text(250), degree: text(200), field: text(200), startDate: text(100), endDate: text(100), location: text(200), description: z.string().trim().max(5000), highlights: strings, gpa: optionalText(100), result: optionalText(100), logo: image.optional() }).strict()) }).strict(),
  skills: z.object({ ...header, entries: entries(z.object({ id, title: text(200), icon: z.enum(["monitor", "server", "cloud", "shield"]), description: z.string().trim().max(1000), skills: z.array(z.object({ name: text(100), level: z.number().min(1).max(100).optional(), icon: optionalText(100) }).strict()).max(60) }).strict()) }).strict(),
  projects: z.object({ ...header, linkLabel: text(120) }).strict(),
  experience: z.object({ ...header, entries: entries(z.object({ id, company: text(200), role: text(200), startDate: text(100), endDate: text(100), location: text(200), type: z.enum(["full-time", "part-time", "internship", "contract", "freelance", "university", "personal"]), description: z.string().trim().max(5000), highlights: strings, tech: strings }).strict()) }).strict(),
  recognition: z.object({ ...header, awards: entries(recognitionEntry), certifications: entries(recognitionEntry), volunteering: entries(recognitionEntry) }).strict(),
  contact: z.object({ ...header, availability: text(200), intro: text(3000), email: z.string().trim().email().max(250), location: text(200), formTitle: text(200), footerText: text(1000) }).strict(),
};

function imageReferences(value) {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => ["image", "logo"].includes(key) && typeof child === "string" ? [{ object: value, key, value: child }] : imageReferences(child));
}

export function createContentStore({ root, staged, clearStaged, EditorError }) {
  const filename = path.join(root, "src/data/content.json");
  const publicRoot = path.join(root, "public");
  const imagesDirectory = path.join(publicRoot, "images/content");
  async function state(section) {
    const all = JSON.parse(await readFile(filename, "utf8"));
    return { content: all[section], revision: hash(JSON.stringify(all[section])) };
  }
  async function save(body, section) {
    const parsed = z.object({ content: contentSchemas[section], revision: z.string() }).strict().safeParse(body);
    if (!parsed.success) throw new EditorError(400, parsed.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("\n"));
    const original = await readFile(filename);
    const all = JSON.parse(original);
    if (hash(JSON.stringify(all[section])) !== parsed.data.revision) throw new EditorError(409, "This section changed on disk. Copy your edits, then Discard to reload before saving.");
    const content = parsed.data.content;
    const references = imageReferences(content);
    const canonicalPublicRoot = await realpath(publicRoot);
    for (const reference of references) {
      if (reference.value.startsWith("/staged/") && staged.get(reference.value)?.section === section) continue;
      if (reference.value.startsWith("/staged/")) throw new EditorError(400, "This image belongs to another section or expired. Upload it again.");
      const target = path.join(publicRoot, reference.value.slice(1));
      const canonicalTarget = await realpath(target).catch(() => "");
      const info = await lstat(target).catch(() => null);
      if (!canonicalTarget.startsWith(canonicalPublicRoot + path.sep) || !info?.isFile() || info.isSymbolicLink()) throw new EditorError(400, "Image is missing or invalid. Upload it again.");
    }
    let temporaryPath;
    try {
      const savedImages = new Map();
      for (const reference of references) {
        if (!reference.value.startsWith("/staged/")) continue;
        if (!savedImages.has(reference.value)) {
          await mkdir(imagesDirectory, { recursive: true });
          const upload = staged.get(reference.value);
          const name = `content-${randomUUID()}.${upload.extension}`;
          await writeFile(path.join(imagesDirectory, name), upload.bytes, { flag: "wx" });
          savedImages.set(reference.value, `/images/content/${name}`);
        }
        reference.object[reference.key] = savedImages.get(reference.value);
      }
      all[section] = content;
      temporaryPath = `${filename}.${randomUUID()}.tmp`;
      await writeFile(temporaryPath, JSON.stringify(all, null, 2) + "\n", { flag: "wx" });
      if (hash(await readFile(filename)) !== hash(original)) throw new EditorError(409, "Content changed on disk during save. Copy your edits, then Discard to reload.");
      await rename(temporaryPath, filename);
      temporaryPath = undefined;
      clearStaged(section);
      return { content, revision: hash(JSON.stringify(content)) };
    } finally { if (temporaryPath) await rm(temporaryPath, { force: true }); }
  }
  return { state, save };
}
