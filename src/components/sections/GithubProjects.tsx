/**
 * GithubProjects — async React Server Component.
 *
 * Strategy:
 *   • ISR (Incremental Static Regeneration) with a 1-hour revalidation window.
 *   • On Vercel: the page HTML is rebuilt in the background once per hour.
 *     Every visitor gets instant cached HTML — the GitHub API is never hit
 *     per-request in production.
 *   • `syncedAt` is stamped at the moment the server renders so the client
 *     `SyncIndicator` can display an accurate "Last synced X ago" without
 *     an extra round-trip to the server.
 *   • The GitHub token lives exclusively in this module's execution context
 *     (Node.js server) — it is never serialised into the client bundle.
 */
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { GithubProjectsGrid } from "./GithubProjectsGrid";
import { fetchGitHubRepos } from "@/lib/github";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "janudawithanage";

export async function GithubProjects() {
  const result = await fetchGitHubRepos();
  const profileUrl = `https://github.com/${GITHUB_USERNAME}`;
  const renderedAt = new Date().toISOString();

  return (
    <SectionWrapper id="github">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="GitHub Activity"
          title="More work on GitHub"
          description="Explore public repositories covering coursework, experiments, and personal projects. GitHub data uses hourly cache revalidation."
        />

        <GithubProjectsGrid result={result} profileUrl={profileUrl} renderedAt={renderedAt} />
      </div>
    </SectionWrapper>
  );
}
