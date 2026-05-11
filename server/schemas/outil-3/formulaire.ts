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

export const TYPES_CYCLE = [
  'Outbound',
  'Inbound',
  'Mixte',
  'Account Management',
  'Sales Ops',
  'Autre',
] as const

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
    type_cycle: z.enum(TYPES_CYCLE),
    type_cycle_autre: z.string().trim().max(60).pipe(noInjection('précision du cycle')).optional(),
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
    (data) => data.type_cycle !== 'Autre' || (data.type_cycle_autre?.length ?? 0) >= 3,
    { message: 'Précisez le type de cycle (3 caractères minimum)', path: ['type_cycle_autre'] },
  )
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

export type FormulaireOutil3 = z.infer<typeof formulaireOutil3SchemaRefined>
