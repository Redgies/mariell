# Mariell — Landing page

Landing page one-page pour **Mariell**, cabinet de recrutement Sales premium.

Stack : **Nuxt 4** + **Tailwind CSS v4** (via `@tailwindcss/vite`) + **Google Fonts** (`@nuxtjs/google-fonts`). Aucun UI framework. Tout en Tailwind pur pour un contrôle total sur le design.

## Prérequis

- Node.js **≥ 20** (testé sur Node 22)
- npm (ou pnpm/yarn, adapter les commandes)

## Commandes

```bash
# Installation
npm install

# Dev — http://localhost:3000
npm run dev

# Build production
npm run build

# Preview du build
npm run preview
```

## Structure

```
Mariell/
├── app/
│   ├── app.vue                         # Root — assemble toutes les sections
│   ├── assets/css/main.css             # Tailwind + design tokens + animations
│   ├── components/
│   │   ├── AppNavbar.vue               # Sticky nav + dropdown Ressources + hamburger mobile
│   │   ├── AppFooter.vue
│   │   ├── GradientBlobs.vue           # Blobs cyan/magenta en fond global
│   │   ├── HeroSection.vue             # #accueil
│   │   ├── VideoSection.vue            # #who — placeholder 16:9
│   │   ├── ClientsMarquee.vue          # Logos clients + marquee
│   │   ├── BenefitsGrid.vue            # #process partie 1 (grille 2×2)
│   │   ├── ProcessSteps.vue            # #process partie 2 (4 étapes)
│   │   ├── PricingSection.vue          # #pricing
│   │   ├── TestimonialsCarousel.vue
│   │   └── FinalCta.vue
│   └── composables/
│       └── useScrollReveal.ts          # IntersectionObserver fade-in
├── shared/config/site.ts               # ⚙️  Toutes les constantes à éditer
├── public/favicon.svg
├── nuxt.config.ts
└── package.json
```

## Placeholders à remplacer avant mise en production

| Élément | Fichier | Action |
|---|---|---|
| **URL Calendly** | `shared/config/site.ts` | Remplacer `calendlyUrl: '#'` par l'URL réelle (ex : `https://calendly.com/mariell/intro`). Elle alimente tous les CTA. |
| **Vidéo hero (Who is Mariell ?)** | `app/components/VideoSection.vue` | Remplacer le conteneur placeholder par `<iframe src="https://www.youtube.com/embed/..." allowfullscreen class="h-full w-full" />`. Un commentaire `<!-- TODO -->` marque l'endroit. |
| **Logos clients (×8)** | `app/components/ClientsMarquee.vue` + `shared/config/site.ts` | Placer les fichiers dans `public/logos/client-1.svg` … `client-8.svg` puis remplacer chaque `.client-tile` par `<img src="/logos/client-N.svg" alt="Nom Client" />`. |
| **Favicon** | `public/favicon.svg` | Remplacer par le logo Mariell final. |
| **Témoignages** | `shared/config/site.ts` → `testimonials` | Remplacer les 5 témoignages fictifs par les vrais (avec photos si disponibles). |

## Conventions de fonts

- Titres principaux → `font-serif-jp` (**Noto Serif JP 500**)
- Navigation → **Hanken Grotesk 600** (inline `font-weight: 600`)
- Titres de cases → **Hanken Grotesk 400**
- Paragraphes / descriptions → **Hanken Grotesk 300**

Les fonts sont auto-téléchargées via `@nuxtjs/google-fonts` (option `download: true`) : aucun appel tiers au runtime après le build.

## Accessibilité

- Contraste texte blanc sur fond noir (WCAG AA)
- Navigation clavier (focus visible cyan)
- `aria-label` sur tous les boutons iconographiques
- Respect de `prefers-reduced-motion` (animations désactivées)

## Personnalisation rapide

- **Couleurs / gradient** → `app/assets/css/main.css` (variables `@theme`, classe `.gradient-cta`)
- **Liens nav** → `shared/config/site.ts` → `navLinks`
- **Textes des 4 bénéfices / 4 étapes process** → `shared/config/site.ts` → `benefits`, `processSteps`
- **Badges pricing** → `shared/config/site.ts` → `pricingBadges`
