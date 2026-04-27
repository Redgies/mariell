<script setup lang="ts">
import { siteConfig } from '~~/shared/config/site'

useScrollReveal()

useHead({
  title: 'Le Lab Mariell — Outils, guides & études',
  meta: [
    {
      name: 'description',
      content:
        "Le Lab Mariell : guides recrutement, outils Sales, études et benchmarks. L'extension publique de notre méthode.",
    },
  ],
})

interface LabItem {
  eyebrow: string
  title: string
  description: string
  status: string
}

const upcoming: LabItem[] = [
  {
    eyebrow: 'Guide',
    title: 'Évaluer un Sales en entretien',
    description:
      "La grille Mariell — soft skills, hard skills, track record. Comment décoder un CV attractif vs un track record réellement exploitable.",
    status: 'En préparation',
  },
  {
    eyebrow: 'Outil',
    title: 'Calculateur ROI recrutement',
    description:
      "Combien coûte un recrutement raté ? Combien rapporte un top profil sur 12 mois ? Le simulateur sur lequel on s'appuie en brief.",
    status: 'En préparation',
  },
  {
    eyebrow: 'Étude',
    title: 'Benchmark salarial Sales 2026',
    description:
      "Fourchettes par poste (SDR → VP Sales), secteur (SaaS, Fintech, Cybersécurité…) et géographie. Mis à jour chaque trimestre.",
    status: 'En préparation',
  },
  {
    eyebrow: 'Méthode',
    title: 'Le brief Mariell, en pratique',
    description:
      "Le canevas qu'on utilise sur chaque mission. Attractivité du poste, profil cible, frictions à anticiper, signaux d'embauche.",
    status: 'En préparation',
  },
]
</script>

<template>
  <main class="relative mx-auto max-w-7xl px-5 pt-32 pb-20 md:px-10 md:pt-40 md:pb-28 lg:px-16">
    <NuxtLink
      to="/"
      class="reveal mb-14 flex w-fit items-center gap-2 font-mono-num text-xs uppercase tracking-[0.22em] text-white/40 transition-colors hover:text-white"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Retour à l'accueil
    </NuxtLink>

    <div class="reveal eyebrow-cyan mb-6">Le Lab Mariell</div>

    <h1 class="reveal headline-asym text-white">
      Outils, guides<br />
      <span class="gradient-text italic">&amp; études.</span>
    </h1>

    <p
      class="reveal mt-7 max-w-2xl text-[clamp(18px,1.8vw,22px)] leading-snug text-white/70"
      style="font-family: var(--font-serif-jp); font-weight: 500; letter-spacing: -0.01em;"
    >
      L'extension publique de notre méthode.
    </p>

    <div
      class="reveal mt-6 max-w-2xl space-y-3 text-[15.5px] leading-[1.75] text-white/65"
      style="font-family: var(--font-grotesk); font-weight: 300;"
    >
      <p>
        Bench salariaux, frameworks d'entretien, calculateurs de ROI, lectures critiques du market Sales. Tout ce qu'on utilise en interne, on le partage ici — bientôt, en accès libre.
      </p>
      <p>
        Le Lab arrive progressivement. En attendant, voici ce qui se prépare.
      </p>
    </div>

    <!-- Upcoming grid -->
    <div class="mt-16 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-2">
      <article
        v-for="(item, idx) in upcoming"
        :key="idx"
        class="benefit-card reveal"
      >
        <div class="font-mono-num mb-5 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/45">
          <span class="h-px w-7 bg-cyan-400/70" />
          {{ item.eyebrow }}
        </div>

        <h2
          class="mb-3 text-[clamp(22px,2.2vw,28px)] leading-[1.15] tracking-[-0.015em] text-white"
          style="font-family: var(--font-serif-jp); font-weight: 500;"
        >
          {{ item.title }}
        </h2>

        <p
          class="text-[15px] leading-[1.7] text-white/65"
          style="font-family: var(--font-grotesk); font-weight: 300;"
        >
          {{ item.description }}
        </p>

        <div class="mt-7 flex items-center gap-2 font-mono-num text-[11px] uppercase tracking-[0.18em] text-white/45">
          <span class="h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(232,94,255,0.6)]" />
          {{ item.status }}
        </div>
      </article>
    </div>

    <!-- Closing CTA -->
    <div class="reveal mt-24 border-t border-white/8 pt-14 md:mt-28 md:pt-16">
      <div class="grid grid-cols-1 gap-10 md:grid-cols-[1.1fr_1fr] md:items-end md:gap-16">
        <div>
          <span class="eyebrow-cyan">En attendant</span>
          <h2 class="mt-5 headline-section text-white">
            Discutons de votre<br />
            <span class="gradient-text italic">prochain Sales.</span>
          </h2>
        </div>
        <div class="flex flex-wrap items-center gap-3.5 md:justify-end">
          <a
            :href="siteConfig.calendlyUrl"
            class="gradient-cta group inline-flex items-center gap-3 rounded-full px-7 py-4 text-base text-black"
            style="font-family: var(--font-grotesk); font-weight: 600;"
          >
            {{ siteConfig.ctaPrimary }}
            <svg class="transition-transform duration-300 group-hover:translate-x-1" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
          <NuxtLink to="/" class="btn-ghost">Retour à l'accueil</NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>
