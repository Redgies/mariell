<script setup lang="ts">
import { clients } from '~~/shared/config/site'

type Tile = { name: string; logo?: string; placeholder?: boolean }

const baseTiles: Tile[] = [
  ...clients.slice(0, 5).map((c) => ({ name: c.name, logo: c.logo })),
  { name: 'Votre logo ?', placeholder: true },
  ...clients.slice(5).map((c) => ({ name: c.name, logo: c.logo })),
]

const doubled: Tile[] = [...baseTiles, ...baseTiles]

const scroller = ref<HTMLElement | null>(null)
let pos = 0
let hovered = false
let raf = 0
const SPEED = 0.25 // px/frame

// RAF loop — toujours applique pos, n'incrémente que si pas en pause
const tick = () => {
  if (scroller.value) {
    if (!hovered && !drag.active) pos += SPEED
    // Boucle seamless
    const half = scroller.value.scrollWidth / 2
    if (pos >= half) pos -= half
    if (pos < 0) pos += half
    scroller.value.scrollLeft = pos
  }
  raf = requestAnimationFrame(tick)
}

// Wheel
const onWheel = (e: WheelEvent) => {
  e.preventDefault()
  pos += e.deltaY + e.deltaX
}

// Drag fluide
const drag = reactive({ active: false, startX: 0, startPos: 0 })

const onMouseDown = (e: MouseEvent) => {
  drag.active = true
  drag.startX = e.pageX
  drag.startPos = pos
  if (scroller.value) scroller.value.style.cursor = 'grabbing'
}
const onMouseMove = (e: MouseEvent) => {
  if (!drag.active) return
  pos = drag.startPos - (e.pageX - drag.startX)
}
const onMouseUp = () => {
  drag.active = false
  if (scroller.value) scroller.value.style.cursor = 'grab'
}

// Touch mobile
const onTouchStart = () => { hovered = true }
const onTouchEnd = () => {
  if (scroller.value) pos = scroller.value.scrollLeft
  hovered = false
}

onMounted(() => {
  if (!scroller.value) return
  scroller.value.style.cursor = 'grab'
  scroller.value.addEventListener('wheel', onWheel, { passive: false })
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  scroller.value?.removeEventListener('wheel', onWheel)
})
</script>

<template>
  <section class="relative px-0 py-14 md:py-20">
    <div class="mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
      <div class="mb-6 flex items-center justify-between">
        <SectionLabel number="—" label="Ils nous font confiance" />
        <span class="hidden font-mono-num text-xs uppercase tracking-[0.22em] text-white/40 md:inline">
          depuis 2021
        </span>
      </div>
    </div>

    <div class="reveal mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
      <div
        ref="scroller"
        class="flex overflow-x-hidden carousel-scroll select-none"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false; onMouseUp()"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <div
          v-for="(tile, idx) in doubled"
          :key="`logo-${idx}`"
          :class="[
            'flex h-28 w-52 shrink-0 items-center justify-center border-r transition-colors md:h-32 md:w-60',
            tile.placeholder
              ? 'border-white/25 border-r-dashed text-xs uppercase tracking-[0.2em] text-white/75 hover:text-white'
              : 'client-tile border-white/8',
          ]"
          :style="tile.placeholder ? 'font-family: var(--font-grotesk); font-weight: 500;' : ''"
        >
          <template v-if="tile.placeholder">
            <span class="gradient-text italic">{{ tile.name }}</span>
          </template>
          <template v-else>
            <img
              :src="tile.logo"
              :alt="tile.name"
              class="h-20 w-36 object-contain opacity-60 transition-opacity hover:opacity-90"
              draggable="false"
            />
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
