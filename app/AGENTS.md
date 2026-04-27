<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-28 | Updated: 2026-04-28 -->

# app

## Purpose
Nuxt 4 application source. `app.vue` is the global shell (scroll progress bar, gradient blobs, navbar, `<NuxtPage />`, footer); page-level layout lives in `pages/`, with the home page assembling a vertical sequence of section components from `components/`.

## Key Files
| File | Description |
|------|-------------|
| `app.vue` | Root layout. Wraps every route in `<ScrollProgress />`, `<GradientBlobs />`, `<AppNavbar />`, `<NuxtPage />`, `<AppFooter />`. Uses `relative min-h-screen text-white` — black background applied at `html` level via `main.css`. |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `components/` | Vue single-file components — global chrome and home-page sections (see `components/AGENTS.md`) |
| `pages/` | File-based routes: `/` home, `/mentions-legales`, `/politique-confidentialite` (see `pages/AGENTS.md`) |
| `composables/` | Auto-imported `use*` composables (see `composables/AGENTS.md`) |
| `utils/` | Auto-imported helpers — currently only the `silhouettes` SVG library used by `PeopleHunt` (see `utils/AGENTS.md`) |
| `assets/` | Imported (non-public) assets — global CSS (see `assets/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Nuxt 4 puts source under `app/` — don't move `.vue` files to repo root.
- Auto-imports cover `components/`, `composables/`, `utils/`, plus Vue and Nuxt APIs. **Do not** add explicit imports for `ref`, `onMounted`, `useRoute`, `defineProps`, etc.
- Cross-folder imports use the `~~/` alias (repo root), e.g. `import { siteConfig } from '~~/shared/config/site'`.
- All scripts use `<script setup lang="ts">` and prefer the Composition API.

### Testing Requirements
- Manual: `npm run dev`, then visit `/`, `/mentions-legales`, `/politique-confidentialite`.
- For animation work: also test with `prefers-reduced-motion: reduce` enabled in DevTools — every animation/transition should collapse to no-op (see `assets/css/main.css` reduced-motion block).

### Common Patterns
- Components export a single top-level `<section>` so they slot directly into `pages/index.vue`'s `<main>`.
- Inline `style="font-family: var(--font-grotesk); font-weight: <300|500|600>;"` is intentionally repeated rather than abstracted — reflects the README's font conventions and survives Tailwind purging.
- Reveal animations: `class="reveal"` on the element; the `useScrollReveal` composable (called from `pages/index.vue`) toggles `.revealed`. Use `class="reveal reveal-left"` / `reveal-right` / `reveal-scale` for directional variants.

## Dependencies

### Internal
- `~~/shared/config/site` — single source of truth for nav links, CTAs, clients, testimonials, benefits, process steps, pricing badges
- `~~/app/utils/silhouettes` — referenced explicitly by `components/PeopleHunt.vue` despite auto-import (kept for clarity)

### External
- Vue 3.5, Nuxt 4 — runtime + auto-imports
- Tailwind v4 utility classes everywhere

<!-- MANUAL: -->
