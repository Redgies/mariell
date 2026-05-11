import { _ as __nuxt_component_0 } from './LabToolShell-KFgobw02.mjs';
import { _ as __nuxt_component_0$1, b as useRuntimeConfig, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$1 } from './NuxtTurnstile-B7o5SLEB.mjs';
import { defineComponent, computed, reactive, ref, watch, withCtx, unref, createTextVNode, isRef, createVNode, Transition, openBlock, createBlock, toDisplayString, createCommentVNode, withModifiers, withDirectives, vModelText, vModelSelect, vModelRadio, vModelCheckbox, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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

function useStageAlternance() {
  const isLoading = ref(false);
  const error = ref(null);
  const errorCode = ref(null);
  async function submit(payload) {
    isLoading.value = true;
    error.value = null;
    errorCode.value = null;
    try {
      const result = await $fetch(
        "/api/lab/stage-alternance",
        { method: "POST", body: payload }
      );
      await navigateTo(result.redirectUrl);
      return { success: true };
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
  return { isLoading, error, errorCode, submit };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Demande stagiaire ou alternant Sales — Mariell · Le Lab",
      meta: [
        {
          name: "description",
          content: "Vous nous décrivez votre besoin, nous activons notre vivier et vous présentons les profils Sales pertinents. Service offert."
        }
      ]
    });
    const config = useRuntimeConfig();
    const hasTurnstile = computed(() => {
      const t = config.public.turnstile;
      return Boolean(t?.siteKey);
    });
    const PROFILE_LABELS = {
      sdr: "SDR / BDR",
      bizdev: "Business Developer Junior",
      ae: "Account Executive Junior",
      ops: "Sales Ops Junior",
      autre: "Autre"
    };
    const START_DATE_LABELS = {
      asap: "ASAP",
      "1-2m": "Sous 1 à 2 mois",
      "3-6m": "Sous 3 à 6 mois",
      flex: "Flexible"
    };
    const CONTRACT_LABELS = {
      stage: "Stage",
      alternance: "Alternance"
    };
    const form = reactive({
      firstname: "",
      lastname: "",
      email: "",
      phoneCc: "+33",
      phoneNumber: "",
      company: "",
      companyUrl: "",
      contract: "",
      profile: "",
      profileAutre: "",
      startDate: "",
      location: "",
      brief: "",
      rgpd: false,
      companyWebsite: ""
      // honeypot — must stay empty
    });
    const turnstileToken = ref(hasTurnstile.value ? "" : "dev-stub");
    const turnstile = ref(null);
    function resetTurnstile() {
      turnstile.value?.reset?.();
      turnstileToken.value = hasTurnstile.value ? "" : "dev-stub";
    }
    const errors = reactive({
      firstname: null,
      lastname: null,
      email: null,
      phone: null,
      company: null,
      companyUrl: null,
      contract: null,
      profile: null,
      profileAutre: null,
      startDate: null,
      location: null,
      brief: null,
      rgpd: null
    });
    const touched = reactive({
      firstname: false,
      lastname: false,
      email: false,
      phone: false,
      company: false,
      companyUrl: false,
      contract: false,
      profile: false,
      profileAutre: false,
      startDate: false,
      location: false,
      brief: false,
      rgpd: false
    });
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const URL_RE = /^(https?:\/\/[^\s]+|(www\.)?linkedin\.com\/(company|in)\/[^\s]+|[a-z0-9-]+\.[a-z]{2,}([/?].*)?)$/i;
    const PHONE_RE = /^[+\d][\d\s\-().]{6,}$/;
    const PERSONAL_EMAIL_RE = /@(gmail|googlemail|hotmail|yahoo|outlook|icloud|me|mac|live|protonmail|proton|gmx|aol|yandex|tutanota|free|orange|sfr|wanadoo|laposte|neuf|bbox|numericable)\./i;
    function validateField(key) {
      const v = (val) => val.trim();
      switch (key) {
        case "firstname":
          return v(form.firstname) ? null : "Ce champ est requis.";
        case "lastname":
          return v(form.lastname) ? null : "Ce champ est requis.";
        case "email": {
          const e = v(form.email);
          if (!e) return "Ce champ est requis.";
          if (!EMAIL_RE.test(e)) return "Format d'email invalide.";
          if (PERSONAL_EMAIL_RE.test(e))
            return "Cet outil est réservé aux entreprises. Merci d'utiliser votre email professionnel.";
          return null;
        }
        case "phone": {
          const p = v(form.phoneNumber);
          if (!p) return "Ce champ est requis.";
          if (!PHONE_RE.test(p) || p.replace(/\D/g, "").length < 7)
            return "Numéro de téléphone invalide.";
          return null;
        }
        case "company":
          return v(form.company).length >= 2 ? null : "Ce champ est requis.";
        case "companyUrl": {
          const u = v(form.companyUrl);
          if (!u) return "Ce champ est requis.";
          if (!URL_RE.test(u))
            return "Lien invalide. Saisissez un site web (https://...) ou une URL LinkedIn complète.";
          return null;
        }
        case "contract":
          return form.contract ? null : "Ce champ est requis.";
        case "profile":
          return form.profile ? null : "Ce champ est requis.";
        case "profileAutre":
          if (form.profile !== "autre") return null;
          return v(form.profileAutre) ? null : "Précisez le profil recherché (60 caractères max).";
        case "startDate":
          return form.startDate ? null : "Ce champ est requis.";
        case "location":
          return v(form.location).length >= 2 ? null : "Ce champ est requis.";
        case "brief": {
          const b = v(form.brief);
          if (!b) return "Ce champ est requis.";
          if (b.length < 20) return "Brief trop court — 20 caractères minimum.";
          if (b.length > 500) return `500 caractères maximum (vous en avez ${b.length}).`;
          return null;
        }
        case "rgpd":
          return form.rgpd ? null : "Vous devez accepter la politique de confidentialité pour continuer.";
      }
    }
    function onBlur(key) {
      touched[key] = true;
      errors[key] = validateField(key);
    }
    function onInput(key) {
      if (touched[key] && errors[key]) {
        errors[key] = validateField(key);
      }
    }
    const briefLen = computed(() => form.brief.length);
    const briefCounterClass = computed(() => {
      const n = briefLen.value;
      if (n >= 500) return "textarea-counter--danger";
      if (n >= 400) return "textarea-counter--warn";
      return "";
    });
    watch(
      () => form.profile,
      (val) => {
        if (val !== "autre") {
          form.profileAutre = "";
          errors.profileAutre = null;
          touched.profileAutre = false;
        }
      }
    );
    const isFormReady = computed(() => {
      const f = form;
      if (!f.firstname.trim()) return false;
      if (!f.lastname.trim()) return false;
      if (!f.email.trim() || !EMAIL_RE.test(f.email)) return false;
      if (PERSONAL_EMAIL_RE.test(f.email)) return false;
      if (!f.phoneNumber.trim()) return false;
      if (!f.company.trim()) return false;
      if (!f.companyUrl.trim()) return false;
      if (!f.contract) return false;
      if (!f.profile) return false;
      if (f.profile === "autre" && !f.profileAutre.trim()) return false;
      if (!f.startDate) return false;
      if (!f.location.trim()) return false;
      const bl = f.brief.trim().length;
      if (bl < 20 || bl > 500) return false;
      if (!f.rgpd) return false;
      if (!turnstileToken.value) return false;
      return true;
    });
    const { isLoading, submit } = useStageAlternance();
    const globalAlert = ref(null);
    const ALERT_BY_CODE = {
      DUPLICATE_REQUEST: {
        title: "Une demande est déjà en cours pour votre entreprise.",
        text: 'Pour toute mise à jour ou information complémentaire, contactez-nous directement à <a href="mailto:bonjour@mariell.fr">bonjour@mariell.fr</a>.'
      },
      RATE_LIMIT: {
        title: "Limite de soumissions atteinte.",
        text: 'Vous avez déjà effectué plusieurs demandes récemment. Pour garantir un traitement de qualité à chacun, nous limitons le nombre de soumissions par utilisateur. Si votre demande est urgente, contactez-nous directement à <a href="mailto:bonjour@mariell.fr">bonjour@mariell.fr</a>.'
      },
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
      Object.keys(touched).forEach((k) => touched[k] = true);
      let ok = true;
      Object.keys(errors).forEach((k) => {
        const msg = validateField(k);
        errors[k] = msg;
        if (msg) ok = false;
      });
      if (!ok) {
        globalAlert.value = null;
        return;
      }
      const payload = {
        prenom: form.firstname.trim(),
        nom: form.lastname.trim(),
        email: form.email.trim(),
        telephone: `${form.phoneCc} ${form.phoneNumber.trim()}`,
        entreprise: form.company.trim(),
        urlEntreprise: form.companyUrl.trim(),
        typeContrat: CONTRACT_LABELS[form.contract],
        profilRecherche: PROFILE_LABELS[form.profile],
        profilRecherchePrecisionAutre: form.profile === "autre" ? form.profileAutre.trim() : void 0,
        dateDemarrage: START_DATE_LABELS[form.startDate],
        localisation: form.location.trim(),
        briefMission: form.brief.trim(),
        consentementRgpd: true,
        company_website: form.companyWebsite,
        turnstileToken: turnstileToken.value
      };
      globalAlert.value = null;
      const result = await submit(payload);
      if (!result.success) {
        resetTurnstile();
        if (result.code === "PERSONAL_EMAIL") {
          errors.email = result.message;
          touched.email = true;
          const el = (void 0).querySelector('[data-field="email"]');
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        const cfg = ALERT_BY_CODE[result.code] || ALERT_BY_CODE.INTERNAL_ERROR;
        globalAlert.value = cfg;
        (void 0).scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LabToolShell = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_NuxtTurnstile = _sfc_main$1;
      _push(ssrRenderComponent(_component_LabToolShell, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main class="form-shell" data-v-120ce87a${_scopeId}><div class="shell-inner" data-v-120ce87a${_scopeId}>`);
            if (unref(globalAlert)) {
              _push2(`<div class="alert" role="alert" data-v-120ce87a${_scopeId}><span class="alert-mark" aria-hidden="true" data-v-120ce87a${_scopeId}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-120ce87a${_scopeId}><line x1="12" y1="8" x2="12" y2="13" data-v-120ce87a${_scopeId}></line><line x1="12" y1="16.5" x2="12" y2="17" data-v-120ce87a${_scopeId}></line></svg></span><div class="alert-body" data-v-120ce87a${_scopeId}><h3 class="alert-title" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(globalAlert).title)}</h3><p class="alert-text" data-v-120ce87a${_scopeId}>${unref(globalAlert).text ?? ""}</p></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<header class="page-header" data-v-120ce87a${_scopeId}><span class="eyebrow-tool" data-v-120ce87a${_scopeId}>Outil 01 · Le Lab Mariell</span><h1 class="page-title" data-v-120ce87a${_scopeId}>Stagiaire ou alternant Sales : <em data-v-120ce87a${_scopeId}>on s&#39;en charge.</em></h1><p class="page-subtitle" data-v-120ce87a${_scopeId}> Vous nous décrivez votre besoin, nous activons notre vivier et vous présentons les profils pertinents. Sans frais — c&#39;est notre manière de contribuer à l&#39;écosystème Sales français. </p><p class="page-frame" data-v-120ce87a${_scopeId}> Service proposé sous réserve de disponibilité de profils pertinents. Nos clients restent prioritaires. Réponse sous 7 à 10 jours ouvrés. </p></header><form novalidate autocomplete="on" data-v-120ce87a${_scopeId}><section class="block" data-v-120ce87a${_scopeId}><div class="block-header" data-v-120ce87a${_scopeId}><span class="block-num" data-v-120ce87a${_scopeId}>01</span><h2 class="block-title" data-v-120ce87a${_scopeId}>Contact</h2><span class="block-rule" aria-hidden="true" data-v-120ce87a${_scopeId}></span></div><div class="fields fields--2col" data-v-120ce87a${_scopeId}><div data-field="firstname" class="${ssrRenderClass([{ "field--filled": unref(form).firstname.trim(), "field--error": unref(errors).firstname }, "field"])}" data-v-120ce87a${_scopeId}><label for="firstname" class="field-label" data-v-120ce87a${_scopeId}>Prénom <span class="field-required" data-v-120ce87a${_scopeId}>*</span></label><input id="firstname"${ssrRenderAttr("value", unref(form).firstname)} type="text" class="input" placeholder="Marie" required data-v-120ce87a${_scopeId}><p class="field-error" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(errors).firstname || "Ce champ est requis.")}</p></div><div data-field="lastname" class="${ssrRenderClass([{ "field--filled": unref(form).lastname.trim(), "field--error": unref(errors).lastname }, "field"])}" data-v-120ce87a${_scopeId}><label for="lastname" class="field-label" data-v-120ce87a${_scopeId}>Nom <span class="field-required" data-v-120ce87a${_scopeId}>*</span></label><input id="lastname"${ssrRenderAttr("value", unref(form).lastname)} type="text" class="input" placeholder="Dupont" required data-v-120ce87a${_scopeId}><p class="field-error" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(errors).lastname || "Ce champ est requis.")}</p></div></div><div class="fields" style="${ssrRenderStyle({ "margin-top": "24px" })}" data-v-120ce87a${_scopeId}><div data-field="email" class="${ssrRenderClass([{ "field--filled": unref(form).email.trim(), "field--error": unref(errors).email }, "field"])}" data-v-120ce87a${_scopeId}><label for="email" class="field-label" data-v-120ce87a${_scopeId}>Email professionnel <span class="field-required" data-v-120ce87a${_scopeId}>*</span></label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" class="input" placeholder="marie@votre-entreprise.com" required data-v-120ce87a${_scopeId}>`);
            if (!unref(errors).email) {
              _push2(`<p class="field-helper" data-v-120ce87a${_scopeId}>Email d&#39;entreprise requis (pas gmail, hotmail, etc.)</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="field-error" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(errors).email || "Format d'email invalide.")}</p></div><div data-field="phone" class="${ssrRenderClass([{ "field--filled": unref(form).phoneNumber.trim(), "field--error": unref(errors).phone }, "field"])}" data-v-120ce87a${_scopeId}><label for="phone" class="field-label" data-v-120ce87a${_scopeId}>Téléphone <span class="field-required" data-v-120ce87a${_scopeId}>*</span></label><div class="phone-group" data-v-120ce87a${_scopeId}><div class="phone-cc" data-v-120ce87a${_scopeId}><select aria-label="Indicatif pays" data-v-120ce87a${_scopeId}><option value="+33" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+33") : ssrLooseEqual(unref(form).phoneCc, "+33")) ? " selected" : ""}${_scopeId}>🇫🇷 +33</option><option value="+32" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+32") : ssrLooseEqual(unref(form).phoneCc, "+32")) ? " selected" : ""}${_scopeId}>🇧🇪 +32</option><option value="+41" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+41") : ssrLooseEqual(unref(form).phoneCc, "+41")) ? " selected" : ""}${_scopeId}>🇨🇭 +41</option><option value="+352" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+352") : ssrLooseEqual(unref(form).phoneCc, "+352")) ? " selected" : ""}${_scopeId}>🇱🇺 +352</option><option value="+44" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+44") : ssrLooseEqual(unref(form).phoneCc, "+44")) ? " selected" : ""}${_scopeId}>🇬🇧 +44</option><option value="+1" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+1") : ssrLooseEqual(unref(form).phoneCc, "+1")) ? " selected" : ""}${_scopeId}>🇺🇸 +1</option><option value="+49" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+49") : ssrLooseEqual(unref(form).phoneCc, "+49")) ? " selected" : ""}${_scopeId}>🇩🇪 +49</option><option value="+34" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+34") : ssrLooseEqual(unref(form).phoneCc, "+34")) ? " selected" : ""}${_scopeId}>🇪🇸 +34</option><option value="+39" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).phoneCc) ? ssrLooseContain(unref(form).phoneCc, "+39") : ssrLooseEqual(unref(form).phoneCc, "+39")) ? " selected" : ""}${_scopeId}>🇮🇹 +39</option></select></div><input id="phone"${ssrRenderAttr("value", unref(form).phoneNumber)} type="tel" class="phone-input" placeholder="6 12 34 56 78" required data-v-120ce87a${_scopeId}></div><p class="field-error" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(errors).phone || "Numéro de téléphone invalide.")}</p></div></div></section><section class="block" data-v-120ce87a${_scopeId}><div class="block-header" data-v-120ce87a${_scopeId}><span class="block-num" data-v-120ce87a${_scopeId}>02</span><h2 class="block-title" data-v-120ce87a${_scopeId}>Entreprise</h2><span class="block-rule" aria-hidden="true" data-v-120ce87a${_scopeId}></span></div><div class="fields" data-v-120ce87a${_scopeId}><div data-field="company" class="${ssrRenderClass([{ "field--filled": unref(form).company.trim(), "field--error": unref(errors).company }, "field"])}" data-v-120ce87a${_scopeId}><label for="company" class="field-label" data-v-120ce87a${_scopeId}>Nom de l&#39;entreprise <span class="field-required" data-v-120ce87a${_scopeId}>*</span></label><input id="company"${ssrRenderAttr("value", unref(form).company)} type="text" class="input" placeholder="Salesfit" required data-v-120ce87a${_scopeId}><p class="field-error" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(errors).company || "Ce champ est requis.")}</p></div><div data-field="company-url" class="${ssrRenderClass([{ "field--filled": unref(form).companyUrl.trim(), "field--error": unref(errors).companyUrl }, "field"])}" data-v-120ce87a${_scopeId}><label for="company-url" class="field-label" data-v-120ce87a${_scopeId}>Site web ou LinkedIn de l&#39;entreprise <span class="field-required" data-v-120ce87a${_scopeId}>*</span></label><input id="company-url"${ssrRenderAttr("value", unref(form).companyUrl)} type="url" class="input" placeholder="https://salesfit.com ou linkedin.com/company/..." required data-v-120ce87a${_scopeId}><p class="field-error" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(errors).companyUrl || "Lien invalide.")}</p></div></div></section><section class="block" data-v-120ce87a${_scopeId}><div class="block-header" data-v-120ce87a${_scopeId}><span class="block-num" data-v-120ce87a${_scopeId}>03</span><h2 class="block-title" data-v-120ce87a${_scopeId}>Besoin</h2><span class="block-rule" aria-hidden="true" data-v-120ce87a${_scopeId}></span></div><div data-field="contract" class="${ssrRenderClass([{ "field--filled": unref(form).contract, "field--error": unref(errors).contract }, "field"])}" style="${ssrRenderStyle({ "margin-bottom": "24px" })}" data-v-120ce87a${_scopeId}><span class="field-label" data-v-120ce87a${_scopeId}>Type de contrat <span class="field-required" data-v-120ce87a${_scopeId}>*</span></span><div class="radio-group" role="radiogroup" aria-label="Type de contrat" data-v-120ce87a${_scopeId}><label class="radio-tile" data-v-120ce87a${_scopeId}><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).contract, "stage")) ? " checked" : ""} type="radio" name="contract" value="stage" data-v-120ce87a${_scopeId}><span class="radio-dot" aria-hidden="true" data-v-120ce87a${_scopeId}></span><span class="radio-tile-label" data-v-120ce87a${_scopeId}>Stage</span></label><label class="radio-tile" data-v-120ce87a${_scopeId}><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).contract, "alternance")) ? " checked" : ""} type="radio" name="contract" value="alternance" data-v-120ce87a${_scopeId}><span class="radio-dot" aria-hidden="true" data-v-120ce87a${_scopeId}></span><span class="radio-tile-label" data-v-120ce87a${_scopeId}>Alternance</span></label></div><p class="field-error" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(errors).contract || "Ce champ est requis.")}</p></div><div class="fields fields--2col" data-v-120ce87a${_scopeId}><div data-field="profile" class="${ssrRenderClass([{ "field--filled": unref(form).profile, "field--error": unref(errors).profile }, "field"])}" data-v-120ce87a${_scopeId}><label for="profile" class="field-label" data-v-120ce87a${_scopeId}>Profil recherché <span class="field-required" data-v-120ce87a${_scopeId}>*</span></label><div class="select-wrap" data-v-120ce87a${_scopeId}><select id="profile" class="${ssrRenderClass({ "is-empty": !unref(form).profile })}" required data-v-120ce87a${_scopeId}><option value="" disabled data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).profile) ? ssrLooseContain(unref(form).profile, "") : ssrLooseEqual(unref(form).profile, "")) ? " selected" : ""}${_scopeId}>Sélectionnez un profil…</option><option value="sdr" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).profile) ? ssrLooseContain(unref(form).profile, "sdr") : ssrLooseEqual(unref(form).profile, "sdr")) ? " selected" : ""}${_scopeId}>SDR / BDR</option><option value="bizdev" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).profile) ? ssrLooseContain(unref(form).profile, "bizdev") : ssrLooseEqual(unref(form).profile, "bizdev")) ? " selected" : ""}${_scopeId}>Business Developer Junior</option><option value="ae" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).profile) ? ssrLooseContain(unref(form).profile, "ae") : ssrLooseEqual(unref(form).profile, "ae")) ? " selected" : ""}${_scopeId}>Account Executive Junior</option><option value="ops" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).profile) ? ssrLooseContain(unref(form).profile, "ops") : ssrLooseEqual(unref(form).profile, "ops")) ? " selected" : ""}${_scopeId}>Sales Ops Junior</option><option value="autre" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).profile) ? ssrLooseContain(unref(form).profile, "autre") : ssrLooseEqual(unref(form).profile, "autre")) ? " selected" : ""}${_scopeId}>Autre</option></select></div><p class="field-error" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(errors).profile || "Ce champ est requis.")}</p>`);
            if (unref(form).profile === "autre") {
              _push2(`<div data-field="profileAutre" class="${ssrRenderClass([{ "field--filled": unref(form).profileAutre.trim(), "field--error": unref(errors).profileAutre }, "field autre-field autre-field--show"])}" data-v-120ce87a${_scopeId}><label for="profile-autre" class="field-label" data-v-120ce87a${_scopeId}>Précisez le profil recherché</label><input id="profile-autre"${ssrRenderAttr("value", unref(form).profileAutre)} type="text" class="input" maxlength="60" placeholder="Ex. Field Sales Junior, Inside Sales…" data-v-120ce87a${_scopeId}><p class="field-error" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(errors).profileAutre || "Précisez le profil recherché.")}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-field="start-date" class="${ssrRenderClass([{ "field--filled": unref(form).startDate, "field--error": unref(errors).startDate }, "field"])}" data-v-120ce87a${_scopeId}><label for="start-date" class="field-label" data-v-120ce87a${_scopeId}>Date de démarrage souhaitée <span class="field-required" data-v-120ce87a${_scopeId}>*</span></label><div class="select-wrap" data-v-120ce87a${_scopeId}><select id="start-date" class="${ssrRenderClass({ "is-empty": !unref(form).startDate })}" required data-v-120ce87a${_scopeId}><option value="" disabled data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).startDate) ? ssrLooseContain(unref(form).startDate, "") : ssrLooseEqual(unref(form).startDate, "")) ? " selected" : ""}${_scopeId}>Sélectionnez une période…</option><option value="asap" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).startDate) ? ssrLooseContain(unref(form).startDate, "asap") : ssrLooseEqual(unref(form).startDate, "asap")) ? " selected" : ""}${_scopeId}>ASAP</option><option value="1-2m" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).startDate) ? ssrLooseContain(unref(form).startDate, "1-2m") : ssrLooseEqual(unref(form).startDate, "1-2m")) ? " selected" : ""}${_scopeId}>Sous 1 à 2 mois</option><option value="3-6m" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).startDate) ? ssrLooseContain(unref(form).startDate, "3-6m") : ssrLooseEqual(unref(form).startDate, "3-6m")) ? " selected" : ""}${_scopeId}>Sous 3 à 6 mois</option><option value="flex" data-v-120ce87a${ssrIncludeBooleanAttr(Array.isArray(unref(form).startDate) ? ssrLooseContain(unref(form).startDate, "flex") : ssrLooseEqual(unref(form).startDate, "flex")) ? " selected" : ""}${_scopeId}>Flexible</option></select></div><p class="field-error" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(errors).startDate || "Ce champ est requis.")}</p></div></div><div class="fields" style="${ssrRenderStyle({ "margin-top": "24px" })}" data-v-120ce87a${_scopeId}><div data-field="location" class="${ssrRenderClass([{ "field--filled": unref(form).location.trim(), "field--error": unref(errors).location }, "field"])}" data-v-120ce87a${_scopeId}><label for="location" class="field-label" data-v-120ce87a${_scopeId}>Localisation <span class="field-required" data-v-120ce87a${_scopeId}>*</span></label><input id="location"${ssrRenderAttr("value", unref(form).location)} type="text" class="input" placeholder="Paris — remote partiel possible" required data-v-120ce87a${_scopeId}><p class="field-error" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(errors).location || "Ce champ est requis.")}</p></div><div data-field="brief" class="${ssrRenderClass([{ "field--filled": unref(form).brief.trim(), "field--error": unref(errors).brief }, "field"])}" data-v-120ce87a${_scopeId}><label for="brief" class="field-label" data-v-120ce87a${_scopeId}>Brief de la mission <span class="field-required" data-v-120ce87a${_scopeId}>*</span></label><div class="textarea-wrap" data-v-120ce87a${_scopeId}><textarea id="brief" class="textarea" maxlength="500" required placeholder="Décrivez en quelques lignes le contexte de l&#39;équipe Sales, la mission du futur stagiaire ou alternant, et ce qui rendrait le profil pertinent pour vous. (500 caractères max)" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(form).brief)}</textarea><span class="${ssrRenderClass([unref(briefCounterClass), "textarea-counter"])}" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(briefLen))} / 500</span></div><p class="field-error" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(errors).brief || "Ce champ est requis.")}</p></div></div></section><section class="block" style="${ssrRenderStyle({ "margin-bottom": "16px" })}" data-v-120ce87a${_scopeId}><label data-field="rgpd" class="${ssrRenderClass([{ "field--error": unref(errors).rgpd }, "checkbox-row"])}" data-v-120ce87a${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).rgpd) ? ssrLooseContain(unref(form).rgpd, null) : unref(form).rgpd) ? " checked" : ""} type="checkbox" required data-v-120ce87a${_scopeId}><span class="checkbox-box" aria-hidden="true" data-v-120ce87a${_scopeId}></span><span class="checkbox-text" data-v-120ce87a${_scopeId}> J&#39;accepte que mes données soient utilisées par Mariell pour traiter ma demande, conformément à la `);
            _push2(ssrRenderComponent(_component_NuxtLink, { to: "/politique-confidentialite" }, {
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
            _push2(`. </span></label>`);
            if (unref(errors).rgpd) {
              _push2(`<p class="field-error" style="${ssrRenderStyle({ "display": "inline-flex", "margin-top": "8px" })}" data-v-120ce87a${_scopeId}>${ssrInterpolate(unref(errors).rgpd)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</section><div aria-hidden="true" style="${ssrRenderStyle({ "position": "absolute", "left": "-9999px", "width": "1px", "height": "1px", "overflow": "hidden" })}" data-v-120ce87a${_scopeId}><label for="company_website" data-v-120ce87a${_scopeId}>Ne pas remplir ce champ</label><input id="company_website"${ssrRenderAttr("value", unref(form).companyWebsite)} name="company_website" type="text" tabindex="-1" autocomplete="off" data-v-120ce87a${_scopeId}></div>`);
            if (unref(hasTurnstile)) {
              _push2(`<div class="cf-mount" data-v-120ce87a${_scopeId}>`);
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
            _push2(`<div class="submit-area" data-v-120ce87a${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(!unref(isFormReady) || unref(isLoading)) ? " disabled" : ""} class="${ssrRenderClass(["submit-btn", { "submit-btn--disabled": !unref(isFormReady) && !unref(isLoading), "submit-btn--loading": unref(isLoading) }])}" aria-live="polite" data-v-120ce87a${_scopeId}>`);
            if (unref(isLoading)) {
              _push2(`<span class="spinner" aria-hidden="true" data-v-120ce87a${_scopeId}></span>`);
            } else {
              _push2(`<!---->`);
            }
            if (!unref(isLoading)) {
              _push2(`<span class="submit-btn-label" data-v-120ce87a${_scopeId}>Envoyer ma demande</span>`);
            } else {
              _push2(`<span class="submit-btn-loading-label" data-v-120ce87a${_scopeId}>Envoi en cours...</span>`);
            }
            if (!unref(isLoading)) {
              _push2(`<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-120ce87a${_scopeId}><path d="M5 12h14M13 6l6 6-6 6" data-v-120ce87a${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</button><p class="rgpd-fineprint" data-v-120ce87a${_scopeId}> Vos données ne sont jamais transmises à des tiers. Vous pouvez demander leur suppression à tout moment. </p><span class="cf-mention" data-v-120ce87a${_scopeId}>Protégé par Cloudflare Turnstile</span></div></form><div class="foot-signature" data-v-120ce87a${_scopeId}><span class="foot-signature-line1" data-v-120ce87a${_scopeId}>Mariell · Cabinet de recrutement Sales</span><span class="foot-signature-line2" data-v-120ce87a${_scopeId}>Recruter n&#39;est pas un pari.</span></div></div></main>`);
          } else {
            return [
              createVNode("main", { class: "form-shell" }, [
                createVNode("div", { class: "shell-inner" }, [
                  createVNode(Transition, { name: "alert-fade" }, {
                    default: withCtx(() => [
                      unref(globalAlert) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "alert",
                        role: "alert"
                      }, [
                        createVNode("span", {
                          class: "alert-mark",
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
                        createVNode("div", { class: "alert-body" }, [
                          createVNode("h3", { class: "alert-title" }, toDisplayString(unref(globalAlert).title), 1),
                          createVNode("p", {
                            class: "alert-text",
                            innerHTML: unref(globalAlert).text
                          }, null, 8, ["innerHTML"])
                        ])
                      ])) : createCommentVNode("", true)
                    ]),
                    _: 1
                  }),
                  createVNode("header", { class: "page-header" }, [
                    createVNode("span", { class: "eyebrow-tool" }, "Outil 01 · Le Lab Mariell"),
                    createVNode("h1", { class: "page-title" }, [
                      createTextVNode("Stagiaire ou alternant Sales : "),
                      createVNode("em", null, "on s'en charge.")
                    ]),
                    createVNode("p", { class: "page-subtitle" }, " Vous nous décrivez votre besoin, nous activons notre vivier et vous présentons les profils pertinents. Sans frais — c'est notre manière de contribuer à l'écosystème Sales français. "),
                    createVNode("p", { class: "page-frame" }, " Service proposé sous réserve de disponibilité de profils pertinents. Nos clients restent prioritaires. Réponse sous 7 à 10 jours ouvrés. ")
                  ]),
                  createVNode("form", {
                    novalidate: "",
                    autocomplete: "on",
                    onSubmit: withModifiers(onSubmit, ["prevent"])
                  }, [
                    createVNode("section", { class: "block" }, [
                      createVNode("div", { class: "block-header" }, [
                        createVNode("span", { class: "block-num" }, "01"),
                        createVNode("h2", { class: "block-title" }, "Contact"),
                        createVNode("span", {
                          class: "block-rule",
                          "aria-hidden": "true"
                        })
                      ]),
                      createVNode("div", { class: "fields fields--2col" }, [
                        createVNode("div", {
                          class: ["field", { "field--filled": unref(form).firstname.trim(), "field--error": unref(errors).firstname }],
                          "data-field": "firstname"
                        }, [
                          createVNode("label", {
                            for: "firstname",
                            class: "field-label"
                          }, [
                            createTextVNode("Prénom "),
                            createVNode("span", { class: "field-required" }, "*")
                          ]),
                          withDirectives(createVNode("input", {
                            id: "firstname",
                            "onUpdate:modelValue": ($event) => unref(form).firstname = $event,
                            type: "text",
                            class: "input",
                            placeholder: "Marie",
                            required: "",
                            onInput: ($event) => onInput("firstname"),
                            onBlur: ($event) => onBlur("firstname")
                          }, null, 40, ["onUpdate:modelValue", "onInput", "onBlur"]), [
                            [vModelText, unref(form).firstname]
                          ]),
                          createVNode("p", { class: "field-error" }, toDisplayString(unref(errors).firstname || "Ce champ est requis."), 1)
                        ], 2),
                        createVNode("div", {
                          class: ["field", { "field--filled": unref(form).lastname.trim(), "field--error": unref(errors).lastname }],
                          "data-field": "lastname"
                        }, [
                          createVNode("label", {
                            for: "lastname",
                            class: "field-label"
                          }, [
                            createTextVNode("Nom "),
                            createVNode("span", { class: "field-required" }, "*")
                          ]),
                          withDirectives(createVNode("input", {
                            id: "lastname",
                            "onUpdate:modelValue": ($event) => unref(form).lastname = $event,
                            type: "text",
                            class: "input",
                            placeholder: "Dupont",
                            required: "",
                            onInput: ($event) => onInput("lastname"),
                            onBlur: ($event) => onBlur("lastname")
                          }, null, 40, ["onUpdate:modelValue", "onInput", "onBlur"]), [
                            [vModelText, unref(form).lastname]
                          ]),
                          createVNode("p", { class: "field-error" }, toDisplayString(unref(errors).lastname || "Ce champ est requis."), 1)
                        ], 2)
                      ]),
                      createVNode("div", {
                        class: "fields",
                        style: { "margin-top": "24px" }
                      }, [
                        createVNode("div", {
                          class: ["field", { "field--filled": unref(form).email.trim(), "field--error": unref(errors).email }],
                          "data-field": "email"
                        }, [
                          createVNode("label", {
                            for: "email",
                            class: "field-label"
                          }, [
                            createTextVNode("Email professionnel "),
                            createVNode("span", { class: "field-required" }, "*")
                          ]),
                          withDirectives(createVNode("input", {
                            id: "email",
                            "onUpdate:modelValue": ($event) => unref(form).email = $event,
                            type: "email",
                            class: "input",
                            placeholder: "marie@votre-entreprise.com",
                            required: "",
                            onInput: ($event) => onInput("email"),
                            onBlur: ($event) => onBlur("email")
                          }, null, 40, ["onUpdate:modelValue", "onInput", "onBlur"]), [
                            [vModelText, unref(form).email]
                          ]),
                          !unref(errors).email ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "field-helper"
                          }, "Email d'entreprise requis (pas gmail, hotmail, etc.)")) : createCommentVNode("", true),
                          createVNode("p", { class: "field-error" }, toDisplayString(unref(errors).email || "Format d'email invalide."), 1)
                        ], 2),
                        createVNode("div", {
                          class: ["field", { "field--filled": unref(form).phoneNumber.trim(), "field--error": unref(errors).phone }],
                          "data-field": "phone"
                        }, [
                          createVNode("label", {
                            for: "phone",
                            class: "field-label"
                          }, [
                            createTextVNode("Téléphone "),
                            createVNode("span", { class: "field-required" }, "*")
                          ]),
                          createVNode("div", { class: "phone-group" }, [
                            createVNode("div", { class: "phone-cc" }, [
                              withDirectives(createVNode("select", {
                                "onUpdate:modelValue": ($event) => unref(form).phoneCc = $event,
                                "aria-label": "Indicatif pays"
                              }, [
                                createVNode("option", { value: "+33" }, "🇫🇷 +33"),
                                createVNode("option", { value: "+32" }, "🇧🇪 +32"),
                                createVNode("option", { value: "+41" }, "🇨🇭 +41"),
                                createVNode("option", { value: "+352" }, "🇱🇺 +352"),
                                createVNode("option", { value: "+44" }, "🇬🇧 +44"),
                                createVNode("option", { value: "+1" }, "🇺🇸 +1"),
                                createVNode("option", { value: "+49" }, "🇩🇪 +49"),
                                createVNode("option", { value: "+34" }, "🇪🇸 +34"),
                                createVNode("option", { value: "+39" }, "🇮🇹 +39")
                              ], 8, ["onUpdate:modelValue"]), [
                                [vModelSelect, unref(form).phoneCc]
                              ])
                            ]),
                            withDirectives(createVNode("input", {
                              id: "phone",
                              "onUpdate:modelValue": ($event) => unref(form).phoneNumber = $event,
                              type: "tel",
                              class: "phone-input",
                              placeholder: "6 12 34 56 78",
                              required: "",
                              onInput: ($event) => onInput("phone"),
                              onBlur: ($event) => onBlur("phone")
                            }, null, 40, ["onUpdate:modelValue", "onInput", "onBlur"]), [
                              [vModelText, unref(form).phoneNumber]
                            ])
                          ]),
                          createVNode("p", { class: "field-error" }, toDisplayString(unref(errors).phone || "Numéro de téléphone invalide."), 1)
                        ], 2)
                      ])
                    ]),
                    createVNode("section", { class: "block" }, [
                      createVNode("div", { class: "block-header" }, [
                        createVNode("span", { class: "block-num" }, "02"),
                        createVNode("h2", { class: "block-title" }, "Entreprise"),
                        createVNode("span", {
                          class: "block-rule",
                          "aria-hidden": "true"
                        })
                      ]),
                      createVNode("div", { class: "fields" }, [
                        createVNode("div", {
                          class: ["field", { "field--filled": unref(form).company.trim(), "field--error": unref(errors).company }],
                          "data-field": "company"
                        }, [
                          createVNode("label", {
                            for: "company",
                            class: "field-label"
                          }, [
                            createTextVNode("Nom de l'entreprise "),
                            createVNode("span", { class: "field-required" }, "*")
                          ]),
                          withDirectives(createVNode("input", {
                            id: "company",
                            "onUpdate:modelValue": ($event) => unref(form).company = $event,
                            type: "text",
                            class: "input",
                            placeholder: "Salesfit",
                            required: "",
                            onInput: ($event) => onInput("company"),
                            onBlur: ($event) => onBlur("company")
                          }, null, 40, ["onUpdate:modelValue", "onInput", "onBlur"]), [
                            [vModelText, unref(form).company]
                          ]),
                          createVNode("p", { class: "field-error" }, toDisplayString(unref(errors).company || "Ce champ est requis."), 1)
                        ], 2),
                        createVNode("div", {
                          class: ["field", { "field--filled": unref(form).companyUrl.trim(), "field--error": unref(errors).companyUrl }],
                          "data-field": "company-url"
                        }, [
                          createVNode("label", {
                            for: "company-url",
                            class: "field-label"
                          }, [
                            createTextVNode("Site web ou LinkedIn de l'entreprise "),
                            createVNode("span", { class: "field-required" }, "*")
                          ]),
                          withDirectives(createVNode("input", {
                            id: "company-url",
                            "onUpdate:modelValue": ($event) => unref(form).companyUrl = $event,
                            type: "url",
                            class: "input",
                            placeholder: "https://salesfit.com ou linkedin.com/company/...",
                            required: "",
                            onInput: ($event) => onInput("companyUrl"),
                            onBlur: ($event) => onBlur("companyUrl")
                          }, null, 40, ["onUpdate:modelValue", "onInput", "onBlur"]), [
                            [vModelText, unref(form).companyUrl]
                          ]),
                          createVNode("p", { class: "field-error" }, toDisplayString(unref(errors).companyUrl || "Lien invalide."), 1)
                        ], 2)
                      ])
                    ]),
                    createVNode("section", { class: "block" }, [
                      createVNode("div", { class: "block-header" }, [
                        createVNode("span", { class: "block-num" }, "03"),
                        createVNode("h2", { class: "block-title" }, "Besoin"),
                        createVNode("span", {
                          class: "block-rule",
                          "aria-hidden": "true"
                        })
                      ]),
                      createVNode("div", {
                        class: ["field", { "field--filled": unref(form).contract, "field--error": unref(errors).contract }],
                        "data-field": "contract",
                        style: { "margin-bottom": "24px" }
                      }, [
                        createVNode("span", { class: "field-label" }, [
                          createTextVNode("Type de contrat "),
                          createVNode("span", { class: "field-required" }, "*")
                        ]),
                        createVNode("div", {
                          class: "radio-group",
                          role: "radiogroup",
                          "aria-label": "Type de contrat"
                        }, [
                          createVNode("label", { class: "radio-tile" }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).contract = $event,
                              type: "radio",
                              name: "contract",
                              value: "stage",
                              onChange: ($event) => onInput("contract")
                            }, null, 40, ["onUpdate:modelValue", "onChange"]), [
                              [vModelRadio, unref(form).contract]
                            ]),
                            createVNode("span", {
                              class: "radio-dot",
                              "aria-hidden": "true"
                            }),
                            createVNode("span", { class: "radio-tile-label" }, "Stage")
                          ]),
                          createVNode("label", { class: "radio-tile" }, [
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).contract = $event,
                              type: "radio",
                              name: "contract",
                              value: "alternance",
                              onChange: ($event) => onInput("contract")
                            }, null, 40, ["onUpdate:modelValue", "onChange"]), [
                              [vModelRadio, unref(form).contract]
                            ]),
                            createVNode("span", {
                              class: "radio-dot",
                              "aria-hidden": "true"
                            }),
                            createVNode("span", { class: "radio-tile-label" }, "Alternance")
                          ])
                        ]),
                        createVNode("p", { class: "field-error" }, toDisplayString(unref(errors).contract || "Ce champ est requis."), 1)
                      ], 2),
                      createVNode("div", { class: "fields fields--2col" }, [
                        createVNode("div", {
                          class: ["field", { "field--filled": unref(form).profile, "field--error": unref(errors).profile }],
                          "data-field": "profile"
                        }, [
                          createVNode("label", {
                            for: "profile",
                            class: "field-label"
                          }, [
                            createTextVNode("Profil recherché "),
                            createVNode("span", { class: "field-required" }, "*")
                          ]),
                          createVNode("div", { class: "select-wrap" }, [
                            withDirectives(createVNode("select", {
                              id: "profile",
                              "onUpdate:modelValue": ($event) => unref(form).profile = $event,
                              class: { "is-empty": !unref(form).profile },
                              required: "",
                              onChange: ($event) => onInput("profile"),
                              onBlur: ($event) => onBlur("profile")
                            }, [
                              createVNode("option", {
                                value: "",
                                disabled: ""
                              }, "Sélectionnez un profil…"),
                              createVNode("option", { value: "sdr" }, "SDR / BDR"),
                              createVNode("option", { value: "bizdev" }, "Business Developer Junior"),
                              createVNode("option", { value: "ae" }, "Account Executive Junior"),
                              createVNode("option", { value: "ops" }, "Sales Ops Junior"),
                              createVNode("option", { value: "autre" }, "Autre")
                            ], 42, ["onUpdate:modelValue", "onChange", "onBlur"]), [
                              [vModelSelect, unref(form).profile]
                            ])
                          ]),
                          createVNode("p", { class: "field-error" }, toDisplayString(unref(errors).profile || "Ce champ est requis."), 1),
                          unref(form).profile === "autre" ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: ["field autre-field autre-field--show", { "field--filled": unref(form).profileAutre.trim(), "field--error": unref(errors).profileAutre }],
                            "data-field": "profileAutre"
                          }, [
                            createVNode("label", {
                              for: "profile-autre",
                              class: "field-label"
                            }, "Précisez le profil recherché"),
                            withDirectives(createVNode("input", {
                              id: "profile-autre",
                              "onUpdate:modelValue": ($event) => unref(form).profileAutre = $event,
                              type: "text",
                              class: "input",
                              maxlength: "60",
                              placeholder: "Ex. Field Sales Junior, Inside Sales…",
                              onInput: ($event) => onInput("profileAutre"),
                              onBlur: ($event) => onBlur("profileAutre")
                            }, null, 40, ["onUpdate:modelValue", "onInput", "onBlur"]), [
                              [vModelText, unref(form).profileAutre]
                            ]),
                            createVNode("p", { class: "field-error" }, toDisplayString(unref(errors).profileAutre || "Précisez le profil recherché."), 1)
                          ], 2)) : createCommentVNode("", true)
                        ], 2),
                        createVNode("div", {
                          class: ["field", { "field--filled": unref(form).startDate, "field--error": unref(errors).startDate }],
                          "data-field": "start-date"
                        }, [
                          createVNode("label", {
                            for: "start-date",
                            class: "field-label"
                          }, [
                            createTextVNode("Date de démarrage souhaitée "),
                            createVNode("span", { class: "field-required" }, "*")
                          ]),
                          createVNode("div", { class: "select-wrap" }, [
                            withDirectives(createVNode("select", {
                              id: "start-date",
                              "onUpdate:modelValue": ($event) => unref(form).startDate = $event,
                              class: { "is-empty": !unref(form).startDate },
                              required: "",
                              onChange: ($event) => onInput("startDate"),
                              onBlur: ($event) => onBlur("startDate")
                            }, [
                              createVNode("option", {
                                value: "",
                                disabled: ""
                              }, "Sélectionnez une période…"),
                              createVNode("option", { value: "asap" }, "ASAP"),
                              createVNode("option", { value: "1-2m" }, "Sous 1 à 2 mois"),
                              createVNode("option", { value: "3-6m" }, "Sous 3 à 6 mois"),
                              createVNode("option", { value: "flex" }, "Flexible")
                            ], 42, ["onUpdate:modelValue", "onChange", "onBlur"]), [
                              [vModelSelect, unref(form).startDate]
                            ])
                          ]),
                          createVNode("p", { class: "field-error" }, toDisplayString(unref(errors).startDate || "Ce champ est requis."), 1)
                        ], 2)
                      ]),
                      createVNode("div", {
                        class: "fields",
                        style: { "margin-top": "24px" }
                      }, [
                        createVNode("div", {
                          class: ["field", { "field--filled": unref(form).location.trim(), "field--error": unref(errors).location }],
                          "data-field": "location"
                        }, [
                          createVNode("label", {
                            for: "location",
                            class: "field-label"
                          }, [
                            createTextVNode("Localisation "),
                            createVNode("span", { class: "field-required" }, "*")
                          ]),
                          withDirectives(createVNode("input", {
                            id: "location",
                            "onUpdate:modelValue": ($event) => unref(form).location = $event,
                            type: "text",
                            class: "input",
                            placeholder: "Paris — remote partiel possible",
                            required: "",
                            onInput: ($event) => onInput("location"),
                            onBlur: ($event) => onBlur("location")
                          }, null, 40, ["onUpdate:modelValue", "onInput", "onBlur"]), [
                            [vModelText, unref(form).location]
                          ]),
                          createVNode("p", { class: "field-error" }, toDisplayString(unref(errors).location || "Ce champ est requis."), 1)
                        ], 2),
                        createVNode("div", {
                          class: ["field", { "field--filled": unref(form).brief.trim(), "field--error": unref(errors).brief }],
                          "data-field": "brief"
                        }, [
                          createVNode("label", {
                            for: "brief",
                            class: "field-label"
                          }, [
                            createTextVNode("Brief de la mission "),
                            createVNode("span", { class: "field-required" }, "*")
                          ]),
                          createVNode("div", { class: "textarea-wrap" }, [
                            withDirectives(createVNode("textarea", {
                              id: "brief",
                              "onUpdate:modelValue": ($event) => unref(form).brief = $event,
                              class: "textarea",
                              maxlength: "500",
                              required: "",
                              placeholder: "Décrivez en quelques lignes le contexte de l'équipe Sales, la mission du futur stagiaire ou alternant, et ce qui rendrait le profil pertinent pour vous. (500 caractères max)",
                              onInput: ($event) => onInput("brief"),
                              onBlur: ($event) => onBlur("brief")
                            }, null, 40, ["onUpdate:modelValue", "onInput", "onBlur"]), [
                              [vModelText, unref(form).brief]
                            ]),
                            createVNode("span", {
                              class: ["textarea-counter", unref(briefCounterClass)]
                            }, toDisplayString(unref(briefLen)) + " / 500", 3)
                          ]),
                          createVNode("p", { class: "field-error" }, toDisplayString(unref(errors).brief || "Ce champ est requis."), 1)
                        ], 2)
                      ])
                    ]),
                    createVNode("section", {
                      class: "block",
                      style: { "margin-bottom": "16px" }
                    }, [
                      createVNode("label", {
                        class: ["checkbox-row", { "field--error": unref(errors).rgpd }],
                        "data-field": "rgpd"
                      }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).rgpd = $event,
                          type: "checkbox",
                          required: "",
                          onChange: ($event) => onInput("rgpd")
                        }, null, 40, ["onUpdate:modelValue", "onChange"]), [
                          [vModelCheckbox, unref(form).rgpd]
                        ]),
                        createVNode("span", {
                          class: "checkbox-box",
                          "aria-hidden": "true"
                        }),
                        createVNode("span", { class: "checkbox-text" }, [
                          createTextVNode(" J'accepte que mes données soient utilisées par Mariell pour traiter ma demande, conformément à la "),
                          createVNode(_component_NuxtLink, { to: "/politique-confidentialite" }, {
                            default: withCtx(() => [
                              createTextVNode("politique de confidentialité")
                            ]),
                            _: 1
                          }),
                          createTextVNode(". ")
                        ])
                      ], 2),
                      unref(errors).rgpd ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "field-error",
                        style: { "display": "inline-flex", "margin-top": "8px" }
                      }, toDisplayString(unref(errors).rgpd), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", {
                      "aria-hidden": "true",
                      style: { "position": "absolute", "left": "-9999px", "width": "1px", "height": "1px", "overflow": "hidden" }
                    }, [
                      createVNode("label", { for: "company_website" }, "Ne pas remplir ce champ"),
                      withDirectives(createVNode("input", {
                        id: "company_website",
                        "onUpdate:modelValue": ($event) => unref(form).companyWebsite = $event,
                        name: "company_website",
                        type: "text",
                        tabindex: "-1",
                        autocomplete: "off"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).companyWebsite]
                      ])
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
                    createVNode("div", { class: "submit-area" }, [
                      createVNode("button", {
                        type: "submit",
                        disabled: !unref(isFormReady) || unref(isLoading),
                        class: ["submit-btn", { "submit-btn--disabled": !unref(isFormReady) && !unref(isLoading), "submit-btn--loading": unref(isLoading) }],
                        "aria-live": "polite"
                      }, [
                        unref(isLoading) ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "spinner",
                          "aria-hidden": "true"
                        })) : createCommentVNode("", true),
                        !unref(isLoading) ? (openBlock(), createBlock("span", {
                          key: 1,
                          class: "submit-btn-label"
                        }, "Envoyer ma demande")) : (openBlock(), createBlock("span", {
                          key: 2,
                          class: "submit-btn-loading-label"
                        }, "Envoi en cours...")),
                        !unref(isLoading) ? (openBlock(), createBlock("svg", {
                          key: 3,
                          class: "arrow",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "aria-hidden": "true"
                        }, [
                          createVNode("path", { d: "M5 12h14M13 6l6 6-6 6" })
                        ])) : createCommentVNode("", true)
                      ], 10, ["disabled"]),
                      createVNode("p", { class: "rgpd-fineprint" }, " Vos données ne sont jamais transmises à des tiers. Vous pouvez demander leur suppression à tout moment. "),
                      createVNode("span", { class: "cf-mention" }, "Protégé par Cloudflare Turnstile")
                    ])
                  ], 32),
                  createVNode("div", { class: "foot-signature" }, [
                    createVNode("span", { class: "foot-signature-line1" }, "Mariell · Cabinet de recrutement Sales"),
                    createVNode("span", { class: "foot-signature-line2" }, "Recruter n'est pas un pari.")
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lab/demande-stage-alternance/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-120ce87a"]]);

export { index as default };
//# sourceMappingURL=index-CpCJSCFN.mjs.map
