# Modeframe purchase-code licensing architecture

Modeframe uses server-side purchase verification for support and update
entitlements. It does not use client-side DRM and it never makes a merchant's
storefront availability depend on the licensing service.

## Why the check is server-side

A Shopify theme is delivered as editable Liquid, JSON, CSS, and JavaScript.
Any purchase code, Envato bearer token, validation result, or blocking
logic placed in the theme can be copied, removed, or forged. A client-side gate
would expose credentials without reliably preventing redistribution.

The companion service at
<https://modeframe-licensing-production.up.railway.app> therefore performs the
verification away from Shopify. Its Envato token and database credentials live
only in Railway variables and never enter the theme ZIP.

## Activation model

1. The buyer downloads Modeframe from ThemeForest and receives an Envato
   purchase code.
2. After installing the theme, the buyer opens the activation URL supplied in
   the package.
3. The buyer enters the purchase code and the store's permanent
   `*.myshopify.com` domain. A custom storefront domain is not accepted because
   it can change while the permanent Shopify domain remains stable.
4. The service verifies the code with Envato's author-sale API and confirms
   that the sale belongs to the configured Modeframe item.
5. The service stores a keyed HMAC fingerprint of the purchase code, never the
   plaintext code, and binds it to one Shopify domain.

The same activation covers live and unpublished Modeframe themes on that one
Shopify store. A second store requires a second license unless the controlling
Envato license says otherwise. Domain transfers are manually reviewed so
a copied code cannot evict the legitimate merchant through self-service.

## What activation controls

- Eligibility for standard support
- Access to future managed update downloads or update notifications
- Any future hosted import service that Envato permits

The theme's editor, storefront, product, cart, and checkout handoff are not
keygated. A Railway or Envato outage cannot take a buyer's store offline.
The Envato license and terms remain the legal control on redistribution;
technical activation cannot prevent a buyer from copying editable source.

## Service controls

- Dedicated Railway project and private PostgreSQL database
- One active permanent Shopify domain per purchase fingerprint
- Exact Envato item-ID match before activation
- Per-address and per-code rate limits stored in PostgreSQL
- No request-body or purchase-code logging
- Strict response security headers and small request-body limits
- Envato timeouts, invalid-code handling, and `Retry-After` propagation
- Health endpoint separated from Envato activation readiness
- Server-only secrets and no credentials in Git or the buyer bundle

## External configuration still required

Activation stays closed until the listing supplies both values below:

- `ENVATO_ITEM_ID` — the final ThemeForest item identifier
- `ENVATO_TOKEN` — a seller token permitted to verify the author's sales

Those values must be stored as sealed Railway variables. They must never be
placed in theme settings, JavaScript, documentation, screenshots, support
messages, or source control.

## Policy and operating basis

- Envato documents author-side purchase-code verification and requires API
  application credentials to remain secret: <https://build.envato.com/api/>
- Envato supplies the buyer's license certificate and purchase code through the
  purchase download area:
  <https://help.market.envato.com/hc/en-us/articles/202822600-Where-Is-My-Purchase-Code>
- Envato's licensing guidance treats a license as one end product and discusses
  test/staging use:
  <https://help.market.envato.com/hc/en-us/articles/115005597566-Licensing-Requirements-for-Test-Sites-Clarifications-and-Guidelines>
- Envato's explicit WordPress keygate rule is not a Shopify rule, but it is a
  useful anti-lock precedent: core theme functionality must not be withheld
  behind activation. Final ThemeForest reviewer confirmation is still required.

Qualified legal review must confirm the final buyer language, privacy notice,
retention period, refund/revocation handling, domain-transfer policy, and the
ThemeForest's rules before public sale.
