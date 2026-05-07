import type { StageAlternanceInput } from '~~/server/schemas/stage-alternance'

interface SubmitSuccess {
  success: true
}
interface SubmitError {
  success: false
  code: string
  message: string
}

export function useStageAlternance() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const errorCode = ref<string | null>(null)

  async function submit(payload: Partial<StageAlternanceInput>): Promise<SubmitSuccess | SubmitError> {
    isLoading.value = true
    error.value = null
    errorCode.value = null

    try {
      const result = await $fetch<{ success: boolean; redirectUrl: string }>(
        '/api/lab/stage-alternance',
        { method: 'POST', body: payload },
      )
      await navigateTo(result.redirectUrl)
      return { success: true }
    } catch (err: any) {
      const data = err?.data
      const code = data?.statusMessage || err?.statusMessage || 'INTERNAL_ERROR'
      const message =
        data?.message ||
        err?.message ||
        "Une erreur technique s'est produite. Merci de réessayer."
      errorCode.value = code
      error.value = message
      return { success: false, code, message }
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, errorCode, submit }
}
