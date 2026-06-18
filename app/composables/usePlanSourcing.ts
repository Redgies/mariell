import { nanoid } from 'nanoid'
import type { PlanDeSourcingInput } from '~~/server/schemas/plan-de-sourcing'

interface SubmitResult {
  uuid: string
  immediateError?: { code: string; message: string }
}

const FAST_FAIL_WINDOW_MS = 800

export function usePlanSourcing() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const errorCode = ref<string | null>(null)

  /**
   * Fire-and-forget submit : génère un uuid côté client, lance le POST sans bloquer,
   * et résout au bout de FAST_FAIL_WINDOW_MS (ou plus tôt si une erreur immédiate arrive
   * type Turnstile/Validation). Tout le reste (deferred, done, erreur LLM) est observé
   * via le polling /status/[uuid] sur la page résultat.
   */
  async function submit(payload: Partial<PlanDeSourcingInput>): Promise<SubmitResult> {
    const requestUuid = nanoid(10)
    isLoading.value = true
    error.value = null
    errorCode.value = null

    let immediateError: SubmitResult['immediateError']

    const fetchPromise = $fetch('/api/lab/plan-de-sourcing/generate', {
      method: 'POST',
      body: { ...payload, request_uuid: requestUuid },
    })
      .then(() => {
        // success path — résultat est déjà persisté côté serveur, le polling l’attrapera
      })
      .catch((err: any) => {
        const data = err?.data
        const code = data?.statusMessage || err?.statusMessage
        if (code === 'TURNSTILE_FAILED' || code === 'VALIDATION_FAILED' || code === 'INVALID_UUID') {
          immediateError = {
            code,
            message: data?.message || err?.message || 'Erreur de validation.',
          }
        } else {
          // Erreur tardive (réseau coupé, 500 LLM, etc.) → polling status='error' la prendra
          console.warn('[plan-sourcing] fetch rejected (handled by polling)', err)
        }
      })

    await Promise.race([
      fetchPromise,
      new Promise((resolve) => setTimeout(resolve, FAST_FAIL_WINDOW_MS)),
    ])

    isLoading.value = false
    return { uuid: requestUuid, immediateError }
  }

  return { isLoading, error, errorCode, submit }
}
