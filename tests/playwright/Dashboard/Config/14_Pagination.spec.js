import { test, expect } from '@playwright/test';

async function waitDocReady(page) {
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('article')).toBeVisible();
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
    await expect(page).toHaveURL(startUrl);
  }
}

test('Grid.js Docs Flow — ClassName page interactions (FULL, based on prior work)', async ({ page }) => {
  await page.goto('https://gridjs.io', { waitUntil: 'domcontentloaded' });

  const docsLink = page.locator('a[href="/docs"]').first();
  await expect(docsLink).toBeVisible();
  await docsLink.click();
  await waitDocReady(page);

  const configSidebar = page.locator('a.menu__link:has-text("Config")').first();
  await expect(configSidebar).toBeVisible();
  await configSidebar.click();
  await waitDocReady(page);

  const classNameSubmenu = page.locator('a.menu__link[href="/docs/config/className"]').first();
  await expect(classNameSubmenu).toBeVisible();
  await classNameSubmenu.click();
  await waitDocReady(page);

  const pageTitle = page.locator('article h1').first();
  await expect(pageTitle).toBeVisible();
  await expect(pageTitle).toHaveText('className');

  const homeBreadcrumb = page.locator('a[aria-label="Home page"]').first();
  await expect(homeBreadcrumb).toBeVisible();
  await homeBreadcrumb.click();
  await page.waitForLoadState('domcontentloaded');

  await expect(docsLink).toBeVisible();
  await docsLink.click();
  await waitDocReady(page);

  await expect(configSidebar).toBeVisible();
  await configSidebar.click();
  await expect(classNameSubmenu).toBeVisible();
  await classNameSubmenu.click();
  await waitDocReady(page);

  const propsTable = page.locator('article table').first();
  await expect(propsTable).toBeVisible();
  await expect(propsTable).toContainText('container');
  await expect(propsTable).toContainText('table');
  await expect(propsTable).toContainText('td');
  await expect(propsTable).toContainText('th');
  await expect(propsTable).toContainText('header');
  await expect(propsTable).toContainText('footer');
  await expect(propsTable).toContainText('loading');
  await expect(propsTable).toContainText('notfound');
  await expect(propsTable).toContainText('error');

  await clickAllArticleLinksAndReturn(page);
  await hoverAndClickAllCopyButtons(page);

  const editLink = page.locator('a.theme-edit-this-page').first();
  await expect(editLink).toBeVisible();
  await editLink.evaluate(el => el.removeAttribute('target'));
  const startUrl = page.url();
  await editLink.click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).not.toHaveURL(startUrl);
  await page.goBack();
  await waitDocReady(page);
  await expect(page).toHaveURL(startUrl);

  const prev = page.locator('a.pagination-nav__link--prev').first();
  const next = page.locator('a.pagination-nav__link--next').first();

  if (await prev.isVisible().catch(() => false)) {
    await prev.click();
    await page.waitForLoadState('domcontentloaded');
    await page.goBack();
    await waitDocReady(page);
  }

  if (await next.isVisible().catch(() => false)) {
    await next.click();
    await page.waitForLoadState('domcontentloaded');
    await page.goBack();
    await waitDocReady(page);
  }
});
