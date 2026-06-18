<script setup lang="ts">
const calendlyUrl = useRuntimeConfig().public.calendlyUrl as string
</script>

<template>
  <section id="cta" class="section section--paper cta">
    <div class="container cta__inner">
      <div class="reveal">
        <ChromaticWordmark text="Mariell" :size="60" class="cta__wordmark" />
        <p class="cta__lede">
          <strong>Mariell</strong> est une équipe de Sales. Notre métier est de recruter d’autres Sales pour
          les entreprises qui exigent un standard rare. Du SDR au CRO. Recrutement individuel ou constitution
          d’équipe complète, par approche directe.
        </p>
        <div class="cta__link">
          <NuxtLink class="arrow-link" to="/methode">
            <span>Notre méthode en détail</span>
            <svg class="icon arrow-link__arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
          </NuxtLink>
        </div>
      </div>

      <div class="cta__panel reveal">
        <div class="cta__eyebrow">Lancer une recherche</div>
        <div class="cta__headline">Votre prochain Sales ne se trouvera pas dans une pile de CV.</div>
        <div class="cta__sub">
          Un poste précis, une équipe Sales à construire, ou la simple envie d’évaluer ce qu’on peut vous
          apporter. Sur-mesure, jamais standard. Échangeons sur votre contexte avant tout engagement.
        </div>
        <div class="cta__actions">
          <a class="btn btn--primary" :href="calendlyUrl" target="_blank" rel="noopener">
            Rencontrer Mariell
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
          </a>
          <a class="btn btn--secondary-ink" href="mailto:chez@mariell.fr">Nous écrire</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  padding-top: 72px;
  padding-bottom: 72px;
}
.cta__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
/* Wordmark sits on cream here: force the base glyph to ink (component default
   is cream, intended for dark surfaces). */
.cta__wordmark :deep(.chromatic__base) {
  color: var(--ink-900);
}
.cta__wordmark :deep(.chromatic__layer--cyan) {
  opacity: 0.85;
}
.cta__wordmark :deep(.chromatic__layer--magenta) {
  opacity: 0.85;
}
.cta__lede {
  margin-top: 24px;
  font-size: 15.5px;
  color: var(--fg-on-paper-2);
  line-height: 1.5;
  max-width: 460px;
}
.cta__lede strong {
  color: var(--fg-on-paper-1);
  font-weight: 600;
}
.cta__link {
  margin-top: 22px;
}
.cta__panel {
  background: var(--ink-900);
  color: var(--fg-on-ink-1);
  border-radius: 16px;
  padding: 32px 40px;
  position: relative;
  overflow: hidden;
}
.cta__eyebrow {
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(127, 231, 225, 0.85);
}
.cta__headline {
  margin-top: 14px;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 28px;
  letter-spacing: -0.02em;
  line-height: 1.15;
  text-wrap: balance;
}
.cta__sub {
  margin-top: 14px;
  font-size: 14.5px;
  color: rgba(244, 239, 227, 0.7);
  max-width: 470px;
}
.cta__actions {
  margin-top: 24px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.cta__actions .icon {
  width: 14px;
  height: 14px;
}

@media (max-width: 900px) {
  .cta__inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .cta {
    padding-top: 56px;
    padding-bottom: 56px;
  }
}

@media (max-width: 560px) {
  .cta__panel {
    padding: 24px 24px;
  }
  .cta__headline {
    font-size: 22px;
  }
}
</style>
