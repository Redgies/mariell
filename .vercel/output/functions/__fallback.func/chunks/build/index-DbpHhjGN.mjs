import { _ as __nuxt_component_0 } from './LabToolShell-KFgobw02.mjs';
import { _ as __nuxt_component_0$1, b as useRuntimeConfig, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$1 } from './NuxtTurnstile-B7o5SLEB.mjs';
import { defineComponent, computed, reactive, ref, watch, withCtx, unref, createTextVNode, isRef, createVNode, Transition, openBlock, createBlock, toDisplayString, createCommentVNode, withModifiers, withDirectives, vModelText, vModelSelect, Fragment, renderList, vModelRadio, vModelCheckbox, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
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
import 'perfect-debounce';
import '@vue/shared';
import 'unhead/scripts';
import '@vueuse/core';
import '@vueuse/shared';

function usePlanSourcing() {
  const isLoading = ref(false);
  const error = ref(null);
  const errorCode = ref(null);
  async function generate(payload) {
    isLoading.value = true;
    error.value = null;
    errorCode.value = null;
    try {
      const result = await $fetch("/api/lab/plan-de-sourcing/generate", {
        method: "POST",
        body: payload
      });
      if (result.deferred) {
        return result;
      }
      return { success: true, deferred: false, ...result };
    } catch (err) {
      const data = err?.data;
      const code = data?.statusMessage || err?.statusMessage || "INTERNAL_ERROR";
      const message = data?.message || err?.message || "Une erreur technique s'est produite. Merci de réessayer.";
      errorCode.value = code;
      error.value = message;
      return { success: false, code, message };
    } finally {
      isLoading.value = false;
    }
  }
  return { isLoading, error, errorCode, generate };
}
const NBSP = " ";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Plan de sourcing LinkedIn personnalisé — Mariell · Le Lab",
      meta: [
        {
          name: "description",
          content: "Une stratégie de chasse complète, calibrée sur votre contexte. Générée en moins de 60 secondes par l'IA Mariell."
        }
      ]
    });
    const config = useRuntimeConfig();
    const hasTurnstile = computed(() => {
      const t = config.public.turnstile;
      return Boolean(t?.siteKey);
    });
    const ROLES = [
      "SDR / BDR",
      "Inside Sales",
      "Field Sales / Outside Sales",
      "Business Developer Full Cycle",
      "Account Executive — PME / SMB",
      "Account Executive — Mid-Market",
      "Account Executive — Enterprise",
      "Sales Engineer / Pre-Sales",
      "Account Manager",
      "Strategic Account Manager / Key Account Manager",
      "Customer Success Manager",
      "Sales Ops / RevOps",
      "Channel / Partner Manager",
      "Sales Manager / Team Lead",
      "Head of Sales",
      "VP Sales / CRO",
      "Autre"
    ];
    const SECTORS = [
      "SaaS B2B",
      "Conseil IT / ESN",
      "Industrie / B2B classique",
      "Cyber / Sécurité",
      "Fintech",
      "Healthtech",
      "Services",
      "Autre"
    ];
    const form = reactive({
      prenom: "",
      nom: "",
      email: "",
      phoneCc: "+33",
      phoneNumber: "",
      entreprise: "",
      posteRecherche: "",
      posteAutre: "",
      seniorite: "",
      objectif: "",
      localisation: "",
      remote: false,
      secteur: "",
      secteurAutre: "",
      fixe: "",
      ote: "",
      siteEntreprise: "",
      contenuFichePoste: "",
      rgpd: false
    });
    const turnstileToken = ref(hasTurnstile.value ? "" : "dev-stub");
    const turnstile = ref(null);
    function resetTurnstile() {
      turnstile.value?.reset?.();
      turnstileToken.value = hasTurnstile.value ? "" : "dev-stub";
    }
    const errors = reactive({
      prenom: null,
      nom: null,
      email: null,
      phone: null,
      entreprise: null,
      posteRecherche: null,
      posteAutre: null,
      seniorite: null,
      objectif: null,
      localisation: null,
      secteur: null,
      secteurAutre: null,
      fixe: null,
      ote: null,
      siteEntreprise: null,
      contenuFichePoste: null,
      rgpd: null
    });
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const URL_RE = /^https?:\/\//i;
    function formatNumberFr(raw) {
      const digits = raw.replace(/\D+/g, "");
      if (!digits) return "";
      return digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
    }
    function stripNumber(s) {
      const digits = s.replace(/\D+/g, "");
      if (!digits) return null;
      return parseInt(digits, 10);
    }
    watch(() => form.fixe, (v) => {
      const formatted = formatNumberFr(v);
      if (formatted !== form.fixe) form.fixe = formatted;
    });
    watch(() => form.ote, (v) => {
      const formatted = formatNumberFr(v);
      if (formatted !== form.ote) form.ote = formatted;
    });
    function validateField(key) {
      const t = (s) => s.trim();
      switch (key) {
        case "prenom":
          return t(form.prenom).length >= 2 ? null : "Champ obligatoire (min. 2 caractères).";
        case "nom":
          return t(form.nom).length >= 2 ? null : "Champ obligatoire (min. 2 caractères).";
        case "email": {
          const v = t(form.email);
          if (!v) return "Champ obligatoire.";
          if (!EMAIL_RE.test(v)) return "Email invalide.";
          return null;
        }
        case "phone": {
          const v = t(form.phoneNumber);
          if (!v) return "Champ obligatoire.";
          if (v.replace(/\D/g, "").length < 8) return "Numéro de téléphone invalide.";
          return null;
        }
        case "entreprise":
          return t(form.entreprise).length >= 2 ? null : "Champ obligatoire.";
        case "posteRecherche":
          return form.posteRecherche ? null : "Sélectionnez un intitulé de poste.";
        case "posteAutre":
          if (form.posteRecherche !== "Autre") return null;
          return t(form.posteAutre) ? null : "Précisez l'intitulé du poste.";
        case "seniorite":
          return form.seniorite ? null : "Sélectionnez un niveau de séniorité.";
        case "objectif":
          return form.objectif ? null : "Sélectionnez un objectif.";
        case "localisation":
          return t(form.localisation).length >= 2 ? null : "Champ obligatoire.";
        case "secteur":
          return form.secteur ? null : "Sélectionnez un secteur.";
        case "secteurAutre":
          if (form.secteur !== "Autre") return null;
          return t(form.secteurAutre) ? null : "Précisez votre secteur.";
        case "fixe": {
          const n = stripNumber(form.fixe);
          if (n === null) return "Champ obligatoire.";
          if (n < 15e3 || n > 5e5) return "Le fixe doit être entre 15 000 € et 500 000 €.";
          return null;
        }
        case "ote": {
          const n = stripNumber(form.ote);
          if (n === null) return "Champ obligatoire.";
          if (n < 0 || n > 8e5) return "L'OTE doit être entre 0 € et 800 000 €.";
          const f = stripNumber(form.fixe);
          if (f !== null && n < f) return "L'OTE doit être supérieur ou égal au fixe.";
          return null;
        }
        case "siteEntreprise": {
          const v = t(form.siteEntreprise);
          if (!v) return null;
          const candidate = URL_RE.test(v) ? v : `https://${v}`;
          try {
            new URL(candidate);
            return null;
          } catch {
            return "URL invalide.";
          }
        }
        case "contenuFichePoste":
          return t(form.contenuFichePoste).length <= 5e3 ? null : "5000 caractères maximum.";
        case "rgpd":
          return form.rgpd ? null : "Vous devez accepter la politique de confidentialité.";
      }
    }
    function onBlur(key) {
      errors[key] = validateField(key);
    }
    function clearError(key) {
      if (errors[key]) errors[key] = null;
    }
    watch(() => form.posteRecherche, (v) => {
      if (v !== "Autre") {
        form.posteAutre = "";
        errors.posteAutre = null;
      }
    });
    watch(() => form.secteur, (v) => {
      if (v !== "Autre") {
        form.secteurAutre = "";
        errors.secteurAutre = null;
      }
    });
    const fichePosteLen = computed(() => form.contenuFichePoste.length);
    const counterClass = computed(() => {
      const n = fichePosteLen.value;
      if (n >= 5e3) return "counter--alert";
      if (n >= 4500) return "counter--warn";
      return "";
    });
    const comboOpen = ref(false);
    const comboSearch = ref("");
    const filteredRoles = computed(() => {
      const f = comboSearch.value.trim().toLowerCase();
      if (!f) return ROLES.map((label, i) => ({ label, num: i + 1 }));
      return ROLES.map((label, i) => ({ label, num: i + 1 })).filter(({ label }) => label.toLowerCase().includes(f));
    });
    function selectRole(label) {
      form.posteRecherche = label;
      comboOpen.value = false;
      comboSearch.value = "";
      errors.posteRecherche = null;
    }
    const isFormReady = computed(() => {
      if (!form.prenom.trim() || !form.nom.trim()) return false;
      if (!EMAIL_RE.test(form.email)) return false;
      if (form.phoneNumber.replace(/\D/g, "").length < 8) return false;
      if (!form.entreprise.trim()) return false;
      if (!form.posteRecherche) return false;
      if (form.posteRecherche === "Autre" && !form.posteAutre.trim()) return false;
      if (!form.seniorite || !form.objectif || !form.localisation.trim()) return false;
      if (!form.secteur) return false;
      if (form.secteur === "Autre" && !form.secteurAutre.trim()) return false;
      const f = stripNumber(form.fixe);
      const o = stripNumber(form.ote);
      if (f === null || f < 15e3 || f > 5e5) return false;
      if (o === null || o > 8e5 || o < f) return false;
      if (!form.rgpd) return false;
      if (!turnstileToken.value) return false;
      return true;
    });
    const { isLoading, generate } = usePlanSourcing();
    const globalAlert = ref(null);
    const ALERT_BY_CODE = {
      TURNSTILE_FAILED: {
        title: "Vérification de sécurité échouée.",
        text: "Merci de rafraîchir la page et réessayer."
      },
      INTERNAL_ERROR: {
        title: "Une erreur technique s'est produite.",
        text: `Votre demande n'a pas pu être enregistrée. Merci de réessayer dans quelques minutes, ou de nous contacter directement à <a href="mailto:bonjour@mariell.fr">bonjour@mariell.fr</a>.`
      }
    };
    async function onSubmit() {
      Object.keys(errors).forEach((k) => {
        errors[k] = validateField(k);
      });
      const hasErrors = Object.values(errors).some((e) => e);
      if (hasErrors) {
        globalAlert.value = null;
        return;
      }
      const payload = {
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        email: form.email.trim(),
        telephone: `${form.phoneCc} ${form.phoneNumber.trim()}`,
        entreprise: form.entreprise.trim(),
        posteRecherche: form.posteRecherche,
        posteRecherchePrecisionAutre: form.posteRecherche === "Autre" ? form.posteAutre.trim() : void 0,
        seniorite: form.seniorite,
        objectifPoste: form.objectif,
        localisation: form.localisation.trim(),
        remotePossible: form.remote,
        secteur: form.secteur,
        secteurPrecisionAutre: form.secteur === "Autre" ? form.secteurAutre.trim() : void 0,
        fixe: stripNumber(form.fixe),
        ote: stripNumber(form.ote),
        siteEntreprise: form.siteEntreprise.trim() || void 0,
        contenuFichePoste: form.contenuFichePoste.trim() || void 0,
        consentementRgpd: true,
        turnstileToken: turnstileToken.value
      };
      globalAlert.value = null;
      const result = await generate(payload);
      if (result.success === false) {
        resetTurnstile();
        const cfg = ALERT_BY_CODE[result.code] || ALERT_BY_CODE.INTERNAL_ERROR;
        globalAlert.value = cfg;
        (void 0).scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (result.deferred) {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem("plan-sourcing-deferred", JSON.stringify({
            deferredId: result.deferredId,
            message: result.message,
            email: form.email.trim()
          }));
        }
        await navigateTo("/lab/plan-de-sourcing/resultat/deferred");
        return;
      }
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(`plan-sourcing-cache:${result.uuid}`, JSON.stringify({
          content: result.plan,
          cachedAt: Date.now()
        }));
      }
      await navigateTo(result.redirectUrl);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LabToolShell = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_NuxtTurnstile = _sfc_main$1;
      _push(ssrRenderComponent(_component_LabToolShell, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main class="page" data-v-06553b51${_scopeId}><div class="shell" data-v-06553b51${_scopeId}>`);
            if (unref(globalAlert)) {
              _push2(`<div class="global-alert" role="alert" data-v-06553b51${_scopeId}><span class="global-alert__mark" aria-hidden="true" data-v-06553b51${_scopeId}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-06553b51${_scopeId}><line x1="12" y1="8" x2="12" y2="13" data-v-06553b51${_scopeId}></line><line x1="12" y1="16.5" x2="12" y2="17" data-v-06553b51${_scopeId}></line></svg></span><div class="global-alert__body" data-v-06553b51${_scopeId}><h3 class="global-alert__title" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(globalAlert).title)}</h3><p class="global-alert__text" data-v-06553b51${_scopeId}>${unref(globalAlert).text ?? ""}</p></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<section class="header" data-v-06553b51${_scopeId}><div class="header__eyebrow" data-v-06553b51${_scopeId}><span class="eyebrow-cyan" data-v-06553b51${_scopeId}>Outil n°2 · Le Lab Mariell</span></div><h1 class="header__title" data-v-06553b51${_scopeId}> Plan de sourcing LinkedIn <em data-v-06553b51${_scopeId}>personnalisé.</em></h1><p class="header__sub" data-v-06553b51${_scopeId}> Une stratégie de chasse complète, calibrée sur votre contexte. Générée en moins de 60 secondes. </p><div class="header__meta" data-v-06553b51${_scopeId}><span class="dot" aria-hidden="true" data-v-06553b51${_scopeId}></span><span data-v-06553b51${_scopeId}>Gratuit · Sans inscription · &lt; 60 secondes</span></div></section><aside class="quality-notice" role="note" aria-label="Conseil avant de remplir" data-v-06553b51${_scopeId}><span class="quality-notice__icon" aria-hidden="true" data-v-06553b51${_scopeId}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-v-06553b51${_scopeId}><circle cx="12" cy="12" r="9.5" data-v-06553b51${_scopeId}></circle><path d="M12 8v5" data-v-06553b51${_scopeId}></path><circle cx="12" cy="16.2" r="0.7" fill="currentColor" stroke="none" data-v-06553b51${_scopeId}></circle></svg></span><p class="quality-notice__body" data-v-06553b51${_scopeId}><strong data-v-06553b51${_scopeId}>La qualité de la réponse dépend de votre formulaire.</strong> Veillez à partager <em data-v-06553b51${_scopeId}>un maximum d&#39;informations avec précision</em> pour obtenir le meilleur résultat. </p></aside><form novalidate data-v-06553b51${_scopeId}><section class="block" data-v-06553b51${_scopeId}><header class="block__head" data-v-06553b51${_scopeId}><span class="block__num" data-v-06553b51${_scopeId}>01</span><h2 class="block__title" data-v-06553b51${_scopeId}>Identité</h2></header><div class="grid grid--2" data-v-06553b51${_scopeId}><div class="${ssrRenderClass([{ "field--error": unref(errors).prenom }, "field"])}" data-v-06553b51${_scopeId}><label class="field__label" for="prenom" data-v-06553b51${_scopeId}>Prénom <span class="req" data-v-06553b51${_scopeId}>*</span></label><input id="prenom"${ssrRenderAttr("value", unref(form).prenom)} class="ctrl" type="text" autocomplete="given-name" placeholder="Marie" data-v-06553b51${_scopeId}><span class="field__error" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).prenom || "Champ obligatoire")}</span></div><div class="${ssrRenderClass([{ "field--error": unref(errors).nom }, "field"])}" data-v-06553b51${_scopeId}><label class="field__label" for="nom" data-v-06553b51${_scopeId}>Nom <span class="req" data-v-06553b51${_scopeId}>*</span></label><input id="nom"${ssrRenderAttr("value", unref(form).nom)} class="ctrl" type="text" autocomplete="family-name" placeholder="Dupont" data-v-06553b51${_scopeId}><span class="field__error" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).nom || "Champ obligatoire")}</span></div><div class="${ssrRenderClass([{ "field--error": unref(errors).email }, "field grid__full"])}" data-v-06553b51${_scopeId}><label class="field__label" for="email" data-v-06553b51${_scopeId}>Adresse mail <span class="req" data-v-06553b51${_scopeId}>*</span></label><input id="email"${ssrRenderAttr("value", unref(form).email)} class="ctrl" type="email" autocomplete="email" placeholder="marie.dupont@entreprise.com" data-v-06553b51${_scopeId}><span class="field__error" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).email || "Email invalide")}</span></div><div class="${ssrRenderClass([{ "field--error": unref(errors).phone }, "field grid__full"])}" data-v-06553b51${_scopeId}><label class="field__label" for="phone" data-v-06553b51${_scopeId}>Numéro de téléphone <span class="req" data-v-06553b51${_scopeId}>*</span></label><div class="tel-wrap" data-v-06553b51${_scopeId}><div class="tel-cc" data-v-06553b51${_scopeId}><select aria-label="Indicatif pays" data-v-06553b51${_scopeId}><option value="+33" data-v-06553b51${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+33") : ssrLooseEqual(unref(form).phoneCc, "+33")) ? " selected" : ""}${_scopeId}>FR +33</option><option value="+32" data-v-06553b51${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+32") : ssrLooseEqual(unref(form).phoneCc, "+32")) ? " selected" : ""}${_scopeId}>BE +32</option><option value="+41" data-v-06553b51${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+41") : ssrLooseEqual(unref(form).phoneCc, "+41")) ? " selected" : ""}${_scopeId}>CH +41</option><option value="+44" data-v-06553b51${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+44") : ssrLooseEqual(unref(form).phoneCc, "+44")) ? " selected" : ""}${_scopeId}>UK +44</option><option value="+49" data-v-06553b51${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+49") : ssrLooseEqual(unref(form).phoneCc, "+49")) ? " selected" : ""}${_scopeId}>DE +49</option><option value="+34" data-v-06553b51${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+34") : ssrLooseEqual(unref(form).phoneCc, "+34")) ? " selected" : ""}${_scopeId}>ES +34</option><option value="+39" data-v-06553b51${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+39") : ssrLooseEqual(unref(form).phoneCc, "+39")) ? " selected" : ""}${_scopeId}>IT +39</option><option value="+31" data-v-06553b51${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+31") : ssrLooseEqual(unref(form).phoneCc, "+31")) ? " selected" : ""}${_scopeId}>NL +31</option><option value="+352" data-v-06553b51${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+352") : ssrLooseEqual(unref(form).phoneCc, "+352")) ? " selected" : ""}${_scopeId}>LU +352</option><option value="+351" data-v-06553b51${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+351") : ssrLooseEqual(unref(form).phoneCc, "+351")) ? " selected" : ""}${_scopeId}>PT +351</option><option value="+353" data-v-06553b51${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+353") : ssrLooseEqual(unref(form).phoneCc, "+353")) ? " selected" : ""}${_scopeId}>IE +353</option></select></div><input id="phone"${ssrRenderAttr("value", unref(form).phoneNumber)} class="tel-input" type="tel" autocomplete="tel-national" placeholder="06 12 34 56 78" data-v-06553b51${_scopeId}></div><span class="field__error" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).phone || "Numéro de téléphone invalide.")}</span></div><div class="${ssrRenderClass([{ "field--error": unref(errors).entreprise }, "field grid__full"])}" data-v-06553b51${_scopeId}><label class="field__label" for="entreprise" data-v-06553b51${_scopeId}>Entreprise <span class="req" data-v-06553b51${_scopeId}>*</span></label><input id="entreprise"${ssrRenderAttr("value", unref(form).entreprise)} class="ctrl" type="text" autocomplete="organization" placeholder="Nom de votre entreprise" data-v-06553b51${_scopeId}><span class="field__error" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).entreprise || "Champ obligatoire")}</span></div></div></section><section class="block" data-v-06553b51${_scopeId}><header class="block__head" data-v-06553b51${_scopeId}><span class="block__num" data-v-06553b51${_scopeId}>02</span><h2 class="block__title" data-v-06553b51${_scopeId}>Le poste à pourvoir</h2></header><div class="grid" data-v-06553b51${_scopeId}><div class="${ssrRenderClass([{ "field--error": unref(errors).posteRecherche }, "field"])}" data-v-06553b51${_scopeId}><label class="field__label" data-v-06553b51${_scopeId}>Poste recherché <span class="req" data-v-06553b51${_scopeId}>*</span></label><div id="jobtitle-combo" class="combo" data-v-06553b51${_scopeId}><button type="button" class="${ssrRenderClass([{ "is-open": unref(comboOpen) }, "combo-trigger"])}"${ssrRenderAttr("aria-expanded", unref(comboOpen))} data-v-06553b51${_scopeId}><span class="${ssrRenderClass([{ placeholder: !unref(form).posteRecherche }, "combo-value"])}" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(form).posteRecherche || "Sélectionnez un intitulé")}</span><span class="chevron" data-v-06553b51${_scopeId}></span></button>`);
            if (unref(comboOpen)) {
              _push2(`<div class="combo-panel is-open" role="listbox" data-v-06553b51${_scopeId}><input${ssrRenderAttr("value", unref(comboSearch))} type="text" class="combo-search" placeholder="Rechercher un intitulé…" autocomplete="off" data-v-06553b51${_scopeId}><div class="combo-list" data-v-06553b51${_scopeId}><!--[-->`);
              ssrRenderList(unref(filteredRoles), (role) => {
                _push2(`<button type="button" class="${ssrRenderClass([{ "is-selected": unref(form).posteRecherche === role.label }, "combo-opt"])}" data-v-06553b51${_scopeId}><span data-v-06553b51${_scopeId}>${ssrInterpolate(role.label)}</span><span class="num" data-v-06553b51${_scopeId}>${ssrInterpolate(String(role.num).padStart(2, "0"))}</span></button>`);
              });
              _push2(`<!--]-->`);
              if (unref(filteredRoles).length === 0) {
                _push2(`<div class="combo-empty" data-v-06553b51${_scopeId}>Aucun résultat</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><span class="field__error" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).posteRecherche || "Sélectionnez un intitulé de poste")}</span>`);
            if (unref(form).posteRecherche === "Autre") {
              _push2(`<div class="${ssrRenderClass([{ "field--error": unref(errors).posteAutre }, "precision is-visible"])}" data-v-06553b51${_scopeId}><input${ssrRenderAttr("value", unref(form).posteAutre)} class="ctrl" type="text" maxlength="60" placeholder="Précisez l&#39;intitulé du poste (60 caractères max)" data-v-06553b51${_scopeId}>`);
              if (unref(errors).posteAutre) {
                _push2(`<span class="field__error" style="${ssrRenderStyle({ "margin-top": "6px" })}" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).posteAutre)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="${ssrRenderClass([{ "field--error": unref(errors).seniorite }, "field"])}" data-v-06553b51${_scopeId}><span class="field__label" data-v-06553b51${_scopeId}>Séniorité visée <span class="req" data-v-06553b51${_scopeId}>*</span></span><div class="radio-group" role="radiogroup" data-v-06553b51${_scopeId}><!--[-->`);
            ssrRenderList([
              { v: "Junior", sub: "0–2 ans" },
              { v: "Confirmé", sub: "2–5 ans" },
              { v: "Senior", sub: "5–8 ans" },
              { v: "Lead-Manager", sub: "8+ ans" }
            ], (opt) => {
              _push2(`<label class="radio" data-v-06553b51${_scopeId}><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).seniorite, opt.v)) ? " checked" : ""} type="radio" name="seniorite"${ssrRenderAttr("value", opt.v)} data-v-06553b51${_scopeId}><span class="radio__main" data-v-06553b51${_scopeId}>${ssrInterpolate(opt.v)}</span><span class="radio__sub" data-v-06553b51${_scopeId}>${ssrInterpolate(opt.sub)}</span></label>`);
            });
            _push2(`<!--]--></div><span class="field__error" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).seniorite || "Sélectionnez un niveau de séniorité")}</span></div><div class="${ssrRenderClass([{ "field--error": unref(errors).objectif }, "field"])}" data-v-06553b51${_scopeId}><span class="field__label" data-v-06553b51${_scopeId}>Objectifs du poste <span class="req" data-v-06553b51${_scopeId}>*</span></span><div class="radio-group radio-group--2" role="radiogroup" data-v-06553b51${_scopeId}><!--[-->`);
            ssrRenderList([
              "Gestion portefeuille clients",
              "Développement et chasse",
              "Ouverture de nouvelle verticale",
              `Création et management d'équipe`
            ], (opt) => {
              _push2(`<label class="radio" data-v-06553b51${_scopeId}><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).objectif, opt)) ? " checked" : ""} type="radio" name="objectif"${ssrRenderAttr("value", opt)} data-v-06553b51${_scopeId}><span class="radio__main" data-v-06553b51${_scopeId}>${ssrInterpolate(opt)}</span></label>`);
            });
            _push2(`<!--]--></div><span class="field__error" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).objectif || "Sélectionnez un objectif")}</span></div><div class="${ssrRenderClass([{ "field--error": unref(errors).localisation }, "field"])}" data-v-06553b51${_scopeId}><label class="field__label" for="localisation" data-v-06553b51${_scopeId}>Localisation principale <span class="req" data-v-06553b51${_scopeId}>*</span></label><input id="localisation"${ssrRenderAttr("value", unref(form).localisation)} class="ctrl" type="text" maxlength="100" placeholder="Paris, Lyon…" data-v-06553b51${_scopeId}><span class="field__error" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).localisation || "Champ obligatoire")}</span><label class="check-chip" data-v-06553b51${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).remote) ? ssrLooseContain(unref(form).remote, null) : unref(form).remote) ? " checked" : ""} type="checkbox" data-v-06553b51${_scopeId}><span class="check-chip__box" aria-hidden="true" data-v-06553b51${_scopeId}><svg viewBox="0 0 14 14" fill="none" data-v-06553b51${_scopeId}><polyline points="2,7 6,11 12,3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-06553b51${_scopeId}></polyline></svg></span><span class="check-chip__label" data-v-06553b51${_scopeId}>Remote possible</span></label></div></div></section><section class="block" data-v-06553b51${_scopeId}><header class="block__head" data-v-06553b51${_scopeId}><span class="block__num" data-v-06553b51${_scopeId}>03</span><h2 class="block__title" data-v-06553b51${_scopeId}>Le contexte</h2></header><div class="grid grid--2" data-v-06553b51${_scopeId}><div class="${ssrRenderClass([{ "field--error": unref(errors).secteur }, "field grid__full"])}" data-v-06553b51${_scopeId}><label class="field__label" for="secteur" data-v-06553b51${_scopeId}>Secteur de votre entreprise <span class="req" data-v-06553b51${_scopeId}>*</span></label><select id="secteur" class="ctrl"${ssrRenderAttr("data-empty", !unref(form).secteur ? "true" : "false")} data-v-06553b51${_scopeId}><option value="" disabled data-v-06553b51${ssrIncludeBooleanAttr(Array.isArray(unref(form).secteur) ? ssrLooseContain(unref(form).secteur, "") : ssrLooseEqual(unref(form).secteur, "")) ? " selected" : ""}${_scopeId}>Sélectionnez un secteur</option><!--[-->`);
            ssrRenderList(SECTORS, (s) => {
              _push2(`<option${ssrRenderAttr("value", s)} data-v-06553b51${ssrIncludeBooleanAttr(Array.isArray(unref(form).secteur) ? ssrLooseContain(unref(form).secteur, s) : ssrLooseEqual(unref(form).secteur, s)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(s)}</option>`);
            });
            _push2(`<!--]--></select><span class="field__error" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).secteur || "Sélectionnez un secteur")}</span>`);
            if (unref(form).secteur === "Autre") {
              _push2(`<div class="${ssrRenderClass([{ "field--error": unref(errors).secteurAutre }, "precision is-visible"])}" data-v-06553b51${_scopeId}><input${ssrRenderAttr("value", unref(form).secteurAutre)} class="ctrl" type="text" maxlength="60" placeholder="Précisez votre secteur (60 caractères max)" data-v-06553b51${_scopeId}>`);
              if (unref(errors).secteurAutre) {
                _push2(`<span class="field__error" style="${ssrRenderStyle({ "margin-top": "6px" })}" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).secteurAutre)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="${ssrRenderClass([{ "field--error": unref(errors).fixe }, "field"])}" data-v-06553b51${_scopeId}><label class="field__label" for="fixe" data-v-06553b51${_scopeId}>Fixe annuel brut (€) <span class="req" data-v-06553b51${_scopeId}>*</span></label><div class="num-wrap" data-v-06553b51${_scopeId}><input id="fixe"${ssrRenderAttr("value", unref(form).fixe)} class="ctrl" type="text" inputmode="numeric" placeholder="55000" data-v-06553b51${_scopeId}><span class="num-wrap__suffix" data-v-06553b51${_scopeId}>€</span></div><span class="field__error" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).fixe || "Le fixe doit être entre 15 000 € et 500 000 €")}</span></div><div class="${ssrRenderClass([{ "field--error": unref(errors).ote }, "field"])}" data-v-06553b51${_scopeId}><label class="field__label" for="ote" data-v-06553b51${_scopeId}>OTE total cible (€) <span class="req" data-v-06553b51${_scopeId}>*</span></label><div class="num-wrap" data-v-06553b51${_scopeId}><input id="ote"${ssrRenderAttr("value", unref(form).ote)} class="ctrl" type="text" inputmode="numeric" placeholder="100000" data-v-06553b51${_scopeId}><span class="num-wrap__suffix" data-v-06553b51${_scopeId}>€</span></div><span class="field__error" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).ote || "L'OTE doit être entre 0 € et 800 000 €")}</span></div><p class="field__hint grid__full" style="${ssrRenderStyle({ "margin-top": "4px" })}" data-v-06553b51${_scopeId}> OTE = Fixe + Variable cible à 100% d&#39;atteinte des objectifs. </p></div></section><section class="block" data-v-06553b51${_scopeId}><header class="block__head" data-v-06553b51${_scopeId}><span class="block__num" data-v-06553b51${_scopeId}>04</span><h2 class="block__title" data-v-06553b51${_scopeId}>Pour aller plus loin</h2></header><p class="block__sub" data-v-06553b51${_scopeId}>Plus le contexte est riche, plus le plan sera précis.</p><div class="grid" data-v-06553b51${_scopeId}><div class="${ssrRenderClass([{ "field--error": unref(errors).siteEntreprise }, "field"])}" data-v-06553b51${_scopeId}><label class="field__label" for="website" data-v-06553b51${_scopeId}>Site de l&#39;entreprise</label><input id="website"${ssrRenderAttr("value", unref(form).siteEntreprise)} class="ctrl" type="url" inputmode="url" placeholder="https://votre-entreprise.com" data-v-06553b51${_scopeId}><span class="field__error" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).siteEntreprise || "URL invalide")}</span></div><div class="${ssrRenderClass([{ "field--error": unref(errors).contenuFichePoste }, "field"])}" data-v-06553b51${_scopeId}><label class="field__label" for="jobspec" data-v-06553b51${_scopeId}>Contenu de la fiche de poste</label><textarea id="jobspec" class="ctrl" maxlength="5000" rows="9" placeholder="Collez ici le contenu de votre fiche de poste, si vous l&#39;avez." data-v-06553b51${_scopeId}>${ssrInterpolate(unref(form).contenuFichePoste)}</textarea><div class="ta-foot" data-v-06553b51${_scopeId}><p class="ta-foot__hint" data-v-06553b51${_scopeId}>Plus le contenu est riche, plus le plan sera précis. Maximum 5000 caractères.</p><span class="${ssrRenderClass([unref(counterClass), "counter"])}" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(fichePosteLen))} / 5000</span></div></div></div></section><section class="block" style="${ssrRenderStyle({ "margin-bottom": "32px" })}" data-v-06553b51${_scopeId}><div class="${ssrRenderClass([{ "field--error": unref(errors).rgpd }, "rgpd"])}" data-v-06553b51${_scopeId}><label class="rgpd__row" data-v-06553b51${_scopeId}><span class="rgpd__check" data-v-06553b51${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).rgpd) ? ssrLooseContain(unref(form).rgpd, null) : unref(form).rgpd) ? " checked" : ""} type="checkbox" data-v-06553b51${_scopeId}><span class="rgpd__box" aria-hidden="true" data-v-06553b51${_scopeId}></span></span><span class="rgpd__text" data-v-06553b51${_scopeId}> J&#39;accepte la `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/politique-confidentialite",
              target: "_blank",
              rel: "noopener"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`politique de confidentialité`);
                } else {
                  return [
                    createTextVNode("politique de confidentialité")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(` et le traitement de mes données personnelles par Mariell. </span></label></div>`);
            if (unref(errors).rgpd) {
              _push2(`<p class="field__error" style="${ssrRenderStyle({ "display": "block", "margin-top": "8px" })}" data-v-06553b51${_scopeId}>${ssrInterpolate(unref(errors).rgpd)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</section>`);
            if (unref(hasTurnstile)) {
              _push2(`<div class="cf-mount" data-v-06553b51${_scopeId}>`);
              _push2(ssrRenderComponent(_component_NuxtTurnstile, {
                ref_key: "turnstile",
                ref: turnstile,
                modelValue: unref(turnstileToken),
                "onUpdate:modelValue": ($event) => isRef(turnstileToken) ? turnstileToken.value = $event : null
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="${ssrRenderClass([{ "is-ready": unref(isFormReady), "is-loading": unref(isLoading) }, "submit"])}" data-v-06553b51${_scopeId}><button type="submit" class="${ssrRenderClass([{ "is-loading": unref(isLoading) }, "cta-submit"])}"${ssrIncludeBooleanAttr(!unref(isFormReady) || unref(isLoading)) ? " disabled" : ""} data-v-06553b51${_scopeId}><span class="cta-submit__label" data-v-06553b51${_scopeId}>Générer mon plan de sourcing</span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" data-v-06553b51${_scopeId}><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-06553b51${_scopeId}></path></svg><span class="cta-submit__loader" aria-live="polite" data-v-06553b51${_scopeId}>Génération en cours…</span></button><p class="submit__hint" data-v-06553b51${_scopeId}>Renseignez tous les champs obligatoires pour activer la génération.</p><p class="submit__loading-note" data-v-06553b51${_scopeId}> Notre IA construit votre stratégie de sourcing sur les <em data-v-06553b51${_scopeId}>8 livrables clés.</em><br data-v-06553b51${_scopeId}> Cela peut prendre jusqu&#39;à 60 secondes — merci de ne pas fermer cette page. </p></div><footer class="form-foot" data-v-06553b51${_scopeId}><span class="form-foot__caption" data-v-06553b51${_scopeId}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" data-v-06553b51${_scopeId}><path d="M12 3l8 4v6c0 4.5-3.4 7.5-8 8-4.6-.5-8-3.5-8-8V7l8-4z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" data-v-06553b51${_scopeId}></path></svg> Protégé par Cloudflare Turnstile </span><span class="form-foot__sig" data-v-06553b51${_scopeId}>Recruter n&#39;est pas un pari.</span></footer></form></div></main>`);
          } else {
            return [
              createVNode("main", { class: "page" }, [
                createVNode("div", { class: "shell" }, [
                  createVNode(Transition, { name: "alert-fade" }, {
                    default: withCtx(() => [
                      unref(globalAlert) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "global-alert",
                        role: "alert"
                      }, [
                        createVNode("span", {
                          class: "global-alert__mark",
                          "aria-hidden": "true"
                        }, [
                          (openBlock(), createBlock("svg", {
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            "stroke-width": "1.8",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round"
                          }, [
                            createVNode("line", {
                              x1: "12",
                              y1: "8",
                              x2: "12",
                              y2: "13"
                            }),
                            createVNode("line", {
                              x1: "12",
                              y1: "16.5",
                              x2: "12",
                              y2: "17"
                            })
                          ]))
                        ]),
                        createVNode("div", { class: "global-alert__body" }, [
                          createVNode("h3", { class: "global-alert__title" }, toDisplayString(unref(globalAlert).title), 1),
                          createVNode("p", {
                            class: "global-alert__text",
                            innerHTML: unref(globalAlert).text
                          }, null, 8, ["innerHTML"])
                        ])
                      ])) : createCommentVNode("", true)
                    ]),
                    _: 1
                  }),
                  createVNode("section", { class: "header" }, [
                    createVNode("div", { class: "header__eyebrow" }, [
                      createVNode("span", { class: "eyebrow-cyan" }, "Outil n°2 · Le Lab Mariell")
                    ]),
                    createVNode("h1", { class: "header__title" }, [
                      createTextVNode(" Plan de sourcing LinkedIn "),
                      createVNode("em", null, "personnalisé.")
                    ]),
                    createVNode("p", { class: "header__sub" }, " Une stratégie de chasse complète, calibrée sur votre contexte. Générée en moins de 60 secondes. "),
                    createVNode("div", { class: "header__meta" }, [
                      createVNode("span", {
                        class: "dot",
                        "aria-hidden": "true"
                      }),
                      createVNode("span", null, "Gratuit · Sans inscription · < 60 secondes")
                    ])
                  ]),
                  createVNode("aside", {
                    class: "quality-notice",
                    role: "note",
                    "aria-label": "Conseil avant de remplir"
                  }, [
                    createVNode("span", {
                      class: "quality-notice__icon",
                      "aria-hidden": "true"
                    }, [
                      (openBlock(), createBlock("svg", {
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "1.6",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      }, [
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9.5"
                        }),
                        createVNode("path", { d: "M12 8v5" }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "16.2",
                          r: "0.7",
                          fill: "currentColor",
                          stroke: "none"
                        })
                      ]))
                    ]),
                    createVNode("p", { class: "quality-notice__body" }, [
                      createVNode("strong", null, "La qualité de la réponse dépend de votre formulaire."),
                      createTextVNode(" Veillez à partager "),
                      createVNode("em", null, "un maximum d'informations avec précision"),
                      createTextVNode(" pour obtenir le meilleur résultat. ")
                    ])
                  ]),
                  createVNode("form", {
                    novalidate: "",
                    onSubmit: withModifiers(onSubmit, ["prevent"])
                  }, [
                    createVNode("section", { class: "block" }, [
                      createVNode("header", { class: "block__head" }, [
                        createVNode("span", { class: "block__num" }, "01"),
                        createVNode("h2", { class: "block__title" }, "Identité")
                      ]),
                      createVNode("div", { class: "grid grid--2" }, [
                        createVNode("div", {
                          class: ["field", { "field--error": unref(errors).prenom }]
                        }, [
                          createVNode("label", {
                            class: "field__label",
                            for: "prenom"
                          }, [
                            createTextVNode("Prénom "),
                            createVNode("span", { class: "req" }, "*")
                          ]),
                          withDirectives(createVNode("input", {
                            id: "prenom",
                            "onUpdate:modelValue": ($event) => unref(form).prenom = $event,
                            class: "ctrl",
                            type: "text",
                            autocomplete: "given-name",
                            placeholder: "Marie",
                            onBlur: ($event) => onBlur("prenom"),
                            onInput: ($event) => clearError("prenom")
                          }, null, 40, ["onUpdate:modelValue", "onBlur", "onInput"]), [
                            [vModelText, unref(form).prenom]
                          ]),
                          createVNode("span", { class: "field__error" }, toDisplayString(unref(errors).prenom || "Champ obligatoire"), 1)
                        ], 2),
                        createVNode("div", {
                          class: ["field", { "field--error": unref(errors).nom }]
                        }, [
                          createVNode("label", {
                            class: "field__label",
                            for: "nom"
                          }, [
                            createTextVNode("Nom "),
                            createVNode("span", { class: "req" }, "*")
                          ]),
                          withDirectives(createVNode("input", {
                            id: "nom",
                            "onUpdate:modelValue": ($event) => unref(form).nom = $event,
                            class: "ctrl",
                            type: "text",
                            autocomplete: "family-name",
                            placeholder: "Dupont",
                            onBlur: ($event) => onBlur("nom"),
                            onInput: ($event) => clearError("nom")
                          }, null, 40, ["onUpdate:modelValue", "onBlur", "onInput"]), [
                            [vModelText, unref(form).nom]
                          ]),
                          createVNode("span", { class: "field__error" }, toDisplayString(unref(errors).nom || "Champ obligatoire"), 1)
                        ], 2),
                        createVNode("div", {
                          class: ["field grid__full", { "field--error": unref(errors).email }]
                        }, [
                          createVNode("label", {
                            class: "field__label",
                            for: "email"
                          }, [
                            createTextVNode("Adresse mail "),
                            createVNode("span", { class: "req" }, "*")
                          ]),
                          withDirectives(createVNode("input", {
                            id: "email",
                            "onUpdate:modelValue": ($event) => unref(form).email = $event,
                            class: "ctrl",
                            type: "email",
                            autocomplete: "email",
                            placeholder: "marie.dupont@entreprise.com",
                            onBlur: ($event) => onBlur("email"),
                            onInput: ($event) => clearError("email")
                          }, null, 40, ["onUpdate:modelValue", "onBlur", "onInput"]), [
                            [vModelText, unref(form).email]
                          ]),
                          createVNode("span", { class: "field__error" }, toDisplayString(unref(errors).email || "Email invalide"), 1)
                        ], 2),
                        createVNode("div", {
                          class: ["field grid__full", { "field--error": unref(errors).phone }]
                        }, [
                          createVNode("label", {
                            class: "field__label",
                            for: "phone"
                          }, [
                            createTextVNode("Numéro de téléphone "),
                            createVNode("span", { class: "req" }, "*")
                          ]),
                          createVNode("div", { class: "tel-wrap" }, [
                            createVNode("div", { class: "tel-cc" }, [
                              withDirectives(createVNode("select", {
                                "onUpdate:modelValue": ($event) => unref(form).phoneCc = $event,
                                "aria-label": "Indicatif pays"
                              }, [
                                createVNode("option", { value: "+33" }, "FR +33"),
                                createVNode("option", { value: "+32" }, "BE +32"),
                                createVNode("option", { value: "+41" }, "CH +41"),
                                createVNode("option", { value: "+44" }, "UK +44"),
                                createVNode("option", { value: "+49" }, "DE +49"),
                                createVNode("option", { value: "+34" }, "ES +34"),
                                createVNode("option", { value: "+39" }, "IT +39"),
                                createVNode("option", { value: "+31" }, "NL +31"),
                                createVNode("option", { value: "+352" }, "LU +352"),
                                createVNode("option", { value: "+351" }, "PT +351"),
                                createVNode("option", { value: "+353" }, "IE +353")
                              ], 8, ["onUpdate:modelValue"]), [
                                [vModelSelect, unref(form).phoneCc]
                              ])
                            ]),
                            withDirectives(createVNode("input", {
                              id: "phone",
                              "onUpdate:modelValue": ($event) => unref(form).phoneNumber = $event,
                              class: "tel-input",
                              type: "tel",
                              autocomplete: "tel-national",
                              placeholder: "06 12 34 56 78",
                              onBlur: ($event) => onBlur("phone"),
                              onInput: ($event) => clearError("phone")
                            }, null, 40, ["onUpdate:modelValue", "onBlur", "onInput"]), [
                              [vModelText, unref(form).phoneNumber]
                            ])
                          ]),
                          createVNode("span", { class: "field__error" }, toDisplayString(unref(errors).phone || "Numéro de téléphone invalide."), 1)
                        ], 2),
                        createVNode("div", {
                          class: ["field grid__full", { "field--error": unref(errors).entreprise }]
                        }, [
                          createVNode("label", {
                            class: "field__label",
                            for: "entreprise"
                          }, [
                            createTextVNode("Entreprise "),
                            createVNode("span", { class: "req" }, "*")
                          ]),
                          withDirectives(createVNode("input", {
                            id: "entreprise",
                            "onUpdate:modelValue": ($event) => unref(form).entreprise = $event,
                            class: "ctrl",
                            type: "text",
                            autocomplete: "organization",
                            placeholder: "Nom de votre entreprise",
                            onBlur: ($event) => onBlur("entreprise"),
                            onInput: ($event) => clearError("entreprise")
                          }, null, 40, ["onUpdate:modelValue", "onBlur", "onInput"]), [
                            [vModelText, unref(form).entreprise]
                          ]),
                          createVNode("span", { class: "field__error" }, toDisplayString(unref(errors).entreprise || "Champ obligatoire"), 1)
                        ], 2)
                      ])
                    ]),
                    createVNode("section", { class: "block" }, [
                      createVNode("header", { class: "block__head" }, [
                        createVNode("span", { class: "block__num" }, "02"),
                        createVNode("h2", { class: "block__title" }, "Le poste à pourvoir")
                      ]),
                      createVNode("div", { class: "grid" }, [
                        createVNode("div", {
                          class: ["field", { "field--error": unref(errors).posteRecherche }]
                        }, [
                          createVNode("label", { class: "field__label" }, [
                            createTextVNode("Poste recherché "),
                            createVNode("span", { class: "req" }, "*")
                          ]),
                          createVNode("div", {
                            id: "jobtitle-combo",
                            class: "combo"
                          }, [
                            createVNode("button", {
                              type: "button",
                              class: ["combo-trigger", { "is-open": unref(comboOpen) }],
                              "aria-expanded": unref(comboOpen),
                              onClick: ($event) => comboOpen.value = !unref(comboOpen)
                            }, [
                              createVNode("span", {
                                class: [{ placeholder: !unref(form).posteRecherche }, "combo-value"]
                              }, toDisplayString(unref(form).posteRecherche || "Sélectionnez un intitulé"), 3),
                              createVNode("span", { class: "chevron" })
                            ], 10, ["aria-expanded", "onClick"]),
                            unref(comboOpen) ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "combo-panel is-open",
                              role: "listbox"
                            }, [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => isRef(comboSearch) ? comboSearch.value = $event : null,
                                type: "text",
                                class: "combo-search",
                                placeholder: "Rechercher un intitulé…",
                                autocomplete: "off",
                                onClick: withModifiers(() => {
                                }, ["stop"])
                              }, null, 8, ["onUpdate:modelValue", "onClick"]), [
                                [vModelText, unref(comboSearch)]
                              ]),
                              createVNode("div", { class: "combo-list" }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredRoles), (role) => {
                                  return openBlock(), createBlock("button", {
                                    key: role.label,
                                    type: "button",
                                    class: ["combo-opt", { "is-selected": unref(form).posteRecherche === role.label }],
                                    onClick: ($event) => selectRole(role.label)
                                  }, [
                                    createVNode("span", null, toDisplayString(role.label), 1),
                                    createVNode("span", { class: "num" }, toDisplayString(String(role.num).padStart(2, "0")), 1)
                                  ], 10, ["onClick"]);
                                }), 128)),
                                unref(filteredRoles).length === 0 ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "combo-empty"
                                }, "Aucun résultat")) : createCommentVNode("", true)
                              ])
                            ])) : createCommentVNode("", true)
                          ]),
                          createVNode("span", { class: "field__error" }, toDisplayString(unref(errors).posteRecherche || "Sélectionnez un intitulé de poste"), 1),
                          unref(form).posteRecherche === "Autre" ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: ["precision is-visible", { "field--error": unref(errors).posteAutre }]
                          }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).posteAutre = $event,
                              class: "ctrl",
                              type: "text",
                              maxlength: "60",
                              placeholder: "Précisez l'intitulé du poste (60 caractères max)",
                              onBlur: ($event) => onBlur("posteAutre"),
                              onInput: ($event) => clearError("posteAutre")
                            }, null, 40, ["onUpdate:modelValue", "onBlur", "onInput"]), [
                              [vModelText, unref(form).posteAutre]
                            ]),
                            unref(errors).posteAutre ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "field__error",
                              style: { "margin-top": "6px" }
                            }, toDisplayString(unref(errors).posteAutre), 1)) : createCommentVNode("", true)
                          ], 2)) : createCommentVNode("", true)
                        ], 2),
                        createVNode("div", {
                          class: ["field", { "field--error": unref(errors).seniorite }]
                        }, [
                          createVNode("span", { class: "field__label" }, [
                            createTextVNode("Séniorité visée "),
                            createVNode("span", { class: "req" }, "*")
                          ]),
                          createVNode("div", {
                            class: "radio-group",
                            role: "radiogroup"
                          }, [
                            (openBlock(), createBlock(Fragment, null, renderList([
                              { v: "Junior", sub: "0–2 ans" },
                              { v: "Confirmé", sub: "2–5 ans" },
                              { v: "Senior", sub: "5–8 ans" },
                              { v: "Lead-Manager", sub: "8+ ans" }
                            ], (opt) => {
                              return createVNode("label", {
                                key: opt.v,
                                class: "radio"
                              }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => unref(form).seniorite = $event,
                                  type: "radio",
                                  name: "seniorite",
                                  value: opt.v,
                                  onChange: ($event) => clearError("seniorite")
                                }, null, 40, ["onUpdate:modelValue", "value", "onChange"]), [
                                  [vModelRadio, unref(form).seniorite]
                                ]),
                                createVNode("span", { class: "radio__main" }, toDisplayString(opt.v), 1),
                                createVNode("span", { class: "radio__sub" }, toDisplayString(opt.sub), 1)
                              ]);
                            }), 64))
                          ]),
                          createVNode("span", { class: "field__error" }, toDisplayString(unref(errors).seniorite || "Sélectionnez un niveau de séniorité"), 1)
                        ], 2),
                        createVNode("div", {
                          class: ["field", { "field--error": unref(errors).objectif }]
                        }, [
                          createVNode("span", { class: "field__label" }, [
                            createTextVNode("Objectifs du poste "),
                            createVNode("span", { class: "req" }, "*")
                          ]),
                          createVNode("div", {
                            class: "radio-group radio-group--2",
                            role: "radiogroup"
                          }, [
                            (openBlock(), createBlock(Fragment, null, renderList([
                              "Gestion portefeuille clients",
                              "Développement et chasse",
                              "Ouverture de nouvelle verticale",
                              `Création et management d'équipe`
                            ], (opt) => {
                              return createVNode("label", {
                                key: opt,
                                class: "radio"
                              }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => unref(form).objectif = $event,
                                  type: "radio",
                                  name: "objectif",
                                  value: opt,
                                  onChange: ($event) => clearError("objectif")
                                }, null, 40, ["onUpdate:modelValue", "value", "onChange"]), [
                                  [vModelRadio, unref(form).objectif]
                                ]),
                                createVNode("span", { class: "radio__main" }, toDisplayString(opt), 1)
                              ]);
                            }), 64))
                          ]),
                          createVNode("span", { class: "field__error" }, toDisplayString(unref(errors).objectif || "Sélectionnez un objectif"), 1)
                        ], 2),
                        createVNode("div", {
                          class: ["field", { "field--error": unref(errors).localisation }]
                        }, [
                          createVNode("label", {
                            class: "field__label",
                            for: "localisation"
                          }, [
                            createTextVNode("Localisation principale "),
                            createVNode("span", { class: "req" }, "*")
                          ]),
                          withDirectives(createVNode("input", {
                            id: "localisation",
                            "onUpdate:modelValue": ($event) => unref(form).localisation = $event,
                            class: "ctrl",
                            type: "text",
                            maxlength: "100",
                            placeholder: "Paris, Lyon…",
                            onBlur: ($event) => onBlur("localisation"),
                            onInput: ($event) => clearError("localisation")
                          }, null, 40, ["onUpdate:modelValue", "onBlur", "onInput"]), [
                            [vModelText, unref(form).localisation]
                          ]),
                          createVNode("span", { class: "field__error" }, toDisplayString(unref(errors).localisation || "Champ obligatoire"), 1),
                          createVNode("label", { class: "check-chip" }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).remote = $event,
                              type: "checkbox"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelCheckbox, unref(form).remote]
                            ]),
                            createVNode("span", {
                              class: "check-chip__box",
                              "aria-hidden": "true"
                            }, [
                              (openBlock(), createBlock("svg", {
                                viewBox: "0 0 14 14",
                                fill: "none"
                              }, [
                                createVNode("polyline", {
                                  points: "2,7 6,11 12,3",
                                  stroke: "currentColor",
                                  "stroke-width": "1.8",
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round"
                                })
                              ]))
                            ]),
                            createVNode("span", { class: "check-chip__label" }, "Remote possible")
                          ])
                        ], 2)
                      ])
                    ]),
                    createVNode("section", { class: "block" }, [
                      createVNode("header", { class: "block__head" }, [
                        createVNode("span", { class: "block__num" }, "03"),
                        createVNode("h2", { class: "block__title" }, "Le contexte")
                      ]),
                      createVNode("div", { class: "grid grid--2" }, [
                        createVNode("div", {
                          class: ["field grid__full", { "field--error": unref(errors).secteur }]
                        }, [
                          createVNode("label", {
                            class: "field__label",
                            for: "secteur"
                          }, [
                            createTextVNode("Secteur de votre entreprise "),
                            createVNode("span", { class: "req" }, "*")
                          ]),
                          withDirectives(createVNode("select", {
                            id: "secteur",
                            "onUpdate:modelValue": ($event) => unref(form).secteur = $event,
                            class: "ctrl",
                            "data-empty": !unref(form).secteur ? "true" : "false",
                            onChange: ($event) => clearError("secteur")
                          }, [
                            createVNode("option", {
                              value: "",
                              disabled: ""
                            }, "Sélectionnez un secteur"),
                            (openBlock(), createBlock(Fragment, null, renderList(SECTORS, (s) => {
                              return createVNode("option", {
                                key: s,
                                value: s
                              }, toDisplayString(s), 9, ["value"]);
                            }), 64))
                          ], 40, ["onUpdate:modelValue", "data-empty", "onChange"]), [
                            [vModelSelect, unref(form).secteur]
                          ]),
                          createVNode("span", { class: "field__error" }, toDisplayString(unref(errors).secteur || "Sélectionnez un secteur"), 1),
                          unref(form).secteur === "Autre" ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: ["precision is-visible", { "field--error": unref(errors).secteurAutre }]
                          }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).secteurAutre = $event,
                              class: "ctrl",
                              type: "text",
                              maxlength: "60",
                              placeholder: "Précisez votre secteur (60 caractères max)",
                              onBlur: ($event) => onBlur("secteurAutre"),
                              onInput: ($event) => clearError("secteurAutre")
                            }, null, 40, ["onUpdate:modelValue", "onBlur", "onInput"]), [
                              [vModelText, unref(form).secteurAutre]
                            ]),
                            unref(errors).secteurAutre ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "field__error",
                              style: { "margin-top": "6px" }
                            }, toDisplayString(unref(errors).secteurAutre), 1)) : createCommentVNode("", true)
                          ], 2)) : createCommentVNode("", true)
                        ], 2),
                        createVNode("div", {
                          class: ["field", { "field--error": unref(errors).fixe }]
                        }, [
                          createVNode("label", {
                            class: "field__label",
                            for: "fixe"
                          }, [
                            createTextVNode("Fixe annuel brut (€) "),
                            createVNode("span", { class: "req" }, "*")
                          ]),
                          createVNode("div", { class: "num-wrap" }, [
                            withDirectives(createVNode("input", {
                              id: "fixe",
                              "onUpdate:modelValue": ($event) => unref(form).fixe = $event,
                              class: "ctrl",
                              type: "text",
                              inputmode: "numeric",
                              placeholder: "55000",
                              onBlur: ($event) => onBlur("fixe"),
                              onInput: ($event) => clearError("fixe")
                            }, null, 40, ["onUpdate:modelValue", "onBlur", "onInput"]), [
                              [vModelText, unref(form).fixe]
                            ]),
                            createVNode("span", { class: "num-wrap__suffix" }, "€")
                          ]),
                          createVNode("span", { class: "field__error" }, toDisplayString(unref(errors).fixe || "Le fixe doit être entre 15 000 € et 500 000 €"), 1)
                        ], 2),
                        createVNode("div", {
                          class: ["field", { "field--error": unref(errors).ote }]
                        }, [
                          createVNode("label", {
                            class: "field__label",
                            for: "ote"
                          }, [
                            createTextVNode("OTE total cible (€) "),
                            createVNode("span", { class: "req" }, "*")
                          ]),
                          createVNode("div", { class: "num-wrap" }, [
                            withDirectives(createVNode("input", {
                              id: "ote",
                              "onUpdate:modelValue": ($event) => unref(form).ote = $event,
                              class: "ctrl",
                              type: "text",
                              inputmode: "numeric",
                              placeholder: "100000",
                              onBlur: ($event) => onBlur("ote"),
                              onInput: ($event) => clearError("ote")
                            }, null, 40, ["onUpdate:modelValue", "onBlur", "onInput"]), [
                              [vModelText, unref(form).ote]
                            ]),
                            createVNode("span", { class: "num-wrap__suffix" }, "€")
                          ]),
                          createVNode("span", { class: "field__error" }, toDisplayString(unref(errors).ote || "L'OTE doit être entre 0 € et 800 000 €"), 1)
                        ], 2),
                        createVNode("p", {
                          class: "field__hint grid__full",
                          style: { "margin-top": "4px" }
                        }, " OTE = Fixe + Variable cible à 100% d'atteinte des objectifs. ")
                      ])
                    ]),
                    createVNode("section", { class: "block" }, [
                      createVNode("header", { class: "block__head" }, [
                        createVNode("span", { class: "block__num" }, "04"),
                        createVNode("h2", { class: "block__title" }, "Pour aller plus loin")
                      ]),
                      createVNode("p", { class: "block__sub" }, "Plus le contexte est riche, plus le plan sera précis."),
                      createVNode("div", { class: "grid" }, [
                        createVNode("div", {
                          class: ["field", { "field--error": unref(errors).siteEntreprise }]
                        }, [
                          createVNode("label", {
                            class: "field__label",
                            for: "website"
                          }, "Site de l'entreprise"),
                          withDirectives(createVNode("input", {
                            id: "website",
                            "onUpdate:modelValue": ($event) => unref(form).siteEntreprise = $event,
                            class: "ctrl",
                            type: "url",
                            inputmode: "url",
                            placeholder: "https://votre-entreprise.com",
                            onBlur: ($event) => onBlur("siteEntreprise"),
                            onInput: ($event) => clearError("siteEntreprise")
                          }, null, 40, ["onUpdate:modelValue", "onBlur", "onInput"]), [
                            [vModelText, unref(form).siteEntreprise]
                          ]),
                          createVNode("span", { class: "field__error" }, toDisplayString(unref(errors).siteEntreprise || "URL invalide"), 1)
                        ], 2),
                        createVNode("div", {
                          class: ["field", { "field--error": unref(errors).contenuFichePoste }]
                        }, [
                          createVNode("label", {
                            class: "field__label",
                            for: "jobspec"
                          }, "Contenu de la fiche de poste"),
                          withDirectives(createVNode("textarea", {
                            id: "jobspec",
                            "onUpdate:modelValue": ($event) => unref(form).contenuFichePoste = $event,
                            class: "ctrl",
                            maxlength: "5000",
                            rows: "9",
                            placeholder: "Collez ici le contenu de votre fiche de poste, si vous l'avez.",
                            onBlur: ($event) => onBlur("contenuFichePoste"),
                            onInput: ($event) => clearError("contenuFichePoste")
                          }, null, 40, ["onUpdate:modelValue", "onBlur", "onInput"]), [
                            [vModelText, unref(form).contenuFichePoste]
                          ]),
                          createVNode("div", { class: "ta-foot" }, [
                            createVNode("p", { class: "ta-foot__hint" }, "Plus le contenu est riche, plus le plan sera précis. Maximum 5000 caractères."),
                            createVNode("span", {
                              class: ["counter", unref(counterClass)]
                            }, toDisplayString(unref(fichePosteLen)) + " / 5000", 3)
                          ])
                        ], 2)
                      ])
                    ]),
                    createVNode("section", {
                      class: "block",
                      style: { "margin-bottom": "32px" }
                    }, [
                      createVNode("div", {
                        class: ["rgpd", { "field--error": unref(errors).rgpd }]
                      }, [
                        createVNode("label", { class: "rgpd__row" }, [
                          createVNode("span", { class: "rgpd__check" }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).rgpd = $event,
                              type: "checkbox",
                              onChange: ($event) => clearError("rgpd")
                            }, null, 40, ["onUpdate:modelValue", "onChange"]), [
                              [vModelCheckbox, unref(form).rgpd]
                            ]),
                            createVNode("span", {
                              class: "rgpd__box",
                              "aria-hidden": "true"
                            })
                          ]),
                          createVNode("span", { class: "rgpd__text" }, [
                            createTextVNode(" J'accepte la "),
                            createVNode(_component_NuxtLink, {
                              to: "/politique-confidentialite",
                              target: "_blank",
                              rel: "noopener"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("politique de confidentialité")
                              ]),
                              _: 1
                            }),
                            createTextVNode(" et le traitement de mes données personnelles par Mariell. ")
                          ])
                        ])
                      ], 2),
                      unref(errors).rgpd ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "field__error",
                        style: { "display": "block", "margin-top": "8px" }
                      }, toDisplayString(unref(errors).rgpd), 1)) : createCommentVNode("", true)
                    ]),
                    unref(hasTurnstile) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "cf-mount"
                    }, [
                      createVNode(_component_NuxtTurnstile, {
                        ref_key: "turnstile",
                        ref: turnstile,
                        modelValue: unref(turnstileToken),
                        "onUpdate:modelValue": ($event) => isRef(turnstileToken) ? turnstileToken.value = $event : null
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : createCommentVNode("", true),
                    createVNode("div", {
                      class: ["submit", { "is-ready": unref(isFormReady), "is-loading": unref(isLoading) }]
                    }, [
                      createVNode("button", {
                        type: "submit",
                        class: ["cta-submit", { "is-loading": unref(isLoading) }],
                        disabled: !unref(isFormReady) || unref(isLoading)
                      }, [
                        createVNode("span", { class: "cta-submit__label" }, "Générer mon plan de sourcing"),
                        (openBlock(), createBlock("svg", {
                          viewBox: "0 0 24 24",
                          fill: "none",
                          "aria-hidden": "true"
                        }, [
                          createVNode("path", {
                            d: "M5 12h14M13 6l6 6-6 6",
                            stroke: "currentColor",
                            "stroke-width": "1.8",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round"
                          })
                        ])),
                        createVNode("span", {
                          class: "cta-submit__loader",
                          "aria-live": "polite"
                        }, "Génération en cours…")
                      ], 10, ["disabled"]),
                      createVNode("p", { class: "submit__hint" }, "Renseignez tous les champs obligatoires pour activer la génération."),
                      createVNode("p", { class: "submit__loading-note" }, [
                        createTextVNode(" Notre IA construit votre stratégie de sourcing sur les "),
                        createVNode("em", null, "8 livrables clés."),
                        createVNode("br"),
                        createTextVNode(" Cela peut prendre jusqu'à 60 secondes — merci de ne pas fermer cette page. ")
                      ])
                    ], 2),
                    createVNode("footer", { class: "form-foot" }, [
                      createVNode("span", { class: "form-foot__caption" }, [
                        (openBlock(), createBlock("svg", {
                          viewBox: "0 0 24 24",
                          fill: "none",
                          "aria-hidden": "true"
                        }, [
                          createVNode("path", {
                            d: "M12 3l8 4v6c0 4.5-3.4 7.5-8 8-4.6-.5-8-3.5-8-8V7l8-4z",
                            stroke: "currentColor",
                            "stroke-width": "1.4",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round"
                          })
                        ])),
                        createTextVNode(" Protégé par Cloudflare Turnstile ")
                      ]),
                      createVNode("span", { class: "form-foot__sig" }, "Recruter n'est pas un pari.")
                    ])
                  ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lab/plan-de-sourcing/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-06553b51"]]);

export { index as default };
//# sourceMappingURL=index-DbpHhjGN.mjs.map
