<script setup lang="ts">
const config = useRuntimeConfig()
const calendlyUrl = config.public.calendlyUrl as string
</script>

<template>
  <div class="chromatic-mode">
    <section class="page-hero">
      <div class="page-hero__inner">
        <Breadcrumb :items="[{ label: 'Le Lab', to: '/lab' }, { label: 'Les 10 essentiels du recrutement Sales' }]" />
        <div class="eyebrow-m" style="color:rgba(244,239,227,0.45);margin-bottom:14px;">— Le Lab Mariell · Guides pratiques</div>
        <h1 class="h-display h-display--l" style="max-width:920px;">Les 10 essentiels du recrutement Sales.</h1>
        <p style="margin-top:24px;max-width:600px;font-size:18px;line-height:1.55;color:rgba(244,239,227,0.72);">Ce que personne ne vous dit, mais que vous devriez savoir.</p>
        <div style="margin-top:36px;display:flex;gap:40px;flex-wrap:wrap;">
          <div>
            <div class="meta-label">Édition</div>
            <div class="meta-value">Mai 2026</div>
          </div>
          <div>
            <div class="meta-label">Essentiels</div>
            <div class="meta-value">10</div>
          </div>
          <div>
            <div class="meta-label">Accès</div>
            <div class="meta-value">Libre</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-pad section--paper" style="padding-bottom:0;">
      <div class="container" style="max-width:760px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">Avant-propos</div>
        <p style="font-family:var(--font-text);font-size:22px;line-height:1.4;letter-spacing:-0.005em;color:var(--fg-on-paper-1);margin:0 0 20px;">La majorité des recrutements Sales ratés ne ratent pas à cause d’un mauvais profil. Ils ratent à cause de décisions prises avant même que la recherche commence.</p>
        <p style="font-size:16px;line-height:1.6;color:var(--fg-on-paper-2);margin:0;">Un brief flou, un enjeu mal posé, des critères jamais écrits, un process qui ne teste rien. Ce guide rassemble les 10 vérités qu’on aurait aimé qu’on nous donne plus tôt. Aucune n’est complexe. Aucune ne demande un outil. Toutes demandent de la lucidité.</p>
      </div>
    </section>

    <section class="section-pad section--paper">
      <div class="container" style="max-width:820px;display:flex;flex-direction:column;gap:0;">

        <div class="essentiel-item">
          <div class="essentiel-grid">
            <div class="essentiel-num">01</div>
            <div>
              <h2 class="essentiel-title">La Base&nbsp;: si vous cherchez un OVNI, sachez le reconnaître, le payer, et l’attraper.</h2>
              <p class="essentiel-body">Vous avez le droit de chercher un OVNI. Mais un OVNI a trois caractéristiques&nbsp;: il est rare, il coûte cher, et il faut savoir le reconnaître. Si vous ne réunissez pas ces trois conditions (rareté assumée dans la timeline, budget aligné, œil pour le détecter), ne cherchez pas un OVNI. Cherchez un excellent profil standard. Vous gagnerez 4 mois.</p>
            </div>
          </div>
        </div>

        <div class="essentiel-item">
          <div class="essentiel-grid">
            <div class="essentiel-num">02</div>
            <div>
              <h2 class="essentiel-title">Le Jeu&nbsp;: un recrutement se joue à 2.</h2>
              <p class="essentiel-body">Un recrutement est un jeu qui se joue à 2. L’attractivité est une question centrale, celle du candidat comme celle de l’entreprise. C’est le rapport des deux qui définira les règles. Tous les Sales ne se valent pas, toutes les entreprises non plus. Il faut adapter sa recherche&nbsp;: optimiser la visibilité de ses plus-values et compenser ses faiblesses. 100% Outbound&nbsp;? Variable attractif et atteignable. Un portfolio client ultra fourni&nbsp;? Le mentionner rapidement. Un package limité&nbsp;? Évolution rapide et plan de carrière clair.</p>
              <div class="anecdote-box">
                <div class="eyebrow-m" style="margin-bottom:14px;color:var(--cyan);">Vu chez Mariell</div>
                <p style="margin:0;font-size:14.5px;line-height:1.6;color:rgba(244,239,227,0.82);">Un client early stage nous appelle après plusieurs recrutements ratés et un turnover Sales chronique. Diagnostic&nbsp;: ils recrutaient les mauvais Sales car ils ne savaient pas vendre ce qu’ils avaient. Des références clients populaires invisibles dans leur pitch RH. Un produit déjà au PMF. Une structure mouvante donnant accès rapide aux responsabilités. On a remis ces 3 atouts au centre du discours candidat. Trois recrutements plus tard, fin du turnover.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="essentiel-item">
          <div class="essentiel-grid">
            <div class="essentiel-num">03</div>
            <div>
              <h2 class="essentiel-title">L’Enjeu&nbsp;: une phrase, ou rien.</h2>
              <p class="essentiel-body">On ne recrute pas pour recruter. Avant chaque recrutement Sales, écrivez la phrase&nbsp;: «&nbsp;Dans 12 mois, ce Sales aura permis de [enjeu chiffré ou périmètre précis].&nbsp;» Si vous n’arrivez pas à la compléter sans la bourrer de «&nbsp;et de&nbsp;» et «&nbsp;ainsi que&nbsp;», c’est que vous ne savez pas pourquoi vous recrutez. Et vous ne saurez pas non plus s’il a réussi.</p>
            </div>
          </div>
        </div>

        <div class="essentiel-item">
          <div class="essentiel-grid">
            <div class="essentiel-num">04</div>
            <div>
              <h2 class="essentiel-title">Le Brief&nbsp;: 3 lecteurs, 3 profils différents&nbsp;? Recommencez.</h2>
              <p class="essentiel-body">Un brief de recrutement Sales se teste avant de se lancer. Envoyez le vôtre à trois personnes&nbsp;: un pair RH, le Hiring Sales Manager qui pilotera ce Sales, et un externe (pair de votre secteur, advisor, cabinet). Demandez à chacun de décrire en 3 lignes le profil qu’il imagine. Si les trois descriptions ne se ressemblent pas, votre brief est flou. Et un brief flou produit toujours un recrutement flou, peu importe le talent du chasseur.</p>
            </div>
          </div>
        </div>

        <div class="essentiel-item">
          <div class="essentiel-grid">
            <div class="essentiel-num">05</div>
            <div>
              <h2 class="essentiel-title">Le Process&nbsp;: retirez les frictions, pas les filtres.</h2>
              <p class="essentiel-body">Six entretiens sont souvent synonymes de frictions. Mais retirer les bons filtres pour gagner du temps, c’est pire&nbsp;: vous laissez passer ce que vous deviez détecter. La règle&nbsp;: pour chaque étape, complétez «&nbsp;Cette étape sert à valider [compétence ou risque précis].&nbsp;» Si vous n’avez pas de réponse claire, c’est une friction. Si vous en avez une, c’est un filtre. Gardez les filtres, supprimez les frictions.</p>
            </div>
          </div>
        </div>

        <div class="essentiel-item">
          <div class="essentiel-grid">
            <div class="essentiel-num">06</div>
            <div>
              <h2 class="essentiel-title">Le Track Record&nbsp;: 80% &gt; 120% selon le contexte.</h2>
              <p class="essentiel-body">Un track record Sales se lit toujours en contexte, jamais à l’absolu. Un AE à 80% de quota, top performer d’une équipe (produit au PMF fragile, marque sans autorité, acquisition limitée), est probablement plus performant qu’un AE à 120% dans une équipe où tout le monde surperforme, sur un produit leader à demande inbound massive. Avant de valider un chiffre, posez quatre questions&nbsp;: quel était le quota de l’équipe&nbsp;? quel % atteignait 100%&nbsp;? combien d’AE au-dessus du candidat&nbsp;? quel état du PMF et de la notoriété à l’époque&nbsp;? Sans ces réponses, le chiffre est de la décoration.</p>
              <div class="anecdote-box">
                <div class="eyebrow-m" style="margin-bottom:14px;color:var(--cyan);">Vu chez Mariell</div>
                <p style="margin:0;font-size:14.5px;line-height:1.6;color:rgba(244,239,227,0.82);">Deux profils recrutés pour le même client. Le premier&nbsp;: CV flamboyant, top boîtes, track record en béton. Le second&nbsp;: CV plus modeste, mais l’impact était là, en contexte. Les deux performent. Mais c’est le second qui survole l’équipe, fait remonter des recommandations stratégiques, prend des responsabilités. Quelques années plus tard, le premier reste top performer. Le second est N+2. Le client a recruté deux Sales. Il a hérité d’un manager.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="essentiel-item">
          <div class="essentiel-grid">
            <div class="essentiel-num">07</div>
            <div>
              <h2 class="essentiel-title">Le Variable&nbsp;: le test silencieux du Sales que vous recrutez.</h2>
              <p class="essentiel-body">Le variable n’est pas un argument à vendre, c’est un test d’alignement. Un vrai Sales lit un comp plan en 5 minutes et identifie les seuils, les accélérateurs, les pièges, les angles de performance. Si votre candidat l’accepte poliment sans poser une seule question (pas de challenge sur le quota, pas de demande de simulation, pas de question sur les SPIFFs), vous ne recrutez pas un Sales. Vous recrutez un exécutant qui touchera son fixe.</p>
            </div>
          </div>
        </div>

        <div class="essentiel-item">
          <div class="essentiel-grid">
            <div class="essentiel-num">08</div>
            <div>
              <h2 class="essentiel-title">La Comparaison&nbsp;: le candidat suivant devra prouver quoi de plus&nbsp;?</h2>
              <p class="essentiel-body">La sur-comparaison est le poison silencieux des recrutements Sales. Le choix se fait dans les deux sens&nbsp;: les meilleurs profils sont sollicités en permanence, ont 2-3 process en parallèle, et signent vite. Si vous prolongez par confort («&nbsp;je veux quand même voir le suivant&nbsp;»), vous offrez le candidat à votre concurrent. Posez la question&nbsp;: que devra prouver le suivant pour déloger celui-ci&nbsp;? Sans réponse précise, vous ne cherchez plus mieux, vous repoussez la décision. Et passer un tour, c’est souvent perdre la partie.</p>
              <div class="anecdote-box">
                <div class="eyebrow-m" style="margin-bottom:14px;color:var(--cyan);">Vu chez Mariell</div>
                <p style="margin:0;font-size:14.5px;line-height:1.6;color:rgba(244,239,227,0.82);">Un excellent profil en final step. Le client veut «&nbsp;voir encore un candidat pour comparer&nbsp;». On fait patienter. Une semaine. Puis une de plus. Le candidat signe ailleurs. Le client met un mois de plus à combler le poste, avec l’amertume d’avoir manqué la perle qu’il avait déjà sous la main. Le candidat perdu&nbsp;? Top boîte concurrente, où il performe aujourd’hui.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="essentiel-item">
          <div class="essentiel-grid">
            <div class="essentiel-num">09</div>
            <div>
              <h2 class="essentiel-title">VP / Head of Sales, CRO&nbsp;: commencez par votre réseau. Toujours.</h2>
              <p class="essentiel-body">Pour les postes hautement stratégiques (VP Sales, Head of Sales, CRO), la chasse formelle ne doit jamais être votre premier réflexe. Commencez par votre réseau et celui de vos investisseurs, advisors, board members, ex-collègues. Pourquoi&nbsp;? À ce niveau, le fit pèse autant que la compétence, et la confiance se construit difficilement avec un inconnu, surtout quand les résultats ne se mesurent pas avant 12 à 18 mois. La chasse reste la meilleure option si le pool réseau est insuffisant, et oui, ces profils se chassent, ils ne candidatent pas. Mais elle ne doit jamais être le premier réflexe.</p>
            </div>
          </div>
        </div>

        <div class="essentiel-item essentiel-item--last">
          <div class="essentiel-grid">
            <div class="essentiel-num">10</div>
            <div>
              <h2 class="essentiel-title">Le Désalignement&nbsp;: ne le fuyez pas, il révèle un profil.</h2>
              <p class="essentiel-body">Quand un candidat n’est pas aligné avec vous (stratégie commerciale, lecture du marché, fiche de poste), la plupart des recruteurs vivent ce moment comme un signal de disqualification. C’est l’inverse. Le désalignement est le seul moment où le candidat ne joue plus un rôle préparé. Sa façon de tenir sa position, de l’argumenter, de l’adapter sans se renier (ou de pivoter mollement pour vous plaire) vous dit en 5 minutes ce que 5 entretiens ne diraient pas. Acceptez le désaccord, observez la réaction, jugez-la sans ego. Sans ego on a dit. Vous ne cherchez pas un candidat qui pense comme vous, mais un Sales qui sait valoriser sa position face à un client difficile, et vous êtes son premier client difficile.</p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <section class="section-pad section--ink" style="padding-top:64px;padding-bottom:64px;">
      <div class="container" style="max-width:760px;text-align:center;">
        <div class="eyebrow-m" style="margin-bottom:14px;justify-content:center;">Signature</div>
        <p style="font-family:var(--font-text);font-size:20px;line-height:1.5;letter-spacing:-0.005em;color:var(--fg-on-ink-1);margin:0;">Les candidats recrutés par nos clients font la fierté de Mariell, tout autant que ceux qui ont été screenés par Mariell mais ont finalement signé ailleurs. Ils sont tous témoins de la qualité du travail effectué.</p>
        <p style="margin-top:20px;font-size:14px;color:rgba(244,239,227,0.5);">— Par Mariell, pour vous.</p>
      </div>
    </section>

    <section class="section-pad section--paper" style="padding-top:64px;">
      <div class="container">
        <div class="cta-strip">
          <div class="cta-strip__title">Déléguez le pari. Gardez la décision.</div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <a class="btn-pill btn-cyan" :href="calendlyUrl" target="_blank" rel="noopener">Rencontrer Mariell</a>
            <NuxtLink class="btn-pill btn-ghost" to="/lab/guide-salaires-sales">Guide des salaires 2026</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.meta-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(244, 239, 227, 0.45);
}

.meta-value {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 26px;
  letter-spacing: -0.02em;
  color: var(--cyan);
  margin-top: 4px;
}

.essentiel-item {
  border-top: 1px solid var(--border-on-paper);
  padding: 36px 0;
}

.essentiel-item--last {
  border-bottom: 1px solid var(--border-on-paper);
}

.essentiel-grid {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 24px;
  align-items: start;
}

.essentiel-num {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 42px;
  letter-spacing: -0.03em;
  color: var(--moss);
  line-height: 0.9;
}

.essentiel-title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(22px, 2.6vw, 30px);
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin: 0 0 14px;
  color: var(--fg-on-paper-1);
  text-wrap: balance;
}

.essentiel-body {
  margin: 0;
  font-size: 16px;
  line-height: 1.62;
  color: var(--fg-on-paper-2);
}

.anecdote-box {
  margin-top: 20px;
  background: var(--ink-900);
  border-radius: 12px;
  padding: 22px 24px;
  color: var(--fg-on-ink-1);
}

.cta-strip__title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 28px;
  letter-spacing: -0.02em;
  line-height: 1.15;
  max-width: 560px;
}

/* ---- Mobile / responsive ---- */
@media (max-width: 900px) {
  .essentiel-grid { grid-template-columns: 48px 1fr; gap: 16px; }
  .essentiel-num { font-size: 32px; }
  .cta-strip__title { font-size: 22px; }
  .anecdote-box { padding: 18px 20px; }
  .meta-value { font-size: 22px; }
}

@media (max-width: 560px) {
  .essentiel-grid { grid-template-columns: 1fr; gap: 8px; }
  .essentiel-num {
    font-size: 26px;
    line-height: 1;
    margin-bottom: 4px;
  }
  .essentiel-item { padding: 24px 0; }
  .anecdote-box { padding: 16px 16px; }
  .cta-strip__title { font-size: 18px; }
  .meta-value { font-size: 18px; }
}
</style>
