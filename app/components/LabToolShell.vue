<script setup lang="ts">
// Focused tool experience — the global AppNavbar / AppFooter / GradientBlobs
// are hidden by app.vue when route starts with /lab/demande-stage-alternance.
// This component renders the mini lab nav + the dedicated atmospheric blobs.
</script>

<template>
  <div class="lab-tool-root">
    <div class="page-bg" aria-hidden="true">
      <div class="blob blob-a blob-slow" />
      <div class="blob blob-b" />
    </div>

    <nav class="top-nav">
      <div class="top-nav-inner">
        <NuxtLink to="/" class="top-nav-logo" aria-label="Mariell">
          <img src="/logo_site.png" alt="Mariell" />
        </NuxtLink>
        <NuxtLink to="/lab" class="top-nav-back">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Retour au Lab
        </NuxtLink>
      </div>
    </nav>

    <slot />
  </div>
</template>

<style scoped>
.lab-tool-root {
  position: relative;
  min-height: 100vh;
  background: #000;
}

/* ---------- Atmospheric background ---------- */
.page-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
.page-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(1200px 600px at 50% -10%, rgba(94, 231, 231, 0.08), transparent 60%);
  pointer-events: none;
}
.blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(120px);
  animation: blob-drift 28s ease-in-out infinite alternate;
  pointer-events: none;
}
.blob-slow { animation-duration: 42s; }
.blob-a {
  width: 640px;
  height: 640px;
  top: -180px;
  left: -160px;
  background: rgba(0, 200, 255, 0.20);
  opacity: 0.25;
}
.blob-b {
  width: 720px;
  height: 720px;
  bottom: -240px;
  right: -200px;
  background: rgba(255, 0, 255, 0.18);
  opacity: 0.22;
}
@keyframes blob-drift {
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  50%  { transform: translate3d(4%, -3%, 0) scale(1.06); }
  100% { transform: translate3d(-3%, 2%, 0) scale(0.97); }
}

/* ---------- Top mini nav ---------- */
.top-nav {
  position: relative;
  z-index: 10;
  height: 80px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.top-nav-inner {
  max-width: 80rem;
  margin: 0 auto;
  height: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
@media (min-width: 768px) {
  .top-nav-inner { padding: 0 40px; }
}
@media (min-width: 1024px) {
  .top-nav-inner { padding: 0 64px; }
}

.top-nav-logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}
.top-nav-logo img {
  height: 26px;
  width: auto;
  display: block;
}

.top-nav-back {
  font-family: var(--font-grotesk);
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.top-nav-back:hover { color: #fff; }
.top-nav-back svg { width: 14px; height: 14px; }

@media (prefers-reduced-motion: reduce) {
  .blob { animation: none; }
}
</style>
