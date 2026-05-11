import { _ as __nuxt_component_0 } from './server.mjs';
import { defineComponent, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "10-essentiels-recrutement-sales",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Les 10 essentiels du recrutement Sales · Le Lab Mariell",
      meta: [
        {
          name: "description",
          content: "Dix vérités pour ne pas rater votre prochain recrutement Sales. Aucune n'est complexe. Toutes demandent de la lucidité."
        }
      ]
    });
    const essentiels = [
      {
        num: "01",
        concept: "La Base",
        punch: "si vous cherchez un OVNI, sachez le reconnaître, le payer, et l'attraper.",
        body: "Vous avez le droit de chercher un OVNI. Mais un OVNI a trois caractéristiques&nbsp;: il est rare, il coûte cher, et il faut savoir le reconnaître. Si vous ne réunissez pas ces trois conditions — la rareté assumée dans la timeline, le budget aligné, l'œil pour le détecter — ne cherchez pas un OVNI. Cherchez un excellent profil standard. Vous gagnerez 4 mois."
      },
      {
        num: "02",
        concept: "Le Jeu",
        punch: "un recrutement se joue à 2.",
        body: "Un recrutement est un jeu qui se joue à 2. L'attractivité est une question centrale, celle du candidat comme celle de l'entreprise. C'est le rapport des deux qui définira les règles de ce recrutement. Tous les Sales ne se valent pas, toutes les entreprises non plus. Il faut adapter sa recherche en fonction, en optimisant la visibilité de ses plus-values et en compensant ses faiblesses. 100% Outbound&nbsp;? Variable attractif et atteignable. Un portfolio client ultra fourni&nbsp;? Le mentionner rapidement. Un package limité&nbsp;? Évolution rapide et plan de carrière clair.",
        anecdote: "Un client early stage nous appelle après plusieurs recrutements ratés et un turnover Sales chronique. Sous-performance systématique, profils qui ne tenaient pas. Diagnostic&nbsp;: ils recrutaient les mauvais Sales, car ils ne savaient pas vendre ce qu'ils avaient. Des références clients ultra populaires invisibles dans leur pitch RH. Un produit innovant, déjà au PMF. Une structure mouvante qui permettait un accès rapide aux responsabilités. On a remis ces 3 atouts au centre du discours candidat. Trois recrutements plus tard, fin du turnover."
      },
      {
        num: "03",
        concept: "L'Enjeu",
        punch: "une phrase, ou rien.",
        body: "On ne recrute pas pour recruter. Avant chaque recrutement Sales, écrivez la phrase suivante&nbsp;: «&nbsp;Dans 12 mois, ce Sales aura permis de [enjeu chiffré ou périmètre précis].&nbsp;» Si vous n'arrivez pas à compléter la phrase sans la bourrer de «&nbsp;et de&nbsp;» et «&nbsp;ainsi que&nbsp;», c'est que vous ne savez pas pourquoi vous recrutez. Et vous ne saurez pas non plus s'il a réussi."
      },
      {
        num: "04",
        concept: "Le Brief",
        punch: "3 lecteurs, 3 profils différents&nbsp;? Recommencez.",
        body: "Un brief de recrutement Sales se teste avant de se lancer. Envoyez le vôtre à trois personnes&nbsp;: un pair RH, le Hiring Sales Manager qui pilotera ce Sales au quotidien, et un externe (pair de votre secteur, advisor, cabinet). Demandez à chacun de décrire en 3 lignes le profil qu'il imagine. Si les trois descriptions ne se ressemblent pas, votre brief est flou. Et un brief flou produit toujours un recrutement flou — peu importe le talent du chasseur."
      },
      {
        num: "05",
        concept: "Le Process",
        punch: "retirez les frictions, pas les filtres.",
        body: "Six entretiens sont souvent synonyme de frictions. Mais retirer les bons filtres pour gagner du temps, c'est pire — vous laissez passer ce que vous deviez détecter. La règle&nbsp;: pour chaque étape de votre process, complétez la phrase «&nbsp;Cette étape sert à valider [compétence ou risque précis].&nbsp;» Si vous n'avez pas de réponse claire, c'est une friction. Si vous en avez une, c'est un filtre. Gardez les filtres, supprimez les frictions."
      },
      {
        num: "06",
        concept: "Le Track Record",
        punch: "80% &gt; 120% selon le contexte.",
        body: "Un track record Sales se lit toujours en contexte, jamais à l'absolu. Un AE à 80% de quota dans une équipe où il est top performer — sur un produit avec un PMF encore fragile, une marque sans autorité sur son marché, une acquisition limitée — est probablement plus performant qu'un AE à 120% dans une équipe où tout le monde surperforme, sur un produit leader avec une demande inbound massive. Avant de valider un chiffre sur un CV, posez systématiquement quatre questions&nbsp;: quel était le quota de l'équipe&nbsp;? quel pourcentage de l'équipe atteignait 100%&nbsp;? combien d'AE étaient au-dessus du candidat&nbsp;? quel était l'état du PMF et de la notoriété produit à l'époque&nbsp;? Sans ces réponses, le chiffre sur le CV est de la décoration.",
        anecdote: "Deux profils recrutés pour le même client. Le premier&nbsp;: CV flamboyant, top boîtes leader, track record en béton. Le second&nbsp;: CV plus modeste, mais l'impact était là, en contexte. Les deux performent. Mais c'est le second qui survole l'équipe, fait remonter des recommandations stratégiques, prend des responsabilités. Quelques années plus tard, le premier reste top performer. Le second est N+2. Le client a recruté deux Sales. Il a hérité d'un manager."
      },
      {
        num: "07",
        concept: "Le Variable",
        punch: "le test silencieux du Sales que vous recrutez.",
        body: "Le variable n'est pas un argument à vendre, c'est un test d'alignement. Un vrai Sales lit un comp plan en 5 minutes et identifie immédiatement les seuils, les accélérateurs, les pièges, les angles de performance. Si votre candidat l'accepte poliment sans poser une seule question — pas de challenge sur le quota, pas de demande de simulation, pas de question sur les SPIFFs — vous ne recrutez pas un Sales. Vous recrutez un exécutant qui touchera son fixe."
      },
      {
        num: "08",
        concept: "La Comparaison",
        punch: "le candidat suivant devra prouver quoi de plus que le précédent&nbsp;?",
        body: "La sur-comparaison est le poison silencieux des recrutements Sales. Aujourd'hui, le choix se fait dans les deux sens&nbsp;: les meilleurs profils sont sollicités en permanence, ils ont 2-3 process en parallèle, et ils signent vite. Si vous prolongez votre recherche par confort — «&nbsp;je veux quand même voir le suivant&nbsp;» — vous ne comparez pas, vous offrez le candidat à votre concurrent. Posez la question avant de continuer&nbsp;: que devra prouver le candidat suivant pour déloger celui-ci&nbsp;? Si vous n'avez pas de réponse précise, vous ne cherchez plus mieux. Vous repoussez la décision. Et passer un tour, c'est souvent perdre la partie.",
        anecdote: "Un excellent profil en final step. Le client veut «&nbsp;voir encore un candidat pour comparer&nbsp;», on fait patienter le candidat. Une semaine. Puis une de plus. Le candidat signe ailleurs. Le client met un mois supplémentaire à combler le poste, avec l'amertume d'avoir manqué la perle qu'il avait déjà sous la main. Le candidat perdu&nbsp;? Top boîte concurrente. Aujourd'hui, il y performe."
      },
      {
        num: "09",
        concept: "VP Sales, Head of Sales, CRO",
        punch: "commencez par votre réseau. Toujours.",
        body: "Pour les postes hautement stratégiques — VP Sales, Head of Sales, CRO — la chasse formelle ne doit jamais être votre premier réflexe. Commencez systématiquement par votre réseau et celui de vos investisseurs, advisors, board members, ex-collègues. Pourquoi&nbsp;? À ce niveau, le fit pèse autant que la compétence sur le papier, et la confiance se construit difficilement avec un inconnu — surtout quand les résultats ne se mesurent pas avant 12 à 18 mois. La chasse reste la meilleure option si le pool réseau est insuffisant — et oui, ces profils se chassent, ils ne candidatent pas. Mais elle ne doit jamais être votre premier réflexe."
      },
      {
        num: "10",
        concept: "Le Désalignement",
        punch: "ne le fuyez pas, il révèle un profil.",
        body: "Quand un candidat n'est pas aligné avec vous — sur la stratégie commerciale, sur la lecture du marché, sur la fiche de poste — la plupart des recruteurs vivent ce moment comme un signal de disqualification. C'est l'inverse. Le désalignement est le seul moment de l'entretien où le candidat ne joue plus un rôle préparé. Sa façon de tenir sa position, de l'argumenter, de l'adapter sans se renier — ou au contraire de pivoter mollement pour vous plaire — vous dit en 5 minutes ce que 5 entretiens ne vous diraient pas. Acceptez le désaccord, observez la réaction, jugez-la sans ego. Sans ego on a dit. Vous ne cherchez pas un candidat qui pense comme vous. Vous cherchez un Sales qui sait valoriser sa position face à un client difficile — et vous êtes son premier client difficile."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><div class="lab-page-bg" aria-hidden="true" data-v-032df10e></div><main class="lab-page" data-v-032df10e><div class="lab-subnav" data-v-032df10e><div class="lab-container lab-subnav__row" data-v-032df10e>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/lab",
        class: "lab-subnav__back"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span aria-hidden="true" data-v-032df10e${_scopeId}>←</span> Retour au Lab `);
          } else {
            return [
              createVNode("span", { "aria-hidden": "true" }, "←"),
              createTextVNode(" Retour au Lab ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="lab-subnav__crumb" data-v-032df10e>`);
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
      _push(`<span class="lab-subnav__sep" data-v-032df10e>/</span> 10 ESSENTIELS RECRUTEMENT SALES </div></div></div><header class="lab-header" data-v-032df10e><div class="lab-container" data-v-032df10e><div class="reveal lab-cartouche" data-v-032df10e><span class="lab-cartouche__dot" data-v-032df10e></span> LE LAB MARIELL <span class="lab-cartouche__sep" data-v-032df10e></span><span class="lab-cartouche__num" data-v-032df10e>GUIDES PRATIQUES</span></div><h1 class="reveal lab-h1" data-v-032df10e> Les <span class="gradient-text italic" data-v-032df10e>10 essentiels</span><br data-v-032df10e> du recrutement Sales. </h1><p class="reveal lab-sub" data-v-032df10e> Ce que personne ne vous dit, <span class="gradient-text italic" data-v-032df10e>mais que vous devriez savoir.</span></p><div class="reveal lab-meta" data-v-032df10e><div data-v-032df10e>ÉDITION <strong data-v-032df10e>MAI 2026</strong></div><div data-v-032df10e>ESSENTIELS <strong data-v-032df10e>10</strong></div><div data-v-032df10e>ACCÈS <strong data-v-032df10e>LIBRE</strong></div></div></div></header><section class="lab-foreword" data-v-032df10e><div class="lab-container" data-v-032df10e><div class="reveal lab-foreword__lbl" data-v-032df10e>AVANT-PROPOS</div><blockquote class="reveal lab-foreword__quote" data-v-032df10e><p data-v-032df10e>La majorité des recrutements Sales ratés ne ratent pas à cause d&#39;un mauvais profil. Ils ratent à cause de décisions prises avant même que la recherche commence : un brief flou, un enjeu mal posé, des critères jamais écrits, un process qui ne teste rien.</p><p data-v-032df10e>Ce guide rassemble les 10 vérités qu&#39;on aurait aimé qu&#39;on nous donne plus tôt. Aucune n&#39;est complexe. Aucune ne demande un outil. Toutes demandent de la lucidité.</p></blockquote></div></section><section class="lab-essentiels" data-v-032df10e><div class="lab-container lab-container--narrow" data-v-032df10e><!--[-->`);
      ssrRenderList(essentiels, (essentiel, idx) => {
        _push(`<article class="${ssrRenderClass([{ "essentiel--first": idx === 0 }, "essentiel"])}" data-v-032df10e><div class="essentiel__row" data-v-032df10e><div class="essentiel__num" data-v-032df10e>${ssrInterpolate(essentiel.num)}<sup data-v-032df10e>ESSENTIEL</sup></div><div class="essentiel__body" data-v-032df10e><h2 class="essentiel__title" data-v-032df10e><span class="gradient-text italic essentiel__concept" data-v-032df10e>${ssrInterpolate(essentiel.concept)}</span><span class="essentiel__colon" data-v-032df10e>:</span><span class="essentiel__punch" data-v-032df10e>${essentiel.punch ?? ""}</span></h2><p class="essentiel__p" data-v-032df10e>${essentiel.body ?? ""}</p>`);
        if (essentiel.anecdote) {
          _push(`<aside class="anecdote" data-v-032df10e><div class="anecdote__label" data-v-032df10e><em class="name" data-v-032df10e>Vu chez Mariell<span class="dot" data-v-032df10e>.</span></em></div><p data-v-032df10e>${essentiel.anecdote ?? ""}</p></aside>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></article>`);
      });
      _push(`<!--]--></div></section><section class="lab-signature" data-v-032df10e><div class="lab-container lab-container--narrow" data-v-032df10e><div class="lab-signature__lbl" data-v-032df10e>SIGNATURE</div><p class="lab-signature__quote" data-v-032df10e> Les candidats recrutés par nos clients font la fierté de Mariell, tout autant que ceux qui ont été screenés par Mariell mais ont finalement signé ailleurs. Ils sont tous témoins de la qualité du travail effectué. </p><div class="lab-signature__sig" data-v-032df10e><span class="by" data-v-032df10e>— Par </span><span class="gradient-text italic name" data-v-032df10e>Mariell</span><span class="by" data-v-032df10e>, pour vous.</span></div></div></section></main><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lab/10-essentiels-recrutement-sales.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _10EssentielsRecrutementSales = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-032df10e"]]);

export { _10EssentielsRecrutementSales as default };
//# sourceMappingURL=10-essentiels-recrutement-sales-D_QASBO4.mjs.map
