---
name: Ægirhall — contexte projet
description: Site barathon viking Ægirhall — stack, thème, collections PocketBase, avancement
type: project
---

Projet Ægirhall : site barathon thème viking construit from scratch avec Astro 5 SSR + Tailwind 4 + PocketBase local + Leaflet.

**Why:** Projet MMI1, barathon étudiant thème nordique. La maquette Figma sert de référence mais le design est libre.

**How to apply:** Toujours garder le thème sombre (bg-dark-800/900), or (primary-400) et runique (font-display = Cinzel Decorative). PocketBase tourne sur localhost:8090.

**Avancement (2026-04-30) :** Projet entièrement scaffoldé (25 fichiers). Build ✓. Prochaine étape : alimenter PocketBase avec les vraies données (bars, users) et tester le check-in.

**Collections PocketBase à créer:**
- `bars` : nom, adresse, description, image, lat, lng, ordre, specialite, horaires
- `users` (auth) : nom, avatar, titre_viking  
- `visites` : user (rel), bar (rel), valide (bool)
