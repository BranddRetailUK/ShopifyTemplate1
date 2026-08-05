import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const releaseDirectory = path.join(root, 'release');
const checksumName = 'SHA256SUMS.txt';
const failures = [];
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
    throw new Error('Theme version must match package.json.');
  }

  const archiveStem = themeInfo.theme_name.trim().replace(/\s+/g, '-').replace(/[^0-9A-Za-z._-]/g, '');
  if (!archiveStem) throw new Error('Theme name cannot be converted to an archive name.');

  return {
    archiveName: `${archiveStem}-${packageMetadata.version}-theme.zip`,
    themeName: themeInfo.theme_name,
    version: packageMetadata.version,
  };
}

function validateArchivePaths(archivePath) {
  const entries = execFileSync('unzip', ['-Z1', archivePath], { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean);

  if (!entries.length) failures.push('Installable theme archive is empty.');
  if (new Set(entries).size !== entries.length) failures.push('Installable theme archive contains duplicate paths.');

  for (const entry of entries) {
    const normalized = entry.endsWith('/') ? entry.slice(0, -1) : entry;
    const segments = normalized.split('/');
    const unsafePath = entry !== entry.trim()
      || entry.startsWith('/')
      || entry.includes('\\')
      || segments.some((segment) => !segment || segment === '.' || segment === '..');
    if (unsafePath) {
      failures.push(`Installable theme archive contains an unsafe path: ${entry}`);
      continue;
    }
    if (!allowedThemeRoots.has(segments[0])) {
      failures.push(`Installable theme archive contains a non-theme path: ${entry}`);
    }
    if (segments.some((segment) => segment.startsWith('.') || forbiddenDevelopmentSegments.has(segment.toLowerCase()))) {
      failures.push(`Installable theme archive contains a development-only path: ${entry}`);
    }
    if (/(?:^|\/)(?:\.env(?:\..*)?|\.ds_store|shopify\.theme\.toml|package(?:-lock)?\.json|.*\.(?:key|p12|pem|pfx))$/i.test(normalized)) {
      failures.push(`Installable theme archive contains a sensitive or development-only file: ${entry}`);
    }
  }

  const archiveEntries = new Set(entries.map((entry) => (entry.endsWith('/') ? entry.slice(0, -1) : entry)));
  for (const requiredEntry of requiredThemeEntries) {
    if (!archiveEntries.has(requiredEntry)) failures.push(`Installable theme archive is missing ${requiredEntry}.`);
  }
}

try {
  const identity = loadReleaseIdentity();
  const archivePath = path.join(releaseDirectory, identity.archiveName);
  const checksumPath = path.join(releaseDirectory, checksumName);

  if (!fs.existsSync(releaseDirectory)) {
    failures.push('Missing release directory. Run npm run bundle.');
  } else {
    const expectedReleaseEntries = new Set([identity.archiveName, checksumName]);
    for (const entry of fs.readdirSync(releaseDirectory, { withFileTypes: true })) {
      if (!expectedReleaseEntries.has(entry.name) || !entry.isFile()) {
        failures.push(`Unexpected release artifact: release/${entry.name}`);
      }
    }
  }

  if (!fs.existsSync(archivePath)) {
    failures.push(`Missing release/${identity.archiveName}. Run npm run bundle.`);
  }
  if (!fs.existsSync(checksumPath)) {
    failures.push(`Missing release/${checksumName}. Run npm run bundle.`);
  }

  if (fs.existsSync(archivePath)) {
    validateArchivePaths(archivePath);

    try {
      const archiveSettingsSchema = parseThemeJson(execFileSync(
        'unzip',
        ['-p', archivePath, 'config/settings_schema.json'],
        { encoding: 'utf8' },
      ));
      const archiveThemeInfo = archiveSettingsSchema.find(({ name }) => name === 'theme_info');
      if (archiveThemeInfo?.theme_name !== identity.themeName) {
        failures.push('Packaged theme name does not match the source theme identity.');
      }
      if (archiveThemeInfo?.theme_version !== identity.version) {
        failures.push('Packaged theme version does not match package.json.');
      }
    } catch (error) {
      failures.push(`Could not validate packaged theme metadata: ${error.message}`);
    }

    if (fs.existsSync(checksumPath)) {
      const digest = crypto.createHash('sha256').update(fs.readFileSync(archivePath)).digest('hex');
      const expectedChecksum = `${digest}  ${identity.archiveName}\n`;
      if (fs.readFileSync(checksumPath, 'utf8') !== expectedChecksum) {
        failures.push(`${checksumName} does not exactly match the installable theme archive.`);
      }
    }
  }

  if (failures.length) {
    console.error('Theme Store bundle validation failed:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
  } else {
    console.log(`Modeframe ${identity.version} Theme Store archive passed structure, isolation, identity, and checksum checks.`);
  }
} catch (error) {
  console.error(`Theme Store bundle validation failed: ${error.message}`);
  process.exitCode = 1;
}
