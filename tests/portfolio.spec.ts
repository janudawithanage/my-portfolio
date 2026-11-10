import { test, expect, type Page } from "@playwright/test";
import selectedProjects from "../src/data/projects.json";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#contact")).toBeVisible();
});

test("Selected Work uses saved project data and the public app exposes no editor endpoints", async ({ page, request }) => {
  await expect(page.locator("#projects .project-title")).toHaveText(selectedProjects.map(project => project.title));
  await expect(page.locator("#hero .hero-facts")).toContainText(`${selectedProjects.length} selected projects`);
  const cards = page.locator("#projects article");
  for (const [index, project] of selectedProjects.entries()) {
    await expect(cards.nth(index)).toContainText(project.description);
    if (project.image) {
      const image = cards.nth(index).getByRole("img", { name: `${project.title} application preview` });
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveAttribute("src", new RegExp(encodeURIComponent(project.image)));
      await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
  }
  for (const endpoint of ["/api/projects", "/api/content", "/api/uploads", "/editor"]) {
    expect((await request.get(endpoint)).status()).toBe(404);
  }
});

test("Recognition categories expand, link to credentials, and follow the requested navigation order", async ({ page }) => {
  await expect(page.locator("#github, #github-repositories")).toHaveCount(0);
  await expect(page.locator('main a[href="#github"]')).toHaveCount(0);
  await expect(page.locator("#recognition").getByRole("heading", { name: "Awards & Achievements", exact: true })).toBeVisible();
  await expect(page.locator("#recognition").getByRole("heading", { name: "Certifications", exact: true })).toBeVisible();
  await expect(page.locator("#recognition").getByRole("heading", { name: "Volunteering & Leadership", exact: true })).toBeVisible();
  // The fixture fills Stats, Security and Writing, switches Now off, and leaves Talks and Testimonials empty.
  const expected = ["#about", "#education", "#skills", "#projects", "#experience", "#security", "#recognition", "#writing", "#contact"];
  await expect.poll(() => page.locator('footer nav a').evaluateAll(links => links.map(link => link.getAttribute("href")))).toEqual(expected);
  await expect(page.locator("#about .text-eyebrow")).toHaveText("01 — A little about me");
  await expect(page.locator("#education .text-eyebrow")).toHaveText("02 — Education");
  await expect(page.locator("#projects .text-eyebrow")).toHaveText("04 — Selected work");
  await expect(page.locator("#security .text-eyebrow")).toHaveText("06 — Security & CTF");
  await expect(page.locator("#contact .text-eyebrow")).toHaveText("09 — Get in touch");
  await expect(page.locator("#recognition-certifications article:visible")).toHaveCount(6);
  await page.locator("#recognition").getByRole("button", { name: "View 2 more certifications", exact: true }).click();
  await expect(page.locator("#recognition-certifications article:visible")).toHaveCount(8);
  await expect(page.getByRole("link", { name: "View credential for Test certificate 8", exact: true })).toHaveAttribute("href", "https://example.com/credential/7");
  await page.locator("#recognition").getByRole("button", { name: "Show fewer certifications", exact: true }).click();
  await expect(page.locator("#recognition-certifications article:visible")).toHaveCount(6);
  for (const width of [320, 390, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const frame = await page.locator(".hero-portrait").boundingBox();
    expect(Math.abs(frame!.width - frame!.height)).toBeLessThan(1);
  }
  await page.goto("/ui-fixtures/recognition-empty");
  await expect(page.locator("main #recognition")).toHaveCount(0);
});

test("curated experiments remain text-only, preserve details and order, expand, and handle an empty selection", async ({ page }) => {
  await page.goto("/ui-fixtures/curated");
  await expect(page.locator("#github-repositories .project-title")).toHaveText(Array.from({ length: 6 }, (_, index) => "Curated experiment " + (index + 1)));
  await expect(page.getByText("Showing 6 of 8 selected repositories", { exact: true })).toBeVisible();
  const first = page.locator("#github-repositories article").first();
  await expect(first).toContainText("A curated description saved independently of GitHub.");
  await expect(page.locator("#github-repositories img, #github-repositories .project-art")).toHaveCount(0);
  await expect(first.getByRole("link", { name: "Source code for Curated experiment 1" })).toHaveAttribute("href", "https://github.com/example/curated-0");
  await page.getByRole("button", { name: "Show all 8 repositories" }).click();
  await expect(page.locator("#github-repositories article")).toHaveCount(8);
  await expect(page.locator("#github-repositories .project-title").last()).toHaveText("Curated experiment 8");
  await expect(page.locator("#github-repositories img, #github-repositories .project-art")).toHaveCount(0);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    // Viewport-relative font sizes settle on the next frame after a resize.
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.getByRole("button", { name: "Show fewer" }).click();
  await expect(page.locator("#github-repositories article")).toHaveCount(6);
  await page.goto("/ui-fixtures/curated-empty");
  await expect(page.getByRole("heading", { name: "No experiments selected yet." })).toBeVisible();
  await expect(page.locator("#github-repositories article")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "View GitHub profile" })).toHaveAttribute("href", "https://github.com/example");
});

test("page order, responsive text, and touch targets across phones, tablets, and desktop", async ({ page }) => {
  expect(await page.locator("main section[id]").evaluateAll(sections => sections.map(section => section.id))).toEqual(["hero", "about", "stats", "education", "skills", "projects", "experience", "security", "recognition", "writing", "contact"]);
  for (const [width, height] of [[320,844],[375,844],[390,844],[430,932],[639,900],[640,900],[767,1024],[768,1024],[1023,900],[1024,900],[1440,1000],[1920,1080],[844,390],[1024,768]]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    const result = await page.evaluate(() => {
      const clipped = Array.from(document.querySelectorAll<HTMLElement>("main h1,main h2,main h3,main p,main a,main li > span")).filter(e => e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 2 && !e.closest('[aria-hidden="true"], .sr-only')).map(e => e.textContent);
      const small = Array.from(document.querySelectorAll("a,button,input,summary")).filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 43.5 && !e.classList.contains("skip-link"); }).map(e => e.textContent);
      return { pageWidth: document.documentElement.scrollWidth, width: innerWidth, clipped, small };
    });
    expect(result.pageWidth, width + "px page overflow").toBeLessThanOrEqual(result.width);
    expect(result.clipped, width + "px clipped text").toEqual([]);
    expect(result.small, width + "px small controls").toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  const primary = await page.getByRole("link", { name: "Explore my work" }).boundingBox();
  expect(primary!.y + primary!.height).toBeLessThan(844);
  await expect(page.locator("#skills article")).toHaveCount(4);
});

test("mobile navigation traps focus, restores it, supports backdrop dismissal and anchors", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  const dialog = page.getByRole("dialog");
  await trigger.click();
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 9; index++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest("dialog")))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.mouse.click(2, 2);
  await expect(dialog).not.toBeVisible();
  await trigger.click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("#projects")).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await trigger.click();
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("repository expansion and experience disclosure preserve accessible content", async ({ page }) => {
  await page.goto("/ui-fixtures/success");
  await expect(page.locator("#github-repositories article")).toHaveCount(6);
  const more = page.getByRole("button", { name: "Show all 8 repositories" });
  await more.click();
  await expect(page.locator("#github-repositories article")).toHaveCount(8);
  await expect(page.getByRole("button", { name: "Show fewer" })).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: "Show fewer" }).click();
  await expect(page.locator("#github-repositories article")).toHaveCount(6);
  await page.goto("/");
  const details = page.locator("#experience details").first();
  await details.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(details).toHaveAttribute("open", "");
  await expect(details.locator("li").first()).toBeVisible();
});

test("validation focuses a linked error summary and identifies invalid fields", async ({ page }) => {
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  const summary = page.locator('[aria-labelledby="contact-errors-heading"]');
  await expect(summary).toBeFocused();
  await expect(summary.getByRole("link")).toHaveCount(4);
  await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await summary.getByRole("link", { name: /^Email:/ }).click();
  await expect(page.getByLabel("Email", { exact: true })).toBeFocused();
});

async function fillContact(page: Page) {
  await page.getByLabel("Name", { exact: true }).fill("UI Reviewer");
  await page.getByLabel("Email", { exact: true }).fill("review@example.com");
  await page.getByLabel("Subject", { exact: true }).fill("Portfolio review");
  await page.getByLabel("Message", { exact: true }).fill("Testing the redesigned contact form with a mocked response.");
}

test("mocked contact submission shows loading, retains failed fields, and confirms success", async ({ page }) => {
  await fillContact(page);
  let resolveRequest!: (route: import("@playwright/test").Route) => void;
  const requestReceived = new Promise<import("@playwright/test").Route>(resolve => { resolveRequest = resolve; });
  await page.route("https://formspree.io/f/**", route => { resolveRequest(route); });
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  const route = await requestReceived;
  expect(route.request().postDataJSON()).toMatchObject({ name: "UI Reviewer", email: "review@example.com", subject: "Portfolio review" });
  await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
  await route.fulfill({ status: 500, contentType: "application/json", body: "{}" });
  await expect(page.getByRole("alert").filter({ hasText: "couldn’t be sent" })).toBeVisible();
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("UI Reviewer");
  await page.unroute("https://formspree.io/f/**");
  await page.route("https://formspree.io/f/**", route => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Thanks for reaching out." })).toBeVisible();
  await page.getByRole("button", { name: "Send another message" }).click();
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("");
});

test("GitHub empty, error, and loading states remain readable with a recovery path", async ({ page }) => {
  for (const state of ["empty", "error", "loading"]) {
    await page.goto("/ui-fixtures/" + state);
    if (state === "loading") {
      await expect(page.locator('[aria-busy="true"]')).toBeVisible();
    } else {
      await expect(page.getByRole("status").filter({ hasText: /repositories/i })).toBeVisible();
      await expect(page.getByRole("link", { name: /View GitHub profile/ })).toHaveAttribute("href", "https://github.com/example");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("reduced motion, browser zoom reflow, and enlarged text retain content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  await expect(page.locator("h1")).toHaveCSS("opacity", "1");
  // 720 CSS pixels on a 1440px display represents the layout at 200% browser zoom.
  await page.setViewportSize({ width: 720, height: 500 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole("link", { name: "Explore my work" })).toBeVisible();
});

test("empty or switched-off sections never render, never reach navigation, and do not use up a number", async ({ page }) => {
  // Fixture: Talks and Testimonials are empty; Now has an entry but is switched off in the section order.
  for (const id of ["talks", "testimonials", "now"]) {
    await expect(page.locator(`main #${id}`), `#${id} is not rendered`).toHaveCount(0);
    await expect(page.locator(`a[href="#${id}"]`), `#${id} is not linked`).toHaveCount(0);
  }
  for (const id of ["stats", "security", "writing"]) await expect(page.locator(`main #${id}`)).toHaveCount(1);
  const desktop = await page.locator("header nav a.nav-link").evaluateAll(links => links.map(link => link.getAttribute("href")));
  expect(desktop).toEqual(["#about", "#education", "#skills", "#projects", "#experience", "#security", "#recognition", "#writing"]);
  const numbers = await page.locator("main .text-eyebrow .eyebrow-number").allTextContents();
  expect(numbers).toEqual(["01", "02", "03", "04", "05", "06", "07", "08", "09"]);
  await expect(page.locator("#stats .text-eyebrow"), "the stats band has no heading number").toHaveCount(0);
  await expect(page.locator("#stats")).toHaveAttribute("aria-labelledby", "stats-title");
  await expect(page.locator("#stats li")).toHaveCount(4);
  await expect(page.locator("#stats")).toContainText("15+");
  await expect(page.locator("#stats")).toContainText("3.9");
});

test("long lists show six entries, then reveal the rest with an inert, accessible expander", async ({ page }) => {
  const list = page.locator("#writing-list");
  await expect(list.locator("article:visible")).toHaveCount(6);
  await expect(list.locator(".expander")).toHaveAttribute("inert", "");
  const toggle = page.getByRole("button", { name: "View 2 more articles", exact: true });
  await expect(toggle).toHaveAttribute("aria-controls", "writing-list");
  await toggle.click();
  await expect(list.locator("article:visible")).toHaveCount(8);
  await expect(list.locator(".expander")).not.toHaveAttribute("inert", "");
  await expect(page.getByRole("button", { name: "Show fewer articles", exact: true })).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: "Test article 8", exact: true })).toHaveAttribute("href", "https://example.com/post/7");
  // Optional fields only render when they have content.
  const second = page.locator("#security article").nth(1);
  await expect(second.getByRole("link")).toHaveCount(0);
  await expect(second.locator(".result-chip")).toHaveCount(0);
  await expect(page.locator("#security article").first().getByRole("link", { name: "Read write-up for Test CTF 2026" })).toHaveAttribute("href", "https://example.com/writeup/1");
});

test("testimonial carousel is labelled, keyboard operable, and only exposes the current quote", async ({ page }) => {
  await page.goto("/ui-fixtures/showcase");
  const carousel = page.getByRole("region", { name: "Testimonials" });
  await expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
  const slides = carousel.locator("figure");
  await expect(slides).toHaveCount(3);
  await expect(slides.nth(0)).toHaveAttribute("data-active", "");
  await expect(slides.nth(1)).toHaveAttribute("inert", "");
  // Reduced motion (the suite default): no auto-advance, so no pause control and a polite live region.
  await expect(carousel.getByRole("button", { name: /^(Pause|Play) testimonials$/ })).toHaveCount(0);
  await expect(carousel.locator(".testimonial-stage")).toHaveAttribute("aria-live", "polite");
  await carousel.getByRole("button", { name: "Next testimonial" }).click();
  await expect(slides.nth(1)).toHaveAttribute("data-active", "");
  await expect(slides.nth(0)).toHaveAttribute("inert", "");
  await carousel.getByRole("button", { name: "Show testimonial 3 of 3" }).click();
  await expect(carousel.getByRole("button", { name: "Show testimonial 3 of 3" })).toHaveAttribute("aria-current", "true");
  await carousel.getByRole("button", { name: "Show testimonial 3 of 3" }).press("ArrowRight");
  await expect(slides.nth(0)).toHaveAttribute("data-active", "");
  await expect(carousel.getByRole("link", { name: "Test Person One" })).toHaveAttribute("href", "https://example.com/one");
  for (const button of await carousel.getByRole("button").all()) expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    expect(await page.evaluate(() => document.documentElement.scrollWidth), `showcase fits ${width}px`).toBeLessThanOrEqual(width);
  }
  // Now and Talks hide optional fields that are empty.
  await expect(page.locator("#now li")).toHaveCount(3);
  await expect(page.locator("#now")).toContainText("📚");
  await expect(page.locator("#talks article").nth(2).getByRole("link")).toHaveCount(0);
  await expect(page.locator("#talks article").first().getByRole("link", { name: "View talk — Test talk" })).toBeVisible();
});

test.describe("with motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("auto-advancing testimonials can be paused", async ({ page }) => {
    await page.goto("/ui-fixtures/showcase");
    const carousel = page.getByRole("region", { name: "Testimonials" });
    const pause = carousel.getByRole("button", { name: "Pause testimonials" });
    await expect(pause).toBeVisible();
    await pause.click();
    await expect(carousel.getByRole("button", { name: "Play testimonials" })).toBeVisible();
    await expect(carousel.locator(".testimonial-stage")).toHaveAttribute("aria-live", "polite");
  });

  test("sections reveal once on scroll and counters finish on their real values", async ({ page }) => {
    await expect(page.locator("html")).toHaveClass(/\bjs\b/);
    const heading = page.locator("#skills .section-heading");
    await expect(heading).not.toHaveAttribute("data-shown", "");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toHaveAttribute("data-shown", "");
    await expect(heading).toHaveCSS("opacity", "1");
    await page.locator("#stats").scrollIntoViewIfNeeded();
    await expect(page.locator("#stats")).toContainText("15+");
    await expect(page.locator("#stats")).toContainText("3.9");
    await expect(page.locator("#hero .hero-facts")).toContainText("3+ years coding");
  });
});

test("content is fully visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/\bjs\b/);
  for (const selector of ["#about .section-heading", "#skills li", "#projects article", "#contact form"]) {
    await expect(page.locator(selector).first()).toHaveCSS("opacity", "1");
  }
  await context.close();
});

test("the scrolled navigation pill keeps every control at least 44px tall", async ({ page, isMobile }) => {
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(page.locator("header.site-header")).toHaveAttribute("data-scrolled", "");
  await page.waitForTimeout(800);
  const heights = await page.locator("header a:visible, header button:visible").evaluateAll(nodes => nodes.map(node => ({ text: node.textContent?.trim() || node.getAttribute("aria-label"), height: node.getBoundingClientRect().height })));
  expect(heights.length).toBeGreaterThan(isMobile ? 1 : 6);
  for (const { text, height } of heights) expect(height, `${text} is ${height}px`).toBeGreaterThanOrEqual(44);
});
