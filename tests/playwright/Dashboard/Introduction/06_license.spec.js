import { test, expect } from '@playwright/test';

test.describe('Grid.js Documentation - Introduction Section', () => {

	test.describe('License Page Tests', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('https://gridjs.io/docs/license');
		});

		test('should verify Gmail link opens correctly', async ({ page }) => {
			const gmailLink = page.locator('a[href="mailto:afshin.meh@gmail.com"]');
			await expect(gmailLink).toBeVisible();
			await expect(gmailLink).toHaveAttribute('href', 'mailto:afshin.meh@gmail.com');
			await expect(gmailLink).toHaveText('afshin.meh@gmail.com');
		});

		test('should verify Edit this page link', async ({ page }) => {
			const editLink = page.locator('a.theme-edit-this-page');
			await expect(editLink).toBeVisible();
			await expect(editLink).toContainText('Edit this page');

			// Verify the link points to GitHub license.md file
			const href = await editLink.getAttribute('href');
			expect(href).toContain('github.com/grid-js/website');
			expect(href).toContain('/edit/master/docs/license.md');
		});

		test('should verify Previous page link to Community', async ({ page }) => {
			// Find the Previous navigation link in pagination
			const prevLink = page.locator('nav.pagination-nav a.pagination-nav__link--prev');
			await expect(prevLink).toBeVisible();

			// Verify the label
			await expect(prevLink.locator('.pagination-nav__label')).toContainText('Community');

			await prevLink.click();
			await page.waitForLoadState('networkidle');

			expect(page.url()).toContain('/community');
			await expect(page.locator('h1')).toContainText('Community');
		});

		test('should verify Next page link to Install', async ({ page }) => {
			// Find the Next navigation link in pagination
			const nextLink = page.locator('nav.pagination-nav a.pagination-nav__link--next');
			await expect(nextLink).toBeVisible();

			// Verify the label
			await expect(nextLink.locator('.pagination-nav__label')).toContainText('Install');

			await nextLink.click();
			await page.waitForLoadState('networkidle');

			expect(page.url()).toContain('/install');
		});

		test('should navigate via right sidebar - Permissions', async ({ page }) => {
			// The TOC is in a separate column on desktop
			const permissionsLink = page.locator('.table-of-contents a[href="#permissions"]');
			await expect(permissionsLink).toBeVisible();
			await expect(permissionsLink).toContainText('Permissions');

			await permissionsLink.click();

			// Verify URL hash changed
			await page.waitForTimeout(500); // Wait for scroll animation
			expect(page.url()).toContain('#permissions');

			// Verify the Permissions heading is visible (h3 not h2)
			const permissionsHeading = page.locator('h3#permissions');
			await expect(permissionsHeading).toBeVisible();
			await expect(permissionsHeading).toContainText('Permissions');
		});

		test('should navigate via right sidebar - Limitations', async ({ page }) => {
			const limitationsLink = page.locator('.table-of-contents a[href="#limitations"]');
			await expect(limitationsLink).toBeVisible();
			await expect(limitationsLink).toContainText('Limitations');

			await limitationsLink.click();

			await page.waitForTimeout(500);
			expect(page.url()).toContain('#limitations');

			const limitationsHeading = page.locator('h3#limitations');
			await expect(limitationsHeading).toBeVisible();
			await expect(limitationsHeading).toContainText('Limitations');
		});

		test('should navigate via right sidebar - Conditions', async ({ page }) => {
			const conditionsLink = page.locator('.table-of-contents a[href="#conditions"]');
			await expect(conditionsLink).toBeVisible();
			await expect(conditionsLink).toContainText('Conditions');

			await conditionsLink.click();

			await page.waitForTimeout(500);
			expect(page.url()).toContain('#conditions');

			const conditionsHeading = page.locator('h3#conditions');
			await expect(conditionsHeading).toBeVisible();
			await expect(conditionsHeading).toContainText('Conditions');
		});

		test('should navigate via right sidebar - Details', async ({ page }) => {
			const detailsLink = page.locator('.table-of-contents a[href="#details"]');
			await expect(detailsLink).toBeVisible();
			await expect(detailsLink).toContainText('Details');

			await detailsLink.click();

			await page.waitForTimeout(500);
			expect(page.url()).toContain('#details');

			const detailsHeading = page.locator('h3#details');
			await expect(detailsHeading).toBeVisible();
			await expect(detailsHeading).toContainText('Details');
		});

		test('should verify page title and breadcrumbs', async ({ page }) => {
			// Verify page title
			await expect(page.locator('h1')).toContainText('License');

			// Verify breadcrumbs
			const breadcrumbs = page.locator('nav.theme-doc-breadcrumbs');
			await expect(breadcrumbs).toBeVisible();

			const homeLink = breadcrumbs.locator('a[aria-label="Home page"]');
			await expect(homeLink).toBeVisible();

			await expect(breadcrumbs.locator('span.breadcrumbs__link').first()).toContainText('👋 Introduction');
			await expect(breadcrumbs.locator('.breadcrumbs__item--active span')).toContainText('License');
		});

		test('should verify MIT License content is displayed', async ({ page }) => {
			// Check for key MIT License text
			await expect(page.locator('text=MIT License')).toBeVisible();
			await expect(page.locator('text=Copyright (c) Afshin Mehrabani')).toBeVisible();

			// Verify the main license sections
			const sections = ['Permissions', 'Limitations', 'Conditions', 'Details'];
			for (const section of sections) {
				await expect(page.locator(`h3:has-text("${section}")`)).toBeVisible();
			}
		});
	});
});