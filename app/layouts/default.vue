<script setup lang="ts">
// Default site chrome: full nav + footer. Used by every page except the
// focused Lab tool forms (which opt into the `tool` layout).
</script>

<template>
  <div class="site-shell">
    <AppNav />
    <main>
      <slot />
    </main>
    <AppFooter />
    <AppMobileCta />
  </div>
</template>

<style scoped>
.site-shell {
  min-height: 100vh;
  background: var(--paper-100);
  color: var(--fg-on-paper-1);
}
</style>
