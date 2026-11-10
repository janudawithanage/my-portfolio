import { cp, mkdtemp, mkdir, writeFile, symlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

// The fixture routes and mock API live only in this disposable copy.
// The working app, its environment files, and its dev server remain independent.
const root = process.cwd();
const directory = await mkdtemp(path.join(tmpdir(), "januda-portfolio-ui-"));
for (const entry of ["src", "public", "package.json", "package-lock.json", "tsconfig.json", "next.config.ts", "postcss.config.mjs"]) {
  await cp(path.join(root, entry), path.join(directory, entry), { recursive: true });
}
// Keep the automatic-feed regressions independent of the owner's live selections.
await writeFile(path.join(directory, "src/data/experiments.json"), JSON.stringify({ mode: "automatic", projects: [] }));
// Populate only the disposable app to exercise Recognition and navigation end to end.
const fixtureContent = JSON.parse(await (await import("node:fs/promises")).readFile(path.join(directory, "src/data/content.json"), "utf8"));
fixtureContent.recognition.awards = [{ id: "award-fixture", title: "Test award", organisation: "Test society", date: "2026", description: "Test fixture only." }];
fixtureContent.recognition.certifications = Array.from({ length: 8 }, (_, index) => ({ id: "cert-" + index, title: "Test certificate " + (index + 1), organisation: "Test issuer", date: "October 2026", url: "https://example.com/credential/" + index, ...(index === 0 ? { image: "/images/photo2.webp" } : {}) }));
fixtureContent.recognition.volunteering = [{ id: "role-fixture", title: "Test volunteer role", organisation: "Test community", date: "2025 — Present", description: "Test fixture only.", image: "/images/photo2.webp" }];
// New optional sections: Stats, Security and Writing render; Now has an item but is switched off
// in the section order; Talks and Testimonials stay empty and must not render or reach navigation.
fixtureContent.stats.items = [
  { id: "stat-1", value: "15+", label: "Test projects shipped" },
  { id: "stat-2", value: "8", label: "Test certifications" },
  { id: "stat-3", value: "3.9", label: "Test GPA" },
  { id: "stat-4", value: "40", label: "Test CTF challenges" },
];
fixtureContent.now.items = [{ id: "now-hidden", kind: "building", text: "Test fixture: switched off in the section order", emoji: "🛠️" }];
fixtureContent.layout.sectionOrder = fixtureContent.layout.sectionOrder.map(entry => entry.id === "now" ? { ...entry, visible: false } : entry);
fixtureContent.security.entries = [
  { id: "ctf-1", title: "Test CTF 2026", result: "Top 5%", date: "October 2026", description: "Test fixture only.", url: "https://example.com/writeup/1", tags: ["web", "crypto"] },
  { id: "ctf-2", title: "Test challenge platform", date: "2026", tags: [] },
];
fixtureContent.writing.posts = Array.from({ length: 8 }, (_, index) => ({ id: "post-" + index, title: "Test article " + (index + 1), platform: "Test blog", date: "2026", url: "https://example.com/post/" + index, ...(index === 0 ? { excerpt: "Test fixture only.", cover: "/images/photo2.webp" } : {}) }));
await writeFile(path.join(directory, "src/data/content.json"), JSON.stringify(fixtureContent));
await symlink(path.join(root, "node_modules"), path.join(directory, "node_modules"), "dir");
const repositories = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: index === 0 ? "a-repository-with-a-long-name-to-check-that-essential-text-always-wraps" : "portfolio-experiment-" + (index + 1),
  description: "A small engineering project exploring reliable services and accessible interfaces.",
  html_url: "https://github.com/example/portfolio-experiment-" + (index + 1),
  homepage: null,
  language: index % 2 ? "TypeScript" : "Python",
  stargazers_count: index,
  forks_count: 0,
  topics: index === 0 ? ["portfolio", "responsive-design", "distributed-systems"] : ["typescript"],
  updated_at: "2026-10-01T12:00:00Z",
  fork: false,
}));
const shim = path.join(directory, "mock-github.cjs");
await writeFile(shim, `const originalFetch = globalThis.fetch;
const repos = ${JSON.stringify(repositories)};
globalThis.fetch = (input, options) => {
  const url = String(input instanceof Request ? input.url : input);
  if (url.startsWith("https://api.github.com/users/")) return Promise.resolve(new Response(JSON.stringify(repos), {status:200,headers:{"Content-Type":"application/json"}}));
  return originalFetch(input, options);
};`);
const fixtureDirectory = path.join(directory, "src/app/ui-fixtures/[state]");
await mkdir(fixtureDirectory, { recursive: true });
await writeFile(path.join(fixtureDirectory, "page.tsx"), `import { notFound } from "next/navigation";
import { Recognition } from "@/components/sections/Recognition";
import { GithubProjectsGrid } from "@/components/sections/GithubProjectsGrid";
import { GithubProjectsSkeleton } from "@/components/sections/GithubProjectsSkeleton";
import type { GitHubFetchResult, GitHubRepo } from "@/types";
import { CuratedGithubProjects } from "@/components/sections/CuratedGithubProjects";
import { Now } from "@/components/sections/Now";
import { Talks } from "@/components/sections/Talks";
import { Testimonials } from "@/components/sections/Testimonials";
import savedProjects from "@/data/projects.json";
import type { Project } from "@/types";
const repos: GitHubRepo[] = ${JSON.stringify(repositories)};
export default async function Fixture({params}: {params: Promise<{state:string}>}) {
  const {state} = await params;
  if (state === "loading") return <GithubProjectsSkeleton />;
  if (state === "recognition-empty") return <Recognition data={{title:"Recognition",description:"",awards:[],certifications:[],volunteering:[]}} />;
  if (state === "showcase") return <>
    <Now data={{ title: "What I’m focused on now.", description: "Test fixture only.", updated: "November 2026", items: [
      { id: "n1", kind: "building", text: "Test fixture: a building item" },
      { id: "n2", kind: "learning", text: "Test fixture: a learning item", url: "https://example.com/learning" },
      { id: "n3", kind: "reading", text: "Test fixture: a reading item", emoji: "📚" },
    ] }} />
    <Talks data={{ title: "Talks & publications.", description: "Test fixture only.", entries: [
      { id: "t1", title: "Test talk", type: "talk", venue: "Test meetup", date: "2026", url: "https://example.com/talk" },
      { id: "t2", title: "Test paper", type: "paper", venue: "Test conference", date: "2025", description: "Test fixture only." },
      { id: "t3", title: "Test poster", type: "poster", venue: "Test symposium", date: "2025" },
    ] }} />
    <Testimonials data={{ title: "Kind words from collaborators.", description: "Test fixture only.", items: [
      { id: "q1", quote: "Test fixture quote one. Thoughtful, calm and quick to unblock the team.", name: "Test Person One", role: "Engineering lead", company: "Test company", avatar: "/images/photo2.webp", url: "https://example.com/one" },
      { id: "q2", quote: "Test fixture quote two.", name: "Test Person Two", role: "Designer" },
      { id: "q3", quote: "Test fixture quote three.", name: "Test Person Three" },
    ] }} />
  </>;
  if (state === "curated" || state === "curated-empty") {
    const projects: Project[] = state === "curated-empty" ? [] : Array.from({length: 8}, (_, index) => ({
      ...savedProjects[index % savedProjects.length], id: "curated-" + index,
      title: "Curated experiment " + (index + 1), status: "in-progress",
      description: "A curated description saved independently of GitHub.",
      githubUrl: "https://github.com/example/curated-" + index,
    }));
    return <section className="container-section section-padding"><h1 className="text-headline mb-6">Open source &amp; experiments</h1><CuratedGithubProjects projects={projects} profileUrl="https://github.com/example" /></section>;
  }
  const result: GitHubFetchResult = state === "error" ? {status:"error",message:"Fixture failure"}
    : state === "empty" ? {status:"empty"}
    : state === "success" ? {status:"success",repos,syncedAt:"2026-10-01T12:00:00Z"} : notFound();
  return <section className="container-section section-padding"><h1 className="text-headline mb-6">Repository preview</h1><GithubProjectsGrid result={result} profileUrl="https://github.com/example" renderedAt="2026-10-06T12:00:00Z" /></section>;
}`);
const child = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "dev", "--webpack", "--hostname", "127.0.0.1", "--port", "3032"], {
  cwd: directory,
  stdio: "inherit",
  env: { ...process.env, GITHUB_TOKEN: "ui-test-token", GITHUB_USERNAME: "example", NEXT_PUBLIC_FORMSPREE_ID: "portfolio-ui-test", NODE_OPTIONS: (process.env.NODE_OPTIONS || "") + " --require=" + shim },
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("exit", async code => { await rm(directory, { recursive: true, force: true }); process.exit(code ?? 0); });
