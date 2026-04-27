<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-28 | Updated: 2026-04-28 -->

# composables

## Purpose
Auto-imported Vue composables (`use*` functions). Currently a single composable that wires the global scroll-reveal animation pipeline.

## Key Files
| File | Description |
|------|-------------|
| `useScrollReveal.ts` | Mounts an `IntersectionObserver` (threshold `0.12`, rootMargin `0px 0px -120px 0px`) over every `.reveal:not(.revealed)` element, adds `.revealed` once visible, and unobserves. Falls back to immediately revealing all elements if `IntersectionObserver` is missing or no elements are found. Bails out on the server (`!import.meta.client`) and disconnects on `onBeforeUnmount`. |

## For AI Agents

### Working In This Directory
- File name `useFoo.ts` exports `useFoo` — Nuxt auto-imports by both filename and named export.
- Always guard browser APIs with `if (!import.meta.client) return` at the top of the composable, or call browser APIs only inside `onMounted`.
- Always tear down listeners/observers in `onBeforeUnmount`.

### Testing Requirements
- Manual: run `npm run dev`, scroll the home page, confirm sections fade in once they enter the viewport.
- Confirm reduced-motion still allows `.reveal` content to be visible — handled in CSS (`@media (prefers-reduced-motion: reduce)` block in `app/assets/css/main.css` overrides opacity/transform/filter).

### Common Patterns
- The composable is invoked **once** from `app/pages/index.vue` and observes every `.reveal` on the page. Section components only need to add the class — they don't call the composable themselves.
- Word-splitting reveal logic for `data-split` headlines lives inline in `pages/index.vue`, not here, because it also wires scroll-parallax and is tightly coupled to page-mount lifecycle.

## Dependencies

### Internal
- Consumers: every section component that uses `class="reveal"`, plus `pages/index.vue` (initial call).

### External
- Vue (`onMounted`, `onBeforeUnmount`) — auto-imported
- DOM `IntersectionObserver`

<!-- MANUAL: -->
