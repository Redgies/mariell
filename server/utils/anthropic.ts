import Anthropic from '@anthropic-ai/sdk'

let client: Anthropic | null = null

export const ANTHROPIC_MODEL = 'claude-haiku-4-5'

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) throw new Error('[anthropic] ANTHROPIC_API_KEY missing')
    client = new Anthropic({ apiKey })
  }
  return client
}

interface GeneratePlanOptions {
  systemPrompt: string
  userPrompt: string
  maxTokens?: number
  temperature?: number
}

/**
 * Streams from Anthropic and buffers the full text server-side.
 * The form animation is rendered client-side (loader 30s+ in 6 steps),
 * so we don't pipe the stream to the browser — we wait for the complete
 * text and return it in the API response.
 *
 * `cache_control: ephemeral` on the system prompt: the V10 prompt is ~3000 words.
 * Cached on first call, reused on subsequent calls within the cache window
 * → significant token cost savings.
 */
export async function generatePlanWithAnthropic(opts: GeneratePlanOptions): Promise<string> {
  const stream = await getClient().messages.stream({
    model: ANTHROPIC_MODEL,
    max_tokens: opts.maxTokens ?? 12000,
    temperature: opts.temperature ?? 0.2,
    system: [
      {
        type: 'text',
        text: opts.systemPrompt,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: opts.userPrompt }],
  })

  let fullContent = ''
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      fullContent += chunk.delta.text
    }
  }
  return fullContent
}

export function hasAnthropic(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

// ============================================================
// Outil 3 — Évaluation d'attractivité
// Architecture en 5 blocs system avec cache_control granulaire
// + web search activée (max 3 recherches)
// ============================================================

export interface AnthropicSystemBlock {
  type: 'text'
  text: string
  cache_control?: { type: 'ephemeral' }
}

interface GenerateEvaluationOptions {
  systemBlocks: AnthropicSystemBlock[]
  userPrompt: string
  maxTokens?: number
  temperature?: number
  /** Active la web search Anthropic (max N recherches). 0 = désactivé. */
  maxWebSearches?: number
}

interface GenerateEvaluationResult {
  content: string
  usage: {
    inputTokens: number
    outputTokens: number
    cacheCreationTokens: number
    cacheReadTokens: number
  }
}

/**
 * Génère une évaluation via Claude Haiku 4.5 avec :
 * - Tableau de blocs system (cache granulaire)
 * - Web search Anthropic optionnelle
 * - Buffer côté serveur (pas de SSE vers client)
 */
export async function generateEvaluationWithAnthropic(
  opts: GenerateEvaluationOptions,
): Promise<GenerateEvaluationResult> {
  const tools: Array<Record<string, unknown>> = []
  if (opts.maxWebSearches && opts.maxWebSearches > 0) {
    tools.push({
      type: 'web_search_20250305',
      name: 'web_search',
      max_uses: opts.maxWebSearches,
    })
  }

  const stream = await getClient().messages.stream({
    model: ANTHROPIC_MODEL,
    max_tokens: opts.maxTokens ?? 16000,
    temperature: opts.temperature ?? 0.15,
    system: opts.systemBlocks as never,
    messages: [{ role: 'user', content: opts.userPrompt }],
    ...(tools.length > 0 ? { tools: tools as never } : {}),
  })

  let fullContent = ''
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      fullContent += chunk.delta.text
    }
  }

  const finalMessage = await stream.finalMessage()
  const usage = finalMessage.usage ?? ({} as Record<string, number>)

  return {
    content: fullContent,
    usage: {
      inputTokens: (usage as { input_tokens?: number }).input_tokens ?? 0,
      outputTokens: (usage as { output_tokens?: number }).output_tokens ?? 0,
      cacheCreationTokens:
        (usage as { cache_creation_input_tokens?: number }).cache_creation_input_tokens ?? 0,
      cacheReadTokens:
        (usage as { cache_read_input_tokens?: number }).cache_read_input_tokens ?? 0,
    },
  }
}
