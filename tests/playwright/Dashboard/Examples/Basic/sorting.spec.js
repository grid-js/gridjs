import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/sorting";

test.describe("UI testing", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("Grab the h1 title: Sorting", async ({ page }) => {
        const title = page.getByRole("heading", { name: "Sorting", level: 1 });
        await expect(title).toBeVisible();

        await expect(title).toHaveText("Sorting");
    });

    test("Check the home page link", async ({ page }) => {
        const link = page.getByRole("link", { name: "Home page" });
        await expect(link).toBeVisible();

        await link.click();

        await expect(page).toHaveURL("http://localhost:3000");
    });

    test("Should sort data correctly (Ascending and Descending)", async ({
        page,
    }) => {
        const container = page.locator(".gridjs-wrapper").first();
        const rows = container.locator("table.gridjs-table tbody tr");

        // 1. 鎖定 "Name" 欄位標頭
        const nameHeader = container.locator("th", { hasText: "Name" });

        // 2. [修正關鍵] 鎖定標頭內的 "排序按鈕" (根據您的截圖，它是 button.gridjs-sort)
        const sortButton = nameHeader.locator(".gridjs-sort");

        // 確保按鈕存在
        await expect(sortButton).toBeVisible();

        // --- Step 1: 測試升冪排序 (Ascending) ---

        // 點擊排序按鈕
        await sortButton.click();

        // [修正關鍵] 驗證 "按鈕" 的 class 是否變為 asc
        // 根據截圖，成功排序後 class 會包含 "gridjs-sort-asc"
        await expect(sortButton).toHaveClass(/gridjs-sort-asc/);

        // 抓取資料並驗證
        const namesAsc = await rows
            .locator("td")
            .nth(0)
            .evaluateAll((cells) => cells.map((cell) => cell.innerText));
        console.log("Ascending Result:", namesAsc);

        const expectedAsc = [...namesAsc].sort((a, b) => a.localeCompare(b));
        expect(namesAsc).toEqual(expectedAsc);

        // --- Step 2: 測試降冪排序 (Descending) ---

        // 再次點擊同一個排序按鈕
        await sortButton.click();

        // [修正關鍵] 驗證 "按鈕" 的 class 是否變為 desc
        // 通常 Grid.js 的命名規則是 gridjs-sort-desc
        await expect(sortButton).toHaveClass(/gridjs-sort-desc/);

        // 抓取資料並驗證
        const namesDesc = await rows
            .locator("td")
            .nth(0)
            .evaluateAll((cells) => cells.map((cell) => cell.innerText));
        console.log("Descending Result:", namesDesc);

        const expectedDesc = [...namesDesc]
            .sort((a, b) => a.localeCompare(b))
            .reverse();
        expect(namesDesc).toEqual(expectedDesc);
    });
});

test.describe("All links on the blog page", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
    });

    test("1. NPM link on the upper right corner", async ({ page }) => {
        const link = page.getByRole("link", { name: "NPM" });
        await expect(link).toBeVisible();
        await link.click();
        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL("https://www.npmjs.com/package/gridjs");
    });

    test("2. Github link on the upper right corner", async ({ page }) => {
        const link = page.getByRole("link", { name: "Github" }).first();
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();

        await expect(newPage).toHaveURL("https://github.com/grid-js/gridjs");
    });

    // 3, 4 for Docs section on the bottom of the blog page
    test("3. Docs - Getting Started", async ({ page }) => {
        const link = page.getByRole("link", { name: "Getting Started" });
        await expect(link).toBeVisible();

        await link.click();
        await expect(page).toHaveURL("http://localhost:3000/docs");
    });

    test("4. Docs - Examples", async ({ page }) => {
        const link = page.getByRole("link", { name: "Examples" }).nth(2);
        await expect(link).toBeVisible();

        await link.click();
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/examples/hello-world",
        );
    });

    // 5 - 7 for the Community section
    test("5. Community - Stack Overflow", async ({ page }) => {
        const link = page.getByRole("link", { name: "Stack Overflow" });
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL(
            "https://stackoverflow.com/questions/tagged/gridjs",
        );
    });

    test("6. Community - Discord", async ({ page }) => {
        const link = page.getByRole("link", { name: "Discord" });
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL("https://discord.com/invite/K55BwDY");
    });

    test("7. Community - Twitter", async ({ page }) => {
        const link = page.getByRole("link", { name: "Twitter" });
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL("https://x.com/grid_js");
    });

    // 8, 9 for the More section
    test("8. More - Blog", async ({ page }) => {
        const link = page.getByRole("link", { name: "Blog" }).nth(1);
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL("http://localhost:3000/blog");
    });

    test("9. More - Github", async ({ page }) => {
        const link = page.getByRole("link", { name: "Github" }).nth(1);
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();

        await expect(newPage).toHaveURL("https://github.com/grid-js/gridjs");
    });
});
