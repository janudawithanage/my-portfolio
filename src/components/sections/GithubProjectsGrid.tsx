"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, GitFork, FolderGit2, Star, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GithubIcon } from "@/components/ui/icons";
import { getLangColor, formatRelativeDate, formatGitHubDate } from "@/lib/utils";
import { useRelativeTime } from "@/hooks/useRelativeTime";
import type { GitHubRepo, GitHubFetchResult } from "@/types";

function RepoCard({ repo, referenceTime }: { repo: GitHubRepo; referenceTime: number }) {
  const featured = repo.topics.some(topic => topic === "featured" || topic === "portfolio");
  const topics = repo.topics.filter(topic => topic !== "featured" && topic !== "portfolio");
  return (
    <article className="card repo-card">
      <div className="flex items-center justify-between gap-3">
        <FolderGit2 size={19} className="text-accent" aria-hidden="true" />
        {featured && <Badge variant="accent">Featured</Badge>}
      </div>
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-name" aria-label={"Open " + repo.name + " on GitHub"}>
        <span className="min-w-0">{repo.name.replaceAll("-", " ")}</span><ArrowUpRight className="shrink-0" size={17} aria-hidden="true" />
      </a>
      <p className="text-text-secondary leading-relaxed">{repo.description ?? "An experiment, a learning exercise, or a work in progress. Explore the code on GitHub."}</p>
      {topics.length > 0 && <ul className="flex flex-wrap gap-2 mt-1" aria-label={repo.name + " topics"}>{topics.map(topic => <li key={topic}><Badge variant="outline">{topic}</Badge></li>)}</ul>}
      <div className="repo-meta">
        {repo.language && <span className={"flex items-center gap-1.5 " + getLangColor(repo.language)}><span className="size-1.5 rounded-full bg-current" aria-hidden="true" />{repo.language}</span>}
        <span className="flex items-center gap-1" aria-label={repo.stargazers_count + " stars"}><Star size={13} aria-hidden="true" />{repo.stargazers_count}</span>
        <span className="flex items-center gap-1" aria-label={repo.forks_count + " forks"}><GitFork size={13} aria-hidden="true" />{repo.forks_count}</span>
        <time dateTime={repo.updated_at} title={"Updated " + formatGitHubDate(repo.updated_at)} className="sm:ml-auto">Updated {formatRelativeDate(repo.updated_at, referenceTime)}</time>
      </div>
    </article>
  );
}

function RepositoryNotice({ error }: { error: boolean }) {
  const Icon = error ? AlertCircle : FolderGit2;
  return (
    <div className="card py-12 px-6 text-center flex flex-col items-center gap-4" role="status">
      <Icon size={28} className="text-accent" aria-hidden="true" />
      <h3 className="text-subheadline">{error ? "Repositories are unavailable right now." : "No public repositories to show yet."}</h3>
      <p className="max-w-md text-text-secondary">{error ? "You can still explore my latest work directly on GitHub." : "Visit my GitHub profile for the latest projects and experiments."}</p>
    </div>
  );
}

interface GithubProjectsGridProps {
  result: GitHubFetchResult;
  profileUrl: string;
  renderedAt: string;
}

export function GithubProjectsGrid({ result, profileUrl, renderedAt }: GithubProjectsGridProps) {
  const [expanded, setExpanded] = useState(false);
  const [referenceTime, setReferenceTime] = useState(() => new Date(renderedAt).getTime());
  const relative = useRelativeTime(result.status === "success" ? result.syncedAt : renderedAt);

  useEffect(() => {
    const timer = setInterval(() => setReferenceTime(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const visibleRepos = result.status === "success" ? result.repos.slice(0, expanded ? undefined : 6) : [];
  return (
    <>
      {result.status === "success" ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted mb-5">
            <p aria-live="polite" aria-atomic="true">Showing {visibleRepos.length} of {result.repos.length} public {result.repos.length === 1 ? "repository" : "repositories"}</p>
            <time dateTime={result.syncedAt}>Last refreshed {relative ?? formatGitHubDate(result.syncedAt)}</time>
          </div>
          <div id="github-repositories" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleRepos.map(repo => <RepoCard key={repo.id} repo={repo} referenceTime={referenceTime} />)}
          </div>
        </>
      ) : <RepositoryNotice error={result.status === "error"} />}
      <div className="flex flex-wrap gap-3 mt-6">
        {result.status === "success" && result.repos.length > 6 && (
          <Button type="button" variant="secondary" onClick={() => setExpanded(value => !value)} aria-expanded={expanded} aria-controls="github-repositories">
            {expanded ? "Show fewer" : "Show all " + result.repos.length + " repositories"}<ChevronDown size={16} className={expanded ? "rotate-180" : ""} aria-hidden="true" />
          </Button>
        )}
        <Button asChild variant="outline"><a href={profileUrl} target="_blank" rel="noopener noreferrer"><GithubIcon size={16} />View GitHub profile<ArrowUpRight size={15} aria-hidden="true" /></a></Button>
      </div>
    </>
  );
}
