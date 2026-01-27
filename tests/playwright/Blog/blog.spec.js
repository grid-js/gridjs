import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/blog";

/*
Try to Grab the title from the post Hello, World!
Expected title: Hello, World!
*/
test("Hello, World!", async ({ page }) => {
    await page.goto(url);

    /*
    1) <a href="/blog/hello-world" class="sidebarItemLink_node_modules-@docusaurus-theme-classic-lib-theme-BlogSidebar-Desktop-styles-module">Hello, World!</a> aka getByLabel('Blog recent posts navigation').getByRole('link', { name: 'Hello, World!' })
    2) <a itemprop="url" href="/blog/hello-world">Hello, World!</a> aka getByRole('main').getByRole('link', { name: 'Hello, World!' })
    */
    const HelloWorldLink = page
        .getByRole("link", {
            name: "Hello, World!",
        })
        .nth(1);

    await expect(HelloWorldLink).toBeVisible();

    await HelloWorldLink.click();
    await page.waitForURL(/.*\/blog\/hello-world/);

    const HelloWorldTitle = page.getByRole("heading", {
        name: "Hello, World!",
        level: 1,
    });
    await expect(HelloWorldTitle).toBeVisible();

    const title = await HelloWorldTitle.textContent();
    expect(title).toBe("Hello, World!");
});

/*
Try to Grab the title from the post Grid.js v3
Expected title: Grid.js v3
*/
test.describe("Blog post: Grid.js v3", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);

        /*
            1) <a href="/blog/gridjs-v3" class="sidebarItemLink_node_modules-@docusaurus-theme-classic-lib-theme-BlogSidebar-Desktop-styles-module">Grid.js v3</a> aka getByLabel('Blog recent posts navigation').getByRole('link', { name: 'Grid.js v3' })
            2) <a itemprop="url" href="/blog/gridjs-v3">Grid.js v3</a> aka getByRole('main').getByRole('link', { name: 'Grid.js v3' })
        */
        const GridjsLink = page
            .getByRole("link", {
                name: "Grid.js v3",
            })
            .nth(1);

        await expect(GridjsLink).toBeVisible();

        await GridjsLink.click();
        await page.waitForURL(/.*\/blog\/gridjs-v3/);
    });

    // Grad the h1 title "Grid.js v3"
    test("1. Grab the h1 title: Grid.js v3", async ({ page }) => {
        const GridjsTitle = page.getByRole("heading", {
            name: "Grid.js v3",
            level: 1,
        });
        await expect(GridjsTitle).toBeVisible();

        await expect(GridjsTitle).toHaveText("Grid.js v3");
    });

    // Grad the h2 title "Selection plugin"
    test("2. Grab the h2 title: Selection plugin", async ({ page }) => {
        const SelectionPluginTitle = page.getByRole("heading", {
            name: "Selection plugin",
            level: 2,
        });
        await expect(SelectionPluginTitle).toBeVisible();

        await expect(SelectionPluginTitle).toHaveText("Selection plugin");
    });

    // Grad the h2 title "Lerna"
    test("3. Grab the h2 title: Lerna", async ({ page }) => {
        const LernaTitle = page.getByRole("heading", {
            name: "Lerna",
            level: 2,
        });
        await expect(LernaTitle).toBeVisible();

        await expect(LernaTitle).toHaveText("Lerna");
    });

    test("4. Grab the h2 title: Table width algorithm", async ({ page }) => {
        const TableWidthAlgorithmTitle = page.getByRole("heading", {
            name: "Table width algorithm",
            level: 2,
        });
        await expect(TableWidthAlgorithmTitle).toBeVisible();

        await expect(TableWidthAlgorithmTitle).toHaveText(
            "Table width algorithm",
        );
    });
});

test.describe("Clicks all links on the blog post page: Grid.js v3", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);

        const GridjsLink = page
            .getByRole("link", {
                name: "Grid.js v3",
            })
            .nth(1);

        await expect(GridjsLink).toBeVisible();

        await GridjsLink.click();
        await page.waitForURL(/.*\/blog\/gridjs-v3/);
    });

    test("1. The Github links of the author: Afshin Mehrabani", async ({
        page,
    }) => {
        const Authorlink = page
            .getByRole("link", {
                name: "Afshin Mehrabani",
            })
            .nth(1);
        await expect(Authorlink).toBeVisible();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            Authorlink.click(),
        ]);

        await newPage.waitForLoadState();

        await expect(newPage).toHaveURL("https://github.com/afshinm");
    });

    test("2. selection plugin here", async ({ page }) => {
        const link = page.getByRole("link", { name: "selection plugin here" });
        await expect(link).toBeVisible();

        await link.click();

        // Page Not Found
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/plugins/selection/index",
        );

        const h1title = page.getByRole("heading", {
            name: "Page Not Found",
            level: 1,
        });
        await expect(h1title).toBeVisible();
        await expect(h1title).toHaveText("Page Not Found");
    });

    test("3. Lerna", async ({ page }) => {
        const link = page.getByRole("link", { name: "Lerna" }).first();
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL("https://lerna.js.org/");
    });

    test("4. Older post Hello, World!", async ({ page }) => {
        const link = page.getByRole("link", {
            name: "Older Post Hello, World! »",
        });
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL("http://localhost:3000/blog/hello-world");
    });

    test("5. Hello, World! on left side", async ({ page }) => {
        const link = page.getByRole("link", { name: "Hello, World!" }).nth(1);
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL("http://localhost:3000/blog/hello-world");
    });

    test("6. Selection plugin on right side", async ({ page }) => {
        const link = page.getByRole("link", {
            name: "Selection plugin",
            exact: true,
        });
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL(
            "http://localhost:3000/blog/gridjs-v3#selection-plugin",
        );
    });

    test("7. Lerna on right side", async ({ page }) => {
        const link = page.getByRole("link", { name: "Lerna" }).nth(1);
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL(
            "http://localhost:3000/blog/gridjs-v3#lerna",
        );
    });

    test("6. Table width algorithm on right side", async ({ page }) => {
        const link = page.getByRole("link", { name: "Table width algorithm" });
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL(
            "http://localhost:3000/blog/gridjs-v3#table-width-algorithm",
        );
    });

    test("7. announcements", async ({ page }) => {
        const link = page.getByRole("link", { name: "announcements" }).first();
        await expect(link).toBeVisible();
        await link.click();

        await expect(page).toHaveURL(
            "http://localhost:3000/blog/tags/announcements",
        );

        // Grab the title: " 2 posts tagged with "announcements" "
        const title = page.getByRole("heading", {
            name: '2 posts tagged with "announcements"',
            level: 1,
        });
        await expect(title).toHaveText('2 posts tagged with "announcements"');

        // test for more: "View All Tags"
        const tagsLink = page.getByRole("link", { name: "View All Tags" });
        await expect(tagsLink).toBeVisible();
        await tagsLink.click();
        await expect(page).toHaveURL("http://localhost:3000/blog/tags");

        // Grab the h1 title "Tags"
        const tagsTitle = page.getByRole("heading", { name: "Tags", level: 1 });
        await expect(tagsTitle).toBeVisible();
        await expect(tagsTitle).toHaveText("Tags");

        // Grab the h2 title "A"
        const h2Title = page.getByRole("heading", { name: "A", level: 2 });
        await expect(h2Title).toBeVisible();
        await expect(h2Title).toHaveText("A");
    });
});

test.describe("All links on the blog page", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/blog");
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
        const link = page.getByRole("link", { name: "Examples" }).nth(1);
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

// test for the color theme switch function
test.describe("Test for the color theme switch function", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/blog");

        // force the website to be light mode initially
        await page.emulateMedia({ colorScheme: "light" });
    });

    //TODO: Implement the test for the color theme switch function
    test("Ensure that initialized color scheme is light", async ({ page }) => {
        const htmlTag = page.locator("html");
        await expect(htmlTag).toHaveAttribute("data-theme", "light");
    });

    test("Switch to dark mode", async ({ page }) => {
        const htmlTag = page.locator("html");
        await expect(htmlTag).toHaveAttribute("data-theme", "light");

        // Regex expression ot match the button aria-label after switched to dark mode
        const toggleButton = page.getByRole("button", {
            name: /Switch between dark and light mode/i,
        });
        await expect(toggleButton).toBeVisible();
        await expect(toggleButton).toHaveAttribute(
            "aria-label",
            "Switch between dark and light mode (currently light mode)",
        );

        await toggleButton.click();

        await expect(htmlTag).toHaveAttribute("data-theme", "dark");
        await expect(toggleButton).toHaveAttribute(
            "aria-label",
            "Switch between dark and light mode (currently dark mode)",
        );
    });

    test("Switch back to light mode", async ({ page }) => {
        const htmlTag = page.locator("html");
        await expect(htmlTag).toHaveAttribute("data-theme", "light");

        // First, switch color scheme to dark mode
        const toggleButton = page.getByRole("button", {
            name: /Switch between dark and light mode/i,
        });
        await expect(toggleButton).toBeVisible();
        await expect(toggleButton).toHaveAttribute(
            "aria-label",
            "Switch between dark and light mode (currently light mode)",
        );

        await toggleButton.click();

        await expect(htmlTag).toHaveAttribute("data-theme", "dark");
        await expect(toggleButton).toHaveAttribute(
            "aria-label",
            "Switch between dark and light mode (currently dark mode)",
        );

        // Click again to switch back to light mode
        await toggleButton.click();

        await expect(htmlTag).toHaveAttribute("data-theme", "light");
        await expect(toggleButton).toHaveAttribute(
            "aria-label",
            "Switch between dark and light mode (currently light mode)",
        );
    });
});
