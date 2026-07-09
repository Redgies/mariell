<script setup lang="ts">
// Chrome is owned by the default layout (full nav+footer). The Lab tool pages
// are self-contained (dark, own "Retour au Lab" bar) via definePageMeta({ layout: false }).

// Verbatim per-route SEO (title/meta/canonical/og/JSON-LD) from the design
// export, applied centrally & reactively for every route. See usePageSeo.
usePageSeo()

// Route transition — content-only fade+slide (name "page", mode out-in) defined
// in nuxt.config app.pageTransition + main.css. The navbar/footer live in the
// default layout as siblings of the transitioned <slot>, so they stay fixed —
// only the routed content animates. Scroll reset is delayed via router.options.
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
