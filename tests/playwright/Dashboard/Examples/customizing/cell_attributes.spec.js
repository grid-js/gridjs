import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/cell-attributes";

test.describe("Grab the title", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("1. Grab the h1 title: Cell Attributes", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "Cell Attributes",
            level: 1,
        });
        await expect(title).toBeVisible();

        await expect(title).toHaveText("Cell Attributes");
    });

    test("Demo: Perfect Formatting with insertText (The Fundamental Fix)", async ({
        page,
    }) => {
        const targetUrl = "http://localhost:3000/docs/examples/cell-attributes";
        await page.goto(targetUrl);

        const codeEditor = page
            .locator("textarea.npm__react-simple-code-editor__textarea")
            .first();
        await expect(codeEditor).toBeVisible();

        // 1. 取得原始程式碼 & 計算手術範圍 (與之前相同，保留 .render)
        const originalCode = await codeEditor.inputValue();

        const startMatch = originalCode.match(/new Grid\(\{/);
        if (!startMatch) throw new Error("找不到 new Grid({");
        const startPos = startMatch.index + startMatch[0].length;

        const endPos = originalCode.lastIndexOf("})");
        if (endPos === -1) throw new Error("找不到結尾的 })");

        // 2. 選取並刪除舊內容
        await codeEditor.evaluate(
            (node, { start, end }) => {
                node.setSelectionRange(start, end);
                node.focus();
            },
            { start: startPos, end: endPos },
        );

        await page.keyboard.press("Backspace");

        // 3. ✨ 定義完美排版的程式碼 ✨
        // 直接用反引號即可，insertText 會忠實呈現每一個空格
        // 注意：第一行開頭加上 \n 確保從新的一行開始
        const prettyConfig = `
      columns: [
        {
          name: 'Name',
          attributes: (cell) => {
            if (cell === 'John') {
              return {
                'style': 'color: red; font-weight: bold;',
                'data-test': 'john-cell'
              };
            }
          }
        },
        'Email'
      ],
      data: [
        ['John', 'john@example.com'],
        ['Mark', 'mark@gmail.com']
      ]`;

        // 4.
        // 我們不使用 pressSequentially (它會觸發 Enter 導致縮排亂掉)
        // 使用 insertText (純粹插入文字，不觸發編輯器的自動縮排)
        const delay = 15; // 打字速度 (毫秒)

        for (const char of prettyConfig) {
            await page.keyboard.insertText(char);
            await page.waitForTimeout(delay);
        }

        // 5. 觸發更新 (Space + Backspace)
        // 確保 React 偵測到 changes
        await page.waitForTimeout(10000);
        await page.keyboard.press("Space");
        await page.keyboard.press("Backspace");

        // --- 驗證階段 ---
        const gridContainer = page.locator(".gridjs-container").first();
        const johnCell = gridContainer
            .locator("td", { hasText: /^John$/ })
            .first();

        // 驗證 Mock Data 與 Style
        await expect(johnCell).toBeVisible();
        await expect(johnCell).toHaveCSS("color", "rgb(255, 0, 0)");
        await expect(johnCell).toHaveCSS("font-weight", "700");
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
