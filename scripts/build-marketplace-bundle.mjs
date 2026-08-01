import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const releaseDirectory = path.join(root, 'release');
const themeArchive = 'Modeframe-1.0.0-theme.zip';
const themeforestArchive = 'Modeframe-1.0.0-themeforest.zip';
const previewArchive = 'Modeframe-1.0.0-themeforest-preview.zip';
const cliArchive = path.join(root, 'Modeframe-1.0.0.zip');
const buyerStaging = fs.mkdtempSync(path.join(os.tmpdir(), 'modeframe-buyer-'));
const previewStaging = fs.mkdtempSync(path.join(os.tmpdir(), 'modeframe-preview-'));

function copy(source, destination, staging = buyerStaging) {
  const target = path.join(staging, destination);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, source), target);
}

function copyDirectory(source, destination, staging) {
  const sourcePath = path.join(root, source);
  if (!fs.existsSync(sourcePath)) return;
  fs.cpSync(sourcePath, path.join(staging, destination), { recursive: true });
}

try {
  fs.mkdirSync(releaseDirectory, { recursive: true });
  execFileSync('shopify', ['theme', 'package', '--path', root, '--no-color'], { stdio: 'inherit' });
  if (!fs.existsSync(cliArchive)) throw new Error(`Shopify CLI did not create ${path.basename(cliArchive)}.`);

  const finalThemeArchive = path.join(releaseDirectory, themeArchive);
  fs.rmSync(finalThemeArchive, { force: true });
  fs.renameSync(cliArchive, finalThemeArchive);

  fs.mkdirSync(path.join(buyerStaging, 'Theme'), { recursive: true });
  fs.copyFileSync(finalThemeArchive, path.join(buyerStaging, 'Theme', themeArchive));
  copy('docs/documentation.html', 'Documentation/index.html');
  copy('docs/merchant-guide.md', 'Documentation/merchant-guide.md');
  copy('docs/faq.md', 'Documentation/FAQ.md');
  copy('docs/support-policy.md', 'Documentation/support-policy.md');
  copy('distribution/ENVATO-LICENSE.txt', 'Licensing/ENVATO-LICENSE.txt');
  copy('distribution/ASSET-CREDITS.txt', 'Licensing/ASSET-CREDITS.txt');
  copy('distribution/README.txt', 'README.txt');
  copy('distribution/QUICK-START.txt', 'QUICK-START.txt');
  copy('distribution/ACTIVATE-LICENSE.txt', 'ACTIVATE-LICENSE.txt');
  copy('RELEASE_NOTES.md', 'RELEASE-NOTES.md');

  const themeDigest = crypto.createHash('sha256').update(fs.readFileSync(finalThemeArchive)).digest('hex');
  fs.writeFileSync(path.join(buyerStaging, 'SHA256SUMS.txt'), `${themeDigest}  Theme/${themeArchive}\n`);

  const finalThemeforestArchive = path.join(releaseDirectory, themeforestArchive);
  fs.rmSync(finalThemeforestArchive, { force: true });
  fs.rmSync(path.join(releaseDirectory, 'Modeframe-1.0.0-marketplace.zip'), { force: true });
  execFileSync('zip', ['-q', '-r', finalThemeforestArchive, '.'], { cwd: buyerStaging });
  const themeforestDigest = crypto.createHash('sha256').update(fs.readFileSync(finalThemeforestArchive)).digest('hex');

  copy('themeforest/item-description.html', 'Listing/item-description.html', previewStaging);
  copy('themeforest/submission-fields.md', 'Listing/submission-fields.md', previewStaging);
  copy('themeforest/reviewer-notes.md', 'Listing/reviewer-notes.md', previewStaging);
  copy('marketing/ASSET-REGISTER.md', 'Media/ASSET-REGISTER.md', previewStaging);
  copyDirectory('marketing/themeforest', 'Media', previewStaging);

  const finalPreviewArchive = path.join(releaseDirectory, previewArchive);
  fs.rmSync(finalPreviewArchive, { force: true });
  execFileSync('zip', ['-q', '-r', finalPreviewArchive, '.'], { cwd: previewStaging });
  const previewDigest = crypto.createHash('sha256').update(fs.readFileSync(finalPreviewArchive)).digest('hex');
  fs.writeFileSync(
    path.join(releaseDirectory, 'SHA256SUMS.txt'),
    `${themeDigest}  ${themeArchive}\n${themeforestDigest}  ${themeforestArchive}\n${previewDigest}  ${previewArchive}\n`,
  );

  console.log(`Built release/${themeArchive}`);
  console.log(`Built release/${themeforestArchive}`);
  console.log(`Built release/${previewArchive}`);
  console.log('Wrote release/SHA256SUMS.txt');
} finally {
  fs.rmSync(buyerStaging, { recursive: true, force: true });
  fs.rmSync(previewStaging, { recursive: true, force: true });
}
