<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-28 | Updated: 2026-04-28 -->

# public

## Purpose
Static assets served as-is from the site root (`/`). Nuxt copies the contents of this folder verbatim to the build output — no bundling, no fingerprinting. Reference files via root-relative paths (`/favicon.svg`, `/logo_site.png`, `/logo_3.png`).

## Key Files
| File | Description |
|------|-------------|
| `favicon.svg` | Site favicon. Linked from `nuxt.config.ts` (`app.head.link`). Replace with the final Mariell logo before launch (README "Placeholders" item). |
| `logo_site.png` | Wordmark / logo used in `app/components/AppNavbar.vue` and `app/components/AppFooter.vue` (rendered at `h-11` and `h-12` respectively). |
| `logo_mariell.png` | Alternate / source logo (kept for reference). |
| `logo_1.png` … `logo_10.png` | Ten client logos consumed by `app/components/ClientsMarquee.vue` via `shared/config/site.ts → clients` (which generates `/logo_<n>.png` paths for `n = 1..10`). The marquee currently shows the first 8 plus a "+ Votre logo ?" placeholder tile. |

## For AI Agents

### Working In This Directory
- Anything dropped here is publicly served. Do **not** put credentials, drafts, or unreleased copy here.
- Keep filenames URL-safe and stable — they are referenced by hard-coded paths in `nuxt.config.ts` and the `clients` array in `shared/config/site.ts`. Renaming a logo means updating the matching string elsewhere.
- For new client logos: prefer SVG when possible (the README suggests `/logos/client-N.svg` as an evolution path). Current PNG layout is the live convention — switching formats is a coordinated change.
- This directory is **not** processed by Tailwind / Vite — no SCSS, no TS, no imports.

### Testing Requirements
- Visual: confirm new/replaced logos load over `npm run dev` (e.g. visit http://localhost:3000/logo_1.png directly).
- Confirm the marquee still scrolls smoothly (long animation duration on `.clients-ticker`) — large unoptimised images will cause jank.

### Common Patterns
- Logos are intentionally rendered at reduced opacity (`opacity: 0.7`, full opacity on hover) inside `.client-tile` (see `app/assets/css/main.css`). White-on-dark logos read best.

## Dependencies

### Consumers
- `nuxt.config.ts` — `/favicon.svg`
- `app/components/AppNavbar.vue`, `app/components/AppFooter.vue` — `/logo_site.png`
- `app/components/ClientsMarquee.vue` (via `shared/config/site.ts → clients`) — `/logo_1.png` … `/logo_10.png`

<!-- MANUAL: -->
