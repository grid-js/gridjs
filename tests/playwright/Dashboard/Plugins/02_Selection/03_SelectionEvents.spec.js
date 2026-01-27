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
 * Home -> Docs
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
 * @param {import('@playwright/test').Locator} el
 */
async function ensureExpanded(el) {
  const expanded = await el.getAttribute('aria-expanded');
  if (expanded === 'false') await el.click();
}

/**
 * Sidebar: Plugins -> Selection -> Selection events
 * ROBUST (NO exact text)
 * @param {import('@playwright/test').Page} page
 */
async function navigateSidebarToSelectionEvents(page) {
  const sidebar = page.locator('nav.menu');

  // Plugins
  const plugins = sidebar.locator('a.menu__link--sublist', { hasText: /Plugins/i }).first();
  await expect(plugins).toBeVisible();
  await ensureExpanded(plugins);

  // Selection (bisa sublist / link)
  const selection = sidebar
    .locator('a.menu__link--sublist, a.menu__link', { hasText: /Selection/i })
    .first();
  await expect(selection).toBeVisible();

  const cls = (await selection.getAttribute('class')) || '';
  if (cls.includes('menu__link--sublist')) {
    await ensureExpanded(selection);
  } else {
    await selection.click();
    await waitDocReady(page);
  }

  // Selection events
  const target = sidebar.locator('a.menu__link', { hasText: /Selection events/i }).first();
  await expect(target).toBeVisible();
  await target.click();

  await waitDocReady(page);
  await expect(page).toHaveURL(/\/docs\/plugins\/.*events/i);
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} expected
 */
async function verifyTitle(page, expected) {
  await expect(page.locator('article h1').first()).toHaveText(expected);
}

/**
 * Breadcrumb Home cycle
 * @param {import('@playwright/test').Page} page
 * @param {string} expectedH1
 */
async function breadcrumbHomeCycle(page, expectedH1) {
  const home = page.locator('a[aria-label="Home page"]').first();
  await expect(home).toBeVisible();
  await home.click();
  await page.waitForLoadState('domcontentloaded');

  const docs = page.locator('a[href="/docs"]').first();
  await expect(docs).toBeVisible();
  await docs.click();

  await waitDocReady(page);
  await navigateSidebarToSelectionEvents(page);
  await verifyTitle(page, expectedH1);
}

/**
 * Header anchors
 * @param {import('@playwright/test').Page} page
 */
async function testHeaderAnchors(page) {
  const headers = page.locator('article h1, h2, h3, h4');
  const count = await headers.count();

  for (let i = 0; i < count; i++) {
    const h = headers.nth(i);
    const anchor = h.locator('a[href^="#"], a.hash-link').first();
    if (!(await anchor.count())) continue;

    const before = new URL(page.url());
    const base = before.origin + before.pathname;

    await anchor.click();
    await page.waitForTimeout(120);

    const after = new URL(page.url());
    await expect(after.origin + after.pathname).toBe(base);
    await expect(after.hash).not.toBe('');
  }
}

/**
 * Copy buttons (ONLY theme-code-block)
 * @param {import('@playwright/test').Page} page
 */
async function hoverAndClickAllCopyButtons(page) {
  const blocks = page.locator('article div.theme-code-block');
  const count = await blocks.count();

  for (let i = 0; i < count; i++) {
    const b = blocks.nth(i);
    if (!(await b.isVisible())) continue;

    await b.hover().catch(() => {});
    const btn = b.locator('button[aria-label*="Copy"], button[title="Copy"]').first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => {});
    }
  }
}

/**
 * Click all article links & return
 * @param {import('@playwright/test').Page} page
 */
async function clickAllArticleLinksAndReturn(page) {
  const links = page.locator('article a[href]');
  const total = await links.count();

  for (let i = 0; i < total; i++) {
    const a = links.nth(i);
    const href = await a.getAttribute('href');
    if (!href || href.startsWith('#')) continue;

    const start = page.url();
    await a.evaluate(el => el.removeAttribute('target')).catch(() => {});
    await a.click().catch(() => {});
    await page.waitForLoadState('domcontentloaded');

    if (page.url() !== start) {
      await page.goBack();
      await waitDocReady(page);
      await expect(page).toHaveURL(new RegExp(`^${escapeRegex(start)}$`));
    }
  }
}

/**
 * Edit this page
 * @param {import('@playwright/test').Page} page
 */
async function testEditThisPage(page) {
  const edit = page.locator('a.theme-edit-this-page').first();
  if (!(await edit.isVisible().catch(() => false))) return;

  const start = page.url();
  await edit.evaluate(el => el.removeAttribute('target'));
  await edit.click();
  await page.waitForLoadState('domcontentloaded');

  await expect(page).not.toHaveURL(start);
  await page.goBack();
  await waitDocReady(page);
}

/**
 * Prev / Next
 * Prev -> Row selection
 * Next -> React
 * @param {import('@playwright/test').Page} page
 */
async function testPrevNext(page) {
  const start = page.url();

  const prev = page.locator('a.pagination-nav__link--prev').first();
  if (await prev.isVisible()) {
    await prev.click();
    await waitDocReady(page);
    await expect(page.locator('article h1').first()).toContainText(/row selection/i);
    await page.goBack();
    await waitDocReady(page);
    await expect(page.url()).toBe(start);
  }

  const next = page.locator('a.pagination-nav__link--next').first();
  if (await next.isVisible()) {
    await next.click();
    await waitDocReady(page);
    await expect(page.locator('article h1').first()).toContainText(/react/i);
    await page.goBack();
    await waitDocReady(page);
    await expect(page.url()).toBe(start);
  }
}

/**
 * LIVE EDITOR — CLEAR + TYPE 'a' (WAJIB)
 * @param {import('@playwright/test').Page} page
 */
async function testAllLiveEditors_ClearAndTypeA(page) {
  const playgrounds = page.locator('article div[class*="playgroundContainer"]');
  const total = await playgrounds.count();
  await expect(total).toBeGreaterThan(0);

  for (let i = 0; i < total; i++) {
    const pg = playgrounds.nth(i);
    const editor = pg.locator('textarea.npm__react-simple-code-editor__textarea').first();
    const preview = pg.locator('div[class*="playgroundPreview"]').first();

    await expect(editor).toBeVisible();
    await expect(preview).toBeVisible();

    const before = await preview.innerText().catch(() => '');

    await editor.click();
    await editor.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
    await editor.press('Backspace');

    await expect
      .poll(async () => (await preview.innerText().catch(() => '')) || '', { timeout: 8000 })
      .not.toBe(before);

    const afterClear = await preview.innerText().catch(() => '');

    await editor.type('a', { delay: 25 });

    await expect
      .poll(async () => (await preview.innerText().catch(() => '')) || '', { timeout: 8000 })
      .not.toBe(afterClear);
  }
}

/**
 * RUNNER FULL
 * @param {import('@playwright/test').Page} page
 */
async function runSelectionEventsFull(page) {
  await goHomeThenDocs(page);

  await navigateSidebarToSelectionEvents(page);
  await verifyTitle(page, 'Selection events');

  await breadcrumbHomeCycle(page, 'Selection events');
  await testHeaderAnchors(page);
  await hoverAndClickAllCopyButtons(page);
  await clickAllArticleLinksAndReturn(page);

  // WAJIB
  await testAllLiveEditors_ClearAndTypeA(page);

  await testEditThisPage(page);
  await testPrevNext(page);
}

test('Grid.js Docs — Plugins > Selection > Selection events (FULL)', async ({ page }) => {
  test.setTimeout(90_000);
  await runSelectionEventsFull(page);
});
