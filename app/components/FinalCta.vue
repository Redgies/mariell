<script setup lang="ts">
import { siteConfig } from '~~/shared/config/site'
</script>

<template>
  <section class="relative overflow-hidden px-5 py-36 md:px-10 md:py-52 lg:px-16">
    <!-- Atmospheric central glow -->
    <div
      class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      <div
        class="blob"
        style="
          position: relative;
          width: 900px;
          height: 900px;
          background: radial-gradient(circle, #ff00ff 0%, #00ffff 55%, transparent 75%);
          opacity: 0.28;
          filter: blur(140px);
        "
      />
    </div>

    <div class="relative mx-auto max-w-5xl text-center">
      <div class="flex justify-center">
        <SectionLabel number="—" label="Parlons-en" />
      </div>

      <h2
        class="mt-10 headline-xl text-white scroll-parallax"
        data-parallax="-0.9"
        data-split
      >
        Encore bienvenue<br />chez <span class="gradient-text italic">Mariell.</span>
      </h2>

      <p
        class="reveal mx-auto mt-10 max-w-xl text-base leading-relaxed text-white/65 md:text-lg"
        style="font-family: var(--font-grotesk); font-weight: 300;"
      >
        Un besoin précis, une recherche qui dure, ou juste une discussion pour mesurer ce qu'on peut vous apporter. Dans tous les cas — on démarre par un échange.
      </p>

      <div class="reveal mt-14 flex justify-center">
        <a
          :href="siteConfig.calendlyUrl"
          class="gradient-cta group inline-flex items-center gap-3 rounded-full px-10 py-5 text-base text-black md:px-14 md:py-6 md:text-lg"
          style="font-family: var(--font-grotesk); font-weight: 600;"
        >
          {{ siteConfig.ctaFinal }}
          <svg class="transition-transform duration-300 group-hover:translate-x-1" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>
