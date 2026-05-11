import { _ as __nuxt_component_0$1, a as _imports_0 } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, openBlock, createBlock, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LabToolShell",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "lab-tool-root" }, _attrs))} data-v-a12c4124><div class="page-bg" aria-hidden="true" data-v-a12c4124><div class="blob blob-a blob-slow" data-v-a12c4124></div><div class="blob blob-b" data-v-a12c4124></div></div><nav class="top-nav" data-v-a12c4124><div class="top-nav-inner" data-v-a12c4124>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "top-nav-logo",
        "aria-label": "Mariell"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Mariell" data-v-a12c4124${_scopeId}>`);
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
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/lab",
        class: "top-nav-back"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a12c4124${_scopeId}><path d="M19 12H5M12 19l-7-7 7-7" data-v-a12c4124${_scopeId}></path></svg> Retour au Lab `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "1.7",
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
      }, _parent));
      _push(`</div></nav>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LabToolShell.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-a12c4124"]]), { __name: "LabToolShell" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=LabToolShell-KFgobw02.mjs.map
