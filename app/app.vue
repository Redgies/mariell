<script setup lang="ts">
const route = useRoute()
const isFocusedTool = computed(() => route.path.startsWith('/lab/demande-stage-alternance'))
</script>

<template>
  <div class="relative min-h-screen text-white">
    <ScrollProgress v-if="!isFocusedTool" />
    <GradientBlobs v-if="!isFocusedTool" />
    <AppNavbar v-if="!isFocusedTool" />
    <NuxtPage />
    <AppFooter v-if="!isFocusedTool" />
  </div>
</template>
