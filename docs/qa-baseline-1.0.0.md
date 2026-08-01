# Modeframe 1.0.0 QA baseline

ThemeForest candidate built and checked locally, on the public Railway preview
service, and on dedicated Shopify testing/demo stores on 1 August 2026. Store
domains, theme identifiers, credentials, and merchant data are intentionally
excluded from this repository record.

## Automated repository checks

- Theme Check: **pass**, 107 files, zero offenses
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
- ThemeForest preview bundle entries: 17
- `Modeframe-1.0.0-theme.zip` SHA-256:
  `e63a0b4f6cb94557706bdbc5696197bf948dee8ed8ac30120d814d92908b4710`
- `Modeframe-1.0.0-themeforest.zip` SHA-256:
  `9a832b43b9b4597a087a66bf4b817517996528a61e821e2229f245705b2f0968`
- `Modeframe-1.0.0-themeforest-preview.zip` SHA-256:
  `ac129db979b12e7da790a6848017ef8babd2edff3349ca7187db5c096d061ded`

## Automated platform evidence

- Fresh exact-package installation: **pass**, installed as an unpublished theme
- Dedicated demo installation: **pass**, release theme installed, configured
  for demo use, published as the live development-store theme, and updated with
  the final payment-button contrast fix
- Live demo browser suite: **pass**, 22 passed across desktop Chromium, Firefox,
  WebKit and mobile Chromium/WebKit; three desktop instances of the mobile-only
  menu case intentionally skipped
- Covered home and collection rendering, runtime page exceptions, search,
  mobile-menu Escape behavior, product add-to-cart, and serious/critical WCAG
  automated rules
- Shopify-owned preview/privacy controls and intermittent injected Shop cart
  sync module errors are separated from theme-owned findings
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
  documentation and support; performance 97–100, accessibility 100, best
  practices 96–100, SEO 90–100
- Live demo Lighthouse: **recorded**, six mobile/desktop audits across home,
  collection and purchasable product; performance 81–97, accessibility 100,
  best practices 78–79, SEO 100. Best Practices deductions are the Shopify/Shop
  account third-party cookie and browser inspector cookie findings.
- Exact-store media: **pass**, three 1920×1080 desktop screenshots, two
  1080×1920 mobile screenshots, and a 22.5-second H.264 1920×1080 MP4 captured
  from the current live theme. Seller approval of catalogue/media rights remains
  required before publication.

## Manual/platform evidence

- Shopify Theme Editor operations: pending
- Automated browser-engine matrix: complete; physical browser/device matrix pending
- Physical iOS/Android devices: pending
- In-app webviews: pending
- Keyboard/screen-reader/zoom/reflow: pending
- Checkout/test order: pending
- Shopify demo Lighthouse home/collection/product: recorded
- Exact-store desktop/mobile screenshots and preview video: captured; rights
  approval pending

The open rows above are deliberately not inferred from earlier prototypes or a
working development theme. Only results produced by this exact 1.0.0 archive
belong in the remaining release record. Rebuilding the ZIP changes its checksum
and requires this record to be refreshed.
