/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Content-first, metadata-independent dual-fetch:
  // /content first (localhost / aem up), then root (DA/EDS production).
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return;

  const html = await resp.text();
  const container = document.createElement('div');
  container.innerHTML = html;

  const bands = [...container.children];

  // Band 1: company info — logo + Company info. / Contact us. columns
  const infoBand = bands[0];
  if (infoBand) {
    infoBand.className = 'footer-info';

    // The logo paragraph (contains the img) becomes the brand column
    const logoP = infoBand.querySelector('p:has(img)') || infoBand.querySelector('img')?.closest('p');
    if (logoP) logoP.classList.add('footer-logo');

    // Group the two company/contact definition columns.
    // Each <strong> heading starts a column; following <p>s until the next
    // <strong> are that column's lines.
    const columns = document.createElement('div');
    columns.className = 'footer-info-columns';
    let currentCol = null;
    [...infoBand.children].forEach((el) => {
      if (el.classList.contains('footer-logo')) return;
      const heading = el.querySelector('strong');
      if (heading) {
        currentCol = document.createElement('div');
        currentCol.className = 'footer-info-col';
        columns.append(currentCol);
      }
      if (currentCol) currentCol.append(el);
    });
    if (columns.children.length) infoBand.append(columns);
  }

  // Band 2: legal — consultation line, cookie notice, links + copyright
  const legalBand = bands[1];
  if (legalBand) legalBand.className = 'footer-legal';

  // Wire the cookie-settings link to the consent manager when available.
  const cookieLink = container.querySelector('a[href*="cookie-settings"]');
  if (cookieLink) {
    cookieLink.classList.add('footer-cookie-settings');
    cookieLink.addEventListener('click', (e) => {
      if (window.OneTrust && typeof window.OneTrust.ToggleInfoDisplay === 'function') {
        e.preventDefault();
        window.OneTrust.ToggleInfoDisplay();
      }
    });
  }

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-content';
  while (container.firstElementChild) footer.append(container.firstElementChild);
  block.append(footer);
}
