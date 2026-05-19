# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Mariell** — one-page French premium landing site for a Sales-recruitment cabinet, plus three "Lab" lead-generation tools (forms that funnel into Brevo + Jarvi CRM, with two LLM-generated deliverables). Nuxt 4 + Tailwind v4, deployed on Vercel (nitro preset `vercel`). All user-facing copy is in French — preserve `&nbsp;` before `?` `!` `:` and French quotes/accents.

## Commands

```bash
npm install              # postinstall runs `nuxt prepare`
npm run dev              # http://localhost:3000
npm run build            # production build (type-checks via Nuxt)
npm run generate         # SSG generate
npm run preview          # serve the build
```

No test suite, no lint script. Verification = `npm run build` + manual browse of `/`, `/lab`, `/lab/plan-de-sourcing`, `/lab/evaluation-attractivite`, `/lab/demande-stage-alternance`, `/mentions-legales`, `/politique-confidentialite`. Also re-test with DevTools `prefers-reduced-motion: reduce` — every animation must collapse cleanly.

## Architecture

### Nuxt 4 layout (note the `app/` root)

- `app/app.vue` — global shell. Hides `<ScrollProgress>`, `<GradientBlobs>`, `<AppNavbar>`, `<AppFooter>` on Lab tool routes (`/lab/plan-de-sourcing`, `/lab/evaluation-attractivite`, `/lab/demande-stage-alternance`) so the tools render in a focused chrome-less context.
- `app/pages/index.vue` — the **only** caller of `useScrollReveal()`, and the sole owner of page-wide animation passes: (1) walks every `[data-split]` heading and wraps each word in a `<span class="split-word">` (treats `.gradient-text` and `[data-no-split]` as atomic so `background-clip: text` survives); (2) IntersectionObserver-reveals split words with 90ms stagger; (3) scroll-linked parallax for `.scroll-parallax` via `--scroll-y`. Don't move this logic into section components.
- Section components in `app/components/` are self-contained `<section id="…">` blocks composed in order by `index.vue`.
- Auto-imports cover `components/`, `composables/`, `utils/`, plus Vue and Nuxt APIs (`ref`, `computed`, `onMounted`, `useRoute`, etc.). **Never add explicit imports for those.**
- Cross-folder import alias: `~~/` = repo root (e.g. `import { siteConfig } from '~~/shared/config/site'`).
- TypeScript everywhere — `<script setup lang="ts">`.

### Single source of truth for marketing copy

`shared/config/site.ts` holds `siteConfig` (Calendly URL, CTA labels), `navLinks`, `labDropdown`, `clients`, `testimonials`, `benefits`, `processSteps`, `pricingBadges`. Every CTA reads `siteConfig.calendlyUrl` — change once, propagates everywhere. The runtime value also comes from `NUXT_PUBLIC_CALENDLY_URL` via `runtimeConfig.public.calendlyUrl` (see `nuxt.config.ts`).

### Styling

Tailwind v4 via `@tailwindcss/vite` — **no `tailwind.config.*` file**. Design tokens and named utility classes are defined in `app/assets/css/main.css` using the `@theme` directive and custom classes (`headline-xl/-lg/-asym/-section`, `eyebrow-cyan`, `gradient-cta`, `cta-gradient-lg`, `btn-ghost`, `gradient-text`, `stat-card-shell`, `benefit-card`, `pricing-box`, `testi-card`, `clients-ticker`, `client-tile`, `process-marker`, `process-timeline-line`, `.reveal`, `.revealed`, `.stagger`, `.split-word`, `.scroll-parallax`). Reach for these before writing new CSS. `PeopleHunt.vue` is the one component using a global `<style>` block — every selector is `.ph-`-prefixed.

Fonts: a single Google Font (`Inter`, weights 300/400/500/600/800) is self-hosted at build time via `@nuxtjs/google-fonts` with `download: true`. There are no Noto Serif JP / Hanken Grotesk imports despite what older docs in `README.md` / `AGENTS.md` say — the in-CSS `--font-grotesk` is the only family wired up. If you add another family, mirror the pattern in `nuxt.config.ts > googleFonts.families`.

### Lab — backend tools (Nuxt server routes)

Three lead-gen tools live under `app/pages/lab/` (UI) + `server/api/lab/` (handlers) + `server/schemas/` (Zod) + `server/prompts/` (LLM prompts) + `server/utils/` (integrations).

| Outil | Front | Server entry | LLM | Storage TTL |
|-------|-------|--------------|-----|-------------|
| 1 — Stage / Alternance | `pages/lab/demande-stage-alternance/` | `api/lab/stage-alternance.post.ts` | none | — (form only) |
| 2 — Plan de sourcing LinkedIn | `pages/lab/plan-de-sourcing/`, result at `resultat/[uuid].vue` | `api/lab/plan-de-sourcing/generate.post.ts` + `[uuid].get.ts` | Anthropic Claude Haiku 4.5 | plan 90d, status 10min, deferred 7d |
| 3 — Évaluation d'attractivité | `pages/lab/evaluation-attractivite/`, result at `resultat/[uuid].vue` | `api/lab/evaluation-attractivite/generate.post.ts` + `[uuid].get.ts` | Anthropic Claude Haiku 4.5 (5-block system + web search) | same shape, separate keys |

**Cross-cutting flow** (outil 2 / 3):
1. `savePlanStatus(uuid, 'pending')` immediately so the front can start polling on `navigateTo`.
2. Zod validation → Cloudflare Turnstile (`server/utils/turnstile.ts`) → 3-tier rate limit (IP/day, IP/week, email-domain/month for outil 2; IP day+week for outil 3) via `server/utils/ratelimit.ts`.
3. If rate-limited *or* Anthropic missing/failing → **deferred mode**: persist a `DeferredRecord` in Redis, fire the "deferred" Brevo templates, return a different redirect. Never hard-block — capture the lead.
4. On success: stream from Anthropic (server-side buffer, no SSE to client — the front renders a 30s+ scripted loader), persist result, push to Jarvi CRM (`upsertCompany` → `upsertProfile` → `createPlanSourcingProject`), send `livraison` + `notif interne` Brevo templates, set status to `done`.
5. Result pages poll `[uuid].get.ts` until status is `done | deferred | error`, then render the stored markdown (via `markdown-it`).

**Anthropic specifics** (`server/utils/anthropic.ts`):
- Model alias: `ANTHROPIC_MODEL = 'claude-haiku-4-5'` (non-dated, follows minor updates).
- Outil 2 uses a **single** system block with `cache_control: { type: 'ephemeral' }`.
- Outil 3 uses a 5-block system array (`generateEvaluationWithAnthropic`) with granular cache_control across V11 + F1–F4 prompt files, optional Anthropic `web_search_20250305` tool (capped via `maxWebSearches`), and an assistant `prefill` (typically `"{"`) to force JSON output without tools — the prefill is re-prepended to the response before parsing.
- Both functions consume the stream server-side and return the buffered text. **Do not** pipe to the browser.

**Prompts are inlined at build time** (`nuxt.config.ts` reads `server/prompts/**/*.md` with `readFileSync` and injects them into `runtimeConfig.prompts`). This is deliberate — Vercel's function bundler doesn't otherwise ship the `.md` files. Each tool's `utils/load-prompts.ts` reads them back via `useRuntimeConfig().prompts`.

**Storage** (`server/utils/plan-storage.ts`, `evaluation-storage.ts`): Upstash Redis with an in-memory `Map` fallback for local dev. Credentials are read from either `KV_REST_API_URL/TOKEN` (Vercel KV) or `UPSTASH_REDIS_REST_URL/TOKEN` (Marketplace) — the resolver tries both.

**Jarvi CRM** (`server/utils/jarvi.ts`): all functions stub-no-op when `JARVI_API_KEY`/`JARVI_API_BASE_URL` are missing, so local dev works without credentials. Real errors escalate to callers for **fail-soft** handling (lead still captured via Brevo even if CRM push fails). Status UUIDs are per-tool — three separate `JARVI_PROJECT_STATUS_ID_*` and `JARVI_PROFILE_STATUS_ID_*` env vars, plus the multiplechoice `JARVI_FIELD_ID_TYPE_DEMANDE_LAB` for tagging.

**Brevo** (`server/utils/brevo.ts`): transactional templates only. Template IDs are env-configured per tool/event (notif interne, livraison/confirmation prospect, deferred variants, critical alert). Never hard-code template IDs.

**Outil 1 anti-spam stack**: `isPersonalEmail` (blacklist in `server/utils/email-blacklist.ts`), Turnstile, `hasActiveLabProject` dedup against Jarvi, plus a honeypot field `company_website` — if filled, the handler returns a faux 200 and logs a warning rather than alerting the bot.

### Environment

All env vars are documented in `.env.example`. The mandatory set for full functionality: `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_TURNSTILE_SITE_KEY` + `NUXT_TURNSTILE_SECRET_KEY`, `BREVO_API_KEY` + sender + template IDs, `JARVI_API_KEY` + base URL + status/field UUIDs, `KV_REST_API_URL` + `KV_REST_API_TOKEN`, `ANTHROPIC_API_KEY`, `NUXT_PUBLIC_CALENDLY_URL`. Without `ANTHROPIC_API_KEY` the Lab LLM tools auto-fall back to deferred mode (still works for testing the lead-capture path).

### Vercel deployment

`nitro.preset = 'vercel'` (standard, not `vercel-edge`) — the outil 2 generation call takes ~30s, edge would cut it at 25s; standard tolerates up to 300s. `@nuxt/scripts` MUST come **before** `@nuxtjs/turnstile` in `modules` so Turnstile loads Cloudflare's `api.js` through the Trusted-Types-compliant loader.

## Conventions

- **Reveal animations**: add `class="reveal"` (or `reveal-left` / `reveal-right` / `reveal-scale`); container `class="stagger"` cascades children. The home page is the only place that wires the observer.
- **Word-split headlines**: `<h* class="reveal headline-…" data-split>…<span class="gradient-text italic">accent</span>…</h*>`. Wrap accent text in `.gradient-text` to keep it atomic (background-clip can't survive splitting).
- **CTAs**: primary → `class="gradient-cta"`, large/final → `cta-gradient-lg`, secondary → `btn-ghost`. Anchor → `siteConfig.calendlyUrl`.
- **Eyebrows**: `class="eyebrow-cyan"` (centered: `eyebrow-cyan eyebrow-cyan--center`).
- **Legal pages**: `text-red-400` is intentionally used as a visual marker around placeholders waiting on real legal info (raison sociale, SIRET, hébergeur…). Don't "clean up" the colour without replacing the placeholder.
- **One-off styles**: `<style scoped>` per component. Exception: `PeopleHunt.vue` uses a global `<style>` because every selector is `.ph-`-prefixed.
