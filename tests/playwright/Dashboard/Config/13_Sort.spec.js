// @ts-check
/**
 * Reusable helpers for Grid.js docs Playwright tests.
 * Put this file in tests/helpers/docsHelpers.js
 */

import { expect } from '@playwright/test';

/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {import('@playwright/test').Locator} Locator
 */

/**
 * Open homepage and wait for network idle.
 * @param {Page} page
 */
export async function openHome(page) {
  await page.goto('https://gridjs.io');
  await page.waitForLoadState('networkidle');
}

/**
 * Click Documentation link
 * @param {Page} page
 * @returns {Promise<Locator>} docsLink locator returned (for later use)
 */
export async function clickDocumentation(page) {
  const docsLink = page.locator('a[href="/docs"]').first();
  await expect(docsLink).toBeVisible();
  await docsLink.click();
  await page.waitForLoadState('networkidle');
  return docsLink;
}

/**
 * Click Config in sidebar
 * @param {Page} page
 */
export async function clickConfig(page) {
  const configSidebar = page.locator('a.menu__link:has-text("Config")');
  await expect(configSidebar).toBeVisible();
  await configSidebar.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Open submenu by href (e.g. '/docs/config/columns')
 * @param {Page} page
 * @param {string} submenuHref
 */
export async function openSubmenu(page, submenuHref) {
  const submenu = page.locator(`a.menu__link[href="${submenuHref}"]`);
  await expect(submenu).toBeVisible();
  await submenu.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Click Home breadcrumb
 * @param {Page} page
 */
export async function clickHomeBreadcrumb(page) {
  const homeBreadcrumb = page.locator('a[aria-label="Home page"]');
  await expect(homeBreadcrumb).toBeVisible();
  await homeBreadcrumb.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Click all example links (href starts with /docs/examples/) and come back
 * @param {Page} page
 */
export async function clickAllExampleLinks(page) {
  const examplesLocator = page.locator('article a[href^="/docs/examples/"]');
  const examplesCount = await examplesLocator.count();
  for (let i = 0; i < examplesCount; i++) {
    const link = examplesLocator.nth(i);
    if (!(await link.isVisible())) continue;
    await link.evaluate(el => el.removeAttribute('target'));
    await link.click();
    await page.waitForLoadState('networkidle');
    await page.goBack();
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Click copy buttons (up to maxClicks)
 * @param {Page} page
 * @param {number} [maxClicks=2]
 */
export async function clickCopyButtons(page, maxClicks = 2) {
  const copyButtons = page.locator('span[class*="copyButtonIcons"]');
  const count = await copyButtons.count();
  for (let i = 0; i < Math.min(count, maxClicks); i++) {
    const btn = copyButtons.nth(i);
    if (!(await btn.isVisible())) continue;
    await btn.click();
  }
}

/**
 * Helper: remove target attribute and click a link, keeping navigation in same tab
 * @param {Locator} link
 */
async function removeTargetAndClick(link) {
  await link.evaluate(el => el.removeAttribute('target'));
  await link.click();
}

/**
 * Click "Edit this page" by opening it in a new tab and verify common targets.
 * This opens a new page so history of the main page is preserved.
 *
 * @param {Page} page
 */
export async function clickEditAndHandleGitHub(page) {
  const editLink = page.locator('a.theme-edit-this-page');
  await expect(editLink).toBeVisible();
  const editHref = await editLink.getAttribute('href');
  if (!editHref) throw new Error('Edit link href not found');

  const newPage = await page.context().newPage();
  try {
    const target = editHref.startsWith('http') ? editHref : new URL(editHref, 'https://gridjs.io').href;
    await newPage.goto(target, { waitUntil: 'domcontentloaded' });

    // wait for one of likely destinations
    await newPage.waitForURL(url =>
      /github\.dev/i.test(url.href) ||
      /github\.com\/login/i.test(url.href) ||
      /github\.com/i.test(url.href) ||
      /\/docs\//i.test(url.href),
      { timeout: 15000 }
    );

    const newUrl = newPage.url();
    if (/github\.dev/i.test(newUrl)) {
      await expect(newPage.locator('.monaco-editor, [aria-label="Editor content"]')).toBeVisible({ timeout: 15000 });
    } else if (/github\.com\/login/i.test(newUrl)) {
      await expect(newPage.locator('input[name="login"], input#login_field')).toBeVisible({ timeout: 15000 });
    } else if (/github\.com/i.test(newUrl)) {
      // check for file blob or propose commit UI
      const fileBlob = newPage.locator('.blob-wrapper, .file .highlight, #repo-content-pjax-container, .js-file-line-container');
      const proposeOrCommit = newPage.locator('button:has-text("Propose changes"), button:has-text("Commit changes"), a:has-text("Create pull request")');
      let ok = false;
      try { await expect(fileBlob).toBeVisible({ timeout: 7000 }); ok = true; } catch {}
      if (!ok) {
        try { await expect(proposeOrCommit).toBeVisible({ timeout: 7000 }); ok = true; } catch {}
      }
      if (!ok) {
        await expect(newPage.locator('body')).toBeVisible({ timeout: 5000 });
      }
    } else {
      await expect(newPage.locator('article')).toBeVisible({ timeout: 15000 });
    }
  } finally {
    await newPage.close();
  }
}

/**
 * Check pagination prev/next (click and come back)
 * @param {Page} page
 */
export async function checkPagination(page) {
  const prev = page.locator('a.pagination-nav__link--prev');
  const next = page.locator('a.pagination-nav__link--next');

  await expect(prev).toBeVisible();
  await prev.click();
  await page.waitForLoadState('networkidle');
  await page.goBack();
  await page.waitForLoadState('networkidle');

  await expect(next).toBeVisible();
  await next.click();
  await page.waitForLoadState('networkidle');
  await page.goBack();
  await page.waitForLoadState('networkidle');
}

/**
 * Click links in table Example column (automatically detect Example column index)
 * @param {Page} page
 * @param {string} [tableSelector='article table']
 */
export async function clickLinksInTableExampleColumn(page, tableSelector = 'article table') {
  const table = page.locator(tableSelector).first();
  await expect(table).toBeVisible();

  // determine example column index
  const headerCells = table.locator('thead tr th');
  let exampleIndex = 3; // default fallback to 4th column
  const headerCount = await headerCells.count();
  if (headerCount > 0) {
    for (let i = 0; i < headerCount; i++) {
      const txt = (await headerCells.nth(i).innerText()).toLowerCase();
      if (txt.includes('example')) {
        exampleIndex = i;
        break;
      }
    }
  }

  const rows = table.locator('tbody tr');
  const rowsCount = await rows.count();
  for (let r = 0; r < rowsCount; r++) {
    const cell = rows.nth(r).locator('td').nth(exampleIndex);
    const links = cell.locator('a');
    const linkCount = await links.count();
    for (let l = 0; l < linkCount; l++) {
      const link = links.nth(l);
      if (!(await link.isVisible())) continue;
      await removeTargetAndClick(link);
      await page.waitForLoadState('networkidle');

      // sanity checks for destination
      const url = page.url();
      if (/\/docs\//i.test(url)) {
        await expect(page.locator('article')).toBeVisible({ timeout: 10000 });
      } else if (/github\.com/i.test(url)) {
        await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
      }
      await page.goBack();
      await page.waitForLoadState('networkidle');
    }
  }
}

/**
 * Click a TOC anchor or hash link with fallback strategies:
 *  - prefer right-side TOC link (not inside article),
 *  - if not found, click article's hash-link by id,
 *  - final fallback: any visible link with the text.
 *
 * @param {Page} page
 * @param {string} text - visible text of the TOC anchor (e.g. 'Column specific sort config')
 * @param {string} [fallbackId] - fallback hash id (without '#'), e.g. 'column-specific-sort-config'
 * @returns {Promise<boolean>} true when something was clicked
 */
export async function clickAnchorByText(page, text, fallbackId) {
  const allLinks = page.locator(`a:has-text("${text}")`);
  const total = await allLinks.count();

  // prefer right-side TOC links (outside article)
  for (let i = 0; i < total; i++) {
    const cur = allLinks.nth(i);
    if (!(await cur.isVisible())) continue;
    const isInsideArticle = await cur.evaluate(el => !!el.closest('article'));
    if (!isInsideArticle) {
      try {
        await cur.scrollIntoViewIfNeeded();
        await removeTargetAndClick(cur);
        await page.waitForLoadState('networkidle');
        return true;
      } catch (e) {
        // try next candidate
      }
    }
  }

  // fallback: click article hash-link with given id
  if (fallbackId) {
    const hashLink = page.locator(`article a.hash-link[href="#${fallbackId}"]`);
    if (await hashLink.count() > 0) {
      try {
        await hashLink.first().scrollIntoViewIfNeeded();
        await hashLink.first().click();
        await page.waitForLoadState('networkidle');
        return true;
      } catch (e) {
        // ignore and try final fallback
      }
    }
  }

  // final fallback: click first visible link with the text
  for (let i = 0; i < total; i++) {
    const cur = allLinks.nth(i);
    if (!(await cur.isVisible())) continue;
    try {
      await removeTargetAndClick(cur);
      await page.waitForLoadState('networkidle');
      return true;
    } catch (e) {
      // continue
    }
  }

  return false;
}
