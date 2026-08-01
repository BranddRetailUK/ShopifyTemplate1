# Modeframe license service

This Railway service verifies an Envato/ThemeForest purchase code on the server,
then binds its keyed fingerprint to one permanent `*.myshopify.com` domain in
PostgreSQL. Purchase codes and marketplace tokens are never stored in source or
returned by the API.

Activation protects support and future update services. It deliberately does
not disable a purchased storefront: Shopify theme source is buyer-visible, a
client-side lock is bypassable, and a remote outage must never take a merchant's
shop offline.

## Required Railway variables

- `DATABASE_URL` — private reference to the project's PostgreSQL service
- `LICENSE_HASH_SECRET` — at least 32 random characters, stored only in Railway
- `ENVATO_TOKEN` — seller personal token with permission to verify author sales
- `ENVATO_ITEM_ID` — the final ThemeForest item identifier for Modeframe
- `ALLOWED_THEME_VERSIONS` — comma-separated versions; defaults to `1.0.0`

The service can deploy before `ENVATO_TOKEN` and `ENVATO_ITEM_ID` exist. Its
`/health` endpoint remains healthy while `/ready` and activation report that
marketplace configuration is still required.

## Endpoints

- `GET /` — buyer activation form
- `POST /activate` — form activation
- `POST /v1/activations` — JSON activation using `purchase_code`, `shop_domain`,
  and `theme_version`
- `GET /health` — process/database health without secrets
- `GET /ready` — activation readiness

One code can be reused across unpublished themes on the same Shopify store. A
different permanent Shopify domain requires a separately purchased license or a
manual, reviewed transfer. Public self-service deactivation is intentionally
omitted so a copied purchase code cannot evict the legitimate store.
