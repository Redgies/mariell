<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-28 | Updated: 2026-04-28 -->

# shared

## Purpose
Code shared between client and (eventually) server contexts in the Nuxt 4 layout. Reachable from anywhere via the `~~/shared/...` import alias. Currently holds a single configuration module.

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `config/` | Site-wide configuration constants (see `config/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Modules in `shared/` are imported explicitly with the `~~/shared/...` alias (Nuxt 4 doesn't auto-import this folder).
- Keep this folder pure-TS / data-only — no Vue runtime APIs, no `import.meta.client` guards. The whole point is that the same module can be evaluated outside a Vue component.

### Testing Requirements
- After changing shared constants, manually verify each consumer in `app/components/*.vue` still renders. There are no automated tests.

## Dependencies

### Internal
- Consumed by: `app/components/AppNavbar.vue`, `app/components/AppFooter.vue`, `app/components/HeroSection.vue`, `app/components/ClientsMarquee.vue`, `app/components/PricingSection.vue`, `app/components/TestimonialsCarousel.vue`, `app/components/FinalCta.vue`.

### External
- None.

<!-- MANUAL: -->
