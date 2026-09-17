# Page Background Style Migration Plan

Match the source page's **layered background exactly**: the light pastel bubbles image (`background.png`) on the **top hero area only**, with the rest of the page (tabs content, contact notice, footer) on **plain white** — exactly as natrellekorea.co.kr renders. **User has approved — this plan is final. Execution requires Execute mode.**

## Context & Findings

- **Source reality (layered):** The pastel bubbles image covers only the **top hero band** (`div.background`, ~900px / roughly one screen tall). Everything below — the tabbed warranty content, the closing contact notice, and the footer — sits on **plain white**. The image does NOT tile behind the whole page.
- **Current migrated state:**
  - Hero renders as a **solid navy banner with white text** (from the earlier design pass) — wrong background AND diverges from the source's pastel look.
  - Page body / lower sections are already **white**, which already matches the source below the hero.
- **So the mismatch is specifically the hero band:** it should be the pastel image (with dark text), not solid navy. The rest of the page is already correct (white) and must stay white.
- **Asset status:** The pastel background image is downloaded at `migration-work/images/d9c372fd1b73aded47afe3b78c2a5a64.png` (source `background.png`); not yet in `content/images/`.
- **Contrast implication:** On the light pastel hero, the current **white** heading/intro/pills would be invisible → must flip to **dark** (navy heading, gray/navy body) and restyle pills for a light background.

## Approach

1. Copy the source background image into `content/images/hero-background.png` (served with the site).
2. Update `blocks/hero-welcome/hero-welcome.css`:
   - Apply the pastel image as the **hero section** background (cover, centered, no-repeat); remove the solid-navy fill and the hidden-image-row rule. Scope it to the hero section only so it does NOT bleed into other sections.
   - Flip text to dark: navy heading, gray/navy intro, muted-dark revision note.
   - Restyle the quick-link pills for legibility on the light background.
3. Confirm the rest of the page background stays **white** (no change needed to `styles.css` body/section backgrounds — verify, don't alter).
4. Verify in preview at desktop + mobile: pastel image confined to the hero, white everywhere below, text legible.
5. Lint the changed CSS.

## Checklist

- [x] Confirm page-background treatment with the user → **Match source exactly (pastel hero only, white below)**
- [ ] Copy source background image into `content/images/hero-background.png`
- [ ] Update `blocks/hero-welcome/hero-welcome.css`:
  - [ ] Apply pastel image as the hero **section** background (cover/center/no-repeat); remove solid-navy fill + image-row `display:none`; keep it scoped to the hero so it doesn't affect other sections
  - [ ] Flip heading to navy, intro to gray/navy, revision note to muted dark
  - [ ] Restyle quick-link pills for legibility on the light background
- [ ] Verify page body + lower sections (tabs, contact notice, footer) remain **white** (source-accurate); do not change `styles.css` backgrounds
- [ ] Preview at desktop (1440/1280) — pastel confined to hero, white below, legible dark text
- [ ] Preview at mobile (375) — background scales, layering holds, text readable
- [ ] Run stylelint on `blocks/hero-welcome/hero-welcome.css` and fix any errors
- [ ] Report before/after; note this reverts the earlier solid-navy hero decision and confirms white page background below the hero

## Deliverables

- `content/images/hero-background.png` — source pastel background image, served with the site
- Updated `blocks/hero-welcome/hero-welcome.css` — pastel image on the hero only, dark legible text
- Preview verification notes confirming source-accurate layering (pastel hero + white below), desktop + mobile

## Notes

- **Supersedes** the earlier design-pass decision to render the hero as solid navy. The `navy-blue` section variant stays defined in `styles.css` but the hero section uses the image treatment instead.
- Only the hero background changes; tabs-boxed, footer, and header are unaffected, and the white page background below the hero is intentionally preserved to match the source.
- **Execution requires Execute mode** — this plan makes no changes yet. Approve/exit plan mode to proceed.
