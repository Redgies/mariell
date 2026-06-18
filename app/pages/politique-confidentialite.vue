<template>
  <div class="chromatic-mode">
    <section class="page-hero">
      <div class="page-hero__inner">
        <Breadcrumb :items="[{ label: 'Confidentialité', to: '/politique-confidentialite' }]" />
        <h1 class="h-display h-display--m">Protection des données.</h1>
      </div>
    </section>

    <section class="section-pad section--paper">
      <div class="container">
        <div class="prose">
          <h2>Responsable du traitement</h2>
          <p>
            Sean José LIGEIRO, exerçant sous le nom commercial <strong>Mariell</strong>,
            108 rue des Bourguignons, 92600 Asnières-sur-Seine.
            Contact&nbsp;: <a href="mailto:chez@mariell.fr">chez@mariell.fr</a>.
          </p>
          <h2>Données collectées</h2>
          <p>
            Mariell collecte les données que vous nous transmettez volontairement (nom, prénom, adresse e-mail,
            numéro de téléphone, informations professionnelles) lors d’une prise de contact, de la conduite d’une mission
            de recrutement ou de l’utilisation des outils du Lab.
            Des données de navigation (adresse IP, type de navigateur, pages visitées) peuvent également être collectées.
          </p>
          <h2>Finalités</h2>
          <p>Ces données servent à répondre à vos demandes, mener nos missions de recrutement, vous proposer nos services et améliorer notre site. Elles ne sont jamais revendues.</p>
          <h2>Base légale</h2>
          <p>
            Les traitements reposent sur l’exécution d’un contrat, l’intérêt légitime de Mariell et/ou le consentement
            de la personne concernée, conformément à l’article&nbsp;6 du RGPD.
          </p>
          <h2>Conservation</h2>
          <ul>
            <li>Données prospects&nbsp;: 12&nbsp;mois à compter du dernier contact.</li>
            <li>Données clients&nbsp;: 5&nbsp;ans à compter de la fin de la relation contractuelle.</li>
            <li>Données candidats&nbsp;: 5&nbsp;ans à compter du dernier contact.</li>
            <li>Données de navigation&nbsp;: 24&nbsp;mois.</li>
          </ul>
          <h2>Destinataires</h2>
          <p>
            Vos données sont destinées aux membres habilités de Mariell. Elles peuvent être transmises à des prestataires
            techniques (hébergeur Vercel, CRM Jarvi, outil d’envoi d’e-mails Brevo) dans le cadre strict de l’exécution
            de leurs missions. Aucune donnée n’est vendue ou cédée à des tiers à des fins commerciales.
          </p>
          <h2>Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition,
            de portabilité et de limitation sur vos données. Pour l’exercer&nbsp;: <a href="mailto:chez@mariell.fr">chez@mariell.fr</a>.
            Vous pouvez également introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a>).
          </p>
          <h2>Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données
            contre tout accès non autorisé, perte, destruction ou altération.
          </p>
          <h2>Cookies</h2>
          <p>Ce site n’utilise pas de cookies.</p>
          <p style="font-size:13px;color:var(--fg-on-paper-3);">Dernière mise à jour&nbsp;: 18/04/2026.</p>
        </div>
      </div>
    </section>
  </div>
</template>
