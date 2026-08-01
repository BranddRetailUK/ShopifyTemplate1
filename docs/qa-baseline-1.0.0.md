# Modeframe 1.0.0 QA baseline

Candidate built and checked locally and on the connected Shopify testing store
on 1 August 2026. Store domains, theme identifiers, credentials, and merchant
data are intentionally excluded from this repository record.

## Automated repository checks

- Theme Check: **pass**, 88 files, zero offenses
- Release structure: **pass**, Modeframe 1.0.0, one preset, six visual modes
- Static QA/security scan: **pass**
- Source provenance guard: **pass**, 86 theme files; legal review still required
- Marketplace archive validation: **pass**, structure/isolation/embed/checksum
- License-service unit suite: **pass**, 5 tests covering normalization, domain
  binding, keyed fingerprints, item matching, invalid codes, and rate limiting
- Installable entries: 95
- Marketplace bundle entries: 15
- `Modeframe-1.0.0-theme.zip` SHA-256:
  `fa6fb6a56f2f1953f0053965781ebf88306ee7950b410f5c98470f25adbc2fab`
- `Modeframe-1.0.0-marketplace.zip` SHA-256:
  `1c65bfce16298a9c30b603304ffee7126607e96138cf1c945f279a316c8bbcf5`

## Automated platform evidence

- Fresh exact-package installation: **pass**, installed as an unpublished theme
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

## Manual/platform evidence

- Shopify Theme Editor operations: pending
- Desktop browser matrix: pending
- Physical iOS/Android devices: pending
- In-app webviews: pending
- Keyboard/screen-reader/zoom/reflow: pending
- Checkout/test order: pending
- Lighthouse home/collection/product: pending

The open rows above are deliberately not inferred from earlier prototypes or a
working development theme. Only results produced by this exact 1.0.0 archive
belong in the remaining release record. Rebuilding the ZIP changes its checksum
and requires this record to be refreshed.
