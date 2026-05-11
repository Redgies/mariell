import { _ as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, createTextVNode, Fragment, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LabCard",
  __ssrInlineRender: true,
  props: {
    tag: {},
    titleLead: {},
    titleEm: {},
    titleTrail: {},
    description: {},
    cta: {},
    href: {},
    icon: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: __props.href,
        class: "lab-card"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="lab-card__icon" aria-hidden="true" data-v-786e30e4${_scopeId}>`);
            if (__props.icon === "target") {
              _push2(`<svg viewBox="0 0 24 24" data-v-786e30e4${_scopeId}><circle cx="12" cy="12" r="9" data-v-786e30e4${_scopeId}></circle><circle cx="12" cy="12" r="5" data-v-786e30e4${_scopeId}></circle><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" data-v-786e30e4${_scopeId}></circle><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" data-v-786e30e4${_scopeId}></path></svg>`);
            } else if (__props.icon === "gauge") {
              _push2(`<svg viewBox="0 0 24 24" data-v-786e30e4${_scopeId}><path d="M3.5 16a8.5 8.5 0 0 1 17 0" data-v-786e30e4${_scopeId}></path><path d="M12 16l5-5" data-v-786e30e4${_scopeId}></path><circle cx="12" cy="16" r="1.4" fill="currentColor" stroke="none" data-v-786e30e4${_scopeId}></circle><path d="M3.5 16h2M18.5 16h2M12 6.5v2" data-v-786e30e4${_scopeId}></path></svg>`);
            } else if (__props.icon === "team") {
              _push2(`<svg viewBox="0 0 24 24" data-v-786e30e4${_scopeId}><circle cx="8.5" cy="8" r="2.6" data-v-786e30e4${_scopeId}></circle><circle cx="16" cy="9.5" r="2.2" data-v-786e30e4${_scopeId}></circle><path d="M3.5 19c.6-3 2.6-4.6 5-4.6s4.4 1.6 5 4.6" data-v-786e30e4${_scopeId}></path><path d="M14 19c.4-2.4 2-3.6 3.8-3.6s3.4 1.2 3.8 3.6" data-v-786e30e4${_scopeId}></path></svg>`);
            } else if (__props.icon === "bars") {
              _push2(`<svg viewBox="0 0 24 24" data-v-786e30e4${_scopeId}><path d="M3.5 20.5h17" data-v-786e30e4${_scopeId}></path><rect x="5.5" y="13" width="3" height="6" rx="0.5" data-v-786e30e4${_scopeId}></rect><rect x="10.5" y="9" width="3" height="10" rx="0.5" data-v-786e30e4${_scopeId}></rect><rect x="15.5" y="5" width="3" height="14" rx="0.5" data-v-786e30e4${_scopeId}></rect><path d="M5.5 5.5l4-2 4 2 5-3.5" data-v-786e30e4${_scopeId}></path></svg>`);
            } else if (__props.icon === "check") {
              _push2(`<svg viewBox="0 0 24 24" data-v-786e30e4${_scopeId}><rect x="4" y="3.5" width="16" height="17" rx="2" data-v-786e30e4${_scopeId}></rect><path d="M8 9l1.6 1.6L13 7.2" data-v-786e30e4${_scopeId}></path><path d="M15.5 9.2h2" data-v-786e30e4${_scopeId}></path><path d="M8 14l1.6 1.6L13 12.2" data-v-786e30e4${_scopeId}></path><path d="M15.5 14.2h2" data-v-786e30e4${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</span><span class="lab-card__tag" data-v-786e30e4${_scopeId}>${ssrInterpolate(__props.tag)}</span><div class="lab-card__body" data-v-786e30e4${_scopeId}><h3 class="lab-card__title" data-v-786e30e4${_scopeId}>${ssrInterpolate(__props.titleLead)}<span class="gradient-text italic" data-v-786e30e4${_scopeId}>${ssrInterpolate(__props.titleEm)}</span>`);
            if (__props.titleTrail) {
              _push2(`<!--[-->${ssrInterpolate(__props.titleTrail)}<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</h3><p class="lab-card__desc" data-v-786e30e4${_scopeId}>${ssrInterpolate(__props.description)}</p></div><span class="lab-card__cta" data-v-786e30e4${_scopeId}>${ssrInterpolate(__props.cta)} <svg viewBox="0 0 24 24" aria-hidden="true" data-v-786e30e4${_scopeId}><path d="M5 12h14M13 6l6 6-6 6" data-v-786e30e4${_scopeId}></path></svg></span>`);
          } else {
            return [
              createVNode("span", {
                class: "lab-card__icon",
                "aria-hidden": "true"
              }, [
                __props.icon === "target" ? (openBlock(), createBlock("svg", {
                  key: 0,
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("circle", {
                    cx: "12",
                    cy: "12",
                    r: "9"
                  }),
                  createVNode("circle", {
                    cx: "12",
                    cy: "12",
                    r: "5"
                  }),
                  createVNode("circle", {
                    cx: "12",
                    cy: "12",
                    r: "1.4",
                    fill: "currentColor",
                    stroke: "none"
                  }),
                  createVNode("path", { d: "M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" })
                ])) : __props.icon === "gauge" ? (openBlock(), createBlock("svg", {
                  key: 1,
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", { d: "M3.5 16a8.5 8.5 0 0 1 17 0" }),
                  createVNode("path", { d: "M12 16l5-5" }),
                  createVNode("circle", {
                    cx: "12",
                    cy: "16",
                    r: "1.4",
                    fill: "currentColor",
                    stroke: "none"
                  }),
                  createVNode("path", { d: "M3.5 16h2M18.5 16h2M12 6.5v2" })
                ])) : __props.icon === "team" ? (openBlock(), createBlock("svg", {
                  key: 2,
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("circle", {
                    cx: "8.5",
                    cy: "8",
                    r: "2.6"
                  }),
                  createVNode("circle", {
                    cx: "16",
                    cy: "9.5",
                    r: "2.2"
                  }),
                  createVNode("path", { d: "M3.5 19c.6-3 2.6-4.6 5-4.6s4.4 1.6 5 4.6" }),
                  createVNode("path", { d: "M14 19c.4-2.4 2-3.6 3.8-3.6s3.4 1.2 3.8 3.6" })
                ])) : __props.icon === "bars" ? (openBlock(), createBlock("svg", {
                  key: 3,
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", { d: "M3.5 20.5h17" }),
                  createVNode("rect", {
                    x: "5.5",
                    y: "13",
                    width: "3",
                    height: "6",
                    rx: "0.5"
                  }),
                  createVNode("rect", {
                    x: "10.5",
                    y: "9",
                    width: "3",
                    height: "10",
                    rx: "0.5"
                  }),
                  createVNode("rect", {
                    x: "15.5",
                    y: "5",
                    width: "3",
                    height: "14",
                    rx: "0.5"
                  }),
                  createVNode("path", { d: "M5.5 5.5l4-2 4 2 5-3.5" })
                ])) : __props.icon === "check" ? (openBlock(), createBlock("svg", {
                  key: 4,
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("rect", {
                    x: "4",
                    y: "3.5",
                    width: "16",
                    height: "17",
                    rx: "2"
                  }),
                  createVNode("path", { d: "M8 9l1.6 1.6L13 7.2" }),
                  createVNode("path", { d: "M15.5 9.2h2" }),
                  createVNode("path", { d: "M8 14l1.6 1.6L13 12.2" }),
                  createVNode("path", { d: "M15.5 14.2h2" })
                ])) : createCommentVNode("", true)
              ]),
              createVNode("span", { class: "lab-card__tag" }, toDisplayString(__props.tag), 1),
              createVNode("div", { class: "lab-card__body" }, [
                createVNode("h3", { class: "lab-card__title" }, [
                  createTextVNode(toDisplayString(__props.titleLead), 1),
                  createVNode("span", { class: "gradient-text italic" }, toDisplayString(__props.titleEm), 1),
                  __props.titleTrail ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    createTextVNode(toDisplayString(__props.titleTrail), 1)
                  ], 64)) : createCommentVNode("", true)
                ]),
                createVNode("p", { class: "lab-card__desc" }, toDisplayString(__props.description), 1)
              ]),
              createVNode("span", { class: "lab-card__cta" }, [
                createTextVNode(toDisplayString(__props.cta) + " ", 1),
                (openBlock(), createBlock("svg", {
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true"
                }, [
                  createVNode("path", { d: "M5 12h14M13 6l6 6-6 6" })
                ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LabCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-786e30e4"]]), { __name: "LabCard" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=LabCard-wGD4dlgD.mjs.map
