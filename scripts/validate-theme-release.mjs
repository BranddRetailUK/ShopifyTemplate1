import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const releaseVersion = '2.0.0';
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
  const absolutePath = path.join(root, relativePath);
  if (fs.existsSync(absolutePath) && !read(relativePath).includes(expected)) {
    failures.push(`${relativePath}: ${description}`);
  }
}

const requiredFiles = [
  'assets/critical.css',
  'assets/theme.js',
  'blocks/group.liquid',
  'blocks/text.liquid',
  'layout/theme.liquid',
  'layout/password.liquid',
  'config/settings_schema.json',
  'config/settings_data.json',
  'locales/en.default.json',
  'locales/en.default.schema.json',
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
  'sections/flexible-content.liquid',
  'sections/product-specifications.liquid',
  'sections/shoppable-lookbook.liquid',
  'snippets/selling-plan-picker.liquid',
  'RELEASE_NOTES.md',
  'scripts/build-theme-store-bundle.mjs',
  'scripts/validate-theme-store-bundle.mjs',
];

requiredFiles.forEach(requireFile);

const packageMetadata = JSON.parse(read('package.json'));
const settingsSchema = parseThemeJson('config/settings_schema.json');
const settingsData = parseThemeJson('config/settings_data.json');
const themeInfo = settingsSchema.find(({ name }) => name === 'theme_info');
const globalStyles = settingsSchema.find(({ name }) => name === 'Global styles');
const styleSetting = globalStyles?.settings?.find(({ id }) => id === 'theme_preset');
const artDirections = styleSetting?.options?.map(({ value }) => value) || [];
const presetNames = Object.keys(settingsData.presets || {});

if (packageMetadata.version !== releaseVersion) {
  failures.push(`package.json version must be ${releaseVersion}.`);
}
if (themeInfo?.theme_name !== 'Modeframe') failures.push('Theme name must be Modeframe.');
if (themeInfo?.theme_version !== packageMetadata.version) {
  failures.push('Theme version must match package.json.');
}
if (themeInfo?.theme_author !== 'Brandd') failures.push('Theme author must be Brandd.');
if (presetNames.length !== 1 || presetNames[0] !== 'Modeframe') {
  failures.push('settings_data.json must contain exactly one preset named Modeframe.');
}
if (JSON.stringify(artDirections) !== JSON.stringify(['paper', 'ink', 'signal'])) {
  failures.push('Global styles must expose exactly the Paper, Ink, and Signal art directions.');
}

requireText('sections/footer.liquid', "{{ shop | login_button: action: 'follow' }}", 'missing Follow on Shop button');
requireText('sections/header.liquid', '<shopify-account', 'missing Shopify account component');
requireText('sections/product.liquid', "render 'selling-plan-picker'", 'missing selling-plan selector');
requireText('sections/slideshow.liquid', 'data-nav-tone=', 'missing header tone metadata');
requireText('sections/flexible-content.liquid', "{% content_for 'blocks' %}", 'missing theme-block rendering');
requireText('sections/flexible-content.liquid', '"type": "@app"', 'missing app-block support');
requireText('sections/flexible-content.liquid', 'data-nav-tone=', 'missing header tone metadata');
requireText('sections/product-specifications.liquid', '{% schema %}', 'missing section schema');
requireText('sections/product-specifications.liquid', 'data-nav-tone=', 'missing header tone metadata');
requireText('sections/shoppable-lookbook.liquid', '{% schema %}', 'missing section schema');
requireText('sections/shoppable-lookbook.liquid', 'data-nav-tone=', 'missing header tone metadata');
requireText('layout/theme.liquid', '<meta charset="utf-8">', 'missing character encoding');
requireText('layout/theme.liquid', 'name="viewport"', 'missing responsive viewport');

if (failures.length) {
  console.error('Modeframe release validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Modeframe ${packageMetadata.version} release structure passed: one install preset, three art directions, and required Theme Store sections.`);
}
