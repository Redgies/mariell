<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-28 | Updated: 2026-04-28 -->

# css

## Purpose
Global CSS — Tailwind v4 entry, design tokens, typography utilities, every named animation, and the reveal/parallax framework that section components hook into. This is the **only** stylesheet wired into Nuxt; component-level styles live inside SFC `<style>` blocks.

## Key Files
| File | Description |
|------|-------------|
| `main.css` | Single global stylesheet. Imports Tailwind v4 (`@import "tailwindcss"`), declares design tokens via `@theme` (colors `--color-bg #000`, `--color-accent-cyan #00ffff`, `--color-accent-magenta #ff00ff`, fonts `--font-serif-jp` Noto Serif JP, `--font-grotesk` Inter), then defines the full custom utility set. Final block scopes everything under `@media (prefers-reduced-motion: reduce)` — animations / parallax / hover transforms collapse to no-op. |

## Utility class catalog (defined in `main.css`)
| Group | Classes |
|-------|---------|
| Typography | `font-serif-jp`, `font-grotesk`, `font-mono-num`, `headline-xl`, `headline-lg`, `headline-asym`, `headline-section`, `headline-approach`, `headline-final`, `eyebrow`, `eyebrow-cyan`, `eyebrow-cyan--center`, `gradient-text` |
| Decoration | `hairline`, `blob`, `blob-slow`, `blob-faster`, `grain`, `marquee-track`, `stat-card-shell` |
| CTAs / buttons | `gradient-cta`, `btn-ghost`, `cta-gradient-lg` |
| Cards | `card-tilt`, `benefit-card`, `benefit-icon`, `pricing-box`, `testi-card`, `testi-mark`, `testi-avatar` |
| Layout | `benefits-asym` (asymmetric 2×2 grid with offset rows) |
| Process timeline | `process-timeline-line`, `process-marker`, `process-step` |
| Clients ticker | `clients-ticker`, `client-tile`, `client-tile--join` |
| Misc | `carousel-scroll` (hide scrollbar), `scroll-dot`, `scroll-parallax` |
| Reveal framework | `reveal` (+ `revealed`), `reveal-left`, `reveal-right`, `reveal-scale`, `stagger > .reveal:nth-child(N)` (90ms increments up to 8 children), `split-word` (+ `revealed`) |

## For AI Agents

### Working In This Directory
- Tailwind v4 with `@theme` directive — there is **no `tailwind.config.*` file**. Add new tokens by extending the `@theme { ... }` block at the top of `main.css`. The Vite plugin (`@tailwindcss/vite`) picks them up automatically.
- Keep the reduced-motion override at the bottom of the file. Any new animation should be re-disabled inside that block.
- Prefer named utility classes (`gradient-cta`, `eyebrow-cyan`, `headline-section`) over re-defining gradient/typography rules in component-scoped styles. Components and pages all reference these names.
- Color palette is intentionally narrow: black background, white text at varying alpha (`text-white/45`, `text-white/65`, `text-white/8` borders), and the cyan→magenta accent gradient `linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)` (or its softer sibling `linear-gradient(135deg, #5EE7E7 0%, #8B5CF6 50%, #E85EFF 100%)`). Don't introduce new accent colours without an explicit ask.

### Testing Requirements
- After CSS edits: `npm run dev` and visually verify (HMR usually instant). Watch for Tailwind v4 layer ordering issues — custom rules can be overridden by utility classes; bump specificity if needed.
- Verify `prefers-reduced-motion` still grounds out every animation (DevTools → Rendering → Emulate CSS media feature).
- Check `body { overflow-x: hidden }` still suppresses horizontal scroll — gradient blobs extend beyond the viewport.

### Common Patterns
- `body` is **transparent** — black background lives on `html` so `position: fixed` blobs render between the html canvas and content (see comment in `main.css`).
- Stagger helpers cap at 8 children (`nth-child(1)..nth-child(8)`); for longer lists either extend the rule or repeat the pattern.
- `.scroll-parallax` requires JS: `app/pages/index.vue` writes `--scroll-y` on scroll using each element's `data-parallax` factor.

## Dependencies

### Internal
- Registered by `nuxt.config.ts` (`css: ['~/assets/css/main.css']`).
- Consumed by every component, page, and the root `app.vue`.

### External
- Tailwind CSS v4 (via `@tailwindcss/vite`).
- Web fonts injected by `@nuxtjs/google-fonts` (Noto Serif JP 500, Inter 300/400/600).

<!-- MANUAL: -->
