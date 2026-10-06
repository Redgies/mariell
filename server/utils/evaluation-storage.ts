import { kvGet, kvSet } from './kv'
import type { FormulaireOutil3 } from '../schemas/outil-3/formulaire'
import { getDimensionFonctionLabel } from '../schemas/outil-3/formulaire'
import type { LlmOutputJson } from '../schemas/outil-3/llm-output-json'

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
    dimension_fonction: string
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
    dimension_fonction: getDimensionFonctionLabel(input),
    modalite_travail: input.modalite_travail,
    package_fixe: input.package_fixe,
    package_ote: input.package_ote,
  }
}
