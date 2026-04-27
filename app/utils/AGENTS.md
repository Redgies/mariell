<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-28 | Updated: 2026-04-28 -->

# utils

## Purpose
Auto-imported helper modules. Currently a single, large constant: a stock library of human-silhouette SVG strings used by the `PeopleHunt` animated talent-map simulation.

## Key Files
| File | Description |
|------|-------------|
| `silhouettes.ts` | Exports `interface StockFig { gender: 'm' \| 'f'; face: 'r' \| 'l'; svg: string }` and `const STOCK_FIGS: StockFig[]`. Each entry contains an inline SVG string sized at viewBox `160×300`, with the figure naturally facing `r` (right) or `l` (left) — `PeopleHunt` flips via `--sx: -1` when the walker direction opposes the natural facing. Mix of male/female silhouettes drives the gender-balanced crowd (~40% feminine). |

## For AI Agents

### Working In This Directory
- `silhouettes.ts` is large (≥ 50k tokens / ≥ 25k token Read limit). Use `Grep`/`Glob` or read with `offset`/`limit` rather than loading the whole file. Edit one entry at a time when adjusting paths.
- New silhouettes must follow the existing schema: `{ gender, face, svg }` with the SVG using the `fig` class (so `.ph-walker .fig { fill: ... }` and the chromatic-aberration overlay in `PeopleHunt.vue` apply) and a `bob` class on the inner group (for the walking-bob animation).
- ViewBox should stay `0 0 160 300` (or proportional) so the per-walker `--w` width and `baseH = baseW * (280 / 120)` height calculation in `PeopleHunt.vue` continues to work.
- Auto-imported by Nuxt — `PeopleHunt.vue` currently imports explicitly via `import { STOCK_FIGS, type StockFig } from '~~/app/utils/silhouettes'` for clarity. Either form works.

### Testing Requirements
- After editing silhouettes: `npm run dev`, scroll to the Approach section, confirm walkers render, walk both directions, bob, and the periodic scan sequence completes (zoom + reticle + dossier).

### Common Patterns
- The `face` field is authoritative — set it to whichever way the silhouette **naturally** faces. `PeopleHunt` derives the flip dynamically from walker direction.
- Gender skew: `PeopleHunt` picks female with probability `0.40`. Adjust the `STOCK_FIGS` mix (or the constant in `PeopleHunt.vue`) rather than over-representing one gender in the data.

## Dependencies

### Internal
- Consumed only by `app/components/PeopleHunt.vue`.

### External
- None — pure data module.

<!-- MANUAL: -->
