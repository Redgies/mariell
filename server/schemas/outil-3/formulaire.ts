import { z } from 'zod'
import { containsInjectionPattern } from '../../utils/outil-3/injection-patterns'

const noInjection = (fieldName: string) =>
  z.string().refine((val) => !containsInjectionPattern(val), {
    message: `Le champ ${fieldName} contient un format non autorisé.`,
  })

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
  'Autre',
] as const

export const SECTEURS_ENTREPRISE = [
  'SaaS B2B',
  'Conseil IT / ESN',
  'Industrie / B2B classique',
  'Cyber / Sécurité',
  'Fintech',
  'Healthtech',
  'Services',
  'Autre',
] as const

export const SENIORITES = [
  'Junior 0-2 ans',
  'Confirmé 2-5 ans',
  'Senior 5-8 ans',
  'Lead 8+ ans',
] as const

// V12 — champ conditionnel piloté par l'intitulé de poste (remplace l'ancien « Type de cycle » unique).
export const TYPES_ACQUISITION = [
  'Outbound',
  'Inbound',
  'Mixte',
  'Poste sans acquisition directe',
] as const

export const NATURES_FONCTION = [
  'Gestion de comptes (rétention, upsell, expansion)',
  'Customer Success (satisfaction, renouvellement)',
  'Avant-vente / Sales Engineering (support technique)',
  'Sales Ops / RevOps (outillage & process)',
  'Channel / Partenariats (animation réseau)',
] as const

export const DIMENSIONS_MANAGERIALES = [
  "Construction & recrutement d'équipe",
  'Coaching & montée en compétence',
  'Structuration (process, outils, méthode)',
  'Pilotage de la performance (KPIs, forecast)',
] as const

export type FamilleFonction = 'acquisition' | 'gestion' | 'direction' | 'charniere' | 'autre'

/**
 * Déduit la famille de poste depuis l'intitulé — pilote quel champ conditionnel
 * (type_acquisition / nature_fonction / dimension_manageriale / nature_poste_autre) est requis.
 */
export function getFamilleFonction(intitule: (typeof POSTES_RECHERCHES)[number]): FamilleFonction {
  switch (intitule) {
    case 'SDR / BDR':
    case 'Inside Sales':
    case 'Field Sales / Outside Sales':
    case 'Business Developer Full Cycle':
    case 'Account Executive — PME / SMB':
    case 'Account Executive — Mid-Market':
    case 'Account Executive — Enterprise':
      return 'acquisition'
    case 'Sales Engineer / Pre-Sales':
    case 'Account Manager':
    case 'Strategic Account Manager / Key Account Manager':
    case 'Customer Success Manager':
    case 'Sales Ops / RevOps':
    case 'Channel / Partner Manager':
      return 'gestion'
    case 'VP Sales / CRO':
      return 'direction'
    case 'Sales Manager / Team Lead':
    case 'Head of Sales':
      return 'charniere'
    case 'Autre':
    default:
      return 'autre'
  }
}

export const MODALITES_TRAVAIL = [
  'Full remote',
  'Hybride flexible (1-2 jours bureau / sem)',
  'Hybride équilibré (3 jours bureau / sem)',
  'Présentiel (4-5 jours bureau / sem)',
] as const

export const formulaireOutil3SchemaRefined = z
  .object({
    // Identité
    prenom: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Caractères non autorisés dans le prénom'),
    nom: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Caractères non autorisés dans le nom'),
    email: z.string().trim().toLowerCase().email().max(150),
    telephone: z
      .string()
      .trim()
      .min(8)
      .max(20)
      .regex(/^[+\d\s().-]+$/, 'Format de numéro invalide'),

    // Entreprise
    entreprise: z.string().trim().min(2).max(100).pipe(noInjection('entreprise')),
    site_web: z
      .string()
      .trim()
      .max(200)
      .optional()
      .or(z.literal(''))
      .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v))
      .pipe(z.union([z.literal(''), z.string().url(), z.undefined()])),
    secteur: z.enum(SECTEURS_ENTREPRISE),
    secteur_precision_autre: z.string().trim().max(60).pipe(noInjection('précision du secteur')).optional(),
    localisation: z.string().trim().min(2).max(100).pipe(noInjection('localisation')),
    effectifs_entreprise: z.string().trim().min(1).max(50).pipe(noInjection('effectifs')),
    equipe_sales: z.string().trim().min(3).max(300).pipe(noInjection('équipe Sales')),

    // Poste
    intitule_poste: z.enum(POSTES_RECHERCHES),
    intitule_poste_precision_autre: z
      .string()
      .trim()
      .max(60)
      .pipe(noInjection("précision de l'intitulé"))
      .optional(),
    seniorite: z.enum(SENIORITES),
    // Champ conditionnel V12 — piloté par la famille de l'intitulé (cf. getFamilleFonction + superRefine).
    type_acquisition: z.enum(TYPES_ACQUISITION).nullable().optional(),
    nature_fonction: z.enum(NATURES_FONCTION).nullable().optional(),
    dimension_manageriale: z.array(z.enum(DIMENSIONS_MANAGERIALES)).min(1).max(2).nullable().optional(),
    nature_poste_autre: z.string().trim().max(80).pipe(noInjection('nature du poste')).nullable().optional(),
    modalite_travail: z.enum(MODALITES_TRAVAIL),
    description_missions: z.string().trim().min(50).max(1000).pipe(noInjection('description des missions')),

    // Package
    package_fixe: z.number().int().min(15000).max(500000),
    package_ote: z.number().int().min(0).max(800000),

    // Conformité
    consentement_rgpd: z.literal(true, {
      error: () => 'Le consentement RGPD est obligatoire',
    }),
    turnstile_token: z.string().min(1).max(2048),
  })
  .refine(
    (data) => data.intitule_poste !== 'Autre' || (data.intitule_poste_precision_autre?.length ?? 0) >= 3,
    {
      message: "Précisez l'intitulé de poste (3 caractères minimum)",
      path: ['intitule_poste_precision_autre'],
    },
  )
  .refine(
    (data) => data.secteur !== 'Autre' || (data.secteur_precision_autre?.length ?? 0) >= 3,
    { message: 'Précisez le secteur (3 caractères minimum)', path: ['secteur_precision_autre'] },
  )
  // Validation croisée V12 — le champ conditionnel requis dépend de la famille de l'intitulé.
  .superRefine((data, ctx) => {
    switch (getFamilleFonction(data.intitule_poste)) {
      case 'acquisition':
        if (data.type_acquisition == null || data.type_acquisition === 'Poste sans acquisition directe') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['type_acquisition'],
            message: "Précisez le type d'acquisition (Outbound, Inbound ou Mixte).",
          })
        }
        break
      case 'gestion':
        if (data.nature_fonction == null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['nature_fonction'],
            message: 'Précisez la nature de la fonction.',
          })
        }
        break
      case 'direction':
        if (!Array.isArray(data.dimension_manageriale) || data.dimension_manageriale.length < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['dimension_manageriale'],
            message: 'Sélectionnez 1 à 2 dimensions managériales.',
          })
        }
        break
      case 'charniere':
        if (!Array.isArray(data.dimension_manageriale) || data.dimension_manageriale.length < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['dimension_manageriale'],
            message: 'Sélectionnez 1 à 2 dimensions managériales.',
          })
        }
        if (data.type_acquisition == null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['type_acquisition'],
            message: "Précisez l'acquisition directe attendue sur ce poste.",
          })
        }
        break
      case 'autre':
        if ((data.nature_poste_autre?.length ?? 0) < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['nature_poste_autre'],
            message: 'Précisez la nature du poste (2 caractères minimum).',
          })
        }
        break
    }
  })

export type FormulaireOutil3 = z.infer<typeof formulaireOutil3SchemaRefined>

/**
 * Ligne « dimension fonction » consolidée, au format exact attendu par le system prompt V12
 * (cf. table des familles). Réutilisée par le user prompt, la notif interne, Brevo et le stockage.
 */
export function getDimensionFonctionLabel(data: FormulaireOutil3): string {
  switch (getFamilleFonction(data.intitule_poste)) {
    case 'acquisition':
      return `Type d'acquisition : ${data.type_acquisition ?? '—'}`
    case 'gestion':
      return `Nature de la fonction : ${data.nature_fonction ?? '—'}`
    case 'direction':
      return `Dimension(s) managériale(s) : ${(data.dimension_manageriale ?? []).join(' + ') || '—'}`
    case 'charniere': {
      const dims = (data.dimension_manageriale ?? []).join(' + ') || '—'
      return `Dimension(s) managériale(s) : ${dims} ; Acquisition directe : ${data.type_acquisition ?? '—'}`
    }
    case 'autre':
      return `Nature du poste (précisée) : ${data.nature_poste_autre ?? '—'}`
    default:
      return '—'
  }
}
