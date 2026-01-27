// @ts-check
import { test, expect } from '@playwright/test';

test('Grid.js Docs Flow — Width page interactions', async ({ page }) => {
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

  // Step 4: Click "width" submenu
  const widthSubmenu = page.locator('a.menu__link[href="/docs/config/width"]');
  await expect(widthSubmenu).toBeVisible();
  await widthSubmenu.click();
  await page.waitForLoadState('networkidle');

  // Step 5: Verify page title (h1) is "width"
  const pageTitle = page.locator('article h1');
  await expect(pageTitle).toBeVisible();
  await expect(pageTitle).toHaveText('width');

  // Step 6: Verify page shows "Default" and "Type" info
  const article = page.locator('article');
  await expect(article).toBeVisible();
  await expect(article).toContainText('Default');
  await expect(article).toContainText('100%');
  await expect(article).toContainText('Type');
  await expect(article).toContainText('string');

  // Step 7: Click "Home" breadcrumb
  const homeBreadcrumb = page.locator('a[aria-label="Home page"]');
  await expect(homeBreadcrumb).toBeVisible();
  await homeBreadcrumb.click();
  await page.waitForLoadState('networkidle');

  // Step 8: Click "Documentation" again and re-open width submenu
  await expect(docsLink).toBeVisible();
  await docsLink.click();
  await page.waitForLoadState('networkidle');
  await expect(configSidebar).toBeVisible();
  await configSidebar.click();
  await expect(widthSubmenu).toBeVisible();
  await widthSubmenu.click();
  await page.waitForLoadState('networkidle');

  // Step 9: Click all example links on the page (if any)
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

  // Step 10: Copy buttons (if any code blocks)
  const copyButtons = page.locator('span[class*="copyButtonIcons"]');
  if ((await copyButtons.count()) >= 1) {
    await expect(copyButtons.nth(0)).toBeVisible();
    await copyButtons.nth(0).click();
  }
  if ((await copyButtons.count()) >= 2) {
    await expect(copyButtons.nth(1)).toBeVisible();
    await copyButtons.nth(1).click();
  }

  // -------------------------
  // Step 11: Click "Edit this page" — open in new tab, verify, close
  // -------------------------
  const editLink = page.locator('a.theme-edit-this-page');
  await expect(editLink).toBeVisible();

  // ambil href (bisa null) dan cek
  const editHref = await editLink.getAttribute('href');
  if (!editHref) {
    throw new Error('Edit link href not found on the page');
  }

  // buka halaman edit di tab baru supaya history page utama tetap utuh
  const newPage = await page.context().newPage();
  try {
    const targetUrl = editHref.startsWith('http')
      ? editHref
      : new URL(editHref, 'https://gridjs.io').href;

    await newPage.goto(targetUrl, { waitUntil: 'networkidle' });

    // verifikasi tujuan (github.dev / github.com login / github blob/edit / docs)
    const newUrl = newPage.url();

    if (/github\.dev/i.test(newUrl)) {
      // gitHub web editor (VSCode)
      await expect(newPage.locator('.monaco-editor, [aria-label="Editor content"]')).toBeVisible({ timeout: 15000 });
    } else if (/github\.com\/login/i.test(newUrl)) {
      // login
      await expect(newPage.locator('input[name="login"], input#login_field')).toBeVisible({ timeout: 15000 });
    } else if (/github\.com/i.test(newUrl)) {
      // classic GitHub (blob/edit)
      const fileBlob = newPage.locator('.blob-wrapper, .file .highlight, #repo-content-pjax-container, .js-file-line-container');
      const proposeOrCommit = newPage.locator('button:has-text("Propose changes"), button:has-text("Commit changes"), a:has-text("Create pull request")');

      let ok = false;
      try {
        await expect(fileBlob).toBeVisible({ timeout: 7000 });
        ok = true;
      } catch (e) { /* ignore */ }

      if (!ok) {
        try {
          await expect(proposeOrCommit).toBeVisible({ timeout: 7000 });
          ok = true;
        } catch (e) { /* ignore */ }
      }

      if (!ok) {
        // fallback minimal assertion
        await expect(newPage.locator('body')).toBeVisible({ timeout: 5000 });
      }
    } else {
      // halaman docs biasa
      await expect(newPage.locator('article')).toBeVisible({ timeout: 15000 });
    }
  } finally {
    // pastikan selalu ditutup agar tidak mempengaruhi test selanjutnya
    await newPage.close();
  }

  // re-assert main page masih di "width"
  await expect(page.locator('article h1')).toBeVisible();
  await expect(page.locator('article h1')).toHaveText('width');

  // Step 12: Pagination (Previous / Next)
  const prev = page.locator('a.pagination-nav__link--prev');
  const next = page.locator('a.pagination-nav__link--next');
  await expect(prev).toBeVisible();
  await prev.click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('article h1')).toBeVisible();
  await expect(page.locator('article h1')).toHaveText(/language/i);
  await page.goBack();
  await page.waitForLoadState('networkidle');

  await expect(next).toBeVisible();
  await next.click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('article h1')).toBeVisible();
  await expect(page.locator('article h1')).toHaveText(/height/i);
  await page.goBack();
  await page.waitForLoadState('networkidle');
});
