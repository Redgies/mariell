// ============================================================
// Couche 1 sécurité — détection de patterns prompt injection
// dans les inputs du formulaire avant envoi au LLM.
// Source : spec V4 section 4.
// ============================================================

const INJECTION_PATTERNS: RegExp[] = [
  // Override d'instructions
  /\bignor[ee]?\s+(tes?|les?|ces?|vos?|previous|toutes?|all|prior)\b/i,
  /\bdisregard\s+(tes?|les?|previous|prior|all)\b/i,
  /\bforget\s+(tes?|les?|previous|prior|all|everything)\b/i,
  /\boverride\s+(tes?|les?|system|prompt|instructions?)\b/i,

  // Jailbreak / mode debug
  /\bjailbreak/i,
  /\bdebug\s*mode/i,
  /\bdeveloper\s*mode/i,
  /\bdan\s+mode/i,
  /\bmaintenance\s*mode/i,

  // Role-play hostile
  /\bagis?\s+comme\s+(un|une|si|en\s+tant)/i,
  /\bact\s+(as|like)\s+(if|a|an)/i,
  /\btu\s+es\s+maintenant\b/i,
  /\byou\s+are\s+now\b/i,
  /\bpretends?\s+(to\s+be|que)/i,

  // Accès au system prompt
  /\bsystem\s*prompt/i,
  /\bsystem\s*instructions?/i,
  /\bprompt\s*caching/i,
  /\bréveles?\s+(tes?|les?|ton|le)/i,
  /\breveal\s+(tes?|les?|your|the)/i,
  /\baffich[ee]\s+(ton|tes?|le|les?|son)\s+(prompt|instructions?)/i,
  /\bshow\s+(me\s+)?(your|the)\s+(prompt|instructions?|system)/i,

  // Spécifiques outil 3 — révélation des référentiels
  /\btier\s+[sabc]\b/i,
  /\bf[1-4]\s+(b[oô]ites?|secteurs?|missions?|salaires?)/i,
  /\bréférentiels?\s+(internes?|propriétaires?|mariell)/i,
  /\bgrille\s+terrain/i,
  /\bgrille\s+minorée/i,
  /\b6\s+dimensions/i,
  /\bscore\s+(interne|f3|additif)/i,
  /\bmodificateur\s+sectoriel/i,

  // Exfiltration
  /\bcurl\s+/i,
  /\bwget\s+/i,
  /\bexec\s*\(/i,
  /\beval\s*\(/i,
  /<\s*script[^>]*>/i,
  /<\s*iframe[^>]*>/i,

  // Encodages suspects (Base64 long en fin de ligne)
  /[A-Za-z0-9+/]{50,}={0,2}\s*$/m,
]

export function containsInjectionPattern(text: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text))
}

export function getMatchedPatterns(text: string): string[] {
  return INJECTION_PATTERNS.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source)
}
