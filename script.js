'use strict';
const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
const header = document.querySelector('#site-header');
const progress = document.querySelector('#progress');
let scrollPending = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${Math.max(0, Math.min(100, max ? window.scrollY / max * 100 : 0))}%`;
  header?.classList.toggle('scrolled', window.scrollY > 24);
  scrollPending = false;
}
window.addEventListener('scroll', () => {
  if (!scrollPending) { scrollPending = true; window.requestAnimationFrame(updateScroll); }
}, {passive:true});
updateScroll();
const toggle = document.querySelector('#menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { if (!toggle || !mobileNav) return; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open menu'); mobileNav.hidden = true; document.body.classList.remove('menu-open'); }
toggle?.addEventListener('click', () => { const opening = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(opening)); toggle.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu'); mobileNav.hidden = !opening; document.body.classList.toggle('menu-open', opening); });
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });
const observed = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }, {rootMargin:'0px 0px -35px 0px', threshold:0.08});
  observed.forEach(el => observer.observe(el));
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const sections = [...document.querySelectorAll('#about,#research,#involvement,#experience')];
  const sectionObserver = new IntersectionObserver(entries => { for(const entry of entries) if(entry.isIntersecting) { navLinks.forEach(a => a.classList.toggle('active', a.hash === `#${entry.target.id}`)); } }, {rootMargin:'-15% 0px -70% 0px', threshold:0});
  sections.forEach(s => sectionObserver.observe(s));
} else observed.forEach(el => el.classList.add('is-visible'));
