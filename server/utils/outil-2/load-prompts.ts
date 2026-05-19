interface LoadedPrompts {
  systemPromptV14: string
}

/**
 * Charge le system prompt v14 de l'outil 2 depuis runtimeConfig (inliné au build
 * via nuxt.config.ts → garanti embarqué dans le bundle Vercel).
 *
 * Reste async pour symétrie avec l'API attendue par le caller (`await getSystemPrompt()`).
 */
export async function loadOutil2Prompts(): Promise<LoadedPrompts> {
  const config = useRuntimeConfig()
  const systemPromptV14 = (config.prompts as { outil2V14?: string })?.outil2V14
  if (!systemPromptV14) {
    throw new Error("Prompt outil 2 v14 introuvable dans runtimeConfig — vérifie nuxt.config.ts")
  }
  return { systemPromptV14 }
}
