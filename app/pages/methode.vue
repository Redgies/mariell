<script setup lang="ts">
const { public: pub } = useRuntimeConfig()
const calendlyUrl = pub.calendlyUrl as string

const steps = [
  {
    num: '01',
    title: 'Brief',
    tag: 'J+1',
    body: "Tout commence par une lecture du besoin, pas une prise de commande. Nous évaluons l’attractivité réelle de l’entreprise et du poste, le profil recherché, le marché adressé, les spécificités et les frictions éventuelles. C’est ce cadrage qui détermine la justesse de toute la recherche. Votre besoin devient le nôtre.",
  },
  {
    num: '02',
    title: 'Chasse & Screening',
    tag: 'J+2 → J+7',
    body: "Sourcing par chasse directe, activation du réseau et du talent pool premium. Aucune annonce. Chaque profil identifié passe une première évaluation des soft skills en appel, puis une évaluation des hard skills en visio, complétée de tests spécifiques à la recherche. Nous écartons beaucoup pour ne présenter que ce qui mérite de l’être.",
  },
  {
    num: '03',
    title: 'Push Pool',
    tag: 'J+7 → J+10',
    body: "Nous présentons un pool de candidats qualifiés, avec pour chacun un dossier détaillé&nbsp;: CV, brief profil, description de la dernière expérience, ressenti d’évaluation et éventuels points de vigilance. Pas de volume pour faire nombre. Des profils que nous assumons.",
  },
  {
    num: '04',
    title: 'Médiation & closing',
    tag: 'J+10 → closing',
    body: "Nous accompagnons les deux parties jusqu’à la signature&nbsp;: planification des entretiens, médiation, gestion des contre-offres, cadrage de l’offre finale. C’est souvent là que se gagne ou se perd un recrutement Sales, et c’est là que notre rôle de tiers de confiance compte le plus.",
  },
  {
    num: '05',
    title: 'Suivi de la performance',
    tag: '4 et 8 mois',
    body: "Un recrutement ne s’arrête pas à l’offre signée. Nous suivons la performance du profil en poste, à 4 mois puis à 8 mois, contre les objectifs fixés au brief. C’est notre engagement, et c’est ce qui nous distingue&nbsp;: nous mesurons ce que nous livrons.",
    last: true,
  },
]
</script>

<template>
  <div class="chromatic-mode">
    <main class="page-main">

      <section class="page-hero">
        <div class="page-hero__inner">
          <Breadcrumb :items="[{ label: 'Méthode' }]" />
          <h1 class="h-display h-display--l" style="max-width:880px;">Sur-mesure, jamais standard.</h1>
          <p style="margin-top:24px;max-width:600px;font-size:18px;line-height:1.55;color:rgba(244,239,227,0.72);">
            Chaque recrutement commercial est différent. Les contextes varient, les profils aussi, les contraintes ne se ressemblent jamais.<br/>
            La finalité, elle, reste identique&nbsp;: recruter le meilleur profil pour le poste. Premiers candidats présentés sous 7 à 10 jours.
          </p>
        </div>
      </section>

      <section class="section-pad section--paper" style="padding-bottom:0;">
        <div class="container">
          <div class="eyebrow-m" style="margin-bottom:14px;">— Notre approche</div>
          <div class="prose">
            <p>Nous ne publions aucune annonce. Les meilleurs Sales sont en poste, ils ne répondent pas aux offres. Nous allons les chercher par approche directe, nous évaluons leur valeur réelle, et nous accompagnons la relation jusqu’à la signature, puis au-delà.</p>
            <p>La méthode qui suit est notre colonne vertébrale. Elle se calibre à chaque mission, mais sa logique ne change pas&nbsp;: comprendre avant de chercher, évaluer avant de présenter, accompagner jusqu’à ce que le profil performe.</p>
          </div>
        </div>
      </section>

      <section class="section-pad section--paper">
        <div class="container">
          <ol class="method-steps">
            <li
              v-for="step in steps"
              :key="step.num"
              class="method-step"
              :class="{ 'method-step--last': step.last }"
            >
              <div class="method-step__num">{{ step.num }}</div>
              <div class="method-step__body">
                <div class="method-step__header">
                  <h2 class="method-step__title">{{ step.title }}</h2>
                  <span class="method-step__tag">{{ step.tag }}</span>
                </div>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <p class="method-step__text" v-html="step.body" />
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section class="section-pad section--ink">
        <div class="container" style="text-align:center;">
          <div class="eyebrow-m" style="margin-bottom:14px;justify-content:center;color:var(--fg-on-ink-3);">— Un parti pris</div>
          <div class="stat-row" style="grid-template-columns:1fr;max-width:620px;margin:0 auto;">
            <div>
              <div class="stat__num" style="font-size:clamp(36px,4.5vw,56px);">Pas d’annonce publiée.</div>
              <div class="stat__label">Approche directe, uniquement.</div>
            </div>
          </div>
          <p style="max-width:560px;margin:22px auto 0;font-size:16px;line-height:1.55;color:rgba(244,239,227,0.72);">C’est le choix qui fonde tout le reste. Les profils que nous présentons ne sont pas ceux qui cherchent. Ce sont ceux que nous sommes allés chercher.</p>
        </div>
      </section>

      <section class="section-pad section--paper">
        <div class="container">
          <div class="cta-strip">
            <div>
              <div style="font-family:var(--font-display);font-weight:500;font-size:28px;letter-spacing:-0.02em;line-height:1.15;max-width:760px;">
                Votre prochaine recherche commence par un brief.<br/>
                <span style="font-family:var(--font-text);font-size:16px;font-weight:400;color:var(--fg-on-ink-2);">Un besoin précis, ou simplement l’envie d’évaluer ce qu’on peut vous apporter. Sur-mesure, jamais standard. Échangeons sur votre contexte.</span>
              </div>
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <a class="btn-pill btn-cyan" :href="calendlyUrl">Rencontrer Mariell</a>
              <NuxtLink class="btn-pill btn-ghost" to="/expertises">Voir les expertises</NuxtLink>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
.method-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.method-step {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 28px;
  padding: 30px 0;
  border-top: 1px solid var(--border-on-paper);
}

.method-step--last {
  border-bottom: 1px solid var(--border-on-paper);
}

.method-step__num {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 40px;
  letter-spacing: -0.02em;
  color: var(--fg-on-paper-4);
  line-height: 1;
}

.method-step__header {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
}

.method-step__title {
  font-family: var(--font-text);
  font-weight: 600;
  font-size: 22px;
  letter-spacing: -0.01em;
  margin: 0;
}

.method-step__tag {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg-on-paper-3);
}

.method-step__text {
  margin: 10px 0 0;
  font-size: 16px;
  line-height: 1.55;
  color: var(--fg-on-paper-2);
  max-width: 700px;
}

@media (max-width: 560px) {
  .method-step {
    grid-template-columns: 48px 1fr;
    gap: 16px;
    padding: 22px 0;
  }

  .method-step__num {
    font-size: 28px;
  }

  .method-step__title {
    font-size: 18px;
  }

  .method-step__text {
    font-size: 15px;
    max-width: none;
  }
}
</style>
