/*
  Gabby's website — Pages CMS content reader.
  Editors change data/*.json and assets/ through app.pagescms.org.
  The published site automatically loads those changes. No custom backend or API keys.
*/
'use strict';
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const put = (selector, value, root = document) => {
    const element = $(selector, root);
    if (element && value !== undefined && value !== null) element.textContent = String(value);
  };
  const setImage = (selector, src) => {
    const img = $(selector);
    if (img && src && typeof src === 'string') img.src = src;
  };
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = String(text);
    return n;
  };
  const append = (parent, ...children) => { parent.append(...children); return parent; };
  const safeMail = value => String(value || '').trim().replace(/[\r\n]/g, '');
  const setTitle = (selector, first, second) => {
    const h = $(selector);
    if (!h) return;
    if (!first && !second) return;
    h.replaceChildren(document.createTextNode(String(first || '')), document.createElement('br'));
    const italic = document.createElement('em');
    italic.textContent = String(second || '');
    h.appendChild(italic);
  };
  const setPdf = (container, path) => {
    if (!container) return;
    container.replaceChildren();
    if (path && typeof path === 'string' && /\.pdf(?:\?|#|$)/i.test(path)) {
      const a = el('a', 'research-download', 'VIEW FULL RESEARCH PAPER ↗');
      a.href = path; a.target = '_blank'; a.rel = 'noopener noreferrer';
      container.appendChild(a);
    } else {
      const span = el('span', 'research-status');
      span.append(el('span', 'tiny-circle'), document.createTextNode(' FULL RESEARCH PAPER — PDF TO BE ADDED'));
      container.appendChild(span);
    }
  };
  const buildProject = (project, i) => {
    const article = el('article', 'project-card is-visible');
    article.id = 'research-project-' + (i + 1);
    const top = el('div', 'project-number', 'PROJECT / ' + String(i + 1).padStart(3, '0') + ' ');
    top.appendChild(el('span', '', project.label || 'RESEARCH'));
    const body = el('div', 'project-body');
    const row = el('div', 'project-title-row');
    const heading = el('h3');
    heading.append(document.createTextNode(project.title_line_1 || ''), document.createElement('br'));
    heading.appendChild(el('em', '', project.title_line_2 || ''));
    row.append(heading, el('span', 'project-icon', '↗'));
    const sub = el('p', 'project-subtitle', project.subtitle || '');
    const desc = el('p', 'project-description', project.description || '');
    const tags = el('div', 'tag-row');
    (Array.isArray(project.techniques) ? project.techniques : []).forEach(tag => tags.appendChild(el('span', '', String(tag).toUpperCase())));
    const pdf = el('div', 'research-document');
    setPdf(pdf, project.pdf);
    body.append(row, sub, desc, tags, pdf);
    article.append(top, body);
    return article;
  };
  const buildEducation = entry => {
    const row = el('div', 'education-entry');
    const mid = el('div');
    mid.append(el('h4', '', entry.institution || ''), el('p', '', entry.degree || ''));
    row.append(el('div', 'education-date', entry.date || ''), mid, el('div', 'education-arrow', '↗'));
    return row;
  };
  const buildActivity = item => {
    const row = el('div', 'line-item');
    const main = el('div');
    main.appendChild(el('strong', '', item.name || ''));
    if (item.details) main.appendChild(el('p', '', item.details));
    row.append(main, el('span', '', item.period || ''));
    return row;
  };
  const buildJob = item => {
    const row = el('div', 'work-row');
    const main = el('div');
    const h = el('h3', '', item.company || '');
    if (item.location) h.appendChild(el('span', '', ' · ' + item.location));
    main.append(h, el('p', '', item.role || ''));
    row.append(el('span', '', item.period || ''), main, el('span', 'work-arrow', '↗'));
    return row;
  };
  const sectionList = (selector, list, renderer) => {
    const target = $(selector);
    if (target && Array.isArray(list)) target.replaceChildren(...list.map(renderer));
  };
  const updateHome = d => {
    if (!d) return;
    put('.hero-eyebrow span:nth-child(2)', d.eyebrow);
    put('.hero-topic', d.field);
    setTitle('#hero-heading', d.hero_line_1, d.hero_line_2);
    put('.hero-description', d.description);
    setImage('.portrait-frame img', d.portrait);
    put('.portrait-caption span:first-child', d.portrait_caption);
    put('.hero-bottom > span:last-child', d.location);
    if (d.campus_image) $('.hero-image').style.backgroundImage = `url(${JSON.stringify(d.campus_image)})`;
    if (d.name) {
      document.title = `${d.name} — Research & Chemical Engineering`;
      const meta = $('meta[property="og:title"]');
      if (meta) meta.setAttribute('content', `${d.name} — Chemical Engineering Portfolio`);
      const img = $('.portrait-frame img');
      if (img) img.alt = `Portrait of ${d.name}`;
    }
  };
  const updateAbout = d => {
    if (!d) return;
    setTitle('.about-head h2', d.headline_line_1, d.headline_line_2);
    put('.about-copy .intro-paragraph', d.intro);
    put('.about-copy p:not(.intro-paragraph)', d.paragraph);
    sectionList('.education-list', d.education, buildEducation);
  };
  const updateResearch = d => {
    if (!d) return;
    setTitle('.research .section-heading-row h2', d.headline_line_1, d.headline_line_2);
    put('.research .section-heading-row > p', d.introduction);
    sectionList('.project-list', d.projects, buildProject);
  };
  const updateMaterials = d => {
    if (!d) return;
    setTitle('.featured-header h2', d.headline_line_1, d.headline_line_2);
    put('.featured-side p', d.intro);
    put('.feature-description > div:first-child p', d.overall);
    put('.feature-description > div:last-child p', d.focus);
    const images = $$('.science-panel img');
    if (images[0] && d.image_1) images[0].src = d.image_1;
    if (images[1] && d.image_2) images[1].src = d.image_2;
    put('.science-panel:first-child figcaption p', d.caption_1);
    put('.science-panel:last-child figcaption p', d.caption_2);
  };
  const updateActivities = d => {
    if (!d) return;
    setTitle('.involvement .section-heading-row h2', d.headline_line_1, d.headline_line_2);
    put('.involvement .section-heading-row > p', d.intro);
    const groups = $$('.involvement-group');
    [['academic',0],['community',1],['sports',2]].forEach(([name,i]) => {
      const target = groups[i];
      if (!target || !Array.isArray(d[name])) return;
      $$('.line-item', target).forEach(item => item.remove());
      d[name].forEach(item => target.appendChild(buildActivity(item)));
    });
  };
  const updateWork = d => {
    if (!d) return;
    setTitle('.experience-head h2', d.headline_line_1, d.headline_line_2);
    put('.experience-head p', d.intro);
    sectionList('.experience-entries', d.jobs, buildJob);
  };
  const updateContact = d => {
    if (!d) return;
    setTitle('.contact h2', d.headline_line_1, d.headline_line_2);
    put('.contact-bottom p', d.intro);
    if (d.email) {
      const email = safeMail(d.email);
      const link = $('.email-button');
      const nav = $('.contact-nav');
      if (link) {
        link.href = 'mailto:' + email;
        link.replaceChildren(document.createTextNode(email + ' '), el('span', '', '↗'));
      }
      if (nav) nav.href = 'mailto:' + email;
    }
  };
  const updateExtra = d => {
    const section = $('#extra');
    if (!section || !d || !d.enabled) return;
    section.hidden = false;
    put('#extra-label', d.category);
    put('#extra-title', d.title);
    put('#extra-description', d.description);
    const img = $('#extra-image');
    if (img && d.image) { img.src = d.image; img.hidden = false; img.alt = d.image_caption || d.title || 'Additional photo'; }
    put('#extra-caption', d.image_caption);
    const pdf = $('#extra-pdf');
    if (pdf && d.pdf && /\.pdf(?:\?|#|$)/i.test(d.pdf)) { pdf.href = d.pdf; pdf.hidden = false; }
    const extraNav = $$('.desktop-nav, .mobile-nav');
    extraNav.forEach(nav => {
      const a = el('a', '', 'Highlight'); a.href = '#extra';
      if (nav.classList.contains('desktop-nav')) nav.insertBefore(a, nav.querySelector('a[href="#experience"]'));
      else nav.insertBefore(a, nav.querySelector('a[href="#experience"]'));
      if (nav.classList.contains('mobile-nav')) a.addEventListener('click', () => {
        const toggle = $('#menu-toggle');
        if (toggle) toggle.setAttribute('aria-expanded','false');
        nav.hidden = true; document.body.classList.remove('menu-open');
      });
    });
    // This section is inserted after initial reveal observers have been registered.
    $$('.reveal', section).forEach(e => e.classList.add('is-visible'));
  };
  const definitions = {
    home:updateHome, about:updateAbout, research:updateResearch, materials:updateMaterials,
    activities:updateActivities, work:updateWork, contact:updateContact, extra:updateExtra
  };
  Promise.all(Object.entries(definitions).map(async ([file, render]) => {
    try {
      const res = await fetch('data/' + file + '.json', {cache:'no-store'});
      if (!res.ok) throw Error('HTTP ' + res.status);
      render(await res.json());
    } catch(e) {
      // For local index.html opened without a web server, original HTML remains visible.
      console.info(`CMS: ${file} could not be loaded — using built-in content.`, e.message);
    }
  }));
})();
