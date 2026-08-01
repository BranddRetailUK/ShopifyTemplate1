# Modeframe Shopify theme contract

## Product

Modeframe is a proprietary Shopify Online Store 2.0 Liquid theme for fashion,
lifestyle, design, art, product, and creative retail brands. Its visual language
uses oversized editorial typography, strong light/dark contrast, graphic accent
rails, modular merchandising, controlled motion, and compact utility copy.

The current release is `1.0.0`. The Shopify install preset and theme metadata
are both named Modeframe. Paper, Ink, Signal, Electric, All light, and All dark
are internal Global styles, not separate install presets.

ThemeForest is the first active commercial channel. The product is not prepared
or represented as a Shopify Theme Store submission. The installable theme and
core documentation remain portable, while the buyer archive, listing fields,
support/refund language, preview media, and reviewer notes are specifically
prepared for ThemeForest. A future Theme Store edition would require ending
third-party distribution because Shopify requires channel exclusivity.

## Source and licensing

The storefront implementation is maintained as Modeframe source. An early
prototype used Shopify's Skeleton reference structure; the small files found to
be identical or nearly identical during the 1.0 audit were independently
reimplemented. The provenance check prevents those exact upstream files from
returning, but it is technical evidence rather than a legal conclusion about
the remaining theme as a whole. `LICENSE.md` governs repository access; the
ThemeForest buyer bundle relies on Envato's controlling license and includes an
Envato license notice plus asset credits. The channel-neutral marketplace
license remains an internal legal-review draft and is not shipped to ThemeForest
buyers.

The final seller must still complete marketplace-specific and professional
legal review of the product name, source provenance, buyer license, listing
claims, asset rights, taxes, refunds, and seller terms before publication.

## Runtime

The repository root is the Shopify theme. Storefront files live in `assets`,
`blocks`, `config`, `layout`, `locales`, `sections`, `snippets`, and `templates`.
The storefront has no application server, database, custom API, analytics
service, or secret-bearing runtime. A separate companion license service lives
in `services/license-api` and runs in the dedicated Railway
`modeframe-licensing` project with private PostgreSQL. It is outside the theme
ZIP and is never required for storefront rendering or commerce.

A separate cookie-free public presentation and documentation service lives in
`services/marketplace-site` and runs in the Railway `modeframe-marketplace`
project. It serves the iframe-compatible preview landing page, documentation,
support, privacy, refund, and health routes. ThemeForest may frame this service;
the Shopify demo itself opens in a new tab because Shopify prevents third-party
framing. The development-store password is intentionally public for demo access
and is rendered from Railway configuration; it is never committed to source.

`layout/theme.liquid` owns the document, SEO, fonts, assets,
`content_for_header`, header/footer section groups, skip navigation,
`content_for_layout`, and optional cart drawer. JavaScript is unminified vanilla
JavaScript served from Shopify's theme CDN. Native Shopify endpoints remain the
fallback when JavaScript is unavailable.

## Global storefront

- Sticky tone-aware header with six desktop compositions, mobile dialog menu,
  nested navigation, account component, predictive search, and cart count.
- Announcement messages with optional links.
- Footer with merchant identity, menus, social links, localization, policies,
  enabled payment icons, Shopify attribution, and optional Follow on Shop.
- Native Shopify newsletter, contact, customer, password, article-comment,
  product, cart, localization, and gift-card flows.
- Native dialogs restore focus and close through Escape, explicit controls, and
  backdrop interaction.

## Commerce

- Product gallery supports images, hosted and external video, and 3D models.
- Merchant-orderable product blocks cover identity, price, SKU, variants,
  quantity, buying, inventory, pickup, description, details, sharing, app
  content, and Custom Liquid.
- Variant selection updates IDs, URL, media, price, compare-at price, unit
  price, SKU, availability, quantity rules, pickup, and selling plans.
- Selling plans submit through the native product form and expose plan pricing,
  checkout-charge amounts, and cart/order labels.
- Collections and search support native filters, sorting, pagination, mixed
  result types, product states, quick add, and unit pricing.
- Drawer and page carts support properties, selling plans, discounts, quantity
  rules, unit prices, taxes, notes, accelerated checkout, and error states.

## Content templates and sections

JSON templates cover home, product, collection, collection list, cart, search,
page, contact, blog, article, password, and 404. Liquid templates cover gift
cards and classic customer accounts.

The merchant library includes Hero, Slideshow, Scroll Bridge, Motion Accents,
Scrolling text, Rich text, Feature grid, Media with text, Featured collection,
Featured product, Collection list, Testimonials, Logo list, Featured blog,
Video, Collapsible content, Newsletter, Call to action, and Custom Liquid.
Major visual sections expose `data-nav-tone` for fixed-header contrast.

## Design system and accessibility

Global settings cover logo, favicon, Shopify fonts, type scale, layout,
component radii, four paired role palettes, uniform light/dark palettes, product
cards, search, cart, motion, and social links. Sections can select a role palette
and optionally override its background.

Images use Shopify's CDN, responsive sources, explicit sizes and dimensions,
focal positioning, and viewport-appropriate loading. Interactive controls have
visible focus treatment and practical touch targets. Motion is decorative,
respects `prefers-reduced-motion`, supports a global off setting, and preserves
complete static layouts.

## Distribution

`npm run bundle` creates `release/Modeframe-1.0.0-theme.zip`, the ThemeForest
buyer archive `release/Modeframe-1.0.0-themeforest.zip`, and the operator-only
listing/media archive `release/Modeframe-1.0.0-themeforest-preview.zip`. The
buyer archive contains the inner installable theme, beginner HTML and Markdown
documentation, FAQ, quick start, support policy, Envato license notice, credits,
release notes, activation instructions, and checksums. Repository tooling,
credentials, tests, store identifiers, listing media, and internal QA evidence
are excluded from the buyer archive.

The public listing title is “Modeframe | Modern Editorial Shopify Theme.”
ThemeForest field values, description, tags, feature list, and reviewer notes
live in `themeforest/`. Listing media live in `marketing/themeforest/`; the
required cover is 2340×1560 and presentation images/video use 1920×1080, with
separate 1080×1920 mobile captures.
Every distributed image, logo, video, font, testimonial, and description must
have a recorded commercial-use basis in `distribution/ASSET-CREDITS.txt`.

Buyer purchase-code activation is hosted at
`https://modeframe-licensing-production.up.railway.app`. The service verifies
an Envato author sale server-side, stores only a keyed purchase-code
fingerprint, and binds it to one permanent `myshopify.com` domain. Activation
governs support and future update services; it never disables installed theme
functionality. Live verification remains closed until the final marketplace
item ID and seller token are stored only in Railway.

## QA and release gate

`npm run verify` runs Theme Check, release structure validation, source
provenance checks, static QA, license-service unit tests, and public-site unit
tests. `npm run qa:browser` runs Playwright against a dedicated store configured
through ignored environment values across desktop Chromium, Firefox, WebKit and
mobile Chromium/WebKit. It applies reduced motion before navigation, runs
axe-core serious/critical checks, and excludes Shopify-injected preview/privacy
controls from theme-owned findings. `npm run qa:lighthouse` records mobile and
desktop Lighthouse evidence for home, collection, and product routes, while
`npm run qa:media` captures exact-store screenshots and a 1920×1080 preview
video. The separate `qa:marketplace-site` and
`qa:marketplace-site:lighthouse` commands validate the public ThemeForest layer.
`npm run bundle` and `npm run bundle:check` build and validate the buyer
deliverable.

Automated passes do not replace the human and platform cases in
`docs/qa-matrix.md`. Public sale remains blocked until name/legal review,
demo/storefront content rights, customer-accessible demo credentials, live Envato
activation credentials, browser/device matrix, keyboard/screen-reader review,
checkout cases, and special Shopify fixtures are recorded as complete in
`docs/marketplace-readiness.md`.

## Security and operations

- Never commit `.env`, CLI state, storefront passwords, Admin API credentials,
  store domains, theme IDs, marketplace tokens, purchase codes, license hash
  secrets, customer data, or merchant-owned settings.
- Keep marketplace verification and purchase-code fingerprints server-side;
  never add activation secrets or blocking DRM to the theme.
- Use an unpublished theme or dedicated demo store for QA.
- Treat `config/settings_data.json` from a merchant store as merchant-owned.
- Confirm archive contents and SHA-256 checksums before marketplace upload.
- Retain the previous marketplace release and release notes for buyer updates.
- Keep the public demo aligned with the shipped default preset.

## Change rules

- Update this contract when product behavior, sections, settings, packaging,
  documentation, support, QA, or distribution changes.
- Prefer existing sections, snippets, CSS variables, and custom elements.
- Preserve native Shopify form fallbacks and the shared scroll-motion runtime.
- Keep every motion surface complete under reduced motion and global motion off.
- Run `npm run verify`; run and validate the sales bundle for release changes.
