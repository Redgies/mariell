<script setup lang="ts">
import { testimonials } from '~~/shared/config/site'

const scroller = ref<HTMLElement | null>(null)

const scrollByAmount = (direction: 1 | -1) => {
  if (!scroller.value) return
  const card = scroller.value.querySelector<HTMLElement>('[data-testimonial-card]')
  const step = (card?.offsetWidth ?? 360) + 24
  scroller.value.scrollBy({ left: step * direction, behavior: 'smooth' })
}
</script>

<template>
  <section class="relative px-5 py-14 md:px-10 md:py-20 lg:px-16">
    <div class="mx-auto max-w-7xl">
      <div class="mb-10 grid grid-cols-12 gap-x-6 gap-y-8">
        <div class="col-span-12 md:col-span-7">
          <SectionLabel number="— 05" label="Témoignages" />
          <h2 class="mt-6 headline-lg text-white" data-split>
            Ils nous ont<br />fait <span class="gradient-text italic">confiance.</span>
          </h2>
        </div>

        <div class="col-span-12 flex items-end justify-start gap-3 md:col-span-5 md:justify-end">
          <button
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-all hover:border-cyan-400/50 hover:bg-white/5"
            aria-label="Témoignage précédent"
            @click="scrollByAmount(-1)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-all hover:border-fuchsia-400/50 hover:bg-white/5"
            aria-label="Témoignage suivant"
            @click="scrollByAmount(1)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref="scroller"
        class="reveal carousel-scroll -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0"
        role="region"
        aria-roledescription="carousel"
        aria-label="Témoignages clients"
        tabindex="0"
      >
        <article
          v-for="(testimonial, idx) in testimonials"
          :key="testimonial.name"
          data-testimonial-card
          class="group relative flex w-[85%] shrink-0 snap-center flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm transition-colors hover:border-white/25 sm:w-[55%] md:w-[380px] md:p-8"
        >
          <div class="flex items-start justify-between">
            <span class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">
              0{{ idx + 1 }} / 0{{ testimonials.length }}
            </span>
            <svg class="text-white/15" width="40" height="40" viewBox="0 0 40 40" fill="currentColor" aria-hidden="true">
              <path d="M0 22c0-9.6 5.6-18 14-22l2 4c-5.6 3.2-9 8-9 13h7v13H0V22zm22 0c0-9.6 5.6-18 14-22l2 4c-5.6 3.2-9 8-9 13h7v13H22V22z" />
            </svg>
          </div>

          <p
            class="font-serif-jp text-base leading-relaxed text-white/90 md:text-lg"
          >
            {{ testimonial.quote }}
          </p>

          <div class="flex items-center gap-4 border-t border-white/10 pt-6">
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-white/5 to-white/0"
              aria-hidden="true"
            >
              <span class="font-serif-jp text-base text-white/70">
                {{ testimonial.name.split(' ').map(n => n[0]).join('') }}
              </span>
            </div>
            <div>
              <p
                class="text-sm text-white"
                style="font-family: var(--font-grotesk); font-weight: 500;"
              >
                {{ testimonial.name }}
              </p>
              <p
                class="mt-0.5 text-xs text-white/55"
                style="font-family: var(--font-grotesk); font-weight: 300;"
              >
                {{ testimonial.role }}
              </p>
            </div>
          </div>
        </article>
        <!-- Trailing spacer so the last card isn't clipped -->
        <div class="w-5 shrink-0 md:w-px" aria-hidden="true" />
      </div>
    </div>
  </section>
</template>
