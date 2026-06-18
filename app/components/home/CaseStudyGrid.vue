<script setup lang="ts">
// 8 real clients. Real logos (cream) on dark tiles. Outcome line = role(s)
// placed; detailed stats & quotes live on the inner case page.
const DIR = '/assets/client-logos/'
const tiles = [
  { name: 'dhala', slug: 'dhala', h: 34, eyebrow: 'Cybersécurité', body: '1 Sales Manager recruté, Construction Playbook, Hypercroissance.' },
  { name: 'kraaft', slug: 'kraaft', h: 34, eyebrow: 'Contech · SaaS', body: '2 AE Mid-Market recrutés (FR & UK), Série A, Market International.' },
  { name: 'reconomia', slug: 'reconomia', h: 22, eyebrow: 'Économie circulaire', body: '2 Field Sales, COO & CFO recrutés, Structuration complète, Startup Groupe UnitedB Mulliez.' },
  { name: 'nextmotion', slug: 'nextmotion', h: 22, eyebrow: 'Medtech · SaaS', body: '1 BDR & Head of Sales recrutés, Construction Sales Process & Playbook, Startup Seed.' },
  { name: 'wikit', slug: 'wikit', h: 30, eyebrow: 'IA Chatbot', body: '1 AE SMB & Mid-Market recruté, Startup Seed-Série A.' },
  { name: 'sastec', slug: 'sastec', h: 52, eyebrow: 'Agence SaaS Logiciel', body: 'Partnership Manager puis Director recruté, Startup Tech Accelerator.' },
  { name: 'reality-academy', slug: 'reality-academy', h: 20, eyebrow: 'Edtech · SaaS VR', body: 'Account Executive Team recrutée (2), Startup French Tech 7M+ Value.' },
  { name: 'kickmaker', slug: 'kickmaker', h: 28, eyebrow: 'Hardware · Industrie', body: '2 Senior Sales recrutés, Conseil Hypercroissance, MML & BPIFrance Investors.' },
]
</script>

<template>
  <section id="clients" class="section section--paper cases">
    <div class="container">
      <div class="cases__head reveal">
        <h2 class="h-display h-display--m">Cas clients.</h2>
        <NuxtLink class="arrow-link" to="/cas-clients">
          <span>Ils nous font confiance</span>
          <svg class="icon arrow-link__arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
        </NuxtLink>
      </div>

      <div class="cases__grid stagger">
        <NuxtLink v-for="t in tiles" :key="t.slug" class="cases__tile reveal" :to="`/cas-clients/${t.slug}`">
          <div class="cases__media">
            <div class="cases__glow" aria-hidden="true" />
            <img :src="DIR + t.name + '-logo.png'" :alt="t.name" :style="{ height: t.h + 'px' }" class="cases__logo" loading="lazy" decoding="async">
          </div>
          <div class="cases__eyebrow">{{ t.eyebrow }}</div>
          <div class="cases__body">{{ t.body }}</div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cases {
  padding-top: 0;
}
.cases__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 40px;
  gap: 24px;
}
.cases__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}
.cases__tile {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}
.cases__media {
  aspect-ratio: 4 / 3;
  background: linear-gradient(160deg, #0e1815 0%, #14201d 60%, #0b1916 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  position: relative;
  overflow: hidden;
}
.cases__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(127, 231, 225, 0.1), transparent 65%);
}
.cases__logo {
  position: relative;
  max-width: 78%;
  width: auto;
  object-fit: contain;
  opacity: 0.92;
}
.cases__eyebrow {
  margin-top: 16px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg-on-paper-3);
}
.cases__body {
  margin-top: 8px;
  font-size: 13.5px;
  color: var(--fg-on-paper-1);
  line-height: 1.45;
}

@media (max-width: 1024px) {
  .cases__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .cases__head {
    flex-wrap: wrap;
    gap: 12px;
  }
}

@media (max-width: 560px) {
  .cases__grid {
    grid-template-columns: 1fr;
  }
}
</style>
