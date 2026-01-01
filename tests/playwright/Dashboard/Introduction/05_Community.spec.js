import { test, expect } from '@playwright/test';

// const BASE = 'http://localhost:3000/';

test.describe('Community Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://gridjs.io/docs/community');
        // await page.goto(`${BASE}docs/community`);
        await page.waitForLoadState('networkidle');
    });

    test('should verify page title and heading', async ({ page }) => {
        await expect(page).toHaveTitle(/Community/);
        const heading = page.locator('h1:has-text("Community")');
        await expect(heading).toBeVisible();
        console.log('✓ Community page title verified');
    });

    test('should verify home button navigation', async ({ page }) => {
		await page.goto('https://gridjs.io/docs/community');
        const homeButton = page.locator('a[aria-label="Home page"]');
        await expect(homeButton).toBeVisible();

        await homeButton.click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).toBe('https://gridjs.io/');
        console.log('✓ Home button clicked - navigated to homepage');
    });

    test('should navigate via right sidebar - Discussion Forums', async ({ page }) => {
        const link = page.locator('.table-of-contents a[href="#discussion-forums"]');
        await expect(link).toBeVisible();
        await link.click();
        await expect(page.url()).toContain('#discussion-forums');
    });

    test('should navigate via right sidebar - StackOverflow', async ({ page }) => {
        const link = page.locator('.table-of-contents a[href="#stackoverflow"]');
        await expect(link).toBeVisible();
        await link.click();
        await expect(page.url()).toContain('#stackoverflow');
    });

    test('should navigate via right sidebar - Github Discussions', async ({ page }) => {
        const link = page.locator('.table-of-contents a[href="#github-discussions"]');
        await expect(link).toBeVisible();
        await link.click();
        await expect(page.url()).toContain('#github-discussions');
    });

    test('should navigate via right sidebar - Bug Report', async ({ page }) => {
        const link = page.locator('.table-of-contents a[href="#bug-report"]');
        await expect(link).toBeVisible();
        await link.click();
        await expect(page.url()).toContain('#bug-report');
    });

    test('should navigate via right sidebar - Feature Request', async ({ page }) => {
        const link = page.locator('.table-of-contents a[href="#feature-request"]');
        await expect(link).toBeVisible();
        await link.click();
        await expect(page.url()).toContain('#feature-request');
    });

    test('should navigate via right sidebar - Chat', async ({ page }) => {
        const link = page.locator('.table-of-contents a[href="#chat"]');
        await expect(link).toBeVisible();
        await link.click();
        await expect(page.url()).toContain('#chat');
    });

    test('should navigate via right sidebar - Blog', async ({ page }) => {
        const link = page.locator('.table-of-contents a[href="#blog"]');
        await expect(link).toBeVisible();
        await link.click();
        await expect(page.url()).toContain('#blog');
    });

    test('should verify and click StackOverflow existing questions link', async ({ page, context }) => {
        const link = page.getByRole('link', { name: 'existing questions' });
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            link.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        expect(newPage.url()).toContain('stackoverflow.com/questions/tagged/gridjs');
        console.log('✓ StackOverflow existing questions link clicked');

        await newPage.close();
    });

    // need to login
    test('should verify and click StackOverflow ask question link', async ({ page, context }) => {
        const link = page.getByRole('link', { name: 'ask your own' });
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            link.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        // expect(newPage.url()).toContain('stackoverflow.com/users/login');
        expect(newPage.url()).toContain('stackoverflow.com/questions/ask');
        console.log('✓ StackOverflow ask question link clicked');

        await newPage.close();
    });

    test('should verify and click GitHub Discussions existing link', async ({ page, context }) => {
        const link = page.getByRole('link', { name: 'existing discussions' });
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            link.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        expect(newPage.url()).toContain('github.com/grid-js/gridjs/discussions');
        console.log('✓ GitHub Discussions existing link clicked');

        await newPage.close();
    });

    // need to login
    test('should verify and click GitHub start new discussion link', async ({ page, context }) => {
        const link = page.getByRole('link', { name: 'start a new discussion' });
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            link.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        // expect(newPage.url()).toContain('github.com/grid-js/gridjs/discussions/new/choose');
        expect(newPage.url()).toContain('/github.com/login');
        console.log('✓ GitHub start new discussion link clicked');

        await newPage.close();
    });

    // need to login
    test('should verify and click bug report link', async ({ page, context }) => {
        const link = page.locator('a[href*="github.com/grid-js/gridjs/issues/new"][href*="bug_report"]');
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            link.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        // expect(newPage.url()).toContain('github.com/grid-js/gridjs/issues/new');
        expect(newPage.url()).toContain('/github.com/login');
        console.log('✓ Bug report link clicked');

        await newPage.close();
    });

    // need to login
    test('should verify and click feature request link', async ({ page, context }) => {
        const link = page.locator('a[href*="github.com/grid-js/gridjs/issues/new"][href*="feature_request"]');
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            link.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        // expect(newPage.url()).toContain('github.com/grid-js/gridjs/issues/new');
        expect(newPage.url()).toContain('/github.com/login');
        console.log('✓ Feature request link clicked');

        await newPage.close();
    });

    test('should verify and click Discord link', async ({ page, context }) => {
        const link = page.getByRole("link", { name: "Discord Channel" });        
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            link.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        expect(newPage.url()).toContain('discord.com/invite/K55BwDY');
        console.log('✓ Discord link clicked');

        await newPage.close();
    });

    test('should verify and click Blog link', async ({ page }) => {
        const link = page.locator('a[href="/blog"]').first();
        await expect(link).toBeVisible();

        await link.click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/blog');
        console.log('✓ Blog link clicked');
    });

    test('should verify and click Twitter link', async ({ page, context }) => {
        const link = page.getByRole("link", { name: "@grid_js" });
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            link.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        expect(newPage.url()).toContain('x.com/grid_js');
        console.log('✓ Twitter link clicked');

        await newPage.close();
    });

    test('should verify Edit this page link', async ({ page }) => {
        const editLink = page.locator('a.theme-edit-this-page');
        await expect(editLink).toBeVisible();

        const href = await editLink.getAttribute('href');
        expect(href).toContain('github.com/grid-js/website');
        expect(href).toContain('/edit/master/docs/community.md');
        console.log('✓ Edit this page link verified');
    });

    test('should verify Previous (Roadmap) link', async ({ page }) => {
        const prevLink = page.locator('nav.pagination-nav a.pagination-nav__link--prev');
        await expect(prevLink).toBeVisible();
        await expect(prevLink).toContainText('Roadmap');

        await prevLink.click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/docs/roadmap');
        console.log('✓ Previous link clicked - navigated to Roadmap');
    });

    test('should verify Next (License) link', async ({ page }) => {
        const nextLink = page.locator('nav.pagination-nav a.pagination-nav__link--next');
        await expect(nextLink).toBeVisible();
        await expect(nextLink).toContainText('License');

        await nextLink.click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/docs/license');
        console.log('✓ Next link clicked - navigated to License');
    });
});