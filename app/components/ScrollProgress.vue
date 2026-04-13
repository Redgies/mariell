<script setup lang="ts">
const progress = ref(0)

onMounted(() => {
  if (!import.meta.client) return

  let ticking = false
  const update = () => {
    const doc = document.documentElement
    const max = doc.scrollHeight - window.innerHeight
    progress.value = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
    ticking = false
  }

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update)
      ticking = true
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  update()

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })
})
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
    style="background: linear-gradient(90deg, #00ffff 0%, #8a2be2 50%, #ff00ff 100%);"
    :style="{ transform: `scaleX(${progress})` }"
    aria-hidden="true"
  />
</template>
