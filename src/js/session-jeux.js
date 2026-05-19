/* ── Jeu aléatoire — session en cours ── */
var dataEl  = document.getElementById('jeux-data');
var btn     = document.getElementById('btn-random-game');
var result  = document.getElementById('random-game-result');
var rgImg   = document.getElementById('rg-img');
var rgNom   = document.getElementById('rg-nom');
var rgDiff  = document.getElementById('rg-diff');

if (dataEl && btn && result) {
  var games = JSON.parse(dataEl.dataset.games || '[]');

  btn.addEventListener('click', function() {
    if (!games.length) return;
    var game = games[Math.floor(Math.random() * games.length)];

    if (rgImg) {
      rgImg.innerHTML = game.img
        ? '<img src="' + game.img + '" alt="' + (game.nom || 'Jeu') + '" class="w-full h-full object-cover" />'
        : '';
    }
    if (rgNom)  rgNom.textContent  = game.nom || 'Jeu inconnu';
    if (rgDiff) rgDiff.textContent = game.difficulter != null
      ? 'Difficulté ' + game.difficulter + '/10'
      : '';

    result.classList.remove('hidden');
    result.classList.add('flex');
  });
}
