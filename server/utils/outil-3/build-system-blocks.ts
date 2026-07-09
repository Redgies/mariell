import type { AnthropicSystemBlock } from '../anthropic'
import { loadOutil3Prompts } from './load-prompts'

/**
 * Construit le tableau de 5 blocs system pour l'API Anthropic.
 *
 * Stratégie cache :
 * - Bloc 1 (V11) : NON caché (modifié plus souvent que les référentiels)
 * - Blocs 2-5 (F1/F2/F3/F4) : cachés indépendamment via cache_control: ephemeral
 *   → modifier F1 invalide uniquement le cache F1, pas les autres
 *
 * Le cache ephemeral Anthropic dure 5 min, prolongé à chaque utilisation.
 * Économie ~80-85% sur les tokens cachés en régime stationnaire.
 */
export async function buildSystemBlocks(): Promise<AnthropicSystemBlock[]> {
  const { systemPromptV12, f1, f2, f3, f4 } = await loadOutil3Prompts()

  return [
    { type: 'text', text: systemPromptV12 },
    {
      type: 'text',
      text: `---\n\n# 📚 RÉFÉRENTIEL F1 — BOÎTES INTOUCHABLES (V7)\n\n> Référentiel des entreprises actives sur le marché Sales français en 2026 avec leur tier (S / A / B / C). Tu utilises ce tier pour le scoring F1. Une entreprise absente du référentiel n'est jamais pénalisée.\n\n${f1}`,
      cache_control: { type: 'ephemeral' },
    },
    {
      type: 'text',
      text: `---\n\n# 📚 RÉFÉRENTIEL F2 — GRILLE SECTEURS (V3)\n\n> Référentiel des 32 secteurs avec modificateurs sectoriels.\n\n${f2}`,
      cache_control: { type: 'ephemeral' },
    },
    {
      type: 'text',
      text: `---\n\n# 📚 RÉFÉRENTIEL F3 — TYPOLOGIE MISSIONS (V5)\n\n> 7 dimensions transversales d'évaluation de la mission. Score F3 entre −7 et +6.\n\n${f3}`,
      cache_control: { type: 'ephemeral' },
    },
    {
      type: 'text',
      text: `---\n\n# 📚 RÉFÉRENTIEL F4 — ADDENDUM SALAIRES (V5)\n\n> ⚠️ La position du package est pré-calculée côté backend et injectée dans le user prompt sous le titre "🔒 PRÉ-CALCUL PACKAGE". Tu ne recalcules pas. F4 reste chargé pour les formulations narratives qualitatives et les cas dégradés.\n\n${f4}`,
      cache_control: { type: 'ephemeral' },
    },
  ]
}
