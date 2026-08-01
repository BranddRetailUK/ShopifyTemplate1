import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const scanRoots = ['assets', 'blocks', 'config', 'distribution', 'docs', 'layout', 'locales', 'sections', 'snippets', 'templates'];
const failures = [];
const secretPatterns = [
  /shpat_[a-z0-9]{20,}/i,
  /shp(at|ca|pa|ss)_[a-z0-9]{20,}/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:api[_-]?secret|access[_-]?token|storefront[_-]?password)\s*[:=]\s*["'][^"']{8,}["']/i,
];

function filesBelow(directory) {
  const absolute = path.join(root, directory);
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(relative) : [relative];
  });
}

for (const relativePath of scanRoots.flatMap(filesBelow)) {
  if (!/\.(css|html|js|json|liquid|md|svg|txt)$/i.test(relativePath)) continue;
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  for (const pattern of secretPatterns) {
    if (pattern.test(source)) failures.push(`${relativePath} appears to contain a secret or private key.`);
  }
  if (relativePath.endsWith('.json')) {
    try {
      JSON.parse(source.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
    } catch (error) {
      failures.push(`${relativePath} is not valid theme JSON: ${error.message}`);
    }
  }
}

for (const section of ['hero', 'slideshow', 'scroll-bridge', 'motion-accents', 'collection', 'product']) {
  const source = fs.readFileSync(path.join(root, 'sections', `${section}.liquid`), 'utf8');
  if (!source.includes('data-nav-tone')) failures.push(`sections/${section}.liquid is missing data-nav-tone metadata.`);
}

const forbiddenRepositoryEntries = ['app', 'components', 'lib', 'middleware.ts', 'next.config.ts', 'next-env.d.ts', 'railway.json', 'tsconfig.json'];
for (const entry of forbiddenRepositoryEntries) {
  if (fs.existsSync(path.join(root, entry))) failures.push(`Retired web-app entry remains: ${entry}`);
}

if (failures.length) {
  console.error('Static QA failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log('Static QA passed: theme JSON, identity, secret patterns, navigation-tone metadata, and retired-stack paths are clean.');
}
