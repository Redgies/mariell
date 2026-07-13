<script setup lang="ts">
// @ts-nocheck
// Native Vue port of the "People Hunt — Live Talent Map" animation that used
// to live in an <iframe> (public/people-hunt/people-hunt.html). Rendering it
// inline removes the iframe's off-screen media throttling and lets it share the
// page's compositor. The legacy iframe is kept as a fallback in HeroSection.vue
// (flip `peopleHuntMode` there) in case we need to switch back.
//
// The heavy imperative animation logic is transplanted almost verbatim from the
// original standalone document: walkers are real <video> silhouettes created in
// JS and appended to the crowd container, so styling MUST be global (scoped
// styles never reach dynamically-created nodes) — hence every selector is
// `.ph-`-prefixed to avoid leaking into the site.

const rootEl = ref<HTMLElement | null>(null)

// The dossier + chrome fonts (Cormorant Garamond / Geist / DM Mono) match the
// original iframe look. Loaded only while this component is mounted; the rest of
// the site stays on its own families.
useHead({
  link: [{
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Geist:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap',
  }],
})

let cleanup: (() => void) | null = null

onMounted(() => {
  const root = rootEl.value
  if (!root) return
  cleanup = startPeopleHunt(root)
})
onBeforeUnmount(() => { cleanup?.(); cleanup = null })

function startPeopleHunt(root) {
  const byId = (id) => root.querySelector('#' + id)

  // Real silhouette videos with alpha channel (pre-inverted → white silhouettes).
  const STOCK_VIDEOS = [
    { gender: 'm', type: 'walk',   src: '/people-hunt/uploads/silhouette-man-walking-alpha-channel-2026-02-18-08-51-05-utc.webm' },
    { gender: 'm', type: 'phone',  src: '/people-hunt/uploads/silhouette-man-walking-while-talking-on-phone-2026-02-18-08-04-49-utc.webm' },
    { gender: 'm', type: 'suit',   src: '/people-hunt/uploads/silhouette-of-a-business-man-walking-towards-camer-2026-02-18-05-33-31-utc.webm' },
    { gender: 'm', type: 'casual', src: '/people-hunt/uploads/silhouette-man-in-casual-walking-alpha-channel-2026-02-18-08-55-17-utc.webm' },
    { gender: 'm', type: 'coat',   src: '/people-hunt/uploads/silhouette-man-in-coat-walking-alpha-channel-2026-02-18-15-02-25-utc.webm' },
    { gender: 'm', type: 'doctor', src: '/people-hunt/uploads/silhouette-doctor-walking-alpha-channel-2026-02-18-15-12-53-utc.webm' },
    { gender: 'm', type: 'walk',   src: '/people-hunt/uploads/silhouette-scene-alpha-channel-2026-02-18-09-56-28-utc.webm' },
    { gender: 'f', type: 'walk',   src: '/people-hunt/uploads/silhouette-woman-walking-alpha-channel-2026-02-18-08-30-46-utc-fd22a4c8.webm' },
    { gender: 'f', type: 'suit',   src: '/people-hunt/uploads/silhouette-beautiful-sexy-brunette-woman-business-2026-02-18-13-34-33-utc (1).webm' },
    { gender: 'f', type: 'walk',   src: '/people-hunt/uploads/silhouette-woman-walking-alpha-channel-2026-02-18-04-54-50-utc (1).webm' },
    { gender: 'f', type: 'casual', src: '/people-hunt/uploads/silhouette-woman-walking-alpha-channel-2026-02-18-07-42-12-utc (1).webm' },
  ]

  const VARIANTS = STOCK_VIDEOS

  const crowdEl = byId('crowd')
  const stageEl = byId('stage')
  const reticleEl = byId('reticle')
  const reportEl = byId('report')
  const cScan = byId('c-scan')
  const cMatch = byId('c-match')

  let walkers = [], hero = null, zooming = false
  const DURATIONS = new Map()
  let last = performance.now()
  let scannedCount = 213974
  let matchCount = 7
  let nextTimer = null
  let rafId = 0
  let rT = null
  let destroyed = false

  const rand = (a, b) => a + Math.random() * (b - a)
  const pick = a => a[Math.floor(Math.random() * a.length)]
  const fmtFr = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  function easeInPerspective(p) {
    return Math.pow(p, 1.42)
  }

  function walkerGeometry(w) {
    const stageH = stageEl.clientHeight
    const stageW = stageEl.clientWidth
    const p = easeInPerspective(w.progress)
    const minH = stageH * 0.20
    const maxH = stageH * 0.92
    const h = minH + (maxH - minH) * p
    const yStart = stageH * 0.52
    const yEnd = stageH * 1.32
    const yFeet = yStart + (yEnd - yStart) * p
    const xCenter = stageW * 0.5 + w.xDrift * stageW * 0.48
    return { h, yFeet, xCenter, p }
  }

  function applyWalkerStyle(w) {
    const g = walkerGeometry(w)
    const REF_H = 200, REF_W = 356
    const sc = g.h / REF_H
    const tx = g.xCenter - (REF_W * sc) / 2
    const ty = g.yFeet - g.h
    w.el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${sc.toFixed(4)})`
    w.el.style.zIndex = Math.floor(g.p * 200) + 10
    if (w.el._debugTag) {
      const t = w.el._debugTag
      if (!t.parentNode) crowdEl.appendChild(t)
      t.style.left = g.xCenter.toFixed(0) + 'px'
      t.style.top = (g.yFeet + 6).toFixed(0) + 'px'
      t.style.display = w.progress < 0 ? 'none' : 'block'
      t.style.zIndex = 9999
    }
    if (w.progress < 0) { w.el.style.setProperty('--alpha', '0'); return }
    const depthDim = 0.62 + 0.38 * g.p
    const smooth = t => t * t * t * (t * (t * 6 - 15) + 10)
    const fadeIn = phEntering ? 1 : smooth(Math.max(0, Math.min(1, w.progress / 0.32)))
    const fadeOut = smooth(Math.max(0, Math.min(1, (1.08 - w.progress) / 0.42)))
    const paintFade = w._painted
      ? smooth(Math.max(0, Math.min(1, (performance.now() - w._paintAt) / 300)))
      : 0
    const alpha = depthDim * Math.min(fadeIn, fadeOut) * paintFade
    w.el.style.setProperty('--alpha', alpha.toFixed(3))
  }

  function pickXDriftSpread(refProgress, depthWindow = 2.0) {
    const LO = -0.62, HI = 0.62
    const SLOTS = 18
    const slotWidth = (HI - LO) / SLOTS
    const others = walkers.filter(o =>
      Math.abs(o.progress - refProgress) < depthWindow)
    const cost = new Array(SLOTS).fill(0)
    for (const o of others) {
      const f = (o.xDrift - LO) / (HI - LO)
      const oi = Math.max(0, Math.min(SLOTS - 1, Math.floor(f * SLOTS)))
      const fwd = Math.max(refProgress, o.progress)
      const radius = 2 + Math.round(7 * Math.max(0, fwd))
      const w = 1
      for (let s = 0; s < SLOTS; s++) {
        const ld = Math.abs(s - oi)
        if (ld > radius) continue
        const laneW = 1 - (ld / (radius + 1))
        cost[s] += laneW * w
      }
    }
    const minCost = Math.min(...cost)
    const candidates = []
    for (let i = 0; i < SLOTS; i++) if (cost[i] <= minCost + 1e-6) candidates.push(i)
    const chosen = pick(candidates)
    const slotMin = LO + chosen * slotWidth + slotWidth * 0.25
    const slotMax = slotMin + slotWidth * 0.50
    return rand(slotMin, slotMax)
  }

  function pickFreshVariant(exceptWalker) {
    const usedAll = new Set(
      walkers
        .filter(o => o !== exceptWalker)
        .map(o => o.variant.src)
    )
    const freeAll = VARIANTS.filter(v => !usedAll.has(v.src))
    if (freeAll.length > 0) {
      const vis = walkers.filter(o => o !== exceptWalker && o.progress >= 0)
      const visTypes = new Set(vis.map(o => o.variant && o.variant.type))
      const recent = window._phRecent || (window._phRecent = [])
      let pool = freeAll.filter(v => !visTypes.has(v.type) && !recent.includes(v.src))
      if (!pool.length) pool = freeAll.filter(v => !visTypes.has(v.type))
      if (!pool.length) pool = freeAll.filter(v => !recent.includes(v.src))
      if (!pool.length) pool = freeAll
      const chosen = pick(pool)
      recent.push(chosen.src)
      while (recent.length > 4) recent.shift()
      return chosen
    }
    const usedVisible = new Set(
      walkers
        .filter(o => o !== exceptWalker && o.progress >= 0)
        .map(o => o.variant.src)
    )
    const freeVisible = VARIANTS.filter(v => !usedVisible.has(v.src))
    if (freeVisible.length > 0) return pick(freeVisible)
    return pick(VARIANTS)
  }

  function spawnWalker(progressInit) {
    const variant = pickFreshVariant(null)
    const v = document.createElement('video')
    v.src = variant.src
    v.muted = true
    v.loop = false
    v.playsInline = true
    v.preload = 'auto'
    v.disablePictureInPicture = true
    v.disableRemotePlayback = true
    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    v.className = 'ph-walker'
    v.dataset.gender = variant.gender
    if (window.PH_DEBUG) {
      const tag = document.createElement('div')
      tag.className = 'ph-debug-tag'
      const fname = variant.src.split('/').pop().replace('.webm', '')
      tag.textContent = (variant.type ? '[' + variant.type + '] ' : '') + fname
      v._debugTag = tag
    }
    v.addEventListener('ended', () => { try { v.pause(); v.currentTime = Math.max(0, (v.duration || 0) - 0.04) } catch (e) {} })
    crowdEl.appendChild(v)
    const xDrift = pickXDriftSpread(progressInit)
    const cachedDur = DURATIONS.get(variant.src)
    const w = {
      el: v,
      variant,
      gender: variant.gender,
      progress: progressInit,
      speed: 0,
      xDrift,
      jitter: rand(1.08, 1.13),
      _videoStarted: progressInit >= 0,
      scanned: false,
      _painted: false,
      _paintAt: 0,
    }
    w._armPaint = () => {
      w._painted = false
      w._paintAt = 0
      const mark = () => { if (!w._painted) { w._painted = true; w._paintAt = performance.now() } }
      if (typeof w.el.requestVideoFrameCallback === 'function') {
        w.el.requestVideoFrameCallback(() => mark())
      } else if (w.el.readyState >= 2) {
        mark()
      } else {
        w.el.addEventListener('loadeddata', mark, { once: true })
      }
    }
    w._armPaint()
    if (progressInit >= 0) {
      const setStart = (dur) => { try { v.currentTime = Math.max(0, Math.min(progressInit / 1.15, 0.98)) * dur } catch (e) {} }
      const cd = DURATIONS.get(variant.src)
      if (cd && cd > 0) setStart(cd)
      v.play().catch(() => {})
    }
    v.addEventListener('pause', () => {
      if (v.ended) return
      const legit = w.progress < 0 || w === hero || v.classList.contains('hidden-during-scan')
      if (!legit && w._videoStarted) {
        requestAnimationFrame(() => { if (!destroyed && !v.ended && w.progress >= 0 && w !== hero && !v.classList.contains('hidden-during-scan')) v.play().catch(() => {}) })
      }
    })
    if (cachedDur && cachedDur > 0) syncWalkerToVideo(w, cachedDur)
    v.addEventListener('loadedmetadata', () => {
      if (v.duration > 0 && isFinite(v.duration)) {
        DURATIONS.set(v.currentSrc || w.variant.src, v.duration)
        syncWalkerToVideo(w, v.duration)
        if (w.progress >= 0 && !w._seeked) {
          w._seeked = true
          try { v.currentTime = Math.max(0, Math.min(w.progress / 1.15, 0.98)) * v.duration } catch (e) {}
        }
      }
      if (w.progress >= 0) v.play().catch(() => {})
    })
    applyWalkerStyle(w)
    return w
  }

  function syncWalkerToVideo(w, duration) {
    const trav = Math.min(9.6, (duration || 12) * 0.92)
    w.speed = 1.15 / trav
  }

  function recycleWalker(w) {
    const variant = pickFreshVariant(w)
    w.variant = variant
    w.gender = variant.gender
    w.el.src = variant.src
    w.el.dataset.gender = variant.gender
    if (w._armPaint) w._armPaint()
    const stageH = stageEl.clientHeight, stageW = stageEl.clientWidth
    const proj = (progress, xDrift) => {
      const p = easeInPerspective(Math.max(0, progress))
      const h = stageH * (0.20 + 0.72 * p)
      const y = (stageH * 0.52) + (stageH * 1.32 - stageH * 0.52) * p - h * 0.5
      const x = stageW * 0.5 + xDrift * stageW * 0.48
      return { x, y, w: h * 0.42, h }
    }
    let bestProg = -0.06, bestDrift = 0, bestScore = -Infinity
    for (let i = 0; i < 14; i++) {
      const cand = rand(-0.65, -0.02)
      const drift = pickXDriftSpread(cand)
      const a = proj(cand, drift)
      let minSep = Infinity
      for (const o of walkers) {
        if (o === w) continue
        const b = proj(o.progress, o.xDrift)
        const dx = Math.abs(a.x - b.x) / ((a.w + b.w) * 0.5 + 1)
        const dy = Math.abs(a.y - b.y) / ((a.h + b.h) * 0.35 + 1)
        const sep = Math.min(dx, dy)
        if (sep < minSep) minSep = sep
      }
      if (minSep > bestScore) { bestScore = minSep; bestProg = cand; bestDrift = drift }
    }
    w.progress = bestProg
    w.xDrift = bestDrift
    w.jitter = rand(1.08, 1.13)
    w._videoStarted = false
    try { w.el.pause() } catch (e) {}
    try { w.el.currentTime = 0 } catch (e) {}
    const knownDur = DURATIONS.get(variant.src)
    if (knownDur && knownDur > 0) {
      syncWalkerToVideo(w, knownDur)
    } else {
      w.speed = 0
    }
    w.el.addEventListener('loadedmetadata', function onMeta() {
      w.el.removeEventListener('loadedmetadata', onMeta)
      const d = w.el.duration
      if (d > 0 && isFinite(d)) { DURATIONS.set(variant.src, d); syncWalkerToVideo(w, d) }
    })
    w.scanned = false
  }

  let phEntering = false

  function buildCrowd() {
    crowdEl.innerHTML = ''
    walkers = []
    const target = 6
    const SPAN_LO = -0.35, SPAN_HI = 1.0
    const LANE_LO = -0.58, LANE_HI = 0.58
    const laneOrder = []
    for (let i = 0; i < target; i++) laneOrder.push(i)
    for (let i = laneOrder.length - 1; i > 0; i--) { const j = Math.floor(rand(0, i + 1));[laneOrder[i], laneOrder[j]] = [laneOrder[j], laneOrder[i]] }
    for (let i = 0; i < target; i++) {
      const frac = (i + 0.5 + rand(-0.22, 0.22)) / target
      const p = SPAN_LO + (SPAN_HI - SPAN_LO) * frac
      const w = spawnWalker(p)
      const laneFrac = (laneOrder[i] + 0.5) / target
      w.xDrift = LANE_LO + (LANE_HI - LANE_LO) * laneFrac + rand(-0.03, 0.03)
      walkers.push(w)
    }
    let seed = walkers[0], best = Infinity
    for (const w of walkers) {
      const d = Math.abs(w.progress - 0.64)
      if (d < best) { best = d; seed = w }
    }
    seed.progress = 0.64
    seed.xDrift = 0.30
    syncVideoTimeToProgress(seed)
    const DEPTH_NEAR = 0.24, LANE_NEAR = 0.16
    for (let pass = 0; pass < 4; pass++) {
      for (let a = 0; a < walkers.length; a++) {
        for (let b = a + 1; b < walkers.length; b++) {
          const wa = walkers[a], wb = walkers[b]
          if (Math.abs(wa.progress - wb.progress) < DEPTH_NEAR &&
            Math.abs(wa.xDrift - wb.xDrift) < LANE_NEAR) {
            let bestX = wb.xDrift, bestGap = -Infinity
            for (let s = 0; s < 24; s++) {
              const cx = LANE_LO + (LANE_HI - LANE_LO) * (s / 23)
              let gap = Infinity
              for (const o of walkers) {
                if (o === wb) continue
                if (Math.abs(o.progress - wb.progress) < DEPTH_NEAR) gap = Math.min(gap, Math.abs(cx - o.xDrift))
              }
              if (gap > bestGap) { bestGap = gap; bestX = cx }
            }
            wb.xDrift = bestX
          }
        }
      }
    }
  }

  function syncVideoTimeToProgress(w) {
    try {
      const dur = w.el.duration || DURATIONS.get(w.variant.src)
      if (dur && isFinite(dur) && dur > 0) {
        const frac = Math.max(0, Math.min(0.94, (w.progress / 1.15) * 0.96))
        w.el.currentTime = frac * dur
      }
    } catch (e) {}
  }

  let scanAccum = 0
  let wdAccum = 0

  function tick(now) {
    if (destroyed) return
    const rawGap = now - last
    const dt = Math.min(0.05, rawGap / 1000)
    last = now
    wdAccum += rawGap
    if (rawGap > 220 || wdAccum >= 160) {
      wdAccum = 0
      for (const w of walkers) {
        if (w.progress < 0 || w.progress > 1.15) continue
        if (w === hero) continue
        if (w.el.classList.contains('hidden-during-scan')) continue
        const v = w.el
        const dur = v.duration || DURATIONS.get(w.variant && w.variant.src) || 0
        if (v.ended || (dur && v.currentTime >= dur - 0.06)) {
          try { syncVideoTimeToProgress(w) } catch (e) {}
        }
        if (v.paused) { w._videoStarted = true; v.play().catch(() => {}) }
      }
    }
    if (!zooming) {
      for (const w of walkers) {
        const wasQueued = w.progress < 0
        w.progress += w.speed * dt
        if (wasQueued && w.progress >= 0 && !w._videoStarted) {
          w._videoStarted = true
          w.el.play().catch(() => {})
          // Restart the paint-gate clock at the crossing moment. The queued clip
          // already painted its frame 0 during preload, so paintFade would be
          // saturated → the walker would POP into view. Re-stamping _paintAt to
          // now gives it its full ~300ms fade-in as it rises past the horizon.
          w._painted = true
          w._paintAt = performance.now()
        }
        if (w.progress > 1.08) recycleWalker(w)
        if (w.progress >= 0 && w.el.paused && !w.el.ended && w !== hero &&
          !w.el.classList.contains('hidden-during-scan')) {
          w._videoStarted = true
          w.el.play().catch(() => {})
        }
        applyWalkerStyle(w)
      }
      const MIN_VISIBLE = 4
      let visible = 0
      for (const w of walkers) if (w.progress >= 0 && w.progress <= 1.15) visible++
      if (visible < MIN_VISIBLE) {
        let cand = null
        for (const w of walkers) {
          if (w.progress < 0 && (!cand || w.progress > cand.progress)) cand = w
        }
        if (cand) {
          cand.progress = 0.005
          syncVideoTimeToProgress(cand)
          if (!cand._videoStarted) { cand._videoStarted = true; cand.el.play().catch(() => {}) }
          // Same anti-pop reset: this walker is yanked into view instantly, so
          // restart its fade clock or it appears without a fondu.
          cand._painted = true
          cand._paintAt = performance.now()
        }
      }
      scannedCount += Math.floor(rand(18, 52) * dt * 60)
      scanAccum += dt
      if (scanAccum >= 0.2) { scanAccum = 0; cScan.textContent = fmtFr(scannedCount) }
    }
    rafId = requestAnimationFrame(tick)
  }

  function updateClock() {
    const d = new Date()
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    byId('clock').textContent = `${hh}:${mm} CET`
  }
  updateClock()
  const clockInterval = setInterval(updateClock, 30000)

  const NAMES = {
    fr: {
      m: ['Antoine', 'Louis', 'Hugo', 'Baptiste', 'Thibault', 'Maxime', 'Arthur', 'Victor', 'Romain', 'Pierre-Louis', 'Guillaume', 'Alexandre', 'Étienne', 'Gaspard', 'Raphaël'],
      f: ['Camille', 'Margaux', 'Élodie', 'Clémence', 'Inès', 'Charlotte', 'Léa', 'Juliette', 'Sophie', 'Alice', 'Marine', 'Anaïs', 'Amélie', 'Héloïse', 'Éléonore', 'Constance'],
      last: ['Lefèvre', 'Moreau', 'Dubois', 'Martin', 'Bernard', 'Rousseau', 'Laurent', 'Garnier', 'Fontaine', 'Beauchamp', 'Mercier', 'Chevalier', 'Leclerc', 'Dupont', 'Giraud', 'Vidal', 'Noël', 'Roche', 'Dumas', 'de Villiers', "d'Arcy", 'Saint-Jean']
    },
    arab: {
      m: ['Karim', 'Mehdi', 'Ibrahim', 'Youssef', 'Omar', 'Rayan', 'Nordine', 'Saïd', 'Hakim', 'Bilal', 'Anis', 'Tarek'],
      f: ['Yasmine', 'Aïcha', 'Leila', 'Nawel', 'Amina', 'Sarah', 'Inès', 'Sofia', 'Nora'],
      last: ['Benali', 'El Amrani', 'Bensaïd', 'Kaddour', 'Khelifi', 'Belkacem', 'Haddad', 'Cherif', 'Ziani', 'Boukhari', 'Mansouri']
    },
    african: {
      m: ['Mamadou', 'Amadou', 'Moussa', 'Ousmane', 'Ibrahima', 'Cheikh', 'Abdoulaye'],
      f: ['Fatou', 'Maïmouna', 'Aïssatou', 'Awa', 'Khadija', 'Binta'],
      last: ['Traoré', 'Diallo', 'Cisse', 'Ndiaye', 'Ouattara', 'Sow', 'Koné', 'Sarr', 'Camara', 'Diakité']
    },
    intl: {
      m: ['Matteo', 'Oliver', 'Lucas'],
      f: ['Sofia', 'Nina', 'Elena'],
      last: ['Ferraro', 'Van der Berg', 'Karlsson', 'Romano', 'Lindqvist']
    },
    asian: {
      m: ['Kenji', 'Hiroshi', 'Wei', 'Minjun', 'Haruto', 'Jun'],
      f: ['Mei', 'Yuki', 'Hana', 'Linh', 'Soo-jin', 'Aiko', 'Lan'],
      last: ['Nakamura', 'Tanaka', 'Chen', 'Kim', 'Wang', 'Nguyen', 'Lee', 'Sato', 'Park', 'Liu']
    }
  }
  const ORIGINS = [
    'fr', 'fr', 'fr', 'fr', 'fr', 'fr', 'fr', 'fr', 'fr', 'fr', 'fr', 'fr', 'fr',
    'intl', 'intl', 'intl',
    'arab', 'arab',
    'african',
    'asian'
  ]
  const ROLES = [
    'Business Developer · SaaS',
    'Account Executive · Enterprise',
    'Head of Sales · EMEA',
    'Sales Development Representative',
    'VP Sales · Série B',
    'Account Manager · Grands Comptes',
    'Business Developer · Fintech',
    'Account Executive · Mid-Market',
    'Head of Sales · France',
    'VP Sales · Scale-up',
    'Account Manager · Luxe & Retail',
    'SDR · Outbound'
  ]
  const RARITY = ['1 sur 8 400', '1 sur 12 200', '1 sur 14 600', '1 sur 19 800', '1 sur 24 100']

  function genDossier(gender) {
    const pipe = Math.floor(rand(88, 99))
    const close = Math.floor(rand(90, 99))
    const quota = Math.floor(rand(108, 142))
    const fit = Math.floor(rand(94, 99))
    const origin = pick(ORIGINS)
    const pool = NAMES[origin]
    const first = pick(gender === 'f' ? pool.f : pool.m)
    const last = pick(pool.last)
    return {
      name: first + ' ' + last,
      id: 'Réf. ' + String(Math.floor(rand(100000, 999999))).replace(/(\d{3})(\d{3})/, '$1 $2'),
      role: pick(ROLES),
      pipe, close, quota, fit,
      rarity: pick(RARITY)
    }
  }

  function setReport(d) {
    byId('r-name').textContent = d.name
    byId('r-id').textContent = d.id
    byId('r-role').textContent = d.role
    byId('r-rarity').textContent = d.rarity
    byId('v-pipe').textContent = d.pipe
    byId('v-close').textContent = d.close
    byId('v-quota').textContent = d.quota + '%'
    byId('v-fit').textContent = d.fit
    reportEl.querySelectorAll('.ph-bar-inner').forEach(b => b.style.width = '0%')
    requestAnimationFrame(() => {
      reportEl.querySelector('[data-k="pipe"]').style.width = d.pipe + '%'
      reportEl.querySelector('[data-k="close"]').style.width = d.close + '%'
      reportEl.querySelector('[data-k="quota"]').style.width = Math.min(100, d.quota - 20) + '%'
      reportEl.querySelector('[data-k="fit"]').style.width = d.fit + '%'
    })
  }

  async function runScanSequence() {
    if (zooming || destroyed) return
    zooming = true

    const laneOK = (x, pad) => (x >= -0.372 - pad && x < 0.0) || (x >= 0.124)
    const cands = walkers.filter(w =>
      !w.scanned && w.progress > 0.70 && w.progress < 0.80 && laneOK(w.xDrift, 0))
    const fallback = walkers.filter(w =>
      !w.scanned && w.progress > 0.64 && w.progress < 0.84 && laneOK(w.xDrift, 0.02))
    const target = cands.length ? pick(cands) : (fallback.length ? pick(fallback) : null)
    if (!target) { zooming = false; scheduleNext(); return }
    hero = target
    hero.scanned = true

    try { hero.el.pause() } catch (e) {}
    const heroBox = hero.el.getBoundingClientRect()
    for (const w of walkers) {
      if (w === hero) continue
      const b = w.el.getBoundingClientRect()
      const overlaps =
        b.right > heroBox.left + 12 &&
        b.left < heroBox.right - 12 &&
        b.bottom > heroBox.top + 12 &&
        b.top < heroBox.bottom - 12
      if (overlaps) w.el.classList.add('hidden-during-scan')
      else if (w.progress < 0.22) w.el.classList.add('hidden-during-scan')
      else w.el.classList.add('dimmed')
      if (w.el.classList.contains('hidden-during-scan')) { try { w.el.pause() } catch (e) {} }
    }

    hero._origZ = hero.el.style.zIndex
    hero._origOpacity = hero.el.style.opacity
    hero.el.style.zIndex = 50
    hero.el.style.opacity = 1

    hero.el.classList.add('hero')
    const t = Math.max(0, Math.min(1, (hero.progress - 0.4) / 0.6))
    const k = 1 - 0.7 * t
    hero.el.style.setProperty('--aber-offset', (2 * k).toFixed(1) + 'px')
    hero.el.style.setProperty('--halo-white', (7 * k).toFixed(1) + 'px')
    hero.el.style.setProperty('--halo-purple', (18 * k).toFixed(1) + 'px')
    hero.el.style.setProperty('--aber-alpha', (0.7 * k).toFixed(2))
    hero.el.style.setProperty('--halo-white-alpha', (0.28 * k).toFixed(2))
    hero.el.style.setProperty('--halo-purple-alpha', (0.42 * k).toFixed(2))
    hero.el.classList.add('flashing')
    await wait(420)
    if (destroyed) return
    hero.el.classList.remove('flashing')

    const walkerRect = hero.el.getBoundingClientRect()
    const stageRect = stageEl.getBoundingClientRect()
    let figureXFraction = 0.5
    try {
      const v = hero.el
      if (v.videoWidth > 0 && v.videoHeight > 0) {
        const sampleW = 64
        const sampleH = 96
        const c = document.createElement('canvas')
        c.width = sampleW; c.height = sampleH
        const ctx = c.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(v, 0, 0, sampleW, sampleH)
        const data = ctx.getImageData(0, 0, sampleW, sampleH).data
        let weightedX = 0, totalWeight = 0
        for (let y = 0; y < sampleH * 0.7; y++) {
          for (let x = 0; x < sampleW; x++) {
            const a = data[(y * sampleW + x) * 4 + 3]
            if (a > 16) { weightedX += x * a; totalWeight += a }
          }
        }
        if (totalWeight > 0) figureXFraction = (weightedX / totalWeight) / sampleW
      }
    } catch (e) { /* canvas tainting or video not ready — fall back to center */ }

    const cx = walkerRect.left + walkerRect.width * figureXFraction - stageRect.left
    const cy = walkerRect.top + walkerRect.height * 0.5 - stageRect.top

    const zoomScale = 1.32
    const originX = (cx / stageRect.width) * 100
    const originY = (cy / stageRect.height) * 100
    crowdEl.style.transformOrigin = originX + '% ' + originY + '%'
    crowdEl.style.transform = `scale(${zoomScale})`

    await wait(550)
    if (destroyed) return

    reticleEl.style.left = cx + 'px'
    reticleEl.style.top = cy + 'px'
    const visualH = walkerRect.height * zoomScale
    const visualW = walkerRect.width * zoomScale
    reticleEl.style.height = visualH + 'px'
    reticleEl.style.width = Math.max(visualW * 1.8, 200) + 'px'
    reticleEl.classList.add('on')

    const cardW = 300, cardH = 320, gap = 40
    const placeRight = (hero.xDrift >= -0.40 && hero.xDrift < 0.0)
    let rx = placeRight ? (cx + 150 + gap) : (cx - 150 - gap - cardW)
    rx = Math.max(16, Math.min(stageRect.width - cardW - 16, rx))
    const ry = Math.max(24, Math.min(stageRect.height - cardH - 24, cy - cardH / 2))
    reportEl.style.left = rx + 'px'
    reportEl.style.top = ry + 'px'
    reportEl.style.transform = 'translateX(' + (placeRight ? '14px' : '-14px') + ')'

    const haloEl = byId('report-halo')
    haloEl.style.left = (rx + cardW / 2) + 'px'
    haloEl.style.top = (ry + cardH / 2) + 'px'
    haloEl.classList.add('on')

    setReport(genDossier(hero.gender))

    await wait(260)
    if (destroyed) return
    reportEl.classList.add('on')
    reportEl.style.transform = 'translateX(0)'

    matchCount += 1
    cMatch.textContent = matchCount

    await wait(3000)
    if (destroyed) return

    const toResume = walkers.filter(w => w === hero || w.progress >= 0)
    for (const w of toResume) { try { w.el.play() } catch (e) {} }

    await wait(450)
    if (destroyed) return

    reportEl.classList.remove('on')
    byId('report-halo').classList.remove('on')
    reticleEl.classList.remove('on')

    crowdEl.style.transform = 'scale(1)'
    if (hero) {
      hero.el.classList.remove('hero')
      hero.el.style.zIndex = hero._origZ || ''
      hero.el.style.opacity = hero._origOpacity || ''
    }
    for (const w of walkers) {
      w.el.classList.remove('dimmed')
      w.el.classList.remove('hidden-during-scan')
      if (w === hero || w.progress >= 0) { try { w.el.play() } catch (e) {} }
    }
    zooming = false
    hero = null
    await wait(500)
    if (destroyed) return
    scheduleNext()
  }

  function wait(ms) { return new Promise(r => setTimeout(r, ms)) }

  let firstScanDone = false
  function scheduleNext() {
    if (destroyed) return
    clearTimeout(nextTimer)
    const delay = firstScanDone ? rand(2400, 3500) : rand(2600, 3400)
    firstScanDone = true
    nextTimer = setTimeout(runScanSequence, delay)
  }

  function init() {
    phEntering = true
    setTimeout(function () { phEntering = false }, 4000)
    buildCrowd()
    revealCrowdWhenReady()
    last = performance.now()
    rafId = requestAnimationFrame(tick)
    scheduleNext()
  }

  function revealCrowdWhenReady() {
    const vids = walkers.filter(w => w.progress >= 0).map(w => w.el)
    let done = false
    const reveal = () => {
      if (done || destroyed) return
      done = true
      crowdEl.style.animation = 'none'
      void crowdEl.offsetWidth
      crowdEl.style.animation = 'ph-crowdReveal 4000ms var(--ease-out) forwards'
    }
    const whenPainted = v => new Promise(res => {
      let settled = false
      const ok = () => { if (!settled) { settled = true; res() } }
      if (typeof v.requestVideoFrameCallback === 'function') {
        v.requestVideoFrameCallback(() => ok())
      } else if (v.readyState >= 2) {
        ok()
      } else {
        v.addEventListener('loadeddata', ok, { once: true })
        v.addEventListener('canplay', ok, { once: true })
      }
      v.addEventListener('error', ok, { once: true })
    })
    Promise.all(vids.map(whenPainted)).then(reveal)
    setTimeout(reveal, 4000)
  }

  // ── Lifecycle listeners ─────────────────────────────────────────────────────
  let hiddenAt = 0
  const onVisibility = () => {
    if (document.hidden) { hiddenAt = performance.now(); return }
    last = performance.now()
    const awayMs = hiddenAt ? (performance.now() - hiddenAt) : 0

    for (const w of walkers) {
      if (w.progress >= 0 && w._videoStarted && w !== hero && !w.el.classList.contains('hidden-during-scan')) {
        try { syncVideoTimeToProgress(w) } catch (e) {}
        if (w.el.paused && !w.el.ended) w.el.play().catch(() => {})
      }
    }

    if (awayMs > 1200) {
      if (zooming || hero) {
        clearTimeout(nextTimer)
        try { root.querySelectorAll('.ph-walker.dimmed,.ph-walker.hidden-during-scan').forEach(el => el.classList.remove('dimmed', 'hidden-during-scan')) } catch (e) {}
        if (hero) { try { hero.el.classList.remove('hero'); hero.el.style.filter = '' } catch (e) {} hero.scanned = false }
        const r = byId('reticle'); if (r) r.classList.remove('on')
        const rep = byId('report'); if (rep) rep.classList.remove('on')
        zooming = false; hero = null
        for (const w of walkers) { if (w.progress >= 0 && w.el.paused && !w.el.ended) w.el.play().catch(() => {}) }
        scheduleNext()
      }
      crowdEl.style.animation = 'none'
      void crowdEl.offsetWidth
      crowdEl.style.animation = 'ph-crowdReveal 1100ms var(--ease-out) forwards'
    }
    hiddenAt = 0
  }

  const safetyInterval = setInterval(() => {
    for (const w of walkers) {
      if (w.progress >= 0 && w._videoStarted && w.el.paused && !w.el.ended &&
        w !== hero && !w.el.classList.contains('hidden-during-scan')) {
        w.el.play().catch(() => {})
      }
    }
  }, 250)

  const onResize = () => { clearTimeout(rT); rT = setTimeout(buildCrowd, 180) }

  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('resize', onResize)

  init()

  // ── Teardown ────────────────────────────────────────────────────────────────
  return () => {
    destroyed = true
    cancelAnimationFrame(rafId)
    clearTimeout(nextTimer)
    clearTimeout(rT)
    if (clockInterval) clearInterval(clockInterval)
    if (safetyInterval) clearInterval(safetyInterval)
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('resize', onResize)
    for (const w of walkers) {
      try { w.el.pause(); w.el.removeAttribute('src'); w.el.load() } catch (e) {}
    }
    try { crowdEl.innerHTML = '' } catch (e) {}
  }
}
</script>

<template>
  <div ref="rootEl" class="ph-root" aria-hidden="true">
    <div class="ph-frame" id="frame">
      <header class="ph-chrome">
        <div></div>
        <div class="ph-meta">
          <span><span class="ph-dot"></span>Live Talent Map</span>
          <span id="clock">00:00 CET</span>
        </div>
      </header>

      <div class="ph-stage" id="stage">
        <div class="ph-crowd" id="crowd"></div>

        <div class="ph-reticle" id="reticle">
          <div class="ph-rule-v"></div>
          <div class="ph-scanline"></div>
        </div>
      </div>

      <!-- Halo + dossier live at frame-level so they sit above the footer chrome -->
      <div class="ph-report-halo" id="report-halo"></div>
      <aside class="ph-report" id="report">
        <div class="ph-tag best">Best Profile on Market</div>
        <div class="ph-eyebrow">Candidate Dossier</div>
        <h3 class="ph-name" id="r-name">—</h3>
        <p class="ph-role" id="r-role">—</p>
        <span class="ph-id" id="r-id">Réf. 000 000</span>
        <div class="ph-rule"></div>
        <div class="ph-row"><span class="ph-label">Soft Skills</span><span class="ph-bar-outer"><span class="ph-bar-inner" data-k="pipe"></span></span><span class="ph-val" id="v-pipe">0</span></div>
        <div class="ph-row"><span class="ph-label">Hard Skills</span><span class="ph-bar-outer"><span class="ph-bar-inner" data-k="close"></span></span><span class="ph-val" id="v-close">0</span></div>
        <div class="ph-row"><span class="ph-label">Quota att.</span><span class="ph-bar-outer"><span class="ph-bar-inner" data-k="quota"></span></span><span class="ph-val" id="v-quota">0</span></div>
        <div class="ph-row gradient"><span class="ph-label">Fit Score</span><span class="ph-bar-outer"><span class="ph-bar-inner" data-k="fit"></span></span><span class="ph-val" id="v-fit">0</span></div>
        <div class="ph-footer-row">
          <span class="ph-verdict">Signal d'embauche</span>
          <span class="ph-rarity" id="r-rarity">1 sur 14 200</span>
        </div>
      </aside>

      <footer class="ph-footer">
        <div></div>
        <div class="ph-counter">
          <div>Profils scannés <span class="n" id="c-scan">000 000</span></div>
          <div>Signatures <span class="m" id="c-match">0</span></div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style>
/* ============================================================================
   People Hunt — native (ex-iframe). GLOBAL (unscoped) on purpose: walkers are
   <video> nodes created in JS and appended at runtime, so scoped styles would
   never reach them. Every selector is `.ph-`-prefixed to stay isolated.
   Design tokens are redeclared on .ph-root so the widget keeps its own values
   independent of the site's :root.
   ============================================================================ */
.ph-root {
  position: absolute;
  inset: 0;
  overflow: visible;
  color: var(--fg-1);
  -webkit-font-smoothing: antialiased;

  /* Brand core palette */
  --brand-cyan: #5EE7E7;
  --brand-magenta: #E85EFF;
  --brand-purple: #8B5CF6;
  --brand-pink: #FF3EA5;
  --brand-aqua-lite: #7EEFEF;

  /* Foreground */
  --fg-1: #FFFFFF;
  --fg-2: rgba(255,255,255,0.72);
  --fg-3: rgba(255,255,255,0.48);
  --fg-4: rgba(255,255,255,0.32);
  --fg-5: rgba(255,255,255,0.18);

  /* Strokes */
  --stroke-1: rgba(255,255,255,0.08);
  --stroke-2: rgba(255,255,255,0.14);
  --stroke-3: rgba(255,255,255,0.22);

  /* Gradients */
  --gradient-brand: linear-gradient(90deg, #5EE7E7 0%, #8B5CF6 50%, #E85EFF 100%);
  --gradient-button: linear-gradient(90deg, #5EE7E7 0%, #9B6BFF 55%, #E85EFF 100%);

  /* Type families (match the original iframe) */
  --font-display: "Cormorant Garamond", "Canela", ui-serif, Georgia, serif;
  --font-sans: "Geist", ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "DM Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --font-text: var(--font-sans);

  /* Type scale */
  --step--2: 11px;
  --step--1: 13px;
  --step-0: 15px;
  --step-1: 17px;
  --step-2: 22px;
  --step-3: 28px;

  /* Letter spacing */
  --track-label: 0.22em;
  --track-snug: -0.01em;

  /* Spacing */
  --space-5: 24px;
  --space-7: 48px;

  /* Radii */
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-pill: 999px;

  /* Shadows & glows */
  --shadow-raised: 0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 60px rgba(0,0,0,0.6);
  --glow-button: 0 10px 40px rgba(139,92,246,0.35);

  /* Motion */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  font-family: var(--font-sans);
}

.ph-frame {
  position: absolute;
  inset: 0;
  background: transparent;
  overflow: visible;
}

/* Header */
.ph-chrome {
  position: absolute; left: 0; right: 0; top: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 138px var(--space-7) var(--space-5);
  z-index: 10;
}
.ph-meta {
  display: flex; align-items: center; gap: var(--space-5);
  font-family: var(--font-mono);
  font-size: var(--step--2);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--fg-3);
  font-weight: 500;
}
.ph-dot {
  display: inline-block;
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--brand-magenta);
  margin-right: 8px;
  vertical-align: middle;
  box-shadow: 0 0 12px rgba(232,94,255,0.7);
  animation: ph-pulse 2.2s ease-in-out infinite;
}
@keyframes ph-pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50% { opacity:.35; transform:scale(.7); }
}
@keyframes ph-crowdReveal { from { opacity: 0; } to { opacity: 1; } }

.ph-footer {
  position: absolute; left: 0; right: 0; bottom: 0;
  display: flex; align-items: flex-end; justify-content: space-between;
  padding: var(--space-5) var(--space-7) 52px;
  z-index: 10;
}
.ph-counter {
  text-align: right;
  font-family: var(--font-mono);
  font-size: var(--step--2);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--fg-2);
  line-height: 1.8;
}
.ph-counter .n { color: var(--fg-1); }
.ph-counter .m { color: #FFFFFF; font-weight: 600; }

/* Stage — clip to frame so silhouettes exit cleanly off the bottom */
.ph-stage {
  position: absolute; inset: 0;
  overflow: hidden;
  -webkit-mask-image:
    linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%),
    linear-gradient(to bottom, transparent 0%, #000 12%, #000 92%, transparent 100%);
  -webkit-mask-composite: source-in;
          mask-image:
    linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%),
    linear-gradient(to bottom, transparent 0%, #000 12%, #000 92%, transparent 100%);
          mask-composite: intersect;
}
.ph-crowd {
  position: absolute; inset: 0;
  transform-origin: 50% 62%;
  transition: transform 500ms var(--ease-in-out);
  will-change: transform;
  opacity: 0;
}
.ph-debug-tag {
  position: absolute;
  transform: translateX(-50%);
  font-family: monospace; font-size: 10px; line-height: 1.2;
  color: #5EE7E7; background: rgba(0,0,0,0.82);
  padding: 2px 5px; border-radius: 4px; white-space: nowrap;
  pointer-events: none; max-width: 220px; overflow: hidden; text-overflow: ellipsis;
}

/* Walker = a single <video> element sized by height, width from intrinsic ratio. */
.ph-walker {
  position: absolute;
  top: 0; left: 0;
  width: 356px;
  height: 200px;
  transform-origin: 0 0;
  will-change: transform, opacity;
  pointer-events: none;
  opacity: var(--alpha, 0);
}
.ph-walker.faded { opacity: 0 !important; transition: opacity 700ms var(--ease-out); }
.ph-walker.dimmed {
  filter: brightness(0.10) blur(8px) !important;
  opacity: 0.45 !important;
  transition: filter 700ms var(--ease-out), opacity 700ms var(--ease-out);
}
.ph-walker.hidden-during-scan {
  opacity: 0 !important;
  transition: opacity 500ms var(--ease-out);
}
.ph-walker { transition: opacity 280ms var(--ease-out); }

.ph-walker.hero {
  --aber-offset: 2px;
  --halo-white: 7px;
  --halo-purple: 18px;
  --aber-alpha: 0.7;
  --halo-white-alpha: 0.28;
  --halo-purple-alpha: 0.42;
  filter:
    drop-shadow(calc(-1 * var(--aber-offset)) 0 0 rgba(94, 231, 231, var(--aber-alpha)))
    drop-shadow(var(--aber-offset) 0 0 rgba(232, 94, 255, var(--aber-alpha)))
    drop-shadow(0 0 var(--halo-white) rgba(255, 255, 255, var(--halo-white-alpha)))
    drop-shadow(0 0 var(--halo-purple) rgba(139, 92, 246, var(--halo-purple-alpha))) !important;
  z-index: 60 !important;
}
.ph-walker.hero.flashing {
  animation: ph-flash 0.40s steps(1,end) 1;
}
@keyframes ph-flash {
  0%   { filter: drop-shadow(0 0 18px rgba(232,94,255,0.95)) hue-rotate(280deg); }
  50%  { filter: drop-shadow(0 0 22px rgba(94,231,231,0.95)) hue-rotate(160deg); }
  100% { filter: none; }
}

/* Reticle — soft circular scan halo */
.ph-reticle {
  position: absolute;
  width: 220px; height: 320px;
  transform: translate(-50%,-50%) scale(.96);
  pointer-events: none;
  opacity: 0;
  transition: opacity 700ms var(--ease-out), transform 900ms var(--ease-in-out);
  z-index: 8;
}
.ph-reticle.on { opacity: 1; transform: translate(-50%,-50%) scale(1); }
.ph-reticle .ph-rule-v {
  position: absolute; top: 0; bottom: 0; left: 50%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--fg-3), transparent);
  opacity: .35;
}
.ph-reticle .ph-scanline {
  position: absolute; left: 0; right: 0; height: 1px;
  background: var(--gradient-brand);
  opacity: 0;
  top: 0;
}
.ph-reticle.on .ph-scanline {
  animation: ph-scan 2.6s cubic-bezier(.5,0,.5,1) 2;
}
@keyframes ph-scan {
  0%  { top: 0;   opacity: 0; }
  12% { opacity: .9; }
  50% { top: 100%; opacity: .9; }
  62% { opacity: 0; }
  100%{ top: 0;   opacity: 0; }
}

/* Tags — borderless, typographic only */
.ph-tag {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 700ms var(--ease-out) 200ms, transform 800ms var(--ease-in-out) 200ms;
}
.ph-tag.top {
  top: -28px;
  transform: translate(-50%,-100%) translateY(8px);
  font-family: var(--font-sans);
  font-size: var(--step--2);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--fg-3);
  font-weight: 500;
}
.ph-tag.best {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translate(-50%, -100%);
  font-family: var(--font-text);
  font-style: normal;
  font-size: var(--step-2);
  font-weight: 500;
  letter-spacing: var(--track-snug);
  color: #F4EFE3;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 700ms var(--ease-out) 200ms;
}
.ph-reticle.on .ph-tag.top { opacity: 1; transform: translate(-50%,-100%); }
.ph-report.on .ph-tag.best { opacity: 1; }

/* Soft halo behind the dossier card */
.ph-report-halo {
  position: absolute;
  width: 460px;
  height: 460px;
  pointer-events: none;
  z-index: 20;
  opacity: 0;
  transition: opacity 700ms var(--ease-out);
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
.ph-report-halo.on { opacity: 1; }

/* Dossier card — solid panel sits on top of the halo */
.ph-report {
  position: absolute;
  width: 300px;
  background: #0B0D10;
  border: 1px solid var(--stroke-2);
  border-radius: var(--radius-lg);
  padding: 22px 22px 20px;
  box-shadow:
    0 1px 0 rgba(244,239,227,0.04) inset,
    0 28px 70px rgba(0,0,0,0.7);
  opacity: 0;
  transition: opacity 700ms var(--ease-out), transform 900ms var(--ease-in-out);
  z-index: 21;
  --fg-1: #F4EFE3;
  --fg-2: rgba(244,239,227,0.72);
  --fg-3: rgba(244,239,227,0.50);
  --fg-4: rgba(244,239,227,0.34);
  --fg-5: rgba(244,239,227,0.16);
  --stroke-1: rgba(244,239,227,0.10);
  --stroke-2: rgba(244,239,227,0.16);
  --gradient-brand: rgba(244,239,227,0.88);
}
.ph-report::before {
  content: "";
  position: absolute;
  left: 20px; right: 20px; top: 0;
  height: 1px;
  background: var(--gradient-brand);
  opacity: .5;
  border-radius: inherit;
}
.ph-report.on { opacity: 1; }

.ph-report .ph-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--font-sans);
  font-size: var(--step--2);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--fg-3);
  font-weight: 500;
  margin-bottom: 10px;
}
.ph-report .ph-eyebrow::before {
  content:""; width: 18px; height: 1px; background: currentColor; opacity:.6;
}
.ph-report .ph-name {
  font-family: var(--font-text);
  font-size: var(--step-3);
  line-height: 1.05;
  letter-spacing: var(--track-snug);
  color: var(--fg-1);
  font-weight: 500;
  margin: 0 0 2px;
}
.ph-report .ph-role {
  font-family: var(--font-sans);
  font-size: var(--step--1);
  color: var(--fg-3);
  margin: 0;
}
.ph-report .ph-id {
  display: block;
  margin-top: 10px;
  font-family: var(--font-mono);
  font-size: var(--step--2);
  color: var(--fg-4);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.ph-report .ph-rule {
  height: 1px; background: var(--stroke-1);
  margin: 14px 0 12px;
}
.ph-report .ph-row {
  display: grid;
  grid-template-columns: 100px 1fr 32px;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  font-family: var(--font-sans);
  font-size: var(--step--2);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
}
.ph-report .ph-row .ph-label { color: var(--fg-3); font-weight: 500; }
.ph-report .ph-row .ph-bar-outer {
  position: relative; height: 2px; background: var(--fg-5);
  border-radius: 1px; overflow: hidden;
}
.ph-report .ph-row .ph-bar-inner {
  position: absolute; top:0; left:0; bottom:0;
  background: var(--fg-1);
  width: 0%;
  transition: width 1000ms var(--ease-in-out);
}
.ph-report .ph-row.gradient .ph-bar-inner { background: var(--gradient-brand); }
.ph-report .ph-row .ph-val {
  font-family: var(--font-mono);
  font-size: var(--step-1);
  font-weight: 500;
  letter-spacing: 0;
  color: var(--fg-1);
  text-align: right;
  text-transform: none;
}
.ph-report .ph-footer-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 14px;
}
.ph-report .ph-verdict {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-sans);
  font-size: var(--step--2);
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  color: var(--fg-1);
  background: transparent;
  padding: 0;
  font-weight: 500;
}
.ph-report .ph-verdict::before {
  content: "";
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--gradient-brand);
  box-shadow: none;
}
.ph-report .ph-rarity {
  font-family: var(--font-text);
  font-style: normal;
  font-size: var(--step--1);
  color: var(--fg-3);
}
</style>
