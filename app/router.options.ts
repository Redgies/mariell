import type { RouterConfig } from '@nuxt/schema'

// Retarde le reset de scroll jusqu'à la fin de la phase de sortie de la
// transition de page (.page-leave-active dans main.css). Sinon la page remonte
// en haut pendant que l'ancienne page sort encore → remontée visible/saccadée.
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // Doit correspondre à la durée de .page-leave-active (main.css).
    const DURATION = 250

    return new Promise((resolve) => {
      setTimeout(() => {
        if (savedPosition) return resolve(savedPosition)
        if (to.hash) return resolve({ el: to.hash, behavior: 'smooth' })
        resolve({ top: 0 })
      }, DURATION)
    })
  },
}
