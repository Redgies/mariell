<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative border-t border-white/8 bg-black px-5 pt-12 pb-6 md:px-10 lg:px-16">
    <div class="mx-auto max-w-7xl">
      <div class="grid grid-cols-1 gap-8 pb-10 md:grid-cols-[2fr_1fr_1fr] md:gap-12">
        <div>
          <a href="#accueil">
            <img src="/logo_site.png" alt="Mariell" class="block h-9 w-auto" />
          </a>
          <p
            class="mt-4 max-w-md text-[0.9rem] leading-[1.6] text-white/55"
            style="font-family: var(--font-grotesk); font-weight: 300;"
          >
            Cabinet de recrutement Sales premium. Paris — mais on chasse partout où vos meilleurs profils se cachent.
          </p>
        </div>

        <div>
          <p class="font-mono-num mb-3 text-[0.7rem] uppercase tracking-[0.24em] text-white/40">
            Navigation
          </p>
          <ul class="flex flex-col gap-2 text-[0.9rem]" style="font-family: var(--font-grotesk); font-weight: 300;">
            <li><a href="#accueil" class="text-white/75 transition-colors hover:text-white">Accueil</a></li>
            <li><a href="#who" class="text-white/75 transition-colors hover:text-white">Who is Mariell ?</a></li>
            <li><a href="#process-section" class="text-white/75 transition-colors hover:text-white">Process</a></li>
            <li><a href="#pricing" class="text-white/75 transition-colors hover:text-white">Pricing</a></li>
          </ul>
        </div>

        <div>
          <p class="font-mono-num mb-3 text-[0.7rem] uppercase tracking-[0.24em] text-white/40">
            Légal
          </p>
          <ul class="flex flex-col gap-2 text-[0.9rem]" style="font-family: var(--font-grotesk); font-weight: 300;">
            <li><NuxtLink to="/mentions-legales" class="text-white/75 transition-colors hover:text-white">Mentions légales</NuxtLink></li>
            <li><NuxtLink to="/politique-confidentialite" class="text-white/75 transition-colors hover:text-white">Politique de protection des données</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div
        class="flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-5"
      >
        <p class="font-mono-num text-[0.72rem] tracking-[0.2em] text-white/40">
          © {{ year }} MARIELL · TOUS DROITS RÉSERVÉS
        </p>
        <p
          class="text-[0.95rem] italic text-white/55"
          style="font-family: var(--font-serif-jp); font-weight: 500;"
        >
          Recruter n'est pas un pari.
        </p>
      </div>
    </div>
  </footer>
</template>
