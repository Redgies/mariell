<script setup lang="ts">
const config = useRuntimeConfig()
const calendlyUrl = config.public.calendlyUrl as string
</script>

<template>
  <div class="chromatic-mode">
    <section class="page-hero">
      <div class="page-hero__inner">
        <Breadcrumb :items="[{ label: 'Le Lab', to: '/lab' }, { label: 'Guide salaires Sales 2026' }]" />
        <div class="eyebrow-m" style="color:rgba(244,239,227,0.45);margin-bottom:14px;">— Le Lab Mariell · Guides pratiques</div>
        <h1 class="h-display h-display--l" style="max-width:920px;">Guide des salaires Sales 2026.</h1>
        <p style="margin-top:24px;max-width:600px;font-size:18px;line-height:1.55;color:rgba(244,239,227,0.72);">La grille de salaires à jour, par poste, par séniorité, par contexte.</p>
        <div style="margin-top:36px;display:flex;gap:40px;flex-wrap:wrap;">
          <div><div class="meta-label">Édition</div><div class="meta-value">2026</div></div>
          <div><div class="meta-label">Postes</div><div class="meta-value">12</div></div>
          <div><div class="meta-label">Lectures</div><div class="meta-value">5</div></div>
          <div><div class="meta-label">Mise à jour</div><div class="meta-value">Annuelle</div></div>
          <div><div class="meta-label">Accès</div><div class="meta-value">Libre</div></div>
        </div>
      </div>
    </section>

    <!-- Avant-propos -->
    <section class="section-pad section--paper" style="padding-bottom:0;">
      <div class="container" style="max-width:760px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">Avant-propos</div>
        <p style="font-size:17px;line-height:1.6;color:var(--fg-on-paper-2);margin:0 0 16px;">Recruter un Sales sans connaître son prix de marché, c’est négocier les yeux bandés. Ce repère salarial complète notre approche de <NuxtLink to="/expertises" style="color:var(--moss);text-decoration:none;border-bottom:1px solid currentColor;">recrutement commercial</NuxtLink>, du sourcing à la signature.</p>
        <p style="font-size:17px;line-height:1.6;color:var(--fg-on-paper-2);margin:0 0 14px;">Ce guide rassemble les fourchettes que nous croisons quotidiennement dans nos missions, complétées par les principales études salariales publiques 2026 (RepVue, Glassdoor, Data Recrutement, Licorne Society, Uptoo, Qobra, et plusieurs cabinets spécialisés).</p>
        <p style="font-size:17px;line-height:1.6;color:var(--fg-on-paper-2);margin:0;">C’est une grille de référence opérationnelle pour calibrer vos offres avec justesse.</p>
      </div>
    </section>

    <!-- Tableau récapitulatif -->
    <section id="recap" class="section-pad section--paper">
      <div class="container" style="max-width:860px;">
        <h2 class="h-display h-display--m" style="margin:0 0 10px;">Le marché Sales, en un seul tableau.</h2>
        <p style="font-size:15px;color:var(--fg-on-paper-2);margin:0 0 28px;">Fourchettes en € brut annuel. Variable cible = à 100% d’atteinte des objectifs.</p>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th></th>
                <th>Poste</th>
                <th>Fixe médian France</th>
                <th>Variable cible médian</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="row-num">01</td><td><NuxtLink to="/expertises/sdr" class="table-link">SDR / BDR</NuxtLink></td><td>32-42k</td><td class="td-ote">10-20k</td></tr>
              <tr><td class="row-num">02</td><td><NuxtLink to="/expertises/business-developer-full-cycle" class="table-link">Business Developer Full Cycle</NuxtLink></td><td>35-50k</td><td class="td-ote">22-38k</td></tr>
              <tr><td class="row-num">03</td><td><NuxtLink to="/expertises/account-executive-pme" class="table-link">AE PME / SMB</NuxtLink></td><td>45-58k</td><td class="td-ote">22-40k</td></tr>
              <tr><td class="row-num">04</td><td><NuxtLink to="/expertises/account-executive-mid-market" class="table-link">AE Mid-Market</NuxtLink></td><td>55-72k</td><td class="td-ote">42-65k</td></tr>
              <tr><td class="row-num">05</td><td><NuxtLink to="/expertises/account-executive-enterprise" class="table-link">AE Enterprise</NuxtLink></td><td>80-110k</td><td class="td-ote">65-115k</td></tr>
              <tr><td class="row-num">06</td><td><NuxtLink to="/expertises/account-manager" class="table-link">Account Manager</NuxtLink></td><td>48-62k</td><td class="td-ote">18-32k</td></tr>
              <tr><td class="row-num">07</td><td><NuxtLink to="/expertises/customer-success-manager" class="table-link">Customer Success Manager</NuxtLink></td><td>42-58k</td><td class="td-ote">6-14k</td></tr>
              <tr><td class="row-num">08</td><td><NuxtLink to="/expertises/sales-ops-revops" class="table-link">Sales Ops / RevOps</NuxtLink></td><td>55-78k</td><td class="td-ote">7-15k</td></tr>
              <tr><td class="row-num">09</td><td><NuxtLink to="/expertises/channel-partner-manager" class="table-link">Channel / Partner Manager</NuxtLink></td><td>55-78k</td><td class="td-ote">22-40k</td></tr>
              <tr><td class="row-num">10</td><td><NuxtLink to="/expertises/sales-manager" class="table-link">Sales Manager / Lead</NuxtLink></td><td>70-100k</td><td class="td-ote">30-55k</td></tr>
              <tr><td class="row-num">11</td><td><NuxtLink to="/expertises/head-of-sales" class="table-link">Head of Sales</NuxtLink></td><td>110-170k</td><td class="td-ote">65-130k</td></tr>
              <tr><td class="row-num">12</td><td><NuxtLink to="/expertises/vp-sales" class="table-link">VP Sales / CRO</NuxtLink></td><td>160-220k</td><td class="td-ote">100-200k</td></tr>
            </tbody>
          </table>
        </div>
        <p style="font-size:12px;color:var(--fg-on-paper-3);margin-top:14px;">Toutes les fourchettes en € brut annuel. Variable cible = à 100% d’atteinte des objectifs.</p>
      </div>
    </section>

    <!-- Comment lire ce guide -->
    <section class="section-pad section--ink" style="padding-top:56px;padding-bottom:56px;">
      <div class="container" style="max-width:860px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">Comment lire ce guide</div>
        <div class="grid-cards">
          <div class="ucard card--ink" style="cursor:default;background:var(--ink-800);border-color:var(--border-on-ink);">
            <div class="ucard__tag" style="color:var(--cyan);">Variable (OTE)</div>
            <div class="ucard__excerpt" style="color:rgba(244,239,227,0.72);">Commission ou bonus à 100% d’atteinte. Sur le terrain, l’atteinte moyenne tourne autour de 70-85%&nbsp;: un OTE annoncé n’est pas un OTE garanti.</div>
          </div>
          <div class="ucard card--ink" style="cursor:default;background:var(--ink-800);border-color:var(--border-on-ink);">
            <div class="ucard__tag" style="color:var(--cyan);">Spécialités</div>
            <div class="ucard__excerpt" style="color:rgba(244,239,227,0.72);">Certains secteurs imposent leurs codes. Des spécificités profil (polyglotte, multi-fonctions, ouverture de marché) peuvent gonfler les chiffres, mais ce sont des cas exceptionnels.</div>
          </div>
          <div class="ucard card--ink" style="cursor:default;background:var(--ink-800);border-color:var(--border-on-ink);">
            <div class="ucard__tag" style="color:var(--cyan);">Paris vs régions</div>
            <div class="ucard__excerpt" style="color:rgba(244,239,227,0.72);">Junior +15-20% · Confirmé +10-15% · Senior (Head, VP) +5-10%. Hors stock-options et BSPCE&nbsp;: à ajouter mentalement en scale-up.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 01 SDR / BDR -->
    <section id="sdr" class="section-pad section--paper" style="padding-top:56px;">
      <div class="container" style="max-width:860px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">01 · SDR / BDR</div>
        <h2 class="h-display h-display--s" style="margin:0 0 4px;">SDR / BDR</h2>
        <div class="role-subtitle">Sales Development Representative</div>
        <p class="role-desc">Générer et qualifier les opportunités pour alimenter les commerciaux closers.</p>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Séniorité</th><th>Fixe</th><th>Variable cible</th><th>OTE</th></tr></thead>
            <tbody>
              <tr><td class="td-seniority">Junior · 0-1 an</td><td>30-36k</td><td>8-15k</td><td class="td-ote">38-51k</td></tr>
              <tr><td class="td-seniority">Confirmé · 1-2 ans</td><td>32-40k</td><td>10-20k</td><td class="td-ote">42-60k</td></tr>
              <tr><td class="td-seniority">Senior · 2-3+ ans</td><td>36-45k</td><td>15-25k</td><td class="td-ote">51-70k</td></tr>
            </tbody>
          </table>
        </div>
        <div class="insight-grid">
          <div class="insight-card insight-card--paper">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--moss);">Vue terrain de Mariell</div>
            <ul class="prose" style="max-width:none;margin:0;">
              <li style="font-size:14px;">Le ratio <strong>70% fixe / 30% variable</strong> est le standard sain pour un poste SDR. Certains produits et secteurs permettent moins de fixe et plus de variable, ce qui se justifie toujours par un Product Market Fit établi et probant.</li>
              <li style="font-size:14px;">Sur Paris, ajouter <strong>+15 à +20%</strong> (les juniors absorbent l’écart Paris/régions le plus durement).</li>
              <li style="font-size:14px;">Les top SDR juniors (taux de conversion >25%) négocient à <strong>+10-15%</strong> sur le haut de fourchette.</li>
              <li style="font-size:14px;">Inflation notable&nbsp;: ces fourchettes ont pris <strong>+8 à +12% depuis 2024</strong>.</li>
            </ul>
          </div>
          <div class="insight-card insight-card--ink">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--cyan);">Le piège classique</div>
            <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(244,239,227,0.82);">Le métier de SDR est l’un des plus rigoureux sur le plan émotionnel et énergétique. L’enthousiasme ne vaut pas la résilience. Il est facile de performer avec un PMF hyper établi, à pondérer dans la lecture du track record.</p>
          </div>
        </div>
        <a href="#recap" class="back-link">&#8593; Retour au tableau</a>
      </div>
    </section>

    <!-- 02 Business Developer Full Cycle -->
    <section id="bdr-full-cycle" class="section-pad section--paper" style="padding-top:0;">
      <div class="container" style="max-width:860px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">02 · BUSINESS DEVELOPER FULL CYCLE</div>
        <h2 class="h-display h-display--s" style="margin:0 0 4px;">Business Developer Full Cycle</h2>
        <div style="height:10px;"></div>
        <p class="role-desc">Commercial qui maîtrise l’intégralité du cycle, de la prospection au closing. Profil hybride SDR + AE, fréquent en startup jeune ou petite structure.</p>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Séniorité</th><th>Fixe</th><th>Variable cible</th><th>OTE</th></tr></thead>
            <tbody>
              <tr><td class="td-seniority">Junior · 1-2 ans</td><td>33-45k</td><td>15-25k</td><td class="td-ote">48-70k</td></tr>
              <tr><td class="td-seniority">Confirmé · 2-4 ans</td><td>35-45k</td><td>20-35k</td><td class="td-ote">55-80k</td></tr>
              <tr><td class="td-seniority">Senior · 4+ ans</td><td>40-55k</td><td>30-50k</td><td class="td-ote">70-105k</td></tr>
            </tbody>
          </table>
        </div>
        <div class="insight-grid">
          <div class="insight-card insight-card--paper">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--moss);">Vue terrain de Mariell</div>
            <ul class="prose" style="max-width:none;margin:0;">
              <li style="font-size:14px;">Profil <strong>idéal pour les startups early-stage</strong> (Pré-seed à Série A) qui n’ont pas encore segmenté leur équipe Sales.</li>
              <li style="font-size:14px;">Souvent issu d’une expérience SDR puis d’une bascule vers le closing&nbsp;: la maîtrise des deux extrémités du funnel est sa vraie valeur.</li>
              <li style="font-size:14px;">Fort taux d’évolution vers AE confirmé en 18-24 mois dans une structure plus mature.</li>
              <li style="font-size:14px;">À Paris, ajouter <strong>+12 à +15%</strong>.</li>
            </ul>
          </div>
          <div class="insight-card insight-card--ink">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--cyan);">Le piège classique</div>
            <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(244,239,227,0.82);">Prendre un AE qui sort d’une licorne&nbsp;: il n’aura pas le même PMF ni l’aisance sur la première extrémité du cycle. Un BD Full Cycle confirmé a souvent un track record plus complet qu’un AE PME équivalent.</p>
          </div>
        </div>
        <a href="#recap" class="back-link">&#8593; Retour au tableau</a>
      </div>
    </section>

    <!-- 03 AE PME / SMB -->
    <section id="ae-pme" class="section-pad section--paper" style="padding-top:0;">
      <div class="container" style="max-width:860px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">03 · ACCOUNT EXECUTIVE PME / SMB</div>
        <h2 class="h-display h-display--s" style="margin:0 0 4px;">Account Executive PME / SMB</h2>
        <div style="height:10px;"></div>
        <p class="role-desc">Closing sur cycles courts, deals &lt; 30k. Cible&nbsp;: TPE-PME.</p>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Séniorité</th><th>Fixe</th><th>Variable cible</th><th>OTE</th></tr></thead>
            <tbody>
              <tr><td class="td-seniority">Junior · 1-2 ans</td><td>38-48k</td><td>18-30k</td><td class="td-ote">56-78k</td></tr>
              <tr><td class="td-seniority">Confirmé · 2-4 ans</td><td>45-55k</td><td>22-45k</td><td class="td-ote">67-100k</td></tr>
              <tr><td class="td-seniority">Senior · 4+ ans</td><td>50-65k</td><td>38-60k</td><td class="td-ote">88-125k</td></tr>
            </tbody>
          </table>
        </div>
        <div class="insight-grid">
          <div class="insight-card insight-card--paper">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--moss);">Vue terrain de Mariell</div>
            <ul class="prose" style="max-width:none;margin:0;">
              <li style="font-size:14px;">Sweet spot du marché actuel&nbsp;: la majorité des recrutements Sales se font sur ce segment.</li>
              <li style="font-size:14px;">Sur Paris, ajouter <strong>+12 à +15%</strong>.</li>
              <li style="font-size:14px;">Les profils issus de boîtes "écoles" (Doctolib, Pennylane, Qonto, Spendesk, Aircall…) ont un floor <strong>+20% au-dessus</strong> des fourchettes standards.</li>
            </ul>
          </div>
          <div class="insight-card insight-card--ink">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--cyan);">Le piège classique</div>
            <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(244,239,227,0.82);">Rechercher un AE avec trop d’expérience sur des cycles plus longs. Sous-évaluer les profils Business Developer Full Cycle.</p>
          </div>
        </div>
        <a href="#recap" class="back-link">&#8593; Retour au tableau</a>
      </div>
    </section>

    <!-- 04 AE Mid-Market -->
    <section id="ae-mid-market" class="section-pad section--paper" style="padding-top:0;">
      <div class="container" style="max-width:860px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">04 · ACCOUNT EXECUTIVE MID-MARKET</div>
        <h2 class="h-display h-display--s" style="margin:0 0 4px;">Account Executive Mid-Market</h2>
        <div style="height:10px;"></div>
        <p class="role-desc">Closing sur cycles moyens (3-9 mois), deals 30-150k. Cible&nbsp;: ETI / mid-market.</p>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Séniorité</th><th>Fixe</th><th>Variable cible</th><th>OTE</th></tr></thead>
            <tbody>
              <tr><td class="td-seniority">Confirmé · 3-5 ans</td><td>45-65k</td><td>28-55k</td><td class="td-ote">73-120k</td></tr>
              <tr><td class="td-seniority">Senior · 5-7 ans</td><td>60-80k</td><td>50-80k</td><td class="td-ote">110-160k</td></tr>
            </tbody>
          </table>
        </div>
        <div class="insight-grid">
          <div class="insight-card insight-card--paper">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--moss);">Vue terrain de Mariell</div>
            <ul class="prose" style="max-width:none;margin:0;">
              <li style="font-size:14px;">RepVue France 2026 indique un OTE médian <strong>AE all-segments à 142k</strong>&nbsp;: tiré vers le haut par le mid-market et l’enterprise. Un top performer SaaS s’en approche.</li>
              <li style="font-size:14px;">Le <strong>% d’atteinte de quota</strong> est plus bas qu’en SMB&nbsp;: cycles plus longs = plus de deals perdus en route.</li>
              <li style="font-size:14px;">Profil rare&nbsp;: un AE mid-market avec <strong>3 années consécutives à 100%+</strong> se négocie +25% au-dessus de la fourchette haute.</li>
            </ul>
          </div>
          <div class="insight-card insight-card--ink">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--cyan);">Le piège classique</div>
            <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(244,239,227,0.82);">Recruter un AE PME "qui veut monter en gamme". Le saut PME → mid-market exige du multi-stakeholders, du RFP, de la gestion procurement. Sans expérience, le ramp-up dure 9-12 mois au lieu de 3.</p>
          </div>
        </div>
        <a href="#recap" class="back-link">&#8593; Retour au tableau</a>
      </div>
    </section>

    <!-- 05 AE Enterprise -->
    <section id="ae-enterprise" class="section-pad section--paper" style="padding-top:0;">
      <div class="container" style="max-width:860px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">05 · ACCOUNT EXECUTIVE ENTERPRISE</div>
        <h2 class="h-display h-display--s" style="margin:0 0 4px;">Account Executive Enterprise</h2>
        <div class="role-subtitle">Large Accounts</div>
        <p class="role-desc">Closing sur cycles longs (6-18 mois), deals 150k+. Cible&nbsp;: grandes entreprises, comptes stratégiques.</p>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Séniorité</th><th>Fixe</th><th>Variable cible</th><th>OTE</th></tr></thead>
            <tbody>
              <tr><td class="td-seniority">Senior · 5-8 ans</td><td>65-90k</td><td>45-95k</td><td class="td-ote">110-185k</td></tr>
              <tr><td class="td-seniority">Top performer · 8+ ans</td><td>80-110k</td><td>80-150k</td><td class="td-ote">160-260k</td></tr>
              <tr><td class="td-seniority">Star · top 5%</td><td>85-130k+</td><td>130-220k+</td><td class="td-ote">215-350k+</td></tr>
            </tbody>
          </table>
        </div>
        <div class="insight-grid">
          <div class="insight-card insight-card--paper">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--moss);">Vue terrain de Mariell</div>
            <ul class="prose" style="max-width:none;margin:0;">
              <li style="font-size:14px;">Les top performers Enterprise SaaS (AWS, Salesforce, Snowflake, Datadog) dépassent régulièrement <strong>300k OTE en France</strong>, avec accelerators jusqu’à 2x.</li>
              <li style="font-size:14px;">Le <strong>stock equity</strong> sur les 5 plus grosses scale-ups FR peut représenter 30-50% de la rémunération réelle au vesting.</li>
              <li style="font-size:14px;"><strong>Les vrais chasseurs sont rares</strong>&nbsp;: 70% des "AE Enterprise" sont des farmers déguisés. Vérifier le ratio new logo / expansion est essentiel.</li>
            </ul>
          </div>
          <div class="insight-card insight-card--ink">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--cyan);">Le piège classique</div>
            <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(244,239,227,0.82);">Chercher un AE Enterprise pour vendre un produit sans maturité enterprise (pas de sécurité, pas de SLA, pas de procurement adapté). Le candidat partira en 4 mois.</p>
          </div>
        </div>
        <a href="#recap" class="back-link">&#8593; Retour au tableau</a>
      </div>
    </section>

    <!-- 06 Account Manager -->
    <section id="account-manager" class="section-pad section--paper" style="padding-top:0;">
      <div class="container" style="max-width:860px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">06 · ACCOUNT MANAGER</div>
        <h2 class="h-display h-display--s" style="margin:0 0 4px;">Account Manager</h2>
        <div class="role-subtitle">Sales sur clients existants</div>
        <p class="role-desc">Renouvellement, upsell, cross-sell sur portefeuille. Orienté revenu, pas seulement satisfaction.</p>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Séniorité</th><th>Fixe</th><th>Variable cible</th><th>OTE</th></tr></thead>
            <tbody>
              <tr><td class="td-seniority">Junior · 1-2 ans</td><td>38-48k</td><td>10-18k</td><td class="td-ote">48-66k</td></tr>
              <tr><td class="td-seniority">Confirmé · 3-5 ans</td><td>46-60k</td><td>15-30k</td><td class="td-ote">61-90k</td></tr>
              <tr><td class="td-seniority">Senior · 5+ ans</td><td>50-66k</td><td>20-35k</td><td class="td-ote">70-101k</td></tr>
            </tbody>
          </table>
        </div>
        <div class="insight-grid">
          <div class="insight-card insight-card--paper">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--moss);">Vue terrain de Mariell</div>
            <ul class="prose" style="max-width:none;margin:0;">
              <li style="font-size:14px;">Étude Uptoo 2026&nbsp;: packages >65k bruts/an en SaaS, IT et cyber, jusqu’à 75k+ pour les Senior AM en environnement complexe.</li>
              <li style="font-size:14px;">Profils hybrides AE/AM (chasse + farming)&nbsp;: <strong>+10-15%</strong> sur les fourchettes standards.</li>
            </ul>
          </div>
          <div class="insight-card insight-card--ink">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--cyan);">Le piège classique</div>
            <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(244,239,227,0.82);">Recruter un AM qui n’a jamais porté un quota d’expansion. Sans mindset commercial, vous obtenez un Customer Success Manager 2.0, pas un Account Manager.</p>
          </div>
        </div>
        <a href="#recap" class="back-link">&#8593; Retour au tableau</a>
      </div>
    </section>

    <!-- 07 CSM -->
    <section id="csm" class="section-pad section--paper" style="padding-top:0;">
      <div class="container" style="max-width:860px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">07 · CUSTOMER SUCCESS MANAGER</div>
        <h2 class="h-display h-display--s" style="margin:0 0 4px;">Customer Success Manager</h2>
        <div style="height:10px;"></div>
        <p class="role-desc">Adoption, rétention, satisfaction. Peu de quota direct sur revenu, mais impact NPS et churn.</p>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Séniorité</th><th>Fixe</th><th>Variable cible</th><th>OTE</th></tr></thead>
            <tbody>
              <tr><td class="td-seniority">Junior · 1-2 ans</td><td>32-44k</td><td>3-8k</td><td class="td-ote">35-52k</td></tr>
              <tr><td class="td-seniority">Confirmé · 3-5 ans</td><td>42-58k</td><td>6-14k</td><td class="td-ote">48-72k</td></tr>
              <tr><td class="td-seniority">Senior / Enterprise · 5+ ans</td><td>55-75k</td><td>10-22k</td><td class="td-ote">65-97k</td></tr>
            </tbody>
          </table>
        </div>
        <div class="insight-grid">
          <div class="insight-card insight-card--paper">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--moss);">Vue terrain de Mariell</div>
            <ul class="prose" style="max-width:none;margin:0;">
              <li style="font-size:14px;">Sources croisées (Glassdoor, PayScale, Skalin)&nbsp;: médiane Paris à <strong>51k fixe + 2-3k variable</strong> pour un CSM confirmé.</li>
              <li style="font-size:14px;">Variable faible et plafonné (10-20% du package), basé sur NRR / GRR / NPS.</li>
              <li style="font-size:14px;">Les <strong>Enterprise CSM</strong> sur comptes 100k+ ARR dépassent 70k fixe + variable significatif.</li>
              <li style="font-size:14px;">Métier en forte croissance&nbsp;: <strong>+736%</strong> sur LinkedIn en une décennie.</li>
            </ul>
          </div>
          <div class="insight-card insight-card--ink">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--cyan);">Le piège classique</div>
            <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(244,239,227,0.82);">Confondre CSM et Support Manager. Un CSM pilote la <strong>valeur business du client</strong> (ROI, adoption stratégique), pas les tickets d’assistance.</p>
          </div>
        </div>
        <a href="#recap" class="back-link">&#8593; Retour au tableau</a>
      </div>
    </section>

    <!-- 08 Sales Ops / RevOps -->
    <section id="sales-ops" class="section-pad section--paper" style="padding-top:0;">
      <div class="container" style="max-width:860px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">08 · SALES OPS / REVENUE OPERATIONS</div>
        <h2 class="h-display h-display--s" style="margin:0 0 4px;">Sales Ops / Revenue Operations</h2>
        <div style="height:10px;"></div>
        <p class="role-desc">Pilotage CRM, analytics commerciale, design des plans de commissionnement, optimisation du process. Hybride Sales / Data / Ops.</p>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Séniorité</th><th>Fixe</th><th>Variable cible</th><th>OTE</th></tr></thead>
            <tbody>
              <tr><td class="td-seniority">Junior · 1-3 ans</td><td>42-55k</td><td>4-9k</td><td class="td-ote">46-64k</td></tr>
              <tr><td class="td-seniority">Confirmé · 3-5 ans</td><td>55-72k</td><td>7-15k</td><td class="td-ote">62-87k</td></tr>
              <tr><td class="td-seniority">Senior / Head of RevOps · 5+ ans</td><td>75-110k</td><td>12-28k</td><td class="td-ote">87-138k</td></tr>
            </tbody>
          </table>
        </div>
        <div class="insight-grid">
          <div class="insight-card insight-card--paper">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--moss);">Vue terrain de Mariell</div>
            <ul class="prose" style="max-width:none;margin:0;">
              <li style="font-size:14px;"><strong>Profil ultra-recherché en 2026</strong>&nbsp;: pénurie réelle. Les hautes fourchettes nécessitent Salesforce + analytics (Looker, Tableau) + séquençage (Outreach, Salesloft).</li>
              <li style="font-size:14px;">Variable faible et déconnecté du chiffre direct&nbsp;: se négocie sur le fixe et l’equity.</li>
              <li style="font-size:14px;">Les <strong>Head of RevOps post-Série B</strong> atteignent 110-140k de package avec equity significative.</li>
            </ul>
          </div>
          <div class="insight-card insight-card--ink">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--cyan);">Le piège classique</div>
            <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(244,239,227,0.82);">Confondre Sales Ops et "Sales Admin". Le Sales Ops moderne est stratégique&nbsp;: il challenge la commission policy, redessine le territoire, identifie les goulots. Pas un assistant.</p>
          </div>
        </div>
        <a href="#recap" class="back-link">&#8593; Retour au tableau</a>
      </div>
    </section>

    <!-- 09 Channel / Partner Manager -->
    <section id="channel-manager" class="section-pad section--paper" style="padding-top:0;">
      <div class="container" style="max-width:860px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">09 · CHANNEL / PARTNER MANAGER</div>
        <h2 class="h-display h-display--s" style="margin:0 0 4px;">Channel / Partner Manager</h2>
        <div style="height:10px;"></div>
        <p class="role-desc">Développer les ventes via partenaires, intégrateurs, revendeurs. Critique en conseil IT, ESN, SaaS B2B indirect.</p>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Séniorité</th><th>Fixe</th><th>Variable cible</th><th>OTE</th></tr></thead>
            <tbody>
              <tr><td class="td-seniority">Confirmé · 3-5 ans</td><td>50-68k</td><td>18-30k</td><td class="td-ote">68-98k</td></tr>
              <tr><td class="td-seniority">Senior · 5+ ans</td><td>65-92k</td><td>28-50k</td><td class="td-ote">93-142k</td></tr>
            </tbody>
          </table>
        </div>
        <div class="insight-grid">
          <div class="insight-card insight-card--paper">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--moss);">Vue terrain de Mariell</div>
            <ul class="prose" style="max-width:none;margin:0;">
              <li style="font-size:14px;">Profil sous-coté en visibilité mais <strong>stratégique</strong> dans les modèles partner-led.</li>
              <li style="font-size:14px;">Maîtrise écosystème indispensable&nbsp;: MSP, hyperscalers (AWS, GCP, Azure), grandes ESN.</li>
              <li style="font-size:14px;">Marché FR <strong>moins mature qu’aux US/UK</strong> → fourchettes plus modestes mais fortes opportunités de structuration en scale-up.</li>
            </ul>
          </div>
          <div class="insight-card insight-card--ink">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--cyan);">Le piège classique</div>
            <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(244,239,227,0.82);">Recruter un AE classique pour faire du channel. Le channel exige une relation longue, asynchrone, multi-stakeholders. Compétences distinctes du closing direct.</p>
          </div>
        </div>
        <a href="#recap" class="back-link">&#8593; Retour au tableau</a>
      </div>
    </section>

    <!-- 10 Sales Manager / Team Lead -->
    <section id="sales-manager" class="section-pad section--paper" style="padding-top:0;">
      <div class="container" style="max-width:860px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">10 · SALES MANAGER / TEAM LEAD</div>
        <h2 class="h-display h-display--s" style="margin:0 0 4px;">Sales Manager / Team Lead</h2>
        <div style="height:10px;"></div>
        <p class="role-desc">Management opérationnel d’une équipe (3-10 personnes). Coaching, recrutement, pilotage de la perf, parfois quota d’équipe.</p>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Séniorité</th><th>Fixe</th><th>Variable cible</th><th>OTE</th></tr></thead>
            <tbody>
              <tr><td class="td-seniority">Lead / Manager SDR</td><td>52-70k</td><td>18-30k</td><td class="td-ote">70-100k</td></tr>
              <tr><td class="td-seniority">Sales Manager AE PME · équipe 3-6</td><td>68-88k</td><td>28-50k</td><td class="td-ote">96-138k</td></tr>
              <tr><td class="td-seniority">Sales Manager Mid-Market</td><td>80-105k</td><td>35-60k</td><td class="td-ote">115-165k</td></tr>
              <tr><td class="td-seniority">Sales Manager Enterprise</td><td>95-125k</td><td>45-80k</td><td class="td-ote">140-205k</td></tr>
            </tbody>
          </table>
        </div>
        <div class="insight-grid">
          <div class="insight-card insight-card--paper">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--moss);">Vue terrain de Mariell</div>
            <ul class="prose" style="max-width:none;margin:0;">
              <li style="font-size:14px;">Sur Paris&nbsp;: <strong>+12 à +15%</strong>.</li>
              <li style="font-size:14px;">Le <strong>manager player</strong> (quota individuel + management) gagne 10-15% de plus, mais sous-performe sur les deux dimensions au-delà de 6 personnes managées.</li>
              <li style="font-size:14px;">Légitimité non négociable&nbsp;: minimum <strong>3 cycles de vente complets</strong> en IC avant de passer manager.</li>
            </ul>
          </div>
          <div class="insight-card insight-card--ink">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--cyan);">Le piège classique</div>
            <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(244,239,227,0.82);">Promouvoir le top AE de l’équipe en Sales Manager. Sales et management sont deux métiers. Vous perdez votre meilleur closer ET vous gagnez un mauvais manager.</p>
          </div>
        </div>
        <a href="#recap" class="back-link">&#8593; Retour au tableau</a>
      </div>
    </section>

    <!-- 11 Head of Sales -->
    <section id="head-of-sales" class="section-pad section--paper" style="padding-top:0;">
      <div class="container" style="max-width:860px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">11 · HEAD OF SALES</div>
        <h2 class="h-display h-display--s" style="margin:0 0 4px;">Head of Sales</h2>
        <div style="height:10px;"></div>
        <p class="role-desc">Direction commerciale opérationnelle. Stratégie, structuration d’équipe, atteinte des objectifs globaux. Membre du CODIR.</p>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Séniorité</th><th>Fixe</th><th>Variable cible</th><th>OTE</th></tr></thead>
            <tbody>
              <tr><td class="td-seniority">Startup · &lt; 20 pers.</td><td>80-115k</td><td>35-65k</td><td class="td-ote">115-180k</td></tr>
              <tr><td class="td-seniority">Scale-up · 20-100</td><td>100-145k</td><td>55-95k</td><td class="td-ote">155-240k</td></tr>
              <tr><td class="td-seniority">Scale-up · 100-500</td><td>130-185k</td><td>75-140k</td><td class="td-ote">205-325k</td></tr>
              <tr><td class="td-seniority">ETI · 500+</td><td>155-225k</td><td>85-160k</td><td class="td-ote">240-385k</td></tr>
            </tbody>
          </table>
        </div>
        <div class="insight-grid">
          <div class="insight-card insight-card--paper">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--moss);">Vue terrain de Mariell</div>
            <ul class="prose" style="max-width:none;margin:0;">
              <li style="font-size:14px;">Glassdoor 2026&nbsp;: médiane Head of Sales France à <strong>100k fixe</strong>, packages >200k pour les profils scale-up confirmés.</li>
              <li style="font-size:14px;">Distinction critique&nbsp;: les <strong>"builder"</strong> (équipe from scratch) vs les <strong>"scaler"</strong> (5 → 30)&nbsp;: deux profils, deux packages.</li>
              <li style="font-size:14px;">Sur Paris&nbsp;: <strong>+5 à +10%</strong> seulement (l’écart s’efface en haut de pyramide).</li>
              <li style="font-size:14px;">L’equity est la variable la plus volatile&nbsp;: cadrer le cash en priorité.</li>
            </ul>
          </div>
          <div class="insight-card insight-card--ink">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--cyan);">Le piège classique</div>
            <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(244,239,227,0.82);">Afficher un Head of Sales qui est en réalité un Sales Manager au titre gonflé. Vrai Head of Sales = pilotage stratégique, design d’org, recrutement de managers, reporting CODIR.</p>
          </div>
        </div>
        <a href="#recap" class="back-link">&#8593; Retour au tableau</a>
      </div>
    </section>

    <!-- 12 VP Sales / CRO -->
    <section id="vp-sales" class="section-pad section--paper" style="padding-top:0;">
      <div class="container" style="max-width:860px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">12 · VP SALES / CHIEF REVENUE OFFICER</div>
        <h2 class="h-display h-display--s" style="margin:0 0 4px;">VP Sales / Chief Revenue Officer</h2>
        <div class="role-subtitle">CRO</div>
        <p class="role-desc">Top niveau commercial. Le VP Sales est focalisé Sales pure&nbsp;; le CRO étend à Sales + CS + Marketing. Surtout en scale-up et grandes entreprises.</p>
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Séniorité</th><th>Fixe</th><th>Variable cible</th><th>OTE</th></tr></thead>
            <tbody>
              <tr><td class="td-seniority">Scale-up · 50-200</td><td>130-185k</td><td>80-160k</td><td class="td-ote">210-345k</td></tr>
              <tr><td class="td-seniority">Scale-up · 200-1000</td><td>170-235k</td><td>110-220k</td><td class="td-ote">280-455k</td></tr>
              <tr><td class="td-seniority">Grande entreprise / Licorne</td><td>200-310k+</td><td>160-330k+</td><td class="td-ote">360-640k+</td></tr>
            </tbody>
          </table>
        </div>
        <div class="insight-grid">
          <div class="insight-card insight-card--paper">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--moss);">Vue terrain de Mariell</div>
            <ul class="prose" style="max-width:none;margin:0;">
              <li style="font-size:14px;">Glassdoor 2026&nbsp;: médiane VP Sales France à <strong>207k OTE</strong>, top 10% à <strong>379k+</strong>.</li>
              <li style="font-size:14px;">À ce niveau, <strong>75% du package se joue à l’entretien stratégique</strong>&nbsp;: la vision chiffrée compte plus que le track record passé.</li>
              <li style="font-size:14px;">Track record de levée significatif (scaling Série B/C) → floor <strong>+30-40%</strong>.</li>
              <li style="font-size:14px;">Les VP qui changent tous les 18 mois sont discountés&nbsp;: la stabilité prime.</li>
            </ul>
          </div>
          <div class="insight-card insight-card--ink">
            <div class="eyebrow-m" style="margin-bottom:14px;color:var(--cyan);">Le piège classique</div>
            <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(244,239,227,0.82);">Recruter un VP Sales "ex-grand groupe" pour structurer une scale-up de 50 personnes. Les méthodes ne se transposent pas. 200k brûlés pour découvrir en 6 mois que la culture ne matche pas.</p>
          </div>
        </div>
        <a href="#recap" class="back-link">&#8593; Retour au tableau</a>
      </div>
    </section>

    <!-- 5 lectures -->
    <section id="lectures" class="section-pad section--paper" style="padding-top:8px;">
      <div class="container" style="max-width:860px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">5 lectures du marché Sales 2026</div>
        <h2 class="h-display h-display--m" style="margin:0 0 40px;max-width:680px;">Au-delà des fourchettes, les dynamiques qui structurent.</h2>

        <div class="lecture-item">
          <div class="eyebrow-m" style="margin-bottom:14px;">Lecture 01</div>
          <h3 class="lecture-title">L’inflation salariale est encore là.</h3>
          <p class="lecture-body">Sur 24 mois, <strong>+8 à +15%</strong> sur l’ensemble des fourchettes. Trois moteurs&nbsp;: pénurie de profils SaaS expérimentés, inflation cumulée 2022-2025 (~14%), concurrence des entreprises US qui recrutent en France à distance. Les grilles d’il y a 18 mois sont obsolètes.</p>
        </div>
        <div class="lecture-item">
          <div class="eyebrow-m" style="margin-bottom:14px;">Lecture 02</div>
          <h3 class="lecture-title">Trois mondes parallèles cohabitent.</h3>
          <p class="lecture-body"><strong>Tech / SaaS B2B</strong>&nbsp;: modèle américanisé, fourchettes hautes, variable significatif, equity courante (référence des grilles). <strong>Conseil IT / ESN</strong>&nbsp;: OTE 5-15% sous le SaaS, plus de stabilité, equity rare. <strong>Industrie / B2B classique</strong>&nbsp;: fixe proportionnellement plus élevé, variable plus modéré, avantages traditionnels.</p>
        </div>
        <div class="lecture-item">
          <div class="eyebrow-m" style="margin-bottom:14px;">Lecture 03</div>
          <h3 class="lecture-title">L’écart Paris / régions se réduit avec la séniorité.</h3>
          <p class="lecture-body">Junior +15-20% · Confirmé +10-15% · Manager +8-12% · Head/Director +5-10% · VP/CRO +0-5%. Le coût de la vie pèse plus sur les petits salaires. Lyon, Bordeaux, Nantes, Lille&nbsp;: Paris -5 à -15%. Autres régions&nbsp;: Paris -15 à -25%.</p>
        </div>
        <div class="lecture-item">
          <div class="eyebrow-m" style="margin-bottom:14px;">Lecture 04</div>
          <h3 class="lecture-title">Le piège des annonces&nbsp;: OTE théorique vs réel.</h3>
          <p class="lecture-body">Les fourchettes basses sont souvent réelles&nbsp;; les hautes, aspirationnelles. Afficher un OTE déconnecté de l’atteinte moyenne crée un retour de bâton&nbsp;: les candidats s’informent (RepVue, Glassdoor, ex-collègues). Mieux vaut un OTE crédible avec accelerators ambitieux qu’un OTE fictif.</p>
        </div>
        <div class="lecture-item">
          <div class="eyebrow-m" style="margin-bottom:14px;">Lecture 05</div>
          <h3 class="lecture-title">L’effet "boîtes intouchables".</h3>
          <p class="lecture-body">Les profils issus des viviers premium négocient <strong>+15 à +25%</strong>. SaaS B2B&nbsp;: Doctolib, Qonto, Pennylane, Aircall, Spendesk, Alma, Payfit, Datadog, Algolia, Mirakl. Cyber&nbsp;: Wallix, Snowflake, CrowdStrike. US en France&nbsp;: Salesforce, AWS, Google, HubSpot.</p>
        </div>
      </div>
    </section>

    <!-- Méthodologie -->
    <section class="section-pad section--paper" style="padding-top:0;">
      <div class="container" style="max-width:760px;">
        <div class="eyebrow-m" style="margin-bottom:14px;">Méthodologie &amp; sources</div>
        <h2 class="h-display h-display--s" style="margin:0 0 20px;">Comment ce guide a été construit.</h2>
        <ul class="prose" style="max-width:none;">
          <li><strong>Données internes Mariell</strong>&nbsp;: observations terrain sur nos missions de recrutement Sales.</li>
          <li><strong>Études publiques 2026</strong>&nbsp;: Hays, Michael Page, Robert Walters, RepVue, Glassdoor, Data Recrutement, Licorne Society, Uptoo, Qobra, Welcome to the Jungle, Skalin.</li>
          <li><strong>Conversations marché continues</strong>&nbsp;: retours candidats sur leurs offres réelles, retours clients sur leurs pratiques.</li>
          <li><strong>Veille spécialisée</strong>&nbsp;: communautés Sales (Modjo, Pavilion FR), études sectorielles.</li>
        </ul>
        <p style="font-size:13px;color:var(--fg-on-paper-3);margin-top:18px;">Reflète notre lecture du marché 2026. Variations possibles selon profil, contexte, négociation. Hors stock-options, BSPCE et avantages annexes. Mise à jour annuelle. Prochaine édition&nbsp;: 2027.</p>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-pad section--paper">
      <div class="container">
        <div class="cta-strip">
          <div class="cta-strip__title">Besoin de calibrer une offre précise&nbsp;?</div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <a class="btn-pill btn-cyan" :href="calendlyUrl" target="_blank" rel="noopener">Rencontrer Mariell</a>
            <NuxtLink class="btn-pill btn-ghost" to="/lab/10-essentiels-recrutement-sales">Les 10 essentiels</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Suppress duplicate bullet from .prose li::before when used here */
.prose li::before { content: none !important; }
ul.prose { list-style: disc; padding-left: 20px; }
ul.prose li { padding-left: 4px; }

.meta-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(244, 239, 227, 0.45);
}

.meta-value {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 26px;
  letter-spacing: -0.02em;
  color: var(--cyan);
  margin-top: 4px;
}

.role-subtitle {
  font-size: 14px;
  color: var(--fg-on-paper-3);
  margin-bottom: 14px;
}

.role-desc {
  font-size: 16px;
  line-height: 1.55;
  color: var(--fg-on-paper-2);
  margin: 0 0 26px;
  max-width: 640px;
}

.table-scroll {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14.5px;
  min-width: 480px;
}

.data-table thead tr {
  border-bottom: 2px solid var(--border-on-paper-strong);
}

.data-table th {
  padding: 13px 12px;
  text-align: left;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fg-on-paper-3);
  font-weight: 500;
}

.data-table tbody tr {
  border-bottom: 1px solid var(--border-on-paper);
}

.data-table td {
  padding: 13px 12px;
  color: var(--fg-on-paper-2);
}

.row-num {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--fg-on-paper-3);
}

.table-link {
  color: var(--fg-on-paper-1);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid var(--border-on-paper-strong);
}

.td-seniority {
  font-weight: 600;
  color: var(--fg-on-paper-1);
}

.td-ote {
  color: var(--moss);
  font-weight: 600;
}

.insight-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 28px;
  align-items: start;
}

@media (max-width: 640px) {
  .insight-grid { grid-template-columns: 1fr; }
}

.insight-card {
  border-radius: 12px;
  padding: 22px 24px;
}

.insight-card--paper {
  background: #fff;
  border: 1px solid var(--border-on-paper);
}

.insight-card--ink {
  background: var(--ink-900);
  color: var(--fg-on-ink-1);
}

.back-link {
  display: inline-block;
  margin-top: 18px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fg-on-paper-3);
  text-decoration: none;
}

.lecture-item {
  border-top: 1px solid var(--border-on-paper);
  padding: 28px 0;
}

.lecture-title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 24px;
  letter-spacing: -0.02em;
  margin: 0 0 10px;
  color: var(--fg-on-paper-1);
}

.lecture-body {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.6;
  color: var(--fg-on-paper-2);
}

.cta-strip__title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 28px;
  letter-spacing: -0.02em;
  line-height: 1.15;
  max-width: 560px;
}

/* ---- Mobile / responsive ---- */
@media (max-width: 900px) {
  .table-scroll {
    -webkit-overflow-scrolling: touch;
    /* already has overflow-x: auto — kept as is */
  }
  .insight-grid { grid-template-columns: 1fr; }
  .cta-strip__title { font-size: 22px; }
  .lecture-title { font-size: 20px; }
  .meta-value { font-size: 22px; }
}

@media (max-width: 560px) {
  /* Hero meta row wraps tighter */
  .meta-value { font-size: 20px; }
  .cta-strip__title { font-size: 18px; }
  /* Table: ensure horizontal scroll container is explicit */
  .table-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    /* Prevent the PAGE from scrolling horizontally */
    max-width: 100%;
  }
  /* Tighten insight cards padding */
  .insight-card { padding: 16px 18px; }
}
</style>
