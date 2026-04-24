<script setup lang="ts">
import { siteConfig } from '~~/shared/config/site'
</script>

<template>
  <section
    id="accueil"
    class="relative flex min-h-screen items-center px-5 pt-36 pb-16 md:px-10 lg:px-16"
  >
    <div class="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
      <!-- Left: editorial copy -->
      <div>
        <div class="reveal eyebrow-cyan mb-8">Cabinet de recrutement Sales</div>

        <h1 class="reveal headline-asym text-white" data-split>
          Bienvenue<br />
          <span class="gradient-text italic">chez Mariell.</span>
        </h1>

        <p
          class="reveal mt-7 max-w-xl text-[clamp(20px,2.2vw,28px)] leading-snug text-white/70"
          style="font-family: var(--font-serif-jp); font-weight: 500; letter-spacing: -0.01em;"
        >
          Nous recrutons les meilleurs Sales, pour vous.
        </p>

        <div
          class="reveal mt-9 max-w-xl space-y-3 text-[15.5px] leading-[1.75] text-white/65"
          style="font-family: var(--font-grotesk); font-weight: 300;"
        >
          <p><em class="font-medium not-italic text-white">Des Sales qui chassent d'autres Sales.</em></p>
          <p>On ne vend pas de rêve, mais une réalité&nbsp;: les tops profils sont rares, les meilleurs encore plus durs à déceler.</p>
          <p>Notre mission&nbsp;: vous présenter ces profils, uniquement ces profils.</p>
          <p>Les meilleures entreprises recrutent les meilleurs Sales, pourquoi pas vous&nbsp;?</p>
        </div>

        <div class="reveal mt-10 flex flex-wrap items-center gap-3.5">
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
          <a href="#process-section" class="btn-ghost">Voir la méthode</a>
        </div>
      </div>

      <!-- Right: stat card -->
      <div class="reveal">
        <div class="stat-card-shell flex max-w-md flex-col gap-7 px-9 py-10">
          <div class="absolute right-6 top-6 font-serif-jp text-sm font-bold tracking-wider text-white">M</div>

          <div class="flex items-baseline gap-3.5 border-b border-white/8 pb-5">
            <div class="font-serif-jp gradient-text text-[72px] leading-none tracking-[-0.04em]" style="font-weight: 500;">94%</div>
            <div class="max-w-[160px] text-[13px] leading-snug text-white/65" style="font-weight: 500;">de succès sur nos recrutements</div>
          </div>

          <div class="flex items-baseline gap-3.5 border-b border-white/8 pb-5">
            <div class="font-serif-jp gradient-text text-[72px] leading-none tracking-[-0.04em]" style="font-weight: 500;">60+</div>
            <div class="max-w-[160px] text-[13px] leading-snug text-white/65" style="font-weight: 500;">tops profils Sales placés</div>
          </div>

          <div class="flex items-baseline gap-3.5">
            <div class="font-serif-jp gradient-text text-[72px] leading-none tracking-[-0.04em]" style="font-weight: 500;">7j</div>
            <div class="max-w-[160px] text-[13px] leading-snug text-white/65" style="font-weight: 500;">avant les premiers candidats</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
