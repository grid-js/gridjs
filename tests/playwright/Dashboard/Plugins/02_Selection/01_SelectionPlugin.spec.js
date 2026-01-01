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
 * Wajib: Home -> Docs
 * @param {import('@playwright/test').Page} page
 */
async function goHomeThenDocs(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });

  const docsLink = page.locator('a[href="/docs"]').first();
  await expect(docsLink).toBeVisible();
  await docsLink.click();

  await waitDocReady(page);
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} expectedH1
 */
async function verifyTitle(page, expectedH1) {
  const h1 = page.locator('article h1').first();
  await expect(h1).toBeVisible();
  await expect(h1).toHaveText(expectedH1);
}

/**
 * Expand sidebar category if needed (aria-expanded)
 * @param {import('@playwright/test').Locator} cat
 */
async function ensureExpanded(cat) {
  const expanded = await cat.getAttribute('aria-expanded');
  if (expanded === 'false') {
    await cat.click();
  }
}

/**
 * Sidebar: Plugins -> Selection -> Selection Plugin
 * FIX: jangan hardcode href Selection Plugin (karena slug beda).
 *
 * @param {import('@playwright/test').Page} page
 */
async function navigateSidebarToSelectionPlugin(page) {
  // expand Plugins
  const pluginsCat = page.locator('a.menu__link--sublist', { hasText: 'Plugins' }).first();
  await expect(pluginsCat).toBeVisible();
  await ensureExpanded(pluginsCat);

  // expand Selection category
  const selectionCat = page.locator('a.menu__link--sublist', { hasText: /^Selection$/ }).first();
  await expect(selectionCat).toBeVisible();
  await ensureExpanded(selectionCat);

  // click "Selection Plugin" by text (lebih robust daripada href)
  const target = page.locator('a.menu__link', { hasText: /^Selection Plugin$/ }).first();
  await expect(target).toBeVisible();
  await target.click();

  await waitDocReady(page);

  // URL verif yang fleksibel (slug bisa beda, tapi harus di area plugins + selection)
  await expect(page).toHaveURL(/\/docs\/plugins\/.*selection/i);
}

/**
 * Breadcrumb Home cycle wajib
 * @param {import('@playwright/test').Page} page
 * @param {string} expectedH1
 */
async function breadcrumbHomeCycle(page, expectedH1) {
  const home = page.locator('a[aria-label="Home page"]').first();
  await expect(home).toBeVisible();
  await home.click();
  await page.waitForLoadState('domcontentloaded');

  const docsLink = page.locator('a[href="/docs"]').first();
  await expect(docsLink).toBeVisible();
  await docsLink.click();

  await waitDocReady(page);
  await navigateSidebarToSelectionPlugin(page);
  await verifyTitle(page, expectedH1);
}

/**
 * Test hash-link (#)
 * @param {import('@playwright/test').Page} page
 */
async function testHeaderAnchors(page) {
  const article = page.locator('article');
  const headings = article.locator('h1, h2, h3, h4, h5, h6');
  const count = await headings.count();

  for (let i = 0; i < count; i++) {
    const heading = headings.nth(i);
    if (!(await heading.isVisible().catch(() => false))) continue;

    const anchor = heading.locator('a[href^="#"], a.hash-link').first();
    if ((await anchor.count()) === 0) continue;

    if (!(await anchor.isVisible().catch(() => false))) {
      await heading.hover().catch(() => {});
    }

    const id = await heading.getAttribute('id');
    const before = new URL(page.url());
    const baseUrl = before.origin + before.pathname;

    await anchor.click();
    await page.waitForTimeout(150);

    const after = new URL(page.url());
    await expect(after.origin + after.pathname).toBe(baseUrl);
    await expect(after.hash).not.toBe('');

    if (id) {
      await expect(after.hash.toLowerCase()).toBe(`#${id.toLowerCase()}`);
    }
  }
}

/**
 * Copy hanya theme-code-block
 * @param {import('@playwright/test').Page} page
 */
async function hoverAndClickAllCopyButtons(page) {
  const codeBlocks = page.locator('article div.theme-code-block');
  const blocksCount = await codeBlocks.count();

  for (let i = 0; i < blocksCount; i++) {
    const block = codeBlocks.nth(i);
    if (!(await block.isVisible().catch(() => false))) continue;

    await block.scrollIntoViewIfNeeded().catch(() => {});
    await block.hover().catch(() => {});
    await page.waitForTimeout(80);

    const copyBtn = block
      .locator('button[aria-label="Copy code to clipboard"], button[title="Copy"], button[aria-label*="Copy"]')
      .first();

    if (await copyBtn.isVisible().catch(() => false)) {
      await copyBtn.click().catch(() => {});
      await page.waitForTimeout(40);
    }
  }
}

/**
 * Klik semua link di article (kecuali hash & breadcrumb home)
 * @param {import('@playwright/test').Page} page
 */
async function clickAllArticleLinksAndReturn(page) {
  const links = page.locator('article a[href]');
  const total = await links.count();

  for (let i = 0; i < total; i++) {
    const link = links.nth(i);
    if (!(await link.isVisible().catch(() => false))) continue;

    const href = await link.getAttribute('href');
    if (!href || href.startsWith('#')) continue;

    const isBreadcrumbHome = await link
      .evaluate((el) => el.getAttribute('aria-label') === 'Home page')
      .catch(() => false);
    if (isBreadcrumbHome) continue;

    await link.evaluate((el) => el.removeAttribute('target')).catch(() => {});

    const startUrl = page.url();
    await link.click().catch(() => {});
    await page.waitForLoadState('domcontentloaded');

    if (page.url() === startUrl) continue;

    await page.goBack();
    await waitDocReady(page);
    await expect(page).toHaveURL(new RegExp(`^${escapeRegex(startUrl)}$`));
  }
}

/**
 * Edit this page
 * @param {import('@playwright/test').Page} page
 */
async function testEditThisPage(page) {
  const edit = page.locator('a.theme-edit-this-page').first();
  if (!(await edit.isVisible().catch(() => false))) return;

  const startUrl = page.url();
  await edit.evaluate((el) => el.removeAttribute('target')).catch(() => {});
  await edit.click();
  await page.waitForLoadState('domcontentloaded');

  await expect(page).not.toHaveURL(startUrl);

  await page.goBack();
  await waitDocReady(page);
  await expect(page).toHaveURL(new RegExp(`^${escapeRegex(startUrl)}$`));
}

/**
 * Prev/Next:
 * Prev -> Advanced Plugins
 * Next -> Row selection
 * @param {import('@playwright/test').Page} page
 */
async function testPrevNext(page) {
  const startUrl = page.url();
  const escapedStart = escapeRegex(startUrl);

  const prev = page.locator('a.pagination-nav__link--prev').first();
  if (await prev.isVisible().catch(() => false)) {
    await expect(prev).toContainText(/advanced plugins/i);
    await prev.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).not.toHaveURL(new RegExp(`^${escapedStart}$`));
    await expect(page.locator('article h1').first()).toContainText(/advanced plugins/i);

    await page.goBack();
    await waitDocReady(page);
    await expect(page).toHaveURL(new RegExp(`^${escapedStart}$`));
  }

  const next = page.locator('a.pagination-nav__link--next').first();
  if (await next.isVisible().catch(() => false)) {
    await expect(next).toContainText(/row selection/i);
    await next.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).not.toHaveURL(new RegExp(`^${escapedStart}$`));
    await expect(page.locator('article h1').first()).toContainText(/row selection/i);

    await page.goBack();
    await waitDocReady(page);
    await expect(page).toHaveURL(new RegExp(`^${escapedStart}$`));
  }
}

/**
 * Runner full
 * @param {import('@playwright/test').Page} page
 */
async function runSelectionPluginFull(page) {
  await goHomeThenDocs(page);

  await navigateSidebarToSelectionPlugin(page);
  await verifyTitle(page, 'Selection Plugin');

  await breadcrumbHomeCycle(page, 'Selection Plugin');

  await testHeaderAnchors(page);
  await hoverAndClickAllCopyButtons(page);
  await clickAllArticleLinksAndReturn(page);

  await testEditThisPage(page);
  await testPrevNext(page);
}

test('Grid.js Docs — Plugins > Selection > Selection Plugin (FULL)', async ({ page }) => {
  test.setTimeout(60_000);
  await runSelectionPluginFull(page);
});
