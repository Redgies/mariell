<script setup lang="ts">
import { siteConfig } from '~~/shared/config/site'

const sideBadges = [
  { value: '94%', label: 'Success rate' },
  { value: 'Avec', label: "Garantie période d'essai" },
  { value: '100%', label: 'Chasse sur-mesure' },
]
</script>

<template>
  <section id="pricing" class="relative px-5 py-12 md:px-10 md:py-16 lg:px-16">
    <div class="mx-auto max-w-7xl">
      <div class="reveal mb-12 max-w-2xl">
        <span class="eyebrow-cyan">Pricing</span>
        <h2 class="mt-5 headline-section text-white" data-split>
          <span class="gradient-text italic">Simple.</span><br />
          Transparent.
        </h2>
      </div>

      <div class="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
        <!-- Left: pricing box -->
        <div class="pricing-box reveal">
          <p
            class="text-[16px] leading-[1.7] text-white/65"
            style="font-family: var(--font-grotesk); font-weight: 300;"
          >
            <strong class="font-medium text-white">Chez Mariell, on ne se cache pas. Pas de prix à la tête, pas de bullshit.</strong>
          </p>

          <div
            class="mt-6 mb-2 gradient-text text-[72px] leading-none tracking-[-0.04em]"
            style="font-family: var(--font-serif-jp); font-weight: 500;"
          >
            20%
          </div>
          <div class="text-[13px] tracking-wide text-white/45">
            du salaire fixe du candidat recruté
          </div>

          <p
            class="mt-7 text-[16px] leading-[1.7] text-white/65"
            style="font-family: var(--font-grotesk); font-weight: 300;"
          >
            + 2 RDV pour constater les performances du candidat recruté, à <strong class="font-medium text-white">4 mois puis 8 mois</strong>.
          </p>

          <p
            class="mt-4 text-[16px] leading-[1.7] text-white/65"
            style="font-family: var(--font-grotesk); font-weight: 300;"
          >
            Devis sur-mesure pour les recrutements multiples, et les profils freelance.
          </p>

          <div
            class="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-white/8 pt-7"
          >
            <div
              class="text-[22px] text-white"
              style="font-family: var(--font-serif-jp); font-weight: 500;"
            >
              On en discute&thinsp;?
            </div>
            <a
              :href="siteConfig.calendlyUrl"
              class="gradient-cta group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm text-black md:text-base"
              style="font-family: var(--font-grotesk); font-weight: 600;"
            >
              {{ siteConfig.ctaPricing }}
              <svg class="transition-transform duration-300 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Right: vertical badges -->
        <div class="flex w-fit flex-col gap-4">
          <div
            v-for="(b, idx) in sideBadges"
            :key="idx"
            class="reveal flex items-center gap-6 rounded-2xl border border-white/8 bg-white/[0.02] px-8 py-8"
          >
            <div
              class="gradient-text min-w-[120px] text-[56px] leading-none tracking-[-0.03em]"
              style="font-family: var(--font-serif-jp); font-weight: 500;"
            >
              {{ b.value }}
            </div>
            <div
              class="text-[15px] uppercase leading-snug tracking-[0.08em] text-white"
              style="font-family: var(--font-grotesk); font-weight: 500;"
            >
              {{ b.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
