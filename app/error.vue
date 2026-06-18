<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error?.statusCode === 404)
const code = computed(() => props.error?.statusCode || 500)

useSeoMeta({
  title: is404.value ? 'Page introuvable | Mariell' : 'Erreur | Mariell',
  robots: 'noindex, follow',
})

const goHome = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="err">
    <div class="err__inner">
      <NuxtLink to="/" class="err__brand" aria-label="Mariell, accueil" @click.prevent="goHome">
        <ChromaticWordmark text="Mariell" :size="22" />
      </NuxtLink>

      <div class="eyebrow err__eyebrow">Erreur {{ code }}</div>

      <h1 class="h-display h-display--l err__title">
        <template v-if="is404">Cette page est introuvable.</template>
        <template v-else>Une erreur est survenue.</template>
      </h1>

      <p class="err__lede">
        <template v-if="is404">
          La page que vous cherchez n’existe pas ou a été déplacée.
        </template>
        <template v-else>
          Quelque chose s’est mal passé de notre côté. Réessayez dans un instant.
        </template>
      </p>

      <div class="err__actions">
        <button type="button" class="btn btn--primary" @click="goHome">
          Retour à l’accueil
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
        </button>
        <NuxtLink to="/lab" class="btn btn--secondary-ink" @click.prevent="clearError({ redirect: '/lab' })">
          Explorer le Lab
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.err {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  background: var(--ink-900);
  color: var(--fg-on-ink-1);
}
.err__inner {
  max-width: 560px;
  text-align: center;
}
.err__brand {
  display: inline-block;
  text-decoration: none;
  margin-bottom: 40px;
}
.err__eyebrow {
  color: var(--cyan);
  margin-bottom: 18px;
}
.err__title {
  margin: 0;
}
.err__lede {
  margin: 22px auto 0;
  max-width: 420px;
  font-size: 17px;
  line-height: 1.55;
  color: var(--fg-on-ink-2);
}
.err__actions {
  margin-top: 36px;
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}
.err__actions .icon {
  width: 14px;
  height: 14px;
}

@media (max-width: 560px) {
  .err__actions { flex-direction: column; align-items: stretch; }
  .err__actions .btn { justify-content: center; }
}
</style>
