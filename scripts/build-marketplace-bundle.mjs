import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const releaseDirectory = path.join(root, 'release');
const themeArchive = 'Modeframe-1.0.0-theme.zip';
const marketplaceArchive = 'Modeframe-1.0.0-marketplace.zip';
const cliArchive = path.join(root, 'Modeframe-1.0.0.zip');
const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'modeframe-bundle-'));

function copy(source, destination) {
  const target = path.join(staging, destination);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, source), target);
}

try {
  fs.mkdirSync(releaseDirectory, { recursive: true });
  execFileSync('shopify', ['theme', 'package', '--path', root, '--no-color'], { stdio: 'inherit' });
  if (!fs.existsSync(cliArchive)) throw new Error(`Shopify CLI did not create ${path.basename(cliArchive)}.`);

  const finalThemeArchive = path.join(releaseDirectory, themeArchive);
  fs.rmSync(finalThemeArchive, { force: true });
  fs.renameSync(cliArchive, finalThemeArchive);

  fs.mkdirSync(path.join(staging, 'Theme'), { recursive: true });
  fs.copyFileSync(finalThemeArchive, path.join(staging, 'Theme', themeArchive));
  copy('docs/documentation.html', 'Documentation/index.html');
  copy('docs/merchant-guide.md', 'Documentation/merchant-guide.md');
  copy('docs/faq.md', 'Documentation/FAQ.md');
  copy('docs/support-policy.md', 'Documentation/support-policy.md');
  copy('distribution/MARKETPLACE-LICENSE.txt', 'Licensing/MARKETPLACE-LICENSE.txt');
  copy('distribution/ASSET-CREDITS.txt', 'Licensing/ASSET-CREDITS.txt');
  copy('distribution/README.txt', 'README.txt');
  copy('distribution/QUICK-START.txt', 'QUICK-START.txt');
  copy('distribution/ACTIVATE-LICENSE.txt', 'ACTIVATE-LICENSE.txt');
  copy('RELEASE_NOTES.md', 'RELEASE-NOTES.md');

  const themeDigest = crypto.createHash('sha256').update(fs.readFileSync(finalThemeArchive)).digest('hex');
  fs.writeFileSync(path.join(staging, 'SHA256SUMS.txt'), `${themeDigest}  Theme/${themeArchive}\n`);

  const finalMarketplaceArchive = path.join(releaseDirectory, marketplaceArchive);
  fs.rmSync(finalMarketplaceArchive, { force: true });
  execFileSync('zip', ['-q', '-r', finalMarketplaceArchive, '.'], { cwd: staging });
  const marketplaceDigest = crypto.createHash('sha256').update(fs.readFileSync(finalMarketplaceArchive)).digest('hex');
  fs.writeFileSync(
    path.join(releaseDirectory, 'SHA256SUMS.txt'),
    `${themeDigest}  ${themeArchive}\n${marketplaceDigest}  ${marketplaceArchive}\n`,
  );

  console.log(`Built release/${themeArchive}`);
  console.log(`Built release/${marketplaceArchive}`);
  console.log('Wrote release/SHA256SUMS.txt');
} finally {
  fs.rmSync(staging, { recursive: true, force: true });
}
