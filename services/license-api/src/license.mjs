import crypto from 'node:crypto';

const PURCHASE_CODE_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SHOPIFY_DOMAIN_PATTERN = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/;

export class LicenseServiceError extends Error {
  constructor(message, { status = 500, code = 'internal_error', retryAfter = null } = {}) {
    super(message);
    this.name = 'LicenseServiceError';
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

export function normalizePurchaseCode(value) {
  const code = String(value || '').trim().toLowerCase();
  if (!PURCHASE_CODE_PATTERN.test(code)) {
    throw new LicenseServiceError('Enter a valid marketplace purchase code.', {
      status: 400,
      code: 'invalid_purchase_code',
    });
  }
  return code;
}

export function normalizeShopDomain(value) {
  const input = String(value || '').trim().toLowerCase();
  if (!input) {
    throw new LicenseServiceError('Enter the permanent myshopify.com domain for the licensed store.', {
      status: 400,
      code: 'invalid_shop_domain',
    });
  }

  let hostname;
  try {
    const url = new URL(input.includes('://') ? input : `https://${input}`);
    hostname = url.hostname.replace(/\.$/, '');
  } catch {
    throw new LicenseServiceError('Enter a valid myshopify.com domain.', {
      status: 400,
      code: 'invalid_shop_domain',
    });
  }

  if (!SHOPIFY_DOMAIN_PATTERN.test(hostname)) {
    throw new LicenseServiceError('Use the store’s permanent myshopify.com domain, not a custom storefront domain.', {
      status: 400,
      code: 'invalid_shop_domain',
    });
  }
  return hostname;
}

export function fingerprint(secret, namespace, value) {
  if (!secret || secret.length < 32) throw new Error('A strong fingerprint secret is required.');
  return crypto
    .createHmac('sha256', secret)
    .update(`${namespace}\0${value}`)
    .digest('hex');
}

export async function verifyEnvatoSale({ purchaseCode, token, itemId, fetchImpl = fetch }) {
  if (!token || !itemId) {
    throw new LicenseServiceError('Marketplace verification is not configured yet.', {
      status: 503,
      code: 'verification_not_configured',
    });
  }

  const url = new URL('https://api.envato.com/v3/market/author/sale');
  url.searchParams.set('code', purchaseCode);

  let response;
  try {
    response = await fetchImpl(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Modeframe-License-Service/1.0',
      },
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new LicenseServiceError('The marketplace verification service is temporarily unavailable.', {
      status: 503,
      code: 'verification_unavailable',
    });
  }

  if (response.status === 404) return { valid: false, reason: 'not_found' };
  if (response.status === 429) {
    throw new LicenseServiceError('Marketplace verification is rate limited. Try again shortly.', {
      status: 503,
      code: 'verification_rate_limited',
      retryAfter: response.headers.get('retry-after'),
    });
  }
  if (response.status === 401 || response.status === 403) {
    throw new LicenseServiceError('Marketplace verification is not configured correctly.', {
      status: 503,
      code: 'verification_misconfigured',
    });
  }
  if (!response.ok) {
    throw new LicenseServiceError('The marketplace verification service is temporarily unavailable.', {
      status: 503,
      code: 'verification_unavailable',
    });
  }

  let sale;
  try {
    sale = await response.json();
  } catch {
    throw new LicenseServiceError('The marketplace returned an unreadable verification response.', {
      status: 503,
      code: 'verification_unavailable',
    });
  }

  if (String(sale?.item?.id || '') !== String(itemId)) {
    return { valid: false, reason: 'wrong_item' };
  }

  return {
    valid: true,
    itemId: String(sale.item.id),
    license: String(sale.license || ''),
    soldAt: sale.sold_at || null,
    supportedUntil: sale.supported_until || null,
  };
}
