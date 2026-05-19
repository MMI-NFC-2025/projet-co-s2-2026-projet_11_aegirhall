/* ── Carrousel double panneau — LandingPage ─────────────── */
var el    = document.getElementById('carousel-data');
var _bars = el ? JSON.parse(el.dataset.bars || '[]') : [];
var _idx  = 0;
var _cur  = 'a';
var _busy = false;
var DUR   = 550;

function _q(id) { return document.getElementById(id); }
function _pad(n) { return String(n).padStart(2, '0'); }

function _fill(panel, b, barIdx) {
  var prlx = _q('prlx-'  + panel); if (prlx) prlx.style.backgroundImage = b.photoUrl ? "url('" + b.photoUrl + "')" : 'none';
  var nom  = _q('nom-'   + panel); if (nom)  nom.textContent  = b.nom;
  var num  = _q('num-'   + panel); if (num)  num.textContent  = _pad(barIdx + 1);
  var cnom = _q('cnom-'  + panel); if (cnom) cnom.textContent = b.nom;
  var cadr = _q('cadr-'  + panel); if (cadr) cadr.textContent = b.adresse;
  var cdesc= _q('cdesc-' + panel); if (cdesc)cdesc.textContent= b.desc;
}

function _goTo(newIdx, dir) {
  if (_busy || !_bars.length || newIdx === _idx) return;
  _busy = true;
  var next = _cur === 'a' ? 'b' : 'a';
  var b    = _bars[newIdx];
  _fill(next, b, newIdx);

  var bgCur  = _q('bg-'   + _cur);
  var cdCur  = _q('card-' + _cur);
  var bgNext = _q('bg-'   + next);
  var cdNext = _q('card-' + next);

  if (bgCur && bgNext && cdCur && cdNext) {
    bgNext.style.transition = 'none'; bgNext.style.transform = 'translateY(100%)';
    cdNext.style.transition = 'none'; cdNext.style.transform = 'translateX(-100%)';
    bgNext.getBoundingClientRect(); cdNext.getBoundingClientRect();
    var ease = 'transform ' + DUR + 'ms cubic-bezier(0.4,0,0.2,1)';
    bgCur.style.transition  = ease; bgCur.style.transform  = 'translateY(-100%)';
    cdCur.style.transition  = ease; cdCur.style.transform  = 'translateX(100%)';
    bgNext.style.transition = ease; bgNext.style.transform = 'translateY(0)';
    cdNext.style.transition = ease; cdNext.style.transform = 'translateX(0)';
  }

  /* Mobile */
  var mobBg   = _q('mob-bg');      if (mobBg   && b.photoUrl) mobBg.src = b.photoUrl;
  var mobNom  = _q('mob-nom');     if (mobNom)  mobNom.textContent  = b.nom;
  var mobAdr  = _q('mob-adr');     if (mobAdr)  mobAdr.textContent  = b.adresse;
  var mobDesc = _q('mob-desc');    if (mobDesc) mobDesc.textContent = b.desc;
  var mobCtr  = _q('mob-counter'); if (mobCtr)  mobCtr.textContent  = _pad(newIdx + 1) + ' / ' + _pad(_bars.length);

  setTimeout(function() {
    if (bgCur && cdCur) {
      bgCur.style.transition = 'none'; bgCur.style.transform = 'translateY(100%)';
      cdCur.style.transition = 'none'; cdCur.style.transform = 'translateX(-100%)';
    }
    _cur = next; _idx = newIdx; _busy = false;
    var ctr = _q('bar-counter'); if (ctr) ctr.textContent = _pad(newIdx + 1) + ' / ' + _pad(_bars.length);
  }, DUR + 50);
}

if (_bars.length > 1) _fill('b', _bars[1], 1);

var p = _q('bar-prev');  if (p) p.addEventListener('click', function() { _goTo((_idx - 1 + _bars.length) % _bars.length, -1); });
var n = _q('bar-next');  if (n) n.addEventListener('click', function() { _goTo((_idx + 1) % _bars.length, 1); });
var mp= _q('mob-prev');  if (mp)mp.addEventListener('click', function() { _goTo((_idx - 1 + _bars.length) % _bars.length, -1); });
var mn= _q('mob-next');  if (mn)mn.addEventListener('click', function() { _goTo((_idx + 1) % _bars.length, 1); });

/* ── Scroll reveal ───────────────────────────────────────── */
var revealObs = new IntersectionObserver(
  function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObs.unobserve(e.target); }
    });
  },
  { threshold: 0.10 }
);
document.querySelectorAll('.reveal').forEach(function(el) { revealObs.observe(el); });

/* ── Parallax scroll léger sur le panneau photo ─────────── */
window.addEventListener('scroll', function() {
  var prlx = _q('prlx-' + _cur); if (!prlx) return;
  var wrap = _q('bg-wrap');       if (!wrap) return;
  var rect = wrap.getBoundingClientRect();
  prlx.style.backgroundPositionY = (50 - (rect.top / window.innerHeight) * 12) + '%';
}, { passive: true });
