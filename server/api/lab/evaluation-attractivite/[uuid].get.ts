import { getEvaluation } from '../../../utils/evaluation-storage'

export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, 'uuid')

  if (!uuid || !/^[a-zA-Z0-9_-]{1,16}$/.test(uuid)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'INVALID_UUID',
      message: 'Identifiant invalide.',
    })
  }

  if (uuid.startsWith('dev-')) {
    return {
      uuid,
      json: null,
      markdown: `# Évaluation d'attractivité (stub dev)\n\n*Mode développement — pas de vraie évaluation stockée.*`,
      degraded: false,
      metadata: {
        prenom: 'Dev',
        nom: 'Stub',
        entreprise: 'Stub',
        intitule_poste: 'Stub',
        createdAt: new Date().toISOString(),
      },
    }
  }

  const data = await getEvaluation(uuid)
  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'EVALUATION_NOT_FOUND',
      message: 'Évaluation introuvable ou expirée (durée de vie : 90 jours).',
    })
  }

  return {
    uuid: data.uuid,
    json: data.json,
    markdown: data.markdown,
    degraded: data.degraded || false,
    metadata: data.metadata,
  }
})
