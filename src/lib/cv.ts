import { statSync } from "node:fs";
import path from "node:path";
import { content } from "@/data";

export interface CvFile {
  href: string;
  label: string;
  /** Hosted elsewhere: opens in a new tab instead of downloading. */
  external: boolean;
  /** "182 KB", for a PDF stored in public/. */
  size?: string;
}

const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/** The CV, or null when none is set or its PDF is missing from public/, so a link never 404s. Server only. */
export function getCv(): CvFile | null {
  const { cvUrl, cvLabel } = content.hero;
  if (!cvUrl) return null;
  if (/^https?:\/\//i.test(cvUrl)) return { href: cvUrl, label: cvLabel, external: true };
  try {
    const info = statSync(path.join(process.cwd(), "public", cvUrl));
    return info.isFile() ? { href: cvUrl, label: cvLabel, external: false, size: formatSize(info.size) } : null;
  } catch {
    return null;
  }
}
