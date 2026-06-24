<script setup lang="ts">
// CorporateFrieze — restrained, editorial process timeline for the cream
// sections. On scroll-in (plays ONCE then freezes): a thin spine draws
// left→right through the measured dot centers, each step reveals in stagger,
// and the funnel counts tick up 11 500 → 540 → 12 → 6 → 1. No neon point —
// the structure and the spine carry the motion. Consulting-grade calm.
// Respects prefers-reduced-motion (static final state) and a `freeze` prop.

const props = defineProps<{ freeze?: number }>()

const STEPS = [
  { n: '01', day: 'J+1', title: 'Brief', body: "Évaluation de la recherche : attractivité de l’entreprise et du poste, profil recherché, marché adressé, spécificités, frictions." },
  { n: '02', day: 'J+2 → J+7', title: 'Chasse & Screening', body: 'Sourcing par chasse, réseau et talent pool premium. Call soft skills, visio hard skills + tests spécifiques à la recherche.' },
  { n: '03', day: 'J+7 → J+10', title: 'Push Pool', body: 'Candidatures détaillées : CV, brief profil, description de la dernière expérience, ressenti et éventuels freins.' },
  { n: '04', day: 'J+10 → J+21', title: 'Suivi & médiation', body: 'Accompagnement candidat et entreprise tout au long du process. Aide à la planification et à la médiation.' },
  { n: '05', day: 'Signature', title: 'Closing', body: 'Offre signée, intégration lancée. Le bon profil rejoint vos équipes. on reste présents à vos côtés, on constate à 4 et 8 mois.' },
]
const COUNTS = [11500, 540, 12, 6, 1]

const sectionRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const dotRefs = ref<HTMLElement[]>([])
const setDotRef = (el: Element | null, i: number) => {
  if (el) dotRefs.value[i] = el as HTMLElement
}

const countRefs = ref<HTMLElement[]>([])
const setCountRef = (el: Element | null, i: number) => {
  if (el) countRefs.value[i] = el as HTMLElement
}

// progress 0..1 of the spine sweep
const p = ref(props.freeze != null ? props.freeze : 0)

// measured geometry of dot centers relative to the track
const geom = ref<{ xs: number[]; y: number; w: number; h: number } | null>(null)

const lineLeft = computed(() => (geom.value ? geom.value.xs[0] : 0))
const lineSpan = computed(() => (geom.value ? geom.value.xs[4]! - geom.value.xs[0]! : 0))

// A step "arrives" as the filling spine reaches its measured dot center.
function stepReveal(i: number): number {
  const g = geom.value
  const at = g ? (g.xs[i]! - g.xs[0]!) / (g.xs[4]! - g.xs[0]!) : i / 4
  return Math.max(0, Math.min(1, (p.value - at * 0.82) * 8))
}

const fmtFr = (n: number) => '· ' + Math.round(n).toLocaleString('fr-FR')

let raf = 0
let ro: ResizeObserver | null = null
let io: IntersectionObserver | null = null
let measureTimer: ReturnType<typeof setTimeout> | null = null
const countStarted: boolean[] = []

function measure() {
  const track = trackRef.value
  if (!track) return
  const tb = track.getBoundingClientRect()
  const xs = dotRefs.value.map((b) => {
    if (!b) return 0
    const r = b.getBoundingClientRect()
    return r.left - tb.left + r.width / 2
  })
  const first = dotRefs.value[0]
  const y = first
    ? first.getBoundingClientRect().top - tb.top + first.getBoundingClientRect().height / 2
    : tb.height / 2
  geom.value = { xs, y, w: tb.width, h: tb.height }
}

// Per-step count tween: brief hold on 0, then linear climb. Writes straight to
// the DOM node so the tween stays smooth while the parent re-renders.
function startCount(i: number) {
  if (countStarted[i]) return
  countStarted[i] = true
  const el = countRefs.value[i]
  const value = COUNTS[i]!
  if (!el) return
  const HOLD = 320
  const PER_INT = 70
  const DUR = Math.max(650, Math.min(1700, value * PER_INT))
  let start: number | null = null
  const tick = (t: number) => {
    if (start == null) start = t
    const since = t - start
    let shown: number
    if (since < HOLD) shown = 0
    else shown = value * Math.min(1, (since - HOLD) / DUR)
    el.textContent = fmtFr(shown)
    if (since < HOLD + DUR) requestAnimationFrame(tick)
    else el.textContent = fmtFr(value)
  }
  requestAnimationFrame(tick)
}

function settleStatic() {
  p.value = 1
  measure()
  nextTick(() => COUNTS.forEach((_, i) => startCount(i)))
}

onMounted(() => {
  measure()
  ro = new ResizeObserver(measure)
  if (trackRef.value) ro.observe(trackRef.value)
  window.addEventListener('resize', measure)
  measureTimer = setTimeout(measure, 200)

  if (props.freeze != null) {
    p.value = props.freeze
    nextTick(() => COUNTS.forEach((_, i) => startCount(i)))
    return
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // On stacked layouts (≤1024px) the horizontal spine is hidden and the
  // sweep math no longer maps to the vertical stack — skip the frieze
  // animation and just present the blocks one after another, fully revealed.
  const stacked = window.matchMedia('(max-width: 1024px)').matches
  if (reduce || stacked || !('IntersectionObserver' in window)) {
    settleStatic()
    return
  }

  const DUR = 4500
  let started = false
  let animStart: number | null = null
  const loop = (now: number) => {
    if (animStart == null) animStart = now
    const t = Math.min(1, (now - animStart) / DUR)
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
    p.value = e
    // kick off counters as their step reveals
    COUNTS.forEach((_, i) => {
      if (stepReveal(i) > 0.25) startCount(i)
    })
    if (t < 1) raf = requestAnimationFrame(loop)
    else p.value = 1
  }

  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && !started) {
          started = true
          measure()
          raf = requestAnimationFrame(loop)
          io?.disconnect()
        }
      })
    },
    { threshold: 0.3 },
  )
  if (sectionRef.value) io.observe(sectionRef.value)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
  io?.disconnect()
  if (measureTimer) clearTimeout(measureTimer)
  window.removeEventListener('resize', measure)
})
</script>

<template>
  <section ref="sectionRef" class="section section--paper frieze">
    <div class="container frieze__inner">
      <div class="frieze__head">
        <h2 class="h-display h-display--m">Cinq étapes, une signature.</h2>
      </div>

      <div ref="trackRef" class="frieze__track">
        <!-- base rule + filling chromatic spine, anchored at dot centers -->
        <div v-if="geom" class="frieze__rails" aria-hidden="true" :style="{ height: geom.h + 'px' }">
          <div class="frieze__rail-base" :style="{ left: lineLeft + 'px', top: geom.y - 0.5 + 'px', width: lineSpan + 'px' }" />
          <div class="frieze__rail-fill" :style="{ left: lineLeft + 'px', top: geom.y - 1.5 + 'px', width: lineSpan * p + 'px' }" />
        </div>

        <div class="frieze__grid">
          <div v-for="(s, i) in STEPS" :key="s.n" class="frieze__col">
            <!-- dot row — fixed height, NOT transformed, so the line stays aligned -->
            <div class="frieze__dot-row">
              <span
                :ref="(el) => setDotRef(el as Element | null, i)"
                class="frieze__dot"
                :class="{ 'is-on': stepReveal(i) > 0.5 }"
              />
            </div>

            <!-- text block — reveals in stagger -->
            <div
              class="frieze__text"
              :style="{
                opacity: 0.1 + stepReveal(i) * 0.9,
                transform: `translateY(${(1 - stepReveal(i)) * 12}px)`,
              }"
            >
              <div class="frieze__num-row">
                <span class="frieze__num" :class="{ 'is-on': stepReveal(i) > 0.5 }">{{ s.n }}</span>
                <span
                  :ref="(el) => setCountRef(el as Element | null, i)"
                  class="frieze__count"
                  :class="{ 'is-last': i === 4 }"
                  :style="{ opacity: 0.25 + Math.min(1, stepReveal(i)) * 0.75 }"
                >· 0</span>
              </div>
              <div class="frieze__day">{{ s.day }}</div>
              <div class="frieze__step-title">{{ s.title }}</div>
              <p class="frieze__body">{{ s.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.frieze {
  padding: 120px 40px;
  position: relative;
  overflow: hidden;
}
.frieze__inner {
  position: relative;
}
.frieze__head {
  margin-bottom: 72px;
  max-width: 680px;
}
.frieze__track {
  position: relative;
}
.frieze__rails {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  pointer-events: none;
}
.frieze__rail-base {
  position: absolute;
  height: 1px;
  background: rgba(11, 13, 16, 0.14);
}
.frieze__rail-fill {
  position: absolute;
  height: 3px;
  background: var(--ink-900);
}
.frieze__grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  column-gap: 28px;
}
.frieze__col {
  display: flex;
  flex-direction: column;
}
.frieze__dot-row {
  height: 40px;
  display: flex;
  align-items: center;
}
.frieze__dot {
  width: 11px;
  height: 11px;
  border-radius: 999px;
  background: var(--paper-100);
  border: 1.5px solid rgba(11, 13, 16, 0.28);
  transition: background 200ms linear, border-color 200ms linear;
}
.frieze__dot.is-on {
  background: var(--ink-900);
  border-color: var(--ink-900);
}
.frieze__text {
  margin-top: 22px;
  transition: opacity 160ms linear, transform 160ms linear;
}
.frieze__num-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.frieze__num {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--fg-on-paper-4);
  transition: color 220ms linear;
}
.frieze__num.is-on {
  color: var(--fg-on-paper-1);
}
.frieze__count {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--fg-on-paper-3);
  font-variant-numeric: tabular-nums;
}
.frieze__count.is-last {
  color: var(--fg-on-paper-1);
}
.frieze__day {
  margin-top: 18px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg-on-paper-3);
}
.frieze__step-title {
  margin-top: 12px;
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--fg-on-paper-1);
}
.frieze__body {
  margin-top: 12px;
  font-size: 14.5px;
  line-height: 1.5;
  color: var(--fg-on-paper-2);
}

@media (max-width: 1024px) {
  .frieze__grid {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 48px;
  }
  /* On stacked layouts the frieze format is dropped: hide the horizontal spine
     and the per-step dots, and present each block as plain stacked content. */
  .frieze__rails,
  .frieze__dot-row {
    display: none;
  }
  .frieze__text {
    margin-top: 0;
  }
}

@media (max-width: 900px) {
  .frieze {
    padding: 80px 24px;
  }
  .frieze__head {
    margin-bottom: 48px;
  }
}

@media (max-width: 600px) {
  .frieze {
    padding: 64px 20px;
  }
  .frieze__grid {
    grid-template-columns: 1fr;
    row-gap: 40px;
  }
  .frieze__num {
    font-size: 32px;
  }
  .frieze__step-title {
    font-size: 22px;
  }
}
</style>
