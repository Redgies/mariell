<script setup lang="ts">
const cards = [
  {
    title: 'Les profils Mariell',
    body: 'Chaque profil que Mariell présente passe par une évaluation rigoureuse : track record vérifié, lecture du cycle de vente, fit culturel. Une fois en poste, nous mesurons leur performance contre les objectifs fixés. Nous voyons au-delà de la signature : ce sont de vrais partenaires de croissance que nous cherchons pour vous.',
    cta: 'Notre engagement performance',
    href: '/performances',
  },
  {
    title: "L’expertise et nos outils",
    body: "Une lecture continue du métier Sales mise à disposition publique : salaires de référence, signaux faibles, pièges de recrutement, outils d’évaluation et de sourcing. Une ressource gratuite pour ceux qui recrutent comme pour ceux qui sont recrutés.",
    cta: 'Accéder au Lab Mariell',
    href: '/lab',
  },
]
</script>

<template>
  <section id="approach" class="section section--paper">
    <div class="container">
      <div class="approach__head reveal">
        <h2 class="h-display h-display--m approach__title">
          Tous les Sales ne se valent pas.<br /> <span class="italic" style="white-space: nowrap;">Les recruteurs non plus.</span>
        </h2>
        <p class="approach__intro">
          Notre métier est de repérer les profils Sales qui font la différence, de les approcher, et d’en
          comprendre la valeur réelle. Tout le reste en découle&#160;: la rigueur de l’évaluation, la mesure de
          la performance en poste, et la lecture continue du marché que nous partageons publiquement.
        </p>
      </div>

      <div class="approach__cards stagger">
        <div v-for="c in cards" :key="c.title" class="card approach__card reveal">
          <h3 class="approach__card-title">{{ c.title }}</h3>
          <p class="approach__card-body">{{ c.body }}</p>
          <div class="approach__card-cta">
            <NuxtLink class="arrow-link" :to="c.href">
              <span>{{ c.cta }}</span>
              <svg class="icon arrow-link__arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="approach__foot">
        <NuxtLink class="arrow-link" to="/methode">
          <span>Notre méthode en détail</span>
          <svg class="icon arrow-link__arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.approach__head {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: end;
  margin-bottom: 48px;
}
.approach__title {
  max-width: 540px;
}
.approach__intro {
  font-size: 16px;
  color: var(--fg-on-paper-2);
  max-width: 480px;
  line-height: 1.5;
}
.approach__cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.approach__card {
  display: flex;
  flex-direction: column;
}
.approach__card-title {
  font-family: var(--font-text);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0;
}
.approach__card-body {
  margin-top: 12px;
  color: var(--fg-on-paper-2);
  font-size: 15.5px;
  line-height: 1.5;
}
.approach__card-cta {
  margin-top: auto;
  padding-top: 22px;
}
.approach__foot {
  display: flex;
  justify-content: flex-end;
  margin-top: 28px;
}

@media (max-width: 900px) {
  .approach__head,
  .approach__cards {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .approach__head {
    margin-bottom: 32px;
  }
}

@media (max-width: 560px) {
  .approach__head {
    gap: 20px;
  }
}
</style>
