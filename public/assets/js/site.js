// FencePostWatcher site behavior. The get-started form script ships with watcher-site-core.
(function () {
  // Mobile nav (markup from watcher-site-core: .menu-btn controls #mobile-nav)
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('mobile-nav');
  function setNav(open) {
    nav.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (btn && nav) {
    btn.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setNav(false); btn.focus(); } });
    window.matchMedia('(min-width: 981px)').addEventListener('change', function (e) { if (e.matches) setNav(false); });
  }
})();
