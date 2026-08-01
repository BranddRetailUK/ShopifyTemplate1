import http from 'node:http';
import process from 'node:process';
import { activationConfigurationReady, loadConfig } from './config.mjs';
import {
  LicenseServiceError,
  fingerprint,
  normalizePurchaseCode,
  normalizeShopDomain,
  verifyEnvatoSale,
} from './license.mjs';
import {
  activateLicense,
  consumeRateLimit,
  createDatabase,
  initializeDatabase,
  pingDatabase,
} from './db.mjs';

const config = loadConfig();
const database = createDatabase(config.databaseUrl);

function securityHeaders(contentType) {
  return {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
}

function sendJson(response, status, body, extraHeaders = {}) {
  response.writeHead(status, { ...securityHeaders('application/json; charset=utf-8'), ...extraHeaders });
  response.end(`${JSON.stringify(body)}\n`);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function page({ title, message = '', status = 200, form = false }) {
  const messageMarkup = message ? `<p class="notice">${escapeHtml(message)}</p>` : '';
  const formMarkup = form ? `
    <form method="post" action="/activate">
      <label for="shop_domain">Permanent Shopify domain</label>
      <input id="shop_domain" name="shop_domain" type="text" inputmode="url" autocomplete="url" placeholder="your-store.myshopify.com" required>
      <p class="hint">Use the permanent <strong>myshopify.com</strong> domain, not a custom storefront domain.</p>
      <label for="purchase_code">Envato purchase code</label>
      <input id="purchase_code" name="purchase_code" type="text" autocomplete="off" spellcheck="false" required>
      <input name="theme_version" type="hidden" value="1.0.0">
      <button type="submit">Activate Modeframe</button>
    </form>` : '';
  return {
    status,
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)} · Modeframe</title>
  <style>
    :root { color-scheme: light; font-family: ui-sans-serif, system-ui, sans-serif; background: #f6f4ef; color: #111; }
    body { margin: 0; }
    main { width: min(42rem, calc(100% - 2rem)); margin: 8vh auto; }
    h1 { font-size: clamp(2.5rem, 8vw, 5.5rem); letter-spacing: -.06em; line-height: .9; }
    p { line-height: 1.6; }
    form { display: grid; gap: .75rem; margin-top: 2.5rem; padding: clamp(1rem, 4vw, 2rem); background: #fff; border: 1px solid #111; }
    label { margin-top: .5rem; font-weight: 750; }
    input, button { min-height: 3rem; padding: .65rem .8rem; border: 1px solid #111; border-radius: .35rem; font: inherit; }
    button { margin-top: .75rem; background: #111; color: #fff; font-weight: 750; cursor: pointer; }
    .eyebrow { font-size: .75rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
    .hint { margin: -.3rem 0 .5rem; color: #454545; font-size: .9rem; }
    .notice { border-left: .3rem solid #6838ff; padding: .75rem 1rem; background: #fff; }
  </style>
</head>
<body>
  <main>
    <p class="eyebrow">Brandd · License activation</p>
    <h1>${escapeHtml(title)}</h1>
    ${messageMarkup}
    ${formMarkup}
    <p>Activation binds one ThemeForest purchase to one Shopify store. It controls access to support and future update services; it never disables a buyer’s storefront.</p>
  </main>
</body>
</html>`,
  };
}

function sendPage(response, result) {
  response.writeHead(result.status, securityHeaders('text/html; charset=utf-8'));
  response.end(result.html);
}

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > config.requestBodyLimit) {
      throw new LicenseServiceError('The request is too large.', { status: 413, code: 'request_too_large' });
    }
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  const contentType = String(request.headers['content-type'] || '').split(';')[0];
  if (contentType === 'application/json') {
    try {
      return JSON.parse(text || '{}');
    } catch {
      throw new LicenseServiceError('The request body is not valid JSON.', { status: 400, code: 'invalid_json' });
    }
  }
  if (contentType === 'application/x-www-form-urlencoded') {
    return Object.fromEntries(new URLSearchParams(text));
  }
  throw new LicenseServiceError('Use JSON or a form-encoded request.', { status: 415, code: 'unsupported_media_type' });
}

function clientAddress(request) {
  const forwarded = String(request.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || request.socket.remoteAddress || 'unknown';
}

async function activationRequest(request) {
  if (!activationConfigurationReady(config)) {
    throw new LicenseServiceError('License activation is not available until the ThemeForest item is configured.', {
      status: 503,
      code: 'activation_not_configured',
    });
  }

  const body = await readBody(request);
  const purchaseCode = normalizePurchaseCode(body.purchase_code);
  const shopDomain = normalizeShopDomain(body.shop_domain);
  const themeVersion = String(body.theme_version || '1.0.0').trim();
  if (!config.allowedThemeVersions.has(themeVersion)) {
    throw new LicenseServiceError('This Modeframe version is not supported by the activation service.', {
      status: 400,
      code: 'unsupported_theme_version',
    });
  }

  const purchaseFingerprint = fingerprint(config.hashSecret, 'purchase-code', purchaseCode);
  const addressFingerprint = fingerprint(config.hashSecret, 'client-address', clientAddress(request));
  const windowStartedAt = new Date(
    Math.floor(Date.now() / config.rateLimitWindowMs) * config.rateLimitWindowMs,
  );
  const [addressAllowed, codeAllowed] = await Promise.all([
    consumeRateLimit(database, {
      scopeFingerprint: addressFingerprint,
      windowStartedAt,
      limit: config.rateLimit,
    }),
    consumeRateLimit(database, {
      scopeFingerprint: purchaseFingerprint,
      windowStartedAt,
      limit: Math.max(4, Math.floor(config.rateLimit / 2)),
    }),
  ]);
  if (!addressAllowed || !codeAllowed) {
    throw new LicenseServiceError('Too many activation attempts. Try again later.', {
      status: 429,
      code: 'rate_limited',
      retryAfter: String(Math.ceil(config.rateLimitWindowMs / 1000)),
    });
  }

  const sale = await verifyEnvatoSale({
    purchaseCode,
    token: config.envatoToken,
    itemId: config.envatoItemId,
  });
  if (!sale.valid) {
    throw new LicenseServiceError('That purchase code is not valid for Modeframe.', {
      status: 422,
      code: 'purchase_not_verified',
    });
  }

  const result = await activateLicense(database, {
    purchaseFingerprint,
    itemId: sale.itemId,
    shopDomain,
    themeVersion,
    licenseName: sale.license,
    soldAt: sale.soldAt,
    supportedUntil: sale.supportedUntil,
  });
  if (result.state === 'domain_conflict') {
    throw new LicenseServiceError('This purchase is already active on another store. Contact support for a reviewed transfer.', {
      status: 409,
      code: 'already_activated_elsewhere',
    });
  }
  return { state: result.state, shopDomain, themeVersion };
}

await initializeDatabase(database);

const server = http.createServer(async (request, response) => {
  const startedAt = Date.now();
  const requestUrl = new URL(request.url || '/', 'http://service.invalid');
  try {
    if (request.method === 'GET' && requestUrl.pathname === '/') {
      sendPage(response, page({
        title: 'Activate Modeframe',
        message: activationConfigurationReady(config)
          ? 'Enter the Envato purchase code supplied with Modeframe after installation.'
          : 'Activation will open after the ThemeForest item identifier is issued.',
        form: activationConfigurationReady(config),
      }));
      return;
    }

    if (request.method === 'GET' && requestUrl.pathname === '/health') {
      await pingDatabase(database);
      sendJson(response, 200, {
        status: 'ok',
        activation_ready: activationConfigurationReady(config),
      });
      return;
    }

    if (request.method === 'GET' && requestUrl.pathname === '/ready') {
      await pingDatabase(database);
      const ready = activationConfigurationReady(config);
      sendJson(response, ready ? 200 : 503, { status: ready ? 'ready' : 'configuration_required' });
      return;
    }

    if (request.method === 'POST' && (requestUrl.pathname === '/activate' || requestUrl.pathname === '/v1/activations')) {
      const result = await activationRequest(request);
      if (requestUrl.pathname === '/activate') {
        sendPage(response, page({
          title: 'Activation complete',
          message: `Modeframe ${result.themeVersion} is active for ${result.shopDomain}.`,
          status: result.state === 'activated' ? 201 : 200,
        }));
      } else {
        sendJson(response, result.state === 'activated' ? 201 : 200, {
          status: result.state,
          shop_domain: result.shopDomain,
          theme_version: result.themeVersion,
        });
      }
      return;
    }

    sendJson(response, 404, { error: 'not_found' });
  } catch (error) {
    const known = error instanceof LicenseServiceError;
    const status = known ? error.status : 500;
    const code = known ? error.code : 'internal_error';
    const headers = known && error.retryAfter ? { 'Retry-After': error.retryAfter } : {};
    if (requestUrl.pathname === '/activate') {
      sendPage(response, page({
        title: 'Activation not completed',
        message: known ? error.message : 'The activation service encountered an unexpected error.',
        status,
        form: status < 500,
      }));
    } else {
      sendJson(response, status, { error: code }, headers);
    }
    if (!known) console.error('license-service request failed', { path: requestUrl.pathname, status });
  } finally {
    console.log('license-service request', {
      method: request.method,
      path: requestUrl.pathname,
      status: response.statusCode,
      duration_ms: Date.now() - startedAt,
    });
  }
});

server.listen(config.port, '0.0.0.0', () => {
  console.log(`Modeframe license service listening on port ${config.port}`);
});

async function shutdown(signal) {
  console.log(`Received ${signal}; shutting down.`);
  server.close(async () => {
    await database.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
