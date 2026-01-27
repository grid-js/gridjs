import { test, expect } from '@playwright/test';

// ========================================
// TEST 1: Install Page Tests
// ========================================
test.describe('Install Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://gridjs.io/docs/install');
        await page.waitForLoadState('networkidle');
    });

    test('should verify page title and heading', async ({ page }) => {
        await expect(page).toHaveTitle(/Install.*Grid\.js/);
        const heading = page.locator('h1:has-text("Install")');
        await expect(heading).toBeVisible();
        console.log('✓ Install page title and heading verified');
    });

    test('should verify Node.js section exists', async ({ page }) => {
        const nodejsHeading = page.locator('h2:has-text("Node.js"), h3:has-text("Node.js")');
        await expect(nodejsHeading).toBeVisible();
        console.log('✓ Node.js section verified');
    });

    test('should verify Browser section exists', async ({ page }) => {
        const browserHeading = page.locator('h2:has-text("Browser"), h3:has-text("Browser")');
        await expect(browserHeading).toBeVisible();
        console.log('✓ Browser section verified');
    });

    test('should verify NPM installation command', async ({ page }) => {
        const npmCommand = page.locator('text=npm install gridjs');
        await expect(npmCommand).toBeVisible();
        console.log('✓ NPM install command present');
    });

    test('should verify and test unpkg link', async ({ page, context }) => {
        const unpkgLink = page.locator('a[href*="unpkg.com"]').first();
        await expect(unpkgLink).toBeVisible();

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            unpkgLink.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        expect(newPage.url()).toContain('unpkg.com/gridjs@6.2.0/files/dist');
        console.log('✓ unpkg.com link navigation successful');

        await newPage.close();
    });

    test('should verify jsdelivr links present', async ({ page }) => {
        const jsdelivrLink = page.locator('a[href*="jsdelivr.com"]').first();
        await expect(jsdelivrLink).toBeVisible();
        
        const href = await jsdelivrLink.getAttribute('href');
        expect(href).toContain('jsdelivr.com/package/npm/gridjs');
        console.log('✓ jsdelivr.com link verified');
    });

    test('should verify unpkg section heading', async ({ page }) => {
        const unpkgHeading = page.locator('h2:has-text("unpkg"), h3:has-text("unpkg")');
        await expect(unpkgHeading).toBeVisible();
        console.log('✓ unpkg section heading verified');
    });

    test('should verify jsdelivr section heading', async ({ page }) => {
        const jsdelivrHeading = page.locator('h2:has-text("jsdelivr"), h3:has-text("jsdelivr")');
        await expect(jsdelivrHeading).toBeVisible();
        console.log('✓ jsdelivr section heading verified');
    });

    test('should verify Edit this page link', async ({ page }) => {
        const editLink = page.getByRole('link', { name: 'Edit this page' });
        await expect(editLink).toBeVisible();
        await expect(editLink).toContainText('Edit this page');

        const href = await editLink.getAttribute('href');
        expect(href).toContain('github.com/grid-js/website');
        expect(href).toContain('/edit/master/docs/install.md');
        console.log('✓ Edit this page link verified');
    });

    test('should verify Previous link', async ({ page }) => {
        const prevLink = page.locator('a.pagination-nav__link--prev');
        await expect(prevLink).toBeVisible();
        await expect(prevLink).toContainText('License');

        await prevLink.click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/docs/license');
        console.log('✓ Previous link clicked - navigated to License');
    });

    test('should verify Next link', async ({ page }) => {
        const nextLink = page.locator('a.pagination-nav__link--next');
        await expect(nextLink).toBeVisible();
        await expect(nextLink).toContainText('Hello World');

        await nextLink.click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/docs/hello-world');
        console.log('✓ Next link clicked - navigated to Hello World');
    });

});
