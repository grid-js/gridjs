import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/resizable";

test.describe("Grab the title", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("1. Grab the h1 title: Resizable columns", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "Resizable columns",
            level: 1,
        });
        await expect(title).toBeVisible();

        await expect(title).toHaveText("Resizable columns");
    });

    test("Should resize column width when dragged", async ({ page }) => {
        // 1. 鎖定目標欄位 (Email)
        // 我們使用 first() 確保只操作第一個表格
        const emailHeader = page
            .locator("th")
            .filter({ hasText: "Email" })
            .first();

        // 2. 鎖定該欄位內部的"調整手柄"
        // Grid.js 的實作中，這是 th 內部的一個 div，class 通常為 .gridjs-resizable
        const resizerHandle = emailHeader.locator(".gridjs-resizable");

        // 確保手柄存在 (有些情況下如果沒設定 resizable: true 就不會有這個元素)
        await expect(resizerHandle).toBeVisible();

        // 3. 取得初始寬度 (Initial Width)
        // 使用 boundingBox() 取得元素的精確幾何資訊
        const initialBox = await emailHeader.boundingBox();
        if (!initialBox) throw new Error("Cannot get initial bounding box");

        // 4. 取得手柄的座標，準備進行拖曳
        const resizerBox = await resizerHandle.boundingBox();
        if (!resizerBox) throw new Error("Cannot get resizer bounding box");

        // 計算拖曳的起點 (Start Point): 手柄的中心點
        const startX = resizerBox.x + resizerBox.width / 2;
        const startY = resizerBox.y + resizerBox.height / 2;

        // 定義拖曳距離 (向右拖 100px)
        const dragDistance = 100;

        // 5. 執行滑鼠拖曳模擬 (Mouse Simulation)
        // Playwright 的 dragTo 有時對這種細微 UI 操作不夠精確，我們使用 mouse API 手動控制

        // a. 移動到手柄位置
        await page.mouse.move(startX, startY);

        // b. 按下滑鼠左鍵 (Mouse Down)
        await page.mouse.down();

        // c. 移動滑鼠 (Mouse Move) - 模擬拖曳過程
        // 建議分段移動或直接移動到終點
        await page.mouse.move(startX + dragDistance, startY, { steps: 5 }); // steps: 5 讓移動稍微平滑一點

        // d. 放開滑鼠 (Mouse Up)
        await page.mouse.up();

        // 6. 取得最終寬度 (Final Width)
        // 等待一點點時間讓 DOM 完成重繪 (雖然通常是同步的，但在測試中加上 waitForTimeout 比較穩健)
        // await page.waitForTimeout(100);
        const finalBox = await emailHeader.boundingBox();
        if (!finalBox) throw new Error("Cannot get final bounding box");

        // 7. 驗證結果
        // 最終寬度應該大於初始寬度 (考慮到一點點誤差，我們預期它至少增加 50px 以上)
        console.log(
            `Initial Width: ${initialBox.width}, Final Width: ${finalBox.width}`,
        );

        expect(finalBox.width).toBeGreaterThan(initialBox.width);

        // 更精確的斷言：寬度增加量應該接近我們拖曳的距離
        // (注意：瀏覽器渲染可能有 sub-pixel 差異，所以不建議用 toBe(initial + 100))
        expect(finalBox.width).toBeGreaterThan(initialBox.width + 50);
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
