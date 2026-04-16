<script setup lang="ts">
import { pricingBadges, siteConfig } from '~~/shared/config/site'
</script>

<template>
  <section id="pricing" class="relative px-5 py-28 md:px-10 md:py-40 lg:px-16">
    <div class="mx-auto max-w-7xl">
      <div class="grid grid-cols-12 gap-x-6 gap-y-12">
        <div class="col-span-12 md:col-span-5">
          <SectionLabel number="— 04" label="Pricing" />
          <h2 class="mt-6 headline-lg text-white" data-split>
            Simple.<br />
            <span class="gradient-text italic">Transparent.</span>
          </h2>

          <p
            class="reveal mt-8 text-base leading-relaxed text-white/65 md:text-lg"
            style="font-family: var(--font-grotesk); font-weight: 300;"
          >
            Chez Mariell on ne se cache pas.<br />Pas de prix à la tête, pas de bullshit.
          </p>
        </div>

        <div class="col-span-12 md:col-span-7">
          <!-- Headline price card -->
          <div class="reveal relative overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm">
            <div class="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" aria-hidden="true" />
            <div class="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" aria-hidden="true" />

            <div class="relative p-8 md:p-12">
              <p class="font-mono-num text-xs uppercase tracking-[0.25em] text-white/45">
                Fees · Pour 1 recrutement
              </p>
              <div class="mt-4 flex items-baseline gap-2">
                <span class="font-serif-jp text-6xl text-white md:text-8xl">20</span>
                <span class="gradient-text font-serif-jp text-5xl md:text-7xl">%</span>
                <span
                  class="ml-2 text-sm text-white/55 md:text-base"
                  style="font-family: var(--font-grotesk); font-weight: 300;"
                >
                  du salaire fixe du candidat recruté
                </span>
              </div>

              <div class="mt-8 h-px w-full bg-white/10" />

              <ul
                class="mt-8 space-y-4 text-sm text-white/75 md:text-base"
                style="font-family: var(--font-grotesk); font-weight: 300;"
              >
                <li class="flex items-start gap-3">
                  <span class="mt-1 h-px w-6 shrink-0 bg-cyan-400/70" aria-hidden="true" />
                  <span>RDV à <span class="text-white">4 mois</span> pour constater les performances du candidat recruté.</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="mt-1 h-px w-6 shrink-0 bg-fuchsia-400/70" aria-hidden="true" />
                  <span>RDV à <span class="text-white">8 mois</span>, même exercice. Pas de « place and forget ».</span>
                </li>
              </ul>

              <p
                class="mt-6 text-xs text-white/40"
                style="font-family: var(--font-grotesk); font-weight: 300;"
              >
                Devis sur-mesure pour les recrutements multiples, et les profils freelance.
              </p>
            </div>
          </div>

          <!-- CTA row -->
          <div
            class="reveal mt-8 flex flex-col items-start justify-between gap-5 border border-white/10 p-6 md:flex-row md:items-center md:p-8"
          >
            <p
              class="font-serif-jp text-2xl text-white md:text-3xl"
            >
              On en discute&thinsp;?
            </p>
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

        <!-- Badges strip -->
        <div class="stagger col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div
            v-for="(badge, idx) in pricingBadges"
            :key="badge"
            class="reveal flex items-center gap-5 rounded-2xl border border-white/10 bg-black/40 px-6 py-5 backdrop-blur-sm"
          >
            <span class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">
              0{{ idx + 1 }}
            </span>
            <span
              class="text-sm text-white/90 md:text-base"
              style="font-family: var(--font-grotesk); font-weight: 400;"
            >
              {{ badge }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
