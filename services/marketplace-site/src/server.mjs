import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const serviceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(serviceRoot, 'public');
const port = Number.parseInt(process.env.PORT || '3000', 10);

const routes = new Map([
  ['/', 'index.html'],
  ['/documentation', 'documentation.html'],
  ['/support', 'support.html'],
  ['/privacy', 'privacy.html'],
  ['/refunds', 'refunds.html'],
]);

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
]);

function normalizePublicUrl(value, fallback) {
  try {
    const url = new URL(value || fallback);
    if (url.protocol !== 'https:') throw new Error('HTTPS is required.');
    return url.toString();
  } catch {
    return fallback;
  }
}

const siteConfig = {
  demoStoreUrl: normalizePublicUrl(process.env.DEMO_STORE_URL, 'https://example.myshopify.com/'),
  demoStorePassword: String(process.env.DEMO_STORE_PASSWORD || '').trim(),
  licenseUrl: normalizePublicUrl(
    process.env.LICENSE_ACTIVATION_URL,
    'https://modeframe-licensing-production.up.railway.app/',
  ),
  supportUrl: normalizePublicUrl(process.env.SUPPORT_URL, 'https://brandd.co.uk/contact'),
  version: '1.0.0',
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function render(source, requestUrl) {
  const elementsMode = requestUrl.searchParams.get('storefront') === 'envato-elements';
  const demoPasswordBlock = siteConfig.demoStorePassword
    ? `<p class="demo-credential" data-market-only>Demo password: <code>${escapeHtml(siteConfig.demoStorePassword)}</code></p>`
    : '';
  return source
    .replaceAll('{{DEMO_STORE_URL}}', escapeHtml(siteConfig.demoStoreUrl))
    .replaceAll('{{DEMO_PASSWORD_BLOCK}}', demoPasswordBlock)
    .replaceAll('{{LICENSE_URL}}', escapeHtml(siteConfig.licenseUrl))
    .replaceAll('{{SUPPORT_URL}}', escapeHtml(siteConfig.supportUrl))
    .replaceAll('{{THEME_VERSION}}', siteConfig.version)
    .replaceAll('{{ELEMENTS_CLASS}}', elementsMode ? 'is-elements' : '');
}

function securityHeaders(contentType) {
  return {
    'Cache-Control': contentType.startsWith('text/html') ? 'public, max-age=300' : 'public, max-age=86400, immutable',
    'Content-Security-Policy': [
      "default-src 'self'",
      "base-uri 'none'",
      "connect-src 'self'",
      "font-src 'self'",
      "form-action 'self'",
      "frame-ancestors https://themeforest.net https://*.themeforest.net https://envato.com https://*.envato.com",
      "img-src 'self' data:",
      "object-src 'none'",
      "script-src 'self'",
      "style-src 'self'",
      'upgrade-insecure-requests',
    ].join('; '),
    'Content-Type': contentType,
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), payment=()',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
  };
}

function sendFile(response, filePath, requestUrl, status = 200) {
  const resolved = path.resolve(publicRoot, filePath);
  if (!resolved.startsWith(`${publicRoot}${path.sep}`) || !fs.existsSync(resolved)) return false;
  const contentType = mimeTypes.get(path.extname(resolved).toLowerCase()) || 'application/octet-stream';
  const source = fs.readFileSync(resolved);
  const body = contentType.startsWith('text/html') ? render(source.toString('utf8'), requestUrl) : source;
  response.writeHead(status, securityHeaders(contentType));
  response.end(body);
  return true;
}

export function createServer() {
  return http.createServer((request, response) => {
    const requestUrl = new URL(request.url || '/', 'http://service.invalid');

    if (request.method === 'GET' && requestUrl.pathname === '/health') {
      response.writeHead(200, {
        ...securityHeaders('application/json; charset=utf-8'),
        'Cache-Control': 'no-store',
      });
      response.end(`${JSON.stringify({ status: 'ok', service: 'modeframe-marketplace-site' })}\n`);
      return;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { ...securityHeaders('text/plain; charset=utf-8'), Allow: 'GET, HEAD' });
      response.end('Method not allowed.\n');
      return;
    }

    const route = routes.get(requestUrl.pathname);
    const asset = requestUrl.pathname.startsWith('/assets/')
      ? requestUrl.pathname.slice(1)
      : null;
    const served = route
      ? sendFile(response, route, requestUrl)
      : asset
        ? sendFile(response, asset, requestUrl)
        : false;

    if (!served) sendFile(response, '404.html', requestUrl, 404);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createServer().listen(port, '0.0.0.0', () => {
    console.log(`Modeframe marketplace site listening on port ${port}`);
  });
}
