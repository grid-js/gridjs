import { test, expect } from '@playwright/test';

// ==================== ROADMAP PAGE ====================
test.describe('Roadmap Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://gridjs.io/docs/roadmap');
        await page.waitForLoadState('networkidle');
    });

    test('should verify page title and heading', async ({ page }) => {
        await expect(page).toHaveTitle(/Roadmap/);
        const heading = page.locator('h1:has-text("Roadmap")');
        await expect(heading).toBeVisible();
        console.log('✓ Roadmap page title verified');
    });

    test('should verify home button navigation', async ({ page }) => {
        const homeButton = page.locator('a[aria-label="Home page"]');
        await expect(homeButton).toBeVisible();

        await homeButton.click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).toBe('https://gridjs.io/');
        console.log('✓ Home button clicked - navigated to homepage');
    });

    test('should verify GitHub issues link', async ({ page, context }) => {
        const githubLink = page.locator('a[href*="github.com/grid-js/gridjs/issues"]');
        await expect(githubLink).toBeVisible();

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            githubLink.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        expect(newPage.url()).toContain('github.com/grid-js/gridjs/issues');
        expect(newPage.url()).toContain('new+feature');
        console.log('✓ GitHub issues link clicked');

        await newPage.close();
    });

    test('should verify page content mentions feature requests', async ({ page }) => {
        const content = page.locator('text=new feature');
        await expect(content).toBeVisible();
        console.log('✓ Feature request content verified');
    });

    test('should verify Edit this page link', async ({ page }) => {
        const editLink = page.locator('a.theme-edit-this-page');
        await expect(editLink).toBeVisible();

        const href = await editLink.getAttribute('href');
        expect(href).toContain('github.com/grid-js/website');
        expect(href).toContain('/edit/master/docs/roadmap.md');
        console.log('✓ Edit this page link verified');
    });

    test('should verify Previous (Sponsors) link', async ({ page }) => {
        const prevLink = page.locator('a.pagination-nav__link--prev');
        await expect(prevLink).toBeVisible();
        await expect(prevLink).toContainText('Sponsors');

        await prevLink.click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/docs/sponsors');
        console.log('✓ Previous link clicked - navigated to Sponsors');
    });

    test('should verify Next (Community) link', async ({ page }) => {
        const nextLink = page.locator('a.pagination-nav__link--next');
        await expect(nextLink).toBeVisible();
        await expect(nextLink).toContainText('Community');

        await nextLink.click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/docs/community');
        console.log('✓ Next link clicked - navigated to Community');
    });
});



