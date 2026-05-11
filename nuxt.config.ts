import tailwindcss from '@tailwindcss/vite'

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
      'Inter': [300, 400, 500, 600, 800],
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
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      calendlyUrl: process.env.NUXT_PUBLIC_CALENDLY_URL || '#',
    },
  },

  nitro: {
    preset: 'vercel',
    // Outil 2 génère le plan via Claude Haiku — call serveur ~30s.
    // Vercel preset standard tolère jusqu'à 300s ; vercel-edge serait coupé à 25s.
  },

  app: {
    head: {
      title: 'Mariell — Recrutement Sales Premium',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            "Mariell recrute les meilleurs Sales pour les meilleures entreprises. Des Sales qui chassent d'autres Sales.",
        },
        { name: 'theme-color', content: '#000000' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
})
