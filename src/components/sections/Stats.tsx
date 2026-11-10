import { content } from "@/data";
import { hasContent } from "@/lib/has-content";
import type { StatsContent } from "@/types";

/** A band of headline numbers. It has no visible heading, so it takes no section number. */
export function Stats({ data = content.stats }: { data?: StatsContent }) {
  const items = data.items.filter(item => hasContent(item.value));
  if (!items.length) return null;
  return (
    <section id="stats" className="py-10 md:py-14" aria-labelledby="stats-title">
      <div className="container-section">
        <h2 id="stats-title" className="sr-only">{data.title}</h2>
        <ul className="glass stats-band" data-stagger="">
          {items.map(item => (
            <li key={item.id} className="stat">
              <span className="stat-value">{item.value}</span>
              <span className="stat-label">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
