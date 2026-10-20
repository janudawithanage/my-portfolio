import { test, expect, type Page } from "@playwright/test";
import selectedProjects from "../src/data/projects.json";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#github-repositories")).toBeVisible();
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
  for (const endpoint of ["/api/projects", "/api/uploads", "/editor"]) {
    expect((await request.get(endpoint)).status()).toBe(404);
  }
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
  expect(await page.locator("main section[id]").evaluateAll(sections => sections.map(section => section.id))).toEqual(["hero", "projects", "about", "skills", "experience", "education", "github", "contact"]);
  for (const [width, height] of [[320,844],[375,844],[390,844],[430,932],[639,900],[640,900],[767,1024],[768,1024],[1023,900],[1024,900],[1440,1000],[1920,1080],[844,390],[1024,768]]) {
    await page.setViewportSize({ width, height });
    const result = await page.evaluate(() => {
      const clipped = Array.from(document.querySelectorAll<HTMLElement>("main h1,main h2,main h3,main p,main a,main li > span")).filter(e => e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 2 && !e.closest('[aria-hidden="true"]')).map(e => e.textContent);
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
  await expect(page.locator("#github-repositories article")).toHaveCount(6);
  const more = page.getByRole("button", { name: "Show all 8 repositories" });
  await more.click();
  await expect(page.locator("#github-repositories article")).toHaveCount(8);
  await expect(page.getByRole("button", { name: "Show fewer" })).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: "Show fewer" }).click();
  await expect(page.locator("#github-repositories article")).toHaveCount(6);
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
