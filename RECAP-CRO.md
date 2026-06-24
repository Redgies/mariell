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

## ⏸️ À valider (volontairement NON appliqué)

### 1. QW-2 — Rétrograder « Nous écrire » dans le hero
- **Constat audit :** le bouton mailto « Nous écrire » est à poids visuel ~égal au CTA Calendly et le dilue (le mailto n'a ni qualification, ni tracking, ni prise de RDV).
- **Pourquoi non appliqué :** tu avais **explicitement demandé** ce CTA mailto. La microcopy QW-1 rééquilibre déjà l'attention vers le primaire.
- **Décision attendue :** le garder tel quel, ou le passer en **petit lien texte** sous le CTA (au lieu d'un bouton) ?

### 2. CTA mobile persistant (sticky) — **levier n°1 de l'audit**
- **Constat :** sous 900px, le CTA de la nav est enfoui dans le menu burger. Un visiteur qui scrolle sur mobile **n'a aucun accès visible au Calendly** avant le tout bas de page.
- **Pourquoi non appliqué :** changement plus lourd (nouveau composant barre fixe, z-index, à masquer sur les pages outils Lab).
- **Décision attendue :** je crée une barre CTA fixe en bas d'écran sur mobile ? (plus gros impact attendu)

### 3. QW-8 — Changer le label du CTA final
- **Proposition audit :** « Rencontrer Mariell » → « **Planifier un brief** » (plus orienté action, fait écho à la 1ʳᵉ étape du process).
- **Pourquoi non appliqué :** changement de copy établie ; j'ai gardé le label actuel.
- **Décision attendue :** tester la variante ou non.

### 4. QW-4 — CTA après la frise process — **écarté**
- Aurait nécessité de polluer `index.vue` (qui doit rester un fichier de composition pur) et créait 5 CTA rapprochés. Les 4 CTA actuels couvrent déjà bien le funnel. *(Pas d'action requise — noté pour transparence.)*

---

## ⚠️ À traiter en dehors du CRO (sécurité — important)

**Tous les `.svg` de `brand-kit/` sont infectés** par un script JS embarqué qui détourne la géolocalisation
(`navigator.geolocation.*` + `navigator.permissions.query`). Le vrai logo n'est que ~3 `<text>` ; le reste (~56 Ko) est le script.
→ Aucun SVG n'est utilisé sur le site (le logo est rendu en **texte vivant** via la police Tiempos déjà self-hostée).
→ **Action recommandée :** vérifier l'origine de ce brand-kit et purger / ré-exporter les SVG proprement.
*(Le favicon `favicon_mariell.png` et l'og:image `og-home.png` sont des PNG sains et sont utilisés.)*
