import assert from 'node:assert/strict';
import test from 'node:test';
import {
  LicenseServiceError,
  fingerprint,
  normalizePurchaseCode,
  normalizeShopDomain,
  verifyEnvatoSale,
} from '../src/license.mjs';

const purchaseCode = '86781236-23d0-4b3c-7dfa-c1c147e0dece';

test('normalizes marketplace purchase codes', () => {
  assert.equal(normalizePurchaseCode(`  ${purchaseCode.toUpperCase()}  `), purchaseCode);
  assert.throws(() => normalizePurchaseCode('shared-copy'), LicenseServiceError);
});

test('binds activations to permanent Shopify domains', () => {
  assert.equal(normalizeShopDomain('Example-Store.myshopify.com'), 'example-store.myshopify.com');
  assert.equal(normalizeShopDomain('https://example-store.myshopify.com/admin'), 'example-store.myshopify.com');
  assert.throws(() => normalizeShopDomain('shop.example.com'), /myshopify\.com/);
});

test('fingerprints sensitive values without returning the source value', () => {
  const result = fingerprint('a'.repeat(32), 'purchase-code', purchaseCode);
  assert.match(result, /^[0-9a-f]{64}$/);
  assert.ok(!result.includes(purchaseCode));
});

test('accepts an Envato sale only for the configured item', async () => {
  const fetchImpl = async () => new Response(JSON.stringify({
    item: { id: 12345, name: 'Modeframe' },
    license: 'Regular License',
    sold_at: '2026-08-01T00:00:00Z',
    supported_until: '2027-02-01T00:00:00Z',
  }), { status: 200, headers: { 'content-type': 'application/json' } });

  const sale = await verifyEnvatoSale({ purchaseCode, token: 'server-only', itemId: '12345', fetchImpl });
  assert.equal(sale.valid, true);
  assert.equal(sale.itemId, '12345');

  const mismatch = await verifyEnvatoSale({ purchaseCode, token: 'server-only', itemId: '99999', fetchImpl });
  assert.deepEqual(mismatch, { valid: false, reason: 'wrong_item' });
});

test('handles invalid and rate-limited marketplace responses', async () => {
  const notFound = await verifyEnvatoSale({
    purchaseCode,
    token: 'server-only',
    itemId: '12345',
    fetchImpl: async () => new Response('', { status: 404 }),
  });
  assert.deepEqual(notFound, { valid: false, reason: 'not_found' });

  await assert.rejects(
    verifyEnvatoSale({
      purchaseCode,
      token: 'server-only',
      itemId: '12345',
      fetchImpl: async () => new Response('', { status: 429, headers: { 'retry-after': '30' } }),
    }),
    (error) => error.code === 'verification_rate_limited' && error.retryAfter === '30',
  );
});
