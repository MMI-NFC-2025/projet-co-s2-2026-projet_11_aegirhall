/* ── Profil utilisateur — onglets, modaux, recherche amis ── */
var el            = document.getElementById('profile-data');
var userId        = el ? el.dataset.userId        : '';
var token         = el ? el.dataset.token         : '';
var PB_BASE_URL   = el ? el.dataset.pbBaseUrl     : '';
var activeTab     = el ? el.dataset.activeTab     : 'parametres';
var friendsForClient    = el ? JSON.parse(el.dataset.friends    || '[]') : [];
var allUsersForSearch   = el ? JSON.parse(el.dataset.allUsers   || '[]') : [];

/* ── Onglets ─────────────────────────────────────────── */
function switchTab(id) {
  document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.add('hidden'); });
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  var panel = document.getElementById('tab-' + id);
  if (panel) panel.classList.remove('hidden');
  var btn = document.querySelector('[data-tab="' + id + '"]');
  if (btn) btn.classList.add('active');
  try { history.replaceState(null, '', '#' + id); } catch(_) {}
}

document.querySelectorAll('.tab-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    switchTab(btn.getAttribute('data-tab'));
  });
});

var initTab = (location.hash.slice(1)) || activeTab || 'parametres';
switchTab(initTab);

/* ── Modal ami ───────────────────────────────────────── */
var modal         = document.getElementById('friend-modal');
var modalBody     = document.getElementById('modal-body');
var modalClose    = document.getElementById('modal-close');
var modalBackdrop = document.getElementById('modal-backdrop');

function openFriendModal(friendId) {
  var f = friendsForClient.find(function(x) { return x.id === friendId; });
  if (!f || !modalBody || !modal) return;

  var avatarHtml = f.avatar
    ? '<img src="' + PB_BASE_URL + '/api/files/' + f.collectionId + '/' + f.id + '/' + f.avatar + '" alt="' + f.pseudo + '" class="w-20 h-20 rounded-full object-cover border border-primary-400/20 mx-auto mb-4" />'
    : '<div class="w-20 h-20 rounded-full bg-dark-600 border border-primary-400/20 flex items-center justify-center mx-auto mb-4"><span class="font-display text-3xl text-primary-400">' + (f.pseudo || 'G')[0].toUpperCase() + '</span></div>';

  var barsHtml = f.visitedBars && f.visitedBars.length > 0
    ? '<div class="flex flex-wrap gap-2 mt-2">' + f.visitedBars.map(function(b) {
        return '<span class="font-heading text-xs text-primary-400 bg-dark-700 border border-primary-400/20 rounded px-2 py-1">' + b + '</span>';
      }).join('') + '</div>'
    : '<p class="font-body text-sm text-neutral-600 mt-2">Aucune taverne visitée.</p>';

  var socialsHtml = '';
  if (f.insta)    socialsHtml += '<span class="font-body text-sm text-neutral-400">Instagram : ' + f.insta + '</span>';
  if (f.facbook)  socialsHtml += '<span class="font-body text-sm text-neutral-400">Facebook : ' + f.facbook + '</span>';
  if (f.discord)  socialsHtml += '<span class="font-body text-sm text-neutral-400">Discord : ' + f.discord + '</span>';

  var badgeHtml = '';
  if (f.featuredBadge) {
    var badgeImgHtml = f.featuredBadge.img
      ? '<img src="' + PB_BASE_URL + '/api/files/' + f.featuredBadge.collectionId + '/' + f.featuredBadge.id + '/' + f.featuredBadge.img + '" alt="' + (f.featuredBadge.nom || 'Badge') + '" class="w-10 h-10 rounded-full object-cover border border-primary-400/20 shrink-0" />'
      : '<div class="w-10 h-10 rounded-full bg-dark-600 border border-primary-400/20 flex items-center justify-center shrink-0"><span class="text-primary-400">🏅</span></div>';
    badgeHtml = '<div class="flex items-center gap-3 p-3 rounded-xl bg-primary-400/10 border border-primary-400/30 mb-6">' +
      badgeImgHtml +
      '<div><p class="font-heading text-xs text-primary-500 tracking-widest uppercase">Badge équipé</p>' +
      '<p class="font-body text-sm text-neutral-300">' + (f.featuredBadge.nom || '') + '</p></div>' +
      '</div>';
  }

  modalBody.innerHTML =
    '<div class="text-center mb-6">' + avatarHtml +
      '<h4 class="font-heading text-xl text-neutral-100 tracking-wide">' + (f.pseudo || 'Guerrier') + '</h4>' +
      (f.prenom || f.nom ? '<p class="font-body text-sm text-neutral-400 mt-1">' + [f.prenom, f.nom].filter(Boolean).join(' ') + '</p>' : '') +
      (f.ville ? '<p class="font-body text-xs text-neutral-500 mt-0.5">' + f.ville + '</p>' : '') +
    '</div>' +
    badgeHtml +
    (socialsHtml ? '<div class="flex flex-col gap-1 mb-6 p-4 rounded-xl bg-dark-700/50">' + socialsHtml + '</div>' : '') +
    '<div>' +
      '<p class="font-heading text-xs text-primary-600 tracking-widest uppercase mb-2">Tavernes conquîses (' + (f.visitedBars ? f.visitedBars.length : 0) + ')</p>' +
      barsHtml +
    '</div>';

  modal.setAttribute('aria-hidden', 'false');
  modal.classList.remove('hidden');
  modal.classList.add('open');
  modalClose && modalClose.focus();
}

function closeModal() {
  if (modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.add('hidden');
    modal.classList.remove('open');
  }
}

modalClose    && modalClose.addEventListener('click', closeModal);
modalBackdrop && modalBackdrop.addEventListener('click', closeModal);
modal         && modal.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });

document.querySelectorAll('.friend-card-btn').forEach(function(btn) {
  btn.addEventListener('click', function() { openFriendModal(btn.getAttribute('data-friend-id')); });
});

/* ── Modal suppression compte ───────────────────────── */
var deleteModal   = document.getElementById('delete-modal');
var deleteCancel  = document.getElementById('delete-cancel');
var deleteBtnOpen = document.getElementById('btn-delete-account');
var deleteBack    = document.getElementById('delete-backdrop');

deleteBtnOpen && deleteBtnOpen.addEventListener('click', function() {
  if (deleteModal) {
    deleteModal.setAttribute('aria-hidden', 'false');
    deleteModal.classList.remove('hidden');
    deleteModal.classList.add('open');
  }
});

function closeDeleteModal() {
  if (deleteModal) {
    deleteModal.setAttribute('aria-hidden', 'true');
    deleteModal.classList.add('hidden');
    deleteModal.classList.remove('open');
  }
}

deleteCancel && deleteCancel.addEventListener('click', closeDeleteModal);
deleteBack   && deleteBack.addEventListener('click', closeDeleteModal);
deleteModal  && deleteModal.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeDeleteModal(); });

/* ── Recherche d'amis (client-side) ─────────────────── */
var searchInput   = document.getElementById('friend-search');
var searchResults = document.getElementById('search-results');
var sentRequestIds = [];

function renderSearchResults(users) {
  if (!searchResults) return;
  if (!users.length) {
    searchResults.innerHTML = '<p class="font-body text-sm text-neutral-500 text-center py-2">Aucun résultat.</p>';
    searchResults.classList.remove('hidden');
    return;
  }
  searchResults.innerHTML = users.map(function(u) {
    var isFriend  = friendsForClient.some(function(f) { return f.id === u.id; });
    var isPending = sentRequestIds.includes(u.id);
    var isMe      = u.id === userId;
    var avatarHtml = u.avatar
      ? '<img src="' + PB_BASE_URL + '/api/files/' + u.collectionId + '/' + u.id + '/' + u.avatar + '" class="w-10 h-10 rounded-full object-cover border border-primary-400/20 shrink-0" alt="' + (u.pseudo || 'Guerrier') + '" />'
      : '<div class="w-10 h-10 rounded-full bg-dark-600 border border-primary-400/20 flex items-center justify-center shrink-0" aria-hidden="true"><span class="font-display text-lg text-primary-400">' + (u.pseudo || 'G')[0].toUpperCase() + '</span></div>';
    var actionHtml = isMe ? '' : isFriend
      ? '<span class="search-tag-friend" aria-label="Déjà ami">Ami</span>'
      : isPending
        ? '<span class="search-tag-pending" aria-label="Demande envoyée">Envoyée</span>'
        : '<button class="add-friend-btn btn-primary-sm" data-target-id="' + u.id + '" aria-label="Ajouter ' + (u.pseudo || 'cet utilisateur') + ' en ami">Ajouter</button>';
    return '<div class="flex items-center gap-3 p-3 rounded-xl bg-dark-700/50 border border-primary-400/10">' +
      avatarHtml +
      '<p class="font-heading text-sm text-neutral-200 tracking-wide flex-1">' + (u.pseudo || u.nom || 'Guerrier') + '</p>' +
      actionHtml +
      '</div>';
  }).join('');
  searchResults.classList.remove('hidden');

  searchResults.querySelectorAll('.add-friend-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      sendFriendRequest(btn.getAttribute('data-target-id'), btn);
    });
  });
}

async function sendFriendRequest(targetId, btn) {
  if (!targetId) return;
  try {
    var res = await fetch(PB_BASE_URL + '/api/collections/users/records/' + targetId + '?fields=id,demande_amies', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    var target = await res.json();
    var existing = target.demande_amies || [];
    if (existing.includes(userId)) { if (btn) btn.textContent = 'Envoyée'; return; }
    var patch = await fetch(PB_BASE_URL + '/api/collections/users/records/' + targetId, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ demande_amies: [...existing, userId] })
    });
    if (patch.ok) {
      if (btn) { btn.textContent = 'Envoyée'; btn.disabled = true; }
      sentRequestIds.push(targetId);
    }
  } catch(_) {}
}

searchInput && searchInput.addEventListener('input', function() {
  var q = (searchInput.value || '').trim().toLowerCase();
  if (q.length < 2) { if (searchResults) searchResults.classList.add('hidden'); return; }
  var filtered = allUsersForSearch.filter(function(u) {
    return (u.pseudo + ' ' + u.prenom + ' ' + u.nom).toLowerCase().includes(q);
  }).slice(0, 8);
  renderSearchResults(filtered);
});

/* ── Avatar — auto-submit au changement de fichier ─── */
var avatarInput = document.getElementById('avatar-input');
var avatarForm  = document.getElementById('avatar-form');
if (avatarInput && avatarForm) {
  avatarInput.addEventListener('change', function() {
    if (avatarInput.files && avatarInput.files.length > 0) {
      avatarForm.submit();
    }
  });
}
