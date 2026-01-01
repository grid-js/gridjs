import { test, expect } from '@playwright/test';


// ========================================
// TEST 3: Configuration Page Tests
// ========================================
test.describe('Configuration Page Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('https://gridjs.io/docs/config');
		await page.waitForLoadState('networkidle');
	});

	test('should verify page title and heading', async ({ page }) => {
		await expect(page).toHaveTitle(/Configuration|Config/);
		const heading = page.locator('h1:has-text("Configuration")');
		await expect(heading).toBeVisible();
		console.log('✓ Configuration page title and heading verified');
	});

	test('should verify Grid constructor section', async ({ page }) => {
		const constructorHeading = page.locator('h2:has-text("Grid constructor"), h3:has-text("Grid constructor")');
		await expect(constructorHeading).toBeVisible();
		console.log('✓ Grid constructor section verified');
	});

	test('should verify updateConfig section', async ({ page }) => {
		const updateConfigHeading = page.locator('h2:has-text("updateConfig"), h3:has-text("updateConfig")');
		await expect(updateConfigHeading).toBeVisible();
		console.log('✓ updateConfig section verified');
	});

	test('should verify new Grid code example', async ({ page }) => {
		const newGrid = page.getByText('new Grid').first();
		await expect(newGrid).toBeVisible();
		console.log('✓ new Grid code example verified');
	});

	test('should verify columns configuration example', async ({ page }) => {
		const columnsExample = page.getByText('columns').first();
		await expect(columnsExample).toBeVisible();

		const nameColumn = page.getByText(/Name|Email|Phone/);
		await expect(nameColumn.first()).toBeVisible();
		console.log('✓ Columns configuration example verified');
	});


	test('should verify link to Config details', async ({ page }) => {
		const configLink = page.locator('a[href*="/docs/config/data"]').first();
		if (await configLink.isVisible()) {
			const href = await configLink.getAttribute('href');
			expect(href).toContain('/docs/config/data');
			console.log('✓ Link to Config details verified');
		}
	});

	test('should verify and test examples link', async ({ page }) => {
		const examplesLink = page.locator('a[href*="/examples/hello-world"]').first();
		if (await examplesLink.isVisible()) {
			await examplesLink.click();
			await page.waitForLoadState('networkidle');
			expect(page.url()).toContain('/examples/hello-world');
			console.log('✓ Examples link navigation successful');
		}
	});

	test('should verify render method mentioned', async ({ page }) => {
		const render = page.locator('text=render');
		await expect(render).toBeVisible();
		console.log('✓ Render method mention verified');
	});

	test('should verify Edit this page link', async ({ page }) => {
		const editLink = page.locator('a.theme-edit-this-page');
		await expect(editLink).toBeVisible();
		await expect(editLink).toContainText('Edit this page');

		const href = await editLink.getAttribute('href');
		expect(href).toContain('github.com/grid-js/website');
		expect(href).toContain('/edit/master/docs/config.md');
		console.log('✓ Edit this page link verified');
	});

	test('should verify Previous link', async ({ page }) => {
		const prevLink = page.locator('a.pagination-nav__link--prev');
		await expect(prevLink).toBeVisible();
		await expect(prevLink).toContainText('Hello World');

		await prevLink.click();
		await page.waitForLoadState('networkidle');

		expect(page.url()).toContain('/docs/hello-world');
		console.log('✓ Previous link clicked - navigated to Hello World');
	});

	test('should verify Next link', async ({ page }) => {
		const nextLink = page.locator('a.pagination-nav__link--next');
		await expect(nextLink).toBeVisible();
		await expect(nextLink).toContainText('Server-side setup');

		await nextLink.click();
		await page.waitForLoadState('networkidle');

		expect(page.url()).toContain('/docs/server-side');
		console.log('✓ Next link clicked - navigated to Server-side');
	});
});
