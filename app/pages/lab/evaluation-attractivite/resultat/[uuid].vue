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

// Brief « cta-aligne » : la section 8 du markdown LLM (« On peut en parler. C'est ici. »)
// fait doublon avec le bloc <aside class="final-cta"> statique et doit être retirée.
function stripFinalCta(markdown: string): string {
  return markdown
    .replace(/\n#{1,6}[ \t]*8[.)]?[ \t][\s\S]*$/i, '')
    .replace(/\n+[*_>\s]*On peut en parler\.?\s*C['’]est ici\.?[*_>\s]*$/i, '')
    .trimEnd()
}
const renderedHtml = computed(() => (evalMarkdown.value ? md.render(stripFinalCta(evalMarkdown.value)) : ''))

useHead(() => ({
  title:
    state.value === 'result' && evalMetadata.value
      ? `Évaluation — ${evalMetadata.value.intitule_poste} · Mariell`
      : "Évaluation d’attractivité — Mariell · Le Lab",
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
      errorMessage.value = 'Évaluation introuvable ou expirée (durée de vie : 90 jours).'
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
const POLL_MAX_ATTEMPTS = 35 // 35 * 3s = 105s max (l’éval peut prendre 60-80s)
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
      "L’évaluation prend plus de temps que prévu. Merci de réessayer ou de nous contacter à bonjour@mariell.fr."
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
  <div class="r-root" :data-state="state">
    <!-- Fond atmosphérique (comme l'outil 2) -->
    <div class="tool-bg" aria-hidden="true" />

    <!-- Barre résultat (sticky, visible uniquement en state result) -->
    <div v-if="state === 'result'" class="tresult-bar">
      <div class="tresult-bar-inner">
        <div style="display: flex; align-items: center; gap: 14px;">
          <NuxtLink to="/" class="r-brand" aria-label="Mariell">
            <ChromaticWordmark text="Mariell" :size="18" />
          </NuxtLink>
          <span class="r-bar-meta">
            Évaluation · {{ evalMetadata?.intitule_poste || 'Attractivité' }}
          </span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <button class="btn-pill btn-ghost" type="button" @click="onPrint">Imprimer</button>
          <button class="btn-pill btn-ghost r-copy-btn" type="button"
                  :class="{ 'is-copied': copyState === 'copied' }"
                  @click="onCopyLink">
            {{ copyState === 'copied' ? 'Copié !' : 'Copier le lien' }}
          </button>
          <a class="btn-pill btn-cyan" :href="calendlyUrl" target="_blank" rel="noopener">
            Prendre rendez-vous
          </a>
        </div>
      </div>
    </div>

    <!-- Barre navigation (loading / error / deferred) -->
    <nav v-else class="r-nav">
      <div class="r-nav-inner">
        <NuxtLink to="/" class="r-brand" aria-label="Mariell">
          <ChromaticWordmark text="Mariell" :size="18" />
        </NuxtLink>
        <NuxtLink to="/lab" class="r-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Retour au Lab
        </NuxtLink>
      </div>
    </nav>

    <main>

      <!-- LOADING -->
      <section v-if="state === 'loading'" class="tool-shell" style="text-align: center;">
        <div class="tool-eyebrow">Le Lab Mariell</div>
        <div class="tool-title" style="margin-left: auto; margin-right: auto;">
          Votre évaluation d’attractivité, <em>en cours.</em>
        </div>
        <div class="load-counter" aria-hidden="true">
          {{ loaderPct }}<span class="load-counter__pct">%</span>
        </div>
        <div class="load-bar">
          <div class="load-bar__fill" :style="{ width: loaderPct + '%' }" />
        </div>
        <div class="step-stack" role="status" aria-live="polite">
          <div v-for="(label, i) in STEP_LABELS" :key="label" class="step"
               :class="{ 'is-active': i === activeStepIdx, 'is-done': i < activeStepIdx }">
            {{ label }}
          </div>
        </div>
        <p class="reassure">Cette opération prend en général 30 à 60 secondes. Merci de ne pas fermer cette fenêtre.</p>
      </section>

      <!-- RESULT -->
      <section v-else-if="state === 'result'" class="r-result-fade">
        <div class="read">
          <div class="sec-eyebrow" style="color: var(--cyan); font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;">
            Outil n°3 · Le Lab Mariell
          </div>
          <div class="doc-h1">
            Évaluation d’attractivité,
            <em v-if="evalMetadata?.intitule_poste"> {{ evalMetadata.intitule_poste }}.</em>
          </div>
          <p v-if="evalMetadata?.entreprise" class="doc-meta">
            Préparée par Mariell pour {{ evalMetadata.entreprise }}
          </p>

          <!-- Verdict -->
          <section v-if="evalJson" class="verdict" :class="lvlClass">
            <header class="verdict__head">
              <span class="verdict__eyebrow">Verdict synthétique</span>
              <span class="verdict__score">Position <b>{{ evalJson.jauge_position }}&nbsp;/ 10</b></span>
            </header>
            <h2 class="verdict__level">
              Position d’attractivité&nbsp;: <em>{{ evalJson.niveau_attractivite }}.</em>
            </h2>
            <div class="gauge" role="img" :aria-label="`Jauge — ${evalJson.jauge_position} sur 10`">
              <span v-for="i in 10" :key="i" class="gauge__seg"
                    :class="{ 'is-on': i <= gaugeRevealed }" />
            </div>
            <div class="gauge__scale" aria-hidden="true">
              <span>Fragile</span>
              <span>Hyper attractive</span>
            </div>
          </section>

          <!-- Banners -->
          <div v-if="evalJson?.brief_flou" class="r-banner r-banner--info">
            <span class="r-banner__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                   stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9" /><path d="M12 8v5" />
                <circle cx="12" cy="16" r="0.5" fill="currentColor" />
              </svg>
            </span>
            <div>
              <p class="r-banner__title">Brief à préciser</p>
              <p class="r-banner__text">Votre brief gagnerait à être précisé. L’évaluation reste pertinente mais pourrait être affinée avec plus de détails.</p>
            </div>
          </div>
          <div v-if="evalJson?.alertes && evalJson.alertes.length > 0" class="r-banner r-banner--alert">
            <span class="r-banner__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 4l10 17H2L12 4z" /><path d="M12 10v5" />
                <circle cx="12" cy="18" r="0.5" fill="currentColor" />
              </svg>
            </span>
            <div>
              <p class="r-banner__title">Points d’attention</p>
              <ul class="r-banner__list">
                <li v-for="a in evalJson.alertes" :key="a">{{ a }}</li>
              </ul>
            </div>
          </div>

          <!-- 4 dimensions -->
          <section v-if="evalJson" class="dim-grid" aria-label="Évaluation par dimension">
            <div class="dim">
              <div class="dim__head">
                <span class="dim__icon"><svg viewBox="0 0 24 24"><path d="M12 2l9 4v6c0 5-4 8-9 9-5-1-9-4-9-9V6l9-4z" /></svg></span>
                <span class="dim__label">Marque</span>
              </div>
              <div class="dim__value">{{ evalJson.dimensions.marque }}</div>
            </div>
            <div class="dim">
              <div class="dim__head">
                <span class="dim__icon"><svg viewBox="0 0 24 24"><polyline points="3 17 9 11 13 15 21 7" /><polyline points="14 7 21 7 21 14" /></svg></span>
                <span class="dim__label">Secteur</span>
              </div>
              <div class="dim__value">{{ evalJson.dimensions.secteur }}</div>
            </div>
            <div class="dim">
              <div class="dim__head">
                <span class="dim__icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></span>
                <span class="dim__label">Mission</span>
              </div>
              <div class="dim__value">{{ evalJson.dimensions.mission }}</div>
            </div>
            <div class="dim">
              <div class="dim__head">
                <span class="dim__icon"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /></svg></span>
                <span class="dim__label">Package</span>
              </div>
              <div class="dim__value">{{ evalJson.dimensions.package }}</div>
            </div>
          </section>

          <!-- Sections éditoriales — markdown rendu -->
          <article class="prose" v-html="renderedHtml" />

          <!-- CTA final -->
          <aside class="final-cta">
            <h2>Le diagnostic est posé. <em>Parlons exécution.</em></h2>
            <p>Un échange de 30 minutes pour transformer cette évaluation en plan de recrutement actionnable, calibré sur votre contexte exact.</p>
            <a class="cta-gradient-lg" :href="calendlyUrl" target="_blank" rel="noopener">
              <span>Prendre rendez-vous</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </aside>

          <footer class="doc-foot">
            Évaluation conservée 90 jours · Mariell · Cabinet de recrutement Sales
          </footer>
        </div>
      </section>

      <!-- ERROR -->
      <section v-else-if="state === 'error'" class="tcenter">
        <div class="tstate">
          <div class="err-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                 stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9" /><path d="M12 8v5" />
              <circle cx="12" cy="16.5" r="0.6" fill="currentColor" />
            </svg>
          </div>
          <div class="tool-eyebrow">Évaluation interrompue</div>
          <div class="tool-title" style="margin-left: auto; margin-right: auto;">
            Une erreur <em>est survenue.</em>
          </div>
          <p class="tool-subtitle" style="margin-left: auto; margin-right: auto;">
            {{ errorMessage || 'Réessayons. Vos informations sont conservées, vous n\'avez rien à ressaisir.' }}
          </p>
          <div style="display: flex; gap: 14px; align-items: center; margin-top: 8px; flex-wrap: wrap; justify-content: center;">
            <button class="tsubmit" type="button" @click="onRetry">
              <span class="tsubmit-idle">Réessayer l’évaluation</span>
              <svg class="tsubmit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <NuxtLink class="r-link" to="/lab/evaluation-attractivite">Retour au formulaire</NuxtLink>
          </div>
        </div>
      </section>

      <!-- DEFERRED -->
      <section v-else-if="state === 'deferred'" class="tcenter">
        <div class="tstate">
          <div class="err-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                 stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" />
            </svg>
          </div>
          <div class="tool-eyebrow">Service personnalisé</div>
          <div class="tool-title" style="margin-left: auto; margin-right: auto;">
            Votre demande sera <em>traitée manuellement.</em>
          </div>
          <p class="tool-subtitle" style="margin-left: auto; margin-right: auto;">
            Notre équipe a bien reçu votre demande et la traitera sous 24 à 48 heures.
            Vous recevrez votre évaluation par email
            <template v-if="deferredEmail">
              à l’adresse <span class="r-email">{{ deferredEmail }}</span>
            </template>
            dès qu’elle sera prête.
          </p>
          <div style="margin-top: 8px;">
            <NuxtLink class="btn-pill btn-ghost" to="/lab">
              Retour au Lab Mariell
            </NuxtLink>
          </div>

          <hr class="r-sep" aria-hidden="true" />

          <p class="r-calendly-lead">
            Si vous voulez aller plus vite, on peut <em>en parler dès maintenant.</em>
          </p>
          <a class="btn-pill btn-cyan" :href="calendlyUrl" target="_blank" rel="noopener">
            Prendre rendez-vous
          </a>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
/* Racine */
.r-root {
  position: relative; min-height: 100vh;
  background: var(--ink-900);
  color: var(--fg-on-ink-1);
  font-family: var(--font-display, var(--font-grotesk));
}
/* Le contenu passe au-dessus du .tool-bg atmosphérique (position:fixed, z-index:0). */
.r-root > main { position: relative; z-index: 1; }
a { color: inherit; }

/* Barres */
.tresult-bar {
  position: sticky; top: 0; z-index: 30;
  background: var(--ink-900, #000);
  border-bottom: 1px solid var(--border-on-ink);
  backdrop-filter: blur(16px);
}
.tresult-bar-inner {
  max-width: 1040px; margin: 0 auto;
  padding: 14px 40px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  flex-wrap: wrap;
}
.r-nav {
  border-bottom: 1px solid var(--border-on-ink);
  padding: 0 24px;
}
.r-nav-inner {
  max-width: 1040px; margin: 0 auto;
  height: 60px; display: flex; align-items: center; justify-content: space-between;
}
.r-brand { display: inline-flex; align-items: center; text-decoration: none; flex-shrink: 0; }
.r-back {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono); font-size: 13px;
  color: var(--fg-on-ink-3); text-decoration: none;
  transition: color 0.2s;
}
.r-back:hover { color: var(--fg-on-ink-1); }
.r-bar-meta {
  font-family: var(--font-mono); font-size: 11px;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--fg-on-ink-3);
}
.r-copy-btn.is-copied { color: var(--cyan); border-color: var(--cyan); }

/* Loading — réutilise les classes tools.css */
.load-counter {
  position: relative; display: inline-flex;
  align-items: baseline; justify-content: center;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: clamp(58px, 9vw, 92px);
  line-height: 1; letter-spacing: -0.03em;
  color: var(--cyan); margin: 34px 0 6px;
  text-shadow: 0 0 28px rgba(127,231,225,0.35);
  animation: counterPulse 1.8s ease-in-out infinite;
}
.load-counter__pct {
  font-size: 0.38em; color: var(--fg-on-ink-3);
  margin-left: 5px; letter-spacing: 0; text-shadow: none;
}
@keyframes counterPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.72; } }
.load-bar {
  width: min(320px, 80%); height: 3px; border-radius: 999px;
  background: var(--ink-700); margin: 6px auto 0; overflow: hidden;
}
.load-bar__fill {
  height: 100%; border-radius: 999px;
  background: linear-gradient(90deg, var(--cyan), var(--magenta));
  transition: width 120ms linear;
}

/* Loading — step stack (design ref) */
.step-stack {
  display: flex; flex-direction: column; gap: 12px;
  margin: 36px auto 0; max-width: 420px; text-align: left;
}
.step {
  font-size: 15px; color: var(--fg-on-ink-4);
  padding-left: 26px; position: relative; transition: color 300ms;
}
.step::before {
  content: ''; position: absolute; left: 3px; top: 7px;
  width: 8px; height: 8px; border-radius: 50%;
  border: 1.5px solid var(--fg-on-ink-4);
}
.step.is-active, .step.is-done { color: var(--cyan); }
.step.is-active::before, .step.is-done::before { border-color: var(--cyan); background: var(--cyan); }
.step.is-done { color: var(--fg-on-ink-2); }

/* Result fade-in */
.r-result-fade { animation: r-fade 0.6s cubic-bezier(0.22,1,0.36,1); }
@keyframes r-fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Reading column (design ref) */
.read { max-width: 780px; margin: 0 auto; padding: 48px 40px 80px; }

/* doc-h1 */
.doc-h1 {
  font-family: var(--font-display); font-weight: 500;
  font-size: clamp(30px, 4vw, 46px);
  letter-spacing: -0.02em; line-height: 1.1; margin: 14px 0 0;
  color: var(--fg-on-ink-1);
}
.doc-h1 em { font-style: normal; color: inherit; }
.doc-meta {
  font-family: var(--font-mono); font-size: 12px;
  letter-spacing: 0.06em; color: var(--fg-on-ink-3); margin-top: 14px;
}

/* Verdict — étend les classes tools.css */
.verdict {
  margin: 44px 0 36px; padding: 32px 30px;
  border: 1px solid var(--border-on-ink);
  border-radius: 16px; background: var(--ink-800);
}
.verdict__head {
  display: flex; align-items: baseline;
  justify-content: space-between; gap: 16px;
  flex-wrap: wrap; margin-bottom: 16px;
}
.verdict__eyebrow {
  font-family: var(--font-mono); font-size: 11px;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--cyan);
  display: inline-flex; align-items: center; gap: 12px;
}
.verdict__eyebrow::before { content: ''; width: 24px; height: 1px; background: currentColor; }
.verdict__score {
  font-family: var(--font-mono); font-size: 11px;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--fg-on-ink-3);
}
.verdict__score b { color: var(--fg-on-ink-1); font-weight: 500; }
.verdict__level {
  font-family: var(--font-display); font-weight: 500;
  font-size: clamp(26px, 4vw, 38px);
  letter-spacing: -0.02em; margin: 0 0 20px;
  color: var(--fg-on-ink-1);
}
.verdict__level em { font-style: normal; color: inherit; }

/* Gauge */
.gauge { display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; margin: 0 0 8px; }
.gauge__seg {
  height: 10px; border-radius: 3px;
  background: var(--ink-700);
  transition: background 300ms, box-shadow 300ms;
}
.gauge__seg.is-on { background: var(--cyan); box-shadow: 0 0 10px rgba(127,231,225,0.5); }
.gauge__scale {
  display: flex; justify-content: space-between;
  font-family: var(--font-mono); font-size: 10.5px;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--fg-on-ink-4); margin-bottom: 24px;
}

/* Banners */
.r-banner { display: flex; gap: 14px; padding: 16px 20px; border-radius: 12px; margin: 24px 0; }
.r-banner__icon { flex: 0 0 auto; width: 18px; height: 18px; margin-top: 2px; }
.r-banner__icon svg { width: 100%; height: 100%; }
.r-banner__title { font-size: 13px; font-weight: 600; margin: 0 0 4px; }
.r-banner__text { font-size: 14px; line-height: 1.55; color: var(--fg-on-ink-2); margin: 0; }
.r-banner--info { background: rgba(201,138,42,0.08); border: 1px solid rgba(201,138,42,0.25); color: var(--warn, #c98a2a); }
.r-banner--alert { background: rgba(224,82,82,0.06); border: 1px solid rgba(224,82,82,0.22); color: #e05252; }
.r-banner__list { margin: 6px 0 0; padding: 0 0 0 16px; color: var(--fg-on-ink-2); font-size: 14px; line-height: 1.55; }

/* Dimensions grid */
.dim-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin: 0 0 8px; }
@media (max-width: 640px) { .dim-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
.dim {
  background: var(--ink-800); border: 1px solid var(--border-on-ink);
  border-radius: 12px; padding: 18px;
}
.dim__head { display: flex; align-items: center; gap: 9px; margin-bottom: 10px; }
.dim__icon { width: 20px; height: 20px; color: var(--cyan); flex-shrink: 0; }
.dim__icon svg {
  width: 100%; height: 100%; fill: none;
  stroke: currentColor; stroke-width: 1.6;
  stroke-linecap: round; stroke-linejoin: round;
}
.dim__label {
  font-family: var(--font-mono); font-size: 10.5px;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--fg-on-ink-3);
}
.dim__value {
  font-family: var(--font-display); font-weight: 500;
  font-size: 20px; color: var(--fg-on-ink-1);
}

/* Prose (markdown) */
.prose { font-size: 16px; line-height: 1.62; color: var(--fg-on-ink-2); }
.prose :deep(h2) {
  font-family: var(--font-display); font-weight: 500;
  font-size: clamp(24px, 3.2vw, 34px);
  letter-spacing: -0.02em; margin: 44px 0 16px;
  color: var(--fg-on-ink-1);
}
.prose :deep(h2 em) { font-style: normal; color: inherit; }
.prose :deep(h3) {
  font-family: var(--font-display); font-weight: 500;
  font-size: 20px; margin: 28px 0 12px;
  color: var(--fg-on-ink-1);
}
.prose :deep(p) { margin: 0 0 14px; }
.prose :deep(strong) { color: var(--fg-on-ink-1); font-weight: 600; }
.prose :deep(ul), .prose :deep(ol) { padding-left: 0; list-style: none; margin: 0 0 14px; }
.prose :deep(ul li), .prose :deep(ol li) { position: relative; padding-left: 20px; margin-bottom: 10px; }
.prose :deep(ul > li::before) { content: ''; position: absolute; left: 0; top: 0.7em; width: 8px; height: 1px; background: var(--cyan); }
.prose :deep(hr) { border: 0; height: 1px; margin: 32px 0; background: var(--border-on-ink); }
.prose :deep(a) { color: var(--cyan); text-decoration: underline; text-underline-offset: 3px; }

/* Final CTA */
.final-cta {
  margin-top: 48px; background: var(--ink-800);
  border: 1px solid var(--border-on-ink);
  border-radius: 16px; padding: 36px 40px; text-align: center;
}
.final-cta h2 {
  font-family: var(--font-display); font-weight: 500;
  font-size: 28px; letter-spacing: -0.02em; margin: 0 0 10px;
  color: var(--fg-on-ink-1);
}
.final-cta h2 em { font-style: normal; color: inherit; }
.final-cta p { font-size: 15px; color: var(--fg-on-ink-2); margin: 0 0 22px; }
/* CTA final — .cta-gradient-lg n'existe pas globalement ; bouton pill mesuré
   (sinon le <svg> sans dimensions s'affiche énorme). Identique à l'outil 2. */
.final-cta .cta-gradient-lg {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 15px 30px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--cyan), var(--magenta));
  color: #0b0d10;
  font-family: var(--font-text);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-decoration: none;
  transition: transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out);
}
.final-cta .cta-gradient-lg:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 34px rgba(127, 231, 225, 0.28);
}
.final-cta .cta-gradient-lg svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
@media (max-width: 600px) { .final-cta { padding: 28px 22px; } }

/* Doc foot */
.doc-foot {
  margin-top: 40px; padding-top: 20px;
  border-top: 1px solid var(--border-on-ink);
  font-size: 12px;
  color: var(--fg-on-ink-3); text-align: center;
}

/* Error mark */
.err-mark {
  width: 48px; height: 48px; color: var(--cyan);
  margin: 0 auto 4px;
}
.err-mark svg {
  width: 100%; height: 100%; fill: none;
  stroke: currentColor; stroke-width: 1.6;
  stroke-linecap: round; stroke-linejoin: round;
}

/* Deferred extras */
.r-sep {
  margin: 40px auto 32px; width: 100%; max-width: 480px;
  height: 1px; border: 0; background: var(--border-on-ink);
}
.r-calendly-lead {
  font-family: var(--font-display); font-weight: 500;
  font-size: 18px; line-height: 1.45;
  color: var(--fg-on-ink-1); margin: 0 0 20px;
}
.r-calendly-lead em { font-style: normal; color: var(--cyan); }
.r-email { color: var(--cyan); font-family: var(--font-mono); font-size: 14px; }
.r-link {
  font-family: var(--font-mono); font-size: 13px;
  color: var(--fg-on-ink-3); text-decoration: underline;
  text-underline-offset: 3px; transition: color 0.2s;
}
.r-link:hover { color: var(--fg-on-ink-1); }

/* Print */
@media print {
  .tresult-bar, .r-nav { display: none !important; }
  .final-cta .cta-gradient-lg { display: none !important; }
  .r-root { color: #000 !important; }
  .verdict, .dim, .final-cta { background: #fff !important; border-color: #ddd !important; }
  .read { max-width: none; padding: 0; }
  .gauge__seg { background: #eee !important; box-shadow: none !important; }
  .gauge__seg.is-on { background: #444 !important; }
  .doc-h1, .doc-h1 em, .verdict__level, .verdict__level em,
  .final-cta h2, .final-cta h2 em { color: #000 !important; }
}

@media (prefers-reduced-motion: reduce) {
  .r-result-fade, .gauge__seg, .load-bar__fill, .step { animation: none; transition: none; }
  .load-counter { animation: none; }
}

/* ---- Mobile / responsive ---- */
@media (max-width: 900px) {
  /* Sticky result bar */
  .tresult-bar-inner { padding: 10px 16px; gap: 10px; flex-wrap: wrap; }

  /* Nav */
  .r-nav { padding: 0 16px; }

  /* Dimension grid: 2x2 on tablet */
  .dim-grid { grid-template-columns: repeat(2, 1fr); }

  /* Verdict */
  .verdict { padding: 24px 22px; }

  /* Gauge segments */
  .gauge { gap: 4px; }
  .gauge__seg { height: 9px; }

  /* Reading column */
  .read { padding-left: 20px; padding-right: 20px; }

  /* Prose tables: horizontally scrollable */
  .prose :deep(table) {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    min-width: 0;
  }

  /* Final CTA */
  .final-cta { padding: 28px 22px; }
}

@media (max-width: 560px) {
  /* Sticky result bar: stack on phone */
  .tresult-bar-inner { flex-direction: column; align-items: flex-start; gap: 8px; }
  /* Action buttons row */
  .tresult-bar-inner > div:last-child { width: 100%; flex-wrap: wrap; gap: 8px; }
  .tresult-bar-inner > div:last-child .btn-pill { flex: 1 1 auto; text-align: center; justify-content: center; }

  /* r-bar-meta: hide on very small */
  .r-bar-meta { display: none; }

  /* Loading counter */
  .load-counter { font-size: clamp(46px, 14vw, 72px); margin: 20px 0 4px; }

  /* Step stack */
  .step-stack { gap: 10px; }

  /* Reading column tighter */
  .read { padding-left: 16px; padding-right: 16px; }

  /* doc-h1 */
  .doc-h1 { font-size: clamp(24px, 7vw, 34px); }

  /* Verdict */
  .verdict { padding: 18px 16px; }
  .verdict__level { font-size: clamp(20px, 5.5vw, 28px); }
  .verdict__head { flex-direction: column; align-items: flex-start; gap: 6px; }

  /* Gauge: 10 segments full-width */
  .gauge { gap: 3px; }
  .gauge__seg { height: 8px; border-radius: 2px; }

  /* Dimension grid: 2-col on phone */
  .dim-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .dim { padding: 14px; }
  .dim__value { font-size: 17px; }

  /* Prose tables: horizontally scrollable — no page overflow */
  .prose :deep(table) {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    min-width: 0;
  }

  /* Final CTA */
  .final-cta { padding: 20px 16px; }
  .final-cta h2 { font-size: 20px; }

  /* Banners */
  .r-banner { padding: 14px 14px; gap: 10px; }
}

.reassure {
  margin-top: 28px;
  font-size: 13px;
  color: var(--fg-on-ink-3);
}
</style>
