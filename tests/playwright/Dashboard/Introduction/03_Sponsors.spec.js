import { test, expect } from '@playwright/test';

test.describe('Sponsors Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://gridjs.io/docs/sponsors');
        await page.waitForLoadState('networkidle');
    });

    test('should verify page title and heading', async ({ page }) => {
        await expect(page).toHaveTitle(/Sponsors/);
        const heading = page.locator('h1:has-text("Sponsors")');
        await expect(heading).toBeVisible();
        console.log('✓ Sponsors page title verified');
    });

    test('should verify home button navigation', async ({ page }) => {
        const homeButton = page.locator('a[aria-label="Home page"]');
        await expect(homeButton).toBeVisible();

        await homeButton.click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).toBe('https://gridjs.io/');
        console.log('✓ Home button clicked - navigated to homepage');
    });

    test('should verify OpenCollective section', async ({ page, context }) => {
        const openCollectiveHeading = page.locator('h2:has-text("OpenCollective"), h3:has-text("OpenCollective")');
        await expect(openCollectiveHeading).toBeVisible();

        const openCollectiveImg = page.locator('img[src*="opencollective.com"]');
        const count = await openCollectiveImg.count();
        expect(count).toBeGreaterThan(0);

        const link = page.locator('a[href="https://opencollective.com/gridjs/donate"]');
        // await expect(link).toBeVisible();
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            link.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        expect(newPage.url()).toContain('opencollective.com/gridjs/donate');
        console.log('✓ OpenCollective section verified');
        await newPage.close();
    });

    test('should verify One-time donation section', async ({ page, context }) => {
        const donationHeading = page.locator('h2:has-text("One-time donation"), h3:has-text("One-time donation")');
        await expect(donationHeading).toBeVisible();

        const paypalImg = page.locator('img[src="/img/paypal.png"]');
        const count = await paypalImg.count();
        expect(count).toBeGreaterThan(0);

        const link = page.locator('a[href="https://www.paypal.me/afshinmeh"]');
        // await expect(link).toBeVisible();
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            link.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        expect(newPage.url()).toContain('paypal.com/paypalme/afshinmeh');
        console.log('✓ One-time donation section verified');
        await newPage.close();
    });

    test('should verify Edit this page link', async ({ page }) => {
        const editLink = page.locator('a.theme-edit-this-page');
        await expect(editLink).toBeVisible();

        const href = await editLink.getAttribute('href');
        expect(href).toContain('github.com/grid-js/website');
        expect(href).toContain('/edit/master/docs/sponsors.md');
        console.log('✓ Edit this page link verified');
    });

    test('should verify Previous (Philosophy) link', async ({ page }) => {
        const prevLink = page.locator('a.pagination-nav__link--prev');
        await expect(prevLink).toBeVisible();
        await expect(prevLink).toContainText('Philosophy');

        await prevLink.click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/docs/philosophy');
        console.log('✓ Previous link clicked - navigated to Philosophy');
    });

    test('should verify Next (Roadmap) link', async ({ page }) => {
        const nextLink = page.locator('a.pagination-nav__link--next');
        await expect(nextLink).toBeVisible();
        await expect(nextLink).toContainText('Roadmap');

        await nextLink.click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/docs/roadmap');
        console.log('✓ Next link clicked - navigated to Roadmap');
    });
});

