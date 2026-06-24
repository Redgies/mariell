<script setup lang="ts">
const calendlyUrl = useRuntimeConfig().public.calendlyUrl as string
type Tab = 'cible' | 'buildout'
const tab = ref<Tab>('cible')
const sub: Record<Tab, string> = {
  cible: 'Premiers candidats sous 7–10 jours · 94 % de réussite',
  buildout: 'Devis sur mesure pour les recrutements multiples et les profils freelance',
}
</script>

<template>
  <section id="search" class="section section--ink statement">
    <div class="container statement__inner">
      <h2 class="h-display h-display--l statement__title reveal">
        Recruter n’est pas un <span class="italic">pari</span>.
      </h2>
      <p class="statement__lede reveal">
        Une obsession&#160;: identifier les meilleurs profils, la crème des Sales.<br>
        Aucune annonce. On scanne le marché, on identifie, on qualifie avec exigence.
      </p>
      <div class="statement__sub">{{ sub[tab] }}</div>
      <div class="statement__tabs">
        <button
          :class="['btn', tab === 'cible' ? 'btn--primary' : 'btn--secondary-ink']"
          type="button"
          @click="tab = 'cible'"
        >
          Recrutement ciblé
        </button>
        <button
          :class="['btn', tab === 'buildout' ? 'btn--primary' : 'btn--secondary-ink']"
          type="button"
          @click="tab = 'buildout'"
        >
          Team Buildout
        </button>
      </div>
      <div class="statement__cta">
        <a class="btn btn--primary" :href="calendlyUrl" target="_blank" rel="noopener">
          Rencontrer Mariell
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.statement {
  padding: 88px 40px;
  position: relative;
  overflow: hidden;
}
.statement__inner {
  position: relative;
}
.statement__title {
  max-width: none;
}
.statement__lede {
  margin-top: 24px;
  max-width: 780px;
  font-size: 17px;
  color: rgba(244, 239, 227, 0.72);
  line-height: 1.5;
}
.statement__sub {
  margin-top: 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(127, 231, 225, 0.85);
}
.statement__tabs {
  margin-top: 36px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.statement__cta {
  margin-top: 28px;
}
.statement__cta .icon {
  width: 14px;
  height: 14px;
}

@media (max-width: 900px) {
  .statement {
    padding: 64px 24px;
  }
  .statement__lede {
    font-size: 16px;
  }
}

@media (max-width: 560px) {
  .statement {
    padding: 52px 20px;
  }
  .statement__tabs {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
