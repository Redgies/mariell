<script setup lang="ts">
definePageMeta({ layout: 'tool' })

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
    | "Création et management d’équipe"
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
      return t(form.posteAutre) ? null : "Précisez l’intitulé du poste."
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
      if (n < 0 || n > 800000) return "L’OTE doit être entre 0 € et 800 000 €."
      const f = stripNumber(form.fixe)
      if (f !== null && n < f) return "L’OTE doit être supérieur ou égal au fixe."
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
  if (n >= 5000) return 'is-danger'
  if (n >= 4500) return 'is-warn'
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
    title: "Une erreur technique s’est produite.",
    text:
      "Votre demande n’a pas pu être enregistrée. Merci de réessayer dans quelques minutes, ou de nous contacter directement à <a href=\"mailto:bonjour@mariell.fr\">bonjour@mariell.fr</a>.",
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
      const firstError = document.querySelector('.tfield.is-error')
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
      | "Création et management d’équipe",
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

  // Marqueur "submission en cours" pour que la page résultat sache qu’elle doit poller.
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
  <div class="tool-body">
    <div class="tool-bg" aria-hidden="true" />

    <nav class="site-nav">
      <div class="site-nav__inner">
        <NuxtLink to="/" class="site-nav__brand" aria-label="Mariell, accueil">
          <span class="chromatic chromatic--glitch" style="font-size: 22px;">
            <span class="chromatic__layer chromatic__layer--cyan">Mariell</span>
            <span class="chromatic__layer chromatic__layer--magenta">Mariell</span>
            <span class="chromatic__base">Mariell</span>
          </span>
        </NuxtLink>
        <NuxtLink to="/lab" class="nav-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Retour au Lab
        </NuxtLink>
      </div>
    </nav>

    <main class="tool-shell">
      <!-- Global alert -->
      <Transition name="talert-fade">
        <div v-if="globalAlert" class="talert is-show" role="alert">
          <div class="talert-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="8" x2="12" y2="13" />
              <line x1="12" y1="16.5" x2="12" y2="17" />
            </svg>
          </div>
          <div>
            <p class="talert-title">{{ globalAlert.title }}</p>
            <p class="talert-text" v-html="globalAlert.text" />
          </div>
        </div>
      </Transition>

      <!-- Header -->
      <header style="text-align: center;">
        <div class="tool-eyebrow">Outil · Le&nbsp;Lab&nbsp;Mariell</div>
        <h1 class="tool-title" style="margin-left: auto; margin-right: auto;">
          Plan de sourcing LinkedIn <em>personnalisé.</em>
        </h1>
        <p class="tool-subtitle" style="margin-left: auto; margin-right: auto;">
          Une stratégie de chasse complète, calibrée sur votre contexte. Générée en moins de 60 secondes.
        </p>
        <div class="meta-badge">
          <span class="meta-badge__dot" aria-hidden="true" />
          Gratuit · Sans inscription · &lt; 60 secondes
        </div>
      </header>

      <!-- Form -->
      <form novalidate @submit.prevent="onSubmit">

        <!-- 01 Identité -->
        <section class="tblock">
          <div class="tblock-head">
            <span class="tblock-num">01</span>
            <h2 class="tblock-title">Identité</h2>
            <span class="tblock-rule" />
          </div>
          <div class="tfields--2">
            <div class="tfield" :class="{ 'is-error': errors.prenom }">
              <label class="tlabel" for="prenom">Prénom <span class="treq">*</span></label>
              <input id="prenom" v-model="form.prenom" class="tinput" type="text"
                     autocomplete="given-name" placeholder="Marie"
                     @blur="onBlur('prenom')" @input="clearError('prenom')" />
              <p class="terror">{{ errors.prenom || 'Ce champ est requis.' }}</p>
            </div>
            <div class="tfield" :class="{ 'is-error': errors.nom }">
              <label class="tlabel" for="nom">Nom <span class="treq">*</span></label>
              <input id="nom" v-model="form.nom" class="tinput" type="text"
                     autocomplete="family-name" placeholder="Dupont"
                     @blur="onBlur('nom')" @input="clearError('nom')" />
              <p class="terror">{{ errors.nom || 'Ce champ est requis.' }}</p>
            </div>
          </div>
          <div class="tfields" style="margin-top: 24px;">
            <div class="tfield" :class="{ 'is-error': errors.email }">
              <label class="tlabel" for="email">Adresse mail <span class="treq">*</span></label>
              <input id="email" v-model="form.email" class="tinput" type="email"
                     inputmode="email" autocomplete="email" placeholder="marie.dupont@entreprise.com"
                     @blur="onBlur('email')" @input="clearError('email')" />
              <p class="terror">{{ errors.email || "Format d’email invalide." }}</p>
            </div>
            <div class="tfield" :class="{ 'is-error': errors.phone }">
              <label class="tlabel" for="phone">Numéro de téléphone <span class="treq">*</span></label>
              <div class="tphone">
                <div class="tselect-wrap">
                  <select v-model="form.phoneCc" class="tselect" aria-label="Indicatif pays">
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
                <input id="phone" v-model="form.phoneNumber" class="tinput" type="tel"
                       inputmode="tel" autocomplete="tel-national" placeholder="06 12 34 56 78"
                       @blur="onBlur('phone')" @input="clearError('phone')" />
              </div>
              <p class="terror">{{ errors.phone || 'Numéro invalide.' }}</p>
            </div>
            <div class="tfield" :class="{ 'is-error': errors.entreprise }">
              <label class="tlabel" for="entreprise">Entreprise <span class="treq">*</span></label>
              <input id="entreprise" v-model="form.entreprise" class="tinput" type="text"
                     autocomplete="organization" placeholder="Nom de votre entreprise"
                     @blur="onBlur('entreprise')" @input="clearError('entreprise')" />
              <p class="terror">{{ errors.entreprise || 'Ce champ est requis.' }}</p>
            </div>
          </div>
        </section>

        <!-- 02 Le poste à pourvoir -->
        <section class="tblock">
          <div class="tblock-head">
            <span class="tblock-num">02</span>
            <h2 class="tblock-title">Le poste à pourvoir</h2>
            <span class="tblock-rule" />
          </div>
          <div class="tfields">
            <!-- Combobox intitulé de poste -->
            <div class="tfield" :class="{ 'is-error': errors.posteRecherche }">
              <span class="tlabel">Poste recherché <span class="treq">*</span></span>
              <div id="jobtitle-combo" class="combo-wrap">
                <button type="button" class="tinput combo-trigger"
                        :class="{ 'has-value': !!form.posteRecherche }"
                        :aria-expanded="comboOpen"
                        @click="comboOpen = !comboOpen">
                  <span class="combo-value">
                    {{ form.posteRecherche || 'Sélectionnez un intitulé…' }}
                  </span>
                  <span class="combo-chevron" :class="{ 'is-open': comboOpen }" aria-hidden="true" />
                </button>
                <div v-if="comboOpen" class="combo-panel is-open" role="listbox">
                  <input v-model="comboSearch" type="text" class="combo-search"
                         placeholder="Rechercher…" autocomplete="off"
                         @click.stop />
                  <div class="combo-list">
                    <div v-for="role in filteredRoles" :key="role.label"
                         class="combo-opt"
                         :class="{ 'is-active': form.posteRecherche === role.label }"
                         role="option"
                         :aria-selected="form.posteRecherche === role.label"
                         @click="selectRole(role.label)">
                      {{ role.label }}
                    </div>
                    <div v-if="filteredRoles.length === 0" class="combo-empty">Aucun résultat</div>
                  </div>
                </div>
              </div>
              <p class="terror">{{ errors.posteRecherche || "Sélectionnez un intitulé de poste." }}</p>
              <div v-if="form.posteRecherche === 'Autre'" class="precision is-show">
                <input v-model="form.posteAutre" class="tinput" type="text" maxlength="60"
                       placeholder="Précisez l’intitulé du poste (60 caractères max)"
                       @blur="onBlur('posteAutre')" @input="clearError('posteAutre')" />
                <p v-if="errors.posteAutre" class="terror" style="display: block; margin-top: 6px;">
                  {{ errors.posteAutre }}
                </p>
              </div>
            </div>

            <!-- Séniorité -->
            <div class="tfield" :class="{ 'is-error': errors.seniorite }">
              <span class="tlabel">Séniorité visée <span class="treq">*</span></span>
              <div class="ttiles ttiles--4" role="radiogroup">
                <label v-for="opt in [
                  { v: 'Junior', sub: '0–2 ans' },
                  { v: 'Confirmé', sub: '2–5 ans' },
                  { v: 'Senior', sub: '5–8 ans' },
                  { v: 'Lead-Manager', sub: '8+ ans' },
                ]" :key="opt.v" class="ttile">
                  <input v-model="form.seniorite" type="radio" name="seniorite" :value="opt.v"
                         @change="clearError('seniorite')" />
                  <span class="ttile-title">{{ opt.v }}</span>
                  <span class="ttile-sub">{{ opt.sub }}</span>
                </label>
              </div>
              <p class="terror">{{ errors.seniorite || 'Sélectionnez une séniorité.' }}</p>
            </div>

            <!-- Objectifs -->
            <div class="tfield" :class="{ 'is-error': errors.objectif }">
              <span class="tlabel">Objectifs du poste <span class="treq">*</span></span>
              <div class="ttiles" style="grid-template-columns: repeat(2, 1fr);" role="radiogroup">
                <label v-for="opt in [
                  'Gestion portefeuille clients',
                  'Développement et chasse',
                  'Ouverture de nouvelle verticale',
                  `Création et management d’équipe`,
                ]" :key="opt" class="ttile ttile--row">
                  <input v-model="form.objectif" type="radio" name="objectif" :value="opt"
                         @change="clearError('objectif')" />
                  <span class="ttile-title">{{ opt }}</span>
                </label>
              </div>
              <p class="terror">{{ errors.objectif || 'Sélectionnez un objectif.' }}</p>
            </div>

            <!-- Localisation -->
            <div class="tfield" :class="{ 'is-error': errors.localisation }">
              <label class="tlabel" for="localisation">Localisation principale <span class="treq">*</span></label>
              <input id="localisation" v-model="form.localisation" class="tinput" type="text"
                     maxlength="100" placeholder="Paris, Lyon, remote…"
                     @blur="onBlur('localisation')" @input="clearError('localisation')" />
              <label class="chip-check">
                <input v-model="form.remote" type="checkbox" />
                <span class="chip-box" aria-hidden="true" />
                <span class="chip-label">Remote possible</span>
              </label>
              <p class="terror">{{ errors.localisation || 'Ce champ est requis.' }}</p>
            </div>
          </div>
        </section>

        <!-- 03 Le contexte -->
        <section class="tblock">
          <div class="tblock-head">
            <span class="tblock-num">03</span>
            <h2 class="tblock-title">Le contexte</h2>
            <span class="tblock-rule" />
          </div>
          <div class="tfields">
            <div class="tfield" :class="{ 'is-error': errors.secteur }">
              <label class="tlabel" for="secteur">Secteur de votre entreprise <span class="treq">*</span></label>
              <div class="tselect-wrap">
                <select id="secteur" v-model="form.secteur" class="tselect"
                        :class="{ 'is-empty': !form.secteur }"
                        @change="clearError('secteur')">
                  <option value="" disabled hidden>Sélectionnez un secteur</option>
                  <option v-for="s in SECTORS" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
              <p class="terror">{{ errors.secteur || 'Sélectionnez un secteur.' }}</p>
              <div v-if="form.secteur === 'Autre'" class="precision is-show">
                <input v-model="form.secteurAutre" class="tinput" type="text" maxlength="60"
                       placeholder="Précisez votre secteur (60 caractères max)"
                       @blur="onBlur('secteurAutre')" @input="clearError('secteurAutre')" />
                <p v-if="errors.secteurAutre" class="terror" style="display: block; margin-top: 6px;">
                  {{ errors.secteurAutre }}
                </p>
              </div>
            </div>
            <div class="tfields--2">
              <div class="tfield" :class="{ 'is-error': errors.fixe }">
                <label class="tlabel" for="fixe">Fixe annuel brut (€) <span class="treq">*</span></label>
                <div class="num-wrap">
                  <input id="fixe" v-model="form.fixe" class="tinput" type="text" inputmode="numeric"
                         placeholder="55 000"
                         @blur="onBlur('fixe')" @input="clearError('fixe')" />
                  <span class="num-suffix">€</span>
                </div>
                <p class="terror">{{ errors.fixe || 'Montant invalide.' }}</p>
              </div>
              <div class="tfield" :class="{ 'is-error': errors.ote }">
                <label class="tlabel" for="ote">OTE total cible (€) <span class="treq">*</span></label>
                <div class="num-wrap">
                  <input id="ote" v-model="form.ote" class="tinput" type="text" inputmode="numeric"
                         placeholder="100 000"
                         @blur="onBlur('ote')" @input="clearError('ote')" />
                  <span class="num-suffix">€</span>
                </div>
                <p class="terror">{{ errors.ote || 'Montant invalide.' }}</p>
              </div>
            </div>
            <p class="thelper">OTE = Fixe + Variable cible à 100% d’atteinte des objectifs.</p>
          </div>
        </section>

        <!-- 04 Pour aller plus loin -->
        <section class="tblock">
          <div class="tblock-head">
            <span class="tblock-num">04</span>
            <h2 class="tblock-title">Pour aller plus loin</h2>
            <span class="tblock-rule" />
          </div>
          <div class="tfields">
            <div class="tfield" :class="{ 'is-error': errors.siteEntreprise }">
              <label class="tlabel" for="siteurl">Site de l’entreprise</label>
              <input id="siteurl" v-model="form.siteEntreprise" class="tinput" type="url"
                     inputmode="url" placeholder="https://votre-entreprise.com"
                     @blur="onBlur('siteEntreprise')" @input="clearError('siteEntreprise')" />
              <p class="terror">{{ errors.siteEntreprise || 'URL invalide.' }}</p>
            </div>
            <div class="tfield" :class="{ 'is-error': errors.contenuFichePoste }">
              <label class="tlabel" for="jobdesc">Contenu de la fiche de poste</label>
              <div class="ttextarea-wrap">
                <textarea id="jobdesc" v-model="form.contenuFichePoste" class="ttextarea"
                          maxlength="5000" rows="7"
                          placeholder="Collez ici la fiche de poste si vous en avez une, cela affine considérablement le plan."
                          @blur="onBlur('contenuFichePoste')" @input="clearError('contenuFichePoste')" />
                <span class="ttextarea-counter" :class="counterClass">{{ fichePosteLen }} / 5000</span>
              </div>
              <p class="terror">{{ errors.contenuFichePoste || '5000 caractères maximum.' }}</p>
            </div>
          </div>
          <p class="thelper" style="margin-top: 14px;">Plus le contexte est riche, plus le plan sera précis.</p>
        </section>

        <!-- RGPD -->
        <section class="tblock" style="margin-bottom: 8px;">
          <label class="tcheck" :class="{ 'is-error': errors.rgpd }">
            <input v-model="form.rgpd" id="rgpd" type="checkbox" @change="clearError('rgpd')" />
            <span class="tcheck-box" aria-hidden="true" />
            <span class="tcheck-text">
              J’accepte la
              <NuxtLink to="/politique-confidentialite" target="_blank" rel="noopener">politique de confidentialité</NuxtLink>
              et le traitement de mes données personnelles par Mariell.
            </span>
          </label>
          <p v-if="errors.rgpd" class="terror" style="display: block; margin-top: 8px; padding-left: 32px;">
            {{ errors.rgpd }}
          </p>
        </section>

        <!-- Honeypot Turnstile mount (invisible) -->
        <div v-if="hasTurnstile" style="display: none;">
          <NuxtTurnstile ref="turnstile" v-model="turnstileToken" />
        </div>

        <!-- Submit -->
        <div class="tsubmit-area" :class="{ 'is-ready': isFormReady, 'is-loading': isLoading }">
          <button type="submit" class="tsubmit"
                  :class="{ 'is-disabled': !isFormReady || isLoading, 'is-loading': isLoading }"
                  :disabled="!isFormReady || isLoading">
            <span class="tspinner" aria-hidden="true" />
            <span class="tsubmit-idle">Générer mon plan de sourcing</span>
            <span class="tsubmit-loading">Génération en cours…</span>
            <svg class="tsubmit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <p class="submit-hint">Renseignez tous les champs obligatoires pour activer la génération.</p>
          <p class="submit-loading-note">
            Notre IA construit votre stratégie de sourcing sur les <em>8 livrables clés.</em><br />
            Cela peut prendre jusqu’à 60 secondes. Merci de ne pas fermer cette page.
          </p>
        </div>

        <!-- Form footer -->
        <div class="tfoot" style="align-items: center; text-align: center;">
          <span class="tcf">&#8987; Protégé par Cloudflare Turnstile</span>
          <span class="tfoot-2">Recruter n’est pas un pari.</span>
        </div>
      </form>
    </main>
  </div>
</template>

<style scoped>
/* ---- Tool title italic accent ---- */
.tool-title em {
  font-style: italic;
  color: inherit;
}

/* ---- Meta badge ---- */
.meta-badge {
  margin-top: 22px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fg-on-ink-3);
  border: 1px solid var(--border-on-ink);
  border-radius: 999px;
  padding: 7px 16px;
}
.meta-badge__dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cyan);
  box-shadow: 0 0 8px var(--cyan);
  flex-shrink: 0;
}

/* ---- Combobox ---- */
.combo-wrap { position: relative; }
.combo-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  text-align: left;
  width: 100%;
}
.combo-trigger .combo-value { color: var(--fg-on-ink-4); }
.combo-trigger.has-value .combo-value { color: var(--fg-on-ink-1); }
.combo-chevron {
  width: 9px;
  height: 9px;
  border-right: 1.6px solid var(--fg-on-ink-3);
  border-bottom: 1.6px solid var(--fg-on-ink-3);
  transform: rotate(45deg) translateY(-3px);
  transition: transform 160ms;
  flex-shrink: 0;
}
.combo-chevron.is-open {
  transform: rotate(-135deg) translateY(-3px);
  border-color: var(--cyan);
}
.combo-panel {
  margin-top: 8px;
  background: var(--ink-800);
  border: 1px solid var(--border-on-ink);
  border-radius: 10px;
  overflow: hidden;
}
.combo-search {
  width: 100%;
  box-sizing: border-box;
  background: var(--ink-700);
  border: none;
  border-bottom: 1px solid var(--border-on-ink);
  color: var(--fg-on-ink-1);
  font: inherit;
  font-size: 14px;
  padding: 11px 14px;
}
.combo-search:focus { outline: none; }
.combo-list { max-height: 240px; overflow-y: auto; }
.combo-opt {
  padding: 11px 14px;
  font-size: 14px;
  color: var(--fg-on-ink-2);
  cursor: pointer;
}
.combo-opt:hover,
.combo-opt.is-active {
  background: rgba(127, 231, 225, 0.10);
  color: var(--fg-on-ink-1);
}
.combo-empty {
  padding: 18px;
  font-size: 13px;
  color: var(--fg-on-ink-3);
  text-align: center;
}

/* ---- Precision reveal ---- */
.precision { display: none; margin-top: 12px; }
.precision.is-show { display: block; }

/* ---- Chip checkbox (remote) ---- */
.chip-check {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-top: 12px;
  cursor: pointer;
  position: relative;
}
.chip-check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.chip-box {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.6px solid var(--fg-on-ink-3);
  position: relative;
  transition: all 140ms;
  flex-shrink: 0;
}
.chip-check input:checked ~ .chip-box {
  background: var(--cyan);
  border-color: var(--cyan);
}
.chip-check input:checked ~ .chip-box::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border-right: 2px solid var(--ink-900);
  border-bottom: 2px solid var(--ink-900);
  transform: rotate(45deg);
}
.chip-label {
  font-size: 14px;
  color: var(--fg-on-ink-2);
}

/* ---- Numeric field with € suffix ---- */
.num-wrap { position: relative; }
.num-wrap .tinput { padding-right: 34px; font-variant-numeric: tabular-nums; }
.num-suffix {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--fg-on-ink-3);
  font-size: 15px;
  pointer-events: none;
}

/* ---- Objective tiles row variant ---- */
.ttile--row {
  flex-direction: row;
  align-items: center;
}

/* ---- Submit area states ---- */
.submit-hint { font-size: 13px; color: var(--fg-on-ink-3); margin: 0; }
.tsubmit-area.is-ready .submit-hint { display: none; }
.submit-loading-note {
  display: none;
  font-size: 13px;
  line-height: 1.5;
  color: var(--fg-on-ink-3);
  margin: 0;
}
.submit-loading-note em {
  font-family: var(--font-text);
  font-style: normal;
  color: var(--cyan);
}
.tsubmit-area.is-loading .submit-loading-note { display: block; }

/* ---- Global alert transition ---- */
.talert-fade-enter-active,
.talert-fade-leave-active { transition: opacity 0.25s, transform 0.25s; }
.talert-fade-enter-from,
.talert-fade-leave-to { opacity: 0; transform: translateY(-6px); }

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .combo-chevron,
  .chip-box,
  .tsubmit { transition: none; }
}

/* ---- Mobile / responsive ---- */
@media (max-width: 900px) {
  /* Séniorité tiles: 2-up on tablet */
  .ttiles--4 { grid-template-columns: repeat(2, 1fr); }
  /* Objectif tiles stay 2-col — already set inline, no change needed */
  /* Numeric fields full-width via tfields--2 collapsing */
}

@media (max-width: 560px) {
  /* Phone row: stack country code + number vertically */
  :deep(.tphone) {
    flex-direction: column;
    align-items: stretch;
  }
  :deep(.tphone .tselect-wrap) { width: 100%; }
  :deep(.tphone .tinput) { width: 100%; }

  /* Séniorité tiles: 2-up then allow 1 if very narrow */
  .ttiles--4 { grid-template-columns: repeat(2, 1fr); }

  /* Objectif tiles (2-col inline): collapse to 1-col */
  .ttile--row { flex-direction: row; align-items: center; }

  /* Combobox panel: full width (already is, but ensure min-height for tap) */
  .combo-opt { min-height: 44px; display: flex; align-items: center; }
  .combo-search { min-height: 44px; }

  /* Submit CTA full-width */
  .tsubmit { width: 100%; justify-content: center; }
  .tsubmit-area { align-items: stretch; }

  /* Numeric field full-width handled by tfields--2 single-col global CSS */
}
</style>
