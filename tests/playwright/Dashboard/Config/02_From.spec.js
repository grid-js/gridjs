// @ts-check
import { test, expect } from '@playwright/test';

test('Grid.js Docs Flow — /config/from page interactions', async ({ page }) => {
  // Step 1: Visit homepage
  await page.goto('https://gridjs.io');

  // Step 2: Click "Documentation"
  const docsLink = page.locator('a[href="/docs"]').first();
  await expect(docsLink).toBeVisible();
  await docsLink.click();
  await page.waitForLoadState('networkidle');

  // Step 3: Click "🛠 Config"
  const configLink = page.locator('a.menu__link:has-text("Config")');
  await expect(configLink).toBeVisible();
  await configLink.click();

  // Step 4: Click "from" submenu
  const fromSubmenu = page.locator('a.menu__link[href="/docs/config/from"]');
  await expect(fromSubmenu).toBeVisible();
  await fromSubmenu.click();
  await page.waitForLoadState('networkidle');

  // Step 5: Click "Home" breadcrumb
  const homeBreadcrumb = page.locator('a[aria-label="Home page"]');
  await expect(homeBreadcrumb).toBeVisible();
  await homeBreadcrumb.click();
  await page.waitForLoadState('networkidle');

  // Step 6: Click "Documentation" lagi
  await expect(docsLink).toBeVisible();
  await docsLink.click();
  await page.waitForLoadState('networkidle');

  // Step 7: Click Config → From again
  await expect(configLink).toBeVisible();
  await configLink.click();
  await expect(fromSubmenu).toBeVisible();
  await fromSubmenu.click();
  await page.waitForLoadState('networkidle');

  // Step 8: Click blue link "From HTML table"
  const fromHtml = page.locator('a:has-text("From HTML table")');
  await fromHtml.scrollIntoViewIfNeeded();
  await expect(fromHtml).toBeVisible({ timeout: 5000 });
  await fromHtml.click();
  await page.waitForLoadState('networkidle');
  await page.goBack();

  // Step 9: Edit this page
  const editLink = page.locator('a.theme-edit-this-page');
  await expect(editLink).toBeVisible();
  await editLink.evaluate(el => el.removeAttribute('target'));
  await editLink.click();
  await page.waitForLoadState('networkidle');
  await page.goBack();

  // Step 10: Pagination
  const prev = page.locator('a.pagination-nav__link--prev');
  const next = page.locator('a.pagination-nav__link--next');
  await expect(prev).toBeVisible();
  await prev.click();
  await page.goBack();
  await expect(next).toBeVisible();
  await next.click();
  await page.goBack();
});
