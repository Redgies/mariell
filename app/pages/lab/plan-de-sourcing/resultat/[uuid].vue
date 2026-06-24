<script setup lang="ts">
import MarkdownIt from 'markdown-it'

definePageMeta({ layout: false })

const route = useRoute()
const uuid = computed(() => String(route.params.uuid || ''))

interface PlanMetadata {
  prenom: string
  nom: string
  entreprise: string
  posteRecherche: string
  createdAt: string
}

type ViewState = 'loading' | 'plan' | 'error' | 'deferred'
const state = ref<ViewState>('loading')

const planContent = ref<string>('')
const planMetadata = ref<PlanMetadata | null>(null)
const errorMessage = ref<string>('')
const deferredEmail = ref<string>('')

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })
const renderedHtml = computed(() => (planContent.value ? md.render(planContent.value) : ''))

useHead(() => ({
  title:
    state.value === 'plan' && planMetadata.value
      ? `Plan de sourcing — ${planMetadata.value.posteRecherche} · Mariell`
      : 'Plan de sourcing — Mariell · Le Lab',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
}))

// ---------- Data loading ----------

async function fetchPlan() {
  try {
    const data = await $fetch<{ content: string; metadata: PlanMetadata }>(
      `/api/lab/plan-de-sourcing/${uuid.value}`,
    )
    planContent.value = data.content
    planMetadata.value = data.metadata
    state.value = 'plan'
  } catch (err: any) {
    if (err?.statusCode === 404) {
      errorMessage.value = 'Plan introuvable ou expiré (durée de vie : 90 jours).'
    } else {
      errorMessage.value =
        err?.data?.message || err?.message || "Une erreur est survenue lors du chargement du plan."
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
const POLL_MAX_ATTEMPTS = 30 // 30 * 3s = 90s max
const POLL_404_GRACE = 6 // 6 * 3s = 18s de tolérance avant d’abandonner (POST peut être en route)
let pollAborted = false

async function pollStatus(): Promise<void> {
  let attempts = 0
  let notFoundStreak = 0

  while (attempts < POLL_MAX_ATTEMPTS && !pollAborted) {
    attempts++
    try {
      const result = await $fetch<PollStatus>(`/api/lab/plan-de-sourcing/status/${uuid.value}`)
      notFoundStreak = 0

      if (result.status === 'done') {
        await fetchPlan()
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
      // status === 'pending' → on continue à poller
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
        console.warn('[plan-sourcing] status poll failed', err)
      }
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }

  if (!pollAborted) {
    errorMessage.value =
      "La génération prend plus de temps que prévu. Merci de réessayer ou de nous contacter à bonjour@mariell.fr."
    state.value = 'error'
    cleanupPending()
  }
}

function cleanupPending() {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(`plan-sourcing-pending:${uuid.value}`)
  }
}

onMounted(async () => {
  // 1. Mode différé legacy (uuid === 'deferred') — gardé pour compat liens existants.
  if (uuid.value === 'deferred' && typeof sessionStorage !== 'undefined') {
    const raw = sessionStorage.getItem('plan-sourcing-deferred')
    if (raw) {
      try {
        const data = JSON.parse(raw) as { email: string }
        deferredEmail.value = data.email || ''
      } catch {}
    }
    state.value = 'deferred'
    return
  }

  // 2. Submission en cours : le formulaire a posé un flag avant de naviguer.
  //    On poll /status jusqu’à done/deferred/error.
  if (typeof sessionStorage !== 'undefined') {
    const pendingRaw = sessionStorage.getItem(`plan-sourcing-pending:${uuid.value}`)
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

  // 3. Arrivée directe via lien email — fetch immédiat du résultat persisté.
  startLoadingAnimation()
  await fetchPlan()
  stopLoadingAnimation()
})

onBeforeUnmount(() => {
  pollAborted = true
})

// ---------- Loading animation (raf-driven asymptotic curve) ----------

const loaderPct = ref(0)
const activeStepIdx = ref(0)
// Steps stretched over ~75s — last step stays until the polling resolves.
const STEPS = [
  { at: 0,  end: 10 },
  { at: 10, end: 22 },
  { at: 22, end: 38 },
  { at: 38, end: 56 },
  { at: 56, end: 75 },
  { at: 75, end: Infinity },
]
// Asymptotic progress curve : pct = 100 * (1 - exp(-t/TAU)).
// TAU=40 → ~78% à 60s, ~90% à 90s (1m30), ~95% à 120s (2min), ~99% seulement à ~3m30.
const PROGRESS_TAU = 40
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
onBeforeUnmount(() => stopLoadingAnimation())

// ---------- Copy buttons (plan state) ----------

const copyStates = reactive<Record<string, 'idle' | 'copied'>>({
  link: 'idle',
  bool: 'idle',
  tpl1: 'idle',
  tpl2: 'idle',
})

async function onCopy(key: string, getText: () => string) {
  try {
    await navigator.clipboard.writeText(getText())
    copyStates[key] = 'copied'
    setTimeout(() => { copyStates[key] = 'idle' }, 1800)
  } catch {}
}

function onCopyLink() {
  onCopy('link', () => window.location.href)
}

function onCopyBlock(key: string, elId: string) {
  onCopy(key, () => {
    const el = document.getElementById(elId)
    return el?.textContent || ''
  })
}

function onPrint() {
  window.print()
}

// ---------- Calendly URL ----------
const config = useRuntimeConfig()
const calendlyUrl = computed(() => {
  const c = config.public as { calendlyUrl?: string }
  return c.calendlyUrl || '#'
})

// ---------- Retry on error ----------
async function onRetry() {
  errorMessage.value = ''
  state.value = 'loading'
  startLoadingAnimation()
  await fetchPlan()
  stopLoadingAnimation()
}
</script>

<template>
  <div class="res-root" :data-state="state">
    <!-- Atmospheric background -->
    <div class="tool-bg" aria-hidden="true" />

    <!-- ===== STICKY BAR (plan state only) ===== -->
    <div v-if="state === 'plan'" class="tresult-bar">
      <div class="tresult-bar-inner">
        <div class="res-bar-left">
          <NuxtLink to="/" class="site-nav__brand" aria-label="Mariell">
            <ChromaticWordmark :size="18" />
          </NuxtLink>
          <span class="res-bar-meta">
            Plan de sourcing
            <template v-if="planMetadata?.posteRecherche"> · {{ planMetadata.posteRecherche }}</template>
          </span>
        </div>
        <div class="res-bar-actions">
          <button class="btn-pill btn-ghost" type="button" @click="onPrint">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6,9 6,2 18,2 18,9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Imprimer
          </button>
          <a class="btn-pill btn-cyan" :href="calendlyUrl" target="_blank" rel="noopener">
            Prendre rendez-vous
          </a>
        </div>
      </div>
    </div>

    <!-- ===== MINIMAL HEADER (loading / error / deferred) ===== -->
    <header v-else class="load-header">
      <div class="load-header__inner">
        <NuxtLink to="/" class="site-nav__brand" aria-label="Mariell">
          <ChromaticWordmark :size="20" />
        </NuxtLink>
        <span class="load-header__divider" aria-hidden="true" />
        <div class="load-header__meta">
          <span class="load-header__label">Plan de sourcing LinkedIn</span>
          <span class="load-header__status">
            {{ state === 'loading' ? 'Génération en cours…' : (planMetadata?.posteRecherche || '') }}
          </span>
        </div>
      </div>
    </header>

    <main>
      <!-- ===== STATE: LOADING ===== -->
      <section v-if="state === 'loading'" class="state-loading">
        <div class="tool-shell" style="text-align: center; padding-top: 80px; padding-bottom: 80px;">
          <div class="tool-eyebrow">Le Lab Mariell</div>
          <div class="tool-title" style="margin-left: auto; margin-right: auto;">
            Votre plan de sourcing, <em>en construction.</em>
          </div>
          <div class="load-counter" aria-hidden="true">
            {{ loaderPct }}<span class="load-counter__pct">%</span>
          </div>
          <div class="load-bar">
            <div class="load-bar__fill" :style="{ width: loaderPct + '%' }" />
          </div>
          <div class="step-stack" role="status" aria-live="polite"
               style="max-width: 420px; margin-left: auto; margin-right: auto; text-align: left;">
            <div v-for="(step, i) in [
              'Analyse de votre contexte…',
              'Identification des entreprises cibles…',
              'Construction de la requête booléenne…',
              'Élaboration de la stratégie en 4 phases…',
              'Compilation du tableau de scoring…',
              'Finalisation du plan…',
            ]" :key="step"
            class="step"
            :class="{
              'is-active': i === activeStepIdx,
              'is-done': i < activeStepIdx,
            }">
              {{ step }}
            </div>
          </div>
          <p class="reassure">
            Cette opération prend en général 30 à 60 secondes. Merci de ne pas fermer cette fenêtre.
          </p>
        </div>
      </section>

      <!-- ===== STATE: PLAN ===== -->
      <section v-else-if="state === 'plan'" class="state-plan">
        <div class="read" style="padding-top: 48px; padding-bottom: 80px;">
          <article class="prose-res" v-html="renderedHtml" />
          <aside class="final-cta">
            <h2>Recruter n’est pas un pari. <em>Parlons-en.</em></h2>
            <p>Un échange de 30 minutes pour caler le plan sur votre contexte précis et lancer la chasse cette semaine.</p>
            <a class="cta-gradient-lg" :href="calendlyUrl" target="_blank" rel="noopener">
              <span>Prendre rendez-vous</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </aside>
        </div>
      </section>

      <!-- ===== STATE: ERROR ===== -->
      <section v-else-if="state === 'error'" class="state-error">
        <div class="tcenter">
          <div class="tstate">
            <div class="err-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 8v5" />
                <circle cx="12" cy="16.5" r="0.6" fill="currentColor" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <div class="tool-eyebrow">Génération interrompue</div>
            <div class="tool-title" style="font-size: clamp(28px, 4vw, 40px);">
              Une erreur <em>est survenue.</em>
            </div>
            <p class="tool-subtitle" style="margin-left: auto; margin-right: auto;">
              {{ errorMessage || 'Réessayons. Vos informations sont conservées, vous n\'avez rien à ressaisir.' }}
            </p>
            <div class="err-actions">
              <button class="tsubmit" type="button" @click="onRetry">
                <span class="tsubmit-idle">Réessayer la génération</span>
                <svg class="tsubmit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
              <NuxtLink class="nav-link" to="/lab/plan-de-sourcing">Retour au formulaire</NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== STATE: DEFERRED ===== -->
      <section v-else-if="state === 'deferred'" class="state-deferred">
        <div class="tcenter">
          <div class="tstate">
            <div class="err-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 14" />
              </svg>
            </div>
            <div class="tool-eyebrow">Service personnalisé</div>
            <div class="tool-title" style="font-size: clamp(28px, 4vw, 40px);">
              Votre demande sera <em>traitée manuellement.</em>
            </div>
            <p class="tool-subtitle" style="margin-left: auto; margin-right: auto;">
              Notre équipe a bien reçu votre demande et la traitera sous 24&nbsp;h.
              Vous recevrez votre plan de sourcing par email
              <template v-if="deferredEmail">
                à l’adresse <span class="deferred-email">{{ deferredEmail }}</span>
              </template>
              dès qu’il sera prêt.
            </p>
            <NuxtLink class="btn-pill btn-ghost" to="/lab">
              Retour au Lab Mariell
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer (plan state only) -->
    <footer v-if="state === 'plan'" class="res-footer">
      <span class="res-footer__tag">Recruter n’est pas un pari.</span>
      <span class="res-footer__legal">Mariell · Plan généré et accessible 90 jours</span>
    </footer>
  </div>
</template>

<style scoped>
/* ---- Root ---- */
.res-root {
  position: relative;
  min-height: 100vh;
  background: var(--ink-900);
  color: var(--fg-on-ink-1);
  font-family: var(--font-text);
}

/* ---- Tool title italic accent ---- */
.tool-title em {
  font-style: normal;
  color: inherit;
}

/* ---- Load header (non-plan states) ---- */
.load-header {
  position: sticky;
  top: 0;
  z-index: 30;
  height: 64px;
  background: rgba(11, 13, 16, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border-on-ink);
}
.load-header__inner {
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 28px;
  display: flex;
  align-items: center;
  gap: 20px;
}
.load-header__divider {
  width: 1px;
  height: 22px;
  background: var(--border-on-ink);
  flex-shrink: 0;
}
.load-header__meta {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  gap: 2px;
  min-width: 0;
}
.load-header__label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--cyan);
}
.load-header__status {
  font-size: 14px;
  font-weight: 500;
  color: var(--fg-on-ink-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---- Sticky result bar ---- */
.res-bar-left {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}
.res-bar-meta {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fg-on-ink-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width: 640px) {
  .res-bar-meta { display: none; }
}

/* ---- Loading state ---- */
.state-loading { position: relative; z-index: 1; }

.load-counter {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: clamp(58px, 9vw, 92px);
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--cyan);
  margin: 34px 0 6px;
  text-shadow: 0 0 28px rgba(127, 231, 225, 0.35);
  animation: counterPulse 1.8s ease-in-out infinite;
}
.load-counter__pct {
  font-size: 0.38em;
  color: var(--fg-on-ink-3);
  margin-left: 5px;
  letter-spacing: 0;
  text-shadow: none;
}
@keyframes counterPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.72; }
}

.load-bar {
  width: min(320px, 80%);
  height: 3px;
  border-radius: 999px;
  background: var(--ink-700);
  margin: 6px auto 0;
  overflow: hidden;
}
.load-bar__fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--cyan), var(--magenta));
  transition: width 120ms linear;
}

.step-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 36px 0 0;
}
.step {
  font-size: 15px;
  color: var(--fg-on-ink-4);
  padding-left: 26px;
  position: relative;
  transition: color 300ms;
}
.step::before {
  content: "";
  position: absolute;
  left: 3px;
  top: 7px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1.5px solid var(--fg-on-ink-4);
  transition: border-color 300ms, background 300ms;
}
.step.is-active { color: var(--cyan); }
.step.is-active::before { border-color: var(--cyan); background: var(--cyan); }
.step.is-done { color: var(--fg-on-ink-2); }
.step.is-done::before { border-color: var(--cyan); background: var(--cyan); }

.reassure {
  margin-top: 28px;
  font-size: 13px;
  color: var(--fg-on-ink-3);
}

/* ---- Plan state ---- */
.state-plan { position: relative; z-index: 1; animation: planFade 0.6s var(--ease-out); }
@keyframes planFade {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ---- Prose styles for rendered markdown ---- */
.prose-res :deep(h1) {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1.06;
  letter-spacing: -0.02em;
  margin: 0 0 18px;
  color: var(--fg-on-ink-1);
}
.prose-res :deep(h2) {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(26px, 3.4vw, 38px);
  letter-spacing: -0.02em;
  line-height: 1.12;
  margin: 44px 0 16px;
  color: var(--fg-on-ink-1);
}
.prose-res :deep(h3) {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 20px;
  margin: 28px 0 8px;
  color: var(--fg-on-ink-1);
}
.prose-res :deep(h4) {
  font-family: var(--font-text);
  font-weight: 600;
  font-size: 16px;
  margin: 0 0 6px;
  color: var(--fg-on-ink-1);
}
.prose-res :deep(h2 em),
.prose-res :deep(h3 em) {
  font-style: normal;
  color: inherit;
}
.prose-res :deep(p) {
  font-size: 16px;
  line-height: 1.62;
  color: var(--fg-on-ink-2);
  margin: 0 0 16px;
}
.prose-res :deep(strong) { color: var(--fg-on-ink-1); }
.prose-res :deep(a) { color: var(--cyan); }
.prose-res :deep(ul),
.prose-res :deep(ol) {
  margin: 0 0 18px;
  padding-left: 0;
  list-style: none;
}
.prose-res :deep(li) {
  font-size: 15px;
  line-height: 1.55;
  color: var(--fg-on-ink-2);
  padding-left: 24px;
  position: relative;
  margin-bottom: 9px;
}
.prose-res :deep(ul > li::before) {
  content: "";
  position: absolute;
  left: 3px;
  top: 10px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--cyan);
}
.prose-res :deep(ol) { counter-reset: n; }
.prose-res :deep(ol li) { counter-increment: n; padding-left: 26px; }
.prose-res :deep(ol li::before) {
  content: counter(n);
  background: none;
  width: auto;
  height: auto;
  top: 0;
  left: 0;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--cyan);
  border-radius: 0;
}
.prose-res :deep(hr) {
  border: none;
  border-top: 1px solid var(--border-on-ink);
  margin: 32px 0;
}
.prose-res :deep(pre) {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
}
.prose-res :deep(pre code) {
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  color: var(--cyan);
  white-space: pre;
}
.prose-res :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.9em;
  color: var(--cyan);
}
.prose-res :deep(blockquote) {
  border-left: 2px solid var(--border-on-ink-strong);
  padding: 8px 16px;
  margin: 22px 0;
  color: var(--fg-on-ink-2);
}
.prose-res :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 420px;
}
.prose-res :deep(th) {
  text-align: left;
  padding: 12px 14px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fg-on-ink-3);
  border-bottom: 1px solid var(--border-on-ink);
}
.prose-res :deep(td) {
  padding: 12px 14px;
  color: var(--fg-on-ink-2);
  border-bottom: 1px solid var(--border-on-ink);
}

/* ---- Final CTA card ---- */
.final-cta {
  margin: 56px auto 0;
  max-width: 760px;
  background: var(--ink-800);
  border: 1px solid var(--border-on-ink);
  border-radius: 16px;
  padding: 36px 40px;
  text-align: center;
}
.final-cta h2 {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 28px;
  letter-spacing: -0.02em;
  margin: 0 0 10px;
  color: var(--fg-on-ink-1);
}
.final-cta h2 em { font-style: normal; color: inherit; }
.final-cta p {
  font-size: 15px;
  color: var(--fg-on-ink-2);
  margin: 0 0 22px;
}

/* ---- Error / Deferred states ---- */
.state-error,
.state-deferred { position: relative; z-index: 1; }

.err-mark {
  width: 48px;
  height: 48px;
  color: var(--cyan);
  margin: 0 auto 4px;
}
.err-mark svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.err-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.deferred-email {
  color: var(--cyan);
  font-family: var(--font-mono);
  font-size: 0.9em;
}

/* ---- Footer ---- */
.res-footer {
  border-top: 1px solid var(--border-on-ink);
  padding: 28px 22px 36px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  z-index: 2;
}
.res-footer__tag {
  font-family: var(--font-text);
  font-style: italic;
  font-size: 14px;
  color: var(--fg-on-ink-3);
}
.res-footer__legal {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg-on-ink-4);
}

/* ---- Print ---- */
@media print {
  .tresult-bar,
  .load-header,
  .res-footer,
  .tool-bg,
  .final-cta .cta-gradient-lg { display: none !important; }
  .res-root { background: #fff !important; color: #000 !important; }
  .prose-res :deep(*) { color: #000 !important; }
}

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .load-counter { animation: none; }
  .load-bar__fill { transition: none; }
  .step, .step::before { transition: none; }
  .state-plan { animation: none; }
}

/* ---- Mobile / responsive ---- */
@media (max-width: 900px) {
  /* Sticky result bar: allow wrapping, reduce padding */
  .tresult-bar-inner { padding: 10px 16px; gap: 10px; }
  .res-bar-actions { gap: 8px; }

  /* Loading header */
  .load-header__inner { padding: 0 16px; gap: 12px; }

  /* Result reading column */
  .read { padding-left: 20px; padding-right: 20px; }

  /* Markdown tables: horizontally scrollable */
  .prose-res :deep(table) {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    min-width: 0;
  }

  /* Final CTA */
  .final-cta { padding: 28px 22px; }
}

@media (max-width: 560px) {
  /* Sticky result bar: single column, actions below brand */
  .tresult-bar-inner { flex-direction: column; align-items: flex-start; gap: 8px; }
  .res-bar-actions { width: 100%; justify-content: flex-start; flex-wrap: wrap; }
  .res-bar-actions .btn-pill { flex: 1 1 auto; justify-content: center; text-align: center; }

  /* Load header meta truncation */
  .load-header__status { font-size: 13px; }

  /* Loading counter size */
  .load-counter { font-size: clamp(46px, 14vw, 72px); margin: 20px 0 4px; }

  /* Step stack padding */
  .step-stack { margin-top: 24px; }
  .step { font-size: 14px; }

  /* Reading column tighter */
  .read { padding-left: 16px; padding-right: 16px; }

  /* Prose headings */
  .prose-res :deep(h1) { font-size: clamp(24px, 7vw, 34px); }
  .prose-res :deep(h2) { font-size: clamp(20px, 5.5vw, 28px); }

  /* Markdown tables: horizontally scrollable */
  .prose-res :deep(table) {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    min-width: 0;
  }

  /* Final CTA */
  .final-cta { padding: 24px 16px; }
  .final-cta h2 { font-size: 20px; }
}
</style>
