<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import type { LlmOutputJson } from '~~/server/schemas/outil-3/llm-output-json'

definePageMeta({ layout: false })

const route = useRoute()
const uuid = computed(() => String(route.params.uuid || ''))

interface EvalMetadata {
  prenom: string
  nom: string
  entreprise: string
  intitule_poste: string
  createdAt: string
}

type ViewState = 'loading' | 'result' | 'error' | 'deferred'
const state = ref<ViewState>('loading')

const evalJson = ref<LlmOutputJson | null>(null)
const evalMarkdown = ref<string>('')
const evalMetadata = ref<EvalMetadata | null>(null)
const errorMessage = ref<string>('')
const deferredEmail = ref<string>('')

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })
const renderedHtml = computed(() => (evalMarkdown.value ? md.render(evalMarkdown.value) : ''))

useHead(() => ({
  title:
    state.value === 'result' && evalMetadata.value
      ? `Évaluation — ${evalMetadata.value.intitule_poste} · Mariell`
      : "Évaluation d'attractivité — Mariell · Le Lab",
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
}))

async function fetchEvaluation() {
  try {
    const data = await $fetch<{
      uuid: string
      json: LlmOutputJson | null
      markdown: string
      degraded: boolean
      metadata: EvalMetadata
    }>(`/api/lab/evaluation-attractivite/${uuid.value}`)
    evalJson.value = data.json
    evalMarkdown.value = data.markdown
    evalMetadata.value = data.metadata
    state.value = 'result'
  } catch (err: any) {
    if (err?.statusCode === 404) {
      errorMessage.value = 'Évaluation introuvable ou expirée (durée de vie : 90 jours).'
    } else {
      errorMessage.value = err?.data?.message || err?.message || 'Une erreur est survenue.'
    }
    state.value = 'error'
  }
}

// ---------- Polling status (mode "submission en cours") ----------

type PollStatus =
  | { status: 'pending'; updatedAt: string }
  | { status: 'done'; updatedAt: string }
  | { status: 'deferred'; updatedAt: string; deferredId: string }
  | { status: 'error'; updatedAt: string; errorCode: string; errorMessage: string }

const POLL_INTERVAL_MS = 3000
const POLL_MAX_ATTEMPTS = 35 // 35 * 3s = 105s max (l'éval peut prendre 60-80s)
const POLL_404_GRACE = 6
let pollAborted = false

async function pollStatus(): Promise<void> {
  let attempts = 0
  let notFoundStreak = 0

  while (attempts < POLL_MAX_ATTEMPTS && !pollAborted) {
    attempts++
    try {
      const result = await $fetch<PollStatus>(`/api/lab/evaluation-attractivite/status/${uuid.value}`)
      notFoundStreak = 0

      if (result.status === 'done') {
        await fetchEvaluation()
        cleanupPending()
        return
      }
      if (result.status === 'deferred') {
        state.value = 'deferred'
        cleanupPending()
        return
      }
      if (result.status === 'error') {
        errorMessage.value = result.errorMessage || 'Une erreur est survenue.'
        state.value = 'error'
        cleanupPending()
        return
      }
      // pending → on continue
    } catch (err: any) {
      if (err?.statusCode === 404) {
        notFoundStreak++
        if (notFoundStreak > POLL_404_GRACE) {
          errorMessage.value = 'Demande introuvable. Merci de réessayer.'
          state.value = 'error'
          cleanupPending()
          return
        }
      } else {
        console.warn('[evaluation-attractivite] status poll failed', err)
      }
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }

  if (!pollAborted) {
    errorMessage.value =
      "L'évaluation prend plus de temps que prévu. Merci de réessayer ou de nous contacter à bonjour@mariell.fr."
    state.value = 'error'
    cleanupPending()
  }
}

function cleanupPending() {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(`eval-attr-pending:${uuid.value}`)
  }
}

onMounted(async () => {
  // 1. Mode différé legacy (uuid === 'deferred') — gardé pour compat.
  if (uuid.value === 'deferred' && typeof sessionStorage !== 'undefined') {
    const raw = sessionStorage.getItem('eval-attr-deferred')
    if (raw) {
      try {
        const data = JSON.parse(raw) as { email: string }
        deferredEmail.value = data.email || ''
      } catch {}
    }
    state.value = 'deferred'
    return
  }

  // 2. Submission en cours : flag posé par le formulaire.
  if (typeof sessionStorage !== 'undefined') {
    const pendingRaw = sessionStorage.getItem(`eval-attr-pending:${uuid.value}`)
    if (pendingRaw) {
      try {
        const pending = JSON.parse(pendingRaw) as { email?: string; prenom?: string }
        deferredEmail.value = pending.email || ''
      } catch {}
      startLoadingAnimation()
      await pollStatus()
      stopLoadingAnimation()
      return
    }
  }

  // 3. Arrivée directe via lien email.
  startLoadingAnimation()
  await fetchEvaluation()
  stopLoadingAnimation()
})

// Loading animation : steps stretched on ~90s, progress courbe asymptotique
// pour ne jamais bloquer à 99% si le LLM prend plus longtemps que prévu.
const loaderPct = ref(0)
const activeStepIdx = ref(0)
const STEPS = [
  { at: 0,  end: 12 },
  { at: 12, end: 28 },
  { at: 28, end: 48 },
  { at: 48, end: 70 },
  { at: 70, end: 95 },
  { at: 95, end: Infinity },
]
const STEP_LABELS = [
  'Analyse de votre contexte...',
  'Lecture de la marque et du secteur...',
  'Évaluation de la mission...',
  'Comparaison du package au marché...',
  'Synthèse et recommandations...',
  'Finalisation de votre évaluation...',
]
// pct = 100 * (1 - exp(-t/TAU)). TAU=50 → ~70% à 60s (1min), ~84% à 90s, ~91% à 120s,
// ~95% à 150s, ~99% seulement à ~4 minutes. Le user voit toujours du mouvement.
const PROGRESS_TAU = 50
let loadStart: number | null = null
let raf: number | null = null

function tick(t: number) {
  if (loadStart === null) loadStart = t
  const elapsed = (t - loadStart) / 1000
  loaderPct.value = Math.min(99, Math.floor(100 * (1 - Math.exp(-elapsed / PROGRESS_TAU))))
  let idx = STEPS.findIndex((s) => elapsed >= s.at && elapsed < s.end)
  if (idx < 0) idx = STEPS.length - 1
  activeStepIdx.value = idx
  raf = requestAnimationFrame(tick)
}
function startLoadingAnimation() {
  stopLoadingAnimation()
  loadStart = null
  if (typeof window !== 'undefined') raf = requestAnimationFrame(tick)
}
function stopLoadingAnimation() {
  if (raf !== null) cancelAnimationFrame(raf)
  raf = null
}
onBeforeUnmount(() => {
  pollAborted = true
  stopLoadingAnimation()
})

// Gauge animation
const gaugeRevealed = ref<number>(0)
watch(
  () => [state.value, evalJson.value?.jauge_position],
  ([s, pos]) => {
    if (s === 'result' && typeof pos === 'number') {
      const target = Math.max(0, Math.min(10, pos))
      gaugeRevealed.value = 0
      target > 0 && nextTick(() => {
        const stepMs = Math.floor(700 / target)
        for (let i = 1; i <= target; i++) {
          setTimeout(() => { gaugeRevealed.value = i }, i * stepMs)
        }
      })
    }
  },
  { immediate: false },
)

const lvlClass = computed(() => {
  const idx = evalJson.value?.niveau_index
  return idx ? `lvl-${idx}` : ''
})

// Header actions
const copyState = ref<'idle' | 'copied'>('idle')
async function onCopyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copyState.value = 'copied'
    setTimeout(() => { copyState.value = 'idle' }, 2000)
  } catch {}
}
function onPrint() { window.print() }

const config = useRuntimeConfig()
const calendlyUrl = computed(() => {
  const c = config.public as { calendlyUrl?: string }
  return c.calendlyUrl || '#'
})

async function onRetry() {
  errorMessage.value = ''
  state.value = 'loading'
  startLoadingAnimation()
  await fetchEvaluation()
  stopLoadingAnimation()
}
</script>

<template>
  <div class="lab-tool-root" :data-state="state">
    <div class="ambient" aria-hidden="true">
      <div class="blob-cy" />
      <div class="blob-mg" />
    </div>
    <div class="grain-fx" aria-hidden="true" />

    <!-- Header non-result (loading/error/deferred) -->
    <header v-if="state !== 'result'" class="load-header">
      <div class="inner">
        <NuxtLink to="/" class="brand" aria-label="Mariell">
          <img src="/logo.svg" alt="Mariell" />
        </NuxtLink>
        <span class="divider" aria-hidden="true" />
        <div class="meta">
          <span class="label">Évaluation d'attractivité</span>
          <span v-if="evalMetadata?.intitule_poste" class="title">{{ evalMetadata.intitule_poste }}</span>
          <span v-else class="title">En cours…</span>
        </div>
      </div>
    </header>

    <!-- Header result avec actions -->
    <header v-else class="res-header">
      <div class="inner">
        <div class="left">
          <NuxtLink to="/" class="brand" aria-label="Mariell">
            <img src="/logo.svg" alt="Mariell" />
          </NuxtLink>
          <span class="divider" aria-hidden="true" />
          <div class="plan-meta">
            <span class="label">Évaluation d'attractivité</span>
            <span class="title">{{ evalMetadata?.intitule_poste || '' }}</span>
          </div>
        </div>
        <div class="right">
          <button class="icon-btn" type="button" aria-label="Imprimer" @click="onPrint">
            <span class="icon-default" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6,9 6,2 18,2 18,9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
            </span>
            <span class="label-default">Imprimer</span>
          </button>
          <button class="icon-btn" type="button" aria-label="Copier le lien"
                  :class="{ 'is-copied': copyState === 'copied' }" @click="onCopyLink">
            <span v-if="copyState !== 'copied'" class="icon-default" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </span>
            <span v-else class="icon-copied" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            <span class="label-default">{{ copyState === 'copied' ? 'Copié !' : 'Copier le lien' }}</span>
          </button>
          <a class="cta-pill" :href="calendlyUrl" target="_blank" rel="noopener" aria-label="Prendre rendez-vous">
            <span class="cta-pill__lbl">Prendre rendez-vous</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </a>
        </div>
      </div>
    </header>

    <main>
      <!-- LOADING -->
      <section v-if="state === 'loading'" class="state-loading">
        <div class="loading-stage">
          <div class="loader" aria-hidden="true">
            <svg viewBox="0 0 220 220">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#00ffff" />
                  <stop offset="100%" stop-color="#ff00ff" />
                </linearGradient>
                <linearGradient id="g2" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#5ee7e7" />
                  <stop offset="100%" stop-color="#e85eff" />
                </linearGradient>
              </defs>
              <circle class="ring ring-bg" cx="110" cy="110" r="98" />
              <circle class="ring ring-1"  cx="110" cy="110" r="98" />
              <circle class="ring ring-bg" cx="110" cy="110" r="74" />
              <circle class="ring ring-2"  cx="110" cy="110" r="74" />
              <circle class="ring ring-bg" cx="110" cy="110" r="50" />
              <circle class="ring ring-3"  cx="110" cy="110" r="50" />
            </svg>
            <div class="center">
              <span class="pct">{{ loaderPct }}</span>
              <span class="pct-label">Évaluation</span>
            </div>
          </div>

          <span class="eyebrow-cyan">Le Lab Mariell</span>
          <h1>Votre évaluation d'attractivité, <em>en cours.</em></h1>

          <div class="step-stack" role="status" aria-live="polite">
            <div v-for="(step, i) in STEP_LABELS" :key="step" class="step" :class="{ 'is-active': i === activeStepIdx }">
              {{ step }}
            </div>
          </div>

          <p class="reassure">Cette opération prend en général 1 à 2 minutes. Merci de ne pas fermer cette fenêtre.</p>
        </div>
      </section>

      <!-- RESULT -->
      <section v-else-if="state === 'result'" class="state-result">
        <div class="read">
          <div class="doc-eyebrow">
            <span class="eyebrow-cyan">Le Lab Mariell</span>
          </div>
          <h1 class="doc-h1">
            Évaluation d'attractivité <em v-if="evalMetadata?.intitule_poste">— {{ evalMetadata.intitule_poste }}.</em>
          </h1>
          <p v-if="evalMetadata?.entreprise" class="doc-meta">Préparée par Mariell pour {{ evalMetadata.entreprise }}</p>
          <div class="doc-divider" aria-hidden="true" />

          <!-- Verdict block -->
          <section v-if="evalJson" class="verdict" :class="lvlClass">
            <header class="verdict__head">
              <span class="verdict__eyebrow">Verdict synthétique</span>
              <span class="verdict__score">Position <b>{{ evalJson.jauge_position }} / 10</b></span>
            </header>
            <h2 class="verdict__level">
              Position d'attractivité : <em>{{ evalJson.niveau_attractivite }}.</em>
            </h2>
            <div class="gauge" role="img" :aria-label="`Jauge — ${evalJson.jauge_position} sur 10`">
              <span v-for="i in 10" :key="i" class="gauge__seg"
                    :class="{ 'is-on': i <= gaugeRevealed, 'is-last': i === gaugeRevealed && i === evalJson.jauge_position }" />
            </div>
            <div class="gauge__scale" aria-hidden="true">
              <span>Fragile</span>
              <span>Hyper attractive</span>
            </div>
          </section>

          <!-- Banners conditionnels -->
          <div v-if="evalJson?.brief_flou" class="banner banner--info">
            <span class="banner__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/>
              </svg>
            </span>
            <div>
              <p class="banner__title">Brief à préciser</p>
              <p class="banner__text">Votre brief gagnerait à être précisé. L'évaluation reste pertinente mais pourrait être affinée avec plus de détails.</p>
            </div>
          </div>
          <div v-if="evalJson?.alertes && evalJson.alertes.length > 0" class="banner banner--alert">
            <span class="banner__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 4l10 17H2L12 4z"/><path d="M12 10v5"/><circle cx="12" cy="18" r="0.5" fill="currentColor"/>
              </svg>
            </span>
            <div>
              <p class="banner__title">Points d'attention</p>
              <ul>
                <li v-for="a in evalJson.alertes" :key="a">{{ a }}</li>
              </ul>
            </div>
          </div>

          <!-- 4 dimensions badges -->
          <section v-if="evalJson" class="dim-grid" aria-label="Évaluation par dimension">
            <div class="dim">
              <div class="dim__head">
                <span class="dim__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 4v6c0 5-4 8-9 9-5-1-9-4-9-9V6l9-4z"/></svg></span>
                <span class="dim__label">Marque</span>
              </div>
              <div class="dim__value">{{ evalJson.dimensions.marque }}</div>
            </div>
            <div class="dim">
              <div class="dim__head">
                <span class="dim__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg></span>
                <span class="dim__label">Secteur</span>
              </div>
              <div class="dim__value">{{ evalJson.dimensions.secteur }}</div>
            </div>
            <div class="dim">
              <div class="dim__head">
                <span class="dim__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span>
                <span class="dim__label">Mission</span>
              </div>
              <div class="dim__value">{{ evalJson.dimensions.mission }}</div>
            </div>
            <div class="dim">
              <div class="dim__head">
                <span class="dim__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M7 15h3"/></svg></span>
                <span class="dim__label">Package</span>
              </div>
              <div class="dim__value">{{ evalJson.dimensions.package }}</div>
            </div>
          </section>

          <!-- Markdown content (8 sections) -->
          <article class="prose" v-html="renderedHtml" />

          <!-- Final CTA -->
          <aside class="final-cta">
            <h2>Le diagnostic est posé. <em>Parlons exécution.</em></h2>
            <p>Un échange de 30 minutes pour transformer cette évaluation en plan de recrutement actionnable.</p>
            <a class="cta-gradient-lg" :href="calendlyUrl" target="_blank" rel="noopener">
              <span>Prendre rendez-vous</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </aside>

          <footer class="doc-foot">
            <p>Évaluation conservée 90 jours · Mariell · Cabinet de recrutement Sales</p>
          </footer>
        </div>
      </section>

      <!-- ERROR -->
      <section v-else-if="state === 'error'" class="state-error">
        <div class="err-stage">
          <div class="err-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 8v5" /><circle cx="12" cy="16.5" r="0.6" fill="currentColor" /><circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <span class="eyebrow-cyan">Évaluation interrompue</span>
          <h1>Une erreur <em>est survenue.</em></h1>
          <p>{{ errorMessage }}</p>
          <div class="err-actions">
            <button class="cta-pill" type="button" @click="onRetry">
              <span>Réessayer</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <NuxtLink class="link" to="/lab/evaluation-attractivite">Retour au formulaire</NuxtLink>
          </div>
        </div>
      </section>

      <!-- DEFERRED -->
      <section v-else-if="state === 'deferred'" class="state-deferred">
        <div class="err-stage">
          <div class="err-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" />
            </svg>
          </div>
          <span class="eyebrow-cyan">Service personnalisé</span>
          <h1>Votre demande sera <em>traitée manuellement.</em></h1>
          <p>
            Notre équipe a bien reçu votre demande et la traitera sous 24 à 48 heures.
            Vous recevrez votre évaluation par email
            <template v-if="deferredEmail">
              à l'adresse <span class="email">{{ deferredEmail }}</span>
            </template>
            dès qu'elle sera prête.
          </p>
          <div class="err-actions">
            <NuxtLink class="btn-ghost" to="/lab">
              <span>Retour au Lab Mariell</span>
            </NuxtLink>
          </div>

          <hr class="deferred-divider" aria-hidden="true" />

          <div class="calendly-block">
            <p class="calendly-block__lead">Si vous voulez aller plus vite, on peut <em>en parler dès maintenant.</em></p>
            <a :href="calendlyUrl" target="_blank" rel="noopener" class="cta-pill">
              <span>Prendre rendez-vous</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.lab-tool-root {
  position: relative;
  min-height: 100vh;
  background: #000;
  color: #fff;
  font-family: var(--font-grotesk);
}
a { color: inherit; }

.ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.blob-cy {
  position: absolute; top: -260px; left: -220px;
  width: 760px; height: 760px;
  background: radial-gradient(circle, rgba(0,255,255,0.18), transparent 60%);
  filter: blur(120px); opacity: 0.5;
  animation: drift 38s ease-in-out infinite alternate;
}
.blob-mg {
  position: absolute; bottom: -320px; right: -260px;
  width: 860px; height: 860px;
  background: radial-gradient(circle, rgba(255,0,255,0.14), transparent 60%);
  filter: blur(120px); opacity: 0.5;
  animation: drift 32s ease-in-out infinite alternate-reverse;
}
@keyframes drift { 0% { transform: translate3d(0,0,0) scale(1); } 100% { transform: translate3d(3%,-2%,0) scale(1.07); } }
.grain-fx {
  position: fixed; inset: 0; pointer-events: none; z-index: 1;
  opacity: 0.05; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

main { position: relative; z-index: 2; }

/* Headers (loading + result) */
.load-header, .res-header {
  position: sticky; top: 0; z-index: 30;
  height: 72px;
  border-bottom: 1px solid rgba(255,255,255,0.10);
  background: rgba(0,0,0,0.72);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
}
.load-header .inner, .res-header .inner {
  height: 100%; width: 100%; max-width: 1200px;
  margin: 0 auto; padding: 0 20px;
  display: flex; align-items: center; gap: 20px;
}
.load-header .inner { gap: 22px; }
.res-header .left { display: flex; align-items: center; gap: 18px; flex: 1; min-width: 0; }
.brand { display: inline-flex; align-items: center; text-decoration: none; flex-shrink: 0; }
.brand img { height: 22px; display: block; width: auto; }
.divider { width: 1px; height: 22px; background: rgba(255,255,255,0.10); flex-shrink: 0; }
.meta, .plan-meta { display: flex; flex-direction: column; min-width: 0; line-height: 1.15; gap: 3px; }
.meta .label, .plan-meta .label {
  font-family: ui-monospace, monospace; font-size: 10px;
  letter-spacing: 0.18em; text-transform: uppercase; color: #5ee7e7;
}
.meta .title, .plan-meta .title {
  font-family: var(--font-grotesk); font-weight: 500; font-size: 14px;
  color: rgba(255,255,255,0.9); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.res-header .right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.icon-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 14px; border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  color: rgba(255,255,255,0.9);
  font-family: var(--font-grotesk); font-weight: 500; font-size: 13px;
  cursor: pointer; text-decoration: none;
  transition: border-color 0.2s, background 0.2s, color 0.2s, transform 0.2s;
}
.icon-btn:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.04); color: #fff; transform: translateY(-1px); }
.icon-btn svg { width: 14px; height: 14px; }
.icon-btn.is-copied { border-color: rgba(94,231,231,0.5); background: rgba(94,231,231,0.08); color: #5ee7e7; }
.cta-pill {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 11px 18px; border-radius: 9999px; border: 0;
  font-family: var(--font-grotesk); font-weight: 600; font-size: 13px;
  color: #000;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  cursor: pointer; text-decoration: none;
  transition: transform 0.3s, box-shadow 0.3s, filter 0.2s;
}
.cta-pill:hover { transform: translateY(-2px); filter: brightness(1.08); box-shadow: 0 20px 60px -15px rgba(255,0,255,0.55); }
.cta-pill svg { width: 14px; height: 14px; }
@media (max-width: 880px) {
  .res-header .plan-meta .title { display: none; }
  .icon-btn .label-default { display: none; }
  .icon-btn { padding: 9px 11px; }
}
@media (max-width: 640px) {
  .res-header .divider, .load-header .divider { display: none; }
  .res-header .inner, .load-header .inner { padding: 0 16px; gap: 12px; }
  .cta-pill { padding: 10px 14px; font-size: 12px; }
  .cta-pill .cta-pill__lbl { display: none; }
}
@media (max-width: 460px) { .res-header .icon-btn { display: none; } }

/* LOADING */
.loading-stage {
  min-height: 80vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; padding: 80px 22px;
}
.loader { position: relative; width: 220px; height: 220px; margin-bottom: 56px; }
.loader svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.loader .ring { fill: none; stroke-linecap: round; }
.loader .ring-bg { stroke: rgba(255,255,255,0.06); stroke-width: 1; }
.loader .ring-1 { stroke: url(#g1); stroke-width: 1.5; stroke-dasharray: 220 600; transform-origin: center; animation: arc-spin-1 4.5s cubic-bezier(0.4,0,0.6,1) infinite; }
.loader .ring-2 { stroke: url(#g2); stroke-width: 1.5; stroke-dasharray: 130 600; transform-origin: center; animation: arc-spin-2 6s cubic-bezier(0.4,0,0.6,1) infinite reverse; }
.loader .ring-3 { stroke: rgba(94,231,231,0.55); stroke-width: 1; stroke-dasharray: 60 600; transform-origin: center; animation: arc-spin-3 3.8s cubic-bezier(0.4,0,0.6,1) infinite; }
@keyframes arc-spin-1 { to { transform: rotate(360deg); } }
@keyframes arc-spin-2 { to { transform: rotate(360deg); } }
@keyframes arc-spin-3 { to { transform: rotate(-360deg); } }
.loader .center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
.loader .center .pct {
  font-family: var(--font-grotesk); font-weight: 800;
  font-size: 36px;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  line-height: 1; letter-spacing: -0.035em;
}
.loader .center .pct-label {
  font-family: ui-monospace, monospace; font-size: 10px; letter-spacing: 0.18em;
  text-transform: uppercase; color: rgba(255,255,255,0.45);
}
.eyebrow-cyan {
  display: inline-flex; align-items: center; gap: 14px;
  font-family: var(--font-grotesk);
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.32em; text-transform: uppercase;
  color: #5ee7e7;
}
.eyebrow-cyan::before { content: ""; width: 32px; height: 1px; background: currentColor; }
.loading-stage .eyebrow-cyan { margin-bottom: 16px; }
.loading-stage h1 {
  font-family: var(--font-grotesk); font-weight: 800;
  font-size: clamp(28px, 4vw, 40px);
  letter-spacing: -0.035em; line-height: 1.1;
  margin: 0 0 22px; color: #fff;
}
.loading-stage h1 em {
  font-style: italic;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  display: inline-block;
  padding-right: 0.12em;
  padding-bottom: 0.15em;
  margin-bottom: -0.15em;
}
.step-stack { position: relative; height: 28px; width: 100%; max-width: 580px; margin: 0 auto; overflow: hidden; }
.step {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center; gap: 12px;
  font-family: var(--font-grotesk); font-weight: 400;
  font-size: 16px; color: rgba(255,255,255,0.9);
  opacity: 0; transform: translateY(8px);
  transition: opacity 0.5s, transform 0.5s;
}
.step.is-active { opacity: 1; transform: translateY(0); }
.step::before {
  content: ""; width: 6px; height: 6px;
  border-radius: 50%; background: #5ee7e7;
  box-shadow: 0 0 12px rgba(94,231,231,0.7);
  animation: pulse-dot 1.6s ease-in-out infinite;
}
@keyframes pulse-dot { 0%, 100% { opacity: 0.5; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1.15); } }
.reassure {
  margin-top: 48px; padding-top: 28px;
  border-top: 1px solid rgba(255,255,255,0.08);
  width: 100%; max-width: 560px;
  font-family: var(--font-grotesk); font-style: italic; font-size: 14px;
  color: rgba(255,255,255,0.45); line-height: 1.6; text-align: center;
}

/* RESULT */
.state-result { animation: planFade 0.7s cubic-bezier(0.22,1,0.36,1); }
@keyframes planFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.read { max-width: 800px; margin: 0 auto; padding: 56px 22px 80px; }
@media (min-width: 768px) { .read { padding: 72px 32px 100px; } }

.doc-eyebrow { margin-bottom: 24px; }
.doc-h1 {
  font-family: var(--font-grotesk); font-weight: 800;
  font-size: clamp(32px, 4.4vw, 52px);
  line-height: 1.1; letter-spacing: -0.035em;
  color: #fff; margin: 0 0 14px;
  text-wrap: balance;
}
.doc-h1 em {
  font-style: italic;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  /* Anti-coupure italique : étend la zone de gradient pour que les intitulés
     de poste dynamiques (ex. "Account Executive") ne soient pas tronqués au
     "e" final par background-clip:text. */
  display: inline-block;
  padding-left: 0.08em;
  padding-right: 0.14em;
  padding-bottom: 0.15em;
  margin-bottom: -0.09em;
}
.doc-meta { font-family: var(--font-grotesk); font-style: italic; font-weight: 400; font-size: 17px; color: rgba(255,255,255,0.65); }
.doc-divider { margin: 36px 0 44px; height: 1px; background: linear-gradient(90deg, transparent, rgba(94,231,231,0.45), rgba(232,94,255,0.35), transparent); }

/* VERDICT */
.verdict {
  margin: 56px 0 44px;
  padding: 36px 32px 32px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 28px;
  background: rgba(14,14,18,0.6);
  backdrop-filter: blur(24px);
  position: relative; overflow: hidden;
}
.verdict::before {
  content: ''; position: absolute; inset: -1px;
  border-radius: inherit; padding: 1px;
  background: linear-gradient(135deg, rgba(94,231,231,0.4), transparent 35%, transparent 65%, rgba(232,94,255,0.4));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none;
}
.verdict__head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }
.verdict__eyebrow {
  font-family: ui-monospace, monospace;
  font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
  color: #5ee7e7;
  display: inline-flex; align-items: center; gap: 12px;
}
.verdict__eyebrow::before { content: ''; width: 24px; height: 1px; background: currentColor; }
.verdict__score {
  font-family: ui-monospace, monospace;
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(255,255,255,0.45);
}
.verdict__score b { color: #fff; font-weight: 500; }
.verdict__level {
  font-family: var(--font-grotesk); font-weight: 800;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.05; letter-spacing: -0.035em;
  margin: 0 0 24px;
  color: #fff;
}
.verdict__level em { font-style: italic; color: var(--lvl-color, #fff); }

/* Gauge */
.gauge { display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; margin: 0 0 14px; }
.gauge__seg {
  height: 14px; border-radius: 4px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.05);
  transition: background 0.35s, box-shadow 0.35s, border-color 0.35s;
}
.gauge__seg.is-on { background: var(--seg-color, #5ee7e7); border-color: transparent; }
.gauge__seg.is-on.is-last { box-shadow: 0 0 16px var(--seg-glow, rgba(94,231,231,0.5)); }
.gauge__scale { display: flex; justify-content: space-between; font-family: ui-monospace, monospace; font-size: 10px; letter-spacing: 0.18em; color: rgba(255,255,255,0.4); }

/* Niveau colors */
.lvl-1 { --seg-color: #ff5d6c; --seg-glow: rgba(255,93,108,0.55); --lvl-color: #ff8a96; }
.lvl-2 { --seg-color: #ff9542; --seg-glow: rgba(255,149,66,0.55); --lvl-color: #ffb070; }
.lvl-3 { --seg-color: #5eb1ff; --seg-glow: rgba(94,177,255,0.5); --lvl-color: #8ec5ff; }
.lvl-4 { --seg-color: #4ed8a8; --seg-glow: rgba(78,216,168,0.5); --lvl-color: #75e0b8; }
.lvl-5 { --seg-color: #2eb886; --seg-glow: rgba(46,184,134,0.55); --lvl-color: #4fcfa0; }

/* Banners */
.banner { display: flex; gap: 14px; padding: 16px 20px; border-radius: 14px; margin: 28px 0; }
.banner__icon { flex: 0 0 auto; width: 18px; height: 18px; margin-top: 2px; }
.banner__icon svg { width: 100%; height: 100%; }
.banner__title { font-family: var(--font-grotesk); font-weight: 600; font-size: 13px; margin: 0 0 4px; }
.banner__text { font-family: var(--font-grotesk); font-weight: 300; font-size: 14px; line-height: 1.55; color: rgba(255,255,255,0.65); margin: 0; }
.banner--info { background: rgba(255,184,107,0.06); border: 1px solid rgba(255,184,107,0.22); color: #ffc587; }
.banner--alert { background: rgba(255,93,108,0.06); border: 1px solid rgba(255,93,108,0.22); color: #ff8a96; }
.banner--alert ul { margin: 6px 0 0; padding: 0 0 0 18px; color: rgba(255,255,255,0.65); font-family: var(--font-grotesk); font-weight: 300; font-size: 14px; line-height: 1.55; }

/* Dimensions grid */
.dim-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 44px 0; }
@media (max-width: 640px) { .dim-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
.dim {
  padding: 16px 18px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  background: rgba(255,255,255,0.02);
  transition: border-color 0.2s, background 0.2s;
}
.dim:hover { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.035); }
.dim__head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.dim__icon { width: 22px; height: 22px; color: #5ee7e7; }
.dim__icon svg { width: 100%; height: 100%; }
.dim__label { font-family: ui-monospace, monospace; font-size: 10.5px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.55); }
.dim__value { font-family: var(--font-grotesk); font-weight: 800; font-size: 19px; line-height: 1.15; color: #fff; letter-spacing: -0.025em; }

/* Prose markdown */
.prose { font-family: var(--font-grotesk); font-weight: 300; color: rgba(255,255,255,0.9); }
.prose :deep(h1) {
  font-family: var(--font-grotesk); font-weight: 800;
  font-size: clamp(32px, 4.4vw, 52px);
  line-height: 1.1; letter-spacing: -0.035em;
  color: #fff; margin: 0 0 14px;
}
.prose :deep(h1 em) {
  font-style: italic;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  display: inline-block;
  padding-right: 0.12em;
  padding-bottom: 0.18em;
  margin-bottom: -0.18em;
}
.prose :deep(h2) {
  margin: 56px 0 22px;
  font-family: var(--font-grotesk); font-weight: 800;
  font-size: clamp(26px, 3.2vw, 36px);
  line-height: 1.15; letter-spacing: -0.035em;
  color: #fff;
}
.prose :deep(h2 em) {
  font-style: italic;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  display: inline-block;
  padding-right: 0.12em;
  padding-bottom: 0.15em;
  margin-bottom: -0.15em;
}
.prose :deep(h3) {
  margin: 36px 0 14px;
  font-family: var(--font-grotesk); font-weight: 700;
  font-size: 22px; line-height: 1.25; letter-spacing: -0.025em;
  color: #fff;
}
.prose :deep(p), .prose :deep(ul), .prose :deep(ol) {
  font-size: 16.5px; line-height: 1.75;
  color: rgba(255,255,255,0.9);
  margin: 0 0 18px;
}
.prose :deep(strong) { color: #fff; font-weight: 500; }
.prose :deep(em) { font-style: italic; }
.prose :deep(a) { color: #5ee7e7; text-decoration: underline; text-decoration-color: rgba(94,231,231,0.4); text-underline-offset: 3px; }
.prose :deep(hr) {
  border: 0; height: 1px;
  margin: 36px 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.10) 30%, rgba(0,255,255,0.30) 50%, rgba(255,255,255,0.10) 70%, transparent);
}
.prose :deep(ul), .prose :deep(ol) { padding-left: 0; list-style: none; }
.prose :deep(ul li), .prose :deep(ol li) { position: relative; padding-left: 28px; margin-bottom: 14px; }
.prose :deep(ul > li::before) { content: ""; position: absolute; left: 0; top: 0.7em; width: 12px; height: 1px; background: #5ee7e7; opacity: 0.7; }
.prose :deep(ol) { counter-reset: ord; }
.prose :deep(ol > li) { counter-increment: ord; }
.prose :deep(ol > li::before) {
  content: counter(ord, decimal-leading-zero);
  position: absolute; left: 0; top: 0;
  font-family: ui-monospace, monospace; font-size: 11px; letter-spacing: 0.18em;
  color: #5ee7e7; line-height: 1.9;
}

/* Final CTA */
.final-cta {
  margin-top: 56px; padding: 40px 32px;
  border-radius: 28px;
  border: 1px solid rgba(255,255,255,0.08);
  background: linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005));
  position: relative; overflow: hidden; text-align: center;
}
.final-cta::before { content: ""; position: absolute; inset: 0; background: radial-gradient(60% 50% at 50% 0%, rgba(232,94,255,0.10), transparent 70%); pointer-events: none; }
.final-cta > * { position: relative; }
.final-cta h2 {
  font-family: var(--font-grotesk); font-weight: 800;
  font-size: clamp(24px, 3vw, 32px); line-height: 1.15;
  letter-spacing: -0.035em; color: #fff; margin: 0 0 12px;
}
.final-cta h2 em {
  font-style: italic;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  display: inline-block;
  padding-right: 0.12em;
  padding-bottom: 0.15em;
  margin-bottom: -0.15em;
}
.final-cta p { color: rgba(255,255,255,0.65); font-size: 16px; line-height: 1.65; max-width: 520px; margin: 0 auto 26px; }
.cta-gradient-lg {
  display: inline-flex; align-items: center; gap: 12px;
  padding: 18px 30px; border-radius: 9999px;
  background: linear-gradient(135deg, #5ee7e7 0%, #e85eff 100%);
  color: #0b0b12;
  font-family: var(--font-grotesk); font-weight: 600; font-size: 15px;
  text-decoration: none;
  box-shadow: 0 20px 60px -20px rgba(232,94,255,0.45);
  transition: transform 0.3s, box-shadow 0.3s;
}
.cta-gradient-lg:hover { transform: translateY(-2px); box-shadow: 0 28px 80px -20px rgba(232,94,255,0.6); }
.cta-gradient-lg svg { width: 16px; height: 16px; }

.doc-foot {
  margin-top: 48px; padding-top: 28px;
  border-top: 1px solid rgba(255,255,255,0.08);
  text-align: center;
}
.doc-foot p {
  font-family: ui-monospace, monospace;
  font-size: 10.5px; letter-spacing: 0.2em;
  text-transform: uppercase; color: rgba(255,255,255,0.4);
  margin: 0;
}

/* ERROR + DEFERRED */
.err-stage {
  min-height: 78vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; padding: 60px 22px 40px;
  max-width: 640px; margin: 0 auto;
}
.err-mark {
  width: 64px; height: 64px; margin-bottom: 28px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.02);
  position: relative;
}
.err-mark::before {
  content: ''; position: absolute; inset: -1px;
  border-radius: 50%; padding: 1px;
  background: linear-gradient(135deg, rgba(94,231,231,0.5), transparent 50%, rgba(232,94,255,0.5));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none;
}
.err-mark svg { width: 24px; height: 24px; }
.err-stage .eyebrow-cyan { margin-bottom: 18px; }
.err-stage h1 {
  font-family: var(--font-grotesk); font-weight: 800;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.1; letter-spacing: -0.035em;
  color: #fff; margin: 0 0 14px;
}
.err-stage h1 em {
  font-style: italic;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  /* Italique en gradient : sans inline-block + padding-right, le glyphe final
     (ex. "traitée") est tronqué par background-clip:text. */
  display: inline-block;
  padding-right: 0.14em;
  padding-bottom: 0.18em;
  margin-bottom: -0.18em;
}
.err-stage > p { font-size: 16px; line-height: 1.65; color: rgba(255,255,255,0.65); margin: 0 0 32px; max-width: 520px; }
.err-stage > p .email { color: #5ee7e7; font-family: ui-monospace, monospace; font-size: 14px; }
.err-actions { display: flex; flex-direction: column; align-items: center; gap: 18px; }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 24px; border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.18);
  background: transparent; color: #fff;
  font-family: var(--font-grotesk); font-weight: 500; font-size: 14px;
  text-decoration: none; cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
}
.btn-ghost:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.04); transform: translateY(-1px); }
.link {
  font-family: var(--font-grotesk); font-size: 13px;
  color: rgba(255,255,255,0.65);
  text-decoration: underline;
  text-decoration-color: rgba(255,255,255,0.2);
  text-underline-offset: 4px;
  transition: color 0.2s;
}
.link:hover { color: #fff; }

.deferred-divider {
  margin: 56px auto 40px;
  width: 100%; max-width: 520px;
  height: 1px; border: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.10) 30%, rgba(0,255,255,0.30) 50%, rgba(255,255,255,0.10) 70%, transparent);
}
.calendly-block { text-align: center; width: 100%; max-width: 560px; margin: 0 auto; }
.calendly-block__lead {
  font-family: var(--font-grotesk); font-weight: 800; font-style: italic;
  font-size: 19px; line-height: 1.45;
  color: #fff; margin: 0 0 24px;
}
.calendly-block__lead em {
  font-style: italic;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  display: inline-block;
  padding-right: 0.1em;
  padding-bottom: 0.08em;
  margin-bottom: -0.04em;
}

/* Print */
@media print {
  .ambient, .grain-fx, .res-header, .load-header, .doc-foot, .final-cta .cta-gradient-lg { display: none !important; }
  body { background: #fff !important; }
  .lab-tool-root { background: #fff !important; color: #000 !important; }
  .verdict, .dim, .banner { background: #fff !important; border-color: #ddd !important; box-shadow: none !important; color: #000 !important; }
  .verdict::before { display: none; }
  .doc-h1, .doc-h1 em, .verdict__level em, .prose :deep(h1), .prose :deep(h1 em), .prose :deep(h2), .prose :deep(h2 em), .prose :deep(h3), .final-cta h2, .final-cta h2 em {
    background: none !important; -webkit-text-fill-color: #000 !important; color: #000 !important;
  }
  .read { max-width: none; padding: 0; }
  .gauge__seg { border: 1px solid #ccc; background: #fff; }
  .gauge__seg.is-on { background: #444 !important; }
}

@media (prefers-reduced-motion: reduce) {
  .blob-cy, .blob-mg, .loader .ring-1, .loader .ring-2, .loader .ring-3,
  .step::before, .state-result, .gauge__seg { animation: none; transform: none; transition: none; }
}
</style>
