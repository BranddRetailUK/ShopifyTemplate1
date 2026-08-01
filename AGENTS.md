# AGENTS.md

## Startup context

Read `contract.md` before answering repository questions or changing files.
Inspect the relevant source after reading the contract.

## Product direction

Modeframe is a Shopify Online Store 2.0 theme prepared for independent and
third-party marketplace distribution. Do not add Shopify Theme Store-only
licensing, listing structure, or exclusivity assumptions unless the product
strategy changes explicitly.

## Contract maintenance

Update `contract.md` whenever the current theme surface, packaging, QA workflow,
documentation, support model, routes, sections, settings, assets, or interaction
logic changes. Keep it as a current-state description, not a changelog.

## Working rules

- Preserve unrelated merchant configuration and local credentials.
- Prefer existing components, shared data, and CSS patterns.
- Use `data-nav-tone` on major visible sections.
- Never commit `.env`, Shopify CLI state, test-store identifiers, passwords, or
  merchant data.
- Run `npm run verify` after source changes. Run `npm run bundle` when changing
  distribution files, documentation, licensing, or release identity.
