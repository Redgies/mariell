import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { hasInjectionContext, inject, defineComponent, shallowRef, h, resolveComponent, getCurrentInstance, computed, unref, useSSRContext, ref, Suspense, Fragment, createApp, mergeProps, watch, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, createVNode, createCommentVNode, provide, shallowReactive, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, reactive, effectScope, defineAsyncComponent, getCurrentScope, toRef, isReadonly, isRef, isShallow, isReactive, toRaw } from 'vue';
import { c as createError$1, n as hasProtocol, o as isScriptProtocol, l as joinURL, p as parseQuery, w as withQuery, s as sanitizeStatusCode, q as parseURL, t as encodePath, v as decodePath, x as getContext, y as withTrailingSlash, z as withoutTrailingSlash, $ as $fetch, A as executeAsync, B as defu } from '../nitro/nitro.mjs';
import { p as publicAssetsURL, b as baseURL } from '../routes/renderer.mjs';
import { RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderTeleport, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';

//#region src/utils.ts
function flatHooks(configHooks, hooks = {}, parentName) {
	for (const key in configHooks) {
		const subHook = configHooks[key];
		const name = parentName ? `${parentName}:${key}` : key;
		if (typeof subHook === "object" && subHook !== null) flatHooks(subHook, hooks, name);
		else if (typeof subHook === "function") hooks[name] = subHook;
	}
	return hooks;
}
const createTask = /* @__PURE__ */ (() => {
	if (console.createTask) return console.createTask;
	const defaultTask = { run: (fn) => fn() };
	return () => defaultTask;
})();
function callHooks(hooks, args, startIndex, task) {
	for (let i = startIndex; i < hooks.length; i += 1) try {
		const result = task ? task.run(() => hooks[i](...args)) : hooks[i](...args);
		if (result instanceof Promise) return result.then(() => callHooks(hooks, args, i + 1, task));
	} catch (error) {
		return Promise.reject(error);
	}
}
function serialTaskCaller(hooks, args, name) {
	if (hooks.length > 0) return callHooks(hooks, args, 0, createTask(name));
}
function parallelTaskCaller(hooks, args, name) {
	if (hooks.length > 0) {
		const task = createTask(name);
		return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
	}
}
function callEachWith(callbacks, arg0) {
	for (const callback of [...callbacks]) callback(arg0);
}
//#endregion
//#region src/hookable.ts
var Hookable = class {
	_hooks;
	_before;
	_after;
	_deprecatedHooks;
	_deprecatedMessages;
	constructor() {
		this._hooks = {};
		this._before = void 0;
		this._after = void 0;
		this._deprecatedMessages = void 0;
		this._deprecatedHooks = {};
		this.hook = this.hook.bind(this);
		this.callHook = this.callHook.bind(this);
		this.callHookWith = this.callHookWith.bind(this);
	}
	hook(name, function_, options = {}) {
		if (!name || typeof function_ !== "function") return () => {};
		const originalName = name;
		let dep;
		while (this._deprecatedHooks[name]) {
			dep = this._deprecatedHooks[name];
			name = dep.to;
		}
		if (dep && !options.allowDeprecated) {
			let message = dep.message;
			if (!message) message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
			if (!this._deprecatedMessages) this._deprecatedMessages = /* @__PURE__ */ new Set();
			if (!this._deprecatedMessages.has(message)) {
				console.warn(message);
				this._deprecatedMessages.add(message);
			}
		}
		if (!function_.name) try {
			Object.defineProperty(function_, "name", {
				get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
				configurable: true
			});
		} catch {}
		this._hooks[name] = this._hooks[name] || [];
		this._hooks[name].push(function_);
		return () => {
			if (function_) {
				this.removeHook(name, function_);
				function_ = void 0;
			}
		};
	}
	hookOnce(name, function_) {
		let _unreg;
		let _function = (...arguments_) => {
			if (typeof _unreg === "function") _unreg();
			_unreg = void 0;
			_function = void 0;
			return function_(...arguments_);
		};
		_unreg = this.hook(name, _function);
		return _unreg;
	}
	removeHook(name, function_) {
		const hooks = this._hooks[name];
		if (hooks) {
			const index = hooks.indexOf(function_);
			if (index !== -1) hooks.splice(index, 1);
			if (hooks.length === 0) this._hooks[name] = void 0;
		}
	}
	clearHook(name) {
		this._hooks[name] = void 0;
	}
	deprecateHook(name, deprecated) {
		this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
		const _hooks = this._hooks[name] || [];
		this._hooks[name] = void 0;
		for (const hook of _hooks) this.hook(name, hook);
	}
	deprecateHooks(deprecatedHooks) {
		for (const name in deprecatedHooks) this.deprecateHook(name, deprecatedHooks[name]);
	}
	addHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
		return () => {
			for (const unreg of removeFns) unreg();
			removeFns.length = 0;
		};
	}
	removeHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		for (const key in hooks) this.removeHook(key, hooks[key]);
	}
	removeAllHooks() {
		this._hooks = {};
	}
	callHook(name, ...args) {
		return this.callHookWith(serialTaskCaller, name, args);
	}
	callHookParallel(name, ...args) {
		return this.callHookWith(parallelTaskCaller, name, args);
	}
	callHookWith(caller, name, args) {
		const event = this._before || this._after ? {
			name,
			args,
			context: {}
		} : void 0;
		if (this._before) callEachWith(this._before, event);
		const result = caller(this._hooks[name] ? [...this._hooks[name]] : [], args, name);
		if (result instanceof Promise) return result.finally(() => {
			if (this._after && event) callEachWith(this._after, event);
		});
		if (this._after && event) callEachWith(this._after, event);
		return result;
	}
	beforeEach(function_) {
		this._before = this._before || [];
		this._before.push(function_);
		return () => {
			if (this._before !== void 0) {
				const index = this._before.indexOf(function_);
				if (index !== -1) this._before.splice(index, 1);
			}
		};
	}
	afterEach(function_) {
		this._after = this._after || [];
		this._after.push(function_);
		return () => {
			if (this._after !== void 0) {
				const index = this._after.indexOf(function_);
				if (index !== -1) this._after.splice(index, 1);
			}
		};
	}
};
function createHooks() {
	return new Hookable();
}

const siteConfig = {
  calendlyUrl: "https://calendly.com/chez-mariell/30min",
  ctaPrimary: "Contact Mariell",
  ctaHero: "Rencontrer Mariell",
  ctaPricing: "Rencontre avec Mariell",
  ctaFinal: "Partager son besoin \xE0 Mariell"
};
const navLinks = [
  { label: "Accueil", href: "#accueil" },
  { label: "Who is Mariell ?", href: "#who" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "Le Lab Mariell", href: "/lab", hasDropdown: true, badge: true }
];
const labDropdown = [
  { label: "D\xE9couvrir le Lab", href: "/lab", disabled: false },
  { label: "Demande stagiaire / alternance", href: "/lab/demande-stage-alternance", disabled: false },
  { label: "Guide des salaires Sales 2026", href: "/lab/guide-salaires-sales", disabled: false },
  { label: "Les 10 essentiels du recrutement Sales", href: "/lab/10-essentiels-recrutement-sales", disabled: false },
  { label: "\xC9tudes \u2014 bient\xF4t", href: "#", disabled: true }
];
const clients = Array.from({ length: 11 }, (_, i) => ({
  name: `Client ${i + 1}`,
  logo: `/logo_${i + 1}.png`
}));
const testimonials = [
  {
    name: "Julien Moreau",
    role: "Head of Sales, SaaS B2B",
    quote: "Mariell nous a trouv\xE9 un AE senior en 18 jours apr\xE8s 4 mois de recherche interne. Le profil \xE9tait top-tier, closing d\xE8s le premier trimestre."
  },
  {
    name: "Sophie Leclerc",
    role: "CEO, Scale-up Fintech",
    quote: "On a test\xE9 3 cabinets avant Mariell. La diff\xE9rence saute aux yeux : ils comprennent le m\xE9tier Sales parce qu'ils l'ont fait."
  },
  {
    name: "Antoine Dubois",
    role: "VP Sales, Cybers\xE9curit\xE9",
    quote: "Recrutement d'un Sales Director. Shortlist de 4 candidats, 3 \xE9taient excellents. On a embauch\xE9 celui qui a d\xE9j\xE0 d\xE9pass\xE9 ses quotas Q1."
  },
  {
    name: "\xC9milie Roux",
    role: "COO, MarTech",
    quote: "La transparence sur le pricing et le suivi \xE0 4 et 8 mois change tout. Pas de 'place and forget', vraie partnership."
  },
  {
    name: "Nicolas Perrin",
    role: "Founder, PropTech",
    quote: "Premier SDR recrut\xE9 via Mariell. En 6 mois il a g\xE9n\xE9r\xE9 plus de pipeline que mes 2 seniors pr\xE9c\xE9dents."
  }
];

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "deep": false };
const fetchDefaults = {};
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.4.2";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _state: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = /* @__PURE__ */ Symbol("layout-meta");
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext["~renderResponse"] = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
  return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
function encodeRoutePath(url) {
  const parsed = parseURL(url);
  return encodePath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  if (typeof error !== "string" && error.statusText) {
    error.message ??= error.statusText;
  }
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  Object.defineProperty(nuxtError, "status", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusCode,
    configurable: true
  });
  Object.defineProperty(nuxtError, "statusText", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusMessage,
    configurable: true
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const matcher = (m, p) => {
  return [];
};
const _routeRulesMatcher = (path) => defu({}, ...matcher().map((r) => r.data).reverse());
const routeRulesMatcher = _routeRulesMatcher;
function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  try {
    return routeRulesMatcher(path);
  } catch (e) {
    console.error("[nuxt] Error matching route rules.", e);
    return {};
  }
}
const __nuxt_page_meta = { layout: false };
const _routes = [
  {
    name: "lab-plan-de-sourcing-resultat-uuid",
    path: "/lab/plan-de-sourcing/resultat/:uuid()",
    meta: __nuxt_page_meta || {},
    component: () => import('./_uuid_-BxT4TE4H.mjs')
  },
  {
    name: "lab-demande-stage-alternance-confirmation",
    path: "/lab/demande-stage-alternance/confirmation",
    component: () => import('./confirmation-D1zkVij_.mjs')
  },
  {
    name: "lab-10-essentiels-recrutement-sales",
    path: "/lab/10-essentiels-recrutement-sales",
    component: () => import('./10-essentiels-recrutement-sales-D_QASBO4.mjs')
  },
  {
    name: "lab-demande-stage-alternance",
    path: "/lab/demande-stage-alternance",
    component: () => import('./index-CpCJSCFN.mjs')
  },
  {
    name: "lab-guide-salaires-sales",
    path: "/lab/guide-salaires-sales",
    component: () => import('./guide-salaires-sales-CZOdUUvQ.mjs')
  },
  {
    name: "lab-plan-de-sourcing",
    path: "/lab/plan-de-sourcing",
    component: () => import('./index-DbpHhjGN.mjs')
  },
  {
    name: "lab",
    path: "/lab",
    component: () => import('./index-CiAr9bgL.mjs')
  },
  {
    name: "mentions-legales",
    path: "/mentions-legales",
    component: () => import('./mentions-legales-C3td2xvU.mjs')
  },
  {
    name: "politique-confidentialite",
    path: "/politique-confidentialite",
    component: () => import('./politique-confidentialite-JdnKygwJ.mjs')
  },
  {
    name: "index",
    path: "/",
    component: () => import('./index-BRIKTurR.mjs')
  }
];
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    if (from === START_LOCATION) {
      return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
    }
    return new Promise((resolve) => {
      const doScroll = () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      };
      nuxtApp.hooks.hookOnce("page:loading:end", () => {
        const transitionPromise = nuxtApp["~transitionPromise"];
        if (transitionPromise) {
          transitionPromise.then(doScroll);
        } else {
          doScroll();
        }
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    status: result && (result.status || result.statusCode) || 404,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    router.afterEach((to, from) => {
      if (to.matched.at(-1)?.components?.default === from.matched.at(-1)?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = { sync: syncCurrentRoute };
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const error = /* @__PURE__ */ useError();
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    const hasDeferredRoute = false;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        const routeRules = getRouteRules({ path: to.path });
        if (routeRules.appMiddleware) {
          for (const key in routeRules.appMiddleware) {
            if (routeRules.appMiddleware[key]) {
              middlewareEntries.add(key);
            } else {
              middlewareEntries.delete(key);
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  status: 404,
                  statusText: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0 && !error.value) {
        return nuxtApp.runWithContext(() => showError(createError({
          status: 404,
          fatal: false,
          statusText: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        if (hasDeferredRoute) ;
        else {
          await router.replace({
            ...resolvedInitialRoute,
            force: true
          });
        }
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8
];
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "ScrollProgress",
  __ssrInlineRender: true,
  setup(__props) {
    const progress = ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left",
        style: [{ "background": "linear-gradient(90deg, #00ffff 0%, #8a2be2 50%, #ff00ff 100%)" }, { transform: `scaleX(${unref(progress)})` }],
        "aria-hidden": "true"
      }, _attrs))}></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ScrollProgress.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$6, { __name: "ScrollProgress" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "GradientBlobs",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        "aria-hidden": "true"
      }, _attrs))}><div class="blob blob-slow" style="${ssrRenderStyle({ "top": "-15%", "left": "-10%", "width": "780px", "height": "780px", "background": "radial-gradient(circle at 35% 35%, #00ffff 0%, transparent 62%)", "opacity": "0.55" })}"></div><div class="blob" style="${ssrRenderStyle({ "top": "-5%", "right": "-12%", "width": "700px", "height": "700px", "background": "radial-gradient(circle at 50% 50%, #ff00ff 0%, transparent 60%)", "opacity": "0.5" })}"></div><div class="blob blob-faster" style="${ssrRenderStyle({ "top": "30%", "left": "15%", "width": "720px", "height": "720px", "background": "radial-gradient(circle at 50% 50%, #8a2be2 0%, transparent 65%)", "opacity": "0.45" })}"></div><div class="blob blob-slow" style="${ssrRenderStyle({ "top": "40%", "right": "-8%", "width": "640px", "height": "640px", "background": "radial-gradient(circle at 50% 50%, #00ffff 0%, transparent 65%)", "opacity": "0.45" })}"></div><div class="blob" style="${ssrRenderStyle({ "bottom": "-10%", "left": "10%", "width": "820px", "height": "820px", "background": "radial-gradient(circle at 50% 50%, #ff00ff 0%, transparent 60%)", "opacity": "0.5" })}"></div><div class="blob blob-faster" style="${ssrRenderStyle({ "bottom": "-15%", "right": "-5%", "width": "680px", "height": "680px", "background": "radial-gradient(circle at 50% 50%, #00ffff 0%, transparent 65%)", "opacity": "0.4" })}"></div></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GradientBlobs.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$5, { __name: "GradientBlobs" });
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!unref(props.target) && unref(props.target) !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (unref(props.external)) {
        return true;
      }
      const path = unref(props.to) || unref(props.href) || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, unref(props.trailingSlash));
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to, viewTransition: unref(props.viewTransition) });
    const href = computed(() => {
      const effectiveTrailingSlash = unref(props.trailingSlash) ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return applyTrailingSlashBehavior(href2, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return router.resolve(to.value)?.href ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
      route: link?.route ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        await navigateTo(href.value, { replace: unref(props.replace), external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: async (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            try {
              const encodedHref = encodeRoutePath(href.value);
              return await (props.replace ? router.replace(encodedHref) : router.push(encodedHref));
            } finally {
            }
          }
        }, slots.default?.());
      };
    }
  });
}
const __nuxt_component_0 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const _imports_0 = publicAssetsURL("/logo_site.png");
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AppNavbar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const isHome = computed(() => route.path === "/");
    const resolveHref = (href) => href.startsWith("#") && !isHome.value ? `/${href}` : href;
    const isMobileMenuOpen = ref(false);
    const isLabOpen = ref(false);
    const isMobileLabOpen = ref(false);
    const navRef = ref(null);
    const closeMobile = () => {
      isMobileMenuOpen.value = false;
      isMobileLabOpen.value = false;
      isLabOpen.value = false;
    };
    watch(isMobileMenuOpen, (open) => {
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<header${ssrRenderAttrs(mergeProps({
        ref_key: "navRef",
        ref: navRef,
        class: "fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl"
      }, _attrs))}><nav class="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-10 lg:px-16" aria-label="Navigation principale"><a${ssrRenderAttr("href", resolveHref("#accueil"))} class="font-serif-jp text-2xl tracking-tight text-white transition-colors hover:text-white/90 md:text-[1.75rem]"><img${ssrRenderAttr("src", _imports_0)} alt="Mariell" class="h-11 w-auto"></a><ul class="hidden items-center gap-8 md:flex"><!--[-->`);
      ssrRenderList(unref(navLinks), (link) => {
        _push(`<li class="relative">`);
        if (link.href.startsWith("#")) {
          _push(`<a${ssrRenderAttr("href", resolveHref(link.href))} class="text-sm text-white/90 transition-colors hover:text-white" style="${ssrRenderStyle({ "font-family": "var(--font-grotesk)", "font-weight": "600" })}">${ssrInterpolate(link.label)}</a>`);
        } else {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: link.href,
            class: "relative inline-flex items-center gap-1.5 text-sm text-white/90 transition-colors hover:text-white",
            style: { "font-family": "var(--font-grotesk)", "font-weight": "600" },
            "aria-haspopup": link.hasDropdown ? "true" : void 0,
            "aria-expanded": link.hasDropdown ? unref(isLabOpen) : void 0,
            onClick: closeMobile
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(link.label)} `);
                if (link.badge) {
                  _push2(`<span class="relative ml-0.5 inline-flex h-1.5 w-1.5" aria-label="Nouveau"${_scopeId}><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70"${_scopeId}></span><span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500"${_scopeId}></span></span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (link.hasDropdown) {
                  _push2(`<svg class="${ssrRenderClass([{ "rotate-180": unref(isLabOpen) }, "ml-0.5 h-3 w-3 transition-transform"])}" viewBox="0 0 10 6" fill="none" aria-hidden="true"${_scopeId}><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"${_scopeId}></path></svg>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  createTextVNode(toDisplayString(link.label) + " ", 1),
                  link.badge ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "relative ml-0.5 inline-flex h-1.5 w-1.5",
                    "aria-label": "Nouveau"
                  }, [
                    createVNode("span", { class: "absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" }),
                    createVNode("span", { class: "relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" })
                  ])) : createCommentVNode("", true),
                  link.hasDropdown ? (openBlock(), createBlock("svg", {
                    key: 1,
                    class: ["ml-0.5 h-3 w-3 transition-transform", { "rotate-180": unref(isLabOpen) }],
                    viewBox: "0 0 10 6",
                    fill: "none",
                    "aria-hidden": "true"
                  }, [
                    createVNode("path", {
                      d: "M1 1l4 4 4-4",
                      stroke: "currentColor",
                      "stroke-width": "1.6",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    })
                  ], 2)) : createCommentVNode("", true)
                ];
              }
            }),
            _: 2
          }, _parent));
        }
        if (link.hasDropdown) {
          if (unref(isLabOpen)) {
            _push(`<div class="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl shadow-black/50"><ul class="py-2"><!--[-->`);
            ssrRenderList(unref(labDropdown), (item) => {
              _push(`<li>`);
              if (!item.disabled) {
                _push(ssrRenderComponent(_component_NuxtLink, {
                  to: item.href,
                  class: "block px-4 py-2.5 text-sm text-white/85 transition-colors hover:bg-white/5 hover:text-white",
                  style: { "font-family": "var(--font-grotesk)", "font-weight": "500" },
                  onClick: closeMobile
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`${ssrInterpolate(item.label)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(item.label), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              } else {
                _push(`<span class="block px-4 py-2.5 text-sm text-white/40" style="${ssrRenderStyle({ "font-family": "var(--font-grotesk)", "font-weight": "300" })}">${ssrInterpolate(item.label)}</span>`);
              }
              _push(`</li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul><a${ssrRenderAttr("href", unref(siteConfig).calendlyUrl)} class="gradient-cta hidden rounded-full px-5 py-2.5 text-sm text-black md:inline-flex" style="${ssrRenderStyle({ "font-family": "var(--font-grotesk)", "font-weight": "600" })}">${ssrInterpolate(unref(siteConfig).ctaPrimary)}</a><button type="button" class="relative z-[60] flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden"${ssrRenderAttr("aria-expanded", unref(isMobileMenuOpen))} aria-label="Ouvrir le menu">`);
      if (!unref(isMobileMenuOpen)) {
        _push(`<svg class="pointer-events-none" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>`);
      } else {
        _push(`<svg class="pointer-events-none" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>`);
      }
      _push(`</button></nav>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(isMobileMenuOpen)) {
          _push2(`<div class="fixed inset-x-0 top-20 bottom-0 z-[55] overflow-y-auto border-t border-white/10 bg-black/95 backdrop-blur-xl md:hidden"><ul class="flex flex-col gap-1 px-6 py-8"><!--[-->`);
          ssrRenderList(unref(navLinks), (link) => {
            _push2(`<li>`);
            if (link.href.startsWith("#")) {
              _push2(`<a${ssrRenderAttr("href", resolveHref(link.href))} class="block rounded-lg px-4 py-4 text-lg text-white transition-colors hover:bg-white/5" style="${ssrRenderStyle({ "font-family": "var(--font-grotesk)", "font-weight": "600" })}">${ssrInterpolate(link.label)}</a>`);
            } else {
              _push2(`<div><div class="flex items-stretch">`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: link.href,
                class: "flex flex-1 items-center gap-2 rounded-lg px-4 py-4 text-lg text-white transition-colors hover:bg-white/5",
                style: { "font-family": "var(--font-grotesk)", "font-weight": "600" },
                onClick: closeMobile
              }, {
                default: withCtx((_, _push3, _parent2, _scopeId) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(link.label)} `);
                    if (link.badge) {
                      _push3(`<span class="relative ml-0.5 inline-flex h-2 w-2" aria-label="Nouveau"${_scopeId}><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70"${_scopeId}></span><span class="relative inline-flex h-2 w-2 rounded-full bg-red-500"${_scopeId}></span></span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      createTextVNode(toDisplayString(link.label) + " ", 1),
                      link.badge ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "relative ml-0.5 inline-flex h-2 w-2",
                        "aria-label": "Nouveau"
                      }, [
                        createVNode("span", { class: "absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" }),
                        createVNode("span", { class: "relative inline-flex h-2 w-2 rounded-full bg-red-500" })
                      ])) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 2
              }, _parent));
              if (link.hasDropdown) {
                _push2(`<button type="button" class="flex w-12 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/5 hover:text-white"${ssrRenderAttr("aria-expanded", unref(isMobileLabOpen))} aria-label="Voir le sous-menu"><svg class="${ssrRenderClass([{ "rotate-180": unref(isMobileLabOpen) }, "h-4 w-4 transition-transform"])}" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
              if (link.hasDropdown && unref(isMobileLabOpen)) {
                _push2(`<div class="mt-1 flex flex-col gap-0.5 pl-4"><!--[-->`);
                ssrRenderList(unref(labDropdown), (item) => {
                  _push2(`<!--[-->`);
                  if (!item.disabled) {
                    _push2(ssrRenderComponent(_component_NuxtLink, {
                      to: item.href,
                      class: "block rounded-md px-4 py-3 text-base text-white/80 transition-colors hover:bg-white/5 hover:text-white",
                      style: { "font-family": "var(--font-grotesk)", "font-weight": "500" },
                      onClick: closeMobile
                    }, {
                      default: withCtx((_, _push3, _parent2, _scopeId) => {
                        if (_push3) {
                          _push3(`${ssrInterpolate(item.label)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(item.label), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent));
                  } else {
                    _push2(`<span class="block rounded-md px-4 py-3 text-base text-white/40" style="${ssrRenderStyle({ "font-family": "var(--font-grotesk)", "font-weight": "300" })}">${ssrInterpolate(item.label)}</span>`);
                  }
                  _push2(`<!--]-->`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            }
            _push2(`</li>`);
          });
          _push2(`<!--]--><li class="mt-6 px-2"><a${ssrRenderAttr("href", unref(siteConfig).calendlyUrl)} class="gradient-cta flex w-full items-center justify-center rounded-full px-5 py-4 text-base text-black" style="${ssrRenderStyle({ "font-family": "var(--font-grotesk)", "font-weight": "600" })}">${ssrInterpolate(unref(siteConfig).ctaPrimary)}</a></li></ul></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</header>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppNavbar.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$4, { __name: "AppNavbar" });
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_3 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AppFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "relative border-t border-white/8 bg-black px-5 pt-12 pb-6 md:px-10 lg:px-16" }, _attrs))}><div class="mx-auto max-w-7xl"><div class="grid grid-cols-1 gap-8 pb-10 md:grid-cols-[2fr_1fr_1fr] md:gap-12"><div><a href="#accueil"><img${ssrRenderAttr("src", _imports_0)} alt="Mariell" class="block h-9 w-auto"></a><p class="mt-4 max-w-md text-[0.9rem] leading-[1.6] text-white/55" style="${ssrRenderStyle({ "font-family": "var(--font-grotesk)", "font-weight": "300" })}"> Cabinet de recrutement Sales premium. Paris — mais on chasse partout où vos meilleurs profils se cachent. </p></div><div><p class="font-mono-num mb-3 text-[0.7rem] uppercase tracking-[0.24em] text-white/40"> Navigation </p><ul class="flex flex-col gap-2 text-[0.9rem]" style="${ssrRenderStyle({ "font-family": "var(--font-grotesk)", "font-weight": "300" })}"><li><a href="#accueil" class="text-white/75 transition-colors hover:text-white">Accueil</a></li><li><a href="#who" class="text-white/75 transition-colors hover:text-white">Who is Mariell ?</a></li><li><a href="#process-section" class="text-white/75 transition-colors hover:text-white">Process</a></li><li><a href="#pricing" class="text-white/75 transition-colors hover:text-white">Pricing</a></li></ul></div><div><p class="font-mono-num mb-3 text-[0.7rem] uppercase tracking-[0.24em] text-white/40"> Légal </p><ul class="flex flex-col gap-2 text-[0.9rem]" style="${ssrRenderStyle({ "font-family": "var(--font-grotesk)", "font-weight": "300" })}"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/mentions-legales",
        class: "text-white/75 transition-colors hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Mentions légales`);
          } else {
            return [
              createTextVNode("Mentions légales")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/politique-confidentialite",
        class: "text-white/75 transition-colors hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Politique de protection des données`);
          } else {
            return [
              createTextVNode("Politique de protection des données")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div></div><div class="flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-5"><p class="font-mono-num text-[0.72rem] tracking-[0.2em] text-white/40"> © ${ssrInterpolate(unref(year))} MARIELL · TOUS DROITS RÉSERVÉS </p><p class="text-[0.95rem] italic text-white/55" style="${ssrRenderStyle({ "font-family": "var(--font-grotesk)", "font-weight": "500" })}"> Recruter n&#39;est pas un pari. </p></div></div></footer>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppFooter.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$3, { __name: "AppFooter" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const isFocusedTool = computed(
      () => route.path.startsWith("/lab/demande-stage-alternance") || route.path.startsWith("/lab/plan-de-sourcing") || route.path.startsWith("/lab/evaluation-attractivite")
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ScrollProgress = __nuxt_component_0$1;
      const _component_GradientBlobs = __nuxt_component_1;
      const _component_AppNavbar = __nuxt_component_2;
      const _component_NuxtPage = __nuxt_component_3;
      const _component_AppFooter = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative min-h-screen text-white" }, _attrs))}>`);
      if (!unref(isFocusedTool)) {
        _push(ssrRenderComponent(_component_ScrollProgress, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!unref(isFocusedTool)) {
        _push(ssrRenderComponent(_component_GradientBlobs, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!unref(isFocusedTool)) {
        _push(ssrRenderComponent(_component_AppNavbar, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      if (!unref(isFocusedTool)) {
        _push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    const status = Number(_error.statusCode || 500);
    const is404 = status === 404;
    const statusText = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-Ew_xAwZN.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-Cwsw3Q8W.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ status: unref(status), statusText: unref(statusText), statusCode: unref(status), statusMessage: unref(statusText), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info)?.catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = ((ssrContext) => entry(ssrContext));

const server = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	_: __nuxt_component_0,
	a: _imports_0,
	b: useRuntimeConfig,
	c: useNuxtApp,
	d: asyncDataDefaults,
	default: entry_default,
	e: createError,
	f: fetchDefaults,
	n: navigateTo,
	u: useRoute
}, Symbol.toStringTag, { value: 'Module' }));

export { __nuxt_component_0 as _, _imports_0 as a, useRuntimeConfig as b, useNuxtApp as c, asyncDataDefaults as d, createError as e, fetchDefaults as f, clients as g, server as h, navigateTo as n, siteConfig as s, testimonials as t, useRoute as u };
//# sourceMappingURL=server.mjs.map
