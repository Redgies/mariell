import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

interface LoadedPrompts {
  systemPromptV9: string
  f1: string
  f2: string
  f3: string
  f4: string
}

let cachedPrompts: LoadedPrompts | null = null

/**
 * Charge les 5 fichiers prompts de l'outil 3 en mémoire (une seule fois au boot).
 * Appelée par buildSystemBlocks().
 */
export async function loadOutil3Prompts(): Promise<LoadedPrompts> {
  if (cachedPrompts) return cachedPrompts

  const promptsDir = join(process.cwd(), 'server', 'prompts', 'outil-3')

  const [systemPromptV9, f1, f2, f3, f4] = await Promise.all([
    readFile(join(promptsDir, 'system-prompt-v9.md'), 'utf-8'),
    readFile(join(promptsDir, 'f1-boites-intouchables-v7.md'), 'utf-8'),
    readFile(join(promptsDir, 'f2-grille-secteurs-v3.md'), 'utf-8'),
    readFile(join(promptsDir, 'f3-typologie-missions-v5.md'), 'utf-8'),
    readFile(join(promptsDir, 'f4-addendum-salaires-v5.md'), 'utf-8'),
  ])

  cachedPrompts = { systemPromptV9, f1, f2, f3, f4 }
  return cachedPrompts
}

export function clearOutil3PromptsCache(): void {
  cachedPrompts = null
}
