import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from '@playwright/test';

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
const password = process.env.QA_STOREFRONT_PASSWORD || '';
const mediaDirectory = path.join(root, 'marketing', 'themeforest');
const evidenceDirectory = path.join(root, 'qa-results');
fs.mkdirSync(mediaDirectory, { recursive: true });
fs.mkdirSync(evidenceDirectory, { recursive: true });

function storefrontUrl(pathname = '/') {
  const url = new URL(pathname, baseUrl);
  if (previewThemeId) url.searchParams.set('preview_theme_id', previewThemeId);
  return url.toString();
}

async function openStorefront(page, pathname = '/') {
  await page.goto(storefrontUrl(pathname), { waitUntil: 'domcontentloaded' });
  const passwordField = page.locator('input[name="password"]:visible');
  if (await passwordField.count()) {
    if (!password) throw new Error('QA_STOREFRONT_PASSWORD is required for this store.');
    await passwordField.fill(password);
    await Promise.all([
      page.waitForLoadState('domcontentloaded'),
      passwordField.locator('xpath=ancestor::form').locator('button[type="submit"], input[type="submit"]').first().click(),
    ]);
    await page.goto(storefrontUrl(pathname), { waitUntil: 'domcontentloaded' });
  }
  await page.addStyleTag({ content: '#PBarNextFrameWrapper, #shopify-pc__banner { display: none !important; }' });
  await page.locator('body').evaluate(() => document.fonts?.ready);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(800);
  await page.locator('#MainContent').waitFor({ state: 'visible' });
}

async function discoverProductPath(page, collectionPath) {
  if (process.env.QA_PRODUCT_PATH) return process.env.QA_PRODUCT_PATH;
  await openStorefront(page, collectionPath);
  const href = await page.locator('a[href*="/products/"]').first().getAttribute('href');
  if (!href) throw new Error('No published product link was found in the demo catalogue.');
  return new URL(href, baseUrl).pathname;
}

async function captureScreenshots(browser, productPath, collectionPath) {
  const desktop = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  const desktopPage = await desktop.newPage();
  for (const [name, route] of [
    ['05-home-desktop-1920x1080.png', '/'],
    ['06-collection-desktop-1920x1080.png', collectionPath],
    ['07-product-desktop-1920x1080.png', productPath],
  ]) {
    await openStorefront(desktopPage, route);
    await desktopPage.screenshot({ path: path.join(mediaDirectory, name), animations: 'disabled' });
  }
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3, reducedMotion: 'reduce' });
  const mobilePage = await mobile.newPage();
  await openStorefront(mobilePage, '/');
  await mobilePage.screenshot({ path: path.join(mediaDirectory, '08-home-mobile-1080x1920.png'), animations: 'disabled' });
  await openStorefront(mobilePage, productPath);
  await mobilePage.screenshot({ path: path.join(mediaDirectory, '09-product-mobile-1080x1920.png'), animations: 'disabled' });
  await mobile.close();
}

async function captureVideo(browser, productPath) {
  const videoDirectory = fs.mkdtempSync(path.join(evidenceDirectory, 'modeframe-video-'));
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    reducedMotion: 'no-preference',
    recordVideo: { dir: videoDirectory, size: { width: 1920, height: 1080 } },
  });
  const page = await context.newPage();
  await openStorefront(page, '/');
  const video = page.video();
  await page.waitForTimeout(1600);
  for (const y of [560, 1180, 1850, 2500]) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'smooth' }), y);
    await page.waitForTimeout(1700);
  }
  await openStorefront(page, productPath);
  await page.waitForTimeout(1800);
  await page.mouse.wheel(0, 620);
  await page.waitForTimeout(1700);
  const addButton = page.locator('[data-add-to-cart]:visible').first();
  if (await addButton.count() && !(await addButton.isDisabled())) {
    await addButton.click();
    await page.waitForTimeout(2200);
  }
  await context.close();

  const webmPath = await video.path();
  const mp4Path = path.join(mediaDirectory, 'modeframe-preview-1920x1080.mp4');
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', webmPath,
    '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
    '-movflags', '+faststart', '-an', mp4Path,
  ]);
  fs.rmSync(videoDirectory, { recursive: true, force: true });
}

const browser = await chromium.launch();
try {
  const probeContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const probe = await probeContext.newPage();
  const collectionPath = process.env.QA_COLLECTION_PATH || '/collections/all';
  const productPath = await discoverProductPath(probe, collectionPath);
  await probeContext.close();
  await captureScreenshots(browser, productPath, collectionPath);
  await captureVideo(browser, productPath);
  fs.writeFileSync(path.join(mediaDirectory, 'CAPTURE-MANIFEST.json'), `${JSON.stringify({
    theme: 'Modeframe',
    version: '1.0.0',
    capturedAt: new Date().toISOString(),
    source: 'Packaged release installed on the dedicated Shopify demo store',
    routes: ['home', 'collection', 'product'],
    rightsNote: 'Store content and capture rights require seller approval before publication.',
  }, null, 2)}\n`);
  fs.writeFileSync(path.join(evidenceDirectory, 'themeforest-capture.json'), `${JSON.stringify({
    baseUrl: baseUrl.origin,
    previewThemeId: previewThemeId || null,
    productPath,
    collectionPath,
    capturedAt: new Date().toISOString(),
  }, null, 2)}\n`);
  console.log('Captured ThemeForest desktop/mobile screenshots and 1920x1080 MP4 preview.');
} finally {
  await browser.close();
}
