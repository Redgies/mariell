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
    // Prompts inlinés au build — utilisés par les loaders load-prompts.ts
    // de chaque outil.
    prompts: {
      outil2V13: readPrompt('outil-2/system-prompt-v13.md'),
      outil3SystemV10: readPrompt('outil-3/system-prompt-v10.md'),
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
    // Outil 2 génère le plan via Claude Haiku — call serveur ~30s.
    // Vercel preset standard tolère jusqu'à 300s ; vercel-edge serait coupé à 25s.
  },

  app: {
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
        { name: 'theme-color', content: '#000000' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/android-chrome-512x512.png' },
      ],
    },
  },
})
