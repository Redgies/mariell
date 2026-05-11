import { d as defineEventHandler, r as readBody, c as createError } from '../../../../nitro/nitro.mjs';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { g as getClientIp, v as verifyTurnstile, c as checkEvaluationAttractiviteRateLimit, s as sendCriticalAlert, f as findCompanyByNameOrDomain, u as upsertCompany, j as jarviCompanyUrl, a as createEvaluationAttractiviteProject, b as jarviProjectUrl, d as sendBrevoEvaluationNotifInterneLivree, e as sendBrevoEvaluationConfirmationProspect, h as sendBrevoEvaluationNotifInterneDifferee, i as sendBrevoEvaluationSuiviProspect } from '../../../../_/brevo.mjs';
import { h as hasAnthropic, g as generateEvaluationWithAnthropic } from '../../../../_/anthropic.mjs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { s as saveEvaluation, a as anonymizeInputs, b as saveDeferredEvaluation } from '../../../../_/evaluation-storage.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:crypto';
import '@upstash/redis';
import '@anthropic-ai/sdk';

const INJECTION_PATTERNS = [
  // Override d'instructions
  /\bignor[ee]?\s+(tes?|les?|ces?|vos?|previous|toutes?|all|prior)\b/i,
  /\bdisregard\s+(tes?|les?|previous|prior|all)\b/i,
  /\bforget\s+(tes?|les?|previous|prior|all|everything)\b/i,
  /\boverride\s+(tes?|les?|system|prompt|instructions?)\b/i,
  // Jailbreak / mode debug
  /\bjailbreak/i,
  /\bdebug\s*mode/i,
  /\bdeveloper\s*mode/i,
  /\bdan\s+mode/i,
  /\bmaintenance\s*mode/i,
  // Role-play hostile
  /\bagis?\s+comme\s+(un|une|si|en\s+tant)/i,
  /\bact\s+(as|like)\s+(if|a|an)/i,
  /\btu\s+es\s+maintenant\b/i,
  /\byou\s+are\s+now\b/i,
  /\bpretends?\s+(to\s+be|que)/i,
  // Accès au system prompt
  /\bsystem\s*prompt/i,
  /\bsystem\s*instructions?/i,
  /\bprompt\s*caching/i,
  /\bréveles?\s+(tes?|les?|ton|le)/i,
  /\breveal\s+(tes?|les?|your|the)/i,
  /\baffich[ee]\s+(ton|tes?|le|les?|son)\s+(prompt|instructions?)/i,
  /\bshow\s+(me\s+)?(your|the)\s+(prompt|instructions?|system)/i,
  // Spécifiques outil 3 — révélation des référentiels
  /\btier\s+[sabc]\b/i,
  /\bf[1-4]\s+(b[oô]ites?|secteurs?|missions?|salaires?)/i,
  /\bréférentiels?\s+(internes?|propriétaires?|mariell)/i,
  /\bgrille\s+terrain/i,
  /\bgrille\s+minorée/i,
  /\b6\s+dimensions/i,
  /\bscore\s+(interne|f3|additif)/i,
  /\bmodificateur\s+sectoriel/i,
  // Exfiltration
  /\bcurl\s+/i,
  /\bwget\s+/i,
  /\bexec\s*\(/i,
  /\beval\s*\(/i,
  /<\s*script[^>]*>/i,
  /<\s*iframe[^>]*>/i,
  // Encodages suspects (Base64 long en fin de ligne)
  /[A-Za-z0-9+/]{50,}={0,2}\s*$/m
];
function containsInjectionPattern(text) {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

const noInjection = (fieldName) => z.string().refine((val) => !containsInjectionPattern(val), {
  message: `Le champ ${fieldName} contient un format non autoris\xE9.`
});
const POSTES_RECHERCHES = [
  "SDR / BDR",
  "Inside Sales",
  "Field Sales / Outside Sales",
  "Business Developer Full Cycle",
  "Account Executive \u2014 PME / SMB",
  "Account Executive \u2014 Mid-Market",
  "Account Executive \u2014 Enterprise",
  "Sales Engineer / Pre-Sales",
  "Account Manager",
  "Strategic Account Manager / Key Account Manager",
  "Customer Success Manager",
  "Sales Ops / RevOps",
  "Channel / Partner Manager",
  "Sales Manager / Team Lead",
  "Head of Sales",
  "VP Sales / CRO",
  "Autre"
];
const SECTEURS_ENTREPRISE = [
  "SaaS B2B",
  "Conseil IT / ESN",
  "Industrie / B2B classique",
  "Cyber / S\xE9curit\xE9",
  "Fintech",
  "Healthtech",
  "Services",
  "Autre"
];
const SENIORITES = [
  "Junior 0-2 ans",
  "Confirm\xE9 2-5 ans",
  "Senior 5-8 ans",
  "Lead 8+ ans"
];
const TYPES_CYCLE = [
  "Outbound",
  "Inbound",
  "Mixte",
  "Account Management",
  "Sales Ops",
  "Autre"
];
const MODALITES_TRAVAIL = [
  "Full remote",
  "Hybride flexible (1-2 jours bureau / sem)",
  "Hybride \xE9quilibr\xE9 (3 jours bureau / sem)",
  "Pr\xE9sentiel (4-5 jours bureau / sem)"
];
const formulaireOutil3SchemaRefined = z.object({
  // Identité
  prenom: z.string().trim().min(2).max(50).regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Caract\xE8res non autoris\xE9s dans le pr\xE9nom"),
  nom: z.string().trim().min(2).max(50).regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Caract\xE8res non autoris\xE9s dans le nom"),
  email: z.string().trim().toLowerCase().email().max(150),
  telephone: z.string().trim().min(8).max(20).regex(/^[+\d\s().-]+$/, "Format de num\xE9ro invalide"),
  // Entreprise
  entreprise: z.string().trim().min(2).max(100).pipe(noInjection("entreprise")),
  site_web: z.string().trim().max(200).optional().or(z.literal("")).transform((v) => v && !/^https?:\/\//i.test(v) ? `https://${v}` : v).pipe(z.union([z.literal(""), z.string().url(), z.undefined()])),
  secteur: z.enum(SECTEURS_ENTREPRISE),
  secteur_precision_autre: z.string().trim().max(60).pipe(noInjection("pr\xE9cision du secteur")).optional(),
  localisation: z.string().trim().min(2).max(100).pipe(noInjection("localisation")),
  effectifs_entreprise: z.string().trim().min(1).max(50).pipe(noInjection("effectifs")),
  equipe_sales: z.string().trim().min(3).max(300).pipe(noInjection("\xE9quipe Sales")),
  // Poste
  intitule_poste: z.enum(POSTES_RECHERCHES),
  intitule_poste_precision_autre: z.string().trim().max(60).pipe(noInjection("pr\xE9cision de l'intitul\xE9")).optional(),
  seniorite: z.enum(SENIORITES),
  type_cycle: z.enum(TYPES_CYCLE),
  type_cycle_autre: z.string().trim().max(60).pipe(noInjection("pr\xE9cision du cycle")).optional(),
  modalite_travail: z.enum(MODALITES_TRAVAIL),
  description_missions: z.string().trim().min(50).max(1e3).pipe(noInjection("description des missions")),
  // Package
  package_fixe: z.number().int().min(15e3).max(5e5),
  package_ote: z.number().int().min(0).max(8e5),
  // Conformité
  consentement_rgpd: z.literal(true, {
    error: () => "Le consentement RGPD est obligatoire"
  }),
  turnstile_token: z.string().min(1).max(2048)
}).refine(
  (data) => {
    var _a, _b;
    return data.type_cycle !== "Autre" || ((_b = (_a = data.type_cycle_autre) == null ? void 0 : _a.length) != null ? _b : 0) >= 3;
  },
  { message: "Pr\xE9cisez le type de cycle (3 caract\xE8res minimum)", path: ["type_cycle_autre"] }
).refine(
  (data) => {
    var _a, _b;
    return data.intitule_poste !== "Autre" || ((_b = (_a = data.intitule_poste_precision_autre) == null ? void 0 : _a.length) != null ? _b : 0) >= 3;
  },
  {
    message: "Pr\xE9cisez l'intitul\xE9 de poste (3 caract\xE8res minimum)",
    path: ["intitule_poste_precision_autre"]
  }
).refine(
  (data) => {
    var _a, _b;
    return data.secteur !== "Autre" || ((_b = (_a = data.secteur_precision_autre) == null ? void 0 : _a.length) != null ? _b : 0) >= 3;
  },
  { message: "Pr\xE9cisez le secteur (3 caract\xE8res minimum)", path: ["secteur_precision_autre"] }
);

const llmOutputJsonSchema = z.object({
  niveau_attractivite: z.enum([
    "Hyper attractive",
    "Tr\xE8s attractive",
    "Attractive / align\xE9e",
    "Sous-positionn\xE9e",
    "Fragile"
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
const llmOutputJsonSchemaRefined = llmOutputJsonSchema.refine(
  (data) => {
    const expectedIndex = {
      Fragile: 1,
      "Sous-positionn\xE9e": 2,
      "Attractive / align\xE9e": 3,
      "Tr\xE8s attractive": 4,
      "Hyper attractive": 5
    };
    return data.niveau_index === expectedIndex[data.niveau_attractivite];
  },
  { message: "Incoh\xE9rence entre niveau_attractivite et niveau_index" }
);

let cachedPrompts = null;
async function loadOutil3Prompts() {
  if (cachedPrompts) return cachedPrompts;
  const promptsDir = join(process.cwd(), "server", "prompts", "outil-3");
  const [systemPromptV9, f1, f2, f3, f4] = await Promise.all([
    readFile(join(promptsDir, "system-prompt-v9.md"), "utf-8"),
    readFile(join(promptsDir, "f1-boites-intouchables-v7.md"), "utf-8"),
    readFile(join(promptsDir, "f2-grille-secteurs-v3.md"), "utf-8"),
    readFile(join(promptsDir, "f3-typologie-missions-v5.md"), "utf-8"),
    readFile(join(promptsDir, "f4-addendum-salaires-v5.md"), "utf-8")
  ]);
  cachedPrompts = { systemPromptV9, f1, f2, f3, f4 };
  return cachedPrompts;
}

async function buildSystemBlocks() {
  const { systemPromptV9, f1, f2, f3, f4 } = await loadOutil3Prompts();
  return [
    { type: "text", text: systemPromptV9 },
    {
      type: "text",
      text: `---

# \u{1F4DA} R\xC9F\xC9RENTIEL F1 \u2014 BO\xCETES INTOUCHABLES (V7)

> R\xE9f\xE9rentiel des entreprises actives sur le march\xE9 Sales fran\xE7ais en 2026 avec leur tier (S / A / B / C). Tu utilises ce tier pour le scoring F1. Une entreprise absente du r\xE9f\xE9rentiel n'est jamais p\xE9nalis\xE9e.

${f1}`,
      cache_control: { type: "ephemeral" }
    },
    {
      type: "text",
      text: `---

# \u{1F4DA} R\xC9F\xC9RENTIEL F2 \u2014 GRILLE SECTEURS (V3)

> R\xE9f\xE9rentiel des 32 secteurs avec modificateurs sectoriels.

${f2}`,
      cache_control: { type: "ephemeral" }
    },
    {
      type: "text",
      text: `---

# \u{1F4DA} R\xC9F\xC9RENTIEL F3 \u2014 TYPOLOGIE MISSIONS (V5)

> 7 dimensions transversales d'\xE9valuation de la mission. Score F3 entre \u22127 et +6.

${f3}`,
      cache_control: { type: "ephemeral" }
    },
    {
      type: "text",
      text: `---

# \u{1F4DA} R\xC9F\xC9RENTIEL F4 \u2014 ADDENDUM SALAIRES (V5)

> \u26A0\uFE0F La position du package est pr\xE9-calcul\xE9e c\xF4t\xE9 backend et inject\xE9e dans le user prompt sous le titre "\u{1F512} PR\xC9-CALCUL PACKAGE". Tu ne recalcules pas. F4 reste charg\xE9 pour les formulations narratives qualitatives et les cas d\xE9grad\xE9s.

${f4}`,
      cache_control: { type: "ephemeral" }
    }
  ];
}

const BORNES_FIXE = {
  "SDR / BDR Junior": [32, 35, 39],
  "SDR / BDR Confirm\xE9": [32, 35, 39],
  "Business Developer Full Cycle": [32, 36, 41],
  "AE PME / SMB": [41, 44, 48],
  "AE Mid-Market": [48, 53, 59],
  "AE Enterprise": [65, 74, 84],
  "Account Manager": [43, 47, 52],
  "Customer Success Manager": [38, 42, 47],
  "Sales Ops / RevOps": [40, 49, 59],
  "Channel / Partner Manager": [45, 53, 61],
  "Sales Manager / Team Lead": [50, 63, 76],
  "Head of Sales": [90, 110, 131],
  "VP Sales / CRO": [120, 146, 173],
  "profil non standard": null
};
const BORNES_OTE = {
  "SDR / BDR Junior": [42, 49, 55],
  "SDR / BDR Confirm\xE9": [42, 48, 54],
  "Business Developer Full Cycle": [52, 61, 70],
  "AE PME / SMB": [61, 70, 79],
  "AE Mid-Market": [86, 98, 111],
  "AE Enterprise": [124, 148, 173],
  "Account Manager": [59, 67, 76],
  "Customer Success Manager": [43, 50, 57],
  "Sales Ops / RevOps": [46, 58, 71],
  "Channel / Partner Manager": [65, 78, 92],
  "Sales Manager / Team Lead": [77, 97, 118],
  "Head of Sales": [149, 189, 229],
  "VP Sales / CRO": [210, 266, 323],
  "profil non standard": null
};
function calculatePosition(montantEuros, bornesK) {
  if (bornesK === null) return "milieu de fourchette";
  const montantK = montantEuros / 1e3;
  const [sousMarcheMax, basseMax, milieuMax] = bornesK;
  if (montantK < sousMarcheMax) return "sous-march\xE9";
  if (montantK <= basseMax) return "fourchette basse";
  if (montantK <= milieuMax) return "milieu de fourchette";
  return "haut+";
}
function mapToProfilF4(intitulePoste, intitulePrecision, seniorite) {
  switch (intitulePoste) {
    case "SDR / BDR":
      return seniorite === "Junior 0-2 ans" ? "SDR / BDR Junior" : "SDR / BDR Confirm\xE9";
    case "Inside Sales":
    case "Business Developer Full Cycle":
      return "Business Developer Full Cycle";
    case "Field Sales / Outside Sales":
      return seniorite === "Junior 0-2 ans" ? "AE PME / SMB" : "AE Mid-Market";
    case "Account Executive \u2014 PME / SMB":
      return "AE PME / SMB";
    case "Account Executive \u2014 Mid-Market":
      return "AE Mid-Market";
    case "Account Executive \u2014 Enterprise":
      return "AE Enterprise";
    case "Sales Engineer / Pre-Sales":
      return "AE Mid-Market";
    // hors scope F4 → fourchette indicative
    case "Account Manager":
      return "Account Manager";
    case "Strategic Account Manager / Key Account Manager":
      return "AE Enterprise";
    case "Customer Success Manager":
      return "Customer Success Manager";
    case "Sales Ops / RevOps":
      return "Sales Ops / RevOps";
    case "Channel / Partner Manager":
      return "Channel / Partner Manager";
    case "Sales Manager / Team Lead":
      return "Sales Manager / Team Lead";
    case "Head of Sales":
      return "Head of Sales";
    case "VP Sales / CRO":
      return "VP Sales / CRO";
    case "Autre":
      return mapAutreToProfilF4(intitulePrecision, seniorite);
    default:
      return "profil non standard";
  }
}
function mapAutreToProfilF4(precision, seniorite) {
  if (!precision) return "profil non standard";
  const p = precision.toLowerCase();
  if (p.includes("sdr") || p.includes("bdr")) {
    return seniorite === "Junior 0-2 ans" ? "SDR / BDR Junior" : "SDR / BDR Confirm\xE9";
  }
  if (p.includes("csm") || p.includes("customer success")) return "Customer Success Manager";
  if (p.includes("account manager") || p.includes("am ")) return "Account Manager";
  if (p.includes("enterprise") || p.includes("grands comptes")) return "AE Enterprise";
  if (p.includes("mid-market") || p.includes("mid market")) return "AE Mid-Market";
  if (p.includes("pme") || p.includes("smb")) return "AE PME / SMB";
  if (p.includes("director") || p.includes("directeur")) return "Head of Sales";
  if (p.includes("vp") || p.includes("cro")) return "VP Sales / CRO";
  if (p.includes("partner") || p.includes("channel")) return "Channel / Partner Manager";
  if (p.includes("sales ops") || p.includes("revops")) return "Sales Ops / RevOps";
  return "profil non standard";
}
function calculatePositionGlobale(positionFixe, positionOte) {
  const positionToIndex = {
    "sous-march\xE9": 0,
    "fourchette basse": 1,
    "milieu de fourchette": 2,
    "haut+": 3
  };
  const indexToPosition = [
    "sous-march\xE9",
    "fourchette basse",
    "milieu de fourchette",
    "haut+"
  ];
  const idxFixe = positionToIndex[positionFixe];
  const idxOte = positionToIndex[positionOte];
  const ecart = Math.abs(idxFixe - idxOte);
  if (ecart === 0) return { position: positionFixe, incoherence: false };
  if (ecart === 1) return { position: indexToPosition[Math.min(idxFixe, idxOte)], incoherence: false };
  return { position: indexToPosition[Math.min(idxFixe, idxOte)], incoherence: true };
}
function calculatePackagePosition(data) {
  const profil = mapToProfilF4(data.intitule_poste, data.intitule_poste_precision_autre, data.seniorite);
  const positionFixe = calculatePosition(data.package_fixe, BORNES_FIXE[profil]);
  const positionOte = calculatePosition(data.package_ote, BORNES_OTE[profil]);
  const { position: positionGlobale, incoherence: incoherenceFixeOte } = calculatePositionGlobale(
    positionFixe,
    positionOte
  );
  return { profil, positionFixe, positionOte, positionGlobale, incoherenceFixeOte };
}

function buildUserPrompt(data) {
  const cycleLabel = data.type_cycle === "Autre" && data.type_cycle_autre ? `${data.type_cycle} (${data.type_cycle_autre})` : data.type_cycle;
  const intituleLabel = data.intitule_poste === "Autre" && data.intitule_poste_precision_autre ? `${data.intitule_poste} (${data.intitule_poste_precision_autre})` : data.intitule_poste;
  const secteurLabel = data.secteur === "Autre" && data.secteur_precision_autre ? `${data.secteur} (${data.secteur_precision_autre})` : data.secteur;
  const siteWebLine = data.site_web && data.site_web.trim() !== "" ? `- Site web : ${data.site_web}` : `- Site web : (non renseign\xE9 \u2014 utilise la web search sur le nom de l'entreprise si tu as besoin de plus d'infos)`;
  const positionPackage = calculatePackagePosition(data);
  const blocPreCalculPackage = `
# \u{1F512} PR\xC9-CALCUL PACKAGE (selon F4 V5 \u2014 d\xE9j\xE0 appliqu\xE9 c\xF4t\xE9 backend, NE PAS RECALCULER)

Le scoring de la position du package a \xE9t\xE9 calcul\xE9 en amont selon la grille terrain F4 V5. Tu utilises directement ces r\xE9sultats pour r\xE9diger la section "Lecture package" du markdown :

- **Profil F4 identifi\xE9** : ${positionPackage.profil}
- **Position du fixe (${data.package_fixe.toLocaleString("fr-FR")}\u20AC)** : ${positionPackage.positionFixe}
- **Position de l'OTE (${data.package_ote.toLocaleString("fr-FR")}\u20AC)** : ${positionPackage.positionOte}
- **Position globale du package** : ${positionPackage.positionGlobale}
- **Incoh\xE9rence ratio fixe/OTE d\xE9tect\xE9e** : ${positionPackage.incoherenceFixeOte ? "Oui \u2014 \xE0 signaler dans les alertes" : "Non"}

\u26A0\uFE0F Ces r\xE9sultats sont **autoritaires**. Tu ne recalcules pas, tu ne contestes pas, tu ne mentionnes pas leur existence dans le markdown. Tu r\xE9diges la section "Lecture package" sur la base de ces \xE9tiquettes qualitatives uniquement, en suivant les formulations impos\xE9es dans le system prompt.
`;
  return `Voici les inputs du formulaire \xE0 \xE9valuer :

# Identit\xE9 prospect
- Pr\xE9nom : ${data.prenom}
- Nom : ${data.nom}
- Email : ${data.email}
- T\xE9l\xE9phone : ${data.telephone}

# Contexte entreprise
- Entreprise : ${data.entreprise}
${siteWebLine}
- Secteur : ${secteurLabel}
- Localisation : ${data.localisation}
- Effectifs : ${data.effectifs_entreprise}
- Composition \xE9quipe Sales : ${data.equipe_sales}

# Contexte poste
- Intitul\xE9 : ${intituleLabel}
- S\xE9niorit\xE9 vis\xE9e : ${data.seniorite}
- Type de cycle : ${cycleLabel}
- Modalit\xE9 de travail : ${data.modalite_travail}

# Description des missions (champ libre, max 1000 caract\xE8res)
${data.description_missions}

# Package propos\xE9 (en \u20AC brut annuel)
- Fixe : ${data.package_fixe.toLocaleString("fr-FR")} \u20AC
- OTE total cible : ${data.package_ote.toLocaleString("fr-FR")} \u20AC

${blocPreCalculPackage}

---

G\xE9n\xE8re maintenant l'\xE9valuation compl\xE8te selon le format strict d\xE9fini dans le system prompt :
- Bloc JSON de m\xE9ta-donn\xE9es
- D\xE9limiteur \`---END_META---\` seul sur sa ligne
- Livrable Markdown des 8 sections (titre, intro, verdict, marque & secteur, mission, package, synth\xE8se & leviers, twist, CTA)

Applique les r\xE9f\xE9rentiels F1 \u2192 F2 \u2192 F3 \u2192 F4 dans l'ordre, et respecte toutes les r\xE8gles de confidentialit\xE9 (pas de mention des Tiers, des fichiers, des grilles, du score chiffr\xE9 dans le markdown).`;
}

const DELIMITER = "---END_META---";
function parseLlmResponse(rawContent) {
  const delimiterIndex = rawContent.indexOf(DELIMITER);
  if (delimiterIndex === -1) {
    return {
      success: false,
      error: "D\xE9limiteur ---END_META--- introuvable",
      markdownFallback: rawContent.trim()
    };
  }
  let jsonPart = rawContent.substring(0, delimiterIndex).trim();
  const markdownPart = rawContent.substring(delimiterIndex + DELIMITER.length).trim();
  jsonPart = jsonPart.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  let parsedJson;
  try {
    parsedJson = JSON.parse(jsonPart);
  } catch (err) {
    return {
      success: false,
      error: `JSON invalide : ${err.message}`,
      markdownFallback: markdownPart
    };
  }
  if (!markdownPart.startsWith("# \xC9valuation d'attractivit\xE9")) {
    return {
      success: true,
      data: { json: parsedJson, markdown: markdownPart }
    };
  }
  return {
    success: true,
    data: { json: parsedJson, markdown: markdownPart }
  };
}

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
function validateLlmOutput(markdown) {
  const matched = [];
  let sanitized = markdown;
  for (const pattern of FORBIDDEN_KEYWORDS) {
    const matches = markdown.match(pattern);
    if (matches) {
      matched.push(...matches);
      sanitized = sanitized.replace(pattern, "[information non communiqu\xE9e]");
    }
  }
  return { safe: matched.length === 0, matched, sanitized };
}

const generate_post = defineEventHandler(async (event) => {
  var _a;
  const startTime = Date.now();
  try {
    const body = await readBody(event);
    let validated;
    try {
      validated = formulaireOutil3SchemaRefined.parse(body);
    } catch (zodErr) {
      const issues = (zodErr == null ? void 0 : zodErr.issues) || (zodErr == null ? void 0 : zodErr.errors);
      throw createError({
        statusCode: 400,
        statusMessage: "VALIDATION_FAILED",
        message: ((_a = issues == null ? void 0 : issues[0]) == null ? void 0 : _a.message) || "Champs invalides.",
        data: { issues }
      });
    }
    const ip = getClientIp(event);
    const turnstileOk = await verifyTurnstile(validated.turnstile_token, ip);
    if (!turnstileOk) {
      throw createError({
        statusCode: 403,
        statusMessage: "TURNSTILE_FAILED",
        message: "V\xE9rification de s\xE9curit\xE9 \xE9chou\xE9e. Merci de rafra\xEEchir la page et r\xE9essayer."
      });
    }
    const rateCheck = await checkEvaluationAttractiviteRateLimit(ip);
    if (!rateCheck.allowed) {
      console.warn("[evaluation-attractivite] rate limit hit, switching to deferred", rateCheck);
      return await handleDeferredProcessing(validated, "rate_limit");
    }
    if (!hasAnthropic()) {
      if (false) ;
      console.error("[evaluation-attractivite] ANTHROPIC_API_KEY missing in production \u2014 switching to deferred");
      return await handleDeferredProcessing(validated, "api_failure");
    }
    const systemBlocks = await buildSystemBlocks();
    const userPrompt = buildUserPrompt(validated);
    let llmResult;
    try {
      llmResult = await generateEvaluationWithAnthropic({
        systemBlocks,
        userPrompt,
        maxTokens: 16e3,
        temperature: 0.15,
        maxWebSearches: 3
      });
    } catch (firstErr) {
      console.warn("[evaluation-attractivite] Anthropic first attempt failed, retrying\u2026", firstErr);
      try {
        llmResult = await generateEvaluationWithAnthropic({
          systemBlocks,
          userPrompt,
          maxTokens: 16e3,
          temperature: 0.15,
          maxWebSearches: 3
        });
      } catch (retryErr) {
        console.error("[evaluation-attractivite] Anthropic retry failed", retryErr);
        sendCriticalAlert("Anthropic API failed twice (\xC9valuation attractivit\xE9)", retryErr).catch(() => {
        });
        return await handleDeferredProcessing(validated, "api_failure");
      }
    }
    if (!llmResult.content || llmResult.content.length < 200) {
      console.error("[evaluation-attractivite] Anthropic returned suspiciously short content");
      return await handleDeferredProcessing(validated, "api_failure");
    }
    console.log("[evaluation-attractivite] cache stats", {
      cache_creation_tokens: llmResult.usage.cacheCreationTokens,
      cache_read_tokens: llmResult.usage.cacheReadTokens,
      input_tokens: llmResult.usage.inputTokens,
      output_tokens: llmResult.usage.outputTokens
    });
    const parsed = parseLlmResponse(llmResult.content);
    let llmJson = null;
    let safeMarkdown = "";
    let degraded = false;
    if (!parsed.success) {
      console.error("[evaluation-attractivite] Parse failed, fallback degraded", { error: parsed.error });
      safeMarkdown = parsed.markdownFallback || llmResult.content;
      degraded = true;
    } else {
      const jsonValidation = llmOutputJsonSchemaRefined.safeParse(parsed.data.json);
      if (!jsonValidation.success) {
        console.error("[evaluation-attractivite] JSON schema validation failed", jsonValidation.error);
        safeMarkdown = parsed.data.markdown;
        degraded = true;
      } else {
        llmJson = jsonValidation.data;
        safeMarkdown = parsed.data.markdown;
      }
      const filterResult = validateLlmOutput(safeMarkdown);
      if (!filterResult.safe) {
        console.warn("[evaluation-attractivite] Output filter triggered", { matched: filterResult.matched });
        safeMarkdown = filterResult.sanitized;
      }
    }
    const uuid = nanoid(10);
    try {
      await saveEvaluation(uuid, {
        uuid,
        json: llmJson,
        markdown: safeMarkdown,
        degraded,
        metadata: {
          prenom: validated.prenom,
          nom: validated.nom,
          entreprise: validated.entreprise,
          intitule_poste: validated.intitule_poste === "Autre" && validated.intitule_poste_precision_autre ? validated.intitule_poste_precision_autre : validated.intitule_poste,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        inputs: anonymizeInputs(validated)
      });
    } catch (kvErr) {
      console.error("[evaluation-attractivite] KV save failed", kvErr);
      sendCriticalAlert("KV saveEvaluation failed", kvErr).catch(() => {
      });
      throw createError({
        statusCode: 500,
        statusMessage: "INTERNAL_ERROR",
        message: "Une erreur est survenue. Votre \xE9valuation n'a pas pu \xEAtre enregistr\xE9e."
      });
    }
    const resultatUrl = `${getSiteUrl()}/lab/evaluation-attractivite/resultat/${uuid}`;
    const dateSoumission = formatDateFr(/* @__PURE__ */ new Date());
    const jarviSideEffect = (async () => {
      let jarviUrl2 = "";
      try {
        const emailDomain = (validated.email.split("@")[1] || "").toLowerCase();
        const existing = await findCompanyByNameOrDomain({
          name: validated.entreprise,
          emailDomain,
          websiteUrl: validated.site_web || `https://${emailDomain}`
        });
        const company = await upsertCompany(
          {
            existingCompany: existing,
            name: validated.entreprise,
            websiteUrl: validated.site_web || `https://${emailDomain}`
          },
          { retry: true }
        );
        jarviUrl2 = jarviCompanyUrl(company.id);
        const statusId = process.env.JARVI_STATUS_ID_LAB_RECUE;
        if (statusId) {
          const project = await createEvaluationAttractiviteProject(
            {
              companyId: company.id,
              name: `Lab \u2014 \xC9valuation attractivit\xE9 \u2014 ${validated.entreprise} \u2014 ${dateSoumission}`,
              statusId,
              description: buildProjectDescription(validated, uuid, llmJson)
            },
            { retry: true }
          );
          jarviUrl2 = jarviProjectUrl(project.id);
        }
      } catch (err) {
        console.error("[evaluation-attractivite] Jarvi side effect failed", err);
        sendCriticalAlert("Jarvi side effect failed (\xC9valuation attractivit\xE9)", err).catch(() => {
        });
      }
      return { jarviUrl: jarviUrl2 };
    })();
    const { jarviUrl } = await jarviSideEffect;
    const emailResults = await Promise.allSettled([
      sendBrevoEvaluationNotifInterneLivree({
        input: validated,
        uuid,
        resultatUrl,
        jarviUrl: jarviUrl || "Jarvi non cr\xE9\xE9 (v\xE9rifier alerte)",
        json: llmJson,
        dateSoumission
      }),
      sendBrevoEvaluationConfirmationProspect({
        input: validated,
        resultatUrl,
        json: llmJson
      })
    ]);
    emailResults.forEach((result, idx) => {
      if (result.status === "rejected") {
        const emailType = idx === 0 ? "notif-interne-livr\xE9e" : "confirmation-prospect";
        console.error(`[evaluation-attractivite] Brevo ${emailType} failed`, result.reason);
        sendCriticalAlert(`Brevo ${emailType} failed (\xC9valuation attractivit\xE9)`, result.reason).catch(() => {
        });
      }
    });
    const duration = Date.now() - startTime;
    console.log(`[evaluation-attractivite] Evaluation generated in ${duration}ms \u2014 uuid: ${uuid}`);
    return {
      success: true,
      deferred: false,
      uuid,
      json: llmJson,
      markdown: safeMarkdown,
      degraded,
      redirectUrl: `/lab/evaluation-attractivite/resultat/${uuid}`
    };
  } catch (err) {
    if (err == null ? void 0 : err.statusCode) throw err;
    console.error("[evaluation-attractivite] unexpected error", err);
    sendCriticalAlert("\xC9valuation attractivit\xE9 route unexpected error", err).catch(() => {
    });
    throw createError({
      statusCode: 500,
      statusMessage: "INTERNAL_ERROR",
      message: "Une erreur technique s'est produite. Merci de r\xE9essayer dans quelques minutes."
    });
  }
});
async function handleDeferredProcessing(input, reason) {
  const deferredId = nanoid(10);
  const dateSoumission = formatDateFr(/* @__PURE__ */ new Date());
  const raisonLibelle = reason === "rate_limit" ? "Rate limit atteint (3/jour ou 7/semaine par IP)" : "API Anthropic indisponible (2 tentatives \xE9chou\xE9es)";
  try {
    await saveDeferredEvaluation(deferredId, {
      formData: input,
      reason,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (err) {
    console.error("[evaluation-attractivite] saveDeferred failed (non-blocking)", err);
  }
  let jarviUrl = "";
  try {
    const emailDomain = (input.email.split("@")[1] || "").toLowerCase();
    const existing = await findCompanyByNameOrDomain({
      name: input.entreprise,
      emailDomain,
      websiteUrl: input.site_web || `https://${emailDomain}`
    });
    const company = await upsertCompany(
      {
        existingCompany: existing,
        name: input.entreprise,
        websiteUrl: input.site_web || `https://${emailDomain}`
      },
      { retry: true }
    );
    jarviUrl = jarviCompanyUrl(company.id);
    const statusId = process.env.JARVI_STATUS_ID_LAB_RECUE;
    if (statusId) {
      const tagPrefix = reason === "rate_limit" ? "Lab \u2014 Manuel - Rate limit" : "Lab \u2014 Manuel - API";
      const project = await createEvaluationAttractiviteProject(
        {
          companyId: company.id,
          name: `${tagPrefix} \u2014 \xC9valuation \u2014 ${input.entreprise} \u2014 ${dateSoumission}`,
          statusId,
          description: buildProjectDescription(input, deferredId, null, reason)
        },
        { retry: true }
      );
      jarviUrl = jarviProjectUrl(project.id);
    }
  } catch (err) {
    console.error("[evaluation-attractivite] Jarvi deferred side effect failed", err);
    sendCriticalAlert("Jarvi deferred side effect failed (\xC9valuation attractivit\xE9)", err).catch(() => {
    });
  }
  await Promise.allSettled([
    sendBrevoEvaluationNotifInterneDifferee({
      input,
      deferredId,
      raisonDiffere: raisonLibelle,
      jarviUrl: jarviUrl || "Jarvi non cr\xE9\xE9 (v\xE9rifier alerte)",
      dateSoumission
    }).catch((err) => {
      console.error("[evaluation-attractivite] notif-interne-diff\xE9r\xE9e failed", err);
      sendCriticalAlert("Brevo eval notif-interne-diff\xE9r\xE9e failed", err).catch(() => {
      });
    }),
    sendBrevoEvaluationSuiviProspect({ input }).catch((err) => {
      console.error("[evaluation-attractivite] suivi-prospect failed", err);
      sendCriticalAlert("Brevo eval suivi-prospect failed", err).catch(() => {
      });
    })
  ]);
  return {
    success: true,
    deferred: true,
    deferredId,
    message: "Votre \xE9valuation sera trait\xE9e manuellement sous 24 \xE0 48 heures ouvr\xE9es."
  };
}
function buildProjectDescription(input, refId, json, deferredReason) {
  const intituleAffiche = input.intitule_poste === "Autre" && input.intitule_poste_precision_autre ? `${input.intitule_poste} (${input.intitule_poste_precision_autre})` : input.intitule_poste;
  const lines = [
    `**Identit\xE9** : ${input.prenom} ${input.nom} \xB7 ${input.email} \xB7 ${input.telephone}`,
    `**Entreprise** : ${input.entreprise}${input.site_web ? ` \xB7 ${input.site_web}` : ""}`,
    `**Secteur** : ${input.secteur === "Autre" && input.secteur_precision_autre ? input.secteur_precision_autre : input.secteur}`,
    `**Localisation** : ${input.localisation}`,
    `**Effectifs** : ${input.effectifs_entreprise}`,
    `**\xC9quipe Sales** : ${input.equipe_sales}`,
    "",
    `**Poste** : ${intituleAffiche}`,
    `**S\xE9niorit\xE9** : ${input.seniorite}`,
    `**Cycle** : ${input.type_cycle === "Autre" && input.type_cycle_autre ? input.type_cycle_autre : input.type_cycle}`,
    `**Modalit\xE9 de travail** : ${input.modalite_travail}`,
    "",
    `**Package** : ${input.package_fixe.toLocaleString("fr-FR")} \u20AC fixe / ${input.package_ote.toLocaleString("fr-FR")} \u20AC OTE`,
    "",
    `**Description missions** :`,
    input.description_missions.slice(0, 1500),
    input.description_missions.length > 1500 ? "\u2026(tronqu\xE9)" : ""
  ];
  if (json) {
    lines.push("", `**Verdict LLM** : ${json.niveau_attractivite} (${json.jauge_position}/10)`);
    lines.push(
      `**Dimensions** : marque=${json.dimensions.marque} \xB7 secteur=${json.dimensions.secteur} \xB7 mission=${json.dimensions.mission} \xB7 package=${json.dimensions.package}`
    );
  }
  if (deferredReason) lines.push("", `\u{1F6D1} Demande diff\xE9r\xE9e (${deferredReason}). R\xE9f : ${refId}`);
  else lines.push("", `R\xE9f \xE9valuation : ${refId}`);
  return lines.filter(Boolean).join("\n");
}
function formatDateFr(d) {
  const fmt = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris"
  });
  return fmt.format(d).replace(",", " \xE0").replace(" h ", "h");
}
function getSiteUrl() {
  return (process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
}
function buildStubResponse(input) {
  const uuid = `dev-${nanoid(8)}`;
  const intituleAffiche = input.intitule_poste === "Autre" && input.intitule_poste_precision_autre ? input.intitule_poste_precision_autre : input.intitule_poste;
  const stubJson = {
    niveau_attractivite: "Attractive / align\xE9e",
    niveau_index: 3,
    jauge_position: 6,
    score_interne: 2,
    score_max: 9,
    dimensions: {
      marque: "Reconnue",
      secteur: "Stable",
      mission: "Standard",
      package: "Align\xE9"
    },
    alertes: [],
    brief_flou: false
  };
  const stubMarkdown = `# \xC9valuation d'attractivit\xE9 \u2014 ${intituleAffiche}

*Pr\xE9par\xE9e par Mariell pour ${input.entreprise}*

---

Bonjour ${input.prenom},

**[STUB DEV \u2014 pas d'appel Anthropic r\xE9el]**

Configure \`ANTHROPIC_API_KEY\` dans \`.env\` pour g\xE9n\xE9rer une vraie \xE9valuation via Claude Haiku 4.5.

## Lecture marque & secteur

Contenu placeholder.

## Lecture mission

Contenu placeholder.

## Lecture package

Contenu placeholder.

## Synth\xE8se & leviers

Contenu placeholder.`;
  return {
    success: true,
    deferred: false,
    uuid,
    json: stubJson,
    markdown: stubMarkdown,
    degraded: false,
    redirectUrl: `/lab/evaluation-attractivite/resultat/${uuid}`
  };
}

export { generate_post as default };
//# sourceMappingURL=generate.post.mjs.map
