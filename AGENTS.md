<!-- Generated: 2026-04-28 | Updated: 2026-04-28 -->

# Mariell

## Purpose
One-page premium landing site for **Mariell**, a French Sales-recruitment cabinet ("cabinet de recrutement Sales"). Single-page Nuxt 4 app with section-by-section editorial design (hero, approach, video, clients marquee, benefits, process timeline, pricing, testimonials, final CTA) plus two static legal sub-pages. Visual identity: black background, cyan→magenta gradient accents, Noto Serif JP headlines, Hanken Grotesk / Inter body — no UI framework, all custom Tailwind v4.

## Key Files
| File | Description |
|------|-------------|
| `package.json` | Nuxt 4, Vue 3.5, Tailwind v4 (via `@tailwindcss/vite`), `@nuxtjs/google-fonts`. Scripts: `dev`, `build`, `generate`, `preview`. |
| `nuxt.config.ts` | Nuxt config — Tailwind Vite plugin, Google Fonts (Noto Serif JP 500, Inter 300/400/600 with `download: true`), French `<html lang>`, default page title and meta description. |
| `tsconfig.json` | Extends `./.nuxt/tsconfig.json` only. |
| `.gitignore` | Excludes `.output`, `.nuxt`, `.nitro`, `.cache`, `node_modules`, env files, IDE folders. |
| `README.md` | Stack, install/dev/build commands, project structure map, list of placeholders to replace before production (Calendly URL, hero video, client logos, favicon, testimonials), font conventions, accessibility notes. |
| `package-lock.json` | npm lockfile — do not hand-edit. |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `app/` | Nuxt 4 application source — `app.vue` root, components, composables, pages, utils, assets (see `app/AGENTS.md`) |
| `shared/` | Cross-cutting configuration auto-imported with the `~~/shared/...` alias (see `shared/AGENTS.md`) |
| `public/` | Static assets served from `/` — logos and favicon (see `public/AGENTS.md`) |
| `.nuxt/` | Nuxt build artefacts — generated, do not edit |
| `.output/` | Production build output — generated, do not edit |
| `node_modules/` | npm dependencies — do not edit |

## For AI Agents

### Working In This Directory
- Nuxt 4 with the `app/` directory layout — Vue files live under `app/`, not at repo root.
- Auto-imports are enabled: composables, components, and Nuxt utilities (`useRoute`, `onMounted`, `ref`, `computed`, `watch`, `defineProps`, `nextTick`, etc.) are used **without explicit imports**. Only `shared/config/site.ts` is imported explicitly via `~~/shared/config/site`.
- TypeScript everywhere — `<script setup lang="ts">`.
- Single page application with anchor-based section navigation (`#accueil`, `#who`, `#process`, `#pricing`, `#contact`). Smooth scroll handled via CSS `scroll-behavior: smooth` and `scroll-padding-top: 5rem`.
- All copy is in **French**. Preserve French quotes, accents, and typography (e.g. non-breaking spaces `&nbsp;` before `?`, `!`, `:`).

### Testing Requirements
- No test suite is configured. Manual verification: run `npm run dev` and check at http://localhost:3000.
- Run `npm run build` to type-check and bundle for production.
- Verify `prefers-reduced-motion` path — animations must collapse cleanly (see `app/assets/css/main.css`).

### Common Patterns
- Section components are self-contained `<section>` blocks composed from `app/pages/index.vue`.
- Reveal-on-scroll: add `reveal` class to elements; the `useScrollReveal` composable adds `.revealed` via IntersectionObserver. Use `stagger` on parents for cascaded delays.
- Headline word-splitting: add `data-split` to a heading; `app/pages/index.vue` walks text nodes and wraps each word in a `.split-word` span animated on intersection. Wrap inline accent text in `.gradient-text .italic` (kept as a single token so `background-clip: text` works).
- Scroll-linked parallax: add `scroll-parallax` and optional `data-parallax="<factor>"`; `index.vue` updates `--scroll-y`.
- CTA anchor `siteConfig.calendlyUrl` (currently `'#'`) feeds **every** primary CTA — change once in `shared/config/site.ts`.

## Dependencies

### External
- **Nuxt 4** (`^4.1.3`) — meta-framework
- **Vue 3.5** (`^3.5.13`) — runtime
- **vue-router** (`^4.5.0`) — routing
- **Tailwind CSS v4** (`^4.0.0`) via `@tailwindcss/vite` — styling, configured through `@theme` directive in `app/assets/css/main.css` (no `tailwind.config.*` file)
- **`@nuxtjs/google-fonts`** (`^3.2.0`) — self-hosts Noto Serif JP + Inter at build time (`download: true`)
- **TypeScript** (`^5.7.2`)

### Runtime
- Node.js ≥ 20 (tested on Node 22)

<!-- MANUAL: Notes added below this line are preserved on regeneration -->
