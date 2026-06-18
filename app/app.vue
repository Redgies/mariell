<script setup lang="ts">
// Chrome is owned by layouts/ (default = full nav+footer, tool = focused).
// Pages select their layout via definePageMeta({ layout: 'tool' }).

// Verbatim per-route SEO (title/meta/canonical/og/JSON-LD) from the design
// export, applied centrally & reactively for every route. See usePageSeo.
usePageSeo()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
