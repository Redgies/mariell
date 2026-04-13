export const useScrollReveal = () => {
  if (!import.meta.client) return

  onMounted(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal:not(.revealed)')
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach((el) => el.classList.add('revealed'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -120px 0px' },
    )

    els.forEach((el) => io.observe(el))

    onBeforeUnmount(() => io.disconnect())
  })
}
