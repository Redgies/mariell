interface LoadedPrompts {
  systemPromptV9: string
  f1: string
  f2: string
  f3: string
  f4: string
}

let cachedPrompts: LoadedPrompts | null = null

/**
 * Charge les 5 fichiers prompts de l'outil 3 via le storage Nitro (déclaré en
 * `nitro.serverAssets` dans nuxt.config.ts → embarqué dans le bundle Vercel).
 *
 * Appelée par buildSystemBlocks(). Cache mémoire = un seul read par cold start.
 */
export async function loadOutil3Prompts(): Promise<LoadedPrompts> {
  if (cachedPrompts) return cachedPrompts

  const storage = useStorage('assets:prompts-outil-3')

  const [systemPromptV9, f1, f2, f3, f4] = await Promise.all([
    storage.getItem<string>('system-prompt-v9.md'),
    storage.getItem<string>('f1-boites-intouchables-v7.md'),
    storage.getItem<string>('f2-grille-secteurs-v3.md'),
    storage.getItem<string>('f3-typologie-missions-v5.md'),
    storage.getItem<string>('f4-addendum-salaires-v5.md'),
  ])

  if (!systemPromptV9 || !f1 || !f2 || !f3 || !f4) {
    throw new Error('Un ou plusieurs fichiers prompts outil-3 introuvables dans assets:prompts-outil-3')
  }

  cachedPrompts = { systemPromptV9, f1, f2, f3, f4 }
  return cachedPrompts
}

export function clearOutil3PromptsCache(): void {
  cachedPrompts = null
}
