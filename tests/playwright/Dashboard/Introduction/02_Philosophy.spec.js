import { test, expect } from '@playwright/test';

test.describe('Philosophy Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://gridjs.io/docs/philosophy');
        await page.waitForLoadState('networkidle');
    });

    test('should verify page title and heading', async ({ page }) => {
        await expect(page).toHaveTitle(/Philosophy/);
        const heading = page.locator('h1:has-text("Philosophy")');
        await expect(heading).toBeVisible();
        console.log('✓ Philosophy page title verified');
    });

    test('should verify home button navigation', async ({ page }) => {
        const homeButton = page.locator('a[aria-label="Home page"]');
        await expect(homeButton).toBeVisible();

        await homeButton.click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).toBe('https://gridjs.io/');
        console.log('✓ Home button clicked - navigated to homepage');
    });

    test('should verify section headings are present', async ({ page }) => {
        const sections = [
            'No vendor lock-in',
            'Browser support',
            'React Native support',
            'Developer Friendly'
        ];

        for (const section of sections) {
            const heading = page.locator(`h2:has-text("${section}"), h3:has-text("${section}")`);
            await expect(heading).toBeVisible();
        }
        console.log('✓ All section headings verified');
    });

    test('should verify data processing library link', async ({ page, context }) => {
        const link = page.getByRole('link', { name: 'data processing library' });
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            link.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        expect(newPage.url()).toContain('github.com/grid-js/gridjs/tree/master/src/pipeline');
        console.log('✓ Data processing library link clicked');

        await newPage.close();
    });

    test('should verify Edit this page link', async ({ page }) => {
        const editLink = page.locator('a.theme-edit-this-page');
        await expect(editLink).toBeVisible();
        await expect(editLink).toContainText('Edit this page');

        const href = await editLink.getAttribute('href');
        expect(href).toContain('github.com/grid-js/website');
        expect(href).toContain('/edit/master/docs/philosophy.md');
        console.log('✓ Edit this page link verified');
    });

    test('should verify Previous (What is Grid.js?) link', async ({ page }) => {
        const prevLink = page.locator('a.pagination-nav__link--prev');
        await expect(prevLink).toBeVisible();
        await expect(prevLink).toContainText('What is Grid.js?');

        await prevLink.click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/docs');
        console.log('✓ Previous link clicked - navigated to What is Grid.js?');
    });

    test('should verify Next (Sponsors) link', async ({ page }) => {
        const nextLink = page.locator('a.pagination-nav__link--next');
        await expect(nextLink).toBeVisible();
        await expect(nextLink).toContainText('Sponsors');

        await nextLink.click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/docs/sponsors');
        console.log('✓ Next link clicked - navigated to Sponsors');
    });

});

