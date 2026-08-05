# Modeframe 2.0 merchant guide

Modeframe is an editorial Shopify Online Store 2.0 theme for visually led
brands. Shopify continues to manage products, inventory, payments, checkout,
tax, shipping, customer data, and orders.

## Install and update safely

When Modeframe is approved and available, install or trial it through the
Shopify Theme Store and leave it unpublished while configuring it. Review and
QA operators may instead upload the signed-off
`Modeframe-2.0.0-theme.zip` as an unpublished theme.

Before replacing an existing storefront:

1. Duplicate the current live theme and keep the original as rollback.
2. Configure Modeframe in an unpublished copy.
3. Add identity, navigation, content, products, policies, and store settings.
4. Preview desktop and mobile and complete a supported test-payment flow.
5. Publish only after the store's release checklist passes.

Theme settings and JSON templates do not automatically merge between theme
copies. For an update, duplicate the live theme, preserve its merchant-owned
configuration, merge new template structure deliberately, and test again.

## First-run checklist

- Add primary and optional inverse logos, favicon, menus, social links, and
  footer content.
- Complete Shopify policies, shipping, tax, payments, markets, customer
  accounts, and localization.
- Choose one of the three art directions and review every section color role.
- Select real products, collections, blogs, pages, images, and videos.
- Configure Search & Discovery filters and recommendations where used.
- Configure cart behavior, optional free-delivery threshold, curated additions,
  and empty-cart destination.
- Check home, collection, product, search, cart, contact, accounts, policies,
  password, gift card, and 404 before publishing.

## Art directions and design controls

**Theme settings > Global styles** offers three coordinated directions:

- **Studio light** — editorial, warm, and light-led (`paper`)
- **Studio dark** — high-contrast and dark-led (`ink`)
- **High signal** — graphic and accent-led (`signal`)

These are internal settings, not separate theme presets. Every direction keeps
Paper, Ink, Signal, and Electric section color roles available. Identity,
Shopify fonts, type scale, page width, spacing, button/card/media/input radii,
product cards, search, cart, motion, and social links are global controls.

Use the inverse logo for dark header contexts. If it is blank, Modeframe falls
back to the primary logo.

## Header, navigation, and search

Choose one of three desktop layouts: centered split navigation, centered
stacked navigation, or left-inline navigation. Nested menu items become
disclosure navigation and can include up to three promotional image cards tied
to top-level menu labels. Review every promotion on desktop and mobile.

Predictive search is controlled in theme settings and supports keyboard
navigation, result announcements, Enter activation, Escape collapse, and the
standard search page fallback. The account entry follows the customer-account
type enabled in Shopify.

## Product cards and collections

Cards can show indexed editorial numbering, vendor or product type, secondary
media, sale/sold-out badges, price, native swatches, and quick add. Quick add is
shown only when a product can be added without another required variant or
selling-plan choice.

Collection and search templates support Shopify filters, sorting, pagination,
and responsive grids. A collection can include up to two editorial breaks at
chosen product positions. Assign `collection.editorial` when a collection needs
an opening story plus in-grid campaign notes. Configure filter data through
Shopify Search & Discovery.

## Product pages

The product section provides mosaic and focused gallery layouts, sticky product
information on larger screens, a mobile buy bar, and reorderable vendor, title,
subtitle, price, SKU, variants, quantity, buy buttons, inventory, pickup,
description, product notes, details, share, app, and Custom Liquid blocks.

Native supported states include images, hosted and external video, 3D models,
swatches, variant media, compare-at price, unit price, quantity rules, pickup,
accelerated checkout, gift-card recipients, recommendations, and app-created
selling plans. Store eligibility and apps determine availability; Modeframe
does not create Shopify services.

Use Product specifications for structured material, fit, origin, dimensions,
care, or other details. Values may be written directly or connected to dynamic
sources supported by Shopify.

## Signature content

- **Flexible content** composes Shopify theme blocks and app blocks inside an
  art-directed width and color role.
- **Shoppable lookbook** connects campaign imagery to products through
  keyboard-accessible hotspots and a linked product index.
- **Product specifications** combines product media, structured definition
  data, and expandable supporting information.

Assign `page.lookbook` to a campaign page for an introduction, shoppable image,
and related product edit. Replace all placeholder copy, imagery, and product
selectors before publication.

## Cart and checkout handoff

Choose drawer or page cart. Both preserve variants, custom properties, selling
plans, discounts, quantity rules, unit prices, notes, totals, and Shopify's
checkout controls. The drawer can show a merchant-set free-delivery progress
target, up to two products from a curated collection, and a chosen collection
when empty.

Shopify remains responsible for pricing, discount, tax, shipping, payment, and
checkout calculations. Test all configured payment and accelerated-checkout
paths before publishing.

## Accessibility, motion, and apps

Use meaningful headings, image alt text, link labels, and logical section order.
Test navigation, search, filters, hotspots, variants, cart, and forms by
keyboard. Slideshow and decorative motion respect reduced-motion preferences;
motion intensity can be disabled globally.

Add integrations through app blocks where supported. Use Shopify Customer
Events or a reviewed pixel app for analytics. Never paste API keys, passwords,
tokens, customer data, or private credentials into settings, Custom Liquid,
JavaScript, or CSS.

## Rollback and troubleshooting

Keep the previous live theme until the new version has passed production-safe
checks. If a release blocker appears, republish the previous theme and diagnose
the update in an unpublished copy.

Before requesting support:

1. Reproduce the issue in an unmodified Modeframe copy.
2. Temporarily disable recently added app embeds or Custom Liquid.
3. Record the affected route, browser/device, steps, expected result, and actual
   result without including customer data or credentials.
4. Confirm the Modeframe version under **Theme settings > Theme info**.

See [FAQ](faq.md) and [support policy](support-policy.md). Support requests:
<https://brandd.co.uk/contact>.
