<script setup lang="ts">
/**
 * Mariell chromatic wordmark — cyan/magenta split lifted from the brand mark.
 * Relies on the `.chromatic*` classes defined in design/site.css.
 * `glitch` = periodic nav pulse ; `animate` = one-shot settle on load.
 * NOTE: rendered as live text in --font-display weight 600. Flagged in the
 * design handoff to be swapped for an SVG once Tiempos is licensed.
 */
withDefaults(defineProps<{
  text?: string
  size?: number
  glitch?: boolean
  animate?: boolean
}>(), {
  text: 'Mariell',
  size: 24,
  glitch: false,
  animate: false,
})
</script>

<template>
  <span
    class="chromatic"
    :class="{ 'chromatic--glitch': glitch, 'chromatic--animate': animate }"
    :style="{ fontSize: `${size}px` }"
  >
    <span class="chromatic__layer chromatic__layer--cyan">{{ text }}</span>
    <span class="chromatic__layer chromatic__layer--magenta">{{ text }}</span>
    <span class="chromatic__base">{{ text }}</span>
  </span>
</template>
