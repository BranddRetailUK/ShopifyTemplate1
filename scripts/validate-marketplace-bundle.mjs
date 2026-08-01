import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const releaseDirectory = path.join(root, 'release');
const themeArchiveName = 'Modeframe-1.0.0-theme.zip';
const marketplaceArchiveName = 'Modeframe-1.0.0-themeforest.zip';
const previewArchiveName = 'Modeframe-1.0.0-themeforest-preview.zip';
const themeArchive = path.join(releaseDirectory, themeArchiveName);
const marketplaceArchive = path.join(releaseDirectory, marketplaceArchiveName);
const previewArchive = path.join(releaseDirectory, previewArchiveName);
const failures = [];

for (const archive of [themeArchive, marketplaceArchive, previewArchive]) {
  if (!fs.existsSync(archive)) failures.push(`Missing ${path.relative(root, archive)}. Run npm run bundle.`);
}

if (!failures.length) {
  const marketplaceEntries = execFileSync('unzip', ['-Z1', marketplaceArchive], { encoding: 'utf8' }).trim().split('\n');
  const required = [
    `Theme/${themeArchiveName}`,
    'Documentation/index.html',
    'Documentation/merchant-guide.md',
    'Documentation/FAQ.md',
    'Documentation/support-policy.md',
    'Licensing/ENVATO-LICENSE.txt',
    'Licensing/ASSET-CREDITS.txt',
    'README.txt',
    'QUICK-START.txt',
    'ACTIVATE-LICENSE.txt',
    'RELEASE-NOTES.md',
    'SHA256SUMS.txt',
  ];
  required.forEach((entry) => {
    if (!marketplaceEntries.includes(entry)) failures.push(`Marketplace archive is missing ${entry}.`);
  });
  const forbidden = marketplaceEntries.filter((entry) => /(?:^|\/)(?:\.env|node_modules|shopify\.theme\.toml|tests?|scripts?)(?:\/|$)/i.test(entry));
  if (forbidden.length) failures.push(`Marketplace archive contains development-only paths: ${forbidden.join(', ')}`);

  const previewEntries = execFileSync('unzip', ['-Z1', previewArchive], { encoding: 'utf8' }).trim().split('\n');
  const previewRequired = [
    'Listing/item-description.html',
    'Listing/submission-fields.md',
    'Listing/reviewer-notes.md',
    'Media/01-modeframe-cover-2340x1560.png',
    'Media/02-six-global-styles-1920x1080.png',
    'Media/03-commerce-layouts-1920x1080.png',
    'Media/04-section-system-1920x1080.png',
    'Media/05-home-desktop-1920x1080.png',
    'Media/06-collection-desktop-1920x1080.png',
    'Media/07-product-desktop-1920x1080.png',
    'Media/08-home-mobile-1080x1920.png',
    'Media/09-product-mobile-1080x1920.png',
    'Media/modeframe-preview-1920x1080.mp4',
    'Media/CAPTURE-MANIFEST.json',
  ];
  previewRequired.forEach((entry) => {
    if (!previewEntries.includes(entry)) failures.push(`ThemeForest preview archive is missing ${entry}.`);
  });
  const forbiddenPreview = previewEntries.filter((entry) => /(?:^|\/)(?:\.env|node_modules|purchase-code|token)(?:\/|$)/i.test(entry));
  if (forbiddenPreview.length) failures.push(`ThemeForest preview archive contains sensitive/development paths: ${forbiddenPreview.join(', ')}`);

  const themeEntries = execFileSync('unzip', ['-Z1', themeArchive], { encoding: 'utf8' }).trim().split('\n');
  const invalidThemeEntry = themeEntries.find((entry) => !/^(?:assets|blocks|config|layout|locales|sections|snippets|templates)\//.test(entry));
  if (invalidThemeEntry) failures.push(`Installable theme contains a non-theme entry: ${invalidThemeEntry}`);

  const extraction = fs.mkdtempSync(path.join(os.tmpdir(), 'modeframe-validate-'));
  try {
    execFileSync('unzip', ['-q', marketplaceArchive, '-d', extraction]);
    const embeddedTheme = path.join(extraction, 'Theme', themeArchiveName);
    const directHash = crypto.createHash('sha256').update(fs.readFileSync(themeArchive)).digest('hex');
    const embeddedHash = crypto.createHash('sha256').update(fs.readFileSync(embeddedTheme)).digest('hex');
    if (directHash !== embeddedHash) failures.push('Embedded theme archive does not match release theme archive.');
    const checksum = fs.readFileSync(path.join(extraction, 'SHA256SUMS.txt'), 'utf8');
    if (!checksum.includes(`${directHash}  Theme/${themeArchiveName}`)) failures.push('Embedded theme checksum is incorrect.');
  } finally {
    fs.rmSync(extraction, { recursive: true, force: true });
  }
}

if (failures.length) {
  console.error('Marketplace bundle validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log('Modeframe ThemeForest buyer and preview bundles passed structure, isolation, embedding, and checksum checks.');
}
