interface LoadedPrompts {
  systemPromptV12: string
}

let cachedPrompts: LoadedPrompts | null = null

/**
 * Charge le system prompt v12 de l'outil 2 via le storage Nitro (déclaré en
 * `nitro.serverAssets` dans nuxt.config.ts → embarqué dans le bundle Vercel).
 *
 * Cache en mémoire de l'instance — un seul read par cold start.
 */
export async function loadOutil2Prompts(): Promise<LoadedPrompts> {
  if (cachedPrompts) return cachedPrompts

  const storage = useStorage('assets:prompts-outil-2')
  const systemPromptV12 = await storage.getItem<string>('system-prompt-v12.md')
  if (!systemPromptV12) {
    throw new Error('system-prompt-v12.md introuvable dans assets:prompts-outil-2')
  }

  cachedPrompts = { systemPromptV12 }
  return cachedPrompts
}

export function clearOutil2PromptsCache(): void {
  cachedPrompts = null
}
