<script setup lang="ts">
const { public: pub } = useRuntimeConfig()
const calendlyUrl = pub.calendlyUrl as string

const metrics = [
  {
    tag: 'Objectifs',
    title: "L’atteinte des objectifs",
    excerpt: 'Où en est la personne par rapport aux cibles fixées avec vous. La mesure directe de la performance.',
  },
  {
    tag: 'Équipe',
    title: 'Le positionnement dans l\'équipe',
    excerpt: 'Comment le Sales se situe par rapport au reste de votre force commerciale. Un chiffre seul ne dit pas grand-chose. Comparé à l\'équipe, il prend son sens.',
  },
  {
    tag: 'Manager',
    title: 'Le retour du manager',
    excerpt: "Ce que son responsable direct observe, au-delà des chiffres. L’intégration, l’autonomie, la trajectoire.",
  },
]

const friseSteps = [
  {
    num: '01',
    tag: 'Signature',
    title: 'Le placement',
    body: 'Le bon profil rejoint vos équipes. Notre suivi commence ici.',
    align: 'left' as const,
  },
  {
    num: '02',
    tag: '4 mois',
    title: 'Intégration & rampe',
    body: "On lit l’onboarding et la montée en puissance&nbsp;: premiers objectifs, positionnement dans l’équipe, retour du manager.",
    align: 'center' as const,
  },
  {
    num: '03',
    tag: '8 mois',
    title: 'Performance',
    body: "La performance se mesure contre les objectifs, à plein régime, même sur les cycles de vente longs.",
    align: 'right' as const,
  },
]
</script>

<template>
  <div class="chromatic-mode">
    <main class="page-main">

      <section class="page-hero">
        <div class="page-hero__inner">
          <Breadcrumb :items="[{ label: 'Suivi de performance' }]" />
          <h1 class="h-display h-display--l" style="max-width:900px;">La signature n’est pas la fin de notre travail.</h1>
          <p style="margin-top:24px;max-width:620px;font-size:18px;line-height:1.55;color:rgba(244,239,227,0.72);">Nous mesurons la performance de chaque Sales que nous plaçons, à 4 mois et à 8 mois. Un recrutement commercial ne se juge pas le jour de la signature. Il se juge dans les mois qui suivent, sur le terrain, face aux objectifs.</p>
        </div>
      </section>

      <section class="section-pad section--paper">
        <div class="container">
          <div class="eyebrow-m" style="margin-bottom:14px;">— Notre engagement ne s’arrête pas au placement</div>
          <div class="prose">
            <h2 style="margin-top:0;">Un recrutement réussi se mesure à ce qu’il produit ensuite.</h2>
            <p>Pour nous, un recrutement réussi ne se mesure pas à la signature. Il se mesure à ce qu’il produit ensuite.</p>
            <p>Un placement n’a de valeur que par la performance qui suit. Un Sales qui rejoint vos équipes mais ne tient pas ses objectifs, c’est un échec, pour vous comme pour nous. C’est pourquoi notre travail continue après la signature, sur la période qui décide vraiment si le recrutement tient.</p>
          </div>
        </div>
      </section>

      <section class="section-pad section--paper" style="padding-top:0;">
        <div class="container">
          <div class="eyebrow-m" style="margin-bottom:14px;">— Ce que nous mesurons</div>
          <h2 class="h-display h-display--m" style="margin:0 0 40px;max-width:640px;">Trois indicateurs concrets, par profil placé.</h2>
          <div class="grid-cards">
            <div v-for="m in metrics" :key="m.tag" class="ucard" style="cursor:default;">
              <div class="ucard__tag">{{ m.tag }}</div>
              <div class="ucard__title">{{ m.title }}</div>
              <div class="ucard__excerpt">{{ m.excerpt }}</div>
            </div>
          </div>
          <p style="margin-top:24px;font-size:15px;color:var(--fg-on-paper-2);max-width:640px;">Ces trois lectures, croisées, donnent une image fidèle. Pas une impression, une évaluation.</p>
        </div>
      </section>

      <section class="section-pad section--ink">
        <div class="container">
          <div class="eyebrow-m" style="margin-bottom:14px;">— Deux jalons, 4 mois puis 8 mois</div>
          <h2 class="h-display h-display--m" style="margin:0 0 36px;max-width:680px;">Nous mesurons à deux moments où la donnée a vraiment du sens.</h2>
          <div class="perf-jalons">
            <div class="perf-jalon">
              <div class="eyebrow-m perf-jalon__head">À 4 mois</div>
              <p class="perf-jalon__body">La montée en puissance est assez avancée pour se lire, sans attendre la pleine productivité. C’est le bon moment pour évaluer l’onboarding et la trajectoire. Plus tôt, on mesure du bruit, pas un signal.</p>
            </div>
            <div class="perf-jalon">
              <div class="eyebrow-m perf-jalon__head">À 8 mois</div>
              <p class="perf-jalon__body">Le recul est suffisant pour que les résultats se matérialisent, même sur les cycles de vente longs. La personne est à son régime de croisière. C’est là que la performance réelle se lit, contre les objectifs.</p>
            </div>
          </div>
          <p style="margin-top:22px;font-size:15px;color:rgba(244,239,227,0.62);">Deux jalons, deux lectures complémentaires. L’intégration d’abord, la performance ensuite.</p>
        </div>
      </section>

      <section class="section-pad section--paper" style="padding-bottom:24px;">
        <div class="container">
          <div class="eyebrow-m" style="margin-bottom:14px;">Notre suivi · de la signature à la performance</div>
          <div class="frise-grid">
            <div
              v-for="step in friseSteps"
              :key="step.num"
              class="frise-item"
              :class="`frise-item--${step.align}`"
            >
              <div class="frise-item__num">{{ step.num }}</div>
              <div class="frise-item__tag">{{ step.tag }}</div>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="frise-item__title" v-html="step.title" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <p class="frise-item__body" v-html="step.body" />
            </div>
          </div>
        </div>
      </section>

      <section class="section-pad section--paper">
        <div class="container">
          <div class="eyebrow-m" style="margin-bottom:14px;">— Ce que ça change pour vous</div>
          <div class="prose">
            <h2 style="margin-top:0;">Vous n’êtes pas seul face à votre nouveau recrutement.</h2>
            <p>Nous suivons sa trajectoire avec vous, en gardant en tête ce qui était attendu au départ.</p>
            <p>Vous avez une lecture extérieure et structurée, à des moments qui comptent, plutôt qu’un ressenti diffus.</p>
            <p>Et vous travaillez avec un cabinet dont l’intérêt rejoint le vôtre. Pas la signature, la performance. Nous sommes là à la signature, et nous y sommes encore à 8 mois.</p>
          </div>
        </div>
      </section>

      <section class="section-pad section--paper" style="padding-top:0;">
        <div class="container">
          <div class="cta-strip">
            <div style="font-family:var(--font-display);font-weight:500;font-size:28px;letter-spacing:-0.02em;line-height:1.15;max-width:620px;">Parlons de votre prochain recrutement.</div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <a class="btn-pill btn-cyan" :href="calendlyUrl">Rencontrer Mariell</a>
              <a class="btn-pill btn-ghost" href="mailto:chez@mariell.fr">Nous écrire</a>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
.perf-jalons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.perf-jalon {
  background: var(--ink-800);
  border: 1px solid var(--border-on-ink);
  border-radius: 14px;
  padding: 26px 28px;
}

.perf-jalon__head {
  color: var(--cyan);
  margin-bottom: 14px;
}

.perf-jalon__body {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.55;
  color: rgba(244, 239, 227, 0.82);
}

.frise-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding-top: 24px;
}

.frise-item__num {
  font-family: var(--font-display);
  font-size: 46px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--fg-on-paper-1);
}

.frise-item__tag {
  margin-top: 16px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg-on-paper-3);
}

.frise-item__title {
  margin-top: 10px;
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.08;
  color: var(--fg-on-paper-1);
}

.frise-item__body {
  margin-top: 12px;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--fg-on-paper-2);
  max-width: 300px;
}

.frise-item--center {
  text-align: center;
}

.frise-item--center .frise-item__body {
  margin-left: auto;
  margin-right: auto;
}

.frise-item--right {
  text-align: right;
}

.frise-item--right .frise-item__body {
  margin-left: auto;
}

@media (max-width: 900px) {
  .perf-jalons {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .frise-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  /* Reset alignment: on single-column the centre/right alignment
     looks odd — left-align everything for readability. */
  .frise-item--center,
  .frise-item--right {
    text-align: left;
  }

  .frise-item--center .frise-item__body,
  .frise-item--right .frise-item__body {
    margin-left: 0;
    margin-right: 0;
    max-width: none;
  }
}

@media (max-width: 560px) {
  .perf-jalon {
    padding: 20px 18px;
  }

  .frise-item__num {
    font-size: 34px;
  }

  .frise-item__title {
    font-size: 22px;
  }
}
</style>
