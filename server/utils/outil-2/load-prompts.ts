interface LoadedPrompts {
  systemPromptV12: string
}

/**
 * Charge le system prompt v12 de l'outil 2 depuis runtimeConfig (inliné au build
 * via nuxt.config.ts → garanti embarqué dans le bundle Vercel).
 *
 * Reste async pour symétrie avec l'API attendue par le caller (`await getSystemPrompt()`).
 */
export async function loadOutil2Prompts(): Promise<LoadedPrompts> {
  const config = useRuntimeConfig()
  const systemPromptV12 = (config.prompts as { outil2V12?: string })?.outil2V12
  if (!systemPromptV12) {
    throw new Error("Prompt outil 2 v12 introuvable dans runtimeConfig — vérifie nuxt.config.ts")
  }
  return { systemPromptV12 }
}
