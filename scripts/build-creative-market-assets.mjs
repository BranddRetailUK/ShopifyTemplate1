import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const outputDirectory = path.join(root, 'marketing', 'creative-market');
const themeforestDirectory = path.join(root, 'marketing', 'themeforest');

fs.mkdirSync(outputDirectory, { recursive: true });

function render(input, output) {
  execFileSync('ffmpeg', [
    '-y',
    '-loglevel', 'error',
    '-i', input,
    '-vf', 'scale=1820:1214:force_original_aspect_ratio=decrease:flags=lanczos,pad=1820:1214:(ow-iw)/2:(oh-ih)/2:color=0xF6F2EB',
    '-frames:v', '1',
    output,
  ]);
}

const renders = [
  ['source/cover-imagegen.png', '01-modeframe-editorial-shopify-theme-1820x1214.png'],
  ['../themeforest/02-six-global-styles-1920x1080.png', '02-six-global-styles-1820x1214.png'],
  ['../themeforest/03-commerce-layouts-1920x1080.png', '03-commerce-layouts-1820x1214.png'],
  ['../themeforest/04-section-system-1920x1080.png', '04-flexible-section-system-1820x1214.png'],
  ['../themeforest/05-home-desktop-1920x1080.png', '05-live-home-1820x1214.png'],
  ['../themeforest/06-collection-desktop-1920x1080.png', '06-live-collection-1820x1214.png'],
  ['../themeforest/07-product-desktop-1920x1080.png', '07-live-product-1820x1214.png'],
];

for (const [input, output] of renders) {
  render(path.resolve(outputDirectory, input), path.join(outputDirectory, output));
}

execFileSync('ffmpeg', [
  '-y',
  '-loglevel', 'error',
  '-i', path.join(themeforestDirectory, '08-home-mobile-1080x1920.png'),
  '-i', path.join(themeforestDirectory, '09-product-mobile-1080x1920.png'),
  '-filter_complex',
  'color=c=0xF6F2EB:s=1820x1214[bg];[0:v]scale=-2:1040:flags=lanczos,pad=iw+16:ih+16:8:8:color=white[home];[1:v]scale=-2:1040:flags=lanczos,pad=iw+16:ih+16:8:8:color=white[product];[bg][home]overlay=220:79[first];[first][product]overlay=999:79',
  '-frames:v', '1',
  path.join(outputDirectory, '08-live-mobile-home-product-1820x1214.png'),
]);

const expected = fs.readdirSync(outputDirectory)
  .filter((file) => /-1820x1214\.png$/.test(file))
  .sort();

if (expected.length !== 8) {
  throw new Error(`Expected 8 Creative Market previews, found ${expected.length}.`);
}

console.log(`Built ${expected.length} Creative Market preview images at 1820x1214.`);
