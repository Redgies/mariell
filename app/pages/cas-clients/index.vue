<script setup lang="ts">
import { casClients } from '~/data/cas-clients'

const calendlyUrl = useRuntimeConfig().public.calendlyUrl as string

const breadcrumbItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Cas clients' },
]
</script>

<template>
  <div class="chromatic-mode">
    <main class="page-main">
      <section class="page-hero">
        <div class="page-hero__inner">
          <Breadcrumb :items="breadcrumbItems" />
          <h1 class="h-display h-display--l" style="max-width:880px;">
            Ils nous ont confié leurs recrutements Sales.
          </h1>
          <p style="margin-top:24px;max-width:620px;font-size:18px;line-height:1.55;color:rgba(244,239,227,0.72);">
            Des startups en amorçage aux scale-ups qui structurent leur expansion, Mariell chasse les profils Sales qui font la différence. Voici quelques-unes des missions que l’on nous a confiées, du SDR au comité de direction.
          </p>
        </div>
      </section>

      <section class="section-pad section--paper" style="padding-bottom:0;">
        <div class="container">
          <p style="font-size:17px;line-height:1.6;color:var(--fg-on-paper-2);margin:0;max-width:760px;">
            Chaque recrutement commercial raconte un contexte différent : un premier Sales à recruter en phase seed, une équipe à constituer pour une expansion internationale, un dirigeant à trouver pour structurer une hypercroissance. Le point commun : l’approche directe, l’évaluation critique, et le suivi de la performance en poste.
          </p>
        </div>
      </section>

      <section class="section-pad section--paper">
        <div class="container">
          <div class="cas-grid">
            <NuxtLink
              v-for="cas in casClients"
              :key="cas.slug"
              :to="`/cas-clients/${cas.slug}`"
              class="cas-card"
            >
              <div class="cas-card__logo-wrap">
                <div class="cas-card__glow" />
                <img
                  :src="cas.logo"
                  :alt="`Logo ${cas.client}`"
                  class="cas-card__logo"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div class="cas-card__sector">{{ cas.sector }}</div>
              <p class="cas-card__summary">{{ cas.summary }}</p>
            </NuxtLink>
          </div>
        </div>
      </section>

      <section class="section-pad section--paper">
        <div class="container">
          <div class="cta-strip">
            <div style="font-family:var(--font-display);font-weight:500;font-size:28px;letter-spacing:-0.02em;line-height:1.15;max-width:560px;">
              Votre recrutement Sales, le prochain cas ?
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <a class="btn-pill btn-cyan" :href="calendlyUrl" target="_blank" rel="noopener">Rencontrer Mariell</a>
              <NuxtLink class="btn-pill btn-ghost" to="/expertises">Voir nos expertises</NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.cas-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

@media (max-width: 1024px) {
  .cas-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .cas-grid {
    grid-template-columns: 1fr;
  }
}

.cas-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  transition: transform 200ms var(--ease-out, ease-out);
}

.cas-card:hover {
  transform: translateY(-3px);
}

.cas-card__logo-wrap {
  aspect-ratio: 4 / 3;
  background: linear-gradient(160deg, #0E1815 0%, #14201D 60%, #0B1916 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  position: relative;
  overflow: hidden;
}

.cas-card__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(127, 231, 225, 0.10), transparent 65%);
}

.cas-card__logo {
  position: relative;
  height: 34px;
  max-width: 78%;
  width: auto;
  object-fit: contain;
  opacity: 0.92;
}

.cas-card__sector {
  margin-top: 16px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg-on-paper-3);
}

.cas-card__summary {
  margin: 8px 0 0;
  font-size: 13.5px;
  line-height: 1.45;
  color: var(--fg-on-paper-1);
}
</style>
