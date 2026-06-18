<script setup lang="ts">
const { public: pub } = useRuntimeConfig()
const calendlyUrl = pub.calendlyUrl as string
</script>

<template>
  <div class="chromatic-mode">
    <main class="page-main">

      <section class="page-hero">
        <div class="page-hero__inner">
          <Breadcrumb :items="[{ label: 'Mariell' }]" />
          <h1 class="h-display h-display--l" style="max-width:900px;">Mariell se présente.</h1>
          <p style="margin-top:24px;max-width:620px;font-size:18px;line-height:1.55;color:rgba(244,239,227,0.72);">
            Une équipe de Sales qui recrute d’autres Sales.<br/>
            Une obsession&nbsp;: identifier les profils qui font réellement la différence.<br/>
            Une méthode&nbsp;: l’approche directe, et l’évaluation critique des compétences humaines comme techniques.
          </p>
        </div>
      </section>

      <section class="section-pad section--paper">
        <div class="container">
          <div class="prose">
            <p>Mariell est né d’un constat simple&nbsp;: le marché des profils Sales est profondément hétérogène. Les commerciaux vraiment performants sont minoritaires, et les entreprises peinent à les identifier, puis à les recruter.</p>
            <p>Ces profils sont presque toujours en poste. Ils ne répondent pas aux annonces. <strong>L’approche directe est le seul moyen de les atteindre.</strong> Ils sont aussi très sollicités, souvent noyés dans des processus de recrutement où rien ne les distingue. Les approcher demande du temps, du réseau, et une lecture fine du métier.</p>
            <p>Réussir un recrutement Sales suppose deux choses rares. Des ressources d’abord&nbsp;: du temps pour chasser, approcher, multiplier les entretiens. Une expertise ensuite&nbsp;: celle qui permet de déceler, parmi des profils qui se ressemblent sur le papier, ceux qui performeront réellement.</p>
            <p>C’est précisément ce que nous sommes. <strong>Une équipe de Sales</strong>, experts du métier, du marché, et de la chasse des meilleurs profils.</p>
          </div>
        </div>
      </section>

      <section class="section-pad section--paper" style="padding-top:0;">
        <div class="container">
          <div class="eyebrow-m" style="margin-bottom:14px;">— Ce qui nous distingue</div>
          <h2 class="h-display h-display--m" style="max-width:680px;margin:0 0 44px;">Recruter un Sales n’est pas un coup de chance.</h2>
          <div class="grid-cards grid-cards--2">
            <div class="ucard" style="cursor:default;">
              <div class="ucard__title">Une expertise née du terrain</div>
              <div class="ucard__excerpt">Nous avons exercé le métier Sales avant de recruter ceux qui l’exercent. Cette expérience directe nous permet une évaluation critique que peu de cabinets peuvent offrir&nbsp;: track record lu en contexte, lecture du cycle de vente, signaux faibles que seul un oeil de praticien repère.</div>
            </div>
            <div class="ucard" style="cursor:default;">
              <div class="ucard__title">Une lecture continue du marché</div>
              <div class="ucard__excerpt">Nous suivons le marché Sales en permanence&nbsp;: rémunérations, viviers, dynamiques sectorielles, attentes des candidats. Cette lecture informe chaque mission et nous permet de calibrer une recherche avec justesse, dès le brief.</div>
            </div>
            <div class="ucard" style="cursor:default;">
              <div class="ucard__title">La conscience du coût d’un mauvais recrutement</div>
              <div class="ucard__excerpt">Un poste Sales vacant, c’est du chiffre d’affaires différé. Un mauvais recrutement, c’est pire&nbsp;: des mois perdus, un coût direct, et un impact sur l’équipe en place. Notre exigence à l’évaluation est la réponse à cet enjeu.</div>
            </div>
            <div class="ucard" style="cursor:default;">
              <div class="ucard__title">Une évaluation qui ne se paie pas de mots</div>
              <div class="ucard__excerpt">Nous évaluons ce qui prédit réellement la performance&nbsp;: le track record en contexte, l’intelligence émotionnelle et cognitive, le fit avec l’environnement. Pas un CV optimisé, pas un entretien préparé. Ce qui se vérifie.</div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-pad section--ink" style="padding-top:72px;padding-bottom:72px;">
        <div class="container" style="text-align:center;">
          <h2 class="h-display h-display--l" style="max-width:900px;margin:0 auto;">Tous les Sales ne se valent pas. Les recruteurs non plus.</h2>
        </div>
      </section>

      <section class="section-pad section--paper">
        <div class="container">
          <div class="cta-strip">
            <div style="font-family:var(--font-display);font-weight:500;font-size:28px;letter-spacing:-0.02em;line-height:1.15;max-width:760px;">
              Les meilleures entreprises recrutent les meilleurs Sales.<br/>
              <span style="font-family:var(--font-text);font-size:16px;font-weight:400;color:var(--fg-on-ink-2);">Un poste à pourvoir, une équipe à construire, ou simplement l’envie d’évaluer ce qu’on peut vous apporter. Échangeons sur votre contexte.</span>
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <a class="btn-pill btn-cyan" :href="calendlyUrl">Rencontrer Mariell</a>
              <NuxtLink class="btn-pill btn-ghost" to="/methode">Voir la méthode</NuxtLink>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>
