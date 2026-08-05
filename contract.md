# Modeframe Shopify theme contract

## Product and active route

Modeframe is a proprietary Shopify Online Store 2.0 Liquid theme for fashion,
lifestyle, design, art, and other visually led retail brands. Its design system
uses editorial typography, controlled contrast, art-directed merchandising,
clear utility copy, and purposeful motion without replacing Shopify's native
commerce behavior.

The current release is `2.0.0`. The theme metadata and the single install preset
are named Modeframe. The active commercial route is the Shopify Theme Store.
Studio light (`paper`), Studio dark (`ink`), and High signal (`signal`) are three
internal art directions, not separate install presets. Each coordinates the
Paper, Ink, Signal, and Electric section color roles.

Creative Market and ThemeForest collateral, services, scripts, and release
archives describe the historical 1.0 third-party route. They are retained for
provenance and reproducibility, excluded from the 2.0 Theme Store archive, and
must not be presented as current distribution. Before resubmission, every
third-party listing, sale path, and buyer download must be withdrawn and the
result recorded. External withdrawal is not yet verified.

## Origin, source, and licensing

Modeframe's visual system and interaction model originated in Brandd's
standalone Next.js site. The Shopify theme was repurposed from that work; it was
not built on Dawn or Horizon.

An early Shopify port consulted Shopify's Skeleton reference structure. The
small exact or near-exact overlaps identified during the 1.0 source audit were
reimplemented. `npm run provenance:check` retains a hash-based regression guard
against those known upstream files. This is useful technical evidence, not a
legal opinion about copyright, derivative works, trademarks, or distribution
rights.

`LICENSE.md` governs repository access. Shopify's Theme Store agreement and
applicable merchant terms govern the active distribution route. A qualified
reviewer must clear the Modeframe name, ownership and assignment history,
source provenance, demo assets, listing claims, and third-party withdrawal
before submission.

## Runtime boundary

The repository root is the Shopify theme. Installable files live only in
`assets`, `blocks`, `config`, `layout`, `locales`, `sections`, `snippets`, and
`templates`. The storefront has no required application server, custom API,
database, analytics service, marketplace activation, or secret-bearing runtime.

Historical marketplace presentation and purchase-code services under
`services/` are outside the theme, are not included in the 2.0 bundle, and are
not required for storefront rendering or support eligibility on the Theme Store
route.

`layout/theme.liquid` owns document metadata, Shopify headers, shared assets,
section groups, skip navigation, page content, and optional cart drawer.
Unminified vanilla JavaScript is served from Shopify's theme CDN. Native routes
and forms remain the fallback when JavaScript is unavailable.

## Storefront system

- A sticky tone-aware header provides three desktop layouts, nested navigation,
  promotional menu cards, inverse-logo support, customer accounts, accessible
  predictive search, mobile navigation, and cart state.
- Announcement and footer groups expose merchant-controlled messages, menus,
  social links, localization, policies, payment icons, Shopify attribution, and
  Follow on Shop where available.
- Native dialogs close explicitly or with Escape, restore focus, and preserve
  keyboard navigation.
- Shopify newsletter, contact, customer, password, article-comment, product,
  cart, localization, and gift-card flows remain platform-native.

## Commerce and merchandising

- Product cards support indexed editorial presentation, optional vendor,
  secondary media, native swatches, sale and sold-out states, unit prices, and
  safe quick add only when no further choice or selling plan is required.
- Collections and search provide Shopify filters, sorting, pagination, mixed
  results, adjustable grids, and designed empty states. Collection templates can
  insert up to two merchant-positioned editorial story tiles.
- The product page supports mosaic and focused galleries, images, hosted and
  external video, 3D models, sticky information, a mobile buy bar, subtitle and
  product-note blocks, app blocks, Custom Liquid, and native commerce controls.
- Variant selection updates IDs, URL, media, price, compare-at price, unit price,
  SKU, availability, quantity rules, pickup, selling plans, and submit state.
- Drawer and page carts support properties, selling plans, discounts, quantity
  rules, unit prices, notes, taxes, policies, and accelerated checkout. The
  drawer can add free-delivery progress, curated products, and a merchant-chosen
  empty-cart route.

## Templates and section library

Core JSON templates cover home, product, collection, collection list, cart,
search, page, contact, blog, article, password, and 404. Liquid templates cover
gift cards and classic customer accounts.

The default home, collection, and product templates are art-directed for 2.0.
Alternative templates add `collection.editorial` for collection storytelling
and `page.lookbook` for campaign shopping. Signature sections are:

- Flexible content, with theme blocks and app blocks;
- Shoppable lookbook, with keyboard-accessible product hotspots and a product
  index; and
- Product specifications, with structured specifications, expandable detail,
  and product-media support.

The broader library retains Hero, Slideshow, Scrolling text, Rich text, Feature
grid, Media with text, Featured collection, Featured product, Collection list,
Featured blog, Video, Collapsible content, Newsletter, Call to action, Scroll
Bridge, Motion Accents, Testimonials, Logo list, and Custom Liquid.

## Design and accessibility

Global settings cover identity, optional inverse logo, Shopify fonts, type
scale, layout, component and media radii, art direction, product cards, search,
cart, motion, and social links. Section role colors retain automatic readable
foreground selection for custom backgrounds.

Images use Shopify's CDN, responsive sources, explicit dimensions, focal
positioning, and appropriate loading. Interactive controls require visible
focus and practical touch targets. Motion is decorative, respects
`prefers-reduced-motion`, supports a global off state, and leaves complete
static content. Predictive search, menus, dialogs, filters, lookbook hotspots,
forms, and cart updates must remain keyboard and assistive-technology usable.

## Theme Store release package

`npm run bundle` derives the release identity from package and theme metadata,
uses Shopify CLI packaging, clears generated `release/` contents, and creates
only `release/Modeframe-2.0.0-theme.zip` plus `release/SHA256SUMS.txt`.

`npm run bundle:check` requires exactly those two files. It rejects wrapper
folders, non-theme roots, development or sensitive paths, duplicate or unsafe
archive entries, missing signature sections, metadata mismatch, unexpected
buyer bundles, and an incorrect checksum. Historical marketplace builders are
retained but are not default release commands.

## QA and release gate

`npm run verify` runs Theme Check, 2.0 release-structure validation, source
provenance, static QA, and maintained companion-service tests. It does not
depend on an external store. Run `npm run bundle` before the remote gate.

`npm run release:gate` reruns local verification, validates the exact bundle,
then runs Playwright and Lighthouse against an ignored QA configuration.
Playwright covers rendering, serious accessibility rules, predictive and
standard search, filters, variant state, product and cart mutation,
representative content, true 404 behavior, and keyboard focus across desktop
and mobile projects where fixtures permit. Lighthouse rejects access pages,
redirected routes, and wrong final paths and requires at least 60 performance
and 90 accessibility for every configured home, collection, and product run.

Automated checks do not replace Theme Editor, screen-reader, physical-device,
webview, checkout, market, app, gift-card, subscription, unit-price, and other
special-resource cases in `docs/qa-matrix.md`. The 1.0 baseline is historical
only and cannot be used as 2.0 release evidence.

## Store deployment, merchant data, and rollback

Every release uses two unpublished candidates:

1. A clean install of the exact ZIP validates packaged defaults, alternative
   templates, empty states, editor schemas, and the reviewer experience.
2. A duplicate of the current live theme validates the production migration.
   Code is pushed with deletion disabled while merchant-owned
   `config/settings_data.json`, section-group JSON, and existing template JSON
   are preserved. New templates are added separately; changes to existing
   templates are merged or recreated deliberately in the Theme Editor.

Never push directly to the published theme. Record private candidate IDs and
checksums outside source, compare both candidates, and publish only after the
full gate passes. Keep the previous live theme intact as the rollback target.
If production checks fail, republish it immediately, then investigate in the
unpublished candidate.

This workspace does not currently have authenticated Shopify CLI access or a
confirmed target theme. Store deployment, publication, and post-publication
validation remain pending. No store domain, password, or theme ID belongs in
the repository.

## Change rules

- Update this contract when product behavior, settings, sections, packaging,
  documentation, QA, support, provenance, or distribution changes.
- Preserve native Shopify forms and no-JavaScript routes.
- Treat pulled merchant JSON as merchant-owned and never normalize it into the
  repository defaults.
- Keep all motion surfaces complete under reduced motion and motion-off states.
- Run `npm run verify`; for a release, rebuild the bundle, validate both
  unpublished candidates, record human evidence, and retain rollback.
