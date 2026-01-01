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
 * Wajib: Home -> Docs (sesuai pattern kamu)
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
 * Klik sidebar: Plugins -> Overview -> Writing a Plugin
 * (karena "Plugins" itu category, "Overview" category level 2, baru link level 3)
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} menuText  contoh: '🧩 Plugins' atau 'Plugins' (tergantung render)
 * @param {string} submenuHref contoh: '/docs/plugins/writing-plugin'
 */
async function navigateSidebarToWritingPlugin(page, menuText, submenuHref) {
  // 1) pastikan category "Plugins" kebuka
  // di DOM kamu: <a class="menu__link menu__link--sublist ...">🧩 Plugins</a>
  const pluginsMenu = page.locator('a.menu__link--sublist', { hasText: menuText }).first();
  await expect(pluginsMenu).toBeVisible();
  await pluginsMenu.click();

  // 2) pastikan "Overview" kebuka (category level 2)
  const overviewMenu = page.locator('a.menu__link--sublist', { hasText: 'Overview' }).first();
  await expect(overviewMenu).toBeVisible();
  await overviewMenu.click();

  // 3) klik link "Writing a Plugin"
  const target = page.locator(`a.menu__link[href="${submenuHref}"]`, { hasText: 'Writing a Plugin' }).first();
  await expect(target).toBeVisible();
  await target.click();

  await waitDocReady(page);

  const escaped = escapeRegex(submenuHref);
  await expect(page).toHaveURL(new RegExp(`${escaped}(\\/)?(#.*)?$`));
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
 * Cycle wajib: breadcrumb Home -> balik -> Docs -> nav sidebar lagi -> verif
 * @param {import('@playwright/test').Page} page
 * @param {string} menuText
 * @param {string} submenuHref
 * @param {string} expectedH1
 */
async function breadcrumbHomeCycle(page, menuText, submenuHref, expectedH1) {
  const home = page.locator('a[aria-label="Home page"]').first();
  await expect(home).toBeVisible();
  await home.click();
  await page.waitForLoadState('domcontentloaded');

  const docsLink = page.locator('a[href="/docs"]').first();
  await expect(docsLink).toBeVisible();
  await docsLink.click();

  await waitDocReady(page);
  await navigateSidebarToWritingPlugin(page, menuText, submenuHref);
  await verifyTitle(page, expectedH1);
}

/**
 * Test hash-link (#) di setiap header: ada? klik -> URL berubah hash -> tetap di page yg sama
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

    await expect(heading).toBeVisible();
  }
}

/**
 * FIX TIMEOUT:
 * Hanya cari copy button di Docusaurus code blocks (.theme-code-block)
 * Jangan sentuh Live Editor playground (react-simple-code-editor)
 *
 * @param {import('@playwright/test').Page} page
 */
async function hoverAndClickAllCopyButtons(page) {
  const article = page.locator('article');

  // ONLY code blocks, bukan playground
  const codeBlocks = article.locator('div.theme-code-block');

  const blocksCount = await codeBlocks.count();
  for (let i = 0; i < blocksCount; i++) {
    const block = codeBlocks.nth(i);
    if (!(await block.isVisible().catch(() => false))) continue;

    await block.scrollIntoViewIfNeeded().catch(() => {});
    await block.hover().catch(() => {});
    await page.waitForTimeout(100);

    const copyBtn = block.locator('button[aria-label="Copy code to clipboard"], button[title="Copy"]').first();
    if (await copyBtn.isVisible().catch(() => false)) {
      await copyBtn.click().catch(() => {});
      await page.waitForTimeout(50);
    }
  }
}

/**
 * Klik semua link di article (kecuali hash) -> pindah -> balik -> lanjut
 * @param {import('@playwright/test').Page} page
 */
async function clickAllArticleLinksAndReturn(page) {
  const article = page.locator('article');
  const links = article.locator('a[href]');

  const total = await links.count();
  for (let i = 0; i < total; i++) {
    const link = links.nth(i);
    if (!(await link.isVisible().catch(() => false))) continue;

    const href = await link.getAttribute('href');
    if (!href || href.startsWith('#')) continue;

    // jangan klik breadcrumbs home (kamu bilang itu paten, tapi home cycle udah di test sendiri)
    const isBreadcrumbHome = await link.evaluate((el) => el.getAttribute('aria-label') === 'Home page').catch(() => false);
    if (isBreadcrumbHome) continue;

    // buka di tab yg sama
    await link.evaluate((el) => el.removeAttribute('target')).catch(() => {});

    const startUrl = page.url();
    await link.click().catch(() => {});
    await page.waitForLoadState('domcontentloaded');

    // kalau gak pindah URL, skip
    if (page.url() === startUrl) continue;

    await page.goBack();
    await waitDocReady(page);
    await expect(page).toHaveURL(new RegExp(`^${escapeRegex(startUrl)}$`));
  }
}

/**
 * Klik Edit this page -> harus pindah (ke github) -> back
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
 * Prev/Next -> pindah -> balik
 * @param {import('@playwright/test').Page} page
 */
async function testPrevNext(page) {
  const startUrl = page.url();
  const escapedStart = escapeRegex(startUrl);

  const prev = page.locator('a.pagination-nav__link--prev').first();
  if (await prev.isVisible().catch(() => false)) {
    await prev.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).not.toHaveURL(new RegExp(`^${escapedStart}$`));
    await page.goBack();
    await waitDocReady(page);
    await expect(page).toHaveURL(new RegExp(`^${escapedStart}$`));
  }

  const next = page.locator('a.pagination-nav__link--next').first();
  if (await next.isVisible().catch(() => false)) {
    await next.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).not.toHaveURL(new RegExp(`^${escapedStart}$`));
    await page.goBack();
    await waitDocReady(page);
    await expect(page).toHaveURL(new RegExp(`^${escapedStart}$`));
  }
}

/**
 * LIVE EDITOR TEST (INI YANG KAMU MAU):
 * - fokus ke textarea editor
 * - Ctrl+A, Backspace -> jadi kosong
 * - cek Result berubah (harus error / kosong / tidak "Hello World!")
 * - ketik "a"
 * - cek Result berubah lagi (tetap bukan Hello World!)
 *
 * Catatan: ini site playground, hasilnya bisa error silent.
 * Jadi assertion kita: "Hello World!" harus hilang setelah dihapus & setelah ketik 'a'
 *
 * @param {import('@playwright/test').Page} page
 */
async function testLiveEditor_ClearAndTypeA(page) {
  const article = page.locator('article');

  // container playground: dari inspect kamu ada .playgroundContainer_X_Ta
  const playground = article.locator('div[class*="playgroundContainer"]').first();
  await expect(playground).toBeVisible();

  const editorTextarea = playground.locator('textarea.npm__react-simple-code-editor__textarea').first();
  await expect(editorTextarea).toBeVisible();

  // result preview: dari inspect kamu ada .playgroundPreview_DzOI
  const preview = playground.locator('div[class*="playgroundPreview"]').first();
  await expect(preview).toBeVisible();

  // pastikan awalnya ada Hello World! (karena default code render itu)
  await expect(preview).toContainText('Hello World!');

  // klik editor -> select all -> delete
  await editorTextarea.click();
  await editorTextarea.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
  await editorTextarea.press('Backspace');

  // tunggu render
  await page.waitForTimeout(500);

  // setelah clear: HARUS tidak ada Hello World!
  await expect(preview).not.toContainText('Hello World!');

  // ketik a
  await editorTextarea.type('a', { delay: 30 });
  await page.waitForTimeout(500);

  // setelah ketik a: tetap tidak boleh balik ke Hello World!
  await expect(preview).not.toContainText('Hello World!');
}

/**
 * Runner full
 * @param {import('@playwright/test').Page} page
 */
async function runWritingAPluginFull(page) {
  await goHomeThenDocs(page);

  // menu text di sidebar bisa "🧩 Plugins" atau "Plugins" tergantung emoji kebaca
  // supaya robust: kita cari yang contains "Plugins"
  await navigateSidebarToWritingPlugin(page, 'Plugins', '/docs/plugins/writing-plugin');

  await verifyTitle(page, 'Writing a Plugin');

  await breadcrumbHomeCycle(page, 'Plugins', '/docs/plugins/writing-plugin', 'Writing a Plugin');

  await testHeaderAnchors(page);
  await hoverAndClickAllCopyButtons(page);
  await clickAllArticleLinksAndReturn(page);

  // live editor test sesuai request kamu
  await testLiveEditor_ClearAndTypeA(page);

  await testEditThisPage(page);
  await testPrevNext(page);
}

test('Grid.js Docs — Plugins > Overview > Writing a Plugin (FULL)', async ({ page }) => {
  // biar gak kejam, tapi cukup buat live editor render
  test.setTimeout(60_000);
  await runWritingAPluginFull(page);
});
