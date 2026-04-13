<script setup lang="ts">
// Scroll-driven parallax (co-located for robustness against stale Nuxt auto-import cache).
onMounted(() => {
  if (!import.meta.client) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const blobs = document.querySelectorAll<HTMLElement>('.blob')
  if (blobs.length === 0) return

  const factors = Array.from(blobs, (_, i) => 0.06 + (i % 4) * 0.04)
  let scrollY = window.scrollY
  let ticking = false

  const apply = () => {
    blobs.forEach((el, i) => {
      const offset = scrollY * (factors[i] ?? 0.1)
      el.style.setProperty('--parallax-y', `${-offset}px`)
    })
    ticking = false
  }

  const onScroll = () => {
    scrollY = window.scrollY
    if (!ticking) {
      requestAnimationFrame(apply)
      ticking = true
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  apply()

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
  })
})
</script>

<template>
  <!-- Fixed viewport layer — blobs stay visible regardless of scroll (parallax aurora). -->
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <!-- Top-left cyan -->
    <div
      class="blob blob-slow"
      style="
        top: -15%;
        left: -10%;
        width: 780px;
        height: 780px;
        background: radial-gradient(circle at 35% 35%, #00ffff 0%, transparent 62%);
        opacity: 0.55;
      "
    />
    <!-- Top-right magenta -->
    <div
      class="blob"
      style="
        top: -5%;
        right: -12%;
        width: 700px;
        height: 700px;
        background: radial-gradient(circle at 50% 50%, #ff00ff 0%, transparent 60%);
        opacity: 0.5;
      "
    />
    <!-- Mid-left violet -->
    <div
      class="blob blob-faster"
      style="
        top: 30%;
        left: 15%;
        width: 720px;
        height: 720px;
        background: radial-gradient(circle at 50% 50%, #8a2be2 0%, transparent 65%);
        opacity: 0.45;
      "
    />
    <!-- Mid-right cyan -->
    <div
      class="blob blob-slow"
      style="
        top: 40%;
        right: -8%;
        width: 640px;
        height: 640px;
        background: radial-gradient(circle at 50% 50%, #00ffff 0%, transparent 65%);
        opacity: 0.45;
      "
    />
    <!-- Bottom-left magenta -->
    <div
      class="blob"
      style="
        bottom: -10%;
        left: 10%;
        width: 820px;
        height: 820px;
        background: radial-gradient(circle at 50% 50%, #ff00ff 0%, transparent 60%);
        opacity: 0.5;
      "
    />
    <!-- Bottom-right cyan -->
    <div
      class="blob blob-faster"
      style="
        bottom: -15%;
        right: -5%;
        width: 680px;
        height: 680px;
        background: radial-gradient(circle at 50% 50%, #00ffff 0%, transparent 65%);
        opacity: 0.4;
      "
    />
  </div>
</template>
