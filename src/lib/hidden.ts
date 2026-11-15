/**
 * Per-item visibility.
 *
 * The editor marks a single entry — a project, an award, a testimonial — with
 * `hidden: true` instead of deleting it, so the details stay in `content.json`
 * and can come back later. This filter is applied once, where the data is
 * loaded, so every section drops its hidden entries without knowing about them.
 *
 * Nested lists are filtered too, and a section whose only entries are hidden
 * then fails `hasContent()` and disappears along with its navigation link.
 */
export function withoutHidden<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.filter(item => !isHidden(item)).map(withoutHidden) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, withoutHidden(child)])) as T;
  }
  return value;
}

function isHidden(item: unknown): boolean {
  return Boolean(item && typeof item === "object" && (item as { hidden?: unknown }).hidden === true);
}
