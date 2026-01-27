// @ts-check
import { test, expect } from '@playwright/test';

test('Grid.js Docs Flow — Data page interactions', async ({ page }) => {
  // Step 1: Open homepage
  await page.goto('https://gridjs.io');

  // Step 2: Click "Documentation"
  const docsLink = page.locator('a[href="/docs"]').first();
  await expect(docsLink).toBeVisible();
  await docsLink.click();
  await page.waitForLoadState('networkidle');

  // Step 3: Click "🛠 Config" in sidebar
  const configSidebar = page.locator('a.menu__link:has-text("Config")');
  await expect(configSidebar).toBeVisible();
  await configSidebar.click();

  // Step 4: Click "data" submenu
  const dataSubmenu = page.locator('a.menu__link[href="/docs/config/data"]');
  await expect(dataSubmenu).toBeVisible();
  await dataSubmenu.click();
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

  // Step 7: Repeat "🛠 Config" → "data"
  await expect(configSidebar).toBeVisible();
  await configSidebar.click();
  await expect(dataSubmenu).toBeVisible();
  await dataSubmenu.click();
  await page.waitForLoadState('networkidle');

  // Step 8: Click all example links
  const exampleLinks = [
    '/docs/examples/hello-world',
    '/docs/examples/import-json',
    '/docs/examples/import-async',
    '/docs/examples/import-function'
  ];
  for (const href of exampleLinks) {
    const link = page.locator(`a[href="${href}"]`).first();
    await expect(link).toBeVisible();
    await link.click();
    await page.waitForLoadState('networkidle');
    await page.goBack();
    await page.waitForLoadState('networkidle');
  }

  // Step 9: Copy buttons
  const copyButtons = page.locator('span[class*="copyButtonIcons"]');
  await expect(copyButtons.nth(0)).toBeVisible();
  await expect(copyButtons.nth(1)).toBeVisible();
  await copyButtons.nth(0).click();
  await copyButtons.nth(1).click();

  // Step 10: Click edit page
  const editLink = page.locator('a.theme-edit-this-page');
  await expect(editLink).toBeVisible();
  await editLink.evaluate(el => el.removeAttribute('target'));
  await editLink.click();
  await page.waitForLoadState('networkidle');
  await page.goBack();

  // Step 11: Pagination
  const prev = page.locator('a.pagination-nav__link--prev');
  const next = page.locator('a.pagination-nav__link--next');
  await expect(prev).toBeVisible();
  await prev.click();
  await page.goBack();
  await expect(next).toBeVisible();
  await next.click();
  await page.goBack();
});
