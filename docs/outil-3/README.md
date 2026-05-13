# 📦 Package final — Outil 3 "Évaluation d'attractivité offre Sales" (Mariell)

**Version du package** : 1.1 — Mai 2026 (system prompt mis à jour V8 → V9)

**Changelog V9** : ajout de 2 règles éditoriales sur les leviers d'évolution dans la section 6 du system prompt :
1. Pour les postes **Managers/Directors** (Head of Sales, VP Sales, CRO) sans signal explicite d'évolution dans le brief, le LLM ne doit **pas** suggérer une évolution de poste mais une évolution **de missions/enjeux/périmètre** sur 18-24 mois
2. Pour les postes **AE en structure early-stage**, la trajectoire d'évolution doit obligatoirement passer par **Team Lead avant Head of Sales** (un AE n'évolue jamais directement en Head of Sales)

**Statut** : Prêt pour implémentation production

---

## 🎯 À quoi sert cet outil

L'outil 3 du Lab Mariell est un **évaluateur LLM d'attractivité d'offres Sales** destiné aux DRH, VP Sales et CEO de boîtes de 30-300 personnes. Le prospect remplit un formulaire détaillant son offre (entreprise, secteur, poste, package, missions, modalité de travail), et reçoit en retour une évaluation qualitative structurée en 8 sections markdown, accompagnée d'un bloc JSON de méta-données pour le rendu visuel (jauge, badges, alertes).

L'outil exploite 4 référentiels propriétaires Mariell (entreprises, secteurs, missions, salaires) qui constituent le cœur de la valeur différenciante de l'outil — c'est l'expertise terrain Mariell encodée en données.

**Modèle LLM** : Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) via API Anthropic.

**Stack technique** : Nuxt 3 (Vue 3, Composition API) + Nitro server routes + Vercel Pro + Brevo (emails) + Jarvi (CRM/ATS) + Vercel KV (rate limiting + persistance) + Cloudflare Turnstile (anti-bot).

---

## 📂 Structure du package

```
PACKAGE_FINAL_OUTIL_3/
├── README.md                                    # Ce fichier
├── INSTRUCTIONS_DEV.md                          # ⭐ Document principal à lire en premier
│
├── 01-prompts/                                  # System prompt + référentiels (à charger côté backend)
│   ├── system-prompt-v9.md
│   ├── f1-boites-intouchables-v7.md
│   ├── f2-grille-secteurs-v3.md
│   ├── f3-typologie-missions-v5.md
│   └── f4-addendum-salaires-v6.md
│
├── 02-spec-technique/                           # Spec d'implémentation Nitro complète
│   └── spec-technique-route-nitro-v4.md
│
├── 03-formulaire-specs/                         # Specs détaillées des champs du formulaire
│   └── formulaire-specs.md
│
├── 04-templates-emails/                         # Templates emails Brevo (4 templates)
│   └── templates-brevo-v4.md
│
├── 05-briefs-design/                            # Briefs Claude Design (6 briefs cumulatifs)
│   ├── 01-brief-formulaire-principal.md
│   ├── 02-brief-formulaire-modifs-tel-site-poste-secteur.md
│   ├── 03-brief-formulaire-modalite-travail.md
│   ├── 04-brief-resultat-principal.md
│   ├── 05-brief-resultat-3-ecrans-complementaires.md
│   └── 06-brief-resultat-cta-aligne.md
│
├── 06-tests/                                    # Suites de tests pour validation LLM
│   ├── 01-tests-generaux-8-cas.md
│   └── 02-tests-salaires-12-cas.md
│
└── 07-pour-test-claude-console/                 # Test rapide hors backend
    ├── system-prompt-COMPLET-v9.md
    └── guide-test-claude-console.md
```

---

## 🚀 Pour démarrer

**Avant tout** : ouvre le fichier `INSTRUCTIONS_DEV.md` à la racine du package. C'est le document principal qui te guide à travers l'implémentation, dans l'ordre.

Si tu veux juste tester rapidement le LLM avant de coder quoi que ce soit, va directement dans `07-pour-test-claude-console/` et suis le guide.

---

## ⚠️ Points d'attention critiques

| # | Point | Pourquoi c'est critique |
|---|---|---|
| 1 | **Architecture deterministic-by-design pour le scoring package** | Le LLM hallucinait sur les salaires en utilisant ses connaissances LinkedIn/Glassdoor. Solution : le backend pré-calcule la position du package selon F4 V5 et l'injecte dans le user prompt. Cf. `calculatePackagePosition()` dans la spec V4 |
| 2 | **Prompt caching Anthropic** | F1/F2/F3/F4 sont des blocs `system` séparés avec `cache_control: ephemeral`. Réduction du coût API ~80-85% après cache hit. Cf. section 6.2 de la spec V4 |
| 3 | **Confidentialité des référentiels** | Le LLM ne doit JAMAIS révéler l'existence des fichiers F1/F2/F3/F4, des Tiers, de la grille, dans son output. Couche de sécurité avec filtre mots-clés en post-traitement |
| 4 | **Sécurité prompt injection** | 2 couches : (1) détection de patterns au niveau Zod schema (ex. injection patterns dans `description_missions`), (2) filtre mots-clés sur l'output LLM |
| 5 | **Rate limiting unifié** | 3 soumissions/jour, 7/semaine par IP via Vercel KV. Comportement Option 2 (capture lead + traitement différé) si limite atteinte |

---

## 📊 Tracker des versions finales

| Composant | Version finale | Fichier |
|---|---|---|
| System prompt | V9 | `01-prompts/system-prompt-v9.md` |
| F1 Boîtes intouchables | V7 | `01-prompts/f1-boites-intouchables-v7.md` |
| F2 Grille secteurs | V3 | `01-prompts/f2-grille-secteurs-v3.md` |
| F3 Typologie missions | V5 | `01-prompts/f3-typologie-missions-v5.md` |
| F4 Addendum salaires | V5 | `01-prompts/f4-addendum-salaires-v6.md` |
| Spec technique route Nitro | V4 | `02-spec-technique/spec-technique-route-nitro-v4.md` |
| Templates Brevo | V4 | `04-templates-emails/templates-brevo-v4.md` |

---

## 📞 Contacts

Pour toute question sur ce package : voir `INSTRUCTIONS_DEV.md` section "Si vous avez des questions".
