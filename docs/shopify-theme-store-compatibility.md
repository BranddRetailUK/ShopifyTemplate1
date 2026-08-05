# Shopify Theme Store compatibility audit — Modeframe 2.0

The Shopify Theme Store is Modeframe's active submission route. This document
records source readiness and the remaining evidence; it is not a claim that
Shopify has approved the theme.

Review the authoritative requirements again immediately before submission:

- <https://shopify.dev/docs/storefronts/themes/store/requirements>
- <https://shopify.dev/docs/storefronts/themes/store/test-theme/checklist>
- <https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme>

## Implemented foundation

- [x] Online Store 2.0 structure, one Modeframe install preset, and 2.0 metadata
- [x] Three art directions with contrast-aware section color roles
- [x] Core JSON, customer, password, gift-card, and 404 templates
- [x] Custom Liquid, app blocks, and Flexible content theme/app blocks
- [x] Three header layouts, promotional navigation, inverse logo, accessible
      mobile menu, and keyboard-complete predictive search
- [x] Editorial product cards, native swatches, guarded quick add, and responsive
      collection/search merchandising
- [x] Collection filter rail and editorial breaks
- [x] Mosaic/focused PDP, native variants and selling plans, product notes,
      specifications, recommendations, and mobile buy bar
- [x] Drawer/page carts with native line data, discounts, notes, checkout,
      free-delivery progress, curated additions, and empty states
- [x] Shoppable lookbook, Product specifications, and Flexible content sections
- [x] `collection.editorial` and `page.lookbook` alternative templates
- [x] Responsive Shopify media, native forms, reduced-motion behavior, SEO
      metadata, editor reload support, and Shopify-hosted JavaScript
- [x] Theme Store-only default bundle and checksum validator
- [x] Expanded Playwright, accessibility, route, mutation, and Lighthouse gates

## Required before resubmission

- [ ] Confirm Partner/business eligibility and the available submission slot
- [ ] Withdraw every Creative Market and ThemeForest listing, sale path, and
      downloadable buyer file; retain private evidence of withdrawal
- [ ] Confirm no other third-party distribution of Modeframe remains available
- [ ] Obtain source/provenance, ownership, name, listing, and asset-rights review
- [ ] Build and validate the final 2.0 archive with the pinned Shopify CLI
- [ ] Install the archive as a fresh unpublished theme and complete the entire
      Theme Editor and clean-install checklist
- [ ] Create a second unpublished candidate by duplicating the live theme and
      preserve merchant JSON during the code migration
- [ ] Confirm demo content is authentic, rights-cleared, and matches the exact
      clean-install release
- [ ] Prepare the submission demo on an eligible client-transfer store; use any
      existing merchant store only as a private regression target
- [ ] Run the complete browser, device, webview, keyboard, screen-reader, zoom,
      reflow, contrast, touch, checkout, markets, and special-fixture matrix
- [ ] Record every Lighthouse home/collection/product run at or above 60
      performance and 90 accessibility
- [ ] Prepare Shopify-specific listing copy, screenshots, demo, support route,
      reviewer notes, and release evidence without third-party sales messaging
- [ ] Confirm the previous live theme is retained and rollback is rehearsed

## Channel exclusivity

The repository retains 1.0 Creative Market and ThemeForest files as historical
evidence. Retention in source is not active distribution, but any external
listing, sale, download, or buyer-delivery route must be withdrawn before
resubmission. Withdrawal has not been completed or verified by the current
workspace and must remain an open gate until an authorized operator records it.

Modeframe applies the 60 performance and 90 accessibility floors to every
configured route and form factor. This is intentionally stricter than relying
on an average alone.

## Deployment status

Local 2.0 structure and static validation are implemented. Authenticated store
access, candidate theme IDs, deployment, publication, and live revalidation are
pending. Do not record them as passes until the authorized store operator has
run the dual-candidate process and attached evidence without committing any
store identifier or credential.

## Decision

Modeframe 2.0 is actively being prepared for Theme Store resubmission, but it is
not submission-ready while exclusivity, authenticated deployment, full platform
QA, rights review, and human evidence remain open.
