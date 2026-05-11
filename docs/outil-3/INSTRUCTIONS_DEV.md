# 🛠️ Instructions dev — Implémentation outil 3 (Lab Mariell)

**Public** : développeur(se) Nuxt 3 / Vue 3 chargé(e) de l'implémentation production.

**Niveau attendu** : maîtrise Nuxt 3, Vue 3 Composition API, Nitro server routes, TypeScript, expérience avec une API LLM (idéalement Anthropic).

**Estimation temps d'implémentation** : 25-40h selon l'expérience et le périmètre (formulaire frontend inclus ou non).

---

## ⚡ Quick start (5 minutes)

Avant de plonger dans l'implémentation, fais un test rapide pour comprendre comment l'outil fonctionne :

1. Va sur **console.anthropic.com** → Workbench
2. Sélectionne **Claude Haiku 4.5** (`claude-haiku-4-5-20251001`)
3. Copie le contenu de `07-pour-test-claude-console/system-prompt-COMPLET-v9.md` dans le panneau **System prompt**
4. Suis le `guide-test-claude-console.md` du même dossier — il contient 3 cas de test prêts à l'emploi avec le pré-calcul package déjà fait à la main

Tu vas voir en 5 min ce que fait l'outil et quelle est la sortie attendue. Ça te donnera le bon contexte pour la suite.

---

## 🎯 Vue d'ensemble de l'architecture

L'outil 3 est une route POST Nitro qui :

1. **Reçoit** les inputs du formulaire (14 champs)
2. **Valide** via Zod schema avec détection de prompt injection
3. **Vérifie** le rate limiting via Vercel KV (3/jour, 7/semaine par IP)
4. **Pré-calcule** la position du package selon F4 V5 (fonction `calculatePackagePosition()`)
5. **Construit** le user prompt avec injection du pré-calcul
6. **Construit** les 5 blocs `system` (V9 + F1 + F2 + F3 + F4) avec `cache_control: ephemeral`
7. **Appelle** l'API Anthropic Messages en streaming avec `claude-haiku-4-5`
8. **Parse** la réponse hybride (JSON + délimiteur + Markdown)
9. **Valide** l'output (filtre mots-clés interdits — fuite référentiels)
10. **Persiste** dans Vercel KV avec UUID
11. **Envoie** 4 templates emails via Brevo (notification interne livrée + différée + confirmation prospect + suivi)
12. **Crée** un contact dans Jarvi (CRM)
13. **Retourne** au frontend l'UUID + le markdown final

Tout ça est documenté en détail dans `02-spec-technique/spec-technique-route-nitro-v4.md` (~2500 lignes).

---

## 📋 Plan d'implémentation recommandé

### Phase 0 — Setup environnement (1-2h)

1. **Comptes API à créer** :
   - [ ] Anthropic API key (https://console.anthropic.com) — coût ~$0.005/évaluation après cache hit
   - [ ] Brevo API key (https://www.brevo.com) — gratuit jusqu'à 300 emails/jour
   - [ ] Cloudflare Turnstile site key + secret key (https://www.cloudflare.com/products/turnstile/) — gratuit
   - [ ] Vercel KV namespace (depuis le dashboard Vercel) — gratuit jusqu'à 30k commands/mois
   - [ ] Jarvi API access (à demander à Romain) — payant (déjà inclus dans abonnement Mariell)

2. **Variables d'environnement** (`.env.local` puis Vercel) :
   ```bash
   ANTHROPIC_API_KEY=sk-ant-...
   BREVO_API_KEY=xkeysib-...
   BREVO_NOTIF_RECIPIENT=romain@mariell.fr
   BREVO_TEMPLATE_NOTIF_INTERNE_LIVREE_ID=12
   BREVO_TEMPLATE_NOTIF_INTERNE_DIFFEREE_ID=13
   BREVO_TEMPLATE_CONFIRMATION_PROSPECT_ID=14
   BREVO_TEMPLATE_SUIVI_PROSPECT_ID=15
   TURNSTILE_SITE_KEY=0x4...
   TURNSTILE_SECRET_KEY=0x4...
   KV_REST_API_URL=https://...
   KV_REST_API_TOKEN=...
   JARVI_API_KEY=...
   PUBLIC_BASE_URL=https://mariell-dusky.vercel.app
   ```

3. **Installer les dépendances** :
   ```bash
   pnpm add @anthropic-ai/sdk zod @vercel/kv
   pnpm add -D @types/node
   ```

### Phase 1 — Structure de fichiers (1h)

Créer la structure suivante dans le projet Nuxt :

```
server/
├── api/
│   └── lab/
│       └── evaluation-attractivite/
│           ├── generate.post.ts          # Route principale (~250 lignes)
│           └── get-by-uuid.get.ts        # Récup évaluation persistée
├── prompts/
│   └── outil-3/
│       ├── system-prompt-v9.md           # ← copier depuis 01-prompts/
│       ├── f1-boites-intouchables-v7.md  # ← copier depuis 01-prompts/
│       ├── f2-grille-secteurs-v3.md      # ← copier depuis 01-prompts/
│       ├── f3-typologie-missions-v5.md   # ← copier depuis 01-prompts/
│       └── f4-addendum-salaires-v5.md    # ← copier depuis 01-prompts/
├── utils/
│   └── outil-3/
│       ├── load-prompts.ts               # Charge les 5 fichiers en mémoire au boot
│       ├── build-system-blocks.ts        # Construit le tableau de 5 blocs system
│       ├── build-user-prompt.ts          # Construit le user prompt avec injection pré-calcul
│       ├── calculate-package-position.ts # Pré-calcul position package selon F4 V5
│       ├── parse-llm-response.ts         # Parse hybride JSON + Markdown
│       ├── validate-output.ts            # Filtre mots-clés (sécurité fuite référentiels)
│       ├── injection-patterns.ts         # Détection patterns prompt injection
│       ├── rate-limit.ts                 # Rate limiting via KV
│       ├── brevo-send.ts                 # Envoi emails Brevo
│       └── jarvi-create-contact.ts       # Création contact Jarvi
└── schemas/
    └── outil-3/
        ├── formulaire.ts                 # Schéma Zod du formulaire
        └── llm-output-json.ts            # Schéma Zod du JSON LLM
```

Le code de chaque fichier utility est intégralement fourni dans la spec technique V4. **Il n'y a pas à inventer** — c'est du copier-coller-adapter.

### Phase 2 — Implémentation des utils (8-12h)

Dans l'ordre, en suivant la spec V4 :

1. **`schemas/outil-3/formulaire.ts`** — schéma Zod (cf. spec section 4)
2. **`schemas/outil-3/llm-output-json.ts`** — schéma Zod du JSON LLM (cf. spec section 6.4)
3. **`utils/outil-3/load-prompts.ts`** — chargement des 5 fichiers (cf. spec section 6.2.1)
4. **`utils/outil-3/build-system-blocks.ts`** — construction blocs system (cf. spec section 6.2.2)
5. **`utils/outil-3/calculate-package-position.ts`** — pré-calcul position (cf. spec section 6.3) ⭐ **critique**
6. **`utils/outil-3/build-user-prompt.ts`** — user prompt avec injection (cf. spec section 6.4) ⭐ **critique**
7. **`utils/outil-3/parse-llm-response.ts`** — parse hybride (cf. spec section 6.5)
8. **`utils/outil-3/validate-output.ts`** — filtre mots-clés (cf. spec section 7)
9. **`utils/outil-3/injection-patterns.ts`** — détection patterns (cf. spec section 7)
10. **`utils/outil-3/rate-limit.ts`** — rate limiting KV (cf. spec section 5)
11. **`utils/outil-3/brevo-send.ts`** — envoi emails (cf. `04-templates-emails/templates-brevo-v4.md`)
12. **`utils/outil-3/jarvi-create-contact.ts`** — Jarvi (cf. spec section 8)

### Phase 3 — Route principale (3-5h)

Implémenter `server/api/lab/evaluation-attractivite/generate.post.ts` en suivant la spec section 5 (~250 lignes de code orchestrant les utils).

### Phase 4 — Tests (4-8h)

1. **Tests unitaires** : `calculate-package-position.test.ts` (4 cas fournis dans la spec V4 section 6.3.1)
2. **Tests d'intégration** : envoyer 3 cas du dossier `06-tests/02-tests-salaires-12-cas.md` (cas A, B, C) à la route en local
3. **Tests LLM en conditions réelles** : passer la suite complète des 8 cas généraux + 12 cas salaires (`06-tests/`)
4. **Tests de sécurité** : tenter 3 prompt injections différentes via le champ `description_missions`

### Phase 5 — Frontend Vue (8-12h, optionnel selon répartition)

⚠️ **Cette phase peut être faite par Claude Design** plutôt que par toi. Les 6 briefs design dans `05-briefs-design/` sont conçus pour ça.

Si tu codes le frontend toi-même :
- Page formulaire : `pages/lab/evaluation-attractivite/index.vue`
- Page résultat : `pages/lab/evaluation-attractivite/resultat/[uuid].vue`
- Composables : `composables/outil-3/useEvaluation.ts` (gestion état formulaire + appel API + redirection)
- Utiliser **Radix Vue** ou **Headless UI Vue** pour les composants formulaire (pas React)

### Phase 6 — Déploiement (1-2h)

1. Configurer les variables d'environnement sur Vercel
2. Configurer le namespace KV sur Vercel
3. Créer les 4 templates Brevo en suivant `04-templates-emails/templates-brevo-v4.md`
4. Déployer en preview puis en production
5. Vérifier les logs Vercel sur les premiers appels (vérifier `cache_hit_rate`)

---

## 🎓 Points clés à comprendre avant de coder

### Point clé 1 — Le LLM ne calcule plus le scoring package

Tu vas voir dans le system prompt V9 (section 5) une règle absolue : *"Tu ne recalcules pas, tu ne contestes pas le pré-calcul fourni"*. C'est volontaire.

**Pourquoi** : on a découvert que le LLM hallucinait massivement sur les salaires en utilisant ses connaissances LinkedIn/Glassdoor (qui sont 10-15% au-dessus de la réalité signée FR 2026). La grille terrain F4 V5 reflète l'expertise terrain Mariell — c'est le cœur de valeur de l'outil. Pour forcer le LLM à la respecter, le backend Nitro la convertit en code (`calculatePackagePosition()`) et injecte le résultat dans le user prompt.

**Conséquence pour toi** : la fonction `calculatePackagePosition()` est **critique**. Elle doit être 100% fidèle aux bornes F4 V5. La spec V4 fournit le code complet ainsi que des tests unitaires couvrant les cas border-line. Ne modifie pas les bornes.

### Point clé 2 — Le prompt caching économise ~85% du coût API

Sans caching, chaque évaluation coûterait ~$0.030 en tokens input (les 30k tokens de référentiels rechargés à chaque appel).

Avec caching, après le premier appel "froid", les appels suivants dans la fenêtre de 5 min coûtent ~10% du prix normal sur les tokens cachés. En régime stationnaire, ~$0.005/évaluation.

**Conséquence pour toi** : ne fusionne pas les blocs `system`. Garde bien 5 blocs séparés avec `cache_control: ephemeral` sur les 4 référentiels (le system prompt V9 lui-même n'est pas caché). C'est documenté en détail dans la spec V4 section 6.2.

### Point clé 3 — La sécurité a 2 couches

**Couche 1 — Détection des prompt injections en input** : avant d'envoyer au LLM, on filtre les patterns suspects dans `description_missions` (ex. *"ignore previous instructions"*, *"reveal the tier"*, etc.). Le module `injection-patterns.ts` contient les regex à appliquer.

**Couche 2 — Filtre mots-clés en output** : après réponse du LLM, on scanne le markdown pour détecter d'éventuelles fuites de référentiels (*"Tier S"*, *"F1"*, *"grille interne"*, *"Mariell référentiel"*, etc.). Si détection, fallback dégradé.

Les deux couches sont essentielles. Ne saute pas la couche 2 même si tu fais confiance au prompt.

### Point clé 4 — Le rate limiting utilise l'IP, pas l'email

Le prospect ne s'identifie pas, donc on ne peut pas rate-limiter sur l'email. On utilise l'IP via `x-forwarded-for` (header Vercel).

Limite : 3 soumissions/jour, 7/semaine. Si dépassé, **comportement Option 2** : on capture quand même le lead et on stocke la demande en KV pour traitement différé manuel par Romain (notification email "différée" envoyée au lieu de la "livrée").

### Point clé 5 — Format de sortie LLM hybride

Le LLM doit produire :
```
{
  "niveau_attractivite": "Très attractive",
  "niveau_index": 4,
  "jauge_position": 8,
  "score_interne": 5.5,
  "dimensions": { ... },
  "alertes": [ ... ],
  "brief_flou": false
}
---END_META---

# Pennylane — Une offre solide

[suite du markdown]
```

Le `---END_META---` est un délimiteur **strict**. Le parser le cherche, sépare le JSON du markdown, parse le JSON avec Zod. Si parse échoue, fallback dégradé : on accepte le markdown sans données structurées (jauge non visible). Ne change pas ce délimiteur.

---

## 🧪 Comment tester pendant le dev

### Test rapide en local avec curl

Une fois la route implémentée, tester avec :

```bash
curl -X POST http://localhost:3000/api/lab/evaluation-attractivite/generate \
  -H "Content-Type: application/json" \
  -d @test-payload.json
```

Avec un `test-payload.json` qui ressemble à :

```json
{
  "prenom": "Marie",
  "nom": "Dupont",
  "email": "marie.dupont@pennylane.com",
  "telephone": "+33612345678",
  "entreprise": "Pennylane",
  "site_web": "https://pennylane.com",
  "secteur": "Fintech",
  "localisation": "Paris, France",
  "effectifs_entreprise": "800",
  "equipe_sales": "15 personnes (4 SDR, 8 AE, 2 Team Lead, 1 Head of Sales)",
  "intitule_poste": "Account Executive — Mid-Market",
  "seniorite": "Confirmé 2-5 ans",
  "type_cycle": "Mixte",
  "modalite_travail": "Hybride équilibré (3 jours bureau / sem)",
  "description_missions": "Vous prendrez en charge un portefeuille de cabinets comptables Mid-Market...",
  "package_fixe": 60000,
  "package_ote": 100000,
  "turnstile_token": "..."
}
```

### Suite de tests fournie

Le dossier `06-tests/` contient 2 suites prêtes à l'emploi :

- **`01-tests-generaux-8-cas.md`** : 8 cas variés (Tier S/A/B/hors fichier × secteurs × séniorités × cas piège × test injection)
- **`02-tests-salaires-12-cas.md`** : 12 cas dédiés validation scoring package (1 par profil F4)

Chaque cas a son user prompt prêt à copier-coller et ses critères de validation. Si tous les cas passent, l'outil est solide.

---

## 🚨 Pièges à éviter

### Piège 1 — Modifier les bornes F4 V5 dans le code

**Non.** La grille F4 V5 est l'expertise terrain Mariell. Les bornes dans `calculatePackagePosition()` (`BORNES_FIXE` et `BORNES_OTE`) doivent être strictement alignées sur la grille F4 V5. Si tu vois un écart, c'est un bug.

### Piège 2 — Concaténer les référentiels dans un seul bloc system

**Non.** Garde 5 blocs séparés. Sinon tu perds le bénéfice du prompt caching granulaire (modifier F1 invaliderait tout le cache).

### Piège 3 — Désactiver la couche 2 sécurité parce que "le LLM est sage"

**Non.** Le LLM peut occasionnellement laisser passer des patterns (ex. mentionner "Tier" dans une formulation). La couche 2 est un filet de sécurité gratuit. Garde-la.

### Piège 4 — Augmenter le `max_tokens` au-delà de 16000

Le format markdown attendu fait ~1200 mots = ~2000 tokens. Le bloc JSON fait ~500 tokens. Total ~2500 tokens. Avec une marge confortable, 16000 est largement suffisant. Augmenter coûte plus cher sans bénéfice.

### Piège 5 — Mettre `temperature: 0` pour "stabiliser"

Le LLM doit avoir une légère variabilité dans ses formulations (sinon le ton devient mécanique). `temperature: 0.15` est le bon compromis. Ne descends pas en dessous.

### Piège 6 — Logger les inputs prospects en clair

⚠️ **RGPD**. Les inputs contiennent données personnelles (prénom, nom, email, téléphone). Logger uniquement l'UUID + les méta-données (effectifs, secteur, séniorité, package) — jamais les données identifiantes.

### Piège 7 — Oublier de configurer Cloudflare Turnstile sur le frontend

Si tu testes en local sans Turnstile, ça marche. Mais en production, sans token Turnstile valide, n'importe quel bot peut spammer la route. C'est gratuit et il faut 30 min à configurer.

---

## 📞 Si vous avez des questions

| Type de question | Document de référence |
|---|---|
| Comment fonctionne tel utility ? | `02-spec-technique/spec-technique-route-nitro-v4.md` (section correspondante) |
| Quel champ exact a tel format ? | `03-formulaire-specs/formulaire-specs.md` |
| Quel template email envoyer dans tel cas ? | `04-templates-emails/templates-brevo-v4.md` |
| Comment fonctionne le LLM en interne ? | `01-prompts/system-prompt-v9.md` (lecture obligatoire avant de toucher au code) |
| À quoi sert tel référentiel ? | Lire les fichiers F1 à F4 dans `01-prompts/` |
| Comment Claude Design intègre les pages ? | `05-briefs-design/` (briefs cumulatifs dans l'ordre 01 → 06) |
| Tel cas de test échoue, que vérifier ? | `06-tests/` (critères de validation détaillés) |

Si après lecture des docs tu as encore une question, contacter Romain (Mariell).

---

## ✅ Checklist de fin d'implémentation

Avant de considérer l'implémentation terminée :

### Backend
- [ ] Les 5 fichiers prompts sont dans `server/prompts/outil-3/` et chargés au boot via `loadPrompts()`
- [ ] `calculatePackagePosition()` passe les 4 tests unitaires de la spec V4
- [ ] Le user prompt construit contient bien le bloc `# 🔒 PRÉ-CALCUL PACKAGE`
- [ ] Les 5 blocs `system` ont `cache_control: ephemeral` sur F1/F2/F3/F4 (pas sur V9)
- [ ] Les logs cache (cache_creation_tokens, cache_read_tokens) apparaissent à chaque appel
- [ ] Couche 1 sécurité : injection patterns détectés et bloqués au niveau Zod
- [ ] Couche 2 sécurité : mots-clés interdits filtrés en post-traitement
- [ ] Rate limiting : 4ème soumission depuis la même IP refusée avec capture en KV
- [ ] Persistance : évaluation accessible via `/api/lab/evaluation-attractivite/get-by-uuid?uuid=...`

### Templates emails
- [ ] 4 templates Brevo créés et IDs configurés en variables d'env
- [ ] Notification interne livrée envoyée à Romain en cas de succès
- [ ] Notification interne différée envoyée à Romain en cas de rate-limit
- [ ] Confirmation prospect envoyée au prospect en cas de succès
- [ ] Toutes les variables Brevo (`MODALITE_TRAVAIL`, etc.) sont bien remplies

### CRM
- [ ] Contact créé dans Jarvi à chaque évaluation (livrée ou différée)
- [ ] Custom fields (effectifs, secteur, séniorité, package, modalité) remplis

### Tests LLM
- [ ] Les 8 cas généraux passent (`06-tests/01-tests-generaux-8-cas.md`)
- [ ] Les 12 cas salaires passent (`06-tests/02-tests-salaires-12-cas.md`)
- [ ] Le cas critique AE PME/SMB 55k/75k qualifie bien le fixe en "haut+" (pas "bas")
- [ ] Le cas test injection #8 ne révèle aucun référentiel

### Frontend (si codé en parallèle)
- [ ] Formulaire 14 champs avec validation Zod
- [ ] Modalité de travail en radio 4 options
- [ ] Page résultat avec rendu jauge / badges / alertes selon JSON
- [ ] CTA Calendly aligné sur pattern outil 2 (cf. brief design 06)
- [ ] Mode print fonctionnel sur la page résultat

### Déploiement
- [ ] Variables d'env configurées sur Vercel
- [ ] Vercel KV namespace lié au projet
- [ ] Cloudflare Turnstile configuré et fonctionnel
- [ ] Premier appel de production tracé dans les logs sans erreur

---

**Bonne implémentation 🚀**

Pour toute remontée de bug ou question sur ce package, voir contacts dans le README à la racine.
