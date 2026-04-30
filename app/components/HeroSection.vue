<script setup lang="ts">
import { siteConfig } from '~~/shared/config/site'

interface HeroStat {
  value: string
  label: string
}

const heroStats: HeroStat[] = [
  { value: '94%', label: 'de Succès sur nos recrutements' },
  { value: '60+', label: 'Top Profils Sales placés' },
  { value: '7-10j', label: 'pour recevoir le premier Pool de candidats' },
]
</script>

<template>
  <section
    id="accueil"
    class="relative flex items-start px-5 pt-28 pb-9 md:px-10 lg:px-16"
  >
    <div class="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
      <!-- Left: editorial copy -->
      <div>
        <div class="reveal eyebrow-cyan mb-5">Cabinet de recrutement Sales</div>

        <h1
          class="reveal headline-asym text-white"
          style="font-size: clamp(56px, 7vw, 96px); line-height: 1.04; letter-spacing: -0.035em;"
          data-split
        >
          Bienvenue<br />
          <span class="gradient-text italic">chez Mariell.</span>
        </h1>

        <p
          class="reveal mt-5 max-w-2xl text-[clamp(20px,2.2vw,27px)] leading-snug text-white"
          style="font-family: var(--font-serif-jp); font-weight: 500; letter-spacing: -0.025em;"
        >
          Nous recrutons les meilleurs Sales, pour vous.
        </p>

        <div
          class="reveal mt-5 max-w-xl space-y-1.5 text-[15px] leading-[1.6] text-white/65"
          style="font-family: var(--font-grotesk); font-weight: 300;"
        >
          <p><em class="font-medium not-italic text-white">Des Sales qui chassent d'autres Sales.</em></p>
          <p>On ne vend pas de rêve, mais une réalité&nbsp;: les Tops Profils sont rares.</p>
          <p>Ils ne viendront pas à vous d'eux-mêmes.</p>
          <p>Notre mission&nbsp;: vous présenter ces profils, <em class="font-medium not-italic text-white">uniquement ces profils</em>.</p>
          <p>Les meilleures entreprises recrutent les meilleurs Sales, pourquoi pas vous&nbsp;?</p>
        </div>

        <div class="reveal mt-6 flex flex-wrap items-center gap-3.5">
          <a
            :href="siteConfig.calendlyUrl"
            class="gradient-cta group inline-flex items-center gap-3 rounded-full px-7 py-4 text-base text-black"
            style="font-family: var(--font-grotesk); font-weight: 600;"
          >
            {{ siteConfig.ctaHero }}
            <svg class="transition-transform duration-300 group-hover:translate-x-1" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
          <a href="#approche" class="btn-ghost">Voir la méthode</a>
        </div>
      </div>

      <!-- Right: stat card. Each row is a single grid so the separator line is continuous. -->
      <div class="reveal">
        <div class="stat-card-shell w-full max-w-md px-9">
          <div
            v-for="(stat, idx) in heroStats"
            :key="stat.value"
            class="grid grid-cols-[auto_1fr] items-center gap-x-6 py-7"
            :class="{ 'border-b border-white/8': idx < heroStats.length - 1 }"
          >
            <div
              class="font-serif-jp gradient-text text-[60px] leading-[1.1] tracking-[-0.04em]"
              style="font-weight: 500;"
            >
              {{ stat.value }}
            </div>
            <div
              class="whitespace-pre-line text-[13px] leading-[1.45] tracking-[0.08em] text-white/70 uppercase"
              style="font-weight: 500;"
            >{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
