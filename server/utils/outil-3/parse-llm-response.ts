const DELIMITER = '---END_META---'

interface ParseSuccess {
  success: true
  data: { json: unknown; markdown: string }
}
interface ParseFailure {
  success: false
  error: string
  /** Markdown récupéré best-effort même si le JSON est cassé */
  markdownFallback?: string
}
export type ParseResult = ParseSuccess | ParseFailure

/**
 * Parse la réponse hybride du LLM :
 *   {JSON métadonnées}
 *   ---END_META---
 *   # Markdown des 8 sections
 *
 * Cas dégradé : si le délimiteur manque ou si le JSON est invalide,
 * on renvoie un markdownFallback avec ce qu'on peut récupérer.
 */
export function parseLlmResponse(rawContent: string): ParseResult {
  const delimiterIndex = rawContent.indexOf(DELIMITER)
  if (delimiterIndex === -1) {
    return {
      success: false,
      error: 'Délimiteur ---END_META--- introuvable',
      markdownFallback: rawContent.trim(),
    }
  }

  let jsonPart = rawContent.substring(0, delimiterIndex).trim()
  const markdownPart = rawContent.substring(delimiterIndex + DELIMITER.length).trim()

  // Nettoie le JSON des éventuels backticks markdown
  jsonPart = jsonPart.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()

  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(jsonPart)
  } catch (err: any) {
    return {
      success: false,
      error: `JSON invalide : ${err.message}`,
      markdownFallback: markdownPart,
    }
  }

  if (!markdownPart.startsWith("# Évaluation d'attractivité")) {
    // On accepte quand même mais on signale (le LLM a peut-être varié le titre)
    return {
      success: true,
      data: { json: parsedJson, markdown: markdownPart },
    }
  }

  return {
    success: true,
    data: { json: parsedJson, markdown: markdownPart },
  }
}
