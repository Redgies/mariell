<script setup lang="ts">
useHead({
  title: 'Demande reçue — Mariell · Le Lab',
  meta: [
    {
      name: 'description',
      content:
        'Votre demande de stage ou alternance Sales a bien été reçue. Nous revenons vers vous sous 7 à 10 jours ouvrés.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})
</script>

<template>
  <LabToolShell>
    <main class="confirm-shell">
      <div class="confirm-card">
        <span class="confirm-eyebrow">Outil&nbsp;01 · Le&nbsp;Lab&nbsp;Mariell</span>
        <h1 class="confirm-title">Demande <em>reçue.</em></h1>
        <p class="confirm-body">Nous revenons vers vous sous 7 à 10 jours ouvrés.</p>
        <p class="confirm-frame">
          Service offert sous réserve de disponibilité de profils pertinents.
          Priorité accordée à nos clients.
        </p>
        <NuxtLink to="/lab" class="confirm-cta">
          <svg
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
    </main>
  </LabToolShell>
</template>

<style scoped>
.confirm-shell {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 20px;
}
.confirm-card {
  max-width: 600px;
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.confirm-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-family: var(--font-grotesk);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #5ee7e7;
}
.confirm-eyebrow::before {
  content: "";
  width: 32px;
  height: 1px;
  background: currentColor;
}

.confirm-title {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-size: clamp(40px, 6vw, 68px);
  line-height: 1.04;
  letter-spacing: -0.035em;
  margin: 0;
  color: #fff;
}
.confirm-title em {
  font-style: italic;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.confirm-body {
  font-size: 18px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 300;
  max-width: 48ch;
}
.confirm-frame {
  font-style: italic;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
  max-width: 48ch;
}

.confirm-cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 28px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: transparent;
  color: #fff;
  font-family: var(--font-grotesk);
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  align-self: flex-start;
  margin-top: 4px;
  transition:
    border-color 0.25s ease-out,
    background 0.25s ease-out,
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.confirm-cta:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.04);
  transform: translateY(-1px);
}
.confirm-cta svg {
  width: 14px;
  height: 14px;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.confirm-cta:hover svg { transform: translateX(-3px); }

@media (prefers-reduced-motion: reduce) {
  .confirm-cta,
  .confirm-cta svg { transition: none; }
}
</style>
