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
import { GithubProjectsGrid } from "@/components/sections/GithubProjectsGrid";
import { GithubProjectsSkeleton } from "@/components/sections/GithubProjectsSkeleton";
import type { GitHubFetchResult, GitHubRepo } from "@/types";
const repos: GitHubRepo[] = ${JSON.stringify(repositories)};
export default async function Fixture({params}: {params: Promise<{state:string}>}) {
  const {state} = await params;
  if (state === "loading") return <GithubProjectsSkeleton />;
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
