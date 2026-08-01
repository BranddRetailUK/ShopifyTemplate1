# Modeframe — modern editorial Shopify theme

Modeframe is a Shopify Online Store 2.0 theme for fashion, lifestyle, design,
art, product, and creative retail brands. It combines oversized editorial type,
high-contrast merchandising, modular layouts, flexible global styles, and
reduced-motion-safe visual accents with Shopify's native commerce features.

## Theme highlights

- Six storefront-wide visual modes: Paper, Ink, Signal, Electric, All light,
  and All dark.
- Six desktop header compositions, nested navigation, predictive search,
  localization, customer accounts, and drawer or page carts.
- Product media, variants, swatches, quantity rules, selling plans, pickup,
  unit pricing, gift-card recipients, accelerated checkout, and recommendations.
- Collection filtering, sorting, pagination, quick add, mixed search, and
  responsive merchandising grids.
- Hero, slideshow, scrolling text, Scroll Bridge, Motion Accents, editorial,
  merchandising, social proof, video, FAQ, newsletter, and Custom Liquid
  sections.
- Responsive Shopify CDN images, native forms, accessible controls, visible
  focus, progressive enhancement, and reduced-motion support.

## Repository structure

The uploadable Shopify theme lives in `assets`, `blocks`, `config`, `layout`,
`locales`, `sections`, `snippets`, and `templates`. Marketplace documentation,
licensing, QA, and listing assets live outside those folders and are excluded
from Shopify theme uploads.

The companion purchase-code service lives in `services/license-api`. It is
deployed separately and is never part of, or required by, the storefront.

## Setup

```bash
npm install
npm run verify
npm run theme:dev
```

Use a local, ignored `shopify.theme.toml` for store and theme identifiers. Never
commit credentials, merchant data, Shopify CLI state, or a store-specific
`settings_data.json` pulled from a live merchant theme.

## Browser QA

Copy `.env.example` to `.env.qa`, populate the dedicated QA store values, then
run:

```bash
npm run qa:browser
```

The browser suite covers core rendering, search, mobile-menu Escape behaviour,
a configured product add-to-cart path, page exceptions, and serious automated
accessibility rules in desktop/mobile Chromium. Manual browser/device,
screen-reader, checkout, market, editor, and special-product cases remain in
`docs/qa-matrix.md`.

## Marketplace bundle

```bash
npm run bundle
npm run bundle:check
```

The build creates:

- `release/Modeframe-1.0.0-theme.zip` — the Shopify-uploadable theme.
- `release/Modeframe-1.0.0-marketplace.zip` — the buyer-facing sales bundle.
- `release/SHA256SUMS.txt` — archive checksums.

The outer sales bundle contains the installable theme, English HTML
documentation, quick start, FAQ, support policy, licensing, asset credits,
release notes, and checksum.

## Purchase activation

The buyer activation service is available at
<https://modeframe-licensing-production.up.railway.app>. It verifies a
marketplace sale on the server and binds a keyed purchase-code fingerprint to
one permanent Shopify domain. Activation controls support and future update
eligibility only; it never disables the installed theme. See
`docs/licensing-architecture.md` for its security and policy model.

## Distribution

Modeframe is prepared for independent and third-party marketplace distribution.
It is not a Shopify Theme Store submission and makes no claim of Shopify review
or approval. The chosen marketplace's seller, tax, refund, licensing, preview,
support, and review requirements remain authoritative.

See `contract.md` for the current product contract and
`docs/marketplace-readiness.md` for the launch gate. The first-package fit is
tracked in `docs/third-party-platform-fit.md`; the future Shopify Theme Store
delta is tracked in `docs/shopify-theme-store-compatibility.md` because its
exclusivity rule conflicts with simultaneous third-party distribution.
