import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { defineConfig, devices } from '@playwright/test';

const qaEnvironment = path.join(process.cwd(), '.env.qa');
if (fs.existsSync(qaEnvironment)) {
  for (const line of fs.readFileSync(qaEnvironment, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, '$2');
  }
}

if (!process.env.QA_BASE_URL) {
  throw new Error('QA_BASE_URL is required. Copy .env.example to the ignored .env.qa and target the exact packaged-theme preview.');
}

if (process.env.CI && (!process.env.QA_PRODUCT_PATH || !process.env.QA_COLLECTION_PATH)) {
  throw new Error('CI platform QA requires QA_PRODUCT_PATH and QA_COLLECTION_PATH repository variables.');
}

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: process.env.QA_BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
});
