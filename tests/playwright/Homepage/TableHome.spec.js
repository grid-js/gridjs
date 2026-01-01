import { test, expect } from "@playwright/test";

test.describe("BUG: Sort + Pagination (Homepage table)", () => {
  test("BUG: After sorting by Name, Page 3 should not show the same data as Page 1", async ({ page }, testInfo) => {
    test.setTimeout(120_000);

    const logs = [];
    const log = (msg) => {
      logs.push(msg);
      console.log(msg);
    };

    page.on("console", (m) => log(`[console:${m.type()}] ${m.text()}`));
    page.on("pageerror", (e) => log(`[pageerror] ${e.message}`));
    page.on("requestfailed", (req) =>
      log(`[requestfailed] ${req.method()} ${req.url()} :: ${req.failure()?.errorText || ""}`),
    );

    await page.goto("https://gridjs.io/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".gridjs-table")).toBeVisible();

    const pageBtn = (n) => page.locator(`.gridjs-pages button:has-text("${n}")`).first();
    const nameHeader = page.locator('th:has-text("Name")').first();

    const getNames = async () => {
      const names = await page.locator("tbody tr td:nth-child(1)").allInnerTexts();
      return names.map((x) => x.trim()).filter(Boolean);
    };

    const printArr = (arr) => `[ ${arr.map((x) => `'${x}'`).join(", ")} ]`;

    const clickPage = async (n) => {
      await expect(pageBtn(n)).toBeVisible();
      await pageBtn(n).click();
      await page.waitForTimeout(900);
    };

    // Go Page 3
    await clickPage(3);
    const page3BeforeSort = await getNames();
    log(`Page 3 before sort: ${printArr(page3BeforeSort)}`);

    // Sort by Name (usually resets to Page 1)
    await expect(nameHeader).toBeVisible();
    await nameHeader.click();
    await page.waitForTimeout(900);

    const page1AfterSort = await getNames();
    log(`Page 1 after sort: ${printArr(page1AfterSort)}`);

    // Back to Page 3 again
    await clickPage(3);
    const page3AfterSort = await getNames();
    log(`Page 3 after sort: ${printArr(page3AfterSort)}`);

    // BUG catcher (exact vibe like your screenshot)
    try {
      expect(
        page3AfterSort,
        "Pagination bug: Page 3 displays the same rows as Page 1 after sorting",
      ).not.toEqual(page1AfterSort);
    } catch (err) {
      await page.screenshot({ path: testInfo.outputPath("pagination-sort-bug.png"), fullPage: true });
      testInfo.attach("console-log.txt", { body: logs.join("\n"), contentType: "text/plain" });
      throw err;
    }

    testInfo.attach("console-log.txt", { body: logs.join("\n"), contentType: "text/plain" });
  });
});
