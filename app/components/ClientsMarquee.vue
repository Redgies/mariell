<script setup lang="ts">
import { clients } from '~~/shared/config/site'

type Tile = { name: string; logo?: string; placeholder?: boolean }

const tiles: Tile[] = [
  ...clients.slice(0, 5).map((c) => ({ name: c.name, logo: c.logo })),
  { name: 'Votre logo ?', placeholder: true },
  ...clients.slice(5).map((c) => ({ name: c.name, logo: c.logo })),
]

const scroller = ref<HTMLElement | null>(null)

const scrollByAmount = (direction: 1 | -1) => {
  if (!scroller.value) return
  const tile = scroller.value.querySelector<HTMLElement>('.client-tile')
  const step = (tile?.offsetWidth ?? 144) * 3
  scroller.value.scrollBy({ left: step * direction, behavior: 'smooth' })
}

// Molette → scroll horizontal
const onWheel = (e: WheelEvent) => {
  if (!scroller.value) return
  e.preventDefault()
  scroller.value.scrollLeft += e.deltaY + e.deltaX
}

// Clic-drag
const drag = reactive({ active: false, startX: 0, scrollLeft: 0 })
const onMouseDown = (e: MouseEvent) => {
  if (!scroller.value) return
  drag.active = true
  drag.startX = e.pageX - scroller.value.offsetLeft
  drag.scrollLeft = scroller.value.scrollLeft
  scroller.value.style.cursor = 'grabbing'
}
const onMouseMove = (e: MouseEvent) => {
  if (!drag.active || !scroller.value) return
  e.preventDefault()
  const x = e.pageX - scroller.value.offsetLeft
  scroller.value.scrollLeft = drag.scrollLeft - (x - drag.startX)
}
const onMouseUp = () => {
  drag.active = false
  if (scroller.value) scroller.value.style.cursor = 'grab'
}

onMounted(() => {
  if (!scroller.value) return
  scroller.value.style.cursor = 'grab'
  scroller.value.addEventListener('wheel', onWheel, { passive: false })
})
onBeforeUnmount(() => {
  scroller.value?.removeEventListener('wheel', onWheel)
})
</script>

<template>
  <section class="relative px-0 py-14 md:py-20">
    <div class="mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
      <div class="mb-6 flex items-center justify-between">
        <SectionLabel number="—" label="Ils nous font confiance" />
        <div class="flex items-center gap-4">
          <span class="hidden font-mono-num text-xs uppercase tracking-[0.22em] text-white/40 md:inline">
            depuis 2021
          </span>
          <div class="flex gap-2">
            <button
              @click="scrollByAmount(-1)"
              class="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/50 transition-colors hover:border-white/40 hover:text-white"
              aria-label="Précédent"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button
              @click="scrollByAmount(1)"
              class="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/50 transition-colors hover:border-white/40 hover:text-white"
              aria-label="Suivant"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="reveal mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
      <div
        ref="scroller"
        class="flex overflow-x-auto carousel-scroll select-none"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
      >
        <div
          v-for="(tile, idx) in tiles"
          :key="`logo-${idx}`"
          :class="[
            'flex h-28 w-52 shrink-0 items-center justify-center border-r text-xs uppercase tracking-[0.2em] transition-colors md:h-32 md:w-60',
            tile.placeholder
              ? 'border-white/25 border-r-dashed text-white/75 hover:text-white'
              : 'client-tile border-white/8 text-white/50 hover:text-white/80',
          ]"
          :style="tile.placeholder ? 'font-family: var(--font-grotesk); font-weight: 500;' : 'font-family: var(--font-grotesk); font-weight: 400;'"
        >
          <template v-if="tile.placeholder">
            <span class="gradient-text italic">{{ tile.name }}</span>
          </template>
          <template v-else>
            <img
              :src="tile.logo"
              :alt="tile.name"
              class="h-20 w-36 object-contain opacity-60 transition-opacity hover:opacity-90"
            />
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
