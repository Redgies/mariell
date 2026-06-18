<script setup lang="ts">
import { getCas } from '~/data/cas-clients'

const route = useRoute()
const slug = route.params.slug as string
const cas = getCas(slug)

if (!cas) {
  throw createError({ statusCode: 404, statusMessage: 'Cas client introuvable' })
}

const calendlyUrl = useRuntimeConfig().public.calendlyUrl as string

const breadcrumbItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Cas clients', to: '/cas-clients' },
  { label: cas.client },
]
</script>

<template>
  <div class="chromatic-mode">
    <main class="page-main">
      <section class="page-hero">
        <div class="page-hero__inner">
          <Breadcrumb :items="breadcrumbItems" />
          <div class="cas-hero-meta">
            <div class="cas-hero-logo">
              <img :src="cas.logo" :alt="`Logo ${cas.client}`" class="cas-hero-logo__img" />
            </div>
            <div class="eyebrow-m cas-hero-sector">{{ cas.sector }}</div>
          </div>
          <h1 class="h-display h-display--m" style="max-width:880px;">{{ cas.h1 }}</h1>
        </div>
      </section>

      <section class="section-pad section--paper">
        <div class="container cas-body">
          <aside class="cas-aside">
            <div class="eyebrow-m" style="margin-bottom:14px;">Résultat</div>
            <ul class="prose cas-results">
              <li v-for="(metric, i) in cas.metrics" :key="i">
                <strong>{{ metric.value }}</strong> {{ metric.label }}
              </li>
            </ul>
          </aside>
          <div class="prose cas-content">
            <template v-for="(section, i) in cas.sections" :key="i">
              <h2>{{ section.heading }}</h2>
              <p v-for="(para, j) in section.paragraphs" :key="j">{{ para }}</p>
            </template>
          </div>
        </div>
      </section>

      <section class="section-pad section--paper" style="padding-top:0;">
        <div class="container" style="max-width:1080px;">
          <div class="cta-strip">
            <div style="font-family:var(--font-display);font-weight:500;font-size:28px;letter-spacing:-0.02em;line-height:1.15;max-width:560px;">
              Un besoin comparable à celui de {{ cas.client }} ?
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <a class="btn-pill btn-cyan" :href="calendlyUrl" target="_blank" rel="noopener">Rencontrer Mariell</a>
              <NuxtLink class="btn-pill btn-ghost" to="/cas-clients">Tous les cas clients</NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.cas-hero-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.cas-hero-logo {
  background: linear-gradient(160deg, #0E1815, #0B1916);
  border: 1px solid rgba(244, 239, 227, 0.10);
  border-radius: 12px;
  padding: 18px 24px;
  display: inline-flex;
  align-items: center;
}

.cas-hero-logo__img {
  height: 34px;
  width: auto;
}

.cas-hero-sector {
  color: rgba(244, 239, 227, 0.5);
  margin-bottom: 0;
}

.cas-body {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 56px;
  align-items: start;
  max-width: 1080px;
}

@media (max-width: 900px) {
  .cas-body {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.cas-aside {
  position: sticky;
  top: 96px;
}

@media (max-width: 900px) {
  /* On mobile the aside stacks above the prose — release sticky so it
     doesn't pin over the content while scrolling. */
  .cas-aside {
    position: static;
  }
}

.cas-results {
  max-width: none;
}

.cas-content {
  max-width: none;
}
</style>
