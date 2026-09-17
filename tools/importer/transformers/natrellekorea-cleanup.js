/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: natrellekorea site-wide cleanup.
 * Removes non-authorable site chrome and widgets.
 * All selectors verified in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // OneTrust cookie consent (found: <div id="onetrust-consent-sdk"> line 746)
    // Definition popup modal overlays (found: <div id="popUp_ver1..4" class="popUp"> lines 619-683)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.popUp',
      '#topBtn', // scroll-to-top button (found: <div id="topBtn"> line 734)
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome and leftover elements
    // Footer (found: <div id="footer"> line 685)
    WebImporter.DOMUtils.remove(element, [
      '#footer',
      'link', // leftover stylesheet <link> (found line 743)
      'iframe', // OneTrust text-resize iframe (found line 983)
      'noscript',
    ]);

    // Strip AOS animation data attributes (found on <body data-aos-*> line 1 and descendants)
    element.querySelectorAll('[data-aos]').forEach((el) => {
      el.removeAttribute('data-aos');
      el.removeAttribute('data-aos-easing');
      el.removeAttribute('data-aos-duration');
      el.removeAttribute('data-aos-delay');
    });
  }
}
