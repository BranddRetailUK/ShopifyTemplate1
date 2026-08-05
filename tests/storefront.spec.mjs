import { createRequire } from 'node:module';
import process from 'node:process';
import { expect, test } from '@playwright/test';

const require = createRequire(import.meta.url);
const axeSource = require('fs').readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const baseUrl = new URL(process.env.QA_BASE_URL);
const productPath = process.env.QA_PRODUCT_PATH;
const collectionPath = process.env.QA_COLLECTION_PATH;
const contentPath = process.env.QA_CONTENT_PATH;
const searchTerm = process.env.QA_SEARCH_TERM || 'shirt';
const missingPath = '/modeframe-qa-route-that-does-not-exist';

function storefrontUrl(pathname = '/') {
  const url = new URL(pathname, baseUrl);
  if (process.env.QA_PREVIEW_THEME_ID) url.searchParams.set('preview_theme_id', process.env.QA_PREVIEW_THEME_ID);
  return url.toString();
}

async function openStorefront(page, pathname = '/', { expectedStatus } = {}) {
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
  if (expectedStatus === undefined) {
    expect(response.status(), `${pathname} returned ${response.status()}`).toBeLessThan(400);
  } else {
    expect(response.status(), `${pathname} returned ${response.status()}`).toBe(expectedStatus);
  }
  await expect(page.locator('#MainContent')).toBeVisible();

  // Shopify injects these controls outside the theme. Keep them from obscuring
  // theme interactions or creating accessibility findings owned by the platform.
  await page.addStyleTag({
    content: '#PBarNextFrameWrapper, #shopify-pc__banner { display: none !important; }',
  });
  await expect.poll(() => page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
}

async function openSearchDialog(page) {
  let trigger = page.locator('[data-dialog-open="#SearchDialog"]:visible').first();
  if (!(await trigger.count())) {
    await page.locator('[data-dialog-open="#MobileMenu"]:visible').click();
    trigger = page.locator('[data-dialog-open="#SearchDialog"]:visible').first();
    await expect(trigger).toBeVisible();
  }
  await trigger.click();
  const dialog = page.locator('#SearchDialog > dialog');
  await expect(dialog).toBeVisible();
  return { dialog, field: page.locator('#HeaderSearch'), trigger };
}

async function addConfiguredProduct(page, { checkAccessibility = false } = {}) {
  await openStorefront(page, productPath);
  const addButton = page.locator('product-info [data-add-to-cart]').first();
  if (!(await addButton.count()) || (await addButton.isDisabled())) return false;
  if (checkAccessibility) await expectNoSeriousAxeViolations(page);
  const addResponse = page.waitForResponse(
    (response) => response.url().includes('/cart/add') && response.request().method() === 'POST',
  );
  await addButton.click();
  expect((await addResponse).status()).toBeLessThan(400);
  return true;
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

test('skip link moves keyboard focus to the main content', async ({ page }) => {
  await openStorefront(page, '/');
  const skipLink = page.locator('.skip-link');
  await page.keyboard.press('Tab');
  await expect(skipLink).toBeFocused();
  await skipLink.press('Enter');
  await expect(page.locator('#MainContent')).toBeFocused();
});

test('search form reaches the Shopify search route', async ({ page }) => {
  await openStorefront(page, '/');
  const { field } = await openSearchDialog(page);
  await expect(field).toBeVisible();
  await field.fill(searchTerm);
  await Promise.all([
    page.waitForURL((url) => url.pathname === '/search' && url.searchParams.get('q') === searchTerm),
    field.press('Enter'),
  ]);
  await expect(page.locator('#MainContent')).toBeVisible();
  await expectNoSeriousAxeViolations(page);
});

test('predictive search returns an accessible result surface', async ({ page }) => {
  await openStorefront(page, '/');
  const { dialog, field } = await openSearchDialog(page);
  const predictiveSearch = dialog.locator('predictive-search');
  test.skip(
    (await predictiveSearch.getAttribute('data-enabled')) === 'false',
    'Predictive search is disabled in this fixture.',
  );

  const responsePromise = page.waitForResponse(
    (response) => response.url().includes('/search/suggest') && response.request().method() === 'GET',
  );
  await field.fill(searchTerm);
  expect((await responsePromise).status()).toBeLessThan(400);

  const results = dialog.locator('[data-predictive-results]');
  await expect(results).toBeVisible();
  await expect(field).toHaveAttribute('aria-expanded', 'true');
  await expect(results.locator('.predictive-search__view-all')).toBeVisible();
  await field.press('Escape');
  await expect(results).toBeHidden();
  await expect(field).toHaveAttribute('aria-expanded', 'false');
});

test('search dialog restores keyboard focus to its trigger', async ({ page }) => {
  await openStorefront(page, '/');
  const { dialog, trigger } = await openSearchDialog(page);
  await expect(dialog.locator('[data-dialog-close]')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
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

test('configured collection submits an available storefront filter', async ({ page }) => {
  test.skip(!collectionPath, 'Set QA_COLLECTION_PATH for release coverage.');
  await openStorefront(page, collectionPath);
  const filter = page.locator('[data-facet-input][type="checkbox"]:not(:disabled):not(:checked)').first();
  test.skip(!(await filter.count()), 'Configured collection has no available list filter.');

  const name = await filter.getAttribute('name');
  const value = await filter.getAttribute('value');
  expect(name).toBeTruthy();
  expect(value).toBeTruthy();
  await filter.evaluate((input) => {
    const details = input.closest('details');
    if (details) details.open = true;
  });
  await Promise.all([
    page.waitForURL((url) => url.searchParams.getAll(name).includes(value)),
    filter.check(),
  ]);
  await expect(page.locator('.facets__clear')).toBeVisible();
  await expect(page.locator('[data-product-grid], .empty-state').first()).toBeVisible();
});

test('configured product can be added to the session cart', async ({ page }) => {
  test.skip(!productPath, 'Set QA_PRODUCT_PATH to an available standard product.');
  const added = await addConfiguredProduct(page, { checkAccessibility: true });
  test.skip(!added, 'Configured fixture has no immediately available variant.');
  await expect.poll(async () => Number((await page.locator('[data-cart-count]').first().textContent()) || 0)).toBeGreaterThan(0);
});

test('configured product updates its selected variant state', async ({ page }) => {
  test.skip(!productPath, 'Set QA_PRODUCT_PATH to a product with multiple available variants.');
  await openStorefront(page, productPath);
  const productInfo = page.locator('product-info').first();
  const picker = productInfo.locator('variant-selects');
  test.skip(!(await picker.count()), 'Configured product has no variant picker.');

  const variantData = JSON.parse(await productInfo.locator('[data-product-variants]').textContent());
  const variantInput = productInfo.locator('form[action*="/cart/add"] input[name="id"]').first();
  const currentVariantId = await variantInput.inputValue();
  const candidate = variantData.find(
    (variant) => variant.available && String(variant.id) !== String(currentVariantId),
  );
  test.skip(!candidate, 'Configured product has no alternate available variant.');

  for (const [index, optionValue] of candidate.options.entries()) {
    const position = index + 1;
    const select = picker.locator(`select[data-option-position="${position}"]`);
    if (await select.count()) {
      await select.selectOption(optionValue);
      continue;
    }

    const inputId = await picker
      .locator(`input[data-option-position="${position}"]`)
      .evaluateAll(
        (inputs, expectedValue) => inputs.find((input) => input.value === expectedValue && !input.disabled)?.id || '',
        optionValue,
      );
    test.skip(!inputId, `Variant option ${optionValue} is not selectable in this fixture.`);
    await picker.locator(`#${inputId}`).check({ force: true });
  }

  await expect(variantInput).toHaveValue(String(candidate.id));
  await expect.poll(() => new URL(page.url()).searchParams.get('variant')).toBe(String(candidate.id));
  await expect(productInfo.locator('[data-add-to-cart]').first()).toBeEnabled();
});

test('cart page removes an added line through its native remove action', async ({ page }) => {
  test.skip(!productPath, 'Set QA_PRODUCT_PATH to an available standard product.');
  const added = await addConfiguredProduct(page);
  test.skip(!added, 'Configured fixture has no immediately available variant.');
  await openStorefront(page, '/cart');

  const line = page.locator('.cart-line').first();
  await expect(line).toBeVisible();
  const removeLink = line.locator('a[href*="quantity=0"]').first();
  await expect(removeLink).toBeVisible();
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    removeLink.click(),
  ]);
  await expect(page.locator('.cart-line')).toHaveCount(0);
  await expect(page.locator('.cart-page .empty-state')).toBeVisible();
  await expectNoSeriousAxeViolations(page);
});

test('configured content route renders its primary content accessibly', async ({ page }) => {
  test.skip(!contentPath, 'Set QA_CONTENT_PATH to a representative page, blog, or article.');
  await openStorefront(page, contentPath);
  await expect(page.locator('#MainContent h1').first()).toBeVisible();
  await expectNoSeriousAxeViolations(page);
});

test('missing route renders the storefront 404 template with recovery actions', async ({ page }) => {
  await openStorefront(page, missingPath, { expectedStatus: 404 });
  await expect(page.locator('.not-found')).toBeVisible();
  await expect(page.locator('.not-found__search')).toBeVisible();
  await expect(page.locator('.not-found .button-group a')).toHaveCount(2);
  await expectNoSeriousAxeViolations(page);
});
