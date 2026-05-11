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
const POLL_404_GRACE = 6 // 6 * 3s = 18s de tolérance avant d'abandonner (POST peut être en route)
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
  //    On poll /status jusqu'à done/deferred/error.
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

// ---------- Loading animation (raf-driven 33s timeline) ----------

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
// Le user voit toujours du mouvement, même si le LLM tarde.
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

// ---------- Header actions (plan state) ----------

const copyState = ref<'idle' | 'copied'>('idle')
async function onCopyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copyState.value = 'copied'
    setTimeout(() => { copyState.value = 'idle' }, 2000)
  } catch {}
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
  <div class="lab-tool-root" :data-state="state">
    <!-- Atmospheric background -->
    <div class="ambient" aria-hidden="true">
      <div class="blob-cy" />
      <div class="blob-mg" />
    </div>
    <div class="grain-fx" aria-hidden="true" />

    <!-- ============= LOADING / ERROR / DEFERRED HEADER ============= -->
    <header v-if="state !== 'plan'" class="load-header">
      <div class="inner">
        <NuxtLink to="/" class="brand" aria-label="Mariell">
          <img src="/logo_site.png" alt="Mariell" />
        </NuxtLink>
        <span class="divider" aria-hidden="true" />
        <div class="meta">
          <span class="label">Plan de sourcing LinkedIn</span>
          <span v-if="planMetadata?.posteRecherche" class="title">{{ planMetadata.posteRecherche }}</span>
          <span v-else class="title">Génération en cours…</span>
        </div>
      </div>
    </header>

    <!-- ============= PLAN HEADER (sticky, with actions) ============= -->
    <header v-else class="res-header">
      <div class="inner">
        <div class="left">
          <NuxtLink to="/" class="brand" aria-label="Mariell">
            <img src="/logo_site.png" alt="Mariell" />
          </NuxtLink>
          <span class="divider" aria-hidden="true" />
          <div class="plan-meta">
            <span class="label">Plan de sourcing LinkedIn</span>
            <span class="title">{{ planMetadata?.posteRecherche || '' }}</span>
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
      <!-- ============= STATE: LOADING ============= -->
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
              <span class="pct-label">Génération</span>
            </div>
          </div>

          <span class="eyebrow-cyan">Le Lab Mariell</span>
          <h1>Votre plan de sourcing, <em>en construction.</em></h1>

          <div class="step-stack" role="status" aria-live="polite">
            <div v-for="(step, i) in [
              'Analyse de votre contexte...',
              'Identification des entreprises cibles...',
              'Construction de la requête booléenne...',
              'Élaboration de la stratégie en 4 phases...',
              'Compilation du tableau de scoring...',
              'Finalisation du plan...',
            ]" :key="step" class="step" :class="{ 'is-active': i === activeStepIdx }">
              {{ step }}
            </div>
          </div>

          <p class="reassure">
            Cette opération prend en général 1 à 2 minutes. Merci de ne pas fermer cette fenêtre.
          </p>
        </div>
      </section>

      <!-- ============= STATE: PLAN ============= -->
      <section v-else-if="state === 'plan'" class="state-plan">
        <div class="read">
          <article class="prose" v-html="renderedHtml" />

          <aside class="final-cta">
            <h2>Recruter n'est pas un pari. <em>Parlons-en.</em></h2>
            <p>Un échange de 30 minutes pour caler le plan sur votre contexte précis et lancer la chasse cette semaine.</p>
            <a class="cta-gradient-lg" :href="calendlyUrl" target="_blank" rel="noopener">
              <span>Prendre rendez-vous</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </aside>
        </div>
      </section>

      <!-- ============= STATE: ERROR ============= -->
      <section v-else-if="state === 'error'" class="state-error">
        <div class="err-stage">
          <div class="err-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 8v5" />
              <circle cx="12" cy="16.5" r="0.6" fill="currentColor" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <span class="eyebrow-cyan">Génération interrompue</span>
          <h1>Une erreur <em>est survenue.</em></h1>
          <p>{{ errorMessage }}</p>
          <div class="err-actions">
            <button class="cta-pill" type="button" @click="onRetry">
              <span>Réessayer</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <NuxtLink class="link" to="/lab/plan-de-sourcing">Retour au formulaire</NuxtLink>
          </div>
        </div>
      </section>

      <!-- ============= STATE: DEFERRED ============= -->
      <section v-else-if="state === 'deferred'" class="state-deferred">
        <div class="err-stage">
          <div class="err-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 14" />
            </svg>
          </div>
          <span class="eyebrow-cyan">Service personnalisé</span>
          <h1>Votre demande sera <em>traitée manuellement.</em></h1>
          <p>
            Notre équipe a bien reçu votre demande et la traitera sous 24h&nbsp;ouvrées.
            Vous recevrez votre plan de sourcing par email
            <template v-if="deferredEmail">
              à l'adresse <span class="email">{{ deferredEmail }}</span>
            </template>
            dès qu'il sera prêt.
          </p>
          <div class="err-actions">
            <NuxtLink class="btn-ghost" to="/lab">
              <span>Retour au Lab Mariell</span>
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <footer v-if="state === 'plan'" class="res-footer">
      <div class="tag">Recruter n'est pas un pari.</div>
      <div class="legal">Mariell · Plan généré et accessible 90 jours</div>
    </footer>
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

/* ----- Ambient background ----- */
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
@keyframes drift {
  0% { transform: translate3d(0,0,0) scale(1); }
  100% { transform: translate3d(3%,-2%,0) scale(1.07); }
}
.grain-fx {
  position: fixed; inset: 0; pointer-events: none; z-index: 1;
  opacity: 0.05; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

main { position: relative; z-index: 2; }

/* ----- Loading header ----- */
.load-header {
  position: sticky; top: 0; z-index: 30;
  height: 72px;
  border-bottom: 1px solid rgba(255,255,255,0.10);
  background: #000;
}
.load-header .inner {
  height: 100%; width: 100%; max-width: 1200px;
  margin: 0 auto; padding: 0 28px;
  display: flex; align-items: center; gap: 22px;
}
.load-header .brand { display: inline-flex; align-items: center; text-decoration: none; flex-shrink: 0; }
.load-header .brand img { height: 22px; display: block; }
.load-header .divider { width: 1px; height: 26px; background: rgba(255,255,255,0.10); flex-shrink: 0; }
.load-header .meta { display: flex; flex-direction: column; line-height: 1.15; gap: 4px; min-width: 0; }
.load-header .meta .label {
  font-family: var(--font-grotesk); font-weight: 600; font-size: 10px;
  letter-spacing: 0.32em; text-transform: uppercase; color: #5ee7e7;
}
.load-header .meta .title {
  font-family: var(--font-grotesk); font-weight: 500; font-size: 15px;
  color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
@media (max-width: 560px) {
  .load-header .inner { padding: 0 18px; gap: 16px; }
  .load-header .meta .title { font-size: 13px; }
}

/* ----- Sticky plan header ----- */
.res-header {
  position: sticky; top: 0; z-index: 30;
  height: 72px;
  border-bottom: 1px solid rgba(255,255,255,0.10);
  background: rgba(0,0,0,0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform: translateY(-100%);
  animation: slideDown 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
}
@keyframes slideDown { to { transform: translateY(0); } }
.res-header .inner {
  height: 100%; width: 100%; max-width: 1200px;
  margin: 0 auto; padding: 0 20px;
  display: flex; align-items: center; gap: 20px;
}
.res-header .left { display: flex; align-items: center; gap: 18px; flex: 1; min-width: 0; }
.res-header .brand img { height: 22px; display: block; width: auto; }
.res-header .divider { width: 1px; height: 22px; background: rgba(255,255,255,0.10); flex-shrink: 0; }
.res-header .plan-meta { display: flex; flex-direction: column; min-width: 0; line-height: 1.15; }
.res-header .plan-meta .label {
  font-family: ui-monospace, "SF Mono", monospace; font-size: 10px;
  letter-spacing: 0.18em; text-transform: uppercase; color: #5ee7e7;
}
.res-header .plan-meta .title {
  font-family: var(--font-grotesk); font-weight: 500; font-size: 14px;
  color: rgba(255,255,255,0.9);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  margin-top: 3px;
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
.icon-btn:hover {
  border-color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.04);
  color: #fff;
  transform: translateY(-1px);
}
.icon-btn svg { width: 14px; height: 14px; }
.icon-btn.is-copied {
  border-color: rgba(94,231,231,0.5);
  background: rgba(94,231,231,0.08);
  color: #5ee7e7;
}

.cta-pill {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 11px 18px; border-radius: 9999px; border: 0;
  font-family: var(--font-grotesk); font-weight: 600; font-size: 13px;
  color: #000;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  cursor: pointer; text-decoration: none;
  transition: transform 0.3s, box-shadow 0.3s, filter 0.2s;
}
.cta-pill:hover {
  transform: translateY(-2px);
  filter: brightness(1.08);
  box-shadow: 0 20px 60px -15px rgba(255,0,255,0.55);
}
.cta-pill svg { width: 14px; height: 14px; }

@media (max-width: 880px) {
  .res-header .plan-meta .title { display: none; }
  .icon-btn .label-default { display: none; }
  .icon-btn { padding: 9px 11px; }
}
@media (max-width: 640px) {
  .res-header .divider { display: none; }
  .res-header .inner { padding: 0 16px; gap: 12px; }
  .cta-pill { padding: 10px 14px; font-size: 12px; }
  .cta-pill .cta-pill__lbl { display: none; }
}
@media (max-width: 460px) {
  .res-header .icon-btn { display: none; }
}

/* ----- Reading column ----- */
.read { max-width: 760px; margin: 0 auto; padding: 64px 22px 96px; }
@media (min-width: 768px) { .read { padding: 88px 32px 128px; } }

/* ----- LOADING STATE ----- */
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
.loader .ring-1 {
  stroke: url(#g1); stroke-width: 1.5;
  stroke-dasharray: 220 600;
  transform-origin: center;
  animation: arc-spin-1 4.5s cubic-bezier(0.4,0,0.6,1) infinite;
}
.loader .ring-2 {
  stroke: url(#g2); stroke-width: 1.5;
  stroke-dasharray: 130 600;
  transform-origin: center;
  animation: arc-spin-2 6s cubic-bezier(0.4,0,0.6,1) infinite reverse;
}
.loader .ring-3 {
  stroke: rgba(94,231,231,0.55); stroke-width: 1;
  stroke-dasharray: 60 600;
  transform-origin: center;
  animation: arc-spin-3 3.8s cubic-bezier(0.4,0,0.6,1) infinite;
}
@keyframes arc-spin-1 { to { transform: rotate(360deg); } }
@keyframes arc-spin-2 { to { transform: rotate(360deg); } }
@keyframes arc-spin-3 { to { transform: rotate(-360deg); } }

.loader .center {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 6px;
}
.loader .center .pct {
  font-family: var(--font-grotesk); font-weight: 800;
  font-size: 36px;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  line-height: 1; letter-spacing: -0.035em;
}
.loader .center .pct-label {
  font-family: ui-monospace, monospace;
  font-size: 10px; letter-spacing: 0.18em;
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
  margin: 0 0 14px; color: #fff;
}
.loading-stage h1 em {
  font-style: italic;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
}

.step-stack {
  position: relative; height: 28px; width: 100%;
  max-width: 560px; margin: 0 auto; overflow: hidden;
}
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
  border-radius: 50%;
  background: #5ee7e7;
  box-shadow: 0 0 12px rgba(94,231,231,0.7);
  animation: pulse-dot 1.6s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 0.5; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.15); }
}

.reassure {
  margin-top: 48px; padding-top: 28px;
  border-top: 1px solid rgba(255,255,255,0.08);
  width: 100%; max-width: 560px;
  font-family: var(--font-grotesk);
  font-style: italic; font-size: 14px;
  color: rgba(255,255,255,0.45);
  line-height: 1.6; text-align: center;
}

/* ----- PLAN STATE ----- */
.state-plan { animation: planFade 0.7s cubic-bezier(0.22,1,0.36,1); }
@keyframes planFade {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.prose {
  font-family: var(--font-grotesk);
  font-weight: 300;
  color: rgba(255,255,255,0.9);
}
.prose :deep(h1) {
  font-family: var(--font-grotesk); font-weight: 800;
  font-size: clamp(36px, 5.2vw, 56px);
  line-height: 1.05; letter-spacing: -0.035em;
  color: #fff; margin: 0 0 18px; text-wrap: pretty;
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
  margin: 88px 0 28px;
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
  margin: 44px 0 16px;
  font-family: var(--font-grotesk); font-weight: 700;
  font-size: 22px; line-height: 1.25; letter-spacing: -0.025em;
  color: #fff;
}
.prose :deep(h3 em) {
  font-style: italic; color: #e85eff; opacity: 0.95;
  display: inline-block;
  padding-right: 0.1em;
}
.prose :deep(p), .prose :deep(ul), .prose :deep(ol) {
  font-size: 17px; line-height: 1.75;
  color: rgba(255,255,255,0.65);
  margin: 0 0 22px; max-width: 68ch;
}
.prose :deep(strong) { color: #fff; font-weight: 600; }
.prose :deep(a) {
  color: #5ee7e7;
  text-decoration: underline;
  text-decoration-color: rgba(94,231,231,0.4);
  text-underline-offset: 3px;
}
.prose :deep(em) { font-style: italic; }
.prose :deep(hr) {
  border: 0; height: 1px;
  margin: 56px 0;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255,255,255,0.10) 30%,
    rgba(0,255,255,0.30) 50%,
    rgba(255,255,255,0.10) 70%,
    transparent 100%);
}
.prose :deep(ul), .prose :deep(ol) { padding-left: 0; list-style: none; }
.prose :deep(ul li), .prose :deep(ol li) {
  position: relative; padding-left: 28px; margin-bottom: 14px;
}
.prose :deep(ul > li::before) {
  content: ""; position: absolute;
  left: 0; top: 0.7em;
  width: 12px; height: 1px;
  background: #5ee7e7; opacity: 0.7;
}
.prose :deep(ol) { counter-reset: ord; }
.prose :deep(ol > li) { counter-increment: ord; }
.prose :deep(ol > li::before) {
  content: counter(ord, decimal-leading-zero);
  position: absolute; left: 0; top: 0;
  font-family: ui-monospace, monospace;
  font-size: 11px; letter-spacing: 0.18em;
  color: #5ee7e7; line-height: 1.9;
}
.prose :deep(pre) {
  margin: 28px 0 32px; padding: 20px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  background: rgba(255,255,255,0.025);
  overflow-x: auto;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 13px; line-height: 1.7;
  color: rgba(255,255,255,0.9);
  letter-spacing: 0.01em;
}
.prose :deep(code) {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.9em;
}
.prose :deep(blockquote) {
  border-left: 2px solid #e85eff;
  padding: 8px 16px;
  margin: 22px 0;
  background: rgba(232,94,255,0.04);
  border-radius: 0 8px 8px 0;
  color: rgba(255,255,255,0.85);
}
.prose :deep(table) {
  width: 100%; border-collapse: collapse;
  font-family: var(--font-grotesk); font-size: 14px;
  margin: 28px 0 32px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px; overflow: hidden;
}
.prose :deep(th) {
  text-align: left; padding: 14px 18px;
  font-weight: 600; font-size: 11px;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: #5ee7e7;
  border-bottom: 1px solid rgba(255,255,255,0.10);
  background: rgba(94,231,231,0.04);
}
.prose :deep(td) {
  padding: 14px 18px;
  color: rgba(255,255,255,0.9);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.prose :deep(tr:nth-child(even) td) { background: rgba(255,255,255,0.015); }

/* Final CTA */
.final-cta {
  margin-top: 56px;
  padding: 40px 32px;
  border-radius: 28px;
  border: 1px solid rgba(255,255,255,0.08);
  background: linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005));
  position: relative; overflow: hidden;
  text-align: center;
}
.final-cta::before {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(60% 50% at 50% 0%, rgba(232,94,255,0.10), transparent 70%);
  pointer-events: none;
}
.final-cta > * { position: relative; }
.final-cta h2 {
  font-family: var(--font-grotesk); font-weight: 800;
  font-size: clamp(24px, 3vw, 32px);
  line-height: 1.15; letter-spacing: -0.035em;
  color: #fff; margin: 0 0 12px;
}
.final-cta h2 em {
  font-style: italic;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
}
.final-cta p {
  color: rgba(255,255,255,0.65);
  font-size: 16px; line-height: 1.65;
  max-width: 520px; margin: 0 auto 26px;
}
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
.cta-gradient-lg:hover {
  transform: translateY(-2px);
  box-shadow: 0 28px 80px -20px rgba(232,94,255,0.6);
}
.cta-gradient-lg svg { width: 16px; height: 16px; }

/* ----- ERROR + DEFERRED ----- */
.err-stage {
  min-height: 78vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; padding: 80px 22px;
  max-width: 560px; margin: 0 auto;
}
.err-mark {
  width: 64px; height: 64px;
  margin-bottom: 28px;
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
}
.err-stage p {
  font-size: 16px; line-height: 1.65;
  color: rgba(255,255,255,0.65);
  margin: 0 0 32px; max-width: 480px;
}
.err-stage p .email {
  color: #5ee7e7;
  font-family: ui-monospace, monospace;
  font-size: 14px;
}
.err-actions { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 24px; border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.18);
  background: transparent; color: #fff;
  font-family: var(--font-grotesk); font-weight: 500; font-size: 14px;
  text-decoration: none; cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
}
.btn-ghost:hover {
  border-color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.04);
  transform: translateY(-1px);
}
.link {
  font-family: var(--font-grotesk); font-size: 13px;
  color: rgba(255,255,255,0.65);
  text-decoration: underline;
  text-decoration-color: rgba(255,255,255,0.2);
  text-underline-offset: 4px;
  transition: color 0.2s;
}
.link:hover { color: #fff; }

/* ----- Footer ----- */
.res-footer {
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 32px 22px 40px;
  text-align: center;
  position: relative; z-index: 2;
}
.res-footer .tag {
  font-family: var(--font-grotesk);
  font-style: italic; font-size: 14px;
  color: rgba(255,255,255,0.45);
  margin-bottom: 8px;
}
.res-footer .legal {
  font-family: ui-monospace, monospace;
  font-size: 10px; letter-spacing: 0.18em;
  text-transform: uppercase; color: rgba(255,255,255,0.4);
}

/* ----- Print ----- */
@media print {
  .ambient, .grain-fx, .res-header, .load-header, .res-footer,
  .final-cta .cta-gradient-lg { display: none !important; }
  body { background: #fff !important; }
  .lab-tool-root { background: #fff !important; color: #000 !important; }
  .prose, .prose :deep(*) { color: #000 !important; -webkit-text-fill-color: #000 !important; background: none !important; }
  .read { max-width: none; padding: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .blob-cy, .blob-mg, .loader .ring-1, .loader .ring-2, .loader .ring-3,
  .step::before, .res-header, .state-plan { animation: none; transform: none; }
}
</style>
