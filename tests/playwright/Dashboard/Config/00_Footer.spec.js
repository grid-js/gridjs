// tests/Footer/footer-mismatch.spec.js
import { test, expect } from "@playwright/test";

const HOME = (process.env.BASE_URL || "https://gridjs.io/").replace(/\/+$/, "/");
const DOCS = "https://gridjs.io/docs";

test.describe("Footer regression", () => {
  test("should catch footer mismatch between Home and Docs", async ({ page }) => {
    const homeFooterLinks = await getFooterLinkTexts(page, HOME, "div.footer_SBgd");
    const docsFooterLinks = await getFooterLinkTexts(page, DOCS, "footer.footer.footer--dark");

    const homeNorm = normalizeList(homeFooterLinks);
    const docsNorm = normalizeList(docsFooterLinks);

    expect(
      homeNorm,
      `BUG: Footer differs between Home and Docs\n\nHOME:\n- ${homeNorm.join("\n- ")}\n\nDOCS:\n- ${docsNorm.join("\n- ")}\n`,
    ).toEqual(docsNorm);
  });
});

async function getFooterLinkTexts(page, url, footerSelector) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);

  const footer = page.locator(footerSelector).first();
  await expect(footer, `Footer not found: ${footerSelector}`).toBeVisible({ timeout: 20_000 });

  const links = footer.locator("a");
  const count = await links.count();

  const texts = [];
  for (let i = 0; i < count; i++) {
    const t = ((await links.nth(i).innerText().catch(() => "")) || "").trim();
    if (t) texts.push(t);
  }
  return texts;
}

function normalizeList(arr) {
  return arr
    .map((s) => s.replace(/\s+/g, " ").trim().toLowerCase())
    .filter(Boolean);
}
