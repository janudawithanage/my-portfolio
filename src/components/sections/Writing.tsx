import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { content } from "@/data";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Expandable } from "@/components/ui/Expandable";
import { hasContent } from "@/lib/has-content";
import { sectionEyebrow } from "@/lib/sections";
import type { WritingContent } from "@/types";

export function Writing({ data = content.writing }: { data?: WritingContent }) {
  if (!hasContent(data.posts)) return null;
  return (
    <SectionWrapper id="writing" className="section-border" labelledBy="writing-title">
      <div className="container-section">
        <SectionHeader eyebrow={sectionEyebrow("writing")} title={data.title} titleId="writing-title" description={data.description} />
        <Expandable id="writing-list" className="list-grid list-grid-2 list-grid-3" items={data.posts.map(post => (
          <article key={post.id} className="glass post-card" data-tilt="">
            {hasContent(post.cover) && <div className="post-cover"><Image src={post.cover!} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, calc(100vw - 3rem)" className="object-cover" /></div>}
            <div className="post-body">
              <p className="text-meta">{[post.platform, post.date].filter(hasContent).join(" · ")}</p>
              <h3 className="text-subheadline"><a href={post.url} target="_blank" rel="noopener noreferrer" className="stretched-link transition-colors hover:text-accent">{post.title}</a></h3>
              {hasContent(post.excerpt) && <p className="text-sm text-text-secondary leading-relaxed">{post.excerpt}</p>}
              <span className="text-link mt-auto text-accent" aria-hidden="true">Read article<ArrowUpRight size={15} /></span>
            </div>
          </article>
        ))} />
      </div>
    </SectionWrapper>
  );
}
