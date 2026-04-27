<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-28 | Updated: 2026-04-28 -->

# assets

## Purpose
Build-pipeline-processed assets (imported by name, not served from `/`). Currently only the global stylesheet — fonts are downloaded by `@nuxtjs/google-fonts` at build time, and images are served from the repo-root `public/` directory.

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `css/` | Global stylesheet imported via `nuxt.config.ts → css: ['~/assets/css/main.css']` (see `css/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- New imported assets (SVG, images bundled by the Vite pipeline, additional CSS) belong here.
- Static, served-as-is files belong in the repo-root `public/` directory instead.
- This folder is referenced by Nuxt via the `~/assets/...` alias from `nuxt.config.ts`.

### Testing Requirements
- After adding a new global stylesheet: register it in `nuxt.config.ts` `css: []` and verify `npm run dev` boots without HMR errors.

## Dependencies

### Internal
- Registered in `nuxt.config.ts`.

### External
- Tailwind CSS v4 (loaded via `@import "tailwindcss"` inside `css/main.css`).

<!-- MANUAL: -->
