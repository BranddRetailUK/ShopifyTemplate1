import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from '@playwright/test';
import { launch as launchChrome } from 'chrome-launcher';
import lighthouse from 'lighthouse';

const root = process.cwd();
const baseUrl = new URL(process.env.MARKETPLACE_SITE_URL || 'https://modeframe-preview-production.up.railway.app');
const outputDirectory = path.join(root, 'qa-results', 'marketplace-lighthouse');
fs.mkdirSync(outputDirectory, { recursive: true });

const chrome = await launchChrome({
  chromePath: chromium.executablePath(),
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
});

const summaries = [];
const failures = [];

try {
  for (const [name, route] of [['preview', '/'], ['documentation', '/documentation'], ['support', '/support']]) {
    for (const formFactor of ['mobile', 'desktop']) {
      const desktop = formFactor === 'desktop';
      const result = await lighthouse(new URL(route, baseUrl).toString(), {
        port: chrome.port,
        output: ['html', 'json'],
        logLevel: 'warn',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor,
        screenEmulation: desktop
          ? { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }
          : { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
      });
      const [html, json] = result.report;
      const stem = `${name}-${formFactor}`;
      fs.writeFileSync(path.join(outputDirectory, `${stem}.html`), html);
      fs.writeFileSync(path.join(outputDirectory, `${stem}.json`), json);
      const categories = Object.fromEntries(
        Object.entries(result.lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
      );
      summaries.push({ route: name, formFactor, finalUrl: result.lhr.finalDisplayedUrl, categories });
      for (const category of ['accessibility', 'best-practices', 'seo']) {
        if (categories[category] < 90) failures.push(`${stem} ${category}: ${categories[category]} (minimum 90)`);
      }
    }
  }
  fs.writeFileSync(
    path.join(outputDirectory, 'summary.json'),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), results: summaries }, null, 2)}\n`,
  );
  console.log(JSON.stringify(summaries, null, 2));
  if (failures.length) throw new Error(`Marketplace Lighthouse thresholds failed:\n- ${failures.join('\n- ')}`);
} finally {
  await chrome.kill();
}
