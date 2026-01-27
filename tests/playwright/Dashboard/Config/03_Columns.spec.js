// @ts-check
import { test, expect } from '@playwright/test';

test('Grid.js Docs Flow — Columns page interactions', async ({ page }) => {
  // Step 1: Open homepage
  await page.goto('https://gridjs.io');
  await page.waitForLoadState('networkidle');

  // Step 2: Click "Documentation"
  const docsLink = page.locator('a[href="/docs"]').first();
  await expect(docsLink).toBeVisible();
  await docsLink.click();
  await page.waitForLoadState('networkidle');

  // Step 3: Click "🛠 Config" in sidebar
  const configSidebar = page.locator('a.menu__link:has-text("Config")');
  await expect(configSidebar).toBeVisible();
  await configSidebar.click();
  await page.waitForLoadState('networkidle');

  // Step 4: Click "columns" submenu
  const columnsSubmenu = page.locator('a.menu__link[href="/docs/config/columns"]');
  await expect(columnsSubmenu).toBeVisible();
  await columnsSubmenu.click();
  await page.waitForLoadState('networkidle');

  // Step 5: Click "Home" breadcrumb
  const homeBreadcrumb = page.locator('a[aria-label="Home page"]');
  await expect(homeBreadcrumb).toBeVisible();
  await homeBreadcrumb.click();
  await page.waitForLoadState('networkidle');

  // Step 6: Click "Documentation" again
  await expect(docsLink).toBeVisible();
  await docsLink.click();
  await page.waitForLoadState('networkidle');

  // Step 7: Repeat "🛠 Config" → "columns"
  await expect(configSidebar).toBeVisible();
  await configSidebar.click();
  await expect(columnsSubmenu).toBeVisible();
  await columnsSubmenu.click();
  await page.waitForLoadState('networkidle');

  // Step 8: Click all example links on the page (if any)
  // We target links that start with /docs/examples/
  const examplesLocator = page.locator('a[href^="/docs/examples/"]');
  const examplesCount = await examplesLocator.count();
  for (let i = 0; i < examplesCount; i++) {
    const link = examplesLocator.nth(i);
    await expect(link).toBeVisible();
    // remove target if it would open a new tab
    await link.evaluate(el => el.removeAttribute('target'));
    await link.click();
    await page.waitForLoadState('networkidle');
    await page.goBack();
    await page.waitForLoadState('networkidle');
  }

  // Step 9: Copy buttons in code blocks (there are code blocks on this page)
  const copyButtons = page.locator('span[class*="copyButtonIcons"]');
  // Ensure at least the first copy button exists before interacting
  if ((await copyButtons.count()) >= 1) {
    await expect(copyButtons.nth(0)).toBeVisible();
    await copyButtons.nth(0).click();
  }
  // If there's a second copy button, click it too (like other pages)
  if ((await copyButtons.count()) >= 2) {
    await expect(copyButtons.nth(1)).toBeVisible();
    await copyButtons.nth(1).click();
  }

  // Step 10: Click "Edit this page" (remove target before clicking)
  const editLink = page.locator('a.theme-edit-this-page');
  await expect(editLink).toBeVisible();
  await editLink.evaluate(el => el.removeAttribute('target'));
  await editLink.click();
  await page.waitForLoadState('networkidle');
  await page.goBack();
  await page.waitForLoadState('networkidle');

  // Step 11: Pagination (Previous / Next)
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
});
