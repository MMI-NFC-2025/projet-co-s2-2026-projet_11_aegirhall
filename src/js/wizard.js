const steps   = Array.from(document.querySelectorAll('.wizard-step'));
const dots    = Array.from(document.querySelectorAll('.step-dot'));
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnSub  = document.getElementById('btn-submit');
let cur = 0;

function goTo(n) {
  steps.forEach((s, i) => s.classList.toggle('hidden', i !== n));
  dots.forEach((d, i) => {
    const active = i <= n;
    d.classList.toggle('border-primary-400', active);
    d.classList.toggle('bg-primary-400/20', active);
    d.classList.toggle('text-primary-400', active);
    d.classList.toggle('border-dark-600', !active);
    d.classList.toggle('bg-dark-700', !active);
    d.classList.toggle('text-neutral-600', !active);
  });
  btnPrev.style.display = n === 0 ? 'none' : '';
  btnNext.style.display = n === steps.length - 1 ? 'none' : '';
  btnSub.style.display  = n !== steps.length - 1 ? 'none' : '';
  cur = n;
}

btnNext.addEventListener('click', () => {
  if (cur === 0) {
    const nom = document.getElementById('nom');
    if (!nom.value.trim()) { nom.focus(); return; }
  }
  if (cur < steps.length - 1) goTo(cur + 1);
});

btnPrev.addEventListener('click', () => { if (cur > 0) goTo(cur - 1); });

document.querySelectorAll('.selection-card').forEach(card => {
  const cb   = card.querySelector('.selection-cb');
  const icon = card.querySelector('.check-icon');
  const mark = card.querySelector('.check-mark');

  const sync = () => {
    if (cb.checked) {
      icon.classList.add('border-primary-400', 'bg-primary-400/20');
      icon.classList.remove('border-dark-500');
      mark.classList.remove('hidden');
      card.classList.add('border-primary-400/60', 'bg-primary-400/5');
    } else {
      icon.classList.remove('border-primary-400', 'bg-primary-400/20');
      icon.classList.add('border-dark-500');
      mark.classList.add('hidden');
      card.classList.remove('border-primary-400/60', 'bg-primary-400/5');
    }
  };

  card.addEventListener('click', () => { cb.checked = !cb.checked; sync(); });
});
