import { kvGet, kvSet } from './kv'
import type { PlanDeSourcingInput } from '../schemas/plan-de-sourcing'

// ============================================================
// Plan persisté (cas nominal — TTL 90 jours)
// ============================================================

export interface PlanRecord {
  content: string // markdown généré par Claude
  metadata: {
    prenom: string
    nom: string
    entreprise: string
    posteRecherche: string
    createdAt: string // ISO
  }
  formData: PlanDeSourcingInput
}

const PLAN_TTL_SECONDS = 90 * 86_400 // 90 days

export async function savePlan(uuid: string, record: PlanRecord): Promise<void> {
  await kvSet(`plan:${uuid}`, record, PLAN_TTL_SECONDS)
}

export async function getPlan(uuid: string): Promise<PlanRecord | null> {
  return kvGet<PlanRecord>(`plan:${uuid}`)
}

// ============================================================
// Status de génération (utilisé par le polling front pendant ~60s)
// ============================================================

export type PlanGenerationStatus =
  | { status: 'pending'; updatedAt: string }
  | { status: 'done'; updatedAt: string }
  | { status: 'deferred'; updatedAt: string; deferredId: string }
  | { status: 'error'; updatedAt: string; errorCode: string; errorMessage: string }

const STATUS_TTL_SECONDS = 10 * 60 // 10 min — le polling ne devrait jamais dépasser ~75s

export async function savePlanStatus(uuid: string, status: PlanGenerationStatus): Promise<void> {
  await kvSet(`plan-status:${uuid}`, status, STATUS_TTL_SECONDS)
}

export async function getPlanStatus(uuid: string): Promise<PlanGenerationStatus | null> {
  return kvGet<PlanGenerationStatus>(`plan-status:${uuid}`)
}

// ============================================================
// Demandes différées (rate limit ou Anthropic en panne — TTL 7 jours)
// ============================================================

export interface DeferredRecord {
  formData: PlanDeSourcingInput
  reason: 'rate_limit' | 'api_failure'
  createdAt: string // ISO
}

const DEFERRED_TTL_SECONDS = 7 * 86_400 // 7 days

export async function saveDeferred(deferredId: string, record: DeferredRecord): Promise<void> {
  await kvSet(`deferred:${deferredId}`, record, DEFERRED_TTL_SECONDS)
}
