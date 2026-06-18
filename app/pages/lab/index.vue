<script setup lang="ts">
const config = useRuntimeConfig()
const calendlyUrl = config.public.calendlyUrl as string
</script>

<template>
  <div class="chromatic-mode">
    <section class="page-hero">
      <div class="page-hero__inner">
        <Breadcrumb :items="[{ label: 'Le Lab', to: '/lab' }]" />
        <h1 class="h-display h-display--l" style="max-width:880px;">Mariell, en libre-service.</h1>
        <p style="margin-top:24px;max-width:620px;font-size:18px;line-height:1.55;color:rgba(244,239,227,0.72);">Notre lecture du métier Sales, mise à disposition. Des outils gratuits pour calibrer vos recrutements commerciaux, et des guides de référence pour comprendre le marché. Pour ceux qui recrutent comme pour ceux qui sont recrutés.</p>
      </div>
    </section>

    <section class="section-pad section--paper">
      <div class="container">
        <div class="eyebrow-m" style="margin-bottom:14px;">— Outils gratuits</div>
        <h2 class="h-display h-display--m" style="max-width:680px;margin:0 0 40px;">Calibrez votre recrutement Sales avec précision.</h2>
        <div class="grid-cards">
          <NuxtLink class="ucard" to="/lab/plan-de-sourcing">
            <div class="ucard__tag">IA · 3 minutes</div>
            <div class="ucard__title">Plan de sourcing LinkedIn</div>
            <div class="ucard__excerpt">Votre stratégie de chasse pour le prochain recrutement Sales&nbsp;: entreprises cibles, requête booléenne, plan en 4 phases.</div>
            <span class="ucard__cta-link">Démarrer &rarr;</span>
          </NuxtLink>
          <NuxtLink class="ucard" to="/lab/evaluation-attractivite">
            <div class="ucard__tag">IA · 4 minutes</div>
            <div class="ucard__title">Évaluation d’attractivité</div>
            <div class="ucard__excerpt">Votre offre Sales, confrontée au marché 2026. Diagnostic chiffré, comparatif, points de levier à activer.</div>
            <span class="ucard__cta-link">Démarrer &rarr;</span>
          </NuxtLink>
          <NuxtLink class="ucard" to="/lab/demande-stage-alternance">
            <div class="ucard__tag">Service offert · 7 à 10 jours</div>
            <div class="ucard__title">Demande stage ou alternance Sales</div>
            <div class="ucard__excerpt">Activez notre vivier de stagiaires et alternants Sales. Profils proposés sous 7 à 10 jours.</div>
            <span class="ucard__cta-link">Faire une demande &rarr;</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section-pad section--paper" style="padding-top:0;">
      <div class="container">
        <div class="eyebrow-m" style="margin-bottom:14px;">— Guides de référence</div>
        <h2 class="h-display h-display--m" style="max-width:680px;margin:0 0 40px;">Comprendre le marché avant de recruter.</h2>
        <div class="grid-cards grid-cards--2">
          <NuxtLink class="ucard" to="/lab/guide-salaires-sales">
            <div class="ucard__tag">Mis à jour 2026</div>
            <div class="ucard__title">Guide des salaires Sales 2026</div>
            <div class="ucard__excerpt">La grille à jour, par poste, par séniorité, par contexte. 12 fiches de poste, 5 lectures du marché Sales.</div>
            <span class="ucard__cta-link">Consulter le guide &rarr;</span>
          </NuxtLink>
          <NuxtLink class="ucard" to="/lab/10-essentiels-recrutement-sales">
            <div class="ucard__tag">Guide pratique</div>
            <div class="ucard__title">Les 10 essentiels du recrutement Sales</div>
            <div class="ucard__excerpt">Dix vérités pour ne pas rater votre prochain recrutement Sales. Aucune n’est complexe. Toutes demandent de la lucidité.</div>
            <span class="ucard__cta-link">Lire les 10 essentiels &rarr;</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section-pad section--paper">
      <div class="container">
        <div class="cta-strip">
          <div class="cta-strip__text">
            Les outils pour challenger. Le reste, c’est notre métier.<br />
            <span class="cta-strip__sub">Le Lab vous aide à calibrer. Quand vient le moment de chasser le bon profil, parlons-en.</span>
          </div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <a class="btn-pill btn-cyan" :href="calendlyUrl" target="_blank" rel="noopener">Rencontrer Mariell</a>
            <NuxtLink class="btn-pill btn-ghost" to="/expertises">Voir nos expertises</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ucard__cta-link {
  font-size: 13px;
  color: var(--moss);
  border-bottom: 1px solid currentColor;
  align-self: flex-start;
  padding-bottom: 1px;
  margin-top: 4px;
}

.cta-strip__text {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 28px;
  letter-spacing: -0.02em;
  line-height: 1.15;
  max-width: 760px;
}

.cta-strip__sub {
  font-family: var(--font-text);
  font-size: 16px;
  font-weight: 400;
  color: var(--fg-on-ink-2);
  font-style: normal;
}

@media (max-width: 900px) {
  .cta-strip__text { font-size: 22px; }
}

@media (max-width: 560px) {
  .cta-strip__text { font-size: 18px; }
}
</style>
