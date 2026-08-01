import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const releaseDirectory = path.join(root, 'release');
const themeArchiveName = 'Modeframe-1.0.0-theme.zip';
const marketplaceArchiveName = 'Modeframe-1.0.0-marketplace.zip';
const themeArchive = path.join(releaseDirectory, themeArchiveName);
const marketplaceArchive = path.join(releaseDirectory, marketplaceArchiveName);
const failures = [];

for (const archive of [themeArchive, marketplaceArchive]) {
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
    'Licensing/MARKETPLACE-LICENSE.txt',
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
  console.log('Modeframe marketplace bundle passed structure, isolation, embedding, and checksum checks.');
}
