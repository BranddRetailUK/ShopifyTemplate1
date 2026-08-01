import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function parseThemeJson(relativePath) {
  return JSON.parse(read(relativePath).replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
}

function requireFile(relativePath) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    failures.push(`Missing required file: ${relativePath}`);
  }
}

function requireText(relativePath, expected, description) {
  if (!read(relativePath).includes(expected)) {
    failures.push(`${relativePath}: ${description}`);
  }
}

const requiredFiles = [
  'layout/theme.liquid',
  'layout/password.liquid',
  'config/settings_schema.json',
  'config/settings_data.json',
  'locales/en.default.json',
  'templates/404.json',
  'templates/article.json',
  'templates/blog.json',
  'templates/cart.json',
  'templates/collection.json',
  'templates/index.json',
  'templates/list-collections.json',
  'templates/page.json',
  'templates/page.contact.json',
  'templates/password.json',
  'templates/product.json',
  'templates/search.json',
  'templates/gift_card.liquid',
  'sections/header.liquid',
  'sections/footer.liquid',
  'sections/product.liquid',
  'sections/collection.liquid',
  'sections/slideshow.liquid',
  'sections/custom-liquid.liquid',
  'snippets/selling-plan-picker.liquid',
  'README.md',
  'LICENSE.md',
  'RELEASE_NOTES.md',
  'docs/documentation.html',
  'docs/merchant-guide.md',
  'docs/faq.md',
  'docs/marketplace-listing.md',
  'docs/marketplace-readiness.md',
  'docs/qa-matrix.md',
  'docs/support-policy.md',
  'docs/third-party-platform-fit.md',
  'docs/shopify-theme-store-compatibility.md',
  'docs/source-provenance.md',
  'docs/licensing-architecture.md',
  'distribution/README.txt',
  'distribution/QUICK-START.txt',
  'distribution/ACTIVATE-LICENSE.txt',
  'distribution/ENVATO-LICENSE.txt',
  'distribution/MARKETPLACE-LICENSE.txt',
  'distribution/ASSET-CREDITS.txt',
  'themeforest/item-description.html',
  'themeforest/submission-fields.md',
  'themeforest/reviewer-notes.md',
  'marketing/themeforest/01-modeframe-cover-2340x1560.png',
  'marketing/themeforest/02-six-global-styles-1920x1080.png',
  'marketing/themeforest/03-commerce-layouts-1920x1080.png',
  'marketing/themeforest/04-section-system-1920x1080.png',
  'marketing/themeforest/05-home-desktop-1920x1080.png',
  'marketing/themeforest/06-collection-desktop-1920x1080.png',
  'marketing/themeforest/07-product-desktop-1920x1080.png',
  'marketing/themeforest/08-home-mobile-1080x1920.png',
  'marketing/themeforest/09-product-mobile-1080x1920.png',
  'marketing/themeforest/modeframe-preview-1920x1080.mp4',
  'marketing/themeforest/CAPTURE-MANIFEST.json',
  'scripts/capture-themeforest-media.mjs',
  'scripts/run-lighthouse.mjs',
  'scripts/run-marketplace-lighthouse.mjs',
  'playwright.marketplace.config.mjs',
  'marketplace-tests/preview.spec.mjs',
  'services/license-api/src/server.mjs',
  'services/license-api/test/license.test.mjs',
  'services/marketplace-site/src/server.mjs',
  'services/marketplace-site/test/server.test.mjs',
];

requiredFiles.forEach(requireFile);

const settingsSchema = parseThemeJson('config/settings_schema.json');
const settingsData = parseThemeJson('config/settings_data.json');
const themeInfo = settingsSchema.find(({ name }) => name === 'theme_info');
const globalStyles = settingsSchema.find(({ name }) => name === 'Global styles');
const styleSetting = globalStyles?.settings?.find(({ id }) => id === 'theme_preset');
const presetNames = Object.keys(settingsData.presets || {});

if (themeInfo?.theme_name !== 'Modeframe') failures.push('Theme name must be Modeframe.');
if (themeInfo?.theme_version !== '1.0.0') failures.push('Theme version must be 1.0.0.');
if (themeInfo?.theme_author !== 'Brandd') failures.push('Theme author must be Brandd.');
if (presetNames.length !== 1 || presetNames[0] !== 'Modeframe') {
  failures.push('settings_data.json must contain exactly one preset named Modeframe.');
}
if (styleSetting?.options?.length !== 6) {
  failures.push('Global styles must retain all six visual modes.');
}

requireText('sections/footer.liquid', "{{ shop | login_button: action: 'follow' }}", 'missing Follow on Shop button');
requireText('sections/header.liquid', '<shopify-account', 'missing Shopify account component');
requireText('sections/product.liquid', "render 'selling-plan-picker'", 'missing selling-plan selector');
requireText('sections/slideshow.liquid', 'data-nav-tone=', 'missing header tone metadata');
requireText('layout/theme.liquid', '<meta charset="utf-8">', 'missing character encoding');
requireText('layout/theme.liquid', 'name="viewport"', 'missing responsive viewport');

if (failures.length) {
  console.error('Modeframe release validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log('Modeframe 1.0.0 release structure passed: one install preset, six visual modes, and required commerce/documentation files.');
}
