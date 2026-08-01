# Modeframe demo and QA store setup

Use a dedicated Shopify development store for marketplace presentation and
release QA. Do not use a merchant's production store as the permanent sales
demo or expose its private data in evidence.

Railway cannot host the demo storefront because Shopify Liquid, products,
collections, checkout, Theme Editor, Markets, and native forms require a
Shopify store. Railway is used only for Modeframe's companion license service.

## Recommended roles

| Store | Purpose | Required state |
|---|---|---|
| Public demo | Buyer-facing listing links | Rights-cleared content, stable routes, no test/private data |
| Primary QA | Packaged-theme/editor/cart/test-order checks | Full fixture catalogue and unpublished release theme |
| Regional QA | Unit pricing, instalments, markets | Temporary eligibility-specific configuration |

One development store may serve as demo and QA initially. Split them before
launch if test orders, apps, fixtures, or frequent configuration make the public
presentation unstable.

## Store-owner setup

1. Create a Shopify development store suitable for theme testing.
2. Use a stable Modeframe demo name and avoid developer-preview features.
3. Add Shopify test data, then retain the storefront password securely.
4. Grant the theme operator access or approve Shopify CLI authentication.
5. Share only the canonical `*.myshopify.com` domain in the repository. Send
   passwords and credentials through an approved secret channel.

## Theme-operator setup

1. Build the release with `npm run bundle`.
2. Upload `release/Modeframe-1.0.0-theme.zip` as a new unpublished theme.
3. Confirm Modeframe 1.0.0, one Modeframe install preset, and Paper as the
   default Global style.
4. Import Shopify's current theme-review/performance test catalogues or create
   equivalent fixtures for variants, selling plans, media, inventory, pricing,
   and collection filters.
5. Add rights-cleared demo products, images, copy, video, 3D models,
   testimonials, logos, policies, pages, blog, menus, and SEO metadata.
6. Configure Search & Discovery filters/recommendations and representative app
   blocks.
7. Run `docs/qa-matrix.md` and `npm run qa:browser` against the preview URL.
8. Capture approved screenshots, motion video, browser evidence, and current
   Lighthouse reports.

## Shopify configuration outside theme code

- Selling plans require a compatible purchase-options app.
- Pickup requires locations, inventory, and pickup configuration.
- Unit price, Shop Pay instalments, markets, currency, duties, tax, shipping,
  and payment cases depend on store configuration and eligibility.
- Follow on Shop depends on Shop channel/payment setup.
- App-block tests require representative installed apps.
- Orders require Shopify's supported test gateway or provider test mode.

## Public-demo gate

Publish the demo only when assets and statements are commercially cleared; all
core routes work on desktop/mobile; test customers/orders/internal app names are
absent; the demo matches the distributed version; and support, documentation,
privacy, refund, and licensing links are final.
