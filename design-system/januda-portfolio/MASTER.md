# Januda Portfolio — design system

## Direction

Professional dark, project-first portfolio for technical recruiters and engineering teams.
Matte navy panels, cyan highlights, deliberate typography, comfortable touch spacing.
Keep existing facts, photos, project destinations, GitHub integration, and contact behavior.

## Skill provenance

UI/UX Pro Max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
Reference commit: `477bcb28c9812b385cb51a4605ddf30d7b2266e2`.
Initial developer-portfolio query incorrectly selected documentation; the verified retry
`portfolio professional dark` selected Minimalism & Swiss Style and Hero + Features + CTA.
Dials: variance 4, motion 2, density 3.
The approved navy/cyan palette and Inter/Syne fonts override the generated light palette
and alternative fonts. Motion uses the existing Framer Motion runtime and CSS.
Next.js search verified responsive Image fill, reserved aspect ratios, and root font loading.
Tailwind search verified wrapping chip collections. UX search verified unobscured keyboard focus.

## Foundations

- Background #080D19, secondary #0C1321, cards #111B2B, raised cards #18263A.
- Text #F2F7FC, secondary #B0C1D3, muted #9AAABD, cyan #78CFFE with dark button labels.
- Control borders #62768F, decorative borders #28364B, success #78DFAD, error #FF929C.
- Inter body, Syne headings; 16px body/input, 12–14px labels, fluid headings.
- 4/8px spacing rhythm, 16/24/32px gutters, 1200px content cap, 64/80/96px section spacing.
- 16px card radius, 8px button radius, 44px control targets, 48px primary actions/inputs.
- 160–240ms state transitions; no continuous decoration, typewriter, or 3D tilt.
- Content remains visible in server HTML. Respect reduced motion and browser zoom.

## Components and acceptance

Hero → About → Education → Skills → Projects → Experience → Recognition → Contact → Footer.
Section content is editable through the loopback-only editor at port 3033 and stored
in `src/data/content.json`; selected projects retain `src/data/projects.json`.
Open source & experiments is not rendered on the home page.
Hero actions precede the square portrait on mobile. Preserve photo1.png/photo2.png
unless the user explicitly replaces them in the editor. Projects use one/two columns.
Skills use one/two/four categorized cards without proficiency meters.
Experience highlights use native details; all existing content remains reachable.
Navigation uses a native modal dialog below 1024px, with focus restoration and Escape dismissal.
Recognition uses awards/certificate cards and a volunteering timeline. Each category
previews six entries with accessible expansion. Empty categories and the entirely
empty section/navigation link are hidden; never invent recognition claims.
Contact preserves Formspree and describes mailto accurately as a draft.
Check 320–1920px, 200% zoom, landscape, keyboard focus, reduced motion, contact and GitHub states.
Use Playwright MCP for visual review and Chromium/WebKit browser regressions.
