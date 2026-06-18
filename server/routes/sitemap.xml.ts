// Dynamic sitemap. Lists every indexable route of the editorial site.
// Transient/generated routes (tool results, confirmation, [uuid]) are excluded
// (also blocked in robots.txt). Base URL from NUXT_PUBLIC_SITE_URL.

const EXPERTISES = [
  'sdr',
  'business-developer-full-cycle',
  'account-executive-pme',
  'account-executive-mid-market',
  'account-executive-enterprise',
  'account-manager',
  'customer-success-manager',
  'sales-ops-revops',
  'sales-manager',
  'channel-partner-manager',
  'head-of-sales',
  'vp-sales',
  'cro',
  'recrutement-seed',
  'recrutement-scale-up',
  'team-buildout',
  'recrutement-strategique',
]

const CAS = [
  'dhala',
  'kraaft',
  'reconomia',
  'nextmotion',
  'wikit',
  'sastec',
  'reality-academy',
  'kickmaker',
]

const BLOG = [
  'marche-recrutement-sales-2026',
  'meilleurs-sales-annonces',
  'onboarding-commercial-90-jours',
  'quand-recruter-premier-vp-sales',
  'scaler-equipe-sales-sans-casser-culture',
  'soft-skills-hard-skills-performance-commerciale',
]

const STATIC = [
  '/',
  '/mariell',
  '/methode',
  '/recrutement-commercial',
  '/performances',
  '/expertises',
  '/cas-clients',
  '/blog',
  '/lab',
  '/lab/plan-de-sourcing',
  '/lab/evaluation-attractivite',
  '/lab/demande-stage-alternance',
  '/lab/guide-salaires-sales',
  '/lab/10-essentiels-recrutement-sales',
  '/mentions-legales',
  '/politique-confidentialite',
]

export default defineEventHandler((event) => {
  // Canonical host is non-www (matches every page's <link rel="canonical">).
  // Force it here so the sitemap never lists www URLs even if SITE_URL has www.
  const base = (useRuntimeConfig().public.siteUrl as string || 'https://mariell.fr')
    .replace(/\/$/, '')
    .replace('://www.', '://')

  const paths = [
    ...STATIC,
    ...EXPERTISES.map(s => `/expertises/${s}`),
    ...CAS.map(s => `/cas-clients/${s}`),
    ...BLOG.map(s => `/blog/${s}`),
  ]

  const urls = paths
    .map((p) => {
      const priority = p === '/' ? '1.0' : p.startsWith('/blog/') ? '0.6' : '0.8'
      return `  <url><loc>${base}${p}</loc><changefreq>weekly</changefreq><priority>${priority}</priority></url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
