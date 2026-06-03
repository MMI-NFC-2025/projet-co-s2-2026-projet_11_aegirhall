const wizData = document.getElementById('wizard-data');
const _users  = JSON.parse(wizData?.dataset.users ?? '[]');
const _bars   = JSON.parse(wizData?.dataset.bars  ?? '[]');
const _jeux   = JSON.parse(wizData?.dataset.jeux  ?? '[]');
const _meId   = wizData?.dataset.meId   ?? '';
const _meName = wizData?.dataset.meName ?? 'Vous (Hôte)';

const steps   = Array.from(document.querySelectorAll('.wizard-step'));
const dots    = Array.from(document.querySelectorAll('.step-dot'));
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnSub  = document.getElementById('btn-submit');
let cur = 0;

function goTo(n) {
  steps.forEach((s, i) => s.classList.toggle('hidden', i !== n));

  dots.forEach((d, i) => {
    const numEl   = d.querySelector('.step-num');
    const checkEl = d.querySelector('.step-check');
    const lbl     = document.getElementById(`step-label-${i + 1}`);
    const done    = i < n;
    const active  = i === n;

    d.classList.toggle('border-primary-400', active || done);
    d.classList.toggle('bg-primary-400/20',  active);
    d.classList.toggle('bg-primary-400/10',  done && !active);
    d.classList.toggle('border-dark-600',    !active && !done);
    d.classList.toggle('bg-dark-700',        !active && !done);

    numEl?.classList.toggle('hidden',  done);
    checkEl?.classList.toggle('hidden', !done);

    if (lbl) {
      lbl.classList.toggle('text-primary-400', active);
      lbl.classList.toggle('text-primary-500', done);
      lbl.classList.toggle('text-neutral-600', !active && !done);
    }
  });

  btnPrev.style.display = n === 0 ? 'none' : '';
  btnNext.style.display = n === steps.length - 1 ? 'none' : '';
  btnSub.style.display  = n !== steps.length - 1 ? 'none' : '';

  if (n === 1) populateGardien();
  if (n === 3) populateResume();

  cur = n;
}

// ── Checkbox selection cards ─────────────────────────────────────────────────

function setupCheckboxCards() {
  document.querySelectorAll('.selection-card').forEach(card => {
    const cb   = card.querySelector('.selection-cb');
    const icon = card.querySelector('.check-icon');
    const mark = card.querySelector('.check-mark');
    if (!cb) return;

    const sync = () => {
      if (cb.checked) {
        icon?.classList.add('border-primary-400', 'bg-primary-400/20');
        icon?.classList.remove('border-dark-500');
        mark?.classList.remove('hidden');
        card.classList.add('border-primary-400/60', 'bg-primary-400/5');
      } else {
        icon?.classList.remove('border-primary-400', 'bg-primary-400/20');
        icon?.classList.add('border-dark-500');
        mark?.classList.add('hidden');
        card.classList.remove('border-primary-400/60', 'bg-primary-400/5');
      }
    };

    card.addEventListener('click', () => { cb.checked = !cb.checked; sync(); });
  });
}

// ── Gardien step ─────────────────────────────────────────────────────────────

function populateGardien() {
  const selectedIds = Array.from(
    document.querySelectorAll('input[name="members"]:checked')
  ).map(cb => cb.value);

  const options = [
    { id: _meId, name: _meName, isHost: true },
    ..._users.filter(u => selectedIds.includes(u.id)),
  ];

  const container = document.getElementById('gardien-list');
  const emptyMsg  = document.getElementById('gardien-empty');
  if (!container) return;

  container.innerHTML = '';

  if (options.length === 0) {
    emptyMsg?.classList.remove('hidden');
    return;
  }
  emptyMsg?.classList.add('hidden');

  const currentSam = document.querySelector('input[name="sam"]:checked')?.value ?? '';

  options.forEach(u => {
    const isSelected = currentSam === u.id;
    const label = document.createElement('label');
    label.className = 'gardien-card flex items-center gap-4 card-parchment rounded-lg p-4 cursor-pointer transition-colors' +
      (isSelected ? ' border-primary-400/60 bg-primary-400/5' : '');

    label.innerHTML = `
      <input type="radio" name="sam" value="${u.id}" class="sr-only"${isSelected ? ' checked' : ''} />
      <div class="w-10 h-10 rounded-full bg-dark-600 border border-dark-500 flex items-center justify-center shrink-0">
        <span class="font-heading text-sm text-primary-400">${u.name.charAt(0).toUpperCase()}</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-heading text-sm text-neutral-200 tracking-wide">
          ${u.name}${u.isHost ? ' <span class="font-heading text-xs text-primary-600">(hôte)</span>' : ''}
        </p>
      </div>
      <div class="check-icon w-6 h-6 rounded-full border-2 ${isSelected ? 'border-primary-400 bg-primary-400/20' : 'border-dark-500'} flex items-center justify-center shrink-0 transition-all">
        <span class="check-mark ${isSelected ? '' : 'hidden'} text-primary-400 text-xs font-bold">✓</span>
      </div>
    `;

    label.addEventListener('click', e => {
      e.preventDefault();
      label.querySelector('input[type="radio"]').checked = true;
      syncGardienCards();
    });

    container.appendChild(label);
  });
}

function syncGardienCards() {
  document.querySelectorAll('.gardien-card').forEach(card => {
    const rb   = card.querySelector('input[type="radio"]');
    const icon = card.querySelector('.check-icon');
    const mark = card.querySelector('.check-mark');
    if (!rb) return;

    if (rb.checked) {
      icon?.classList.add('border-primary-400', 'bg-primary-400/20');
      icon?.classList.remove('border-dark-500');
      mark?.classList.remove('hidden');
      card.classList.add('border-primary-400/60', 'bg-primary-400/5');
    } else {
      icon?.classList.remove('border-primary-400', 'bg-primary-400/20');
      icon?.classList.add('border-dark-500');
      mark?.classList.add('hidden');
      card.classList.remove('border-primary-400/60', 'bg-primary-400/5');
    }
  });
}

// ── Résumé step ──────────────────────────────────────────────────────────────

function populateResume() {
  const nom  = document.getElementById('nom')?.value?.trim()        ?? '';
  const desc = document.getElementById('description')?.value?.trim() ?? '';
  const dep  = document.getElementById('date_heur_depart')?.value   ?? '';
  const arr  = document.getElementById('date_heur_arriver')?.value  ?? '';

  const fmtDate = v => v
    ? new Date(v).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
    : '—';

  const memberIds   = Array.from(document.querySelectorAll('input[name="members"]:checked')).map(cb => cb.value);
  const memberNames = [_meName, ..._users.filter(u => memberIds.includes(u.id)).map(u => u.name)];

  const samId   = document.querySelector('input[name="sam"]:checked')?.value ?? '';
  const samName = samId === _meId
    ? _meName
    : (_users.find(u => u.id === samId)?.name ?? '—');

  const barIds   = Array.from(document.querySelectorAll('input[name="bars"]:checked')).map(cb => cb.value);
  const barNames = _bars.filter(b => barIds.includes(b.id)).map(b => b.nom);

  const jeuIds   = Array.from(document.querySelectorAll('input[name="jeux"]:checked')).map(cb => cb.value);
  const jeuNames = _jeux.filter(j => jeuIds.includes(j.id)).map(j => j.nom);

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('res-nom',    nom  || '—');
  set('res-desc',   desc || '—');
  set('res-depart', fmtDate(dep));
  set('res-arrivee', fmtDate(arr));
  set('res-membres', memberNames.join(', ') || '—');
  set('res-sam',    samName || '—');
  set('res-bars',   barNames.length ? barNames.join(', ') : 'Aucune taverne sélectionnée');
  set('res-jeux',   jeuNames.length ? jeuNames.join(', ') : 'Aucun jeu sélectionné');
}

// ── Navigation ────────────────────────────────────────────────────────────────

btnNext.addEventListener('click', () => {
  if (cur === 0) {
    const nom = document.getElementById('nom');
    if (!nom?.value.trim()) { nom?.focus(); return; }
  }
  if (cur < steps.length - 1) goTo(cur + 1);
});

btnPrev.addEventListener('click', () => { if (cur > 0) goTo(cur - 1); });

setupCheckboxCards();
goTo(0);
