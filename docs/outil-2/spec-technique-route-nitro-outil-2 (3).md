# Spec technique — Route Nitro Plan de sourcing LinkedIn (Outil 2)

**Projet** : Le Lab Mariell — Outil n°2 (Plan de sourcing LinkedIn personnalisé)
**Stack** : Nuxt 3 (Vue 3 + Nitro) + Vercel Pro + Anthropic API + Brevo + Jarvi + Vercel KV + Cloudflare Turnstile
**Version spec** : 1.5 (alignement formulaire v4 + system prompt V10 — règles cohérence intitulés/booléenne)
**Date** : 02/05/2026

---

## 1. Vue d'ensemble

Cette spec décrit le backend de l'outil "Plan de sourcing LinkedIn". L'outil est composé de :
- **2 routes serveur Nitro** : génération + persistance
- **3 pages Vue** : formulaire + résultat streamé + résultat persisté
- **1 composable Vue** : interface streaming
- **5 intégrations externes** : Anthropic, Brevo, Jarvi, Vercel KV, Cloudflare Turnstile

### Flow utilisateur

```
1. Le prospect arrive sur /lab/plan-de-sourcing
2. Il remplit le formulaire (15 champs, dont case RGPD)
3. Il soumet → Cloudflare Turnstile valide qu'il n'est pas un bot
4. Validation Zod côté serveur (incl. consentement RGPD + cohérence OTE >= Fixe)
5. Vérification rate limit
6. SI rate limit dépassé → mode "traitement différé" (capture lead, pas de LLM)
7. SI rate limit OK → redirection vers /resultat?session=xxx
8. La page résultat affiche l'animation de chargement
9. En arrière-plan : streaming Anthropic (~30 secondes)
10. Une fois terminé → sauvegarde KV + envoi emails + création Jarvi
11. Affichage du plan généré sur la page
12. Plus tard, le prospect peut revenir sur /resultat/[uuid] (lien email)
```

---

## 2. Architecture des fichiers

```
/server/api/lab/plan-de-sourcing/
  ├── generate.post.ts      # Route principale (génération + side effects)
  └── [uuid].get.ts         # Route récupération plan persisté

/server/utils/
  ├── anthropic.ts          # Client Anthropic configuré
  ├── brevo.ts              # Client Brevo + helpers
  ├── jarvi.ts              # Client Jarvi + helpers
  ├── ratelimit.ts          # Logique rate limit Vercel KV
  ├── turnstile.ts          # Vérification Cloudflare Turnstile
  └── prompts/
      └── plan-de-sourcing.ts  # SYSTEM_PROMPT + USER_PROMPT_TEMPLATE

/server/schemas/
  └── plan-de-sourcing.ts   # Schéma Zod du formulaire

/pages/lab/plan-de-sourcing/
  ├── index.vue             # Formulaire
  ├── resultat.vue          # Page résultat streamé (?session=xxx)
  └── resultat/[uuid].vue   # Page résultat persisté

/composables/
  └── usePlanSourcing.ts    # Logique côté client (Vercel AI SDK wrapper)
```

---

## 3. Variables d'environnement requises

À configurer dans `.env.local` (dev) et Vercel Project Settings (prod) :

```bash
# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Brevo
BREVO_API_KEY=xkeysib-...
BREVO_TEMPLATE_ID_NOTIF_INTERNE=1
BREVO_TEMPLATE_ID_LIVRAISON_PROSPECT=2
BREVO_TEMPLATE_ID_DEFERRED_INTERNE=3
BREVO_TEMPLATE_ID_DEFERRED_PROSPECT=4
BREVO_SENDER_EMAIL=bonjour@mariell.fr
BREVO_NOTIF_RECIPIENT=[email-gerant]@mariell.fr
BREVO_ALERT_RECIPIENT=[email-gerant]@mariell.fr

# Jarvi
JARVI_API_KEY=...
JARVI_API_BASE_URL=https://api.jarvi.tech/v1

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=0x...
NUXT_PUBLIC_TURNSTILE_SITE_KEY=0x...

# Vercel KV (auto-injecté par Vercel quand intégration KV activée)
KV_REST_API_URL=...
KV_REST_API_TOKEN=...

# Calendly
NUXT_PUBLIC_CALENDLY_URL=https://calendly.com/mariell/decouverte

# URL publique (pour générer les liens persistés dans les emails)
NUXT_PUBLIC_SITE_URL=https://mariell.fr
```

---

## 4. Schéma Zod du formulaire

Fichier : `/server/schemas/plan-de-sourcing.ts`

```typescript
import { z } from 'zod';

export const planDeSourcingSchema = z.object({
  // Bloc 01 — Identité
  prenom: z.string().min(2).max(40),
  nom: z.string().min(2).max(40),
  email: z.string().email(),
  telephone: z.string().min(8).max(20),
  entreprise: z.string().min(2).max(100),

  // Bloc 02 — Le poste (17 options dans l'ordre d'affichage)
  posteRecherche: z.enum([
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
  ]),
  posteRecherchePrecisionAutre: z.string().max(60).optional(),
  seniorite: z.enum(['Junior', 'Confirmé', 'Senior', 'Lead-Manager']),
  objectifPoste: z.enum([
    'Gestion portefeuille clients',
    'Développement et chasse',
    'Ouverture de nouvelle verticale',
    'Création et management d\'équipe'
  ]),
  localisation: z.string().min(2).max(100),
  remotePossible: z.boolean(),

  // Bloc 03 — Le contexte
  secteur: z.enum([
    'SaaS B2B',
    'Conseil IT / ESN',
    'Industrie / B2B classique',
    'Cyber / Sécurité',
    'Fintech',
    'Healthtech',
    'Services',
    'Autre'
  ]),
  secteurPrecisionAutre: z.string().max(60).optional(),
  fixe: z.number().int().min(15000).max(500000),
  ote: z.number().int().min(0).max(800000),

  // Bloc 04 — Pour aller plus loin (optionnels)
  siteEntreprise: z.string().url().optional(),
  contenuFichePoste: z.string().max(5000).optional(),

  // Bloc RGPD
  consentementRgpd: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter la politique de confidentialité.' })
  }),

  // Cloudflare Turnstile
  turnstileToken: z.string().min(1)
}).refine(
  data => data.ote >= data.fixe,
  {
    message: "L'OTE doit être supérieur ou égal au fixe.",
    path: ['ote']
  }
);

export type PlanDeSourcingInput = z.infer<typeof planDeSourcingSchema>;
```

---

## 5. Route principale — `POST /api/lab/plan-de-sourcing/generate`

Fichier : `/server/api/lab/plan-de-sourcing/generate.post.ts`

### Comportement

#### Phase 1 — Validations bloquantes (ordre strict)

1. **Validation Zod** du body — si échec → 400 Bad Request (incl. case RGPD non cochée + cohérence OTE >= Fixe)
2. **Vérification Cloudflare Turnstile** côté serveur (call à `https://challenges.cloudflare.com/turnstile/v0/siteverify`) — si échec → 403 Forbidden
3. **Vérification rate limit** :
   - Compteur IP (clé `ratelimit:ip:{ip}`) : max 3/jour, 7/semaine
   - Compteur domaine email (clé `ratelimit:email:{domain}`) : max 5/mois
   - Si dépassement → bascule en **mode "traitement différé"** (voir section 8)

#### Phase 2 — Préparation et génération

4. **Génération nanoid** pour l'identifiant du plan persisté (10 caractères)
5. **Construction du user prompt** avec interpolation des variables (voir section 6)
6. **Appel streaming Anthropic** via Vercel AI SDK
7. **Buffer du contenu généré** côté serveur (on ne stream pas vers le client en temps réel)
8. **Wait until LLM completion** — le serveur attend que le streaming Anthropic soit terminé avant de répondre

#### Phase 3 — Side effects (séquence Option C)

9. **BLOQUANT — Sauvegarde Vercel KV** :
   ```
   plan:{uuid} → {
     content: "<markdown généré>",
     metadata: { prenom, nom, entreprise, posteRecherche, createdAt: ISO },
     formData: <inputs originaux du formulaire, incl. consentementRgpd: true>
   }
   TTL : 90 jours (90 * 24 * 3600 = 7776000 secondes)
   ```
   Si la sauvegarde KV échoue → 500 Internal Error + alerte email gérant
10. **PARALLÈLE — En `Promise.all`** (les 3 en même temps) :
    - **Brevo** : envoi email notification interne (Template 1) au gérant Mariell
    - **Brevo** : envoi email livraison prospect (Template 2)
    - **Jarvi** : création/mise à jour contact avec tag "Lab — Plan de sourcing"
11. **Logging** des erreurs partielles (Jarvi failed, Brevo notif failed, etc.) sans bloquer la réponse

#### Phase 4 — Réponse

12. **Retour HTTP 200** avec :
    ```json
    {
      "success": true,
      "uuid": "v9a3bx8",
      "plan": "<markdown complet du plan>",
      "redirectUrl": "/lab/plan-de-sourcing/resultat/v9a3bx8"
    }
    ```

### Structure du code (pseudocode TypeScript)

```typescript
export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  
  try {
    // === PHASE 1 — Validations bloquantes ===
    
    const body = await readBody(event);
    const validated = planDeSourcingSchema.parse(body);
    
    // Cloudflare Turnstile
    const turnstileOk = await verifyTurnstile(validated.turnstileToken, getClientIp(event));
    if (!turnstileOk) {
      throw createError({ statusCode: 403, message: 'Anti-bot verification failed' });
    }
    
    // Rate limit
    const ip = getClientIp(event);
    const emailDomain = validated.email.split('@')[1];
    const rateCheck = await checkRateLimit(ip, emailDomain);
    
    if (!rateCheck.allowed) {
      // === BASCULE TRAITEMENT DIFFÉRÉ ===
      await handleDeferredProcessing(validated, 'rate_limit');
      return {
        success: true,
        deferred: true,
        message: 'Votre demande sera traitée manuellement sous 24h.'
      };
    }
    
    // === PHASE 2 — Génération ===
    
    const uuid = nanoid(10);
    const userPrompt = buildUserPrompt(validated);
    
    let generatedContent: string;
    try {
      generatedContent = await generatePlanWithAnthropic(userPrompt);
    } catch (error) {
      console.warn('[plan-de-sourcing] First Anthropic call failed, retrying...', error);
      try {
        generatedContent = await generatePlanWithAnthropic(userPrompt);
      } catch (retryError) {
        await handleDeferredProcessing(validated, 'api_failure');
        await sendCriticalAlert('Anthropic API failed twice', retryError);
        return {
          success: true,
          deferred: true,
          message: 'Votre demande sera traitée manuellement sous 24h.'
        };
      }
    }
    
    // === PHASE 3 — Side effects ===
    
    try {
      await saveToKV(uuid, generatedContent, validated);
    } catch (kvError) {
      await sendCriticalAlert('KV save failed', kvError);
      throw createError({ 
        statusCode: 500, 
        message: 'Erreur de sauvegarde. Veuillez réessayer.' 
      });
    }
    
    await incrementRateLimit(ip, emailDomain);
    
    const sideEffects = await Promise.allSettled([
      sendBrevoNotifInterne(validated, uuid),
      sendBrevoLivraisonProspect(validated, uuid),
      createJarviContact(validated, uuid)
    ]);
    
    sideEffects.forEach((result, idx) => {
      if (result.status === 'rejected') {
        const taskNames = ['Brevo notif', 'Brevo livraison', 'Jarvi'];
        console.error(`[plan-de-sourcing] Side effect failed: ${taskNames[idx]}`, result.reason);
        sendCriticalAlert(`${taskNames[idx]} failed for plan ${uuid}`, result.reason);
      }
    });
    
    const duration = Date.now() - startTime;
    console.log(`[plan-de-sourcing] Plan generated successfully in ${duration}ms — uuid: ${uuid}`);
    
    return {
      success: true,
      uuid,
      plan: generatedContent,
      redirectUrl: `/lab/plan-de-sourcing/resultat/${uuid}`
    };
    
  } catch (error: any) {
    console.error('[plan-de-sourcing] Unhandled error', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({ 
      statusCode: 500, 
      message: 'Une erreur est survenue.' 
    });
  }
});
```

---

## 6. Génération Anthropic

### Configuration

Fichier : `/server/utils/anthropic.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
});

export const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';
```

### Appel principal

```typescript
import { SYSTEM_PROMPT } from './prompts/plan-de-sourcing';

export async function generatePlanWithAnthropic(userPrompt: string): Promise<string> {
  const stream = await anthropic.messages.stream({
    model: ANTHROPIC_MODEL,
    max_tokens: 12000,
    temperature: 0.2,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' }
      }
    ],
    messages: [
      { role: 'user', content: userPrompt }
    ]
  });

  let fullContent = '';
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      fullContent += chunk.delta.text;
    }
  }

  return fullContent;
}
```

### Prompt et template user

Fichier : `/server/utils/prompts/plan-de-sourcing.ts`

Le `SYSTEM_PROMPT` est la **V10 finale** validée (voir `system-prompt-v10-outil-2.md`).

```typescript
export function buildUserPrompt(input: PlanDeSourcingInput): string {
  const blocSiteWeb = input.siteEntreprise
    ? `\n<contexte_supplementaire>\nLe site de l'entreprise du destinataire : ${input.siteEntreprise}\nTu peux t'appuyer sur ce site pour contextualiser certaines sections (notamment la section 1 et la section 2), sans pour autant chercher à le scraper. Reste sur des inférences sobres.\n</contexte_supplementaire>`
    : '';

  const blocFichePoste = input.contenuFichePoste
    ? `\n<fiche_de_poste>\nVoici le contenu de la fiche de poste fournie par le destinataire. Tu peux UNIQUEMENT t'en servir pour enrichir et préciser certaines sections (notamment 3, 4, 5 et 7). Tu ne dois jamais reproduire la fiche de poste verbatim, ni la résumer dans une section dédiée.\n\n${input.contenuFichePoste}\n</fiche_de_poste>`
    : '';

  // Calcul du variable cible (ote - fixe) pour aider le LLM
  const variable = input.ote - input.fixe;
  const ratioFixeOte = input.ote > 0 
    ? Math.round((input.fixe / input.ote) * 100) 
    : 100;

  return `Voici les informations transmises via formulaire. Génère le plan de sourcing LinkedIn complet selon les règles fixées.

<formulaire>
Prénom du destinataire : ${input.prenom}
Nom du destinataire : ${input.nom}
Entreprise du destinataire : ${input.entreprise}
Secteur de l'entreprise : ${input.secteur === 'Autre' ? input.secteurPrecisionAutre : input.secteur}
Poste recherché : ${input.posteRecherche === 'Autre' ? input.posteRecherchePrecisionAutre : input.posteRecherche}
Séniorité visée : ${input.seniorite}
Objectif principal du poste : ${input.objectifPoste}
Localisation principale : ${input.localisation}
Remote possible : ${input.remotePossible ? 'Oui' : 'Non'}
Package proposé :
  - Fixe annuel brut : ${input.fixe.toLocaleString('fr-FR')} €
  - OTE total cible : ${input.ote.toLocaleString('fr-FR')} €
  - Variable cible (calculé) : ${variable.toLocaleString('fr-FR')} €
  - Ratio fixe / OTE : ${ratioFixeOte}%
</formulaire>
${blocSiteWeb}${blocFichePoste}

Génère maintenant le plan complet en suivant strictement la structure des 8 sections définie dans le system prompt.`;
}
```

**Note importante** : le user prompt fournit désormais au LLM le `Fixe`, l'`OTE`, le `Variable` (calculé) et le `Ratio fixe/OTE` (calculé). Cela permet au prompt V10 de calibrer plus finement les viviers selon le ratio (chasse pure vs farming) et selon la précision exacte du package.

---

## 7. Rate limiting

Fichier : `/server/utils/ratelimit.ts`

```typescript
import { kv } from '@vercel/kv';

const LIMITS = {
  IP_DAILY: 3,
  IP_WEEKLY: 7,
  EMAIL_DOMAIN_MONTHLY: 5
};

export async function checkRateLimit(ip: string, emailDomain: string) {
  const ipDailyKey = `ratelimit:ip:${ip}:daily`;
  const ipWeeklyKey = `ratelimit:ip:${ip}:weekly`;
  const domainKey = `ratelimit:email:${emailDomain}`;

  const [ipDaily, ipWeekly, domainCount] = await Promise.all([
    kv.get<number>(ipDailyKey) ?? 0,
    kv.get<number>(ipWeeklyKey) ?? 0,
    kv.get<number>(domainKey) ?? 0
  ]);

  if (ipDaily >= LIMITS.IP_DAILY) {
    return { allowed: false, reason: 'ip_daily' };
  }
  if (ipWeekly >= LIMITS.IP_WEEKLY) {
    return { allowed: false, reason: 'ip_weekly' };
  }
  if (domainCount >= LIMITS.EMAIL_DOMAIN_MONTHLY) {
    return { allowed: false, reason: 'domain_monthly' };
  }

  return { allowed: true };
}

export async function incrementRateLimit(ip: string, emailDomain: string) {
  const ipDailyKey = `ratelimit:ip:${ip}:daily`;
  const ipWeeklyKey = `ratelimit:ip:${ip}:weekly`;
  const domainKey = `ratelimit:email:${emailDomain}`;

  await Promise.all([
    kv.set(ipDailyKey, (await kv.get<number>(ipDailyKey) ?? 0) + 1, { ex: 24 * 3600 }),
    kv.set(ipWeeklyKey, (await kv.get<number>(ipWeeklyKey) ?? 0) + 1, { ex: 7 * 24 * 3600 }),
    kv.set(domainKey, (await kv.get<number>(domainKey) ?? 0) + 1, { ex: 30 * 24 * 3600 })
  ]);
}
```

---

## 8. Mode "Traitement différé"

Quand on bascule en mode différé :

1. **NE PAS** appeler Anthropic (économie de coût)
2. **Sauvegarder les inputs en KV** avec une clé spéciale : `deferred:{nanoid(10)}` (TTL 7 jours)
3. **Créer le contact Jarvi** avec tag spécial "Lab — Manuel - Rate limit"
4. **Envoyer email notification interne** au gérant (Template 3)
5. **Envoyer email confirmation au prospect** (Template 4)
6. **Retourner au client** : "Votre demande sera traitée manuellement sous 24h."

```typescript
async function handleDeferredProcessing(
  input: PlanDeSourcingInput,
  raison: 'rate_limit' | 'api_failure'
) {
  const deferredId = nanoid(10);
  
  const raisonDiffereLibelle = raison === 'rate_limit'
    ? 'Rate limit atteint (IP ou domaine email)'
    : 'API Anthropic indisponible (2 tentatives échouées)';
  
  await kv.set(`deferred:${deferredId}`, {
    formData: input,
    createdAt: new Date().toISOString(),
    reason: raison
  }, { ex: 7 * 24 * 3600 });
  
  await Promise.allSettled([
    createJarviContact(input, deferredId, 'Lab — Manuel - Rate limit'),
    sendBrevoDeferredInterne(input, deferredId, raisonDiffereLibelle),
    sendBrevoDeferredProspect(input)
  ]);
}
```

---

## 9. Brevo

Fichier : `/server/utils/brevo.ts`

### Helper formatPackage

```typescript
function formatPackage(fixe: number, ote: number): {
  fixe: string;
  ote: string;
  variable: string;
  ratio: string;
} {
  const variable = ote - fixe;
  const ratio = ote > 0 ? Math.round((fixe / ote) * 100) : 100;
  
  return {
    fixe: `${fixe.toLocaleString('fr-FR')} €`,
    ote: `${ote.toLocaleString('fr-FR')} €`,
    variable: `${variable.toLocaleString('fr-FR')} €`,
    ratio: `${ratio}% fixe / ${100 - ratio}% variable`
  };
}
```

### Helper d'envoi générique

```typescript
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

async function sendBrevoEmail(params: {
  templateId: number;
  to: { email: string; name?: string }[];
  params: Record<string, any>;
  sender?: { email: string; name?: string };
}) {
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sender: params.sender ?? {
        email: process.env.BREVO_SENDER_EMAIL!,
        name: 'Mariell'
      },
      to: params.to,
      templateId: params.templateId,
      params: params.params
    })
  });

  if (!response.ok) {
    throw new Error(`Brevo API error: ${response.status} — ${await response.text()}`);
  }

  return response.json();
}
```

### Templates 1 + 2 (cas nominal)

```typescript
export async function sendBrevoNotifInterne(input: PlanDeSourcingInput, uuid: string) {
  const planUrl = `${process.env.NUXT_PUBLIC_SITE_URL}/lab/plan-de-sourcing/resultat/${uuid}`;
  const pkg = formatPackage(input.fixe, input.ote);
  
  return sendBrevoEmail({
    templateId: parseInt(process.env.BREVO_TEMPLATE_ID_NOTIF_INTERNE!),
    to: [{ email: process.env.BREVO_NOTIF_RECIPIENT! }],
    params: {
      DATE_SOUMISSION: formatDateFr(new Date()),
      PRENOM: input.prenom,
      NOM: input.nom,
      EMAIL: input.email,
      TELEPHONE: input.telephone,
      ENTREPRISE: input.entreprise,
      POSTE_RECHERCHE: input.posteRecherche === 'Autre' ? input.posteRecherchePrecisionAutre : input.posteRecherche,
      SENIORITE: input.seniorite,
      OBJECTIF_POSTE: input.objectifPoste,
      LOCALISATION: input.localisation,
      REMOTE_POSSIBLE: input.remotePossible ? 'Oui' : 'Non',
      SECTEUR: input.secteur === 'Autre' ? input.secteurPrecisionAutre : input.secteur,
      PACKAGE_FIXE: pkg.fixe,
      PACKAGE_OTE: pkg.ote,
      PACKAGE_VARIABLE: pkg.variable,
      PACKAGE_RATIO: pkg.ratio,
      SITE_ENTREPRISE: input.siteEntreprise || 'Non fourni',
      FICHE_POSTE_FOURNIE: input.contenuFichePoste 
        ? `Oui — extrait : "${input.contenuFichePoste.slice(0, 200)}..."` 
        : 'Non fournie',
      URL_PLAN: planUrl,
      URL_JARVI: ''
    }
  });
}

export async function sendBrevoLivraisonProspect(input: PlanDeSourcingInput, uuid: string) {
  const planUrl = `${process.env.NUXT_PUBLIC_SITE_URL}/lab/plan-de-sourcing/resultat/${uuid}`;
  
  return sendBrevoEmail({
    templateId: parseInt(process.env.BREVO_TEMPLATE_ID_LIVRAISON_PROSPECT!),
    to: [{ email: input.email, name: `${input.prenom} ${input.nom}` }],
    params: {
      PRENOM: input.prenom,
      POSTE_RECHERCHE: input.posteRecherche === 'Autre' ? input.posteRecherchePrecisionAutre : input.posteRecherche,
      ENTREPRISE: input.entreprise,
      URL_PLAN: planUrl,
      URL_CALENDLY: process.env.NUXT_PUBLIC_CALENDLY_URL!
    }
  });
}
```

### Templates 3 + 4 (mode différé)

```typescript
export async function sendBrevoDeferredInterne(
  input: PlanDeSourcingInput, 
  deferredId: string,
  raisonDiffere: string
) {
  const pkg = formatPackage(input.fixe, input.ote);
  
  return sendBrevoEmail({
    templateId: parseInt(process.env.BREVO_TEMPLATE_ID_DEFERRED_INTERNE!),
    to: [{ email: process.env.BREVO_NOTIF_RECIPIENT! }],
    params: {
      RAISON_DIFFERE: raisonDiffere,
      DEFERRED_ID: deferredId,
      DATE_SOUMISSION: formatDateFr(new Date()),
      PRENOM: input.prenom,
      NOM: input.nom,
      EMAIL: input.email,
      TELEPHONE: input.telephone,
      ENTREPRISE: input.entreprise,
      POSTE_RECHERCHE: input.posteRecherche === 'Autre' ? input.posteRecherchePrecisionAutre : input.posteRecherche,
      SENIORITE: input.seniorite,
      OBJECTIF_POSTE: input.objectifPoste,
      LOCALISATION: input.localisation,
      REMOTE_POSSIBLE: input.remotePossible ? 'Oui' : 'Non',
      SECTEUR: input.secteur === 'Autre' ? input.secteurPrecisionAutre : input.secteur,
      PACKAGE_FIXE: pkg.fixe,
      PACKAGE_OTE: pkg.ote,
      PACKAGE_VARIABLE: pkg.variable,
      PACKAGE_RATIO: pkg.ratio,
      SITE_ENTREPRISE: input.siteEntreprise || 'Non fourni',
      FICHE_POSTE_FOURNIE: input.contenuFichePoste 
        ? `Oui — extrait : "${input.contenuFichePoste.slice(0, 200)}..."` 
        : 'Non fournie',
      URL_JARVI: ''
    }
  });
}

export async function sendBrevoDeferredProspect(input: PlanDeSourcingInput) {
  return sendBrevoEmail({
    templateId: parseInt(process.env.BREVO_TEMPLATE_ID_DEFERRED_PROSPECT!),
    to: [{ email: input.email, name: `${input.prenom} ${input.nom}` }],
    params: {
      PRENOM: input.prenom,
      POSTE_RECHERCHE: input.posteRecherche === 'Autre' ? input.posteRecherchePrecisionAutre : input.posteRecherche,
      URL_CALENDLY: process.env.NUXT_PUBLIC_CALENDLY_URL!
    }
  });
}

export async function sendCriticalAlert(subject: string, error: any) {
  const payload = {
    sender: { email: process.env.BREVO_SENDER_EMAIL!, name: 'Mariell Alerts' },
    to: [{ email: process.env.BREVO_ALERT_RECIPIENT! }],
    subject: `[ALERTE Lab] ${subject}`,
    htmlContent: `
      <h2>Alerte critique — Le Lab Mariell</h2>
      <p><strong>Sujet :</strong> ${subject}</p>
      <p><strong>Date :</strong> ${new Date().toISOString()}</p>
      <h3>Détail de l'erreur :</h3>
      <pre>${JSON.stringify(error, null, 2)}</pre>
    `
  };
  
  return fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}
```

---

## 10. Jarvi

Fichier : `/server/utils/jarvi.ts`

```typescript
export async function createJarviContact(
  input: PlanDeSourcingInput, 
  uuid: string,
  customTag?: string
) {
  const tag = customTag ?? 'Lab — Plan de sourcing';
  
  const payload = {
    firstName: input.prenom,
    lastName: input.nom,
    email: input.email,
    phone: input.telephone,
    company: input.entreprise,
    tags: [tag],
    customFields: {
      poste_recherche: input.posteRecherche,
      seniorite: input.seniorite,
      objectif_poste: input.objectifPoste,
      package_fixe: input.fixe,
      package_ote: input.ote,
      package_variable: input.ote - input.fixe,
      secteur: input.secteur,
      localisation: input.localisation,
      remote_possible: input.remotePossible,
      plan_uuid: uuid,
      consentement_rgpd: input.consentementRgpd,
      consentement_date: new Date().toISOString(),
      source: 'Le Lab Mariell — Plan de sourcing'
    }
  };
  
  const response = await fetch(`${process.env.JARVI_API_BASE_URL}/contacts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.JARVI_API_KEY!}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`Jarvi API error: ${response.status} — ${await response.text()}`);
  }
  
  return response.json();
}
```

**Note** : Jarvi accepte désormais `firstName` et `lastName` directement (séparation Prénom/Nom). Les champs custom incluent les valeurs précises du package (fixe / OTE / variable calculé) au lieu d'une fourchette générique.

---

## 11. Cloudflare Turnstile

Fichier : `/server/utils/turnstile.ts`

```typescript
export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const formData = new FormData();
  formData.append('secret', process.env.TURNSTILE_SECRET_KEY!);
  formData.append('response', token);
  formData.append('remoteip', ip);
  
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body: formData }
  );
  
  const result = await response.json();
  return result.success === true;
}
```

---

## 12. Route récupération plan persisté

Fichier : `/server/api/lab/plan-de-sourcing/[uuid].get.ts`

```typescript
export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, 'uuid');
  
  if (!uuid || !/^[a-zA-Z0-9_-]{10}$/.test(uuid)) {
    throw createError({ statusCode: 400, message: 'Invalid UUID format' });
  }
  
  const planData = await kv.get<{
    content: string;
    metadata: any;
    formData: any;
  }>(`plan:${uuid}`);
  
  if (!planData) {
    throw createError({ statusCode: 404, message: 'Plan not found or expired' });
  }
  
  return {
    content: planData.content,
    metadata: {
      prenom: planData.metadata.prenom,
      nom: planData.metadata.nom,
      entreprise: planData.metadata.entreprise,
      posteRecherche: planData.metadata.posteRecherche,
      createdAt: planData.metadata.createdAt
    }
  };
});
```

---

## 13. Composable Vue côté client

Fichier : `/composables/usePlanSourcing.ts`

```typescript
export function usePlanSourcing() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isDeferred = ref(false);
  const generatedPlan = ref<string | null>(null);
  const planUuid = ref<string | null>(null);
  
  async function generate(formData: PlanDeSourcingInput, retry = false) {
    isLoading.value = true;
    error.value = null;
    isDeferred.value = false;
    
    try {
      const result = await $fetch('/api/lab/plan-de-sourcing/generate', {
        method: 'POST',
        body: formData
      });
      
      if (result.deferred) {
        isDeferred.value = true;
        return { deferred: true };
      }
      
      generatedPlan.value = result.plan;
      planUuid.value = result.uuid;
      return { success: true, uuid: result.uuid, plan: result.plan };
      
    } catch (err: any) {
      if (!retry) {
        console.warn('First attempt failed, retrying...', err);
        return generate(formData, true);
      }
      
      error.value = err.statusMessage || err.message || 'Une erreur est survenue.';
      isDeferred.value = true;
      return { error: error.value };
      
    } finally {
      isLoading.value = false;
    }
  }
  
  return {
    isLoading,
    error,
    isDeferred,
    generatedPlan,
    planUuid,
    generate
  };
}
```

---

## 14. Pages Vue

### `/pages/lab/plan-de-sourcing/index.vue` — Formulaire

- Utilise le design HTML produit par Claude Design (brief incrémental v4)
- Validation côté client (équivalent du schéma Zod, incl. case RGPD obligatoire + cohérence OTE >= Fixe)
- Cloudflare Turnstile widget (rendu côté client)
- Bouton submit appelle `usePlanSourcing().generate()`
- Sur success → redirection vers `/lab/plan-de-sourcing/resultat?session={uuid}`
- Sur deferred → affichage du message premium

### `/pages/lab/plan-de-sourcing/resultat.vue` — Page streamée

- URL : `/lab/plan-de-sourcing/resultat?session={uuid}`
- Au mount : récupère le plan depuis l'API si pas déjà en mémoire
- Affiche l'animation de chargement pendant la requête
- Une fois reçu : transition douce vers l'affichage du plan
- Header sticky + boutons (Imprimer, Copier le lien, CTA Calendly)

### `/pages/lab/plan-de-sourcing/resultat/[uuid].vue` — Page persistée

- URL : `/lab/plan-de-sourcing/resultat/{uuid}`
- Au mount : `await $fetch('/api/lab/plan-de-sourcing/{uuid}')` pour récupérer le plan
- Si 404 → page d'erreur "Plan introuvable ou expiré (durée de vie : 90 jours)"
- Si OK → affichage immédiat (pas d'animation chargement)
- Header sticky + boutons identiques à la page streamée

---

## 15. Rendu du Markdown en HTML côté Vue

```typescript
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
});

const renderedHtml = md.render(generatedPlan.value);
```

---

## 16. Dépendances npm à installer

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

## 17. Configuration Nuxt

Dans `nuxt.config.ts` :

```typescript
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel'
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

⚠️ **Sur le preset Nitro** : `vercel-edge` a un timeout de 25 secondes (plan Pro), ce qui est **trop court** pour notre cas. Il faut utiliser le preset `vercel` standard (jusqu'à 300 secondes).

---

## 18. Logging et alertes

### Logs serveur

Tous les logs utilisent un préfixe `[plan-de-sourcing]`.

Niveaux :
- `console.log` : succès et durées
- `console.warn` : retries automatiques
- `console.error` : échecs définitifs

### Alertes email automatiques

Déclenchées par `sendCriticalAlert()` dans les cas suivants :
- Anthropic API échec après 2 tentatives
- Sauvegarde KV échec
- Brevo API échec sur l'email livraison prospect
- Jarvi API échec

---

## 19. Tests à prévoir avant lancement

### Tests fonctionnels

1. ✅ Soumission formulaire valide → réception email livraison + plan accessible via UUID
2. ✅ Soumission formulaire invalide → message d'erreur clair
3. ✅ Soumission Cloudflare Turnstile non validé → 403
4. ✅ Soumission après 3 fois la même IP dans la journée → mode différé activé
5. ✅ Soumission depuis un domaine email > 5 dans le mois → mode différé activé
6. ✅ Anthropic API mocké en échec → retry puis bascule différé
7. ✅ Visite d'un UUID inexistant → 404 propre
8. ✅ Visite d'un UUID expiré (TTL passé) → 404 propre
9. ✅ Soumission sans case RGPD cochée → 400 avec message "Vous devez accepter la politique de confidentialité."
10. ✅ Vérification que la trace du consentement est bien sauvegardée dans Jarvi
11. ✅ Test de génération sur les 4 nouveaux postes (Sales Engineer / Inside Sales / Field Sales / Strategic Account Manager)
12. ✅ Test de génération avec poste "Autre" + libellé custom
13. ✅ **Test cohérence OTE >= Fixe : soumission avec OTE < Fixe → 400 avec message "L'OTE doit être supérieur ou égal au fixe."**
14. ✅ **Test bornes Fixe : soumission avec Fixe < 15000 ou > 500000 → 400**
15. ✅ **Test bornes OTE : soumission avec OTE > 800000 → 400**
16. ✅ **Test sans case "Remote possible" cochée → soumission valide (case optionnelle)**

### Tests manuels avant déploiement prod

1. Test de bout en bout sur le domaine de staging
2. Vérification réception email notif interne avec tous les champs (incl. PACKAGE_FIXE, PACKAGE_OTE, PACKAGE_VARIABLE, PACKAGE_RATIO)
3. Vérification réception email livraison prospect avec lien fonctionnel
4. Vérification création contact Jarvi avec firstName + lastName séparés + custom fields package
5. Vérification persistance KV
6. Vérification rate limit
7. Vérification visuelle de la case RGPD : non pré-cochée, lien cliquable, blocage du CTA si non cochée
8. Vérification que la page `/politique-de-confidentialite` est accessible et conforme

---

## 20. Estimation de mise en œuvre

| Phase | Tâches | Effort estimé |
|---|---|---|
| Setup infra | Variables env + KV + Turnstile + Brevo | 0,5 jour |
| Schéma + utils | Zod + Brevo + Jarvi + Anthropic + KV utils | 1 jour |
| Route generate | Route principale avec orchestration complète | 1 jour |
| Route GET uuid | Route persistée | 0,25 jour |
| Composable Vue | usePlanSourcing | 0,5 jour |
| Pages Vue | Intégration des designs Claude Design (3 pages) | 1,5 jour |
| Tests + debugging | Bout-en-bout + edge cases | 1 jour |
| **Total** | | **5,75 jours** |

---

## 21. Annexes

### Annexe A — System prompt complet (V10 finale)

Voir fichier `system-prompt-v10-outil-2.md` dans le même dossier.

### Annexe B — Templates Brevo

Voir fichier `templates-brevo-outil-2.md` dans le même dossier (4 templates).

### Annexe C — Designs HTML/CSS

Voir fichiers `design-formulaire-outil-2.html` et `design-resultat-outil-2.html` (à produire avec Claude Design).

### Annexe D — Page politique de confidentialité

⚠️ **À créer avant le lancement.** L'URL `/politique-de-confidentialite` doit pointer vers une page existante du site Mariell, conforme RGPD.

---

## Changelog v1.3 → v1.4

| # | Changement | Section impactée |
|---|---|---|
| 1 | Schéma Zod : `prenomNom` → `prenom` + `nom` séparés | Section 4 |
| 2 | Schéma Zod : `package` enum fourchettes → `fixe` + `ote` z.number().int() | Section 4 |
| 3 | Schéma Zod : ajout `.refine()` cohérence OTE >= Fixe | Section 4 |
| 4 | Schéma Zod : suppression `internationalPossible` | Section 4 |
| 5 | User prompt LLM : remplacement `Package proposé : {fourchette}` par bloc multi-lignes Fixe/OTE/Variable/Ratio + retrait International | Section 6 |
| 6 | Helper `formatPackage()` ajouté pour formatter le package en chaîne lisible | Section 9 |
| 7 | Brevo : variables PRENOM_NOM → PRENOM + NOM séparées sur tous templates | Section 9 |
| 8 | Brevo : nouvelles variables PACKAGE_FIXE / PACKAGE_OTE / PACKAGE_VARIABLE / PACKAGE_RATIO sur templates 1 et 3 (suppression PACKAGE seul) | Section 9 |
| 9 | Jarvi : firstName + lastName en lecture directe + custom fields package_fixe / package_ote / package_variable | Section 10 |
| 10 | Tests 13-16 ajoutés (cohérence OTE, bornes Fixe et OTE, case Remote optionnelle) | Section 19 |

---

**Fin de la spec.**
