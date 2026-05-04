<script setup lang="ts">
import { siteConfig } from '~~/shared/config/site'
import type { LabCardIcon } from '~/components/LabCard.vue'

useScrollReveal()

useHead({
  title: "Le Lab Mariell — L'expertise Sales, en libre-service.",
  meta: [
    {
      name: 'description',
      content:
        "Trois outils, deux guides. De quoi cadrer un brief, sourcer un profil, calibrer une offre — sans nous appeler.",
    },
  ],
})

interface LabResource {
  tag: string
  titleLead: string
  titleEm: string
  titleTrail?: string
  description: string
  cta: string
  href: string
  icon: LabCardIcon
}

const tools: LabResource[] = [
  {
    tag: 'IA · 3 minutes',
    titleLead: 'Plan de ',
    titleEm: 'sourcing LinkedIn',
    description:
      'Votre stratégie de chasse pour le prochain recrutement Sales : entreprises cibles, requête booléenne, plan en 4 phases.',
    cta: 'Démarrer',
    href: '/lab/plan-de-sourcing',
    icon: 'target',
  },
  {
    tag: 'IA · 4 minutes',
    titleLead: 'Évaluation ',
    titleEm: "d'attractivité",
    description:
      "Votre offre Sales, confrontée au marché 2026. Diagnostic chiffré, comparatif, points de levier à activer.",
    cta: 'Démarrer',
    href: '/lab/evaluation-attractivite',
    icon: 'gauge',
  },
  {
    tag: 'Service offert · 7 à 10 jours',
    titleLead: 'Demande ',
    titleEm: 'stage ou alternance',
    titleTrail: ' Sales',
    description:
      'Activez notre vivier de stagiaires et alternants Sales. Profils proposés sous 7 à 10 jours.',
    cta: 'Faire une demande',
    href: '/lab/demande-stage-alternance',
    icon: 'team',
  },
]

const guides: LabResource[] = [
  {
    tag: 'Mis à jour 2026 · Lecture 8 min',
    titleLead: 'Guide des ',
    titleEm: 'salaires Sales 2026',
    description:
      'La grille à jour, segmentée par poste (SDR, AE, Account Manager, Head of Sales…) et par séniorité. Fixe, variable, package total.',
    cta: 'Consulter',
    href: '/lab/guide-salaires-sales',
    icon: 'bars',
  },
  {
    tag: 'Lecture 6 min',
    titleLead: 'Les ',
    titleEm: '10 essentiels',
    titleTrail: ' du recrutement Sales',
    description:
      "Dix vérités pour ne pas rater votre prochain recrutement Sales. Aucune n'est complexe. Toutes demandent de la lucidité.",
    cta: 'Consulter',
    href: '/lab/10-essentiels-recrutement-sales',
    icon: 'check',
  },
]
</script>

<template>
  <main class="relative mx-auto max-w-7xl px-5 pt-32 pb-16 md:px-10 md:pt-40 md:pb-24 lg:px-16">
    <NuxtLink
      to="/"
      class="reveal mb-12 flex w-fit items-center gap-2 font-mono-num text-xs uppercase tracking-[0.22em] text-white/40 transition-colors hover:text-white"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Retour à l'accueil
    </NuxtLink>

    <!-- ============ HEADER ============ -->
    <header class="lab-header">
      <div class="reveal eyebrow-cyan">Le Lab Mariell</div>

      <h1 class="reveal lab-h1 mt-7 text-white" data-split>
        L'expertise Sales,<br />
        <span class="gradient-text italic">en libre-service.</span>
      </h1>

      <p class="reveal lab-subtitle mt-8">
        Trois outils, deux guides. De quoi cadrer un brief, sourcer un profil, calibrer une offre — sans nous appeler.
      </p>

      <div class="reveal lab-header__rule" aria-hidden="true" />
    </header>

    <!-- ============ SECTION 1 — OUTILS INTERACTIFS ============ -->
    <section class="lab-section" aria-labelledby="sec-outils">
      <div class="lab-section__head">
        <div id="sec-outils" class="reveal lab-section__label">Outils interactifs</div>
        <p class="reveal lab-section__intro">
          Trois outils calibrés sur votre contexte précis. Pas un template, pas un score générique : un livrable construit pour votre recrutement, votre marché, votre stade.
        </p>
      </div>

      <div class="lab-grid lab-grid--3">
        <LabCard
          v-for="tool in tools"
          :key="tool.href"
          v-bind="tool"
          class="reveal"
        />
      </div>
    </section>

    <!-- ============ SECTION 2 — GUIDES PRATIQUES ============ -->
    <section class="lab-section" aria-labelledby="sec-guides">
      <div class="lab-section__head">
        <div id="sec-guides" class="reveal lab-section__label">Guides pratiques</div>
        <p class="reveal lab-section__intro">
          Deux guides en libre accès. Pas de formulaire, pas d'email à donner. Vous lisez, vous fermez, vous prenez ce qui vous sert.
        </p>
      </div>

      <div class="lab-grid lab-grid--2">
        <LabCard
          v-for="guide in guides"
          :key="guide.href"
          v-bind="guide"
          class="reveal"
        />
      </div>
    </section>

    <!-- ============ FOOTER PAGE ============ -->
    <section class="lab-footer-page">
      <div class="lab-footer-page__rule" aria-hidden="true" />
      <div class="lab-footer-page__inner">
        <p class="reveal lab-footer-page__text">
          D'autres ressources arrivent. Et si vous voulez aller plus vite que ce que ces outils permettent, on peut en parler.
        </p>
        <a
          :href="siteConfig.calendlyUrl"
          target="_blank"
          rel="noopener"
          class="reveal btn-ghost lab-footer-page__cta"
        >
          Prendre rendez-vous
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Headline — sized between the design (44→104px) and the site's headline-asym,
   but rendered in Noto Serif JP to match the live site signature. */
.lab-h1 {
  font-family: var(--font-serif-jp);
  font-weight: 500;
  font-size: clamp(48px, 7.4vw, 104px);
  line-height: 1.02;
  letter-spacing: -0.035em;
  margin: 0;
  max-width: 18ch;
  text-wrap: balance;
}

.lab-subtitle {
  max-width: 680px;
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: clamp(17px, 1.4vw, 20px);
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.65);
  text-wrap: pretty;
  margin: 0;
}

.lab-header {
  padding: 24px 0 0;
}

.lab-header__rule {
  margin-top: 64px;
  height: 1px;
  background: linear-gradient(90deg,
    rgba(94, 231, 231, 0.45) 0%,
    rgba(232, 94, 255, 0.2) 40%,
    transparent 100%);
}

.lab-section {
  padding: 72px 0;
}
@media (min-width: 768px) {
  .lab-section { padding: 96px 0; }
}

.lab-section__head {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  margin-bottom: 48px;
}
@media (min-width: 900px) {
  .lab-section__head {
    grid-template-columns: minmax(220px, 1fr) minmax(0, 2fr);
    gap: 64px;
    align-items: start;
  }
}

.lab-section__label {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.lab-section__label::before {
  content: "";
  width: 22px;
  height: 1px;
  background: #5ee7e7;
}

.lab-section__intro {
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: clamp(16px, 1.15vw, 19px);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
  max-width: 60ch;
  text-wrap: pretty;
  margin: 0;
}

/* ============ GRILLE ============ */
.lab-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}
@media (min-width: 720px) {
  .lab-grid--3 { grid-template-columns: repeat(2, 1fr); }
  .lab-grid--3 > :nth-child(3) { grid-column: 1 / -1; }
  .lab-grid--2 { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .lab-grid { gap: 24px; }
  .lab-grid--3 { grid-template-columns: repeat(3, 1fr); }
  .lab-grid--3 > :nth-child(3) { grid-column: auto; }
}

/* ============ FOOTER PAGE (closing block, before global AppFooter) ============ */
.lab-footer-page {
  padding: 96px 0 24px;
  position: relative;
}

.lab-footer-page__rule {
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.12) 30%,
    rgba(94, 231, 231, 0.3) 50%,
    rgba(255, 255, 255, 0.12) 70%,
    transparent 100%);
  margin-bottom: 80px;
}

.lab-footer-page__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 36px;
  align-items: center;
}
@media (min-width: 880px) {
  .lab-footer-page__inner {
    grid-template-columns: minmax(0, 1.6fr) auto;
    gap: 64px;
  }
}

/* Closing line — italic Noto Serif JP, same gesture as the rest of the site. */
.lab-footer-page__text {
  font-family: var(--font-serif-jp);
  font-weight: 500;
  font-style: italic;
  font-size: clamp(22px, 2.2vw, 30px);
  line-height: 1.35;
  letter-spacing: -0.015em;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  max-width: 32ch;
  text-wrap: balance;
}

.lab-footer-page__cta {
  align-self: start;
  justify-self: start;
}
@media (min-width: 880px) {
  .lab-footer-page__cta { justify-self: end; }
}
.lab-footer-page__cta svg {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.lab-footer-page__cta:hover svg {
  transform: translateX(4px);
}

@media (prefers-reduced-motion: reduce) {
  .lab-footer-page__cta svg {
    transition: none;
  }
}
</style>
