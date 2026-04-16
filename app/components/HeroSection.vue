<script setup lang="ts">
import { siteConfig } from '~~/shared/config/site'

const statsRef = ref<HTMLElement | null>(null)
const successRate = ref(0)
const placedCount = ref(0)

const animateCount = (target: number, setter: (v: number) => void, duration = 1800) => {
  const start = performance.now()
  const ease = (t: number) => 1 - Math.pow(1 - t, 3)
  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    setter(Math.round(ease(progress) * target))
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  if (!statsRef.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    successRate.value = 94
    placedCount.value = 60
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animateCount(94, (v) => (successRate.value = v))
          animateCount(60, (v) => (placedCount.value = v), 2000)
          io.disconnect()
        }
      }
    },
    { threshold: 0.4 },
  )
  io.observe(statsRef.value)
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <section
    id="accueil"
    class="relative flex min-h-[92vh] items-center px-5 pt-32 pb-24 md:px-10 lg:px-16"
  >
    <div class="relative mx-auto grid w-full max-w-7xl grid-cols-12 gap-x-6 gap-y-10">
      <!-- Left column — meta & intro -->
      <div class="col-span-12 flex flex-col gap-4 md:col-span-4 md:pt-8">
        <div class="reveal eyebrow">
          <span class="font-mono-num">Cabinet Sales · Paris</span>
        </div>
        <p
          class="reveal mt-2 max-w-xs text-sm leading-relaxed text-white/55"
          style="font-family: var(--font-grotesk); font-weight: 300;"
        >
          Des Sales qui chassent d'autres Sales. Depuis 2021, 60+ tops profils recrutés pour les entreprises qui ne peuvent pas se permettre un raté.
        </p>
        <!-- Animated scroll cue -->
        <a
          href="#who"
          class="reveal group mt-10 hidden w-fit items-center gap-3 text-xs text-white/50 font-mono-num transition-colors hover:text-white md:inline-flex"
          aria-label="Défiler vers la section suivante"
        >
          <span class="relative flex h-10 w-6 items-start justify-center overflow-hidden rounded-full border border-white/25">
            <span class="scroll-dot mt-1.5 h-1.5 w-1.5 rounded-full bg-white/70" />
          </span>
          <span class="uppercase tracking-[0.22em]">Découvrir</span>
          <svg class="transition-transform duration-500 group-hover:translate-y-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 2v8M2 6l4 4 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </div>

      <!-- Right column — giant headline -->
      <div class="col-span-12 stagger md:col-span-8">
        <h1 class="mt-6 headline-xl text-white scroll-parallax" data-parallax="-0.9" data-split>
          Bienvenue<br />
          chez Mariell.
        </h1>

        <p
          class="reveal mt-10 max-w-2xl text-xl leading-relaxed text-white/80 md:text-2xl"
          style="font-family: var(--font-serif-jp); font-weight: 500; letter-spacing: -0.015em;"
        >
          Nous recrutons les meilleurs Sales, pour vous.
        </p>

        <div
          class="reveal mt-8 max-w-xl space-y-4 text-base leading-relaxed text-white/65"
          style="font-family: var(--font-grotesk); font-weight: 300;"
        >
          <p>
            On ne vend pas de rêve, mais une réalité : les tops profils sont rares, les meilleurs encore plus durs à déceler.
          </p>
          <p>
            Notre mission — vous présenter ces profils, uniquement ces profils.
          </p>
          <p class="text-white/90">
            Les meilleures entreprises recrutent les meilleurs Sales, pourquoi pas vous&nbsp;?
          </p>
        </div>

        <div class="reveal mt-12 flex flex-wrap items-center gap-6">
          <a
            :href="siteConfig.calendlyUrl"
            class="gradient-cta group inline-flex items-center gap-3 rounded-full px-8 py-4 text-base text-black md:text-lg"
            style="font-family: var(--font-grotesk); font-weight: 600;"
          >
            {{ siteConfig.ctaHero }}
            <svg class="transition-transform duration-300 group-hover:translate-x-1" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>

          <div class="flex items-center gap-4 text-sm text-white/55">
            <div class="flex items-center gap-2">
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span class="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <span class="font-mono-num text-xs uppercase tracking-[0.2em]">Disponible</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom stats strip with count-up animation -->
      <div
        ref="statsRef"
        class="reveal col-span-12 mt-8 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-8 md:grid-cols-4"
      >
        <div>
          <div class="font-serif-jp text-4xl text-white md:text-5xl">
            <span class="font-mono-num tabular-nums">{{ successRate }}</span><span class="gradient-text">%</span>
          </div>
          <div class="mt-2 text-xs uppercase tracking-[0.2em] text-white/50 font-mono-num">Taux de succès</div>
        </div>
        <div>
          <div class="font-serif-jp text-4xl text-white md:text-5xl">
            <span class="font-mono-num tabular-nums">{{ placedCount }}</span><span class="gradient-text">+</span>
          </div>
          <div class="mt-2 text-xs uppercase tracking-[0.2em] text-white/50 font-mono-num">Tops profils placés</div>
        </div>
        <div>
          <div class="font-serif-jp text-4xl text-white md:text-5xl">7<span class="text-white/40">—</span>10</div>
          <div class="mt-2 text-xs uppercase tracking-[0.2em] text-white/50 font-mono-num">Jours · 1res candidatures</div>
        </div>
        <div>
          <div class="font-serif-jp text-4xl text-white md:text-5xl">SDR<span class="text-white/40"> → </span>Head</div>
          <div class="mt-2 text-xs uppercase tracking-[0.2em] text-white/50 font-mono-num">Spectre adressé</div>
        </div>
      </div>
    </div>
  </section>
</template>
