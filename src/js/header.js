const btn   = document.getElementById('menu-btn');
const menu  = document.getElementById('mobile-menu');
const close = document.getElementById('menu-close');

if (btn && menu && close) {
  btn.addEventListener('click', () => {
    menu.classList.remove('translate-x-full');
    menu.classList.add('translate-x-0');
    menu.removeAttribute('aria-hidden');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  });

  const closeMenu = () => {
    menu.classList.remove('translate-x-0');
    menu.classList.add('translate-x-full');
    menu.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  close.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
}

// Header opaque au scroll
const header = document.getElementById('site-header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('header-scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
