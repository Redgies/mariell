<template>
  <div class="chromatic-mode">
    <section class="page-hero">
      <div class="page-hero__inner">
        <Breadcrumb :items="[{ label: 'Mentions légales', to: '/mentions-legales' }]" />
        <h1 class="h-display h-display--m">Mentions légales.</h1>
      </div>
    </section>

    <section class="section-pad section--paper">
      <div class="container">
        <div class="prose">
          <h2>Éditeur du site</h2>
          <p>
            Le site <strong>mariell.fr</strong> est édité par Sean José LIGEIRO, exerçant sous le nom commercial <strong>Mariell</strong>.
            Entrepreneur Individuel (EI). SIRET&nbsp;: 929&nbsp;566&nbsp;917&nbsp;00019.
            N°&nbsp;TVA intracommunautaire&nbsp;: FR39929566917.
            Siège social&nbsp;: 108 rue des Bourguignons, 92600 Asnières-sur-Seine.
            Téléphone&nbsp;: <a href="tel:+33631688981">+33&nbsp;6&nbsp;31&nbsp;68&nbsp;89&nbsp;81</a>.
            Contact&nbsp;: <a href="mailto:chez@mariell.fr">chez@mariell.fr</a>.
          </p>
          <h2>Directeur de la publication</h2>
          <p>Le directeur de la publication est Sean José LIGEIRO, en qualité de gérant.</p>
          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
            (<a href="https://vercel.com" target="_blank" rel="noopener">vercel.com</a>).
          </p>
          <h2>Propriété intellectuelle</h2>
          <p>
            L’ensemble des contenus présents sur ce site (textes, identité visuelle, logo) est la propriété exclusive de Mariell,
            à l’exception des marques, logos ou contenus appartenant à d’autres sociétés partenaires ou auteurs.
            Toute reproduction sans autorisation expresse et écrite est interdite.
          </p>
          <h2>Données personnelles</h2>
          <p>
            Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d’un droit d’accès, de rectification,
            d’effacement et d’opposition aux données vous concernant. Pour l’exercer&nbsp;: <a href="mailto:chez@mariell.fr">chez@mariell.fr</a>.
            Pour plus d’informations, consultez notre <NuxtLink to="/politique-confidentialite">Politique de protection des données</NuxtLink>.
          </p>
          <h2>Cookies</h2>
          <p>Ce site n’utilise pas de cookies.</p>
          <h2>Limitation de responsabilité</h2>
          <p>
            Mariell ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l’utilisateur
            lors de l’accès au site, résultant soit de l’utilisation d’un matériel ne répondant pas aux spécifications techniques
            requises, soit de l’apparition d’un bug ou d’une incompatibilité.
          </p>
          <p style="font-size:13px;color:var(--fg-on-paper-3);">Dernière mise à jour&nbsp;: 18/04/2026.</p>
        </div>
      </div>
    </section>
  </div>
</template>
