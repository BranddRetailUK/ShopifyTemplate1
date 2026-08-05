# Third-party channel history and withdrawal gate

## Historical 1.0 routes

Modeframe 1.0 was prepared for Creative Market and ThemeForest. The repository
therefore retains historical buyer-wrapper scripts, listing copy, preview media,
license notices, marketplace services, and 1.0 release evidence. These files
explain past work and may be kept privately for audit, maintenance of lawful
prior obligations, and reproducibility.

Creative Market and ThemeForest are not active Modeframe 2.0 release routes.
Historical artifacts must not appear in the 2.0 installable theme, default
`release/` output, Theme Store listing, demo messaging, or current buyer
distribution.

## Theme Store exclusivity gate

Before Shopify Theme Store resubmission, an authorized operator must:

- [ ] identify every third-party Modeframe listing, direct sale page, buyer
      download, preview purchase link, and distribution integration;
- [ ] withdraw or disable every Creative Market and ThemeForest listing and
      downloadable buyer package;
- [ ] remove public claims that Modeframe is currently sold through a
      third-party marketplace;
- [ ] stop third-party fulfilment and new-license delivery for the Theme Store
      product;
- [ ] retain dated, private evidence of each withdrawal action;
- [ ] confirm no reseller, affiliate, mirror, or direct-download route remains;
      and
- [ ] obtain business-owner confirmation that the Shopify exclusivity condition
      is satisfied.

External withdrawal is not complete or verifiable from this source workspace.
The checklist must remain open until an authorized account holder supplies
evidence.

## Prior-customer obligations

Withdrawal of new sales does not erase lawful obligations to prior purchasers.
Support, security notices, refund handling, and access to an already-purchased
historical version must be reviewed against the controlling prior marketplace
terms and legal advice. Those obligations must not be used to continue selling
or distributing the active Theme Store product through another channel.

Historical purchase-code or activation services must never control storefront
rendering, checkout, or Theme Store support eligibility. Secrets and purchase
records remain outside the theme.

## Repository and release rule

The default `npm run bundle` may create only
`Modeframe-2.0.0-theme.zip` and `SHA256SUMS.txt`. `npm run bundle:check` must
fail if a Creative Market, ThemeForest, preview, documentation wrapper, license
wrapper, or other non-theme artifact is present in `release/`.

Legacy marketplace scripts may remain callable only for historical
reproducibility. They are not part of the active quality workflow, must not be
used for a current release, and must not be described as an available sales
channel.
