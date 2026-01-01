import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/fixed-header";

test.describe("Fixed Header example page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("has h1 title 'Fixed Header'", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "Fixed Header",
            level: 1,
        });
        await expect(title).toBeVisible();
        await expect(title).toHaveText("Fixed Header");
    });

    test("renders Grid.js table with expected columns", async ({ page }) => {
        await page.waitForSelector(".gridjs-wrapper");
        const nameHeader = page.locator('th[data-column-id="name"]');
        const emailHeader = page.locator('th[data-column-id="email"]');
        const titleHeader = page.locator('th[data-column-id="title"]');
        await expect(nameHeader).toBeVisible();
        await expect(emailHeader).toBeVisible();
        await expect(titleHeader).toBeVisible();
    });

    test("header stays visible when table content scrolls", async ({
        page,
    }) => {
        const container = page.locator(".gridjs-wrapper");
        await expect(container).toBeVisible();

        const scrollable = await container.evaluate(
            (el) => el.scrollHeight > el.clientHeight,
        );
        expect(scrollable).toBeTruthy();

        await container.evaluate((el) => {
            el.scrollTop = 200;
        });
        const headerName = page.locator('th[data-column-id="name"]');
        await expect(headerName).toBeVisible();
    });

    test("pagination shows 10 rows per page", async ({ page }) => {
        const rows = page.locator(".gridjs-container table tbody tr");
        await expect(rows).toHaveCount(10);
    });

    test("pagination navigates to page 2 and changes rows", async ({
        page,
    }) => {
        const firstRow = page
            .locator(".gridjs-container table tbody tr")
            .first();
        const before = (await firstRow.textContent())?.trim();

        const pageTwoBtn = page
            .locator(".gridjs-pages")
            .getByRole("button", { name: "2" });
        await expect(pageTwoBtn).toBeVisible();
        await pageTwoBtn.click();

        const afterRow = page
            .locator(".gridjs-container table tbody tr")
            .first();
        await expect(afterRow).not.toHaveText(before || "");
    });

    test("sorting by Name toggles ascending/descending", async ({ page }) => {
        const sortBtn = page.locator(
            'th[data-column-id="name"] button.gridjs-sort',
        );
        await expect(sortBtn).toBeVisible();

        const getNames = async () => {
            return await page
                .locator(".gridjs-wrapper table tbody tr td:nth-child(1)")
                .allTextContents();
        };

        await sortBtn.click();
        await page.waitForTimeout(200);
        const asc = await getNames();
        const sortedAsc = [...asc].sort((a, b) => a.localeCompare(b));
        expect(asc).toEqual(sortedAsc);

        await sortBtn.click();
        await page.waitForTimeout(200);
        const desc = await getNames();
        const sortedDesc = [...desc].sort((a, b) => b.localeCompare(a));
        expect(desc).toEqual(sortedDesc);
    });

    test("header position sticks to container top on scroll", async ({
        page,
    }) => {
        // 確保前往正確的頁面 (如果原本的 beforeAll 有寫可以省略)
        // await page.goto('https://gridjs.io/docs/examples/fixed-header');

        // 1. 鎖定容器
        const container = page.locator(".gridjs-wrapper").first();

        // 2. [修正關鍵] 鎖定 'th' 而非 'thead'
        // Grid.js 的 sticky 屬性是寫在 th 上的
        const headerCell = container.locator("th").first();

        // 確保元素已載入
        await headerCell.waitFor();

        // 取得容器的 Top 座標
        const { top: cTop } = await container.evaluate((el) =>
            el.getBoundingClientRect(),
        );

        // 取得 Header Cell 捲動前的 Top 座標
        const { top: hTopBefore } = await headerCell.evaluate((el) =>
            el.getBoundingClientRect(),
        );

        // 執行捲動
        await container.evaluate((el) => {
            el.scrollTop = 250;
        });

        // [選擇性] 等待一下確保瀏覽器完成 layout update (通常 evaluate 是同步的，但保險起見)
        // await page.waitForTimeout(100);

        // 取得 Header Cell 捲動後的 Top 座標
        const { top: hTopAfter } = await headerCell.evaluate((el) =>
            el.getBoundingClientRect(),
        );

        // 驗證邏輯：
        // 1. 捲動前，Header 應該貼齊 Container (誤差 < 3px)
        expect(Math.abs(hTopBefore - cTop)).toBeLessThan(3);

        // 2. 捲動後，因為 sticky 的關係，Header 應該"視覺上"還是貼齊 Container
        // 如果是普通元素，這裡的差值會接近 250 (因為捲走了)
        // 但因為它是 sticky，這裡的差值應該還是接近 0
        expect(Math.abs(hTopAfter - cTop)).toBeLessThan(3);
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
