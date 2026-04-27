<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-28 | Updated: 2026-04-28 -->

# config

## Purpose
Single source of truth for editable site copy and structural data — every CTA label, nav link, client logo path, testimonial, benefit, process step, and pricing badge. Edit this one file to retune the marketing surface.

## Key Files
| File | Description |
|------|-------------|
| `site.ts` | Exports as `const`/typed:<br>• `siteConfig` — `{ calendlyUrl, ctaPrimary, ctaHero, ctaPricing, ctaFinal }`. **`calendlyUrl` is currently `'#'` — replace with the real Calendly URL before launch (TODO comment at top of file).**<br>• `interface NavLink` + `navLinks[]` — Accueil / Who is Mariell ? / Process / Pricing / Ressources (the latter has `hasDropdown: true`).<br>• `resourcesDropdown` — currently a single disabled "Bientôt disponible" entry.<br>• `clients` — auto-generated 10-entry array `{ name, logo: '/logo_<n>.png' }` for the marquee.<br>• `interface Testimonial` + `testimonials[]` — five fictional client quotes (replace with real ones before launch).<br>• `benefits[]` — four cards used by the source/older `BenefitsGrid` data shape (icon emoji, title, multi-line text). The current `BenefitsGrid.vue` uses its own inline asymmetric copy with SVG icons; this array remains for reference / future re-use.<br>• `processSteps[]` — four-step array (Brief → Suivi). Same note: the live `ProcessSteps.vue` has its own inline `chronoSteps` with day markers; this array is the textual fallback.<br>• `pricingBadges[]` — three badge labels. |

## For AI Agents

### Working In This Directory
- Treat `site.ts` as **product copy**, not implementation detail. Marketing changes (CTA wording, nav order, new client logo, testimonial swap) start here.
- Keep all strings in **French** — including ASCII apostrophes / non-breaking spaces — and preserve the `as const` annotations on `siteConfig` and `resourcesDropdown` so consumers get the narrowest types possible.
- When adding a client logo, drop the file into `public/` named `logo_<n>.png` matching the `clients` index, and bump the array length if needed.
- Two slight inconsistencies are intentional: `BenefitsGrid.vue` and `ProcessSteps.vue` carry their own copy locally because their visual layouts (asymmetric grid, day-marker chronology) need fields that the generic `benefits` / `processSteps` arrays don't expose. If you change one, decide whether to update both or merge the schema.
- The README's **"Placeholders à remplacer avant mise en production"** table mirrors the launch-blocker list: `calendlyUrl`, the hero video, client logos, favicon, testimonials.

### Testing Requirements
- After edits: `npm run dev`, then click every CTA (navbar, hero, pricing, final) and confirm they all open the new `calendlyUrl`. Verify nav anchors still resolve and the resources dropdown opens on hover.

### Common Patterns
- Consumers import as `import { siteConfig, navLinks, ... } from '~~/shared/config/site'`.
- All exports are pure data — no functions, no side effects. Safe to import anywhere (component, page, composable, server route).

## Dependencies

### Internal
- See `shared/AGENTS.md` for the consumer list.

### External
- None.

<!-- MANUAL: -->
