<script setup lang="ts">
/**
 * Mariell brand wordmark — live text faithful to the brand-kit lockup
 * (02-color): "MARIELL" in Tiempos Headline 500 with a cyan/magenta chromatic
 * split. Rendered as transparent live text (the site already self-hosts Tiempos
 * as --font-display), so no background, crisp at any size, no heavy asset.
 *  - `variant`: `light` = white wordmark for dark surfaces (nav bars);
 *               `dark`  = ink wordmark for light/cream surfaces (home CTA band).
 *  - `size`: font-size in px. `text`: accessible name (displayed upper-cased).
 * Legacy `glitch` / `animate` props are accepted but are no-ops now (static).
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
  <span
    class="brand-wm"
    :class="`brand-wm--${variant}`"
    :style="{ fontSize: `${size}px` }"
    role="img"
    :aria-label="text"
  >
    <span class="brand-wm__layer brand-wm__layer--cyan" aria-hidden="true">{{ text }}</span>
    <span class="brand-wm__layer brand-wm__layer--magenta" aria-hidden="true">{{ text }}</span>
    <span class="brand-wm__base" aria-hidden="true">{{ text }}</span>
  </span>
</template>

<style scoped>
.brand-wm {
  position: relative;
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: 0.005em;
  line-height: 1;
  white-space: nowrap;
  text-transform: uppercase;
}
.brand-wm__base {
  position: relative;
  z-index: 2;
  display: block;
}
/* Chromatic split — offsets ≈ ±0.021em (brand mark's 6.3 / 296 ratio). The
   opaque base sits on top; the coloured layers peek out only at the edges. */
.brand-wm__layer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: block;
}
.brand-wm__layer--cyan {
  color: #5ee7e7;
  transform: translateX(-0.021em);
}
.brand-wm__layer--magenta {
  color: #e85eff;
  transform: translateX(0.021em);
}

/* light = white wordmark on dark surfaces (nav) */
.brand-wm--light .brand-wm__base {
  color: #ffffff;
}
.brand-wm--light .brand-wm__layer {
  mix-blend-mode: screen;
}

/* dark = ink wordmark on light/cream surfaces (CTA band) */
.brand-wm--dark .brand-wm__base {
  color: #0a0a0a;
}
.brand-wm--dark .brand-wm__layer {
  opacity: 0.85;
}
</style>
