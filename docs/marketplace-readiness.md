# Modeframe marketplace release gate

Creative Market is the active first-channel application for Modeframe 1.0.0.
New Envato theme-author intake is unavailable, so the completed ThemeForest
package is retained but is not the current submission path. Modeframe is not
being prepared for the Shopify Theme Store because its exclusivity requirement
conflicts with third-party distribution.

## Repository and packages

- [x] Repository contains the Modeframe Shopify Online Store 2.0 theme
- [x] Theme metadata and single install preset are named Modeframe 1.0.0
- [x] Six visual modes remain one internal Global styles feature
- [x] Exact installable theme ZIP passes release validation
- [x] ThemeForest buyer and preview archives remain reproducible
- [x] Creative Market listing title, description, fields, pricing, compatibility,
      SEO copy, tags, AI disclosure, and upload checklist are prepared
- [x] Creative Market buyer ZIP excludes Envato files, custom EULAs, activation
      instructions, repository tooling, credentials, tests, and store data
- [x] Creative Market buyer ZIP contains the exact release theme, portable
      documentation, quick start, FAQ, support scope, credits, release notes,
      and checksum
- [x] Dedicated remote repository is published and the latest work is on `main`

## Creative Market presentation

- [x] Eight preview PNGs are exactly 1820×1214 and below 10 MB each
- [x] Presentation concepts and exact-store captures are clearly separated
- [x] Generative-AI disclosure is set to **Yes** in the prepared fields
- [x] Exact live home, collection, product, and mobile evidence is included
- [x] Public preview displays the password for the protected Shopify demo
- [x] Public documentation, support, privacy, and refund pages exist
- [ ] Obtain commercial-rights approval for the demo catalogue and every
      captured image/video before upload
- [ ] Upload the existing preview MP4 to a Creative Market-supported public
      video host if the optional video field will be used

## Licensing and purchase verification

- [x] Creative Market's selected licence controls the buyer's use; no separate
      Modeframe EULA is shipped
- [x] Creative Market buyer documentation states that no separate activation
      code is currently required
- [x] Envato purchase-code verification remains isolated in the optional
      Railway service and never controls storefront rendering
- [ ] If external activation is still desired for Creative Market buyers,
      obtain written marketplace approval and a supported transaction-verification
      mechanism before adding it; the public seller guidance exposes purchase
      records but no equivalent purchase-code API
- [ ] Obtain legal/privacy review of licence wording, purchase-record handling,
      retention, transfers, refunds, and support access

## Commercial and account gates

- [ ] Complete the Creative Market shop application and human portfolio review
- [ ] Complete seller identity, tax, payout, pricing, and shop-profile fields
- [ ] Obtain qualified legal review of source provenance and third-party
      marketplace distribution rights
- [ ] Obtain formal trademark/name clearance for Modeframe
- [ ] Confirm the complete buyer ZIP opens correctly on Windows and macOS

## Demo and quality evidence

- [x] The exact release is published as the live protected development-store
      theme and the public preview exposes the demo credential
- [x] Theme Check passes across 107 files with zero offences
- [x] Live demo passes the automated desktop/mobile Chromium, Firefox, and
      WebKit Playwright and axe-core suite
- [x] Live home, collection, and product Lighthouse evidence records 81–97
      performance, 100 accessibility, and 100 SEO
- [x] Public preview layer passes cross-browser Playwright/axe and Lighthouse
- [ ] Complete Theme Editor add/reorder/duplicate/hide/save tests
- [ ] Complete physical Chrome, Safari, Firefox, Edge, iOS Safari, Android
      Chrome, and representative in-app webview coverage
- [ ] Complete manual keyboard, screen-reader, 200% zoom, 400% reflow, and
      contrast review
- [ ] Complete checkout/test-order cases and the remaining special Shopify
      fixtures in `docs/qa-matrix.md`

## Launch status

**Creative Market application package ready; public sale not yet fully
cleared.** The remaining hard gates are shop approval and seller onboarding,
legal/name/source review, demo-media rights approval, Windows/macOS archive
opening, and the outstanding manual device/accessibility/checkout matrix. The
existing external Envato activation service is not presented as a Creative
Market purchase verifier.

See `creative-market/submission-fields.md` for exact form values and
`docs/qa-baseline-1.0.0.md` for automated evidence.
