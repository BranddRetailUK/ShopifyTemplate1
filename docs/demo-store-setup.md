# Modeframe demo and QA store setup

Use a dedicated Shopify development store for marketplace presentation and
release QA. Do not use a merchant's production store as the permanent sales
demo or expose its private data in evidence.

Railway cannot host the Shopify storefront because Shopify Liquid, products,
collections, checkout, Theme Editor, Markets, and native forms require a
Shopify store. Railway hosts Modeframe's iframe-compatible ThemeForest preview,
public documentation/legal pages, and companion license service.

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
5. Put the canonical demo URL only in Railway or ignored QA environment
   variables. Never commit the store domain, password, theme ID, or credentials.

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
7. Run `npm run qa:browser`, `npm run qa:lighthouse`, and `npm run qa:media`
   against the preview URL, then complete `docs/qa-matrix.md`.
8. Capture approved screenshots, motion video, browser evidence, and current
   Lighthouse reports.
9. Point the Railway preview service's `DEMO_STORE_URL` variable at the final
   public demo. ThemeForest embeds the Railway page; the Shopify demo opens in a
   new tab because Shopify prohibits third-party framing.
10. If the development store remains protected, set `DEMO_STORE_PASSWORD` only
    in Railway so the preview landing page can show the public demo credential.
    Never commit the value to source or include it in the buyer ZIP.

## Shopify configuration outside theme code

- Selling plans require a compatible purchase-options app.
- Pickup requires locations, inventory, and pickup configuration.
- Unit price, Shop Pay instalments, markets, currency, duties, tax, shipping,
  and payment cases depend on store configuration and eligibility.
- Follow on Shop depends on Shop channel/payment setup.
- App-block tests require representative installed apps.
- Orders require Shopify's supported test gateway or provider test mode.

## Public-demo gate

Shopify development stores remain password protected. A protected demo is
customer-accessible when the iframe landing page displays the current public
demo credential. Publish it only when assets and statements are commercially
cleared; all
core routes work on desktop/mobile; test customers/orders/internal app names are
absent; the demo matches the distributed version; and support, documentation,
privacy, refund, and licensing links are final.
