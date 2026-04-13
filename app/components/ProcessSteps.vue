<script setup lang="ts">
import { processSteps } from '~~/shared/config/site'
</script>

<template>
  <section class="relative px-5 py-28 md:px-10 md:py-40 lg:px-16">
    <div class="mx-auto max-w-7xl">
      <div class="mb-20 grid grid-cols-12 gap-x-6 gap-y-8">
        <div class="col-span-12 md:col-span-5">
          <SectionLabel number="— 03" label="Méthodologie" />
          <h2 class="mt-6 headline-lg text-white scroll-parallax" data-parallax="-0.8" data-split>
            Sur-mesure,<br />
            <span class="gradient-text italic">jamais standard.</span>
          </h2>
        </div>
        <div
          class="reveal col-span-12 max-w-xl self-end space-y-3 text-base leading-relaxed text-white/60 md:col-span-5 md:col-start-7 md:text-lg"
          style="font-family: var(--font-grotesk); font-weight: 300;"
        >
          <p>
            Toutes les recherches sont différentes, les conditions qui en découlent varient. La finalité reste identique : recruter le meilleur profil.
          </p>
          <p class="text-white/85">
            Premiers candidats sous <span class="gradient-text font-semibold">7–10 jours</span> en moyenne.
          </p>
        </div>
      </div>

      <ol class="stagger relative grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-0">
        <li
          v-for="(step, idx) in processSteps"
          :key="step.number"
          class="reveal relative flex flex-col border-t border-white/10 py-10 md:border-r md:border-t md:last:border-r-0 md:px-6 md:first:pl-0 md:last:pr-0"
        >
          <div class="mb-6 flex items-center gap-4">
            <span class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">
              Étape {{ step.number }}
            </span>
            <span class="h-px flex-1 bg-gradient-to-r from-cyan-500/40 to-transparent" />
          </div>

          <h3
            class="mb-5 font-serif-jp text-3xl leading-tight text-white md:text-4xl"
          >
            {{ step.title }}
          </h3>

          <p
            class="text-sm leading-relaxed text-white/65 md:text-[0.95rem]"
            style="font-family: var(--font-grotesk); font-weight: 300;"
          >
            {{ step.description }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>
