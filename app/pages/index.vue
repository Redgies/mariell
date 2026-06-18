<script setup lang="ts">
// Homepage A — chromatic variant. Composition order is authoritative:
// Hero → LogoBar → ApproachCards → rule → StatementBand → rule(ink)
// → CorporateFrieze → CaseStudyGrid → Testimonials → CtaBand.
// (Nav + Footer come from layouts/default.vue.)
useScrollReveal()
</script>

<template>
  <div class="chromatic-mode">
    <HomeHeroSection />
    <HomeLogoBar />
    <HomeApproachCards />
    <HomeChromaticRule />
    <HomeStatementBand />
    <HomeChromaticRule ink />
    <HomeCorporateFrieze />
    <HomeCaseStudyGrid />
    <HomeTestimonials />
    <HomeCtaBand />
  </div>
</template>

<!-- Reveal framework — not defined in the current global CSS (the named
     `.reveal`/`.stagger` classes referenced in css/AGENTS.md belong to the
     retired landing system). Defined here, scoped under .chromatic-mode, as a
     polish-only fade-up: content is fully visible at rest (SSR/SEO safe) and the
     IntersectionObserver in useScrollReveal() only adds the entrance transition.
     Collapses cleanly under prefers-reduced-motion. -->
<style>
.chromatic-mode .reveal {
  opacity: 1;
  transform: none;
  transition:
    opacity 640ms var(--ease-out),
    transform 640ms var(--ease-out);
}
@media (prefers-reduced-motion: no-preference) {
  /* Pre-reveal state only applied client-side once the observer is wired, so
     SSR/no-JS renders the content visible. */
  .chromatic-mode.js-reveal-ready .reveal:not(.revealed) {
    opacity: 0.001;
    transform: translateY(16px);
  }
  .chromatic-mode.js-reveal-ready .stagger.reveal:not(.revealed) > * {
    opacity: 0.001;
    transform: translateY(16px);
    transition:
      opacity 640ms var(--ease-out),
      transform 640ms var(--ease-out);
  }
}
.chromatic-mode .reveal.revealed {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .chromatic-mode .reveal,
  .chromatic-mode .reveal:not(.revealed) {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>
