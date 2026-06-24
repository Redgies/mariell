<script setup lang="ts">
import { expertises, getExpertise } from '~/data/expertises'

const route = useRoute()
const slug = route.params.slug as string
const expertise = getExpertise(slug)

if (!expertise) {
  throw createError({ statusCode: 404, statusMessage: 'Expertise introuvable' })
}

const config = useRuntimeConfig()

const breadcrumbItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Expertises', to: '/expertises' },
  { label: expertise.label },
]

const calendlyUrl = config.public.calendlyUrl as string
</script>

<template>
  <div class="chromatic-mode">
    <section class="page-hero">
      <div class="page-hero__inner">
        <Breadcrumb :items="breadcrumbItems" />
        <div class="eyebrow-m" style="color:rgba(244,239,227,0.45);margin-bottom:14px;">
          — {{ expertise.heroLabel }}
        </div>
        <h1 class="h-display h-display--l" style="max-width:900px;">
          {{ expertise.h1 }}
        </h1>
        <p style="margin-top:24px;max-width:600px;font-size:18px;line-height:1.55;color:rgba(244,239,227,0.72);">
          {{ expertise.heroParagraph }}
        </p>
        <div style="margin-top:32px;display:flex;gap:12px;flex-wrap:wrap;">
          <a class="btn-pill btn-cyan" :href="calendlyUrl">{{ expertise.ctaLabel }}</a>
          <NuxtLink class="btn-pill btn-ghost" to="/expertises">Toutes les expertises</NuxtLink>
        </div>
      </div>
    </section>

    <section class="section-pad section--paper">
      <div class="container exp-missions-grid">
        <div>
          <h2 class="h-display h-display--s" style="margin:0 0 22px;">Les missions</h2>
          <ul class="prose" style="max-width:none;">
            <li v-for="mission in expertise.missions" :key="mission">{{ mission }}</li>
          </ul>
        </div>
        <div>
          <h2 class="h-display h-display--s" style="margin:0 0 22px;">Le profil que nous cherchons</h2>
          <ul class="prose" style="max-width:none;">
            <li v-for="item in expertise.profil" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section-pad section--paper" style="padding-top:0;">
      <div class="container" style="max-width:820px;">
        <h2 class="h-display h-display--s" style="margin:0 0 18px;">{{ expertise.marche.heading }}</h2>
        <p style="font-size:17px;line-height:1.6;color:var(--fg-on-paper-2);">
          {{ expertise.marche.paragraph }}
        </p>

        <template v-if="expertise.marche.ote">
          <div style="margin-top:28px;display:inline-flex;align-items:center;gap:16px;padding:18px 24px;border-radius:12px;background:var(--ink-900);">
            <span style="font-family:var(--font-mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(244,239,227,0.55);">OTE</span>
            <span style="font-family:var(--font-display);font-weight:500;font-size:24px;letter-spacing:-0.02em;color:#6FE5E5;">{{ expertise.marche.ote }}</span>
            <span style="font-family:var(--font-mono);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(244,239,227,0.45);">· {{ expertise.marche.oteLabel }}</span>
          </div>
          <p style="margin:14px 0 0;font-size:13px;color:var(--fg-on-paper-3);">
            <NuxtLink to="/lab/guide-salaires-sales" style="color:var(--moss);">Fourchette détaillée par séniorité et contexte dans la grille complète &rarr;</NuxtLink>
          </p>
        </template>
        <template v-else>
          <p style="margin:24px 0 0;font-size:14px;color:var(--fg-on-paper-2);">
            <NuxtLink to="/lab/guide-salaires-sales" style="color:var(--moss);border-bottom:1px solid currentColor;padding-bottom:1px;text-decoration:none;">Consulter la grille de salaires Sales 2026 &rarr;</NuxtLink>
          </p>
        </template>
      </div>
    </section>

    <section class="section-pad section--paper" style="padding-top:0;">
      <div class="container" style="max-width:820px;">
        <h2 class="h-display h-display--s" style="margin:0 0 24px;">Questions fréquentes</h2>
        <div style="display:flex;flex-direction:column;gap:0;">
          <div
            v-for="item in expertise.faq"
            :key="item.q"
            style="border-top:1px solid var(--border-on-paper);padding:22px 0;"
          >
            <h3 style="font-family:var(--font-text);font-weight:600;font-size:17px;margin:0 0 8px;color:var(--fg-on-paper-1);">
              {{ item.q }}
            </h3>
            <p style="margin:0;font-size:15.5px;line-height:1.55;color:var(--fg-on-paper-2);">
              {{ item.a }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad section--paper" style="padding-top:0;">
      <div class="container">
        <div class="eyebrow-m" style="margin-bottom:14px;">— Expertises proches</div>
        <div class="grid-cards">
          <NuxtLink
            v-for="rel in expertise.related"
            :key="rel.slug"
            class="ucard"
            :to="`/expertises/${rel.slug}`"
          >
            <div class="ucard__title">{{ rel.label }}</div>
            <span style="font-size:13px;color:var(--moss);border-bottom:1px solid currentColor;align-self:flex-start;padding-bottom:1px;">Voir l’expertise &rarr;</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section-pad section--paper">
      <div class="container">
        <div class="cta-strip">
          <div style="font-family:var(--font-display);font-weight:500;font-size:26px;letter-spacing:-0.02em;line-height:1.25;">
            Besoin d’un {{ expertise.label }} qui performe<br />dès les premiers mois&nbsp;?
          </div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <a class="btn-pill btn-cyan" :href="calendlyUrl">Rencontrer Mariell</a>
            <a class="btn-pill btn-ghost" href="mailto:chez@mariell.fr">Nous écrire</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Two-column missions/profil grid — stacks on mobile */
.exp-missions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

@media (max-width: 900px) {
  .exp-missions-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

@media (max-width: 560px) {
  .exp-missions-grid {
    gap: 28px;
  }
}
</style>
