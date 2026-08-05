# Modeframe 2.0 demo, QA, and deployment setup

Use unpublished Shopify themes for release work. Do not use production as the
first test target, expose private merchant data in evidence, or commit a store
domain, storefront password, theme ID, token, or pulled merchant settings.

## Required roles

| Candidate | Purpose | Configuration rule |
|---|---|---|
| Clean install | Theme Store reviewer/default experience | Upload the exact 2.0 ZIP; use packaged defaults |
| Migration | Production-safe upgrade | Duplicate live; preserve merchant JSON |
| Previous live | Immediate rollback | Do not edit or delete during release |

A separate rights-cleared public demo can point at the clean candidate. Keep
special test orders, internal apps, customer data, and private fixtures out of
public presentation.

The Theme Store submission demo must be prepared on an eligible client-transfer
store and match the clean release. Treat an existing merchant storefront only
as a private migration/regression target, not automatically as the submission
demo.

## Prerequisites

1. Obtain authorized Shopify admin and CLI access through the normal operator
   workflow; never paste credentials into documentation or chat.
2. Confirm the intended store and target themes in Shopify admin. Record their
   identifiers only in an ignored local environment or secure runbook.
3. Run `npm ci`, `npm run verify`, `npm run bundle`, and
   `npm run bundle:check`.
4. Record the archive checksum privately with the release evidence.
5. Prepare populated product, collection, page, search, cart, account, market,
   app, gift-card, subscription, media, and filter fixtures.

## Candidate A — clean install

1. In **Online Store > Themes**, use **Add theme > Upload zip file**.
2. Upload `release/Modeframe-2.0.0-theme.zip` and leave it unpublished.
3. Confirm Modeframe 2.0.0, one install preset, and the three art directions.
4. Test the default home, product, and collection templates.
5. Assign and test `collection.editorial` and `page.lookbook`.
6. Add, remove, reorder, duplicate, hide, save, and reload all supported
   sections and blocks, including Flexible content, Shoppable lookbook, Product
   specifications, and app blocks.
7. Test empty and populated states before adding demo content.
8. Add rights-cleared content and run the full QA matrix against its preview.

This candidate proves what a reviewer or new merchant receives. Do not replace
its packaged JSON with configuration pulled from another theme.

## Candidate B — merchant-preserving migration

1. In Shopify admin, duplicate the current live theme. Leave both unpublished
   duplicate and previous live theme intact.
2. Pull or download a private backup of the duplicate outside this repository.
3. Diff remote `config/settings_data.json`, section-group JSON, and template JSON
   against source. Treat the remote versions as merchant-owned.
4. Push code to the duplicate only, with deletion disabled. Exclude
   `config/settings_data.json`, existing `templates/*.json`, and header/footer
   section-group JSON from the bulk push.
5. Add the two new alternative templates separately because they do not replace
   an existing merchant template.
6. Merge changes to default product, collection, and home templates explicitly,
   or recreate their 2.0 section structure in the Theme Editor. Never overwrite
   merchant section IDs or settings without a reviewed mapping.
7. Normalize retired 1.0 values in the private duplicate before opening the
   editor: map `electric` to `signal`, `all-light` to `paper`, and `all-dark` to
   `ink`; map `center-left` to `center-split`, and map `left-centered` or
   `right-inline` to `left-inline`. Confirm the result visually rather than
   relying on an invalid legacy select value.
8. Configure new header promotions, inverse logo, card swatches, cart progress,
   curated additions, product specifications, and lookbook content as needed.
9. Run the same matrix as the clean install and compare all core routes.

The CLI command must name the unpublished duplicate explicitly. Never use
`--allow-live`, `--publish`, or an unverified default theme target during this
phase.

## Automated preview QA

Copy `.env.example` to an ignored `.env.qa` and provide only the preview
configuration required by the test runner. Then run:

```bash
npm run qa:browser
npm run qa:lighthouse
npm run release:gate
```

Run the gate against each candidate and archive Playwright, axe, Lighthouse,
route, checksum, and fixture-skip evidence. Credentials and full preview URLs do
not belong in committed reports.

## Publication

1. Confirm the previous live theme is still available and renders correctly.
2. Obtain explicit approval for the migration candidate and a rollback owner.
3. Publish the migration candidate in Shopify admin.
4. Immediately check home, navigation, predictive search, collection filters,
   representative variants, add/remove cart, content, account entry, policies,
   404, and checkout handoff.
5. Run production-safe Playwright and Lighthouse checks without placing a real
   order or changing merchant data.
6. Record the result privately. Do not commit store identifiers or credentials.

If a blocker appears, republish the previous live theme immediately. Keep the
2.0 candidate unpublished for diagnosis and repeat the full gate before another
publication attempt.

## Current status

Authenticated Shopify access and confirmed target themes are not available in
the current workspace. Neither candidate has been deployed or validated live in
this session, and publication remains pending authorization.
