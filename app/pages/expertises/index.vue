<script setup lang="ts">
import { expertises } from '~/data/expertises'

const config = useRuntimeConfig()
const calendlyUrl = config.public.calendlyUrl as string

const representatives = expertises.filter(e => e.group === 'Representatives')
const managers = expertises.filter(e => e.group === 'Managers')
const directors = expertises.filter(e => e.group === 'Directors')
const parContexte = expertises.filter(e => e.group === 'Par contexte')

const breadcrumbItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Expertises' },
]
</script>

<template>
  <div class="chromatic-mode">
    <section class="page-hero">
      <div class="page-hero__inner">
        <Breadcrumb :items="breadcrumbItems" />
        <h1 class="h-display h-display--l" style="max-width:880px;">
          Le recrutement Sales, métier par métier.
        </h1>
        <p style="margin-top:24px;max-width:580px;font-size:18px;line-height:1.55;color:rgba(244,239,227,0.72);">
          Mariell recrute vos commerciaux par approche directe, du premier SDR au CRO qui structure toute la machine de revenus. Un
          <NuxtLink to="/recrutement-commercial" style="color:var(--cyan);text-decoration:none;border-bottom:1px solid rgba(127,231,225,0.4);">cabinet de recrutement commercial</NuxtLink>
          qui couvre chaque métier Sales, vous choisissez celui que vous recrutez.
        </p>
      </div>
    </section>

    <section class="section-pad section--paper">
      <div class="container" style="display:flex;flex-direction:column;gap:56px;">

        <div>
          <div class="eyebrow-m" style="margin-bottom:14px;">— Representatives</div>
          <div class="grid-cards">
            <NuxtLink
              v-for="e in representatives"
              :key="e.slug"
              class="ucard"
              :to="`/expertises/${e.slug}`"
            >
              <div class="ucard__title">{{ e.label }}</div>
              <div class="ucard__excerpt">{{ e.heroParagraph }}</div>
              <span style="font-size:13px;color:var(--moss);border-bottom:1px solid currentColor;align-self:flex-start;padding-bottom:1px;">Voir l’expertise &rarr;</span>
            </NuxtLink>
          </div>
        </div>

        <div>
          <div class="eyebrow-m" style="margin-bottom:14px;">— Managers</div>
          <div class="grid-cards">
            <NuxtLink
              v-for="e in managers"
              :key="e.slug"
              class="ucard"
              :to="`/expertises/${e.slug}`"
            >
              <div class="ucard__title">{{ e.label }}</div>
              <div class="ucard__excerpt">{{ e.heroParagraph }}</div>
              <span style="font-size:13px;color:var(--moss);border-bottom:1px solid currentColor;align-self:flex-start;padding-bottom:1px;">Voir l’expertise &rarr;</span>
            </NuxtLink>
          </div>
        </div>

        <div>
          <div class="eyebrow-m" style="margin-bottom:14px;">— Directors</div>
          <div class="grid-cards">
            <NuxtLink
              v-for="e in directors"
              :key="e.slug"
              class="ucard"
              :to="`/expertises/${e.slug}`"
            >
              <div class="ucard__title">{{ e.label }}</div>
              <div class="ucard__excerpt">{{ e.heroParagraph }}</div>
              <span style="font-size:13px;color:var(--moss);border-bottom:1px solid currentColor;align-self:flex-start;padding-bottom:1px;">Voir l’expertise &rarr;</span>
            </NuxtLink>
          </div>
        </div>

        <div>
          <div class="eyebrow-m" style="margin-bottom:14px;">— Par contexte</div>
          <div class="grid-cards">
            <NuxtLink
              v-for="e in parContexte"
              :key="e.slug"
              class="ucard"
              :to="`/expertises/${e.slug}`"
            >
              <div class="ucard__title">{{ e.label }}</div>
              <div class="ucard__excerpt">{{ e.heroParagraph }}</div>
              <span style="font-size:13px;color:var(--moss);border-bottom:1px solid currentColor;align-self:flex-start;padding-bottom:1px;">Voir l’expertise &rarr;</span>
            </NuxtLink>
          </div>
        </div>

        <div style="border-top:1px solid var(--border-on-paper);padding-top:40px;">
          <div class="eyebrow-m" style="margin-bottom:14px;">— Aller plus loin</div>
          <div class="grid-cards grid-cards--2">
            <NuxtLink class="ucard" to="/recrutement-commercial">
              <div class="ucard__title">Cabinet de recrutement commercial</div>
              <div class="ucard__excerpt">Notre approche globale du recrutement de profils commerciaux, du sourcing à la signature.</div>
              <span style="font-size:13px;color:var(--moss);border-bottom:1px solid currentColor;align-self:flex-start;padding-bottom:1px;">En savoir plus &rarr;</span>
            </NuxtLink>
            <NuxtLink class="ucard" to="/performances">
              <div class="ucard__title">Suivi de performance</div>
              <div class="ucard__excerpt">Nos résultats, nos délais, nos taux de placement. La preuve par les chiffres.</div>
              <span style="font-size:13px;color:var(--moss);border-bottom:1px solid currentColor;align-self:flex-start;padding-bottom:1px;">Voir les résultats &rarr;</span>
            </NuxtLink>
            <NuxtLink class="ucard" to="/cas-clients">
              <div class="ucard__title">Cas clients</div>
              <div class="ucard__excerpt">Des mandats réels, des contextes concrets. Comment nous avons aidé nos clients à recruter.</div>
              <span style="font-size:13px;color:var(--moss);border-bottom:1px solid currentColor;align-self:flex-start;padding-bottom:1px;">Voir les cas &rarr;</span>
            </NuxtLink>
          </div>
        </div>

      </div>
    </section>

    <section class="section-pad section--paper">
      <div class="container">
        <div class="cta-strip">
          <div style="font-family:var(--font-display);font-weight:500;font-size:28px;letter-spacing:-0.02em;line-height:1.15;max-width:620px;">
            Quel que soit le poste Sales, on sait le chasser.
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
