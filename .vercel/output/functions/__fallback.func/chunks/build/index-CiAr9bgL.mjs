import { _ as __nuxt_component_0, s as siteConfig } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './LabCard-wGD4dlgD.mjs';
import { defineComponent, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Le Lab Mariell — L'expertise Sales, en libre-service.",
      meta: [
        {
          name: "description",
          content: "Trois outils, deux guides. De quoi cadrer un brief, sourcer un profil, calibrer une offre — sans nous appeler."
        }
      ]
    });
    const tools = [
      {
        tag: "IA · 3 minutes",
        titleLead: "Plan de ",
        titleEm: "sourcing LinkedIn",
        description: "Votre stratégie de chasse pour le prochain recrutement Sales : entreprises cibles, requête booléenne, plan en 4 phases.",
        cta: "Démarrer",
        href: "/lab/plan-de-sourcing",
        icon: "target"
      },
      {
        tag: "IA · 4 minutes",
        titleLead: "Évaluation ",
        titleEm: "d'attractivité",
        description: "Votre offre Sales, confrontée au marché 2026. Diagnostic chiffré, comparatif, points de levier à activer.",
        cta: "Démarrer",
        href: "/lab/evaluation-attractivite",
        icon: "gauge"
      },
      {
        tag: "Service offert · 7 à 10 jours",
        titleLead: "Demande ",
        titleEm: "stage ou alternance",
        titleTrail: " Sales",
        description: "Activez notre vivier de stagiaires et alternants Sales. Profils proposés sous 7 à 10 jours.",
        cta: "Faire une demande",
        href: "/lab/demande-stage-alternance",
        icon: "team"
      }
    ];
    const guides = [
      {
        tag: "Mis à jour 2026 · Lecture 8 min",
        titleLead: "Guide des ",
        titleEm: "salaires Sales 2026",
        description: "La grille à jour, segmentée par poste (SDR, AE, Account Manager, Head of Sales…) et par séniorité. Fixe, variable, package total.",
        cta: "Consulter",
        href: "/lab/guide-salaires-sales",
        icon: "bars"
      },
      {
        tag: "Lecture 6 min",
        titleLead: "Les ",
        titleEm: "10 essentiels",
        titleTrail: " du recrutement Sales",
        description: "Dix vérités pour ne pas rater votre prochain recrutement Sales. Aucune n'est complexe. Toutes demandent de la lucidité.",
        cta: "Consulter",
        href: "/lab/10-essentiels-recrutement-sales",
        icon: "check"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_LabCard = __nuxt_component_0$1;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "relative mx-auto max-w-7xl px-5 pt-32 pb-16 md:px-10 md:pt-40 md:pb-24 lg:px-16" }, _attrs))} data-v-50d1e6fd>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "reveal mb-12 flex w-fit items-center gap-2 font-mono-num text-xs uppercase tracking-[0.22em] text-white/40 transition-colors hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" data-v-50d1e6fd${_scopeId}><path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-v-50d1e6fd${_scopeId}></path></svg> Retour à l&#39;accueil `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              }, [
                createVNode("path", {
                  d: "M19 12H5M11 6l-6 6 6 6",
                  stroke: "currentColor",
                  "stroke-width": "1.6",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                })
              ])),
              createTextVNode(" Retour à l'accueil ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<header class="lab-header" data-v-50d1e6fd><div class="reveal eyebrow-cyan" data-v-50d1e6fd>Le Lab Mariell</div><h1 class="reveal lab-h1 mt-7 text-white" data-split data-v-50d1e6fd> Mariell,<br data-v-50d1e6fd><span class="gradient-text italic" data-v-50d1e6fd>en libre-service.</span></h1><p class="reveal lab-subtitle mt-14" data-v-50d1e6fd> Trois outils, deux guides. De quoi cadrer un brief, sourcer un profil, calibrer une offre — sans nous appeler. </p><div class="reveal lab-header__rule" aria-hidden="true" data-v-50d1e6fd></div></header><section class="lab-section" aria-labelledby="sec-outils" data-v-50d1e6fd><div class="lab-section__head" data-v-50d1e6fd><div id="sec-outils" class="reveal lab-section__label" data-v-50d1e6fd>Outils interactifs</div><p class="reveal lab-section__intro" data-v-50d1e6fd> Trois outils calibrés sur votre contexte précis. Pas un template, pas un score générique : un livrable construit pour votre recrutement, votre marché, votre stade. </p></div><div class="lab-grid lab-grid--3" data-v-50d1e6fd><!--[-->`);
      ssrRenderList(tools, (tool) => {
        _push(ssrRenderComponent(_component_LabCard, mergeProps({
          key: tool.href
        }, { ref_for: true }, tool, { class: "reveal" }), null, _parent));
      });
      _push(`<!--]--></div></section><section class="lab-section" aria-labelledby="sec-guides" data-v-50d1e6fd><div class="lab-section__head" data-v-50d1e6fd><div id="sec-guides" class="reveal lab-section__label" data-v-50d1e6fd>Guides pratiques</div><p class="reveal lab-section__intro" data-v-50d1e6fd> Deux guides en libre accès. Pas de formulaire, pas d&#39;email à donner. Vous lisez, vous fermez, vous prenez ce qui vous sert. </p></div><div class="lab-grid lab-grid--2" data-v-50d1e6fd><!--[-->`);
      ssrRenderList(guides, (guide) => {
        _push(ssrRenderComponent(_component_LabCard, mergeProps({
          key: guide.href
        }, { ref_for: true }, guide, { class: "reveal" }), null, _parent));
      });
      _push(`<!--]--></div></section><section class="lab-footer-page" data-v-50d1e6fd><div class="lab-footer-page__rule" aria-hidden="true" data-v-50d1e6fd></div><div class="lab-footer-page__inner" data-v-50d1e6fd><p class="reveal lab-footer-page__text" data-v-50d1e6fd> D&#39;autres ressources arrivent. Et si vous voulez aller plus loin, et plus vite, parlons-en. </p><a${ssrRenderAttr("href", unref(siteConfig).calendlyUrl)} target="_blank" rel="noopener" class="reveal gradient-cta group inline-flex items-center gap-3 rounded-full px-7 py-4 text-base text-black lab-footer-page__cta" style="${ssrRenderStyle({ "font-family": "var(--font-grotesk)", "font-weight": "600" })}" data-v-50d1e6fd> Prendre rendez-vous <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" data-v-50d1e6fd><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-v-50d1e6fd></path></svg></a></div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lab/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-50d1e6fd"]]);

export { index as default };
//# sourceMappingURL=index-CiAr9bgL.mjs.map
