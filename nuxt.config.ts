import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-04-13',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ['@nuxtjs/google-fonts'],

  googleFonts: {
    families: {
      'Noto+Serif+JP': [500],
      'Inter': [300, 400, 600],
    },
    display: 'swap',
    preload: true,
    download: true,
    subsets: ['latin', 'latin-ext'],
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
