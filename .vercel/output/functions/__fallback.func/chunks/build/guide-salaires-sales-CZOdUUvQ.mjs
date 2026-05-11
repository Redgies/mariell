import { _ as __nuxt_component_0 } from './server.mjs';
import { defineComponent, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { u as useHead } from './composables-f4CN5nyK.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "guide-salaires-sales",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Guide des salaires Sales — Édition 2026 · Le Lab Mariell",
      meta: [
        {
          name: "description",
          content: "La grille à jour, par poste, par séniorité, par contexte. 12 fiches de poste, 5 lectures du marché Sales 2026."
        }
      ]
    });
    const recap = [
      { id: "sdr", idx: "01", label: "SDR / BDR", fix: "32-42k", variable: "10-20k" },
      { id: "bdr-full-cycle", idx: "02", label: "Business Developer Full Cycle", fix: "35-50k", variable: "22-38k" },
      { id: "ae-pme", idx: "03", label: "AE PME / SMB", fix: "45-58k", variable: "22-40k" },
      { id: "ae-mid-market", idx: "04", label: "AE Mid-Market", fix: "55-72k", variable: "42-65k" },
      { id: "ae-enterprise", idx: "05", label: "AE Enterprise", fix: "80-110k", variable: "65-115k" },
      { id: "account-manager", idx: "06", label: "Account Manager", fix: "48-62k", variable: "18-32k" },
      { id: "csm", idx: "07", label: "Customer Success Manager", fix: "42-58k", variable: "6-14k" },
      { id: "sales-ops", idx: "08", label: "Sales Ops / RevOps", fix: "55-78k", variable: "7-15k" },
      { id: "channel-manager", idx: "09", label: "Channel / Partner Manager", fix: "55-78k", variable: "22-40k" },
      { id: "sales-manager", idx: "10", label: "Sales Manager / Lead", fix: "70-100k", variable: "30-55k" },
      { id: "head-of-sales", idx: "11", label: "Head of Sales", fix: "110-170k", variable: "65-130k" },
      { id: "vp-sales", idx: "12", label: "VP Sales / CRO", fix: "160-220k", variable: "100-200k" }
    ];
    const fiches = [
      {
        id: "sdr",
        index: "01",
        indexLabel: "SDR / BDR",
        title: "SDR / BDR",
        subtitle: "Sales Development Representative",
        mission: "Générer et qualifier les opportunités pour alimenter les commerciaux closers.",
        ratesFirstHeader: "Séniorité",
        rates: [
          { lvl: "Junior", small: "0-1 an", fix: "30-36k", variable: "8-15k", ote: "38-51k" },
          { lvl: "Confirmé", small: "1-2 ans", fix: "32-40k", variable: "10-20k", ote: "42-60k" },
          { lvl: "Senior", small: "2-3+ ans", fix: "36-45k", variable: "15-25k", ote: "51-70k" }
        ],
        terrain: [
          "Le ratio <strong>70% fixe / 30% variable</strong> est le standard sain pour un poste SDR. Certains produits, et secteurs d'activité, permettent des répartitions avec moins de fixe et plus de variable — cela se justifie toujours par un Product Market Fit établi et probant.",
          "Sur Paris, ajouter <strong>+15 à +20%</strong> sur les fourchettes ci-dessus (les juniors absorbent l'écart Paris/régions le plus durement).",
          "Les top SDR juniors (taux de conversion >25%) négocient leur salaire à <strong>+10-15%</strong> sur le haut de fourchette.",
          "L'inflation est notable : ces fourchettes ont pris <strong>+8 à +12% depuis 2024</strong>."
        ],
        piege: "Le métier de SDR est l'un des plus rigoureux et demandeurs sur le plan maîtrise émotionnelle et énergétique. L'enthousiasme ne vaut pas la résilience chez un profil. Il est très facile de performer avec un Product Market Fit hyper établi — à prendre en compte dans la mise en relief du track record."
      },
      {
        id: "bdr-full-cycle",
        index: "02",
        indexLabel: "BUSINESS DEVELOPER FULL CYCLE",
        title: "Business Developer Full Cycle",
        mission: "Commercial qui maîtrise l'intégralité du cycle de vente, de la prospection au closing. Profil hybride SDR + AE, fréquent dans les startups jeunes ou les boîtes de petite taille.",
        ratesFirstHeader: "Séniorité",
        rates: [
          { lvl: "Junior", small: "1-2 ans", fix: "33-45k", variable: "15-25k", ote: "48-70k" },
          { lvl: "Confirmé", small: "2-4 ans", fix: "35-45k", variable: "20-35k", ote: "55-80k" },
          { lvl: "Senior", small: "4+ ans", fix: "40-55k", variable: "30-50k", ote: "70-105k" }
        ],
        terrain: [
          "Profil <strong>idéal pour les startups early-stage</strong> (Pré-seed à Série A) qui n'ont pas encore segmenté leur équipe Sales.",
          "Souvent issu d'une expérience SDR puis bascule progressive vers du closing — la maîtrise des deux extrémités du funnel est sa vraie valeur.",
          "Très fort taux d'évolution vers AE confirmé en 18-24 mois s'il rejoint une structure plus mature.",
          "À Paris, ajouter <strong>+12 à +15%</strong>."
        ],
        piege: "Prendre un AE qui sort d'une licorne. Il n'aura pas le même Product Market Fit, ni l'aisance pour la première extrémité du cycle de vente. Un Business Developer Full Cycle confirmé a souvent un track record plus complet et plus polyvalent qu'un AE PME équivalent — il sait où sont les leviers parce qu'il les actionne tous."
      },
      {
        id: "ae-pme",
        index: "03",
        indexLabel: "ACCOUNT EXECUTIVE — PME / SMB",
        title: "Account Executive — PME / SMB",
        mission: "Closing sur cycles courts, deals < 30k. Cible : TPE-PME.",
        ratesFirstHeader: "Séniorité",
        rates: [
          { lvl: "Junior", small: "1-2 ans", fix: "38-48k", variable: "18-30k", ote: "56-78k" },
          { lvl: "Confirmé", small: "2-4 ans", fix: "45-55k", variable: "22-45k", ote: "67-100k" },
          { lvl: "Senior", small: "4+ ans", fix: "50-65k", variable: "38-60k", ote: "88-125k" }
        ],
        terrain: [
          "Sweet spot du marché actuellement : la majorité des recrutements Sales se font sur ce segment.",
          "Sur Paris, ajouter <strong>+12 à +15%</strong>.",
          'Les profils issus de boîtes "écoles" (Doctolib, Pennylane, Qonto, Spendesk, Aircall…) ont un floor <strong>+20% au-dessus</strong> des fourchettes standards.'
        ],
        piege: "Rechercher un AE avec trop d'expérience, sur des cycles de ventes plus importants. Sous-évaluer les profils dits Business Developer Full Cycle."
      },
      {
        id: "ae-mid-market",
        index: "04",
        indexLabel: "ACCOUNT EXECUTIVE — MID-MARKET",
        title: "Account Executive — Mid-Market",
        mission: "Closing sur cycles moyens (3-9 mois), deals 30-150k. Cible : ETI / mid-market.",
        ratesFirstHeader: "Séniorité",
        rates: [
          { lvl: "Confirmé", small: "3-5 ans", fix: "50-65k", variable: "38-55k", ote: "88-120k" },
          { lvl: "Senior", small: "5-7 ans", fix: "60-80k", variable: "50-80k", ote: "110-160k" }
        ],
        terrain: [
          "Les données RepVue France 2026 indiquent un OTE médian <strong>AE all-segments à 142k</strong> : cela tire vers le haut grâce au mid-market et enterprise. Dans les faits c'est légèrement plus bas, mais cela dépend encore des profils ciblés et du secteur d'activité. Un Top performer dans le SaaS s'en approche.",
          "Le <strong>% d'atteinte du quota</strong> est plus bas qu'en SMB : cycles plus longs = plus de deals perdus en cours de route.",
          "Profil rare : un AE mid-market avec <strong>track record vérifié de 3 années consécutives à 100%+</strong> se négocie systématiquement +25% au-dessus de la fourchette haute."
        ],
        piege: 'Recruter un AE PME "qui veut monter en gamme". Le saut PME → mid-market exige des compétences en multi-stakeholders, RFP, gestion de procurement. Sans expérience préalable, le ramp-up dure 9-12 mois au lieu de 3.'
      },
      {
        id: "ae-enterprise",
        index: "05",
        indexLabel: "ACCOUNT EXECUTIVE — ENTERPRISE / LARGE ACCOUNTS",
        title: "Account Executive — Enterprise / Large Accounts",
        mission: "Closing sur cycles longs (6-18 mois), deals 150k+. Cible : grandes entreprises, comptes stratégiques.",
        ratesFirstHeader: "Séniorité",
        rates: [
          { lvl: "Senior", small: "5-8 ans", fix: "70-90k", variable: "55-95k", ote: "125-185k" },
          { lvl: "Top performer", small: "8+ ans", fix: "80-110k", variable: "80-150k", ote: "160-260k" },
          { lvl: "Star", small: "top 5%", fix: "85-130k+", variable: "130-220k+", ote: "215-350k+" }
        ],
        terrain: [
          "Les top performers Enterprise SaaS (AWS, Salesforce, Snowflake, Datadog) atteignent et dépassent régulièrement <strong>300k OTE en France</strong>, avec accelerators jusqu'à 2x sur les meilleurs deals.",
          "Le <strong>stock equity</strong> sur les 5 plus grosses scale-ups françaises peut représenter 30-50% de la rémunération réelle au moment du vesting.",
          '<strong>Les chasseurs vrais sont rares</strong> : 70% des "AE Enterprise" sont en réalité des farmers déguisés. Vérifier le ratio new logo / expansion sur le CV est essentiel.'
        ],
        piege: "Chercher un AE Enterprise pour vendre un produit qui n'a pas la maturité enterprise (pas de sécurité, pas de SLA, pas de procurement adapté). Le candidat partira en 4 mois quand il comprendra qu'il ne peut pas closer ses comptes."
      },
      {
        id: "account-manager",
        index: "06",
        indexLabel: "ACCOUNT MANAGER",
        title: "Account Manager",
        subtitle: "Sales sur clients existants",
        mission: "Renouvellement, upsell, cross-sell sur portefeuille clients. Orienté revenu, pas seulement satisfaction.",
        ratesFirstHeader: "Séniorité",
        rates: [
          { lvl: "Junior", small: "1-2 ans", fix: "38-48k", variable: "10-18k", ote: "48-66k" },
          { lvl: "Confirmé", small: "3-5 ans", fix: "46-60k", variable: "15-30k", ote: "61-90k" },
          { lvl: "Senior", small: "5+ ans", fix: "50-66k", variable: "20-35k", ote: "70-101k" }
        ],
        terrain: [
          "Étude Uptoo 2026 : packages dépassent <strong>65k bruts/an dans les univers SaaS, IT et cybersécurité</strong>, jusqu'à 75k+ pour les Senior AM en environnement complexe.",
          "Profils hybrides AE/AM (chasse + farming) : <strong>+10-15%</strong> sur les fourchettes standards."
        ],
        piege: `Recruter un AM qui n'a jamais "porté un quota" sur de l'expansion. Sans mindset commercial, vous obtenez un Customer Success Manager 2.0, pas un Account Manager.`
      },
      {
        id: "csm",
        index: "07",
        indexLabel: "CUSTOMER SUCCESS MANAGER",
        title: "Customer Success Manager",
        mission: "Adoption, rétention, satisfaction client. Pas (ou peu) de quota direct sur revenu, mais impact sur le NPS et le churn.",
        ratesFirstHeader: "Séniorité",
        rates: [
          { lvl: "Junior", small: "1-2 ans", fix: "32-44k", variable: "3-8k", ote: "35-52k" },
          { lvl: "Confirmé", small: "3-5 ans", fix: "42-58k", variable: "6-14k", ote: "48-72k" },
          { lvl: "Senior / Enterprise CSM", small: "5+ ans", fix: "55-75k", variable: "10-22k", ote: "65-97k" }
        ],
        terrain: [
          "Sources croisées (Glassdoor, PayScale, Skalin, Kare School) : médiane Paris à <strong>51k fixe + 2-3k variable</strong> pour un CSM confirmé.",
          "Le variable est faible et plafonné (10-20% du package), basé sur NRR / GRR / NPS.",
          "Les <strong>Enterprise CSM</strong> sur comptes 100k+ ARR peuvent dépasser 70k fixe + variable significatif.",
          "Profil en forte croissance : LinkedIn affiche <strong>+736% de progression du métier</strong> sur la dernière décennie."
        ],
        piege: "Confondre CSM et Support Manager. Un CSM pilote la <strong>valeur business du client</strong> (ROI, adoption stratégique), pas les tickets d'assistance."
      },
      {
        id: "sales-ops",
        index: "08",
        indexLabel: "SALES OPS / REVENUE OPERATIONS",
        title: "Sales Ops / Revenue Operations",
        mission: "Pilotage CRM, analytics commerciale, design des plans de commissionnement, optimisation du process. Hybride entre Sales, Data et Ops.",
        ratesFirstHeader: "Séniorité",
        rates: [
          { lvl: "Junior", small: "1-3 ans", fix: "42-55k", variable: "4-9k", ote: "46-64k" },
          { lvl: "Confirmé", small: "3-5 ans", fix: "55-72k", variable: "7-15k", ote: "62-87k" },
          { lvl: "Senior / Head of RevOps", small: "5+ ans", fix: "75-110k", variable: "12-28k", ote: "87-138k" }
        ],
        terrain: [
          "<strong>Profil ultra-recherché en 2026</strong> : pénurie réelle. Les fourchettes hautes nécessitent maîtrise de Salesforce + outil analytics (Looker, Tableau) + outil séquençage (Outreach, Salesloft).",
          "Le variable est faible et déconnecté du chiffre direct : ce poste se négocie sur le fixe et l'equity.",
          "Les <strong>Head of RevOps en scale-up post-Série B</strong> atteignent 110-140k de package avec equity significative."
        ],
        piege: 'Confondre Sales Ops et "Sales Admin". Le Sales Ops moderne est stratégique : il challenge la commission policy, redessine le territoire, identifie les goulots du funnel. Pas un assistant.'
      },
      {
        id: "channel-manager",
        index: "09",
        indexLabel: "CHANNEL / PARTNER MANAGER",
        title: "Channel / Partner Manager",
        mission: "Développer les ventes via partenaires, intégrateurs, revendeurs. Critique en conseil IT, ESN, SaaS B2B vendu indirectement.",
        ratesFirstHeader: "Séniorité",
        rates: [
          { lvl: "Confirmé", small: "3-5 ans", fix: "50-68k", variable: "18-30k", ote: "68-98k" },
          { lvl: "Senior", small: "5+ ans", fix: "65-92k", variable: "28-50k", ote: "93-142k" }
        ],
        terrain: [
          "Profil sous-coté en termes de visibilité mais <strong>stratégique</strong> dans les modèles partner-led.",
          "Maîtrise écosystème indispensable : MSP, hyperscalers (AWS, GCP, Azure), grandes ESN.",
          "Marché français <strong>moins mature qu'aux US/UK</strong> sur cette fonction → fourchettes plus modestes mais opportunités de structuration importantes en scale-up."
        ],
        piege: "Recruter un AE classique pour faire du channel. Le channel exige une gestion de la relation longue, asynchrone, multi-stakeholders. Compétences distinctes du closing direct."
      },
      {
        id: "sales-manager",
        index: "10",
        indexLabel: "SALES MANAGER / TEAM LEAD",
        title: "Sales Manager / Team Lead",
        mission: "Management opérationnel d'une équipe Sales (3-10 personnes). Coaching, hiring, pilotage performance, parfois quota d'équipe.",
        ratesFirstHeader: "Type de poste",
        rates: [
          { lvl: "Lead / Manager SDR", fix: "52-70k", variable: "18-30k", ote: "70-100k" },
          { lvl: "Sales Manager AE PME", small: "équipe 3-6", fix: "68-88k", variable: "28-50k", ote: "96-138k" },
          { lvl: "Sales Manager Mid-Market", fix: "80-105k", variable: "35-60k", ote: "115-165k" },
          { lvl: "Sales Manager Enterprise", fix: "95-125k", variable: "45-80k", ote: "140-205k" }
        ],
        terrain: [
          "Sur Paris : <strong>+12 à +15%</strong> sur ces fourchettes.",
          "Le <strong>manager player</strong> (qui garde un quota individuel + manage) gagne 10-15% de plus, mais sous-performe statistiquement sur les deux dimensions au-delà de 6 personnes managées.",
          "Légitimité non négociable : un Sales Manager doit avoir géré au minimum <strong>3 cycles de vente complets</strong> en tant qu'IC avant de passer manager."
        ],
        piege: "Promouvoir le top AE de l'équipe en Sales Manager. Sales et management sont des métiers différents. Vous perdez votre meilleur closer ET vous gagnez un mauvais manager."
      },
      {
        id: "head-of-sales",
        index: "11",
        indexLabel: "HEAD OF SALES",
        title: "Head of Sales",
        mission: "Direction commerciale opérationnelle. Stratégie commerciale, structuration équipe, atteinte des objectifs globaux. Membre du CODIR.",
        ratesFirstHeader: "Contexte entreprise",
        ratesIncludeEquity: true,
        rates: [
          { lvl: "Startup", small: "< 20 personnes", fix: "80-115k", variable: "35-65k", ote: "115-180k", equity: "0,5 à 2%" },
          { lvl: "Scale-up", small: "20-100 personnes", fix: "100-145k", variable: "55-95k", ote: "155-240k", equity: "0,2 à 1%" },
          { lvl: "Scale-up", small: "100-500 personnes", fix: "130-185k", variable: "75-140k", ote: "205-325k", equity: "0,05 à 0,3%" },
          { lvl: "ETI", small: "500+ personnes", fix: "155-225k", variable: "85-160k", ote: "240-385k", equity: "actions de performance" }
        ],
        terrain: [
          "Données Glassdoor 2026 : médiane Head of Sales France à <strong>100k fixe</strong>, avec packages dépassant 200k+ pour les profils scale-up confirmés.",
          'Distinction critique du marché : les <strong>"builder"</strong> (qui construisent une équipe from scratch) vs les <strong>"scaler"</strong> (qui font passer 5 à 30) — deux profils, deux packages, deux fits.',
          "Sur Paris : majoration <strong>+5 à +10%</strong> seulement (l'écart Paris/régions s'efface en haut de pyramide).",
          "L'equity reste la variable la plus volatile : 1% dans une boîte qui ne re-lèvera plus = 0€. Cadrer le cash en priorité dans les négociations."
        ],
        piege: `Afficher un Head of Sales qui est en réalité un Sales Manager avec un titre gonflé. Vrai Head of Sales = pilotage stratégique, design d'org, hiring de Sales Managers, reporting CODIR. Si la mission est juste "manager 5 AE", c'est un Sales Manager — et le marché le saura.`
      },
      {
        id: "vp-sales",
        index: "12",
        indexLabel: "VP SALES / CHIEF REVENUE OFFICER (CRO)",
        title: "VP Sales / Chief Revenue Officer (CRO)",
        mission: "Top niveau commercial. Le VP Sales est focalisé Sales pure, le CRO étend à Sales + CS + Marketing parfois. Surtout en scale-up et grandes entreprises.",
        ratesFirstHeader: "Contexte entreprise",
        ratesIncludeEquity: true,
        rates: [
          { lvl: "Scale-up", small: "50-200 personnes", fix: "130-185k", variable: "90-160k", ote: "220-345k", equity: "0,3 à 1,5%" },
          { lvl: "Scale-up", small: "200-1000 personnes", fix: "170-235k", variable: "110-220k", ote: "280-455k", equity: "0,1 à 0,5%" },
          { lvl: "Grande entreprise / Licorne", fix: "200-310k+", variable: "160-330k+", ote: "360-640k+", equity: "RSU, perf." }
        ],
        terrain: [
          "Données Glassdoor 2026 : médiane VP Sales France à <strong>207k OTE</strong>, avec top 10% à <strong>379k+</strong> et fourchette médiane Paris 200-272k.",
          "À ce niveau, <strong>75% du package se joue lors de l'entretien stratégique</strong> : la vision commerciale chiffrée du candidat compte plus que le track record passé.",
          'Track record de levée significatif (avoir scalé une équipe pendant Série B/C) → floor <strong>+30-40%</strong> vs un VP "classique".',
          "Les VP Sales qui changent tous les 18 mois sont systématiquement discountés par le marché : la stabilité prime à ce niveau."
        ],
        piege: 'Recruter un VP Sales "ex-grand groupe" pour structurer une scale-up de 50 personnes. Les méthodes ne se transposent pas. Vous brûlez 200k pour découvrir en 6 mois que la culture ne match pas.'
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><div class="lab-page-bg" aria-hidden="true" data-v-64d87e01></div><main class="lab-page" data-v-64d87e01><div class="lab-subnav" data-v-64d87e01><div class="lab-container lab-subnav__row" data-v-64d87e01>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/lab",
        class: "lab-subnav__back"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span aria-hidden="true" data-v-64d87e01${_scopeId}>←</span> Retour au Lab `);
          } else {
            return [
              createVNode("span", { "aria-hidden": "true" }, "←"),
              createTextVNode(" Retour au Lab ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="lab-subnav__crumb" data-v-64d87e01>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/lab" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`LE LAB`);
          } else {
            return [
              createTextVNode("LE LAB")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="lab-subnav__sep" data-v-64d87e01>/</span> GUIDE SALAIRES SALES 2026 </div></div></div><header id="top" class="lab-header" data-v-64d87e01><div class="lab-container" data-v-64d87e01><div class="reveal lab-cartouche" data-v-64d87e01><span class="lab-cartouche__dot" data-v-64d87e01></span> LE LAB MARIELL <span class="lab-cartouche__sep" data-v-64d87e01></span><span class="lab-cartouche__num" data-v-64d87e01>GUIDES PRATIQUES</span></div><h1 class="reveal lab-h1" data-v-64d87e01> Guide des<br data-v-64d87e01> salaires Sales <span class="gradient-text italic" data-v-64d87e01>— Édition 2026.</span></h1><div class="reveal lab-edition-row" data-v-64d87e01><p class="lab-sub-line" data-v-64d87e01>La grille à jour, par poste, par séniorité, par contexte.</p></div><div class="reveal lab-meta" data-v-64d87e01><div data-v-64d87e01>ÉDITION <strong data-v-64d87e01>2026</strong></div><div data-v-64d87e01>POSTES <strong data-v-64d87e01>12</strong></div><div data-v-64d87e01>LECTURES <strong data-v-64d87e01>5</strong></div><div data-v-64d87e01>MISE À JOUR <strong data-v-64d87e01>ANNUELLE</strong></div><div data-v-64d87e01>ACCÈS <strong data-v-64d87e01>LIBRE</strong></div></div></div></header><section class="lab-intro" data-v-64d87e01><div class="lab-container" data-v-64d87e01><div class="reveal lab-intro__lbl" data-v-64d87e01>AVANT-PROPOS</div><blockquote class="reveal" data-v-64d87e01><p class="lab-intro__lead" data-v-64d87e01>Recruter un Sales sans connaître son prix de marché, c&#39;est négocier les yeux bandés.</p><p data-v-64d87e01>Ce guide rassemble les fourchettes salariales que nous croisons quotidiennement dans nos missions de recrutement, complétées par les principales études salariales publiques 2026 (RepVue, Glassdoor, Data Recrutement, Licorne Society, Uptoo, Qobra, et plusieurs cabinets spécialisés).</p><p data-v-64d87e01>C&#39;est une grille de référence opérationnelle pour calibrer vos offres avec justesse.</p></blockquote></div></section><section id="tableau-recap" class="lab-recap" data-v-64d87e01><div class="lab-container" data-v-64d87e01><div class="reveal lab-section-eyebrow" data-v-64d87e01>TABLEAU RÉCAP VISUEL</div><h2 class="reveal lab-section-title" data-v-64d87e01> Le marché Sales,<br data-v-64d87e01><span class="gradient-text italic" data-v-64d87e01>en un seul tableau.</span></h2><p class="reveal lab-section-lead" data-v-64d87e01><em data-v-64d87e01>Tout le marché Sales en un seul tableau. Cliquez sur un poste pour accéder directement à sa fiche.</em></p><div class="reveal lab-table-wrap" data-v-64d87e01><table class="lab-table" data-v-64d87e01><thead data-v-64d87e01><tr data-v-64d87e01><th data-v-64d87e01></th><th data-v-64d87e01>Poste</th><th class="num-col" data-v-64d87e01>Fixe médian France</th><th class="num-col" data-v-64d87e01>Variable cible médian France</th><th data-v-64d87e01></th></tr></thead><tbody data-v-64d87e01><!--[-->`);
      ssrRenderList(recap, (row) => {
        _push(`<tr data-v-64d87e01><td class="lab-table__index" data-v-64d87e01>${ssrInterpolate(row.idx)}</td><td class="lab-table__poste" data-v-64d87e01><a${ssrRenderAttr("href", `#${row.id}`)} data-v-64d87e01>${ssrInterpolate(row.label)}</a></td><td class="num" data-v-64d87e01>${ssrInterpolate(row.fix)}</td><td class="num num--var" data-v-64d87e01>${ssrInterpolate(row.variable)}</td><td class="lab-table__arrow" data-v-64d87e01>→</td></tr>`);
      });
      _push(`<!--]--></tbody></table><div class="lab-table-foot" data-v-64d87e01><em data-v-64d87e01>Toutes les fourchettes en € brut annuel. Variable cible = à 100% d&#39;atteinte des objectifs.</em></div></div></div></section><section class="lab-howto" data-v-64d87e01><div class="lab-container" data-v-64d87e01><div class="reveal lab-howto__panel" data-v-64d87e01><h3 class="lab-howto__title" data-v-64d87e01>Comment lire ce guide</h3><p class="lab-howto__intro" data-v-64d87e01>3 codes à connaître pour tout interpréter correctement :</p><div class="lab-howto__grid" data-v-64d87e01><div class="lab-howto__item" data-v-64d87e01><div class="lab-howto__glyph" data-v-64d87e01><span class="ic" data-v-64d87e01><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" data-v-64d87e01><circle cx="12" cy="12" r="9" data-v-64d87e01></circle><circle cx="12" cy="12" r="5" data-v-64d87e01></circle><circle cx="12" cy="12" r="1.5" fill="currentColor" data-v-64d87e01></circle></svg></span> VARIABLE (OTE) </div><h4 data-v-64d87e01>Variable (OTE)</h4><p data-v-64d87e01>Commission ou bonus à 100% d&#39;atteinte des objectifs. Sur le terrain, l&#39;atteinte moyenne tourne autour de 70-85% selon les postes — un OTE annoncé n&#39;est pas un OTE garanti.</p></div><div class="lab-howto__item" data-v-64d87e01><div class="lab-howto__glyph" data-v-64d87e01><span class="ic" data-v-64d87e01><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-v-64d87e01><path d="M5 7h11l3 3v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" data-v-64d87e01></path><path d="M9 13h6M9 17h4" data-v-64d87e01></path></svg></span> SPÉCIALITÉS </div><h4 data-v-64d87e01>Spécialités</h4><p data-v-64d87e01>Certains secteurs d&#39;activité sont soumis à un certain nombre de codes qui sont détaillés ensuite. Certaines spécificités profil peuvent entraîner une inflation des chiffres, ce sont des cas exceptionnels (polyglotte, multi-fonctions, ouvertures...).</p></div><div class="lab-howto__item" data-v-64d87e01><div class="lab-howto__glyph" data-v-64d87e01><span class="ic" data-v-64d87e01><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-v-64d87e01><path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12Z" data-v-64d87e01></path><circle cx="12" cy="9" r="2.5" data-v-64d87e01></circle></svg></span> PARIS VS RÉGIONS </div><h4 data-v-64d87e01>Paris vs régions : l&#39;écart varie selon la séniorité.</h4><ul data-v-64d87e01><li data-v-64d87e01>Postes juniors → +15 à 20% sur Paris (impact fort du coût de la vie)</li><li data-v-64d87e01>Postes confirmés → +10 à 15% sur Paris</li><li data-v-64d87e01>Postes seniors (Head, VP) → +5 à 10% sur Paris</li></ul></div></div><div class="lab-howto__note" data-v-64d87e01><strong data-v-64d87e01>Hors stock-options et BSPCE</strong> : les fourchettes affichées n&#39;incluent pas l&#39;equity. À ajouter mentalement pour les postes en scale-up. </div></div></div></section><!--[-->`);
      ssrRenderList(fiches, (fiche) => {
        _push(`<article${ssrRenderAttr("id", fiche.id)} class="fiche" data-v-64d87e01><div class="lab-container" data-v-64d87e01><div class="fiche__index" data-v-64d87e01>${ssrInterpolate(fiche.index)} <span data-v-64d87e01>·</span> ${ssrInterpolate(fiche.indexLabel)}</div><h2 class="fiche__title" data-v-64d87e01>${ssrInterpolate(fiche.title)}</h2>`);
        if (fiche.subtitle) {
          _push(`<p class="fiche__subtitle" data-v-64d87e01>${ssrInterpolate(fiche.subtitle)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="fiche__mission" data-v-64d87e01><span class="fiche__mission__lbl" data-v-64d87e01><span class="target" data-v-64d87e01></span> MISSION</span><p data-v-64d87e01>${ssrInterpolate(fiche.mission)}</p></div><div class="fiche__rates" data-v-64d87e01><div class="fiche__rates__head" data-v-64d87e01><span class="fiche__rates__lbl" data-v-64d87e01><span class="glyph" data-v-64d87e01><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" data-v-64d87e01><line x1="4" y1="20" x2="4" y2="10" data-v-64d87e01></line><line x1="11" y1="20" x2="11" y2="6" data-v-64d87e01></line><line x1="18" y1="20" x2="18" y2="14" data-v-64d87e01></line></svg></span> FOURCHETTES SALARIALES </span><span class="fiche__rates__loc" data-v-64d87e01>FRANCE ENTIÈRE</span></div><table class="rates-table" data-v-64d87e01><thead data-v-64d87e01><tr data-v-64d87e01><th data-v-64d87e01>${ssrInterpolate(fiche.ratesFirstHeader)}</th><th data-v-64d87e01>Fixe</th><th data-v-64d87e01>Variable cible</th><th data-v-64d87e01>OTE</th>`);
        if (fiche.ratesIncludeEquity) {
          _push(`<th data-v-64d87e01>Equity</th>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tr></thead><tbody data-v-64d87e01><!--[-->`);
        ssrRenderList(fiche.rates, (rate, idx) => {
          _push(`<tr data-v-64d87e01><td class="lvl" data-v-64d87e01><strong data-v-64d87e01>${ssrInterpolate(rate.lvl)}</strong>`);
          if (rate.small) {
            _push(`<small data-v-64d87e01>${ssrInterpolate(rate.small)}</small>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="fix" data-v-64d87e01>${ssrInterpolate(rate.fix)}</td><td class="var" data-v-64d87e01>${ssrInterpolate(rate.variable)}</td><td class="ote" data-v-64d87e01>${ssrInterpolate(rate.ote)}</td>`);
          if (fiche.ratesIncludeEquity) {
            _push(`<td class="equity" data-v-64d87e01>${ssrInterpolate(rate.equity)}</td>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</tr>`);
        });
        _push(`<!--]--></tbody></table></div><aside class="fiche__terrain" data-v-64d87e01><div class="fiche__terrain__lbl" data-v-64d87e01><span class="glyph" data-v-64d87e01><svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-v-64d87e01><circle cx="11" cy="11" r="7" data-v-64d87e01></circle><line x1="21" y1="21" x2="16.5" y2="16.5" data-v-64d87e01></line></svg></span> VUE TERRAIN DE MARIELL </div><ul data-v-64d87e01><!--[-->`);
        ssrRenderList(fiche.terrain, (line, idx) => {
          _push(`<li data-v-64d87e01>${line ?? ""}</li>`);
        });
        _push(`<!--]--></ul></aside><aside class="fiche__piege" data-v-64d87e01><div class="fiche__piege__lbl" data-v-64d87e01><span class="alert" data-v-64d87e01><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-64d87e01><path d="M12 3 L22 20 L2 20 Z" data-v-64d87e01></path><line x1="12" y1="10" x2="12" y2="14" data-v-64d87e01></line><line x1="12" y1="17" x2="12.01" y2="17" data-v-64d87e01></line></svg></span> LE PIÈGE CLASSIQUE </div><p data-v-64d87e01>${fiche.piege ?? ""}</p></aside><div class="fiche__back" data-v-64d87e01><a href="#tableau-recap" data-v-64d87e01><span class="up" data-v-64d87e01>↑</span> Retour au tableau</a></div></div></article>`);
      });
      _push(`<!--]--><section class="lab-lectures-intro" data-v-64d87e01><div class="lab-container" data-v-64d87e01><div class="reveal lab-section-eyebrow" data-v-64d87e01>5 LECTURES DU MARCHÉ SALES 2026</div><h2 class="reveal lab-section-title" data-v-64d87e01> Au-delà des fourchettes,<br data-v-64d87e01><span class="gradient-text italic" data-v-64d87e01>les dynamiques qui structurent.</span></h2><p class="reveal lab-lectures-intro__sub" data-v-64d87e01><em data-v-64d87e01>Au-delà des fourchettes, voici les 5 dynamiques qui structurent le marché actuellement.</em></p></div></section><section class="lecture" data-v-64d87e01><div class="lab-container lab-container--narrow" data-v-64d87e01><div class="lecture__num" data-v-64d87e01><strong data-v-64d87e01>LECTURE 01</strong></div><h3 data-v-64d87e01>L&#39;inflation salariale est <span class="gradient-text italic" data-v-64d87e01>encore là.</span></h3><p data-v-64d87e01>Sur les 24 derniers mois, <strong data-v-64d87e01>+8 à +15%</strong> sur l&#39;ensemble des fourchettes Sales. Trois moteurs :</p><ul data-v-64d87e01><li data-v-64d87e01>Pénurie persistante de profils SaaS expérimentés</li><li data-v-64d87e01>Inflation cumulée 2022-2025 (~14%)</li><li data-v-64d87e01>Concurrence croissante des entreprises US qui recrutent en France à distance</li></ul><div class="lecture__callout" data-v-64d87e01><strong data-v-64d87e01>Conséquence opérationnelle</strong> : les grilles d&#39;il y a 18 mois sont obsolètes. Les fourchettes affichées dans ce guide sont les prix réels du marché actuel.</div></div></section><section class="lecture" data-v-64d87e01><div class="lab-container lab-container--narrow" data-v-64d87e01><div class="lecture__num" data-v-64d87e01><strong data-v-64d87e01>LECTURE 02</strong></div><h3 data-v-64d87e01>Trois mondes parallèles <span class="gradient-text italic" data-v-64d87e01>cohabitent.</span></h3><div class="world-card" data-v-64d87e01><p class="world-card__title" data-v-64d87e01><em data-v-64d87e01>MONDE 1</em>Tech / SaaS B2B</p><p data-v-64d87e01>Modèle américanisé, fourchettes hautes, variable significatif, equity courante. Référence des grilles ci-dessus.</p></div><div class="world-card" data-v-64d87e01><p class="world-card__title" data-v-64d87e01><em data-v-64d87e01>MONDE 2</em>Conseil IT / ESN / Ingénierie</p><p data-v-64d87e01>Modèle plus traditionnel, <strong data-v-64d87e01>OTE 5-15% en-dessous du SaaS</strong>, mais plus de stabilité, package &quot;voiture/téléphone&quot; encore présent, equity rare.</p></div><div class="world-card" data-v-64d87e01><p class="world-card__title" data-v-64d87e01><em data-v-64d87e01>MONDE 3</em>Industrie / B2B classique</p><p data-v-64d87e01><strong data-v-64d87e01>Fixe plus élevé proportionnellement</strong>, variable plus modéré, cycles longs, voiture de fonction et avantages traditionnels (CSE, intéressement) compensent partiellement.</p></div><div class="lecture__callout" data-v-64d87e01><strong data-v-64d87e01>Conseil pratique</strong> : ajuster votre lecture des fourchettes selon le monde concerné. Un AE Enterprise dans l&#39;industrie touchera moins de variable mais plus de fixe qu&#39;un AE SaaS équivalent.</div></div></section><section class="lecture" data-v-64d87e01><div class="lab-container lab-container--narrow" data-v-64d87e01><div class="lecture__num" data-v-64d87e01><strong data-v-64d87e01>LECTURE 03</strong></div><h3 data-v-64d87e01>L&#39;écart Paris / régions <span class="gradient-text italic" data-v-64d87e01>se réduit avec la séniorité.</span></h3><div class="lecture__table-wrap" data-v-64d87e01><table class="lecture-table" data-v-64d87e01><thead data-v-64d87e01><tr data-v-64d87e01><th data-v-64d87e01>Niveau</th><th style="${ssrRenderStyle({ "text-align": "right" })}" data-v-64d87e01>Majoration Paris vs régions</th></tr></thead><tbody data-v-64d87e01><tr data-v-64d87e01><td data-v-64d87e01>Junior (SDR, AE Junior)</td><td class="num" data-v-64d87e01>+15 à +20%</td></tr><tr data-v-64d87e01><td data-v-64d87e01>Confirmé (AE, AM, CSM)</td><td class="num" data-v-64d87e01>+10 à +15%</td></tr><tr data-v-64d87e01><td data-v-64d87e01>Manager / Lead</td><td class="num" data-v-64d87e01>+8 à +12%</td></tr><tr data-v-64d87e01><td data-v-64d87e01>Head / Director</td><td class="num" data-v-64d87e01>+5 à +10%</td></tr><tr data-v-64d87e01><td data-v-64d87e01>VP / CRO</td><td class="num" data-v-64d87e01>+0 à +5%</td></tr></tbody></table></div><p data-v-64d87e01><strong data-v-64d87e01>Pourquoi ?</strong> Le coût de la vie pèse proportionnellement plus sur les petits salaires. Et plus on monte, plus le télétravail et la mobilité internationale rebattent les cartes.</p><p data-v-64d87e01><strong data-v-64d87e01>Lyon, Bordeaux, Nantes, Lille</strong> : entre Paris -5% et Paris -15% selon la tension locale.<br data-v-64d87e01><strong data-v-64d87e01>Autres régions</strong> : Paris -15 à -25%.</p></div></section><section class="lecture" data-v-64d87e01><div class="lab-container lab-container--narrow" data-v-64d87e01><div class="lecture__num" data-v-64d87e01><strong data-v-64d87e01>LECTURE 04</strong></div><h3 data-v-64d87e01>Le piège des annonces : <span class="gradient-text italic" data-v-64d87e01>OTE théorique vs réel.</span></h3><p data-v-64d87e01>Les fourchettes affichées dans les offres d&#39;emploi sont <strong data-v-64d87e01>rarement</strong> ce qui est réellement négocié et touché :</p><ul data-v-64d87e01><li data-v-64d87e01>Les <strong data-v-64d87e01>fourchettes basses</strong> sont souvent réelles</li><li data-v-64d87e01>Les <strong data-v-64d87e01>fourchettes hautes</strong> sont aspirationnelles, réservées aux top profils en concurrence</li><li data-v-64d87e01>Le <strong data-v-64d87e01>variable affiché</strong> correspond à un OTE théorique rarement atteint en moyenne</li></ul><div class="lecture__callout" data-v-64d87e01><strong data-v-64d87e01>Pour les recruteurs et dirigeants</strong> : afficher un OTE qui ne correspond pas à la réalité de l&#39;atteinte moyenne dans votre équipe crée un effet retour de bâton dévastateur. Les candidats s&#39;informent (RepVue, Glassdoor, ex-collègues). Une promesse d&#39;OTE non tenue = un Sales qui part en 6-9 mois et qui le dit autour de lui. Mieux vaut afficher un OTE crédible avec des accelerators ambitieux qu&#39;un OTE fictif qui crame votre marque employeur.</div></div></section><section class="lecture" data-v-64d87e01><div class="lab-container lab-container--narrow" data-v-64d87e01><div class="lecture__num" data-v-64d87e01><strong data-v-64d87e01>LECTURE 05</strong></div><h3 data-v-64d87e01>L&#39;effet <span class="gradient-text italic" data-v-64d87e01>&quot;boîtes intouchables&quot;.</span></h3><p data-v-64d87e01>Certaines entreprises constituent des <strong data-v-64d87e01>viviers premium</strong> sur le marché Sales français. Les profils qui en sortent négocient automatiquement +15 à +25% sur les fourchettes de leur grade.</p><dl class="vivier-list" data-v-64d87e01><dt data-v-64d87e01>SaaS B2B</dt><dd data-v-64d87e01>Doctolib, Qonto, Pennylane, Aircall, Spendesk, Alma, Payfit, Datadog, Algolia, Mirakl</dd><dt data-v-64d87e01>Cyber / Sécurité</dt><dd data-v-64d87e01>Wallix, Snowflake, CrowdStrike (FR)</dd><dt data-v-64d87e01>Tech US implantés en France</dt><dd data-v-64d87e01>Salesforce, AWS, Google, HubSpot, Snowflake</dd></dl><p data-v-64d87e01>Ces signatures sur le CV agissent comme un signal de qualité quasi-immédiat. À calibrer dans votre stratégie de sourcing : <strong data-v-64d87e01>viser ces viviers exige d&#39;aligner votre offre sur leur niveau de marché</strong>.</p></div></section><section class="lab-methodo" data-v-64d87e01><div class="lab-container lab-container--narrow" data-v-64d87e01><div class="reveal lab-section-eyebrow" data-v-64d87e01>MÉTHODOLOGIE &amp; SOURCES</div><h2 class="reveal" data-v-64d87e01> Comment ce guide <span class="gradient-text italic" data-v-64d87e01>a été construit.</span></h2><p data-v-64d87e01>Les fourchettes proviennent de quatre couches d&#39;informations croisées :</p><ol data-v-64d87e01><li data-v-64d87e01><strong data-v-64d87e01>Données internes Mariell</strong> : observations terrain sur nos missions de recrutement Sales en cours et passées.</li><li data-v-64d87e01><strong data-v-64d87e01>Études salariales publiques 2026</strong> : Hays Salary Guide, Michael Page Salary Survey, Robert Walters Salary Survey, RepVue France, Glassdoor France, Data Recrutement, Licorne Society, Uptoo Baromètre Sales, Qobra Plans de Commission, Welcome to the Jungle, Skipcall, Skalin.</li><li data-v-64d87e01><strong data-v-64d87e01>Conversations marché continues</strong> : retours candidats sur leurs offres réelles, retours clients sur leurs pratiques de rémunération.</li><li data-v-64d87e01><strong data-v-64d87e01>Veille spécialisée</strong> : posts LinkedIn de référence, communautés Sales (Modjo, Notion VC, Pavilion FR), études sectorielles éditeurs (DigiRocks, Numeum).</li></ol><h4 data-v-64d87e01>Limites assumées de ce guide :</h4><ul data-v-64d87e01><li data-v-64d87e01>Reflète notre lecture du marché 2026</li><li data-v-64d87e01>Variations possibles selon profil exact, contexte précis, négociation</li><li data-v-64d87e01>Hors stock-options, BSPCE, et avantages annexes (CSE, voiture, télétravail, etc.)</li></ul><h4 data-v-64d87e01>Mise à jour : annuelle.</h4><p class="lab-methodo__note" data-v-64d87e01>Prochaine édition : 2027.</p></div></section><section class="lab-signoff" data-v-64d87e01><div class="lab-container lab-container--narrow" data-v-64d87e01><blockquote data-v-64d87e01><p data-v-64d87e01><em data-v-64d87e01>Ce guide est mis à jour chaque année, à partir des données que nous croisons quotidiennement sur le terrain : missions de recrutement, conversations candidats, retours clients, observations marché.</em></p><p data-v-64d87e01><em data-v-64d87e01>Il ne remplace pas une analyse personnalisée de votre contexte spécifique, mais il vous donne le cadre pour calibrer vos offres avec justesse.</em></p></blockquote><span class="lab-signoff__edition" data-v-64d87e01>Édition 2026 — Prochaine mise à jour : 2027</span><p class="lab-signoff__signature" data-v-64d87e01>— Par Mariell, <span class="gradient-text italic" data-v-64d87e01>pour vous.</span></p></div></section></main><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lab/guide-salaires-sales.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const guideSalairesSales = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-64d87e01"]]);

export { guideSalairesSales as default };
//# sourceMappingURL=guide-salaires-sales-CZOdUUvQ.mjs.map
