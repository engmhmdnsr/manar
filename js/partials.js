(function () {
'use strict';
var ICON_ARROW_UP =
'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><polyline points="18 15 12 9 6 15"/></svg>';
var SKIP_LINK_HTML = '<a class="skip-link" href="#main-content">Skip to main content</a>';
var HEADER_HTML =
'<header class="e-header" id="navbar">' +
'  <div class="e-header-in">' +
'    <a class="e-brand" href="index.html" aria-label="Manar Al Omran home">' +
'      <img src="assets/logo-white.png" alt="Manar Al Omran logo" width="120" height="42">' +
'      <span class="e-brand-text"><strong>MANAR AL OMRAN</strong><small>EST. 1974</small></span>' +
'    </a>' +
'    <nav class="e-nav" aria-label="Main navigation">' +
'      <a href="index.html" data-nav="index">HOME</a>' +
'      <a href="about-us.html" data-nav="about-us">ABOUT US</a>' +
'      <a href="our-services.html" data-nav="our-services">SERVICES</a>' +
'      <a href="our-products.html" data-nav="our-products">PRODUCTS</a>' +
'      <a href="our-projects.html" data-nav="our-projects">PROJECTS</a>' +
'      <a href="media-center.html" data-nav="media">MEDIA</a>' +
'      <a href="contact-us.html" data-nav="contact-us">CONTACT US</a>' +
'    </nav>' +
'    <a class="e-quote" href="contact-us.html">GET A QUOTE</a>' +
'    <button class="e-burger" id="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">' +
'      <span></span><span></span><span></span>' +
'    </button>' +
'  </div>' +
'</header>' +
'<div class="e-backdrop" id="eBackdrop"></div>' +
'<aside class="e-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site navigation" aria-hidden="true" inert>' +
'  <a href="index.html" data-nav="index">HOME</a>' +
'  <a href="about-us.html" data-nav="about-us">ABOUT US</a>' +
'  <a href="certifications.html" data-nav="about-us">CERTIFICATIONS</a>' +
'  <a href="our-services.html" data-nav="our-services">SERVICES</a>' +
'  <a href="our-products.html" data-nav="our-products">PRODUCTS</a>' +
'  <a href="our-projects.html" data-nav="our-projects">PROJECTS</a>' +
'  <a href="media-center.html" data-nav="media">MEDIA CENTER</a>' +
'  <a href="virtual-tour.html" data-nav="media">VIRTUAL TOUR</a>' +
'  <a href="contact-us.html" data-nav="contact-us">CONTACT US</a>' +
'  <a class="gold" href="contact-us.html">GET A QUOTE</a>' +
'</aside>';
var FOOTER_HTML =
'<footer class="e-footer" id="footer">' +
'  <div class="wrap">' +
'    <div class="e-footer-top">' +
'      <a class="e-footer-brand" href="index.html" aria-label="Back to top">' +
'        <img src="assets/logo-white.png" alt="Manar Al Omran logo" width="96" height="34">' +
'        <b>MANAR AL OMRAN</b>' +
'      </a>' +
'      <nav class="e-footer-nav" aria-label="Footer">' +
'        <a href="about-us.html">About Us</a>' +
'        <a href="our-products.html">Systems</a>' +
'        <a href="our-services.html">Services</a>' +
'        <a href="our-projects.html">Projects</a>' +
'        <a href="media-center.html">Media</a>' +
'        <a href="certifications.html">Certifications</a>' +
'        <a href="contact-us.html">Contact</a>' +
'      </nav>' +
'    </div>' +
'    <small>Manar Al Omran &middot; Specialized scaffolding and formwork systems since 1974. ISO 9001 &bull; ISO 14001 &bull; ISO 45001 Certified.</small>' +
'  </div>' +
'</footer>' +
'<button id="back-to-top" aria-label="Back to top">' + ICON_ARROW_UP + '</button>';
function currentPage() {
var seg = window.location.pathname.split('/').pop() || '';
seg = seg.replace(/\.html?$/i, '').toLowerCase();
if (seg === '' || seg === 'index') return 'index';
return seg;
}
function sectionOf(page) {
if (page === 'index') return 'index';
if (page === 'about-us' || page === 'certifications') return 'about-us';
if (page === 'our-services') return 'our-services';
if (page === 'our-products' || /^product-/.test(page)) return 'our-products';
if (page === 'our-projects' || /^project-/.test(page)) return 'our-projects';
if (page === 'media-center' || page === 'virtual-tour' || /^news-/.test(page)) return 'media';
if (page === 'contact-us') return 'contact-us';
return '';
}
function applyActiveState(root) {
var section = sectionOf(currentPage());
if (!section) return;
var links = root.querySelectorAll('[data-nav="' + section + '"]');
Array.prototype.forEach.call(links, function (link) {
link.classList.add('active');
});
}
function initMobileDrawer(root) {
var burger = root.querySelector('#menu-toggle') || document.getElementById('menu-toggle');
var menu = root.querySelector('#mobile-menu') || document.getElementById('mobile-menu');
var backdrop = root.querySelector('#eBackdrop') || document.getElementById('eBackdrop');
if (!burger || !menu) return;
menu.dataset.menuBound = 'true';
function setMenu(open) {
menu.classList.toggle('open', open);
if (backdrop) backdrop.classList.toggle('open', open);
burger.setAttribute('aria-expanded', open ? 'true' : 'false');
menu.toggleAttribute('inert', !open);
menu.setAttribute('aria-hidden', open ? 'false' : 'true');
document.body.style.overflow = open ? 'hidden' : '';
if (open) {
var firstLink = menu.querySelector('a');
if (firstLink) firstLink.focus({ preventScroll: true });
} else if (menu.contains(document.activeElement)) {
burger.focus({ preventScroll: true });
}
}
burger.addEventListener('click', function () {
setMenu(!menu.classList.contains('open'));
});
if (backdrop) {
backdrop.addEventListener('click', function () {
setMenu(false);
});
}
var menuLinks = menu.querySelectorAll('a');
Array.prototype.forEach.call(menuLinks, function (a) {
a.addEventListener('click', function () {
setMenu(false);
});
});
document.addEventListener('keydown', function (e) {
if (!menu.classList.contains('open')) return;
if (e.key === 'Escape') {
setMenu(false);
return;
}
if (e.key === 'Tab') {
var focusables = menu.querySelectorAll('a[href], button:not([disabled])');
if (!focusables.length) return;
var first = focusables[0];
var last = focusables[focusables.length - 1];
if (e.shiftKey && document.activeElement === first) {
e.preventDefault();
last.focus();
} else if (!e.shiftKey && document.activeElement === last) {
e.preventDefault();
first.focus();
}
}
});
}
function inject() {
var headerHost = document.querySelector('[data-partial="header"]');
if (headerHost) {
headerHost.innerHTML = SKIP_LINK_HTML + HEADER_HTML;
applyActiveState(headerHost);
initMobileDrawer(headerHost);
}
var footerHost = document.querySelector('[data-partial="footer"]');
if (footerHost) {
footerHost.innerHTML = FOOTER_HTML;
}
var mainEl = document.querySelector('main');
if (mainEl && !mainEl.id) mainEl.id = 'main-content';
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', inject);
} else {
inject();
}
})();