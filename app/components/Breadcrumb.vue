<script setup lang="ts">
/**
 * Editorial breadcrumb — renders the `.breadcrumb` markup (pages.css) AND
 * injects a schema.org BreadcrumbList JSON-LD using absolute site URLs.
 * The last item is the current page (no link). "Accueil" (/) is prepended
 * automatically unless the first item is already the home.
 */
const props = defineProps<{
  items: { label: string; to?: string }[]
}>()

// Visual-only. The BreadcrumbList JSON-LD is provided verbatim from the design
// export via usePageSeo (app.vue), so it must NOT be duplicated here.
const trail = computed(() => {
  const first = props.items[0]
  return first?.to === '/' ? props.items : [{ label: 'Accueil', to: '/' }, ...props.items]
})
</script>

<template>
  <nav class="breadcrumb" aria-label="Fil d’Ariane">
    <template v-for="(it, i) in trail" :key="i">
      <NuxtLink v-if="it.to && i < trail.length - 1" :to="it.to">{{ it.label }}</NuxtLink>
      <span v-else>{{ it.label }}</span>
      <span v-if="i < trail.length - 1" class="breadcrumb__sep"> / </span>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumb__sep { opacity: 0.5; }
</style>
