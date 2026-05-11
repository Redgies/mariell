import { z } from 'zod'

export const llmOutputJsonSchema = z
  .object({
    niveau_attractivite: z.enum([
      'Hyper attractive',
      'Très attractive',
      'Attractive / alignée',
      'Sous-positionnée',
      'Fragile',
    ]),
    niveau_index: z.number().int().min(1).max(5),
    jauge_position: z.number().int().min(1).max(10),
    score_interne: z.number().int().min(-6).max(9),
    score_max: z.literal(9),
    dimensions: z.object({
      marque: z.string().min(1).max(50),
      secteur: z.string().min(1).max(50),
      mission: z.string().min(1).max(50),
      package: z.string().min(1).max(50),
    }),
    alertes: z.array(z.string().max(100)).max(5),
    brief_flou: z.boolean(),
  })
  .strict()

export const llmOutputJsonSchemaRefined = llmOutputJsonSchema.refine(
  (data) => {
    const expectedIndex: Record<string, number> = {
      Fragile: 1,
      'Sous-positionnée': 2,
      'Attractive / alignée': 3,
      'Très attractive': 4,
      'Hyper attractive': 5,
    }
    return data.niveau_index === expectedIndex[data.niveau_attractivite]
  },
  { message: 'Incohérence entre niveau_attractivite et niveau_index' },
)

export type LlmOutputJson = z.infer<typeof llmOutputJsonSchemaRefined>
