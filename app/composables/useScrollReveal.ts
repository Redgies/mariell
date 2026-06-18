export const useScrollReveal = () => {
  if (!import.meta.client) return

  onMounted(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal:not(.revealed)')
    if (els.length === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('revealed'))
      return
    }

    // Mark the page ready so the CSS pre-reveal (hidden) state applies only now,
    // client-side — SSR / no-JS keeps content visible. We add the flag on the
    // nearest .chromatic-mode wrapper (falls back to <html>).
    const wrapper = document.querySelector('.chromatic-mode') ?? document.documentElement
    wrapper.classList.add('js-reveal-ready')

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -80px 0px' },
    )

    els.forEach((el) => io.observe(el))

    onBeforeUnmount(() => io.disconnect())
  })
}
