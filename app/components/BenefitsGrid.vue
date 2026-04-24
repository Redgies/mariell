<script setup lang="ts">
const benefitsAsym = [
  {
    title: '60+ tops profils qui drivent la croissance.',
    paragraphs: [
      'Du SDR au Head of Sales. Des performances mesurables, un impact vérifié.',
      '<strong>Un track record, un investissement devenu anecdotique. 94% de succès.</strong>',
    ],
    iconPath: '<polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/>',
  },
  {
    title: 'Une compréhension du market.',
    paragraphs: [
      'Votre besoin devient le nôtre. Une proximité sans conditions avec vos enjeux.',
      'On acquiesce quand il le faut, <strong>on challenge tout autant.</strong>',
    ],
    iconPath: '<path d="M8 11l3 3 5-5"/><path d="M7 15v3a2 2 0 002 2h6a2 2 0 002-2v-3"/><path d="M17 9V6a2 2 0 00-2-2H9a2 2 0 00-2 2v3"/>',
  },
  {
    title: "Le temps, c'est de l'argent.",
    paragraphs: [
      "Poste vacant en Sales ? Du CA de perdu. Recherche qui dure ? Du CA de perdu.",
      "<strong>Mauvais recrutement ? Du CA de perdu, beaucoup.</strong> Cash is king.",
    ],
    iconPath: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>',
  },
  {
    title: 'Tous les Sales ne se valent pas.',
    paragraphs: [
      'Notre expérience personnelle du métier Sales nous permet une évaluation critique.',
      "Track record impactant, intelligence cognitive et émotionnelle — <strong>c'est ce qu'on cherche.</strong>",
    ],
    iconPath: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/><circle cx="11" cy="11" r="3"/>',
  },
]
</script>

<template>
  <section id="process" class="relative px-5 py-24 md:px-10 md:py-32 lg:px-16">
    <div class="mx-auto max-w-7xl">
      <div class="reveal mb-16 max-w-3xl">
        <span class="eyebrow-cyan mb-5">Pourquoi Mariell</span>
        <h2 class="mt-5 headline-section text-white" data-split>
          Recruter un top Sales,<br />
          ce n'est pas un <span class="gradient-text italic">coup de chance.</span>
        </h2>
      </div>

      <div class="benefits-asym">
        <article
          v-for="(benefit, idx) in benefitsAsym"
          :key="idx"
          class="benefit-card reveal"
        >
          <div class="benefit-icon">
            <svg viewBox="0 0 24 24" v-html="benefit.iconPath" />
          </div>
          <div
            class="mb-4 text-[24px] leading-tight tracking-[-0.01em] text-white"
            style="font-family: var(--font-serif-jp); font-weight: 500;"
          >
            {{ benefit.title }}
          </div>
          <div
            class="space-y-2.5 text-[15px] leading-[1.7] text-white/65"
            style="font-family: var(--font-grotesk); font-weight: 300;"
          >
            <p v-for="(p, pi) in benefit.paragraphs" :key="pi" v-html="p" />
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.benefit-card :deep(strong) {
  color: #fff;
  font-weight: 500;
}
</style>
