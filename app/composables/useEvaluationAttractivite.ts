import { nanoid } from 'nanoid'
import type { FormulaireOutil3 } from '~~/server/schemas/outil-3/formulaire'

interface SubmitResult {
  uuid: string
  immediateError?: { code: string; message: string }
}

const FAST_FAIL_WINDOW_MS = 800

export function useEvaluationAttractivite() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const errorCode = ref<string | null>(null)

  async function submit(payload: Partial<FormulaireOutil3>): Promise<SubmitResult> {
    const requestUuid = nanoid(10)
    isLoading.value = true
    error.value = null
    errorCode.value = null

    let immediateError: SubmitResult['immediateError']

    const fetchPromise = $fetch('/api/lab/evaluation-attractivite/generate', {
      method: 'POST',
      body: { ...payload, request_uuid: requestUuid },
    })
      .then(() => {})
      .catch((err: any) => {
        const data = err?.data
        const code = data?.statusMessage || err?.statusMessage
        if (code === 'TURNSTILE_FAILED' || code === 'VALIDATION_FAILED' || code === 'INVALID_UUID') {
          immediateError = {
            code,
            message: data?.message || err?.message || 'Erreur de validation.',
          }
        } else {
          console.warn('[evaluation-attractivite] fetch rejected (handled by polling)', err)
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
