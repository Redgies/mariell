import { z } from 'zod'

const POSTE_OPTIONS = [
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

const SECTEUR_OPTIONS = [
  'SaaS B2B',
  'Conseil IT / ESN',
  'Industrie / B2B classique',
  'Cyber / Sécurité',
  'Fintech',
  'Healthtech',
  'Services',
  'Autre',
] as const

const SENIORITE_OPTIONS = ['Junior', 'Confirmé', 'Senior', 'Lead-Manager'] as const

const OBJECTIF_OPTIONS = [
  'Gestion portefeuille clients',
  'Développement et chasse',
  'Ouverture de nouvelle verticale',
  "Création et management d'équipe",
] as const

export const planDeSourcingSchema = z
  .object({
    // Bloc 01 — Identité
    prenom: z.string().trim().min(2).max(40),
    nom: z.string().trim().min(2).max(40),
    email: z.string().trim().toLowerCase().email(),
    telephone: z.string().trim().min(8).max(20),
    entreprise: z.string().trim().min(2).max(100),

    // Bloc 02 — Le poste
    posteRecherche: z.enum(POSTE_OPTIONS),
    posteRecherchePrecisionAutre: z.string().trim().max(60).optional(),
    seniorite: z.enum(SENIORITE_OPTIONS),
    objectifPoste: z.enum(OBJECTIF_OPTIONS),
    localisation: z.string().trim().min(2).max(100),
    remotePossible: z.boolean(),

    // Bloc 03 — Le contexte
    secteur: z.enum(SECTEUR_OPTIONS),
    secteurPrecisionAutre: z.string().trim().max(60).optional(),
    fixe: z.number().int().min(15000).max(500000),
    ote: z.number().int().min(0).max(800000),

    // Bloc 04 — Pour aller plus loin (optionnels)
    siteEntreprise: z
      .string()
      .trim()
      .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v))
      .pipe(z.union([z.literal(''), z.string().url()]))
      .optional(),
    contenuFichePoste: z.string().trim().max(5000).optional(),

    // Conformité
    consentementRgpd: z.literal(true, {
      error: () => 'Vous devez accepter la politique de confidentialité.',
    }),

    // Anti-bot
    turnstileToken: z.string().min(1),
  })
  .refine((data) => data.ote >= data.fixe, {
    message: "L'OTE doit être supérieur ou égal au fixe.",
    path: ['ote'],
  })
  .refine(
    (data) => data.posteRecherche !== 'Autre' || (data.posteRecherchePrecisionAutre?.length ?? 0) >= 1,
    { message: "Précisez l'intitulé du poste.", path: ['posteRecherchePrecisionAutre'] },
  )
  .refine(
    (data) => data.secteur !== 'Autre' || (data.secteurPrecisionAutre?.length ?? 0) >= 1,
    { message: 'Précisez votre secteur.', path: ['secteurPrecisionAutre'] },
  )

export type PlanDeSourcingInput = z.infer<typeof planDeSourcingSchema>
