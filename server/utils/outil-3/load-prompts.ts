interface LoadedPrompts {
  systemPromptV12: string
  f1: string
  f2: string
  f3: string
  f4: string
}

interface PromptsConfig {
  outil3SystemV12?: string
  outil3F1?: string
  outil3F2?: string
  outil3F3?: string
  outil3F4?: string
}

/**
 * Charge les 5 fichiers prompts de l'outil 3 depuis runtimeConfig (inlinés au build
 * via nuxt.config.ts → garantis embarqués dans le bundle Vercel).
 */
export async function loadOutil3Prompts(): Promise<LoadedPrompts> {
  const config = useRuntimeConfig()
  const p = (config.prompts || {}) as PromptsConfig

  const systemPromptV12 = p.outil3SystemV12
  const f1 = p.outil3F1
  const f2 = p.outil3F2
  const f3 = p.outil3F3
  const f4 = p.outil3F4

  if (!systemPromptV12 || !f1 || !f2 || !f3 || !f4) {
    throw new Error('Un ou plusieurs prompts outil 3 introuvables dans runtimeConfig — vérifie nuxt.config.ts')
  }

  return { systemPromptV12, f1, f2, f3, f4 }
}
