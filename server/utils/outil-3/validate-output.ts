// ============================================================
// Couche 2 sécurité — filtre mots-clés interdits dans l'output LLM
// Détecte toute fuite des référentiels propriétaires Mariell
// (tiers F1, fichiers F1-F4, vocabulaire grille, méthodologie scoring).
// ============================================================

const FORBIDDEN_KEYWORDS: RegExp[] = [
  // Tiers F1
  /\bTier\s+S\b/gi,
  /\bTier\s+A\b/gi,
  /\bTier\s+B\b/gi,
  /\bTier\s+C\b/gi,

  // Identifiants fichiers
  /\bF[1-4]\b/g,
  /\b(Fichier|fichier)\s+[1-4]\b/g,

  // Vocabulaire référentiel
  /référentiels?\s+(internes?|propriétaires?|mariell)/gi,
  /\bgrille\s+terrain/gi,
  /\bgrille\s+minorée/gi,
  /\bgrille\s+interne/gi,
  /\bréférentiel\s+chiffré/gi,

  // Méthodologie
  /\b6\s+dimensions/gi,
  /\bscore\s+(interne|f3|additif|chiffré)\b/gi,
  /\bmodificateur\s+sectoriel/gi,
  /\bprincipe\s+directeur\s+transversal/gi,

  // Pourcentage de minoration F4
  /-\s*10\s*%\s*(?:du|vs|par rapport)/gi,
  /minoration\s+de\s+10/gi,

  // Mentions méta
  /selon\s+(notre|nos)\s+(grille|référentiel|tier)/gi,
  /d'après\s+(notre|nos)\s+(grille|référentiel|tier)/gi,
]

interface ValidationResult {
  safe: boolean
  matched: string[]
  sanitized: string
}

/**
 * Scan le markdown LLM pour détecter des fuites de référentiels.
 * Si détection : on remplace les patterns par "[information non communiquée]"
 * (pas de régénération, trop coûteuse en latence).
 */
export function validateLlmOutput(markdown: string): ValidationResult {
  const matched: string[] = []
  let sanitized = markdown

  for (const pattern of FORBIDDEN_KEYWORDS) {
    const matches = markdown.match(pattern)
    if (matches) {
      matched.push(...matches)
      sanitized = sanitized.replace(pattern, '[information non communiquée]')
    }
  }

  return { safe: matched.length === 0, matched, sanitized }
}
