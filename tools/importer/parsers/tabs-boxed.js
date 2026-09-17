/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: tabs-boxed
 * Base block: tabs
 * Source: https://www.natrellekorea.co.kr/  (selector: #tab_wrap)
 * Generated: 2026-09-17
 *
 * Library structure (Tabs): 2 columns.
 *   Row 1: block name (added by createBlock)
 *   Each subsequent row = one tab:
 *     Cell 1: Tab Label (mandatory)
 *     Cell 2: Tab Content (mandatory)
 *
 * Source layout: #tab_wrap contains N direct-child `div.tab` panels (the content
 * for each tab). The tab LABELS live outside #tab_wrap, in a preceding sibling
 * `.menu_wrap ul.menu > li` swiper menu. Labels and panels align 1:1 by order.
 */
export default function parse(element, { document }) {
  // Content panels: direct children `.tab` of #tab_wrap.
  const panels = Array.from(element.querySelectorAll(':scope > div.tab'));

  // Labels: locate the associated swiper menu (sibling of #tab_wrap in the same
  // container). Prefer the nearest one; fall back to document-level lookup.
  let menu = null;
  const scope = element.parentElement || document;
  menu = scope.querySelector('.menu_wrap ul.menu') || document.querySelector('.menu_wrap ul.menu');
  const labelItems = menu ? Array.from(menu.querySelectorAll(':scope > li')) : [];

  const cells = [];

  panels.forEach((panel, i) => {
    // --- Label cell ---
    // Use the matching menu item text; fall back to the panel's first heading.
    let labelText = '';
    if (labelItems[i]) {
      labelText = labelItems[i].textContent.replace(/\s+/g, ' ').trim();
    }
    if (!labelText) {
      const h = panel.querySelector('h3, h4, h2');
      if (h) labelText = h.textContent.replace(/\s+/g, ' ').trim();
    }
    const labelEl = document.createElement('p');
    labelEl.textContent = labelText || `Tab ${i + 1}`;

    // --- Content cell ---
    // Everything inside the panel (banner + one or more .tab_content blocks).
    const contentChildren = Array.from(panel.children);
    const contentCell = contentChildren.length ? contentChildren : [panel];

    cells.push([labelEl, contentCell]);
  });

  // Empty-block guard: no tabs found.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-boxed', cells });
  element.replaceWith(block);
}
