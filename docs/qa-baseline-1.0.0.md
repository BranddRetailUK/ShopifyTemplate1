# Modeframe 1.0.0 QA baseline

ThemeForest candidate built and checked locally, on the public Railway preview
service, and on dedicated Shopify testing/demo stores on 1 August 2026. Store
domains, theme identifiers, credentials, and merchant data are intentionally
excluded from this repository record.

## Automated repository checks

- Theme Check: **pass**, 98 files, zero offenses
- Release structure: **pass**, Modeframe 1.0.0, one preset, six visual modes
- Static QA/security scan: **pass**
- Source provenance guard: **pass**, 86 theme files; legal review still required
- ThemeForest buyer/preview archive validation: **pass**,
  structure/isolation/embed/checksum
- License-service unit suite: **pass**, 5 tests covering normalization, domain
  binding, keyed fingerprints, item matching, invalid codes, and rate limiting
- Public preview service unit suite: **pass**, 4 tests covering all routes,
  iframe headers, environment links, Elements mode, 404 and method handling
- Dependency audit: **pass**, zero known vulnerabilities
- Installable entries: 95
- ThemeForest buyer bundle entries: 15
- ThemeForest preview bundle entries: 10
- `Modeframe-1.0.0-theme.zip` SHA-256:
  `e03f9fea6db5e1b1ab8b123179e8bab3ac1525e1bfa4a4cb7a8886ddc5ded541`
- `Modeframe-1.0.0-themeforest.zip` SHA-256:
  `577d374c4ed4563c8ca8e00bd8d258a37b40460ea5b8bd8c3cc9ffed515fb24b`
- `Modeframe-1.0.0-themeforest-preview.zip` SHA-256:
  `af88aa9fa5db9798e3738302dc19db736ae4ff2943948b3cdda7e43f46b2e8f3`

## Automated platform evidence

- Fresh exact-package installation: **pass**, installed as an unpublished theme
- Dedicated demo installation: **pass**, release theme content installed as a
  separate unpublished theme with demo-only home configuration
- Desktop/mobile Chromium suite: **pass**, 9 passed and one intentionally
  skipped desktop-only instance of the mobile-menu test
- Covered home and collection rendering, runtime page exceptions, search,
  mobile-menu Escape behavior, product add-to-cart, and serious/critical WCAG
  automated rules
- Shopify-owned preview and privacy controls are excluded from theme-owned
  accessibility results and prevented from intercepting theme interactions
- Reduced-motion emulation is explicitly applied before navigation so reveal
  transitions cannot create transient contrast false positives
- Railway license-service health: **pass**; live marketplace activation remains
  intentionally configuration-closed until the final Envato item ID and author
  token are stored in Railway
- Railway iframe preview/documentation deployment: **pass**, health and public
  routes return 200 with Envato frame ancestors and no `X-Frame-Options`
- Public preview Playwright/axe suite: **pass**, 15/15 across desktop Chromium,
  Firefox, WebKit and mobile Chromium/WebKit
- Public preview Lighthouse: **pass**, six mobile/desktop audits across preview,
  documentation and support; performance 98–100, accessibility 100, best
  practices 96–100, SEO 90–100

## Manual/platform evidence

- Shopify Theme Editor operations: pending
- New-demo Shopify browser matrix: pending storefront password in ignored QA env
- Physical iOS/Android devices: pending
- In-app webviews: pending
- Keyboard/screen-reader/zoom/reflow: pending
- Checkout/test order: pending
- Shopify demo Lighthouse home/collection/product: pending storefront password
- Exact-store desktop/mobile screenshots and preview video: pending storefront
  password

The open rows above are deliberately not inferred from earlier prototypes or a
working development theme. Only results produced by this exact 1.0.0 archive
belong in the remaining release record. Rebuilding the ZIP changes its checksum
and requires this record to be refreshed.
