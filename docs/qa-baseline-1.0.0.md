# Modeframe 1.0.0 QA baseline

Marketplace candidates built and checked locally, on the public Railway preview
service, and on dedicated Shopify testing/demo stores on 1 August 2026. Creative
Market is the active first application; the ThemeForest candidate is retained
for a future eligible Envato account. Store domains, theme identifiers,
credentials, and merchant data are intentionally excluded from this repository
record.

## Automated repository checks

- Theme Check: **pass**, 107 files, zero offenses
- Release structure: **pass**, Modeframe 1.0.0, one preset, six visual modes
- Static QA/security scan: **pass**
- Source provenance guard: **pass**, 86 theme files; legal review still required
- ThemeForest buyer/preview and Creative Market buyer archive validation:
  **pass**, structure/isolation/embed/checksum
- License-service unit suite: **pass**, 5 tests covering normalization, domain
  binding, keyed fingerprints, item matching, invalid codes, and rate limiting
- Public preview service unit suite: **pass**, 4 tests covering all routes,
  iframe headers, environment links, Elements mode, 404 and method handling
- Dependency audit: **pass**, zero known vulnerabilities
- Installable entries: 95
- ThemeForest buyer bundle entries: 15
- ThemeForest preview bundle entries: 17
- Creative Market buyer bundle entries: 12
- `Modeframe-1.0.0-theme.zip` SHA-256:
  `7817e1368ed3c400cb72703e540ee8985c91f30f2491796d99038a4120cb4118`
- `Modeframe-1.0.0-themeforest.zip` SHA-256:
  `32efccc46491f05e739f686977aba0d16bb63ead85cd9d88e1ce0ac431be5a33`
- `Modeframe-1.0.0-themeforest-preview.zip` SHA-256:
  `53496d37189229add679bfdca1622607db8ee69d27bbd522106a425825ec25f1`
- `Modeframe-1.0.0-creative-market.zip` SHA-256:
  `86e6489349f383129c38acab6b893042d78fdc0871dad7c41168cefa481bba08`

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
- Railway license-service health: **pass**; optional Envato activation remains
  intentionally configuration-closed until the final Envato item ID and author
  token are stored in Railway. Creative Market uses the marketplace purchase
  record and selected licence without this external activation flow.
- Railway iframe preview/documentation deployment: **pass**, health and public
  routes return 200 with Creative Market and Envato frame ancestors and no
  `X-Frame-Options`
- Public preview Playwright/axe suite: **pass**, 15/15 across desktop Chromium,
  Firefox, WebKit and mobile Chromium/WebKit
- Public preview Lighthouse: **pass**, six mobile/desktop audits across preview,
  documentation and support; performance 98–100, accessibility 100, best
  practices 96–100, SEO 90–100
- Live demo Lighthouse: **recorded**, six mobile/desktop audits across home,
  collection and purchasable product; performance 81–97, accessibility 100,
  best practices 78–79, SEO 100. Best Practices deductions are the Shopify/Shop
  account third-party cookie and browser inspector cookie findings.
- Exact-store media: **pass**, three 1920×1080 desktop screenshots, two
  1080×1920 mobile screenshots, and a 22.5-second H.264 1920×1080 MP4 captured
  from the current live theme. Seller approval of catalogue/media rights remains
  required before publication.
- Creative Market presentation media: **pass**, eight 1820×1214 PNGs below the
  form's 10 MB limit; four presentation concepts and four exact-store capture
  layouts. The prepared disclosure marks generative-AI use as **Yes**.

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
