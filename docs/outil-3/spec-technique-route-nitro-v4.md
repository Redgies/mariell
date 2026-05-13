# Spec technique — Route Nitro Évaluation d'attractivité offre Sales (Outil 3)

**Version** : V4 (Architecture system prompt en blocs séparés + prompt caching Anthropic : chaque référentiel F1/F2/F3/F4 est un bloc `system` indépendant avec `cache_control: ephemeral`. Permet maintenance granulaire + ~90% de réduction du coût API après cache hit. Référentiels F4 V5 utilisé.)
**Stack cible** : Nuxt 3 (Vue 3 / Composition API) + Nitro server routes, déployé sur Vercel
**Modèle LLM** : Claude Haiku 4.5 via API Anthropic (`claude-haiku-4-5-20251001`)
**Statut** : version initiale, prête pour passage à un dev externe

> **Note de lecture pour le dev** : cette spec est auto-suffisante. Aucune connaissance préalable de la spec Nitro de l'outil 2 n'est requise. Les patterns architecturaux clés sont rappelés ici quand nécessaire.

---

## 1. Vue d'ensemble

### Flow utilisateur de bout en bout

1. Le prospect arrive sur `/lab/evaluation-attractivite/` (page formulaire)
2. Il remplit 12 champs (entreprise, poste, séniorité, package, missions, etc.) + résout un captcha Turnstile invisible
3. Il soumet → la route `POST /api/lab/evaluation-attractivite/generate` reçoit la requête
4. Le serveur Nitro :
   - Valide Turnstile (Couche 4 sécurité)
   - Valide le schéma Zod (Couche 1 sécurité — patterns d'injection détectés)
   - Vérifie le rate limiting via Vercel KV (3/jour, 7/semaine par IP)
   - Si rate limit OK → continue ; sinon → mode "traitement différé"
5. Le serveur :
   - Assemble le system prompt (SYSTEM_PROMPT_BASE + 4 référentiels en blocs cachés séparément)
   - Construit le user prompt à partir des inputs du formulaire
   - Appelle `anthropic.messages.stream()` avec web search activée (max 3 recherches), prompt caching, streaming
6. Le serveur **buffer** la réponse complète côté serveur (le client ne voit pas le streaming en direct)
7. Une fois la réponse complète :
   - Parse la réponse hybride (JSON + délimiteur `---END_META---` + markdown)
   - Valide le JSON (schéma Zod)
   - Filtre l'output markdown (Couche 2 sécurité — mots-clés interdits)
   - Si JSON malformé : fallback dégradé (markdown sans données structurées)
8. Side effects en parallèle :
   - Persistance de l'évaluation dans Vercel KV (UUID + JSON + markdown)
   - Création contact Jarvi
   - Envoi email Brevo au prospect avec lien de récupération
9. Réponse au client : objet contenant `{ uuid, json, markdown }` ou redirection vers `/lab/evaluation-attractivite/resultat/[uuid]`

### Différences notables vs outil 2 (sourcing LinkedIn)

| Aspect | Outil 2 | Outil 3 |
|---|---|---|
| Modèle Anthropic | Haiku 4.5 | Haiku 4.5 |
| Streaming | Oui (buffer serveur) | Oui (buffer serveur) |
| Web search | Non | **Oui (max 3 recherches)** |
| Sortie LLM | Markdown pur | **Hybride JSON + Markdown** |
| Référentiels | 1 prompt monolithique | **4 fichiers + system prompt = 2 blocs cachés** |
| Couches sécurité | Standard | **5 couches (vs 3-4)** |
| Estimation tokens cachés | ~1500 mots | ~30k tokens (4 fichiers) |
| Rate limit | 3/jour, 7/semaine | 3/jour, 7/semaine *(identique)* |
| Mode différé | Oui | Oui |
| Émail Brevo | Oui | Oui |
| Création Jarvi | Oui | Oui |
| Captcha Turnstile | Oui | Oui |
| Persistance KV | Oui | Oui |

### Décisions structurantes (rappel)

- **Le client ne voit pas le streaming en direct** : le serveur buffer la réponse complète puis répond en une seule fois. Côté UX, la page résultat affiche un loader pendant ~30 secondes, puis charge le contenu d'un seul bloc. C'est cohérent avec l'outil 2.
- **Prompt caching activé sur 2 blocs séparés** : SYSTEM_PROMPT_BASE (~3000 mots) + REFERENTIELS_F1_F2_F3_F4 (~30k tokens). Permet une économie ~70% sur les tokens d'entrée et une latence réduite.
- **Web search activée au niveau de l'API Anthropic** (`tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 3 }]`). Le LLM décide seul quand chercher.
- **Web fetch désactivé** par mesure de sécurité (Couche 3) : on ne donne pas l'outil `web_fetch` au LLM, uniquement `web_search`. Cela évite que le LLM aille lire le site web du prospect (qui pourrait contenir du contenu adversarial).

---

## 2. Architecture des fichiers

```
/server
  /api
    /lab
      /evaluation-attractivite
        generate.post.ts                    # Route principale (génération)
        get-by-uuid.get.ts                  # Récupération évaluation persistée
  /prompts
    /outil-3
      system-prompt-v8.md                   # System prompt principal V8 (~5000 mots)
      f1-boites-intouchables-v7.md          # F1 V7 — Référentiel entreprises
      f2-grille-secteurs-v3.md              # F2 V3 — Grille secteurs
      f3-typologie-missions-v5.md           # F3 V5 — Typologie missions (7 dimensions)
      f4-addendum-salaires-v6.md            # F4 V5 — Addendum salaires (avec table de positionnement chiffré)
  /utils
    /outil-3
      load-prompts.ts                       # NOUVEAU V4 — Chargement des 5 fichiers prompts en mémoire au boot
      build-system-blocks.ts                # NOUVEAU V4 — Construction du tableau de blocs system avec cache_control
      build-user-prompt.ts                  # Construction user prompt depuis formulaire (avec injection pré-calcul package V3)
      calculate-package-position.ts         # V3 — Pré-calcul backend de la position du package selon F4 V5
      parse-llm-response.ts                 # Parsing hybride JSON + Markdown
      validate-output.ts                    # Couche 2 sécurité (filtre mots-clés)
      injection-patterns.ts                 # Couche 1 sécurité (détection patterns)
      rate-limit.ts                         # Rate limiting via KV (mutualisé outil 1/2/3)
      brevo-send.ts                         # Envoi email Brevo
      jarvi-create-contact.ts               # Création contact Jarvi
  /schemas
    /outil-3
      formulaire.ts                         # Schéma Zod du formulaire
      llm-output-json.ts                    # Schéma Zod du bloc JSON LLM

/composables
  /outil-3
    useEvaluationAttractivite.ts            # Composable Vue côté client

/pages
  /lab
    /evaluation-attractivite
      index.vue                              # Formulaire (12 champs)
      resultat.vue                           # Page résultat post-soumission (?session=xxx)
      /resultat
        [uuid].vue                           # Page résultat persistée (lien email)

/components
  /outil-3
    EvaluationFormulaire.vue                 # Composant formulaire
    EvaluationResultat.vue                   # Composant rendu (jauge + badges + markdown)
    JaugeAttractivite.vue                    # Jauge à 10 segments
    BadgesDimensions.vue                     # 4 badges (marque/secteur/mission/package)
    AlertesEvaluation.vue                    # Bandeaux alertes éventuels
    MessageBriefFlou.vue                     # Bandeau "brief flou"
```

---

## 3. Variables d'environnement requises

À ajouter dans `.env` (et configurer dans Vercel) :

```bash
# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Brevo
BREVO_API_KEY=xkeysib-...
BREVO_TEMPLATE_EVALUATION_DELIVERED_ID=12   # Template "Voici votre évaluation"
BREVO_TEMPLATE_EVALUATION_DEFERRED_ID=13    # Template "Évaluation en cours de traitement"
BREVO_SENDER_EMAIL=hello@mariell.fr
BREVO_SENDER_NAME=Mariell

# Jarvi (CRM/ATS)
JARVI_API_KEY=...
JARVI_API_URL=https://api.jarvi.io/v1
JARVI_PIPELINE_ID_EVALUATION=...            # Pipeline dédié aux leads outil 3

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=...
TURNSTILE_SITE_KEY=...                      # Public, injecté côté client via runtime config

# Vercel KV (auto-injecté par Vercel quand intégration KV activée)
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...

# Calendly
CALENDLY_URL_OUTIL_3=https://calendly.com/mariell/evaluation-attractivite

# URL publique (pour générer les liens persistés dans les emails)
PUBLIC_BASE_URL=https://mariell-dusky.vercel.app
# Sera remplacé par https://mariell.fr en production

# Alertes (logging et monitoring)
ALERT_EMAIL_BOSS=hello@mariell.fr           # Pour les alertes injection détectée

# Feature flags
OUTIL_3_RATE_LIMIT_DAILY=3
OUTIL_3_RATE_LIMIT_WEEKLY=7
OUTIL_3_MAX_WEB_SEARCHES=3
```

---

## 4. Schéma Zod du formulaire

Le formulaire contient **17 champs** validés strictement (16 saisis + Turnstile). Implémenté dans `server/schemas/outil-3/formulaire.ts`.

```typescript
import { z } from 'zod';
import { containsInjectionPattern } from '../../utils/outil-3/injection-patterns';

// Validateur custom : refuse les patterns d'injection connus (Couche 1 sécurité)
const noInjection = (fieldName: string) =>
  z.string().refine(
    (val) => !containsInjectionPattern(val),
    { message: `Le champ ${fieldName} contient un format non autorisé.` }
  );

// Liste exacte des 17 options pour intitulé de poste (alignée outil 2)
export const POSTES_RECHERCHES = [
  'SDR / BDR',
  'Inside Sales',
  'Field Sales / Outside Sales',
  'Business Developer Full Cycle',
  'Account Executive — PME / SMB',
  'Account Executive — Mid-Market',
  'Account Executive — Enterprise',
  'Sales Engineer / Pre-Sales',
  'Account Manager',
  'Strategic Account Manager / Key Account Manager',
  'Customer Success Manager',
  'Sales Ops / RevOps',
  'Channel / Partner Manager',
  'Sales Manager / Team Lead',
  'Head of Sales',
  'VP Sales / CRO',
  'Autre'
] as const;

// Liste exacte des 8 options pour secteur (alignée outil 2)
export const SECTEURS_ENTREPRISE = [
  'SaaS B2B',
  'Conseil IT / ESN',
  'Industrie / B2B classique',
  'Cyber / Sécurité',
  'Fintech',
  'Healthtech',
  'Services',
  'Autre'
] as const;

// NOUVEAU V2 — Liste exacte des 4 options pour modalité de travail (alignée F3 V4 Dimension 7)
export const MODALITES_TRAVAIL = [
  'Full remote',
  'Hybride flexible (1-2 jours bureau / sem)',
  'Hybride équilibré (3 jours bureau / sem)',
  'Présentiel (4-5 jours bureau / sem)'
] as const;

export const formulaireOutil3Schema = z.object({
  // Identité prospect
  prenom: z.string()
    .trim()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom est trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Caractères non autorisés dans le prénom'),

  nom: z.string()
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom est trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Caractères non autorisés dans le nom'),

  email: z.string()
    .trim()
    .toLowerCase()
    .email('Format email invalide')
    .max(150, 'Email trop long'),

  // NOUVEAU — Téléphone international
  telephone: z.string()
    .trim()
    .min(8, 'Numéro de téléphone trop court')
    .max(20, 'Numéro de téléphone trop long')
    .regex(/^[+\d\s().-]+$/, 'Format de numéro invalide'),

  // Contexte entreprise
  entreprise: z.string()
    .trim()
    .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères")
    .max(100, "Nom d'entreprise trop long")
    .pipe(noInjection('entreprise')),

  // MODIFIÉ — Site web devient optionnel
  site_web: z.string()
    .trim()
    .url('URL invalide')
    .max(200, 'URL trop longue')
    .refine(
      (val) => /^https?:\/\//i.test(val),
      'L\'URL doit commencer par http:// ou https://'
    )
    .optional()
    .or(z.literal('')),  // Accepte chaîne vide

  // MODIFIÉ — Secteur en enum strict (aligné outil 2)
  secteur: z.enum(SECTEURS_ENTREPRISE, {
    errorMap: () => ({ message: 'Veuillez sélectionner un secteur dans la liste' })
  }),

  // Précision optionnelle si secteur === 'Autre'
  secteur_precision_autre: z.string()
    .trim()
    .max(60, 'Précision du secteur trop longue')
    .pipe(noInjection('précision du secteur'))
    .optional(),

  localisation: z.string()
    .trim()
    .min(2, 'La localisation doit être précisée')
    .max(100, 'Localisation trop longue')
    .pipe(noInjection('localisation')),

  effectifs_entreprise: z.string()
    .trim()
    .min(1, 'Les effectifs doivent être renseignés')
    .max(50, 'Description des effectifs trop longue')
    .pipe(noInjection('effectifs')),

  equipe_sales: z.string()
    .trim()
    .min(3, 'La composition de l\'équipe Sales doit être précisée')
    .max(300, 'Description de l\'équipe Sales trop longue')
    .pipe(noInjection('équipe Sales')),

  // MODIFIÉ — Intitulé poste en enum strict (aligné outil 2)
  intitule_poste: z.enum(POSTES_RECHERCHES, {
    errorMap: () => ({ message: 'Veuillez sélectionner un intitulé de poste dans la liste' })
  }),

  // Précision optionnelle si intitule_poste === 'Autre'
  intitule_poste_precision_autre: z.string()
    .trim()
    .max(60, 'Précision de l\'intitulé trop longue')
    .pipe(noInjection('précision de l\'intitulé'))
    .optional(),

  seniorite: z.enum([
    'Junior 0-2 ans',
    'Confirmé 2-5 ans',
    'Senior 5-8 ans',
    'Lead 8+ ans'
  ], { errorMap: () => ({ message: 'Séniorité invalide' }) }),

  type_cycle: z.enum([
    'Outbound',
    'Inbound',
    'Mixte',
    'Account Management',
    'Sales Ops',
    'Autre'
  ], { errorMap: () => ({ message: 'Type de cycle invalide' }) }),

  type_cycle_autre: z.string()
    .trim()
    .max(60, 'Précision trop longue')
    .pipe(noInjection('précision du cycle'))
    .optional(),

  // NOUVEAU V2 — Modalité de travail (impacte F3 Dimension 7 + F4 modulateur géo conditionnel)
  modalite_travail: z.enum([
    'Full remote',
    'Hybride flexible (1-2 jours bureau / sem)',
    'Hybride équilibré (3 jours bureau / sem)',
    'Présentiel (4-5 jours bureau / sem)'
  ], { errorMap: () => ({ message: 'Veuillez sélectionner une modalité de travail' }) }),

  // Description missions (champ riche)
  description_missions: z.string()
    .trim()
    .min(50, 'La description des missions doit contenir au moins 50 caractères')
    .max(1000, 'Description des missions trop longue (max 1000 caractères)')
    .pipe(noInjection('description des missions')),

  // Package
  package_fixe: z.number()
    .int('Le fixe doit être un entier')
    .min(15000, 'Fixe trop bas (minimum 15 000 €)')
    .max(500000, 'Fixe trop haut (maximum 500 000 €)'),

  package_ote: z.number()
    .int('L\'OTE doit être un entier')
    .min(0, 'OTE invalide')
    .max(800000, 'OTE trop haut (maximum 800 000 €)'),

  // RGPD et anti-bot
  consentement_rgpd: z.literal(true, {
    errorMap: () => ({ message: 'Le consentement RGPD est obligatoire' })
  }),

  turnstile_token: z.string()
    .min(1, 'Token Turnstile requis')
    .max(2048, 'Token Turnstile invalide'),
});

// Validations cross-field
export const formulaireOutil3SchemaRefined = formulaireOutil3Schema
  .refine(
    (data) => {
      // Si type_cycle === 'Autre', type_cycle_autre est requis
      if (data.type_cycle === 'Autre') {
        return data.type_cycle_autre && data.type_cycle_autre.length >= 3;
      }
      return true;
    },
    {
      message: 'Précisez le type de cycle (3 caractères minimum)',
      path: ['type_cycle_autre']
    }
  )
  .refine(
    (data) => {
      // Si intitule_poste === 'Autre', intitule_poste_precision_autre est requis
      if (data.intitule_poste === 'Autre') {
        return data.intitule_poste_precision_autre && data.intitule_poste_precision_autre.length >= 3;
      }
      return true;
    },
    {
      message: 'Précisez l\'intitulé de poste (3 caractères minimum)',
      path: ['intitule_poste_precision_autre']
    }
  )
  .refine(
    (data) => {
      // Si secteur === 'Autre', secteur_precision_autre est requis
      if (data.secteur === 'Autre') {
        return data.secteur_precision_autre && data.secteur_precision_autre.length >= 3;
      }
      return true;
    },
    {
      message: 'Précisez le secteur (3 caractères minimum)',
      path: ['secteur_precision_autre']
    }
  );

export type FormulaireOutil3 = z.infer<typeof formulaireOutil3SchemaRefined>;
```

### Patterns d'injection détectés (Couche 1 sécurité)

Implémentés dans `server/utils/outil-3/injection-patterns.ts` :

```typescript
const INJECTION_PATTERNS: RegExp[] = [
  // Tentatives d'override d'instructions
  /\bignor[ee]?\s+(tes?|les?|ces?|vos?|previous|toutes?|all|prior)\b/i,
  /\bdisregard\s+(tes?|les?|previous|prior|all)\b/i,
  /\bforget\s+(tes?|les?|previous|prior|all|everything)\b/i,
  /\boverride\s+(tes?|les?|system|prompt|instructions?)\b/i,
  
  // Tentatives de jailbreak / mode debug
  /\bjailbreak/i,
  /\bdebug\s*mode/i,
  /\bdeveloper\s*mode/i,
  /\bdan\s+mode/i,
  /\bmaintenance\s*mode/i,
  
  // Tentatives de role-play hostile
  /\bagis?\s+comme\s+(un|une|si|en\s+tant)/i,
  /\bact\s+(as|like)\s+(if|a|an)/i,
  /\btu\s+es\s+maintenant\b/i,
  /\byou\s+are\s+now\b/i,
  /\bpretends?\s+(to\s+be|que)/i,
  
  // Tentatives d'accès au system prompt
  /\bsystem\s*prompt/i,
  /\bsystem\s*instructions?/i,
  /\bprompt\s*caching/i,
  /\bréveles?\s+(tes?|les?|ton|le)/i,
  /\breveal\s+(tes?|les?|your|the)/i,
  /\baffich[ee]\s+(ton|tes?|le|les?|son|son)\s+(prompt|instructions?)/i,
  /\bshow\s+(me\s+)?(your|the)\s+(prompt|instructions?|system)/i,
  
  // Tentatives spécifiques outil 3 (révélation référentiels)
  /\btier\s+[sabc]\b/i,
  /\bf[1-4]\s+(b[oô]ites?|secteurs?|missions?|salaires?)/i,
  /\bréférentiels?\s+(internes?|propriétaires?|mariell)/i,
  /\bgrille\s+terrain/i,
  /\bgrille\s+minorée/i,
  /\b6\s+dimensions/i,
  /\bscore\s+(interne|f3|additif)/i,
  /\bmodificateur\s+sectoriel/i,
  
  // Tentatives d'exfiltration
  /\bcurl\s+/i,
  /\bwget\s+/i,
  /\bexec\s*\(/i,
  /\beval\s*\(/i,
  /<\s*script[^>]*>/i,
  /<\s*iframe[^>]*>/i,
  
  // Encodages suspects
  /[A-Za-z0-9+/]{50,}={0,2}\s*$/m,  // Base64 long en fin de ligne
];

export function containsInjectionPattern(text: string): boolean {
  return INJECTION_PATTERNS.some(pattern => pattern.test(text));
}

export function getMatchedPatterns(text: string): string[] {
  return INJECTION_PATTERNS
    .filter(pattern => pattern.test(text))
    .map(pattern => pattern.source);
}
```

**Note de gestion** : si une injection est détectée à l'étape Zod, le serveur **renvoie immédiatement une erreur 400** au client, sans déclencher l'appel LLM. Le pattern matché est logué (sans le contenu complet) pour analyse ultérieure.

---

## 5. Route principale — `POST /api/lab/evaluation-attractivite/generate`

### Comportement

#### Phase 1 — Validations bloquantes (ordre strict)

1. **Vérification Turnstile** (anti-bot Cloudflare) → si échec, 403 Forbidden
2. **Validation du schéma Zod** → si échec (incluant détection injection Couche 1), 400 Bad Request
3. **Vérification rate limiting** via Vercel KV (3/jour, 7/semaine par IP)
   - Si rate limit OK → continuer Phase 2
   - Si rate limit dépassé → bascule en mode "Traitement différé" (cf. section 8)

#### Phase 2 — Préparation et génération

4. **Génération d'un UUID** pour cette évaluation (`crypto.randomUUID()`)
5. **Assemblage du system prompt** (cf. section 6)
6. **Construction du user prompt** à partir des inputs du formulaire
7. **Appel streaming Anthropic** avec web search activée et prompt caching
8. **Buffer du contenu généré** côté serveur (le client ne voit pas le streaming en direct)
9. **Wait until LLM completion** — le serveur attend que le streaming Anthropic soit terminé

#### Phase 3 — Parsing et validation

10. **Parse de la réponse hybride** : extraction du JSON et du markdown via le délimiteur `---END_META---`
11. **Validation du JSON** via schéma Zod dédié (cf. section 6.4)
12. **Filtre output** sur le markdown (Couche 2 sécurité, cf. section 7.2)
    - Si mots-clés interdits détectés → log + tronque ou affiche markdown générique
13. **Si JSON malformé** → fallback dégradé (cf. section 6.5)

#### Phase 4 — Side effects (séquence parallèle)

14. **Persistance KV** : stockage `eval:<uuid>` avec inputs anonymisés + JSON + markdown + timestamp
15. **Création contact Jarvi** : POST vers `/contacts` avec données prospect + tag "Outil 3 - Évaluation"
16. **Envoi email Brevo** : template "Voici votre évaluation" avec lien `/lab/evaluation-attractivite/resultat/[uuid]`
17. **Incrément du compteur rate limit** dans KV

> Les étapes 14, 15, 16 s'exécutent **en parallèle** via `Promise.allSettled()` pour ne pas bloquer la réponse au client. Si une étape échoue, on log l'erreur mais on continue (pas de rollback).

#### Phase 5 — Réponse

18. **Réponse au client** avec `{ uuid, json, markdown }` + status 200
19. Le client (composable Vue) reçoit la réponse et redirige vers `/lab/evaluation-attractivite/resultat?session=<uuid>`

### Structure du code (pseudocode TypeScript)

```typescript
// server/api/lab/evaluation-attractivite/generate.post.ts

import { defineEventHandler, readBody, createError, getRequestIP } from 'h3';
import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';
import { formulaireOutil3SchemaRefined } from '~/server/schemas/outil-3/formulaire';
import { llmOutputJsonSchema } from '~/server/schemas/outil-3/llm-output-json';
import { buildSystemBlocks } from '~/server/utils/outil-3/build-system-blocks';
import { buildUserPrompt } from '~/server/utils/outil-3/build-user-prompt';
import { parseLlmResponse } from '~/server/utils/outil-3/parse-llm-response';
import { validateLlmOutput } from '~/server/utils/outil-3/validate-output';
import { checkRateLimit, incrementRateLimit } from '~/server/utils/outil-3/rate-limit';
import { handleDeferredEvaluation } from '~/server/utils/outil-3/deferred';
import { sendBrevoEvaluationEmail } from '~/server/utils/outil-3/brevo-send';
import { createJarviContact } from '~/server/utils/outil-3/jarvi-create-contact';
import { verifyTurnstileToken } from '~/server/utils/turnstile';
import { logServerEvent, alertOnInjection } from '~/server/utils/logging';

export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  const requestIp = getRequestIP(event, { xForwardedFor: true }) || 'unknown';
  
  try {
    // ─── PHASE 1 — VALIDATIONS BLOQUANTES ───
    
    const body = await readBody(event);
    
    // 1.1 Turnstile
    const turnstileOk = await verifyTurnstileToken(body.turnstile_token, requestIp);
    if (!turnstileOk) {
      throw createError({ statusCode: 403, statusMessage: 'Turnstile validation failed' });
    }
    
    // 1.2 Zod (incluant Couche 1 sécurité — détection injection)
    const validation = formulaireOutil3SchemaRefined.safeParse(body);
    if (!validation.success) {
      // Si l'erreur vient d'un pattern d'injection détecté, log + alerte
      const injectionDetected = validation.error.errors.some(e => 
        e.message.includes('format non autorisé')
      );
      if (injectionDetected) {
        await alertOnInjection(requestIp, validation.error.errors, body);
      }
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'Validation failed',
        data: validation.error.format()
      });
    }
    const data = validation.data;
    
    // 1.3 Rate limiting
    const rateLimitStatus = await checkRateLimit(requestIp);
    if (rateLimitStatus.exceeded) {
      // Mode "Traitement différé" — capture le lead, envoie email "votre éval arrive", retourne UUID
      const deferredUuid = await handleDeferredEvaluation(data, requestIp);
      return { 
        deferred: true, 
        uuid: deferredUuid, 
        message: 'Votre évaluation sera traitée prochainement et vous parviendra par email.' 
      };
    }
    
    // ─── PHASE 2 — PRÉPARATION ET GÉNÉRATION ───
    
    const uuid = crypto.randomUUID();
    
    // 2.1 Construction des 5 blocs system (V4 — F1/F2/F3/F4 cachés indépendamment)
    const systemBlocks = await buildSystemBlocks();
    
    // 2.2 User prompt (avec injection du pré-calcul package V3)
    const userPrompt = buildUserPrompt(data);
    
    // 2.3 Appel Anthropic
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const stream = await anthropic.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 16000,
      temperature: 0.15,
      system: systemBlocks,
      messages: [{ role: 'user', content: userPrompt }],
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }]
    });
    
    // 2.4 Buffer côté serveur
    let fullContent = '';
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        fullContent += chunk.delta.text;
      }
    }
    
    const finalMessage = await stream.finalMessage();
    
    // 2.5 Logging cache performance (V4 — monitoring du prompt caching)
    console.log('[outil-3] cache stats', {
      uuid,
      cache_creation_tokens: finalMessage.usage?.cache_creation_input_tokens || 0,
      cache_read_tokens: finalMessage.usage?.cache_read_input_tokens || 0,
      input_tokens: finalMessage.usage?.input_tokens || 0,
      output_tokens: finalMessage.usage?.output_tokens || 0
    });
    
    // ─── PHASE 3 — PARSING ET VALIDATION ───
    
    // 3.1 Parse hybride JSON + Markdown
    const parsed = parseLlmResponse(fullContent);
    if (!parsed.success) {
      // Fallback : on accepte le markdown sans données structurées
      console.error('[outil-3] Parse failed, fallback degraded mode', { uuid, error: parsed.error });
      return await handleDegradedFallback(data, fullContent, uuid, requestIp);
    }
    
    // 3.2 Validation du JSON via Zod
    const jsonValidation = llmOutputJsonSchema.safeParse(parsed.data.json);
    if (!jsonValidation.success) {
      console.error('[outil-3] JSON schema validation failed', { uuid, errors: jsonValidation.error });
      return await handleDegradedFallback(data, parsed.data.markdown, uuid, requestIp);
    }
    
    // 3.3 Filtre output (Couche 2 sécurité)
    const filterResult = validateLlmOutput(parsed.data.markdown);
    let safeMarkdown = parsed.data.markdown;
    if (!filterResult.safe) {
      console.warn('[outil-3] Output filter triggered', { uuid, forbiddenKeywords: filterResult.matched });
      // Stratégie : on remplace les mots-clés interdits par leur version neutralisée
      // Pas de régénération (coût + latence trop élevés en prod)
      safeMarkdown = filterResult.sanitized;
      // Alerte Boss en parallèle (asynchrone, non bloquant)
      void alertOnInjection(requestIp, filterResult.matched, { uuid, output: 'TRUNCATED' });
    }
    
    // ─── PHASE 4 — SIDE EFFECTS (parallèles) ───
    
    const sideEffects = await Promise.allSettled([
      // 4.1 Persistance KV
      kv.set(`eval:${uuid}`, {
        uuid,
        timestamp: new Date().toISOString(),
        inputs: anonymizeInputs(data),
        json: jsonValidation.data,
        markdown: safeMarkdown,
        meta: { 
          tokens_input: finalMessage.usage.input_tokens,
          tokens_output: finalMessage.usage.output_tokens,
          duration_ms: Date.now() - startTime,
          web_searches_used: countWebSearches(finalMessage)
        }
      }, { ex: 60 * 60 * 24 * 90 }), // TTL 90 jours
      
      // 4.2 Création Jarvi
      createJarviContact(data, uuid, jsonValidation.data),
      
      // 4.3 Envoi Brevo
      sendBrevoEvaluationEmail(data, uuid, jsonValidation.data),
      
      // 4.4 Increment rate limit
      incrementRateLimit(requestIp)
    ]);
    
    // Log les éventuels échecs des side effects (non bloquants)
    sideEffects.forEach((result, idx) => {
      if (result.status === 'rejected') {
        console.error(`[outil-3] Side effect ${idx} failed`, { uuid, reason: result.reason });
      }
    });
    
    // ─── PHASE 5 — RÉPONSE ───
    
    logServerEvent('outil-3.evaluation.success', { 
      uuid, 
      duration_ms: Date.now() - startTime,
      niveau: jsonValidation.data.niveau_attractivite
    });
    
    return {
      uuid,
      json: jsonValidation.data,
      markdown: safeMarkdown,
      deferred: false
    };
    
  } catch (error: any) {
    logServerEvent('outil-3.evaluation.error', { 
      ip: requestIp, 
      error: error.message,
      duration_ms: Date.now() - startTime
    });
    
    // Si c'est une erreur déjà bien formée (createError), la relayer
    if (error.statusCode) {
      throw error;
    }
    
    // Sinon erreur 500 générique
    throw createError({
      statusCode: 500,
      statusMessage: 'Une erreur est survenue lors de la génération de votre évaluation. Merci de réessayer ultérieurement.'
    });
  }
});
```

---

## 6. Génération Anthropic

### 6.1 Configuration

```typescript
// Constantes utilisées par l'appel
const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 16000;
const TEMPERATURE = 0.15;
const MAX_WEB_SEARCHES = 3;
```

### 6.2 Architecture system prompt en blocs séparés (V4)

> **NOUVEAU V4** — Architecture en 5 blocs `system` séparés avec `cache_control: ephemeral` sur chaque référentiel. Bénéfices : maintenance granulaire (modifier F1 n'invalide pas le cache F2/F3/F4), réduction du coût API ~90% après cache hit, latence TTFT ~0.5-1s sur cache hit (vs 2-3s sans cache).

#### 6.2.1 Chargement des fichiers prompts au boot

Implémenté dans `server/utils/outil-3/load-prompts.ts`. Charge les 5 fichiers une seule fois au démarrage du serveur Nitro et les garde en mémoire.

```typescript
// server/utils/outil-3/load-prompts.ts

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

interface LoadedPrompts {
  systemPromptV8: string;
  f1: string;
  f2: string;
  f3: string;
  f4: string;
}

let cachedPrompts: LoadedPrompts | null = null;

/**
 * Charge les 5 fichiers prompts en mémoire (lecture une seule fois au boot).
 * Appelée par buildSystemBlocks() — pas besoin de l'appeler manuellement.
 */
export async function loadPrompts(): Promise<LoadedPrompts> {
  if (cachedPrompts) return cachedPrompts;
  
  const promptsDir = join(process.cwd(), 'server', 'prompts', 'outil-3');
  
  const [systemPromptV8, f1, f2, f3, f4] = await Promise.all([
    readFile(join(promptsDir, 'system-prompt-v8.md'), 'utf-8'),
    readFile(join(promptsDir, 'f1-boites-intouchables-v7.md'), 'utf-8'),
    readFile(join(promptsDir, 'f2-grille-secteurs-v3.md'), 'utf-8'),
    readFile(join(promptsDir, 'f3-typologie-missions-v5.md'), 'utf-8'),
    readFile(join(promptsDir, 'f4-addendum-salaires-v6.md'), 'utf-8'),
  ]);
  
  cachedPrompts = { systemPromptV8, f1, f2, f3, f4 };
  return cachedPrompts;
}

/**
 * Vide le cache (utile en dev pour hot-reload, ou si tu déploies une nouvelle version d'un référentiel sans redémarrer le serveur)
 */
export function clearPromptsCache(): void {
  cachedPrompts = null;
}
```

#### 6.2.2 Construction du tableau de blocs system avec cache_control

Implémenté dans `server/utils/outil-3/build-system-blocks.ts`. Construit le tableau de blocs `system` à passer à l'API Anthropic, avec `cache_control: ephemeral` sur chaque référentiel.

```typescript
// server/utils/outil-3/build-system-blocks.ts

import { loadPrompts } from './load-prompts';

// Type cohérent avec l'API Anthropic Messages
interface SystemBlock {
  type: 'text';
  text: string;
  cache_control?: { type: 'ephemeral' };
}

/**
 * Construit le tableau de 5 blocs `system` pour l'appel API Anthropic.
 * 
 * Stratégie de caching :
 * - Bloc 1 (system prompt V8) : NON caché (modifié plus souvent que les référentiels)
 * - Blocs 2-5 (F1, F2, F3, F4) : cachés indépendamment via cache_control: ephemeral
 *   → Modifier F1 invalide uniquement le cache F1, pas F2/F3/F4
 *   → Permet une évolution granulaire des référentiels sans recharger toute la base de cache
 * 
 * NOTE : le cache `ephemeral` Anthropic dure 5 minutes par défaut (renouvelé à chaque utilisation).
 * Pour des volumes faibles (1-10 évaluations / heure), prévoir que le cache peut expirer entre
 * les requêtes. Pour des volumes plus élevés, le cache reste chaud naturellement.
 */
export async function buildSystemBlocks(): Promise<SystemBlock[]> {
  const { systemPromptV8, f1, f2, f3, f4 } = await loadPrompts();
  
  return [
    // Bloc 1 — System prompt principal (non caché)
    {
      type: 'text',
      text: systemPromptV8
    },
    // Bloc 2 — F1 Boîtes intouchables (caché)
    {
      type: 'text',
      text: `---

# 📚 RÉFÉRENTIEL F1 — BOÎTES INTOUCHABLES (V7)

> Ce référentiel liste les entreprises actives sur le marché Sales français en 2026 avec leur tier (S / A / B / C). Tu utilises ce tier pour le scoring F1 selon la logique d'arbitrage du score additif.
>
> **Rappel critique** : ce référentiel sert UNIQUEMENT à appliquer un bonus (léger pour Tier C → important pour Tier S). Une entreprise **absente** du référentiel n'est **jamais pénalisée** : tu l'évalues objectivement sur les autres dimensions (package, missions, équipe, croissance) sans malus d'absence.

${f1}`,
      cache_control: { type: 'ephemeral' }
    },
    // Bloc 3 — F2 Grille secteurs (caché)
    {
      type: 'text',
      text: `---

# 📚 RÉFÉRENTIEL F2 — GRILLE SECTEURS (V3)

> Ce référentiel liste 32 secteurs avec leurs modificateurs sectoriels. Tu utilises ce modificateur pour le scoring F2 selon la logique d'arbitrage du score additif.

${f2}`,
      cache_control: { type: 'ephemeral' }
    },
    // Bloc 4 — F3 Typologie missions (caché)
    {
      type: 'text',
      text: `---

# 📚 RÉFÉRENTIEL F3 — TYPOLOGIE MISSIONS (V5)

> Ce référentiel détaille les 7 dimensions transversales d'évaluation de la mission. Tu calcules le score F3 (range −7 à +6) selon ces 7 dimensions.

${f3}`,
      cache_control: { type: 'ephemeral' }
    },
    // Bloc 5 — F4 Addendum salaires (caché)
    {
      type: 'text',
      text: `---

# 📚 RÉFÉRENTIEL F4 — ADDENDUM SALAIRES (V5)

> ⚠️ **NOTE CRITIQUE V8** : Depuis le system prompt V8, la position du package est **pré-calculée côté backend Nitro** et injectée dans le user prompt sous le titre \`# 🔒 PRÉ-CALCUL PACKAGE\`. Tu n'utilises plus F4 pour calculer cette position — elle t'est fournie directement.
>
> F4 reste néanmoins chargé en référence pour 2 raisons :
> 1. **Cohérence narrative** : tu peux t'inspirer des formulations qualitatives recommandées dans F4 pour rédiger la section "Lecture package"
> 2. **Cas particuliers** : si pour une raison technique le pré-calcul ne t'est pas fourni, F4 reste ta seule source de vérité
>
> **Mais en mode normal, tu n'as plus à appliquer la procédure F4 mécaniquement — c'est le backend qui le fait à ta place.**

${f4}`,
      cache_control: { type: 'ephemeral' }
    }
  ];
}
```

#### 6.2.3 Stratégie de prompt caching et impact économique

**Comment fonctionne le cache `ephemeral` Anthropic** :
- Lors du **premier appel** avec un bloc marqué `cache_control: ephemeral`, Anthropic stocke le bloc en cache et facture un léger surcoût (×1.25 sur les tokens cachés à l'écriture)
- Lors des **appels suivants** (dans la fenêtre de 5 minutes), le cache est réutilisé et les tokens cachés sont facturés à 10% du prix normal (-90%)
- Chaque utilisation du cache **prolonge sa durée de vie** de 5 minutes supplémentaires
- Si aucun appel n'utilise le cache pendant 5 minutes, il expire et le prochain appel recommence avec le coût d'écriture

**Estimation des coûts** (Claude Haiku 4.5 — pricing public Anthropic 2026, à vérifier au moment de l'implémentation) :

| Scénario | Coût estimé par évaluation |
|---|---|
| Sans cache (premier appel froid) | ~$0.030 |
| Avec cache hit (appels suivants dans la fenêtre) | ~$0.005 |
| Économie moyenne en régime stationnaire | ~80-85% |

**Pour valider les chiffres exacts** : le pricing Anthropic et les détails du prompt caching sont documentés sur [https://docs.claude.com/en/docs/build-with-claude/prompt-caching](https://docs.claude.com/en/docs/build-with-claude/prompt-caching). Vérifier au moment de l'implémentation.

#### 6.2.4 Stratégie d'invalidation du cache

Cas où le cache **doit** être invalidé :

| Événement | Action |
|---|---|
| Modification du system prompt V8 | Invalidation manuelle (le bloc 1 n'est pas caché, donc pas de problème — tu modifies le fichier et redéploies) |
| Modification de F1 (ajout/retrait/changement de tier d'une entreprise) | Le cache F1 s'invalide automatiquement car le hash du bloc change. F2/F3/F4 conservent leur cache. |
| Modification de F2/F3/F4 | Idem — invalidation automatique du seul bloc modifié |
| Restart du serveur Nitro | Le cache **côté Anthropic** survit au restart serveur (il est géré par Anthropic, pas par Nitro). En revanche, le cache mémoire local de `loadPrompts()` est rechargé à partir du disque. |
| Hot reload en dev (changement d'un fichier prompt) | Appeler `clearPromptsCache()` pour forcer le rechargement |

**Important** : tu n'as **rien à faire manuellement** pour invalider le cache Anthropic. Le hash du bloc texte sert de clé. Si tu modifies F1, le bloc texte change, le hash change, le cache de l'ancien F1 expire naturellement et le nouveau F1 commence un nouveau cycle de cache.

#### 6.2.5 Monitoring du cache (logs recommandés)

L'API Anthropic retourne des informations de cache dans la réponse, sous `usage.cache_creation_input_tokens` et `usage.cache_read_input_tokens`. Logguer ces valeurs permet de monitorer l'efficacité du cache.

```typescript
// Dans la route generate.post.ts, après l'appel Anthropic :
console.log({
  evaluation_id: evaluationId,
  cache_creation_tokens: response.usage?.cache_creation_input_tokens || 0,
  cache_read_tokens: response.usage?.cache_read_input_tokens || 0,
  input_tokens: response.usage?.input_tokens || 0,
  output_tokens: response.usage?.output_tokens || 0,
  cache_hit_rate: (response.usage?.cache_read_input_tokens || 0) / 
    ((response.usage?.cache_read_input_tokens || 0) + (response.usage?.input_tokens || 0))
});
```

**Indicateur clé à surveiller** : `cache_hit_rate`. En régime stationnaire (> 5 évaluations / heure), il devrait être > 80%. Si tu observes < 50%, c'est que les évaluations sont trop espacées et le cache expire entre les appels — ce qui est normal en phase de lancement avec faible volume.

### 6.3 Pré-calcul de la position du package — Architecture deterministic-by-design

> **NOUVEAU V3** — Cette section est critique. Elle résout définitivement le problème d'hallucination salariale identifié en V2/V6/V7.

**Contexte du problème** : sur les versions précédentes, le LLM était chargé d'appliquer la grille F4 V4 pour calculer la position du package (sous-marché / fourchette basse / milieu / haut+). Malgré les instructions répétées (procédure mécanique, interdictions explicites, règles de formulation), le LLM continuait à utiliser ses connaissances pré-entraînement (LinkedIn / Glassdoor) qui sont systématiquement plus hautes que la réalité signée en France 2026.

**Solution V3 — pré-calcul backend** : on retire au LLM la responsabilité du calcul. Le backend Nitro identifie le profil + calcule mécaniquement la position selon F4 V4, et **injecte directement le résultat dans le user prompt**. Le LLM n'a plus qu'à rédiger la section éditoriale sur la base d'une position déjà déterminée.

**Bénéfices** :
- Élimination quasi-totale de l'hallucination salariale (le LLM ne calcule plus, il ne peut plus halluciner)
- F4 V4 reste l'unique source de vérité (la grille est juste convertie en code)
- Aucun impact UX (transparent côté prospect)
- Coût technique minime (~80 lignes de code TypeScript)

#### Implémentation — `calculatePackagePosition()`

Implémenté dans `server/utils/outil-3/calculate-package-position.ts`.

```typescript
// server/utils/outil-3/calculate-package-position.ts

import type { FormulaireOutil3 } from '~/server/schemas/outil-3/formulaire';

// Types de position alignés sur F4 V4
export type Position = 'sous-marché' | 'fourchette basse' | 'milieu de fourchette' | 'haut+';

// Profil mappé F4 V4 (12 profils + cas "non standard")
export type ProfilF4 = 
  | 'SDR / BDR Junior'
  | 'SDR / BDR Confirmé'
  | 'Business Developer Full Cycle'
  | 'AE PME / SMB'
  | 'AE Mid-Market'
  | 'AE Enterprise'
  | 'Account Manager'
  | 'Customer Success Manager'
  | 'Sales Ops / RevOps'
  | 'Channel / Partner Manager'
  | 'Sales Manager / Team Lead'
  | 'Head of Sales'
  | 'VP Sales / CRO'
  | 'profil non standard';

// Bornes par profil — alignées strictement sur la table de positionnement chiffré F4 V4
// Format : [sous-marché_max, fourchette_basse_max, milieu_max, haut+_min]
// Exemple AE Mid-Market fixe : sous-marché < 48k, basse 48-53k, milieu 54-59k, haut+ 60k et +
const BORNES_FIXE: Record<ProfilF4, [number, number, number] | null> = {
  'SDR / BDR Junior':              [32, 35, 39],   // <32 sous-marché, 32-35 basse, 36-39 milieu, ≥40 haut+
  'SDR / BDR Confirmé':            [32, 35, 39],   // identique au Junior pour le fixe
  'Business Developer Full Cycle': [32, 36, 41],
  'AE PME / SMB':                  [41, 44, 48],
  'AE Mid-Market':                 [48, 53, 59],
  'AE Enterprise':                 [65, 74, 84],
  'Account Manager':               [43, 47, 52],
  'Customer Success Manager':      [38, 42, 47],
  'Sales Ops / RevOps':            [40, 49, 59],
  'Channel / Partner Manager':     [45, 53, 61],
  'Sales Manager / Team Lead':     [50, 63, 76],
  'Head of Sales':                 [90, 110, 131],
  'VP Sales / CRO':                [120, 146, 173],
  'profil non standard':           null
};

const BORNES_OTE: Record<ProfilF4, [number, number, number] | null> = {
  'SDR / BDR Junior':              [42, 49, 55],   // <42 sous-marché, 42-49 basse, 50-55 milieu, ≥56 haut+
  'SDR / BDR Confirmé':            [42, 48, 54],
  'Business Developer Full Cycle': [52, 61, 70],
  'AE PME / SMB':                  [61, 70, 79],
  'AE Mid-Market':                 [86, 98, 111],
  'AE Enterprise':                 [124, 148, 173],
  'Account Manager':               [59, 67, 76],
  'Customer Success Manager':      [43, 50, 57],
  'Sales Ops / RevOps':            [46, 58, 71],
  'Channel / Partner Manager':     [65, 78, 92],
  'Sales Manager / Team Lead':     [77, 97, 118],
  'Head of Sales':                 [149, 189, 229],
  'VP Sales / CRO':                [210, 266, 323],
  'profil non standard':           null
};

/**
 * Calcule la position d'un montant (fixe ou OTE) selon les bornes F4 V4
 * @param montant Montant en € brut annuel
 * @param bornes Tuple [sous-marché_max, fourchette_basse_max, milieu_max] OU null si profil non standard
 * @returns Position correspondante
 */
function calculatePosition(montant: number, bornes: [number, number, number] | null): Position {
  if (bornes === null) {
    // Profil non standard : on ne peut pas calculer, position neutre
    return 'milieu de fourchette';
  }
  const [sousMarcheMax, basseMax, milieuMax] = bornes;
  if (montant < sousMarcheMax) return 'sous-marché';
  if (montant <= basseMax) return 'fourchette basse';
  if (montant <= milieuMax) return 'milieu de fourchette';
  return 'haut+';
}

/**
 * Mappe l'intitulé du formulaire (enum) + séniorité vers un profil F4 V4
 * Suit la procédure F4 V4 — règle de mapping flou.
 */
function mapToProfilF4(
  intitulePoste: FormulaireOutil3['intitule_poste'],
  intitulePrecision: string | undefined,
  seniorite: FormulaireOutil3['seniorite'],
  typeCycle: FormulaireOutil3['type_cycle']
): ProfilF4 {
  // Mapping direct par intitulé (étape 1 F4 V4)
  switch (intitulePoste) {
    case 'SDR / BDR':
      return seniorite === 'Junior 0-2 ans' ? 'SDR / BDR Junior' : 'SDR / BDR Confirmé';
    case 'Inside Sales':
    case 'Business Developer Full Cycle':
      return 'Business Developer Full Cycle';
    case 'Field Sales / Outside Sales':
      // Field Sales = AE PME ou Mid-Market selon séniorité
      return seniorite === 'Junior 0-2 ans' ? 'AE PME / SMB' : 'AE Mid-Market';
    case 'Account Executive — PME / SMB':
      return 'AE PME / SMB';
    case 'Account Executive — Mid-Market':
      return 'AE Mid-Market';
    case 'Account Executive — Enterprise':
      return 'AE Enterprise';
    case 'Sales Engineer / Pre-Sales':
      // Profil non couvert directement par F4 V4 — fourchette indicative AE Mid-Market étendue
      return 'AE Mid-Market';
    case 'Account Manager':
      return 'Account Manager';
    case 'Strategic Account Manager / Key Account Manager':
      return 'AE Enterprise'; // Profil proche AE Enterprise selon F4 V4
    case 'Customer Success Manager':
      return 'Customer Success Manager';
    case 'Sales Ops / RevOps':
      return 'Sales Ops / RevOps';
    case 'Channel / Partner Manager':
      return 'Channel / Partner Manager';
    case 'Sales Manager / Team Lead':
      return 'Sales Manager / Team Lead';
    case 'Head of Sales':
      return 'Head of Sales';
    case 'VP Sales / CRO':
      return 'VP Sales / CRO';
    case 'Autre':
      // Si "Autre", on tente un mapping flou sur la précision saisie
      return mapAutreToProfilF4(intitulePrecision, seniorite, typeCycle);
    default:
      return 'profil non standard';
  }
}

/**
 * Mapping flou pour le cas "Autre" — on tente de matcher sur la précision saisie
 */
function mapAutreToProfilF4(
  precision: string | undefined,
  seniorite: FormulaireOutil3['seniorite'],
  typeCycle: FormulaireOutil3['type_cycle']
): ProfilF4 {
  if (!precision) return 'profil non standard';
  const p = precision.toLowerCase();
  
  // Quelques patterns de matching basique
  if (p.includes('sdr') || p.includes('bdr')) {
    return seniorite === 'Junior 0-2 ans' ? 'SDR / BDR Junior' : 'SDR / BDR Confirmé';
  }
  if (p.includes('csm') || p.includes('customer success')) return 'Customer Success Manager';
  if (p.includes('account manager') || p.includes('am ')) return 'Account Manager';
  if (p.includes('enterprise') || p.includes('grands comptes')) return 'AE Enterprise';
  if (p.includes('mid-market') || p.includes('mid market')) return 'AE Mid-Market';
  if (p.includes('pme') || p.includes('smb')) return 'AE PME / SMB';
  if (p.includes('director') || p.includes('directeur')) return 'Head of Sales';
  if (p.includes('vp') || p.includes('cro')) return 'VP Sales / CRO';
  
  // Pas de match clair → profil non standard
  return 'profil non standard';
}

/**
 * Calcule la position globale du package selon la règle F4 V4 :
 * - Fixe et OTE même zone → cette zone
 * - Zones adjacentes → zone la plus basse (prudent)
 * - Zones éloignées (≥ 2 niveaux) → "incohérence à signaler"
 */
function calculatePositionGlobale(positionFixe: Position, positionOte: Position): {
  position: Position;
  incoherence: boolean;
} {
  const positionToIndex: Record<Position, number> = {
    'sous-marché': 0,
    'fourchette basse': 1,
    'milieu de fourchette': 2,
    'haut+': 3
  };
  const indexToPosition: Position[] = [
    'sous-marché',
    'fourchette basse',
    'milieu de fourchette',
    'haut+'
  ];
  
  const idxFixe = positionToIndex[positionFixe];
  const idxOte = positionToIndex[positionOte];
  const ecart = Math.abs(idxFixe - idxOte);
  
  if (ecart === 0) {
    return { position: positionFixe, incoherence: false };
  }
  if (ecart === 1) {
    // Zones adjacentes : on prend la plus basse
    return { position: indexToPosition[Math.min(idxFixe, idxOte)], incoherence: false };
  }
  // Écart ≥ 2 : incohérence à signaler, position = la plus basse
  return { position: indexToPosition[Math.min(idxFixe, idxOte)], incoherence: true };
}

/**
 * Fonction principale exportée — calcule la position complète du package
 */
export interface PackagePositionResult {
  profil: ProfilF4;
  positionFixe: Position;
  positionOte: Position;
  positionGlobale: Position;
  incoherenceFixeOte: boolean;
}

export function calculatePackagePosition(data: FormulaireOutil3): PackagePositionResult {
  const profil = mapToProfilF4(
    data.intitule_poste,
    data.intitule_poste_precision_autre,
    data.seniorite,
    data.type_cycle
  );
  
  const positionFixe = calculatePosition(data.package_fixe, BORNES_FIXE[profil]);
  const positionOte = calculatePosition(data.package_ote, BORNES_OTE[profil]);
  const { position: positionGlobale, incoherence: incoherenceFixeOte } = 
    calculatePositionGlobale(positionFixe, positionOte);
  
  return {
    profil,
    positionFixe,
    positionOte,
    positionGlobale,
    incoherenceFixeOte
  };
}
```

#### Tests unitaires recommandés

```typescript
// tests/calculate-package-position.test.ts

import { describe, expect, it } from 'vitest';
import { calculatePackagePosition } from '~/server/utils/outil-3/calculate-package-position';

describe('calculatePackagePosition', () => {
  it('AE PME/SMB Confirmé 55k/75k → fixe haut+ / OTE milieu / global milieu', () => {
    const result = calculatePackagePosition({
      intitule_poste: 'Account Executive — PME / SMB',
      seniorite: 'Confirmé 2-5 ans',
      package_fixe: 55000,
      package_ote: 75000,
      // ... autres champs
    } as any);
    
    expect(result.profil).toBe('AE PME / SMB');
    expect(result.positionFixe).toBe('haut+');     // 55k > 48k = haut+
    expect(result.positionOte).toBe('milieu de fourchette'); // 75k entre 71-79k = milieu
    expect(result.positionGlobale).toBe('milieu de fourchette'); // adjacent → on prend la plus basse
    expect(result.incoherenceFixeOte).toBe(false);
  });
  
  it('AE Mid-Market Confirmé 60k/100k → fixe haut+ / OTE milieu / global milieu', () => {
    const result = calculatePackagePosition({
      intitule_poste: 'Account Executive — Mid-Market',
      seniorite: 'Confirmé 2-5 ans',
      package_fixe: 60000,
      package_ote: 100000,
    } as any);
    
    expect(result.positionFixe).toBe('haut+');
    expect(result.positionOte).toBe('milieu de fourchette');
    expect(result.positionGlobale).toBe('milieu de fourchette');
  });
  
  it('Head of Sales Lead 70k/100k (Vade Secure cas critique) → fixe sous-marché / OTE sous-marché / global sous-marché', () => {
    const result = calculatePackagePosition({
      intitule_poste: 'Head of Sales',
      seniorite: 'Lead 8+ ans',
      package_fixe: 70000,
      package_ote: 100000,
    } as any);
    
    expect(result.positionFixe).toBe('sous-marché');  // 70k < 90k
    expect(result.positionOte).toBe('sous-marché');   // 100k < 149k
    expect(result.positionGlobale).toBe('sous-marché');
  });
  
  it('Détecte incohérence fixe/OTE quand écart ≥ 2 niveaux', () => {
    const result = calculatePackagePosition({
      intitule_poste: 'Account Executive — Mid-Market',
      seniorite: 'Confirmé 2-5 ans',
      package_fixe: 40000,    // sous-marché
      package_ote: 100000,    // milieu de fourchette
    } as any);
    
    expect(result.positionFixe).toBe('sous-marché');
    expect(result.positionOte).toBe('milieu de fourchette');
    expect(result.incoherenceFixeOte).toBe(true);  // écart de 2 niveaux
  });
});
```

### 6.4 Construction du user prompt — V3 avec injection du pré-calcul

```typescript
// server/utils/outil-3/build-user-prompt.ts

import type { FormulaireOutil3 } from '~/server/schemas/outil-3/formulaire';
import { calculatePackagePosition } from './calculate-package-position';

export function buildUserPrompt(data: FormulaireOutil3): string {
  const cycleLabel = data.type_cycle === 'Autre' && data.type_cycle_autre
    ? `${data.type_cycle} (${data.type_cycle_autre})`
    : data.type_cycle;
  
  // Intitulé poste : si "Autre", on ajoute la précision saisie
  const intituleLabel = data.intitule_poste === 'Autre' && data.intitule_poste_precision_autre
    ? `${data.intitule_poste} (${data.intitule_poste_precision_autre})`
    : data.intitule_poste;
  
  // Secteur : si "Autre", on ajoute la précision saisie
  const secteurLabel = data.secteur === 'Autre' && data.secteur_precision_autre
    ? `${data.secteur} (${data.secteur_precision_autre})`
    : data.secteur;
  
  // Site web optionnel : on n'inclut la ligne que s'il est rempli
  const siteWebLine = data.site_web && data.site_web.trim() !== ''
    ? `- Site web : ${data.site_web}`
    : `- Site web : (non renseigné — utilise la web search sur le nom de l'entreprise si tu as besoin de plus d'infos)`;
  
  // NOUVEAU V3 — Pré-calcul de la position du package selon F4 V4
  const positionPackage = calculatePackagePosition(data);
  
  // Bloc de pré-calcul à injecter dans le user prompt
  const blocPreCalculPackage = `
# 🔒 PRÉ-CALCUL PACKAGE (selon F4 V4 — déjà appliqué côté backend, NE PAS RECALCULER)

Le scoring de la position du package a été calculé en amont selon la grille terrain F4 V4. Tu utilises directement ces résultats pour rédiger la section "Lecture package" du markdown :

- **Profil F4 identifié** : ${positionPackage.profil}
- **Position du fixe (${data.package_fixe.toLocaleString('fr-FR')}€)** : ${positionPackage.positionFixe}
- **Position de l'OTE (${data.package_ote.toLocaleString('fr-FR')}€)** : ${positionPackage.positionOte}
- **Position globale du package** : ${positionPackage.positionGlobale}
- **Incohérence ratio fixe/OTE détectée** : ${positionPackage.incoherenceFixeOte ? 'Oui — à signaler dans les alertes' : 'Non'}

⚠️ Ces résultats sont **autoritaires**. Tu ne recalcules pas, tu ne contestes pas, tu ne mentionnes pas leur existence dans le markdown. Tu rédiges la section "Lecture package" sur la base de ces étiquettes qualitatives uniquement, en suivant les formulations imposées dans le system prompt.
`;
  
  return `Voici les inputs du formulaire à évaluer :

# Identité prospect
- Prénom : ${data.prenom}
- Nom : ${data.nom}
- Email : ${data.email}
- Téléphone : ${data.telephone}

# Contexte entreprise
- Entreprise : ${data.entreprise}
${siteWebLine}
- Secteur : ${secteurLabel}
- Localisation : ${data.localisation}
- Effectifs : ${data.effectifs_entreprise}
- Composition équipe Sales : ${data.equipe_sales}

# Contexte poste
- Intitulé : ${intituleLabel}
- Séniorité visée : ${data.seniorite}
- Type de cycle : ${cycleLabel}
- Modalité de travail : ${data.modalite_travail}

# Description des missions (champ libre, max 1000 caractères)
${data.description_missions}

# Package proposé (en € brut annuel)
- Fixe : ${data.package_fixe.toLocaleString('fr-FR')} €
- OTE total cible : ${data.package_ote.toLocaleString('fr-FR')} €

${blocPreCalculPackage}

---

Génère maintenant l'évaluation complète selon le format strict défini dans le system prompt :
- Bloc JSON de méta-données
- Délimiteur \`---END_META---\` seul sur sa ligne
- Livrable Markdown des 8 sections (titre, intro, verdict, marque & secteur, mission, package, synthèse & leviers, twist, CTA)

Applique les référentiels F1 → F2 → F3 → F4 dans l'ordre, et respecte toutes les règles de confidentialité (pas de mention des Tiers, des fichiers, des grilles, du score chiffré dans le markdown).`;
}
```

### 6.4 Schéma Zod du JSON LLM

Implémenté dans `server/schemas/outil-3/llm-output-json.ts`.

```typescript
import { z } from 'zod';

export const llmOutputJsonSchema = z.object({
  niveau_attractivite: z.enum([
    'Hyper attractive',
    'Très attractive',
    'Attractive / alignée',
    'Sous-positionnée',
    'Fragile'
  ]),
  niveau_index: z.number().int().min(1).max(5),
  jauge_position: z.number().int().min(1).max(10),
  score_interne: z.number().int().min(-6).max(9),
  score_max: z.literal(9),
  dimensions: z.object({
    marque: z.string().min(1).max(50),
    secteur: z.string().min(1).max(50),
    mission: z.string().min(1).max(50),
    package: z.string().min(1).max(50)
  }),
  alertes: z.array(z.string().max(100)).max(5),
  brief_flou: z.boolean()
}).strict();

// Validation cross-field : niveau_attractivite et niveau_index doivent correspondre
export const llmOutputJsonSchemaRefined = llmOutputJsonSchema.refine(
  (data) => {
    const expectedIndex = {
      'Fragile': 1,
      'Sous-positionnée': 2,
      'Attractive / alignée': 3,
      'Très attractive': 4,
      'Hyper attractive': 5
    }[data.niveau_attractivite];
    return data.niveau_index === expectedIndex;
  },
  { message: 'Incohérence entre niveau_attractivite et niveau_index' }
);

export type LlmOutputJson = z.infer<typeof llmOutputJsonSchemaRefined>;
```

### 6.5 Parsing de la réponse hybride

Implémenté dans `server/utils/outil-3/parse-llm-response.ts`.

```typescript
const DELIMITER = '---END_META---';

interface ParseSuccess {
  success: true;
  data: { json: unknown; markdown: string };
}
interface ParseFailure {
  success: false;
  error: string;
}
type ParseResult = ParseSuccess | ParseFailure;

export function parseLlmResponse(rawContent: string): ParseResult {
  // 1. Trouver le délimiteur
  const delimiterIndex = rawContent.indexOf(DELIMITER);
  if (delimiterIndex === -1) {
    return { success: false, error: 'Délimiteur ---END_META--- introuvable' };
  }
  
  // 2. Extraire les deux parties
  let jsonPart = rawContent.substring(0, delimiterIndex).trim();
  const markdownPart = rawContent.substring(delimiterIndex + DELIMITER.length).trim();
  
  // 3. Nettoyer le JSON (enlever d'éventuelles backticks ou markdown autour)
  jsonPart = jsonPart.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  
  // 4. Parser le JSON
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(jsonPart);
  } catch (e: any) {
    return { success: false, error: `JSON invalide : ${e.message}` };
  }
  
  // 5. Vérifier que le markdown commence bien par le titre H1 attendu
  if (!markdownPart.startsWith('# Évaluation d\'attractivité —')) {
    return { 
      success: false, 
      error: 'Markdown ne commence pas par le titre H1 attendu' 
    };
  }
  
  return {
    success: true,
    data: { json: parsedJson, markdown: markdownPart }
  };
}
```

### 6.6 Fallback dégradé (JSON malformé)

Si le parsing échoue ou si le JSON ne valide pas le schéma, on utilise un fallback dégradé qui affiche **uniquement le markdown** au prospect, sans la jauge ni les badges.

```typescript
// server/utils/outil-3/degraded-fallback.ts

export async function handleDegradedFallback(
  data: FormulaireOutil3,
  rawContent: string,
  uuid: string,
  requestIp: string
) {
  // Tenter de récupérer le markdown même si le JSON est cassé
  const delimiterIndex = rawContent.indexOf('---END_META---');
  const markdown = delimiterIndex !== -1 
    ? rawContent.substring(delimiterIndex + '---END_META---'.length).trim()
    : rawContent.trim();
  
  // JSON par défaut "neutre" pour permettre le rendu frontend
  const fallbackJson = {
    niveau_attractivite: 'Attractive / alignée' as const,
    niveau_index: 3,
    jauge_position: 5,
    score_interne: 0,
    score_max: 9 as const,
    dimensions: {
      marque: 'Non évalué',
      secteur: 'Non évalué',
      mission: 'Non évalué',
      package: 'Non évalué'
    },
    alertes: ['Évaluation en mode dégradé — données structurées indisponibles'],
    brief_flou: false,
    _degraded: true
  };
  
  // Persistance + side effects malgré le mode dégradé
  await Promise.allSettled([
    kv.set(`eval:${uuid}`, { uuid, json: fallbackJson, markdown, degraded: true, /*...*/ }, { ex: 60*60*24*90 }),
    createJarviContact(data, uuid, fallbackJson),
    sendBrevoEvaluationEmail(data, uuid, fallbackJson),
    incrementRateLimit(requestIp)
  ]);
  
  return { uuid, json: fallbackJson, markdown, deferred: false, degraded: true };
}
```

---

## 7. Couches de sécurité

Récapitulatif des 5 couches de sécurité (en complément des 3 garde-fous prompt).

### 7.1 Couche 1 — Validation inputs (avant appel LLM)

**Implémentée dans** : `server/utils/outil-3/injection-patterns.ts` (cf. section 4)
**Comportement** : si pattern détecté → erreur 400 immédiate, alerte Boss
**Efficacité attendue** : bloque ~90% des injections naïves

### 7.2 Couche 2 — Filtre output (après réponse LLM, avant frontend)

**Implémentée dans** : `server/utils/outil-3/validate-output.ts`

```typescript
const FORBIDDEN_KEYWORDS = [
  // Tiers F1
  /\bTier\s+S\b/gi,
  /\bTier\s+A\b/gi,
  /\bTier\s+B\b/gi,
  /\bTier\s+C\b/gi,
  
  // Identifiants fichiers
  /\bF[1-4]\b/g,
  /\b(Fichier|fichier)\s+[1-4]\b/g,
  
  // Vocabulaire référentiel
  /référentiels?\s+(internes?|propriétaires?|mariell)/gi,
  /\bgrille\s+terrain/gi,
  /\bgrille\s+minorée/gi,
  /\bgrille\s+interne/gi,
  /\bréférentiel\s+chiffré/gi,
  
  // Méthodologie
  /\b6\s+dimensions/gi,
  /\bscore\s+(interne|f3|additif|chiffré)\b/gi,
  /\bmodificateur\s+sectoriel/gi,
  /\bprincipe\s+directeur\s+transversal/gi,
  
  // Pourcentage de minoration F4
  /-\s*10\s*%\s*(?:du|vs|par rapport)/gi,
  /minoration\s+de\s+10/gi,
  
  // Mentions méta
  /selon\s+(notre|nos)\s+(grille|référentiel|tier)/gi,
  /d'après\s+(notre|nos)\s+(grille|référentiel|tier)/gi
];

interface ValidationResult {
  safe: boolean;
  matched: string[];
  sanitized: string;
}

export function validateLlmOutput(markdown: string): ValidationResult {
  const matched: string[] = [];
  let sanitized = markdown;
  
  for (const pattern of FORBIDDEN_KEYWORDS) {
    const matches = markdown.match(pattern);
    if (matches) {
      matched.push(...matches);
      // Remplace par une version neutralisée
      sanitized = sanitized.replace(pattern, '[information non communiquée]');
    }
  }
  
  return {
    safe: matched.length === 0,
    matched,
    sanitized
  };
}
```

**Comportement** :
- Si aucun mot-clé interdit → `safe: true`, markdown inchangé
- Si mots-clés détectés → `safe: false`, markdown sanitized + log + alerte Boss
- **Pas de régénération** (coût et latence trop élevés)

### 7.3 Couche 3 — Web search SANS web fetch

Cohérent avec la spec API Anthropic : on déclare seulement l'outil `web_search_20250305`, pas `web_fetch`. Le LLM peut chercher ("Pennylane effectifs France 2026") mais pas lire directement une URL fournie par le prospect.

```typescript
// Configuration outils Anthropic
tools: [
  { 
    type: 'web_search_20250305', 
    name: 'web_search',
    max_uses: MAX_WEB_SEARCHES // 3 par défaut
  }
  // PAS de web_fetch
]
```

### 7.4 Couche 4 — Rate limiting Vercel KV

Implémenté dans `server/utils/outil-3/rate-limit.ts` (mutualisé avec outil 1 et outil 2 sous une seule clé KV par IP).

```typescript
import { kv } from '@vercel/kv';

const DAILY_LIMIT = parseInt(process.env.OUTIL_3_RATE_LIMIT_DAILY || '3');
const WEEKLY_LIMIT = parseInt(process.env.OUTIL_3_RATE_LIMIT_WEEKLY || '7');

export async function checkRateLimit(ip: string): Promise<{ exceeded: boolean; details?: string }> {
  const dayKey = `ratelimit:outil3:day:${ip}:${getCurrentDay()}`;
  const weekKey = `ratelimit:outil3:week:${ip}:${getCurrentWeek()}`;
  
  const [dailyCount, weeklyCount] = await Promise.all([
    kv.get<number>(dayKey),
    kv.get<number>(weekKey)
  ]);
  
  if ((dailyCount || 0) >= DAILY_LIMIT) {
    return { exceeded: true, details: 'daily limit' };
  }
  if ((weeklyCount || 0) >= WEEKLY_LIMIT) {
    return { exceeded: true, details: 'weekly limit' };
  }
  
  return { exceeded: false };
}

export async function incrementRateLimit(ip: string): Promise<void> {
  const dayKey = `ratelimit:outil3:day:${ip}:${getCurrentDay()}`;
  const weekKey = `ratelimit:outil3:week:${ip}:${getCurrentWeek()}`;
  
  await Promise.all([
    kv.incr(dayKey),
    kv.expire(dayKey, 60 * 60 * 24),
    kv.incr(weekKey),
    kv.expire(weekKey, 60 * 60 * 24 * 7)
  ]);
}

function getCurrentDay(): string {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function getCurrentWeek(): string {
  const date = new Date();
  const year = date.getFullYear();
  const week = Math.ceil((((+date - +new Date(year, 0, 1)) / 86400000) + new Date(year, 0, 1).getDay() + 1) / 7);
  return `${year}-W${week}`;
}
```

### 7.5 Couche 5 — Logging et alertes

Implémenté dans `server/utils/logging.ts` (mutualisé tout l'app).

```typescript
export function logServerEvent(event: string, data: Record<string, any>) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ...data
  };
  console.log(JSON.stringify(logEntry));
  // En prod : envoyé vers Vercel Logs + agrégation Datadog/Logtail si setup
}

export async function alertOnInjection(
  ip: string, 
  matched: any, 
  context: any
) {
  // Increment compteur d'alertes pour cet IP
  const alertKey = `alert:injection:${ip}:${getCurrentDay()}`;
  const count = await kv.incr(alertKey);
  await kv.expire(alertKey, 60 * 60 * 24);
  
  // Si ≥3 alertes dans la journée pour la même IP → email Boss
  if (count >= 3) {
    await sendAlertEmail({
      to: process.env.ALERT_EMAIL_BOSS!,
      subject: `[Mariell - Outil 3] Tentative d'injection répétée détectée`,
      body: `IP: ${ip}\nNombre d'alertes aujourd'hui: ${count}\nPatterns matchés: ${JSON.stringify(matched)}\nContexte: ${JSON.stringify(context)}`
    });
  }
}
```

---

## 8. Mode "Traitement différé"

Quand le rate limit est dépassé, on bascule en mode différé : on capture le lead malgré tout, on lui envoie un email "votre évaluation est en cours de traitement et arrivera sous 24-48h", et on enregistre la demande dans une queue pour traitement asynchrone (manuel ou automatisé).

```typescript
// server/utils/outil-3/deferred.ts

export async function handleDeferredEvaluation(
  data: FormulaireOutil3,
  requestIp: string
): Promise<string> {
  const uuid = crypto.randomUUID();
  
  // Persistance de la demande dans la queue
  await kv.set(`deferred:${uuid}`, {
    uuid,
    timestamp: new Date().toISOString(),
    inputs: data,
    ip: requestIp,
    status: 'pending'
  }, { ex: 60 * 60 * 24 * 7 }); // TTL 7 jours
  
  // Ajout à une liste de queue pour batch processing
  await kv.lpush('deferred:queue:outil-3', uuid);
  
  // Side effects : Brevo + Jarvi en parallèle
  await Promise.allSettled([
    sendBrevoEvaluationDeferredEmail(data, uuid),
    createJarviContact(data, uuid, null, 'deferred')
  ]);
  
  logServerEvent('outil-3.evaluation.deferred', { uuid, ip: requestIp });
  
  return uuid;
}
```

**Note** : le batch processing des demandes en différé peut être déclenché manuellement (Boss reçoit alerte email + traite à la main) ou via un cron Vercel hebdomadaire qui purge la queue. À implémenter en V2 du produit.

---

## 9. Brevo (templates et envoi)

### 9.1 Templates Brevo nécessaires

Deux templates à créer dans Brevo (IDs à inscrire dans `.env`) :

| Template | ID `.env` | Contexte |
|---|---|---|
| Évaluation délivrée | `BREVO_TEMPLATE_EVALUATION_DELIVERED_ID` | Envoyé après génération réussie |
| Évaluation différée | `BREVO_TEMPLATE_EVALUATION_DEFERRED_ID` | Envoyé si rate limit dépassé |

Les contenus exacts des templates sont précisés dans **Annexe B**.

### 9.2 Envoi email — code

```typescript
// server/utils/outil-3/brevo-send.ts

import type { LlmOutputJson } from '~/server/schemas/outil-3/llm-output-json';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

interface BrevoEmailParams {
  to: string;
  templateId: number;
  params: Record<string, any>;
}

async function sendBrevoEmail({ to, templateId, params }: BrevoEmailParams) {
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY!
    },
    body: JSON.stringify({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME
      },
      to: [{ email: to }],
      templateId,
      params
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo error: ${response.status} ${error}`);
  }
  
  return response.json();
}

export async function sendBrevoEvaluationEmail(
  data: FormulaireOutil3,
  uuid: string,
  json: LlmOutputJson
) {
  const resultatUrl = `${process.env.PUBLIC_BASE_URL}/lab/evaluation-attractivite/resultat/${uuid}`;
  
  return sendBrevoEmail({
    to: data.email,
    templateId: parseInt(process.env.BREVO_TEMPLATE_EVALUATION_DELIVERED_ID!),
    params: {
      prenom: data.prenom,
      entreprise: data.entreprise,
      poste: data.intitule_poste,
      niveau_attractivite: json.niveau_attractivite,
      lien_evaluation: resultatUrl,
      lien_calendly: process.env.CALENDLY_URL_OUTIL_3
    }
  });
}

export async function sendBrevoEvaluationDeferredEmail(
  data: FormulaireOutil3,
  uuid: string
) {
  return sendBrevoEmail({
    to: data.email,
    templateId: parseInt(process.env.BREVO_TEMPLATE_EVALUATION_DEFERRED_ID!),
    params: {
      prenom: data.prenom,
      entreprise: data.entreprise
    }
  });
}
```

---

## 10. Jarvi (création contact CRM)

```typescript
// server/utils/outil-3/jarvi-create-contact.ts

import type { LlmOutputJson } from '~/server/schemas/outil-3/llm-output-json';

export async function createJarviContact(
  data: FormulaireOutil3,
  uuid: string,
  json: LlmOutputJson | null,
  status: 'completed' | 'deferred' = 'completed'
) {
  const resultatUrl = `${process.env.PUBLIC_BASE_URL}/lab/evaluation-attractivite/resultat/${uuid}`;
  
  const tags = ['Outil 3 - Évaluation', `Status: ${status}`];
  if (json?.niveau_attractivite) {
    tags.push(`Niveau: ${json.niveau_attractivite}`);
  }
  
  const response = await fetch(`${process.env.JARVI_API_URL}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.JARVI_API_KEY}`
    },
    body: JSON.stringify({
      pipeline_id: process.env.JARVI_PIPELINE_ID_EVALUATION,
      first_name: data.prenom,
      last_name: data.nom,
      email: data.email,
      phone: data.telephone,
      company: data.entreprise,
      tags,
      custom_fields: {
        site_web: data.site_web || '',
        secteur: data.secteur === 'Autre' && data.secteur_precision_autre
          ? `${data.secteur} (${data.secteur_precision_autre})`
          : data.secteur,
        localisation: data.localisation,
        intitule_poste: data.intitule_poste === 'Autre' && data.intitule_poste_precision_autre
          ? `${data.intitule_poste} (${data.intitule_poste_precision_autre})`
          : data.intitule_poste,
        seniorite: data.seniorite,
        type_cycle: data.type_cycle === 'Autre' && data.type_cycle_autre
          ? `${data.type_cycle} (${data.type_cycle_autre})`
          : data.type_cycle,
        modalite_travail: data.modalite_travail,
        package_fixe: data.package_fixe,
        package_ote: data.package_ote,
        evaluation_uuid: uuid,
        evaluation_url: resultatUrl,
        niveau_attractivite: json?.niveau_attractivite || 'pending',
        score_interne: json?.score_interne ?? null,
        brief_flou: json?.brief_flou ?? null,
        alertes: json?.alertes?.join('; ') || null
      },
      source: 'outil-3-evaluation-attractivite'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Jarvi error: ${response.status} ${await response.text()}`);
  }
  
  return response.json();
}
```

---

## 11. Cloudflare Turnstile

```typescript
// server/utils/turnstile.ts (mutualisé tous outils)

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  if (!token) return false;
  
  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
        remoteip: ip
      })
    });
    
    const data = await response.json();
    return data.success === true;
  } catch (e) {
    console.error('[turnstile] Verification failed', e);
    return false;
  }
}
```

Côté client, ajouter le widget Turnstile dans la page formulaire (`pages/lab/evaluation-attractivite/index.vue`) :

```vue
<div class="cf-turnstile" :data-sitekey="turnstileSiteKey" data-callback="onTurnstileVerify"></div>
<script setup>
const config = useRuntimeConfig();
const turnstileSiteKey = config.public.turnstileSiteKey;
</script>
```

---

## 12. Route récupération évaluation persistée — `GET /api/lab/evaluation-attractivite/get-by-uuid`

Permet à la page `[uuid].vue` de récupérer une évaluation persistée à partir de son UUID (lien email Brevo).

```typescript
// server/api/lab/evaluation-attractivite/get-by-uuid.get.ts

import { defineEventHandler, getQuery, createError } from 'h3';
import { kv } from '@vercel/kv';

export default defineEventHandler(async (event) => {
  const { uuid } = getQuery(event);
  
  if (!uuid || typeof uuid !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'UUID manquant' });
  }
  
  // Validation format UUID
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)) {
    throw createError({ statusCode: 400, statusMessage: 'UUID invalide' });
  }
  
  const evaluation = await kv.get(`eval:${uuid}`);
  
  if (!evaluation) {
    throw createError({ 
      statusCode: 404, 
      statusMessage: 'Évaluation introuvable. Le lien a peut-être expiré (durée de conservation : 90 jours).'
    });
  }
  
  return evaluation;
});
```

---

## 13. Composable Vue côté client

```typescript
// composables/outil-3/useEvaluationAttractivite.ts

import type { FormulaireOutil3 } from '~/server/schemas/outil-3/formulaire';
import type { LlmOutputJson } from '~/server/schemas/outil-3/llm-output-json';

interface EvaluationResponse {
  uuid: string;
  json: LlmOutputJson;
  markdown: string;
  deferred: boolean;
  degraded?: boolean;
}

export function useEvaluationAttractivite() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const result = ref<EvaluationResponse | null>(null);
  
  async function submitEvaluation(formData: FormulaireOutil3): Promise<EvaluationResponse | null> {
    loading.value = true;
    error.value = null;
    result.value = null;
    
    try {
      const response = await $fetch<EvaluationResponse>('/api/lab/evaluation-attractivite/generate', {
        method: 'POST',
        body: formData
      });
      
      result.value = response;
      return response;
      
    } catch (e: any) {
      error.value = e.statusMessage || e.message || 'Erreur inconnue';
      return null;
    } finally {
      loading.value = false;
    }
  }
  
  async function fetchEvaluationByUuid(uuid: string): Promise<EvaluationResponse | null> {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await $fetch<EvaluationResponse>('/api/lab/evaluation-attractivite/get-by-uuid', {
        query: { uuid }
      });
      
      result.value = response;
      return response;
      
    } catch (e: any) {
      error.value = e.statusMessage || e.message || 'Évaluation introuvable';
      return null;
    } finally {
      loading.value = false;
    }
  }
  
  return {
    loading: readonly(loading),
    error: readonly(error),
    result: readonly(result),
    submitEvaluation,
    fetchEvaluationByUuid
  };
}
```

---

## 14. Pages Vue

### 14.1 `/pages/lab/evaluation-attractivite/index.vue` — Formulaire

Le composant principal du formulaire. Implémentation complète dans le brief Claude Design (Annexe C). Architecture :

```vue
<template>
  <div class="eval-form-container">
    <h1>Évaluation d'attractivité de votre offre Sales</h1>
    <p class="intro">Recevez en 2 minutes une lecture experte de votre offre Sales sur 4 dimensions...</p>
    
    <EvaluationFormulaire
      v-model="formData"
      :loading="loading"
      :error="error"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { useEvaluationAttractivite } from '~/composables/outil-3/useEvaluationAttractivite';

const formData = ref<Partial<FormulaireOutil3>>({});
const { loading, error, submitEvaluation } = useEvaluationAttractivite();
const router = useRouter();

async function onSubmit() {
  const response = await submitEvaluation(formData.value as FormulaireOutil3);
  if (response) {
    if (response.deferred) {
      // Mode différé : afficher message + redirect vers une page d'attente
      router.push('/lab/evaluation-attractivite/en-traitement');
    } else {
      // Mode normal : redirect vers résultat
      router.push(`/lab/evaluation-attractivite/resultat?session=${response.uuid}`);
    }
  }
}
</script>
```

### 14.2 `/pages/lab/evaluation-attractivite/resultat.vue` — Page résultat post-soumission

Récupère l'UUID via le query param `session`, charge l'évaluation, affiche le résultat.

```vue
<template>
  <div class="eval-result-container">
    <div v-if="loading" class="loader">
      <Loader />
      <p>Génération de votre évaluation en cours...</p>
    </div>
    
    <EvaluationResultat
      v-else-if="result"
      :json="result.json"
      :markdown="result.markdown"
      :degraded="result.degraded"
    />
    
    <div v-else class="error">
      <p>{{ error || 'Évaluation introuvable.' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { result, loading, error, fetchEvaluationByUuid } = useEvaluationAttractivite();

onMounted(async () => {
  const uuid = route.query.session as string;
  if (uuid) {
    await fetchEvaluationByUuid(uuid);
  }
});
</script>
```

### 14.3 `/pages/lab/evaluation-attractivite/resultat/[uuid].vue` — Page résultat persistée (lien email)

Quasi-identique à `resultat.vue` mais récupère l'UUID via `params` plutôt que `query`. Permet d'avoir une URL propre type `/lab/evaluation-attractivite/resultat/abc-123-def-456`.

```vue
<script setup lang="ts">
const route = useRoute();
const { result, loading, error, fetchEvaluationByUuid } = useEvaluationAttractivite();

onMounted(async () => {
  const uuid = route.params.uuid as string;
  if (uuid) {
    await fetchEvaluationByUuid(uuid);
  }
});
</script>
```

### 14.4 Composant `EvaluationResultat.vue` — Cœur du rendu visuel

Composant central qui consomme le JSON + markdown et orchestre le rendu visuel.

```vue
<template>
  <article class="evaluation-resultat">
    <!-- Header titre/méta extrait du markdown -->
    <header class="eval-header">
      <h1>{{ titre }}</h1>
      <p class="eval-meta">{{ meta }}</p>
    </header>
    
    <!-- Bandeau brief flou si actif -->
    <MessageBriefFlou v-if="json.brief_flou" />
    
    <!-- Bandeau alertes si présentes -->
    <AlertesEvaluation v-if="json.alertes.length > 0" :alertes="json.alertes" />
    
    <!-- Jauge d'attractivité (composant principal de visualisation) -->
    <section class="jauge-section">
      <h2>Position d'attractivité</h2>
      <JaugeAttractivite
        :niveau="json.niveau_attractivite"
        :niveau-index="json.niveau_index"
        :jauge-position="json.jauge_position"
      />
    </section>
    
    <!-- 4 badges dimensions -->
    <BadgesDimensions :dimensions="json.dimensions" />
    
    <!-- Contenu markdown rendu -->
    <section class="eval-content" v-html="renderedMarkdown"></section>
    
    <!-- CTA Calendly proéminent (le markdown contient un placeholder [CTA Calendly]) -->
    <div class="cta-calendly">
      <a :href="calendlyUrl" target="_blank" rel="noopener" class="btn-cta">
        Prendre rendez-vous avec Mariell
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import type { LlmOutputJson } from '~/server/schemas/outil-3/llm-output-json';

const props = defineProps<{
  json: LlmOutputJson;
  markdown: string;
  degraded?: boolean;
}>();

// Extraction titre et meta du markdown (les 2 premières lignes structurées)
const titre = computed(() => {
  const match = props.markdown.match(/^# (Évaluation d'attractivité — .+)$/m);
  return match ? match[1] : 'Évaluation d\'attractivité';
});

const meta = computed(() => {
  const match = props.markdown.match(/^\*Préparée par Mariell pour (.+)\*$/m);
  return match ? `Préparée par Mariell pour ${match[1]}` : '';
});

// Rendu du markdown en HTML safe (sans le titre/méta déjà extraits)
const renderedMarkdown = computed(() => {
  // On retire le titre H1 et la ligne meta du markdown rendu (déjà affichés en header)
  let cleaned = props.markdown
    .replace(/^# Évaluation d'attractivité — .+$\n/m, '')
    .replace(/^\*Préparée par Mariell pour .+\*$\n/m, '')
    .replace(/^---$\n/m, '');
  
  // On retire aussi le bloc CTA Calendly final (on l'affiche via le composant dédié)
  cleaned = cleaned.replace(/\*On peut en parler\. C'est ici\.\*\s*\n\s*\*\*\[CTA Calendly\]\*\*/g, '');
  
  const html = marked.parse(cleaned);
  return DOMPurify.sanitize(html);
});

const config = useRuntimeConfig();
const calendlyUrl = config.public.calendlyUrlOutil3;
</script>
```

### 14.5 Composant `JaugeAttractivite.vue` — Jauge à 10 segments

Le composant visuel central de l'expérience résultat.

```vue
<template>
  <div class="jauge-attractivite">
    <div class="jauge-bar" role="progressbar" :aria-valuenow="jaugePosition" :aria-valuemin="1" :aria-valuemax="10">
      <div 
        v-for="i in 10" 
        :key="i" 
        class="jauge-segment"
        :class="[
          { 'segment-active': i <= jaugePosition },
          `segment-color-${getColorClass(niveauIndex)}`
        ]"
      ></div>
    </div>
    
    <div class="jauge-label">
      <span class="niveau-attractivite" :class="`niveau-${niveauIndex}`">
        {{ niveau }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  niveau: string;
  niveauIndex: number;  // 1 (Fragile) à 5 (Hyper attractive)
  jaugePosition: number; // 1 à 10
}>();

function getColorClass(idx: number): string {
  // 1 = rouge / 2 = orange / 3 = bleu / 4 = vert / 5 = vert foncé
  const map: Record<number, string> = {
    1: 'red',
    2: 'orange',
    3: 'blue',
    4: 'green',
    5: 'darkgreen'
  };
  return map[idx] || 'blue';
}
</script>

<style scoped>
.jauge-bar { display: flex; gap: 4px; height: 32px; }
.jauge-segment { flex: 1; background: var(--color-bg-muted); border-radius: 4px; transition: background 0.3s ease; }
.jauge-segment.segment-active.segment-color-red { background: var(--color-red-500); }
.jauge-segment.segment-active.segment-color-orange { background: var(--color-orange-500); }
.jauge-segment.segment-active.segment-color-blue { background: var(--color-blue-500); }
.jauge-segment.segment-active.segment-color-green { background: var(--color-green-500); }
.jauge-segment.segment-active.segment-color-darkgreen { background: var(--color-green-700); }
.jauge-label { margin-top: 12px; font-weight: 600; }
</style>
```

### 14.6 Composant `BadgesDimensions.vue`

```vue
<template>
  <div class="badges-dimensions">
    <div class="badge" v-for="(value, key) in dimensions" :key="key">
      <span class="badge-label">{{ labelMap[key] }}</span>
      <span class="badge-value">{{ value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  dimensions: { marque: string; secteur: string; mission: string; package: string };
}>();

const labelMap = {
  marque: 'Marque',
  secteur: 'Secteur',
  mission: 'Mission',
  package: 'Package'
};
</script>
```

### 14.7 Composants `AlertesEvaluation.vue` et `MessageBriefFlou.vue`

Composants simples qui affichent des bandeaux d'avertissement contextuels. Détails dans le brief Claude Design.

---

## 15. Rendu du Markdown en HTML côté Vue

On utilise `marked` pour la conversion Markdown → HTML, et `isomorphic-dompurify` pour sanitiser le HTML côté serveur ou client.

### Configuration de `marked`

```typescript
// utils/markdown-config.ts (mutualisé)

import { marked } from 'marked';

marked.setOptions({
  gfm: true,           // GitHub Flavored Markdown (tableaux, etc.)
  breaks: false,       // Pas de <br> automatique sur les retours à la ligne
  pedantic: false,
  smartLists: true
});

export { marked };
```

### Cas particulier : suppression du bloc CTA Calendly

Le markdown produit par le LLM se termine toujours par :

```markdown
---

*On peut en parler. C'est ici.*

**[CTA Calendly]**
```

On supprime ce bloc dans le rendu HTML, et on l'affiche via un composant Vue dédié avec le vrai bouton CTA Calendly. C'est fait dans `EvaluationResultat.vue` (cf. section 14.4).

---

## 16. Dépendances npm à installer

```bash
# SDKs principaux
npm install @anthropic-ai/sdk
npm install @vercel/kv
npm install zod

# Markdown
npm install marked
npm install isomorphic-dompurify

# Utilitaires Vue
# (Nuxt 3 et @nuxtjs/turnstile sont déjà installés selon hypothèse)
npm install @nuxtjs/turnstile
```

`package.json` (extrait des nouvelles deps à ajouter) :

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.30.0",
    "@vercel/kv": "^3.0.0",
    "zod": "^3.23.0",
    "marked": "^12.0.0",
    "isomorphic-dompurify": "^2.10.0",
    "@nuxtjs/turnstile": "^0.9.0"
  }
}
```

---

## 17. Configuration Nuxt

### `nuxt.config.ts` (extraits pertinents pour l'outil 3)

```typescript
export default defineNuxtConfig({
  // Preset Vercel Edge ou Vercel selon préférence
  nitro: {
    preset: 'vercel'
  },
  
  // Modules
  modules: [
    '@nuxtjs/turnstile'
  ],
  
  // Runtime config (variables d'env exposées côté client si nécessaire)
  runtimeConfig: {
    // Variables côté serveur uniquement
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    brevoApiKey: process.env.BREVO_API_KEY,
    brevoTemplateEvaluationDeliveredId: process.env.BREVO_TEMPLATE_EVALUATION_DELIVERED_ID,
    brevoTemplateEvaluationDeferredId: process.env.BREVO_TEMPLATE_EVALUATION_DEFERRED_ID,
    brevoSenderEmail: process.env.BREVO_SENDER_EMAIL,
    brevoSenderName: process.env.BREVO_SENDER_NAME,
    jarviApiKey: process.env.JARVI_API_KEY,
    jarviApiUrl: process.env.JARVI_API_URL,
    jarviPipelineIdEvaluation: process.env.JARVI_PIPELINE_ID_EVALUATION,
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY,
    alertEmailBoss: process.env.ALERT_EMAIL_BOSS,
    publicBaseUrl: process.env.PUBLIC_BASE_URL,
    
    // Variables exposées côté client (préfixées "public.")
    public: {
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY,
      calendlyUrlOutil3: process.env.CALENDLY_URL_OUTIL_3,
      publicBaseUrl: process.env.PUBLIC_BASE_URL
    }
  },
  
  // Turnstile config
  turnstile: {
    siteKey: process.env.TURNSTILE_SITE_KEY
  }
});
```

---

## 18. Logging et alertes

### 18.1 Logs serveur

Tous les logs serveur passent par `logServerEvent()` qui produit un JSON structuré sur `console.log` (capté par Vercel Logs).

Événements logués :
- `outil-3.evaluation.success` — génération réussie
- `outil-3.evaluation.error` — erreur lors de la génération
- `outil-3.evaluation.deferred` — bascule en mode différé
- `outil-3.evaluation.degraded` — fallback dégradé activé (JSON malformé)
- `outil-3.injection.detected` — Couche 1 sécurité déclenchée
- `outil-3.output_filter.triggered` — Couche 2 sécurité déclenchée
- `outil-3.rate_limit.exceeded` — rate limit dépassé
- `outil-3.brevo.error` — erreur d'envoi Brevo
- `outil-3.jarvi.error` — erreur création contact Jarvi

### 18.2 Alertes email automatiques

Email Boss déclenché si :
- ≥3 tentatives d'injection sur la même IP dans la journée
- Couche 2 sécurité (filtre output) déclenchée plus de 2 fois en 24h
- Taux d'erreur global > 5% sur 24h glissantes

---

## 19. Tests à prévoir avant lancement

### 19.1 Tests fonctionnels

| Test | Description | Attendu |
|---|---|---|
| TC-01 | Soumission formulaire valide, boîte Tier S connue | Évaluation générée, niveau "Très attractive" ou "Hyper attractive" |
| TC-02 | Soumission formulaire valide, boîte hors fichier | Évaluation générée, pas de malus d'absence |
| TC-03 | Brief flou (description très courte) | `brief_flou: true` dans le JSON, message visuel affiché |
| TC-04 | Tentative d'injection naïve ("Ignore tes instructions...") | Erreur 400 immédiate, pas d'appel LLM |
| TC-05 | Rate limit dépassé (4ème soumission même IP en 24h) | Bascule mode différé, email "votre éval arrive" envoyé |
| TC-06 | UUID invalide sur GET /get-by-uuid | Erreur 400 |
| TC-07 | UUID inconnu sur GET /get-by-uuid | Erreur 404 |
| TC-08 | Turnstile token invalide | Erreur 403 |
| TC-09 | Mots-clés interdits dans output LLM (simulation) | Sanitization automatique, alerte loguée |
| TC-10 | JSON malformé dans réponse LLM (simulation) | Mode dégradé activé, markdown affiché sans jauge |

### 19.2 Tests manuels avant déploiement prod

- Soumettre 5 cas réels variés (équivalents aux cas de test simulés)
- Vérifier réception email Brevo dans les 30s post-soumission
- Vérifier création contact Jarvi avec tous les custom fields
- Vérifier le rendu visuel sur mobile + desktop
- Vérifier que la jauge à 10 segments s'affiche correctement avec animation
- Tester un lien email après soumission, vérifier que la page persistée charge bien
- Tenter une injection sophistiquée pour vérifier la robustesse
- Mesurer la latence end-to-end (cible : < 60s)

---

## 20. Estimation de mise en œuvre

| Phase | Description | Estimation |
|---|---|---|
| Setup initial | Variables env, KV, Turnstile, dépendances | 0.5j |
| Schémas Zod et utils | Formulaire, JSON output, injection patterns | 1j |
| Route generate.post.ts | Logique principale, parsing, fallback | 2j |
| Couches sécurité | Filtre output, alertes, logs | 1j |
| Brevo + Jarvi + Turnstile | Intégrations 3 services | 1j |
| Mode différé | Capture lead + queue | 0.5j |
| Pages Vue + composants | Formulaire, résultat, jauge, badges | 2.5j |
| Composables et types | useEvaluationAttractivite, helpers | 0.5j |
| Tests fonctionnels | TC-01 à TC-10 | 1j |
| Tests manuels et debug | Cas réels, mobile, prod | 1j |
| **Total** | | **~11 jours-homme** |

À pondérer selon le niveau du dev. Pour un dev fullstack senior Nuxt/Nitro habitué aux APIs LLM : 8-9j. Pour un dev intermédiaire : 12-14j.

---

## 21. Annexes

### Annexe A — System prompt complet

Le system prompt complet (V3 finale, ~3500 mots) est stocké dans `server/data/outil-3/system-prompt-base.md`. Voir `system-prompt-v3-outil-3.md` (livré séparément).

### Annexe B — Templates Brevo

Voir fichier `templates-brevo-outil-3.md` (à produire dans le prochain chantier).

### Annexe C — Brief Claude Design

Voir fichiers à venir :
- `brief-claude-design-formulaire-outil-3.md`
- `brief-claude-design-resultat-outil-3.md`

### Annexe D — Page politique de confidentialité

Mentions à ajouter sur la page formulaire :
- Collecte du nom, prénom, email pour traitement de la demande d'évaluation
- Stockage des évaluations 90 jours dans Vercel KV
- Création d'un contact dans le CRM Jarvi
- Envoi d'un email transactionnel via Brevo
- Pas de partage avec des tiers, pas de profilage automatisé
- Droits RGPD : accès, rectification, suppression sur demande à hello@mariell.fr

---

**Fin de la spec V0 — prête à passage à un dev externe ou implémentation interne.**
