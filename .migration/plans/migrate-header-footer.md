# Header & Footer Migration + Design Plan

This plan migrates the site header/navigation and footer of natrellekorea.co.kr into the AEM Edge Delivery project — including their **visual design** — replacing the current boilerplate `nav.plain.html` and `footer.plain.html`. The homepage content and design are already migrated; header and footer are shared, site-wide fragments handled separately from page content.

**Decisions confirmed:** Header will **match the source exactly** — instrument whatever the source header contains (logo + any utility elements) and reproduce it faithfully. **Design migration is included** for both header and footer in this pass (not just content instrumentation).

## Context & Findings

- **Current state:** `content/nav.plain.html` and `content/footer.plain.html` are still Adobe boilerplate (Boilerplate nav links, "Copyright © 2025 Adobe"). Neither reflects the source site.
- **Blocks:** No custom `blocks/header/` or `blocks/footer/` overrides yet — the project uses the vendored defaults.
- **Design system already in place:** Phase 1 site design migration is done — `styles/brand.css` and `styles/styles.css` carry the brand tokens (navy `#163269`, teal `#00abc7`, gray text `#666`, Pretendard font). Header/footer CSS will consume these tokens.
- **Source header:** The "header" region resolved to `#chkForm`. The source homepage has **no traditional top navigation menu** — it opens directly into the hero, with a logo/branding area up top. The navigation orchestrator captures screenshots and reproduces exactly what's there.
- **Source footer:** `div.foot_btm` — a dark footer with the Allergan Aesthetics logo, company info (한국애브비주식회사, 대표자, address, phone), a consultation-phone line, cookie notice, and privacy/cookie/copyright links.
- **Tooling:** The navigation and footer orchestrators are screenshot-driven and both bake visual/appearance matching into their own workflows (per-element hover/appearance mapping + validation sub-agents), so design migration for header/footer is handled within those orchestrators rather than the separate page design-expert flow.

## Approach

1. **Footer** → run the footer orchestrator against the source. It detects sections (desktop + mobile), maps content, builds `content/footer.plain.html` (content-first), writes `blocks/footer/` CSS styled to the source (dark footer, logo, brand tokens), and validates appearance vs. source.
2. **Header** (match source exactly) → run the navigation orchestrator against the source. It captures desktop + mobile screenshots, instruments the actual header (logo + utility elements), builds `content/nav.plain.html`, writes `blocks/header/` CSS styled to the source, and validates appearance.
3. **Design polish** → after both orchestrators, preview the rendered page with header + footer, compare to the source, and iterate on any styling gaps until they match.
4. Lint any new/changed block CSS and report.

## Checklist

- [x] Confirm header treatment with the user → **Match source exactly**
- [x] Confirm design migration is in scope for header & footer → **Yes**
- [ ] Run the footer orchestrator (`excat-footer-orchestrator`) against `https://www.natrellekorea.co.kr/`
  - [ ] Desktop + mobile section detection and content mapping
  - [ ] Generate `content/footer.plain.html` (replace boilerplate)
  - [ ] Generate/​style `blocks/footer/` CSS from source appearance (dark footer, logo, brand tokens)
  - [ ] Validate footer appearance vs. source
- [ ] Run the navigation orchestrator (`excat-navigation-orchestrator`) against `https://www.natrellekorea.co.kr/`
  - [ ] Capture header screenshots (desktop + mobile)
  - [ ] Instrument the header exactly as on the source (logo + utility elements)
  - [ ] Generate `content/nav.plain.html` (replace boilerplate)
  - [ ] Generate/​style `blocks/header/` CSS from source appearance
  - [ ] Validate header appearance vs. source
- [ ] Preview the rendered page with new header + footer at the local preview and compare to the original
- [ ] Fix any styling/content gaps (iterate on header/footer CSS)
- [ ] Run lint on any new/changed block CSS and fix errors
- [ ] Report results (files changed, visual match, any deferred items)

## Deliverables

- `content/footer.plain.html` — real site footer content
- `content/nav.plain.html` — real header reproduced from the source
- `blocks/footer/` — footer block styling matching the source (dark footer w/ logo + company info)
- `blocks/header/` — header block styling matching the source (logo/branding bar)
- Visual validation notes vs. the source site

## Notes

- Header and footer are shared fragments; they render on every page, not just the homepage.
- The source header/footer text is Korean; content will be preserved verbatim.
- Header/footer design uses the already-established brand tokens in `styles/brand.css` for consistency with the migrated homepage.
- **Execution requires Execute mode** — this plan makes no changes yet. Approve/exit plan mode to begin with the footer orchestrator, then the navigation orchestrator, then the shared design polish + lint.
