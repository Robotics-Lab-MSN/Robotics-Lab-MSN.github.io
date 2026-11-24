/* Section links follow existing page headings. No lesson text is changed. */
(function () {
  const main = document.querySelector('main');
  if (!main) return;
  const titles = Array.from(main.querySelectorAll('h1'));
  const allHeadings = Array.from(main.querySelectorAll('h1, h2'));
  const secondTitle = titles[1];
  const sections = titles.length > 1
    ? allHeadings.filter(h => h.tagName === 'H1' || (h.compareDocumentPosition(secondTitle) & Node.DOCUMENT_POSITION_FOLLOWING))
    : allHeadings;
  const headings = sections.filter(h => !h.closest('nav, .learn-context'));
  if (!headings.length) return;
  const used = new Set(Array.from(document.querySelectorAll('[id]'), el => el.id));
  headings.forEach((heading, index) => {
    if (heading.id) return;
    const stem = heading.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
    let id = stem, suffix = 2;
    while (used.has(id)) id = stem + '-' + suffix++;
    heading.id = id;
    used.add(id);
  });
  const panel = document.createElement('details');
  panel.className = 'section-nav';
  const summary = document.createElement('summary');
  summary.textContent = 'On this page';
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Page sections');
  const list = document.createElement('ol');
  const links = headings.map((heading, index) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#' + encodeURIComponent(heading.id);
    link.textContent = heading.innerText.replace(/\s+/g, ' ').trim();
    if (index === 0) link.setAttribute('aria-current', 'location');
    link.addEventListener('click', () => {
      if (!document.body.classList.contains('home-page') || window.innerWidth <= 700) panel.open = false;
      setCurrent(index);
    });
    item.appendChild(link); list.appendChild(item);
    return link;
  });
  nav.appendChild(list); panel.append(summary, nav); document.body.appendChild(panel);
  document.body.classList.add('has-section-nav');
  const wide = window.matchMedia('(min-width: 1200px)');
  function sizePanel() {
    const home = document.body.classList.contains('home-page');
    panel.open = home ? window.innerWidth > 700 : false;
    if (home) main.querySelector('.home-intro').after(panel);
    else main.prepend(panel);
    const header = document.querySelector('.topbar');
    document.documentElement.style.setProperty('--sticky-header-height', (header ? header.getBoundingClientRect().height : 0) + 'px');
  }
  wide.addEventListener('change', sizePanel);
  window.matchMedia('(max-width: 700px)').addEventListener('change', sizePanel);
  const pageHeader = document.querySelector('.topbar');
  if (pageHeader && window.ResizeObserver) new ResizeObserver(() => {
    document.documentElement.style.setProperty('--sticky-header-height', pageHeader.getBoundingClientRect().height + 'px');
  }).observe(pageHeader);
  sizePanel();
  function setCurrent(index) {
    links.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  let scheduled = false;
  function updateCurrent() {
    let active = 0;
    headings.forEach((h, i) => { if (h.getBoundingClientRect().top <= 150) active = i; });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) active = headings.length - 1;
    setCurrent(active); scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateCurrent); }
  }, {passive: true});
  updateCurrent();
})();
