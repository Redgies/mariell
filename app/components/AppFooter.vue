<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative border-t border-white/10 bg-black px-5 pt-20 pb-10 md:px-10 lg:px-16">
    <div class="mx-auto max-w-7xl">
      <div class="grid grid-cols-12 gap-x-6 gap-y-12 pb-16">
        <div class="col-span-12 md:col-span-6">
          <a href="#accueil">
            <img src="/logo_site.png" alt="Mariell" class="h-12 w-auto md:h-16" />
          </a>
          <p
            class="mt-6 max-w-md text-sm leading-relaxed text-white/55 md:text-base"
            style="font-family: var(--font-grotesk); font-weight: 300;"
          >
            Cabinet de recrutement Sales premium. Paris — mais on chasse partout où vos meilleurs profils se cachent.
          </p>
        </div>

        <div class="col-span-6 md:col-span-3">
          <p class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">
            Navigation
          </p>
          <ul class="mt-5 space-y-3 text-sm" style="font-family: var(--font-grotesk); font-weight: 300;">
            <li><a href="#accueil" class="text-white/75 transition-colors hover:text-white">Accueil</a></li>
            <li><a href="#who" class="text-white/75 transition-colors hover:text-white">Who is Mariell</a></li>
            <li><a href="#process" class="text-white/75 transition-colors hover:text-white">Process</a></li>
            <li><a href="#pricing" class="text-white/75 transition-colors hover:text-white">Pricing</a></li>
          </ul>
        </div>

        <div class="col-span-6 md:col-span-3">
          <p class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">
            Légal
          </p>
          <ul class="mt-5 space-y-3 text-sm" style="font-family: var(--font-grotesk); font-weight: 300;">
            <li><a href="#" class="text-white/75 transition-colors hover:text-white">Mentions légales</a></li>
            <li><a href="#" class="text-white/75 transition-colors hover:text-white">Politique de protection des données</a></li>
          </ul>
        </div>
      </div>

      <div class="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center">
        <p
          class="font-mono-num text-xs text-white/40"
        >
          © {{ year }} MARIELL · TOUS DROITS RÉSERVÉS
        </p>
        <p class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">
          Recruter n'est pas un pari.
        </p>
      </div>
    </div>
  </footer>
</template>
