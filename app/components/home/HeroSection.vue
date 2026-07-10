<script setup lang="ts">
const calendlyUrl = useRuntimeConfig().public.calendlyUrl as string

// Only mount the People Hunt iframe on desktop (>900px). A `display:none`
// iframe still fetches its HTML + 4.9MB of videos, so on mobile we must avoid
// rendering it at all. SSR-safe: false until mounted, so the prerendered HTML
// never references the iframe; desktop mounts it after hydration and the query
// reacts to resize (mount/unmount → stops loading/decoding when not shown).
const showPeopleHunt = ref(false)

// People Hunt rendering mode. 'native' = the in-DOM Vue port (PeopleHunt.vue),
// which escapes the iframe's off-screen media throttling. 'iframe' = the legacy
// self-contained /public/people-hunt/people-hunt.html — kept as a one-flag
// fallback in case we need to switch back.
const peopleHuntMode: 'native' | 'iframe' = 'native'

let mq: MediaQueryList | null = null
const syncViz = (e: MediaQueryListEvent | MediaQueryList) => { showPeopleHunt.value = e.matches }

onMounted(() => {
  mq = window.matchMedia('(min-width: 901px)')
  syncViz(mq)
  mq.addEventListener('change', syncViz)
})
onBeforeUnmount(() => mq?.removeEventListener('change', syncViz))
</script>

<template>
  <section class="home-hero">
    <!-- People Hunt — live talent map animation (silhouettes + scan + dossier).
         pointer-events:none so it never intercepts page scroll; the scan
         auto-runs on a timer. -->
    <div v-if="showPeopleHunt" class="home-hero__viz" aria-hidden="true">
      <PeopleHunt v-if="peopleHuntMode === 'native'" />
      <iframe
        v-else
        class="home-hero__iframe"
        src="/people-hunt/people-hunt.html"
        title="Live Talent Map"
        scrolling="no"
      />
    </div>

    <!-- Protection gradient — keeps the headline legible while leaving the
         right half (silhouettes + dossier card) free of dimming. -->
    <div class="home-hero__protect" aria-hidden="true" />
    <!-- Soft top/bottom vignette to seat the scene into the band -->
    <div class="home-hero__vignette" aria-hidden="true" />

    <div class="home-hero__inner">
      <div class="home-hero__copy reveal">
        <div class="eyebrow home-hero__eyebrow">Cabinet de recrutement Sales sélectif.</div>
        <h1 class="h-display h-display--xl home-hero__title">
          Bienvenue<br>chez <span class="italic">Mariell</span>.
        </h1>
        <p class="home-hero__lede">
          Nous repérons les profils Sales qui font la différence, nous les approchons directement, et nous
          mesurons leur performance une fois en poste. Du SDR au CRO, en recrutement individuel ou équipe
          complète. Si vous recherchez les meilleurs profils, ceux qui performent vraiment, c’est ici.
        </p>
        <div class="home-hero__actions">
          <a class="btn btn--primary" :href="calendlyUrl" target="_blank" rel="noopener">
            Rendez-vous avec Mariell
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
          </a>
          <a class="btn btn--secondary-ink" href="mailto:chez@mariell.fr">Nous écrire</a>
        </div>
        <div class="home-hero__reassure">30&#160;min&#160;·&#160;Sans engagement&#160;·&#160;Confidentiel</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  position: relative;
  background: var(--ink-900);
  color: var(--fg-on-ink-1);
  overflow: hidden;
  min-height: 700px;
}

.home-hero__viz {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 64%;
  height: 100%;
  pointer-events: none;
}
/* Self-contained People Hunt iframe (live talent map) — fills the right band. */
.home-hero__iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  display: block;
}

.home-hero__protect {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    95deg,
    var(--ink-900) 0%,
    var(--ink-900) 26%,
    rgba(11, 13, 16, 0.8) 38%,
    rgba(11, 13, 16, 0) 50%
  );
}
.home-hero__vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    var(--ink-900) 0%,
    rgba(11, 13, 16, 0) 16%,
    rgba(11, 13, 16, 0) 84%,
    var(--ink-900) 100%
  );
}

.home-hero__inner {
  position: relative;
  z-index: 2;
  max-width: 1360px;
  margin: 0 auto;
  padding: 132px 40px 24px;
}
.home-hero__copy {
  max-width: 660px;
}
.home-hero__eyebrow {
  margin-bottom: 28px;
  color: var(--fg-on-ink-3);
}
.home-hero__title {
  font-size: clamp(46px, 6vw, 86px);
}
.home-hero__lede {
  margin-top: 28px;
  max-width: 460px;
  font-size: 18px;
  line-height: 1.5;
  color: rgba(244, 239, 227, 0.72);
}
.home-hero__actions {
  margin-top: 36px;
  display: flex;
  gap: 14px;
  align-items: center;
}
.home-hero__actions .icon {
  width: 14px;
  height: 14px;
}
.home-hero__reassure {
  margin-top: 14px;
  font-size: 13px;
  letter-spacing: 0.02em;
  color: rgba(244, 239, 227, 0.45);
}

@media (max-width: 1024px) {
  .home-hero__viz {
    width: 100%;
    opacity: 0.35;
  }
  .home-hero__protect {
    background: linear-gradient(
      to bottom,
      var(--ink-900) 0%,
      rgba(11, 13, 16, 0.78) 55%,
      rgba(11, 13, 16, 0.4) 100%
    );
  }
}

/* Mobile: hide the decorative PeopleHunt animation, stack copy vertically */
@media (max-width: 900px) {
  .home-hero {
    min-height: 0;
  }
  .home-hero__viz {
    display: none;
  }
  .home-hero__protect {
    display: none;
  }
  .home-hero__vignette {
    display: none;
  }
  .home-hero__inner {
    padding: 108px 24px 48px;
  }
  .home-hero__copy {
    max-width: 100%;
  }
  .home-hero__title {
    font-size: clamp(40px, 11vw, 64px);
  }
  .home-hero__lede {
    max-width: 100%;
    font-size: 16px;
  }
  .home-hero__actions {
    flex-wrap: wrap;
    gap: 12px;
  }
}

@media (max-width: 560px) {
  .home-hero__inner {
    padding: 100px 20px 40px;
  }
  .home-hero__actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
