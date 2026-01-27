import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/search";

test.describe("UI testing", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("Grab the h1 title: Search", async ({ page }) => {
        const title = page.getByRole("heading", { name: "Search", level: 1 });
        await expect(title).toBeVisible();

        await expect(title).toHaveText("Search");
    });

    test("Click the home page link", async ({ page }) => {
        const link = page.getByRole("link", { name: "Home page" });
        await expect(link).toBeVisible();

        await link.click();

        await expect(page).toHaveURL("http://localhost:3000");
    });

    test("When search is set to true", async ({ page }) => {
        const firstGridContainer = page.locator(".gridjs-container").first();
        const searchInput = firstGridContainer.locator(
            "input.gridjs-search-input",
        );
        const tableBody = firstGridContainer.locator(
            "table.gridjs-table tbody",
        );

        // 1. 確保搜尋框可見
        await expect(searchInput).toBeVisible();

        // 2. 輸入 'john' (模擬使用者真實打字行為)
        await searchInput.fill("john");

        // 3. 驗證正向結果：應該只剩下一行，且包含 'John'
        // 注意：Grid.js 搜尋反應很快，Playwright 的 expect 會自動 retry 等待 DOM 變更
        const rows = tableBody.locator("tr");
        await expect(rows).toHaveCount(1);
        await expect(rows.first()).toContainText("John");

        // 4. 驗證負向結果：確認其他名字已被過濾掉 (Filtered Out)
        // 我們檢查 tbody 容器內是否"不包含"這些文字
        await expect(tableBody).not.toContainText("Mark");
        await expect(tableBody).not.toContainText("Eoin");
        await expect(tableBody).not.toContainText("Nisen");

        // 替代寫法 (針對特定元素的更嚴格檢查)：
        // 確保找不到含有這些文字的儲存格
        await expect(
            firstGridContainer.getByRole("cell", { name: "Mark" }),
        ).toBeHidden();
        await expect(
            firstGridContainer.getByRole("cell", { name: "Eoin" }),
        ).toBeHidden();
        await expect(
            firstGridContainer.getByRole("cell", { name: "Nisen" }),
        ).toBeHidden();
    });

    test("Demo: Change search from true to false (JS Version)", async ({
        page,
    }) => {
        // 1. 定位編輯器 (確保是第一個可見的編輯器)
        const codeEditor = page
            .locator("textarea.npm__react-simple-code-editor__textarea")
            .first();

        // 確保編輯器已經載入
        await codeEditor.waitFor({ state: "visible" });

        // 2. 取得編輯器目前的程式碼內容
        const originalCode = await codeEditor.inputValue();

        // 3. 尋找 "search: true" 關鍵字的結束位置
        // 我們要找的是 'true' 這個字結束的地方，這樣游標才能放在它的後面
        // 注意：這裡使用正則表達式來處理可能存在的空白 (search: true 或 search:true)
        const match = originalCode.match(/search:\s*true/);

        if (!match) {
            throw new Error(
                "在編輯器中找不到 'search: true'，請確認範例程式碼是否正確",
            );
        }

        // 計算游標應該要在的位置： (匹配到的起始 index) + (匹配到的字串長度)
        // 例如 "search: true" 長度是 12，游標就會定在 true 的後面
        const cursorPosition = match.index + match[0].length;

        await codeEditor.evaluate((node, pos) => {
            // node 就是那個 textarea 元素
            node.setSelectionRange(pos, pos); // 將游標設定到指定位置
            node.focus(); // 確保編輯器獲得焦點
        }, cursorPosition);

        // 5. 模擬真人動作：刪除 "true"
        // "true" 有 4 個字元，所以按 4 次 Backspace
        // delay: 100 讓影片看起來像真人在刪除
        for (let i = 0; i < 4; i++) {
            await page.keyboard.press("Backspace", { delay: 100 });
        }

        // 6. 模擬真人動作：輸入 "false"
        await page.keyboard.type("false", { delay: 100 });

        await page.waitForTimeout(10000); // 停頓一下讓觀眾看到 false
        await page.keyboard.press("Space");
        await page.keyboard.press("Backspace");

        // 8. 驗證結果
        const firstGridContainer = page.locator(".gridjs-container").first();

        // 斷言：搜尋框應該消失
        await expect(
            firstGridContainer.locator("input.gridjs-search-input"),
        ).toBeHidden();

        // 斷言：表格應該還活著 (沒有因為報錯而消失)
        await expect(
            firstGridContainer.locator("table.gridjs-table"),
        ).toBeVisible();
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
