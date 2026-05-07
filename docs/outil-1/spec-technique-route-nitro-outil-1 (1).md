# Spec technique — Route Nitro Demande de stagiaire ou alternant Sales

**Projet** : Le Lab Mariell — Outil n°1 (Demande de candidats stage/alternance)
**Stack** : Nuxt 3 (Vue 3 + Nitro) + Vercel Pro + Brevo + Jarvi + Vercel KV + Cloudflare Turnstile
**Version spec** : 1.0
**Date** : 29/04/2026

---

## 1. Vue d'ensemble

Cette spec décrit le backend de l'outil "Demande de stagiaire ou alternant Sales". L'outil est composé de :
- **1 route serveur Nitro** : soumission du formulaire + side effects
- **2 pages Vue** : formulaire + page de confirmation
- **1 composable Vue** : wrapper d'appel API
- **4 intégrations externes** : Brevo, Jarvi, Vercel KV (rate limit uniquement), Cloudflare Turnstile
- **Pas de LLM** : c'est un formulaire pur, sans génération IA

### Flow utilisateur

````
1. Le prospect arrive sur /lab/demande-stage-alternance
2. Il remplit le formulaire (11 champs requis)
3. Il soumet → Cloudflare Turnstile valide qu'il n'est pas un bot
4. Validation Zod côté serveur
5. Validation email pro (blacklist domaines perso)
6. Vérification rate limit (3/jour, 7/semaine par IP)
   → Si dépassé : blocage simple avec message d'erreur dédié
7. Lookup Jarvi : recherche Company existante par nom + domaine email
8. Vérification anti-doublon : existe-t-il un Project Lab actif pour cette Company ?
   → Si oui : blocage soft avec message dédié
9. Side effects en parallèle :
   - Création/update Company Jarvi
   - Création Project Jarvi (status "Lab — Reçue", custom field "Type de demande Lab" = "Stage/Alternance")
   - Envoi email Brevo notification interne (récap pour le gérant)
   - Envoi email Brevo confirmation prospect
10. Redirection vers /lab/demande-stage-alternance/confirmation
````

### Différences clés avec l'outil 2

| Aspect | Outil 2 (Plan de sourcing) | Outil 1 (Stage/Alternance) |
|---|---|---|
| LLM | ✅ Anthropic streaming | ❌ Aucun |
| Persistance KV | ✅ Plan stocké 90 jours | ❌ Rien à persister |
| Rate limit dépassé | Mode "traitement différé" | Blocage simple |
| Calendly dans email prospect | ✅ CTA Calendly | ❌ Pas de Calendly |
| Anti-doublon | ❌ Aucun | ✅ Check Project Lab actif sur la Company |
| Pages résultat | ✅ 2 pages (streamée + persistée) | ❌ Juste page confirmation |

---

## 2. Architecture des fichiers

````
/server/api/lab/
  └── stage-alternance.post.ts          # Route principale (unique route)

/server/utils/
  ├── brevo.ts                          # ⚠️ Réutilisé de l'outil 2 (mêmes helpers)
  ├── jarvi.ts                          # ⚠️ Réutilisé de l'outil 2 + nouveaux helpers
  ├── ratelimit.ts                      # ⚠️ Réutilisé de l'outil 2
  ├── turnstile.ts                      # ⚠️ Réutilisé de l'outil 2
  └── email-blacklist.ts                # 🆕 Nouveau : blacklist domaines email perso

/server/schemas/
  └── stage-alternance.ts               # 🆕 Schéma Zod du formulaire

/pages/lab/
  ├── demande-stage-alternance.vue           # 🆕 Formulaire
  └── demande-stage-alternance/
      └── confirmation.vue                   # 🆕 Page confirmation

/composables/
  └── useStageAlternance.ts             # 🆕 Logique côté client
````

**Note importante** : pour Brevo, Jarvi, ratelimit et turnstile, on **étend** les utils existants de l'outil 2. On ajoute des fonctions spécifiques à l'outil 1 sans réécrire les bases. Ça évite la duplication et garantit la cohérence.

---

## 3. Variables d'environnement requises

À configurer dans `.env.local` (dev) et Vercel Project Settings (prod). Les variables marquées 🔁 sont **partagées avec l'outil 2** (déjà configurées).

````bash
# === BREVO === (🔁 partagé outil 2)
BREVO_API_KEY=xkeysib-...
BREVO_SENDER_EMAIL=bonjour@mariell.fr
BREVO_NOTIF_RECIPIENT=[email-gerant]@mariell.fr
BREVO_ALERT_RECIPIENT=[email-gerant]@mariell.fr

# === BREVO TEMPLATES OUTIL 1 === (🆕)
BREVO_TEMPLATE_ID_STAGE_NOTIF_INTERNE=3
BREVO_TEMPLATE_ID_STAGE_CONFIRMATION_PROSPECT=4

# === JARVI === (🔁 partagé outil 2)
JARVI_API_KEY=...
JARVI_API_BASE_URL=https://functions.prod.jarvi.tech/v1/public-api/rest/v2

# === JARVI OUTIL 1 === (🆕)
# UUID du custom field "Type de demande Lab" sur les Projects
JARVI_FIELD_ID_TYPE_DEMANDE_LAB=...
# UUID de la valeur "Stage/Alternance" du custom field
JARVI_FIELD_VALUE_STAGE_ALTERNANCE=...
# UUID du status Project "Lab — Reçue" (à créer côté Jarvi en amont)
JARVI_STATUS_ID_LAB_RECUE=...
# UUIDs des status Company qui correspondent à "Client / ancien client" (séparés par virgules)
JARVI_CLIENT_STATUS_IDS=uuid1,uuid2,uuid3
# UUIDs des status Project "Lab — Reçue" et "Lab — En traitement" (pour check doublon)
JARVI_LAB_ACTIVE_STATUS_IDS=uuid_recue,uuid_en_traitement

# === CLOUDFLARE TURNSTILE === (🔁 partagé outil 2)
TURNSTILE_SECRET_KEY=0x...
NUXT_PUBLIC_TURNSTILE_SITE_KEY=0x...

# === VERCEL KV === (🔁 partagé outil 2, auto-injecté)
KV_REST_API_URL=...
KV_REST_API_TOKEN=...

# === URL PUBLIQUE === (🔁 partagé outil 2)
NUXT_PUBLIC_SITE_URL=https://mariell.fr
````

---

## 4. Setup préalable côté Jarvi

Avant de coder, **création manuelle dans l'app Jarvi** des éléments suivants. Récupérer ensuite les UUIDs depuis l'URL des pages de paramètres (format `https://app.jarvi.tech/#/settings/.../<UUID>`).

### 4.1 — Statuts Project (à créer)

| Nom | Usage |
|---|---|
| `Lab — Reçue` | Status par défaut à la création d'une demande Lab |
| `Lab — En traitement` | Toi qui mets ce statut quand tu commences à traiter |
| `Lab — Servi` | Toi qui mets ce statut quand un candidat a été présenté avec succès |
| `Lab — Refusé` | Toi qui mets ce statut quand pas de match disponible |

### 4.2 — Custom field Project (à créer)

- **Nom** : `Type de demande Lab`
- **Type** : `multiplechoice`
- **Valeurs** :
  - `Stage/Alternance`
  - `Plan de sourcing` *(pour outil 2 plus tard)*
  - `Évaluation attractivité` *(pour outil 3 plus tard)*

### 4.3 — Récupération des UUIDs

Une fois créés, récupérer les UUIDs et les mettre dans les variables d'environnement listées en section 3.

---

## 5. Schéma Zod du formulaire

Fichier : `/server/schemas/stage-alternance.ts`

````typescript
import { z } from 'zod';

export const stageAlternanceSchema = z.object({
  // Bloc Contact
  prenom: z.string().min(1).max(50),
  nom: z.string().min(1).max(50),
  email: z.string().email(),
  telephone: z.string().min(8).max(20),

  // Bloc Entreprise
  entreprise: z.string().min(2).max(100),
  urlEntreprise: z.string().url(),

  // Bloc Besoin
  typeContrat: z.enum(['Stage', 'Alternance']),
  profilRecherche: z.enum([
    'SDR / BDR',
    'Business Developer Junior',
    'Account Executive Junior',
    'Sales Ops Junior',
    'Autre'
  ]),
  profilRecherchePrecisionAutre: z.string().max(60).optional(),
  dateDemarrage: z.enum([
    'ASAP',
    'Sous 1 à 2 mois',
    'Sous 3 à 6 mois',
    'Flexible'
  ]),
  localisation: z.string().min(2).max(150),
  briefMission: z.string().min(20).max(500),

  // Conformité
  consentementRgpd: z.literal(true),
  honeypot: z.string().max(0).optional(),  // doit être vide
  turnstileToken: z.string().min(1)
});

export type StageAlternanceInput = z.infer<typeof stageAlternanceSchema>;
````

**Notes** :
- `briefMission` : min 20 caractères pour éviter les soumissions vides type "test"
- `honeypot` : champ caché côté front, doit rester vide (les bots le remplissent)
- `consentementRgpd` : doit être `true` (bloquant si non coché)

---

## 6. Blacklist domaines email perso

Fichier : `/server/utils/email-blacklist.ts`

````typescript
const PERSONAL_EMAIL_DOMAINS = new Set([
  // Internationaux
  'gmail.com', 'googlemail.com',
  'hotmail.com', 'hotmail.fr',
  'outlook.com', 'outlook.fr',
  'yahoo.com', 'yahoo.fr',
  'icloud.com', 'me.com', 'mac.com',
  'live.com', 'live.fr',
  'protonmail.com', 'proton.me',
  'gmx.fr', 'gmx.com',
  'aol.com',
  
  // FAI français
  'free.fr', 'orange.fr', 'sfr.fr', 'wanadoo.fr',
  'laposte.net', 'neuf.fr', 'bbox.fr', 'numericable.fr',
  'aliceadsl.fr', 'voila.fr', 'club-internet.fr',
  'noos.fr', 'cegetel.net', '9online.fr'
]);

export function isPersonalEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return PERSONAL_EMAIL_DOMAINS.has(domain);
}
````

**Évolution future** : on pourra externaliser cette liste dans une variable d'env si on veut la maintenir sans redéployer.

---

## 7. Logique de la route principale

Fichier : `/server/api/lab/stage-alternance.post.ts`

### 7.1 — Comportement (ordre d'exécution)

#### Phase 1 — Validations bloquantes (ordre strict)

1. **Validation Zod** du body — si échec → 400 Bad Request avec détails
2. **Vérification honeypot vide** — si rempli → 400 silencieux (on log côté serveur, on renvoie 200 trompeur pour ne pas alerter le bot)
3. **Vérification Cloudflare Turnstile** côté serveur — si échec → 403 Forbidden
4. **Validation email pro** (blacklist) — si email perso → 400 avec message dédié
5. **Vérification rate limit IP** (3/jour, 7/semaine) — si dépassé → 429 avec message dédié

#### Phase 2 — Lookup et anti-doublon Jarvi

6. **Lookup Company Jarvi** par nom (matching fuzzy sur le nom de l'entreprise + matching sur le domaine email)
7. **Calcul du `companyStatusLabel`** (3 valeurs : `Nouveau prospect` / `Contact connu` / `Client / ancien client`)
8. **Si Company existe** : vérifier la présence d'un Project Lab actif (statusId dans `JARVI_LAB_ACTIVE_STATUS_IDS` ET custom field `Type de demande Lab` = `Stage/Alternance`)
   - Si oui → 409 Conflict avec message dédié (doublon)

#### Phase 3 — Side effects (séquence)

9. **Création/update Company Jarvi** (si pas trouvée) avec retry 1 fois
10. **Création Project Jarvi** rattaché à la Company avec :
    - **Nom** : `Lab — Stage/Alternance — {profilRecherche} — {dateSoumissionFormatted}`
    - **Status** : `JARVI_STATUS_ID_LAB_RECUE`
    - **Custom field** : `Type de demande Lab` = `Stage/Alternance`
    - **Description** : reprend le `briefMission` du formulaire + métadonnées
    - **Retry** : 1 fois en cas d'échec, sinon on accepte quand même la soumission et on log une alerte (Option C validée — fail-soft)
11. **PARALLÈLE — En `Promise.all`** (les 2 en même temps) :
    - **Brevo** : envoi email notification interne (Template `STAGE_NOTIF_INTERNE`) au gérant
    - **Brevo** : envoi email confirmation prospect (Template `STAGE_CONFIRMATION_PROSPECT`)
12. **Logging** des erreurs partielles sans bloquer la réponse

#### Phase 4 — Réponse

13. **Retour HTTP 200** avec :
````json
{
  "success": true,
  "redirectUrl": "/lab/demande-stage-alternance/confirmation"
}
````

### 7.2 — Structure du code (pseudocode TypeScript)

````typescript
import { stageAlternanceSchema } from '~/server/schemas/stage-alternance';
import { verifyTurnstile } from '~/server/utils/turnstile';
import { isPersonalEmail } from '~/server/utils/email-blacklist';
import { checkStageAlternanceRateLimit } from '~/server/utils/ratelimit';
import { 
  findCompanyByNameOrDomain, 
  resolveCompanyStatusLabel,
  hasActiveLabProject,
  upsertCompany,
  createProject 
} from '~/server/utils/jarvi';
import { 
  sendBrevoStageNotifInterne, 
  sendBrevoStageConfirmationProspect,
  sendCriticalAlert 
} from '~/server/utils/brevo';
import { getClientIp } from '~/server/utils/request';

export default defineEventHandler(async (event) => {
  try {
    // === PHASE 1 — Validations bloquantes ===

    const body = await readBody(event);
    const validated = stageAlternanceSchema.parse(body);

    // Honeypot — si rempli, on renvoie 200 trompeur
    if (validated.honeypot && validated.honeypot.length > 0) {
      console.warn('[stage-alternance] Honeypot triggered', { ip: getClientIp(event) });
      return { success: true, redirectUrl: '/lab/demande-stage-alternance/confirmation' };
    }

    // Cloudflare Turnstile
    const ip = getClientIp(event);
    const turnstileOk = await verifyTurnstile(validated.turnstileToken, ip);
    if (!turnstileOk) {
      throw createError({ 
        statusCode: 403, 
        statusMessage: 'TURNSTILE_FAILED',
        message: 'Vérification de sécurité échouée. Merci de rafraîchir la page et réessayer.' 
      });
    }

    // Email pro
    if (isPersonalEmail(validated.email)) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'PERSONAL_EMAIL',
        message: 'Cet outil est réservé aux entreprises. Merci d\'utiliser votre email professionnel.' 
      });
    }

    // Rate limit
    const rateCheck = await checkStageAlternanceRateLimit(ip);
    if (!rateCheck.allowed) {
      throw createError({ 
        statusCode: 429, 
        statusMessage: 'RATE_LIMIT',
        message: 'Limite de soumissions atteinte. Vous avez déjà effectué plusieurs demandes récemment. Si votre demande est urgente, contactez-nous directement à bonjour@mariell.fr.' 
      });
    }

    // === PHASE 2 — Lookup et anti-doublon Jarvi ===

    const emailDomain = validated.email.split('@')[1];
    const existingCompany = await findCompanyByNameOrDomain({
      name: validated.entreprise,
      emailDomain,
      websiteUrl: validated.urlEntreprise
    });

    const companyStatusLabel = resolveCompanyStatusLabel(existingCompany);

    if (existingCompany) {
      const hasDoublon = await hasActiveLabProject({
        companyId: existingCompany.id,
        typeDemandeLab: 'Stage/Alternance'
      });

      if (hasDoublon) {
        throw createError({ 
          statusCode: 409, 
          statusMessage: 'DUPLICATE_REQUEST',
          message: 'Une demande est déjà en cours pour votre entreprise. Pour toute mise à jour ou information complémentaire, contactez-nous directement à bonjour@mariell.fr.' 
        });
      }
    }

    // === PHASE 3 — Side effects ===

    // Étape 9 — Upsert Company (si pas trouvée, on la crée)
    let companyId: string;
    try {
      const company = await upsertCompany({
        existingCompany,
        name: validated.entreprise,
        websiteUrl: validated.urlEntreprise
      }, { retry: true });
      companyId = company.id;
    } catch (err) {
      // Fail-soft : on continue sans Company Jarvi
      console.error('[stage-alternance] Company upsert failed after retry', err);
      await sendCriticalAlert('Jarvi Company upsert failed (Stage/Alternance)', err);
      // Pas de blocage : on continue avec un companyId null
      companyId = null;
    }

    // Étape 10 — Création Project (même logique fail-soft)
    let projectId: string | null = null;
    let projectUrl: string | null = null;
    let companyUrl: string | null = null;

    if (companyId) {
      try {
        const project = await createProject({
          companyId,
          name: `Lab — Stage/Alternance — ${getDisplayProfil(validated)} — ${formatDateFr(new Date())}`,
          statusId: process.env.JARVI_STATUS_ID_LAB_RECUE!,
          typeDemandeLabFieldValueId: process.env.JARVI_FIELD_VALUE_STAGE_ALTERNANCE!,
          description: buildProjectDescription(validated)
        }, { retry: true });
        projectId = project.id;
        projectUrl = `https://app.jarvi.tech/#/projects/${projectId}`;
        companyUrl = `https://app.jarvi.tech/#/companies/${companyId}`;
      } catch (err) {
        console.error('[stage-alternance] Project creation failed after retry', err);
        await sendCriticalAlert('Jarvi Project creation failed (Stage/Alternance)', err);
      }
    }

    // Étape 11 — Envoi des 2 emails Brevo en parallèle
    const emailResults = await Promise.allSettled([
      sendBrevoStageNotifInterne({
        input: validated,
        companyStatusLabel,
        projectUrl: projectUrl || 'Project Jarvi non créé (vérifier alerte)',
        companyUrl: companyUrl || 'Company Jarvi non créée (vérifier alerte)'
      }),
      sendBrevoStageConfirmationProspect({
        input: validated
      })
    ]);

    // Logging des échecs partiels (non bloquant)
    emailResults.forEach((result, idx) => {
      if (result.status === 'rejected') {
        const emailType = idx === 0 ? 'notif-interne' : 'confirmation-prospect';
        console.error(`[stage-alternance] Brevo ${emailType} failed`, result.reason);
        sendCriticalAlert(`Brevo ${emailType} failed (Stage/Alternance)`, result.reason);
      }
    });

    // === PHASE 4 — Réponse ===

    return {
      success: true,
      redirectUrl: '/lab/demande-stage-alternance/confirmation'
    };

  } catch (err: any) {
    // Si c'est une erreur connue qu'on a thrown (createError), on la propage telle quelle
    if (err.statusCode) throw err;

    // Sinon, erreur inattendue → on log + alerte + 500 générique
    console.error('[stage-alternance] Unexpected error', err);
    await sendCriticalAlert('Stage/Alternance route unexpected error', err);

    throw createError({
      statusCode: 500,
      statusMessage: 'INTERNAL_ERROR',
      message: 'Une erreur technique s\'est produite. Votre demande n\'a pas pu être enregistrée. Merci de réessayer dans quelques minutes, ou de nous contacter directement à bonjour@mariell.fr.'
    });
  }
});

// Helpers locaux

function getDisplayProfil(input: StageAlternanceInput): string {
  return input.profilRecherche === 'Autre' 
    ? input.profilRecherchePrecisionAutre || 'Profil personnalisé'
    : input.profilRecherche;
}

function buildProjectDescription(input: StageAlternanceInput): string {
  return `
**Type de contrat** : ${input.typeContrat}
**Profil recherché** : ${getDisplayProfil(input)}
**Date de démarrage** : ${input.dateDemarrage}
**Localisation** : ${input.localisation}

**Brief de la mission** :
${input.briefMission}

---
Soumis via Le Lab Mariell — ${formatDateFr(new Date())}
  `.trim();
}
````

---

## 8. Rate limiting

Fichier : `/server/utils/ratelimit.ts` (extension de l'existant outil 2)

````typescript
// Config rate limit pour outil 1 (Stage/Alternance)
const STAGE_ALT_RATE_LIMITS = {
  perDay: 3,
  perWeek: 7
};

export async function checkStageAlternanceRateLimit(ip: string): Promise<{ allowed: boolean }> {
  const dayKey = `ratelimit:stage-alt:ip:${ip}:day:${getDayKey()}`;
  const weekKey = `ratelimit:stage-alt:ip:${ip}:week:${getWeekKey()}`;

  const [dayCount, weekCount] = await Promise.all([
    kv.incr(dayKey),
    kv.incr(weekKey)
  ]);

  // TTL à la première incrémentation
  if (dayCount === 1) await kv.expire(dayKey, 86400);  // 24h
  if (weekCount === 1) await kv.expire(weekKey, 604800);  // 7 jours

  if (dayCount > STAGE_ALT_RATE_LIMITS.perDay) return { allowed: false };
  if (weekCount > STAGE_ALT_RATE_LIMITS.perWeek) return { allowed: false };

  return { allowed: true };
}

function getDayKey(): string {
  return new Date().toISOString().slice(0, 10);  // YYYY-MM-DD
}

function getWeekKey(): string {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now.getTime() - yearStart.getTime()) / 86400000 + yearStart.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNum}`;
}
````

**Notes** :
- Clés KV scopées avec préfixe `stage-alt:` pour ne pas collisionner avec les rate limits outil 2
- Pas de rate limit par domaine email (uniquement IP) — cohérent avec un service offert où on ne veut pas pénaliser les boîtes qui ont plusieurs collaborateurs
- Comportement en cas de dépassement : **blocage simple** (pas de mode différé — décision prise en cadrage)

---

## 9. Logique Jarvi détaillée

Fichier : `/server/utils/jarvi.ts` (extensions à ajouter à l'existant outil 2)

### 9.1 — Lookup Company

````typescript
export async function findCompanyByNameOrDomain(params: {
  name: string;
  emailDomain: string;
  websiteUrl: string;
}): Promise<JarviCompany | null> {
  // Stratégie : on tente un GET /companies avec filtre GraphQL `where`
  // sur le nom (match exact ou contient) OU le domaine du website
  
  const where = {
    _or: [
      { companyPublicData: { name: { _ilike: `%${params.name}%` } } },
      { companyPublicData: { website: { _ilike: `%${extractDomain(params.websiteUrl)}%` } } }
    ]
  };

  const url = `${process.env.JARVI_API_BASE_URL}/companies?where=${encodeURIComponent(JSON.stringify(where))}&limit=10`;

  const res = await fetch(url, {
    headers: { 'X-API-KEY': process.env.JARVI_API_KEY! }
  });

  if (!res.ok) {
    throw new Error(`Jarvi findCompany failed: ${res.status}`);
  }

  const data = await res.json();

  // Si plusieurs matches : on prend le plus récent (updatedAt desc)
  // Si aucun : null
  if (!data.data || data.data.length === 0) return null;

  return data.data.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )[0];
}

function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
````

### 9.2 — Résolution du `companyStatusLabel`

````typescript
export function resolveCompanyStatusLabel(company: JarviCompany | null): string {
  if (!company) return 'Nouveau prospect';

  const clientStatusIds = (process.env.JARVI_CLIENT_STATUS_IDS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  // Fail-soft : si la liste est vide, on ne peut pas qualifier de "client"
  // → toutes les Companies existantes apparaissent comme "Contact connu"
  if (clientStatusIds.length > 0 && clientStatusIds.includes(company.statusId)) {
    return 'Client / ancien client';
  }

  return 'Contact connu';
}
````

### 9.3 — Check Project Lab actif

````typescript
export async function hasActiveLabProject(params: {
  companyId: string;
  typeDemandeLab: string;
}): Promise<boolean> {
  const activeStatusIds = (process.env.JARVI_LAB_ACTIVE_STATUS_IDS || '').split(',');
  const fieldValueIdStageAlt = process.env.JARVI_FIELD_VALUE_STAGE_ALTERNANCE!;

  // GET /projects avec filtre : companyId + status actif + custom field = Stage/Alternance
  const where = {
    companyId: { _eq: params.companyId },
    statusId: { _in: activeStatusIds },
    fieldsValues: {
      fieldValueId: { _eq: fieldValueIdStageAlt }
    }
  };

  const url = `${process.env.JARVI_API_BASE_URL}/projects?where=${encodeURIComponent(JSON.stringify(where))}&limit=1`;

  const res = await fetch(url, {
    headers: { 'X-API-KEY': process.env.JARVI_API_KEY! }
  });

  if (!res.ok) {
    // Fail-soft : si Jarvi répond mal, on accepte (on ne pénalise pas le prospect)
    console.warn('[jarvi] hasActiveLabProject failed, allowing submission', res.status);
    return false;
  }

  const data = await res.json();
  return (data.data && data.data.length > 0);
}
````

### 9.4 — Upsert Company

````typescript
export async function upsertCompany(params: {
  existingCompany: JarviCompany | null;
  name: string;
  websiteUrl: string;
}, options: { retry: boolean }): Promise<JarviCompany> {
  if (params.existingCompany) {
    // Pas besoin d'update — la Company existe déjà
    return params.existingCompany;
  }

  // Création
  const body = {
    name: params.name,
    website: params.websiteUrl
  };

  const doRequest = async () => {
    const res = await fetch(`${process.env.JARVI_API_BASE_URL}/companies`, {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.JARVI_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error(`Jarvi upsertCompany failed: ${res.status}`);
    return res.json();
  };

  try {
    const result = await doRequest();
    return result.data;
  } catch (err) {
    if (options.retry) {
      console.warn('[jarvi] upsertCompany failed, retrying once', err);
      await sleep(500);
      const result = await doRequest();
      return result.data;
    }
    throw err;
  }
}
````

### 9.5 — Création Project

````typescript
export async function createProject(params: {
  companyId: string;
  name: string;
  statusId: string;
  typeDemandeLabFieldValueId: string;
  description: string;
}, options: { retry: boolean }): Promise<{ id: string }> {
  const body = {
    companyId: params.companyId,
    name: params.name,
    statusId: params.statusId,
    description: params.description,
    fieldsValues: [
      {
        fieldId: process.env.JARVI_FIELD_ID_TYPE_DEMANDE_LAB!,
        fieldValueId: params.typeDemandeLabFieldValueId
      }
    ]
  };

  const doRequest = async () => {
    const res = await fetch(`${process.env.JARVI_API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.JARVI_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error(`Jarvi createProject failed: ${res.status}`);
    return res.json();
  };

  try {
    const result = await doRequest();
    return result.data;
  } catch (err) {
    if (options.retry) {
      console.warn('[jarvi] createProject failed, retrying once', err);
      await sleep(500);
      const result = await doRequest();
      return result.data;
    }
    throw err;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
````

⚠️ **Attention** : la structure exacte des payloads `POST /companies` et `POST /projects` doit être validée contre la doc Jarvi à jour au moment de l'implémentation. La doc mentionnait des changements prévus été 2025 — il faudra vérifier.

---

## 10. Brevo — Templates outil 1

📄 **Document de référence** : `templates-brevo-outil-1.md` (HTML complet des 2 templates Brevo, variables, checklist setup Brevo)

Cette section couvre **uniquement le code Nitro** qui appelle les templates Brevo. Le HTML des emails et la configuration côté Brevo (création des templates, récupération des IDs, expéditeur, DNS) sont entièrement décrits dans `templates-brevo-outil-1.md`.

### Setup préalable côté Brevo

Avant de coder, créer dans Brevo les 2 templates depuis le HTML fourni dans `templates-brevo-outil-1.md` :
- Template `Lab — Stage Alternance — Notification interne` → ID à mettre dans `BREVO_TEMPLATE_ID_STAGE_NOTIF_INTERNE`
- Template `Lab — Stage Alternance — Confirmation prospect` → ID à mettre dans `BREVO_TEMPLATE_ID_STAGE_CONFIRMATION_PROSPECT`

### Code Nitro

Fichier : `/server/utils/brevo.ts` (extensions à ajouter à l'existant outil 2)

````typescript
import type { StageAlternanceInput } from '~/server/schemas/stage-alternance';

export async function sendBrevoStageNotifInterne(params: {
  input: StageAlternanceInput;
  companyStatusLabel: string;
  projectUrl: string;
  companyUrl: string;
}) {
  return sendBrevoEmail({
    templateId: parseInt(process.env.BREVO_TEMPLATE_ID_STAGE_NOTIF_INTERNE!),
    to: [{ email: process.env.BREVO_NOTIF_RECIPIENT! }],
    params: {
      DATE_SOUMISSION: formatDateFr(new Date()),
      COMPANY_STATUS_LABEL: params.companyStatusLabel,
      PRENOM_NOM: `${params.input.prenom} ${params.input.nom}`,
      EMAIL: params.input.email,
      TELEPHONE: params.input.telephone,
      ENTREPRISE: params.input.entreprise,
      URL_ENTREPRISE: params.input.urlEntreprise,
      TYPE_CONTRAT: params.input.typeContrat,
      PROFIL_RECHERCHE: params.input.profilRecherche === 'Autre' 
        ? params.input.profilRecherchePrecisionAutre 
        : params.input.profilRecherche,
      DATE_DEMARRAGE: params.input.dateDemarrage,
      LOCALISATION: params.input.localisation,
      BRIEF_MISSION: params.input.briefMission,
      URL_JARVI_PROJECT: params.projectUrl,
      URL_JARVI_COMPANY: params.companyUrl
    }
  });
}

export async function sendBrevoStageConfirmationProspect(params: {
  input: StageAlternanceInput;
}) {
  return sendBrevoEmail({
    templateId: parseInt(process.env.BREVO_TEMPLATE_ID_STAGE_CONFIRMATION_PROSPECT!),
    to: [{ email: params.input.email, name: `${params.input.prenom} ${params.input.nom}` }],
    params: {
      PRENOM: params.input.prenom,
      TYPE_CONTRAT_LOWER: params.input.typeContrat.toLowerCase(),
      ENTREPRISE: params.input.entreprise,
      URL_LAB: `${process.env.NUXT_PUBLIC_SITE_URL}/lab`
    }
  });
}
````

**Note** : la fonction `sendBrevoEmail` est mutualisée avec l'outil 2 (déjà implémentée). On ne fait que l'appeler avec les bons params.

---

## 11. Honeypot et anti-bot

### Côté front (page Vue formulaire)

````html
<!-- Honeypot caché : invisible visuellement, mais accessible aux bots -->
<div style="position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;" aria-hidden="true">
  <label for="company_website">Ne pas remplir ce champ</label>
  <input 
    type="text" 
    id="company_website" 
    name="company_website" 
    tabindex="-1" 
    autocomplete="off"
    v-model="form.honeypot"
  />
</div>
````

**Détails** :
- `position: absolute; left: -9999px` est plus fiable que `display: none` (certains bots ignorent `display: none`)
- `tabindex="-1"` empêche les utilisateurs au clavier de tomber dessus
- `aria-hidden="true"` cache le champ aux screen readers
- Le label "Ne pas remplir ce champ" est une garantie accessibilité

### Côté serveur

Validation Zod : `honeypot: z.string().max(0).optional()` — si le champ est rempli (longueur > 0), validation échouée → on retourne 200 trompeur (pour ne pas alerter le bot que sa tentative a été détectée).

---

## 12. Pages Vue

### `/pages/lab/demande-stage-alternance.vue` — Formulaire

- Utilise le design HTML produit par Claude Design (brief outil 1)
- Validation côté client (équivalent du schéma Zod)
- Cloudflare Turnstile widget
- Compteur de caractères dynamique sur `briefMission` (couleur change à 400/500)
- Honeypot caché (voir section 11)
- Bouton submit appelle `useStageAlternance().submit()`
- Sur success → redirection vers `/lab/demande-stage-alternance/confirmation`
- Sur erreur → affichage du bon message selon `statusMessage` retourné (PERSONAL_EMAIL / RATE_LIMIT / DUPLICATE_REQUEST / TURNSTILE_FAILED / INTERNAL_ERROR)

### `/pages/lab/demande-stage-alternance/confirmation.vue` — Confirmation

- Page statique pure (pas d'appel API)
- Affiche le message de confirmation validé
- Bouton "Retour au Lab" → lien vers `/lab`

---

## 13. Composable Vue

Fichier : `/composables/useStageAlternance.ts`

````typescript
export function useStageAlternance() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const errorCode = ref<string | null>(null);

  async function submit(formData: StageAlternanceInput) {
    isLoading.value = true;
    error.value = null;
    errorCode.value = null;

    try {
      const result = await $fetch<{ success: boolean; redirectUrl: string }>(
        '/api/lab/stage-alternance', 
        {
          method: 'POST',
          body: formData
        }
      );

      // Succès → redirection
      await navigateTo(result.redirectUrl);
      return { success: true };

    } catch (err: any) {
      // Récupération du code d'erreur depuis la réponse
      errorCode.value = err.data?.statusMessage || err.statusMessage || 'INTERNAL_ERROR';
      error.value = err.data?.message || err.message || 'Une erreur est survenue.';
      return { error: error.value, code: errorCode.value };

    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    error,
    errorCode,
    submit
  };
}
````

---

## 14. Tests à prévoir avant lancement

### Tests fonctionnels

1. ✅ Soumission valide (email pro, tous champs OK) → redirection confirmation + 2 emails reçus + Project Jarvi créé
2. ✅ Email perso (gmail.com) → 400 PERSONAL_EMAIL
3. ✅ Honeypot rempli → 200 trompeur (pas d'effets de bord)
4. ✅ Turnstile invalid → 403 TURNSTILE_FAILED
5. ✅ 4e soumission depuis la même IP dans la journée → 429 RATE_LIMIT
6. ✅ Doublon : 2e soumission depuis la même boîte (Project Lab actif existant) → 409 DUPLICATE_REQUEST
7. ✅ Jarvi en panne → fail-soft : la soumission passe + alerte critique envoyée à toi
8. ✅ Brevo en panne sur 1 des 2 emails → fail-soft : autre email envoyé + alerte critique
9. ✅ Brief mission < 20 caractères → 400 ZodError
10. ✅ Brief mission > 500 caractères → 400 ZodError
11. ✅ Test Company existante (Client) → email notif affiche `Client / ancien client`
12. ✅ Test Company existante (autre statut) → email notif affiche `Contact connu`
13. ✅ Test Company nouvelle → email notif affiche `Nouveau prospect`

### Tests manuels avant déploiement prod

1. Test de bout en bout sur staging (depuis remplissage formulaire jusqu'à réception email)
2. Vérification réception email notif interne avec tous les champs + statut Company correct + 2 liens Jarvi fonctionnels
3. Vérification réception email confirmation prospect
4. Vérification dans Jarvi : Company correctement créée OU mise à jour, Project créé avec bon statut + bon custom field
5. Vérification rate limit : 4 soumissions consécutives depuis la même IP → la 4e bloque

---

## 15. Estimation de mise en œuvre

| Phase | Tâches | Effort estimé |
|---|---|---|
| Setup Jarvi | Création statuts Project + custom field "Type de demande Lab" + récupération UUIDs | 0,25 jour |
| Setup Brevo | Création des 2 templates Brevo + récupération IDs | 0,25 jour |
| Schéma + utils | Zod + email-blacklist + extensions Brevo/Jarvi/ratelimit | 0,5 jour |
| Route Nitro | Route principale avec orchestration complète | 0,5 jour |
| Composable Vue | useStageAlternance | 0,25 jour |
| Pages Vue | Intégration des designs Claude Design (formulaire + confirmation) | 1 jour |
| Tests + debugging | Bout-en-bout + edge cases | 0,5 jour |
| **Total** | | **3,25 jours** |

**Note** : estimation cohérente avec la roadmap Phase 8 (1-2 jours) annoncée dans le récap, en intégrant le setup Jarvi/Brevo et les tests qui n'étaient pas comptés séparément.

---

## 16. Annexes

### Annexe A — Templates Brevo

📄 Voir fichier `templates-brevo-outil-1.md` (HTML complet des 2 templates, variables Brevo, checklist setup Brevo, notes pour le dev).

### Annexe B — Spécifications du formulaire

📄 Voir fichier `formulaire-specs-outil-1.md` (détail technique des 11 champs, validation, regex, messages d'erreur, comportement UX, page de confirmation).

### Annexe C — Brief Claude Design

📄 Voir fichier `brief-claude-design-outil-1-stage-alternance.md` (brief complet pour Claude Design : page formulaire + page confirmation, en cohérence visuelle avec l'outil 2).

### Annexe D — Designs HTML/CSS

À produire avec Claude Design à partir du brief en Annexe C. Output attendu : un artifact HTML/CSS contenant les 2 pages (formulaire + confirmation).

### Annexe E — Doc API Jarvi de référence

URL de référence : `https://api-docs.jarvi.tech/`
Endpoints clés utilisés :
- `GET /companies?where=...` (recherche Company)
- `POST /companies` (création Company)
- `GET /projects?where=...` (check Project Lab actif)
- `POST /projects` (création Project)

⚠️ Vérifier la version de l'API au moment de l'implémentation (changements annoncés été 2025).

---

## 17. Index des livrables outil 1

Pour le dev qui prendra l'outil en charge, voici l'ordre de lecture recommandé :

| Étape | Fichier | Rôle |
|---|---|---|
| 1 | `recap-global-projet-mariell.md` | Contexte stratégique global du projet |
| 2 | `brief-claude-design-outil-1-stage-alternance.md` | Brief design (à donner à Claude Design pour produire le HTML/CSS) |
| 3 | `formulaire-specs-outil-1.md` | Détail technique du formulaire (validation, messages d'erreur, UX) |
| 4 | `templates-brevo-outil-1.md` | HTML des 2 templates Brevo + setup Brevo |
| 5 | `spec-technique-route-nitro-outil-1.md` | **(ce document)** Architecture backend + code Nitro |

Chaque fichier a un rôle unique sans duplication. Le code Nitro (ce document) référence les autres fichiers pour les détails de leur domaine respectif.

---

**Fin de la spec.**
