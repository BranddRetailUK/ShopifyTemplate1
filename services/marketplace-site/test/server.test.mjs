import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from '../src/server.mjs';

let server;
let baseUrl;

before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('serves every public launch route', async () => {
  for (const route of ['/', '/documentation', '/support', '/privacy', '/refunds', '/health']) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200, route);
  }
});

test('allows supported marketplace framing without X-Frame-Options', async () => {
  const response = await fetch(baseUrl);
  assert.match(response.headers.get('content-security-policy'), /frame-ancestors[^;]*themeforest\.net/);
  assert.match(response.headers.get('content-security-policy'), /frame-ancestors[^;]*creativemarket\.com/);
  assert.equal(response.headers.get('x-frame-options'), null);
});

test('renders environment-backed links and Elements mode', async () => {
  const response = await fetch(`${baseUrl}/?storefront=envato-elements`);
  const body = await response.text();
  assert.match(body, /class="is-elements"/);
  assert.doesNotMatch(body, /\{\{[A-Z_]+\}\}/);
});

test('returns a real 404 and rejects mutation methods', async () => {
  assert.equal((await fetch(`${baseUrl}/missing`)).status, 404);
  assert.equal((await fetch(baseUrl, { method: 'POST' })).status, 405);
});
