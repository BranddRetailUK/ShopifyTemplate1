import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const releaseDirectory = path.join(root, 'release');
const allowedThemeRoots = new Set([
  'assets',
  'blocks',
  'config',
  'layout',
  'locales',
  'sections',
  'snippets',
  'templates',
]);
const requiredThemeEntries = [
  'config/settings_data.json',
  'config/settings_schema.json',
  'layout/theme.liquid',
  'sections/flexible-content.liquid',
  'sections/product-specifications.liquid',
  'sections/shoppable-lookbook.liquid',
  'templates/index.json',
  'templates/product.json',
];
const forbiddenDevelopmentSegments = new Set([
  '.git',
  '.github',
  '.shopify',
  '.cache',
  'coverage',
  'docs',
  'node_modules',
  'playwright-report',
  'release',
  'scripts',
  'test',
  'tests',
  'test-results',
]);

function parseThemeJson(contents) {
  return JSON.parse(contents.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
}

function loadReleaseIdentity() {
  const packageMetadata = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const settingsSchema = parseThemeJson(fs.readFileSync(path.join(root, 'config/settings_schema.json'), 'utf8'));
  const themeInfo = settingsSchema.find(({ name }) => name === 'theme_info');

  if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(packageMetadata.version || '')) {
    throw new Error('package.json must contain a valid semantic version.');
  }
  if (!themeInfo?.theme_name || /[\\/\0]/.test(themeInfo.theme_name)) {
    throw new Error('config/settings_schema.json must contain a safe theme name.');
  }
  if (themeInfo.theme_version !== packageMetadata.version) {
    throw new Error('Theme version must match package.json before packaging.');
  }

  const archiveStem = themeInfo.theme_name.trim().replace(/\s+/g, '-').replace(/[^0-9A-Za-z._-]/g, '');
  if (!archiveStem) throw new Error('Theme name cannot be converted to an archive name.');

  return {
    archiveName: `${archiveStem}-${packageMetadata.version}-theme.zip`,
    cliArchiveName: `${archiveStem}-${packageMetadata.version}.zip`,
    themeName: themeInfo.theme_name,
    version: packageMetadata.version,
  };
}

function listArchiveEntries(archivePath) {
  return execFileSync('unzip', ['-Z1', archivePath], { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean);
}

function assertInstallableThemeArchive(archivePath) {
  const entries = listArchiveEntries(archivePath);
  if (!entries.length) throw new Error('Shopify CLI created an empty archive.');
  if (new Set(entries).size !== entries.length) throw new Error('Theme archive contains duplicate paths.');

  for (const entry of entries) {
    const normalized = entry.endsWith('/') ? entry.slice(0, -1) : entry;
    const segments = normalized.split('/');
    const unsafePath = entry !== entry.trim()
      || entry.startsWith('/')
      || entry.includes('\\')
      || segments.some((segment) => !segment || segment === '.' || segment === '..');
    if (unsafePath) throw new Error(`Theme archive contains an unsafe path: ${entry}`);
    if (!allowedThemeRoots.has(segments[0])) {
      throw new Error(`Theme archive contains a non-theme path: ${entry}`);
    }
    if (segments.some((segment) => segment.startsWith('.') || forbiddenDevelopmentSegments.has(segment.toLowerCase()))) {
      throw new Error(`Theme archive contains a development-only path: ${entry}`);
    }
    if (/(?:^|\/)(?:\.env(?:\..*)?|\.ds_store|shopify\.theme\.toml|package(?:-lock)?\.json|.*\.(?:key|p12|pem|pfx))$/i.test(normalized)) {
      throw new Error(`Theme archive contains a sensitive or development-only file: ${entry}`);
    }
  }

  const archiveEntries = new Set(entries.map((entry) => (entry.endsWith('/') ? entry.slice(0, -1) : entry)));
  for (const requiredEntry of requiredThemeEntries) {
    if (!archiveEntries.has(requiredEntry)) {
      throw new Error(`Theme archive is missing ${requiredEntry}.`);
    }
  }
}

function cleanReleaseDirectory() {
  fs.mkdirSync(releaseDirectory, { recursive: true });
  for (const entry of fs.readdirSync(releaseDirectory)) {
    fs.rmSync(path.join(releaseDirectory, entry), { recursive: true, force: true });
  }
}

const identity = loadReleaseIdentity();
const cliArchive = path.join(root, identity.cliArchiveName);
const releaseArchive = path.join(releaseDirectory, identity.archiveName);

try {
  execFileSync(process.execPath, [path.join(root, 'scripts/validate-theme-release.mjs')], {
    cwd: root,
    stdio: 'inherit',
  });

  fs.rmSync(cliArchive, { force: true });
  execFileSync('shopify', ['theme', 'package', '--path', root, '--no-color'], {
    cwd: root,
    stdio: 'inherit',
  });
  if (!fs.existsSync(cliArchive)) {
    throw new Error(`Shopify CLI did not create ${identity.cliArchiveName}.`);
  }

  assertInstallableThemeArchive(cliArchive);
  cleanReleaseDirectory();
  fs.renameSync(cliArchive, releaseArchive);

  const digest = crypto.createHash('sha256').update(fs.readFileSync(releaseArchive)).digest('hex');
  fs.writeFileSync(path.join(releaseDirectory, 'SHA256SUMS.txt'), `${digest}  ${identity.archiveName}\n`);

  execFileSync(process.execPath, [path.join(root, 'scripts/validate-theme-store-bundle.mjs')], {
    cwd: root,
    stdio: 'inherit',
  });
  console.log(`Built release/${identity.archiveName} for ${identity.themeName} ${identity.version}.`);
} catch (error) {
  console.error(`Theme Store bundle build failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  fs.rmSync(cliArchive, { force: true });
}
