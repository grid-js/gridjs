import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/localization/locales";

test.describe("Grab titles in the Localization page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("Grab the h1 title: Locales", async ({ page }) => {
        const title = page.getByRole("heading", { name: "Locales", level: 1 });
        await expect(title).toBeVisible();
        await expect(title).toHaveText("Locales");
    });

    test("Grab the h2 title: Installing a Locale", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "Installing a Locale",
            level: 2,
        });
        await expect(title).toBeVisible();
        await expect(title).toHaveText("Installing a Locale");
    });

    test("Grab the listitems", async ({ page }) => {
        // Not sure why there are two "tr_TR" in the list 0-0
        const items = [
            "ar_SA",
            "cn_CN",
            "de_De",
            "en_US",
            "es_ES",
            "fa_IR",
            "fr_FR",
            "id_ID",
            "it_IT",
            "tr_TR",
            "ja_JP",
            "ko_KR",
            "nb_NO",
            "pt_BR",
            "pt_PT",
            "ru_RU",
            "tr_TR",
            "ua_UA",
        ];

        var tr_count = 0;

        for (const item of items) {
            if (item === "tr_TR") {
                const listitem = page
                    .getByRole("listitem")
                    .filter({ hasText: item })
                    .nth(tr_count);
                await expect(listitem).toBeVisible();
                await expect(listitem).toHaveText(item);
                tr_count++;
            } else {
                const listitem = page
                    .getByRole("listitem")
                    .filter({ hasText: item });
                await expect(listitem).toBeVisible();
                await expect(listitem).toHaveText(item);
            }
        }
    });

    test("Grab the h2 title: Creating a Locale", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "Creating a Locale",
            level: 2,
        });
        await expect(title).toBeVisible();
        await expect(title).toHaveText("Creating a Locale");
    });
});

test.describe("Check the links in the localozation page", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("Check the link: Installing a Locale", async ({ page }) => {
        const link = page.getByRole("link", { name: "Installing a Locale" });
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/localization/locales#installing-a-locale",
        );
    });

    test("Check the link: Creating a Locale", async ({ page }) => {
        const link = page.getByRole("link", { name: "Creating a Locale" });
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/localization/locales#creating-a-locale",
        );
    });

    test("Check the link: en_US", async ({ page }) => {
        const link = page.getByRole("link", { name: "en_US" });
        await expect(link).toBeVisible();
        await link.click();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();

        await expect(newPage).toHaveURL(
            "https://github.com/grid-js/gridjs/blob/master/src/i18n/en_US.ts",
        );
    });

    test("Check the link: Previous << jQuery", async ({ page }) => {
        const link = page.getByRole("link", { name: /Previous.*jQuery/ });
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/integrations/jquery",
        );
    });

    test("Check the link: Next Hello, World! >>", async ({ page }) => {
        const link = page.getByRole("link", { name: /Next Hello, World!.*/ });
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/examples/hello-world",
        );
    });

    test("Check the link in the Note section: https://unpkg.com/gridjs/l10n/dist/l10n.umd.js", async ({
        page,
    }) => {
        const link = page.getByRole("link", {
            name: "https://unpkg.com/gridjs/l10n/dist/l10n.umd.js",
        });
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();

        await expect(newPage).toHaveURL(
            "https://unpkg.com/gridjs@6.2.0/l10n/dist/l10n.umd.js",
        );
    });
});

test.describe("All links on the Locales page", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/docs/localization/locales");
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

test.describe("Scrolling test", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/localization/locales",
        );
    });

    test("Test for the button that scoll to the top of page", async ({
        page,
    }) => {
        await page.keyboard.press("End");
        await page.waitForTimeout(500);

        await page.mouse.wheel(0, -300);

        // Now the button should appear
        const button = page.getByRole("button", { name: "Scroll back to top" });
        await expect(button).toBeVisible();

        await button.click();
        await page.waitForTimeout(500);

        const curr_y = await page.evaluate(() => window.scrollY);
        expect(curr_y).toBe(0);
    });
});

// TODO: The table in the "Installing a Locale" section also has the same issue as the homepage one!
test.describe("Test for the sorting bug", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/localization/locales",
        );
    });

    // ^ - toward, oppsite is backward
    // 1. Click the button that toggle to last page of the table (10 and Suivant both worked)
    // 2. Click the sorting button (default goes toward), this bug worked on Names, Email, and Title sections
    // 3. Click the button that goes the first page of table, and the bug shows up
    // The Bug is: When click to the page 10, and then click sort button, and it will show the content after sorting at the page 10
    // But the after show the content of page 10, it goes back to page 1, and the content on the page 1 is still the content on page 10
    /*
    test("Test for click page 1 and 10 button", async({page}) => {
        const lastPage = page.getByRole("button", { name: "Page 10" });
        await expect(lastPage).toBeVisible();

        await lastPage.click();
        const pageNum = page.getByRole("generic").filter({ hasText: "sur" });
        await expect(pageNum).toHaveText("50");

        const sortButton = page.getByRole("button", { name: "Trier la colonne dans l'ordre croissant" });
        await expect(sortButton).toBeVisible();

        await sortButton.click();

    })
    */
});
