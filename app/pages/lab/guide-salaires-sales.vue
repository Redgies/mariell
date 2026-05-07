<script setup lang="ts">
useScrollReveal()

useHead({
  title: 'Guide des salaires Sales — Édition 2026 · Le Lab Mariell',
  meta: [
    {
      name: 'description',
      content:
        'La grille à jour, par poste, par séniorité, par contexte. 12 fiches de poste, 5 lectures du marché Sales 2026.',
    },
  ],
})

interface Rate {
  lvl: string
  small?: string
  fix: string
  variable: string
  ote: string
  equity?: string
}

interface Fiche {
  id: string
  index: string
  indexLabel: string
  title: string
  subtitle?: string
  mission: string
  ratesFirstHeader: string
  ratesIncludeEquity?: boolean
  rates: Rate[]
  terrain: string[]
  piege: string
}

const recap = [
  { id: 'sdr',                idx: '01', label: 'SDR / BDR',                       fix: '32-42k',   variable: '10-20k' },
  { id: 'bdr-full-cycle',     idx: '02', label: 'Business Developer Full Cycle',   fix: '35-50k',   variable: '22-38k' },
  { id: 'ae-pme',             idx: '03', label: 'AE PME / SMB',                    fix: '45-58k',   variable: '22-40k' },
  { id: 'ae-mid-market',      idx: '04', label: 'AE Mid-Market',                   fix: '55-72k',   variable: '42-65k' },
  { id: 'ae-enterprise',      idx: '05', label: 'AE Enterprise',                   fix: '80-110k',  variable: '65-115k' },
  { id: 'account-manager',    idx: '06', label: 'Account Manager',                 fix: '48-62k',   variable: '18-32k' },
  { id: 'csm',                idx: '07', label: 'Customer Success Manager',        fix: '42-58k',   variable: '6-14k' },
  { id: 'sales-ops',          idx: '08', label: 'Sales Ops / RevOps',              fix: '55-78k',   variable: '7-15k' },
  { id: 'channel-manager',    idx: '09', label: 'Channel / Partner Manager',       fix: '55-78k',   variable: '22-40k' },
  { id: 'sales-manager',      idx: '10', label: 'Sales Manager / Lead',            fix: '70-100k',  variable: '30-55k' },
  { id: 'head-of-sales',      idx: '11', label: 'Head of Sales',                   fix: '110-170k', variable: '65-130k' },
  { id: 'vp-sales',           idx: '12', label: 'VP Sales / CRO',                  fix: '160-220k', variable: '100-200k' },
]

const fiches: Fiche[] = [
  {
    id: 'sdr',
    index: '01',
    indexLabel: 'SDR / BDR',
    title: 'SDR / BDR',
    subtitle: 'Sales Development Representative',
    mission: "Générer et qualifier les opportunités pour alimenter les commerciaux closers.",
    ratesFirstHeader: 'Séniorité',
    rates: [
      { lvl: 'Junior',   small: '0-1 an',    fix: '30-36k', variable: '8-15k',  ote: '38-51k' },
      { lvl: 'Confirmé', small: '1-2 ans',   fix: '32-40k', variable: '10-20k', ote: '42-60k' },
      { lvl: 'Senior',   small: '2-3+ ans',  fix: '36-45k', variable: '15-25k', ote: '51-70k' },
    ],
    terrain: [
      "Le ratio <strong>70% fixe / 30% variable</strong> est le standard sain pour un poste SDR. Certains produits, et secteurs d'activité, permettent des répartitions avec moins de fixe et plus de variable — cela se justifie toujours par un Product Market Fit établi et probant.",
      "Sur Paris, ajouter <strong>+15 à +20%</strong> sur les fourchettes ci-dessus (les juniors absorbent l'écart Paris/régions le plus durement).",
      "Les top SDR juniors (taux de conversion >25%) négocient leur salaire à <strong>+10-15%</strong> sur le haut de fourchette.",
      "L'inflation est notable : ces fourchettes ont pris <strong>+8 à +12% depuis 2024</strong>.",
    ],
    piege: "Le métier de SDR est l'un des plus rigoureux et demandeurs sur le plan maîtrise émotionnelle et énergétique. L'enthousiasme ne vaut pas la résilience chez un profil. Il est très facile de performer avec un Product Market Fit hyper établi — à prendre en compte dans la mise en relief du track record.",
  },
  {
    id: 'bdr-full-cycle',
    index: '02',
    indexLabel: 'BUSINESS DEVELOPER FULL CYCLE',
    title: 'Business Developer Full Cycle',
    mission: "Commercial qui maîtrise l'intégralité du cycle de vente, de la prospection au closing. Profil hybride SDR + AE, fréquent dans les startups jeunes ou les boîtes de petite taille.",
    ratesFirstHeader: 'Séniorité',
    rates: [
      { lvl: 'Junior',   small: '1-2 ans', fix: '33-45k', variable: '15-25k', ote: '48-70k' },
      { lvl: 'Confirmé', small: '2-4 ans', fix: '35-45k', variable: '20-35k', ote: '55-80k' },
      { lvl: 'Senior',   small: '4+ ans',  fix: '40-55k', variable: '30-50k', ote: '70-105k' },
    ],
    terrain: [
      "Profil <strong>idéal pour les startups early-stage</strong> (Pré-seed à Série A) qui n'ont pas encore segmenté leur équipe Sales.",
      "Souvent issu d'une expérience SDR puis bascule progressive vers du closing — la maîtrise des deux extrémités du funnel est sa vraie valeur.",
      "Très fort taux d'évolution vers AE confirmé en 18-24 mois s'il rejoint une structure plus mature.",
      "À Paris, ajouter <strong>+12 à +15%</strong>.",
    ],
    piege: "Prendre un AE qui sort d'une licorne. Il n'aura pas le même Product Market Fit, ni l'aisance pour la première extrémité du cycle de vente. Un Business Developer Full Cycle confirmé a souvent un track record plus complet et plus polyvalent qu'un AE PME équivalent — il sait où sont les leviers parce qu'il les actionne tous.",
  },
  {
    id: 'ae-pme',
    index: '03',
    indexLabel: 'ACCOUNT EXECUTIVE — PME / SMB',
    title: 'Account Executive — PME / SMB',
    mission: 'Closing sur cycles courts, deals < 30k. Cible : TPE-PME.',
    ratesFirstHeader: 'Séniorité',
    rates: [
      { lvl: 'Junior',   small: '1-2 ans', fix: '38-48k', variable: '18-30k', ote: '56-78k' },
      { lvl: 'Confirmé', small: '2-4 ans', fix: '45-55k', variable: '22-45k', ote: '67-100k' },
      { lvl: 'Senior',   small: '4+ ans',  fix: '50-65k', variable: '38-60k', ote: '88-125k' },
    ],
    terrain: [
      "Sweet spot du marché actuellement : la majorité des recrutements Sales se font sur ce segment.",
      "Sur Paris, ajouter <strong>+12 à +15%</strong>.",
      "Les profils issus de boîtes \"écoles\" (Doctolib, Pennylane, Qonto, Spendesk, Aircall…) ont un floor <strong>+20% au-dessus</strong> des fourchettes standards.",
    ],
    piege: "Rechercher un AE avec trop d'expérience, sur des cycles de ventes plus importants. Sous-évaluer les profils dits Business Developer Full Cycle.",
  },
  {
    id: 'ae-mid-market',
    index: '04',
    indexLabel: 'ACCOUNT EXECUTIVE — MID-MARKET',
    title: 'Account Executive — Mid-Market',
    mission: 'Closing sur cycles moyens (3-9 mois), deals 30-150k. Cible : ETI / mid-market.',
    ratesFirstHeader: 'Séniorité',
    rates: [
      { lvl: 'Confirmé', small: '3-5 ans', fix: '50-65k', variable: '38-55k', ote: '88-120k' },
      { lvl: 'Senior',   small: '5-7 ans', fix: '60-80k', variable: '50-80k', ote: '110-160k' },
    ],
    terrain: [
      "Les données RepVue France 2026 indiquent un OTE médian <strong>AE all-segments à 142k</strong> : cela tire vers le haut grâce au mid-market et enterprise. Dans les faits c'est légèrement plus bas, mais cela dépend encore des profils ciblés et du secteur d'activité. Un Top performer dans le SaaS s'en approche.",
      "Le <strong>% d'atteinte du quota</strong> est plus bas qu'en SMB : cycles plus longs = plus de deals perdus en cours de route.",
      "Profil rare : un AE mid-market avec <strong>track record vérifié de 3 années consécutives à 100%+</strong> se négocie systématiquement +25% au-dessus de la fourchette haute.",
    ],
    piege: "Recruter un AE PME \"qui veut monter en gamme\". Le saut PME → mid-market exige des compétences en multi-stakeholders, RFP, gestion de procurement. Sans expérience préalable, le ramp-up dure 9-12 mois au lieu de 3.",
  },
  {
    id: 'ae-enterprise',
    index: '05',
    indexLabel: 'ACCOUNT EXECUTIVE — ENTERPRISE / LARGE ACCOUNTS',
    title: 'Account Executive — Enterprise / Large Accounts',
    mission: 'Closing sur cycles longs (6-18 mois), deals 150k+. Cible : grandes entreprises, comptes stratégiques.',
    ratesFirstHeader: 'Séniorité',
    rates: [
      { lvl: 'Senior',         small: '5-8 ans',  fix: '70-90k',   variable: '55-95k',    ote: '125-185k' },
      { lvl: 'Top performer',  small: '8+ ans',   fix: '80-110k',  variable: '80-150k',   ote: '160-260k' },
      { lvl: 'Star',           small: 'top 5%',   fix: '85-130k+', variable: '130-220k+', ote: '215-350k+' },
    ],
    terrain: [
      "Les top performers Enterprise SaaS (AWS, Salesforce, Snowflake, Datadog) atteignent et dépassent régulièrement <strong>300k OTE en France</strong>, avec accelerators jusqu'à 2x sur les meilleurs deals.",
      "Le <strong>stock equity</strong> sur les 5 plus grosses scale-ups françaises peut représenter 30-50% de la rémunération réelle au moment du vesting.",
      "<strong>Les chasseurs vrais sont rares</strong> : 70% des \"AE Enterprise\" sont en réalité des farmers déguisés. Vérifier le ratio new logo / expansion sur le CV est essentiel.",
    ],
    piege: "Chercher un AE Enterprise pour vendre un produit qui n'a pas la maturité enterprise (pas de sécurité, pas de SLA, pas de procurement adapté). Le candidat partira en 4 mois quand il comprendra qu'il ne peut pas closer ses comptes.",
  },
  {
    id: 'account-manager',
    index: '06',
    indexLabel: 'ACCOUNT MANAGER',
    title: 'Account Manager',
    subtitle: 'Sales sur clients existants',
    mission: 'Renouvellement, upsell, cross-sell sur portefeuille clients. Orienté revenu, pas seulement satisfaction.',
    ratesFirstHeader: 'Séniorité',
    rates: [
      { lvl: 'Junior',   small: '1-2 ans', fix: '38-48k', variable: '10-18k', ote: '48-66k' },
      { lvl: 'Confirmé', small: '3-5 ans', fix: '46-60k', variable: '15-30k', ote: '61-90k' },
      { lvl: 'Senior',   small: '5+ ans',  fix: '50-66k', variable: '20-35k', ote: '70-101k' },
    ],
    terrain: [
      "Étude Uptoo 2026 : packages dépassent <strong>65k bruts/an dans les univers SaaS, IT et cybersécurité</strong>, jusqu'à 75k+ pour les Senior AM en environnement complexe.",
      "Profils hybrides AE/AM (chasse + farming) : <strong>+10-15%</strong> sur les fourchettes standards.",
    ],
    piege: "Recruter un AM qui n'a jamais \"porté un quota\" sur de l'expansion. Sans mindset commercial, vous obtenez un Customer Success Manager 2.0, pas un Account Manager.",
  },
  {
    id: 'csm',
    index: '07',
    indexLabel: 'CUSTOMER SUCCESS MANAGER',
    title: 'Customer Success Manager',
    mission: 'Adoption, rétention, satisfaction client. Pas (ou peu) de quota direct sur revenu, mais impact sur le NPS et le churn.',
    ratesFirstHeader: 'Séniorité',
    rates: [
      { lvl: 'Junior',                     small: '1-2 ans', fix: '32-44k', variable: '3-8k',   ote: '35-52k' },
      { lvl: 'Confirmé',                   small: '3-5 ans', fix: '42-58k', variable: '6-14k',  ote: '48-72k' },
      { lvl: 'Senior / Enterprise CSM',    small: '5+ ans',  fix: '55-75k', variable: '10-22k', ote: '65-97k' },
    ],
    terrain: [
      "Sources croisées (Glassdoor, PayScale, Skalin, Kare School) : médiane Paris à <strong>51k fixe + 2-3k variable</strong> pour un CSM confirmé.",
      "Le variable est faible et plafonné (10-20% du package), basé sur NRR / GRR / NPS.",
      "Les <strong>Enterprise CSM</strong> sur comptes 100k+ ARR peuvent dépasser 70k fixe + variable significatif.",
      "Profil en forte croissance : LinkedIn affiche <strong>+736% de progression du métier</strong> sur la dernière décennie.",
    ],
    piege: "Confondre CSM et Support Manager. Un CSM pilote la <strong>valeur business du client</strong> (ROI, adoption stratégique), pas les tickets d'assistance.",
  },
  {
    id: 'sales-ops',
    index: '08',
    indexLabel: 'SALES OPS / REVENUE OPERATIONS',
    title: 'Sales Ops / Revenue Operations',
    mission: 'Pilotage CRM, analytics commerciale, design des plans de commissionnement, optimisation du process. Hybride entre Sales, Data et Ops.',
    ratesFirstHeader: 'Séniorité',
    rates: [
      { lvl: 'Junior',                  small: '1-3 ans', fix: '42-55k',  variable: '4-9k',   ote: '46-64k' },
      { lvl: 'Confirmé',                small: '3-5 ans', fix: '55-72k',  variable: '7-15k',  ote: '62-87k' },
      { lvl: 'Senior / Head of RevOps', small: '5+ ans',  fix: '75-110k', variable: '12-28k', ote: '87-138k' },
    ],
    terrain: [
      "<strong>Profil ultra-recherché en 2026</strong> : pénurie réelle. Les fourchettes hautes nécessitent maîtrise de Salesforce + outil analytics (Looker, Tableau) + outil séquençage (Outreach, Salesloft).",
      "Le variable est faible et déconnecté du chiffre direct : ce poste se négocie sur le fixe et l'equity.",
      "Les <strong>Head of RevOps en scale-up post-Série B</strong> atteignent 110-140k de package avec equity significative.",
    ],
    piege: "Confondre Sales Ops et \"Sales Admin\". Le Sales Ops moderne est stratégique : il challenge la commission policy, redessine le territoire, identifie les goulots du funnel. Pas un assistant.",
  },
  {
    id: 'channel-manager',
    index: '09',
    indexLabel: 'CHANNEL / PARTNER MANAGER',
    title: 'Channel / Partner Manager',
    mission: 'Développer les ventes via partenaires, intégrateurs, revendeurs. Critique en conseil IT, ESN, SaaS B2B vendu indirectement.',
    ratesFirstHeader: 'Séniorité',
    rates: [
      { lvl: 'Confirmé', small: '3-5 ans', fix: '50-68k', variable: '18-30k', ote: '68-98k' },
      { lvl: 'Senior',   small: '5+ ans',  fix: '65-92k', variable: '28-50k', ote: '93-142k' },
    ],
    terrain: [
      "Profil sous-coté en termes de visibilité mais <strong>stratégique</strong> dans les modèles partner-led.",
      "Maîtrise écosystème indispensable : MSP, hyperscalers (AWS, GCP, Azure), grandes ESN.",
      "Marché français <strong>moins mature qu'aux US/UK</strong> sur cette fonction → fourchettes plus modestes mais opportunités de structuration importantes en scale-up.",
    ],
    piege: "Recruter un AE classique pour faire du channel. Le channel exige une gestion de la relation longue, asynchrone, multi-stakeholders. Compétences distinctes du closing direct.",
  },
  {
    id: 'sales-manager',
    index: '10',
    indexLabel: 'SALES MANAGER / TEAM LEAD',
    title: 'Sales Manager / Team Lead',
    mission: "Management opérationnel d'une équipe Sales (3-10 personnes). Coaching, hiring, pilotage performance, parfois quota d'équipe.",
    ratesFirstHeader: 'Type de poste',
    rates: [
      { lvl: 'Lead / Manager SDR',                                   fix: '52-70k',  variable: '18-30k', ote: '70-100k' },
      { lvl: 'Sales Manager AE PME', small: 'équipe 3-6',            fix: '68-88k',  variable: '28-50k', ote: '96-138k' },
      { lvl: 'Sales Manager Mid-Market',                             fix: '80-105k', variable: '35-60k', ote: '115-165k' },
      { lvl: 'Sales Manager Enterprise',                             fix: '95-125k', variable: '45-80k', ote: '140-205k' },
    ],
    terrain: [
      "Sur Paris : <strong>+12 à +15%</strong> sur ces fourchettes.",
      "Le <strong>manager player</strong> (qui garde un quota individuel + manage) gagne 10-15% de plus, mais sous-performe statistiquement sur les deux dimensions au-delà de 6 personnes managées.",
      "Légitimité non négociable : un Sales Manager doit avoir géré au minimum <strong>3 cycles de vente complets</strong> en tant qu'IC avant de passer manager.",
    ],
    piege: "Promouvoir le top AE de l'équipe en Sales Manager. Sales et management sont des métiers différents. Vous perdez votre meilleur closer ET vous gagnez un mauvais manager.",
  },
  {
    id: 'head-of-sales',
    index: '11',
    indexLabel: 'HEAD OF SALES',
    title: 'Head of Sales',
    mission: 'Direction commerciale opérationnelle. Stratégie commerciale, structuration équipe, atteinte des objectifs globaux. Membre du CODIR.',
    ratesFirstHeader: 'Contexte entreprise',
    ratesIncludeEquity: true,
    rates: [
      { lvl: 'Startup',  small: '< 20 personnes',         fix: '80-115k',  variable: '35-65k',  ote: '115-180k', equity: '0,5 à 2%' },
      { lvl: 'Scale-up', small: '20-100 personnes',       fix: '100-145k', variable: '55-95k',  ote: '155-240k', equity: '0,2 à 1%' },
      { lvl: 'Scale-up', small: '100-500 personnes',      fix: '130-185k', variable: '75-140k', ote: '205-325k', equity: '0,05 à 0,3%' },
      { lvl: 'ETI',      small: '500+ personnes',         fix: '155-225k', variable: '85-160k', ote: '240-385k', equity: 'actions de performance' },
    ],
    terrain: [
      "Données Glassdoor 2026 : médiane Head of Sales France à <strong>100k fixe</strong>, avec packages dépassant 200k+ pour les profils scale-up confirmés.",
      "Distinction critique du marché : les <strong>\"builder\"</strong> (qui construisent une équipe from scratch) vs les <strong>\"scaler\"</strong> (qui font passer 5 à 30) — deux profils, deux packages, deux fits.",
      "Sur Paris : majoration <strong>+5 à +10%</strong> seulement (l'écart Paris/régions s'efface en haut de pyramide).",
      "L'equity reste la variable la plus volatile : 1% dans une boîte qui ne re-lèvera plus = 0€. Cadrer le cash en priorité dans les négociations.",
    ],
    piege: "Afficher un Head of Sales qui est en réalité un Sales Manager avec un titre gonflé. Vrai Head of Sales = pilotage stratégique, design d'org, hiring de Sales Managers, reporting CODIR. Si la mission est juste \"manager 5 AE\", c'est un Sales Manager — et le marché le saura.",
  },
  {
    id: 'vp-sales',
    index: '12',
    indexLabel: 'VP SALES / CHIEF REVENUE OFFICER (CRO)',
    title: 'VP Sales / Chief Revenue Officer (CRO)',
    mission: 'Top niveau commercial. Le VP Sales est focalisé Sales pure, le CRO étend à Sales + CS + Marketing parfois. Surtout en scale-up et grandes entreprises.',
    ratesFirstHeader: 'Contexte entreprise',
    ratesIncludeEquity: true,
    rates: [
      { lvl: 'Scale-up',                small: '50-200 personnes',    fix: '130-185k',  variable: '90-160k',   ote: '220-345k', equity: '0,3 à 1,5%' },
      { lvl: 'Scale-up',                small: '200-1000 personnes',  fix: '170-235k',  variable: '110-220k',  ote: '280-455k', equity: '0,1 à 0,5%' },
      { lvl: 'Grande entreprise / Licorne',                           fix: '200-310k+', variable: '160-330k+', ote: '360-640k+', equity: 'RSU, perf.' },
    ],
    terrain: [
      "Données Glassdoor 2026 : médiane VP Sales France à <strong>207k OTE</strong>, avec top 10% à <strong>379k+</strong> et fourchette médiane Paris 200-272k.",
      "À ce niveau, <strong>75% du package se joue lors de l'entretien stratégique</strong> : la vision commerciale chiffrée du candidat compte plus que le track record passé.",
      "Track record de levée significatif (avoir scalé une équipe pendant Série B/C) → floor <strong>+30-40%</strong> vs un VP \"classique\".",
      "Les VP Sales qui changent tous les 18 mois sont systématiquement discountés par le marché : la stabilité prime à ce niveau.",
    ],
    piege: "Recruter un VP Sales \"ex-grand groupe\" pour structurer une scale-up de 50 personnes. Les méthodes ne se transposent pas. Vous brûlez 200k pour découvrir en 6 mois que la culture ne match pas.",
  },
]
</script>

<template>
  <!-- Opaque background layer that masks the global GradientBlobs for this page only. -->
  <div class="lab-page-bg" aria-hidden="true" />

  <main class="lab-page">
    <!-- ============ SUB-NAV (breadcrumb under the global navbar) ============ -->
    <div class="lab-subnav">
      <div class="lab-container lab-subnav__row">
        <NuxtLink to="/lab" class="lab-subnav__back">
          <span aria-hidden="true">←</span>
          Retour au Lab
        </NuxtLink>
        <div class="lab-subnav__crumb">
          <NuxtLink to="/lab">LE LAB</NuxtLink>
          <span class="lab-subnav__sep">/</span>
          GUIDE SALAIRES SALES 2026
        </div>
      </div>
    </div>

    <!-- ============ HEADER ============ -->
    <header id="top" class="lab-header">
      <div class="lab-container">
        <div class="reveal lab-cartouche">
          <span class="lab-cartouche__dot" />
          LE LAB MARIELL
          <span class="lab-cartouche__sep" />
          <span class="lab-cartouche__num">GUIDES PRATIQUES</span>
        </div>
        <h1 class="reveal lab-h1">
          Guide des<br />
          salaires Sales <span class="gradient-text italic">— Édition 2026.</span>
        </h1>
        <div class="reveal lab-edition-row">
          <p class="lab-sub-line">La grille à jour, par poste, par séniorité, par contexte.</p>
        </div>
        <div class="reveal lab-meta">
          <div>ÉDITION <strong>2026</strong></div>
          <div>POSTES <strong>12</strong></div>
          <div>LECTURES <strong>5</strong></div>
          <div>MISE À JOUR <strong>ANNUELLE</strong></div>
          <div>ACCÈS <strong>LIBRE</strong></div>
        </div>
      </div>
    </header>

    <!-- ============ AVANT-PROPOS ============ -->
    <section class="lab-intro">
      <div class="lab-container">
        <div class="reveal lab-intro__lbl">AVANT-PROPOS</div>
        <blockquote class="reveal">
          <p class="lab-intro__lead">Recruter un Sales sans connaître son prix de marché, c'est négocier les yeux bandés.</p>
          <p>Ce guide rassemble les fourchettes salariales que nous croisons quotidiennement dans nos missions de recrutement, complétées par les principales études salariales publiques 2026 (RepVue, Glassdoor, Data Recrutement, Licorne Society, Uptoo, Qobra, et plusieurs cabinets spécialisés).</p>
          <p>C'est une grille de référence opérationnelle pour calibrer vos offres avec justesse.</p>
        </blockquote>
      </div>
    </section>

    <!-- ============ TABLEAU RÉCAP ============ -->
    <section id="tableau-recap" class="lab-recap">
      <div class="lab-container">
        <div class="reveal lab-section-eyebrow">TABLEAU RÉCAP VISUEL</div>
        <h2 class="reveal lab-section-title">
          Le marché Sales,<br />
          <span class="gradient-text italic">en un seul tableau.</span>
        </h2>
        <p class="reveal lab-section-lead">
          <em>Tout le marché Sales en un seul tableau. Cliquez sur un poste pour accéder directement à sa fiche.</em>
        </p>

        <div class="reveal lab-table-wrap">
          <table class="lab-table">
            <thead>
              <tr>
                <th />
                <th>Poste</th>
                <th class="num-col">Fixe médian France</th>
                <th class="num-col">Variable cible médian France</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in recap" :key="row.id" @click="(e) => { (e.currentTarget as HTMLElement).querySelector('a')?.click() }">
                <td class="lab-table__index">{{ row.idx }}</td>
                <td class="lab-table__poste"><a :href="`#${row.id}`">{{ row.label }}</a></td>
                <td class="num">{{ row.fix }}</td>
                <td class="num num--var">{{ row.variable }}</td>
                <td class="lab-table__arrow">→</td>
              </tr>
            </tbody>
          </table>
          <div class="lab-table-foot"><em>Toutes les fourchettes en € brut annuel. Variable cible = à 100% d'atteinte des objectifs.</em></div>
        </div>
      </div>
    </section>

    <!-- ============ COMMENT LIRE CE GUIDE ============ -->
    <section class="lab-howto">
      <div class="lab-container">
        <div class="reveal lab-howto__panel">
          <h3 class="lab-howto__title">Comment lire ce guide</h3>
          <p class="lab-howto__intro">3 codes à connaître pour tout interpréter correctement :</p>

          <div class="lab-howto__grid">
            <div class="lab-howto__item">
              <div class="lab-howto__glyph">
                <span class="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                </span>
                VARIABLE (OTE)
              </div>
              <h4>Variable (OTE)</h4>
              <p>Commission ou bonus à 100% d'atteinte des objectifs. Sur le terrain, l'atteinte moyenne tourne autour de 70-85% selon les postes — un OTE annoncé n'est pas un OTE garanti.</p>
            </div>

            <div class="lab-howto__item">
              <div class="lab-howto__glyph">
                <span class="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 7h11l3 3v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
                    <path d="M9 13h6M9 17h4" />
                  </svg>
                </span>
                SPÉCIALITÉS
              </div>
              <h4>Spécialités</h4>
              <p>Certains secteurs d'activité sont soumis à un certain nombre de codes qui sont détaillés ensuite. Certaines spécificités profil peuvent entraîner une inflation des chiffres, ce sont des cas exceptionnels (polyglotte, multi-fonctions, ouvertures...).</p>
            </div>

            <div class="lab-howto__item">
              <div class="lab-howto__glyph">
                <span class="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12Z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </span>
                PARIS VS RÉGIONS
              </div>
              <h4>Paris vs régions : l'écart varie selon la séniorité.</h4>
              <ul>
                <li>Postes juniors → +15 à 20% sur Paris (impact fort du coût de la vie)</li>
                <li>Postes confirmés → +10 à 15% sur Paris</li>
                <li>Postes seniors (Head, VP) → +5 à 10% sur Paris</li>
              </ul>
            </div>
          </div>

          <div class="lab-howto__note">
            <strong>Hors stock-options et BSPCE</strong> : les fourchettes affichées n'incluent pas l'equity. À ajouter mentalement pour les postes en scale-up.
          </div>
        </div>
      </div>
    </section>

    <!-- ============ FICHES POSTE ============ -->
    <article v-for="fiche in fiches" :id="fiche.id" :key="fiche.id" class="fiche">
      <div class="lab-container">
        <div class="fiche__index">{{ fiche.index }} <span>·</span> {{ fiche.indexLabel }}</div>
        <h2 class="fiche__title">{{ fiche.title }}</h2>
        <p v-if="fiche.subtitle" class="fiche__subtitle">{{ fiche.subtitle }}</p>

        <div class="fiche__mission">
          <span class="fiche__mission__lbl"><span class="target" /> MISSION</span>
          <p>{{ fiche.mission }}</p>
        </div>

        <div class="fiche__rates">
          <div class="fiche__rates__head">
            <span class="fiche__rates__lbl">
              <span class="glyph">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
                  <line x1="4" y1="20" x2="4" y2="10" />
                  <line x1="11" y1="20" x2="11" y2="6" />
                  <line x1="18" y1="20" x2="18" y2="14" />
                </svg>
              </span>
              FOURCHETTES SALARIALES
            </span>
            <span class="fiche__rates__loc">FRANCE ENTIÈRE</span>
          </div>
          <table class="rates-table">
            <thead>
              <tr>
                <th>{{ fiche.ratesFirstHeader }}</th>
                <th>Fixe</th>
                <th>Variable cible</th>
                <th>OTE</th>
                <th v-if="fiche.ratesIncludeEquity">Equity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rate, idx) in fiche.rates" :key="idx">
                <td class="lvl">
                  <strong>{{ rate.lvl }}</strong>
                  <small v-if="rate.small">{{ rate.small }}</small>
                </td>
                <td class="fix">{{ rate.fix }}</td>
                <td class="var">{{ rate.variable }}</td>
                <td class="ote">{{ rate.ote }}</td>
                <td v-if="fiche.ratesIncludeEquity" class="equity">{{ rate.equity }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <aside class="fiche__terrain">
          <div class="fiche__terrain__lbl">
            <span class="glyph">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.5" y2="16.5" />
              </svg>
            </span>
            VUE TERRAIN DE MARIELL
          </div>
          <ul>
            <li v-for="(line, idx) in fiche.terrain" :key="idx" v-html="line" />
          </ul>
        </aside>

        <aside class="fiche__piege">
          <div class="fiche__piege__lbl">
            <span class="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3 L22 20 L2 20 Z" />
                <line x1="12" y1="10" x2="12" y2="14" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            LE PIÈGE CLASSIQUE
          </div>
          <p v-html="fiche.piege" />
        </aside>

        <div class="fiche__back">
          <a href="#tableau-recap"><span class="up">↑</span> Retour au tableau</a>
        </div>
      </div>
    </article>

    <!-- ============ INTRO LECTURES ============ -->
    <section class="lab-lectures-intro">
      <div class="lab-container">
        <div class="reveal lab-section-eyebrow">5 LECTURES DU MARCHÉ SALES 2026</div>
        <h2 class="reveal lab-section-title">
          Au-delà des fourchettes,<br />
          <span class="gradient-text italic">les dynamiques qui structurent.</span>
        </h2>
        <p class="reveal lab-lectures-intro__sub">
          <em>Au-delà des fourchettes, voici les 5 dynamiques qui structurent le marché actuellement.</em>
        </p>
      </div>
    </section>

    <!-- ============ LECTURE 1 ============ -->
    <section class="lecture">
      <div class="lab-container lab-container--narrow">
        <div class="lecture__num"><strong>LECTURE 01</strong></div>
        <h3>L'inflation salariale est <span class="gradient-text italic">encore là.</span></h3>
        <p>Sur les 24 derniers mois, <strong>+8 à +15%</strong> sur l'ensemble des fourchettes Sales. Trois moteurs :</p>
        <ul>
          <li>Pénurie persistante de profils SaaS expérimentés</li>
          <li>Inflation cumulée 2022-2025 (~14%)</li>
          <li>Concurrence croissante des entreprises US qui recrutent en France à distance</li>
        </ul>
        <div class="lecture__callout"><strong>Conséquence opérationnelle</strong> : les grilles d'il y a 18 mois sont obsolètes. Les fourchettes affichées dans ce guide sont les prix réels du marché actuel.</div>
      </div>
    </section>

    <!-- ============ LECTURE 2 ============ -->
    <section class="lecture">
      <div class="lab-container lab-container--narrow">
        <div class="lecture__num"><strong>LECTURE 02</strong></div>
        <h3>Trois mondes parallèles <span class="gradient-text italic">cohabitent.</span></h3>

        <div class="world-card">
          <p class="world-card__title"><em>MONDE 1</em>Tech / SaaS B2B</p>
          <p>Modèle américanisé, fourchettes hautes, variable significatif, equity courante. Référence des grilles ci-dessus.</p>
        </div>
        <div class="world-card">
          <p class="world-card__title"><em>MONDE 2</em>Conseil IT / ESN / Ingénierie</p>
          <p>Modèle plus traditionnel, <strong>OTE 5-15% en-dessous du SaaS</strong>, mais plus de stabilité, package "voiture/téléphone" encore présent, equity rare.</p>
        </div>
        <div class="world-card">
          <p class="world-card__title"><em>MONDE 3</em>Industrie / B2B classique</p>
          <p><strong>Fixe plus élevé proportionnellement</strong>, variable plus modéré, cycles longs, voiture de fonction et avantages traditionnels (CSE, intéressement) compensent partiellement.</p>
        </div>

        <div class="lecture__callout"><strong>Conseil pratique</strong> : ajuster votre lecture des fourchettes selon le monde concerné. Un AE Enterprise dans l'industrie touchera moins de variable mais plus de fixe qu'un AE SaaS équivalent.</div>
      </div>
    </section>

    <!-- ============ LECTURE 3 ============ -->
    <section class="lecture">
      <div class="lab-container lab-container--narrow">
        <div class="lecture__num"><strong>LECTURE 03</strong></div>
        <h3>L'écart Paris / régions <span class="gradient-text italic">se réduit avec la séniorité.</span></h3>

        <div class="lecture__table-wrap">
          <table class="lecture-table">
            <thead><tr><th>Niveau</th><th style="text-align:right">Majoration Paris vs régions</th></tr></thead>
            <tbody>
              <tr><td>Junior (SDR, AE Junior)</td><td class="num">+15 à +20%</td></tr>
              <tr><td>Confirmé (AE, AM, CSM)</td><td class="num">+10 à +15%</td></tr>
              <tr><td>Manager / Lead</td><td class="num">+8 à +12%</td></tr>
              <tr><td>Head / Director</td><td class="num">+5 à +10%</td></tr>
              <tr><td>VP / CRO</td><td class="num">+0 à +5%</td></tr>
            </tbody>
          </table>
        </div>

        <p><strong>Pourquoi ?</strong> Le coût de la vie pèse proportionnellement plus sur les petits salaires. Et plus on monte, plus le télétravail et la mobilité internationale rebattent les cartes.</p>
        <p><strong>Lyon, Bordeaux, Nantes, Lille</strong> : entre Paris -5% et Paris -15% selon la tension locale.<br />
          <strong>Autres régions</strong> : Paris -15 à -25%.</p>
      </div>
    </section>

    <!-- ============ LECTURE 4 ============ -->
    <section class="lecture">
      <div class="lab-container lab-container--narrow">
        <div class="lecture__num"><strong>LECTURE 04</strong></div>
        <h3>Le piège des annonces : <span class="gradient-text italic">OTE théorique vs réel.</span></h3>
        <p>Les fourchettes affichées dans les offres d'emploi sont <strong>rarement</strong> ce qui est réellement négocié et touché :</p>
        <ul>
          <li>Les <strong>fourchettes basses</strong> sont souvent réelles</li>
          <li>Les <strong>fourchettes hautes</strong> sont aspirationnelles, réservées aux top profils en concurrence</li>
          <li>Le <strong>variable affiché</strong> correspond à un OTE théorique rarement atteint en moyenne</li>
        </ul>
        <div class="lecture__callout"><strong>Pour les recruteurs et dirigeants</strong> : afficher un OTE qui ne correspond pas à la réalité de l'atteinte moyenne dans votre équipe crée un effet retour de bâton dévastateur. Les candidats s'informent (RepVue, Glassdoor, ex-collègues). Une promesse d'OTE non tenue = un Sales qui part en 6-9 mois et qui le dit autour de lui. Mieux vaut afficher un OTE crédible avec des accelerators ambitieux qu'un OTE fictif qui crame votre marque employeur.</div>
      </div>
    </section>

    <!-- ============ LECTURE 5 ============ -->
    <section class="lecture">
      <div class="lab-container lab-container--narrow">
        <div class="lecture__num"><strong>LECTURE 05</strong></div>
        <h3>L'effet <span class="gradient-text italic">"boîtes intouchables".</span></h3>
        <p>Certaines entreprises constituent des <strong>viviers premium</strong> sur le marché Sales français. Les profils qui en sortent négocient automatiquement +15 à +25% sur les fourchettes de leur grade.</p>

        <dl class="vivier-list">
          <dt>SaaS B2B</dt>
          <dd>Doctolib, Qonto, Pennylane, Aircall, Spendesk, Alma, Payfit, Datadog, Algolia, Mirakl</dd>
          <dt>Cyber / Sécurité</dt>
          <dd>Wallix, Snowflake, CrowdStrike (FR)</dd>
          <dt>Tech US implantés en France</dt>
          <dd>Salesforce, AWS, Google, HubSpot, Snowflake</dd>
        </dl>

        <p>Ces signatures sur le CV agissent comme un signal de qualité quasi-immédiat. À calibrer dans votre stratégie de sourcing : <strong>viser ces viviers exige d'aligner votre offre sur leur niveau de marché</strong>.</p>
      </div>
    </section>

    <!-- ============ MÉTHODOLOGIE & SOURCES ============ -->
    <section class="lab-methodo">
      <div class="lab-container lab-container--narrow">
        <div class="reveal lab-section-eyebrow">MÉTHODOLOGIE &amp; SOURCES</div>
        <h2 class="reveal">
          Comment ce guide <span class="gradient-text italic">a été construit.</span>
        </h2>
        <p>Les fourchettes proviennent de quatre couches d'informations croisées :</p>

        <ol>
          <li><strong>Données internes Mariell</strong> : observations terrain sur nos missions de recrutement Sales en cours et passées.</li>
          <li><strong>Études salariales publiques 2026</strong> : Hays Salary Guide, Michael Page Salary Survey, Robert Walters Salary Survey, RepVue France, Glassdoor France, Data Recrutement, Licorne Society, Uptoo Baromètre Sales, Qobra Plans de Commission, Welcome to the Jungle, Skipcall, Skalin.</li>
          <li><strong>Conversations marché continues</strong> : retours candidats sur leurs offres réelles, retours clients sur leurs pratiques de rémunération.</li>
          <li><strong>Veille spécialisée</strong> : posts LinkedIn de référence, communautés Sales (Modjo, Notion VC, Pavilion FR), études sectorielles éditeurs (DigiRocks, Numeum).</li>
        </ol>

        <h4>Limites assumées de ce guide :</h4>
        <ul>
          <li>Reflète notre lecture du marché 2026</li>
          <li>Variations possibles selon profil exact, contexte précis, négociation</li>
          <li>Hors stock-options, BSPCE, et avantages annexes (CSE, voiture, télétravail, etc.)</li>
        </ul>

        <h4>Mise à jour : annuelle.</h4>
        <p class="lab-methodo__note">Prochaine édition : 2027.</p>
      </div>
    </section>

    <!-- ============ SIGN-OFF ============ -->
    <section class="lab-signoff">
      <div class="lab-container lab-container--narrow">
        <blockquote>
          <p><em>Ce guide est mis à jour chaque année, à partir des données que nous croisons quotidiennement sur le terrain : missions de recrutement, conversations candidats, retours clients, observations marché.</em></p>
          <p><em>Il ne remplace pas une analyse personnalisée de votre contexte spécifique, mais il vous donne le cadre pour calibrer vos offres avec justesse.</em></p>
        </blockquote>
        <span class="lab-signoff__edition">Édition 2026 — Prochaine mise à jour : 2027</span>
        <p class="lab-signoff__signature">— Par Mariell, <span class="gradient-text italic">pour vous.</span></p>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ============ Page-specific opaque background — masks the global GradientBlobs. ============ */
.lab-page-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(ellipse 700px 500px at 100% 0%, rgba(232, 94, 255, 0.10), transparent 60%),
    radial-gradient(ellipse 600px 500px at 0% 30%, rgba(94, 231, 231, 0.06), transparent 60%),
    radial-gradient(ellipse 700px 500px at 100% 70%, rgba(255, 0, 255, 0.04), transparent 60%),
    #000;
}

/* ============ Page shell ============ */
.lab-page {
  position: relative;
  padding-top: 80px;
}

/* Italic gradient text — give the trailing italic glyph room so the
   `background-clip: text` slope isn't chopped on the right edge. */
.lab-page :deep(.gradient-text) {
  display: inline-block;
  padding-right: 0.15em;
}

.lab-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  z-index: 1;
}
.lab-container--narrow { max-width: 820px; }

/* ============ SUB-NAV — sticky breadcrumb under the global navbar ============ */
.lab-subnav {
  position: sticky;
  top: 80px;
  z-index: 30;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.10);
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
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: color 0.2s ease-out;
}
.lab-subnav__back:hover { color: #5ee7e7; }
.lab-subnav__crumb {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
}
.lab-subnav__crumb a {
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: color 0.2s ease-out;
}
.lab-subnav__crumb a:hover { color: #5ee7e7; }
.lab-subnav__sep { margin: 0 12px; opacity: 0.4; }

/* ============ HEADER ============ */
.lab-header {
  padding: 96px 0 80px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  scroll-margin-top: 140px;
}

.lab-cartouche {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 8px 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #5ee7e7;
  text-transform: uppercase;
  margin-bottom: 36px;
}
.lab-cartouche__dot {
  width: 6px; height: 6px;
  border-radius: 999px;
  background: #5ee7e7;
  box-shadow: 0 0 12px #5ee7e7;
}
.lab-cartouche__sep {
  width: 18px;
  height: 1px;
  background: rgba(255, 255, 255, 0.18);
}
.lab-cartouche__num { color: rgba(255, 255, 255, 0.9); }

.lab-h1 {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-size: clamp(48px, 7.5vw, 104px);
  line-height: 1.02;
  letter-spacing: -0.035em;
  margin: 0;
  color: #fff;
  max-width: 980px;
}

.lab-edition-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 22px;
}
.lab-sub-line {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  font-size: 22px;
  line-height: 1.4;
  max-width: 720px;
  margin: 0;
}

.lab-meta {
  display: flex;
  gap: 40px;
  margin-top: 56px;
  flex-wrap: wrap;
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
}
.lab-meta strong {
  color: #fff;
  font-weight: 500;
  margin-left: 8px;
}

/* ============ AVANT-PROPOS ============ */
.lab-intro { padding: 72px 0 24px; }
.lab-intro__lbl {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #5ee7e7;
  text-transform: uppercase;
  margin-bottom: 22px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.lab-intro__lbl::before {
  content: "";
  display: inline-block;
  width: 36px;
  height: 1px;
  background: #5ee7e7;
}
.lab-intro blockquote { margin: 0; padding: 0; border: 0; }
.lab-intro__lead {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(22px, 2.4vw, 28px);
  line-height: 1.4;
  color: #fff;
  max-width: 820px;
  margin: 0 0 28px;
}
.lab-intro p {
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 17px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
  max-width: 760px;
  margin: 0 0 16px;
}
.lab-intro p:last-child { margin-bottom: 0; }

/* ============ TABLEAU RÉCAP ============ */
.lab-recap {
  padding: 80px 0 88px;
  scroll-margin-top: 140px;
}
.lab-section-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.18em;
  color: #5ee7e7;
  text-transform: uppercase;
  margin-bottom: 18px;
}
.lab-section-eyebrow::before {
  content: "";
  width: 36px;
  height: 1px;
  background: #5ee7e7;
}

.lab-section-title {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-size: clamp(34px, 4.6vw, 56px);
  line-height: 1.05;
  letter-spacing: -0.035em;
  margin: 0 0 14px;
  color: #fff;
}
.lab-section-lead {
  font-family: var(--font-grotesk);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  max-width: 720px;
  margin: 0 0 32px;
  line-height: 1.6;
}
.lab-section-lead em {
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
}

.lab-table-wrap {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  background: rgba(14, 14, 18, 0.6);
}
.lab-table {
  width: 100%;
  border-collapse: collapse;
}
.lab-table thead th {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
  text-align: left;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.012);
}
.lab-table thead th.num-col { text-align: right; }
.lab-table tbody tr {
  cursor: pointer;
  transition: background 0.15s cubic-bezier(0.22, 1, 0.36, 1);
}
.lab-table tbody tr:hover { background: rgba(94, 231, 231, 0.06); }
.lab-table tbody tr:hover .lab-table__poste a { color: #5ee7e7; }
.lab-table tbody tr:hover .lab-table__arrow { color: #5ee7e7; }
.lab-table tbody tr:last-child td { border-bottom: 0; }
.lab-table tbody td {
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  vertical-align: middle;
}
.lab-table tbody td.num {
  text-align: right;
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  font-size: 19px;
  color: #fff;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
.lab-table tbody td.num--var {
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.lab-table__index {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  width: 36px;
}
.lab-table__poste a {
  color: #fff;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s ease-out;
}
.lab-table__arrow {
  width: 28px;
  text-align: right;
  color: rgba(255, 255, 255, 0.4);
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 14px;
  transition: color 0.15s ease-out;
}
.lab-table-foot {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.012);
}
.lab-table-foot em {
  font-style: italic;
  color: rgba(255, 255, 255, 0.65);
  text-transform: none;
  letter-spacing: 0;
  font-family: var(--font-grotesk);
}

/* ============ COMMENT LIRE ============ */
.lab-howto { padding: 24px 0 96px; }
.lab-howto__panel {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: 40px 44px;
  position: relative;
  overflow: hidden;
}
.lab-howto__panel::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 400px 200px at 100% 0%, rgba(232, 94, 255, 0.10), transparent 60%);
}
.lab-howto__title {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-size: 28px;
  margin: 0 0 6px;
  color: #fff;
  letter-spacing: -0.025em;
}
.lab-howto__intro {
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
  margin: 0 0 28px;
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  letter-spacing: 0.04em;
}
.lab-howto__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  position: relative;
}
.lab-howto__item {
  padding: 0;
  position: relative;
}
.lab-howto__item + .lab-howto__item::before {
  content: "";
  position: absolute;
  left: -14px;
  top: 4px;
  bottom: 4px;
  width: 1px;
  background: rgba(255, 255, 255, 0.08);
}
.lab-howto__glyph {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  color: #5ee7e7;
  text-transform: uppercase;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.lab-howto__glyph .ic {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5ee7e7;
}
.lab-howto__glyph .ic svg { width: 14px; height: 14px; }
.lab-howto__item h4 {
  color: #fff;
  font-size: 16px;
  margin: 8px 0;
  font-weight: 600;
  font-family: var(--font-grotesk);
}
.lab-howto__item p {
  font-family: var(--font-grotesk);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 8px;
}
.lab-howto__item ul {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.65);
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 14px;
  line-height: 1.6;
}
.lab-howto__item ul li {
  padding-left: 14px;
  position: relative;
}
.lab-howto__item ul li::before {
  content: "›";
  position: absolute;
  left: 0;
  color: #5ee7e7;
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
}
.lab-howto__note {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.65);
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 14px;
  line-height: 1.6;
  position: relative;
}
.lab-howto__note strong { color: #fff; font-weight: 500; }

/* ============ FICHE ============ */
.fiche {
  padding: 96px 0 56px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  scroll-margin-top: 140px;
  position: relative;
}
.fiche__index {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #5ee7e7;
  text-transform: uppercase;
  margin-bottom: 16px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.fiche__index::before {
  content: "";
  display: inline-block;
  width: 24px;
  height: 1px;
  background: #5ee7e7;
}
.fiche__index span {
  color: rgba(255, 255, 255, 0.4);
  margin: 0 4px;
}

.fiche__title {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-size: clamp(36px, 4.6vw, 56px);
  line-height: 1.08;
  letter-spacing: -0.035em;
  margin: 0 0 14px;
  color: #fff;
  max-width: 900px;
}

.fiche__subtitle {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
}

.fiche__mission {
  margin-top: 36px;
  padding: 22px 26px;
  border-radius: 12px;
  background: rgba(94, 231, 231, 0.04);
  border: 1px solid rgba(94, 231, 231, 0.14);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 22px;
  align-items: start;
}
.fiche__mission__lbl {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #5ee7e7;
  text-transform: uppercase;
  padding-top: 6px;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.fiche__mission__lbl .target {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 1.5px solid #5ee7e7;
  position: relative;
}
.fiche__mission__lbl .target::after {
  content: "";
  position: absolute;
  inset: 3px;
  border-radius: 999px;
  background: #5ee7e7;
}
.fiche__mission p {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(19px, 2vw, 22px);
  line-height: 1.4;
  color: #fff;
  margin: 0;
}

.fiche__rates { margin-top: 36px; }
.fiche__rates__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}
.fiche__rates__lbl {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #5ee7e7;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.fiche__rates__lbl .glyph { width: 14px; height: 14px; display: inline-flex; }
.fiche__rates__lbl .glyph svg { width: 14px; height: 14px; }
.fiche__rates__loc {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
}

.rates-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}
.rates-table thead th {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  font-weight: 500;
  text-align: left;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.014);
}
.rates-table tbody tr:last-child td { border-bottom: 0; }
.rates-table tbody td {
  padding: 16px 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  vertical-align: middle;
}
.rates-table .lvl {
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
}
.rates-table .lvl strong {
  color: #fff;
  font-weight: 600;
  display: block;
}
.rates-table .lvl small {
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.rates-table .fix,
.rates-table .var {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  font-size: 19px;
  color: #fff;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
.rates-table .ote {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  font-size: 21px;
  letter-spacing: -0.01em;
  white-space: nowrap;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.rates-table .equity {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 12px;
  color: #8b5cf6;
  letter-spacing: 0.04em;
}

/* Vue terrain — bordure cyan */
.fiche__terrain {
  margin-top: 36px;
  position: relative;
  background: linear-gradient(90deg, rgba(94, 231, 231, 0.05), rgba(94, 231, 231, 0.01) 70%, transparent);
  border: 1px solid rgba(94, 231, 231, 0.16);
  border-left: 3px solid #5ee7e7;
  padding: 28px 32px;
  border-radius: 0 12px 12px 0;
}
.fiche__terrain__lbl {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #5ee7e7;
  text-transform: uppercase;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.fiche__terrain__lbl .glyph { width: 14px; height: 14px; }
.fiche__terrain__lbl .glyph svg { width: 14px; height: 14px; stroke: #5ee7e7; }
.fiche__terrain__lbl::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(94, 231, 231, 0.18);
  max-width: 240px;
}
.fiche__terrain ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.fiche__terrain ul li {
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 15px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 12px;
  padding-left: 20px;
  position: relative;
  max-width: 820px;
}
.fiche__terrain ul li:last-child { margin-bottom: 0; }
.fiche__terrain ul li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 11px;
  width: 8px;
  height: 1px;
  background: #5ee7e7;
}
.fiche__terrain :deep(strong) { color: #fff; font-weight: 600; }

/* Piège — bordure magenta */
.fiche__piege {
  margin-top: 24px;
  position: relative;
  background: linear-gradient(90deg, rgba(232, 94, 255, 0.05), rgba(232, 94, 255, 0.01) 70%, transparent);
  border: 1px solid rgba(232, 94, 255, 0.18);
  border-left: 3px solid #e85eff;
  padding: 26px 32px;
  border-radius: 0 12px 12px 0;
}
.fiche__piege__lbl {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #e85eff;
  text-transform: uppercase;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.fiche__piege__lbl .alert {
  width: 16px;
  height: 16px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.fiche__piege__lbl .alert svg { width: 16px; height: 16px; stroke: #e85eff; }
.fiche__piege__lbl::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(232, 94, 255, 0.20);
  max-width: 240px;
}
.fiche__piege p {
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 15px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  max-width: 820px;
}
.fiche__piege :deep(strong) { color: #fff; font-weight: 600; }

/* Bouton retour au tableau */
.fiche__back {
  margin-top: 40px;
  display: flex;
  justify-content: flex-start;
}
.fiche__back a {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.9);
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.fiche__back a:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: #5ee7e7;
  color: #5ee7e7;
}
.fiche__back a span.up {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 13px;
}

/* ============ INTRO LECTURES ============ */
.lab-lectures-intro {
  padding: 120px 0 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.lab-lectures-intro__sub {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  font-size: 20px;
  line-height: 1.5;
  max-width: 720px;
  margin: 16px 0 0;
}

/* ============ LECTURE ============ */
.lecture {
  padding: 64px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
}
.lecture__num {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  font-size: 14px;
  color: #5ee7e7;
  letter-spacing: 0.04em;
  margin-bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.lecture__num::before {
  content: "";
  display: inline-block;
  width: 24px;
  height: 1px;
  background: #5ee7e7;
}
.lecture__num strong {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.lecture h3 {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-size: clamp(28px, 3.4vw, 42px);
  line-height: 1.1;
  letter-spacing: -0.035em;
  margin: 0 0 24px;
  color: #fff;
  max-width: 880px;
}
.lecture p {
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 17px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 14px;
  max-width: 820px;
}
.lecture p:last-child { margin-bottom: 0; }
.lecture p :deep(strong) { color: #fff; font-weight: 500; }
.lecture ul {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  max-width: 820px;
}
.lecture ul li {
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 16px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 10px;
  padding-left: 22px;
  position: relative;
}
.lecture ul li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 12px;
  width: 10px;
  height: 1px;
  background: #5ee7e7;
}
.lecture ul li :deep(strong) { color: #fff; font-weight: 500; }
.lecture__callout {
  margin: 24px 0 0;
  padding: 22px 28px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 3px solid #8b5cf6;
  border-radius: 0 12px 12px 0;
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 16px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
  max-width: 820px;
}
.lecture__callout :deep(strong) { color: #fff; font-weight: 500; }

.lecture__table-wrap {
  margin: 16px 0 24px;
  max-width: 720px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
}
.lecture-table {
  width: 100%;
  border-collapse: collapse;
}
.lecture-table th {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  font-weight: 500;
  text-align: left;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.014);
}
.lecture-table td {
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
}
.lecture-table tr:last-child td { border-bottom: 0; }
.lecture-table td.num {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  font-size: 18px;
  color: #fff;
  letter-spacing: -0.01em;
  text-align: right;
  white-space: nowrap;
}

/* World cards */
.world-card {
  padding: 22px 26px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  margin: 0 0 14px;
  max-width: 820px;
}
.world-card__title {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  font-size: 19px;
  color: #fff;
  margin: 0 0 8px;
}
.world-card__title em {
  font-style: normal;
  color: #5ee7e7;
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-right: 12px;
  vertical-align: middle;
}
.world-card p {
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.6;
  margin: 0;
}

/* Vivier list */
.vivier-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 16px 0;
}
.vivier-list dt {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: #5ee7e7;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.vivier-list dd {
  margin: 0 0 14px;
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

/* ============ MÉTHODOLOGIE ============ */
.lab-methodo {
  padding: 80px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.lab-methodo h2 {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-size: clamp(32px, 4.2vw, 48px);
  line-height: 1.05;
  letter-spacing: -0.035em;
  margin: 0 0 20px;
  color: #fff;
}
.lab-methodo h4 {
  font-family: var(--font-grotesk);
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  margin: 28px 0 12px;
  letter-spacing: 0.02em;
}
.lab-methodo p {
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 16px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 14px;
  max-width: 820px;
}
.lab-methodo p :deep(strong) { color: #fff; font-weight: 500; }
.lab-methodo__note { color: rgba(255, 255, 255, 0.4); font-size: 15px; }
.lab-methodo ol {
  list-style: none;
  counter-reset: m;
  padding: 0;
  margin: 16px 0;
  max-width: 820px;
}
.lab-methodo ol li {
  counter-increment: m;
  padding: 16px 20px 16px 56px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.02);
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}
.lab-methodo ol li::before {
  content: counter(m, decimal-leading-zero);
  position: absolute;
  left: 18px;
  top: 18px;
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #5ee7e7;
  border: 1px solid rgba(94, 231, 231, 0.3);
  border-radius: 6px;
  padding: 2px 6px;
}
.lab-methodo ol li :deep(strong) { color: #fff; font-weight: 500; }
.lab-methodo ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 820px;
}
.lab-methodo ul li {
  padding-left: 18px;
  position: relative;
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 15px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 8px;
}
.lab-methodo ul li::before {
  content: "›";
  position: absolute;
  left: 0;
  color: #5ee7e7;
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
}

/* ============ SIGN-OFF ============ */
.lab-signoff {
  padding: 96px 0 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: left;
}
.lab-signoff blockquote {
  margin: 0;
  padding: 0;
  border: 0;
  max-width: 820px;
}
.lab-signoff blockquote p {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-weight: 500;
  font-size: 19px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 14px;
}
.lab-signoff blockquote p:last-child { margin-bottom: 0; }
.lab-signoff__edition {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  margin-top: 28px;
  display: block;
}
.lab-signoff__signature {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-size: clamp(34px, 4.4vw, 56px);
  line-height: 1.1;
  letter-spacing: -0.035em;
  margin: 32px 0 0;
  color: #fff;
}

/* ============ Responsive ============ */
@media (max-width: 900px) {
  .lab-howto__grid { grid-template-columns: 1fr; gap: 24px; }
  .lab-howto__item + .lab-howto__item::before { display: none; }
  .lab-howto__panel { padding: 28px 22px; }
}
@media (max-width: 768px) {
  .lab-container { padding: 0 20px; }
  .lab-header { padding: 56px 0 48px; }
  .lab-meta { gap: 14px 28px; }
  .fiche { padding: 64px 0 48px; }
  .fiche__mission { grid-template-columns: 1fr; gap: 10px; padding: 18px 20px; }
  .fiche__terrain, .fiche__piege { padding: 22px 20px 22px 22px; }
  .lab-recap { padding: 56px 0; }
  .lab-table-wrap { overflow-x: auto; border-radius: 12px; }
  .lab-table { min-width: 640px; }
  .rates-table { display: block; overflow-x: auto; }
  .rates-table tbody, .rates-table thead { display: table; width: 100%; min-width: 540px; }
  .lecture { padding: 48px 0; }
  .lab-lectures-intro { padding: 80px 0 16px; }
  .fiche__rates__head { flex-direction: column; align-items: flex-start; gap: 6px; }
  .lab-subnav__crumb { font-size: 10px; }
  .lab-subnav__back { font-size: 10px; }
}
@media (max-width: 520px) {
  .lab-h1 { font-size: 44px; }
  .lab-section-title { font-size: 32px; }
  .fiche__title { font-size: 32px; }
  .lab-meta strong { display: block; margin-left: 0; }
  .lab-subnav__crumb { display: none; }
}
</style>
