// @ts-check
import { test, expect } from '@playwright/test';

test('Grid.js Docs Flow — AutoWidth page interactions', async ({ page }) => {
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

  // Step 4: Click "autoWidth" submenu
  const autoWidthSubmenu = page.locator('a.menu__link[href="/docs/config/autoWidth"]');
  await expect(autoWidthSubmenu).toBeVisible();
  await autoWidthSubmenu.click();
  await page.waitForLoadState('networkidle');

  // Step 5: Verify page title (h1) is "autoWidth"
  const pageTitle = page.locator('article h1');
  await expect(pageTitle).toBeVisible({ timeout: 10000 });
  await expect(pageTitle).toHaveText('autoWidth');

  // Step 6: Verify Default and Type info
  const article = page.locator('article');
  await expect(article).toBeVisible();
  await expect(article).toContainText('Default');
  await expect(article).toContainText('true');    // Default: true
  await expect(article).toContainText('Type');
  await expect(article).toContainText('boolean'); // Type: boolean

  // Step 7: Home breadcrumb and return
  const homeBreadcrumb = page.locator('a[aria-label="Home page"]');
  await expect(homeBreadcrumb).toBeVisible();
  await homeBreadcrumb.click();
  await page.waitForLoadState('networkidle');

  // Step 8: Re-open docs -> config -> autoWidth
  await expect(docsLink).toBeVisible();
  await docsLink.click();
  await page.waitForLoadState('networkidle');
  await expect(configSidebar).toBeVisible();
  await configSidebar.click();
  await expect(autoWidthSubmenu).toBeVisible();
  await autoWidthSubmenu.click();
  await page.waitForLoadState('networkidle');

  // Step 9: Click example links if present
  const examplesLocator = page.locator('a[href^="/docs/examples/"]');
  const examplesCount = await examplesLocator.count();
  for (let i = 0; i < examplesCount; i++) {
    const link = examplesLocator.nth(i);
    await expect(link).toBeVisible();
    await link.evaluate(el => el.removeAttribute('target'));
    await link.click();
    await page.waitForLoadState('networkidle');
    await page.goBack();
    await page.waitForLoadState('networkidle');
  }

  // Step 10: Copy buttons
  const copyButtons = page.locator('span[class*="copyButtonIcons"]');
  const copyCount = await copyButtons.count();
  if (copyCount >= 1) {
    await expect(copyButtons.nth(0)).toBeVisible();
    await copyButtons.nth(0).click();
  }
  if (copyCount >= 2) {
    await expect(copyButtons.nth(1)).toBeVisible();
    await copyButtons.nth(1).click();
  }

  // Step 11: Click "Edit this page" in new tab and verify then close
  const editLink = page.locator('a.theme-edit-this-page');
  await expect(editLink).toBeVisible();
  const editHref = await editLink.getAttribute('href');
  if (!editHref) throw new Error('Edit link href not found on autoWidth page');

  const newPage = await page.context().newPage();
  try {
    const targetUrl = editHref.startsWith('http') ? editHref : new URL(editHref, 'https://gridjs.io').href;
    await newPage.goto(targetUrl, { waitUntil: 'domcontentloaded' });

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
      const fileBlob = newPage.locator('.blob-wrapper, .file .highlight, #repo-content-pjax-container, .js-file-line-container');
      const proposeOrCommit = newPage.locator('button:has-text("Propose changes"), button:has-text("Commit changes"), a:has-text("Create pull request")');
      let ok = false;
      try { await expect(fileBlob).toBeVisible({ timeout: 7000 }); ok = true; } catch (e) {}
      if (!ok) {
        try { await expect(proposeOrCommit).toBeVisible({ timeout: 7000 }); ok = true; } catch (e) {}
      }
      if (!ok) await expect(newPage.locator('body')).toBeVisible({ timeout: 5000 });
    } else {
      await expect(newPage.locator('article')).toBeVisible({ timeout: 15000 });
    }
  } finally {
    await newPage.close();
  }

  // Step 12: Pagination Prev / Next
  const prev = page.locator('a.pagination-nav__link--prev');
  const next = page.locator('a.pagination-nav__link--next');
  await expect(prev).toBeVisible();
  await prev.click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('article h1')).toBeVisible();
  await page.goBack();
  await page.waitForLoadState('networkidle');

  await expect(next).toBeVisible();
  await next.click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('article h1')).toBeVisible();
  await page.goBack();
  await page.waitForLoadState('networkidle');
});
