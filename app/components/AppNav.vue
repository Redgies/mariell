<script setup lang="ts">
/**
 * Mariell top navigation — fixed, cream-on-ink, with two pure-CSS mega-menus
 * (Expertises wide / Le Lab). Markup mirrors the design bundle’s site-nav so it
 * inherits pages.css behaviour. Routing uses clean Nuxt paths (no .html).
 *
 * Additions beyond the static design (flagged for review):
 *  - scroll-shrink (88→64px after 80px scroll), per the design README intent.
 *  - a mobile drawer (<900px) — the static design only hid the links; a real
 *    mobile nav is required in production.
 */
const calendlyUrl = useRuntimeConfig().public.calendlyUrl

const expertises = {
  representatives: [
    ['/expertises/sdr', 'SDR / BDR'],
    ['/expertises/business-developer-full-cycle', 'Business Developer Full Cycle'],
    ['/expertises/account-executive-pme', 'Account Executive PME'],
    ['/expertises/account-executive-mid-market', 'Account Executive Mid-Market'],
    ['/expertises/account-executive-enterprise', 'Account Executive Enterprise'],
    ['/expertises/account-manager', 'Account Manager'],
    ['/expertises/customer-success-manager', 'Customer Success Manager'],
    ['/expertises/sales-ops-revops', 'Sales Ops / RevOps'],
  ],
  managers: [
    ['/expertises/sales-manager', 'Sales Manager'],
    ['/expertises/channel-partner-manager', 'Channel / Partner Manager'],
  ],
  directors: [
    ['/expertises/head-of-sales', 'Head of Sales'],
    ['/expertises/vp-sales', 'VP Sales'],
    ['/expertises/cro', 'CRO'],
  ],
  contexte: [
    ['/expertises/recrutement-seed', 'Recrutement seed'],
    ['/expertises/recrutement-scale-up', 'Recrutement scale-up'],
    ['/expertises/team-buildout', 'Team Buildout'],
    ['/expertises/recrutement-strategique', 'Recrutement stratégique'],
  ],
  references: [
    ['/recrutement-commercial', 'Cabinet de recrutement commercial'],
    ['/performances', 'Suivi de performance'],
    ['/cas-clients', 'Cas clients'],
  ],
}

const labTools = [
  ['/lab/plan-de-sourcing', 'Plan de sourcing LinkedIn'],
  ['/lab/evaluation-attractivite', "Évaluation d’attractivité"],
  ['/lab/demande-stage-alternance', 'Demande stage / alternance'],
]
const labGuides = [
  ['/lab/guide-salaires-sales', 'Guide des salaires Sales 2026'],
  ['/lab/10-essentiels-recrutement-sales', 'Les 10 essentiels du recrutement'],
]

const scrolled = ref(false)
const mobileOpen = ref(false)
const expertisesOpen = ref(false)
const labOpen = ref(false)
const onScroll = () => { scrolled.value = window.scrollY > 80 }

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// Close the mobile drawer on route change.
const route = useRoute()
watch(() => route.fullPath, () => {
  mobileOpen.value = false
  expertisesOpen.value = false
  labOpen.value = false
})
</script>

<template>
  <nav class="site-nav" :class="{ 'is-scrolled': scrolled }">
    <div class="site-nav__inner">
      <NuxtLink class="site-nav__brand" to="/" aria-label="Mariell, accueil">
        <ChromaticWordmark text="Mariell" :size="24" glitch />
      </NuxtLink>

      <div class="site-nav__links">
        <div class="nav-item">
          <NuxtLink class="nav-link" to="/mariell">Mariell</NuxtLink>
        </div>

        <div class="nav-item has-mega">
          <NuxtLink class="nav-link" to="/expertises">
            Expertises
            <svg class="nav-chevron" viewBox="0 0 24 24" width="14" height="14"><path d="M6 9l6 6 6-6" /></svg>
          </NuxtLink>
          <div class="mega mega--wide">
            <div class="mega__panel">
              <div>
                <div class="mega__head">— Representatives</div>
                <NuxtLink v-for="[to, label] in expertises.representatives" :key="to" class="mega__link" :to="to">{{ label }}</NuxtLink>
              </div>
              <div>
                <div class="mega__head">— Managers</div>
                <NuxtLink v-for="[to, label] in expertises.managers" :key="to" class="mega__link" :to="to">{{ label }}</NuxtLink>
              </div>
              <div>
                <div class="mega__head">— Directors</div>
                <NuxtLink v-for="[to, label] in expertises.directors" :key="to" class="mega__link" :to="to">{{ label }}</NuxtLink>
              </div>
              <div>
                <div class="mega__head">— Par contexte</div>
                <NuxtLink v-for="[to, label] in expertises.contexte" :key="to" class="mega__link" :to="to">{{ label }}</NuxtLink>
                <div class="mega__sep" />
                <NuxtLink v-for="[to, label] in expertises.references" :key="to" class="mega__link" :to="to">{{ label }}</NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div class="nav-item">
          <NuxtLink class="nav-link" to="/methode">Méthode</NuxtLink>
        </div>

        <div class="nav-item has-mega">
          <NuxtLink class="nav-link" to="/lab">
            Le Lab
            <svg class="nav-chevron" viewBox="0 0 24 24" width="14" height="14"><path d="M6 9l6 6 6-6" /></svg>
          </NuxtLink>
          <div class="mega">
            <div class="mega__panel mega__panel--lab">
              <div>
                <div class="mega__head">— Outils</div>
                <NuxtLink v-for="[to, label] in labTools" :key="to" class="mega__link" :to="to">{{ label }}</NuxtLink>
              </div>
              <div>
                <div class="mega__head">— Guides</div>
                <NuxtLink v-for="[to, label] in labGuides" :key="to" class="mega__link" :to="to">{{ label }}</NuxtLink>
                <div class="mega__sep" />
                <NuxtLink class="mega__link" to="/lab">Voir tout le Lab</NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div class="nav-item">
          <NuxtLink class="nav-link" to="/blog">Blog</NuxtLink>
        </div>

        <a class="nav-cta" :href="calendlyUrl" target="_blank" rel="noopener">
          Contact Mariell
          <svg class="nav-arrow" viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
        </a>
      </div>

      <!-- Mobile trigger -->
      <button
        class="nav-burger"
        :aria-expanded="mobileOpen"
        aria-label="Menu"
        @click="mobileOpen = !mobileOpen"
      >
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path v-if="!mobileOpen" d="M3 6h18M3 12h18M3 18h18" />
          <path v-else d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile drawer -->
    <div v-show="mobileOpen" class="nav-mobile" role="navigation" aria-label="Navigation mobile">
      <NuxtLink class="nav-mobile__link" to="/mariell">Mariell</NuxtLink>

      <!-- Expertises accordion -->
      <div class="nav-mobile__accordion">
        <button
          class="nav-mobile__acc-trigger"
          :aria-expanded="expertisesOpen"
          type="button"
          @click="expertisesOpen = !expertisesOpen"
        >
          <span>Expertises</span>
          <svg class="nav-mobile__acc-chevron" :class="{ 'is-open': expertisesOpen }" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
        </button>
        <div v-show="expertisesOpen" class="nav-mobile__acc-panel">
          <NuxtLink class="nav-mobile__link" to="/expertises">Toutes les expertises</NuxtLink>
          <div class="nav-mobile__acc-head">— Representatives</div>
          <NuxtLink v-for="[to, label] in expertises.representatives" :key="to" class="nav-mobile__sub-link" :to="to">{{ label }}</NuxtLink>
          <div class="nav-mobile__acc-head">— Managers</div>
          <NuxtLink v-for="[to, label] in expertises.managers" :key="to" class="nav-mobile__sub-link" :to="to">{{ label }}</NuxtLink>
          <div class="nav-mobile__acc-head">— Directors</div>
          <NuxtLink v-for="[to, label] in expertises.directors" :key="to" class="nav-mobile__sub-link" :to="to">{{ label }}</NuxtLink>
          <div class="nav-mobile__acc-head">— Par contexte</div>
          <NuxtLink v-for="[to, label] in expertises.contexte" :key="to" class="nav-mobile__sub-link" :to="to">{{ label }}</NuxtLink>
          <div class="nav-mobile__acc-sep" />
          <NuxtLink v-for="[to, label] in expertises.references" :key="to" class="nav-mobile__sub-link" :to="to">{{ label }}</NuxtLink>
        </div>
      </div>

      <NuxtLink class="nav-mobile__link" to="/methode">Méthode</NuxtLink>

      <!-- Le Lab accordion -->
      <div class="nav-mobile__accordion">
        <button
          class="nav-mobile__acc-trigger"
          :aria-expanded="labOpen"
          type="button"
          @click="labOpen = !labOpen"
        >
          <span>Le Lab</span>
          <svg class="nav-mobile__acc-chevron" :class="{ 'is-open': labOpen }" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
        </button>
        <div v-show="labOpen" class="nav-mobile__acc-panel">
          <div class="nav-mobile__acc-head">— Outils</div>
          <NuxtLink v-for="[to, label] in labTools" :key="to" class="nav-mobile__sub-link" :to="to">{{ label }}</NuxtLink>
          <div class="nav-mobile__acc-head">— Guides</div>
          <NuxtLink v-for="[to, label] in labGuides" :key="to" class="nav-mobile__sub-link" :to="to">{{ label }}</NuxtLink>
          <div class="nav-mobile__acc-sep" />
          <NuxtLink class="nav-mobile__sub-link" to="/lab">Voir tout le Lab</NuxtLink>
        </div>
      </div>

      <NuxtLink class="nav-mobile__link" to="/blog">Blog</NuxtLink>
      <a class="nav-cta nav-mobile__cta" :href="calendlyUrl" target="_blank" rel="noopener">Contact Mariell</a>
    </div>
  </nav>
</template>

<style scoped>
/* scroll-shrink */
.site-nav {
  transition: padding 220ms var(--ease-out), background 220ms var(--ease-out);
}
.site-nav.is-scrolled { padding-top: 10px; padding-bottom: 10px; }

.nav-chevron, .nav-arrow {
  fill: none; stroke: currentColor; stroke-width: 1.75;
  stroke-linecap: round; stroke-linejoin: round;
}
.nav-link { cursor: pointer; }

/* Lab mega-menu: narrower, 2 columns (vs the wide 4-col Expertises panel). */
.mega__panel--lab {
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  max-width: 620px;
}

/* burger hidden on desktop */
.nav-burger {
  display: none;
  background: none; border: none; cursor: pointer;
  color: var(--paper-100); padding: 6px;
}
.nav-burger svg { fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }

.nav-mobile { display: none; }

@media (max-width: 900px) {
  .nav-burger { display: inline-flex; }

  .nav-mobile {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 8px 0 24px;
    border-top: 1px solid rgba(244, 239, 227, 0.08);
    overflow-y: auto;
    max-height: calc(100dvh - 64px);
  }

  /* Top-level flat links */
  .nav-mobile__link {
    color: rgba(244, 239, 227, 0.88);
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    padding: 13px 28px;
    display: block;
    min-height: 44px;
  }
  .nav-mobile__link:active { color: var(--cyan); }

  /* Accordion wrapper */
  .nav-mobile__accordion {
    display: flex;
    flex-direction: column;
  }

  /* Accordion trigger row */
  .nav-mobile__acc-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(244, 239, 227, 0.88);
    font-size: 16px;
    font-weight: 500;
    padding: 13px 28px;
    min-height: 44px;
    text-align: left;
    width: 100%;
  }
  .nav-mobile__acc-trigger:active { color: var(--cyan); }

  .nav-mobile__acc-chevron {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
    flex-shrink: 0;
    transition: transform 200ms ease;
  }
  .nav-mobile__acc-chevron.is-open {
    transform: rotate(180deg);
  }

  /* Accordion panel */
  .nav-mobile__acc-panel {
    display: flex;
    flex-direction: column;
    background: rgba(244, 239, 227, 0.04);
    padding: 4px 0 8px;
  }

  /* Section headings inside panel */
  .nav-mobile__acc-head {
    padding: 10px 36px 4px;
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(244, 239, 227, 0.4);
  }

  /* Sub-links inside panel */
  .nav-mobile__sub-link {
    color: rgba(244, 239, 227, 0.78);
    text-decoration: none;
    font-size: 14.5px;
    font-weight: 400;
    padding: 9px 36px;
    display: flex;
    align-items: center;
    min-height: 44px;
  }
  .nav-mobile__sub-link:active { color: var(--cyan); }

  /* Separator inside accordion */
  .nav-mobile__acc-sep {
    height: 1px;
    background: rgba(244, 239, 227, 0.08);
    margin: 6px 28px;
  }

  .nav-mobile__cta {
    margin: 14px 28px 0;
    align-self: flex-start;
  }
}
</style>
