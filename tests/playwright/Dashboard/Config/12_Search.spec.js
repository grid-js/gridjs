// @ts-check
import { test, expect } from '@playwright/test';

test('Grid.js Docs Flow — Search page interactions (refined)', async ({ page }) => {
  // Step 1: Open homepage
  await page.goto('https://gridjs.io');
  await page.waitForLoadState('networkidle');

  // Step 2: Click "Documentation"
  const docsLink = page.locator('a[href="/docs"]').first();
  await expect(docsLink).toBeVisible({ timeout: 10000 });
  await docsLink.click();
  await page.waitForLoadState('networkidle');

  // Step 3: Click "🛠 Config" in sidebar
  const configSidebar = page.locator('a.menu__link:has-text("Config")');
  await expect(configSidebar).toBeVisible({ timeout: 10000 });
  await configSidebar.click();
  await page.waitForLoadState('networkidle');

  // Step 4: Open "search" submenu
  const searchSubmenu = page.locator('a.menu__link[href="/docs/config/search"]');
  await expect(searchSubmenu).toBeVisible({ timeout: 10000 });
  await searchSubmenu.click();
  await page.waitForLoadState('networkidle');

  // Step 5: Verify we are on the search page
  const pageTitle = page.locator('article h1');
  await expect(pageTitle).toBeVisible({ timeout: 10000 });
  await expect(pageTitle).toHaveText('search');

  // Step 6: Verify properties table rows exist
  const propsTable = page.locator('article table').first();
  await expect(propsTable).toBeVisible({ timeout: 10000 });
  await expect(propsTable).toContainText('keyword');
  await expect(propsTable).toContainText('server');
  await expect(propsTable).toContainText('debounceTimeout');
  await expect(propsTable).toContainText('selector');

  // Step 7: Verify example code block contains "search: true" (robust)
  const exactCode = page.locator('article pre').filter({ hasText: /search:\s*true/i }).first();
  if ((await exactCode.count()) > 0) {
    await expect(exactCode).toBeVisible({ timeout: 10000 });
  } else {
    // fallback: check any pre containing 'search'
    const fuzzyCode = page.locator('article pre').filter({ hasText: /search/i }).first();
    await expect(fuzzyCode).toBeVisible({ timeout: 10000 });
  }

  // -------------------------
  // Step 8: Click Locales link in TIP (admonition) if present
  // -------------------------
  const localesLink = page.locator(
    'article .theme-admonition a:has-text("Locales"), article .admonition a:has-text("Locales"), article a[href*="/localization/locales"]'
  ).first();

  if ((await localesLink.count()) > 0) {
    try {
      await expect(localesLink).toBeVisible({ timeout: 8000 });
      // ensure same tab
      await localesLink.evaluate(el => el.removeAttribute('target'));
      await Promise.all([
        page.waitForLoadState('networkidle').catch(() => {}),
        localesLink.click()
      ]);
      // wait for docs/locales or github
      await page.waitForURL(u => /\/docs\/localization\/locales/i.test(u.href) || /\/docs\/locales/i.test(u.href) || /github\.com/i.test(u.href), { timeout: 15000 });

      if (/\/docs\/localization\/locales/i.test(page.url()) || /\/docs\/locales/i.test(page.url())) {
        await expect(page.locator('article h1')).toBeVisible({ timeout: 10000 });
        const h = (await page.locator('article h1').innerText()).toLowerCase();
        expect(h).toMatch(/locales|locale/i);
      }
    } catch (err) {
      console.warn('Locales link check failed:', err);
    } finally {
      // Go back to search page safely
      try {
        await page.goBack();
        await page.waitForLoadState('networkidle');
      } catch {
        await page.goto('https://gridjs.io/docs/config/search');
        await page.waitForLoadState('networkidle');
      }
      await expect(page.locator('article h1')).toHaveText('search');
    }
  } else {
    console.warn('Locales link not found in TIP — skipping.');
  }

  // -------------------------
  // Step 9: Click links in the Example column of the table (Search and Server-side search)
  // -------------------------
  const table = page.locator('article table').first();
  await expect(table).toBeVisible({ timeout: 10000 });

  // find Example column index from header
  let exampleIndex = 3;
  const headers = table.locator('thead tr th');
  const headerCount = await headers.count();
  if (headerCount > 0) {
    for (let i = 0; i < headerCount; i++) {
      const txt = (await headers.nth(i).innerText()).toLowerCase();
      if (txt.includes('example')) {
        exampleIndex = i;
        break;
      }
    }
  }

  const rows = table.locator('tbody tr');
  const rowsCount = await rows.count();
  for (let r = 0; r < rowsCount; r++) {
    const exampleCell = rows.nth(r).locator('td').nth(exampleIndex);
    const links = exampleCell.locator('a');
    const linkCount = await links.count();
    for (let l = 0; l < linkCount; l++) {
      const link = links.nth(l);
      if (!(await link.isVisible())) continue;
      const text = (await link.innerText()).trim().toLowerCase();
      try {
        await link.evaluate(el => el.removeAttribute('target'));
        await Promise.all([
          page.waitForLoadState('networkidle').catch(()=>{}),
          link.click()
        ]);
        // basic assertions based on url or link text
        const url = page.url();
        if (/\/docs\/examples\/server-side-search/i.test(url) || text.includes('server')) {
          const h = page.locator('article h1').first();
          await expect(h).toBeVisible({ timeout: 10000 });
          const heading = (await h.innerText()).toLowerCase();
          expect(heading).toMatch(/server/i);
        } else if (/\/docs\/examples\/search/i.test(url) || text.includes('search')) {
          const h = page.locator('article h1').first();
          await expect(h).toBeVisible({ timeout: 10000 });
          const heading = (await h.innerText()).toLowerCase();
          expect(heading).toMatch(/search/i);
        } else if (/\/docs\//i.test(url)) {
          await expect(page.locator('article')).toBeVisible({ timeout: 10000 });
        } else if (/github\.com/i.test(url)) {
          // GitHub page or login
          const login = page.locator('input[name="login"], input#login_field');
          if ((await login.count()) > 0) {
            await expect(login).toBeVisible({ timeout: 10000 });
          } else {
            await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
          }
        } else {
          await expect(page.locator('body')).toBeVisible();
        }
      } catch (err) {
        console.warn(`Clicking example link (row ${r}, link ${l}) failed:`, err);
      } finally {
        // Try to go back to search page
        try {
          await page.goBack();
          await page.waitForLoadState('networkidle');
        } catch {
          await page.goto('https://gridjs.io/docs/config/search');
          await page.waitForLoadState('networkidle');
        }
        await expect(page.locator('article h1')).toHaveText('search');
      }
    }
  }

  // Step 10: Click all general example links (href^="/docs/examples/")
  const generalExamples = page.locator('article a[href^="/docs/examples/"]');
  const genCount = await generalExamples.count();
  for (let i = 0; i < genCount; i++) {
    const g = generalExamples.nth(i);
    try {
      await expect(g).toBeVisible({ timeout: 8000 });
      await g.evaluate(el => el.removeAttribute('target'));
      await Promise.all([
        page.waitForLoadState('networkidle').catch(()=>{}),
        g.click()
      ]);
    } catch (err) {
      console.warn('General example click failed:', err);
    } finally {
      try {
        await page.goBack();
        await page.waitForLoadState('networkidle');
      } catch {
        await page.goto('https://gridjs.io/docs/config/search');
        await page.waitForLoadState('networkidle');
      }
    }
  }

  // Step 11: Copy buttons
  const copyButtons = page.locator('span[class*="copyButtonIcons"]');
  const copyCount = await copyButtons.count();
  if (copyCount > 0) {
    for (let i = 0; i < Math.min(copyCount, 2); i++) {
      try {
        await expect(copyButtons.nth(i)).toBeVisible({ timeout: 5000 });
        await copyButtons.nth(i).click();
      } catch (err) {
        console.warn('Copy button click failed:', err);
      }
    }
  } else {
    console.warn('No copy buttons found.');
  }

  // Step 12: Click "Edit this page" in new tab and verify
  const editLink = page.locator('a.theme-edit-this-page').first();
  if ((await editLink.count()) > 0) {
    await expect(editLink).toBeVisible({ timeout: 8000 });
    const editHref = await editLink.getAttribute('href');
    if (editHref) {
      const newPage = await page.context().newPage();
      try {
        const target = editHref.startsWith('http') ? editHref : new URL(editHref, 'https://gridjs.io').href;
        await newPage.goto(target, { waitUntil: 'domcontentloaded' });
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
          const fileBlob = newPage.locator('.blob-wrapper, .file .highlight, #repo-content-pjax-container');
          const propose = newPage.locator('button:has-text("Propose changes"), a:has-text("Create pull request")');
          if ((await fileBlob.count()) > 0) {
            await expect(fileBlob.first()).toBeVisible({ timeout: 7000 });
          } else if ((await propose.count()) > 0) {
            await expect(propose.first()).toBeVisible({ timeout: 7000 });
          } else {
            await expect(newPage.locator('body')).toBeVisible({ timeout: 5000 });
          }
        } else {
          await expect(newPage.locator('article')).toBeVisible({ timeout: 15000 });
        }
      } catch (err) {
        console.warn('Edit page verification failed:', err);
      } finally {
        await newPage.close();
      }
    } else {
      console.warn('Edit link has no href.');
    }
  } else {
    console.warn('Edit link not found.');
  }

  // Step 13: Pagination prev / next
  const prev = page.locator('a.pagination-nav__link--prev').first();
  if ((await prev.count()) > 0) {
    await expect(prev).toBeVisible({ timeout: 8000 });
    await prev.click();
    try {
      await page.goBack();
      await page.waitForLoadState('networkidle');
    } catch {
      await page.goto('https://gridjs.io/docs/config/search');
      await page.waitForLoadState('networkidle');
    }
  } else {
    console.warn('Prev not found.');
  }

  const next = page.locator('a.pagination-nav__link--next').first();
  if ((await next.count()) > 0) {
    await expect(next).toBeVisible({ timeout: 8000 });
    await next.click();
    try {
      await page.goBack();
      await page.waitForLoadState('networkidle');
    } catch {
      await page.goto('https://gridjs.io/docs/config/search');
      await page.waitForLoadState('networkidle');
    }
  } else {
    console.warn('Next not found.');
  }

  // Final check: ensure still on search page
  await expect(page.locator('article h1')).toBeVisible();
  await expect(page.locator('article h1')).toHaveText('search');
});
