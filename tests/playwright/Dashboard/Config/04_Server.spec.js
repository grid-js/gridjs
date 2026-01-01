// tests/02_Dashboard/01_Navigation/01_Positive/03_Server.js
// @ts-check
import { test, expect } from '@playwright/test';

test('Grid.js Docs Flow — config/server, klik contoh & selalu back', async ({ page }) => {
  // helper kembali ke /docs/config/server
  const backToServer = async () => {
    await page.goBack();
    await expect(page).toHaveURL(/\/docs\/config\/server\/?$/i);
    await expect(page.getByRole('heading', { name: /^server$/i, level: 1 })).toBeVisible();
  };

  // 1) Home
  await page.goto('https://gridjs.io');
  await expect(page).toHaveTitle(/Grid\.js/i);

  // 2) Docs
  await page.locator('a[href="/docs"]').first().click();
  await expect(page).toHaveURL(/\/docs\/?$/);

  // 3) Sidebar "Config"
  const config = page.locator('a.menu__link:has-text("Config")');
  await expect(config).toBeVisible();
  await config.click();

  // 4) Ke "server"
  const serverMenu = page.locator('a.menu__link[href="/docs/config/server"]');
  await expect(serverMenu).toBeVisible();
  await serverMenu.click();
  await expect(page).toHaveURL(/\/docs\/config\/server\/?$/i);
  await expect(page.getByRole('heading', { name: /^server$/i, level: 1 })).toBeVisible();

  // 5) Example "Server" -> BACK
  await page.locator('a[href="/docs/examples/server"]').first().click();
  await expect(page).toHaveURL(/\/docs\/examples\/server\/?$/i);
  await expect(page.getByRole('heading', { name: /Import server-side data/i })).toBeVisible();
  await backToServer();

  // 6) Example "Server-side search" -> BACK
  await page.locator('a[href="/docs/examples/server-side-search"]').first().click();
  await expect(page).toHaveURL(/\/docs\/examples\/server-side-search\/?$/i);
  await expect(page.getByRole('heading', { name: /Server Side Search/i })).toBeVisible();
  await backToServer();

  // 7) Example "Server-side pagination" -> BACK
  await page.locator('a[href="/docs/examples/server-side-pagination"]').first().click();
  await expect(page).toHaveURL(/\/docs\/examples\/server-side-pagination\/?$/i);
  await expect(page.getByRole('heading', { name: /Server Side Pagination/i })).toBeVisible();
  await backToServer();

  // 8) Copy code (klik yang ada saja)
  const copyBtns = page.locator('span[class*="copyButtonIcons"]');
  const n = await copyBtns.count();
  if (n >= 1) {
    await expect(copyBtns.first()).toBeVisible();
    await copyBtns.first().click();
  }
  if (n >= 2) {
    await expect(copyBtns.nth(1)).toBeVisible();
    await copyBtns.nth(1).click();
  }

  // 9) Edit this page -> handle 2 kemungkinan: langsung editor / halaman login
  const editLink = page.locator('a.theme-edit-this-page');
  await expect(editLink).toBeVisible();
  await editLink.evaluate(el => el.removeAttribute('target')); // buka di tab yang sama
  await editLink.click();

  const editRegex  = /https:\/\/github\.com\/grid-js\/website\/edit\/master\/docs\/config\/server\.md/i;
  const loginRegex = /https:\/\/github\.com\/login\?return_to=.+%2Fgrid-js%2Fwebsite%2Fedit%2Fmaster%2Fdocs%2Fconfig%2Fserver\.md/i;

  await page.waitForURL(u => editRegex.test(u.href) || loginRegex.test(u.href), { timeout: 15000 });

  if (loginRegex.test(page.url())) {
    // >>> FIX: jangan pakai .or() langsung, pilih salah satu selector yang ada <<<
    const headingCount = await page.getByRole('heading', { name: /sign in to github/i }).count();
    if (headingCount > 0) {
      await expect(page.getByRole('heading', { name: /sign in to github/i })).toBeVisible();
    } else {
      await expect(page.locator('input[name="login"]')).toBeVisible();
    }
  } else {
    await expect(page).toHaveURL(editRegex);
    // Pastikan editor (textarea/code mirror) tampil
    await expect(page.getByRole('textbox')).toBeVisible();
  }

  // Kembali ke /docs/config/server
  await backToServer();

  // 10) Previous -> columns -> BACK
  await page.locator('a.pagination-nav__link--prev').click();
  await expect(page).toHaveURL(/\/docs\/config\/columns\/?$/i);
  await backToServer();

  // 11) Next -> style -> BACK
  await page.locator('a.pagination-nav__link--next').click();
  await expect(page).toHaveURL(/\/docs\/config\/style\/?$/i);
  await backToServer();
});
