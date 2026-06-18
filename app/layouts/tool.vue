<script setup lang="ts">
// Focused chrome for the Lab tools: a stripped "Retour au Lab" bar, no full
// nav or footer, so the form / result owns the viewport.
</script>

<template>
  <div class="tool-shell">
    <header class="tool-nav">
      <div class="tool-nav__inner">
        <NuxtLink class="tool-nav__back" to="/lab">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          Retour au Lab
        </NuxtLink>
        <NuxtLink class="tool-nav__brand" to="/" aria-label="Mariell, accueil">
          <ChromaticWordmark text="Mariell" :size="20" />
        </NuxtLink>
      </div>
    </header>
    <main class="tool-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.tool-shell {
  min-height: 100vh;
  background: var(--paper-100);
  color: var(--fg-on-paper-1);
}
.tool-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 900;
  padding: 16px 40px;
  background: rgba(11, 13, 16, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(244, 239, 227, 0.08);
}
.tool-nav__inner {
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.tool-nav__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(244, 239, 227, 0.88);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 160ms var(--ease-out);
}
.tool-nav__back:hover { color: var(--cyan); }
.tool-nav__back svg {
  fill: none; stroke: currentColor; stroke-width: 1.75;
  stroke-linecap: round; stroke-linejoin: round;
}
.tool-nav__brand { line-height: 1; text-decoration: none; }
.tool-main { padding-top: 64px; }

@media (max-width: 900px) {
  .tool-nav { padding: 12px 20px; }
  .tool-nav__inner { gap: 12px; }
  .tool-nav__back {
    font-size: 13px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }
}

@media (max-width: 560px) {
  .tool-nav { padding: 10px 16px; }
  .tool-nav__back { font-size: 13px; }
  .tool-main { padding-top: 60px; }
}
</style>
