import { Redis } from '@upstash/redis'
import type { PlanDeSourcingInput } from '../schemas/plan-de-sourcing'

let redis: Redis | null = null
const memoryStore = new Map<string, { value: unknown; expires: number }>()

function kvCreds() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return { url, token }
}

function getRedis(): Redis | null {
  const creds = kvCreds()
  if (!creds) return null
  if (!redis) redis = new Redis({ url: creds.url, token: creds.token })
  return redis
}

async function kvSet(key: string, value: unknown, ttlSeconds: number) {
  const r = getRedis()
  if (r) {
    await r.set(key, JSON.stringify(value), { ex: ttlSeconds })
    return
  }
  memoryStore.set(key, { value, expires: Date.now() + ttlSeconds * 1000 })
}

async function kvGet<T>(key: string): Promise<T | null> {
  const r = getRedis()
  if (r) {
    const raw = await r.get<string | null>(key)
    if (!raw) return null
    if (typeof raw === 'string') {
      try { return JSON.parse(raw) as T } catch { return raw as unknown as T }
    }
    return raw as T
  }
  const entry = memoryStore.get(key)
  if (!entry || entry.expires < Date.now()) {
    memoryStore.delete(key)
    return null
  }
  return entry.value as T
}

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
