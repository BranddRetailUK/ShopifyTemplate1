# Modeframe ThemeForest release gate

ThemeForest is the selected first channel for Modeframe 1.0.0. Modeframe is not
currently being prepared for Shopify Theme Store submission because Shopify's
exclusivity and review path conflict with third-party distribution.

## Repository and install package

- [x] Repository contains a Shopify theme rather than the retired web-app stack
- [x] Theme metadata and single install preset are both named Modeframe 1.0.0
- [x] Online Store 2.0 structure and core storefront templates are present
- [x] Six visual modes remain one internal Global styles feature
- [x] Source, buyer license, credits, documentation, and release notes exist
- [x] Automated Theme Check, release, static QA, and provenance commands exist
- [x] Exact 1.0.0 ThemeForest buyer and preview ZIPs pass the final verification
      and bundle validator after the current documentation/media update
- [x] Exact 1.0.0 theme ZIP is installed as a fresh unpublished theme
- [x] Dedicated Shopify development demo store exists and the exact release is
      installed with a demo-only home configuration
- [x] Latest source is pushed to the connected live testing theme without
      overwriting merchant-owned `config/settings_data.json`
- [x] Clean parentless repository history is published to the dedicated remote

## License activation

- [x] Companion activation API and PostgreSQL are deployed on Railway
- [x] Purchase codes are verified server-side, stored only as keyed
      fingerprints, and bound to one permanent `myshopify.com` domain
- [x] Activation is isolated from storefront availability; there is no remote
      storefront kill switch or public self-deactivation endpoint
- [x] Unit coverage passes for normalization, domain binding, fingerprinting,
      item matching, invalid codes, and marketplace rate limiting
- [ ] Configure the final Envato item ID and author token in Railway after the
      marketplace item exists
- [ ] Exercise one real purchase through activation, repeat activation,
      wrong-domain rejection, support-assisted transfer, and refund/revocation
      operating procedures
- [ ] Obtain legal/privacy review of the activation terms, retention policy,
      customer notices, and support-access process

## Commercial and marketplace decisions

- [ ] Obtain qualified legal review of source provenance, buyer license, and
      third-party marketplace distribution rights
- [ ] Obtain formal trademark/name clearance for Modeframe
- [x] Select ThemeForest as the first marketplace and adapt the buyer license
      notice, six-month support term, refunds, updates, preview, package, and
      reviewer material
- [x] Prepare the ThemeForest title, description, attributes, 15 tags, feature
      list, exclusions, price recommendation, upload checklist, and reviewer notes
- [ ] Confirm commercial rights for every screenshot, mockup, font, icon,
      product, logo, testimonial, video, and demo-store asset
- [x] Publish working preview, documentation, support, privacy, refund, and
      health routes on the iframe-compatible Railway public service
- [ ] Confirm the complete bundle opens correctly on Windows and macOS

## Demo and quality evidence

- [x] Create a dedicated demo store and install the exact release candidate
- [ ] Approve the demo catalogue/media rights and remove the storefront password;
      Shopify development stores cannot be used as a password-free public demo
- [ ] Populate products, collections, filters, pages, policies, navigation,
      blog, media, markets, and special commerce fixtures
- [ ] Complete Theme Editor add/reorder/duplicate/hide/save tests
- [ ] Complete the manual matrix in `docs/qa-matrix.md`
- [x] Public ThemeForest layer passes 15 Playwright/axe checks across desktop
      Chromium, Firefox, WebKit and mobile Chromium/WebKit
- [x] Public preview, documentation, and support routes pass six mobile/desktop
      Lighthouse runs at 98–100 performance, 100 accessibility, 96–100 best
      practices, and 90–100 SEO
- [x] Retain the earlier exact-package Chromium evidence (9 passed across
      desktop/mobile Chromium; one inapplicable desktop mobile-menu case skipped)
- [ ] Re-run packaged-theme automation on the new demo across desktop Chromium,
      Firefox, WebKit and mobile Chromium/WebKit once the ignored QA password is
      available
- [ ] Complete Chrome, Safari, Firefox, Edge, iOS Safari, and Android Chrome
      coverage plus representative Instagram/TikTok in-app webviews
- [ ] Complete manual keyboard, screen-reader, 200% zoom, 400% reflow, and
      contrast review
- [ ] Record current packaged-theme Lighthouse evidence for home, collection,
      and product once the ignored QA password is available
- [x] Create new ThemeForest presentation compositions at 2340×1560 and
      1920×1080 rather than upscaling the earlier concepts
- [ ] Capture truthful exact-store desktop/mobile screenshots and a 1920×1080
      preview video once the ignored QA password is available

## Launch status

**Not publication-ready yet.** The ThemeForest-specific buyer/listing material,
exact-theme demo installation, public iframe preview/documentation layer,
presentation compositions, and license-service foundation are in place. The
remaining hard gates are a public password-free rights-cleared demo, fresh
exact-store media and cross-browser/Lighthouse evidence, final Envato item ID
and author token plus real-purchase activation testing, legal/name clearance,
and human browser/device/accessibility/checkout evidence. No unchecked item may
be converted into a listing claim without evidence.

See `docs/qa-baseline-1.0.0.md` for the exact automated result and limitations
of the current candidate.
