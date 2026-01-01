import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/pagination";

test.describe("UI testing", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("Grab the h1 title: Pagination", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "pagination",
            level: 1,
        });
        await expect(title).toBeVisible(title);

        await expect(title).toHaveText("Pagination");
    });

    test("Check the home page link", async ({ page }) => {
        const link = page.getByRole("link", { name: "Home page" });
        await expect(link).toBeVisible();

        await link.click();

        await expect(page).toHaveURL("http://localhost:3000");
    });

    test("When pagination is set to true", async ({ page }) => {
        // Previous and Next page button should be exist
        const previous = page.getByRole("button", { name: "Previous" }).nth(1);
        const next = page.getByRole("button", { name: "Next" }).nth(1);

        await expect(previous).toBeVisible();
        await expect(next).toBeVisible();
    });

    test("When pagination is set to false", async ({ page }) => {
        const codeEditor = page
            .locator("textarea.npm__react-simple-code-editor__textarea")
            .first();

        // 2. 準備新的配置代碼 (明確設定 pagination: false)
        // 我們使用 "Fill + Type" 混合策略來確保編輯器觸發更新
        const codeBody = `
        new Grid({
          columns: ['Name', 'Email', 'Phone Number'],
          data: [
            ['John', 'john@example.com', '(353) 01 222 3333'],
            ['Mark', 'mark@gmail.com', '(01) 22 888 4444'],
            ['Eoin', 'eo3n@yahoo.com', '(05) 10 878 5554'],
            ['Nisen', 'nis900@gmail.com', '313 333 1923']
          ],
          pagination: false
        })`.trim(); // 故意不加分號，留給 type 輸入

        // 3. 操作編輯器：清空舊代碼
        await codeEditor.click();
        await codeEditor.focus();
        const modifier = process.platform === "darwin" ? "Meta" : "Control";
        await page.keyboard.press(`${modifier}+A`);
        await page.keyboard.press("Backspace");

        // 4. 輸入新代碼
        // Step A: 快速填入主體
        await codeEditor.fill(codeBody);
        // Step B: 手動輸入結尾分號，強制觸發 Live Preview 重新渲染
        await codeEditor.type(";", { delay: 100 });

        // Previous and Next page button should not be exist
        const previous = page.getByRole("button", { name: "Previous" }).nth(1);
        const next = page.getByRole("button", { name: "Next" }).nth(1);

        await expect(previous).not.toBeVisible();
        await expect(next).not.toBeVisible();
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
