<script setup lang="ts">
import { benefits } from '~~/shared/config/site'
</script>

<template>
  <section id="process" class="relative px-5 py-14 md:px-10 md:py-20 lg:px-16">
    <div class="mx-auto max-w-7xl">
      <div class="mb-12 grid grid-cols-12 gap-x-6 gap-y-8">
        <div class="col-span-12 md:col-span-5">
          <SectionLabel number="— 02" label="Pourquoi Mariell" />
          <h2 class="mt-6 headline-lg text-white" data-split>
            Quatre raisons,<br />
            <span class="gradient-text italic">zéro hasard.</span>
          </h2>
        </div>
        <p
          class="reveal col-span-12 max-w-xl self-end text-base leading-relaxed text-white/60 md:col-span-5 md:col-start-7 md:text-lg"
          style="font-family: var(--font-grotesk); font-weight: 300;"
        >
          Recruter un Sales n'est pas un pari. C'est un investissement mesurable, et nous en tenons les comptes à votre place.
        </p>
      </div>

      <div class="stagger grid grid-cols-1 gap-4 md:grid-cols-2">
        <article
          v-for="(benefit, idx) in benefits"
          :key="`benefit-${idx}`"
          class="reveal card-tilt group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm transition-colors hover:border-white/25 md:p-8"
        >
          <div class="mb-6 flex items-baseline justify-between">
            <span class="font-mono-num text-xs uppercase tracking-[0.25em] text-white/40">
              0{{ idx + 1 }}
            </span>
            <span class="text-3xl transition-transform duration-500 group-hover:-translate-y-1 md:text-4xl" role="img" aria-hidden="true">
              {{ benefit.icon }}
            </span>
          </div>

          <h3 class="mb-3 text-lg font-semibold text-white md:text-xl">
            {{ benefit.title }}
          </h3>

          <div
            class="whitespace-pre-line text-[0.95rem] leading-relaxed text-white/80 md:text-base"
            style="font-family: var(--font-grotesk); font-weight: 300;"
          >
            {{ benefit.text }}
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
