import { createRequire } from 'node:module';
import process from 'node:process';
import { expect, test } from '@playwright/test';

const require = createRequire(import.meta.url);
const axeSource = require('fs').readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const baseUrl = new URL(process.env.QA_BASE_URL);
const productPath = process.env.QA_PRODUCT_PATH;
const collectionPath = process.env.QA_COLLECTION_PATH;
const searchTerm = process.env.QA_SEARCH_TERM || 'shirt';

function storefrontUrl(pathname = '/') {
  const url = new URL(pathname, baseUrl);
  if (process.env.QA_PREVIEW_THEME_ID) url.searchParams.set('preview_theme_id', process.env.QA_PREVIEW_THEME_ID);
  return url.toString();
}

async function openStorefront(page, pathname = '/') {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  let response = await page.goto(storefrontUrl(pathname), { waitUntil: 'domcontentloaded' });
  const password = page.locator('input[name="password"]:visible');
  if (await password.count()) {
    if (!process.env.QA_STOREFRONT_PASSWORD) {
      throw new Error('The QA storefront is password protected; supply QA_STOREFRONT_PASSWORD outside Git.');
    }
    await password.fill(process.env.QA_STOREFRONT_PASSWORD);
    await Promise.all([
      page.waitForLoadState('domcontentloaded'),
      password.locator('xpath=ancestor::form').locator('button[type="submit"], input[type="submit"]').first().click(),
    ]);
    response = await page.goto(storefrontUrl(pathname), { waitUntil: 'domcontentloaded' });
  }
  expect(response, `No navigation response for ${pathname}`).not.toBeNull();
  expect(response.status(), `${pathname} returned ${response.status()}`).toBeLessThan(400);
  await expect(page.locator('#MainContent')).toBeVisible();

  // Shopify injects these controls outside the theme. Keep them from obscuring
  // theme interactions or creating accessibility findings owned by the platform.
  await page.addStyleTag({
    content: '#PBarNextFrameWrapper, #shopify-pc__banner { display: none !important; }',
  });
  await expect.poll(() => page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
}

async function expectNoSeriousAxeViolations(page) {
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(async () => window.axe.run(document, {
    exclude: [['#PBarNextFrameWrapper'], ['#shopify-pc__banner']],
    resultTypes: ['violations'],
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
  }));
  const serious = results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical');
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}

test('home renders without page exceptions and passes serious automated accessibility rules', async ({ page }) => {
  const exceptions = [];
  page.on('pageerror', (error) => exceptions.push(error.message));
  await openStorefront(page, '/');
  await expect(page.locator('[data-site-header]')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  await expectNoSeriousAxeViolations(page);
  const themeExceptions = exceptions.filter((message) => !/shopifycloud\/shop-js\/modules\//.test(message));
  expect(themeExceptions).toEqual([]);
});

test('search form reaches the Shopify search route', async ({ page }) => {
  await openStorefront(page, '/');
  const searchTrigger = page.locator('[data-dialog-open="#SearchDialog"]:visible').first();
  if (!(await searchTrigger.count())) {
    await page.locator('[data-dialog-open="#MobileMenu"]:visible').click();
    await expect(searchTrigger).toBeVisible();
  }
  await searchTrigger.click();
  const field = page.locator('#HeaderSearch');
  await expect(field).toBeVisible();
  await field.fill(searchTerm);
  await Promise.all([page.waitForLoadState('domcontentloaded'), field.press('Enter')]);
  await expect(page).toHaveURL(/\/search(?:\?|$)/);
  await expect(page.locator('#MainContent')).toBeVisible();
});

test('mobile menu opens and closes with Escape', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'Mobile-only interaction.');
  await openStorefront(page, '/');
  await page.locator('[data-dialog-open="#MobileMenu"]').click();
  const dialog = page.locator('#MobileMenu > dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('configured collection route renders and passes serious automated accessibility rules', async ({ page }) => {
  test.skip(!collectionPath, 'Set QA_COLLECTION_PATH for release coverage.');
  await openStorefront(page, collectionPath);
  await expect(page.locator('body')).toHaveClass(/template|theme-preset/);
  await expectNoSeriousAxeViolations(page);
});

test('configured product can be added to the session cart', async ({ page }) => {
  test.skip(!productPath, 'Set QA_PRODUCT_PATH to an available standard product.');
  await openStorefront(page, productPath);
  const addButton = page.locator('[data-add-to-cart]').first();
  await expect(addButton).toBeVisible();
  test.skip(await addButton.isDisabled(), 'Configured fixture has no immediately available variant.');
  await expectNoSeriousAxeViolations(page);
  const addResponse = page.waitForResponse((response) => response.url().includes('/cart/add') && response.request().method() === 'POST');
  await addButton.click();
  expect((await addResponse).status()).toBeLessThan(400);
  await expect(page.locator('[data-cart-count]')).not.toHaveText('0');
});
