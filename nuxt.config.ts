import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-04-13',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ['@nuxtjs/google-fonts', '@nuxtjs/turnstile'],

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
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
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
