# Modeframe 2.0 Theme Store release gate

This file retains its historical name, but the active gate is Shopify Theme
Store submission. Creative Market and ThemeForest were Modeframe 1.0 routes and
are no longer valid default release targets.

## Source and product

- [x] Package, theme metadata, and release validation target Modeframe 2.0.0
- [x] One install preset and three art directions are exposed
- [x] Header, cards, collection, PDP, cart, default content, and signature
      sections have a coherent 2.0 treatment
- [x] Flexible content supports theme blocks and app blocks
- [x] Alternative editorial collection and lookbook page templates exist
- [x] Dawn and Horizon are not represented as Modeframe's source
- [x] Brandd's standalone Next.js visual/interaction origin is recorded
- [x] The early Skeleton consultation and reimplemented overlaps are recorded;
      the source hash guard remains active
- [ ] Obtain final ownership, provenance, trademark/name, and asset-rights review

## Package

- [x] `npm run bundle` defaults to one Shopify-installable archive only
- [x] Version and filename derive from package and theme metadata
- [x] Archive validation rejects non-theme, development, sensitive, unsafe, and
      third-party buyer paths
- [x] SHA-256 is written and verified
- [x] Historical third-party builders remain outside the default command
- [ ] Build the final `Modeframe-2.0.0-theme.zip` with the pinned Shopify CLI
- [ ] Record `npm run bundle:check`, checksum, and clean upload evidence

## Channel withdrawal

- [ ] Withdraw any Creative Market listing and buyer download
- [ ] Withdraw any ThemeForest listing, preview, buyer download, or sale path
- [ ] Remove third-party distribution claims from all public Modeframe pages
- [ ] Record dated evidence that no third-party Modeframe purchase route remains
- [ ] Confirm Theme Store exclusivity with the responsible business owner

Historical repository assets and 1.0 archives may remain private for audit and
reproducibility. This checklist does not assert that external withdrawal is
complete.

## Automated QA

- [x] Local release structure checks require 2.0, the three art directions, and
      all signature sections
- [x] Static QA covers theme JSON, identity, secret patterns, tone metadata, and
      retired-stack paths
- [x] Playwright includes predictive/standard search, filtering, variants,
      product/cart mutation, content, true 404, keyboard focus, and axe checks
- [x] Lighthouse rejects access pages, wrong routes, redirects, and scores below
      the per-run 60 performance and 90 accessibility floors
- [ ] Run Theme Check with the pinned CLI on the final source
- [ ] Run `npm run verify` and archive the output
- [ ] Run the exact bundle and remote `npm run release:gate`
- [ ] Review every fixture skip and satisfy it or document why it cannot apply

## Unpublished store candidates

- [ ] Install the exact ZIP as a clean unpublished theme
- [ ] Validate defaults, empty states, alternative templates, app blocks, and
      add/remove/reorder/duplicate/hide/save behavior
- [ ] Duplicate the current live theme as a separate migration candidate
- [ ] Back up its remote JSON outside the repository
- [ ] Push code with deletion disabled while excluding merchant-owned
      `settings_data.json`, section groups, and existing template JSON
- [ ] Add new alternative templates separately and merge existing template
      changes deliberately
- [ ] Compare clean and migration candidates across every core route
- [ ] Confirm checkout/test order and production-safe app behavior

## Human and platform QA

- [ ] Current Chrome, Safari, Firefox, Edge, iOS Safari, and Android Chrome
- [ ] Required Shopify and social in-app webviews
- [ ] Keyboard-only, screen reader, 200% zoom, 400% reflow, contrast, and touch
- [ ] Theme Editor across all sections, blocks, templates, and setting states
- [ ] Markets, languages, currencies, taxes, duties, shipping, and payment states
- [ ] Gift cards, selling plans, pickup, unit pricing, quantity rules, discounts,
      accounts, policies, apps, videos, 3D models, and high-variant products
- [ ] Authentic rights-cleared demo content and exact release/demo parity

## Publication and rollback

- [ ] Record the existing live theme as the private rollback target
- [ ] Obtain explicit publication approval for the migration candidate
- [ ] Publish through Shopify admin only after all gates pass
- [ ] Re-run production-safe storefront and Lighthouse checks after publication
- [ ] If any release blocker appears, republish the previous theme immediately
- [ ] Keep the failed candidate unpublished for diagnosis; do not patch live

## Current status

**Not ready to submit or publish.** Source-level 2.0 work is present, but final
CLI packaging, third-party withdrawal, authenticated dual-candidate deployment,
full human/platform QA, and production revalidation remain open. Store access is
pending; no store domain, password, or theme ID is recorded here.

The 1.0 QA baseline remains historical evidence only.
