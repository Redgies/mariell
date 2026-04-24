<script setup lang="ts">
const chronoSteps = [
  {
    num: '01',
    day: 'J+1',
    title: 'Brief',
    description: "Évaluation de la recherche : attractivité de l'entreprise et du poste, profil recherché, marché adressé, spécificités, frictions.",
  },
  {
    num: '02',
    day: 'J+2 → J+7',
    title: 'Chasse & Screening',
    description: 'Sourcing par chasse, réseau et talent pool premium. Call soft skills, visio hard skills + tests spécifiques à la recherche.',
  },
  {
    num: '03',
    day: 'J+7 → J+10',
    title: 'Push Pool',
    description: "Candidatures détaillées : CV, brief profil, description de la dernière expérience, ressenti et éventuels freins.",
  },
  {
    num: '04',
    day: 'J+10 → closing',
    title: 'Suivi & médiation',
    description: 'Accompagnement candidat et entreprise tout au long du process. Aide à la planification, médiation, closing.',
  },
]
</script>

<template>
  <section id="process-section" class="relative px-5 py-24 md:px-10 md:py-32 lg:px-16">
    <div class="mx-auto max-w-7xl">
      <!-- Editorial header — split 5 / 5 across 12 cols -->
      <div class="mb-20 grid grid-cols-1 gap-8 md:grid-cols-12">
        <div class="reveal md:col-span-5">
          <span class="eyebrow-cyan">— 03 · Méthodologie</span>
          <h2 class="mt-5 headline-section text-white" data-split>
            Sur-mesure,<br />
            <span class="gradient-text italic">jamais standard.</span>
          </h2>
        </div>
        <div class="reveal md:col-span-5 md:col-start-8 md:self-end">
          <p
            class="text-[17px] leading-[1.7] text-white/65"
            style="font-family: var(--font-grotesk); font-weight: 300;"
          >
            Chaque recherche est différente, les conditions varient. La finalité reste identique&nbsp;: recruter le meilleur profil.
          </p>
          <p
            class="mt-4 text-[17px] leading-[1.7] text-white/90"
            style="font-family: var(--font-grotesk); font-weight: 300;"
          >
            Premiers candidats sous <span class="gradient-text font-medium">7–10 jours</span> en moyenne.
          </p>
        </div>
      </div>

      <!-- Chronologie horizontale -->
      <div class="relative grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
        <div class="process-timeline-line hidden md:block" aria-hidden="true" />

        <article
          v-for="step in chronoSteps"
          :key="step.num"
          class="process-step reveal flex flex-col"
        >
          <div class="process-marker mb-7">
            <span
              class="font-serif-jp text-[1.15rem] leading-none tracking-[-0.01em] text-white"
              style="font-weight: 500;"
            >{{ step.num }}</span>
          </div>
          <div
            class="mb-3 font-mono-num text-[11px] uppercase tracking-[0.18em] text-white/45"
          >
            {{ step.day }}
          </div>
          <h3
            class="mb-3.5 text-[1.75rem] leading-[1.1] tracking-[-0.015em] text-white"
            style="font-family: var(--font-serif-jp); font-weight: 500;"
          >
            {{ step.title }}
          </h3>
          <p
            class="max-w-[280px] text-[0.95rem] leading-[1.65] text-white/65"
            style="font-family: var(--font-grotesk); font-weight: 300;"
          >
            {{ step.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
