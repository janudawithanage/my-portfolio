# Januda Portfolio — design system

## Direction

Light, premium "liquid glass" portfolio for technical recruiters and engineering teams.
A warm ivory page with slowly drifting colour fields, frosted glass surfaces with a white
inner highlight, deep ink type, one sapphire accent and a little champagne gold.
Editorial Syne headlines, calm Inter body text, numbered sections, generous space.
Keep existing facts, photos, project destinations, GitHub integration, and contact behaviour.

## Skill provenance

UI/UX Pro Max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
Reference commit: `477bcb28c9812b385cb51a4605ddf30d7b2266e2`.
The 2026-11 redesign replaced the earlier navy/cyan palette with the light glass system
below. Inter/Syne fonts are unchanged. There is no animation library: motion is CSS
plus one small client component (`MotionRoot`).

## Tokens (`src/app/globals.css`)

Token names are unchanged from the dark theme; only values changed.

| Token | Value | Use |
| --- | --- | --- |
| `bg` | `#F6F5F1` | warm ivory page |
| `bg-secondary` | `#EFEDE7` | deeper ivory band (footer) |
| `surface` / `surface-raised` | white 72% / `#FFFFFF` | frosted and hover surfaces |
| `border` / `border-subtle` | ink 10% / ink 14% | hairlines |
| `border-strong` | `#7B8397` | form control boundaries |
| `text-primary` (`ink`) | `#0E1424` | headings and body emphasis |
| `text-secondary` | `#4A5568` | body text |
| `text-muted` | `#566074` | meta labels |
| `accent` | `#3651CF` | sapphire: links, active nav, numbers |
| `accent-dim` / `accent-light` | `#8EA0EC` / `#DCE2FB` | tints |
| `gold` / `gold-light` | `#B8955A` / `#F3E7CF` | champagne lines and fills, decorative only |
| `gold-deep` | `#7A5B26` | champagne text (results, dates) |
| `success` / `error` | `#1A6E49` / `#B42335` | status |

Contrast, worst case = text on the strongest background blob with no glass:
primary 14.2:1, secondary 5.8:1, muted 4.9:1, accent 5.0:1, gold-deep 4.9:1,
success 4.8:1, error 5.0:1. On glass every text token is at least 5.6:1.
`border-strong` is at least 3.4:1 on glass, where form controls sit.
White on `ink` buttons is 18.4:1, white on `accent` 6.5:1.
Never use pure black text, pure white page backgrounds, neon glows, or extra accents.

## Glass recipe

- `.glass` / `.card`: white gradient 80% → 56%, `backdrop-filter: blur(20px) saturate(160%)`,
  1px ink-10% hairline, `inset 0 1px 0` white highlight, a tight plus a wide faint shadow,
  24px radius. `.glass-strong` / `.card-elevated` are more opaque (92% → 78%, blur 28px).
- A pointer highlight (`::before`, under the content) follows `--mx/--my` on hover.
- Background: `.ambient` holds three radial colour fields (indigo, sky, champagne,
  ≤ 18% alpha) that drift and change shape using **transform only** (36–42s loops, on
  the compositor), plus an SVG grain at 3.5% opacity.
- Fallbacks: without `backdrop-filter`, glass is white at 92%; with
  `prefers-reduced-transparency`, glass is solid white.

## Typography and layout

- Syne 600 headlines with tight tracking (`clamp(2.125rem, 4.6vw, 3.625rem)`); the hero
  name is `clamp(3rem, 8.2vw, 6.75rem)`. Inter body at 16–17px with 1.7 line height.
- Eyebrows: gold hairline, then the accent number and an uppercase label: "01 — Label".
- 75rem content cap; 16px side gutter on phones; 72/96/120px section spacing.
- 44px minimum touch targets everywhere (the Playwright suite enforces this).

## Motion tokens and rules

- Easing: `--ease-out-expo` `cubic-bezier(.16, 1, .3, 1)`, `--ease-out-quart`, `--ease-in-out`.
- Durations: 160 / 320 / 640 / 900ms (`--duration-fast` … `--duration-slower`).
- Only transform, translate, opacity, filter and clip-path animate. The one exception is the
  "View N more" expander, which animates `grid-template-rows` from 0fr to 1fr.
- Hero: name lines rise out of a mask; availability, role, bio, actions, facts, focus
  areas and the skills strip follow at 80ms steps. The portrait never fades (it is the
  first-screen LCP element): it settles in with transform only, then floats, with a
  periodic sheen.
- Sections: `[data-reveal]` elements and the children of `[data-stagger]` fade up 28px
  from a 6px blur, once, as they enter the viewport (90ms stagger, capped at 6 steps).
  An inline head script adds `html.js` before first paint and removes it after 4s if the
  app never starts. Without JavaScript nothing is hidden.
- Cards with `[data-tilt]` lean ≤ 4–5° toward the pointer and lift 4px; primary buttons
  with `data-magnetic` follow the pointer ≤ 10px. Mouse and fine pointers only.
- Buttons have a liquid fill rising on hover; arrow icons nudge toward their destination.
- Timelines draw their rail with a scroll-driven animation where supported; dots pulse once.
- Counters (hero facts, stats band) count up once; server HTML has the final value.
- Scroll progress: a 2px sapphire-to-champagne bar on a CSS scroll timeline, with a
  passive-listener fallback.
- Reduced motion: no blobs, marquee, sheen, float, tilt, magnetic or count-up; reveals
  become a 400ms opacity fade and animation delays are removed.

## Sections and acceptance

Hero → (editor-ordered sections) → Contact → Footer. The order and visibility live in
`content.json` → `layout.sectionOrder`, editable at **Section order & visibility**.
Defaults: About, Stats band, Now, Education, Skills, Projects, Experience, Security & CTF,
Recognition, Writing, Talks & publications, Testimonials.

- `src/lib/has-content.ts` is the only empty-state rule; `src/lib/sections.ts` builds the
  visible order, the numbers, and the navbar and footer links from it. Sections render only
  with a real entry; optional fields render only with a value. Never show placeholders.
- The stats band has no visible heading, so it takes no number and no navigation link.
  Now and Testimonials are reachable by scrolling only, to keep the navbar to ≤ 9 links.
- Navbar: floating glass pill that becomes more opaque and slightly smaller on scroll,
  with a sliding active-section indicator (clip-path). Below 1024px a full-height glass
  sheet (native modal dialog with focus trap, Escape and backdrop dismissal).
- Education, Experience and Volunteering are timelines. Projects show index, date,
  status, chips, Source code and Go live. Lists show six entries, then "View N more"
  (collapsed entries are `inert` and visibility-hidden).
- Testimonials: one quote at a time; prev/next, dots and pause controls; arrow keys;
  inactive slides are `inert`; auto-advance pauses on hover, focus and hidden tabs and
  never runs with reduced motion.
- Content is editable through the loopback-only editor at port 3033 and stored in
  `src/data/content.json`; selected projects stay in `src/data/projects.json`.
- Check 320–1920px, 200% zoom, landscape, keyboard focus, reduced motion, no JavaScript,
  contact and GitHub states. Use the Playwright suite and MCP review for visual checks.

## Content editor

The loopback editor (`scripts/project-editor/`) uses this same system. `editor.css` copies
the tokens, glass recipe, liquid buttons, contact-form fields and motion above; change both
together. Its security policy allows local files only, so it serves its own copies of the
Inter and Syne Latin subsets (`fonts/`, SIL OFL), the grain texture and the favicon.

- Frame: a glass pill top bar with the ink "JW." mark (the hero's initials), then an
  eyebrow, a Syne headline with a champagne full stop, and an intro.
- Command bar: section picker, save state and Discard / Save. From 1024px wide it is a
  pill pinned to the top, like the site's navbar; messages appear right under it. Unsaved
  changes show a gold dot. Confirmations clear after 8 seconds, errors stay until the next edit.
- Forms: one glass panel per section; short fields pair up in two columns when there is
  room; long text, images, switches and titles take the full row. Yes/no fields are
  switches that remain checkboxes. List entries are cards with a turning chevron disc.
- Motion: headings rise; anything clickable only fades, so controls never move under the
  pointer. Cards slide open where `::details-content` is supported. Reduced motion
  removes it all.
