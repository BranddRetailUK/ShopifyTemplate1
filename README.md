# Modeframe — editorial commerce for Shopify

Modeframe 2.0 is a Shopify Online Store 2.0 theme for fashion, lifestyle,
design, art, and other visually led catalogues. The active product route is the
Shopify Theme Store. The theme combines a strong editorial point of view with
native Shopify product, collection, search, cart, customer, localization, and
checkout handoff behavior.

## Modeframe 2.0

- Three coordinated art directions: Studio light (`paper`), Studio dark
  (`ink`), and High signal (`signal`). The Paper, Ink, Signal, and Electric
  section roles remain available inside each direction.
- Three purposeful desktop header layouts, inverse-logo support, promotional
  mega-menu cards, accessible mobile navigation, and keyboard-complete
  predictive search.
- Indexed editorial product cards with secondary media, native swatches,
  quick-add rules, sale and availability states, and shared responsive media.
- Collection storytelling with a dedicated filter rail, sorting, adjustable
  grids, and merchant-positioned editorial breaks.
- A mosaic or focused product gallery, sticky product information, mobile buy
  bar, variant-aware commerce, product notes, specifications, complementary
  products, and related products.
- Drawer and page carts with quantity rules, properties, selling plans,
  discounts, notes, checkout controls, optional free-delivery progress, curated
  additions, and designed empty states.
- Signature Flexible content, Shoppable lookbook, and Product specifications
  sections, plus `collection.editorial` and `page.lookbook` alternative
  templates.
- Responsive Shopify CDN media, native forms, visible focus, accessible
  dialogs, progressive enhancement, and reduced-motion behavior.

## Source and repository layout

Modeframe's visual and interaction language originated in Brandd's standalone
Next.js site. It was not built on Dawn or Horizon. An early Shopify port
consulted Shopify's Skeleton reference; the small overlaps recorded in the 1.0
audit were reimplemented, and the provenance regression guard remains active.

The installable theme is limited to `assets`, `blocks`, `config`, `layout`,
`locales`, `sections`, `snippets`, and `templates`. Repository tooling, QA,
documentation, and historical marketplace material are excluded from the
Shopify archive.

Creative Market and ThemeForest files, services, scripts, and 1.0 archives are
retained only as truthful product history. They are not part of the default 2.0
build. Any third-party listing, sale, or downloadable distribution must be
withdrawn before Theme Store resubmission. That external withdrawal has not
been verified from this workspace.

## Local setup

```bash
npm ci
npm run verify
npm run theme:dev
```

Use ignored Shopify CLI configuration and environment files. Never commit a
store domain, storefront password, theme ID, access token, CLI state, customer
data, or a merchant's pulled `config/settings_data.json`.

## Theme Store bundle

```bash
npm run bundle
npm run bundle:check
```

The default builder derives the identity from `package.json` and
`config/settings_schema.json`, then creates only:

- `release/Modeframe-2.0.0-theme.zip`
- `release/SHA256SUMS.txt`

The validator requires an installable archive rooted only in Shopify theme
folders, verifies the 2.0 identity and signature sections, rejects development
and third-party buyer paths, and verifies the exact SHA-256 checksum. The old
marketplace builders remain in `scripts/` for historical reproducibility but
are not called by `npm run bundle`.

## QA and release gate

```bash
npm run verify
npm run bundle
npm run bundle:check
npm run release:gate
```

`verify` covers Theme Check, release structure, provenance, static QA, and the
repository's companion-service unit tests. `release:gate` adds the exact bundle
check and remote storefront suites; run `bundle` first. Playwright covers home,
search, predictive search, collection filters, product variants, cart mutation,
representative content, 404 behavior, keyboard focus, and serious accessibility
rules across the configured browser matrix. Lighthouse requires the intended
home, collection, and product routes and gates each run at 60 performance and
90 accessibility by default. Fixture-dependent cases skip explicitly rather
than being reported as passes.

Manual editor, screen-reader, device, webview, checkout, market, app, and
special-product cases remain mandatory in [docs/qa-matrix.md](docs/qa-matrix.md).
The 1.0 QA baseline is historical evidence and does not prove the 2.0 candidate.

## Safe store rollout

Test two unpublished themes before publication:

1. Upload the 2.0 ZIP as a fresh unpublished theme to validate the clean install,
   default content, editor schemas, and Theme Store reviewer experience.
2. Duplicate the current live theme, push code to that duplicate without
   replacing merchant-owned `settings_data.json`, section-group JSON, or
   existing template JSON, then merge new template structure deliberately.

Validate both candidates. Publish only the merchant-preserving candidate after
an explicit rollback copy is confirmed. Keep the previous live theme available
and republish it immediately if production checks fail.

Authenticated Shopify CLI access and confirmed target theme selection are not
available in the current workspace. Deployment, publication, and production
revalidation therefore remain pending; no live-update claim is made here.

See [contract.md](contract.md),
[docs/shopify-theme-store-compatibility.md](docs/shopify-theme-store-compatibility.md),
and [docs/demo-store-setup.md](docs/demo-store-setup.md) for the governing release
and deployment rules.
