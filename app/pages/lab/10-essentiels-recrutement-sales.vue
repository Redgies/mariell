<script setup lang="ts">
useScrollReveal()

useHead({
  title: 'Les 10 essentiels du recrutement Sales · Le Lab Mariell',
  meta: [
    {
      name: 'description',
      content:
        "Dix vérités pour ne pas rater votre prochain recrutement Sales. Aucune n'est complexe. Toutes demandent de la lucidité.",
    },
  ],
})

interface Essentiel {
  num: string
  concept: string
  punch: string // raw HTML (entities like &nbsp; allowed)
  body: string  // raw HTML (entities + <strong>/<em> allowed)
  anecdote?: string
}

const essentiels: Essentiel[] = [
  {
    num: '01',
    concept: 'La Base',
    punch: "si vous cherchez un OVNI, sachez le reconnaître, le payer, et l'attraper.",
    body:
      "Vous avez le droit de chercher un OVNI. Mais un OVNI a trois caractéristiques&nbsp;: il est rare, il coûte cher, et il faut savoir le reconnaître. Si vous ne réunissez pas ces trois conditions — la rareté assumée dans la timeline, le budget aligné, l'œil pour le détecter — ne cherchez pas un OVNI. Cherchez un excellent profil standard. Vous gagnerez 4 mois.",
  },
  {
    num: '02',
    concept: 'Le Jeu',
    punch: 'un recrutement se joue à 2.',
    body:
      "Un recrutement est un jeu qui se joue à 2. L'attractivité est une question centrale, celle du candidat comme celle de l'entreprise. C'est le rapport des deux qui définira les règles de ce recrutement. Tous les Sales ne se valent pas, toutes les entreprises non plus. Il faut adapter sa recherche en fonction, en optimisant la visibilité de ses plus-values et en compensant ses faiblesses. 100% Outbound&nbsp;? Variable attractif et atteignable. Un portfolio client ultra fourni&nbsp;? Le mentionner rapidement. Un package limité&nbsp;? Évolution rapide et plan de carrière clair.",
    anecdote:
      "Un client early stage nous appelle après plusieurs recrutements ratés et un turnover Sales chronique. Sous-performance systématique, profils qui ne tenaient pas. Diagnostic&nbsp;: ils recrutaient les mauvais Sales, car ils ne savaient pas vendre ce qu'ils avaient. Des références clients ultra populaires invisibles dans leur pitch RH. Un produit innovant, déjà au PMF. Une structure mouvante qui permettait un accès rapide aux responsabilités. On a remis ces 3 atouts au centre du discours candidat. Trois recrutements plus tard, fin du turnover.",
  },
  {
    num: '03',
    concept: "L'Enjeu",
    punch: 'une phrase, ou rien.',
    body:
      "On ne recrute pas pour recruter. Avant chaque recrutement Sales, écrivez la phrase suivante&nbsp;: «&nbsp;Dans 12 mois, ce Sales aura permis de [enjeu chiffré ou périmètre précis].&nbsp;» Si vous n'arrivez pas à compléter la phrase sans la bourrer de «&nbsp;et de&nbsp;» et «&nbsp;ainsi que&nbsp;», c'est que vous ne savez pas pourquoi vous recrutez. Et vous ne saurez pas non plus s'il a réussi.",
  },
  {
    num: '04',
    concept: 'Le Brief',
    punch: '3 lecteurs, 3 profils différents&nbsp;? Recommencez.',
    body:
      "Un brief de recrutement Sales se teste avant de se lancer. Envoyez le vôtre à trois personnes&nbsp;: un pair RH, le Hiring Sales Manager qui pilotera ce Sales au quotidien, et un externe (pair de votre secteur, advisor, cabinet). Demandez à chacun de décrire en 3 lignes le profil qu'il imagine. Si les trois descriptions ne se ressemblent pas, votre brief est flou. Et un brief flou produit toujours un recrutement flou — peu importe le talent du chasseur.",
  },
  {
    num: '05',
    concept: 'Le Process',
    punch: 'retirez les frictions, pas les filtres.',
    body:
      "Six entretiens sont souvent synonyme de frictions. Mais retirer les bons filtres pour gagner du temps, c'est pire — vous laissez passer ce que vous deviez détecter. La règle&nbsp;: pour chaque étape de votre process, complétez la phrase «&nbsp;Cette étape sert à valider [compétence ou risque précis].&nbsp;» Si vous n'avez pas de réponse claire, c'est une friction. Si vous en avez une, c'est un filtre. Gardez les filtres, supprimez les frictions.",
  },
  {
    num: '06',
    concept: 'Le Track Record',
    punch: '80% &gt; 120% selon le contexte.',
    body:
      "Un track record Sales se lit toujours en contexte, jamais à l'absolu. Un AE à 80% de quota dans une équipe où il est top performer — sur un produit avec un PMF encore fragile, une marque sans autorité sur son marché, une acquisition limitée — est probablement plus performant qu'un AE à 120% dans une équipe où tout le monde surperforme, sur un produit leader avec une demande inbound massive. Avant de valider un chiffre sur un CV, posez systématiquement quatre questions&nbsp;: quel était le quota de l'équipe&nbsp;? quel pourcentage de l'équipe atteignait 100%&nbsp;? combien d'AE étaient au-dessus du candidat&nbsp;? quel était l'état du PMF et de la notoriété produit à l'époque&nbsp;? Sans ces réponses, le chiffre sur le CV est de la décoration.",
    anecdote:
      "Deux profils recrutés pour le même client. Le premier&nbsp;: CV flamboyant, top boîtes leader, track record en béton. Le second&nbsp;: CV plus modeste, mais l'impact était là, en contexte. Les deux performent. Mais c'est le second qui survole l'équipe, fait remonter des recommandations stratégiques, prend des responsabilités. Quelques années plus tard, le premier reste top performer. Le second est N+2. Le client a recruté deux Sales. Il a hérité d'un manager.",
  },
  {
    num: '07',
    concept: 'Le Variable',
    punch: 'le test silencieux du Sales que vous recrutez.',
    body:
      "Le variable n'est pas un argument à vendre, c'est un test d'alignement. Un vrai Sales lit un comp plan en 5 minutes et identifie immédiatement les seuils, les accélérateurs, les pièges, les angles de performance. Si votre candidat l'accepte poliment sans poser une seule question — pas de challenge sur le quota, pas de demande de simulation, pas de question sur les SPIFFs — vous ne recrutez pas un Sales. Vous recrutez un exécutant qui touchera son fixe.",
  },
  {
    num: '08',
    concept: 'La Comparaison',
    punch: 'le candidat suivant devra prouver quoi de plus que le précédent&nbsp;?',
    body:
      "La sur-comparaison est le poison silencieux des recrutements Sales. Aujourd'hui, le choix se fait dans les deux sens&nbsp;: les meilleurs profils sont sollicités en permanence, ils ont 2-3 process en parallèle, et ils signent vite. Si vous prolongez votre recherche par confort — «&nbsp;je veux quand même voir le suivant&nbsp;» — vous ne comparez pas, vous offrez le candidat à votre concurrent. Posez la question avant de continuer&nbsp;: que devra prouver le candidat suivant pour déloger celui-ci&nbsp;? Si vous n'avez pas de réponse précise, vous ne cherchez plus mieux. Vous repoussez la décision. Et passer un tour, c'est souvent perdre la partie.",
    anecdote:
      "Un excellent profil en final step. Le client veut «&nbsp;voir encore un candidat pour comparer&nbsp;», on fait patienter le candidat. Une semaine. Puis une de plus. Le candidat signe ailleurs. Le client met un mois supplémentaire à combler le poste, avec l'amertume d'avoir manqué la perle qu'il avait déjà sous la main. Le candidat perdu&nbsp;? Top boîte concurrente. Aujourd'hui, il y performe.",
  },
  {
    num: '09',
    concept: 'VP Sales, Head of Sales, CRO',
    punch: 'commencez par votre réseau. Toujours.',
    body:
      "Pour les postes hautement stratégiques — VP Sales, Head of Sales, CRO — la chasse formelle ne doit jamais être votre premier réflexe. Commencez systématiquement par votre réseau et celui de vos investisseurs, advisors, board members, ex-collègues. Pourquoi&nbsp;? À ce niveau, le fit pèse autant que la compétence sur le papier, et la confiance se construit difficilement avec un inconnu — surtout quand les résultats ne se mesurent pas avant 12 à 18 mois. La chasse reste la meilleure option si le pool réseau est insuffisant — et oui, ces profils se chassent, ils ne candidatent pas. Mais elle ne doit jamais être votre premier réflexe.",
  },
  {
    num: '10',
    concept: 'Le Désalignement',
    punch: 'ne le fuyez pas, il révèle un profil.',
    body:
      "Quand un candidat n'est pas aligné avec vous — sur la stratégie commerciale, sur la lecture du marché, sur la fiche de poste — la plupart des recruteurs vivent ce moment comme un signal de disqualification. C'est l'inverse. Le désalignement est le seul moment de l'entretien où le candidat ne joue plus un rôle préparé. Sa façon de tenir sa position, de l'argumenter, de l'adapter sans se renier — ou au contraire de pivoter mollement pour vous plaire — vous dit en 5 minutes ce que 5 entretiens ne vous diraient pas. Acceptez le désaccord, observez la réaction, jugez-la sans ego. Sans ego on a dit. Vous ne cherchez pas un candidat qui pense comme vous. Vous cherchez un Sales qui sait valoriser sa position face à un client difficile — et vous êtes son premier client difficile.",
  },
]
</script>

<template>
  <!-- Page-level opaque layer that masks the global GradientBlobs. -->
  <div class="lab-page-bg" aria-hidden="true" />

  <main class="lab-page">
    <!-- ============ SUB-NAV ============ -->
    <div class="lab-subnav">
      <div class="lab-container lab-subnav__row">
        <NuxtLink to="/lab" class="lab-subnav__back">
          <span aria-hidden="true">←</span>
          Retour au Lab
        </NuxtLink>
        <div class="lab-subnav__crumb">
          <NuxtLink to="/lab">LE LAB</NuxtLink>
          <span class="lab-subnav__sep">/</span>
          10 ESSENTIELS RECRUTEMENT SALES
        </div>
      </div>
    </div>

    <!-- ============ HEADER ============ -->
    <header class="lab-header">
      <div class="lab-container">
        <div class="reveal lab-cartouche">
          <span class="lab-cartouche__dot" />
          LE LAB MARIELL
          <span class="lab-cartouche__sep" />
          <span class="lab-cartouche__num">GUIDES PRATIQUES</span>
        </div>
        <h1 class="reveal lab-h1">
          Les <span class="gradient-text italic">10 essentiels</span><br />
          du recrutement Sales.
        </h1>
        <p class="reveal lab-sub">
          Ce que personne ne vous dit, <span class="gradient-text italic">mais que vous devriez savoir.</span>
        </p>
        <div class="reveal lab-meta">
          <div>ÉDITION <strong>MAI&nbsp;2026</strong></div>
          <div>ESSENTIELS <strong>10</strong></div>
          <div>ACCÈS <strong>LIBRE</strong></div>
        </div>
      </div>
    </header>

    <!-- ============ AVANT-PROPOS ============ -->
    <section class="lab-foreword">
      <div class="lab-container">
        <div class="reveal lab-foreword__lbl">AVANT-PROPOS</div>
        <blockquote class="reveal lab-foreword__quote">
          <p>La majorité des recrutements Sales ratés ne ratent pas à cause d'un mauvais profil. Ils ratent à cause de décisions prises avant même que la recherche commence&nbsp;: un brief flou, un enjeu mal posé, des critères jamais écrits, un process qui ne teste rien.</p>
          <p>Ce guide rassemble les 10 vérités qu'on aurait aimé qu'on nous donne plus tôt. Aucune n'est complexe. Aucune ne demande un outil. Toutes demandent de la lucidité.</p>
        </blockquote>
      </div>
    </section>

    <!-- ============ 10 ESSENTIELS ============ -->
    <section class="lab-essentiels">
      <div class="lab-container lab-container--narrow">
        <article
          v-for="(essentiel, idx) in essentiels"
          :key="essentiel.num"
          class="essentiel"
          :class="{ 'essentiel--first': idx === 0 }"
        >
          <div class="essentiel__row">
            <div class="essentiel__num">
              {{ essentiel.num }}<sup>ESSENTIEL</sup>
            </div>
            <div class="essentiel__body">
              <h2 class="essentiel__title">
                <span class="gradient-text italic essentiel__concept">{{ essentiel.concept }}</span><span class="essentiel__colon">:</span><span class="essentiel__punch" v-html="essentiel.punch" />
              </h2>
              <p class="essentiel__p" v-html="essentiel.body" />

              <aside v-if="essentiel.anecdote" class="anecdote">
                <div class="anecdote__label">
                  <em class="name">Vu chez Mariell<span class="dot">.</span></em>
                </div>
                <p v-html="essentiel.anecdote" />
              </aside>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ============ SIGNATURE ============ -->
    <section class="lab-signature">
      <div class="lab-container lab-container--narrow">
        <div class="lab-signature__lbl">SIGNATURE</div>
        <p class="lab-signature__quote">
          Les candidats recrutés par nos clients font la fierté de Mariell, tout autant que ceux qui ont été screenés par Mariell mais ont finalement signé ailleurs. Ils sont tous témoins de la qualité du travail effectué.
        </p>
        <div class="lab-signature__sig">
          <span class="by">— Par </span><span class="gradient-text italic name">Mariell</span><span class="by">, pour vous.</span>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Local aliases — bridge legacy short tokens to canonical Mariell tokens. */
.lab-page,
.lab-page-bg {
  --bg: #000000;
  --fg1: #ffffff;
  --fg2: rgba(255, 255, 255, 0.9);
  --fg3: rgba(255, 255, 255, 0.65);
  --fg4: rgba(255, 255, 255, 0.45);
  --fg5: rgba(255, 255, 255, 0.4);
  --cyan: #5ee7e7;
  --magenta: #e85eff;
  --border: rgba(255, 255, 255, 0.08);
  --border-hi: rgba(255, 255, 255, 0.18);
  --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
}

/* Italic gradient text — give the trailing italic glyph room so the
   `background-clip: text` slope isn't chopped on the right edge. */
.lab-page :deep(.gradient-text) {
  display: inline-block;
  padding-right: 0.15em;
}

/* ============ Page-specific opaque background — masks the global GradientBlobs. ============ */
.lab-page-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(40% 40% at 18% 12%, rgba(139, 92, 246, 0.18), transparent 70%),
    radial-gradient(40% 40% at 88% 78%, rgba(94, 231, 231, 0.12), transparent 70%),
    #000;
}

/* ============ Page shell ============ */
.lab-page {
  position: relative;
  padding-top: 80px;
  padding-bottom: 96px;
}

.lab-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  z-index: 1;
}
.lab-container--narrow {
  max-width: 820px;
}

/* ============ SUB-NAV ============ */
.lab-subnav {
  position: sticky;
  top: 80px;
  z-index: 30;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.lab-subnav__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  gap: 16px;
}
.lab-subnav__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg5);
  text-decoration: none;
  transition: color 0.2s ease-out;
}
.lab-subnav__back:hover { color: var(--cyan); }
.lab-subnav__crumb {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--fg5);
  text-transform: uppercase;
}
.lab-subnav__crumb a {
  color: var(--fg5);
  text-decoration: none;
  transition: color 0.2s ease-out;
}
.lab-subnav__crumb a:hover { color: var(--cyan); }
.lab-subnav__sep { margin: 0 12px; opacity: 0.4; }

/* ============ HEADER ============ */
.lab-header {
  padding: 112px 0 88px;
  border-bottom: 1px solid var(--border);
}

.lab-cartouche {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 8px 14px;
  border: 1px solid var(--border-hi);
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--cyan);
  text-transform: uppercase;
  margin-bottom: 36px;
}
.lab-cartouche__dot {
  width: 6px; height: 6px;
  border-radius: 999px;
  background: var(--cyan);
  box-shadow: 0 0 10px var(--cyan);
}
.lab-cartouche__sep {
  width: 18px; height: 1px;
  background: var(--border-hi);
}
.lab-cartouche__num { color: var(--fg2); }

.lab-h1 {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-size: clamp(44px, 7.2vw, 96px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  margin: 0;
  color: var(--fg1);
  max-width: 900px;
}

.lab-sub {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  color: var(--fg3);
  font-size: clamp(20px, 2.2vw, 26px);
  line-height: 1.4;
  max-width: 640px;
  margin: 28px 0 0;
}

.lab-meta {
  display: flex;
  gap: 40px;
  margin-top: 56px;
  flex-wrap: wrap;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--fg4);
  text-transform: uppercase;
}
.lab-meta strong {
  color: var(--fg1);
  font-weight: 500;
  margin-left: 8px;
  font-family: var(--font-mono);
}

/* ============ AVANT-PROPOS ============ */
.lab-foreword { padding: 88px 0 64px; }
.lab-foreword__lbl {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--cyan);
  text-transform: uppercase;
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.lab-foreword__lbl::before {
  content: "";
  width: 32px;
  height: 1px;
  background: var(--cyan);
}

.lab-foreword__quote {
  position: relative;
  margin: 0;
  padding: 36px 0 36px 40px;
  border-left: 1px solid var(--border-hi);
}
.lab-foreword__quote::before {
  content: "";
  position: absolute;
  left: -1px;
  top: 0;
  width: 1px;
  height: 96px;
  background: linear-gradient(180deg, var(--cyan), transparent);
  box-shadow: 0 0 14px rgba(94, 231, 240, 0.35);
}
.lab-foreword__quote p {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(19px, 2.05vw, 23px);
  line-height: 1.5;
  color: var(--fg2);
  margin: 0 0 22px;
  max-width: 720px;
  letter-spacing: -0.005em;
}
.lab-foreword__quote p:last-child { margin-bottom: 0; }

/* ============ 10 ESSENTIELS ============ */
.lab-essentiels { padding: 56px 0 0; }

.essentiel {
  position: relative;
  padding: 80px 0 72px;
  border-top: 1px solid var(--border);
}
.essentiel--first {
  border-top: 0;
  padding-top: 56px;
}

.essentiel__row {
  display: grid;
  grid-template-columns: 132px 1fr;
  gap: 32px;
  align-items: start;
}

.essentiel__num {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(72px, 9vw, 120px);
  line-height: 0.85;
  letter-spacing: -0.04em;
  color: var(--fg1);
  opacity: 0.92;
  padding-top: 6px;
  user-select: none;
}
.essentiel__num sup {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  line-height: 1;
  color: var(--cyan);
  font-style: normal;
  font-weight: 400;
  opacity: 0.9;
  margin-top: 22px;
}

.essentiel__body { padding-top: 8px; }

.essentiel__title {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-size: clamp(28px, 3.4vw, 40px);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--fg1);
  margin: 0 0 24px;
  max-width: 760px;
}
.essentiel__concept {
  padding-right: 0.18em;
}
.essentiel:nth-child(9) .essentiel__concept {
  white-space: nowrap;
}
.essentiel__colon {
  color: var(--fg4);
  margin: 0 0.15em 0 0.05em;
  font-style: normal;
}
.essentiel__punch {
  color: var(--fg1);
}

.essentiel__p {
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 17px;
  line-height: 1.7;
  color: var(--fg3);
  margin: 0;
  max-width: 720px;
  text-wrap: pretty;
}
.essentiel__p :deep(strong) { color: var(--fg1); font-weight: 500; }
.essentiel__p :deep(em) { font-style: italic; color: var(--fg2); }

/* ============ ANECDOTE ============ */
.anecdote {
  margin-top: 36px;
  max-width: 720px;
  position: relative;
  background: linear-gradient(180deg,
                rgba(255, 255, 255, 0.022),
                rgba(255, 255, 255, 0.008));
  border: 1px solid var(--border);
  border-left: 2px solid var(--magenta);
  border-radius: 0 14px 14px 0;
  padding: 24px 28px 26px 30px;
}
.anecdote__label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.01em;
  color: var(--magenta);
  margin-bottom: 12px;
}
.anecdote__label::before {
  content: "";
  width: 22px;
  height: 1px;
  background: var(--magenta);
  opacity: 0.7;
}
.anecdote__label .name {
  color: var(--magenta);
  font-style: italic;
}
.anecdote__label .dot {
  color: var(--magenta);
  opacity: 0.6;
  margin-left: -2px;
}
.anecdote p {
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 15px;
  line-height: 1.7;
  color: var(--fg3);
  margin: 0;
  text-wrap: pretty;
}
.anecdote p :deep(strong) { color: var(--fg2); font-weight: 500; }

/* ============ SIGNATURE ============ */
.lab-signature {
  margin-top: 96px;
  padding: 96px 0 24px;
  border-top: 1px solid var(--border);
  position: relative;
}
.lab-signature::before {
  content: "";
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--cyan), var(--magenta), transparent);
  opacity: 0.8;
}

.lab-signature__lbl {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--fg4);
  text-transform: uppercase;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: center;
}
.lab-signature__lbl::before,
.lab-signature__lbl::after {
  content: "";
  width: 32px;
  height: 1px;
  background: var(--border-hi);
}

.lab-signature__quote {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(20px, 2.3vw, 26px);
  line-height: 1.55;
  color: var(--fg2);
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  letter-spacing: -0.005em;
  text-wrap: balance;
}

.lab-signature__sig {
  margin-top: 64px;
  text-align: center;
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-size: clamp(22px, 2.5vw, 30px);
  line-height: 1.3;
  letter-spacing: -0.01em;
}
.lab-signature__sig .by { color: var(--fg2); }

/* ============ Responsive ============ */
@media (max-width: 768px) {
  .lab-container { padding: 0 22px; }

  .lab-header { padding: 80px 0 64px; }
  .lab-meta { gap: 14px 28px; margin-top: 40px; }

  .lab-foreword { padding: 64px 0 48px; }
  .lab-foreword__quote { padding: 24px 0 24px 24px; }

  .essentiel { padding: 56px 0 48px; }
  .essentiel__row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .essentiel__num {
    flex-direction: row;
    align-items: baseline;
    gap: 12px;
    font-size: 64px;
    line-height: 0.9;
    padding-top: 0;
    margin-bottom: 4px;
  }
  .essentiel__num sup {
    margin-top: 0;
    align-self: flex-start;
    transform: translateY(8px);
  }
  .essentiel__title { font-size: 24px; }
  .essentiel__p { font-size: 16px; }

  .anecdote { padding: 20px 22px 22px 24px; margin-top: 28px; }

  .lab-signature { margin-top: 72px; padding: 72px 0 16px; }
  .lab-signature__lbl::before,
  .lab-signature__lbl::after { width: 18px; }
  .lab-signature__sig { margin-top: 48px; }
}
@media (max-width: 520px) {
  .lab-subnav__crumb { display: none; }
}
</style>
