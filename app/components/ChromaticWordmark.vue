<script setup lang="ts">
/**
 * Mariell brand wordmark — static brand logo (replaces the former animated
 * chromatic text). Renders the official brand PNG (retina @2x).
 *  - `variant`: `light` = cream wordmark for dark surfaces (nav bars);
 *               `dark`  = ink wordmark for light/cream surfaces (home CTA band).
 *  - `size`: rendered logo HEIGHT in px.
 *  - `text`: used as alt text.
 * Legacy `glitch` / `animate` props are accepted but are no-ops now.
 */
withDefaults(defineProps<{
  text?: string
  size?: number
  variant?: 'light' | 'dark'
  glitch?: boolean
  animate?: boolean
}>(), {
  text: 'Mariell',
  size: 24,
  variant: 'light',
  glitch: false,
  animate: false,
})
</script>

<template>
  <img
    class="brand-logo"
    :src="variant === 'dark' ? '/brand/mariell-dark@2x.png' : '/brand/mariell-light@2x.png'"
    :alt="text"
    :style="{ height: `${size}px`, width: 'auto' }"
    decoding="async"
  >
</template>

<style scoped>
.brand-logo {
  display: block;
}
</style>
