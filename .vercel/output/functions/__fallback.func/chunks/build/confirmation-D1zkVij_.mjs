import { _ as __nuxt_component_0 } from './LabToolShell-KFgobw02.mjs';
import { _ as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, withCtx, openBlock, createBlock, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "confirmation",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Demande reçue — Mariell · Le Lab",
      meta: [
        {
          name: "description",
          content: "Votre demande de stage ou alternance Sales a bien été reçue. Nous revenons vers vous sous 7 à 10 jours ouvrés."
        },
        { name: "robots", content: "noindex, nofollow" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LabToolShell = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_LabToolShell, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main class="confirm-shell" data-v-6340c4a9${_scopeId}><div class="confirm-card" data-v-6340c4a9${_scopeId}><span class="confirm-eyebrow" data-v-6340c4a9${_scopeId}>Outil 01 · Le Lab Mariell</span><h1 class="confirm-title" data-v-6340c4a9${_scopeId}>Demande <em data-v-6340c4a9${_scopeId}>reçue.</em></h1><p class="confirm-body" data-v-6340c4a9${_scopeId}>Nous revenons vers vous sous 7 à 10 jours ouvrés.</p><p class="confirm-frame" data-v-6340c4a9${_scopeId}> Service offert sous réserve de disponibilité de profils pertinents. Priorité accordée à nos clients. </p>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/lab",
              class: "confirm-cta"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-6340c4a9${_scopeId2}><path d="M19 12H5M12 19l-7-7 7-7" data-v-6340c4a9${_scopeId2}></path></svg> Retour au Lab `);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "1.8",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "aria-hidden": "true"
                    }, [
                      createVNode("path", { d: "M19 12H5M12 19l-7-7 7-7" })
                    ])),
                    createTextVNode(" Retour au Lab ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></main>`);
          } else {
            return [
              createVNode("main", { class: "confirm-shell" }, [
                createVNode("div", { class: "confirm-card" }, [
                  createVNode("span", { class: "confirm-eyebrow" }, "Outil 01 · Le Lab Mariell"),
                  createVNode("h1", { class: "confirm-title" }, [
                    createTextVNode("Demande "),
                    createVNode("em", null, "reçue.")
                  ]),
                  createVNode("p", { class: "confirm-body" }, "Nous revenons vers vous sous 7 à 10 jours ouvrés."),
                  createVNode("p", { class: "confirm-frame" }, " Service offert sous réserve de disponibilité de profils pertinents. Priorité accordée à nos clients. "),
                  createVNode(_component_NuxtLink, {
                    to: "/lab",
                    class: "confirm-cta"
                  }, {
                    default: withCtx(() => [
                      (openBlock(), createBlock("svg", {
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "1.8",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-hidden": "true"
                      }, [
                        createVNode("path", { d: "M19 12H5M12 19l-7-7 7-7" })
                      ])),
                      createTextVNode(" Retour au Lab ")
                    ]),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lab/demande-stage-alternance/confirmation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const confirmation = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6340c4a9"]]);

export { confirmation as default };
//# sourceMappingURL=confirmation-D1zkVij_.mjs.map
