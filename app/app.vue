<script setup lang="ts">
// Chrome is owned by the default layout (full nav+footer). The Lab tool pages
// are self-contained (dark, own "Retour au Lab" bar) via definePageMeta({ layout: false }).

// Verbatim per-route SEO (title/meta/canonical/og/JSON-LD) from the design
// export, applied centrally & reactively for every route. See usePageSeo.
usePageSeo()

// Route transition = a content-only fade (see app.pageTransition in nuxt.config).
// It wraps <NuxtPage> only, so the layout chrome (nav/footer) stays fixed — only
// the routed content fades. CSS + reduced-motion handling live in main.css.
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
