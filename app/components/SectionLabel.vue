<script setup lang="ts">
defineProps<{
  number: string
  label: string
}>()
</script>

<template>
  <div class="reveal eyebrow">
    <span class="font-mono-num text-white/70">{{ number }}</span>
    <span class="font-mono-num">{{ label }}</span>
  </div>
</template>
