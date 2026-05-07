import { z } from 'zod'

const profilOptions = [
  'SDR / BDR',
  'Business Developer Junior',
  'Account Executive Junior',
  'Sales Ops Junior',
  'Autre',
] as const

const dateDemarrageOptions = [
  'ASAP',
  'Sous 1 à 2 mois',
  'Sous 3 à 6 mois',
  'Flexible',
] as const

export const stageAlternanceSchema = z
  .object({
    // --- Bloc Contact ---
    prenom: z.string().trim().min(1, 'Ce champ est requis.').max(50),
    nom: z.string().trim().min(1, 'Ce champ est requis.').max(50),
    email: z.string().trim().toLowerCase().email("Format d'email invalide."),
    telephone: z.string().trim().min(8, 'Numéro de téléphone invalide.').max(20),

    // --- Bloc Entreprise ---
    entreprise: z.string().trim().min(2, 'Ce champ est requis.').max(100),
    urlEntreprise: z
      .string()
      .trim()
      .min(3)
      .max(300)
      .transform((v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`))
      .pipe(z.string().url('Lien invalide.')),

    // --- Bloc Besoin ---
    typeContrat: z.enum(['Stage', 'Alternance']),
    profilRecherche: z.enum(profilOptions),
    profilRecherchePrecisionAutre: z.string().trim().max(60).optional(),
    dateDemarrage: z.enum(dateDemarrageOptions),
    localisation: z.string().trim().min(2).max(150),
    briefMission: z
      .string()
      .trim()
      .min(20, 'Brief trop court — 20 caractères minimum.')
      .max(500, '500 caractères maximum.'),

    // --- Conformité ---
    consentementRgpd: z.literal(true, {
      error: () => 'Vous devez accepter la politique de confidentialité pour continuer.',
    }),

    // --- Anti-bot ---
    company_website: z.string().max(0).optional(), // honeypot — must stay empty
    turnstileToken: z.string().min(1),
  })
  .refine(
    (data) => data.profilRecherche !== 'Autre' || (data.profilRecherchePrecisionAutre?.length ?? 0) >= 1,
    {
      message: 'Précisez le profil recherché (60 caractères max).',
      path: ['profilRecherchePrecisionAutre'],
    },
  )

export type StageAlternanceInput = z.infer<typeof stageAlternanceSchema>
