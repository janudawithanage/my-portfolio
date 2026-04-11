"use client";

import { motion } from "framer-motion";
import { Star, GitFork, ExternalLink } from "lucide-react";
import Link from "next/link";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { staggerItem } from "@/lib/motion";
import { placeholderRepos } from "@/data";
import { getLangColor, formatRelativeDate } from "@/lib/utils";
import type { GitHubRepo } from "@/types";

/**
 * TODO: Replace `placeholderRepos` with a real GitHub API call.
 *
 * Option 1 — Server Component fetch (recommended):
 *   const repos = await fetch(`https://api.github.com/users/janudaw/repos?sort=updated&per_page=12`, {
 *     headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
 *     next: { revalidate: 3600 },
 *   }).then(r => r.json());
 *
 * Option 2 — Route handler at /app/api/github/route.ts + client SWR.
 */

function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <motion.article
      variants={staggerItem}
      className="group flex flex-col p-5 rounded-xl border border-border bg-surface hover:border-accent/30 hover:bg-surface-hover transition-all duration-300 hover:shadow-[0_4px_20px_rgba(99,102,241,0.08)]"
    >
      {/* Repo name + external link */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sm text-text-primary hover:text-accent transition-colors truncate"
          aria-label={`Open ${repo.name} on GitHub`}
        >
          {repo.name}
        </Link>
        <Link
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted hover:text-accent shrink-0 transition-colors"
          aria-label="Open on GitHub"
        >
          <ExternalLink size={14} />
        </Link>
      </div>

      {/* Description */}
      <p className="text-text-muted text-xs leading-relaxed mb-4 flex-1 line-clamp-2">
        {repo.description ?? "No description provided."}
      </p>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {repo.topics.slice(0, 3).map((t) => (
            <Badge key={t} variant="outline" size="sm">
              {t}
            </Badge>
          ))}
        </div>
      )}

      {/* Footer meta */}
      <div className="flex items-center gap-4 text-xs text-text-muted mt-auto pt-3 border-t border-border">
        {repo.language && (
          <span className={`flex items-center gap-1.5 font-medium ${getLangColor(repo.language)}`}>
            <span className="w-2 h-2 rounded-full bg-current" />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star size={11} />
          {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          <GitFork size={11} />
          {repo.forks_count}
        </span>
        <span className="ml-auto">{formatRelativeDate(repo.updated_at)}</span>
      </div>
    </motion.article>
  );
}

export function GithubProjects() {
  return (
    <SectionWrapper id="github">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="GitHub"
          title="Open source & public work"
          description="A live snapshot of what I've been pushing to GitHub. More projects live at my profile."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {placeholderRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>

        <motion.div variants={staggerItem} className="flex justify-center">
          <Button variant="outline" size="lg" asChild>
            <Link
              href="https://github.com/janudaw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              View All on GitHub
              <ExternalLink size={14} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
