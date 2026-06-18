<script setup lang="ts">
// Chrome is owned by the default layout (full nav+footer). The Lab tool pages
// are self-contained (dark, own "Retour au Lab" bar) via definePageMeta({ layout: false }).

// Verbatim per-route SEO (title/meta/canonical/og/JSON-LD) from the design
// export, applied centrally & reactively for every route. See usePageSeo.
usePageSeo()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
