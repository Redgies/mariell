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
          <li><span class="text-white/50">Raison sociale :</span> <span class="text-red-400">[ Nom de la société ]</span></li>
          <li><span class="text-white/50">Forme juridique :</span> <span class="text-red-400">[ SAS / SARL / Auto-entrepreneur... ]</span></li>
          <li><span class="text-white/50">Capital social :</span> <span class="text-red-400">[ Montant ] €</span></li>
          <li><span class="text-white/50">SIRET :</span> <span class="text-red-400">[ Numéro SIRET ]</span></li>
          <li><span class="text-white/50">N° TVA intracommunautaire :</span> <span class="text-red-400">[ Numéro TVA ]</span></li>
          <li><span class="text-white/50">Siège social :</span> <span class="text-red-400">[ Adresse complète ], Paris</span></li>
          <li><span class="text-white/50">Téléphone :</span> <span class="text-red-400">[ +33 X XX XX XX XX ]</span></li>
          <li><span class="text-white/50">Email :</span> <span class="text-red-400">[ contact@mariell.fr ]</span></li>
        </ul>
      </section>

      <div class="hairline revealed" />

      <!-- Directeur de publication -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">2. Directeur de la publication</h2>
        <p>Le directeur de la publication est <span class="text-red-400">[ Prénom Nom ]</span>, en qualité de <span class="text-red-400">[ Gérant / Président ]</span>.</p>
      </section>

      <div class="hairline revealed" />

      <!-- Hébergeur -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">3. Hébergeur</h2>
        <p>Le site est hébergé par :</p>
        <ul class="space-y-1 pl-4">
          <li><span class="text-white/50">Société :</span> <span class="text-red-400">[ Nom de l'hébergeur ]</span></li>
          <li><span class="text-white/50">Adresse :</span> <span class="text-red-400">[ Adresse de l'hébergeur ]</span></li>
          <li><span class="text-white/50">Site :</span> <span class="text-red-400">[ www.hebergeur.com ]</span></li>
        </ul>
      </section>

      <div class="hairline revealed" />

      <!-- Propriété intellectuelle -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">4. Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus présents sur ce site (textes, images, graphismes, logo, icônes, sons, logiciels…) est la propriété exclusive de
          <span class="text-red-400">[ Nom de la société ]</span>, à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.
        </p>
        <p>
          Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l'accord exprès par écrit de <span class="text-red-400">[ Nom de la société ]</span>.
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
          Pour exercer ces droits, contactez-nous à l'adresse : <span class="text-red-400">[ contact@mariell.fr ]</span>
        </p>
        <p>Pour plus d'informations, consultez notre <NuxtLink to="/politique-confidentialite" class="text-white underline underline-offset-4 hover:text-white/70">Politique de protection des données</NuxtLink>.</p>
      </section>

      <div class="hairline revealed" />

      <!-- Cookies -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">6. Cookies</h2>
        <p>
          Ce site <span class="text-red-400">[ utilise / n'utilise pas ]</span> des cookies. <span class="text-red-400">[ Si applicable : Lors de votre navigation, des cookies peuvent être déposés sur votre terminal. Vous pouvez paramétrer votre navigateur pour refuser ces cookies. ]</span>
        </p>
      </section>

      <div class="hairline revealed" />

      <!-- Responsabilité -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">7. Limitation de responsabilité</h2>
        <p>
          <span class="text-red-400">[ Nom de la société ]</span> ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur lors de l'accès au site, résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications techniques requises, soit de l'apparition d'un bug ou d'une incompatibilité.
        </p>
      </section>

      <div class="hairline revealed" />

      <p class="text-xs text-white/30">
        Dernière mise à jour : <span class="text-red-400">[ JJ/MM/AAAA ]</span>
      </p>
    </div>
  </main>
</template>
