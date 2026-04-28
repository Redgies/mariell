<script setup lang="ts">
interface LabTool {
  emoji: string
  title: string
  description: string
  meta: string
  cta: string
  href: string
  variant?: 'service'
}

const tools: LabTool[] = [
  {
    emoji: '📊',
    title: 'Plan de sourcing LinkedIn',
    description:
      "Recevez une stratégie de chasse personnalisée pour votre prochain recrutement Sales : ciblage, templates, screening.",
    meta: '3 minutes · Gratuit',
    cta: 'Démarrer',
    href: '/lab/plan-de-sourcing',
  },
  {
    emoji: '🎯',
    title: "Évaluation d'attractivité",
    description:
      "Mesurez l'attractivité de votre offre Sales sur le marché. Forces, leviers d'amélioration, recommandations actionnables.",
    meta: '4 minutes · Gratuit',
    cta: 'Démarrer',
    href: '/lab/evaluation-attractivite',
  },
  {
    emoji: '🤝',
    title: 'Stage / Alternance',
    description:
      "Service offert : faites une demande de candidat stage ou alternance Sales. Réponse sous 7-10 jours.",
    meta: 'Gratuit · Service',
    cta: 'Faire une demande',
    href: '/lab/demande-stage-alternance',
    variant: 'service',
  },
]
</script>

<template>
  <section class="relative px-5 py-12 md:px-10 md:py-16 lg:px-16">
    <div class="mx-auto max-w-7xl">
      <!-- Header -->
      <div class="reveal mb-14 max-w-3xl md:mb-16">
        <span class="eyebrow-cyan">Le Lab Mariell</span>
        <h2 class="mt-8 headline-section pb-4 text-white" data-split>
          Mariell,<br />
          <span class="gradient-text italic">en libre-service.</span>
        </h2>
        <p
          class="mt-8 max-w-xl text-[16px] leading-[1.65] text-white/65"
          style="font-family: var(--font-grotesk); font-weight: 300;"
        >
          3 outils gratuits pour calibrer votre recrutement Sales avec précision.
        </p>
      </div>

      <!-- Grid of tools -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-7 lg:gap-8">
        <NuxtLink
          v-for="tool in tools"
          :key="tool.title"
          :to="tool.href"
          class="lab-card reveal"
          :class="{ 'lab-card--service': tool.variant === 'service' }"
        >
          <span v-if="tool.variant === 'service'" class="lab-card__badge">Service offert</span>

          <span class="lab-card__emoji" aria-hidden="true">{{ tool.emoji }}</span>

          <h3 class="lab-card__title">{{ tool.title }}</h3>

          <p class="lab-card__desc">{{ tool.description }}</p>

          <div class="lab-card__footer">
            <span class="lab-card__meta">{{ tool.meta }}</span>
            <span class="lab-card__cta">
              {{ tool.cta }}
              <svg class="lab-card__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- Footer link -->
      <div class="reveal mt-14 flex justify-center md:mt-16">
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
.lab-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px 28px;
  border: 1px solid rgba(94, 231, 231, 0.3);
  border-radius: 6px;
  background: rgba(94, 231, 231, 0.025);
  text-decoration: none;
  color: #fff;
  transition:
    border-color 0.3s ease-out,
    background 0.3s ease-out,
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
  will-change: transform;
}

.lab-card:hover {
  border-color: rgba(94, 231, 231, 0.35);
  background: rgba(255, 255, 255, 0.03);
  transform: translateY(-4px);
  box-shadow: 0 20px 50px -28px rgba(94, 231, 231, 0.4);
}

.lab-card--service {
  border-color: rgba(232, 94, 255, 0.3);
  background: rgba(232, 94, 255, 0.025);
}

.lab-card--service:hover {
  border-color: rgba(232, 94, 255, 0.55);
  box-shadow: 0 20px 50px -28px rgba(232, 94, 255, 0.45);
}

.lab-card__badge {
  position: absolute;
  top: 16px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
}

.lab-card__emoji {
  display: inline-block;
  font-size: 26px;
  line-height: 1;
}

.lab-card__title {
  font-family: var(--font-serif-jp);
  font-weight: 500;
  font-size: 20px;
  line-height: 1.22;
  letter-spacing: -0.01em;
  color: #fff;
  margin: 4px 0 0;
}

.lab-card__desc {
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 14.5px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.62);
  margin: 0;
  flex: 1;
}

.lab-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 18px;
  margin-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.lab-card__meta {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);
}

.lab-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-grotesk);
  font-weight: 600;
  font-size: 13.5px;
  color: #fff;
  white-space: nowrap;
}

.lab-card__arrow {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.lab-card:hover .lab-card__arrow {
  transform: translateX(3px);
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
  .lab-card,
  .lab-card__arrow,
  .lab-more,
  .lab-more__arrow {
    transition: none;
  }
  .lab-card:hover {
    transform: none;
  }
  .lab-card:hover .lab-card__arrow,
  .lab-more:hover .lab-more__arrow {
    transform: none;
  }
}
</style>
