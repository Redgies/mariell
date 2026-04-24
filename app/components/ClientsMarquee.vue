<script setup lang="ts">
import { clients } from '~~/shared/config/site'

type Tile = { name: string; logo?: string; placeholder?: boolean }

const baseTiles: Tile[] = [
  ...clients.slice(0, 5).map((c) => ({ name: c.name, logo: c.logo })),
  ...clients.slice(5, 8).map((c) => ({ name: c.name, logo: c.logo })),
  { name: '+ Votre logo ?', placeholder: true },
]

const doubled: Tile[] = [...baseTiles, ...baseTiles]
</script>

<template>
  <section class="relative overflow-hidden py-16 md:pb-24">
    <div class="reveal mx-auto mb-8 flex max-w-7xl flex-wrap items-baseline justify-between gap-3 px-5 md:px-10 lg:px-16">
      <h3
        class="text-[22px] tracking-[-0.01em] text-white/65"
        style="font-family: var(--font-serif-jp); font-weight: 500;"
      >
        Ils ont chassé avec Mariell.
      </h3>
      <span class="font-mono-num text-[11px] uppercase tracking-[0.28em] text-white/45">
        8 + 1 emplacement libre
      </span>
    </div>

    <div class="reveal">
      <div class="clients-ticker">
        <div
          v-for="(tile, idx) in doubled"
          :key="`tile-${idx}`"
          :class="['client-tile', tile.placeholder && 'client-tile--join']"
          :aria-hidden="idx >= doubled.length / 2 ? 'true' : undefined"
        >
          <template v-if="tile.placeholder">
            <span class="gradient-text italic">{{ tile.name }}</span>
          </template>
          <template v-else>
            <img :src="tile.logo" :alt="tile.name" draggable="false" />
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
