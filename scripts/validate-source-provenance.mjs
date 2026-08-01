import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const themeDirectories = ['assets', 'blocks', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
const knownUpstreamHashes = new Map([
  ['95d263380273f90eff6c09267cc7eb51f44133508a0825ad4ed018d6c3032e22', 'Shopify Skeleton blocks/group.liquid'],
  ['7951b76004866f02ba54254c9e724525138585547ef4604261788718ca864c29', 'Shopify Skeleton blocks/text.liquid'],
  ['833318f602042d141ea077616cfe624f8cdf09870be5bc8475372a9295da8b6a', 'Shopify Skeleton snippets/meta-tags.liquid'],
  ['357f82b257fa9416f64a43458f7ccefc572f057a173d4b228aed36532d3f146a', 'Shopify Skeleton snippets/image.liquid'],
  ['e88235ae46784684888c11cbe3a07e9021258f32e3a5984291b8355569a7f17f', 'Shopify Skeleton locales/en.default.schema.json'],
  ['8895b78ac63de01375aa818b89895adf2545237ca779984318da8e4be20d6c69', 'Shopify Skeleton assets/icon-account.svg'],
]);
const bannedSourcePhrases = [
  /shopify\/skeleton-theme/i,
  /a4f32d393b9eadf6c4403318ca39116832e5d1df/i,
  /Skeleton Theme/i,
];
const failures = [];

function filesBelow(directory) {
  const absolute = path.join(root, directory);
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(relative) : [relative];
  });
}

for (const relativePath of themeDirectories.flatMap(filesBelow)) {
  const buffer = fs.readFileSync(path.join(root, relativePath));
  const digest = crypto.createHash('sha256').update(buffer).digest('hex');
  if (knownUpstreamHashes.has(digest)) {
    failures.push(`${relativePath} is byte-identical to ${knownUpstreamHashes.get(digest)}.`);
  }
  if (/\.(css|js|json|liquid|svg|txt|md)$/i.test(relativePath)) {
    const source = buffer.toString('utf8');
    for (const phrase of bannedSourcePhrases) {
      if (phrase.test(source)) failures.push(`${relativePath} contains a retired upstream provenance reference.`);
    }
  }
}

if (failures.length) {
  console.error('Source provenance validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Source provenance checks passed for ${themeDirectories.flatMap(filesBelow).length} theme files.`);
  console.log('This technical comparison is evidence for review; it is not a legal opinion or trademark clearance.');
}
