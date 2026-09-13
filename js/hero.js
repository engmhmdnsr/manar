(function () {
'use strict';
const hero = document.getElementById('hero');
if (!hero) return;
const mq = (q) => typeof window.matchMedia === 'function' && window.matchMedia(q).matches;
const reducedMotion = mq('(prefers-reduced-motion: reduce)');
const AUTOPLAY_MS = 8000;
const slides = Array.from(hero.querySelectorAll('.hc-slide'));
const pages = Array.from(hero.querySelectorAll('.hc-page'));
const paginationWrap = hero.querySelector('.hc-pagination-wrap');
let current = 0;
let timer = null;
let inView = true;
function goTo(index, fromAutoplay) {
const next = ((index % slides.length) + slides.length) % slides.length;
if (next === current && !fromAutoplay) return;
slides.forEach((slide, i) => {
const active = i === next;
slide.classList.toggle('is-active', active);
slide.setAttribute('aria-hidden', active ? 'false' : 'true');
});
pages.forEach((page, i) => {
const active = i === next;
page.classList.toggle('is-active', active);
page.setAttribute('aria-selected', active ? 'true' : 'false');
});
current = next;
scheduleAutoplay();
}
function stopAutoplay() {
if (timer) { clearInterval(timer); timer = null; }
}
// explicit pointer-tracking instead of matches(':hover') - deterministic everywhere
let pointerOnControls = false;
function scheduleAutoplay() {
stopAutoplay();
if (reducedMotion || !inView || document.hidden || pointerOnControls) return;
timer = setInterval(() => goTo(current + 1, true), AUTOPLAY_MS);
}
document.addEventListener('visibilitychange', () => {
document.hidden ? stopAutoplay() : scheduleAutoplay();
});
if ('IntersectionObserver' in window) {
new IntersectionObserver(
(entries) => {
inView = entries[0].isIntersecting;
inView ? scheduleAutoplay() : stopAutoplay();
},
{ threshold: 0.25 }
).observe(hero);
}
if (paginationWrap) {
paginationWrap.addEventListener('mouseenter', () => { pointerOnControls = true; stopAutoplay(); });
paginationWrap.addEventListener('mouseleave', () => { pointerOnControls = false; scheduleAutoplay(); });
let keyboardNav = false;
window.addEventListener('keydown', () => { keyboardNav = true; }, { capture: true, passive: true });
window.addEventListener('pointerdown', () => { keyboardNav = false; }, { capture: true, passive: true });
paginationWrap.addEventListener('focusin', () => { if (keyboardNav) stopAutoplay(); });
paginationWrap.addEventListener('focusout', scheduleAutoplay);
}
pages.forEach((page) => {
page.addEventListener('click', () => goTo(parseInt(page.getAttribute('data-go'), 10)));
});
hero.addEventListener('keydown', (e) => {
if (e.key === 'ArrowRight') { goTo(current + 1); }
else if (e.key === 'ArrowLeft') { goTo(current - 1); }
});
let swipeStartX = null;
hero.addEventListener('pointerdown', (e) => {
if (e.pointerType === 'mouse') return;
swipeStartX = e.clientX;
});
hero.addEventListener('pointerup', (e) => {
if (swipeStartX === null) return;
const dx = e.clientX - swipeStartX;
swipeStartX = null;
if (Math.abs(dx) > 48) goTo(current + (dx < 0 ? 1 : -1));
});
scheduleAutoplay();
})();