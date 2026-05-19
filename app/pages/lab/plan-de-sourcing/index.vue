<script setup lang="ts">
useHead({
  title: 'Plan de sourcing LinkedIn personnalisé — Mariell · Le Lab',
  meta: [
    {
      name: 'description',
      content:
        'Une stratégie de chasse complète, calibrée sur votre contexte. Générée en moins de 60 secondes par l\'IA Mariell.',
    },
  ],
})

const config = useRuntimeConfig()
const hasTurnstile = computed(() => {
  const t = (config.public as { turnstile?: { siteKey?: string } }).turnstile
  return Boolean(t?.siteKey)
})

const ROLES = [
  'SDR / BDR',
  'Inside Sales',
  'Field Sales / Outside Sales',
  'Business Developer Full Cycle',
  'Account Executive — PME / SMB',
  'Account Executive — Mid-Market',
  'Account Executive — Enterprise',
  'Sales Engineer / Pre-Sales',
  'Account Manager',
  'Strategic Account Manager / Key Account Manager',
  'Customer Success Manager',
  'Sales Ops / RevOps',
  'Channel / Partner Manager',
  'Sales Manager / Team Lead',
  'Head of Sales',
  'VP Sales / CRO',
  'Autre',
] as const

const SECTORS = [
  'SaaS B2B',
  'Conseil IT / ESN',
  'Industrie / B2B classique',
  'Cyber / Sécurité',
  'Fintech',
  'Healthtech',
  'Services',
  'Autre',
] as const

// ---------- Form state ----------
const form = reactive({
  prenom: '',
  nom: '',
  email: '',
  phoneCc: '+33',
  phoneNumber: '',
  entreprise: '',
  posteRecherche: '' as (typeof ROLES)[number] | '',
  posteAutre: '',
  seniorite: '' as 'Junior' | 'Confirmé' | 'Senior' | 'Lead-Manager' | '',
  objectif: '' as
    | 'Gestion portefeuille clients'
    | 'Développement et chasse'
    | 'Ouverture de nouvelle verticale'
    | "Création et management d'équipe"
    | '',
  localisation: '',
  remote: false,
  secteur: '' as (typeof SECTORS)[number] | '',
  secteurAutre: '',
  fixe: '',
  ote: '',
  siteEntreprise: '',
  contenuFichePoste: '',
  rgpd: false,
})

const turnstileToken = ref(hasTurnstile.value ? '' : 'dev-stub')
const turnstile = ref<{ reset?: () => void } | null>(null)
function resetTurnstile() {
  turnstile.value?.reset?.()
  turnstileToken.value = hasTurnstile.value ? '' : 'dev-stub'
}

// ---------- Errors + touched ----------
type FieldKey =
  | 'prenom' | 'nom' | 'email' | 'phone' | 'entreprise'
  | 'posteRecherche' | 'posteAutre' | 'seniorite' | 'objectif' | 'localisation'
  | 'secteur' | 'secteurAutre' | 'fixe' | 'ote'
  | 'siteEntreprise' | 'contenuFichePoste'
  | 'rgpd'

const errors = reactive<Record<FieldKey, string | null>>({
  prenom: null, nom: null, email: null, phone: null, entreprise: null,
  posteRecherche: null, posteAutre: null, seniorite: null, objectif: null, localisation: null,
  secteur: null, secteurAutre: null, fixe: null, ote: null,
  siteEntreprise: null, contenuFichePoste: null, rgpd: null,
})

// ---------- Regex ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const URL_RE = /^https?:\/\//i

// ---------- Number formatting (FR locale, narrow no-break space) ----------
const NBSP = ' '
function formatNumberFr(raw: string): string {
  const digits = raw.replace(/\D+/g, '')
  if (!digits) return ''
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
}
function stripNumber(s: string): number | null {
  const digits = s.replace(/\D+/g, '')
  if (!digits) return null
  return parseInt(digits, 10)
}

watch(() => form.fixe, (v) => {
  const formatted = formatNumberFr(v)
  if (formatted !== form.fixe) form.fixe = formatted
})
watch(() => form.ote, (v) => {
  const formatted = formatNumberFr(v)
  if (formatted !== form.ote) form.ote = formatted
})

// ---------- Validators ----------
function validateField(key: FieldKey): string | null {
  const t = (s: string) => s.trim()
  switch (key) {
    case 'prenom': return t(form.prenom).length >= 2 ? null : 'Champ obligatoire (min. 2 caractères).'
    case 'nom': return t(form.nom).length >= 2 ? null : 'Champ obligatoire (min. 2 caractères).'
    case 'email': {
      const v = t(form.email)
      if (!v) return 'Champ obligatoire.'
      if (!EMAIL_RE.test(v)) return 'Email invalide.'
      return null
    }
    case 'phone': {
      const v = t(form.phoneNumber)
      if (!v) return 'Champ obligatoire.'
      if (v.replace(/\D/g, '').length < 8) return 'Numéro de téléphone invalide.'
      return null
    }
    case 'entreprise': return t(form.entreprise).length >= 2 ? null : 'Champ obligatoire.'
    case 'posteRecherche': return form.posteRecherche ? null : "Sélectionnez un intitulé de poste."
    case 'posteAutre':
      if (form.posteRecherche !== 'Autre') return null
      return t(form.posteAutre) ? null : "Précisez l'intitulé du poste."
    case 'seniorite': return form.seniorite ? null : 'Sélectionnez un niveau de séniorité.'
    case 'objectif': return form.objectif ? null : 'Sélectionnez un objectif.'
    case 'localisation': return t(form.localisation).length >= 2 ? null : 'Champ obligatoire.'
    case 'secteur': return form.secteur ? null : 'Sélectionnez un secteur.'
    case 'secteurAutre':
      if (form.secteur !== 'Autre') return null
      return t(form.secteurAutre) ? null : 'Précisez votre secteur.'
    case 'fixe': {
      const n = stripNumber(form.fixe)
      if (n === null) return 'Champ obligatoire.'
      if (n < 15000 || n > 500000) return 'Le fixe doit être entre 15 000 € et 500 000 €.'
      return null
    }
    case 'ote': {
      const n = stripNumber(form.ote)
      if (n === null) return 'Champ obligatoire.'
      if (n < 0 || n > 800000) return "L'OTE doit être entre 0 € et 800 000 €."
      const f = stripNumber(form.fixe)
      if (f !== null && n < f) return "L'OTE doit être supérieur ou égal au fixe."
      return null
    }
    case 'siteEntreprise': {
      const v = t(form.siteEntreprise)
      if (!v) return null
      const candidate = URL_RE.test(v) ? v : `https://${v}`
      try { new URL(candidate); return null } catch { return 'URL invalide.' }
    }
    case 'contenuFichePoste':
      return t(form.contenuFichePoste).length <= 5000 ? null : '5000 caractères maximum.'
    case 'rgpd': return form.rgpd ? null : 'Vous devez accepter la politique de confidentialité.'
  }
}

function onBlur(key: FieldKey) {
  errors[key] = validateField(key)
}
function clearError(key: FieldKey) {
  if (errors[key]) errors[key] = null
}

// ---------- Watchers (champs conditionnels "Autre") ----------
watch(() => form.posteRecherche, (v) => {
  if (v !== 'Autre') {
    form.posteAutre = ''
    errors.posteAutre = null
  }
})
watch(() => form.secteur, (v) => {
  if (v !== 'Autre') {
    form.secteurAutre = ''
    errors.secteurAutre = null
  }
})

// ---------- Compteur fiche de poste ----------
const fichePosteLen = computed(() => form.contenuFichePoste.length)
const counterClass = computed(() => {
  const n = fichePosteLen.value
  if (n >= 5000) return 'counter--alert'
  if (n >= 4500) return 'counter--warn'
  return ''
})

// ---------- Combobox état ----------
const comboOpen = ref(false)
const comboSearch = ref('')
const filteredRoles = computed(() => {
  const f = comboSearch.value.trim().toLowerCase()
  if (!f) return ROLES.map((label, i) => ({ label, num: i + 1 }))
  return ROLES.map((label, i) => ({ label, num: i + 1 })).filter(({ label }) => label.toLowerCase().includes(f))
})
function selectRole(label: (typeof ROLES)[number]) {
  form.posteRecherche = label
  comboOpen.value = false
  comboSearch.value = ''
  errors.posteRecherche = null
}
function onClickOutsideCombo(e: MouseEvent) {
  const el = document.getElementById('jobtitle-combo')
  if (el && !el.contains(e.target as Node)) comboOpen.value = false
}
onMounted(() => document.addEventListener('click', onClickOutsideCombo))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutsideCombo))

// ---------- Form readiness ----------
const isFormReady = computed(() => {
  if (!form.prenom.trim() || !form.nom.trim()) return false
  if (!EMAIL_RE.test(form.email)) return false
  if (form.phoneNumber.replace(/\D/g, '').length < 8) return false
  if (!form.entreprise.trim()) return false
  if (!form.posteRecherche) return false
  if (form.posteRecherche === 'Autre' && !form.posteAutre.trim()) return false
  if (!form.seniorite || !form.objectif || !form.localisation.trim()) return false
  if (!form.secteur) return false
  if (form.secteur === 'Autre' && !form.secteurAutre.trim()) return false
  const f = stripNumber(form.fixe)
  const o = stripNumber(form.ote)
  if (f === null || f < 15000 || f > 500000) return false
  if (o === null || o > 800000 || o < f) return false
  if (!form.rgpd) return false
  if (!turnstileToken.value) return false
  return true
})

// ---------- Submit ----------
const { isLoading, submit } = usePlanSourcing()

interface AlertConfig { title: string; text: string }
const globalAlert = ref<AlertConfig | null>(null)
const ALERT_BY_CODE: Record<string, AlertConfig> = {
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
  ;(Object.keys(errors) as FieldKey[]).forEach((k) => {
    errors[k] = validateField(k)
  })
  const hasErrors = Object.values(errors).some((e) => e)
  if (hasErrors) {
    globalAlert.value = null
    if (typeof window !== 'undefined') {
      const firstError = document.querySelector('.field--error')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  const payload = {
    prenom: form.prenom.trim(),
    nom: form.nom.trim(),
    email: form.email.trim(),
    telephone: `${form.phoneCc} ${form.phoneNumber.trim()}`,
    entreprise: form.entreprise.trim(),
    posteRecherche: form.posteRecherche as (typeof ROLES)[number],
    posteRecherchePrecisionAutre:
      form.posteRecherche === 'Autre' ? form.posteAutre.trim() : undefined,
    seniorite: form.seniorite as 'Junior' | 'Confirmé' | 'Senior' | 'Lead-Manager',
    objectifPoste: form.objectif as
      | 'Gestion portefeuille clients'
      | 'Développement et chasse'
      | 'Ouverture de nouvelle verticale'
      | "Création et management d'équipe",
    localisation: form.localisation.trim(),
    remotePossible: form.remote,
    secteur: form.secteur as (typeof SECTORS)[number],
    secteurPrecisionAutre: form.secteur === 'Autre' ? form.secteurAutre.trim() : undefined,
    fixe: stripNumber(form.fixe)!,
    ote: stripNumber(form.ote)!,
    siteEntreprise: form.siteEntreprise.trim() || undefined,
    contenuFichePoste: form.contenuFichePoste.trim() || undefined,
    consentementRgpd: true as const,
    turnstileToken: turnstileToken.value,
  }

  globalAlert.value = null
  const { uuid, immediateError } = await submit(payload)

  if (immediateError) {
    resetTurnstile()
    const cfg = ALERT_BY_CODE[immediateError.code] || ALERT_BY_CODE.INTERNAL_ERROR
    globalAlert.value = cfg!
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  // Marqueur "submission en cours" pour que la page résultat sache qu'elle doit poller.
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(`plan-sourcing-pending:${uuid}`, JSON.stringify({
      submittedAt: Date.now(),
      email: form.email.trim(),
      prenom: form.prenom.trim(),
    }))
  }
  await navigateTo(`/lab/plan-de-sourcing/resultat/${uuid}`)
}
</script>

<template>
  <LabToolShell>
    <main class="page">
      <div class="shell">
        <Transition name="alert-fade">
          <div v-if="globalAlert" class="global-alert" role="alert">
            <span class="global-alert__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="8" x2="12" y2="13" />
                <line x1="12" y1="16.5" x2="12" y2="17" />
              </svg>
            </span>
            <div class="global-alert__body">
              <h3 class="global-alert__title">{{ globalAlert.title }}</h3>
              <p class="global-alert__text" v-html="globalAlert.text" />
            </div>
          </div>
        </Transition>

        <!-- ============= PAGE HEADER ============= -->
        <section class="header">
          <div class="header__eyebrow">
            <span class="eyebrow-cyan">Le Lab Mariell</span>
          </div>
          <h1 class="header__title">
            Plan de sourcing LinkedIn <em>personnalisé.</em>
          </h1>
          <p class="header__sub">
            Une stratégie de chasse complète, calibrée sur votre contexte. Générée en moins de 60 secondes.
          </p>
          <div class="header__meta">
            <span class="dot" aria-hidden="true" />
            <span>Gratuit · Sans inscription · &lt; 60 secondes</span>
          </div>
        </section>

        <!-- ============= QUALITY NOTICE ============= -->
        <aside class="quality-notice" role="note" aria-label="Conseil avant de remplir">
          <span class="quality-notice__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9.5" />
              <path d="M12 8v5" />
              <circle cx="12" cy="16.2" r="0.7" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <p class="quality-notice__body">
            <strong>La qualité de la réponse dépend de votre formulaire.</strong>
            Veillez à partager <em>un maximum d'informations avec précision</em> pour obtenir le meilleur résultat.
          </p>
        </aside>

        <!-- ============= FORM ============= -->
        <form novalidate @submit.prevent="onSubmit">

          <!-- BLOC 1 — Identité -->
          <section class="block">
            <header class="block__head">
              <span class="block__num">01</span>
              <h2 class="block__title">Identité</h2>
            </header>
            <div class="grid grid--2">
              <div class="field" :class="{ 'field--error': errors.prenom }">
                <label class="field__label" for="prenom">Prénom <span class="req">*</span></label>
                <input id="prenom" v-model="form.prenom" class="ctrl" type="text"
                       autocomplete="given-name" placeholder="Marie"
                       @blur="onBlur('prenom')" @input="clearError('prenom')" />
                <span class="field__error">{{ errors.prenom || 'Champ obligatoire' }}</span>
              </div>

              <div class="field" :class="{ 'field--error': errors.nom }">
                <label class="field__label" for="nom">Nom <span class="req">*</span></label>
                <input id="nom" v-model="form.nom" class="ctrl" type="text"
                       autocomplete="family-name" placeholder="Dupont"
                       @blur="onBlur('nom')" @input="clearError('nom')" />
                <span class="field__error">{{ errors.nom || 'Champ obligatoire' }}</span>
              </div>

              <div class="field grid__full" :class="{ 'field--error': errors.email }">
                <label class="field__label" for="email">Adresse mail <span class="req">*</span></label>
                <input id="email" v-model="form.email" class="ctrl" type="email"
                       autocomplete="email" placeholder="marie.dupont@entreprise.com"
                       @blur="onBlur('email')" @input="clearError('email')" />
                <span class="field__error">{{ errors.email || 'Email invalide' }}</span>
              </div>

              <div class="field grid__full" :class="{ 'field--error': errors.phone }">
                <label class="field__label" for="phone">Numéro de téléphone <span class="req">*</span></label>
                <div class="tel-wrap">
                  <div class="tel-cc">
                    <select v-model="form.phoneCc" aria-label="Indicatif pays">
                      <option value="+33">FR +33</option>
                      <option value="+32">BE +32</option>
                      <option value="+41">CH +41</option>
                      <option value="+44">UK +44</option>
                      <option value="+49">DE +49</option>
                      <option value="+34">ES +34</option>
                      <option value="+39">IT +39</option>
                      <option value="+31">NL +31</option>
                      <option value="+352">LU +352</option>
                      <option value="+351">PT +351</option>
                      <option value="+353">IE +353</option>
                    </select>
                  </div>
                  <input id="phone" v-model="form.phoneNumber" class="tel-input" type="tel"
                         autocomplete="tel-national" placeholder="06 12 34 56 78"
                         @blur="onBlur('phone')" @input="clearError('phone')" />
                </div>
                <span class="field__error">{{ errors.phone || 'Numéro de téléphone invalide.' }}</span>
              </div>

              <div class="field grid__full" :class="{ 'field--error': errors.entreprise }">
                <label class="field__label" for="entreprise">Entreprise <span class="req">*</span></label>
                <input id="entreprise" v-model="form.entreprise" class="ctrl" type="text"
                       autocomplete="organization" placeholder="Nom de votre entreprise"
                       @blur="onBlur('entreprise')" @input="clearError('entreprise')" />
                <span class="field__error">{{ errors.entreprise || 'Champ obligatoire' }}</span>
              </div>
            </div>
          </section>

          <!-- BLOC 2 — Le poste -->
          <section class="block">
            <header class="block__head">
              <span class="block__num">02</span>
              <h2 class="block__title">Le poste à pourvoir</h2>
            </header>
            <div class="grid">
              <div class="field" :class="{ 'field--error': errors.posteRecherche }">
                <label class="field__label">Poste recherché <span class="req">*</span></label>
                <div id="jobtitle-combo" class="combo">
                  <button type="button" class="combo-trigger" :class="{ 'is-open': comboOpen }"
                          :aria-expanded="comboOpen" @click="comboOpen = !comboOpen">
                    <span :class="{ placeholder: !form.posteRecherche }" class="combo-value">
                      {{ form.posteRecherche || 'Sélectionnez un intitulé' }}
                    </span>
                    <span class="chevron" />
                  </button>
                  <div v-if="comboOpen" class="combo-panel is-open" role="listbox">
                    <input v-model="comboSearch" type="text" class="combo-search"
                           placeholder="Rechercher un intitulé…" autocomplete="off"
                           @click.stop />
                    <div class="combo-list">
                      <button v-for="role in filteredRoles" :key="role.label"
                              type="button" class="combo-opt"
                              :class="{ 'is-selected': form.posteRecherche === role.label }"
                              @click="selectRole(role.label)">
                        <span>{{ role.label }}</span>
                        <span class="num">{{ String(role.num).padStart(2, '0') }}</span>
                      </button>
                      <div v-if="filteredRoles.length === 0" class="combo-empty">Aucun résultat</div>
                    </div>
                  </div>
                </div>
                <span class="field__error">{{ errors.posteRecherche || "Sélectionnez un intitulé de poste" }}</span>

                <div v-if="form.posteRecherche === 'Autre'" class="precision is-visible"
                     :class="{ 'field--error': errors.posteAutre }">
                  <input v-model="form.posteAutre" class="ctrl" type="text" maxlength="60"
                         placeholder="Précisez l'intitulé du poste (60 caractères max)"
                         @blur="onBlur('posteAutre')" @input="clearError('posteAutre')" />
                  <span v-if="errors.posteAutre" class="field__error" style="margin-top: 6px;">
                    {{ errors.posteAutre }}
                  </span>
                </div>
              </div>

              <div class="field" :class="{ 'field--error': errors.seniorite }">
                <span class="field__label">Séniorité visée <span class="req">*</span></span>
                <div class="radio-group" role="radiogroup">
                  <label v-for="opt in [
                    { v: 'Junior', sub: '0–2 ans' },
                    { v: 'Confirmé', sub: '2–5 ans' },
                    { v: 'Senior', sub: '5–8 ans' },
                    { v: 'Lead-Manager', sub: '8+ ans' },
                  ]" :key="opt.v" class="radio">
                    <input v-model="form.seniorite" type="radio" name="seniorite" :value="opt.v"
                           @change="clearError('seniorite')" />
                    <span class="radio__main">{{ opt.v }}</span>
                    <span class="radio__sub">{{ opt.sub }}</span>
                  </label>
                </div>
                <span class="field__error">{{ errors.seniorite || 'Sélectionnez un niveau de séniorité' }}</span>
              </div>

              <div class="field" :class="{ 'field--error': errors.objectif }">
                <span class="field__label">Objectifs du poste <span class="req">*</span></span>
                <div class="radio-group radio-group--2" role="radiogroup">
                  <label v-for="opt in [
                    'Gestion portefeuille clients',
                    'Développement et chasse',
                    'Ouverture de nouvelle verticale',
                    `Création et management d'équipe`,
                  ]" :key="opt" class="radio">
                    <input v-model="form.objectif" type="radio" name="objectif" :value="opt"
                           @change="clearError('objectif')" />
                    <span class="radio__main">{{ opt }}</span>
                  </label>
                </div>
                <span class="field__error">{{ errors.objectif || 'Sélectionnez un objectif' }}</span>
              </div>

              <div class="field" :class="{ 'field--error': errors.localisation }">
                <label class="field__label" for="localisation">Localisation principale <span class="req">*</span></label>
                <input id="localisation" v-model="form.localisation" class="ctrl" type="text"
                       maxlength="100" placeholder="Paris, Lyon…"
                       @blur="onBlur('localisation')" @input="clearError('localisation')" />
                <span class="field__error">{{ errors.localisation || 'Champ obligatoire' }}</span>

                <label class="check-chip">
                  <input v-model="form.remote" type="checkbox" />
                  <span class="check-chip__box" aria-hidden="true">
                    <svg viewBox="0 0 14 14" fill="none">
                      <polyline points="2,7 6,11 12,3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <span class="check-chip__label">Remote possible</span>
                </label>
              </div>
            </div>
          </section>

          <!-- BLOC 3 — Le contexte -->
          <section class="block">
            <header class="block__head">
              <span class="block__num">03</span>
              <h2 class="block__title">Le contexte</h2>
            </header>
            <div class="grid grid--2">
              <div class="field grid__full" :class="{ 'field--error': errors.secteur }">
                <label class="field__label" for="secteur">Secteur de votre entreprise <span class="req">*</span></label>
                <select id="secteur" v-model="form.secteur" class="ctrl"
                        :data-empty="!form.secteur ? 'true' : 'false'"
                        @change="clearError('secteur')">
                  <option value="" disabled>Sélectionnez un secteur</option>
                  <option v-for="s in SECTORS" :key="s" :value="s">{{ s }}</option>
                </select>
                <span class="field__error">{{ errors.secteur || 'Sélectionnez un secteur' }}</span>

                <div v-if="form.secteur === 'Autre'" class="precision is-visible"
                     :class="{ 'field--error': errors.secteurAutre }">
                  <input v-model="form.secteurAutre" class="ctrl" type="text" maxlength="60"
                         placeholder="Précisez votre secteur (60 caractères max)"
                         @blur="onBlur('secteurAutre')" @input="clearError('secteurAutre')" />
                  <span v-if="errors.secteurAutre" class="field__error" style="margin-top: 6px;">
                    {{ errors.secteurAutre }}
                  </span>
                </div>
              </div>

              <div class="field" :class="{ 'field--error': errors.fixe }">
                <label class="field__label" for="fixe">Fixe annuel brut (€) <span class="req">*</span></label>
                <div class="num-wrap">
                  <input id="fixe" v-model="form.fixe" class="ctrl" type="text" inputmode="numeric"
                         placeholder="55000"
                         @blur="onBlur('fixe')" @input="clearError('fixe')" />
                  <span class="num-wrap__suffix">€</span>
                </div>
                <span class="field__error">{{ errors.fixe || 'Le fixe doit être entre 15 000 € et 500 000 €' }}</span>
              </div>

              <div class="field" :class="{ 'field--error': errors.ote }">
                <label class="field__label" for="ote">OTE total cible (€) <span class="req">*</span></label>
                <div class="num-wrap">
                  <input id="ote" v-model="form.ote" class="ctrl" type="text" inputmode="numeric"
                         placeholder="100000"
                         @blur="onBlur('ote')" @input="clearError('ote')" />
                  <span class="num-wrap__suffix">€</span>
                </div>
                <span class="field__error">{{ errors.ote || "L'OTE doit être entre 0 € et 800 000 €" }}</span>
              </div>

              <p class="field__hint grid__full" style="margin-top: 4px;">
                OTE = Fixe + Variable cible à 100% d'atteinte des objectifs.
              </p>
            </div>
          </section>

          <!-- BLOC 4 — Pour aller plus loin -->
          <section class="block">
            <header class="block__head">
              <span class="block__num">04</span>
              <h2 class="block__title">Pour aller plus loin</h2>
            </header>
            <p class="block__sub">Plus le contexte est riche, plus le plan sera précis.</p>
            <div class="grid">
              <div class="field" :class="{ 'field--error': errors.siteEntreprise }">
                <label class="field__label" for="website">Site de l'entreprise</label>
                <input id="website" v-model="form.siteEntreprise" class="ctrl" type="url"
                       inputmode="url" placeholder="https://votre-entreprise.com"
                       @blur="onBlur('siteEntreprise')" @input="clearError('siteEntreprise')" />
                <span class="field__error">{{ errors.siteEntreprise || 'URL invalide' }}</span>
              </div>

              <div class="field" :class="{ 'field--error': errors.contenuFichePoste }">
                <label class="field__label" for="jobspec">Contenu de la fiche de poste</label>
                <textarea id="jobspec" v-model="form.contenuFichePoste" class="ctrl"
                          maxlength="5000" rows="9"
                          placeholder="Collez ici le contenu de votre fiche de poste, si vous l'avez."
                          @blur="onBlur('contenuFichePoste')" @input="clearError('contenuFichePoste')" />
                <div class="ta-foot">
                  <p class="ta-foot__hint">Plus le contenu est riche, plus le plan sera précis. Maximum 5000 caractères.</p>
                  <span class="counter" :class="counterClass">{{ fichePosteLen }} / 5000</span>
                </div>
              </div>
            </div>
          </section>

          <!-- BLOC RGPD -->
          <section class="block" style="margin-bottom: 32px;">
            <div class="rgpd" :class="{ 'field--error': errors.rgpd }">
              <label class="rgpd__row">
                <span class="rgpd__check">
                  <input v-model="form.rgpd" type="checkbox" @change="clearError('rgpd')" />
                  <span class="rgpd__box" aria-hidden="true" />
                </span>
                <span class="rgpd__text">
                  J'accepte la <NuxtLink to="/politique-confidentialite" target="_blank" rel="noopener">politique de confidentialité</NuxtLink>
                  et le traitement de mes données personnelles par Mariell.
                </span>
              </label>
            </div>
            <p v-if="errors.rgpd" class="field__error" style="display: block; margin-top: 8px;">{{ errors.rgpd }}</p>
          </section>

          <!-- Honeypot Turnstile mount (invisible) -->
          <div v-if="hasTurnstile" class="cf-mount">
            <NuxtTurnstile ref="turnstile" v-model="turnstileToken" />
          </div>

          <!-- Submit -->
          <div class="submit" :class="{ 'is-ready': isFormReady, 'is-loading': isLoading }">
            <button type="submit" class="cta-submit" :class="{ 'is-loading': isLoading }"
                    :disabled="!isFormReady || isLoading">
              <span class="cta-submit__label">Générer mon plan de sourcing</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="cta-submit__loader" aria-live="polite">Génération en cours…</span>
            </button>

            <p class="submit__hint">Renseignez tous les champs obligatoires pour activer la génération.</p>

            <p class="submit__loading-note">
              Notre IA construit votre stratégie de sourcing sur les <em>8 livrables clés.</em><br />
              Cela peut prendre 1 à 2 minutes — merci de ne pas fermer cette page.
            </p>
          </div>

          <!-- Form footer -->
          <footer class="form-foot">
            <span class="form-foot__caption">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3l8 4v6c0 4.5-3.4 7.5-8 8-4.6-.5-8-3.5-8-8V7l8-4z"
                      stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Protégé par Cloudflare Turnstile
            </span>
            <span class="form-foot__sig">Recruter n'est pas un pari.</span>
          </footer>
        </form>
      </div>
    </main>
  </LabToolShell>
</template>

<style scoped>
/* ===== shared tokens (assumed in main.css globally) ===== */
.page { position: relative; z-index: 1; padding: 64px 20px 96px; }
@media (min-width: 768px) { .page { padding: 80px 40px 120px; } }
.shell { width: 100%; max-width: 740px; margin: 0 auto; }

/* ----- Page header ----- */
.header { text-align: center; margin-bottom: 56px; }
.header__eyebrow { margin-bottom: 28px; }
.eyebrow-cyan {
  display: inline-flex; align-items: center; gap: 14px;
  font-family: var(--font-grotesk);
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.32em; text-transform: uppercase;
  color: #5ee7e7;
}
.eyebrow-cyan::before {
  content: ""; width: 32px; height: 1px; background: currentColor;
}
.header__title {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-size: clamp(36px, 5.2vw, 60px);
  line-height: 1.08;
  letter-spacing: -0.035em;
  color: #fff;
  margin: 0 0 20px;
  text-wrap: balance;
}
.header__title em {
  font-style: italic;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  padding-bottom: 0.06em;
}
.header__sub {
  font-size: 17px; line-height: 1.6;
  color: rgba(255,255,255,0.65); max-width: 580px;
  margin: 0 auto;
}
.header__meta {
  margin-top: 28px;
  display: inline-flex; align-items: center; gap: 14px;
  padding: 8px 18px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 9999px;
  background: rgba(255,255,255,0.02);
}
.header__meta .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #5ee7e7; box-shadow: 0 0 12px rgba(94,231,231,0.8);
}
.header__meta span {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase; color: rgba(255,255,255,0.65);
}
@media (min-width: 768px) { .header { margin-bottom: 80px; } }

/* ----- Quality notice ----- */
.quality-notice {
  max-width: 760px; margin: 0 auto 56px;
  display: flex; align-items: flex-start; gap: 16px;
  padding: 20px 22px;
  border: 1px solid rgba(255,255,255,0.08);
  border-left: 2px solid #5ee7e7;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(0,255,255,0.035), rgba(255,0,255,0.02));
}
.quality-notice__icon {
  flex-shrink: 0; width: 22px; height: 22px;
  display: inline-flex; align-items: center; justify-content: center;
  color: #5ee7e7; margin-top: 2px;
}
.quality-notice__icon svg { width: 20px; height: 20px; stroke: currentColor; fill: none; }
.quality-notice__body {
  font-family: var(--font-grotesk);
  font-size: 14.5px; line-height: 1.6;
  color: rgba(255,255,255,0.9);
}
.quality-notice__body strong { color: #fff; font-weight: 600; }
.quality-notice__body em {
  font-style: normal;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  font-weight: 600;
}

/* ----- Block ----- */
.block { position: relative; margin-bottom: 56px; }
.block__head {
  display: flex; align-items: baseline; gap: 16px;
  margin-bottom: 28px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.block__num {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 11px; letter-spacing: 0.22em;
  color: #5ee7e7;
}
.block__title {
  font-family: var(--font-grotesk); font-weight: 800;
  font-size: clamp(22px, 2.6vw, 28px);
  line-height: 1.2; letter-spacing: -0.035em;
  color: #fff; margin: 0;
}
.block__sub { margin: -8px 0 28px; font-size: 14px; line-height: 1.55; color: rgba(255,255,255,0.55); }
@media (min-width: 768px) {
  .block { margin-bottom: 72px; }
  .block__head { padding-bottom: 22px; margin-bottom: 32px; }
}

/* ----- Grid + field ----- */
.grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
@media (min-width: 640px) { .grid--2 { grid-template-columns: 1fr 1fr; } }
.grid__full { grid-column: 1 / -1; }

.field { display: flex; flex-direction: column; gap: 8px; }
.field__label {
  display: flex; align-items: center; gap: 6px;
  font-family: var(--font-grotesk); font-weight: 500;
  font-size: 13px; letter-spacing: 0.02em;
  color: rgba(255,255,255,0.9);
}
.field__label .req { color: #e85eff; font-size: 11px; }
.field__hint { font-family: var(--font-grotesk); font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.5; }
.field__error {
  display: none;
  font-family: var(--font-grotesk); font-size: 12px;
  color: #ff8aa6; line-height: 1.5;
}
.field--error .field__error { display: block; }

/* ----- Inputs ----- */
.ctrl {
  appearance: none; -webkit-appearance: none; width: 100%;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 14px 16px;
  font-family: var(--font-grotesk); font-weight: 400;
  font-size: 15px; color: #fff; line-height: 1.4;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.ctrl::placeholder { color: rgba(255,255,255,0.32); font-weight: 300; }
.ctrl:hover { border-color: rgba(255,255,255,0.16); background: rgba(255,255,255,0.035); }
.ctrl:focus, .ctrl:focus-visible {
  outline: none;
  border-color: rgba(94,231,231,0.7);
  background: rgba(255,255,255,0.04);
  box-shadow: 0 0 0 3px rgba(0,255,255,0.10);
}
.field--error .ctrl {
  border-color: rgba(255,138,166,0.55);
  background: rgba(255,80,110,0.04);
}
textarea.ctrl { resize: vertical; min-height: 220px; line-height: 1.55; }
@media (max-width: 640px) { textarea.ctrl { min-height: 200px; } }

select.ctrl {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1l5 5 5-5' stroke='%23ffffff' stroke-opacity='0.55' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 44px;
  cursor: pointer;
}
select.ctrl option { background: #0a0a0a; color: #fff; }
select.ctrl[data-empty="true"] { color: rgba(255,255,255,0.32); }

/* ----- Radio cards ----- */
.radio-group { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
@media (min-width: 720px) { .radio-group { grid-template-columns: repeat(4, 1fr); } }
@media (min-width: 720px) { .radio-group--2 { grid-template-columns: repeat(2, 1fr); } }
.radio-group--2 .radio { min-height: 56px; justify-content: center; }
.radio {
  position: relative;
  display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
  padding: 14px 16px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  background: rgba(255,255,255,0.02);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
}
.radio:hover { border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.035); }
.radio input { position: absolute; opacity: 0; inset: 0; cursor: pointer; }
.radio__main { font-family: var(--font-grotesk); font-weight: 600; font-size: 14px; color: #fff; }
.radio__sub { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 11px; letter-spacing: 0.1em; color: rgba(255,255,255,0.45); }
.radio:has(input:checked) {
  border-color: rgba(94,231,231,0.55);
  background: linear-gradient(135deg, rgba(0,255,255,0.08), rgba(255,0,255,0.06));
  box-shadow: 0 0 0 1px rgba(94,231,231,0.25), 0 8px 24px -16px rgba(0,255,255,0.4);
}
.radio:has(input:checked) .radio__sub { color: #5ee7e7; }

/* ----- check-chip (Remote possible) ----- */
.check-chip {
  display: inline-flex; align-items: center; gap: 10px;
  margin-top: 4px; padding: 10px 14px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 9999px;
  background: rgba(255,255,255,0.02);
  cursor: pointer; align-self: flex-start;
  position: relative;
  transition: border-color 0.2s, background 0.2s;
}
.check-chip:hover { border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.035); }
.check-chip input { position: absolute; opacity: 0; pointer-events: none; }
.check-chip__box {
  display: inline-flex; align-items: center; justify-content: center;
  width: 16px; height: 16px;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 4px;
  background: rgba(255,255,255,0.02);
  color: transparent;
  transition: all 0.2s;
}
.check-chip__box svg { width: 10px; height: 10px; opacity: 0; transition: opacity 0.15s; }
.check-chip__label { font-family: var(--font-grotesk); font-size: 13px; color: rgba(255,255,255,0.9); }
.check-chip:has(input:checked) {
  border-color: rgba(94,231,231,0.55);
  background: linear-gradient(135deg, rgba(0,255,255,0.08), rgba(255,0,255,0.06));
}
.check-chip:has(input:checked) .check-chip__box {
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  border-color: transparent;
  color: #000;
}
.check-chip:has(input:checked) .check-chip__box svg { opacity: 1; }

/* ----- Numeric field with € ----- */
.num-wrap { position: relative; }
.num-wrap .ctrl { padding-right: 44px; font-variant-numeric: tabular-nums; letter-spacing: 0.01em; }
.num-wrap__suffix {
  position: absolute; top: 50%; right: 16px;
  transform: translateY(-50%);
  font-family: var(--font-grotesk); font-size: 14px;
  color: rgba(255,255,255,0.45); pointer-events: none;
}

/* ----- Textarea counter ----- */
.ta-foot {
  display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
  margin-top: 4px;
}
.ta-foot__hint { font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.5; flex: 1; }
.counter {
  flex: 0 0 auto;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 11px; letter-spacing: 0.08em;
  color: rgba(255,255,255,0.45);
  padding: 4px 10px;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
}
.counter--warn { color: #ffb86b; border-color: rgba(255,184,107,0.4); background: rgba(255,184,107,0.05); }
.counter--alert { color: #ff8aa6; border-color: rgba(255,138,166,0.5); background: rgba(255,138,166,0.06); }

/* ----- Phone field ----- */
.tel-wrap {
  display: flex;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.tel-wrap:hover { border-color: rgba(255,255,255,0.16); background: rgba(255,255,255,0.035); }
.tel-wrap:focus-within {
  border-color: rgba(94,231,231,0.7);
  background: rgba(255,255,255,0.04);
  box-shadow: 0 0 0 3px rgba(0,255,255,0.10);
}
.field--error .tel-wrap { border-color: rgba(255,138,166,0.55); background: rgba(255,80,110,0.04); }
.tel-cc { position: relative; flex-shrink: 0; border-right: 1px solid rgba(255,255,255,0.08); }
.tel-cc select {
  height: 100%; background: transparent; color: #fff;
  font-family: var(--font-grotesk); font-weight: 500; font-size: 14px;
  padding: 14px 32px 14px 16px; border: 0;
  appearance: none; -webkit-appearance: none; cursor: pointer;
}
.tel-cc::after {
  content: ''; position: absolute;
  right: 14px; top: 50%;
  width: 6px; height: 6px;
  border-right: 1.5px solid rgba(255,255,255,0.55);
  border-bottom: 1.5px solid rgba(255,255,255,0.55);
  transform: translateY(-65%) rotate(45deg);
  pointer-events: none;
}
.tel-cc select option { background: #0a0a0a; color: #fff; }
.tel-input {
  flex: 1; background: transparent; border: 0;
  padding: 14px 16px; color: #fff;
  font-family: var(--font-grotesk); font-weight: 400; font-size: 15px;
}
.tel-input:focus { outline: none; }
.tel-input::placeholder { color: rgba(255,255,255,0.32); font-weight: 300; }

/* ----- Combobox ----- */
.combo { position: relative; }
.combo-trigger {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 14px 16px;
  color: #fff;
  font-family: var(--font-grotesk); font-weight: 400; font-size: 15px;
  text-align: left; cursor: pointer;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.combo-trigger:hover { border-color: rgba(255,255,255,0.16); background: rgba(255,255,255,0.035); }
.combo-trigger:focus, .combo-trigger.is-open {
  outline: none;
  border-color: rgba(94,231,231,0.7);
  background: rgba(255,255,255,0.04);
  box-shadow: 0 0 0 3px rgba(0,255,255,0.10);
}
.field--error .combo-trigger { border-color: rgba(255,138,166,0.55); background: rgba(255,80,110,0.04); }
.combo-trigger .placeholder { color: rgba(255,255,255,0.32); font-weight: 300; }
.combo-trigger .chevron {
  width: 8px; height: 8px;
  border-right: 1.5px solid rgba(255,255,255,0.55);
  border-bottom: 1.5px solid rgba(255,255,255,0.55);
  transform: rotate(45deg);
  transition: transform 0.2s;
  margin-top: -3px;
}
.combo-trigger.is-open .chevron { transform: rotate(-135deg); margin-top: 2px; border-color: #5ee7e7; }
.combo-panel {
  position: absolute; top: calc(100% + 6px); left: 0; right: 0;
  z-index: 30;
  background: #0a0a0c;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  box-shadow: 0 24px 60px -20px rgba(0,0,0,0.8);
  overflow: hidden;
}
.combo-search {
  width: 100%; background: transparent; border: 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding: 14px 18px; color: #fff;
  font-family: var(--font-grotesk); font-weight: 400; font-size: 14px;
}
.combo-search:focus { outline: none; border-bottom-color: rgba(94,231,231,0.5); }
.combo-list { max-height: 280px; overflow-y: auto; padding: 6px 0; }
.combo-opt {
  width: 100%; background: transparent; border: 0;
  text-align: left; padding: 10px 18px;
  font-family: var(--font-grotesk); font-weight: 400; font-size: 14px;
  color: rgba(255,255,255,0.9); cursor: pointer;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  transition: background 0.15s, color 0.15s;
}
.combo-opt:hover { background: rgba(94,231,231,0.06); color: #fff; }
.combo-opt .num { font-family: ui-monospace, monospace; font-size: 11px; color: rgba(255,255,255,0.4); letter-spacing: 0.04em; }
.combo-opt.is-selected { color: #5ee7e7; }
.combo-empty { padding: 18px; color: rgba(255,255,255,0.45); font-size: 13px; text-align: center; }

/* ----- Conditional precision ----- */
.precision { display: none; margin-top: 10px; }
.precision.is-visible { display: block; animation: slideIn 0.25s; }
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ----- RGPD ----- */
.rgpd {
  margin-top: 8px; padding: 18px 20px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  background: rgba(255,255,255,0.015);
}
.rgpd.field--error { border-color: rgba(255,138,166,0.55); background: rgba(255,80,110,0.04); }
.rgpd__row { display: flex; align-items: flex-start; gap: 14px; cursor: pointer; }
.rgpd__check {
  flex: 0 0 auto; position: relative; width: 20px; height: 20px; margin-top: 1px;
}
.rgpd__check input { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer; }
.rgpd__box {
  display: block; width: 20px; height: 20px;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 5px;
  background: rgba(255,255,255,0.02);
  transition: all 0.2s;
}
.rgpd__check input:checked + .rgpd__box {
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  border-color: transparent;
}
.rgpd__check input:checked + .rgpd__box::after {
  content: ""; position: absolute;
  top: 4px; left: 7px;
  width: 5px; height: 9px;
  border: solid #000; border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.rgpd__text {
  font-family: var(--font-grotesk); font-size: 13px;
  line-height: 1.55; color: rgba(255,255,255,0.65);
}
.rgpd__text :deep(a) {
  color: rgba(255,255,255,0.9);
  text-decoration: underline;
  text-decoration-color: rgba(94,231,231,0.6);
  text-underline-offset: 3px;
}
.rgpd__text :deep(a:hover) { color: #5ee7e7; text-decoration-color: #5ee7e7; }

/* ----- Submit ----- */
.cf-mount { display: none; }

.submit {
  margin-top: 40px;
  display: flex; flex-direction: column; align-items: center; gap: 18px;
}
.cta-submit {
  position: relative;
  display: inline-flex; align-items: center; justify-content: center; gap: 12px;
  width: 100%; max-width: 440px;
  padding: 20px 36px;
  border: 0;
  border-radius: 9999px;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  color: #000;
  font-family: var(--font-grotesk); font-weight: 600;
  font-size: 15px; letter-spacing: 0.01em;
  cursor: pointer;
  box-shadow: 0 20px 60px -15px rgba(255,0,255,0.55), 0 8px 30px -10px rgba(0,255,255,0.4);
  transition: transform 0.3s, box-shadow 0.3s, filter 0.2s, opacity 0.25s;
}
.cta-submit:hover:not(:disabled):not(.is-loading) {
  transform: translateY(-2px);
  filter: brightness(1.08);
}
.cta-submit svg { width: 18px; height: 18px; transition: transform 0.25s; }
.cta-submit:hover:not(:disabled):not(.is-loading) svg { transform: translateX(3px); }
.cta-submit:disabled {
  cursor: not-allowed;
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.32);
  box-shadow: none; filter: none;
  border: 1px solid rgba(255,255,255,0.08);
}
.cta-submit:disabled svg { stroke: rgba(255,255,255,0.32); }
.cta-submit.is-loading { pointer-events: none; color: transparent !important; }
.cta-submit.is-loading .cta-submit__label,
.cta-submit.is-loading svg { opacity: 0; }
.cta-submit__loader {
  display: none; position: absolute; inset: 0;
  align-items: center; justify-content: center; gap: 12px;
  color: #000;
  font-family: var(--font-grotesk); font-weight: 600;
  font-size: 14px; letter-spacing: 0.02em;
}
.cta-submit.is-loading .cta-submit__loader { display: inline-flex; }
.cta-submit__loader::before {
  content: "";
  width: 16px; height: 16px;
  border: 2px solid rgba(0,0,0,0.25);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.submit__hint {
  font-family: var(--font-grotesk); font-size: 12px;
  color: rgba(255,255,255,0.45);
  text-align: center; line-height: 1.5;
  transition: opacity 0.2s;
}
.submit.is-ready .submit__hint { opacity: 0; height: 0; margin: 0; }

.submit__loading-note {
  display: none;
  font-family: var(--font-grotesk); font-size: 13px;
  color: rgba(255,255,255,0.65);
  text-align: center; line-height: 1.5;
}
.submit.is-loading .submit__loading-note { display: block; }
.submit__loading-note em {
  font-style: italic;
  background: linear-gradient(135deg, #5ee7e7 0%, #e85eff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
}

/* ----- Form footer ----- */
.form-foot {
  margin-top: 36px; padding-top: 28px;
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex; flex-direction: column; gap: 16px;
  align-items: center; text-align: center;
}
.form-foot__caption {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 10.5px; letter-spacing: 0.18em;
  text-transform: uppercase; color: rgba(255,255,255,0.4);
  display: inline-flex; align-items: center; gap: 10px;
}
.form-foot__caption svg { width: 12px; height: 12px; color: rgba(255,255,255,0.45); }
.form-foot__sig {
  font-family: var(--font-grotesk); font-weight: 800;
  font-style: italic; font-size: 14px;
  color: rgba(255,255,255,0.55);
}

/* ----- Global alert ----- */
.global-alert {
  display: flex; gap: 16px;
  padding: 22px 24px;
  border: 1px solid rgba(232,94,255,0.35);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(232,94,255,0.06), rgba(232,94,255,0.02));
  margin-bottom: 32px;
  position: relative; overflow: hidden;
}
.global-alert::before {
  content: ""; position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(232,94,255,0.5), transparent);
}
.global-alert__mark {
  width: 32px; height: 32px; flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid rgba(232,94,255,0.35);
  background: rgba(232,94,255,0.08);
  display: flex; align-items: center; justify-content: center;
  color: #e85eff;
}
.global-alert__mark svg { width: 14px; height: 14px; }
.global-alert__body { display: flex; flex-direction: column; gap: 6px; }
.global-alert__title {
  font-family: var(--font-grotesk); font-weight: 800;
  font-size: 17px; letter-spacing: -0.015em;
  color: #fff; margin: 0;
}
.global-alert__text {
  font-family: var(--font-grotesk); font-size: 14px; font-weight: 300;
  color: rgba(255,255,255,0.9); line-height: 1.6; margin: 0;
}
.global-alert__text :deep(a) {
  color: #5ee7e7; text-decoration: none;
  border-bottom: 1px solid rgba(94,231,231,0.3);
}
.alert-fade-enter-active, .alert-fade-leave-active { transition: opacity 0.25s, transform 0.25s; }
.alert-fade-enter-from, .alert-fade-leave-to { opacity: 0; transform: translateY(-6px); }

@media (prefers-reduced-motion: reduce) {
  .ctrl, .radio, .check-chip, .combo-trigger, .cta-submit, .cta-submit svg, .precision { transition: none; animation: none; }
}
</style>
