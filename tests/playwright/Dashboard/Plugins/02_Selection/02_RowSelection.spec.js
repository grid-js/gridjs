// @ts-check
import { test, expect } from '@playwright/test';

const BASE = 'https://gridjs.io';

/**
 * @param {string} s
 */
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * @param {import('@playwright/test').Page} page
 */
async function waitDocReady(page) {
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('article')).toBeVisible();
}

/**
 * Home → Docs
 * @param {import('@playwright/test').Page} page
 */
async function goHomeThenDocs(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  const docs = page.locator('a[href="/docs"]').first();
  await expect(docs).toBeVisible();
  await docs.click();
  await waitDocReady(page);
}

/**
 * Expand sidebar category if collapsed
 * @param {import('@playwright/test').Locator} cat
 */
async function ensureExpanded(cat) {
  const expanded = await cat.getAttribute('aria-expanded');
  if (expanded === 'false') {
    await cat.click();
  }
}

/**
 * Sidebar: Plugins → Selection → Row selection
 * @param {import('@playwright/test').Page} page
 */
async function navigateSidebarToRowSelection(page) {
  const plugins = page.locator('a.menu__link--sublist', { hasText: 'Plugins' }).first();
  await expect(plugins).toBeVisible();
  await ensureExpanded(plugins);

  const selection = page.locator('a.menu__link--sublist', { hasText: /^Selection$/ }).first();
  await expect(selection).toBeVisible();
  await ensureExpanded(selection);

  const rowSelection = page.locator('a.menu__link', { hasText: /^Row selection$/ }).first();
  await expect(rowSelection).toBeVisible();
  await rowSelection.click();

  await waitDocReady(page);
  await expect(page).toHaveURL(/\/docs\/plugins\/.*row/i);
}

/**
 * Verify H1
 * @param {import('@playwright/test').Page} page
 */
async function verifyTitle(page) {
  const h1 = page.locator('article h1').first();
  await expect(h1).toBeVisible();
  await expect(h1).toHaveText('Row selection');
}

/**
 * LIVE EDITOR + RESULT GRID TEST
 * - pastikan grid muncul
 * - ada checkbox
 * - klik checkbox → state berubah
 *
 * @param {import('@playwright/test').Page} page
 */
async function testRowSelectionGrid(page) {
  const article = page.locator('article');

  // RESULT container
  const result = article.locator('text=RESULT').first();
  await expect(result).toBeVisible();

  // Grid table
  const table = article.locator('table').first();
  await expect(table).toBeVisible();

  // Checkbox di kolom Select (row pertama)
  const firstCheckbox = table.locator('input[type="checkbox"]').first();
  await expect(firstCheckbox).toBeVisible();

  // initial state (boleh checked / unchecked, tergantung contoh)
  const before = await firstCheckbox.isChecked();

  // click checkbox
  await firstCheckbox.click();

  // state harus berubah
  await expect(firstCheckbox).toHaveJSProperty('checked', !before);
}

/**
 * Prev / Next
 * Prev → Selection Plugin
 * Next → Selection events
 *
 * @param {import('@playwright/test').Page} page
 */
async function testPrevNext(page) {
  const startUrl = page.url();
  const escaped = escapeRegex(startUrl);

  const prev = page.locator('a.pagination-nav__link--prev').first();
  await expect(prev).toBeVisible();
  await expect(prev).toContainText(/selection plugin/i);

  await prev.click();
  await waitDocReady(page);
  await expect(page.locator('article h1').first()).toContainText('Selection Plugin');

  await page.goBack();
  await waitDocReady(page);
  await expect(page).toHaveURL(new RegExp(`^${escaped}$`));

  const next = page.locator('a.pagination-nav__link--next').first();
  await expect(next).toBeVisible();
  await expect(next).toContainText(/selection events/i);

  await next.click();
  await waitDocReady(page);
  await expect(page.locator('article h1').first()).toContainText('Selection events');

  await page.goBack();
  await waitDocReady(page);
  await expect(page).toHaveURL(new RegExp(`^${escaped}$`));
}

/**
 * Runner
 * @param {import('@playwright/test').Page} page
 */
async function runRowSelectionFull(page) {
  await goHomeThenDocs(page);

  await navigateSidebarToRowSelection(page);
  await verifyTitle(page);

  await testRowSelectionGrid(page);
  await testPrevNext(page);
}

test('Grid.js Docs — Plugins > Selection > Row selection (FULL)', async ({ page }) => {
  test.setTimeout(60_000);
  await runRowSelectionFull(page);
});
