<template>
  <main class="relative mx-auto max-w-4xl px-5 py-32 md:px-10 md:py-40 lg:px-16">
    <NuxtLink
      to="/"
      class="mb-20 flex w-fit items-center gap-2 font-mono-num text-xs uppercase tracking-[0.22em] text-white/40 transition-colors hover:text-white"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Retour
    </NuxtLink>

    <p class="eyebrow mb-6">Légal</p>
    <h1 class="headline-lg text-white">Mentions légales</h1>

    <div
      class="mt-12 space-y-10 text-sm leading-relaxed text-white/70 md:text-base"
      style="font-family: var(--font-grotesk); font-weight: 300;"
    >

      <!-- Éditeur -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">1. Éditeur du site</h2>
        <p>Le site <strong class="text-white">mariell.fr</strong> est édité par :</p>
        <ul class="space-y-1 pl-4">
          <li><span class="text-white/50">Nom commercial :</span> <span class="text-white">Mariell</span></li>
          <li><span class="text-white/50">Exploité par :</span> <span class="text-white">Sean José LIGEIRO</span></li>
          <li><span class="text-white/50">Forme juridique :</span> <span class="text-white">Entrepreneur Individuel (EI)</span></li>
          <li><span class="text-white/50">SIRET :</span> <span class="text-white">929 566 917 00019</span></li>
          <li><span class="text-white/50">N° TVA intracommunautaire :</span> <span class="text-white">FR39929566917</span></li>
          <li><span class="text-white/50">Siège social :</span> <span class="text-white">108 rue des Bourguignons, 92600 Asnières-sur-Seine</span></li>
          <li><span class="text-white/50">Téléphone :</span> <a href="tel:+33631688981" class="text-white hover:text-white/70">+33 6 31 68 89 81</a></li>
          <li><span class="text-white/50">Email :</span> <a href="mailto:chez@mariell.fr" class="text-white underline underline-offset-4 hover:text-white/70">chez@mariell.fr</a></li>
        </ul>
      </section>

      <div class="hairline revealed" />

      <!-- Directeur de publication -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">2. Directeur de la publication</h2>
        <p>Le directeur de la publication est <span class="text-white">Sean José LIGEIRO</span>, en qualité de gérant.</p>
      </section>

      <div class="hairline revealed" />

      <!-- Hébergeur -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">3. Hébergeur</h2>
        <p>Le site est hébergé par :</p>
        <ul class="space-y-1 pl-4">
          <li><span class="text-white/50">Société :</span> <span class="text-white">Vercel Inc.</span></li>
          <li><span class="text-white/50">Adresse :</span> <span class="text-white">440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</span></li>
          <li><span class="text-white/50">Site :</span> <a href="https://vercel.com" target="_blank" rel="noopener" class="text-white underline underline-offset-4 hover:text-white/70">vercel.com</a></li>
        </ul>
      </section>

      <div class="hairline revealed" />

      <!-- Propriété intellectuelle -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">4. Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus présents sur ce site (textes, images, graphismes, logo, icônes, sons, logiciels…) est la propriété exclusive de
          <span class="text-white">Mariell</span>, à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.
        </p>
        <p>
          Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l'accord exprès par écrit de <span class="text-white">Mariell</span>.
        </p>
      </section>

      <div class="hairline revealed" />

      <!-- Données personnelles -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">5. Données personnelles</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition aux données vous concernant.
        </p>
        <p>
          Pour exercer ces droits, contactez-nous à l'adresse : <a href="mailto:chez@mariell.fr" class="text-white underline underline-offset-4 hover:text-white/70">chez@mariell.fr</a>
        </p>
        <p>Pour plus d'informations, consultez notre <NuxtLink to="/politique-confidentialite" class="text-white underline underline-offset-4 hover:text-white/70">Politique de protection des données</NuxtLink>.</p>
      </section>

      <div class="hairline revealed" />

      <!-- Cookies -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">6. Cookies</h2>
        <p>Ce site n'utilise pas de cookies.</p>
      </section>

      <div class="hairline revealed" />

      <!-- Responsabilité -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">7. Limitation de responsabilité</h2>
        <p>
          <span class="text-white">Mariell</span> ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur lors de l'accès au site, résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications techniques requises, soit de l'apparition d'un bug ou d'une incompatibilité.
        </p>
      </section>

      <div class="hairline revealed" />

      <p class="text-xs text-white/30">
        Dernière mise à jour : 18/04/2026
      </p>
    </div>
  </main>
</template>
