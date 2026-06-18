<script setup lang="ts">
definePageMeta({ layout: 'tool' })

const config = useRuntimeConfig()
const hasTurnstile = computed(() => {
  const t = (config.public as { turnstile?: { siteKey?: string } }).turnstile
  return Boolean(t?.siteKey)
})

// ---------- Mappings option-value → label envoyé au serveur ----------
const PROFILE_LABELS: Record<string, string> = {
  sdr: 'SDR / BDR',
  bizdev: 'Business Developer Junior',
  ae: 'Account Executive Junior',
  ops: 'Sales Ops Junior',
  autre: 'Autre',
}
const START_DATE_LABELS: Record<string, string> = {
  asap: 'ASAP',
  '1-2m': 'Sous 1 à 2 mois',
  '3-6m': 'Sous 3 à 6 mois',
  flex: 'Flexible',
}
const CONTRACT_LABELS: Record<string, string> = {
  stage: 'Stage',
  alternance: 'Alternance',
}

// ---------- Form state ----------
const form = reactive({
  firstname: '',
  lastname: '',
  email: '',
  phoneCc: '+33',
  phoneNumber: '',
  company: '',
  companyUrl: '',
  contract: '' as '' | 'stage' | 'alternance',
  profile: '',
  profileAutre: '',
  startDate: '',
  location: '',
  brief: '',
  rgpd: false,
  companyWebsite: '', // honeypot — must stay empty
})

const turnstileToken = ref(hasTurnstile.value ? '' : 'dev-stub')
const turnstile = ref<{ reset?: () => void } | null>(null)

function resetTurnstile() {
  turnstile.value?.reset?.()
  turnstileToken.value = hasTurnstile.value ? '' : 'dev-stub'
}

// ---------- Errors + touched tracking ----------
type FieldKey =
  | 'firstname'
  | 'lastname'
  | 'email'
  | 'phone'
  | 'company'
  | 'companyUrl'
  | 'contract'
  | 'profile'
  | 'profileAutre'
  | 'startDate'
  | 'location'
  | 'brief'
  | 'rgpd'

const errors = reactive<Record<FieldKey, string | null>>({
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
  rgpd: null,
})
const touched = reactive<Record<FieldKey, boolean>>({
  firstname: false, lastname: false, email: false, phone: false,
  company: false, companyUrl: false, contract: false, profile: false,
  profileAutre: false, startDate: false, location: false, brief: false, rgpd: false,
})

// ---------- Regex ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_RE =
  /^(https?:\/\/[^\s]+|(www\.)?linkedin\.com\/(company|in)\/[^\s]+|[a-z0-9-]+\.[a-z]{2,}([/?].*)?)$/i
const PHONE_RE = /^[+\d][\d\s\-().]{6,}$/
const PERSONAL_EMAIL_RE =
  /@(gmail|googlemail|hotmail|yahoo|outlook|icloud|me|mac|live|protonmail|proton|gmx|aol|yandex|tutanota|free|orange|sfr|wanadoo|laposte|neuf|bbox|numericable)\./i

// ---------- Per-field validators (inline) ----------
function validateField(key: FieldKey): string | null {
  const v = (val: string) => val.trim()

  switch (key) {
    case 'firstname':
      return v(form.firstname) ? null : 'Ce champ est requis.'
    case 'lastname':
      return v(form.lastname) ? null : 'Ce champ est requis.'
    case 'email': {
      const e = v(form.email)
      if (!e) return 'Ce champ est requis.'
      if (!EMAIL_RE.test(e)) return "Format d’email invalide."
      if (PERSONAL_EMAIL_RE.test(e))
        return "Cet outil est réservé aux entreprises. Merci d’utiliser votre email professionnel."
      return null
    }
    case 'phone': {
      const p = v(form.phoneNumber)
      if (!p) return 'Ce champ est requis.'
      if (!PHONE_RE.test(p) || p.replace(/\D/g, '').length < 7)
        return 'Numéro de téléphone invalide.'
      return null
    }
    case 'company':
      return v(form.company).length >= 2 ? null : 'Ce champ est requis.'
    case 'companyUrl': {
      const u = v(form.companyUrl)
      if (!u) return 'Ce champ est requis.'
      if (!URL_RE.test(u))
        return 'Lien invalide. Saisissez un site web (https://...) ou une URL LinkedIn complète.'
      return null
    }
    case 'contract':
      return form.contract ? null : 'Ce champ est requis.'
    case 'profile':
      return form.profile ? null : 'Ce champ est requis.'
    case 'profileAutre':
      if (form.profile !== 'autre') return null
      return v(form.profileAutre) ? null : 'Précisez le profil recherché (60 caractères max).'
    case 'startDate':
      return form.startDate ? null : 'Ce champ est requis.'
    case 'location':
      return v(form.location).length >= 2 ? null : 'Ce champ est requis.'
    case 'brief': {
      const b = v(form.brief)
      if (!b) return 'Ce champ est requis.'
      if (b.length < 20) return 'Brief trop court — 20 caractères minimum.'
      if (b.length > 500) return `500 caractères maximum (vous en avez ${b.length}).`
      return null
    }
    case 'rgpd':
      return form.rgpd ? null : 'Vous devez accepter la politique de confidentialité pour continuer.'
  }
}

function onBlur(key: FieldKey) {
  touched[key] = true
  errors[key] = validateField(key)
}

function onInput(key: FieldKey) {
  if (touched[key] && errors[key]) {
    errors[key] = validateField(key)
  }
}

// ---------- Compteur brief ----------
const briefLen = computed(() => form.brief.length)
const briefCounterClass = computed(() => {
  const n = briefLen.value
  if (n >= 500) return 'textarea-counter--danger'
  if (n >= 400) return 'textarea-counter--warn'
  return ''
})

// ---------- Champ conditionnel "Autre" ----------
watch(
  () => form.profile,
  (val) => {
    if (val !== 'autre') {
      form.profileAutre = ''
      errors.profileAutre = null
      touched.profileAutre = false
    }
  },
)

// ---------- Form readiness (drives submit-btn state) ----------
const isFormReady = computed(() => {
  const f = form
  if (!f.firstname.trim()) return false
  if (!f.lastname.trim()) return false
  if (!f.email.trim() || !EMAIL_RE.test(f.email)) return false
  if (PERSONAL_EMAIL_RE.test(f.email)) return false
  if (!f.phoneNumber.trim()) return false
  if (!f.company.trim()) return false
  if (!f.companyUrl.trim()) return false
  if (!f.contract) return false
  if (!f.profile) return false
  if (f.profile === 'autre' && !f.profileAutre.trim()) return false
  if (!f.startDate) return false
  if (!f.location.trim()) return false
  const bl = f.brief.trim().length
  if (bl < 20 || bl > 500) return false
  if (!f.rgpd) return false
  if (!turnstileToken.value) return false
  return true
})

// ---------- Submit ----------
const { isLoading, submit } = useStageAlternance()

interface AlertConfig {
  title: string
  text: string
}
const globalAlert = ref<AlertConfig | null>(null)
const ALERT_BY_CODE: Record<string, AlertConfig> = {
  DUPLICATE_REQUEST: {
    title: 'Une demande est déjà en cours pour votre entreprise.',
    text:
      'Pour toute mise à jour ou information complémentaire, contactez-nous directement à <a href="mailto:bonjour@mariell.fr">bonjour@mariell.fr</a>.',
  },
  RATE_LIMIT: {
    title: 'Limite de soumissions atteinte.',
    text:
      'Vous avez déjà effectué plusieurs demandes récemment. Pour garantir un traitement de qualité à chacun, nous limitons le nombre de soumissions par utilisateur. Si votre demande est urgente, contactez-nous directement à <a href="mailto:bonjour@mariell.fr">bonjour@mariell.fr</a>.',
  },
  TURNSTILE_FAILED: {
    title: 'Vérification de sécurité échouée.',
    text: 'Merci de rafraîchir la page et réessayer.',
  },
  INTERNAL_ERROR: {
    title: "Une erreur technique s’est produite.",
    text:
      "Votre demande n’a pas pu être enregistrée. Merci de réessayer dans quelques minutes, ou de nous contacter directement à <a href=\"mailto:bonjour@mariell.fr\">bonjour@mariell.fr</a>.",
  },
}

async function onSubmit() {
  // Mark all touched + run validation
  ;(Object.keys(touched) as FieldKey[]).forEach((k) => (touched[k] = true))
  let ok = true
  ;(Object.keys(errors) as FieldKey[]).forEach((k) => {
    const msg = validateField(k)
    errors[k] = msg
    if (msg) ok = false
  })
  if (!ok) {
    globalAlert.value = null
    if (typeof window !== 'undefined') {
      const firstError = document.querySelector('.field--error')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  const payload = {
    prenom: form.firstname.trim(),
    nom: form.lastname.trim(),
    email: form.email.trim(),
    telephone: `${form.phoneCc} ${form.phoneNumber.trim()}`,
    entreprise: form.company.trim(),
    urlEntreprise: form.companyUrl.trim(),
    typeContrat: CONTRACT_LABELS[form.contract] as 'Stage' | 'Alternance',
    profilRecherche: PROFILE_LABELS[form.profile] as
      | 'SDR / BDR' | 'Business Developer Junior' | 'Account Executive Junior'
      | 'Sales Ops Junior' | 'Autre',
    profilRecherchePrecisionAutre:
      form.profile === 'autre' ? form.profileAutre.trim() : undefined,
    dateDemarrage: START_DATE_LABELS[form.startDate] as
      | 'ASAP' | 'Sous 1 à 2 mois' | 'Sous 3 à 6 mois' | 'Flexible',
    localisation: form.location.trim(),
    briefMission: form.brief.trim(),
    consentementRgpd: true as const,
    company_website: form.companyWebsite,
    turnstileToken: turnstileToken.value,
  }

  globalAlert.value = null
  const result = await submit(payload)

  if (!result.success) {
    // Token Turnstile consommé par la tentative — on regénère pour permettre
    // un retry sans avoir à rafraîchir la page
    resetTurnstile()

    if (result.code === 'PERSONAL_EMAIL') {
      errors.email = result.message
      touched.email = true
      const el = document.querySelector('[data-field="email"]')
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const cfg = ALERT_BY_CODE[result.code] || ALERT_BY_CODE.INTERNAL_ERROR
    globalAlert.value = cfg!
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <main class="tool-shell">

    <!-- Global alert -->
    <Transition name="talert-fade">
      <div v-if="globalAlert" class="talert is-show" role="alert">
        <span class="talert-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12" y2="13" />
            <line x1="12" y1="16.5" x2="12" y2="16.6" />
          </svg>
        </span>
        <div>
          <h3 class="talert-title">{{ globalAlert.title }}</h3>
          <p class="talert-text" v-html="globalAlert.text" />
        </div>
      </div>
    </Transition>

    <!-- Page header -->
    <header>
      <div class="tool-eyebrow">Outil · Le&nbsp;Lab&nbsp;Mariell</div>
      <h1 class="tool-title">Stagiaire ou alternant Sales&nbsp;: <em>on s’en charge.</em></h1>
      <p class="tool-subtitle">
        Vous nous décrivez votre besoin, nous activons notre vivier et vous présentons les profils pertinents.
        Sans frais. C’est notre manière de contribuer à l’écosystème Sales français.
      </p>
      <p class="tool-frame">
        Service proposé sous réserve de disponibilité de profils pertinents.
        Nos clients restent prioritaires. Réponse sous 7 à 10 jours ouvrés.
      </p>
    </header>

    <form novalidate autocomplete="on" @submit.prevent="onSubmit">

      <!-- ====== BLOC 1 — CONTACT ====== -->
      <section class="tblock">
        <div class="tblock-head">
          <span class="tblock-num">01</span>
          <h2 class="tblock-title">Contact</h2>
          <span class="tblock-rule" aria-hidden="true" />
        </div>

        <div class="tfields--2">
          <div
            class="tfield"
            data-field="firstname"
            :class="{ 'is-filled': form.firstname.trim(), 'is-error': errors.firstname }"
          >
            <label for="firstname" class="tlabel">Prénom <span class="treq">*</span></label>
            <input
              id="firstname"
              v-model="form.firstname"
              type="text"
              class="tinput"
              placeholder="Marie"
              required
              @input="onInput('firstname')"
              @blur="onBlur('firstname')"
            />
            <p class="terror">{{ errors.firstname || 'Ce champ est requis.' }}</p>
          </div>

          <div
            class="tfield"
            data-field="lastname"
            :class="{ 'is-filled': form.lastname.trim(), 'is-error': errors.lastname }"
          >
            <label for="lastname" class="tlabel">Nom <span class="treq">*</span></label>
            <input
              id="lastname"
              v-model="form.lastname"
              type="text"
              class="tinput"
              placeholder="Dupont"
              required
              @input="onInput('lastname')"
              @blur="onBlur('lastname')"
            />
            <p class="terror">{{ errors.lastname || 'Ce champ est requis.' }}</p>
          </div>
        </div>

        <div class="tfields" style="margin-top: 24px;">
          <div
            class="tfield"
            data-field="email"
            :class="{ 'is-filled': form.email.trim(), 'is-error': errors.email }"
          >
            <label for="email" class="tlabel">Email professionnel <span class="treq">*</span></label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              inputmode="email"
              autocomplete="email"
              class="tinput"
              placeholder="marie@votre-entreprise.com"
              required
              @input="onInput('email')"
              @blur="onBlur('email')"
            />
            <p class="thelper">Email d’entreprise requis (pas gmail, hotmail, etc.)</p>
            <p class="terror">{{ errors.email || "Format d’email invalide." }}</p>
          </div>

          <div
            class="tfield"
            data-field="phone"
            :class="{ 'is-filled': form.phoneNumber.trim(), 'is-error': errors.phone }"
          >
            <label for="phone" class="tlabel">Téléphone <span class="treq">*</span></label>
            <div class="tphone">
              <div class="tselect-wrap">
                <select
                  v-model="form.phoneCc"
                  class="tselect"
                  aria-label="Indicatif pays"
                >
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+32">🇧🇪 +32</option>
                  <option value="+41">🇨🇭 +41</option>
                  <option value="+352">🇱🇺 +352</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+39">🇮🇹 +39</option>
                </select>
              </div>
              <input
                id="phone"
                v-model="form.phoneNumber"
                type="tel"
                inputmode="tel"
                class="tinput"
                placeholder="6 12 34 56 78"
                required
                @input="onInput('phone')"
                @blur="onBlur('phone')"
              />
            </div>
            <p class="terror">{{ errors.phone || 'Numéro de téléphone invalide.' }}</p>
          </div>
        </div>
      </section>

      <!-- ====== BLOC 2 — ENTREPRISE ====== -->
      <section class="tblock">
        <div class="tblock-head">
          <span class="tblock-num">02</span>
          <h2 class="tblock-title">Entreprise</h2>
          <span class="tblock-rule" aria-hidden="true" />
        </div>

        <div class="tfields">
          <div
            class="tfield"
            data-field="company"
            :class="{ 'is-filled': form.company.trim(), 'is-error': errors.company }"
          >
            <label for="company" class="tlabel">Nom de l’entreprise <span class="treq">*</span></label>
            <input
              id="company"
              v-model="form.company"
              type="text"
              class="tinput"
              placeholder="Salesfit"
              required
              @input="onInput('company')"
              @blur="onBlur('company')"
            />
            <p class="terror">{{ errors.company || 'Ce champ est requis.' }}</p>
          </div>

          <div
            class="tfield"
            data-field="company-url"
            :class="{ 'is-filled': form.companyUrl.trim(), 'is-error': errors.companyUrl }"
          >
            <label for="company-url" class="tlabel">Site web ou LinkedIn de l’entreprise <span class="treq">*</span></label>
            <input
              id="company-url"
              v-model="form.companyUrl"
              type="url"
              class="tinput"
              placeholder="https://salesfit.com ou linkedin.com/company/..."
              required
              @input="onInput('companyUrl')"
              @blur="onBlur('companyUrl')"
            />
            <p class="terror">{{ errors.companyUrl || 'Lien invalide. Saisissez un site web (https://...) ou une URL LinkedIn complète.' }}</p>
          </div>
        </div>
      </section>

      <!-- ====== BLOC 3 — BESOIN ====== -->
      <section class="tblock">
        <div class="tblock-head">
          <span class="tblock-num">03</span>
          <h2 class="tblock-title">Besoin</h2>
          <span class="tblock-rule" aria-hidden="true" />
        </div>

        <!-- Type de contrat — radio -->
        <div
          class="tfield"
          data-field="contract"
          :class="{ 'is-filled': form.contract, 'is-error': errors.contract }"
          style="margin-bottom: 24px;"
        >
          <span class="tlabel">Type de contrat <span class="treq">*</span></span>
          <div class="tradio-group" role="radiogroup" aria-label="Type de contrat">
            <label class="tradio">
              <input
                v-model="form.contract"
                type="radio"
                name="contract"
                value="stage"
                @change="onInput('contract')"
              />
              <span class="tradio-dot" aria-hidden="true" />
              <span class="tradio-label">Stage</span>
            </label>
            <label class="tradio">
              <input
                v-model="form.contract"
                type="radio"
                name="contract"
                value="alternance"
                @change="onInput('contract')"
              />
              <span class="tradio-dot" aria-hidden="true" />
              <span class="tradio-label">Alternance</span>
            </label>
          </div>
          <p class="terror">{{ errors.contract || 'Ce champ est requis.' }}</p>
        </div>

        <div class="tfields--2">
          <!-- Profil recherché -->
          <div
            class="tfield"
            data-field="profile"
            :class="{ 'is-filled': form.profile, 'is-error': errors.profile }"
          >
            <label for="profile" class="tlabel">Profil recherché <span class="treq">*</span></label>
            <div class="tselect-wrap">
              <select
                id="profile"
                v-model="form.profile"
                class="tselect"
                :class="{ 'is-empty': !form.profile }"
                required
                @change="onInput('profile')"
                @blur="onBlur('profile')"
              >
                <option value="" disabled>Sélectionnez un profil…</option>
                <option value="sdr">SDR / BDR</option>
                <option value="bizdev">Business Developer Junior</option>
                <option value="ae">Account Executive Junior</option>
                <option value="ops">Sales Ops Junior</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <p class="terror">{{ errors.profile || 'Ce champ est requis.' }}</p>

            <div
              v-if="form.profile === 'autre'"
              class="tfield autre-field is-show"
              data-field="profile-autre"
              :class="{ 'is-filled': form.profileAutre.trim(), 'is-error': errors.profileAutre }"
            >
              <label for="profile-autre" class="tlabel">Précisez le profil recherché</label>
              <input
                id="profile-autre"
                v-model="form.profileAutre"
                type="text"
                class="tinput"
                maxlength="60"
                placeholder="Ex. Field Sales Junior, Inside Sales…"
                @input="onInput('profileAutre')"
                @blur="onBlur('profileAutre')"
              />
              <p class="terror">{{ errors.profileAutre || 'Précisez le profil recherché (60 caractères max).' }}</p>
            </div>
          </div>

          <!-- Date de démarrage -->
          <div
            class="tfield"
            data-field="start-date"
            :class="{ 'is-filled': form.startDate, 'is-error': errors.startDate }"
          >
            <label for="start-date" class="tlabel">Date de démarrage souhaitée <span class="treq">*</span></label>
            <div class="tselect-wrap">
              <select
                id="start-date"
                v-model="form.startDate"
                class="tselect"
                :class="{ 'is-empty': !form.startDate }"
                required
                @change="onInput('startDate')"
                @blur="onBlur('startDate')"
              >
                <option value="" disabled>Sélectionnez une période…</option>
                <option value="asap">ASAP</option>
                <option value="1-2m">Sous 1 à 2 mois</option>
                <option value="3-6m">Sous 3 à 6 mois</option>
                <option value="flex">Flexible</option>
              </select>
            </div>
            <p class="terror">{{ errors.startDate || 'Ce champ est requis.' }}</p>
          </div>
        </div>

        <div class="tfields" style="margin-top: 24px;">
          <!-- Localisation -->
          <div
            class="tfield"
            data-field="location"
            :class="{ 'is-filled': form.location.trim(), 'is-error': errors.location }"
          >
            <label for="location" class="tlabel">Localisation <span class="treq">*</span></label>
            <input
              id="location"
              v-model="form.location"
              type="text"
              class="tinput"
              placeholder="Paris, remote partiel possible"
              required
              @input="onInput('location')"
              @blur="onBlur('location')"
            />
            <p class="terror">{{ errors.location || 'Ce champ est requis.' }}</p>
          </div>

          <!-- Brief -->
          <div
            class="tfield"
            data-field="brief"
            :class="{ 'is-filled': form.brief.trim(), 'is-error': errors.brief }"
          >
            <label for="brief" class="tlabel">Brief de la mission <span class="treq">*</span></label>
            <div class="ttextarea-wrap">
              <textarea
                id="brief"
                v-model="form.brief"
                class="ttextarea"
                maxlength="500"
                required
                placeholder="Décrivez le contexte de l’équipe Sales, la mission du futur stagiaire ou alternant, et ce qui rendrait le profil pertinent pour vous. (500 caractères max)"
                @input="onInput('brief')"
                @blur="onBlur('brief')"
              />
              <span class="ttextarea-counter" :class="briefCounterClass">{{ briefLen }} / 500</span>
            </div>
            <p class="terror">{{ errors.brief || 'Ce champ est requis.' }}</p>
          </div>
        </div>
      </section>

      <!-- ====== RGPD ====== -->
      <section class="tblock" style="margin-bottom: 8px;">
        <label
          class="tcheck"
          :class="{ 'is-error': errors.rgpd }"
          data-field="rgpd"
        >
          <input
            v-model="form.rgpd"
            type="checkbox"
            required
            @change="onInput('rgpd')"
          />
          <span class="tcheck-box" aria-hidden="true" />
          <span class="tcheck-text">
            J’accepte que mes données soient utilisées par Mariell pour traiter ma demande,
            conformément à la <NuxtLink to="/politique-confidentialite">politique de confidentialité</NuxtLink>.
          </span>
        </label>
        <p v-if="errors.rgpd" class="terror" style="margin-top: 8px;">{{ errors.rgpd }}</p>
      </section>

      <!-- ====== Honeypot (caché aux humains) ====== -->
      <div
        aria-hidden="true"
        style="position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;"
      >
        <label for="company_website">Ne pas remplir ce champ</label>
        <input
          id="company_website"
          v-model="form.companyWebsite"
          name="company_website"
          type="text"
          tabindex="-1"
          autocomplete="off"
        />
      </div>

      <!-- ====== Cloudflare Turnstile (invisible) ====== -->
      <div v-if="hasTurnstile" style="display: none;">
        <NuxtTurnstile ref="turnstile" v-model="turnstileToken" />
      </div>

      <!-- ====== Submit ====== -->
      <div class="tsubmit-area">
        <button
          type="submit"
          :disabled="!isFormReady || isLoading"
          :class="['tsubmit', { 'is-disabled': !isFormReady && !isLoading, 'is-loading': isLoading }]"
          aria-live="polite"
        >
          <span class="tspinner" aria-hidden="true" />
          <span class="tsubmit-idle">Envoyer ma demande</span>
          <span class="tsubmit-loading">Envoi en cours…</span>
          <svg
            class="tsubmit-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>

        <p class="tfineprint">
          Vos données ne sont jamais transmises à des tiers.
          Vous pouvez demander leur suppression à tout moment.
        </p>

        <span class="tcf">Protégé par Cloudflare Turnstile</span>
      </div>
    </form>

    <!-- Footer signature -->
    <div class="tfoot">
      <span class="tfoot-1">Mariell · Cabinet de recrutement Sales</span>
      <span class="tfoot-2">Recruter n’est pas un pari.</span>
    </div>

  </main>
</template>

<style scoped>
/* thelper is hidden when the field has an error — mirror tools.css tfield.is-error logic */
.tfield.is-error .thelper { display: none; }

/* Autre field animation on v-if mount */
.autre-field.is-show {
  animation: autreSlideIn 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes autreSlideIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Alert transition */
.talert-fade-enter-active,
.talert-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.talert-fade-enter-from,
.talert-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* tcheck error state — tfield.is-error covers tfield children but tcheck is a label */
.tcheck.is-error .tcheck-box {
  border-color: var(--danger, #F2A28F);
}

/* tcheck link styling */
.tcheck-text :deep(a) {
  color: var(--cyan, #7FE7E1);
}

@media (prefers-reduced-motion: reduce) {
  .autre-field.is-show,
  .talert-fade-enter-active,
  .talert-fade-leave-active { animation: none; transition: none; }
}

/* ---- Mobile / responsive ---- */
@media (max-width: 900px) {
  /* Radio tiles (contract: Stage / Alternance) stay in a row — already only 2 items, fine */
  /* RGPD row reflows via flex-wrap already on tcheck */
}

@media (max-width: 560px) {
  /* Phone row: country-code select + number input stack vertically */
  :deep(.tphone) {
    flex-direction: column;
    align-items: stretch;
  }
  :deep(.tphone .tselect-wrap) {
    width: 100%;
  }
  :deep(.tphone .tinput) {
    width: 100%;
  }
  /* Submit CTA full-width */
  :deep(.tsubmit) {
    width: 100%;
    justify-content: center;
  }
  :deep(.tsubmit-area) {
    align-items: stretch;
  }
}
</style>
