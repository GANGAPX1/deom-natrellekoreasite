/**
 * loads and decorates the header
 *
 * The source site (natrellekorea.co.kr) has no header — no logo bar, no
 * navigation. The page opens directly into the hero. To match the source, this
 * decorator renders an empty header (white background) whenever the nav
 * fragment has no content.
 *
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Content-first, metadata-independent dual-fetch:
  // /content first (localhost / aem up), then root (DA/EDS production).
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');

  block.textContent = '';

  if (!resp.ok) return;

  const html = await resp.text();
  const container = document.createElement('div');
  container.innerHTML = html;

  // If the fragment has no meaningful content (source has no header), render
  // nothing — the page opens directly into the hero, matching the source.
  if (!container.textContent.trim() && !container.querySelector('img, a, button')) {
    block.closest('header')?.classList.add('header-empty');
    return;
  }

  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (container.firstElementChild) nav.append(container.firstElementChild);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
