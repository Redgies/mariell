import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

interface LoadedPrompts {
  systemPromptV12: string
}

let cachedPrompts: LoadedPrompts | null = null

/**
 * Charge le system prompt v12 de l'outil 2 en mémoire (une seule fois au boot).
 * Pattern identique à load-prompts.ts de l'outil 3.
 */
export async function loadOutil2Prompts(): Promise<LoadedPrompts> {
  if (cachedPrompts) return cachedPrompts

  const promptsDir = join(process.cwd(), 'server', 'prompts', 'outil-2')
  const systemPromptV12 = await readFile(join(promptsDir, 'system-prompt-v12.md'), 'utf-8')

  cachedPrompts = { systemPromptV12 }
  return cachedPrompts
}

export function clearOutil2PromptsCache(): void {
  cachedPrompts = null
}
