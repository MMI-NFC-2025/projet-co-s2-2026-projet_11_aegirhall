document.getElementById('checkin-btn')?.addEventListener('click', async () => {
  const btn = document.getElementById('checkin-btn');
  const err = document.getElementById('checkin-error');
  btn.disabled = true;
  btn.textContent = 'Enregistrement...';

  const res = await fetch(window.location.href, {
    method: 'POST',
  });

  if (res.ok) {
    window.location.reload();
  } else {
    btn.disabled = false;
    btn.textContent = "J'y suis — Marquer la visite";
    err.textContent = "Erreur lors de l'enregistrement. Réessayez.";
    err.classList.remove('hidden');
  }
});
