document.addEventListener('DOMContentLoaded', () => {
initMobileMenu();
initStickyNavbar();
initStatCounters();
initScrollReveals();
initCinematicProjects();
initBackToTop();
initCatalogJump();
initProjectFilters();
initContactForm();
initHomeHeaderOffset();
});
function initHomeHeaderOffset() {
const hero = document.querySelector('.hero-carousel');
const header = document.querySelector('[data-partial="header"]');
if (!hero || !header) return;
const apply = () => {
hero.style.setProperty('--hc-offset', -header.offsetHeight + 'px');
};
apply();
window.addEventListener('resize', apply, { passive: true });
window.addEventListener('load', apply);
}
function initMobileMenu() {
const menuToggle = document.getElementById('menu-toggle') || document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobile-menu') || document.getElementById('mobileNav');
let backdrop = document.querySelector('.mobile-backdrop') || document.getElementById('navBackdrop') || document.getElementById('eBackdrop');
const closeBtn = document.getElementById('closeMobileNav');
if (!menuToggle || !mobileMenu) return;
if (mobileMenu.dataset.menuBound) return;
mobileMenu.dataset.menuBound = 'true';
if (!backdrop) {
backdrop = document.createElement('div');
backdrop.className = 'mobile-backdrop';
document.body.appendChild(backdrop);
}
function toggleMenu(forceOpen) {
const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !mobileMenu.classList.contains('open');
mobileMenu.classList.toggle('open', shouldOpen);
if (menuToggle) menuToggle.classList.toggle('active', shouldOpen);
backdrop.classList.toggle('active', shouldOpen);
backdrop.classList.toggle('open', shouldOpen);
document.body.style.overflow = shouldOpen ? 'hidden' : '';
if (menuToggle) menuToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
// Ariakit Disclosure + Dialog pattern: hidden menu is removed from
mobileMenu.toggleAttribute('inert', !shouldOpen);
mobileMenu.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
if (shouldOpen) {
const firstLink = mobileMenu.querySelector('a');
if (firstLink) firstLink.focus({ preventScroll: true });
} else if (
document.activeElement &&
mobileMenu.contains(document.activeElement)
) {
if (menuToggle) menuToggle.focus({ preventScroll: true });
}
}
function closeMenu() {
toggleMenu(false);
}
menuToggle.addEventListener('click', () => toggleMenu());
backdrop.addEventListener('click', closeMenu);
if (closeBtn) closeBtn.addEventListener('click', closeMenu);
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
closeMenu();
}
// Ariakit Dialog focus-trap pattern: keep Tab cycling inside the open menu
if (e.key === 'Tab' && mobileMenu.classList.contains('open')) {
const focusables = mobileMenu.querySelectorAll('a[href], button:not([disabled])');
if (!focusables.length) return;
const first = focusables[0];
const last = focusables[focusables.length - 1];
if (e.shiftKey && document.activeElement === first) {
e.preventDefault();
last.focus();
} else if (!e.shiftKey && document.activeElement === last) {
e.preventDefault();
first.focus();
}
}
});
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach((link) => {
link.addEventListener('click', closeMenu);
});
}
function initStickyNavbar() {
const navbar = document.getElementById('navbar');
if (!navbar) return;
const handleScroll = () => {
if (window.scrollY > 25) {
navbar.classList.add('scrolled');
} else {
navbar.classList.remove('scrolled');
}
};
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();
}
function initStatCounters() {
const statNumbers = document.querySelectorAll('.stat-number[data-target], .counter[data-target]');
if (statNumbers.length === 0) return;
const animateCount = (el) => {
const target = parseInt(el.getAttribute('data-target'), 10);
const duration = 1800;
const stepTime = 20;
const steps = duration / stepTime;
const increment = target / steps;
let current = 0;
const timer = setInterval(() => {
current += increment;
if (current >= target) {
el.textContent = target.toLocaleString();
clearInterval(timer);
} else {
el.textContent = Math.ceil(current).toLocaleString();
}
}, stepTime);
};
if ('IntersectionObserver' in window) {
const observer = new IntersectionObserver(
(entries, obs) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
animateCount(entry.target);
obs.unobserve(entry.target);
}
});
},
{ threshold: 0.2 }
);
statNumbers.forEach((num) => observer.observe(num));
} else {
statNumbers.forEach((num) => {
num.textContent = parseInt(num.getAttribute('data-target'), 10).toLocaleString();
});
}
}
function initScrollReveals() {
const reveals = document.querySelectorAll('.reveal');
if (reveals.length === 0) return;
if ('IntersectionObserver' in window) {
const revealObserver = new IntersectionObserver(
(entries, observer) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add('is-revealed');
observer.unobserve(entry.target);
}
});
},
{
rootMargin: '0px 0px -40px 0px',
threshold: 0.1,
}
);
reveals.forEach((el) => revealObserver.observe(el));
} else {
reveals.forEach((el) => el.classList.add('is-revealed'));
}
}
function initCinematicProjects() {
const projectCards = document.querySelectorAll('.cinematic-project-card');
if (projectCards.length === 0) return;
if ('IntersectionObserver' in window) {
const projectRevealObserver = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add('revealed');
entry.target.classList.add('is-revealed');
}
});
},
{
threshold: 0.1,
rootMargin: '0px 0px -40px 0px',
}
);
projectCards.forEach((card) => projectRevealObserver.observe(card));
} else {
projectCards.forEach((card) => {
card.classList.add('revealed');
card.classList.add('is-revealed');
});
}
const filterChips = document.querySelectorAll('.filter-chip, .project-filters-bar button');
if (filterChips.length > 0) {
filterChips.forEach((chip) => {
chip.addEventListener('click', () => {
filterChips.forEach((c) => c.classList.remove('active'));
chip.classList.add('active');
const filter = (chip.getAttribute('data-filter') || 'all').toLowerCase();
projectCards.forEach((card) => {
const categories = (card.getAttribute('data-category') || '').toLowerCase();
if (filter === 'all' || categories.includes(filter)) {
card.classList.remove('filtered-out');
setTimeout(() => {
card.classList.add('revealed');
card.classList.add('is-revealed');
}, 50);
} else {
card.classList.add('filtered-out');
}
});
});
});
}
let ticking = false;
function updateParallax() {
if (window.innerWidth > 820) {
const windowHeight = window.innerHeight;
projectCards.forEach((card) => {
if (!card.classList.contains('filtered-out') && (card.classList.contains('revealed') || card.classList.contains('is-revealed'))) {
const rect = card.getBoundingClientRect();
if (rect.top < windowHeight && rect.bottom > 0) {
const img = card.querySelector('.cinematic-project-bg img');
if (img) {
const offset = ((rect.top + rect.height / 2) - windowHeight / 2) * 0.07;
img.style.transform = `scale(1.0) translateY(${offset.toFixed(1)}px)`;
}
}
}
});
}
ticking = false;
}
window.addEventListener(
'scroll',
() => {
if (!ticking) {
window.requestAnimationFrame(updateParallax);
ticking = true;
}
},
{ passive: true }
);
}
function initBackToTop() {
const backToTopBtn = document.getElementById('back-to-top');
if (!backToTopBtn) return;
window.addEventListener(
'scroll',
() => {
if (window.scrollY > 350) {
backToTopBtn.classList.add('visible');
} else {
backToTopBtn.classList.remove('visible');
}
},
{ passive: true }
);
backToTopBtn.addEventListener('click', () => {
window.scrollTo({
top: 0,
behavior: 'smooth',
});
});
}
function initCatalogJump() {
const jumpButtons = document.querySelectorAll('.jump-btn');
if (jumpButtons.length === 0) return;
const sections = [];
jumpButtons.forEach((btn) => {
const targetId = btn.getAttribute('href')?.replace('#', '');
if (targetId) {
const section = document.getElementById(targetId);
if (section) {
sections.push({ id: targetId, btn: btn, el: section });
}
}
});
if (sections.length === 0) return;
window.addEventListener(
'scroll',
() => {
const scrollPos = window.scrollY + 120;
let activeFound = false;
for (let i = sections.length - 1; i >= 0; i--) {
if (scrollPos >= sections[i].el.offsetTop) {
jumpButtons.forEach((b) => b.classList.remove('active'));
sections[i].btn.classList.add('active');
activeFound = true;
break;
}
}
if (!activeFound && jumpButtons.length > 0) {
jumpButtons.forEach((b) => b.classList.remove('active'));
jumpButtons[0].classList.add('active');
}
},
{ passive: true }
);
}
function initProjectFilters() {
const filterBtns = document.querySelectorAll('.project-filter-btn');
const projectCards = document.querySelectorAll('.projects-grid .project-card');
if (filterBtns.length === 0 || projectCards.length === 0) return;
filterBtns.forEach((btn) => {
btn.addEventListener('click', () => {
filterBtns.forEach((b) => b.classList.remove('active'));
btn.classList.add('active');
const filterValue = btn.getAttribute('data-filter') || 'all';
projectCards.forEach((card) => {
const category = card.getAttribute('data-category') || '';
if (filterValue === 'all' || category.includes(filterValue)) {
card.style.display = 'flex';
card.classList.add('is-revealed');
} else {
card.style.display = 'none';
}
});
});
});
}
function initContactForm() {
const contactForm = document.getElementById('contact-form');
if (!contactForm) return;
function showAlert(type, message) {
const existingAlert = contactForm.querySelector('.form-success-alert, .form-error-alert');
if (existingAlert) existingAlert.remove();
const alertBox = document.createElement('div');
const isError = type === 'error';
alertBox.className = isError ? 'form-error-alert' : 'form-success-alert';
alertBox.style.cssText = isError
? 'background-color: rgba(239, 68, 68, 0.15); border: 1px solid #EF4444; color: #FCA5A5; padding: 16px 20px; border-radius: 6px; margin-top: 18px; font-weight: 600; font-size: 0.92rem; text-align: center;'
: 'background-color: rgba(34, 197, 94, 0.15); border: 1px solid #22C55E; color: #4ADE80; padding: 16px 20px; border-radius: 6px; margin-top: 18px; font-weight: 600; font-size: 0.92rem; text-align: center;';
alertBox.setAttribute('role', isError ? 'alert' : 'status');
alertBox.innerHTML = message;
contactForm.appendChild(alertBox);
alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
contactForm.addEventListener('submit', async (e) => {
e.preventDefault();
// Honeypot: silently drop bot submissions
if (contactForm.querySelector('input[name="website"]')?.value) return;
const submitBtn = contactForm.querySelector('button[type="submit"]');
const originalText = submitBtn ? submitBtn.innerHTML : 'Submit Inquiry';
if (submitBtn) {
submitBtn.disabled = true;
submitBtn.innerHTML = 'Sending Request...';
}
try {
const endpoint = contactForm.getAttribute('action') || 'send-mail.php';
const res = await fetch(endpoint, {
method: 'POST',
headers: { 'Accept': 'application/json' },
body: new FormData(contactForm),
});
let data = {};
try { data = await res.json(); } catch (_) {  }
if (res.ok && data.success) {
showAlert('success', '&#10003; Thank you! Your engineering inquiry has been submitted. Our technical team in Dammam will respond within 24 hours.');
contactForm.reset();
if (submitBtn) {
submitBtn.innerHTML = 'Inquiry Sent &#10003;';
setTimeout(() => { submitBtn.innerHTML = originalText; }, 4000);
}
} else {
showAlert('error', data.message || 'Sorry, something went wrong while sending your inquiry. Please try again, or email us directly at info@manar.com.sa.');
}
} catch (_) {
showAlert('error', 'Network error: your inquiry could not be sent. Please check your connection and try again, or email us directly at info@manar.com.sa.');
} finally {
if (submitBtn && submitBtn.innerHTML.indexOf('Inquiry Sent') === -1) {
submitBtn.disabled = false;
} else if (submitBtn) {
setTimeout(() => { submitBtn.disabled = false; }, 4000);
}
}
});
}