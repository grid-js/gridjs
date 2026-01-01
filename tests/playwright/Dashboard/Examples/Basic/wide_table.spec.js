import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/wide-table";

const expectedHeaders = [
    "Name",
    "Email",
    "Title",
    "Company",
    "Country",
    "County",
];

test.describe("UI testing", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("1. Grab the h1 title: Wide Table", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "Wide Table",
            level: 1,
        });
        await expect(title).toBeVisible();

        await expect(title).toHaveText("Wide Table");
    });

    /**
     * 測試情境 1: 驗證所有欄位標頭 (Headers) 是否存在於 DOM 中
     * 重點：驗證欄位數量與名稱完全符合預期
     */
    test("Should render all column headers correctly", async ({ page }) => {
        // [修正點 1] 先鎖定第一個 wrapper，再找裡面的 th
        // 這樣就不會抓到第二個表格的標頭
        const headerCells = page
            .locator(".gridjs-wrapper")
            .first()
            .locator("thead th");

        // 1. 驗證欄位總數
        // 現在 headerCells 只會包含第一個表格的標頭，數量應該會正確
        await expect(headerCells).toHaveCount(expectedHeaders.length);

        // 2. 驗證所有欄位名稱
        await expect(headerCells).toHaveText(expectedHeaders);
    });

    /**
     * 測試情境 2: 驗證水平捲動行為 (Horizontal Scroll)
     * 重點：寬表格應該要有捲軸，且最後一個欄位初始狀態可能在視窗外
     */
    test("Should handle horizontal scrolling for wide columns", async ({
        page,
    }) => {
        // 鎖定表格的外層容器 (Grid.js 通常使用 gridjs-wrapper 來處理捲動)
        const tableWrapper = page.locator(".gridjs-wrapper").first();
        const lastColumnHeader = page
            .locator("table.gridjs-table thead th")
            .last();

        // 1. 驗證容器是否"需要"捲動 (內容寬度 > 容器寬度)
        // 我們使用 evaluate 來檢查 DOM 屬性
        const isScrollable = await tableWrapper.evaluate((el) => {
            return el.scrollWidth > el.clientWidth;
        });

        // 如果是寬表格，這裡必須為 true
        expect(isScrollable).toBeTruthy();

        // 2. 驗證最後一個欄位 (Country) 的可見性
        // 在捲動之前，最後一個欄位可能不在視口內 (視您的螢幕寬度而定)
        // 為了測試穩健性，我們先強制將容器捲動到最右邊
        await tableWrapper.evaluate((el) => {
            el.scrollLeft = el.scrollWidth;
        });

        // 3. 斷言：捲動後，最後一個欄位應該要是可見的 (Visible)
        // 注意：Playwright 的 toBeVisible 會檢查元素是否在 viewport 內
        await expect(lastColumnHeader).toBeVisible();

        // 再次確認它是我們預期的最後一個欄位
        await expect(lastColumnHeader).toHaveText(
            expectedHeaders[expectedHeaders.length - 1],
        );
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
