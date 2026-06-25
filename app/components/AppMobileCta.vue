<script setup lang="ts">
/**
 * Mobile-only sticky CTA bar — the primary conversion lever on phones, where the
 * nav's Calendly CTA is tucked inside the burger menu. Rendered from the default
 * layout, so it never appears on the chrome-less Lab tool pages (layout: false).
 * Shows once the visitor scrolls past the hero and hides near the page bottom so
 * it never sits on top of the footer / final CTA. Desktop: hidden via CSS.
 * Collapses cleanly under prefers-reduced-motion (fade only, no slide).
 */
const calendlyUrl = useRuntimeConfig().public.calendlyUrl as string
const visible = ref(false)
let ticking = false

function update() {
  const y = window.scrollY
  const docH = document.documentElement.scrollHeight
  const nearBottom = y + window.innerHeight > docH - 220
  visible.value = y > 480 && !nearBottom
  ticking = false
}
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(update)
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div class="mobile-cta" :class="{ 'is-visible': visible }">
    <a class="btn btn--primary mobile-cta__btn" :href="calendlyUrl" target="_blank" rel="noopener">
      Rencontrer Mariell
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
    </a>
    <span class="mobile-cta__sub">30&#160;min&#160;·&#160;Sans engagement&#160;·&#160;Confidentiel</span>
  </div>
</template>

<style scoped>
.mobile-cta {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
  background: rgba(11, 13, 16, 0.86);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(244, 239, 227, 0.1);
  transform: translateY(120%);
  opacity: 0;
  pointer-events: none;
  transition:
    transform 360ms var(--ease-out),
    opacity 360ms var(--ease-out);
}
.mobile-cta.is-visible {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}
.mobile-cta__btn {
  width: 100%;
  justify-content: center;
}
.mobile-cta__btn .icon {
  width: 14px;
  height: 14px;
}
.mobile-cta__sub {
  font-size: 11px;
  letter-spacing: 0.02em;
  color: rgba(244, 239, 227, 0.5);
}

/* Desktop: the nav CTA is visible, so the bar is unnecessary. */
@media (min-width: 901px) {
  .mobile-cta {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .mobile-cta {
    transform: none;
    transition: opacity 200ms linear;
  }
}
</style>
