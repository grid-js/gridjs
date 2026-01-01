const { test, expect } = require("playwright/test");

async function waitGridReady(page) {
  await page.waitForSelector(".gridjs", { state: "visible" });
  await page.waitForSelector(".gridjs-tbody tr", { state: "visible" });
}

async function getNameList(page) {
  await waitGridReady(page);

  const names = page.locator('td[data-column-id="name"]');
  const count = await names.count();

  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(
      ((await names.nth(i).innerText()) || "")
        .trim()
        .replace(/\s+/g, " ")
    );
  }

  return result.filter(Boolean);
}

async function clickPage(page, pageNumber) {
  const btn = page.locator(`.gridjs-pages button[aria-label="Page ${pageNumber}"]`);
  await expect(btn).toBeVisible();
  await btn.click();
  await expect(btn).toHaveClass(/gridjs-currentPage/);
  await waitGridReady(page);
}

async function sortByName(page) {
  const nameHeader = page.locator('th[data-column-id="name"]');
  await expect(nameHeader).toBeVisible();
  await nameHeader.click();

  // After sorting, Grid.js resets to Page 1 (as shown in the video)
  const page1Btn = page.locator('.gridjs-pages button[aria-label="Page 1"]');
  await expect(page1Btn).toHaveClass(/gridjs-currentPage/);

  await waitGridReady(page);
}

test(
  "BUG: After sorting by Name, Page 3 should not show the same data as Page 1",
  async ({ page }) => {
    // 1. Open Home page
    await page.goto("https://gridjs.io/", { waitUntil: "domcontentloaded" });
    await waitGridReady(page);

    // 2. Navigate to Page 3 (before sorting)
    await clickPage(page, 3);
    const page3BeforeSort = await getNameList(page);
    console.log("Page 3 before sort:", page3BeforeSort);

    // 3. Sort by Name (table resets to Page 1)
    await sortByName(page);
    const page1AfterSort = await getNameList(page);
    console.log("Page 1 after sort:", page1AfterSort);

    // 4. Navigate to Page 3 again
    await clickPage(page, 3);
    const page3AfterSort = await getNameList(page);
    console.log("Page 3 after sort:", page3AfterSort);

    // Safety checks
    expect(page1AfterSort.length).toBeGreaterThan(0);
    expect(page3AfterSort.length).toBeGreaterThan(0);

    // 🔴 BUG ASSERTION
    // Page 3 must NOT be identical to Page 1 after sorting
    expect(
      page3AfterSort,
      "Pagination bug: Page 3 displays the same rows as Page 1 after sorting"
    ).not.toEqual(page1AfterSort);
  }
);
