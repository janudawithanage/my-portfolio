# UI review — improved-ui

## Light liquid-glass redesign — 2026-11-10

Dark navy theme replaced with the light glass system in `MASTER.md`; motion layer,
section registry, six new optional sections, and their editor screens added.

### Automated checks

- `npm run lint`, `npx tsc --noEmit`, and a clean `npm run build` pass.
- `npm run test:editor`: 10/10. New coverage: every new section saves independently,
  invalid layout/phone/profile/URL/image inputs are rejected, avatar and cover images are
  staged, and the browser run edits section order, a testimonial, phone, and a profile.
- `npm run test:ui`: 34/34 (17 tests × Chrome and mobile WebKit). New coverage: empty or
  switched-off sections never render, never reach navigation, and never use up a number;
  "View N more" expansion with inert collapsed items; testimonial carousel labels,
  keyboard, dots, pause control and inert slides; scroll reveals; count-up values;
  content fully visible without JavaScript; showcase sections fit 320–390px; the
  scrolled navbar keeps 44px targets.
- Playwright MCP review (`npm run review:ui`) against the production build: Chrome and
  WebKit, 14 viewports each from 320px to 1920px, zero overflow, clipped text or
  undersized targets; dialog focus trap, Escape, focus restore, anchors and reduced
  motion all pass.
- Production console: zero errors and zero warnings in Chrome and WebKit.

### Lighthouse 12.8 (production build, local server)

| Run | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 ms | 0 |
| Mobile (3 runs) | 92–93 | 100 | 100 | 100 | 3.2–3.3 s | 0–10 ms | 0 |

Mobile Performance is below the 95 target. The redesign did not cause the gap: the
previous dark design scores 93 under the same conditions (LCP 3.2–3.3 s, 204 KB of
JavaScript; now 207 KB). Lighthouse's simulated slow 4G shares bandwidth between the
hero portrait (the LCP element) and the framework JavaScript. Changes made while
measuring: the portrait no longer fades in (Chrome only reports LCP for an
opacity-animated element when its fade ends, which had pushed observed LCP to 1.47 s;
it is now ~0.1 s), the hero image is requested with `fetchPriority="high"`, and images are
served as AVIF (portrait 41 KB → 25 KB). Measured options for the remaining points:
dropping Zod from the client contact form saves 25 KB (39 KB gzipped chunk) but only
reaches 94; reaching 95+ needs the first-screen LCP on phones to be text rather than
the portrait, or fewer client components.

### Notes

- Turbopack's persistent cache served stale `globals.css` output to both the running dev
  server and `next build` after in-place edits. Clearing `.next/cache/turbopack` (or
  `.next-dev/dev/cache/turbopack` for the dev server) fixed it; see the README.
- Screenshots: `artifacts/ui-review/redesign-*.png` (ignored by git).

## Earlier reviews (dark theme)

Reviewed the production build through Microsoft Playwright MCP in Chrome and WebKit.
Preview: http://127.0.0.1:3035

## Results

- 14 browser regressions passed across Chromium and mobile WebKit.
- MCP checked 14 viewport/orientation combinations per engine, from 320px to 1920px.
- No horizontal page overflow, clipped essential text, or visible controls below 44px.
- At 390×844, the primary hero action ends at y=467px, within the initial viewport.
- Mobile dialog focus containment, Escape dismissal, restoration, and section navigation passed.
- Project highlights and expansion from six to twelve real repositories passed.
- Reduced motion renders content immediately and disables smooth scrolling.
- Production browser console: zero errors and zero warnings in both engines.
- Email-draft fallback retained fields, made zero POST requests, and showed no delivery confirmation.
- Mocked Formspree loading, failure/recovery, and success passed; no real messages were sent.
- Lint, TypeScript, production build, and git whitespace checks passed.

## Visual refinements

Reviewed hero, projects, About, skills, experience, education, GitHub, contact, and mobile menu.
Corrected the mobile portrait crop, inconsistent button typography, desktop menu visibility,
Safari focus restoration, and field-label associations.
Foreground tokens have at least 6.43:1 contrast against the three main surfaces.
Input boundaries have 3.71:1 contrast against the card surface.

Screenshots and raw MCP metrics are in the ignored `artifacts/ui-review/` directory.
Generated HTML test reports are in `playwright-report/`.
Checks cover representative browser engines and viewport sizes; they are not a physical-device lab.

## Education update — 2026-10-06

Updated UCSC to May 2024–Present and removed the previous highlights and batch reference.
Added Rahula College, Matara (2009–2022), G.C.E. A/L Physical Science (2022), and result AAB.
Both institution logos use original artwork from their official sites; source links are in
`public/images/education/SOURCES.md`.

Rebuilt the production preview and repeated the 14 viewport checks in Chrome and WebKit.
Desktop and mobile education screenshots show both logos correctly, with no overflow or clipping.
The screenshot workflow now waits for lazy images to decode before capture.
Lint, TypeScript, production build, and git whitespace checks passed.
