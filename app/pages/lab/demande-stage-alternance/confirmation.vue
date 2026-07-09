<script setup lang="ts">
definePageMeta({ layout: false })
</script>

<template>
  <div class="tool-body">
  <div class="tool-bg" aria-hidden="true" />
  <nav class="site-nav">
    <div class="site-nav__inner">
      <NuxtLink to="/" class="site-nav__brand" aria-label="Mariell, accueil">
        <ChromaticWordmark text="Mariell" :size="22" glitch />
      </NuxtLink>
      <NuxtLink to="/lab" class="nav-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Retour au Lab
      </NuxtLink>
    </div>
  </nav>
  <div class="tcenter">
    <div class="tcenter-card">
      <div class="tool-eyebrow">Outil · Le&nbsp;Lab&nbsp;Mariell</div>
      <h1 class="tool-title">Demande <em>reçue.</em></h1>
      <p class="tool-subtitle">Nous revenons vers vous sous 7 à 10 jours ouvrés.</p>
      <p class="tool-frame">
        Service offert sous réserve de disponibilité de profils pertinents.
        Priorité accordée à nos clients.
      </p>
      <NuxtLink to="/lab" class="tsubmit confirm-back" style="margin-top: 32px; text-decoration: none;">
        <svg
          class="tsubmit-arrow"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Retour au Lab
      </NuxtLink>
    </div>
  </div>
  </div>
</template>

<style scoped>
/* tsubmit used as a back link — override align-self so it doesn’t stretch */
.confirm-back {
  align-self: flex-start;
}
</style>
