import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// Lecture des prompts au build (injection dans runtimeConfig).
// Vercel ne copie pas les .md de server/prompts/ dans le bundle de fonction sans
// configuration spécifique — inliner ici garantit que le contenu est embarqué.
const __dirname = dirname(fileURLToPath(import.meta.url))
const readPrompt = (relPath: string) =>
  readFileSync(resolve(__dirname, 'server/prompts', relPath), 'utf-8')

export default defineNuxtConfig({
  compatibilityDate: '2026-04-13',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    // @nuxt/scripts MUST come before @nuxtjs/turnstile so Turnstile's widget
    // loads Cloudflare's api.js through the Trusted Types-compliant loader.
    '@nuxt/scripts',
    '@nuxtjs/google-fonts',
    '@nuxtjs/turnstile',
    // To re-enable Vercel Analytics later:
    //   1. npm install @vercel/analytics
    //   2. uncomment the line below (note the /nuxt subpath, NOT '@vercel/analytics')
    // '@vercel/analytics/nuxt',
  ],

  googleFonts: {
    families: {
      // Body / UI grotesque + mono labels. Display (Tiempos Headline) is
      // self-hosted via @font-face in app/assets/css/design/colors_and_type.css.
      'Geist': [400, 500, 600],
      'DM Mono': [400, 500],
    },
    display: 'swap',
    preload: true,
    download: true,
    subsets: ['latin', 'latin-ext'],
  },

  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
  },

  runtimeConfig: {
    turnstile: {
      // Auto-overridden by NUXT_TURNSTILE_SECRET_KEY at runtime.
      secretKey: '',
    },
    // Prompts inlinés au build — utilisés par les loaders load-prompts.ts
    // de chaque outil.
    prompts: {
      outil2V14: readPrompt('outil-2/system-prompt-v14.md'),
      outil3SystemV12: readPrompt('outil-3/system-prompt-v12.md'),
      outil3F1: readPrompt('outil-3/f1-boites-intouchables-v7.md'),
      outil3F2: readPrompt('outil-3/f2-grille-secteurs-v3.md'),
      outil3F3: readPrompt('outil-3/f3-typologie-missions-v5.md'),
      outil3F4: readPrompt('outil-3/f4-addendum-salaires-v6.md'),
    },
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      calendlyUrl: process.env.NUXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/chez-mariell/30min',
    },
  },

  nitro: {
    preset: 'vercel',
    routeRules: {
      // Vidéos People Hunt : noms datés = contenu immuable → cache CDN long.
      // Ciblé sur uploads/ (que des .webm) pour ne pas figer le HTML/JS voisins.
      '/people-hunt/uploads/**': {
        headers: { 'cache-control': 'public, max-age=31536000, immutable' },
      },
    },
    // Outil 2 génère le plan via Claude Haiku — call serveur ~30s.
    // Vercel preset standard tolère jusqu'à 300s ; vercel-edge serait coupé à 25s.
    prerender: {
      // Prégénère le HTML complet de toutes les pages de contenu (title, meta,
      // H1, corps, liens internes, JSON-LD visibles dans la source brute).
      // crawlLinks suit les NuxtLink depuis / et le sitemap pour découvrir les
      // 47 routes ; les routes dynamiques (résultats outils [uuid]) restent en
      // SSR à la demande. failOnError:false → une page KO ne casse pas le build.
      crawlLinks: true,
      routes: ['/', '/sitemap.xml', '/robots.txt'],
      failOnError: false,
    },
  },

  app: {
    // Transition gérée par un overlay "fondu vers le noir" piloté dans app.vue
    // (couvre aussi la nav/menu). Pas de pageTransition Vue.
    head: {
      title: 'Mariell — Recrutement Sales Premium',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1' },
        {
          name: 'description',
          content:
            "Mariell recrute les meilleurs Sales pour les meilleures entreprises. Des Sales qui chassent d'autres Sales.",
        },
        { name: 'theme-color', content: '#F4EFE3' },
        // Global Open Graph / Twitter image. Per-route SEO (seo-meta.json via
        // usePageSeo) overrides these for mapped routes; this is the site-wide
        // default so unmapped routes (tool results, confirmation) still share it.
        { property: 'og:image', content: `${process.env.NUXT_PUBLIC_SITE_URL || 'https://mariell.fr'}/og-home.png` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: `${process.env.NUXT_PUBLIC_SITE_URL || 'https://mariell.fr'}/og-home.png` },
      ],
      link: [
        // Préchargement de la police d'affichage critique (titres au-dessus de
        // la ligne de flottaison) pour accélérer le LCP et limiter le CLS.
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/tiempos-headline-medium.woff2', crossorigin: '' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'alternate icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/android-chrome-512x512.png' },
      ],
    },
  },
})
