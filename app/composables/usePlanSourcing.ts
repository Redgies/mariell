import type { PlanDeSourcingInput } from '~~/server/schemas/plan-de-sourcing'

interface GenerateSuccess {
  success: true
  deferred: false
  uuid: string
  plan: string
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

export function usePlanSourcing() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const errorCode = ref<string | null>(null)

  async function generate(payload: Partial<PlanDeSourcingInput>): Promise<GenerateResult> {
    isLoading.value = true
    error.value = null
    errorCode.value = null

    try {
      const result = await $fetch<
        | { success: true; deferred: false; uuid: string; plan: string; redirectUrl: string }
        | { success: true; deferred: true; deferredId: string; message: string }
      >('/api/lab/plan-de-sourcing/generate', {
        method: 'POST',
        body: payload,
      })
      if (result.deferred) {
        return result
      }
      return { success: true, deferred: false, ...result } as GenerateSuccess
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
