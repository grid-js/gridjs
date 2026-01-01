import { test, expect } from '@playwright/test';

// ========================================
// TEST 2: Hello World Page Tests
// ========================================
test.describe('Hello World Page Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('https://gridjs.io/docs/hello-world');
		await page.waitForLoadState('networkidle');
	});

	test('should verify page title', async ({ page }) => {
		await expect(page).toHaveTitle(/Hello.*World/);
		console.log('✓ Hello World page title verified');
	});

	test('should verify Grid.js code example present', async ({ page }) => {
		const newGrid = page.getByText('new Grid').first();
		await expect(newGrid).toBeVisible();
		console.log('✓ Grid.js code example verified');
	});

	test('should verify columns configuration shown', async ({ page }) => {
		const columns = page.getByText('columns').first();
		await expect(columns).toBeVisible();
		console.log('✓ Columns configuration verified');
	});

	test('should verify data configuration shown', async ({ page }) => {
		const data = page.getByText('data').first();
		await expect(data).toBeVisible();
		console.log('✓ Data configuration verified');
	});

	test('should verify code blocks are present', async ({ page }) => {
		const codeBlocks = page.locator('pre, code');
		await expect(codeBlocks.first()).toBeVisible();
		const count = await codeBlocks.count();
		expect(count).toBeGreaterThan(0);
		console.log(`✓ Code blocks verified (${count} found)`);
	});

	test('should verify home button navigation', async ({ page }) => {
		const homeButton = page.locator('a[aria-label="Home page"]');
		if (await homeButton.isVisible()) {
			await homeButton.click();
			await page.waitForLoadState('networkidle');
			expect(page.url()).toBe('https://gridjs.io/');
			console.log('✓ Home button navigation verified');
		}
	});

	test('should verify React integration section', async ({ page, context }) => {
		const reactLink = page.getByRole('link', { name: 'React integration' });
		await expect(reactLink).toBeVisible();
		await reactLink.click();
		await page.waitForLoadState('networkidle');

		expect(page.url()).toContain('/docs/integrations/react');
		console.log('✓ React integration link verified');
	});

	test('should verify Edit this page link', async ({ page }) => {
		const editLink = page.locator('a.theme-edit-this-page');
		await expect(editLink).toBeVisible();
		await expect(editLink).toContainText('Edit this page');

		const href = await editLink.getAttribute('href');
		expect(href).toContain('github.com/grid-js/website');
		expect(href).toContain('/edit/master/docs/hello-world.md');
		console.log('✓ Edit this page link verified');
	});

	test('should verify Previous link', async ({ page }) => {
		const prevLink = page.locator('a.pagination-nav__link--prev');
		await expect(prevLink).toBeVisible();
		await expect(prevLink).toContainText('Install');

		await prevLink.click();
		await page.waitForLoadState('networkidle');

		expect(page.url()).toContain('/docs/install');
		console.log('✓ Previous link clicked - navigated to Install');
	});

	test('should verify Next link', async ({ page }) => {
		const nextLink = page.locator('a.pagination-nav__link--next');
		await expect(nextLink).toBeVisible();
		await expect(nextLink).toContainText('Configuration');

		await nextLink.click();
		await page.waitForLoadState('networkidle');

		expect(page.url()).toContain('/docs/config');
		console.log('✓ Next link clicked - navigated to Configuration');
	});
});
