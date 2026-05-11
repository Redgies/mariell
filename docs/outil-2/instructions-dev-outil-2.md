# Instructions développement — Outil n°2 "Plan de sourcing LinkedIn" (Le Lab Mariell)

**Version** : 1.0
**Date** : Mai 2026
**Destinataire** : développeur en charge de l'implémentation
**Stack imposée** : Nuxt 3 (Vue 3 + Nitro) + Vercel Pro + Anthropic API + Brevo + Jarvi + Vercel KV + Cloudflare Turnstile

---

## 1. Mission en une phrase

Implémenter un outil web qui génère un plan de sourcing LinkedIn personnalisé via IA (Claude Haiku 4.5) à partir d'un formulaire web, avec emails de notification, persistance et CRM. URL cible : `mariell.fr/lab/plan-de-sourcing`.

---

## 2. Vue d'ensemble du fonctionnement

### Flow utilisateur

```
1. Le prospect arrive sur /lab/plan-de-sourcing
   → Page formulaire (15 champs en 5 blocs)

2. Il remplit, accepte le RGPD, soumet
   → Cloudflare Turnstile valide (anti-bot)
   → Validation Zod côté serveur
   → Vérification rate limit (3/jour, 7/semaine, 5/mois domaine email)

3. Selon les conditions :
   ├─ SI rate limit OK → génération via API Anthropic (~30 secondes)
   │  → Affichage page résultat avec animation de chargement
   │  → Sauvegarde en KV (90 jours)
   │  → Envoi 2 emails (notif interne + livraison prospect)
   │  → Création contact Jarvi
   │
   └─ SI rate limit dépassé OU API Anthropic en échec →
      Mode "traitement différé"
      → Sauvegarde inputs en KV (7 jours)
      → Envoi 2 emails (notif différée interne + confirmation prospect)
      → Création contact Jarvi avec tag spécial

4. Plus tard, le prospect peut revenir sur /lab/plan-de-sourcing/resultat/[uuid]
   → Page résultat persisté (90 jours TTL)
```

### Composants à livrer

- 3 pages Vue (`index.vue`, `resultat.vue`, `resultat/[uuid].vue`)
- 2 routes serveur Nitro (`generate.post.ts`, `[uuid].get.ts`)
- 5 utilitaires serveur (Anthropic, Brevo, Jarvi, Rate limit, Turnstile)
- 1 composable Vue (`usePlanSourcing.ts`)
- 1 schéma Zod (validation formulaire)
- Variables d'environnement Vercel (Anthropic, Brevo, Jarvi, Turnstile, KV, Calendly)

---

## 3. Liste exhaustive des livrables fournis

| Fichier | Contenu | À utiliser pour |
|---|---|---|
| `formulaire-specs-outil-2.md` | Spécifications détaillées des 15 champs (validations, types, options, comportements) | Construction du formulaire + schéma Zod |
| `spec-technique-route-nitro-outil-2.md` | Spec backend complète (architecture, routes, code TypeScript, intégrations) | Référence n°1 pour le développement |
| `system-prompt-v10-outil-2.md` | Prompt système final pour l'API Anthropic (3000 mots) | À copier dans `/server/utils/prompts/plan-de-sourcing.ts` |
| `templates-brevo-outil-2.md` | 4 templates Brevo HTML (notif interne, livraison prospect, mode différé interne, mode différé prospect) | À créer dans Brevo via UI |
| `brief-claude-design-formulaire-outil-2.md` | Brief design du formulaire | Pour Claude Design (output HTML attendu) |
| `brief-claude-design-resultat-outil-2.md` | Brief design des pages résultat | Pour Claude Design (output HTML attendu) |
| `Evaluation_Attractivite_v2.html` | Référence visuelle outil n°3 (déjà briefé) | Pattern visuel à répliquer pour le formulaire |

À ces 7 fichiers s'ajouteront, une fois Claude Design lancé :
- `design-formulaire-outil-2.html` (à produire)
- `design-resultat-outil-2.html` (à produire)

---

## 4. Variables d'environnement à configurer

À configurer dans `.env.local` (dev) et Vercel Project Settings (prod) :

```bash
# === Anthropic ===
ANTHROPIC_API_KEY=sk-ant-...
# Modèle utilisé : claude-haiku-4-5-20251001

# === Brevo (4 templates à créer en amont) ===
BREVO_API_KEY=xkeysib-...
BREVO_TEMPLATE_ID_NOTIF_INTERNE=1
BREVO_TEMPLATE_ID_LIVRAISON_PROSPECT=2
BREVO_TEMPLATE_ID_DEFERRED_INTERNE=3
BREVO_TEMPLATE_ID_DEFERRED_PROSPECT=4
BREVO_SENDER_EMAIL=bonjour@mariell.fr
BREVO_NOTIF_RECIPIENT=[email-du-gerant]@mariell.fr
BREVO_ALERT_RECIPIENT=[email-du-gerant]@mariell.fr

# === Jarvi (CRM) ===
JARVI_API_KEY=...
JARVI_API_BASE_URL=https://api.jarvi.tech/v1

# === Cloudflare Turnstile (anti-bot invisible) ===
TURNSTILE_SECRET_KEY=0x...
NUXT_PUBLIC_TURNSTILE_SITE_KEY=0x...

# === Vercel KV (auto-injecté quand intégration KV activée) ===
KV_REST_API_URL=...
KV_REST_API_TOKEN=...

# === Calendly (URL prise de RDV) ===
NUXT_PUBLIC_CALENDLY_URL=https://calendly.com/mariell/decouverte

# === URL publique du site ===
NUXT_PUBLIC_SITE_URL=https://mariell.fr
```

---

## 5. Étapes d'implémentation recommandées

### Étape 1 — Setup infrastructure (0,5 jour)

**Action** :
1. Créer un compte Anthropic et générer une clé API
2. Créer un compte Brevo (gratuit jusqu'à 300 emails/jour) et configurer l'expéditeur `bonjour@mariell.fr` (vérification DNS SPF + DKIM sur le domaine `mariell.fr`)
3. Créer un compte Cloudflare et activer Turnstile en mode "invisible"
4. Activer l'intégration Vercel KV sur le projet Vercel
5. Créer les 4 templates Brevo en suivant `templates-brevo-outil-2.md` (copier-coller le HTML, créer les variables, récupérer les 4 IDs numériques)

**Vérification** : toutes les variables d'environnement de la section 4 sont configurées et fonctionnent.

### Étape 2 — Schéma Zod et utilitaires serveur (1 jour)

Créer dans cet ordre :

1. `/server/schemas/plan-de-sourcing.ts` — schéma Zod (cf. `formulaire-specs-outil-2.md` section "Schéma Zod consolidé")
2. `/server/utils/anthropic.ts` — client Anthropic (cf. spec section 6)
3. `/server/utils/prompts/plan-de-sourcing.ts` — copier `system-prompt-v10-outil-2.md` comme constante `SYSTEM_PROMPT` + fonction `buildUserPrompt()` (cf. spec section 6)
4. `/server/utils/turnstile.ts` — vérification Turnstile (cf. spec section 11)
5. `/server/utils/ratelimit.ts` — rate limit Vercel KV (cf. spec section 7)
6. `/server/utils/brevo.ts` — 5 fonctions d'envoi email (cf. spec section 9 — `formatPackage`, `sendBrevoNotifInterne`, `sendBrevoLivraisonProspect`, `sendBrevoDeferredInterne`, `sendBrevoDeferredProspect`, `sendCriticalAlert`)
7. `/server/utils/jarvi.ts` — création contact CRM (cf. spec section 10)

**Vérification** : tous ces fichiers compilent. Tester chaque fonction isolément avec des inputs mock.

### Étape 3 — Routes serveur Nitro (1,25 jour)

1. `/server/api/lab/plan-de-sourcing/generate.post.ts` — route principale (cf. spec section 5, code complet fourni en pseudocode TypeScript)
2. `/server/api/lab/plan-de-sourcing/[uuid].get.ts` — route récupération plan persisté (cf. spec section 12)

Logique critique à respecter dans `generate.post.ts` :
1. Validation Zod (incl. cohérence OTE >= Fixe via `.refine()`)
2. Vérification Turnstile
3. Vérification rate limit
4. SI rate limit dépassé → `handleDeferredProcessing(validated, 'rate_limit')` → return deferred:true
5. Génération Anthropic (avec retry automatique 1x sur échec)
6. SI échec après retry → `handleDeferredProcessing(validated, 'api_failure')` → return deferred:true
7. Sauvegarde KV (bloquant, échec = 500)
8. Increment rate limit
9. 3 side effects en parallèle (`Promise.allSettled`) : Brevo notif + Brevo livraison + Jarvi
10. Logging + alertes email sur échecs partiels
11. Return `{success, uuid, plan, redirectUrl}`

**Vérification** : tester en local avec curl/Postman :
- Soumission valide → 200 + plan généré
- Soumission RGPD non cochée → 400
- Soumission OTE < Fixe → 400
- Soumission Turnstile invalide → 403

### Étape 4 — Composable Vue + Pages (2 jours)

1. `/composables/usePlanSourcing.ts` — wrapper de l'appel API avec gestion état (loading, error, deferred)
2. `/pages/lab/plan-de-sourcing/index.vue` — page formulaire (intégrer le HTML produit par Claude Design dans `design-formulaire-outil-2.html`)
3. `/pages/lab/plan-de-sourcing/resultat.vue` — page résultat streamé
4. `/pages/lab/plan-de-sourcing/resultat/[uuid].vue` — page résultat persisté

**Important** : les designs HTML produits par Claude Design sont **framework-agnostiques** (HTML + CSS + JS vanilla). Tu dois les "wrapper" dans des composants Vue 3 (`<script setup>`, directives `v-if/v-for`, `useState` Vue, etc.).

**Pour les classes CSS communes** (variables `var(--cyan-soft)`, `var(--font-serif-jp)`, etc.) : extraire le fichier `assets/mariell-tokens.css` partagé entre l'outil n°2 et l'outil n°3.

### Étape 5 — Configuration Nuxt + déploiement (0,5 jour)

Dans `nuxt.config.ts` :

```typescript
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel'  // PAS 'vercel-edge' (timeout 25s trop court)
  },
  runtimeConfig: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    brevoApiKey: process.env.BREVO_API_KEY,
    jarviApiKey: process.env.JARVI_API_KEY,
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY,
    
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
      calendlyUrl: process.env.NUXT_PUBLIC_CALENDLY_URL
    }
  }
});
```

⚠️ **Attention sur le preset Nitro** : le preset `vercel-edge` a un timeout de 25 secondes (plan Pro). C'est **trop court** pour notre cas (génération ~30 secondes). Utiliser le preset `vercel` standard qui permet jusqu'à 300 secondes.

### Étape 6 — Tests + debugging (1 jour)

Tests fonctionnels à passer :

1. ✅ Soumission formulaire valide → réception email livraison + plan accessible via UUID
2. ✅ Soumission formulaire invalide → message d'erreur clair
3. ✅ Soumission Turnstile non validé → 403
4. ✅ Soumission après 3 fois la même IP dans la journée → mode différé activé
5. ✅ Soumission depuis un domaine email > 5 dans le mois → mode différé activé
6. ✅ Anthropic API mocké en échec → retry puis bascule différé
7. ✅ Visite d'un UUID inexistant → 404 propre
8. ✅ Visite d'un UUID expiré → 404 propre
9. ✅ Soumission sans case RGPD cochée → 400 avec message "Vous devez accepter la politique de confidentialité."
10. ✅ Vérification que la trace du consentement RGPD est sauvegardée dans Jarvi (consentement_rgpd: true + consentement_date)
11. ✅ Soumission avec OTE < Fixe → 400 avec message "L'OTE doit être supérieur ou égal au fixe."
12. ✅ Bornes Fixe (< 15000 ou > 500000) → 400
13. ✅ Bornes OTE (> 800000) → 400
14. ✅ Case "Remote possible" décochée → soumission valide (case optionnelle)

**Estimation totale** : 5,75 jours.

---

## 6. Points d'attention et erreurs classiques à éviter

### 6.1 Stack — Nuxt 3 et non Next.js

Le client utilise du **Vue 3 (Composition API) + Nitro**, **pas du React/Next.js**. Si tu vois passer un design HTML avec `useState`, `useEffect`, `className`, c'est une erreur — convertir en directives Vue (`v-if`, `v-model`, `ref()`, `computed()`).

### 6.2 Schéma Zod — Validation cohérence OTE >= Fixe

Le schéma Zod doit OBLIGATOIREMENT inclure le `.refine()` final :

```typescript
.refine(
  data => data.ote >= data.fixe,
  {
    message: "L'OTE doit être supérieur ou égal au fixe.",
    path: ['ote']
  }
)
```

### 6.3 Mode différé — 2 emails séparés (pas 1)

Quand on bascule en mode différé (rate limit ou échec API), il faut envoyer **2 emails distincts** :
- Template 3 (`sendBrevoDeferredInterne`) au gérant
- Template 4 (`sendBrevoDeferredProspect`) au prospect

Le prospect doit recevoir un email de confirmation premium ("votre demande mérite un regard humain"). Ne pas l'oublier.

### 6.4 Prompt système — V10 (et pas V9)

Le system prompt à utiliser dans `/server/utils/prompts/plan-de-sourcing.ts` est la **V10**. Si tu vois une référence à V8 ou V9 dans la doc, c'est obsolète.

### 6.5 User prompt — Champ "Variable" et "Ratio" calculés côté serveur

Le user prompt envoyé à Anthropic enrichit les inputs du formulaire avec **2 valeurs calculées côté Nitro** :
- `Variable cible` = OTE − Fixe
- `Ratio fixe / OTE` = (Fixe / OTE) × 100, arrondi entier

C'est important : le LLM ne peut pas calculer ces valeurs lui-même de manière fiable. Le prompt V10 s'appuie sur ces valeurs pour calibrer la réponse (cf. directive 8 du system prompt).

### 6.6 RGPD — La case n'est PAS pré-cochée

Obligation légale RGPD : la case `consentementRgpd` doit être **non cochée par défaut**. Le prospect doit la cocher activement. La validation Zod (`z.literal(true)`) refuse `false` ET `undefined`.

⚠️ **Page `/politique-de-confidentialite` à créer avant le lancement**. La case RGPD du formulaire pointe vers cette page. Sans cette page, le formulaire est non-conforme RGPD. C'est une **action client** (pas dev) mais à flagguer.

### 6.7 Cloudflare Turnstile — Mode invisible

Le widget Turnstile est en mode **invisible** (pas un CAPTCHA visible). Le slot HTML est `<div id="cf-turnstile" data-sitekey="..." data-size="invisible"></div>`. Il génère un token automatiquement au chargement, à envoyer dans le payload de soumission.

### 6.8 Persistance KV — TTL différents

- `plan:{uuid}` → TTL **90 jours** (7 776 000 secondes)
- `deferred:{nanoid}` → TTL **7 jours** (604 800 secondes)
- `ratelimit:ip:{ip}:daily` → TTL 24h
- `ratelimit:ip:{ip}:weekly` → TTL 7 jours
- `ratelimit:email:{domain}` → TTL 30 jours

### 6.9 Streaming LLM — Buffer côté serveur

Bien que l'appel Anthropic utilise le mode `stream: true`, on **ne stream pas vers le client**. Le serveur Nitro buffer la réponse complète puis la renvoie en bloc dans la réponse HTTP. Cette décision a été prise pour offrir une animation de chargement riche côté front (~30 secondes en 6 étapes) plutôt qu'un effet "machine à écrire" peu premium.

### 6.10 Gestion erreurs — Side effects en `Promise.allSettled`

Les 3 side effects après génération (Brevo notif + Brevo livraison + Jarvi) doivent être lancés en `Promise.allSettled` (pas `Promise.all`). Si Jarvi échoue, on **continue** quand même à servir la réponse au prospect — on log juste l'erreur et on envoie une alerte email au gérant.

---

## 7. Architecture des fichiers (récapitulatif)

```
mariell-site/
├── server/
│   ├── api/
│   │   └── lab/
│   │       └── plan-de-sourcing/
│   │           ├── generate.post.ts       # Route principale
│   │           └── [uuid].get.ts          # Route récupération
│   ├── schemas/
│   │   └── plan-de-sourcing.ts            # Schéma Zod
│   └── utils/
│       ├── anthropic.ts                   # Client Anthropic
│       ├── brevo.ts                       # Client Brevo + 6 fonctions
│       ├── jarvi.ts                       # Client Jarvi
│       ├── ratelimit.ts                   # Rate limit
│       ├── turnstile.ts                   # Turnstile
│       └── prompts/
│           └── plan-de-sourcing.ts        # SYSTEM_PROMPT + buildUserPrompt
├── pages/
│   └── lab/
│       └── plan-de-sourcing/
│           ├── index.vue                  # Formulaire
│           ├── resultat.vue               # Page streamée (?session=)
│           └── resultat/
│               └── [uuid].vue             # Page persistée
├── composables/
│   └── usePlanSourcing.ts                 # Logique côté client
├── assets/
│   └── mariell-tokens.css                 # Variables CSS partagées
├── nuxt.config.ts
└── .env.local
```

---

## 8. Dépendances npm à installer

```bash
npm install @anthropic-ai/sdk
npm install ai @ai-sdk/anthropic
npm install @vercel/kv
npm install nanoid
npm install zod
npm install markdown-it
npm install @types/markdown-it -D
```

---

## 9. Mode différé — Comportement détaillé

Le mode différé est activé dans 2 cas :

### Cas A — Rate limit dépassé
Le prospect a soumis 3 fois aujourd'hui depuis cette IP, OU 7 fois cette semaine, OU son domaine email a soumis 5 fois ce mois-ci.

### Cas B — API Anthropic en échec après retry
Le call à `anthropic.messages.stream()` a échoué 2 fois consécutivement.

**Dans les 2 cas**, le serveur :
1. Sauvegarde les inputs en KV avec clé `deferred:{nanoid}` (TTL 7 jours)
2. Crée un contact Jarvi avec tag spécial `Lab — Manuel - Rate limit`
3. Envoie 2 emails (Templates 3 et 4)
4. Retourne au front : `{success: true, deferred: true, message: "..."}`

Le front affiche alors un écran spécifique "votre demande sera traitée manuellement" (cf. brief design résultat, section "État traitement différé").

---

## 10. Synthèse des règles métier critiques (LLM)

Le system prompt V10 contient des règles strictes que le dev n'a pas à connaître pour coder, mais qui sont importantes à comprendre pour les tests :

1. **Règle de cohérence familles d'intitulés** (section 3 du prompt) : un poste de chasse (AE, SDR, Business Developer) ne doit JAMAIS proposer d'intitulés AM/CSM dans la liste LinkedIn. Et inversement. Si tu vois ce genre de débordement en testant, c'est un bug LLM, pas un bug code.

2. **Règle de dérivation booléenne** (section 4 du prompt) : la requête booléenne LinkedIn générée doit inclure 100% des intitulés primaires cités juste au-dessus en section 3. Si tu vois "Business Developer" dans les intitulés mais pas dans la booléenne, c'est un bug LLM (à signaler au client).

3. **Modulation par ratio Fixe/OTE** (section 5 Phase 2 du prompt) :
   - Ratio > 75% → mention explicite "logique de stabilité / farming"
   - Ratio 55-75% → pas de mention spécifique
   - Ratio < 55% → mention explicite "chasse pure / variable agressif"

---

## 11. Estimation finale

| Phase | Tâches | Effort |
|---|---|---|
| Setup infra (Étape 1) | Variables env + KV + Turnstile + Brevo | 0,5 jour |
| Schéma + utils (Étape 2) | Zod + Brevo + Jarvi + Anthropic + KV utils | 1 jour |
| Route generate (Étape 3) | Route principale + orchestration complète | 1 jour |
| Route GET uuid (Étape 3) | Route persistée | 0,25 jour |
| Composable Vue + pages (Étape 4) | usePlanSourcing + 3 pages | 2 jours |
| Tests + debugging (Étape 6) | Bout-en-bout + edge cases | 1 jour |
| **TOTAL** | | **5,75 jours** |

---

## 12. Action attendue avant lancement (côté client, pas dev)

1. ⚠️ **Créer la page `/politique-de-confidentialite`** sur le site (obligation RGPD, sans elle le formulaire est non-conforme)
2. Configurer les comptes Anthropic, Brevo, Cloudflare Turnstile, Vercel KV
3. Récupérer les 2 designs HTML produits par Claude Design (formulaire + résultat)
4. Configurer le DNS de `mariell.fr` pour Brevo (SPF + DKIM)
5. Configurer le domaine définitif `mariell.fr` sur Vercel (au lieu de `mariell-dusky.vercel.app`)

---

## 13. Contact en cas de questions

Toutes les questions techniques peuvent être levées en se référant aux 6 documents de spec fournis. La référence absolue pour le backend est `spec-technique-route-nitro-outil-2.md` (sections 1 à 21).

Pour toute clarification fonctionnelle (ex. comportement attendu en cas d'edge case non documenté), revenir vers le client avec une question précise et une proposition d'option.

---

**Bon développement.**
