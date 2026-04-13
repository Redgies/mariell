<script setup lang="ts">
import { clients } from '~~/shared/config/site'

type Tile = { name: string; placeholder?: boolean }

// TODO: remplacer chaque .client-tile (sauf placeholder) par <img src="/logos/client-N.svg" alt="Client N" />
// Injecter le placeholder "Votre logo ?" au milieu pour que le visiteur se projette.
const baseTiles: Tile[] = [
  ...clients.slice(0, 4).map((c) => ({ name: c.name })),
  { name: 'Votre logo ?', placeholder: true },
  ...clients.slice(4).map((c) => ({ name: c.name })),
]

// Duplicate once for seamless marquee loop.
const doubled: Tile[] = [...baseTiles, ...baseTiles]
</script>

<template>
  <section class="relative px-0 py-24 md:py-32">
    <div class="mx-auto max-w-7xl px-5 md:px-10 lg:px-16">
      <div class="mb-12 flex items-baseline justify-between">
        <SectionLabel number="—" label="Ils nous font confiance" />
        <span class="hidden font-mono-num text-xs uppercase tracking-[0.22em] text-white/40 md:inline">
          depuis 2021
        </span>
      </div>
    </div>

    <div class="reveal relative overflow-hidden">
      <!-- Soft fade masks on sides -->
      <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent md:w-40" />
      <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent md:w-40" />

      <div class="flex w-max gap-0 marquee-track">
        <div
          v-for="(tile, idx) in doubled"
          :key="`logo-${idx}`"
          :class="[
            'flex h-20 w-48 shrink-0 items-center justify-center border-r text-xs uppercase tracking-[0.2em] transition-colors md:h-24 md:w-56',
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
            {{ tile.name }}
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
