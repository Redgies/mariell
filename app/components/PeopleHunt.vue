<script setup lang="ts">
import { STOCK_FIGS, type StockFig } from '~~/app/utils/silhouettes'

const VARIANTS_M = STOCK_FIGS.filter((x) => x.gender === 'm')
const VARIANTS_F = STOCK_FIGS.filter((x) => x.gender === 'f')

const sectionRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const crowdRef = ref<HTMLElement | null>(null)
const reticleRef = ref<HTMLElement | null>(null)
const reportRef = ref<HTMLElement | null>(null)
const reportHaloRef = ref<HTMLElement | null>(null)

const clockText = ref('00:00 CET')
const scannedText = ref('213 974')
const matchText = ref('7')

const rName = ref('—')
const rRole = ref('—')
const rId = ref('Réf. 000 000')
const rRarity = ref('1 sur 14 200')
const vPipe = ref(0)
const vClose = ref(0)
const vQuota = ref('0%')
const vFit = ref(0)

interface Walker {
  el: HTMLElement
  laneIdx: number
  dir: number
  x: number
  speed: number
  variant: StockFig
  gender: 'm' | 'f'
  scanned?: boolean
  origZ?: string
  origOpacity?: string
}

let walkers: Walker[] = []
let lanes: { y: number; scale: number; dim: number }[] = []
let hero: Walker | null = null
let zooming = false
let lastTime = 0
let scannedCount = 213974
let matchCount = 7
let nextTimer: ReturnType<typeof setTimeout> | null = null
let rafId: number | null = null
let clockIntervalId: ReturnType<typeof setInterval> | null = null
let resizeTimer: ReturnType<typeof setTimeout> | null = null
let isMounted = false
let isPaused = false

const SPEED = 106
function getDensity() {
  if (typeof window === 'undefined') return 17
  if (window.innerWidth < 640) return 9
  if (window.innerWidth < 1024) return 13
  return 17
}

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]
const fmtFr = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const NAMES = {
  fr: {
    m: ['Antoine','Louis','Hugo','Baptiste','Thibault','Maxime','Arthur','Victor','Romain','Pierre-Louis','Guillaume','Alexandre','Étienne','Gaspard','Raphaël'],
    f: ['Camille','Margaux','Élodie','Clémence','Inès','Charlotte','Léa','Juliette','Sophie','Alice','Marine','Anaïs','Amélie','Héloïse','Éléonore','Constance'],
    last: ['Lefèvre','Moreau','Dubois','Martin','Bernard','Rousseau','Laurent','Garnier','Fontaine','Beauchamp','Mercier','Chevalier','Leclerc','Dupont','Giraud','Vidal','Noël','Roche','Dumas','de Villiers',"d'Arcy",'Saint-Jean'],
  },
  arab: {
    m: ['Karim','Mehdi','Ibrahim','Youssef','Omar','Rayan','Nordine','Saïd','Hakim','Bilal','Anis'],
    f: ['Yasmine','Aïcha','Leila','Nawel','Amina','Sarah','Inès','Sofia','Nora'],
    last: ['Benali','El Amrani','Bensaïd','Kaddour','Khelifi','Belkacem','Haddad','Cherif','Ziani','Boukhari','Mansouri'],
  },
  african: {
    m: ['Mamadou','Amadou','Moussa','Ousmane','Ibrahima','Cheikh','Abdoulaye'],
    f: ['Fatou','Maïmouna','Aïssatou','Awa','Khadija','Binta'],
    last: ['Traoré','Diallo','Cisse','Ndiaye','Ouattara','Sow','Koné','Sarr','Camara','Diakité'],
  },
  intl: {
    m: ['Matteo','Oliver','Lucas'],
    f: ['Sofia','Nina','Elena'],
    last: ['Ferraro','Van der Berg','Karlsson','Romano','Lindqvist'],
  },
} as const

type Origin = keyof typeof NAMES
const ORIGINS: Origin[] = [
  'fr','fr','fr','fr','fr','fr','fr','fr','fr','fr','fr','fr',
  'intl','intl','intl',
  'arab','arab','arab',
  'african','african',
]

const ROLES = [
  'Business Developer · SaaS','Account Executive · Enterprise','Head of Sales · EMEA',
  'Sales Development Representative','VP Sales · Série B','Account Manager · Grands Comptes',
  'Business Developer · Fintech','Account Executive · Mid-Market','Head of Sales · France',
  'VP Sales · Scale-up','Account Manager · Luxe & Retail','SDR · Outbound',
]

const RARITY = ['1 sur 8 400','1 sur 12 200','1 sur 14 600','1 sur 19 800','1 sur 24 100']

function genDossier(gender: 'f' | 'm') {
  const pipe = Math.floor(rand(88, 99))
  const close = Math.floor(rand(90, 99))
  const quota = Math.floor(rand(108, 142))
  const fit = Math.floor(rand(94, 99))
  const origin = pick(ORIGINS)
  const pool = NAMES[origin]
  const firstName = pick(gender === 'f' ? pool.f : pool.m)
  const lastName = pick(pool.last)
  return {
    name: `${firstName} ${lastName}`,
    id: 'Réf. ' + String(Math.floor(rand(100000, 999999))).replace(/(\d{3})(\d{3})/, '$1 $2'),
    role: pick(ROLES),
    pipe, close, quota, fit,
    rarity: pick(RARITY),
  }
}

function setReport(d: ReturnType<typeof genDossier>) {
  rName.value = d.name
  rId.value = d.id
  rRole.value = d.role
  rRarity.value = d.rarity
  vPipe.value = d.pipe
  vClose.value = d.close
  vQuota.value = d.quota + '%'
  vFit.value = d.fit
  if (!reportRef.value) return
  reportRef.value.querySelectorAll<HTMLElement>('.ph-bar-inner').forEach((b) => { b.style.width = '0%' })
  requestAnimationFrame(() => {
    if (!reportRef.value) return
    const get = (k: string) => reportRef.value!.querySelector<HTMLElement>(`[data-k="${k}"]`)
    const p = get('pipe'); if (p) p.style.width = d.pipe + '%'
    const c = get('close'); if (c) c.style.width = d.close + '%'
    const q = get('quota'); if (q) q.style.width = Math.min(100, d.quota - 20) + '%'
    const f = get('fit'); if (f) f.style.width = d.fit + '%'
  })
}

function buildCrowd() {
  if (!crowdRef.value || !stageRef.value) return
  if (zooming) return
  crowdRef.value.innerHTML = ''
  walkers = []
  const H = stageRef.value.clientHeight
  const W = stageRef.value.clientWidth
  const density = getDensity()
  lanes = []
  const laneCount = 4
  for (let i = 0; i < laneCount; i++) {
    const t = i / (laneCount - 1)
    lanes.push({
      y: H * (0.46 + t * 0.40),
      scale: 0.55 + t * 0.70,
      dim: 0.40 + t * 0.55,
    })
  }
  for (let li = 0; li < laneCount; li++) {
    const lane = lanes[li]
    // Back lane (li === 0) gets 50% more density to look like a distant crowd.
    const laneDensityMult = li === 0 ? 1.5 : 1
    const count = Math.round(density * 0.68 * (0.7 + li * 0.15) * laneDensityMult)
    const spacing = (W * 1.2) / count
    for (let k = 0; k < count; k++) {
      // Per-walker direction (both directions coexist in each lane).
      const dir = Math.random() < 0.5 ? 1 : -1
      const el = document.createElement('div')
      // ~40% feminine weight among picks.
      const variant = Math.random() < 0.40 ? pick(VARIANTS_F) : pick(VARIANTS_M)
      const gender = variant.gender
      // Each silhouette faces 'r' in source (or 'l'). Flip when walker direction
      // opposes the silhouette's natural facing.
      const mustFlip = (variant.face === 'r' && dir < 0) || (variant.face === 'l' && dir > 0)
      el.className = 'ph-walker' + (mustFlip ? ' ph-flipped' : '')
      el.innerHTML = variant.svg
      el.dataset.gender = gender
      // Stock silhouettes use viewBox 160x300. Size proportionally — base width 64.
      const heightVar = 1 + Math.random() * 0.25
      const baseW = 64 * lane.scale * heightVar
      const baseH = baseW * (280 / 120)
      el.style.setProperty('--w', baseW + 'px')
      el.style.setProperty('--sy', '1')
      el.style.opacity = lane.dim.toFixed(2)
      el.style.top = (lane.y - baseH) + 'px'
      el.style.zIndex = String(10 + li)
      const jitter = rand(-spacing * 0.25, spacing * 0.25)
      const x = (dir > 0 ? -W * 0.1 : W * 1.1) + k * spacing * dir + jitter
      el.style.setProperty('--x', x + 'px')
      // Wider speed range + per-walker pace jitter
      const paceJitter = rand(0.75, 1.35)
      const spd = rand(12, 42) * lane.scale * paceJitter * (SPEED / 100)
      // Bob cadence correlated to speed.
      const bobPeriod = Math.max(0.45, Math.min(1.8, (baseH * 0.5) / spd))
      el.style.setProperty('--bob', bobPeriod.toFixed(2) + 's')
      crowdRef.value.appendChild(el)
      walkers.push({ el, laneIdx: li, dir, x, speed: spd, variant, gender })
    }
  }
}

function tick(now: number) {
  if (isPaused) { rafId = requestAnimationFrame(tick); return }
  const dt = Math.min(0.05, (now - lastTime) / 1000)
  lastTime = now
  const W = stageRef.value?.clientWidth ?? 0
  if (!zooming) {
    for (const w of walkers) {
      w.x += w.speed * w.dir * dt
      if (w.dir > 0 && w.x > W * 1.15) { w.x = -W * 0.15 - rand(0, 160); w.scanned = false }
      if (w.dir < 0 && w.x < -W * 0.15) { w.x = W * 1.15 + rand(0, 160); w.scanned = false }
      w.el.style.setProperty('--x', w.x + 'px')
    }
    scannedCount += Math.floor(rand(18, 52) * dt * 60)
    scannedText.value = fmtFr(scannedCount)
  }
  rafId = requestAnimationFrame(tick)
}

async function runScanSequence() {
  if (zooming || !isMounted || !stageRef.value || !crowdRef.value || !reticleRef.value || !reportRef.value || !reportHaloRef.value) return
  zooming = true

  const W = stageRef.value.clientWidth
  const cands = walkers.filter((w) => !w.scanned && w.laneIdx >= 2 && w.x > W * 0.28 && w.x < W * 0.72)
  const fallback = walkers.filter((w) => !w.scanned)
  const target = cands.length ? pick(cands) : (fallback.length ? pick(fallback) : null)
  if (!target) { zooming = false; scheduleNext(); return }
  hero = target
  hero.scanned = true

  // Freeze every walker except the hero — pauses bob too.
  for (const w of walkers) if (w !== hero) w.el.classList.add('ph-frozen')

  hero.origZ = hero.el.style.zIndex
  hero.origOpacity = hero.el.style.opacity
  hero.el.style.zIndex = '50'
  hero.el.style.opacity = '1'

  hero.el.classList.add('ph-hero')
  if (!hero.el.querySelector('.ph-aber.ph-left')) {
    const left = document.createElement('div')
    left.className = 'ph-aber ph-left'
    left.innerHTML = hero.variant.svg
    const right = document.createElement('div')
    right.className = 'ph-aber ph-right'
    right.innerHTML = hero.variant.svg
    hero.el.appendChild(left)
    hero.el.appendChild(right)
  }

  hero.el.classList.add('ph-flashing')
  await wait(420)
  if (!isMounted) return
  hero.el.classList.remove('ph-flashing')
  hero.el.classList.add('ph-active')

  const walkerRect = hero.el.getBoundingClientRect()
  const stageRect = stageRef.value.getBoundingClientRect()
  const cx = walkerRect.left + walkerRect.width / 2 - stageRect.left
  const cy = walkerRect.top + walkerRect.height * 0.5 - stageRect.top

  const zoomScale = 1.6
  crowdRef.value.style.transformOrigin = `${(cx / stageRect.width) * 100}% ${(cy / stageRect.height) * 100}%`
  crowdRef.value.style.transform = `scale(${zoomScale})`

  await wait(550)
  if (!isMounted) return

  reticleRef.value.style.left = cx + 'px'
  reticleRef.value.style.top = cy + 'px'
  // Size reticle to match the walker after zoom so tags float well above the head.
  const visualH = walkerRect.height * zoomScale
  const visualW = walkerRect.width * zoomScale
  reticleRef.value.style.height = visualH + 'px'
  reticleRef.value.style.width = Math.max(visualW * 1.8, 200) + 'px'
  reticleRef.value.classList.add('ph-on')

  const cardW = 300, cardH = 320, gap = 40
  const placeRight = (stageRect.width - cx) > cardW + gap + 60
  let rx = placeRight ? cx + 150 + gap : cx - 150 - gap - cardW
  rx = Math.max(16, Math.min(stageRect.width - cardW - 16, rx))
  const ry = Math.max(24, Math.min(stageRect.height - cardH - 24, cy - cardH / 2))

  reportRef.value.style.left = rx + 'px'
  reportRef.value.style.top = ry + 'px'
  reportRef.value.style.transform = `translateX(${placeRight ? '14px' : '-14px'})`
  reportHaloRef.value.style.left = (rx + cardW / 2) + 'px'
  reportHaloRef.value.style.top = (ry + cardH / 2) + 'px'
  reportHaloRef.value.classList.add('ph-on')

  setReport(genDossier(hero.gender))

  await wait(260)
  if (!isMounted) return
  reportRef.value.classList.add('ph-on')
  reportRef.value.style.transform = 'translateX(0)'
  matchCount++
  matchText.value = String(matchCount)

  await wait(3600)
  if (!isMounted) return
  reportRef.value.classList.remove('ph-on')
  reportHaloRef.value.classList.remove('ph-on')
  reticleRef.value.classList.remove('ph-on')

  await wait(620)
  if (!isMounted) return
  if (crowdRef.value) crowdRef.value.style.transform = 'scale(1)'

  await wait(1050)
  if (!isMounted) return

  if (hero) {
    hero.el.classList.remove('ph-hero', 'ph-active')
    hero.el.querySelectorAll('.ph-aber').forEach((n) => n.remove())
    hero.el.style.zIndex = hero.origZ || ''
    hero.el.style.opacity = hero.origOpacity || ''
  }
  for (const w of walkers) w.el.classList.remove('ph-frozen')
  hero = null
  zooming = false
  scheduleNext()
}

function scheduleNext() {
  if (nextTimer) clearTimeout(nextTimer)
  nextTimer = setTimeout(runScanSequence, rand(2800, 4200))
}

function updateClock() {
  const d = new Date()
  clockText.value = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} CET`
}

let visibilityIo: IntersectionObserver | null = null

function onResize() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(buildCrowd, 180)
}

function onVisibilityChange() {
  isPaused = document.hidden
  if (!isPaused) lastTime = performance.now()
}

onMounted(() => {
  isMounted = true
  updateClock()
  clockIntervalId = setInterval(updateClock, 30000)
  buildCrowd()
  lastTime = performance.now()
  rafId = requestAnimationFrame(tick)
  scheduleNext()
  window.addEventListener('resize', onResize)
  document.addEventListener('visibilitychange', onVisibilityChange)

  if (sectionRef.value) {
    visibilityIo = new IntersectionObserver(
      ([entry]) => {
        isPaused = !entry.isIntersecting
        if (!isPaused) lastTime = performance.now()
      },
      { threshold: 0 },
    )
    visibilityIo.observe(sectionRef.value)
  }
})

onBeforeUnmount(() => {
  isMounted = false
  if (rafId !== null) cancelAnimationFrame(rafId)
  if (nextTimer) clearTimeout(nextTimer)
  if (clockIntervalId) clearInterval(clockIntervalId)
  if (resizeTimer) clearTimeout(resizeTimer)
  visibilityIo?.disconnect()
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <section ref="sectionRef" class="ph-section">
    <div class="ph-frame">
      <header class="ph-chrome">
        <div />
        <div class="ph-meta">
          <span><span class="ph-dot" />Live Talent Map</span>
          <span>{{ clockText }}</span>
        </div>
      </header>

      <div ref="stageRef" class="ph-stage">
        <div ref="crowdRef" class="ph-crowd" />
        <div ref="reticleRef" class="ph-reticle">
          <div class="ph-rule-v" />
          <div class="ph-scanline" />
          <div class="ph-tag ph-top">Top Profile</div>
          <div class="ph-tag ph-best">Best Profile on Market</div>
        </div>
      </div>

      <div ref="reportHaloRef" class="ph-report-halo" />

      <aside ref="reportRef" class="ph-report">
        <div class="ph-eyebrow">Candidate Dossier</div>
        <h3 class="ph-name">{{ rName }}</h3>
        <p class="ph-role-text">{{ rRole }}</p>
        <span class="ph-id">{{ rId }}</span>
        <div class="ph-rule" />
        <div class="ph-row">
          <span class="ph-label">Soft Skills</span>
          <span class="ph-bar-outer"><span class="ph-bar-inner" data-k="pipe" /></span>
          <span class="ph-val">{{ vPipe }}</span>
        </div>
        <div class="ph-row">
          <span class="ph-label">Hard Skills</span>
          <span class="ph-bar-outer"><span class="ph-bar-inner" data-k="close" /></span>
          <span class="ph-val">{{ vClose }}</span>
        </div>
        <div class="ph-row">
          <span class="ph-label">Quota att.</span>
          <span class="ph-bar-outer"><span class="ph-bar-inner" data-k="quota" /></span>
          <span class="ph-val">{{ vQuota }}</span>
        </div>
        <div class="ph-row ph-gradient">
          <span class="ph-label">Fit Score</span>
          <span class="ph-bar-outer"><span class="ph-bar-inner" data-k="fit" /></span>
          <span class="ph-val">{{ vFit }}</span>
        </div>
        <div class="ph-footer-row">
          <span class="ph-verdict">Signal d'embauche</span>
          <span class="ph-rarity">{{ rRarity }}</span>
        </div>
      </aside>

      <footer class="ph-footer">
        <div class="ph-kicker">
          Les meilleurs Sales sont <em>rares</em>.<br />
          <span class="ph-sub">Nous les trouvons pour vous.</span>
        </div>
        <div class="ph-counter">
          <div>Profils scannés <span class="ph-n">{{ scannedText }}</span></div>
          <div>Signatures <span class="ph-m">{{ matchText }}</span></div>
        </div>
      </footer>
    </div>
  </section>
</template>

<style>
/* PeopleHunt — global styles namespaced under .ph- */
.ph-section {
  position: relative;
  width: 100%;
  padding: 0 1.25rem 5rem;
}

.ph-frame {
  position: relative;
  width: min(1100px, 100%);
  margin: 0 auto;
  aspect-ratio: 16 / 9;
  overflow: visible;
  font-family: var(--font-grotesk);
  color: #fff;
}

.ph-chrome {
  position: absolute; left: 0; right: 0; top: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px 32px;
  z-index: 10; pointer-events: none;
}
.ph-meta {
  display: flex; align-items: center; gap: 24px;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
  color: rgba(255,255,255,0.48); font-weight: 500;
}
.ph-dot {
  display: inline-block;
  width: 6px; height: 6px; border-radius: 50%;
  background: #E85EFF;
  margin-right: 8px; vertical-align: middle;
  box-shadow: 0 0 12px rgba(232,94,255,0.7);
  animation: ph-pulse 2.2s ease-in-out infinite;
}
@keyframes ph-pulse {
  0%,100% { opacity: 1; transform: scale(1); }
  50%      { opacity: .35; transform: scale(.7); }
}

.ph-footer {
  position: absolute; left: 0; right: 0; bottom: 0;
  display: flex; align-items: flex-end; justify-content: space-between;
  padding: 24px 32px;
  z-index: 10; pointer-events: none;
}
.ph-kicker {
  font-family: var(--font-serif-jp);
  font-size: 22px;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: #fff;
  font-weight: 500;
  max-width: 440px;
}
.ph-kicker em {
  font-style: italic;
  background: linear-gradient(135deg, #5EE7E7 0%, #8B5CF6 50%, #E85EFF 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.ph-kicker .ph-sub {
  display: block;
  color: rgba(255,255,255,0.48);
  font-style: italic;
}
.ph-counter {
  text-align: right;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.48);
  line-height: 1.8;
}
.ph-counter .ph-n { color: #fff; }
.ph-counter .ph-m {
  background: linear-gradient(135deg, #5EE7E7 0%, #8B5CF6 50%, #E85EFF 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 600;
}

/* Stage */
.ph-stage {
  position: absolute; inset: 0; overflow: visible;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
}
.ph-crowd {
  position: absolute; inset: 0;
  transform-origin: 50% 62%;
  transition: transform 1600ms cubic-bezier(0.65, 0, 0.35, 1);
  will-change: transform;
}

.ph-walker {
  position: absolute; top: 0;
  transform: translate3d(var(--x, 0), 0, 0);
  will-change: transform;
}
.ph-walker svg {
  display: block;
  width: var(--w, 48px);
  height: auto;
  transform-origin: center bottom;
  transform: scaleX(var(--sx, 1)) scaleY(var(--sy, 1));
}
.ph-walker .fig { fill: rgba(255, 255, 255, 0.32); transition: fill 500ms ease; }
.ph-walker.ph-flipped { --sx: -1; }
.ph-walker .bob {
  animation: ph-bob var(--bob, 1.1s) ease-in-out infinite;
  transform-origin: 50% 100%;
}
.ph-walker.ph-frozen .bob { animation-play-state: paused; }
@keyframes ph-bob {
  0%,100% { transform: translateY(0); }
  25% { transform: translateY(-5px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(-5px); }
}

/* Hero — chromatic-aberration overlay */
.ph-walker.ph-hero .fig { fill: #ffffff; }
.ph-walker.ph-hero .ph-aber {
  position: absolute; inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 400ms cubic-bezier(0.22, 1, 0.36, 1), transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
}
.ph-walker.ph-hero .ph-aber svg { width: var(--w, 48px); height: auto; display: block; }
.ph-walker.ph-hero .ph-aber.ph-left .fig  { fill: #7EEFEF; }
.ph-walker.ph-hero .ph-aber.ph-right .fig { fill: #FF3EA5; }
.ph-walker.ph-hero.ph-active .ph-aber { opacity: .9; }
.ph-walker.ph-hero.ph-active .ph-aber.ph-left  { transform: translateX(-3px); }
.ph-walker.ph-hero.ph-active .ph-aber.ph-right { transform: translateX(3px); }

.ph-walker.ph-hero.ph-flashing .fig {
  animation: ph-flash 0.40s steps(1, end) 1;
}
@keyframes ph-flash {
  0%   { fill: #E85EFF; filter: drop-shadow(0 0 14px rgba(232,94,255,0.85)); }
  50%  { fill: #5EE7E7; filter: drop-shadow(0 0 18px rgba(94,231,231,0.85)); }
  100% { fill: #ffffff; filter: none; }
}

/* Reticle */
.ph-reticle {
  position: absolute;
  width: 220px; height: 320px;
  transform: translate(-50%, -50%) scale(.96);
  pointer-events: none;
  opacity: 0;
  transition: opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 900ms cubic-bezier(0.65, 0, 0.35, 1);
  z-index: 8;
}
.ph-reticle.ph-on { opacity: 1; transform: translate(-50%, -50%) scale(1); }
.ph-reticle .ph-rule-v {
  position: absolute; top: 0; bottom: 0; left: 50%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.48), transparent);
  opacity: .35;
}
.ph-reticle .ph-scanline {
  position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(135deg, #5EE7E7 0%, #8B5CF6 50%, #E85EFF 100%);
  opacity: 0;
  top: 0;
  animation: ph-scan 2.6s cubic-bezier(.5,0,.5,1) infinite;
}
@keyframes ph-scan {
  0%   { top: 0;   opacity: 0; }
  12%  { opacity: .9; }
  50%  { top: 100%; opacity: .9; }
  62%  { opacity: 0; }
  100% { top: 0;   opacity: 0; }
}

/* Tags */
.ph-tag {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) 200ms,
              transform 800ms cubic-bezier(0.65, 0, 0.35, 1) 200ms;
}
.ph-tag.ph-top {
  top: -28px;
  transform: translate(-50%, -100%) translateY(8px);
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.48);
  font-weight: 500;
}
.ph-tag.ph-best {
  top: -28px;
  transform: translate(-50%, calc(-100% - 22px)) translateY(8px);
  font-family: var(--font-serif-jp);
  font-style: italic;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.01em;
  background: linear-gradient(135deg, #5EE7E7 0%, #8B5CF6 50%, #E85EFF 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.ph-reticle.ph-on .ph-tag.ph-top  { opacity: 1; transform: translate(-50%, -100%); }
.ph-reticle.ph-on .ph-tag.ph-best { opacity: 1; transform: translate(-50%, calc(-100% - 26px)); }

/* Halo behind dossier */
.ph-report-halo {
  position: absolute;
  width: 460px;
  height: 460px;
  pointer-events: none;
  z-index: 20;
  opacity: 0;
  transition: opacity 700ms cubic-bezier(0.22, 1, 0.36, 1);
  background: radial-gradient(
    closest-side,
    #000 0%,
    rgba(0,0,0,0.98) 40%,
    rgba(0,0,0,0.85) 60%,
    rgba(0,0,0,0.45) 78%,
    rgba(0,0,0,0.15) 90%,
    rgba(0,0,0,0)    100%
  );
  filter: blur(10px);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.ph-report-halo.ph-on { opacity: 1; }

/* Dossier card */
.ph-report {
  position: absolute;
  width: 300px;
  background: #0b0b0f;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 20px;
  padding: 22px 22px 20px;
  box-shadow:
    0 1px 0 rgba(255,255,255,0.04) inset,
    0 28px 70px rgba(0,0,0,0.7);
  opacity: 0;
  transition: opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 900ms cubic-bezier(0.65, 0, 0.35, 1);
  z-index: 21;
}
.ph-report::before {
  content: "";
  position: absolute;
  left: 20px; right: 20px; top: 0;
  height: 1px;
  background: linear-gradient(135deg, #5EE7E7 0%, #8B5CF6 50%, #E85EFF 100%);
  opacity: .5;
  border-radius: inherit;
}
.ph-report.ph-on { opacity: 1; }

.ph-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--font-grotesk);
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.48);
  font-weight: 500;
  margin-bottom: 10px;
}
.ph-eyebrow::before {
  content: ""; width: 18px; height: 1px; background: currentColor; opacity: .6;
}
.ph-name {
  font-family: var(--font-serif-jp);
  font-size: 28px;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: #fff;
  font-weight: 500;
  margin: 0 0 2px;
}
.ph-role-text {
  font-family: var(--font-grotesk);
  font-size: 13px;
  color: rgba(255,255,255,0.48);
  margin: 0;
}
.ph-id {
  display: block;
  margin-top: 10px;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  color: rgba(255,255,255,0.32);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.ph-rule {
  height: 1px; background: rgba(255,255,255,0.08);
  margin: 14px 0 12px;
}
.ph-row {
  display: grid;
  grid-template-columns: 100px 1fr 32px;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  font-family: var(--font-grotesk);
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
.ph-row .ph-label { color: rgba(255,255,255,0.48); font-weight: 500; }
.ph-row .ph-bar-outer {
  position: relative; height: 2px; background: rgba(255,255,255,0.18);
  border-radius: 1px; overflow: hidden;
}
.ph-row .ph-bar-inner {
  position: absolute; top: 0; left: 0; bottom: 0;
  background: #fff;
  width: 0%;
  transition: width 1000ms cubic-bezier(0.65, 0, 0.35, 1);
}
.ph-row.ph-gradient .ph-bar-inner {
  background: linear-gradient(135deg, #5EE7E7 0%, #8B5CF6 50%, #E85EFF 100%);
}
.ph-row .ph-val {
  font-family: var(--font-serif-jp);
  font-size: 17px;
  font-weight: 500;
  letter-spacing: 0;
  color: #fff;
  text-align: right;
  text-transform: none;
}
.ph-footer-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 14px;
}
.ph-verdict {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-grotesk);
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #fff;
  font-weight: 500;
}
.ph-verdict::before {
  content: "";
  width: 6px; height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5EE7E7 0%, #8B5CF6 50%, #E85EFF 100%);
  box-shadow: 0 0 10px rgba(139,92,246,0.6);
}
.ph-rarity {
  font-family: var(--font-serif-jp);
  font-style: italic;
  font-size: 13px;
  color: rgba(255,255,255,0.48);
}

@media (prefers-reduced-motion: reduce) {
  .ph-walker .bob,
  .ph-dot,
  .ph-reticle .ph-scanline {
    animation: none;
  }
}
</style>
