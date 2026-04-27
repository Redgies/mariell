<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-28 | Updated: 2026-04-28 -->

# components

## Purpose
Vue single-file components. Two roles: **global chrome** (navbar, footer, fixed-position decoration) included by `app/app.vue`, and **home-page sections** assembled in order by `app/pages/index.vue`. Auto-imported by Nuxt — reference by tag name (e.g. `<HeroSection />`) without import statements.

## Key Files

### Global chrome (rendered by `app.vue`)
| File | Description |
|------|-------------|
| `AppNavbar.vue` | Sticky/blurred top nav. Reads `navLinks`, `resourcesDropdown`, `siteConfig` from `~~/shared/config/site`. Desktop hover-dropdown for "Ressources"; mobile menu teleported to `<body>` to escape stacking context. Resolves anchor links to `/#accueil` when not on home route. Locks body scroll when mobile menu is open. Closes on `Escape` and outside click. |
| `AppFooter.vue` | Three-column footer (brand blurb, navigation anchors, legal links to `/mentions-legales` and `/politique-confidentialite`). Auto-renders current year via `new Date().getFullYear()`. |
| `GradientBlobs.vue` | Six fixed-position blurred radial gradients (cyan / magenta / violet) at `-z-10` behind page content. Per-blob `--parallax-y` updated on scroll (factors `0.06 → 0.18`) for parallax. Bails out under `prefers-reduced-motion`. |
| `ScrollProgress.vue` | 2px gradient progress bar at `top: 0`, `z: 60`. Tracks `scrollY / (scrollHeight - innerHeight)`, updates `transform: scaleX()` via rAF. |

### Home-page sections (rendered by `pages/index.vue`, in order)
| File | Description |
|------|-------------|
| `HeroSection.vue` | `#accueil`. Two-column: editorial copy + CTAs on the left (`siteConfig.ctaHero`), three-stat card (94% / 60+ / 7j) on the right. Headline split via `data-split`. |
| `ApproachSection.vue` | `#approche`. Eyebrow + headline + lede, followed by `<PeopleHunt />`. |
| `PeopleHunt.vue` | Animated "Live Talent Map" simulation. Builds a multi-lane crowd of SVG silhouettes (from `~~/app/utils/silhouettes`), runs a periodic scan sequence: zoom in on a target walker, show reticle + chromatic-aberration overlay, slide a Candidate Dossier card with random French/Arabic/African/intl names, roles, and skill bars. All styles namespaced with `.ph-` prefix in a `<style>` (non-scoped) block. Pauses when off-screen via `IntersectionObserver` and on `document.hidden`. |
| `VideoSection.vue` | `#who`. Copy column + 16:10 video placeholder with gradient play button. **TODO**: replace `.video-wrap` content with an `<iframe>` when the video is ready. Styles are scoped. |
| `ClientsMarquee.vue` | Infinite horizontal ticker of client logos (`/logo_1.png` … `/logo_8.png`) plus a dashed "+ Votre logo ?" placeholder tile. Doubles the array for seamless CSS-keyframe scroll; pauses on hover/focus and under `prefers-reduced-motion`. |
| `BenefitsGrid.vue` | `#process` (part 1). Four asymmetric "benefit cards" (results, market understanding, time, performance). SVG icon paths defined inline in script; copy paragraphs may contain `<strong>` HTML rendered via `v-html`. Asymmetric vertical offset (cards 2 and 4 shifted down 56px) collapses on mobile. |
| `ProcessSteps.vue` | `#process-section`. Four-step horizontal chronologie (Brief / Chasse & Screening / Push Pool / Suivi & médiation) with day markers (J+1 → closing). Decorative gradient rule connects markers on desktop. |
| `PricingSection.vue` | `#pricing`. Left: pricing box (20% du salaire fixe + 4-month / 8-month follow-up RDV) with embedded CTA. Right: three side badges (Success rate, Garantie période d'essai, Chasse sur-mesure). |
| `TestimonialsCarousel.vue` | Horizontal snap-scroll carousel of `testimonials` from `~~/shared/config/site`. Prev/next buttons call `scrollBy({ behavior: 'smooth' })`. Avatars are gradient circles with computed initials. Native scrollbar hidden via `.carousel-scroll`. |
| `FinalCta.vue` | `#contact`. Center-aligned final headline ("Encore bienvenue chez Mariell.") + lede + large gradient pill CTA `siteConfig.ctaFinal`. |

### Atoms
| File | Description |
|------|-------------|
| `SectionLabel.vue` | Small reusable eyebrow (`<number> + <label>`) using `font-mono-num`. Kept for reuse — most sections use the inline `.eyebrow-cyan` utility instead. |

## For AI Agents

### Working In This Directory
- One component per file; PascalCase filename matches the auto-imported tag.
- Sections are self-contained `<section>` elements with their own anchor `id` so they slot into `pages/index.vue` without wrappers.
- Most styles are Tailwind utility classes; reach for the named utility classes from `app/assets/css/main.css` (`headline-asym`, `headline-section`, `eyebrow-cyan`, `gradient-cta`, `btn-ghost`, `gradient-text`, `stat-card-shell`, `benefit-card`, `pricing-box`, `testi-card`, `cta-gradient-lg`, `clients-ticker`, `client-tile`, `process-marker`, `process-timeline-line`) before defining new CSS.
- Local component CSS — use `<style scoped>` (e.g. `VideoSection.vue`). Exception: `PeopleHunt.vue` uses a global `<style>` because every selector is `.ph-`-prefixed.
- All CTAs must read from `siteConfig` so a single edit (Calendly URL) propagates everywhere.
- French copy: keep non-breaking spaces (`&nbsp;`) before `?` `!` `:` in user-facing text.

### Testing Requirements
- Manual visual check on desktop and mobile widths (≤ 820px collapses several layouts).
- Verify `prefers-reduced-motion` — `PeopleHunt`, `ClientsMarquee`, `GradientBlobs`, and reveal animations should all freeze gracefully.
- For `PeopleHunt`: confirm scan loop pauses when the section is scrolled out of view (IntersectionObserver) and on tab blur (`visibilitychange`).

### Common Patterns
- **Reveal**: add `class="reveal"` (or `reveal reveal-left` etc.). Container with `class="stagger"` cascades children with 90ms increments.
- **Word-split headlines**: `<h* class="reveal headline-..." data-split>...<span class="gradient-text italic">accent</span>...</h*>`. The splitter in `pages/index.vue` treats `.gradient-text` and `[data-no-split]` as atomic so background-clipped text remains intact.
- **Buttons**: primary CTA → `class="gradient-cta"` (or `cta-gradient-lg` for the final section); secondary → `class="btn-ghost"`.
- **Eyebrows**: small label above headlines → `class="eyebrow-cyan"` (centered variant: `eyebrow-cyan eyebrow-cyan--center`).

## Dependencies

### Internal
- `~~/shared/config/site` — `siteConfig`, `navLinks`, `resourcesDropdown`, `clients`, `testimonials`
- `~~/app/utils/silhouettes` — `STOCK_FIGS`, `StockFig` (used by `PeopleHunt.vue`)
- `app/assets/css/main.css` — every named utility / animation class
- Auto-imported composable: `useScrollReveal` (called once from `pages/index.vue`)

### External
- Vue 3 (`ref`, `computed`, `watch`, `onMounted`, `onBeforeUnmount`, `nextTick`, `Teleport`, `Transition`)
- Nuxt 4 (`useRoute`, `NuxtLink`, `NuxtPage`, `import.meta.client`)

<!-- MANUAL: -->
