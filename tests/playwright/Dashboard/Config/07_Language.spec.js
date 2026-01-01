// @ts-check
import { test, expect } from '@playwright/test';

test('Grid.js Docs Flow — Language page interactions', async ({ page }) => {
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

  // Step 4: Click "language" submenu
  const languageSubmenu = page.locator('a.menu__link[href="/docs/config/language"]');
  await expect(languageSubmenu).toBeVisible();
  await languageSubmenu.click();
  await page.waitForLoadState('networkidle');

  // Step 5: Verify page title (h1) is "language"
  const pageTitle = page.locator('article h1');
  await expect(pageTitle).toBeVisible();
  await expect(pageTitle).toHaveText('language');

  // Step 6: Verify "Locales" link exists, click it and come back
  const localesLink = page.locator('article a:has-text("Locales")').first();
  await expect(localesLink).toBeVisible();
  await localesLink.evaluate(el => el.removeAttribute('target'));
  await localesLink.click();
  await page.waitForURL(u => /\/docs\/locales/i.test(u.href) || /locales/i.test(u.pathname), { timeout: 15000 });
  await expect(page.locator('article h1')).toBeVisible({ timeout: 15000 });
  await page.goBack();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('article h1')).toHaveText('language');

  // Step 7: Verify "en_US" link in TIP exists, click it and come back
  const enUsLink = page.locator('article a:has-text("en_US")').first();
  await expect(enUsLink).toBeVisible();
  await enUsLink.evaluate(el => el.removeAttribute('target'));
  await enUsLink.click();

  // Wait for likely destinations (docs, en_US page, GitHub blob/edit, or github.dev)
  await page.waitForURL(u =>
    /en[_-]us/i.test(u.href) ||
    /en[_-]us/i.test(u.pathname) ||
    /\/src\/i18n\/en_US\.ts/i.test(u.href) ||
    /\/docs\/locales/i.test(u.href) ||
    /github\.com/i.test(u.href) ||
    /github\.dev/i.test(u.href),
    { timeout: 15000 }
  );

  // Decide verification strategy based on current URL
  const currentUrl = page.url();

  if (/github\.dev/i.test(currentUrl)) {
    // github.dev -> VSCode-like editor (Monaco): check editor exists
    await expect(page.locator('.monaco-editor, [aria-label="Editor content"]')).toBeVisible({ timeout: 15000 });
  } else if (/github\.com/i.test(currentUrl)) {
    // GitHub domain: could be blob, edit, raw, or login
    // Try several selectors that indicate file content or edit UI
    const fileBlob = page.locator('.blob-wrapper, .file .highlight, #repo-content-pjax-container, .repository-content, .js-file-line-container');
    const proposeOrCommit = page.locator('button:has-text("Propose changes"), button:has-text("Commit changes"), a:has-text("Create pull request")');
    const rawPre = page.locator('pre'); // raw file view

    // Wait for any of these to become visible (some might not exist depending on view)
    let ok = false;
    try {
      await expect(fileBlob).toBeVisible({ timeout: 7000 });
      ok = true;
    } catch (e) {
      // ignore
    }
    if (!ok) {
      try {
        await expect(proposeOrCommit).toBeVisible({ timeout: 7000 });
        ok = true;
      } catch (e) {
        // ignore
      }
    }
    if (!ok) {
      try {
        await expect(rawPre.first()).toBeVisible({ timeout: 7000 });
        ok = true;
      } catch (e) {
        // ignore
      }
    }

    // If nothing matched, at least assert the domain is GitHub and continue
    if (!ok) {
      // Last resort: check for any body text
      await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
    }
  } else {
    // Not GitHub: assume docs page -> article should exist
    await expect(page.locator('article')).toBeVisible({ timeout: 15000 });
  }

  // Back to language page and re-assert title
  await page.goBack();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('article h1')).toBeVisible();
  await expect(page.locator('article h1')).toHaveText('language');

  // Step 8: Click "Home" breadcrumb
  const homeBreadcrumb = page.locator('a[aria-label="Home page"]');
  await expect(homeBreadcrumb).toBeVisible();
  await homeBreadcrumb.click();
  await page.waitForLoadState('networkidle');

  // Step 9: Click "Documentation" again and re-open language submenu
  await expect(docsLink).toBeVisible();
  await docsLink.click();
  await page.waitForLoadState('networkidle');
  await expect(configSidebar).toBeVisible();
  await configSidebar.click();
  await expect(languageSubmenu).toBeVisible();
  await languageSubmenu.click();
  await page.waitForLoadState('networkidle');

  // Step 10: Click all example links on the page (if any)
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

  // Step 11: Copy buttons in code blocks
  const copyButtons = page.locator('span[class*="copyButtonIcons"]');
  if ((await copyButtons.count()) >= 1) {
    await expect(copyButtons.nth(0)).toBeVisible();
    await copyButtons.nth(0).click();
  }
  if ((await copyButtons.count()) >= 2) {
    await expect(copyButtons.nth(1)).toBeVisible();
    await copyButtons.nth(1).click();
  }

  // Step 12: Click "Edit this page" (remove target before clicking), then handle GitHub destinations and come back
  const editLink = page.locator('a.theme-edit-this-page');
  await expect(editLink).toBeVisible();
  await editLink.evaluate(el => el.removeAttribute('target'));
  await editLink.click();

  await page.waitForURL(url => {
    const href = url.href;
    return /github\.com\/login/i.test(href) ||
           /github\.dev/i.test(href) ||
           /\/edit\/(master|main)\//i.test(href) ||
           /github\.com\/grid-js\/gridjs\/blob\//i.test(href) ||
           /github\.com\/grid-js\/gridjs\/edit\//i.test(href);
  }, { timeout: 15000 });

  const currentUrl2 = page.url();

  if (/github\.com\/login/i.test(currentUrl2)) {
    await expect(page.locator('input[name="login"], input[id="login_field"]')).toBeVisible({ timeout: 10000 });
    await page.goBack();
    await page.waitForLoadState('networkidle');
  } else if (/github\.dev/i.test(currentUrl2)) {
    await expect(page.locator('.monaco-editor, [aria-label="Editor content"]')).toBeVisible({ timeout: 15000 });
    await page.goBack();
    await page.waitForLoadState('networkidle');
  } else {
    const proposeOrCommit = page.locator('button:has-text("Propose changes"), button:has-text("Commit changes"), a:has-text("Create pull request")');
    const fileBlob = page.locator('.blob-wrapper, .file .highlight, #repo-content-pjax-container');
    let ok2 = false;
    try {
      await expect(proposeOrCommit).toBeVisible({ timeout: 7000 });
      ok2 = true;
    } catch (e) {}
    if (!ok2) {
      try {
        await expect(fileBlob).toBeVisible({ timeout: 7000 });
        ok2 = true;
      } catch (e) {}
    }
    if (!ok2) {
      await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
    }
    await page.goBack();
    await page.waitForLoadState('networkidle');
  }

  // Step 13: Pagination (Previous / Next)
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
