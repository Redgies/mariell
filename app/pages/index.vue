<script setup lang="ts">
useScrollReveal()

const ac = new AbortController()
onBeforeUnmount(() => ac.abort())

onMounted(async () => {
  if (!import.meta.client) return
  await nextTick()
  await nextTick()

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // 1. Split [data-split] headlines into word spans
  const headlines = document.querySelectorAll<HTMLElement>('[data-split]:not([data-split-done])')
  headlines.forEach((root) => {
    root.setAttribute('data-split-done', '')
    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? ''
        if (!text.trim()) return
        const frag = document.createDocumentFragment()
        text.split(/(\s+)/).forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part))
          } else {
            const span = document.createElement('span')
            span.className = 'split-word'
            span.textContent = part
            frag.appendChild(span)
          }
        })
        node.parentNode?.replaceChild(frag, node)
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement
        if (el.classList.contains('gradient-text') || el.hasAttribute('data-no-split')) {
          el.classList.add('split-word')
          return
        }
        Array.from(node.childNodes).forEach(walk)
      }
    }
    Array.from(root.childNodes).forEach(walk)
  })

  // 2. Reveal words with stagger via IntersectionObserver
  const words = document.querySelectorAll<HTMLElement>('.split-word:not(.revealed)')
  if (reduced || !('IntersectionObserver' in window)) {
    words.forEach((w) => w.classList.add('revealed'))
  } else {
    const wordIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const siblings = Array.from(
            el.closest('[data-split-done]')?.querySelectorAll('.split-word') ?? [],
          ) as HTMLElement[]
          const idx = siblings.indexOf(el)
          el.style.animationDelay = `${Math.max(0, idx) * 90}ms`
          el.classList.add('revealed')
          wordIO.unobserve(el)
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    ac.signal.addEventListener('abort', () => wordIO.disconnect())
    words.forEach((w) => wordIO.observe(w))
  }

  if (reduced) return

  // 3. Scroll-linked parallax
  const targets = Array.from(document.querySelectorAll<HTMLElement>('.scroll-parallax'))
  if (targets.length === 0) return

  const factors = new Map<HTMLElement, number>()
  targets.forEach((el) => {
    const raw = Number(el.dataset.parallax)
    factors.set(el, Number.isFinite(raw) && raw !== 0 ? raw : -0.6)
  })

  let ticking = false
  const apply = () => {
    const vh = window.innerHeight
    targets.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.bottom < -200 || rect.top > vh + 200) return
      const progress = (vh - (rect.top + rect.height / 2)) / vh
      const factor = factors.get(el) ?? -0.6
      const offset = (progress - 0.5) * 180 * factor
      el.style.setProperty('--scroll-y', `${offset}px`)
    })
    ticking = false
  }

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(apply)
      ticking = true
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true, signal: ac.signal })
  window.addEventListener('resize', onScroll, { passive: true, signal: ac.signal })
  apply()
})
</script>

<template>
  <main class="relative">
    <HeroSection />
    <VideoSection />
    <ApproachSection />
    <ClientsMarquee />
    <BenefitsGrid />
    <ProcessSteps />
    <PricingSection />
    <LabSection />
    <TestimonialsCarousel />
    <FinalCta />
  </main>
</template>
