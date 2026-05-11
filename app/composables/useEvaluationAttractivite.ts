import type { FormulaireOutil3 } from '~~/server/schemas/outil-3/formulaire'
import type { LlmOutputJson } from '~~/server/schemas/outil-3/llm-output-json'

interface GenerateSuccess {
  success: true
  deferred: false
  uuid: string
  json: LlmOutputJson | null
  markdown: string
  degraded: boolean
  redirectUrl: string
}
interface GenerateDeferred {
  success: true
  deferred: true
  deferredId: string
  message: string
}
interface GenerateError {
  success: false
  code: string
  message: string
}

type GenerateResult = GenerateSuccess | GenerateDeferred | GenerateError

export function useEvaluationAttractivite() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const errorCode = ref<string | null>(null)

  async function generate(payload: Partial<FormulaireOutil3>): Promise<GenerateResult> {
    isLoading.value = true
    error.value = null
    errorCode.value = null

    try {
      const result = await $fetch<
        | {
            success: true
            deferred: false
            uuid: string
            json: LlmOutputJson | null
            markdown: string
            degraded: boolean
            redirectUrl: string
          }
        | { success: true; deferred: true; deferredId: string; message: string }
      >('/api/lab/evaluation-attractivite/generate', {
        method: 'POST',
        body: payload,
      })
      return result as GenerateSuccess | GenerateDeferred
    } catch (err: any) {
      const data = err?.data
      const code = data?.statusMessage || err?.statusMessage || 'INTERNAL_ERROR'
      const message =
        data?.message || err?.message || "Une erreur technique s'est produite. Merci de réessayer."
      errorCode.value = code
      error.value = message
      return { success: false, code, message }
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, errorCode, generate }
}
