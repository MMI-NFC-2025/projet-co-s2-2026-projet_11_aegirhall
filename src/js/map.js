import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const el = document.getElementById('map-data');
if (!el) throw new Error('map-data missing');

const bars    = JSON.parse(el.dataset.bars    || '[]');
const visited = JSON.parse(el.dataset.visited || '[]');

// Centre par défaut sur les bars ou coordonnées fournies
const center = bars.length
  ? [bars[0].lat, bars[0].lng]
  : [48.8566, 2.3522];

const map = L.map('map', { zoomControl: true }).setView(center, 14);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Icône personnalisée selon statut
function makeIcon(isVisited, ordre) {
  const bg    = isVisited ? '#2D6A4F' : '#C49A2C';
  const ring  = isVisited ? '#6FCF97' : '#E8BE50';
  return L.divIcon({
    html: `<div style="
      width:36px;height:36px;border-radius:50%;
      background:${bg};border:2px solid ${ring};
      display:flex;align-items:center;justify-content:center;
      font-family:'Cinzel',serif;font-size:13px;font-weight:700;
      color:#F5EFE3;box-shadow:0 2px 8px #00000088;
    ">${ordre}</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });
}

bars.forEach(bar => {
  if (!bar.lat || !bar.lng) return;
  const isVisited = visited.includes(bar.id);

  L.marker([bar.lat, bar.lng], { icon: makeIcon(isVisited, bar.ordre) })
    .addTo(map)
    .bindPopup(`
      <div style="font-family:'Cinzel',serif;min-width:160px;text-align:center;">
        <strong style="color:#C49A2C;font-size:14px;">${bar.nom}</strong><br>
        <span style="color:#9CB4C8;font-size:12px;">${bar.adresse || ''}</span><br>
        <a href="/bars/${bar.id}" style="
          display:inline-block;margin-top:8px;padding:4px 14px;
          background:#C49A2C;color:#040C16;border-radius:4px;
          font-size:11px;letter-spacing:.08em;text-decoration:none;
        ">Voir</a>
      </div>
    `, { className: 'popup-viking' });
});

// Ajuster la vue sur tous les marqueurs
if (bars.length > 1) {
  const bounds = L.latLngBounds(bars.filter(b => b.lat && b.lng).map(b => [b.lat, b.lng]));
  map.fitBounds(bounds, { padding: [40, 40] });
}
