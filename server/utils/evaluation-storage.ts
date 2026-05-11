import { Redis } from '@upstash/redis'
import type { FormulaireOutil3 } from '../schemas/outil-3/formulaire'
import type { LlmOutputJson } from '../schemas/outil-3/llm-output-json'

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
      try {
        return JSON.parse(raw) as T
      } catch {
        return raw as unknown as T
      }
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
// Évaluation persistée (TTL 90 jours)
// ============================================================

export interface EvaluationRecord {
  uuid: string
  json: LlmOutputJson | null
  markdown: string
  degraded?: boolean
  metadata: {
    prenom: string
    nom: string
    entreprise: string
    intitule_poste: string
    createdAt: string
  }
  /** inputs anonymisés — on garde uniquement ce qui est utile au LLM, pas les coordonnées */
  inputs: {
    secteur: string
    seniorite: string
    type_cycle: string
    modalite_travail: string
    package_fixe: number
    package_ote: number
  }
}

const EVAL_TTL_SECONDS = 90 * 86_400

export async function saveEvaluation(uuid: string, record: EvaluationRecord): Promise<void> {
  await kvSet(`eval:${uuid}`, record, EVAL_TTL_SECONDS)
}

export async function getEvaluation(uuid: string): Promise<EvaluationRecord | null> {
  return kvGet<EvaluationRecord>(`eval:${uuid}`)
}

// ============================================================
// Status de génération (utilisé par le polling front pendant ~60s)
// ============================================================

export type EvaluationGenerationStatus =
  | { status: 'pending'; updatedAt: string }
  | { status: 'done'; updatedAt: string }
  | { status: 'deferred'; updatedAt: string; deferredId: string }
  | { status: 'error'; updatedAt: string; errorCode: string; errorMessage: string }

const STATUS_TTL_SECONDS = 10 * 60

export async function saveEvaluationStatus(uuid: string, status: EvaluationGenerationStatus): Promise<void> {
  await kvSet(`eval-status:${uuid}`, status, STATUS_TTL_SECONDS)
}

export async function getEvaluationStatus(uuid: string): Promise<EvaluationGenerationStatus | null> {
  return kvGet<EvaluationGenerationStatus>(`eval-status:${uuid}`)
}

// ============================================================
// Demande différée (rate limit ou API en panne — TTL 7 jours)
// ============================================================

export interface DeferredEvaluationRecord {
  formData: FormulaireOutil3
  reason: 'rate_limit' | 'api_failure'
  createdAt: string
}

const DEFERRED_TTL_SECONDS = 7 * 86_400

export async function saveDeferredEvaluation(
  deferredId: string,
  record: DeferredEvaluationRecord,
): Promise<void> {
  await kvSet(`eval-deferred:${deferredId}`, record, DEFERRED_TTL_SECONDS)
}

export function anonymizeInputs(input: FormulaireOutil3): EvaluationRecord['inputs'] {
  return {
    secteur:
      input.secteur === 'Autre' && input.secteur_precision_autre
        ? `${input.secteur} (${input.secteur_precision_autre})`
        : input.secteur,
    seniorite: input.seniorite,
    type_cycle:
      input.type_cycle === 'Autre' && input.type_cycle_autre
        ? `${input.type_cycle} (${input.type_cycle_autre})`
        : input.type_cycle,
    modalite_travail: input.modalite_travail,
    package_fixe: input.package_fixe,
    package_ote: input.package_ote,
  }
}
