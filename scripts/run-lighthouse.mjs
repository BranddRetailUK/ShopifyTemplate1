import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from '@playwright/test';
import { launch as launchChrome } from 'chrome-launcher';
import lighthouse from 'lighthouse';

const root = process.cwd();
const envPath = path.join(root, '.env.qa');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    process.env[match[1]] = match[2].replace(/^(?:"(.*)"|'(.*)')$/, '$1$2');
  }
}
if (!process.env.QA_BASE_URL) throw new Error('QA_BASE_URL is required.');

const baseUrl = new URL(process.env.QA_BASE_URL);
const previewThemeId = process.env.QA_PREVIEW_THEME_ID || '';
const outputDirectory = path.join(root, 'qa-results', 'lighthouse');
fs.mkdirSync(outputDirectory, { recursive: true });

function storefrontUrl(pathname) {
  const url = new URL(pathname, baseUrl);
  if (previewThemeId) url.searchParams.set('preview_theme_id', previewThemeId);
  return url.toString();
}

async function authenticate(port) {
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto(storefrontUrl('/'), { waitUntil: 'domcontentloaded' });
  const field = page.locator('input[name="password"]:visible');
  if (await field.count()) {
    if (!process.env.QA_STOREFRONT_PASSWORD) throw new Error('QA_STOREFRONT_PASSWORD is required.');
    await field.fill(process.env.QA_STOREFRONT_PASSWORD);
    await Promise.all([
      page.waitForLoadState('domcontentloaded'),
      field.locator('xpath=ancestor::form').locator('button[type="submit"], input[type="submit"]').first().click(),
    ]);
  }
  await page.close();
  return browser;
}

const chrome = await launchChrome({
  chromePath: chromium.executablePath(),
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
});
const browser = await authenticate(chrome.port);

try {
  const routes = [
    ['home', '/'],
    ['collection', process.env.QA_COLLECTION_PATH || '/collections/all'],
    ['product', process.env.QA_PRODUCT_PATH],
  ].filter(([, route]) => route);
  const summaries = [];

  for (const [name, route] of routes) {
    for (const formFactor of ['mobile', 'desktop']) {
      const desktop = formFactor === 'desktop';
      const result = await lighthouse(storefrontUrl(route), {
        port: chrome.port,
        output: ['html', 'json'],
        logLevel: 'warn',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor,
        screenEmulation: desktop
          ? { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }
          : { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
      });
      const [html, json] = result.report;
      const stem = `${name}-${formFactor}`;
      fs.writeFileSync(path.join(outputDirectory, `${stem}.html`), html);
      fs.writeFileSync(path.join(outputDirectory, `${stem}.json`), json);
      const categories = Object.fromEntries(
        Object.entries(result.lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
      );
      summaries.push({ route: name, formFactor, finalUrl: result.lhr.finalDisplayedUrl, categories });
    }
  }
  fs.writeFileSync(path.join(outputDirectory, 'summary.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), results: summaries }, null, 2)}\n`);
  console.log(JSON.stringify(summaries, null, 2));
} finally {
  await browser.close();
  await chrome.kill();
}
