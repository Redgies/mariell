import { getEvaluationStatus, getEvaluation } from '../../../../utils/evaluation-storage'

const UUID_RE = /^[a-zA-Z0-9_-]{8,20}$/

export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, 'uuid')
  if (!uuid || !UUID_RE.test(uuid)) {
    throw createError({ statusCode: 400, statusMessage: 'INVALID_UUID' })
  }

  const status = await getEvaluationStatus(uuid)
  if (status) return status

  // Status TTL expiré : si l'évaluation a été persistée, retourner 'done'.
  const evaluation = await getEvaluation(uuid)
  if (evaluation) {
    return {
      status: 'done' as const,
      updatedAt: evaluation.metadata.createdAt,
    }
  }

  throw createError({ statusCode: 404, statusMessage: 'NOT_FOUND' })
})
