<script setup lang="ts">
const quotes = [
  {
    quote: "Mariell nous a trouvé la pépite qu’il nous fallait en Sales, on n’a rencontré que d’excellents profils, vraiment. Rien à voir avec ce qu’on avait l’habitude de voir ; en plus tout a été simple et fluide, avec de super conseils. Je recommande, et je repasserai par leurs services de toute façon !",
    name: 'Valentin Bourgeois',
    role: 'Founder & CEO, Dhala',
    photo: '/assets/testimonials/valentin-bourgeois.png',
  },
  {
    quote: "Je recommande vivement Mariell ! Nous avons collaboré sur le recrutement de nos équipes Sales et leur expertise a fait la différence. En plus de maîtriser parfaitement le sujet, Mariell se distingue par sa finesse d’analyse et une excellente communication. Le recruteur de talents qui comprend instantanément les enjeux Sales.",
    name: 'Benjamin Lellouche',
    role: 'Founder & Président, Tom Invest Conseil',
    photo: '/assets/testimonials/benjamin-lellouche.png',
  },
  {
    quote: "Excellente collaboration avec Mariell, qui a mené à deux supers recrutements ! Mariell est hyper pro, sharp, réactif, à l’écoute. L’équipe a très bien compris notre culture d’équipe et notre exigence, et a appliqué cette grille d’analyse aux candidats chassés. Les échanges étaient toujours sympathiques et efficaces.",
    name: 'Marc Nègre',
    role: 'Co-Founder & Président, Kraaft',
    photo: '/assets/testimonials/marc-negre.png',
  },
]
</script>

<template>
  <section id="testimonials" class="section section--ink testi">
    <div class="container">
      <div class="testi__grid stagger">
        <div v-for="q in quotes" :key="q.name" class="card card--ink testi__card reveal">
          <svg class="icon testi__quote" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 .985 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"
            />
          </svg>
          <div class="testi__text">«&#160;{{ q.quote }}&#160;»</div>
          <div class="testi__person">
            <img :src="q.photo" :alt="q.name" class="testi__photo" loading="lazy" decoding="async">
            <div>
              <div class="testi__name">{{ q.name }}</div>
              <div class="testi__role">{{ q.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testi {
  padding-top: 96px;
  padding-bottom: 96px;
}
.testi__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.testi__card {
  padding: 28px 30px;
}
.testi__quote {
  width: 20px;
  height: 20px;
}
.testi__text {
  margin-top: 14px;
  font-family: var(--font-text);
  font-size: 16px;
  line-height: 1.5;
  color: var(--fg-on-ink-1);
  font-weight: 400;
}
.testi__person {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.testi__photo {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
  flex-shrink: 0;
  background: rgba(244, 239, 227, 0.08);
}
.testi__name {
  font-size: 13.5px;
  font-weight: 500;
}
.testi__role {
  font-size: 12px;
  color: rgba(244, 239, 227, 0.5);
}

@media (max-width: 900px) {
  .testi__grid {
    grid-template-columns: 1fr;
  }
  .testi {
    padding-top: 64px;
    padding-bottom: 64px;
  }
}

@media (max-width: 560px) {
  .testi__card {
    padding: 22px 20px;
  }
}
</style>
