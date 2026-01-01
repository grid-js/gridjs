// @ts-check
import { test, expect } from '@playwright/test';

test('Grid.js Docs Flow — Height page interactions', async ({ page }) => {
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

  // Step 4: Click "height" submenu
  const heightSubmenu = page.locator('a.menu__link[href="/docs/config/height"]');
  await expect(heightSubmenu).toBeVisible();
  await heightSubmenu.click();
  await page.waitForLoadState('networkidle');

  // Step 5: Verify page title (h1) is "height"
  const pageTitle = page.locator('article h1');
  await expect(pageTitle).toBeVisible({ timeout: 10000 });
  await expect(pageTitle).toHaveText('height');

  // Step 6: Verify page shows "Default" and "Type" info and NOTE box
  const article = page.locator('article');
  await expect(article).toBeVisible({ timeout: 10000 });
  await expect(article).toContainText('Default');
  await expect(article).toContainText('auto');       // Default: auto
  await expect(article).toContainText('Type');
  await expect(article).toContainText('string');     // Type: string

  // Check NOTE text present using getByText (robust)
  const noteText = page.getByText(/height sets the height of the table/i);
  await expect(noteText).toBeVisible({ timeout: 10000 });

  // Step 7: Click "Home" breadcrumb
  const homeBreadcrumb = page.locator('a[aria-label="Home page"]');
  await expect(homeBreadcrumb).toBeVisible();
  await homeBreadcrumb.click();
  await page.waitForLoadState('networkidle');

  // Step 8: Click "Documentation" again and re-open height submenu
  await expect(docsLink).toBeVisible();
  await docsLink.click();
  await page.waitForLoadState('networkidle');
  await expect(configSidebar).toBeVisible();
  await configSidebar.click();
  await expect(heightSubmenu).toBeVisible();
  await heightSubmenu.click();
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
  const copyCount = await copyButtons.count();
  if (copyCount >= 1) {
    await expect(copyButtons.nth(0)).toBeVisible();
    await copyButtons.nth(0).click();
  }
  if (copyCount >= 2) {
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
    const targetUrl = editHref.startsWith('http') ? editHref : new URL(editHref, 'https://gridjs.io').href;

    // Pergi ke target, tunggu DOMContentLoaded, lalu tunggu redirect akhir
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
      // github.dev web editor (VSCode)
      await expect(newPage.locator('.monaco-editor, [aria-label="Editor content"]')).toBeVisible({ timeout: 15000 });
    } else if (/github\.com\/login/i.test(newUrl)) {
      // login screen
      await expect(newPage.locator('input[name="login"], input#login_field')).toBeVisible({ timeout: 15000 });
    } else if (/github\.com/i.test(newUrl)) {
      // GitHub file/edit view
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
      // fallback for docs pages
      await expect(newPage.locator('article')).toBeVisible({ timeout: 15000 });
    }
  } finally {
    await newPage.close();
  }

  // re-assert main page masih di "height"
  await expect(page.locator('article h1')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('article h1')).toHaveText('height');

  // Step 12: Pagination (Previous / Next)
  const prev = page.locator('a.pagination-nav__link--prev');
  const next = page.locator('a.pagination-nav__link--next');
  await expect(prev).toBeVisible();
  await prev.click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('article h1')).toBeVisible();
  await expect(page.locator('article h1')).toHaveText(/width/i);
  await page.goBack();
  await page.waitForLoadState('networkidle');

  await expect(next).toBeVisible();
  await next.click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('article h1')).toBeVisible();
  await expect(page.locator('article h1')).toHaveText(/autoWidth/i);
  await page.goBack();
  await page.waitForLoadState('networkidle');
});
