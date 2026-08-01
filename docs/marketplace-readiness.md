# Modeframe third-party marketplace release gate

Third-party marketplaces are the 1.0 priority. Modeframe is not currently being
prepared for Shopify Theme Store submission because Shopify's exclusivity and
review path conflict with the faster independent launch objective.

## Repository and install package

- [x] Repository contains a Shopify theme rather than the retired web-app stack
- [x] Theme metadata and single install preset are both named Modeframe 1.0.0
- [x] Online Store 2.0 structure and core storefront templates are present
- [x] Six visual modes remain one internal Global styles feature
- [x] Source, buyer license, credits, documentation, and release notes exist
- [x] Automated Theme Check, release, static QA, and provenance commands exist
- [x] Exact 1.0.0 theme ZIP passes the full verification and bundle validator
- [x] Exact 1.0.0 theme ZIP is installed as a fresh unpublished theme
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
- [ ] Select the first marketplace and adapt its license, support term, tax,
      refund, update, preview, file-size, and seller-profile requirements
- [ ] Confirm commercial rights for every screenshot, mockup, font, icon,
      product, logo, testimonial, video, and demo-store asset
- [ ] Publish working documentation, support, privacy, and refund URLs
- [ ] Confirm the complete bundle opens correctly on Windows and macOS

## Demo and quality evidence

- [ ] Create a dedicated, rights-cleared public demo store
- [ ] Populate products, collections, filters, pages, policies, navigation,
      blog, media, markets, and special commerce fixtures
- [ ] Complete Theme Editor add/reorder/duplicate/hide/save tests
- [ ] Complete the manual matrix in `docs/qa-matrix.md`
- [x] Run browser automation against the exact packaged theme (9 passed across
      desktop/mobile Chromium; one inapplicable desktop mobile-menu case skipped)
- [ ] Complete Chrome, Safari, Firefox, Edge, iOS Safari, and Android Chrome
      coverage plus representative Instagram/TikTok in-app webviews
- [ ] Complete manual keyboard, screen-reader, 200% zoom, 400% reflow, and
      contrast review
- [ ] Record current Lighthouse evidence for home, collection, and product
- [ ] Capture truthful desktop/mobile screenshots and a short motion demo

## Launch status

**Not publication-ready yet.** Source, buyer-package infrastructure,
exact-package automated QA, and the license-service foundation are in place.
Legal/name clearance, marketplace-specific terms and credentials, a dedicated
rights-cleared public demo, license operations testing, and human
browser/device/accessibility evidence remain required. No unchecked item may be
converted into a listing claim without evidence.

See `docs/qa-baseline-1.0.0.md` for the exact automated result and limitations
of the current candidate.
