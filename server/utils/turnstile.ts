interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
}

export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.NUXT_TURNSTILE_SECRET_KEY

  if (!secret) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[turnstile] NUXT_TURNSTILE_SECRET_KEY missing — bypassing in dev mode')
      return true
    }
    console.error('[turnstile] secret key missing in production')
    return false
  }

  if (!token) return false

  const formData = new FormData()
  formData.append('secret', secret)
  formData.append('response', token)
  if (ip) formData.append('remoteip', ip)

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      console.error('[turnstile] siteverify HTTP', res.status)
      return false
    }
    const data = (await res.json()) as TurnstileVerifyResponse
    if (!data.success) {
      console.warn('[turnstile] failed', data['error-codes'])
    }
    return data.success === true
  } catch (err) {
    console.error('[turnstile] verify threw', err)
    return false
  }
}
