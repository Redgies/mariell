import { u as useRoute, _ as __nuxt_component_0, a as _imports_0, b as useRuntimeConfig } from './server.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import MarkdownIt from 'markdown-it';
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
  __name: "[uuid]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    computed(() => String(route.params.uuid || ""));
    const state = ref("loading");
    const planContent = ref("");
    const planMetadata = ref(null);
    const errorMessage = ref("");
    const deferredEmail = ref("");
    const md = new MarkdownIt({ html: false, linkify: true, typographer: true });
    const renderedHtml = computed(() => planContent.value ? md.render(planContent.value) : "");
    useHead(() => ({
      title: state.value === "plan" && planMetadata.value ? `Plan de sourcing — ${planMetadata.value.posteRecherche} · Mariell` : "Plan de sourcing — Mariell · Le Lab",
      meta: [{ name: "robots", content: "noindex, nofollow" }]
    }));
    const loaderPct = ref(0);
    const activeStepIdx = ref(0);
    const copyState = ref("idle");
    const config = useRuntimeConfig();
    const calendlyUrl = computed(() => {
      const c = config.public;
      return c.calendlyUrl || "#";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "lab-tool-root",
        "data-state": unref(state)
      }, _attrs))} data-v-fcf64b4d><div class="ambient" aria-hidden="true" data-v-fcf64b4d><div class="blob-cy" data-v-fcf64b4d></div><div class="blob-mg" data-v-fcf64b4d></div></div><div class="grain-fx" aria-hidden="true" data-v-fcf64b4d></div>`);
      if (unref(state) !== "plan") {
        _push(`<header class="load-header" data-v-fcf64b4d><div class="inner" data-v-fcf64b4d>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "brand",
          "aria-label": "Mariell"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Mariell" data-v-fcf64b4d${_scopeId}>`);
            } else {
              return [
                createVNode("img", {
                  src: _imports_0,
                  alt: "Mariell"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span class="divider" aria-hidden="true" data-v-fcf64b4d></span><div class="meta" data-v-fcf64b4d><span class="label" data-v-fcf64b4d>Plan de sourcing LinkedIn</span>`);
        if (unref(planMetadata)?.posteRecherche) {
          _push(`<span class="title" data-v-fcf64b4d>${ssrInterpolate(unref(planMetadata).posteRecherche)}</span>`);
        } else {
          _push(`<span class="title" data-v-fcf64b4d>Génération en cours…</span>`);
        }
        _push(`</div></div></header>`);
      } else {
        _push(`<header class="res-header" data-v-fcf64b4d><div class="inner" data-v-fcf64b4d><div class="left" data-v-fcf64b4d>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "brand",
          "aria-label": "Mariell"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Mariell" data-v-fcf64b4d${_scopeId}>`);
            } else {
              return [
                createVNode("img", {
                  src: _imports_0,
                  alt: "Mariell"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span class="divider" aria-hidden="true" data-v-fcf64b4d></span><div class="plan-meta" data-v-fcf64b4d><span class="label" data-v-fcf64b4d>Plan de sourcing LinkedIn</span><span class="title" data-v-fcf64b4d>${ssrInterpolate(unref(planMetadata)?.posteRecherche || "")}</span></div></div><div class="right" data-v-fcf64b4d><button class="icon-btn" type="button" aria-label="Imprimer" data-v-fcf64b4d><span class="icon-default" aria-hidden="true" data-v-fcf64b4d><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-v-fcf64b4d><polyline points="6,9 6,2 18,2 18,9" data-v-fcf64b4d></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" data-v-fcf64b4d></path><rect x="6" y="14" width="12" height="8" data-v-fcf64b4d></rect></svg></span><span class="label-default" data-v-fcf64b4d>Imprimer</span></button><button type="button" aria-label="Copier le lien" class="${ssrRenderClass([{ "is-copied": unref(copyState) === "copied" }, "icon-btn"])}" data-v-fcf64b4d>`);
        if (unref(copyState) !== "copied") {
          _push(`<span class="icon-default" aria-hidden="true" data-v-fcf64b4d><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-v-fcf64b4d><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" data-v-fcf64b4d></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" data-v-fcf64b4d></path></svg></span>`);
        } else {
          _push(`<span class="icon-copied" aria-hidden="true" data-v-fcf64b4d><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-v-fcf64b4d><polyline points="20 6 9 17 4 12" data-v-fcf64b4d></polyline></svg></span>`);
        }
        _push(`<span class="label-default" data-v-fcf64b4d>${ssrInterpolate(unref(copyState) === "copied" ? "Copié !" : "Copier le lien")}</span></button><a class="cta-pill"${ssrRenderAttr("href", unref(calendlyUrl))} target="_blank" rel="noopener" aria-label="Prendre rendez-vous" data-v-fcf64b4d><span class="cta-pill__lbl" data-v-fcf64b4d>Prendre rendez-vous</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-fcf64b4d><path d="M5 12h14M13 6l6 6-6 6" data-v-fcf64b4d></path></svg></a></div></div></header>`);
      }
      _push(`<main data-v-fcf64b4d>`);
      if (unref(state) === "loading") {
        _push(`<section class="state-loading" data-v-fcf64b4d><div class="loading-stage" data-v-fcf64b4d><div class="loader" aria-hidden="true" data-v-fcf64b4d><svg viewBox="0 0 220 220" data-v-fcf64b4d><defs data-v-fcf64b4d><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1" data-v-fcf64b4d><stop offset="0%" stop-color="#00ffff" data-v-fcf64b4d></stop><stop offset="100%" stop-color="#ff00ff" data-v-fcf64b4d></stop></linearGradient><linearGradient id="g2" x1="1" y1="0" x2="0" y2="1" data-v-fcf64b4d><stop offset="0%" stop-color="#5ee7e7" data-v-fcf64b4d></stop><stop offset="100%" stop-color="#e85eff" data-v-fcf64b4d></stop></linearGradient></defs><circle class="ring ring-bg" cx="110" cy="110" r="98" data-v-fcf64b4d></circle><circle class="ring ring-1" cx="110" cy="110" r="98" data-v-fcf64b4d></circle><circle class="ring ring-bg" cx="110" cy="110" r="74" data-v-fcf64b4d></circle><circle class="ring ring-2" cx="110" cy="110" r="74" data-v-fcf64b4d></circle><circle class="ring ring-bg" cx="110" cy="110" r="50" data-v-fcf64b4d></circle><circle class="ring ring-3" cx="110" cy="110" r="50" data-v-fcf64b4d></circle></svg><div class="center" data-v-fcf64b4d><span class="pct" data-v-fcf64b4d>${ssrInterpolate(unref(loaderPct))}</span><span class="pct-label" data-v-fcf64b4d>Génération</span></div></div><span class="eyebrow-cyan" data-v-fcf64b4d>Le Lab Mariell</span><h1 data-v-fcf64b4d>Votre plan de sourcing, <em data-v-fcf64b4d>en construction.</em></h1><div class="step-stack" role="status" aria-live="polite" data-v-fcf64b4d><!--[-->`);
        ssrRenderList([
          "Analyse de votre contexte...",
          "Identification des entreprises cibles...",
          "Construction de la requête booléenne...",
          "Élaboration de la stratégie en 4 phases...",
          "Compilation du tableau de scoring...",
          "Finalisation du plan..."
        ], (step, i) => {
          _push(`<div class="${ssrRenderClass([{ "is-active": i === unref(activeStepIdx) }, "step"])}" data-v-fcf64b4d>${ssrInterpolate(step)}</div>`);
        });
        _push(`<!--]--></div><p class="reassure" data-v-fcf64b4d> Cette opération prend en général 25 à 35 secondes. Merci de ne pas fermer cette fenêtre. </p></div></section>`);
      } else if (unref(state) === "plan") {
        _push(`<section class="state-plan" data-v-fcf64b4d><div class="read" data-v-fcf64b4d><article class="prose" data-v-fcf64b4d>${unref(renderedHtml) ?? ""}</article><aside class="final-cta" data-v-fcf64b4d><h2 data-v-fcf64b4d>Recruter n&#39;est pas un pari. <em data-v-fcf64b4d>Parlons-en.</em></h2><p data-v-fcf64b4d>Un échange de 30 minutes pour caler le plan sur votre contexte précis et lancer la chasse cette semaine.</p><a class="cta-gradient-lg"${ssrRenderAttr("href", unref(calendlyUrl))} target="_blank" rel="noopener" data-v-fcf64b4d><span data-v-fcf64b4d>Prendre rendez-vous</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-fcf64b4d><path d="M5 12h14M13 6l6 6-6 6" data-v-fcf64b4d></path></svg></a></aside></div></section>`);
      } else if (unref(state) === "error") {
        _push(`<section class="state-error" data-v-fcf64b4d><div class="err-stage" data-v-fcf64b4d><div class="err-mark" data-v-fcf64b4d><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-fcf64b4d><path d="M12 8v5" data-v-fcf64b4d></path><circle cx="12" cy="16.5" r="0.6" fill="currentColor" data-v-fcf64b4d></circle><circle cx="12" cy="12" r="9" data-v-fcf64b4d></circle></svg></div><span class="eyebrow-cyan" data-v-fcf64b4d>Génération interrompue</span><h1 data-v-fcf64b4d>Une erreur <em data-v-fcf64b4d>est survenue.</em></h1><p data-v-fcf64b4d>${ssrInterpolate(unref(errorMessage))}</p><div class="err-actions" data-v-fcf64b4d><button class="cta-pill" type="button" data-v-fcf64b4d><span data-v-fcf64b4d>Réessayer</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-fcf64b4d><path d="M5 12h14M13 6l6 6-6 6" data-v-fcf64b4d></path></svg></button>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          class: "link",
          to: "/lab/plan-de-sourcing"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Retour au formulaire`);
            } else {
              return [
                createTextVNode("Retour au formulaire")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></section>`);
      } else if (unref(state) === "deferred") {
        _push(`<section class="state-deferred" data-v-fcf64b4d><div class="err-stage" data-v-fcf64b4d><div class="err-mark" data-v-fcf64b4d><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-fcf64b4d><circle cx="12" cy="12" r="9" data-v-fcf64b4d></circle><polyline points="12 7 12 12 15 14" data-v-fcf64b4d></polyline></svg></div><span class="eyebrow-cyan" data-v-fcf64b4d>Service personnalisé</span><h1 data-v-fcf64b4d>Votre demande sera <em data-v-fcf64b4d>traitée manuellement.</em></h1><p data-v-fcf64b4d> Notre équipe a bien reçu votre demande et la traitera sous 24h ouvrées. Vous recevrez votre plan de sourcing par email `);
        if (unref(deferredEmail)) {
          _push(`<!--[--> à l&#39;adresse <span class="email" data-v-fcf64b4d>${ssrInterpolate(unref(deferredEmail))}</span><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(` dès qu&#39;il sera prêt. </p><div class="err-actions" data-v-fcf64b4d>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          class: "btn-ghost",
          to: "/lab"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span data-v-fcf64b4d${_scopeId}>Retour au Lab Mariell</span>`);
            } else {
              return [
                createVNode("span", null, "Retour au Lab Mariell")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main>`);
      if (unref(state) === "plan") {
        _push(`<footer class="res-footer" data-v-fcf64b4d><div class="tag" data-v-fcf64b4d>Recruter n&#39;est pas un pari.</div><div class="legal" data-v-fcf64b4d>Mariell · Plan généré et accessible 90 jours</div></footer>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lab/plan-de-sourcing/resultat/[uuid].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _uuid_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fcf64b4d"]]);

export { _uuid_ as default };
//# sourceMappingURL=_uuid_-BxT4TE4H.mjs.map
