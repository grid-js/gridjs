// tests/Dashboard/03_Config/00_Navigation.spec.js
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "https://gridjs.io/docs";

test.describe("Grid.js docs: nav + external + theme + search regression", () => {
  test.setTimeout(90_000); // biar nggak mati di 30s kalau internet lambat

  test("should navigate, toggle theme, and search should return results for 'Introduction'", async ({ page }, testInfo) => {
    const logs = [];
    page.on("console", (m) => logs.push(`[console:${m.type()}] ${m.text()}`));
    page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));

    // kalau ada request yang gagal (misalnya Algolia DSN / CORS), ini bantu banget buat bukti
    page.on("requestfailed", (req) => {
      logs.push(`[requestfailed] ${req.method()} ${req.url()} :: ${req.failure()?.errorText || ""}`);
    });

    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    // --- NAVBAR INTERNAL LINKS ---
    const internalNav = [
      { name: "Docs", href: "/docs" },
      { name: "Examples", href: "/docs/examples/hello-world" },
      { name: "Support Grid.js", href: "/docs/sponsors" },
      { name: "Community", href: "/docs/community" },
      { name: "Blog", href: "/blog" },
    ];

    for (const item of internalNav) {
      const link = page.locator(`a.navbar__item.navbar__link:has-text("${item.name}")`).first();
      await expect(link).toBeVisible({ timeout: 10_000 });
      await link.click();
      await expect(page).toHaveURL(new RegExp(escapeRegex(item.href), "i"), { timeout: 10_000 });
    }

    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    // --- EXTERNAL LINKS (NEW TAB) - robust handling ---
    const externalNav = [
      { name: "NPM", expectedUrlContains: "npmjs.com/package/gridjs" },
      { name: "GitHub", expectedUrlContains: "github.com/grid-js/gridjs" },
    ];

    for (const item of externalNav) {
      const link = page.locator(`a.navbar__item.navbar__link:has-text("${item.name}")`).first();
      await expect(link).toBeVisible({ timeout: 10_000 });

      // kadang popup diblokir/lemot => kasih timeout lebih longgar + fallback
      let popup = null;
      try {
        [popup] = await Promise.all(
          [
            page.waitForEvent("popup", { timeout: 15_000 }),
            link.click(),
          ]
        );
      } catch (e) {
        // fallback: kalau popup nggak kebuka, minimal verifikasi href-nya benar
        const href = await link.getAttribute("href");
        logs.push(`[popup-missed] ${item.name} href=${href}`);
        expect(href || "").toContain(item.expectedUrlContains.split("/")[0]); // minimal domain check
        continue;
      }

      await popup.waitForLoadState("domcontentloaded", { timeout: 20_000 });
      const url = popup.url().toLowerCase();
      expect(url).toContain(item.expectedUrlContains.toLowerCase());
      await popup.close();
      await page.bringToFront();
      await expect(page).toHaveURL(/gridjs\.io\/docs/i, { timeout: 10_000 });
    }

    // --- THEME TOGGLE ---
    const html = page.locator("html");
    const beforeTheme = await html.getAttribute("data-theme");
    const themeBtn = page.locator('button[aria-label^="Switch between dark and light mode"]').first();

    await expect(themeBtn).toBeVisible({ timeout: 10_000 });
    await themeBtn.click();

    await expect.poll(async () => await html.getAttribute("data-theme"), { timeout: 10_000 })
      .not.toBe(beforeTheme);

    // --- SEARCH (DOCSEARCH) ---
    const searchBtn = page.locator('button.DocSearch.DocSearch-Button[aria-label="Search"]').first();
    await expect(searchBtn).toBeVisible({ timeout: 10_000 });
    await searchBtn.click();

    const input = page.locator("input.DocSearch-Input").first();
    await expect(input).toBeVisible({ timeout: 10_000 });

    await input.fill("Introduction");

    // ❌ Jangan pakai waitForTimeout -> ganti wait sampai salah satu kondisi muncul:
    // - ada results
    // - atau "No results for ..."
    const noResults = page.locator('text=/No results for\\s+"Introduction"/i');
    const hits = page.locator(".DocSearch-Hits, .DocSearch-Hit-source, .DocSearch-Hit").first();

    try {
      await Promise.race([
        noResults.waitFor({ state: "visible", timeout: 15_000 }),
        hits.waitFor({ state: "visible", timeout: 15_000 }),
      ]);

      // Ini inti "nangkep bug": kalau muncul noResults, test FAIL.
      await expect(noResults, 'BUG: Search shows "No results for \\"Introduction\\""').toHaveCount(0);
    } catch (err) {
      await page.screenshot({ path: testInfo.outputPath("search-timeout-or-failure.png"), fullPage: true });
      testInfo.attach("console-log.txt", {
        body: logs.join("\n") || "(no logs)",
        contentType: "text/plain",
      });
      throw err;
    }
  });
});

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
