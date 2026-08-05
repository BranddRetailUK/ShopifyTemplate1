# Modeframe 2.0 Theme Store QA matrix

Record the candidate role, archive checksum, private theme reference,
browser/device, tester, date, result, and non-sensitive evidence link for every
run. An unchecked row is a release gap, not an implied pass. The 1.0 baseline is
historical and cannot be used as 2.0 evidence.

## Operator sequence

1. Run `npm ci` and `npm run verify`.
2. Run `npm run bundle && npm run bundle:check`.
3. Upload `release/Modeframe-2.0.0-theme.zip` as the clean unpublished candidate.
4. Duplicate the current live theme as a separate unpublished migration
   candidate; preserve merchant JSON during the code push and template merge.
5. Configure ignored QA values for the exact preview candidate and required
   product, collection, content, and search fixtures.
6. Run `npm run release:gate` against each candidate and archive Playwright,
   axe, Lighthouse, checksum, final-route, and fixture-skip evidence.
7. Complete editor, screen-reader, device, webview, checkout, market, app, and
   special-product rows.
8. Publish only the migration candidate after approval, then rerun
   production-safe checks. Roll back immediately on a release blocker.

`release:gate` validates source, bundle, and configured storefront behavior. It
does not install, deploy, publish, or prove that the remote theme matches the
ZIP; record that parity separately. Lighthouse must finish on the requested
route, not a password, challenge, login, or redirected page. Each home,
collection, and product run must meet 60 performance and 90 accessibility by
default. Threshold overrides may raise, never lower, those floors.

## Package and clean install

- [ ] Release directory contains only the 2.0 theme ZIP and checksum
- [ ] Checksum independently matches the ZIP
- [ ] ZIP uploads with no wrapper, development file, schema, or translation error
- [ ] Theme info and single preset show Modeframe 2.0.0
- [ ] Studio light, Studio dark, and High signal work across Paper, Ink, Signal,
      and Electric section roles
- [ ] Default home, product, collection, cart, search, page, blog, article,
      password, gift-card, customer, and 404 templates render
- [ ] `collection.editorial` and `page.lookbook` can be assigned and removed

## Merchant-preserving migration

- [ ] Current live theme duplicated and previous live copy retained
- [ ] Private backup captured before code push
- [ ] Push targets the unpublished duplicate explicitly and disables deletion
- [ ] Remote `settings_data.json`, section groups, and existing template JSON are
      not overwritten
- [ ] New templates added separately; existing template changes merged deliberately
- [ ] Merchant navigation, footer, app embeds, content, template assignments, and
      settings remain intact
- [ ] Clean and migration candidates compared across all core routes
- [ ] Rollback publication rehearsed or verified by the responsible operator

## Theme Editor

- [ ] Add, remove, reorder, duplicate, hide, restore, save, and reload every
      section type
- [ ] Add theme blocks and app blocks to Flexible content
- [ ] Select blocks in Slideshow, product, lookbook, specifications, and header
      promotions
- [ ] Empty selectors show useful placeholders without broken storefront content
- [ ] Dynamic sources work for eligible product specification settings
- [ ] Custom background foreground contrast updates correctly
- [ ] No schema, translation, editor-event, or section-reload errors

## Header and global storefront

- [ ] All three desktop header layouts and responsive mobile menu
- [ ] Primary and inverse logo across light/dark section transitions
- [ ] Two- and three-level navigation, long labels, disclosure keyboard behavior
- [ ] Up to three menu promotion cards on desktop and mobile
- [ ] Predictive search arrow keys, active descendant, Enter, Escape, Tab, status
      announcements, no results, aborts, and standard-search fallback
- [ ] Classic and new customer account entry
- [ ] Announcement, footer, policies, social links, localization, payment icons,
      Shopify attribution, and Follow on Shop
- [ ] Skip link, focus order, focus visibility, 200% zoom, and 400% reflow

## Product cards, collections, and search

- [ ] Product cards: default, sale, sold out, unit price, no image, vendor/type,
      secondary image, native swatches, more-swatch count, and index
- [ ] Quick add eligible product; route to PDP when choices or plans are required
- [ ] Empty, small, paginated, large, and filtered collections
- [ ] Filter rail/dropdowns on desktop and mobile; every Search & Discovery filter
      type, active removal, clear all, and no results
- [ ] Sorting and pagination preserve filters and routes
- [ ] Wide and tall editorial collection breaks at configured product positions
- [ ] Editorial collection template story, breaks, responsive grid, and links
- [ ] Search products, collections, pages, articles, no results, and pagination

## Product page

- [ ] Mosaic and focused gallery layouts
- [ ] Portrait, square, landscape, transparent, no-media, hosted video, external
      video, 3D model, alt text, thumbnails, and variant media
- [ ] Sticky information and mobile buy bar do not hide content or controls
- [ ] One-, two-, unavailable-, high-variant-, sale-, sold-out-, gift-card-, and
      subscription-only products
- [ ] Dropdowns, buttons, native color swatches, and image swatches
- [ ] Variant URL, media, price, compare-at, unit price, SKU, inventory, quantity
      rule, pickup, selling-plan, and button state updates
- [ ] Product subtitle, notes, description, details, apps, and Custom Liquid
- [ ] Product specifications with specification/detail blocks, media fallback,
      empty state, and dynamic content
- [ ] Complementary and related recommendations, including empty responses
- [ ] Selling-plan form/cart/order labels and due-at-checkout amount
- [ ] Accelerated checkout, Shop Pay installments, gift recipient, and errors

## Signature sections and content

- [ ] Flexible content with nested theme blocks, app blocks, widths, and schemes
- [ ] Shoppable lookbook with 0, 1, and multiple products; hotspot position,
      keyboard toggle, focus, product index, mobile rail, and placeholders
- [ ] `page.lookbook` introduction, lookbook, featured products, and assignments
- [ ] Product specifications with long values, page content, details, media, and
      product/non-product templates
- [ ] Hero, slideshow, scrolling text, rich text, grids, media, blog, video,
      newsletter, CTA, Custom Liquid, Scroll Bridge, and Motion Accents
- [ ] Reduced motion and global None/Subtle/Expressive motion settings

## Cart and checkout handoff

- [ ] Drawer and page cart modes
- [ ] Add, increase, decrease, remove, empty, long-cart, and error states
- [ ] Header count, drawer, and page cart remain synchronized
- [ ] Variant options, properties/uploads, unit price, selling plan, checkout
      charge, quantity rules, line/cart discounts, and notes
- [ ] Free-delivery progress below, at, and above threshold
- [ ] Curated additions with populated and empty collections
- [ ] Empty-cart text and chosen destination
- [ ] Taxes, policies, terms, accelerated checkout, and standard checkout handoff

## Platform, compatibility, and resilience

- [ ] Countries/languages, currencies, zero-decimal formats, long translations,
      RTL assessment, taxes, duties, shipping, and payment messaging
- [ ] Shopify Inbox, Shop, Search & Discovery, and representative app blocks
- [ ] Current Chrome, Safari, Firefox, Edge, iOS Safari, and Android Chrome
- [ ] Required Shopify/social webviews
- [ ] Screen reader on representative desktop and mobile platforms
- [ ] JavaScript-disabled navigation, product, cart, search, and forms
- [ ] Slow 4G, large gallery, long cart, and 25-section page
- [ ] No console errors, failed theme assets, layout shifts, or duplicate listeners

## Submission, publication, and rollback evidence

- [ ] `npm run verify`, bundle, and bundle-check outputs
- [ ] Exact archive filename, SHA-256, clean upload, and remote parity record
- [ ] Playwright/axe results and reviewed fixture skips for both candidates
- [ ] Lighthouse reports for both candidates
- [ ] Theme Editor, keyboard, screen-reader, zoom, reflow, contrast, device,
      webview, checkout, market, and app reports
- [ ] Authentic demo parity and commercial rights approval
- [ ] Theme Store listing, documentation, support form, provenance, name, and
      exclusivity approval
- [ ] Evidence that third-party listings and downloads are withdrawn
- [ ] Publication approval, previous-theme rollback reference, production checks,
      and rollback result if used

Store domains, passwords, theme IDs, tokens, customer data, and private preview
URLs must remain in ignored operator systems, never in this matrix.
