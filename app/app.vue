<script setup lang="ts">
// Chrome is owned by the default layout (full nav+footer). The Lab tool pages
// are self-contained (dark, own "Retour au Lab" bar) via definePageMeta({ layout: false }).

// Verbatim per-route SEO (title/meta/canonical/og/JSON-LD) from the design
// export, applied centrally & reactively for every route. See usePageSeo.
usePageSeo()

// Page transition — a "fade through black" overlay driven by Nuxt navigation
// hooks. It sits above everything (z-index 9999) so it also covers the nav and
// any open mobile menu during a route change. A minimum hold makes the change
// perceptible even when pages load instantly. Disabled via CSS on reduced-motion.
const fading = ref(false)

if (import.meta.client) {
  const nuxtApp = useNuxtApp()
  // Min time the screen stays fully black before revealing. Long enough that the
  // ~200ms cover completes and the route swap + scroll reset happen unseen.
  const HOLD = 420
  let startAt = 0

  nuxtApp.hook('page:start', () => {
    fading.value = true
    startAt = performance.now()
  })
  nuxtApp.hook('page:finish', () => {
    const elapsed = performance.now() - startAt
    window.setTimeout(() => { fading.value = false }, Math.max(0, HOLD - elapsed))
  })
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <div class="page-fade" :class="{ 'is-on': fading }" aria-hidden="true" />
</template>
