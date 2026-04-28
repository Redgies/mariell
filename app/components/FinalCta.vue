<script setup lang="ts">
import { siteConfig } from '~~/shared/config/site'
</script>

<template>
  <section
    id="contact"
    class="relative overflow-hidden px-5 pb-12 pt-16 text-center md:px-10 md:pb-16 md:pt-20 lg:px-16"
  >
    <div class="reveal flex justify-center">
      <span class="eyebrow-cyan eyebrow-cyan--center">Parlons-en</span>
    </div>

    <h2 class="reveal mx-auto mt-10 max-w-5xl headline-final text-white">
      Encore bienvenue<br />
      <span class="gradient-text italic">chez Mariell.</span>
    </h2>

    <p
      class="reveal mx-auto mt-10 max-w-2xl text-[1.05rem] leading-[1.65] text-white/60"
      style="font-family: var(--font-grotesk); font-weight: 300;"
    >
      Un besoin précis, une recherche qui dure, ou juste une discussion pour mesurer ce qu'on peut vous apporter. Dans tous les cas — on démarre par un échange.
    </p>

    <div class="reveal mt-12 flex justify-center">
      <a :href="siteConfig.calendlyUrl" class="cta-gradient-lg">
        {{ siteConfig.ctaFinal }}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    </div>
  </section>
</template>
