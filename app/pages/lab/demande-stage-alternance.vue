<script setup lang="ts">
useHead({
  title: 'Demande stagiaire ou alternant Sales — Mariell · Le Lab',
  meta: [
    {
      name: 'description',
      content:
        "Vous nous décrivez votre besoin, nous activons notre vivier et vous présentons les profils Sales pertinents. Service offert.",
    },
  ],
})

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
      if (!EMAIL_RE.test(e)) return "Format d'email invalide."
      if (PERSONAL_EMAIL_RE.test(e))
        return "Cet outil est réservé aux entreprises. Merci d'utiliser votre email professionnel."
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
    title: "Une erreur technique s'est produite.",
    text:
      "Votre demande n'a pas pu être enregistrée. Merci de réessayer dans quelques minutes, ou de nous contacter directement à <a href=\"mailto:bonjour@mariell.fr\">bonjour@mariell.fr</a>.",
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
  <LabToolShell>
    <main class="form-shell">
      <div class="shell-inner">
        <!-- Global alert -->
        <Transition name="alert-fade">
          <div v-if="globalAlert" class="alert" role="alert">
            <span class="alert-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="8" x2="12" y2="13" />
                <line x1="12" y1="16.5" x2="12" y2="17" />
              </svg>
            </span>
            <div class="alert-body">
              <h3 class="alert-title">{{ globalAlert.title }}</h3>
              <p class="alert-text" v-html="globalAlert.text" />
            </div>
          </div>
        </Transition>

        <!-- Page header -->
        <header class="page-header">
          <span class="eyebrow-tool">Outil&nbsp;01 · Le&nbsp;Lab&nbsp;Mariell</span>
          <h1 class="page-title">Stagiaire ou alternant Sales : <em>on s'en charge.</em></h1>
          <p class="page-subtitle">
            Vous nous décrivez votre besoin, nous activons notre vivier et vous présentons les profils pertinents.
            Sans frais — c'est notre manière de contribuer à l'écosystème Sales français.
          </p>
          <p class="page-frame">
            Service proposé sous réserve de disponibilité de profils pertinents.
            Nos clients restent prioritaires. Réponse sous 7 à 10 jours ouvrés.
          </p>
        </header>

        <form novalidate autocomplete="on" @submit.prevent="onSubmit">

          <!-- ====== BLOC 1 — CONTACT ====== -->
          <section class="block">
            <div class="block-header">
              <span class="block-num">01</span>
              <h2 class="block-title">Contact</h2>
              <span class="block-rule" aria-hidden="true" />
            </div>

            <div class="fields fields--2col">
              <div
                class="field"
                data-field="firstname"
                :class="{ 'field--filled': form.firstname.trim(), 'field--error': errors.firstname }"
              >
                <label for="firstname" class="field-label">Prénom <span class="field-required">*</span></label>
                <input
                  id="firstname"
                  v-model="form.firstname"
                  type="text"
                  class="input"
                  placeholder="Marie"
                  required
                  @input="onInput('firstname')"
                  @blur="onBlur('firstname')"
                />
                <p class="field-error">{{ errors.firstname || 'Ce champ est requis.' }}</p>
              </div>

              <div
                class="field"
                data-field="lastname"
                :class="{ 'field--filled': form.lastname.trim(), 'field--error': errors.lastname }"
              >
                <label for="lastname" class="field-label">Nom <span class="field-required">*</span></label>
                <input
                  id="lastname"
                  v-model="form.lastname"
                  type="text"
                  class="input"
                  placeholder="Dupont"
                  required
                  @input="onInput('lastname')"
                  @blur="onBlur('lastname')"
                />
                <p class="field-error">{{ errors.lastname || 'Ce champ est requis.' }}</p>
              </div>
            </div>

            <div class="fields" style="margin-top: 24px;">
              <div
                class="field"
                data-field="email"
                :class="{ 'field--filled': form.email.trim(), 'field--error': errors.email }"
              >
                <label for="email" class="field-label">Email professionnel <span class="field-required">*</span></label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="input"
                  placeholder="marie@votre-entreprise.com"
                  required
                  @input="onInput('email')"
                  @blur="onBlur('email')"
                />
                <p v-if="!errors.email" class="field-helper">Email d'entreprise requis (pas gmail, hotmail, etc.)</p>
                <p class="field-error">{{ errors.email || "Format d'email invalide." }}</p>
              </div>

              <div
                class="field"
                data-field="phone"
                :class="{ 'field--filled': form.phoneNumber.trim(), 'field--error': errors.phone }"
              >
                <label for="phone" class="field-label">Téléphone <span class="field-required">*</span></label>
                <div class="phone-group">
                  <div class="phone-cc">
                    <select v-model="form.phoneCc" aria-label="Indicatif pays">
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
                    class="phone-input"
                    placeholder="6 12 34 56 78"
                    required
                    @input="onInput('phone')"
                    @blur="onBlur('phone')"
                  />
                </div>
                <p class="field-error">{{ errors.phone || 'Numéro de téléphone invalide.' }}</p>
              </div>
            </div>
          </section>

          <!-- ====== BLOC 2 — ENTREPRISE ====== -->
          <section class="block">
            <div class="block-header">
              <span class="block-num">02</span>
              <h2 class="block-title">Entreprise</h2>
              <span class="block-rule" aria-hidden="true" />
            </div>

            <div class="fields">
              <div
                class="field"
                data-field="company"
                :class="{ 'field--filled': form.company.trim(), 'field--error': errors.company }"
              >
                <label for="company" class="field-label">Nom de l'entreprise <span class="field-required">*</span></label>
                <input
                  id="company"
                  v-model="form.company"
                  type="text"
                  class="input"
                  placeholder="Salesfit"
                  required
                  @input="onInput('company')"
                  @blur="onBlur('company')"
                />
                <p class="field-error">{{ errors.company || 'Ce champ est requis.' }}</p>
              </div>

              <div
                class="field"
                data-field="company-url"
                :class="{ 'field--filled': form.companyUrl.trim(), 'field--error': errors.companyUrl }"
              >
                <label for="company-url" class="field-label">Site web ou LinkedIn de l'entreprise <span class="field-required">*</span></label>
                <input
                  id="company-url"
                  v-model="form.companyUrl"
                  type="url"
                  class="input"
                  placeholder="https://salesfit.com ou linkedin.com/company/..."
                  required
                  @input="onInput('companyUrl')"
                  @blur="onBlur('companyUrl')"
                />
                <p class="field-error">{{ errors.companyUrl || 'Lien invalide.' }}</p>
              </div>
            </div>
          </section>

          <!-- ====== BLOC 3 — BESOIN ====== -->
          <section class="block">
            <div class="block-header">
              <span class="block-num">03</span>
              <h2 class="block-title">Besoin</h2>
              <span class="block-rule" aria-hidden="true" />
            </div>

            <!-- Type de contrat — radio -->
            <div
              class="field"
              data-field="contract"
              :class="{ 'field--filled': form.contract, 'field--error': errors.contract }"
              style="margin-bottom: 24px;"
            >
              <span class="field-label">Type de contrat <span class="field-required">*</span></span>
              <div class="radio-group" role="radiogroup" aria-label="Type de contrat">
                <label class="radio-tile">
                  <input
                    v-model="form.contract"
                    type="radio"
                    name="contract"
                    value="stage"
                    @change="onInput('contract')"
                  />
                  <span class="radio-dot" aria-hidden="true" />
                  <span class="radio-tile-label">Stage</span>
                </label>
                <label class="radio-tile">
                  <input
                    v-model="form.contract"
                    type="radio"
                    name="contract"
                    value="alternance"
                    @change="onInput('contract')"
                  />
                  <span class="radio-dot" aria-hidden="true" />
                  <span class="radio-tile-label">Alternance</span>
                </label>
              </div>
              <p class="field-error">{{ errors.contract || 'Ce champ est requis.' }}</p>
            </div>

            <div class="fields fields--2col">
              <!-- Profil recherché -->
              <div
                class="field"
                data-field="profile"
                :class="{ 'field--filled': form.profile, 'field--error': errors.profile }"
              >
                <label for="profile" class="field-label">Profil recherché <span class="field-required">*</span></label>
                <div class="select-wrap">
                  <select
                    id="profile"
                    v-model="form.profile"
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
                <p class="field-error">{{ errors.profile || 'Ce champ est requis.' }}</p>

                <div
                  v-if="form.profile === 'autre'"
                  class="field autre-field autre-field--show"
                  data-field="profileAutre"
                  :class="{ 'field--filled': form.profileAutre.trim(), 'field--error': errors.profileAutre }"
                >
                  <label for="profile-autre" class="field-label">Précisez le profil recherché</label>
                  <input
                    id="profile-autre"
                    v-model="form.profileAutre"
                    type="text"
                    class="input"
                    maxlength="60"
                    placeholder="Ex. Field Sales Junior, Inside Sales…"
                    @input="onInput('profileAutre')"
                    @blur="onBlur('profileAutre')"
                  />
                  <p class="field-error">{{ errors.profileAutre || 'Précisez le profil recherché.' }}</p>
                </div>
              </div>

              <!-- Date de démarrage -->
              <div
                class="field"
                data-field="start-date"
                :class="{ 'field--filled': form.startDate, 'field--error': errors.startDate }"
              >
                <label for="start-date" class="field-label">Date de démarrage souhaitée <span class="field-required">*</span></label>
                <div class="select-wrap">
                  <select
                    id="start-date"
                    v-model="form.startDate"
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
                <p class="field-error">{{ errors.startDate || 'Ce champ est requis.' }}</p>
              </div>
            </div>

            <div class="fields" style="margin-top: 24px;">
              <!-- Localisation -->
              <div
                class="field"
                data-field="location"
                :class="{ 'field--filled': form.location.trim(), 'field--error': errors.location }"
              >
                <label for="location" class="field-label">Localisation <span class="field-required">*</span></label>
                <input
                  id="location"
                  v-model="form.location"
                  type="text"
                  class="input"
                  placeholder="Paris — remote partiel possible"
                  required
                  @input="onInput('location')"
                  @blur="onBlur('location')"
                />
                <p class="field-error">{{ errors.location || 'Ce champ est requis.' }}</p>
              </div>

              <!-- Brief -->
              <div
                class="field"
                data-field="brief"
                :class="{ 'field--filled': form.brief.trim(), 'field--error': errors.brief }"
              >
                <label for="brief" class="field-label">Brief de la mission <span class="field-required">*</span></label>
                <div class="textarea-wrap">
                  <textarea
                    id="brief"
                    v-model="form.brief"
                    class="textarea"
                    maxlength="500"
                    required
                    placeholder="Décrivez en quelques lignes le contexte de l'équipe Sales, la mission du futur stagiaire ou alternant, et ce qui rendrait le profil pertinent pour vous. (500 caractères max)"
                    @input="onInput('brief')"
                    @blur="onBlur('brief')"
                  />
                  <span class="textarea-counter" :class="briefCounterClass">{{ briefLen }} / 500</span>
                </div>
                <p class="field-error">{{ errors.brief || 'Ce champ est requis.' }}</p>
              </div>
            </div>
          </section>

          <!-- ====== BLOC CONFORMITÉ ====== -->
          <section class="block" style="margin-bottom: 16px;">
            <label
              class="checkbox-row"
              data-field="rgpd"
              :class="{ 'field--error': errors.rgpd }"
            >
              <input
                v-model="form.rgpd"
                type="checkbox"
                required
                @change="onInput('rgpd')"
              />
              <span class="checkbox-box" aria-hidden="true" />
              <span class="checkbox-text">
                J'accepte que mes données soient utilisées par Mariell pour traiter ma demande,
                conformément à la <NuxtLink to="/politique-confidentialite">politique de confidentialité</NuxtLink>.
              </span>
            </label>
            <p v-if="errors.rgpd" class="field-error" style="display: inline-flex; margin-top: 8px;">{{ errors.rgpd }}</p>
          </section>

          <!-- ====== Honeypot (caché aux humains, visible aux bots) ====== -->
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
          <div v-if="hasTurnstile" class="cf-mount">
            <NuxtTurnstile v-model="turnstileToken" />
          </div>

          <!-- ====== Submit ====== -->
          <div class="submit-area">
            <button
              type="submit"
              :disabled="!isFormReady || isLoading"
              :class="['submit-btn', { 'submit-btn--disabled': !isFormReady && !isLoading, 'submit-btn--loading': isLoading }]"
              aria-live="polite"
            >
              <span v-if="isLoading" class="spinner" aria-hidden="true" />
              <span v-if="!isLoading" class="submit-btn-label">Envoyer ma demande</span>
              <span v-else class="submit-btn-loading-label">Envoi en cours...</span>
              <svg
                v-if="!isLoading"
                class="arrow"
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

            <p class="rgpd-fineprint">
              Vos données ne sont jamais transmises à des tiers.
              Vous pouvez demander leur suppression à tout moment.
            </p>

            <span class="cf-mention">Protégé par Cloudflare Turnstile</span>
          </div>
        </form>

        <!-- Footer signature -->
        <div class="foot-signature">
          <span class="foot-signature-line1">Mariell · Cabinet de recrutement Sales</span>
          <span class="foot-signature-line2">Recruter n'est pas un pari.</span>
        </div>
      </div>
    </main>
  </LabToolShell>
</template>

<style scoped>
.form-shell { position: relative; z-index: 1; }
.shell-inner {
  max-width: 768px;
  margin: 0 auto;
  padding: 64px 20px 96px;
}
@media (min-width: 768px) {
  .shell-inner { padding: 88px 40px 120px; }
}
@media (min-width: 1024px) {
  .shell-inner { padding: 112px 64px 144px; }
}

/* ---------- Page header ---------- */
.page-header { margin-bottom: 56px; }
@media (min-width: 768px) { .page-header { margin-bottom: 72px; } }

.eyebrow-tool {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-family: var(--font-grotesk);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #5ee7e7;
  margin-bottom: 28px;
}
.eyebrow-tool::before {
  content: "";
  width: 32px;
  height: 1px;
  background: currentColor;
}

.page-title {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-size: clamp(36px, 5.2vw, 60px);
  line-height: 1.05;
  letter-spacing: -0.035em;
  margin: 0 0 24px 0;
  color: #fff;
  text-wrap: balance;
}
.page-title em {
  font-style: italic;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  padding-bottom: 0.06em;
}

.page-subtitle {
  font-size: 17px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 16px;
  max-width: 60ch;
  font-weight: 300;
}
.page-frame {
  font-style: italic;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
  max-width: 60ch;
}

/* ---------- Block ---------- */
.block { margin-bottom: 56px; }
@media (min-width: 768px) { .block { margin-bottom: 72px; } }

.block-header {
  margin-bottom: 28px;
  display: flex;
  align-items: baseline;
  gap: 16px;
}
.block-num {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 12px;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}
.block-title {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-size: 22px;
  letter-spacing: -0.02em;
  color: #fff;
  margin: 0;
  line-height: 1.2;
}
.block-rule {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%);
  align-self: center;
}

/* ---------- Fields grid ---------- */
.fields { display: grid; gap: 24px; }
.fields--2col { grid-template-columns: 1fr; }
@media (min-width: 640px) {
  .fields--2col { grid-template-columns: 1fr 1fr; }
}

.field { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.field-label {
  font-family: var(--font-grotesk);
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: -0.005em;
}
.field-required { color: #5ee7e7; margin-left: 2px; }

/* ---------- Inputs ---------- */
.input,
.select-wrap select,
.textarea,
.phone-input {
  width: 100%;
  height: 52px;
  padding: 0 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 12px;
  color: #fff;
  font-family: var(--font-grotesk);
  font-weight: 400;
  font-size: 15px;
  line-height: 1.4;
  outline: none;
  transition:
    border-color 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.input::placeholder,
.textarea::placeholder {
  color: rgba(255, 255, 255, 0.32);
  font-weight: 300;
}
.input:hover,
.select-wrap:hover select,
.textarea:hover,
.phone-input:hover {
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.035);
}
.input:focus,
.select-wrap select:focus,
.textarea:focus,
.phone-input:focus {
  border-color: rgba(94, 231, 231, 0.55);
  background: rgba(94, 231, 231, 0.04);
  box-shadow:
    0 0 0 3px rgba(94, 231, 231, 0.10),
    0 0 24px -6px rgba(94, 231, 231, 0.18);
}
.field--filled .input,
.field--filled .textarea,
.field--filled .select-wrap select,
.field--filled .phone-input {
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.035);
}
.field--error .input,
.field--error .textarea,
.field--error .select-wrap select,
.field--error .phone-input {
  border-color: rgba(232, 94, 255, 0.55);
  background: rgba(232, 94, 255, 0.04);
}

/* ---------- Helper + error text ---------- */
.field-helper {
  font-family: var(--font-grotesk);
  font-size: 12.5px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.5;
  margin: 0;
}
.field-error {
  font-family: var(--font-grotesk);
  font-size: 12.5px;
  font-weight: 400;
  color: #e85eff;
  line-height: 1.5;
  margin: 0;
  display: none;
  align-items: center;
  gap: 6px;
}
.field-error::before {
  content: "";
  width: 4px; height: 4px;
  background: #e85eff;
  border-radius: 50%;
  flex-shrink: 0;
}
.field--error .field-error { display: inline-flex; }
.field--error .field-helper { display: none; }

/* ---------- Textarea ---------- */
.textarea {
  height: auto;
  min-height: 140px;
  padding: 16px 18px;
  resize: vertical;
  line-height: 1.55;
  font-family: var(--font-grotesk);
}
.textarea-wrap { position: relative; }
.textarea-counter {
  position: absolute;
  bottom: 10px;
  right: 14px;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 11.5px;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.5);
  padding: 3px 8px;
  border-radius: 6px;
  pointer-events: none;
  transition: color 0.2s ease;
}
.textarea-counter--warn { color: #f0a93b; }
.textarea-counter--danger { color: #e85eff; }

/* ---------- Select wrap ---------- */
.select-wrap { position: relative; }
.select-wrap select {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 44px;
  cursor: pointer;
  background-image: none;
}
.select-wrap select option {
  background: #0a0a0c;
  color: #fff;
}
.select-wrap::after {
  content: "";
  position: absolute;
  right: 18px;
  top: 50%;
  width: 10px; height: 10px;
  border-right: 1.5px solid rgba(255,255,255,0.55);
  border-bottom: 1.5px solid rgba(255,255,255,0.55);
  transform: translateY(-70%) rotate(45deg);
  pointer-events: none;
  transition: border-color 0.2s ease;
}
.select-wrap:hover::after,
.select-wrap:focus-within::after { border-color: rgba(255,255,255,0.85); }
.select-wrap select.is-empty {
  color: rgba(255,255,255,0.32);
  font-weight: 300;
}

/* ---------- Phone group ---------- */
.phone-group {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 10px;
}
.phone-cc { position: relative; }
.phone-cc select {
  width: 100%;
  height: 52px;
  padding: 0 32px 0 16px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 12px;
  color: #fff;
  font-family: var(--font-grotesk);
  font-size: 15px;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.phone-cc::after {
  content: "";
  position: absolute;
  right: 12px;
  top: 50%;
  width: 8px; height: 8px;
  border-right: 1.5px solid rgba(255,255,255,0.55);
  border-bottom: 1.5px solid rgba(255,255,255,0.55);
  transform: translateY(-70%) rotate(45deg);
  pointer-events: none;
}
.phone-cc select:focus {
  border-color: rgba(94, 231, 231, 0.55);
  background: rgba(94, 231, 231, 0.04);
}

/* ---------- Radio group ---------- */
.radio-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.radio-tile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.radio-tile:hover {
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
}
.radio-tile input { position: absolute; opacity: 0; pointer-events: none; }
.radio-dot {
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.30);
  flex-shrink: 0;
  position: relative;
  transition: border-color 0.2s;
}
.radio-tile input:checked + .radio-dot {
  border-color: transparent;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05),
              0 0 12px -2px rgba(255, 0, 255, 0.45);
}
.radio-tile input:checked + .radio-dot::after {
  content: "";
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: #000;
}
.radio-tile-label {
  font-family: var(--font-grotesk);
  font-size: 15px;
  font-weight: 500;
  color: #fff;
}
.radio-tile:has(input:checked) {
  border-color: rgba(94, 231, 231, 0.45);
  background: rgba(94, 231, 231, 0.04);
}

/* ---------- Checkbox (RGPD) ---------- */
.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.checkbox-row:hover {
  border-color: rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.03);
}
.checkbox-row input { position: absolute; opacity: 0; pointer-events: none; }
.checkbox-box {
  width: 20px; height: 20px;
  border-radius: 5px;
  border: 1.5px solid rgba(255,255,255,0.30);
  flex-shrink: 0;
  position: relative;
  margin-top: 1px;
  transition: border-color 0.2s, background 0.2s;
}
.checkbox-row input:checked + .checkbox-box {
  border-color: transparent;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
}
.checkbox-row input:checked + .checkbox-box::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='4,11 8,15 16,6'/></svg>");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 14px 14px;
}
.checkbox-text {
  font-family: var(--font-grotesk);
  font-size: 14px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.55;
}
.checkbox-text :deep(a) {
  color: #5ee7e7;
  text-decoration: none;
  border-bottom: 1px solid rgba(94, 231, 231, 0.3);
  transition: border-color 0.2s;
}
.checkbox-text :deep(a):hover { border-bottom-color: #5ee7e7; }
.checkbox-row.field--error {
  border-color: rgba(232, 94, 255, 0.45);
  background: rgba(232, 94, 255, 0.04);
}

/* ---------- Conditional "Autre" reveal ---------- */
.autre-field {
  margin-top: 12px;
  animation: slideIn 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ---------- Submit area ---------- */
.cf-mount { display: none; } /* Turnstile widget is invisible mode */
.submit-area {
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 18px;
}
@media (min-width: 640px) {
  .submit-area { align-items: flex-start; }
}

.submit-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 32px;
  width: 100%;
  border-radius: 9999px;
  font-family: var(--font-grotesk);
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.005em;
  color: #000;
  text-decoration: none;
  cursor: pointer;
  border: 0;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s ease-out,
    filter 0.2s ease-out,
    opacity 0.2s ease-out;
  box-shadow:
    0 12px 40px -16px rgba(255, 0, 255, 0.4),
    0 4px 20px -8px rgba(0, 255, 255, 0.3);
}
@media (min-width: 640px) {
  .submit-btn { width: auto; min-width: 280px; }
}
.submit-btn:hover:not([disabled]):not(.submit-btn--loading) {
  transform: translateY(-2px);
  filter: brightness(1.08);
}
.submit-btn .arrow {
  width: 16px; height: 16px;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.submit-btn:hover:not([disabled]):not(.submit-btn--loading) .arrow {
  transform: translateX(3px);
}

.submit-btn--disabled,
.submit-btn[disabled]:not(.submit-btn--loading) {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.45);
  box-shadow: none;
  cursor: not-allowed;
  pointer-events: none;
  filter: saturate(0.4);
}

.submit-btn--loading {
  pointer-events: none;
  cursor: progress;
  background: linear-gradient(135deg, rgba(94, 231, 231, 0.85), rgba(232, 94, 255, 0.85));
  box-shadow: 0 8px 28px -14px rgba(255, 0, 255, 0.32);
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.22);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.rgpd-fineprint {
  font-family: var(--font-grotesk);
  font-size: 12.5px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.55;
  margin: 0;
  max-width: 56ch;
}

.cf-mention {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 10.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.cf-mention::before {
  content: "";
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(94, 231, 231, 0.5);
}

/* ---------- Global alert ---------- */
.alert {
  display: flex;
  gap: 16px;
  padding: 22px 24px;
  border: 1px solid rgba(232, 94, 255, 0.35);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(232, 94, 255, 0.06), rgba(232, 94, 255, 0.02));
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
}
.alert::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(232, 94, 255, 0.5), transparent);
}
.alert-mark {
  width: 32px; height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid rgba(232, 94, 255, 0.35);
  background: rgba(232, 94, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e85eff;
}
.alert-mark svg { width: 14px; height: 14px; }
.alert-body { display: flex; flex-direction: column; gap: 6px; }
.alert-title {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-size: 17px;
  letter-spacing: -0.015em;
  color: #fff;
  margin: 0;
}
.alert-text {
  font-family: var(--font-grotesk);
  font-size: 14px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0;
}
.alert-text :deep(a) {
  color: #5ee7e7;
  text-decoration: none;
  border-bottom: 1px solid rgba(94, 231, 231, 0.3);
}

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ---------- Footer signature ---------- */
.foot-signature {
  margin-top: 88px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.10);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.foot-signature-line1 {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
}
.foot-signature-line2 {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-style: italic;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);
}

/* ---------- Responsive ---------- */
@media (max-width: 480px) {
  .phone-group { grid-template-columns: 96px 1fr; }
  .radio-group { grid-template-columns: 1fr; }
  .block-header { flex-wrap: wrap; }
  .block-rule { width: 100%; flex: none; }
}

@media (prefers-reduced-motion: reduce) {
  .input,
  .textarea,
  .select-wrap select,
  .phone-input,
  .submit-btn,
  .submit-btn .arrow,
  .radio-tile,
  .radio-dot,
  .checkbox-row,
  .checkbox-box,
  .autre-field { transition: none; animation: none; }
}
</style>
