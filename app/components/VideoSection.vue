<script setup lang="ts">
// TODO: replace .video-wrap placeholder with <iframe src="..."> when the video is ready.
</script>

<template>
  <section id="who" class="relative px-5 py-12 md:px-10 md:py-16 lg:px-16">
    <div class="reveal mx-auto max-w-7xl">
      <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <!-- Copy -->
        <div>
          <span class="eyebrow-cyan">Who is Mariell ?</span>
          <h2 class="mt-5 headline-section pb-2 text-white" data-split>
            Mariell<br />
            se présente<br />
            <span class="gradient-text italic">à vous.</span>
          </h2>
          <p
            class="mt-5 text-[16px] leading-[1.7] text-white/65"
            style="font-family: var(--font-grotesk); font-weight: 300;"
          >
            Une obsession&nbsp;: identifier les meilleurs Sales, la crème du market.<br />
            Une méthode&nbsp;: chasse directe, évaluation critique Soft &amp; Hard Skills.
          </p>
        </div>

        <!-- Video placeholder -->
        <div class="video-wrap">
          <button
            type="button"
            class="video-play"
            aria-label="Lire la vidéo (à venir)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <div class="font-mono-num text-[12px] uppercase tracking-[0.28em] text-white/45">
            Vidéo à venir
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.video-wrap {
  position: relative;
  aspect-ratio: 16 / 10;
  width: 100%;
  background: linear-gradient(135deg, #0e0e12, #16161c);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}
.video-wrap::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(94, 231, 231, 0.5), transparent 40%, transparent 60%, rgba(232, 94, 255, 0.5));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
.video-play {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5ee7e7 0%, #e85eff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  cursor: pointer;
  box-shadow: 0 10px 40px rgba(139, 92, 246, 0.45);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease-out;
}
.video-play:hover {
  transform: scale(1.05);
  box-shadow: 0 16px 56px rgba(139, 92, 246, 0.6);
}
.video-play svg {
  width: 32px;
  height: 32px;
  fill: #0b0b12;
  margin-left: 4px;
}
</style>
