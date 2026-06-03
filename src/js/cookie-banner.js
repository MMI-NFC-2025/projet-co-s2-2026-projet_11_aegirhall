const banner = document.getElementById('cookie-banner');
if (banner && !document.cookie.includes('cookie_consent')) {
  banner.classList.remove('hidden');

  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    document.cookie = 'cookie_consent=1; path=/; max-age=31536000; SameSite=Lax';
    banner.classList.add('hidden');
  });

  document.getElementById('cookie-reject')?.addEventListener('click', () => {
    document.cookie = 'cookie_consent=0; path=/; max-age=31536000; SameSite=Lax';
    banner.classList.add('hidden');
  });
}
