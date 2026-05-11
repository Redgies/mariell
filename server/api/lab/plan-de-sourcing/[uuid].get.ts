import { getPlan } from '../../../utils/plan-storage'

export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, 'uuid')

  if (!uuid || !/^[a-zA-Z0-9_-]{1,16}$/.test(uuid)) {
    throw createError({ statusCode: 400, statusMessage: 'INVALID_UUID', message: 'Identifiant invalide.' })
  }

  // Dev-mode stub support: if uuid starts with "dev-", return a placeholder plan
  // (the generate route returns these when ANTHROPIC_API_KEY is missing).
  if (uuid.startsWith('dev-')) {
    return {
      content: `# Plan de sourcing LinkedIn (stub dev)\n\n*Mode développement — pas de vrai plan stocké.*`,
      metadata: {
        prenom: 'Dev',
        nom: 'Stub',
        entreprise: 'Stub',
        posteRecherche: 'Stub',
        createdAt: new Date().toISOString(),
      },
    }
  }

  const planData = await getPlan(uuid)
  if (!planData) {
    throw createError({
      statusCode: 404,
      statusMessage: 'PLAN_NOT_FOUND',
      message: 'Plan introuvable ou expiré (durée de vie : 90 jours).',
    })
  }

  return {
    content: planData.content,
    metadata: planData.metadata,
  }
})
