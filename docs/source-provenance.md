# Modeframe 2.0 source-provenance record

## Product origin

Modeframe's visual language and interaction model originated in Brandd's
standalone Next.js site. The Shopify implementation was repurposed from that
work. It was not built on Shopify Dawn or Horizon, and those themes are not
claimed as its architectural base.

This origin statement distinguishes design/front-end history from the later
Shopify port. It is a factual engineering record, not by itself proof of legal
ownership, assignment, originality, or Theme Store eligibility.

## Skeleton consultation and 1.0 remediation

An early Shopify port consulted Shopify's Skeleton reference structure. The 1.0
audit compared installable source against Skeleton commit
`a4f32d393b9eadf6c4403318ca39116832e5d1df` and identified six exact or
near-exact implementations: the group block, text block, account icon, image
snippet, metadata snippet, and schema locale.

Those overlaps were reimplemented for Modeframe 1.0. The 2.0 theme has since
expanded its own header, card, collection, product, cart, editorial section,
alternative-template, accessibility, and QA systems. Feature volume and a low
byte-level similarity score are useful context but are not treated as legal
proof of independent authorship.

Standard Shopify-generated JSON warning headers and ordinary platform-required
Liquid patterns are not removed merely to make the repository look different.
Comment volume is not used as a provenance or Theme Store acceptance test.

## Automated guard

`npm run provenance:check` hashes installable theme files and rejects the known
exact upstream file hashes. It also prevents the retired upstream identity and
commit reference from returning inside distributable theme source. The guard is
retained for 2.0 and should run on every release.

The guard detects a narrow regression class. It does not determine copyright,
derivative-work status, architectural uniqueness, trademark rights, or license
compliance.

## Theme Store gate

Before resubmission, the responsible owner and qualified reviewer must record:

- the Brandd Next.js repository/history supporting the visual and interaction
  origin;
- ownership or assignment for Brandd contributions and commissioned work;
- the Skeleton version/license consulted and whether that use is permitted by
  Shopify's current Theme Store rules;
- the 1.0 comparison and replacement evidence;
- a current file-level and architectural comparison against relevant themes;
- rights for demo products, copy, images, video, fonts, icons, and trademarks;
- accurate uniqueness and source claims in reviewer notes; and
- confirmation that no third-party distribution conflicts with the Theme Store
  route.

Until that review is signed off, provenance remains an open commercial and
submission gate even when the automated hash check passes.
