<script setup lang="ts">
import type { LabCardIcon } from './LabCard.vue'

interface LabTool {
  tag: string
  titleLead: string
  titleEm: string
  titleTrail?: string
  description: string
  cta: string
  href: string
  icon: LabCardIcon
}

const tools: LabTool[] = [
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
</script>

<template>
  <section class="relative px-5 pt-7 pb-9 md:px-10 md:pt-10 md:pb-12 lg:px-16">
    <div class="mx-auto max-w-7xl">
      <!-- Header -->
      <div class="reveal mb-9 max-w-3xl md:mb-11">
        <span class="eyebrow-cyan">Le Lab Mariell</span>
        <h2 class="mt-5 headline-section pb-2 text-white" data-split>
          Mariell,<br />
          <span class="gradient-text italic">en libre-service.</span>
        </h2>
        <p
          class="mt-5 max-w-xl text-[16px] leading-[1.6] text-white/65"
          style="font-family: var(--font-grotesk); font-weight: 300;"
        >
          3 outils gratuits pour calibrer votre recrutement Sales avec précision.
        </p>
      </div>

      <!-- Grid of tools -->
      <div class="lab-grid">
        <LabCard
          v-for="tool in tools"
          :key="tool.href"
          v-bind="tool"
          class="reveal"
        />
      </div>

      <!-- Footer link -->
      <div class="reveal mt-10 flex justify-center md:mt-12">
        <NuxtLink to="/lab" class="lab-more">
          Voir toutes les ressources
          <svg class="lab-more__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lab-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}
@media (min-width: 720px) {
  .lab-grid { grid-template-columns: repeat(2, 1fr); }
  .lab-grid > :nth-child(3) { grid-column: 1 / -1; }
}
@media (min-width: 1024px) {
  .lab-grid {
    gap: 24px;
    grid-template-columns: repeat(3, 1fr);
  }
  .lab-grid > :nth-child(3) { grid-column: auto; }
}

.lab-more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  font-family: var(--font-grotesk);
  font-weight: 500;
  font-size: 13.5px;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.25s ease-out, border-color 0.25s ease-out;
}

.lab-more:hover {
  color: #fff;
  border-color: rgba(94, 231, 231, 0.6);
}

.lab-more__arrow {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.lab-more:hover .lab-more__arrow {
  transform: translateX(3px);
}

@media (prefers-reduced-motion: reduce) {
  .lab-more,
  .lab-more__arrow {
    transition: none;
  }
}
</style>
