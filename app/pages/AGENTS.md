<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-28 | Updated: 2026-04-28 -->

# pages

## Purpose
File-based routes for the Nuxt app. One marketing home page that composes every section component, plus two static legal sub-pages required for French RGPD/LCEN compliance.

## Key Files
| File | Route | Description |
|------|-------|-------------|
| `index.vue` | `/` | Home. `<main>` assembles `<HeroSection>`, `<ApproachSection>`, `<VideoSection>`, `<ClientsMarquee>`, `<BenefitsGrid>`, `<ProcessSteps>`, `<PricingSection>`, `<TestimonialsCarousel>`, `<FinalCta>`. The `<script setup>` calls `useScrollReveal()` and, on mount, runs three pipelines guarded by `prefers-reduced-motion`: (1) walks every `[data-split]` heading and wraps each word in a `<span class="split-word">` (treats `.gradient-text` / `[data-no-split]` as atomic so background-clip-text survives); (2) IntersectionObserver-reveals `.split-word` with 90ms stagger via `style.animationDelay`; (3) scroll-linked parallax for `.scroll-parallax` (factor read from `data-parallax`, default `-0.6`, applied via `--scroll-y`). All listeners are signalled by an `AbortController` cleared on `onBeforeUnmount`. |
| `mentions-legales.vue` | `/mentions-legales` | Static "Mentions légales" page (LCEN art. 6-III). Constrained `max-w-4xl` editorial layout with `<NuxtLink to="/">Retour</NuxtLink>`, eyebrow + `headline-lg`, then sections separated by `.hairline.revealed`. **Bracketed red-text spans (`text-red-400`) mark every placeholder** to fill before publishing (raison sociale, SIRET, hébergeur, etc.). |
| `politique-confidentialite.vue` | `/politique-confidentialite` | Static "Politique de protection des données" page (RGPD). Same layout as `mentions-legales.vue`. Same `text-red-400` placeholder convention for legal placeholders. |

## For AI Agents

### Working In This Directory
- Nuxt 4 file-based routing — filename = route. Use kebab-case for multi-word routes (matches existing `/mentions-legales` and `/politique-confidentialite`).
- The home page (`index.vue`) is the orchestrator for **page-wide** animation logic. Don't move splitting/parallax into individual components — it relies on a single `onMounted` pass with one `AbortController` and one IntersectionObserver per concern.
- Legal pages: `text-red-400` is intentionally used as a visual marker that the surrounding bracketed text is a placeholder waiting on real legal info. Do not "clean up" those colours without replacing the placeholders.
- `<NuxtLink>` for internal navigation (`/`, `/mentions-legales`, `/politique-confidentialite`); plain `<a href="#anchor">` for in-page section links.

### Testing Requirements
- `npm run dev` → visit `/`, scroll through every section, verify reveals + word splits + parallax fire.
- Visit `/mentions-legales` and `/politique-confidentialite` directly and via the footer; confirm the "Retour" link returns to `/`.
- Test with reduced-motion enabled — splitting still happens (DOM-level), but words appear immediately rather than animating.

### Common Patterns
- The home page is the **only** caller of `useScrollReveal()` — section components only emit the `.reveal` class.
- Anchor links on the home page (`#accueil`, `#who`, `#process`, `#pricing`, `#contact`, `#approche`, `#process-section`) are matched by `id` attributes on each section component's root `<section>`.

## Dependencies

### Internal
- All components in `app/components/` (auto-imported)
- `useScrollReveal` from `app/composables/`
- Footer links target the legal pages — don't rename their files without updating `app/components/AppFooter.vue`.

### External
- Vue 3 (`onMounted`, `onBeforeUnmount`, `nextTick`)
- Nuxt 4 (`<NuxtLink>`, `import.meta.client`)
- DOM (`IntersectionObserver`, `AbortController`, `matchMedia`, `requestAnimationFrame`)

<!-- MANUAL: -->
