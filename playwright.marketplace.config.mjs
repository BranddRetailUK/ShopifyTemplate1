import process from 'node:process';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './marketplace-tests',
  outputDir: 'qa-results/marketplace-playwright',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  forbidOnly: true,
  retries: 1,
  reporter: [['list'], ['html', { outputFolder: 'qa-results/marketplace-playwright-report', open: 'never' }]],
  use: {
    baseURL: process.env.MARKETPLACE_SITE_URL || 'https://modeframe-preview-production.up.railway.app',
    bypassCSP: true,
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'desktop-firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'desktop-webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 15'] } },
  ],
});
