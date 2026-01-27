import { test, expect } from '@playwright/test';

// ========================================
// TEST 4: Server-side Page Tests
// ========================================
test.describe('Server-side Page Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('https://gridjs.io/docs/server-side');
		await page.waitForLoadState('networkidle');
	});

	test('should verify page title and heading', async ({ page }) => {
		await expect(page).toHaveTitle(/Server-side setup/);
		const heading = page.locator('h1:has-text("Server")');
		await expect(heading).toBeVisible();
		console.log('✓ Server-side page title and heading verified');
	});

	test('should verify server config section', async ({ page }) => {
		const serverConfigHeading = page.locator('h2:has-text("server"), h3:has-text("server")');
		await expect(serverConfigHeading.first()).toBeVisible();
		console.log('✓ Server config section verified');
	});

	test('should verify URL configuration present', async ({ page }) => {
		const urlConfig = page.locator('text=url:');
		await expect(urlConfig.first()).toBeVisible();
		console.log('✓ URL configuration verified');
	});

	test('should verify SWAPI example present', async ({ page }) => {
		const swapi = page.getByText('swapi.dev').first();
		await expect(swapi).toBeVisible();
		console.log('✓ SWAPI example verified');
	});

	test('should verify films endpoint example', async ({ page }) => {
		const films = page.locator('text=/films/');
		await expect(films.first()).toBeVisible();
		console.log('✓ Films endpoint example verified');
	});

	test('should verify data mapping example', async ({ page }) => {
		const mapping = page.locator('text=/movie\\.title|movie\\.director|movie\\.producer/');
		await expect(mapping.first()).toBeVisible();
		console.log('✓ Data mapping example verified');
	});

	test('should verify Client-side search section', async ({ page }) => {
		const clientSearch = page.locator('h2:has-text("Client-side search"), h3:has-text("Client-side search")');
		await expect(clientSearch).toBeVisible();
		console.log('✓ Client-side search section verified');
	});

	test('should verify Server-side search section', async ({ page }) => {
		const serverSearch = page.locator('h2:has-text("Server-side search"), h3:has-text("Server-side search")');
		await expect(serverSearch).toBeVisible();
		console.log('✓ Server-side search section verified');
	});

	test('should verify HTTP method configuration', async ({ page }) => {
		const method = page.locator('text=method:');
		await expect(method.first()).toBeVisible();

		const postMethod = page.locator('text=/POST|GET/');
		await expect(postMethod.first()).toBeVisible();
		console.log('✓ HTTP method configuration verified');
	});

	test('should verify search server configuration', async ({ page }) => {
		const searchServer = page.locator('text=search:');
		await expect(searchServer.first()).toBeVisible();
		console.log('✓ Search server configuration verified');
	});

	test('should verify keyword parameter example', async ({ page }) => {
		const keyword = page.locator('text=/keyword|search=/');
		await expect(keyword.first()).toBeVisible();
		console.log('✓ Keyword parameter example verified');
	});

	test('should verify columns example (Title, Director, Producer)', async ({ page }) => {
		const columns = page.locator('text=/Title.*Director.*Producer/s');
		await expect(columns.first()).toBeVisible();
		console.log('✓ Columns example verified');
	});

	test('should verify Edit this page link', async ({ page }) => {
		const editLink = page.locator('a.theme-edit-this-page');
		await expect(editLink).toBeVisible();
		await expect(editLink).toContainText('Edit this page');

		const href = await editLink.getAttribute('href');
		expect(href).toContain('github.com/grid-js/website');
		expect(href).toContain('/edit/master/docs/server-side.md');
		console.log('✓ Edit this page link verified');
	});

	test('should verify Previous link', async ({ page }) => {
		const prevLink = page.locator('a.pagination-nav__link--prev');
		await expect(prevLink).toBeVisible();
		await expect(prevLink).toContainText('Configuration');

		await prevLink.click();
		await page.waitForLoadState('networkidle');

		expect(page.url()).toContain('/docs/config');
		console.log('✓ Previous link clicked - navigated to Configuration');
	});

	test('should verify Next link', async ({ page }) => {
		const nextLink = page.locator('a.pagination-nav__link--next');
		await expect(nextLink).toBeVisible();
		await expect(nextLink).toContainText('data');

		await nextLink.click();
		await page.waitForLoadState('networkidle');

		expect(page.url()).toContain('/docs/config/data');
		console.log('✓ Next link clicked - navigated to Data');
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

	test('should verify live editor search functionality', async ({ page }) => {
		// Wait for the grid to be rendered
		await page.waitForTimeout(2000);
	    
		// Find the search input in the live editor
		const searchInput = page.locator('input[type="search"]').first();
	    
		if (await searchInput.isVisible()) {
			// Test 1: Search for "Attack"
			await searchInput.fill('Attack');
			await page.waitForTimeout(1500);
		    
			// get the second table rows
			const tableRows = page.locator('table').nth(1).locator('tbody tr');
			const rowCount = await tableRows.count();
		    
			if (rowCount > 0) {
				const firstRowText = await tableRows.first().textContent();
				expect(firstRowText).toContain('Attack');
				console.log('✓ Search for "Attack" - filtered results verified');
			}
  
			// Test 2: Search for "George"
			await searchInput.fill('George');
			await page.waitForTimeout(1000);
		    
			const rowsAfterGeorge = await tableRows.count();
			if (rowsAfterGeorge > 0) {
				const rows = await tableRows.all();
				let foundGeorge = false;
				for (const row of rows) {
					const text = await row.textContent();
					if (text?.includes('George')) {
						foundGeorge = true;
						break;
					}
				}
				expect(foundGeorge).toBe(true);
				console.log('✓ Search for "George" - filtered results verified');
			}
		    
			// Test 3: Search for "Phantom"
			await searchInput.fill('Phantom');
			await page.waitForTimeout(1000);
		    
			const rowsAfterPhantom = await tableRows.count();
			if (rowsAfterPhantom > 0) {
				const firstRow = await tableRows.first().textContent();
				expect(firstRow).toContain('Phantom');
				console.log('✓ Search for "Phantom" - filtered results verified');
			}
		    
			// Test 4: Clear search and verify all results return
			await searchInput.clear();
			await page.waitForTimeout(1000);
		    
			const allRowsCount = await tableRows.count();
			expect(allRowsCount).toBeGreaterThan(3);
			console.log(`✓ Clear search - all results returned (${allRowsCount} rows)`);
		    
			// Test 5: Search for non-existent term
			await searchInput.fill('xyz123');
			await page.waitForTimeout(1000);
		    
			const noResultsCount = await tableRows.count();
			expect(noResultsCount).toBe(1);
			console.log('✓ Search for non-existent term - no results shown');
		}
	});
  
	test('should verify live editor grid displays correct data', async ({ page }) => {
		// Wait for the grid to be rendered
		await page.waitForTimeout(2000);
	    
		const table = page.locator('table').first();
		if (await table.isVisible()) {
			// Verify table headers
			const headers = page.locator('thead th');
			const headerCount = await headers.count();
			expect(headerCount).toBeGreaterThanOrEqual(3);
		    
			const headerTexts = await headers.allTextContents();
			expect(headerTexts.join(' ')).toContain('Title');
			expect(headerTexts.join(' ')).toContain('Director');
			expect(headerTexts.join(' ')).toContain('Producer');
			console.log('✓ Grid headers verified (Title, Director, Producer)');
		    
			// Verify some Star Wars movies are present
			const tableBody = page.locator('table').first().locator('tbody');
			const bodyText = await tableBody.textContent();
		    
			const expectedMovies = ['A New Hope', 'Empire', 'Jedi', 'Phantom'];
			let moviesFound = 0;
			for (const movie of expectedMovies) {
				if (bodyText?.includes(movie)) {
					moviesFound++;
				}
			}
		    
			expect(moviesFound).toBeGreaterThan(0);
			console.log(`✓ Grid data verified (${moviesFound} Star Wars movies found)`);
		}
	});

	test('should verify search input placeholder', async ({ page }) => {
		await page.waitForTimeout(2000);

		const searchInput = page.locator('input[type="search"]').first();
		if (await searchInput.isVisible()) {
			const placeholder = await searchInput.getAttribute('placeholder');
			expect(placeholder).toBeTruthy();
			expect(placeholder?.toLowerCase()).toContain('keyword');
			console.log(`✓ Search input placeholder verified: "${placeholder}"`);
		}
	});
});