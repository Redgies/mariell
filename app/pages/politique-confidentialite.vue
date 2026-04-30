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
    <h1 class="headline-lg text-white">Politique de protection des données</h1>

    <div
      class="mt-12 space-y-10 text-sm leading-relaxed text-white/70 md:text-base"
      style="font-family: var(--font-grotesk); font-weight: 300;"
    >

      <!-- Responsable -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">1. Responsable du traitement</h2>
        <p>
          Le responsable du traitement des données personnelles collectées sur ce site est :
          <span class="text-white">Sean José LIGEIRO</span>, exerçant sous le nom commercial <span class="text-white">Mariell</span>, dont le siège social est situé
          <span class="text-white">108 rue des Bourguignons, 92600 Asnières-sur-Seine</span>.
        </p>
        <p>Contact : <a href="mailto:chez@mariell.fr" class="text-white underline underline-offset-4 hover:text-white/70">chez@mariell.fr</a></p>
      </section>

      <div class="hairline revealed" />

      <!-- Données collectées -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">2. Données collectées</h2>
        <p>Dans le cadre de notre activité, nous sommes amenés à collecter les données personnelles suivantes :</p>
        <ul class="space-y-2 pl-4">
          <li class="flex items-start gap-2">
            <span class="mt-2 h-px w-4 shrink-0 bg-cyan-400/70" />
            <span><strong class="text-white">Données d'identification</strong> — nom, prénom, adresse email, numéro de téléphone</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-2 h-px w-4 shrink-0 bg-cyan-400/70" />
            <span><strong class="text-white">Données professionnelles</strong> — intitulé de poste, entreprise, secteur d'activité</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-2 h-px w-4 shrink-0 bg-cyan-400/70" />
            <span><strong class="text-white">Données de navigation</strong> — adresse IP, type de navigateur, pages visitées</span>
          </li>
        </ul>
      </section>

      <div class="hairline revealed" />

      <!-- Finalités -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">3. Finalités du traitement</h2>
        <p>Les données collectées sont utilisées pour :</p>
        <ul class="space-y-2 pl-4">
          <li class="flex items-start gap-2">
            <span class="mt-2 h-px w-4 shrink-0 bg-fuchsia-400/70" />
            <span>La gestion des demandes de contact et de rendez-vous</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-2 h-px w-4 shrink-0 bg-fuchsia-400/70" />
            <span>La conduite de missions de recrutement</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-2 h-px w-4 shrink-0 bg-fuchsia-400/70" />
            <span>L'envoi d'informations commerciales avec votre consentement</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-2 h-px w-4 shrink-0 bg-fuchsia-400/70" />
            <span>L'amélioration de notre site et de nos services</span>
          </li>
        </ul>
      </section>

      <div class="hairline revealed" />

      <!-- Base légale -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">4. Base légale</h2>
        <p>
          Les traitements reposent sur les bases légales suivantes : exécution d'un contrat, intérêt légitime, et/ou consentement de la personne concernée, conformément à l'article 6 du RGPD.
        </p>
      </section>

      <div class="hairline revealed" />

      <!-- Conservation -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">5. Durée de conservation</h2>
        <ul class="space-y-2 pl-4">
          <li><span class="text-white/50">Données prospects :</span> <span class="text-white">12 mois</span> à compter du dernier contact</li>
          <li><span class="text-white/50">Données clients :</span> <span class="text-white">5 ans</span> à compter de la fin de la relation contractuelle</li>
          <li><span class="text-white/50">Données candidats :</span> <span class="text-white">5 ans</span> à compter du dernier contact</li>
          <li><span class="text-white/50">Données de navigation :</span> <span class="text-white">24 mois</span></li>
        </ul>
      </section>

      <div class="hairline revealed" />

      <!-- Destinataires -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">6. Destinataires des données</h2>
        <p>
          Vos données sont destinées aux membres habilités de <span class="text-white">Mariell</span>.
          Elles peuvent être transmises à des prestataires techniques dans le cadre strict de l'exécution de leurs missions (ex&nbsp;: hébergeur, outil CRM, plateforme de prise de rendez-vous).
        </p>
        <p>Aucune donnée n'est vendue ou cédée à des tiers à des fins commerciales.</p>
      </section>

      <div class="hairline revealed" />

      <!-- Droits -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">7. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul class="space-y-2 pl-4">
          <li class="flex items-start gap-2"><span class="mt-2 h-px w-4 shrink-0 bg-cyan-400/70" /><span><strong class="text-white">Droit d'accès</strong> — obtenir une copie de vos données</span></li>
          <li class="flex items-start gap-2"><span class="mt-2 h-px w-4 shrink-0 bg-cyan-400/70" /><span><strong class="text-white">Droit de rectification</strong> — corriger des données inexactes</span></li>
          <li class="flex items-start gap-2"><span class="mt-2 h-px w-4 shrink-0 bg-cyan-400/70" /><span><strong class="text-white">Droit à l'effacement</strong> — demander la suppression de vos données</span></li>
          <li class="flex items-start gap-2"><span class="mt-2 h-px w-4 shrink-0 bg-cyan-400/70" /><span><strong class="text-white">Droit d'opposition</strong> — vous opposer à un traitement</span></li>
          <li class="flex items-start gap-2"><span class="mt-2 h-px w-4 shrink-0 bg-cyan-400/70" /><span><strong class="text-white">Droit à la portabilité</strong> — recevoir vos données dans un format structuré</span></li>
          <li class="flex items-start gap-2"><span class="mt-2 h-px w-4 shrink-0 bg-cyan-400/70" /><span><strong class="text-white">Droit de limitation</strong> — restreindre le traitement de vos données</span></li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous à : <a href="mailto:chez@mariell.fr" class="text-white underline underline-offset-4 hover:text-white/70">chez@mariell.fr</a>.
          Vous pouvez également introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener" class="text-white underline underline-offset-4 hover:text-white/70">www.cnil.fr</a>).
        </p>
      </section>

      <div class="hairline revealed" />

      <!-- Sécurité -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">8. Sécurité</h2>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, destruction ou altération.
        </p>
      </section>

      <div class="hairline revealed" />

      <!-- Cookies -->
      <section class="space-y-3">
        <h2 class="font-mono-num text-xs uppercase tracking-[0.22em] text-white/40">9. Cookies</h2>
        <p>Ce site n'utilise pas de cookies.</p>
      </section>

      <div class="hairline revealed" />

      <p class="text-xs text-white/30">
        Dernière mise à jour : 18/04/2026
      </p>
    </div>
  </main>
</template>
