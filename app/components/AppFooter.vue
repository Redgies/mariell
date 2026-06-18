<script setup lang="ts">
/**
 * Mariell footer — ink-1000 ground, 4 link columns + legal bar.
 * Mirrors the nav routes. Two legal links only (CGU + footer LinkedIn were
 * dropped per the design decisions). Clean Nuxt paths.
 */
const calendlyUrl = useRuntimeConfig().public.calendlyUrl
const year = new Date().getFullYear()

const columns: { head: string; items: { label: string; to: string; external?: boolean }[] }[] = [
  {
    head: '— Mariell',
    items: [
      { label: 'Mariell', to: '/mariell' },
      { label: 'Méthode', to: '/methode' },
      { label: 'Le Lab', to: '/lab' },
      { label: 'Blog', to: '/blog' },
    ],
  },
  {
    head: '— Expertises',
    items: [
      { label: 'SDR / BDR', to: '/expertises/sdr' },
      { label: 'Account Executive', to: '/expertises/account-executive-mid-market' },
      { label: 'Head of Sales', to: '/expertises/head-of-sales' },
      { label: 'CRO', to: '/expertises/cro' },
      { label: 'Team Buildout', to: '/expertises/team-buildout' },
    ],
  },
  {
    head: '— Références',
    items: [
      { label: 'Suivi de performance', to: '/performances' },
      { label: 'Cas clients', to: '/cas-clients' },
      { label: 'Toutes les expertises', to: '/expertises' },
    ],
  },
  {
    head: '— Contact',
    items: [
      { label: 'Parler à Mariell', to: calendlyUrl, external: true },
      { label: 'chez@mariell.fr', to: 'mailto:chez@mariell.fr', external: true },
      { label: 'LinkedIn', to: 'https://www.linkedin.com/company/chezmariell', external: true },
    ],
  },
]
</script>

<template>
  <footer class="site-footer">
    <div class="container site-footer__cols">
      <div v-for="col in columns" :key="col.head" class="site-footer__col">
        <div class="site-footer__head">{{ col.head }}</div>
        <ul class="site-footer__list">
          <li v-for="item in col.items" :key="item.label">
            <a v-if="item.external" class="site-footer__link" :href="item.to" target="_blank" rel="noopener">{{ item.label }}</a>
            <NuxtLink v-else class="site-footer__link" :to="item.to">{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="container site-footer__legal">
      <div>© {{ year }} Mariell. Tous droits réservés.</div>
      <div class="site-footer__legal-links">
        <NuxtLink to="/mentions-legales">Mentions légales</NuxtLink>
        <NuxtLink to="/politique-confidentialite">Politique de confidentialité</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--ink-1000);
  color: var(--fg-on-ink-1);
  padding: 60px 40px 22px;
}
.site-footer__cols {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}
.site-footer__head {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(244, 239, 227, 0.5);
  margin-bottom: 18px;
}
.site-footer__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 11px;
}
.site-footer__link {
  color: rgba(244, 239, 227, 0.82);
  text-decoration: none;
  font-size: 14px;
  transition: color 160ms var(--ease-out);
}
.site-footer__link:hover { color: var(--cyan); }
.site-footer__legal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 48px;
  padding-top: 18px;
  border-top: 1px solid rgba(244, 239, 227, 0.08);
  font-size: 12px;
  color: rgba(244, 239, 227, 0.5);
  flex-wrap: wrap;
  gap: 16px;
}
.site-footer__legal-links {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.site-footer__legal-links a {
  color: inherit;
  text-decoration: none;
}
.site-footer__legal-links a:hover { color: var(--cyan); }

@media (max-width: 900px) {
  .site-footer__cols { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .site-footer__cols { grid-template-columns: 1fr; }
}
</style>
