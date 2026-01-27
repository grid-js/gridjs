import { test, expect } from '@playwright/test';

test.describe('Grid.js Documentation - Introduction Section', () => {

	test.describe('What is Grid.js Page Tests', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('https://gridjs.io/docs');
		});

		test('should verify home button navigation', async ({ page }) => {
			const homeButton = page.locator('a[href="/"]').first();
			await expect(homeButton).toBeVisible();

			await homeButton.click();
			await page.waitForLoadState('networkidle');

			expect(page.url()).toBe('https://gridjs.io/');
		});

		test('should verify Preact link', async ({ page }) => {
			const preactLink = page.locator('a[href*="preact"]');
			await expect(preactLink).toBeVisible();
			await expect(preactLink).toHaveText('Preact');

			// Verify it's an external link
			const href = await preactLink.getAttribute('href');
			expect(href).toBeTruthy();

			// Click and verify opens in new tab or navigates
			const [newPage] = await Promise.all([
				page.context().waitForEvent('page'),
				preactLink.click()
			]);

			await newPage.waitForLoadState();
			expect(newPage.url()).toContain('preact');
			await newPage.close();
		});

		test('should verify Edit this page link', async ({ page }) => {
			const editLink = page.locator('a.theme-edit-this-page');
			await expect(editLink).toBeVisible();
			await expect(editLink).toContainText('Edit this page');

			// Verify the link points to GitHub license.md file
			const href = await editLink.getAttribute('href');
			expect(href).toContain('github.com/grid-js/website');
			expect(href).toContain('/edit/master/docs/index.md');
		});

		test('should verify Next Philosophy link', async ({ page }) => {
			const nextLink = page.locator('a.pagination-nav__link--next');
			await expect(nextLink).toBeVisible();
			await expect(nextLink).toContainText('Philosophy');

			await nextLink.click();
			await page.waitForLoadState('networkidle');

			expect(page.url()).toContain('/docs/philosophy');
			await expect(page.locator('h1')).toContainText('Philosophy');
		});
	});

	test.describe('Complete Introduction Section Navigation', () => {
		test('should navigate through all Introduction pages', async ({ page }) => {
			// Start at Introduction landing page
			await page.goto('https://gridjs.io/docs');

			// Navigate through each page in order
			const pages = [
				{ name: 'What is Grid.js?', url: '/docs' },
				{ name: 'Philosophy', url: '/philosophy' },
				{ name: 'Sponsors', url: '/sponsors' },
				{ name: 'Roadmap', url: '/roadmap' },
				{ name: 'Community', url: '/community' },
				{ name: 'License', url: '/license' }
			];

			for (const pageInfo of pages) {
				const link = page.locator(`a:has-text("${pageInfo.name}")`).first();
				await link.click();
				await page.waitForLoadState('networkidle');
				expect(page.url()).toContain(pageInfo.url);
			}
		});
	});

	test.describe('Navigation Bar Tests', () => {
		test('should verify main navigation links', async ({ page }) => {
			await page.goto('https://gridjs.io/docs');

			const navLinks = [
				{ text: 'Docs', href: '/docs' },
				{ text: 'Examples', href: '/docs/examples' },
				{ text: 'Support Grid.js', href: '/docs/support-gridjs' },
				{ text: 'Community', href: '/docs/intro/community' },
				{ text: 'Blog', href: '/blog' }
			];

			for (const link of navLinks) {
				const navLink = page.locator(`nav a:has-text("${link.text}")`).first();
				await expect(navLink).toBeVisible();
			}
		});

		test('should verify NPM and GitHub links in header', async ({ page }) => {
			await page.goto('https://gridjs.io/docs');

			const npmLink = page.locator('a:has-text("NPM")').first();
			await expect(npmLink).toBeVisible();

			const githubLink = page.locator('a:has-text("GitHub")').first();
			await expect(githubLink).toBeVisible();
		});
	});
});
