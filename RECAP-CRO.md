# Récap CRO — Mariell

> Audit CRO (Conversion Rate Optimization) focalisé sur **la conversion RDV Calendly**, + quick wins appliqués.
> Date : 2026-06-24 · Objectif n°1 : maximiser les prises de RDV via `siteConfig.calendlyUrl` (`…/30min`).
> Audit heuristique (pas de données analytics branchées dans le projet).

---

## ✅ Quick wins appliqués

| # | Changement | Fichier(s) | Impact / Effort |
|---|------------|------------|-----------------|
| QW-1 | Microcopy de réassurance sous le CTA hero — « 30 min · Sans engagement · Confidentiel » | `app/components/home/HeroSection.vue` | High / S |
| QW-3 | CTA « Rencontrer Mariell » ajouté dans la section **Témoignages** (pic de confiance) + sous-texte réassurance | `app/components/home/Testimonials.vue` | High / S |
| QW-6 | Vrai CTA Calendly dans **StatementBand** (les onglets « Recrutement ciblé / Team Buildout » ne convertissaient pas) | `app/components/home/StatementBand.vue` | Med / S |
| QW-7 | CTA « Rencontrer Mariell » ajouté dans le **hero de `/performances`** (n'en avait aucun) | `app/pages/performances.vue` | Med / S |
| QW-8* | Microcopy de réassurance sous le CTA final (CtaBand) — *label conservé* | `app/components/home/CtaBand.vue` | Med / S |
| QW-5 | `target="_blank" rel="noopener"` ajouté à **10 liens Calendly** sur 7 pages qui sortaient le visiteur du site | `recrutement-commercial.vue`, `expertises/index.vue`, `expertises/[slug].vue`, `methode.vue`, `mariell.vue`, `blog/[slug].vue`, `performances.vue` | Med / S |

**Effet net sur la home :** on passe de **2 points de conversion** (hero + bas de page) à **4 bien répartis dans le funnel** :
`Hero → StatementBand → Témoignages → CtaBand`, chacun avec réassurance « 30 min / sans engagement ».
La durée de 30 min est exacte (confirmée par l'URL Calendly `/30min`).

Build vérifié : `npm run build` → OK (exit 0).

---

## ✅ Décisions sur les points en attente (toutes traitées le 2026-06-25)

> **Décisions prises (2026-06-25) — toutes traitées.**

### 1. QW-2 — « Nous écrire » dans le hero → ✅ **GARDÉ TEL QUEL**
- Décision : on conserve le CTA mailto. Il dilue légèrement le CTA principal, mais reste clair et distinct — utile pour ceux qui veulent simplement écrire un mail. La microcopy QW-1 rééquilibre déjà l'attention. *(Aucun changement.)*

### 2. CTA mobile persistant (sticky) → ✅ **FAIT** *(levier n°1 de l'audit)*
- Nouveau composant `app/components/AppMobileCta.vue` : barre fixe en bas d'écran, **mobile uniquement (< 901px)**, CTA « Rencontrer Mariell » + réassurance « 30 min · Sans engagement · Confidentiel ».
- Montée dans `app/layouts/default.vue` → **exclue automatiquement des pages outils Lab** (qui sont en `layout: false`).
- Apparaît après avoir scrollé au-delà du hero (`scrollY > 480`), se masque près du bas de page pour ne pas recouvrir le footer / CTA final. Désactivée en `prefers-reduced-motion` (fondu seul, pas de slide).

### 3. QW-8 — Label du CTA final → ✅ **VARIANTE APPLIQUÉE**
- `CtaBand.vue` : « Rencontrer Mariell » → « **Planifier un brief** » (plus orienté action, écho à la 1ʳᵉ étape du process). À tester / mesurer.

### 4. QW-4 — CTA après la frise process → ⛔️ **ÉCARTÉ (confirmé)**
- Aurait pollué `index.vue` (fichier de composition pur) pour un 5ᵉ CTA rapproché. Les 4 CTA actuels couvrent bien le funnel. *(Pas d'action.)*

---

## ⚠️ À traiter en dehors du CRO (sécurité — important)

**Les 10 `.svg` de `brand-kit/` étaient infectés** par un script JS embarqué qui détournait la géolocalisation
(`navigator.geolocation.*` + `navigator.permissions.query`).
→ ✅ **NETTOYÉS le 2026-06-25** : bloc `<script>` retiré de chaque fichier, vérifié (0 script / 0 payload restant, dessin du logo intact, 10/10 XML bien formés). Les SVG sont désormais sains.
→ Aucun SVG n'était de toute façon utilisé sur le site (logo rendu en **texte vivant** via la police Tiempos self-hostée).
→ **Reste à faire côté équipe :** vérifier l'**origine** de ce brand-kit (par quel outil/export l'injection est arrivée) pour éviter que ça recommence.
*(Le favicon `favicon_mariell.png` et l'og:image `og-home.png` sont des PNG sains et sont utilisés.)*
