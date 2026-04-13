<script setup lang="ts">
// TODO: remplacer le conteneur placeholder par une <iframe> YouTube/Vimeo le jour où la vidéo est prête.
// Exemple :
// <iframe class="h-full w-full" src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen />
</script>

<template>
  <section id="who" class="relative px-5 py-28 md:px-10 md:py-40 lg:px-16">
    <div class="mx-auto grid max-w-7xl grid-cols-12 gap-x-6 gap-y-10">
      <div class="col-span-12 md:col-span-4">
        <SectionLabel number="— 01" label="Qui est Mariell" />
        <h2 class="mt-6 headline-lg text-white scroll-parallax" data-parallax="-0.8" data-split>
          Who is<br /><span class="gradient-text italic pr-2">Mariell</span>&thinsp;?
        </h2>
        <p
          class="reveal mt-6 max-w-xs text-base leading-relaxed text-white/60"
          style="font-family: var(--font-grotesk); font-weight: 300;"
        >
          Une équipe de Sales devenus recruteurs, par conviction et par exigence. L'histoire en deux minutes.
        </p>
      </div>

      <div class="col-span-12 md:col-span-8">
        <!-- TODO: remplacer par <iframe src="..."> ci-dessous -->
        <div
          class="reveal group relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-950"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-fuchsia-500/10" />
          <div class="grain" />

          <div class="relative flex h-full w-full flex-col items-center justify-center gap-5">
            <button
              type="button"
              class="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-cyan-400/50 group-hover:bg-white/10"
              aria-label="Lire la vidéo (à venir)"
            >
              <svg class="ml-1" width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <p class="font-mono-num text-xs uppercase tracking-[0.25em] text-white/45">
              Vidéo · à venir
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
