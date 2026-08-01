# Modeframe merchant manual

Modeframe is a modern editorial Shopify Online Store 2.0 theme for fashion,
lifestyle, design, beauty, and other visually led brands. Shopify continues to
manage products, inventory, payments, checkout, tax, shipping, customer data,
and orders.

## Install safely

1. Download the complete marketplace package and unzip it on your computer.
2. In Shopify admin, open **Online Store > Themes**.
3. Select **Add theme > Upload zip file** and choose
   `Modeframe-1.0.0-theme.zip` from the package's `Theme` folder.
4. Leave Modeframe unpublished while you configure and test it.
5. Open **Customize**, add your logo, navigation, content, products, and brand
   settings, then preview desktop and mobile.
6. Run a test order with Shopify's supported test-payment workflow.
7. Duplicate your current live theme as a rollback point before publishing.

Upload only the inner theme ZIP to Shopify. The complete marketplace ZIP also
contains documentation and licensing files and is not itself installable.

## Activate the purchase

After installation, open `ACTIVATE-LICENSE.txt` from the marketplace package or
visit <https://modeframe-licensing-production.up.railway.app>. Enter the
marketplace purchase code and the store's permanent `*.myshopify.com` domain.
Do not use a custom storefront domain because it can change independently of
the Shopify store.

Activation binds support and future update eligibility to one Shopify store.
It does not remotely enable or disable the theme, and the code must never be
placed in theme settings, Custom Liquid, JavaScript, screenshots, or a public
support request. Contact support for a reviewed domain transfer.

## First-run checklist

- Add a logo, favicon, main menu, account menu, social links, and footer menu.
- Complete **Settings > Policies**, shipping, tax, payments, markets, and
  customer-account configuration in Shopify admin.
- Choose one of Modeframe's six Global styles and review every section's color
  role.
- Select real products, collections, blogs, pages, images, and video. Empty
  selectors intentionally display editor placeholders.
- Configure Search & Discovery filters and recommendations if those features
  are part of your store.
- Check home, collection, product, search, cart, contact, account, policy,
  password, gift-card, and 404 experiences before publishing.

## Global styles and design controls

**Theme settings > Global styles** offers six treatments of the same theme:

- Paper — warm, editorial, and restrained
- Ink — dark and high contrast
- Signal — vivid acid accent
- Electric — saturated violet accent
- All light — neutral white storefront
- All dark — neutral dark storefront

These are visual modes, not separate products or install presets. Typography,
page width, spacing, button/card radius, motion, search, and cart behaviour are
managed in Theme settings. Sections also expose contextual color and layout
controls.

## Header, navigation, search, and accounts

The Header section controls the desktop layout, main menu, account menu, and
color role. Nested Shopify navigation becomes accessible disclosure navigation
on larger screens and a responsive menu on smaller screens.

Predictive search is controlled under **Theme settings > Search and cart**.
The account entry uses Shopify's customer-account component and follows the
account type enabled for the store. Major visual sections communicate their
tone to the fixed header to preserve readable controls.

## Products and purchasing

The product section supports reorderable blocks for title, price, variants,
quantity, buying controls, inventory, pickup, details, sharing, apps, and
Custom Liquid. Supported storefront states include:

- Images, Shopify-hosted video, external video, and 3D models
- Dropdowns, buttons, native color swatches, and image swatches
- Variant media, availability, price, compare-at price, unit price, SKU, and
  quantity rules
- One-time purchase plus app-created subscriptions, pre-orders, and selling
  plans
- Pickup availability, accelerated checkout, Shop Pay instalments, gift-card
  recipients, and recommendations

Selling plans require a compatible purchase-options app. Availability of Shop
Pay, instalments, pickup, subscriptions, or accelerated checkout depends on
store eligibility and configuration; the theme does not create those services.

## Collections, filters, search, and quick add

Collection and search templates support Shopify filters, sorting, pagination,
and responsive grids. Configure filters through Shopify Search & Discovery.
Quick add is offered only when a product can be added without another required
choice; otherwise the card links to the product page.

## Cart and checkout handoff

Choose drawer or page cart under **Theme settings > Search and cart**. Both
surfaces can show variants, custom properties, discounts, selling plans,
quantity rules, unit prices, notes, subtotal, and Shopify's checkout controls.
Shopify remains responsible for pricing, discounts, tax, shipping, payment,
and checkout calculations.

## Sections and motion

Modeframe includes Hero, Slideshow, Scroll Bridge, Motion Accents, Scrolling
text, Rich text, Feature grid, Media with text, Featured collection, Featured
product, Collection list, Testimonials, Logo list, Featured blog, Video,
Collapsible content, Newsletter, Call to action, and Custom Liquid.

Slideshow controls pause during interaction and when out of view. Reduced
motion preferences are respected. Set the storefront-wide motion intensity to
None, Subtle, or Expressive under **Theme settings > Motion**.

## Apps, forms, analytics, and licensing

Product, cart, contact, newsletter, customer, password, and gift-card forms use
Shopify endpoints. Add supported integrations with app blocks. Use Shopify
Customer Events or a reviewed pixel app for analytics. Never paste API keys,
passwords, tokens, or customer data into theme settings, Custom Liquid,
JavaScript, or CSS.

The marketplace verification token is held by Brandd's server-side activation
service. Modeframe never contains a seller token or sends a purchase code from
the customer-facing storefront.

## Updating and rollback

Uploading a new ZIP creates another theme; Shopify does not automatically merge
all editor configuration from an older copy. Duplicate the live theme, install
the update as unpublished, transfer settings carefully, and retest before
publishing. Retain the prior version until the new one has passed checkout and
storefront checks.

## Troubleshooting

Before contacting support:

1. Reproduce the issue in an unmodified Modeframe copy.
2. Disable recently added app embeds or Custom Liquid temporarily.
3. Record the affected URL, browser/device, steps, and expected result.
4. Confirm the Modeframe version under **Theme settings > Theme info**.

See [FAQ](faq.md) and [support policy](support-policy.md). Support requests:
<https://brandd.co.uk/contact>.
