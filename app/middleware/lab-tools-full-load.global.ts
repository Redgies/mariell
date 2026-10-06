// Les formulaires du Lab embarquent un widget Turnstile invisible. Ouvert via une
// navigation client (home → menu Lab → outil), ce widget produit parfois un jeton
// que Cloudflare rejette (`invalid-input-response`) ; après un rechargement complet
// tout passe. On force donc un vrai chargement de page à l'entrée d'un formulaire.
const LAB_TOOL_FORMS = new Set([
  '/lab/plan-de-sourcing',
  '/lab/evaluation-attractivite',
  '/lab/demande-stage-alternance',
])

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server || useNuxtApp().isHydrating) return
  const path = to.path.replace(/\/+$/, '') || '/'
  if (!LAB_TOOL_FORMS.has(path)) return
  return navigateTo(to.fullPath, { external: true })
})
