# Shopify Theme Store compatibility audit

This is a compatibility delta, not an active submission plan. The 1.0 launch
targets third-party marketplaces. Shopify requires Theme Store themes to be
exclusive to its store, so the same Modeframe product cannot be sold there and
on third-party marketplaces simultaneously.

Audit basis: Shopify's current Theme Store requirements and test checklist,
reviewed on 1 August 2026:

- <https://shopify.dev/docs/storefronts/themes/store/requirements>
- <https://shopify.dev/docs/storefronts/themes/store/test-theme/checklist>
- <https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme>

## Compatible foundations already present

- [x] Online Store 2.0 theme layout and all required core JSON templates
- [x] Legacy customer templates, gift-card template, and password template
- [x] Custom Liquid section and representative app blocks
- [x] One install preset matching the theme name
- [x] Theme info, version, documentation, support, and release notes
- [x] Native CSS, responsive/lazy images, Shopify-hosted theme JavaScript
- [x] Product variants/media, filters, search, cart, unit pricing, selling plans,
      pickup, gift cards, customer orders, localization, and policy/footer data
- [x] Gift-card QR code, 160-pixel size, print action, and Apple Wallet path
- [x] SEO title, description, canonical, social metadata, and product structured
      data
- [x] Reduced-motion handling, editor section reload, and slideshow block-select
      handling exist in source
- [x] No `robots.txt.liquid`, Sass files, or `config/markets.json`
- [x] Theme Check passes with no offenses

## Submission blockers and unverified requirements

- [ ] **Channel exclusivity:** all third-party distribution would have to stop
      before a Shopify Theme Store listing
- [ ] Shopify Partner/business eligibility and a new submission slot confirmed
- [ ] Formal uniqueness review against every current Theme Store product
- [ ] Source/provenance route accepted by Shopify and independently cleared
- [ ] Exact demo/install parity and authentic, rights-cleared demo content
- [ ] Every requirement in Shopify's detailed functional checklist completed
- [ ] Theme Editor add/remove/reorder/duplicate/hide/save coverage completed
- [ ] Average Lighthouse performance at least 60 and accessibility at least 90
      across populated home, collection, and product pages on mobile/desktop
- [ ] Required current desktop/mobile browsers, Samsung Internet, and Instagram,
      Facebook, and Pinterest webviews completed
- [ ] Manual keyboard, screen-reader, focus, contrast, touch-target, zoom, and
      reflow evidence completed
- [ ] Shopify-specific listing, demo store, support process, and reviewer package
      prepared with external marketing/developer credits removed from theme files

## Decision

Do not submit Modeframe 1.0 to the Shopify Theme Store while it is sold through
third parties. Preserve native Shopify compatibility and the QA discipline, but
treat a future Theme Store edition as a separate commercial-channel decision
requiring distribution withdrawal, a fresh requirements audit, and full review
evidence.
