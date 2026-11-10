/**
 * GitHub API integration — SERVER-SIDE ONLY.
 *
 * ─── Endpoint ───────────────────────────────────────────────────────────────
 * GET /users/{username}/repos?type=public&sort=updated&per_page=100
 *
 * Why this endpoint instead of GET /search/repositories?
 *   • We only want repos owned by a single user — not a cross-GitHub search.
 *   • type=public guarantees we never accidentally surface private repos.
 *   • per_page=100 (the API maximum) pulls all repos in one round-trip.
 *   • /search has a much tighter unauthenticated rate limit (10 req/min) vs
 *     the core endpoints limit of 60 req/hr (or 5 000/hr with a token).
 *   • ISR caching means we rarely hit the API at all in production.
 *
 * ─── Rate limits ────────────────────────────────────────────────────────────
 *   Unauthenticated : 60  req / hr
 *   Authenticated   : 5 000 req / hr   ← add GITHUB_TOKEN to .env.local
 *
 * ─── Featured repos strategy ────────────────────────────────────────────────
 *   Tag any repo on GitHub with the topic "featured" or "portfolio" and it
 *   will automatically float to the top of this section.  No code changes
 *   needed — just visit  Repository → ⚙️ Settings → Topics  on GitHub.com.
 */

import type { GitHubRepo, GitHubFetchResult } from "@/types";

// ─── Config ────────────────────────────────────────────────────────────────────

/**
 * GitHub username — read from env so it never needs a code change.
 * NOT prefixed with NEXT_PUBLIC_: this module only runs on the server.
 */
const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "janudawithanage";

/**
 * Personal Access Token (PAT) or Fine-Grained Token.
 * ⚠️  Never prefix with NEXT_PUBLIC_ — must stay server-side.
 * Grants "Public Repositories (read)" scope — no write permissions needed.
 */
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Repo topics that trigger the "featured" pin behaviour.
 * Adding either topic to a repo on GitHub is all that is required.
 */
export const FEATURED_TOPICS = ["featured", "portfolio"] as const;
export type FeaturedTopic = (typeof FEATURED_TOPICS)[number];

/** Warn about a missing token once per server process, not on every fetch. */
let warnedAboutMissingToken = false;

/** Maximum repos shown in the GitHub section. */
const MAX_DISPLAY = 12;

/**
 * ISR revalidation window in seconds (1 hour).
 * Next.js will serve the cached page and silently refresh in the background
 * once this window has elapsed — zero extra latency for visitors.
 */
export const GITHUB_REVALIDATE = 3600;

// ─── Public utilities (importable in tests / other modules) ────────────────────

/**
 * Returns true when the repo carries a featured-tier topic.
 */
export function isFeaturedRepo(repo: GitHubRepo): boolean {
  return repo.topics.some((t) =>
    (FEATURED_TOPICS as readonly string[]).includes(t)
  );
}

/**
 * Removes forks from the list.
 *
 * Extend here if you also want to exclude archived repos:
 *   .filter(r => !r.fork && !r.archived)
 */
export function filterRepos(repos: GitHubRepo[]): GitHubRepo[] {
  return repos.filter((r) => !r.fork);
}

/**
 * Three-tier sort (all descending):
 *   1. Featured  — repos tagged "featured" or "portfolio" appear first
 *   2. Stars     — higher star count wins within each tier
 *   3. Updated   — most recently pushed repo breaks star ties
 */
export function sortRepos(repos: GitHubRepo[]): GitHubRepo[] {
  return [...repos].sort((a, b) => {
    const aFeat = isFeaturedRepo(a);
    const bFeat = isFeaturedRepo(b);

    if (aFeat !== bFeat) return aFeat ? -1 : 1;

    if (a.stargazers_count !== b.stargazers_count) {
      return b.stargazers_count - a.stargazers_count;
    }

    return (
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  });
}

// ─── Main fetch function ────────────────────────────────────────────────────────

/**
 * Fetches, filters, and sorts the user's public GitHub repos.
 *
 * Call this ONLY from a Server Component, Route Handler, or Server Action.
 * The function relies on `process.env.GITHUB_TOKEN` which is unavailable
 * in client bundles.
 *
 * @returns A discriminated union — handle all three `status` values:
 *   "success" | "error" | "empty"
 */
export async function fetchGitHubRepos(): Promise<GitHubFetchResult> {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      // Pin the API version so behaviour never changes under us
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    } else if (!warnedAboutMissingToken) {
      warnedAboutMissingToken = true;
      console.warn(
        "[GitHub API] No GITHUB_TOKEN found. " +
          "Unauthenticated requests are rate-limited to 60/hr. " +
          "Add GITHUB_TOKEN=<your_token> to .env.local for production use."
      );
    }

    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos` +
        `?type=public&sort=updated&per_page=100`,
      {
        headers,
        // ISR: revalidate the cached response after GITHUB_REVALIDATE seconds.
        // Visitors always get an instant response; GitHub is only hit once per
        // revalidation window regardless of traffic volume.
        next: { revalidate: GITHUB_REVALIDATE },
      }
    );

    if (!res.ok) {
      const body: Record<string, unknown> = await res.json().catch(() => ({}));
      const message = deriveErrorMessage(res.status, body);
      console.error(`[GitHub API] HTTP ${res.status}`, body);
      return { status: "error", message };
    }

    const raw: GitHubRepo[] = await res.json();
    const repos = sortRepos(filterRepos(raw)).slice(0, MAX_DISPLAY);

    return repos.length === 0
      ? { status: "empty" }
      : { status: "success", repos, syncedAt: new Date().toISOString() };
  } catch (err) {
    console.error("[GitHub API] Network error:", err);
    return {
      status: "error",
      message:
        "Unable to reach the GitHub API. " +
        "Check your connection or try again shortly.",
    };
  }
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function deriveErrorMessage(
  status: number,
  body: Record<string, unknown>
): string {
  switch (status) {
    case 401:
      return "GitHub token is invalid or expired. Update GITHUB_TOKEN in .env.local.";
    case 403: {
      const msg = String(body?.message ?? "").toLowerCase();
      return msg.includes("rate limit")
        ? "GitHub API rate limit exceeded. A GITHUB_TOKEN is strongly recommended for production."
        : "GitHub API access forbidden (403). Verify your token scopes.";
    }
    case 404:
      return `GitHub user "${GITHUB_USERNAME}" was not found. Check GITHUB_USERNAME in .env.local.`;
    default:
      return `GitHub API returned an unexpected status (${status}). Check server logs for details.`;
  }
}
