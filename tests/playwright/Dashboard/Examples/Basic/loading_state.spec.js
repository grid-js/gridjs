import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/loading-state";

test.describe("UI testing", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("1. Grab the h1 title: Loading State", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "Loading State",
            level: 1,
        });
        await expect(title).toBeVisible();

        await expect(title).toHaveText("Loading State");
    });

    test("Should show loading bar initially and then hide it", async ({
        page,
    }) => {
        // 1. [關鍵修正] 放寬選擇器
        // 直接找 gridjs-loading-bar，並鎖定第一個 (避免抓到其他範例的)
        const loadingBar = page.locator(".gridjs-loading-bar").first();

        // 2. 重新整理頁面以觸發載入
        // 注意：這裡我們刻意不等待 'networkidle'，只等待 DOMContentLoaded
        // 這樣可以儘早開始檢查 Loading Bar
        await page.reload({ waitUntil: "domcontentloaded" });

        // 3. 驗證 Loading Bar 出現
        // 這裡可能會失敗如果載入真的太快 (<100ms)
        // 但通常 Loading State 範例都會刻意 delay 1~2秒
        await expect(loadingBar).toBeVisible();

        // 4. 驗證 Loading Bar 消失
        // 這代表資料載入完成
        await expect(loadingBar).toBeHidden();
    });

    /**
     * 測試情境 2: 驗證資料載入後的正確性
     * 重點：確保 Loading 結束後，表格內真的有資料
     */
    test("Should render data after loading completes", async ({ page }) => {
        const wrapper = page.locator(".gridjs-wrapper").first();
        const loadingBar = wrapper.locator(".gridjs-loading-bar");
        const rows = wrapper.locator("table.gridjs-table tbody tr");

        // 1. 等待 Loading 結束
        // 這是最穩健的寫法：先確認 Loading Bar 消失，再檢查資料
        await expect(loadingBar).toBeHidden();

        // 2. 驗證表格資料是否出現
        // 假設範例載入後會有資料 (如 John, Mark)
        await expect(rows).not.toHaveCount(0); // 確保不為空

        // 3. 驗證特定資料內容 (根據官方範例資料)
        await expect(rows.first()).toContainText("John");
        await expect(rows.first()).toContainText("john@example.com");
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
