# Modeframe 1.0.0 manual and platform QA matrix

Record the store, theme ID, package SHA-256, browser/device, tester, date,
result, and evidence link for every run. Test the exact release ZIP in a
dedicated store whenever orders, payments, inventory, markets, apps, or
customer data are involved. An unchecked row is a release gap, not an implied
pass.

## Automated operator sequence

1. Run `npm ci` and `npm run verify`.
2. Run `npm run bundle && npm run bundle:check`.
3. Install `release/Modeframe-1.0.0-theme.zip` as a fresh unpublished theme.
4. Copy `.env.example` to an ignored `.env.qa` and provide `QA_BASE_URL` plus
   the non-secret route settings. Supply a storefront password only through the
   environment.
5. Run `npm run qa:browser` and archive `playwright-report/` with this matrix.
6. Complete the human browser, device, editor, accessibility, payment, and
   special-product rows below.

## Installation and editor

- [ ] Install the exact packaged ZIP contents as a new theme with no previous
      theme configuration
- [ ] Confirm the installed theme name, version, and single preset are Modeframe
- [ ] Confirm all six Global styles render and remain internal settings
- [ ] Add, remove, reorder, duplicate, hide, and restore every section type
- [ ] Select blocks in Slideshow and product sections inside the theme editor
- [ ] Save and reload editor settings without schema or translation errors
- [ ] Verify app blocks and Custom Liquid on every supported JSON template

## Global storefront

- [ ] Announcement links and multiple announcements
- [ ] Every desktop header layout and responsive mobile menu
- [ ] Two- and three-level navigation, long labels, and keyboard disclosures
- [ ] Sticky-header tone across every scheme and custom section background
- [ ] Predictive search suggestions and standard search fallback
- [ ] Classic and new customer accounts on desktop and mobile
- [ ] Footer menu, policies, social links, localization, payment icons, Shopify
      attribution, and Follow on Shop
- [ ] Keyboard focus order, visible focus, skip link, 200% zoom, and 400% reflow

## Products

- [ ] Default, sale, sold-out, gift-card, and subscription-only products
- [ ] One-option, two-option, unavailable-combination, and 100-variant products
- [ ] Dropdowns, buttons, native color swatches, and image swatches
- [ ] Variant URL, media, price, compare-at price, unit price, SKU, inventory,
      quantity rule, pickup, and button state updates
- [ ] One-time purchase and every selling-plan group for each eligible variant
- [ ] Selling-plan selection updates price, URL, form data, cart, and order
- [ ] Pre-order or deferred plan displays the amount due at checkout
- [ ] Shop Pay installments, accelerated checkout, and payment terms
- [ ] Images in portrait, square, landscape, transparent, and no-media states
- [ ] Shopify video, external video, 3D model, alt text, and media thumbnails
- [ ] Gift-card recipient success and validation states
- [ ] Related and complementary recommendations, including empty responses

## Collections and search

- [ ] Empty, small, paginated, and large collections
- [ ] Product cards with sale, sold-out, unit-price, vendor, second image, and
      no image
- [ ] Quick add for eligible products and product-page routing when choices are
      required
- [ ] Sorting and every Search & Discovery filter type
- [ ] Active-filter removal, clear all, no filtered results, and pagination
- [ ] Search products, collections, pages, articles, no results, and pagination

## Cart and checkout handoff

- [ ] Drawer and page cart modes
- [ ] Add, increase, decrease, remove, empty, and error states
- [ ] Variant options, custom properties, uploaded file properties, unit price,
      selling plan, checkout charge, and quantity rules
- [ ] Line discounts, automatic discounts, discount codes, and cart discounts
- [ ] Cart note, terms acknowledgement, taxes included/excluded, and policies
- [ ] Accelerated checkout and standard checkout handoff
- [ ] Cart state and header count remain synchronized after AJAX changes

## Content templates

- [ ] Page and contact form error/success states
- [ ] Blog pagination, tag filtering, article metadata, comments, and sharing
- [ ] Password login and newsletter forms
- [ ] 404 search, home, and catalogue actions
- [ ] Gift-card balance, expiry, QR code, print, and Apple Wallet
- [ ] Customer login, recovery, registration, activation, reset, account,
      address, order, fulfillment, unit-price, and selling-plan states

## Sections and motion

- [ ] Hero image, video, overlays, actions, positions, and header tone
- [ ] Three Slideshow sections on one page with 1, 2, 3, and 8-slide cases
- [ ] Slideshow manual controls, arrows, autoplay, focus/hover pause,
      off-screen pause, editor block selection, and reduced motion
- [ ] Scroll Bridge variants, local colors, transitions, and reduced motion
- [ ] Motion Accents layouts, local colors, rail counts, and reduced motion
- [ ] Scrolling text, media, collection, blog, social-proof, FAQ, newsletter,
      call-to-action, and Custom Liquid sections
- [ ] Global motion None, Subtle, and Expressive

## International and platform

- [ ] Country/language selectors with at least two markets and languages
- [ ] Presentment currencies, zero-decimal currency, long money formats, and
      currency switching with selling-plan prices
- [ ] Long translated strings, right-to-left content assessment, and missing
      translation detection
- [ ] Taxes, duties, shipping, payment methods, policies, and checkout messaging
- [ ] Shopify Inbox, Shop, Search & Discovery, and representative app blocks

## Performance and compatibility

- [ ] Lighthouse home/product/collection on mobile and desktop on the populated
      packaged-theme QA store
- [ ] No unexpected layout shift from fonts, images, media, or editor loading
- [ ] No console errors, failed theme assets, or duplicate network listeners
- [ ] JavaScript-disabled product, cart, search, navigation, and form fallbacks
- [ ] Current Chrome, Safari, Firefox, and Edge
- [ ] Current iOS Safari, Android Chrome, Shop app, Instagram, and TikTok
      webviews
- [ ] Slow 4G, large media gallery, long cart, and 25-section home page

## Release evidence

- [ ] `npm run verify` output
- [ ] `npm run bundle:check` output and final SHA-256 file
- [ ] Package filename, checksum, and fresh-theme install result
- [ ] Playwright route/interaction smoke-test result
- [ ] Automated axe-core accessibility report
- [ ] Manual keyboard, screen-reader, zoom, reflow, and contrast report
- [ ] Lighthouse reports
- [ ] Browser/device matrix
- [ ] Approved listing copy, screenshots, demo URL, support URL, and license
      clearance

Current automated/package evidence belongs in `docs/qa-baseline-1.0.0.md`.
Rows requiring merchant configuration, special Shopify resources, physical
devices, checkout, or human judgement must never be inferred from automated
route checks.
