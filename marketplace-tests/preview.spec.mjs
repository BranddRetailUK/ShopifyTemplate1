import { createRequire } from 'node:module';
import { expect, test } from '@playwright/test';

const require = createRequire(import.meta.url);
const axeSource = require('fs').readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

async function expectNoSeriousAxeViolations(page) {
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(async () => window.axe.run(document, {
    resultTypes: ['violations'],
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
  }));
  const serious = results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical');
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}

test('preview landing is frame-compatible and accessible', async ({ page }) => {
  const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);
  const headers = response?.headers() || {};
  expect(headers['x-frame-options']).toBeUndefined();
  expect(headers['content-security-policy']).toContain('frame-ancestors https://themeforest.net');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Commerce, clearly framed.');
  const demo = page.getByRole('link', { name: 'Open the Shopify demo' });
  await expect(demo).toHaveAttribute('target', '_blank');
  const credential = page.locator('.demo-credential');
  await expect(credential).toContainText('Demo password:');
  expect((await credential.locator('code').textContent())?.trim().length).toBeGreaterThan(0);
  await expectNoSeriousAxeViolations(page);
});

test('documentation, support, privacy, and refund routes are accessible', async ({ page }) => {
  for (const route of ['/documentation', '/support', '/privacy', '/refunds']) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('main h1'), route).toBeVisible();
    await expectNoSeriousAxeViolations(page);
  }
});

test('Envato Elements mode suppresses the market-only demo action', async ({ page }) => {
  await page.goto('/?storefront=envato-elements', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveClass(/is-elements/);
  await expect(page.getByRole('link', { name: 'Open the Shopify demo' })).toBeHidden();
});
