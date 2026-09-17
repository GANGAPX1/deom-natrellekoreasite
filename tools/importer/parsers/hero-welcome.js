/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-welcome
 * Base block: hero
 * Source: https://www.natrellekorea.co.kr/  (selector: #contents > div.background)
 * Generated: 2026-09-17
 *
 * Library structure (Hero): 1 column, 3 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: single cell — Background Image (optional)
 *   Row 3: single cell — Title / Subheading / Call-to-Action (all optional)
 *
 * On the live page div.background carries the hero visual as a CSS
 * background-image (url(.../background.png)) rather than an inline <img>.
 * We therefore extract an inline <img> if present, else synthesize one from
 * the computed/inline background-image URL. Text/CTA selectors are defensive
 * for cross-page resilience.
 */
export default function parse(element, { document }) {
  // Row 2 content: background image (optional)
  // 1) Prefer an inline <img> if the source has one.
  let bgImage = element.querySelector('img');

  // 2) Otherwise, derive the image from a CSS background-image on the element.
  if (!bgImage) {
    let bgValue = '';
    try {
      const win = element.ownerDocument.defaultView;
      if (win && win.getComputedStyle) {
        bgValue = win.getComputedStyle(element).backgroundImage || '';
      }
    } catch (e) { /* getComputedStyle unavailable in some import contexts */ }
    if (!bgValue || bgValue === 'none') {
      bgValue = element.style ? element.style.backgroundImage || '' : '';
    }
    const match = bgValue.match(/url\((['"]?)(.*?)\1\)/i);
    if (match && match[2]) {
      const img = document.createElement('img');
      img.src = match[2];
      bgImage = img;
    }
  }

  // Row 3 content: title, subheading, CTAs (all optional / defensive for other pages)
  const heading = element.querySelector('h1, h2, h3, [class*="title"], [class*="heading"]');
  const description = element.querySelector('p:not(:has(a))');
  const ctaLinks = Array.from(element.querySelectorAll('a.btn, a.button, a[class*="cta"]'));

  const cells = [];

  // Row 2 — background image (only add when present)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3 — text content cell (single cell holding all text/CTA elements)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  if (contentCell.length) {
    cells.push([contentCell]);
  }

  // Empty-block guard: nothing meaningful to render
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-welcome', cells });
  element.replaceWith(block);
}
