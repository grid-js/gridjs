import { test, expect } from '@playwright/test';

async function waitDocReady(page) {
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('article')).toBeVisible();
}

async function goHomeThenDocs(page) {
  await page.goto('https://gridjs.io', { waitUntil: 'domcontentloaded' });
  const docsLink = page.locator('a[href="/docs"]').first();
  await expect(docsLink).toBeVisible();
  await docsLink.click();
  await waitDocReady(page);
}

async function navigateSidebar(page, menuText, submenuHref) {
  const menu = page.locator('a.menu__link', { hasText: menuText }).first();
  await expect(menu).toBeVisible();
  await menu.click();

  const submenu = page.locator(`a.menu__link[href="${submenuHref}"]`).first();
  await expect(submenu).toBeVisible();
  await submenu.click();

  await waitDocReady(page);

  const escaped = submenuHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await expect(page).toHaveURL(new RegExp(`${escaped}(\\/)?(#.*)?$`));
}

async function verifyTitle(page, expectedH1) {
  const h1 = page.locator('article h1').first();
  await expect(h1).toBeVisible();
  await expect(h1).toHaveText(expectedH1);
}

async function breadcrumbHomeCycle(page, menuText, submenuHref, expectedH1) {
  const home = page.locator('a[aria-label="Home page"]').first();
  await expect(home).toBeVisible();
  await home.click();
  await page.waitForLoadState('domcontentloaded');

  const docsLink = page.locator('a[href="/docs"]').first();
  await expect(docsLink).toBeVisible();
  await docsLink.click();

  await waitDocReady(page);
  await navigateSidebar(page, menuText, submenuHref);
  await verifyTitle(page, expectedH1);
}

async function verifyTableTexts(page, texts) {
  const table = page.locator('article table').first();
  await expect(table).toBeVisible();
  for (const t of texts) {
    await expect(table).toContainText(t);
  }
}

async function hoverAndClickAllCopyButtons(page) {
  const article = page.locator('article');
  const codeBlocks = article.locator('div.theme-code-block, div[class*="codeBlock"], pre');

  const blocksCount = await codeBlocks.count();
  for (let i = 0; i < blocksCount; i++) {
    const block = codeBlocks.nth(i);
    if (!(await block.isVisible().catch(() => false))) continue;

    await block.hover().catch(() => {});
    await page.waitForTimeout(150);

    const copyBtns = block.locator(
      'button[aria-label*="Copy"], button[class*="copyButton"], span[class*="copyButtonIcons"], button[class*="copy"], span[class*="copy"]'
    );

    const btnCount = await copyBtns.count();
    for (let j = 0; j < btnCount; j++) {
      const btn = copyBtns.nth(j);
      if (!(await btn.isVisible().catch(() => false))) continue;
      await btn.click();
    }
  }
}

async function clickAllArticleLinksAndReturn(page) {
  const article = page.locator('article');
  const links = article.locator('a[href]');

  const total = await links.count();
  for (let i = 0; i < total; i++) {
    const link = links.nth(i);
    if (!(await link.isVisible().catch(() => false))) continue;

    const href = await link.getAttribute('href');
    if (!href || href.startsWith('#')) continue;

    const startUrl = page.url();
    await link.evaluate(el => el.removeAttribute('target'));

    await link.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page).not.toHaveURL(startUrl);

    await page.goBack();
    await waitDocReady(page);
    await expect(page).toHaveURL(new RegExp(`^${startUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
  }
}

async function clickArticleButtonsAndReturn(page) {
  const article = page.locator('article');
  const buttons = article.locator('button');

  const total = await buttons.count();
  for (let i = 0; i < total; i++) {
    const btn = buttons.nth(i);
    if (!(await btn.isVisible().catch(() => false))) continue;

    const startUrl = page.url();
    await btn.click({ trial: true }).catch(() => {});
    await btn.click().catch(() => {});
    await page.waitForTimeout(200);

    if (page.url() !== startUrl) {
      await page.goBack();
      await waitDocReady(page);
      await expect(page).toHaveURL(new RegExp(`^${startUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
    }
  }
}

async function testEditThisPage(page) {
  const edit = page.locator('a.theme-edit-this-page').first();
  if (!(await edit.isVisible().catch(() => false))) return;

  const startUrl = page.url();
  await edit.evaluate(el => el.removeAttribute('target'));
  await edit.click();
  await page.waitForLoadState('domcontentloaded');

  await expect(page).not.toHaveURL(startUrl);

  await page.goBack();
  await waitDocReady(page);
  await expect(page).toHaveURL(new RegExp(`^${startUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
}

async function testPrevNext(page) {
  const startUrl = page.url();
  const escapedStart = startUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

async function runDocsTest(page, cfg) {
  await goHomeThenDocs(page);
  await navigateSidebar(page, cfg.menu, cfg.submenu);
  await verifyTitle(page, cfg.title);
  await breadcrumbHomeCycle(page, cfg.menu, cfg.submenu, cfg.title);
  if (cfg.tableTexts && cfg.tableTexts.length) {
    await verifyTableTexts(page, cfg.tableTexts);
  }
  await testHeaderAnchors(page);
  await hoverAndClickAllCopyButtons(page);
  await clickAllArticleLinksAndReturn(page);
  await clickArticleButtonsAndReturn(page);
  await testEditThisPage(page);
  await testPrevNext(page);
}

test('Grid.js Docs — Plugins > Plugin basics (FULL)', async ({ page }) => {
  await runDocsTest(page, {
    menu: 'Plugins',
    submenu: '/docs/plugins/basics',
    title: 'Plugin basics',
    tableTexts: [],
  });
});
