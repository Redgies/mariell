interface LoadedPrompts {
  systemPromptV13: string
}

/**
 * Charge le system prompt v13 de l'outil 2 depuis runtimeConfig (inliné au build
 * via nuxt.config.ts → garanti embarqué dans le bundle Vercel).
 *
 * Reste async pour symétrie avec l'API attendue par le caller (`await getSystemPrompt()`).
 */
export async function loadOutil2Prompts(): Promise<LoadedPrompts> {
  const config = useRuntimeConfig()
  const systemPromptV13 = (config.prompts as { outil2V13?: string })?.outil2V13
  if (!systemPromptV13) {
    throw new Error("Prompt outil 2 v13 introuvable dans runtimeConfig — vérifie nuxt.config.ts")
  }
  return { systemPromptV13 }
}
