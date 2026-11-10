/**
 * The single rule for what the public portfolio shows.
 *
 * - Strings count when they contain more than whitespace.
 * - Arrays count when at least one item has content.
 * - Objects count when any field other than `id` has content, so an entry that
 *   is only an identifier never renders as an empty card.
 * - Booleans (such as visibility flags) are settings, not content.
 *
 * Sections render only when their list passes this check, and optional fields
 * render only when their value does. Never show placeholders instead.
 */
export function hasContent(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.some(hasContent);
  if (value && typeof value === "object") {
    return Object.entries(value).some(([key, child]) => key !== "id" && hasContent(child));
  }
  return false;
}
