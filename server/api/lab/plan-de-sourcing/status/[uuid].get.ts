import { getPlanStatus, getPlan } from '../../../../utils/plan-storage'

const UUID_RE = /^[a-zA-Z0-9_-]{8,20}$/

export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, 'uuid')
  if (!uuid || !UUID_RE.test(uuid)) {
    throw createError({ statusCode: 400, statusMessage: 'INVALID_UUID' })
  }

  const status = await getPlanStatus(uuid)
  if (status) return status

  // Status absent (TTL 10min expiré). Si le plan existe en persistance, on retourne 'done'
  // — utile quand le polling arrive après un long délai ou après un refresh.
  const plan = await getPlan(uuid)
  if (plan) {
    return {
      status: 'done' as const,
      updatedAt: plan.metadata.createdAt,
    }
  }

  throw createError({ statusCode: 404, statusMessage: 'NOT_FOUND' })
})
