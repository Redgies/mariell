<script setup lang="ts">
definePageMeta({ layout: false })

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

// V12 — champ conditionnel piloté par la famille de l'intitulé de poste.
const TYPES_ACQUISITION = ['Outbound', 'Inbound', 'Mixte', 'Poste sans acquisition directe'] as const
const NATURES_FONCTION = [
  'Gestion de comptes (rétention, upsell, expansion)',
  'Customer Success (satisfaction, renouvellement)',
  'Avant-vente / Sales Engineering (support technique)',
  'Sales Ops / RevOps (outillage & process)',
  'Channel / Partenariats (animation réseau)',
] as const
const DIMENSIONS_MANAGERIALES = [
  "Construction & recrutement d'équipe",
  'Coaching & montée en compétence',
  'Structuration (process, outils, méthode)',
  'Pilotage de la performance (KPIs, forecast)',
] as const

type FamilleFonction = 'acquisition' | 'gestion' | 'direction' | 'charniere' | 'autre'
function getFamilleFonction(intitule: (typeof ROLES)[number]): FamilleFonction {
  switch (intitule) {
    case 'SDR / BDR':
    case 'Inside Sales':
    case 'Field Sales / Outside Sales':
    case 'Business Developer Full Cycle':
    case 'Account Executive — PME / SMB':
    case 'Account Executive — Mid-Market':
    case 'Account Executive — Enterprise':
      return 'acquisition'
    case 'Sales Engineer / Pre-Sales':
    case 'Account Manager':
    case 'Strategic Account Manager / Key Account Manager':
    case 'Customer Success Manager':
    case 'Sales Ops / RevOps':
    case 'Channel / Partner Manager':
      return 'gestion'
    case 'VP Sales / CRO':
      return 'direction'
    case 'Sales Manager / Team Lead':
    case 'Head of Sales':
      return 'charniere'
    default:
      return 'autre'
  }
}

const MODALITES = [
  'Full remote',
  'Hybride flexible (1-2 jours bureau / sem)',
  'Hybride équilibré (3 jours bureau / sem)',
  'Présentiel (4-5 jours bureau / sem)',
] as const

const form = reactive({
  prenom: '',
  nom: '',
  email: '',
  phoneCc: '+33',
  phoneNumber: '',
  entreprise: '',
  site_web: '',
  secteur: '' as (typeof SECTORS)[number] | '',
  secteurAutre: '',
  localisation: '',
  effectifs: '',
  equipeSales: '',
  intitulePoste: '' as (typeof ROLES)[number] | '',
  intitulePosteAutre: '',
  seniorite: '' as 'Junior 0-2 ans' | 'Confirmé 2-5 ans' | 'Senior 5-8 ans' | 'Lead 8+ ans' | '',
  typeAcquisition: '' as (typeof TYPES_ACQUISITION)[number] | '',
  natureFonction: '' as (typeof NATURES_FONCTION)[number] | '',
  dimensionManageriale: [] as (typeof DIMENSIONS_MANAGERIALES)[number][],
  naturePosteAutre: '',
  modaliteTravail: '' as (typeof MODALITES)[number] | '',
  descriptionMissions: '',
  packageFixe: '',
  packageOte: '',
  rgpd: false,
})

// Famille de poste déduite de l'intitulé → pilote quel champ conditionnel s'affiche.
const famille = computed<FamilleFonction | null>(() =>
  form.intitulePoste ? getFamilleFonction(form.intitulePoste) : null,
)
const acquisitionOptions = computed(() =>
  famille.value === 'charniere'
    ? TYPES_ACQUISITION
    : TYPES_ACQUISITION.filter((a) => a !== 'Poste sans acquisition directe'),
)

const turnstileToken = ref(hasTurnstile.value ? '' : 'dev-stub')
const turnstile = ref<{ reset?: () => void } | null>(null)
function resetTurnstile() {
  turnstile.value?.reset?.()
  turnstileToken.value = hasTurnstile.value ? '' : 'dev-stub'
}

type FieldKey =
  | 'prenom' | 'nom' | 'email' | 'phone'
  | 'entreprise' | 'siteWeb' | 'secteur' | 'secteurAutre' | 'localisation'
  | 'effectifs' | 'equipeSales'
  | 'intitulePoste' | 'intitulePosteAutre' | 'seniorite'
  | 'typeAcquisition' | 'natureFonction' | 'dimensionManageriale' | 'naturePosteAutre' | 'modaliteTravail'
  | 'descriptionMissions'
  | 'packageFixe' | 'packageOte'
  | 'rgpd'

const errors = reactive<Record<FieldKey, string | null>>({
  prenom: null, nom: null, email: null, phone: null,
  entreprise: null, siteWeb: null, secteur: null, secteurAutre: null, localisation: null,
  effectifs: null, equipeSales: null,
  intitulePoste: null, intitulePosteAutre: null, seniorite: null,
  typeAcquisition: null, natureFonction: null, dimensionManageriale: null, naturePosteAutre: null, modaliteTravail: null,
  descriptionMissions: null,
  packageFixe: null, packageOte: null,
  rgpd: null,
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const URL_RE = /^https?:\/\//i

const NBSP = ' '
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
watch(() => form.packageFixe, (v) => {
  const f = formatNumberFr(v)
  if (f !== form.packageFixe) form.packageFixe = f
})
watch(() => form.packageOte, (v) => {
  const f = formatNumberFr(v)
  if (f !== form.packageOte) form.packageOte = f
})

function validateField(key: FieldKey): string | null {
  const t = (s: string) => s.trim()
  switch (key) {
    case 'prenom': return t(form.prenom).length >= 2 ? null : 'Champ obligatoire (min. 2 caractères).'
    case 'nom': return t(form.nom).length >= 2 ? null : 'Champ obligatoire (min. 2 caractères).'
    case 'email': {
      const v = t(form.email)
      if (!v) return 'Champ obligatoire.'
      return EMAIL_RE.test(v) ? null : 'Email invalide.'
    }
    case 'phone': {
      const v = t(form.phoneNumber)
      if (!v) return 'Champ obligatoire.'
      return v.replace(/\D/g, '').length >= 8 ? null : 'Numéro de téléphone invalide.'
    }
    case 'entreprise': return t(form.entreprise).length >= 2 ? null : 'Champ obligatoire.'
    case 'siteWeb': {
      const v = t(form.site_web)
      if (!v) return null
      const candidate = URL_RE.test(v) ? v : `https://${v}`
      try { new URL(candidate); return null } catch { return 'URL invalide.' }
    }
    case 'secteur': return form.secteur ? null : 'Sélectionnez un secteur.'
    case 'secteurAutre':
      if (form.secteur !== 'Autre') return null
      return t(form.secteurAutre).length >= 3 ? null : 'Précisez votre secteur (3 caractères min).'
    case 'localisation': return t(form.localisation).length >= 2 ? null : 'Champ obligatoire.'
    case 'effectifs': return t(form.effectifs).length >= 1 ? null : 'Champ obligatoire.'
    case 'equipeSales': return t(form.equipeSales).length >= 3 ? null : 'Champ obligatoire (min. 3 caractères).'
    case 'intitulePoste': return form.intitulePoste ? null : "Sélectionnez un intitulé de poste."
    case 'intitulePosteAutre':
      if (form.intitulePoste !== 'Autre') return null
      return t(form.intitulePosteAutre).length >= 3 ? null : "Précisez l’intitulé (3 caractères min)."
    case 'seniorite': return form.seniorite ? null : 'Sélectionnez un niveau de séniorité.'
    case 'typeAcquisition': {
      const f = famille.value
      if (f !== 'acquisition' && f !== 'charniere') return null
      if (!form.typeAcquisition) return "Sélectionnez le type d'acquisition."
      if (f === 'acquisition' && form.typeAcquisition === 'Poste sans acquisition directe')
        return 'Choisissez Outbound, Inbound ou Mixte.'
      return null
    }
    case 'natureFonction':
      if (famille.value !== 'gestion') return null
      return form.natureFonction ? null : 'Sélectionnez la nature de la fonction.'
    case 'dimensionManageriale': {
      const f = famille.value
      if (f !== 'direction' && f !== 'charniere') return null
      return form.dimensionManageriale.length >= 1 ? null : 'Sélectionnez 1 à 2 dimensions managériales.'
    }
    case 'naturePosteAutre':
      if (famille.value !== 'autre') return null
      return t(form.naturePosteAutre).length >= 2 ? null : 'Précisez la nature du poste (2 caractères min).'
    case 'modaliteTravail': return form.modaliteTravail ? null : 'Sélectionnez une modalité de travail.'
    case 'descriptionMissions': {
      const v = t(form.descriptionMissions)
      if (v.length < 50) return 'Description trop courte (min. 50 caractères).'
      if (v.length > 1000) return '1000 caractères maximum.'
      return null
    }
    case 'packageFixe': {
      const n = stripNumber(form.packageFixe)
      if (n === null) return 'Champ obligatoire.'
      if (n < 15000 || n > 500000) return 'Le fixe doit être entre 15 000 € et 500 000 €.'
      return null
    }
    case 'packageOte': {
      const n = stripNumber(form.packageOte)
      if (n === null) return 'Champ obligatoire.'
      if (n < 0 || n > 800000) return "L’OTE doit être entre 0 € et 800 000 €."
      const f = stripNumber(form.packageFixe)
      if (f !== null && n < f) return "L’OTE doit être supérieur ou égal au fixe."
      return null
    }
    case 'rgpd': return form.rgpd ? null : 'Vous devez accepter la politique de confidentialité.'
  }
}

function onBlur(key: FieldKey) { errors[key] = validateField(key) }
function clearError(key: FieldKey) { if (errors[key]) errors[key] = null }

watch(() => form.intitulePoste, (v) => {
  if (v !== 'Autre') { form.intitulePosteAutre = ''; errors.intitulePosteAutre = null }
  // La famille change → on réinitialise le champ conditionnel du poste.
  form.typeAcquisition = ''
  form.natureFonction = ''
  form.dimensionManageriale = []
  form.naturePosteAutre = ''
  errors.typeAcquisition = null
  errors.natureFonction = null
  errors.dimensionManageriale = null
  errors.naturePosteAutre = null
})
watch(() => form.secteur, (v) => {
  if (v !== 'Autre') { form.secteurAutre = ''; errors.secteurAutre = null }
})

const missionsLen = computed(() => form.descriptionMissions.length)
const counterClass = computed(() => {
  const n = missionsLen.value
  if (n >= 1000) return 'counter--alert'
  if (n >= 800) return 'counter--warn'
  return ''
})

const comboOpen = ref(false)
const comboSearch = ref('')
const filteredRoles = computed(() => {
  const f = comboSearch.value.trim().toLowerCase()
  if (!f) return ROLES.map((label, i) => ({ label, num: i + 1 }))
  return ROLES.map((label, i) => ({ label, num: i + 1 })).filter(({ label }) => label.toLowerCase().includes(f))
})
function selectRole(label: (typeof ROLES)[number]) {
  form.intitulePoste = label
  comboOpen.value = false
  comboSearch.value = ''
  errors.intitulePoste = null
}
function onClickOutsideCombo(e: MouseEvent) {
  const el = document.getElementById('jobtitle-combo-3')
  if (el && !el.contains(e.target as Node)) comboOpen.value = false
}
onMounted(() => document.addEventListener('click', onClickOutsideCombo))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutsideCombo))

const isFormReady = computed(() => {
  if (!form.prenom.trim() || !form.nom.trim()) return false
  if (!EMAIL_RE.test(form.email)) return false
  if (form.phoneNumber.replace(/\D/g, '').length < 8) return false
  if (!form.entreprise.trim()) return false
  if (!form.secteur || (form.secteur === 'Autre' && !form.secteurAutre.trim())) return false
  if (!form.localisation.trim() || !form.effectifs.trim() || !form.equipeSales.trim()) return false
  if (!form.intitulePoste || (form.intitulePoste === 'Autre' && !form.intitulePosteAutre.trim())) return false
  if (!form.seniorite) return false
  const fam = famille.value
  if (
    (fam === 'acquisition' || fam === 'charniere') &&
    (!form.typeAcquisition || (fam === 'acquisition' && form.typeAcquisition === 'Poste sans acquisition directe'))
  ) return false
  if (fam === 'gestion' && !form.natureFonction) return false
  if ((fam === 'direction' || fam === 'charniere') && form.dimensionManageriale.length < 1) return false
  if (fam === 'autre' && form.naturePosteAutre.trim().length < 2) return false
  if (!form.modaliteTravail) return false
  const ml = form.descriptionMissions.trim().length
  if (ml < 50 || ml > 1000) return false
  const f = stripNumber(form.packageFixe)
  const o = stripNumber(form.packageOte)
  if (f === null || f < 15000 || f > 500000) return false
  if (o === null || o > 500000) return false
  if (!form.rgpd) return false
  if (!turnstileToken.value) return false
  return true
})

const { isLoading, submit } = useEvaluationAttractivite()
interface AlertConfig { title: string; text: string }
const globalAlert = ref<AlertConfig | null>(null)
const ALERT_BY_CODE: Record<string, AlertConfig> = {
  TURNSTILE_FAILED: {
    title: 'Vérification de sécurité échouée.',
    text: 'Merci de rafraîchir la page et réessayer.',
  },
  INTERNAL_ERROR: {
    title: "Une erreur technique s’est produite.",
    text: "Votre demande n’a pas pu être enregistrée. Merci de réessayer dans quelques minutes, ou de nous contacter directement à <a href=\"mailto:bonjour@mariell.fr\">bonjour@mariell.fr</a>.",
  },
}

async function onSubmit() {
  ;(Object.keys(errors) as FieldKey[]).forEach((k) => { errors[k] = validateField(k) })
  if (Object.values(errors).some((e) => e)) {
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
    site_web: form.site_web.trim() || undefined,
    secteur: form.secteur as (typeof SECTORS)[number],
    secteur_precision_autre: form.secteur === 'Autre' ? form.secteurAutre.trim() : undefined,
    localisation: form.localisation.trim(),
    effectifs_entreprise: form.effectifs.trim(),
    equipe_sales: form.equipeSales.trim(),
    intitule_poste: form.intitulePoste as (typeof ROLES)[number],
    intitule_poste_precision_autre:
      form.intitulePoste === 'Autre' ? form.intitulePosteAutre.trim() : undefined,
    seniorite: form.seniorite as 'Junior 0-2 ans' | 'Confirmé 2-5 ans' | 'Senior 5-8 ans' | 'Lead 8+ ans',
    type_acquisition: (form.typeAcquisition || null) as (typeof TYPES_ACQUISITION)[number] | null,
    nature_fonction: (form.natureFonction || null) as (typeof NATURES_FONCTION)[number] | null,
    dimension_manageriale: form.dimensionManageriale.length ? [...form.dimensionManageriale] : null,
    nature_poste_autre: form.naturePosteAutre.trim() || null,
    modalite_travail: form.modaliteTravail as (typeof MODALITES)[number],
    description_missions: form.descriptionMissions.trim(),
    package_fixe: stripNumber(form.packageFixe)!,
    package_ote: stripNumber(form.packageOte)!,
    consentement_rgpd: true as const,
    turnstile_token: turnstileToken.value,
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

  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(`eval-attr-pending:${uuid}`, JSON.stringify({
      submittedAt: Date.now(),
      email: form.email.trim(),
      prenom: form.prenom.trim(),
    }))
  }
  await navigateTo(`/lab/evaluation-attractivite/resultat/${uuid}`)
}
</script>

<template>
  <div class="tool-body">
    <nav class="site-nav">
      <div class="site-nav__inner">
        <NuxtLink to="/" class="site-nav__brand" aria-label="Mariell, accueil">
          <ChromaticWordmark text="Mariell" :size="22" glitch />
        </NuxtLink>
        <NuxtLink to="/lab" class="nav-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Retour au Lab
        </NuxtLink>
      </div>
    </nav>
    <div class="tool-shell">
        <Transition name="alert-fade">
          <div v-if="globalAlert" class="galert" role="alert">
            <span class="galert__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <div class="galert__body">
              <p class="galert__title">{{ globalAlert.title }}</p>
              <p class="galert__text" v-html="globalAlert.text" />
            </div>
          </div>
        </Transition>

        <header style="text-align: center;">
          <div class="tool-eyebrow">Outil · Le&nbsp;Lab&nbsp;Mariell</div>
          <h1 class="tool-title" style="margin-left: auto; margin-right: auto;">
            Évaluation <em>d’attractivité.</em>
          </h1>
          <p class="tool-subtitle" style="margin-left: auto; margin-right: auto;">
            Votre offre Sales, confrontée au marché 2026. Diagnostic chiffré, comparatif, et leviers concrets à activer.
          </p>
          <div style="margin-top: 22px; display: inline-flex; align-items: center; gap: 9px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fg-on-ink-3); border: 1px solid var(--border-on-ink); border-radius: 999px; padding: 7px 16px;">
            <span style="width: 7px; height: 7px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 8px var(--cyan);" aria-hidden="true" />
            Gratuit · Sans inscription · &lt;&nbsp;60 secondes
          </div>
        </header>

        <form id="eval-form-3" novalidate @submit.prevent="onSubmit">

          <!-- 01 Identité -->
          <section class="tblock">
            <div class="tblock-head">
              <span class="tblock-num">01</span>
              <h2 class="tblock-title">Identité</h2>
              <span class="tblock-rule" aria-hidden="true" />
            </div>
            <div class="tfields--2">
              <div class="tfield" :class="{ 'is-error': errors.prenom }">
                <label class="tlabel" for="ea-prenom">Prénom <span class="treq">*</span></label>
                <input id="ea-prenom" v-model="form.prenom" class="tinput" type="text" autocomplete="given-name"
                       placeholder="Marie" @blur="onBlur('prenom')" @input="clearError('prenom')" />
                <p class="terror">{{ errors.prenom || 'Ce champ est requis.' }}</p>
              </div>
              <div class="tfield" :class="{ 'is-error': errors.nom }">
                <label class="tlabel" for="ea-nom">Nom <span class="treq">*</span></label>
                <input id="ea-nom" v-model="form.nom" class="tinput" type="text" autocomplete="family-name"
                       placeholder="Dupont" @blur="onBlur('nom')" @input="clearError('nom')" />
                <p class="terror">{{ errors.nom || 'Ce champ est requis.' }}</p>
              </div>
              <div class="tfield" :class="{ 'is-error': errors.email }">
                <label class="tlabel" for="ea-email">Adresse mail <span class="treq">*</span></label>
                <input id="ea-email" v-model="form.email" class="tinput" type="email" inputmode="email" autocomplete="email"
                       placeholder="marie.dupont@entreprise.com" @blur="onBlur('email')" @input="clearError('email')" />
                <p class="terror">{{ errors.email || 'Format d\'email invalide.' }}</p>
              </div>
              <div class="tfield" :class="{ 'is-error': errors.phone }">
                <label class="tlabel" for="ea-phone">Numéro de téléphone <span class="treq">*</span></label>
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
                  <input id="ea-phone" v-model="form.phoneNumber" class="tinput" type="tel"
                         inputmode="tel" autocomplete="tel-national" placeholder="06 12 34 56 78"
                         @blur="onBlur('phone')" @input="clearError('phone')" />
                </div>
                <p class="terror">{{ errors.phone || 'Numéro invalide.' }}</p>
              </div>
            </div>
          </section>

          <!-- 02 Contexte entreprise -->
          <section class="tblock">
            <div class="tblock-head">
              <span class="tblock-num">02</span>
              <h2 class="tblock-title">Contexte entreprise</h2>
              <span class="tblock-rule" aria-hidden="true" />
            </div>
            <div class="tfields--2">
              <div class="tfield" :class="{ 'is-error': errors.entreprise }">
                <label class="tlabel" for="ea-entreprise">Entreprise <span class="treq">*</span></label>
                <input id="ea-entreprise" v-model="form.entreprise" class="tinput" type="text"
                       autocomplete="organization" placeholder="Nom de votre entreprise"
                       @blur="onBlur('entreprise')" @input="clearError('entreprise')" />
                <p class="terror">{{ errors.entreprise || 'Ce champ est requis.' }}</p>
              </div>
              <div class="tfield" :class="{ 'is-error': errors.siteWeb }">
                <label class="tlabel" for="ea-website">Site web</label>
                <input id="ea-website" v-model="form.site_web" class="tinput" type="url" inputmode="url"
                       placeholder="https://votre-entreprise.com"
                       @blur="onBlur('siteWeb')" @input="clearError('siteWeb')" />
                <p class="terror">{{ errors.siteWeb || 'URL invalide.' }}</p>
              </div>
              <div class="tfield" :class="{ 'is-error': errors.secteur }">
                <label class="tlabel" for="ea-secteur">Secteur de votre entreprise <span class="treq">*</span></label>
                <div class="tselect-wrap">
                  <select id="ea-secteur" v-model="form.secteur" class="tselect"
                          :class="{ 'is-empty': !form.secteur }"
                          @change="clearError('secteur')">
                    <option value="" disabled hidden>Sélectionnez un secteur</option>
                    <option v-for="s in SECTORS" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>
                <div v-if="form.secteur === 'Autre'" class="tprecision">
                  <input v-model="form.secteurAutre" class="tinput" type="text" maxlength="60"
                         placeholder="Précisez votre secteur (60 caractères max)"
                         :class="{ 'is-error': errors.secteurAutre }"
                         @blur="onBlur('secteurAutre')" @input="clearError('secteurAutre')" />
                  <p v-if="errors.secteurAutre" class="terror">{{ errors.secteurAutre }}</p>
                </div>
                <p class="terror">{{ errors.secteur || 'Sélectionnez un secteur.' }}</p>
              </div>
              <div class="tfield" :class="{ 'is-error': errors.localisation }">
                <label class="tlabel" for="ea-localisation">Localisation <span class="treq">*</span></label>
                <input id="ea-localisation" v-model="form.localisation" class="tinput" type="text"
                       maxlength="100" placeholder="Paris, France"
                       @blur="onBlur('localisation')" @input="clearError('localisation')" />
                <p class="terror">{{ errors.localisation || 'Ce champ est requis.' }}</p>
              </div>
              <div class="tfield" :class="{ 'is-error': errors.effectifs }">
                <label class="tlabel" for="ea-effectifs">Effectifs entreprise <span class="treq">*</span></label>
                <input id="ea-effectifs" v-model="form.effectifs" class="tinput" type="text"
                       maxlength="50" placeholder="ex. 800 personnes, 25 personnes"
                       @blur="onBlur('effectifs')" @input="clearError('effectifs')" />
                <p class="terror">{{ errors.effectifs || 'Ce champ est requis.' }}</p>
              </div>
              <div class="tfield" :class="{ 'is-error': errors.equipeSales }">
                <label class="tlabel" for="ea-equipe">Composition équipe Sales <span class="treq">*</span></label>
                <input id="ea-equipe" v-model="form.equipeSales" class="tinput" type="text"
                       maxlength="300" placeholder="ex. 15 pers (4 SDR, 8 AE, 2 Team Lead, 1 Head of Sales)"
                       @blur="onBlur('equipeSales')" @input="clearError('equipeSales')" />
                <p class="terror">{{ errors.equipeSales || 'Ce champ est requis.' }}</p>
              </div>
            </div>
          </section>

          <!-- 03 Le poste à évaluer -->
          <section class="tblock">
            <div class="tblock-head">
              <span class="tblock-num">03</span>
              <h2 class="tblock-title">Le poste à évaluer</h2>
              <span class="tblock-rule" aria-hidden="true" />
            </div>
            <div class="tfields">
              <!-- Intitulé de poste — combobox -->
              <div class="tfield" :class="{ 'is-error': errors.intitulePoste }">
                <span class="tlabel">Intitulé de poste <span class="treq">*</span></span>
                <div id="ea-jt-combo" class="ea-combo">
                  <button type="button" class="ea-combo-trigger tinput"
                          :class="{ 'has-value': !!form.intitulePoste, 'is-open': comboOpen }"
                          :aria-expanded="comboOpen" @click="comboOpen = !comboOpen">
                    <span class="ea-combo-value">{{ form.intitulePoste || 'Sélectionnez un intitulé…' }}</span>
                    <span class="ea-combo-chevron" aria-hidden="true" />
                  </button>
                  <div v-if="comboOpen" class="ea-combo-panel" role="listbox">
                    <input v-model="comboSearch" type="text" class="ea-combo-search"
                           placeholder="Rechercher…" autocomplete="off" @click.stop />
                    <div class="ea-combo-list">
                      <button v-for="role in filteredRoles" :key="role.label"
                              type="button" class="ea-combo-opt"
                              :class="{ 'is-selected': form.intitulePoste === role.label }"
                              role="option" :aria-selected="form.intitulePoste === role.label"
                              @click="selectRole(role.label)">
                        {{ role.label }}
                      </button>
                      <div v-if="filteredRoles.length === 0" class="ea-combo-empty">Aucun résultat</div>
                    </div>
                  </div>
                </div>
                <div v-if="form.intitulePoste === 'Autre'" class="tprecision">
                  <input v-model="form.intitulePosteAutre" class="tinput" type="text" maxlength="60"
                         placeholder="Précisez l’intitulé du poste (60 caractères max)"
                         :class="{ 'is-error': errors.intitulePosteAutre }"
                         @blur="onBlur('intitulePosteAutre')" @input="clearError('intitulePosteAutre')" />
                  <p v-if="errors.intitulePosteAutre" class="terror">{{ errors.intitulePosteAutre }}</p>
                </div>
                <p class="terror">{{ errors.intitulePoste || 'Sélectionnez un intitulé de poste.' }}</p>
              </div>

              <!-- Séniorité -->
              <div class="tfield" :class="{ 'is-error': errors.seniorite }">
                <span class="tlabel">Séniorité visée <span class="treq">*</span></span>
                <div class="ttiles ttiles--4" role="radiogroup">
                  <label v-for="opt in [
                    { v: 'Junior 0-2 ans', title: 'Junior', sub: '0-2 ans' },
                    { v: 'Confirmé 2-5 ans', title: 'Confirmé', sub: '2-5 ans' },
                    { v: 'Senior 5-8 ans', title: 'Senior', sub: '5-8 ans' },
                    { v: 'Lead 8+ ans', title: 'Lead', sub: '8+ ans' },
                  ]" :key="opt.v" class="ttile">
                    <input v-model="form.seniorite" type="radio" name="ea-seniorite" :value="opt.v"
                           @change="clearError('seniorite')" />
                    <span class="ttile-title">{{ opt.title }}</span>
                    <span class="ttile-sub">{{ opt.sub }}</span>
                  </label>
                </div>
                <p class="terror">{{ errors.seniorite || 'Sélectionnez une séniorité.' }}</p>
              </div>

              <!-- Champ conditionnel selon la famille de poste (V12) -->
              <div v-if="famille === 'acquisition' || famille === 'charniere'"
                   class="tfield" :class="{ 'is-error': errors.typeAcquisition }">
                <label class="tlabel" for="ea-acq">
                  {{ famille === 'charniere' ? 'Acquisition directe attendue' : 'Type d’acquisition' }}
                  <span class="treq">*</span>
                </label>
                <div class="tselect-wrap">
                  <select id="ea-acq" v-model="form.typeAcquisition" class="tselect"
                          :class="{ 'is-empty': !form.typeAcquisition }"
                          @change="clearError('typeAcquisition')">
                    <option value="" disabled hidden>Sélectionnez…</option>
                    <option v-for="a in acquisitionOptions" :key="a" :value="a">{{ a }}</option>
                  </select>
                </div>
                <p class="terror">{{ errors.typeAcquisition || 'Champ obligatoire.' }}</p>
              </div>

              <div v-else-if="famille === 'gestion'"
                   class="tfield" :class="{ 'is-error': errors.natureFonction }">
                <label class="tlabel" for="ea-nature">Nature de la fonction <span class="treq">*</span></label>
                <div class="tselect-wrap">
                  <select id="ea-nature" v-model="form.natureFonction" class="tselect"
                          :class="{ 'is-empty': !form.natureFonction }"
                          @change="clearError('natureFonction')">
                    <option value="" disabled hidden>Sélectionnez…</option>
                    <option v-for="n in NATURES_FONCTION" :key="n" :value="n">{{ n }}</option>
                  </select>
                </div>
                <p class="terror">{{ errors.natureFonction || 'Champ obligatoire.' }}</p>
              </div>

              <div v-else-if="famille === 'autre'"
                   class="tfield" :class="{ 'is-error': errors.naturePosteAutre }">
                <label class="tlabel" for="ea-natp">Nature du poste <span class="treq">*</span></label>
                <input id="ea-natp" v-model="form.naturePosteAutre" class="tinput" type="text" maxlength="80"
                       placeholder="Décrivez la nature du poste (80 caractères max)"
                       :class="{ 'is-error': errors.naturePosteAutre }"
                       @blur="onBlur('naturePosteAutre')" @input="clearError('naturePosteAutre')" />
                <p class="terror">{{ errors.naturePosteAutre || 'Champ obligatoire.' }}</p>
              </div>

              <!-- Dimensions managériales (direction + charnière) -->
              <div v-if="famille === 'direction' || famille === 'charniere'"
                   class="tfield" :class="{ 'is-error': errors.dimensionManageriale }">
                <span class="tlabel">
                  Dimension(s) managériale(s) <span class="treq">*</span>
                  <span class="tlabel-hint">— 1 à 2</span>
                </span>
                <div class="ttiles ttiles--2" role="group">
                  <label v-for="d in DIMENSIONS_MANAGERIALES" :key="d" class="ttile ttile--check"
                         :class="{ 'is-disabled': form.dimensionManageriale.length >= 2 && !form.dimensionManageriale.includes(d) }">
                    <input v-model="form.dimensionManageriale" type="checkbox" :value="d"
                           :disabled="form.dimensionManageriale.length >= 2 && !form.dimensionManageriale.includes(d)"
                           @change="clearError('dimensionManageriale')" />
                    <span class="ttile-title">{{ d }}</span>
                  </label>
                </div>
                <p class="terror">{{ errors.dimensionManageriale || 'Sélectionnez 1 à 2 dimensions.' }}</p>
              </div>

              <!-- Modalité de travail -->
              <div class="tfield" :class="{ 'is-error': errors.modaliteTravail }">
                <span class="tlabel">Modalité de travail <span class="treq">*</span></span>
                <div class="ttiles ttiles--4" role="radiogroup">
                  <label class="ttile">
                    <input v-model="form.modaliteTravail" type="radio" name="ea-modalite"
                           value="Full remote" @change="clearError('modaliteTravail')" />
                    <span class="ttile-title">Full remote</span>
                    <span class="ttile-sub">&nbsp;</span>
                  </label>
                  <label class="ttile">
                    <input v-model="form.modaliteTravail" type="radio" name="ea-modalite"
                           value="Hybride flexible (1-2 jours bureau / sem)" @change="clearError('modaliteTravail')" />
                    <span class="ttile-title">Hybride flexible</span>
                    <span class="ttile-sub">1-2 j bureau/sem</span>
                  </label>
                  <label class="ttile">
                    <input v-model="form.modaliteTravail" type="radio" name="ea-modalite"
                           value="Hybride équilibré (3 jours bureau / sem)" @change="clearError('modaliteTravail')" />
                    <span class="ttile-title">Hybride équilibré</span>
                    <span class="ttile-sub">3 j bureau/sem</span>
                  </label>
                  <label class="ttile">
                    <input v-model="form.modaliteTravail" type="radio" name="ea-modalite"
                           value="Présentiel (4-5 jours bureau / sem)" @change="clearError('modaliteTravail')" />
                    <span class="ttile-title">Présentiel</span>
                    <span class="ttile-sub">4-5 j bureau/sem</span>
                  </label>
                </div>
                <p class="terror">{{ errors.modaliteTravail || 'Sélectionnez une modalité de travail.' }}</p>
              </div>
            </div>
          </section>

          <!-- 04 Description des missions -->
          <section class="tblock">
            <div class="tblock-head">
              <span class="tblock-num">04</span>
              <h2 class="tblock-title">Description des missions</h2>
              <span class="tblock-rule" aria-hidden="true" />
            </div>
            <div class="tfield" :class="{ 'is-error': errors.descriptionMissions }">
              <label class="tlabel" for="ea-missions">Description des missions <span class="treq">*</span></label>
              <div class="ttextarea-wrap">
                <textarea id="ea-missions" v-model="form.descriptionMissions" class="ttextarea"
                          maxlength="1000" rows="9"
                          placeholder="Décrivez en quelques lignes ce que ce Sales fera concrètement : type de cycle, taille de comptes, périmètre géographique, ratios chasse/farming, contexte équipe, stack outils, trajectoire d’évolution… Vous pouvez aussi coller un extrait de votre fiche de poste."
                          @blur="onBlur('descriptionMissions')" @input="clearError('descriptionMissions')" />
                <span class="ttextarea-counter" :class="counterClass">{{ missionsLen }}&nbsp;/ 1000</span>
              </div>
              <div class="ta-foot">
                <p class="thelper">Plus la description est précise, plus l’évaluation sera fine. Mentionnez les éléments structurants : ratio inbound/outbound, taille des comptes, stack outils, trajectoire d’évolution.</p>
              </div>
              <p class="terror">{{ errors.descriptionMissions || 'Champ obligatoire.' }}</p>
            </div>
          </section>

          <!-- 05 Package proposé -->
          <section class="tblock">
            <div class="tblock-head">
              <span class="tblock-num">05</span>
              <h2 class="tblock-title">Package proposé</h2>
              <span class="tblock-rule" aria-hidden="true" />
            </div>
            <div class="tfields--2">
              <div class="tfield" :class="{ 'is-error': errors.packageFixe }">
                <label class="tlabel" for="ea-fixe">Fixe annuel brut (€) <span class="treq">*</span></label>
                <div class="num-wrap">
                  <input id="ea-fixe" v-model="form.packageFixe" class="tinput" type="text" inputmode="numeric"
                         placeholder="55000"
                         @blur="onBlur('packageFixe')" @input="clearError('packageFixe')" />
                  <span class="num-suffix" aria-hidden="true">€</span>
                </div>
                <p class="terror">{{ errors.packageFixe || 'Montant invalide.' }}</p>
              </div>
              <div class="tfield" :class="{ 'is-error': errors.packageOte }">
                <label class="tlabel" for="ea-ote">OTE total cible (€) <span class="treq">*</span></label>
                <div class="num-wrap">
                  <input id="ea-ote" v-model="form.packageOte" class="tinput" type="text" inputmode="numeric"
                         placeholder="100000"
                         @blur="onBlur('packageOte')" @input="clearError('packageOte')" />
                  <span class="num-suffix" aria-hidden="true">€</span>
                </div>
                <p class="terror">{{ errors.packageOte || 'Montant invalide.' }}</p>
              </div>
            </div>
            <p class="thelper" style="margin-top: 14px;">OTE = Fixe + Variable cible à 100%&nbsp;d’atteinte des objectifs.</p>
          </section>

          <!-- RGPD -->
          <section class="tblock" style="margin-bottom: 8px;">
            <label class="tcheck" :class="{ 'is-error': errors.rgpd }">
              <input v-model="form.rgpd" type="checkbox" @change="clearError('rgpd')" />
              <span class="tcheck-box" aria-hidden="true" />
              <span class="tcheck-text">
                J’accepte la
                <NuxtLink to="/politique-confidentialite" target="_blank" rel="noopener">politique de confidentialité</NuxtLink>
                et le traitement de mes données personnelles par Mariell.
              </span>
            </label>
            <p v-if="errors.rgpd" class="terror" style="display: block; margin-top: 8px;">{{ errors.rgpd }}</p>
          </section>

          <div v-if="hasTurnstile" class="cf-mount">
            <NuxtTurnstile ref="turnstile" v-model="turnstileToken" />
          </div>

          <div class="tsubmit-area" :class="{ 'is-ready': isFormReady }">
            <button type="submit" class="tsubmit" :class="{ 'is-loading': isLoading, 'is-disabled': !isFormReady }"
                    :disabled="!isFormReady || isLoading">
              <span class="tspinner" aria-hidden="true" />
              <span class="tsubmit-idle">Évaluer mon offre</span>
              <span class="tsubmit-loading" aria-live="polite">Évaluation en cours…</span>
              <svg class="tsubmit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <p class="submit-hint">Renseignez tous les champs obligatoires pour activer l’évaluation.</p>
          </div>

          <div class="tfoot" style="align-items: center; text-align: center;">
            <span class="tcf">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="width: 13px; height: 13px; display: inline-block; vertical-align: middle; margin-right: 5px;">
                <path d="M12 3l8 4v6c0 4.5-3.4 7.5-8 8-4.6-.5-8-3.5-8-8V7l8-4z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Protégé par Cloudflare Turnstile
            </span>
            <span class="tfoot-2">Recruter n’est pas un pari.</span>
          </div>
        </form>
      </div>
  </div>
</template>

<style scoped>
.cf-mount { display: none; }

/* Combobox spécifique outil 3 (préfixe ea- pour éviter collision) */
.ea-combo { position: relative; }
.ea-combo-trigger {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  cursor: pointer; text-align: left; border-radius: 10px;
}
.ea-combo-trigger .ea-combo-value { color: var(--fg-on-ink-4); flex: 1; }
.ea-combo-trigger.has-value .ea-combo-value { color: var(--fg-on-ink-1); }
.ea-combo-chevron {
  flex-shrink: 0; width: 8px; height: 8px;
  border-right: 1.5px solid var(--fg-on-ink-4);
  border-bottom: 1.5px solid var(--fg-on-ink-4);
  transform: rotate(45deg); margin-top: -3px;
  transition: transform 0.2s;
}
.ea-combo-trigger.is-open .ea-combo-chevron {
  transform: rotate(-135deg); margin-top: 2px;
  border-color: var(--cyan);
}
.ea-combo-panel {
  position: absolute; top: calc(100% + 8px); left: 0; right: 0;
  z-index: 40;
  background: var(--ink-800);
  border: 1px solid var(--border-on-ink);
  border-radius: 10px; overflow: hidden;
  box-shadow: 0 24px 60px -20px rgba(0,0,0,0.8);
}
.ea-combo-search {
  width: 100%; box-sizing: border-box;
  background: var(--ink-700); border: none;
  border-bottom: 1px solid var(--border-on-ink);
  color: var(--fg-on-ink-1); font: inherit; font-size: 14px;
  padding: 11px 14px;
}
.ea-combo-search:focus { outline: none; }
.ea-combo-list { max-height: 240px; overflow-y: auto; }
.ea-combo-opt {
  display: block; width: 100%; background: transparent; border: none;
  text-align: left; padding: 11px 14px;
  font: inherit; font-size: 14px;
  color: var(--fg-on-ink-2); cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.ea-combo-opt:hover { background: rgba(127,231,225,0.10); color: var(--fg-on-ink-1); }
.ea-combo-opt.is-selected { color: var(--cyan); }
.ea-combo-empty { padding: 14px; color: var(--fg-on-ink-3); font-size: 13px; text-align: center; }

/* Precision (reveal sous "Autre") */
.tprecision { margin-top: 12px; animation: tprec-in 0.22s; }
@keyframes tprec-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

/* Compteur textarea */
.ttextarea-counter.is-warn { color: var(--warn, #c98a2a); }
.ttextarea-counter.is-danger { color: var(--danger, #e05252); }

/* Num suffix */
.num-wrap { position: relative; }
.num-suffix {
  position: absolute; right: 15px; top: 50%;
  transform: translateY(-50%);
  color: var(--fg-on-ink-3); font-size: 15px; pointer-events: none;
}
.num-wrap .tinput { padding-right: 34px; }

/* Alert globale */
.galert {
  display: flex; gap: 14px; padding: 18px 20px;
  border: 1px solid rgba(232,94,255,0.35);
  border-radius: 14px;
  background: rgba(232,94,255,0.05);
  margin-bottom: 28px;
}
.galert__icon {
  flex-shrink: 0; width: 20px; height: 20px; margin-top: 2px;
  color: #e85eff;
}
.galert__icon svg { width: 100%; height: 100%; }
.galert__body { display: flex; flex-direction: column; gap: 4px; }
.galert__title { font-family: var(--font-display, var(--font-grotesk)); font-weight: 600; font-size: 15px; color: var(--fg-on-ink-1); margin: 0; }
.galert__text { font-size: 14px; color: var(--fg-on-ink-2); line-height: 1.55; margin: 0; }
.galert__text :deep(a) { color: var(--cyan); }
.alert-fade-enter-active, .alert-fade-leave-active { transition: opacity 0.22s, transform 0.22s; }
.alert-fade-enter-from, .alert-fade-leave-to { opacity: 0; transform: translateY(-5px); }

@media (prefers-reduced-motion: reduce) {
  .ea-combo-chevron, .ea-combo-opt, .tprecision { transition: none; animation: none; }
}

/* ---- Mobile / responsive ---- */
@media (max-width: 900px) {
  /* Séniorité + modalité tiles: 2-up on tablet */
  .ttiles--4 { grid-template-columns: repeat(2, 1fr); }

  /* Combobox panel stays full-width (already position: absolute, left/right 0) */
}

@media (max-width: 560px) {
  /* Phone row: stack country code + number */
  :deep(.tphone) { flex-direction: column; align-items: stretch; }
  :deep(.tphone .tselect-wrap) { width: 100%; }
  :deep(.tphone .tinput) { width: 100%; }

  /* Tiles: 2-up */
  .ttiles--4 { grid-template-columns: repeat(2, 1fr); }

  /* Combobox options: min tap target */
  .ea-combo-opt { min-height: 44px; display: flex; align-items: center; }
  .ea-combo-search { min-height: 44px; }

  /* Combobox panel: full-width and within viewport */
  .ea-combo-panel { position: static; margin-top: 4px; }

  /* Submit CTA full-width */
  .tsubmit { width: 100%; justify-content: center; }
  .tsubmit-area { align-items: stretch; }

  /* Alert */
  .galert { flex-direction: row; gap: 10px; padding: 14px 16px; }
}
</style>
