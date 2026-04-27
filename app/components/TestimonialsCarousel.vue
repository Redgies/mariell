<script setup lang="ts">
import { testimonials } from '~~/shared/config/site'

const scroller = ref<HTMLElement | null>(null)

const scrollByAmount = (direction: 1 | -1) => {
  if (!scroller.value) return
  const card = scroller.value.querySelector<HTMLElement>('[data-testimonial-card]')
  const step = (card?.offsetWidth ?? 460) + 20
  scroller.value.scrollBy({ left: step * direction, behavior: 'smooth' })
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
</script>

<template>
  <section class="relative px-5 py-16 md:px-10 md:py-20 lg:px-16">
    <div class="mx-auto max-w-7xl">
      <div class="reveal mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span class="eyebrow-cyan">Témoignages</span>
          <h2 class="mt-5 headline-section text-white" data-split>
            Ils ont fait<br />
            le choix <span class="gradient-text italic">Mariell.</span>
          </h2>
        </div>
      </div>

      <div class="relative">
        <!-- Controls -->
        <div class="absolute -top-16 right-0 flex gap-2.5">
          <button
            type="button"
            class="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/18 bg-transparent text-white transition-all hover:border-white/30 hover:bg-white/5"
            aria-label="Témoignage précédent"
            @click="scrollByAmount(-1)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            class="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/18 bg-transparent text-white transition-all hover:border-white/30 hover:bg-white/5"
            aria-label="Témoignage suivant"
            @click="scrollByAmount(1)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <div
          ref="scroller"
          class="reveal carousel-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 pt-2"
          role="region"
          aria-roledescription="carousel"
          aria-label="Témoignages clients"
          tabindex="0"
        >
          <article
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            data-testimonial-card
            class="testi-card"
          >
            <div class="testi-mark">"</div>

            <p
              class="flex-1 text-[17px] leading-[1.7] text-white/90"
              style="font-family: var(--font-grotesk); font-weight: 300;"
            >
              {{ testimonial.quote }}
            </p>

            <div class="flex items-center gap-3.5">
              <div class="testi-avatar" aria-hidden="true">
                {{ initials(testimonial.name) }}
              </div>
              <div>
                <div
                  class="text-[15px] text-white"
                  style="font-family: var(--font-grotesk); font-weight: 600;"
                >
                  {{ testimonial.name }}
                </div>
                <div
                  class="text-[13px] text-white/45"
                  style="font-family: var(--font-grotesk); font-weight: 300;"
                >
                  {{ testimonial.role }}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
