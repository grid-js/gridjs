// tests/Homepage/homepage.spec.js
import { test, expect } from "@playwright/test";

const HOME = (process.env.BASE_URL || "https://gridjs.io/").replace(/\/+$/, "/");

test.describe("Homepage - nav + CTAs + NPM + footer bug", () => {
  test.setTimeout(200_000);

  test("should validate homepage flows and catch footer bug", async ({ page }, testInfo) => {
    const logs = [];
    page.on("console", (m) => logs.push(`[console:${m.type()}] ${m.text()}`));
    page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
    page.on("requestfailed", (req) =>
      logs.push(`[requestfailed] ${req.method()} ${req.url()} :: ${req.failure()?.errorText || ""}`),
    );

    // ---------- NAVBAR: GitHub ----------
    await goHome(page);

    const githubNav = page.locator('nav a:has-text("GitHub")').first();
    await expect(githubNav).toBeVisible({ timeout: 20_000 });

    await clickLinkExpectNewPageOrTab({
      page,
      locator: githubNav,
      expectedUrlContains: "github.com",
      label: "Navbar GitHub",
      returnTo: HOME,
    });

    // ---------- CTA: Get started ----------
    await goHome(page);

    const getStarted = page.locator('a:has-text("Get started")').first();
    await expect(getStarted).toBeVisible({ timeout: 20_000 });

    await clickLinkExpectNavigation({
      page,
      locator: getStarted,
      expectedUrlContains: "/docs",
      label: "CTA Get started",
      returnTo: HOME,
    });

    // ---------- CTA: Examples ----------
    await goHome(page);

    const examples = page.locator('a:has-text("Examples")').first();
    await expect(examples).toBeVisible({ timeout: 20_000 });

    await clickLinkExpectNavigation({
      page,
      locator: examples,
      expectedUrlContains: "/docs/examples",
      label: "CTA Examples",
      returnTo: HOME,
    });

    // ---------- NPM link inside text ("Grid.js is available on NPM...") ----------
    await goHome(page);

    const npmInParagraph = page.locator('a[href*="npmjs.com/package/gridjs"]').first();
    await expect(npmInParagraph, "NPM link should exist in homepage section").toBeVisible({ timeout: 20_000 });

    await clickLinkExpectNewPageOrTab({
      page,
      locator: npmInParagraph,
      expectedUrlContains: "npmjs.com/package/gridjs",
      label: "Homepage NPM link",
      returnTo: HOME,
    });

    // ---------- FOOTER BUG: 3 links must NOT be "#" and must point correct domains ----------
    await goHome(page);

    const footer = page.locator("div.footer_SBgd").first();
    await expect(footer).toBeVisible({ timeout: 20_000 });

    await assertFooterCriticalLinks(footer);

    testInfo.attach("console-log.txt", {
      body: logs.join("\n") || "(no logs)",
      contentType: "text/plain",
    });
  });
});

async function goHome(page) {
  await page.goto(HOME, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500); // small settle
}

async function clickLinkExpectNavigation({ page, locator, expectedUrlContains, label, returnTo }) {
  const before = page.url();

  const nav = page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 30_000 }).catch(() => null);

  await locator.click({ timeout: 20_000 });

  const navigated = await nav;
  await page.waitForTimeout(700);

  const after = page.url();

  if (!navigated && after === before) {
    throw new Error(`${label}: click did not navigate (URL stayed the same: ${after})`);
  }

  expect(after.toLowerCase()).toContain(expectedUrlContains.toLowerCase());

  await page.goto(returnTo, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
}

async function clickLinkExpectNewPageOrTab({ page, locator, expectedUrlContains, label, returnTo }) {
  const before = page.url();

  const popupPromise = page.waitForEvent("popup", { timeout: 15_000 }).catch(() => null);
  const navPromise = page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 30_000 }).catch(() => null);

  await locator.click({ timeout: 20_000 });

  const popup = await popupPromise;

  if (popup) {
    await popup.waitForLoadState("domcontentloaded", { timeout: 30_000 });
    await popup.waitForTimeout(900); // more time for heavy sites
    const u = popup.url().toLowerCase();

    expect(u).toContain(expectedUrlContains.toLowerCase());

    await popup.close();
    await page.bringToFront();
  } else {
    await navPromise;
    await page.waitForLoadState("domcontentloaded", { timeout: 30_000 });
    await page.waitForTimeout(900);

    const after = page.url().toLowerCase();
    if (after === before.toLowerCase()) {
      throw new Error(`${label}: no popup and no navigation happened (URL stayed: ${after})`);
    }

    expect(after).toContain(expectedUrlContains.toLowerCase());
  }

  await page.goto(returnTo, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
}

async function assertFooterCriticalLinks(footer) {
  const required = [
    { name: "Contribute", re: /Contribute/i, hostContains: "github.com" },
    { name: "StackOverflow", re: /Stack\s*Overflow/i, hostContains: "stackoverflow.com" },
    { name: "Contributors", re: /Contributors/i, hostContains: "github.com" },
  ];

  for (const r of required) {
    const a = footer.locator("a").filter({ hasText: r.re }).first();
    await expect(a, `Footer link "${r.name}" should exist`).toBeVisible({ timeout: 15_000 });

    const href = await a.getAttribute("href");

    // This is the actual bug catcher (homepage HTML currently uses "#")
    expect(href, `Footer "${r.name}" should NOT be "#"`).not.toBe("#");
    expect(href, `Footer "${r.name}" should have href`).toBeTruthy();

    if (!href.startsWith("http")) {
      throw new Error(`Footer "${r.name}" should point to ${r.hostContains}, but got non-http href: ${href}`);
    }

    expect(new URL(href).hostname).toContain(r.hostContains);
  }
}
