import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/hello-world";

test.describe("UI testing", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/examples/hello-world",
        );
    });

    test("1. Grab the h1 title: Hello, World!", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "Hello, World!",
            level: 1,
        });
        await expect(title).toBeVisible();

        await expect(title).toHaveText("Hello, World!");
    });

    /**
     * 測試情境 1: 驗證表格結構與標頭
     * 目標：確保表格欄位名稱 (Columns) 正確顯示
     */
    test("Should render table headers correctly", async ({ page }) => {
        const table = page.locator("table.gridjs-table").first();

        // 驗證表格可見
        await expect(table).toBeVisible();

        // 驗證標頭文字與順序
        // 根據官方範例，標頭應為: Name, Email, Phone Number
        const headers = table.locator("th");
        await expect(headers).toHaveText(["Name", "Email", "Phone Number"]);
    });

    /**
     * 測試情境 2: 驗證資料內容
     * 目標：檢查表格內的實際資料 (Rows & Cells) 是否與預期相符
     */
    test("Should display correct data in rows", async ({ page }) => {
        const rows = page.locator("table.gridjs-table tbody tr");

        // --- 驗證第一筆資料 (John) ---
        const firstRowCells = rows.nth(0).locator("td");
        await expect(firstRowCells.nth(0)).toHaveText("John");
        await expect(firstRowCells.nth(1)).toHaveText("john@example.com");
        await expect(firstRowCells.nth(2)).toHaveText("(353) 01 222 3333");

        // --- 驗證第二筆資料 (Mark) ---
        const secondRowCells = rows.nth(1).locator("td");
        await expect(secondRowCells.nth(0)).toHaveText("Mark");
        await expect(secondRowCells.nth(1)).toHaveText("mark@gmail.com");
        await expect(secondRowCells.nth(2)).toHaveText("(01) 22 888 4444");

        // (可選) 驗證總筆數，確保沒有多餘或缺少的資料
        // Hello World 範例通常有 2 筆或更多，視您的版本而定，這裡假設檢查前兩筆
        await expect(rows.nth(0)).toBeVisible();
        await expect(rows.nth(1)).toBeVisible();
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
