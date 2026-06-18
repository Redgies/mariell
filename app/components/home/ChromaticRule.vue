<script setup lang="ts">
defineProps<{ ink?: boolean }>()
</script>

<template>
  <hr :class="['chromatic-rule', ink && 'chromatic-rule--ink']" aria-hidden="true" />
</template>
