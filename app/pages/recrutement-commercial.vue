<script setup lang="ts">
const { public: pub } = useRuntimeConfig()
const calendlyUrl = pub.calendlyUrl as string

const profiles = [
  {
    to: '/expertises/sdr',
    title: 'SDR / BDR',
    excerpt: 'Les commerciaux qui alimentent le pipeline en amont.',
  },
  {
    to: '/expertises/account-executive-mid-market',
    title: 'Account Executive',
    excerpt: 'Les commerciaux qui portent les cycles de vente.',
  },
  {
    to: '/expertises/sales-manager',
    title: 'Sales Manager / Responsable Commercial',
    excerpt: "Les managers qui font grandir une équipe commerciale.",
  },
  {
    to: '/expertises/head-of-sales',
    title: 'Head of Sales / Directeur Commercial',
    excerpt: 'Les dirigeants qui structurent la machine commerciale.',
  },
  {
    to: '/expertises/vp-sales',
    title: 'VP Sales / Directeur Commercial',
    excerpt: "Le pilotage d’une organisation commerciale entière.",
  },
  {
    to: '/expertises',
    title: 'Toutes les expertises',
    excerpt: 'Du SDR au CRO, le spectre complet.',
  },
]
</script>

<template>
  <div class="chromatic-mode">
    <main class="page-main">

      <section class="page-hero">
        <div class="page-hero__inner">
          <Breadcrumb :items="[{ label: 'Recrutement commercial' }]" />
          <h1 class="h-display h-display--l" style="max-width:1120px;font-size:clamp(34px,4.4vw,56px);">
            Cabinet de recrutement commercial,<br/>du SDR au CRO.
          </h1>
          <p style="margin-top:24px;max-width:600px;font-size:18px;line-height:1.55;color:rgba(244,239,227,0.72);">Mariell recrute vos commerciaux par approche directe. Pas d’annonce, pas de pile de CV&nbsp;: nous chassons, évaluons et ne présentons que les profils Sales qui font la différence. Du premier commercial à la direction commerciale.</p>
          <div style="margin-top:32px;display:flex;gap:12px;flex-wrap:wrap;">
            <a class="btn-pill btn-cyan" :href="calendlyUrl" target="_blank" rel="noopener">Lancer un recrutement</a>
            <NuxtLink class="btn-pill btn-ghost" to="/expertises">Voir toutes les expertises</NuxtLink>
          </div>
        </div>
      </section>

      <section class="section-pad section--paper">
        <div class="container" style="max-width:820px;">
          <h2 class="h-display h-display--s" style="margin:0 0 18px;">Un cabinet de recrutement commercial spécialisé</h2>
          <p style="font-size:17px;line-height:1.6;color:var(--fg-on-paper-2);">Recruter un commercial n’est pas un recrutement comme les autres. La performance se mesure, le marché bouge vite, et les meilleurs commerciaux ne répondent pas aux annonces. Mariell est un cabinet de recrutement commercial qui ne fait que ça&nbsp;: identifier, approcher et évaluer les commerciaux qui tiennent leurs objectifs, puis en sécuriser le recrutement de bout en bout.</p>
          <p style="font-size:17px;line-height:1.6;color:var(--fg-on-paper-2);margin-top:16px;">Du SDR au CRO, en recrutement individuel ou en construction d’équipe complète, nous couvrons tout le spectre des métiers commerciaux. Notre approche directe nous donne accès aux commerciaux en poste, ceux que vos annonces ne toucheront jamais.</p>
          <p style="font-size:17px;line-height:1.6;color:var(--fg-on-paper-2);margin-top:16px;">
            Au-delà des profils phares, nous recrutons aussi vos
            <NuxtLink to="/expertises/business-developer-full-cycle" class="rc-link">Business Developers full-cycle</NuxtLink>,
            <NuxtLink to="/expertises/account-executive-pme" class="rc-link">AE PME</NuxtLink> et
            <NuxtLink to="/expertises/account-executive-enterprise" class="rc-link">AE Enterprise</NuxtLink>, vos
            <NuxtLink to="/expertises/account-manager" class="rc-link">Account Managers</NuxtLink>,
            <NuxtLink to="/expertises/customer-success-manager" class="rc-link">Customer Success Managers</NuxtLink>,
            <NuxtLink to="/expertises/sales-ops-revops" class="rc-link">profils Sales Ops / RevOps</NuxtLink>,
            <NuxtLink to="/expertises/channel-partner-manager" class="rc-link">Channel Managers</NuxtLink>, vos
            <NuxtLink to="/expertises/sdr" class="rc-link">SDR et BDR</NuxtLink> comme votre
            <NuxtLink to="/expertises/cro" class="rc-link">CRO</NuxtLink>.
            Pour calibrer chaque offre, appuyez-vous sur notre <NuxtLink to="/lab" class="rc-link">guide des salaires Sales</NuxtLink>.
          </p>
        </div>
      </section>

      <section class="section-pad section--paper" style="padding-top:0;">
        <div class="container" style="max-width:820px;">
          <div class="eyebrow-m" style="margin-bottom:14px;">— Les profils commerciaux que nous recrutons</div>
          <div class="grid-cards">
            <NuxtLink
              v-for="p in profiles"
              :key="p.to"
              :to="p.to"
              class="ucard"
            >
              <div class="ucard__title">{{ p.title }}</div>
              <div class="ucard__excerpt">{{ p.excerpt }}</div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <section class="section-pad section--paper" style="padding-top:0;">
        <div class="container">
          <div class="cta-strip">
            <div style="font-family:var(--font-display);font-weight:500;font-size:28px;letter-spacing:-0.02em;line-height:1.15;max-width:560px;">Un recrutement commercial à lancer&nbsp;?</div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <a class="btn-pill btn-cyan" :href="calendlyUrl" target="_blank" rel="noopener">Rencontrer Mariell</a>
              <NuxtLink class="btn-pill btn-ghost" to="/cas-clients">Voir les cas clients</NuxtLink>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
.rc-link {
  color: var(--moss);
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}
</style>
