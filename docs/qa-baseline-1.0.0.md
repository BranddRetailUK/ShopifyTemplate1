# Modeframe 1.0.0 QA baseline

Candidate built and checked locally on 1 August 2026. This record still needs a
demo theme identifier, browser/device evidence, tester sign-off, and evidence
links before publication.

## Automated repository checks

- Theme Check: **pass**, 85 files, zero offenses
- Release structure: **pass**, Modeframe 1.0.0, one preset, six visual modes
- Static QA/security scan: **pass**
- Source provenance guard: **pass**, 86 theme files; legal review still required
- Marketplace archive validation: **pass**, structure/isolation/embed/checksum
- npm production dependency audit: **pass**, zero production dependencies and
  zero known vulnerabilities after the old local dependency tree was isolated
- Installable entries: 95
- `Modeframe-1.0.0-theme.zip` SHA-256:
  `a31628f232ae15e014ce7a857c5841649b97b6d6949dfd2a3ef662ca629e82dd`
- `Modeframe-1.0.0-marketplace.zip` SHA-256:
  `ff041f8c36fb422b206f8bb6d71eeee0bf5357150b3f9b50cd6db6bb4f46849e`
- Browser automation: blocked until a packaged-theme QA URL and password are
  supplied outside Git

## Manual/platform evidence

- Fresh package installation: pending
- Shopify Theme Editor operations: pending
- Desktop browser matrix: pending
- Physical iOS/Android devices: pending
- In-app webviews: pending
- Keyboard/screen-reader/zoom/reflow: pending
- Checkout/test order: pending
- Lighthouse home/collection/product: pending

The open rows above are deliberately not inferred from earlier prototypes or a
working development theme. Only results produced by this exact 1.0.0 archive
belong in the remaining release record. Rebuilding the ZIP changes its checksum
and requires this record to be refreshed.
