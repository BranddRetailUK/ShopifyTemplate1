# Modeframe source-provenance record

## Known history

An early theme prototype used Shopify's Skeleton reference structure. The 1.0
commercial audit compared the current storefront directories against Skeleton
commit `a4f32d393b9eadf6c4403318ca39116832e5d1df` and identified six files that
were identical or almost identical: the layout-group block, text block, account
icon, image snippet, metadata snippet, and schema locale. Those implementations
were replaced for Modeframe 1.0.0.

The current theme is substantially larger and functionally broader than that
reference: it adds the full commerce/editorial section system, storefront
JavaScript, customer templates, cart drawer, selling plans, product/collection
systems, six global modes, and supporting UI. Structural ancestry can still be
legally relevant even when no file is byte-identical, so similarity metrics and
new code volume are not treated as proof of independent ownership.

## Automated guard

`npm run provenance:check` hashes all installable theme files and rejects the
known exact upstream file hashes. It also rejects the retired upstream identity
and commit reference inside distributable theme source. This protects against
accidental reintroduction; it does not decide copyright, derivative-work, or
marketplace-license questions.

## Commercial gate

Before any paid third-party distribution, qualified counsel must review:

- the repository and commit history available to the seller;
- the reference license in force when the prototype was created;
- the current file-level and structural comparison;
- ownership/assignment of all Brandd contributions;
- the chosen marketplace's mandatory buyer license and author terms; and
- whether further clean-room replacement or permission is required.

Until that review is recorded, the buyer license remains marked draft and the
marketplace readiness document remains **not publication-ready**.
