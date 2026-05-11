# Templates Brevo — Évaluation d'attractivité offre Sales (Mariell)

**Projet** : Le Lab Mariell — Outil n°3 (Évaluation d'attractivité)
**Version** : 4.0 — ajout de la ligne "Modalité de travail" dans les notifications internes (Templates 1 et 2), cohérent avec la spec Nitro V2 (champ `modalite_travail` enum 4 valeurs)
**Service** : Brevo (transactional email)

---

## Vue d'ensemble

L'outil 3 utilise **4 templates Brevo** :

| Email | Destinataire | Déclencheur | Contenu |
|---|---|---|---|
| **Template 1** | Le gérant Mariell | Génération réussie | Notification interne complète : récap inputs + verdict + dimensions + alertes |
| **Template 2** | Le gérant Mariell | Rate limit dépassé (mode différé) | Notification interne courte : récap inputs + signalement "lead capturé en attente" |
| **Template 3** | Le prospect | Génération réussie | Confirmation + livraison de l'évaluation + CTA Calendly |
| **Template 4** | Le prospect | Rate limit dépassé (mode différé) | "Votre évaluation arrive sous 24-48h" + CTA Calendly direct |

**Logique de déclenchement** :
- **Cas génération réussie** : Templates 1 + 3 envoyés en parallèle après l'appel LLM réussi
- **Cas mode différé** : Templates 2 + 4 envoyés en parallèle dès la détection du rate limit (sans appel LLM)

---

## TEMPLATE 1 — Notification interne — Évaluation livrée (gérant Mariell)

> Envoyé uniquement en cas de génération réussie. Pour le cas mode différé, voir Template 2.

### Métadonnées

| Propriété | Valeur |
|---|---|
| **Nom du template Brevo** | `Lab — Évaluation d'attractivité — Notification interne — Livrée` |
| **Sujet** | `[Lab • Évaluation] {{params.PRENOM_NOM}} — {{params.ENTREPRISE}} — {{params.NIVEAU_ATTRACTIVITE}}` |
| **Pré-header** | `Soumission Évaluation d'attractivité — récap des inputs et niveau` |
| **Email expéditeur** | `bonjour@mariell.fr` (nom : "Mariell") |
| **Destinataire** | Email du gérant (variable env `BREVO_NOTIF_RECIPIENT`) |

### Corps HTML

```html
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #1a1a1a; line-height: 1.5; padding: 24px;">

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">Nouvelle soumission — Évaluation d'attractivité</h2>
  <p style="font-size: 13px; color: #666; margin: 0 0 24px 0;">Reçue le {{params.DATE_SOUMISSION}}</p>

  <!-- Bandeau niveau d'attractivité (si dispo, sinon différé) -->
  <div style="background-color: {{params.NIVEAU_BG_COLOR}}; padding: 16px 20px; border-radius: 6px; margin: 16px 0 24px 0;">
    <p style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 6px 0;">Niveau d'attractivité évalué</p>
    <p style="font-size: 18px; font-weight: 600; margin: 0; color: {{params.NIVEAU_TEXT_COLOR}};">{{params.NIVEAU_ATTRACTIVITE}}</p>
    <p style="font-size: 13px; color: #666; margin: 6px 0 0 0;">Score interne : {{params.SCORE_INTERNE}}/9 — Jauge : {{params.JAUGE_POSITION}}/10</p>
  </div>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">

  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Identité prospect</h3>
  <table cellpadding="6" cellspacing="0" style="width: 100%; font-size: 14px;">
    <tr><td style="width: 30%; color: #666;">Prénom et nom</td><td><strong>{{params.PRENOM_NOM}}</strong></td></tr>
    <tr><td style="color: #666;">Email</td><td><a href="mailto:{{params.EMAIL}}">{{params.EMAIL}}</a></td></tr>
    <tr><td style="color: #666;">Téléphone</td><td><a href="tel:{{params.TELEPHONE_LIEN}}">{{params.TELEPHONE}}</a></td></tr>
    <tr><td style="color: #666;">Entreprise</td><td><strong>{{params.ENTREPRISE}}</strong></td></tr>
    <tr><td style="color: #666;">Site web</td><td>{{params.SITE_WEB_HTML}}</td></tr>
  </table>

  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Contexte entreprise</h3>
  <table cellpadding="6" cellspacing="0" style="width: 100%; font-size: 14px;">
    <tr><td style="width: 30%; color: #666;">Secteur déclaré</td><td>{{params.SECTEUR}}</td></tr>
    <tr><td style="color: #666;">Localisation</td><td>{{params.LOCALISATION}}</td></tr>
    <tr><td style="color: #666;">Effectifs entreprise</td><td>{{params.EFFECTIFS}}</td></tr>
    <tr><td style="color: #666;">Composition équipe Sales</td><td>{{params.EQUIPE_SALES}}</td></tr>
  </table>

  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Le poste évalué</h3>
  <table cellpadding="6" cellspacing="0" style="width: 100%; font-size: 14px;">
    <tr><td style="width: 30%; color: #666;">Intitulé</td><td><strong>{{params.INTITULE_POSTE}}</strong></td></tr>
    <tr><td style="color: #666;">Séniorité visée</td><td>{{params.SENIORITE}}</td></tr>
    <tr><td style="color: #666;">Type de cycle</td><td>{{params.TYPE_CYCLE}}</td></tr>
    <tr><td style="color: #666;">Modalité de travail</td><td>{{params.MODALITE_TRAVAIL}}</td></tr>
    <tr><td style="color: #666;">Package fixe</td><td><strong>{{params.PACKAGE_FIXE}} €</strong></td></tr>
    <tr><td style="color: #666;">Package OTE</td><td><strong>{{params.PACKAGE_OTE}} €</strong></td></tr>
  </table>

  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Description des missions</h3>
  <div style="background-color: #f7f7f7; padding: 16px 20px; border-radius: 4px; font-size: 14px; line-height: 1.5;">
    {{params.DESCRIPTION_MISSIONS}}
  </div>

  <!-- Bloc dimensions (4 badges) -->
  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Lecture des 4 dimensions</h3>
  <table cellpadding="8" cellspacing="0" style="width: 100%; font-size: 14px;">
    <tr>
      <td style="width: 25%; background-color: #f7f7f7; border-radius: 4px; text-align: center;">
        <p style="font-size: 11px; color: #666; text-transform: uppercase; margin: 0 0 4px 0;">Marque</p>
        <p style="font-size: 14px; font-weight: 600; margin: 0;">{{params.DIM_MARQUE}}</p>
      </td>
      <td style="width: 25%; background-color: #f7f7f7; border-radius: 4px; text-align: center;">
        <p style="font-size: 11px; color: #666; text-transform: uppercase; margin: 0 0 4px 0;">Secteur</p>
        <p style="font-size: 14px; font-weight: 600; margin: 0;">{{params.DIM_SECTEUR}}</p>
      </td>
      <td style="width: 25%; background-color: #f7f7f7; border-radius: 4px; text-align: center;">
        <p style="font-size: 11px; color: #666; text-transform: uppercase; margin: 0 0 4px 0;">Mission</p>
        <p style="font-size: 14px; font-weight: 600; margin: 0;">{{params.DIM_MISSION}}</p>
      </td>
      <td style="width: 25%; background-color: #f7f7f7; border-radius: 4px; text-align: center;">
        <p style="font-size: 11px; color: #666; text-transform: uppercase; margin: 0 0 4px 0;">Package</p>
        <p style="font-size: 14px; font-weight: 600; margin: 0;">{{params.DIM_PACKAGE}}</p>
      </td>
    </tr>
  </table>

  <!-- Bloc alertes / brief flou (conditionnel) -->
  <div style="margin: 16px 0;">
    {{params.BLOC_ALERTES}}
  </div>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 32px 0 24px 0;">

  <h3 style="font-size: 15px; font-weight: 600; margin: 0 0 12px 0; color: #1a1a1a;">Liens utiles</h3>
  <p style="font-size: 14px; margin: 8px 0;"><strong>Évaluation générée :</strong><br><a href="{{params.URL_EVALUATION}}" style="color: #1a1a1a;">{{params.URL_EVALUATION}}</a></p>
  <p style="font-size: 14px; margin: 8px 0;"><strong>Fiche Jarvi :</strong><br><a href="{{params.URL_JARVI}}" style="color: #1a1a1a;">{{params.URL_JARVI}}</a></p>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 32px 0 16px 0;">

  <p style="font-size: 12px; color: #999; margin: 0;">Notification automatique — Le Lab Mariell — Outil 3</p>

</div>
```

### Variables Brevo

| Variable | Source | Format / valeur exemple |
|---|---|---|
| `{{params.DATE_SOUMISSION}}` | Backend Nitro (`new Date()`) | "28/04/2026 à 14h32" |
| `{{params.NIVEAU_ATTRACTIVITE}}` | JSON LLM | "Très attractive" |
| `{{params.NIVEAU_BG_COLOR}}` | Backend (mapping niveau→couleur) | "#e8f5e9" pour Hyper attractive, "#fff3e0" pour Sous-positionnée, etc. |
| `{{params.NIVEAU_TEXT_COLOR}}` | Backend (mapping niveau→couleur texte) | "#1b5e20" / "#e65100" / etc. |
| `{{params.SCORE_INTERNE}}` | JSON LLM | "5" (entier après arrondi) |
| `{{params.JAUGE_POSITION}}` | JSON LLM | "8" |
| `{{params.PRENOM_NOM}}` | Formulaire | "Marie Dupont" |
| `{{params.EMAIL}}` | Formulaire | "marie@pennylane.com" |
| `{{params.TELEPHONE}}` | Formulaire | "+33 6 12 34 56 78" (affiché tel quel) |
| `{{params.TELEPHONE_LIEN}}` | Backend (helper) | "+33612345678" (sans espaces, pour href tel:) |
| `{{params.ENTREPRISE}}` | Formulaire | "Pennylane" |
| `{{params.SITE_WEB_HTML}}` | Backend (helper `buildSiteWebHtml()`) | Lien `<a>` cliquable OU `<span>` "non renseigné" si vide |
| `{{params.SECTEUR}}` | Formulaire (avec suffixe précision si "Autre") | "Fintech" ou "Autre (Compta SaaS B2B)" |
| `{{params.LOCALISATION}}` | Formulaire | "Paris, France" |
| `{{params.EFFECTIFS}}` | Formulaire | "800 personnes" |
| `{{params.EQUIPE_SALES}}` | Formulaire | "15 personnes (4 SDR, 8 AE, 2 Team Lead, 1 Head of Sales)" |
| `{{params.INTITULE_POSTE}}` | Formulaire (avec suffixe précision si "Autre") | "Account Executive — Mid-Market" ou "Autre (Senior CSM Tech)" |
| `{{params.SENIORITE}}` | Formulaire | "Confirmé 2-5 ans" |
| `{{params.TYPE_CYCLE}}` | Formulaire | "Mixte (Outbound + Inbound)" |
| `{{params.MODALITE_TRAVAIL}}` | Formulaire | "Hybride flexible (1-2 jours bureau / sem)" |
| `{{params.PACKAGE_FIXE}}` | Formulaire | "55 000" (formaté avec espace milliers) |
| `{{params.PACKAGE_OTE}}` | Formulaire | "100 000" |
| `{{params.DESCRIPTION_MISSIONS}}` | Formulaire | Texte libre (max 1000 char) |
| `{{params.DIM_MARQUE}}` | JSON LLM | "Référence" |
| `{{params.DIM_SECTEUR}}` | JSON LLM | "Dynamique" |
| `{{params.DIM_MISSION}}` | JSON LLM | "Premium" |
| `{{params.DIM_PACKAGE}}` | JSON LLM | "Aligné" |
| `{{params.BLOC_ALERTES}}` | Backend (HTML conditionnel) | Bloc HTML formaté ou chaîne vide |
| `{{params.URL_EVALUATION}}` | Backend (`${SITE_URL}/lab/evaluation-attractivite/resultat/${uuid}`) | URL complète |
| `{{params.URL_JARVI}}` | Backend (URL fiche Jarvi) | URL ou vide |

---

## TEMPLATE 2 — Notification interne — Évaluation différée (gérant Mariell)

> Envoyé uniquement quand le rate limit est dépassé. Pas d'évaluation LLM générée — juste une capture de lead. Le gérant doit décider de l'action : attendre la purge automatique de la queue, ou générer manuellement.

### Métadonnées

| Propriété | Valeur |
|---|---|
| **Nom du template Brevo** | `Lab — Évaluation d'attractivité — Notification interne — Différée` |
| **Sujet** | `[Lab • Évaluation DIFFÉRÉE] {{params.PRENOM_NOM}} — {{params.ENTREPRISE}}` |
| **Pré-header** | `Lead capturé en attente de génération — rate limit dépassé` |
| **Email expéditeur** | `bonjour@mariell.fr` (nom : "Mariell") |
| **Destinataire** | Email du gérant (variable env `BREVO_NOTIF_RECIPIENT`) |

### Corps HTML

```html
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #1a1a1a; line-height: 1.5; padding: 24px;">

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">Lead capturé — Évaluation différée</h2>
  <p style="font-size: 13px; color: #666; margin: 0 0 24px 0;">Reçue le {{params.DATE_SOUMISSION}}</p>

  <!-- Bandeau d'alerte rate limit -->
  <div style="background-color: #fff3e0; padding: 16px 20px; border-left: 4px solid #f57c00; border-radius: 4px; margin: 16px 0 24px 0;">
    <p style="font-size: 14px; font-weight: 600; color: #e65100; margin: 0 0 6px 0;">⚠ Rate limit dépassé pour cette IP</p>
    <p style="font-size: 13px; color: #5d4037; margin: 0;">Aucune évaluation LLM n'a été générée. Le prospect a reçu un email lui annonçant un délai de 24-48h. Ce lead est en file d'attente : génération manuelle possible ou attente de la purge automatique.</p>
  </div>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">

  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Identité prospect</h3>
  <table cellpadding="6" cellspacing="0" style="width: 100%; font-size: 14px;">
    <tr><td style="width: 30%; color: #666;">Prénom et nom</td><td><strong>{{params.PRENOM_NOM}}</strong></td></tr>
    <tr><td style="color: #666;">Email</td><td><a href="mailto:{{params.EMAIL}}">{{params.EMAIL}}</a></td></tr>
    <tr><td style="color: #666;">Téléphone</td><td><a href="tel:{{params.TELEPHONE_LIEN}}">{{params.TELEPHONE}}</a></td></tr>
    <tr><td style="color: #666;">Entreprise</td><td><strong>{{params.ENTREPRISE}}</strong></td></tr>
    <tr><td style="color: #666;">Site web</td><td>{{params.SITE_WEB_HTML}}</td></tr>
  </table>

  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Contexte entreprise</h3>
  <table cellpadding="6" cellspacing="0" style="width: 100%; font-size: 14px;">
    <tr><td style="width: 30%; color: #666;">Secteur déclaré</td><td>{{params.SECTEUR}}</td></tr>
    <tr><td style="color: #666;">Localisation</td><td>{{params.LOCALISATION}}</td></tr>
    <tr><td style="color: #666;">Effectifs entreprise</td><td>{{params.EFFECTIFS}}</td></tr>
    <tr><td style="color: #666;">Composition équipe Sales</td><td>{{params.EQUIPE_SALES}}</td></tr>
  </table>

  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Le poste à évaluer</h3>
  <table cellpadding="6" cellspacing="0" style="width: 100%; font-size: 14px;">
    <tr><td style="width: 30%; color: #666;">Intitulé</td><td><strong>{{params.INTITULE_POSTE}}</strong></td></tr>
    <tr><td style="color: #666;">Séniorité visée</td><td>{{params.SENIORITE}}</td></tr>
    <tr><td style="color: #666;">Type de cycle</td><td>{{params.TYPE_CYCLE}}</td></tr>
    <tr><td style="color: #666;">Modalité de travail</td><td>{{params.MODALITE_TRAVAIL}}</td></tr>
    <tr><td style="color: #666;">Package fixe</td><td><strong>{{params.PACKAGE_FIXE}} €</strong></td></tr>
    <tr><td style="color: #666;">Package OTE</td><td><strong>{{params.PACKAGE_OTE}} €</strong></td></tr>
  </table>

  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Description des missions</h3>
  <div style="background-color: #f7f7f7; padding: 16px 20px; border-radius: 4px; font-size: 14px; line-height: 1.5;">
    {{params.DESCRIPTION_MISSIONS}}
  </div>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 32px 0 24px 0;">

  <h3 style="font-size: 15px; font-weight: 600; margin: 0 0 12px 0; color: #1a1a1a;">Actions possibles</h3>
  <p style="font-size: 14px; margin: 8px 0; color: #666;">Ce lead est en file d'attente. Vous pouvez :</p>
  <ul style="font-size: 14px; color: #444; line-height: 1.6; padding-left: 20px;">
    <li><strong>Attendre</strong> la purge automatique de la queue (cron hebdomadaire)</li>
    <li><strong>Générer manuellement</strong> l'évaluation depuis la file d'attente</li>
    <li><strong>Contacter directement</strong> le prospect via Calendly ou téléphone si lead chaud</li>
  </ul>

  <p style="font-size: 14px; margin: 16px 0;"><strong>Fiche Jarvi :</strong><br><a href="{{params.URL_JARVI}}" style="color: #1a1a1a;">{{params.URL_JARVI}}</a></p>
  <p style="font-size: 14px; margin: 16px 0;"><strong>UUID de la demande différée :</strong> <code style="background-color: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: monospace; font-size: 12px;">{{params.UUID_DEFERRED}}</code></p>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 32px 0 16px 0;">

  <p style="font-size: 12px; color: #999; margin: 0;">Notification automatique — Le Lab Mariell — Outil 3 — Mode différé</p>

</div>
```

### Variables Brevo

| Variable | Source | Format / valeur exemple |
|---|---|---|
| `{{params.DATE_SOUMISSION}}` | Backend Nitro (`new Date()`) | "28/04/2026 à 14h32" |
| `{{params.PRENOM_NOM}}` | Formulaire | "Marie Dupont" |
| `{{params.EMAIL}}` | Formulaire | "marie@pennylane.com" |
| `{{params.TELEPHONE}}` | Formulaire | "+33 6 12 34 56 78" |
| `{{params.TELEPHONE_LIEN}}` | Backend (helper) | "+33612345678" (sans espaces) |
| `{{params.ENTREPRISE}}` | Formulaire | "Pennylane" |
| `{{params.SITE_WEB_HTML}}` | Backend (helper `buildSiteWebHtml()`) | Lien `<a>` cliquable OU "non renseigné" |
| `{{params.SECTEUR}}` | Formulaire (avec suffixe précision si "Autre") | "Fintech" ou "Autre (Compta SaaS B2B)" |
| `{{params.LOCALISATION}}` | Formulaire | "Paris, France" |
| `{{params.EFFECTIFS}}` | Formulaire | "800 personnes" |
| `{{params.EQUIPE_SALES}}` | Formulaire | "15 personnes (4 SDR, 8 AE, 2 Team Lead, 1 Head of Sales)" |
| `{{params.INTITULE_POSTE}}` | Formulaire (avec suffixe précision si "Autre") | "Account Executive — Mid-Market" |
| `{{params.SENIORITE}}` | Formulaire | "Confirmé 2-5 ans" |
| `{{params.TYPE_CYCLE}}` | Formulaire | "Mixte (Outbound + Inbound)" |
| `{{params.MODALITE_TRAVAIL}}` | Formulaire | "Hybride flexible (1-2 jours bureau / sem)" |
| `{{params.PACKAGE_FIXE}}` | Formulaire | "55 000" |
| `{{params.PACKAGE_OTE}}` | Formulaire | "100 000" |
| `{{params.DESCRIPTION_MISSIONS}}` | Formulaire | Texte libre (max 1000 char) |
| `{{params.UUID_DEFERRED}}` | Backend (UUID généré) | "abc-123-def-456" |
| `{{params.URL_JARVI}}` | Backend (URL fiche Jarvi) | URL ou vide |

---

## TEMPLATE 3 — Livraison prospect (génération réussie)

### Métadonnées

| Propriété | Valeur |
|---|---|
| **Nom du template Brevo** | `Lab — Évaluation d'attractivité — Livraison prospect` |
| **Sujet** | `Votre évaluation d'attractivité — {{params.INTITULE_POSTE}}` |
| **Pré-header** | `Préparée par Mariell pour {{params.ENTREPRISE}} — accessible 90 jours.` |
| **Email expéditeur** | `bonjour@mariell.fr` (nom : "Mariell") |
| **Destinataire** | `{{params.EMAIL}}` (renseigné par le formulaire) |

### Corps HTML

```html
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">

  <!-- En-tête / signature visuelle -->
  <div style="padding: 32px 0 24px 0; border-bottom: 1px solid #e0e0e0;">
    <p style="font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0;">Mariell</p>
  </div>

  <!-- Corps -->
  <div style="padding: 32px 0;">

    <p style="font-size: 18px; font-weight: 500; margin: 0 0 24px 0;">Bonjour {{params.PRENOM}},</p>

    <p>Votre évaluation d'attractivité pour le poste de <strong>{{params.INTITULE_POSTE}}</strong> est prête.</p>

    <p>Elle a été conçue pour vous donner une lecture experte de votre offre Sales sur 4 dimensions clés : la marque de votre entreprise, la tension de votre secteur, la qualité de la mission décrite, et le positionnement de votre package.</p>

    <!-- Bloc verdict -->
    <div style="background-color: #f7f7f7; padding: 24px; border-radius: 6px; margin: 32px 0; text-align: center;">
      <p style="font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Position d'attractivité</p>
      <p style="font-size: 24px; font-weight: 600; margin: 0; color: #1a1a1a;">{{params.NIVEAU_ATTRACTIVITE}}</p>
    </div>

    <!-- CTA principal : consulter l'évaluation -->
    <div style="margin: 40px 0; text-align: center;">
      <a href="{{params.URL_EVALUATION}}" style="display: inline-block; padding: 14px 32px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-weight: 500; font-size: 15px; border-radius: 4px;">Consulter mon évaluation</a>
    </div>

    <p style="font-size: 14px; color: #666; text-align: center;">Votre évaluation reste accessible via ce lien pendant 90 jours.</p>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">

    <!-- Twist + CTA Calendly -->
    <p>Vous avez maintenant une lecture claire du positionnement de votre offre. La stratégie est posée. Reste l'exécution : trouver le bon profil, négocier dans une fenêtre de 10 jours face à 4 cabinets concurrents, détecter les top performers en conversation, tenir le closing sans perdre le candidat à la dernière étape. 80% du résultat se joue à ce moment-là.</p>

    <p>On peut en parler. C'est ici.</p>

    <div style="margin: 24px 0 32px 0;">
      <a href="{{params.URL_CALENDLY}}" style="display: inline-block; padding: 12px 28px; background-color: #ffffff; color: #1a1a1a; text-decoration: none; font-weight: 500; font-size: 14px; border: 1px solid #1a1a1a; border-radius: 4px;">Prendre rendez-vous</a>
    </div>

  </div>

  <!-- Signature Mariell -->
  <div style="padding: 24px 0; border-top: 1px solid #e0e0e0;">
    <p style="margin: 0 0 4px 0; font-weight: 600; color: #1a1a1a;">— Mariell</p>
    <p style="margin: 0; font-size: 13px; color: #666;">Cabinet de recrutement Sales, sur-mesure.</p>
  </div>

  <!-- Footer mentions + opt-out RGPD -->
  <div style="padding: 16px 0; font-size: 11px; color: #999; text-align: center; line-height: 1.5;">
    <p style="margin: 0 0 8px 0;">Vous recevez cet email car vous avez utilisé l'outil Évaluation d'attractivité du Lab Mariell.</p>
    <p style="margin: 0;">{{ unsubscribe }}</p>
  </div>

</div>
```

### Variables Brevo

| Variable | Source | Format / valeur exemple |
|---|---|---|
| `{{params.PRENOM}}` | Backend (formulaire `prenom`) | "Marie" |
| `{{params.INTITULE_POSTE}}` | Formulaire | "Account Executive Mid-Market" |
| `{{params.ENTREPRISE}}` | Formulaire | "Pennylane" |
| `{{params.NIVEAU_ATTRACTIVITE}}` | JSON LLM | "Très attractive" |
| `{{params.URL_EVALUATION}}` | Backend (`${SITE_URL}/lab/evaluation-attractivite/resultat/${uuid}`) | URL complète |
| `{{params.URL_CALENDLY}}` | Variable env (`CALENDLY_URL_OUTIL_3`) | URL Calendly |
| `{{ unsubscribe }}` | Brevo natif | Lien de désinscription auto-généré |

---

## TEMPLATE 4 — Évaluation différée prospect (rate limit dépassé)

### Métadonnées

| Propriété | Valeur |
|---|---|
| **Nom du template Brevo** | `Lab — Évaluation d'attractivité — Différé` |
| **Sujet** | `Votre évaluation d'attractivité arrive — {{params.ENTREPRISE}}` |
| **Pré-header** | `Votre demande a bien été reçue. Évaluation envoyée sous 24-48h.` |
| **Email expéditeur** | `bonjour@mariell.fr` (nom : "Mariell") |
| **Destinataire** | `{{params.EMAIL}}` (renseigné par le formulaire) |

### Corps HTML

```html
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">

  <!-- En-tête / signature visuelle -->
  <div style="padding: 32px 0 24px 0; border-bottom: 1px solid #e0e0e0;">
    <p style="font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0;">Mariell</p>
  </div>

  <!-- Corps -->
  <div style="padding: 32px 0;">

    <p style="font-size: 18px; font-weight: 500; margin: 0 0 24px 0;">Bonjour {{params.PRENOM}},</p>

    <p>Votre demande d'évaluation d'attractivité pour le poste de <strong>{{params.INTITULE_POSTE}}</strong> chez <strong>{{params.ENTREPRISE}}</strong> a bien été reçue.</p>

    <p>L'outil traite actuellement un volume important de demandes. Votre évaluation vous parviendra par email <strong>sous 24 à 48 heures</strong>, dès que la file sera traitée.</p>

    <!-- Bloc rassurance -->
    <div style="background-color: #f7f7f7; padding: 20px 24px; border-radius: 6px; margin: 32px 0;">
      <p style="font-size: 14px; color: #666; margin: 0 0 8px 0;"><strong>À noter :</strong></p>
      <ul style="font-size: 14px; color: #444; margin: 0; padding-left: 20px; line-height: 1.6;">
        <li>Votre demande est enregistrée, aucune action de votre part n'est nécessaire.</li>
        <li>L'évaluation sera envoyée à cette adresse email.</li>
        <li>Si vous avez besoin d'un retour plus rapide, vous pouvez prendre rendez-vous directement.</li>
      </ul>
    </div>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">

    <!-- CTA Calendly direct -->
    <p>Si vous voulez aller plus vite, on peut en parler dès maintenant.</p>

    <div style="margin: 24px 0 32px 0;">
      <a href="{{params.URL_CALENDLY}}" style="display: inline-block; padding: 12px 28px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-weight: 500; font-size: 14px; border-radius: 4px;">Prendre rendez-vous</a>
    </div>

  </div>

  <!-- Signature Mariell -->
  <div style="padding: 24px 0; border-top: 1px solid #e0e0e0;">
    <p style="margin: 0 0 4px 0; font-weight: 600; color: #1a1a1a;">— Mariell</p>
    <p style="margin: 0; font-size: 13px; color: #666;">Cabinet de recrutement Sales, sur-mesure.</p>
  </div>

  <!-- Footer mentions + opt-out RGPD -->
  <div style="padding: 16px 0; font-size: 11px; color: #999; text-align: center; line-height: 1.5;">
    <p style="margin: 0 0 8px 0;">Vous recevez cet email car vous avez utilisé l'outil Évaluation d'attractivité du Lab Mariell.</p>
    <p style="margin: 0;">{{ unsubscribe }}</p>
  </div>

</div>
```

### Variables Brevo

| Variable | Source | Format / valeur exemple |
|---|---|---|
| `{{params.PRENOM}}` | Backend (formulaire `prenom`) | "Marie" |
| `{{params.INTITULE_POSTE}}` | Formulaire | "Account Executive Mid-Market" |
| `{{params.ENTREPRISE}}` | Formulaire | "Pennylane" |
| `{{params.EMAIL}}` | Formulaire | "marie@pennylane.com" (utilisé pour le routing Brevo) |
| `{{params.URL_CALENDLY}}` | Variable env (`CALENDLY_URL_OUTIL_3`) | URL Calendly |
| `{{ unsubscribe }}` | Brevo natif | Lien de désinscription auto-généré |

---

## Configuration Brevo — Checklist setup

| # | Action | Détail |
|---|---|---|
| 1 | Configurer l'expéditeur `bonjour@mariell.fr` | Brevo → Senders & IP → Add a new sender. Vérification DNS (SPF + DKIM) sur ton domaine `mariell.fr`. **Identique à l'outil 2, déjà configuré normalement.** |
| 2 | Créer le Template 1 dans Brevo (Notif interne livrée) | Templates → Create a new template → coller le HTML |
| 3 | Créer le Template 2 dans Brevo (Notif interne différée) | Idem |
| 4 | Créer le Template 3 dans Brevo (Livraison prospect) | Idem |
| 5 | Créer le Template 4 dans Brevo (Différée prospect) | Idem |
| 6 | Récupérer les IDs des 4 templates | À passer dans variables env (cf. section "Variables d'environnement à ajouter" ci-dessous) |
| 7 | Tester l'envoi avec valeurs en dur | Brevo permet de tester chaque template avec des params manuels avant intégration |
| 8 | Vérifier la clé API Brevo en variable env | `BREVO_API_KEY` (déjà existant si outil 2 déployé) |

---

## Notes pour le dev

### Construction côté Nitro des params

Les variables Brevo sont passées par l'appel API. Code de référence dans `/server/utils/outil-3/brevo-send.ts` (cf. spec Nitro outil 3, section 9). L'envoi des notifications internes utilise **2 fonctions distinctes** selon le cas (livrée ou différée).

#### Fonction pour le Template 1 (Notification interne — Évaluation livrée)

```typescript
import type { LlmOutputJson } from '~/server/schemas/outil-3/llm-output-json';
import type { FormulaireOutil3 } from '~/server/schemas/outil-3/formulaire';

export async function sendBrevoNotifInterneLivree(
  data: FormulaireOutil3,
  uuid: string,
  json: LlmOutputJson
) {
  const params = {
    DATE_SOUMISSION: formatDateFr(new Date()),
    NIVEAU_ATTRACTIVITE: json.niveau_attractivite,
    NIVEAU_BG_COLOR: getNiveauBgColor(json.niveau_index),
    NIVEAU_TEXT_COLOR: getNiveauTextColor(json.niveau_index),
    SCORE_INTERNE: json.score_interne.toString(),
    JAUGE_POSITION: json.jauge_position.toString(),
    PRENOM_NOM: `${data.prenom} ${data.nom}`,
    EMAIL: data.email,
    TELEPHONE: data.telephone,
    TELEPHONE_LIEN: data.telephone.replace(/[^+\d]/g, ''),  // Format pour href tel: (sans espaces)
    ENTREPRISE: data.entreprise,
    SITE_WEB_HTML: buildSiteWebHtml(data.site_web),  // Helper qui gère le cas vide
    SECTEUR: data.secteur === 'Autre' && data.secteur_precision_autre
      ? `${data.secteur} (${data.secteur_precision_autre})`
      : data.secteur,
    LOCALISATION: data.localisation,
    EFFECTIFS: data.effectifs_entreprise,
    EQUIPE_SALES: data.equipe_sales,
    INTITULE_POSTE: data.intitule_poste === 'Autre' && data.intitule_poste_precision_autre
      ? `${data.intitule_poste} (${data.intitule_poste_precision_autre})`
      : data.intitule_poste,
    SENIORITE: data.seniorite,
    TYPE_CYCLE: data.type_cycle === 'Autre' && data.type_cycle_autre
      ? `${data.type_cycle} (${data.type_cycle_autre})`
      : data.type_cycle,
    MODALITE_TRAVAIL: data.modalite_travail,
    PACKAGE_FIXE: data.package_fixe.toLocaleString('fr-FR'),
    PACKAGE_OTE: data.package_ote.toLocaleString('fr-FR'),
    DESCRIPTION_MISSIONS: data.description_missions,
    DIM_MARQUE: json.dimensions.marque,
    DIM_SECTEUR: json.dimensions.secteur,
    DIM_MISSION: json.dimensions.mission,
    DIM_PACKAGE: json.dimensions.package,
    BLOC_ALERTES: buildBlocAlertesHtml(json),
    URL_EVALUATION: `${process.env.PUBLIC_BASE_URL}/lab/evaluation-attractivite/resultat/${uuid}`,
    URL_JARVI: '' // À remplir si fiche Jarvi accessible via API
  };
  
  return sendBrevoEmail({
    to: process.env.BREVO_NOTIF_RECIPIENT!,
    templateId: parseInt(process.env.BREVO_TEMPLATE_NOTIF_INTERNE_LIVREE_ID!),
    params
  });
}
```

#### Fonction pour le Template 2 (Notification interne — Évaluation différée)

Plus simple que la version livrée : pas de JSON LLM disponible (l'appel n'a jamais eu lieu), donc on n'inclut que les données du formulaire et l'UUID de la file d'attente.

```typescript
export async function sendBrevoNotifInterneDifferee(
  data: FormulaireOutil3,
  uuidDeferred: string
) {
  const params = {
    DATE_SOUMISSION: formatDateFr(new Date()),
    PRENOM_NOM: `${data.prenom} ${data.nom}`,
    EMAIL: data.email,
    TELEPHONE: data.telephone,
    TELEPHONE_LIEN: data.telephone.replace(/[^+\d]/g, ''),
    ENTREPRISE: data.entreprise,
    SITE_WEB_HTML: buildSiteWebHtml(data.site_web),
    SECTEUR: data.secteur === 'Autre' && data.secteur_precision_autre
      ? `${data.secteur} (${data.secteur_precision_autre})`
      : data.secteur,
    LOCALISATION: data.localisation,
    EFFECTIFS: data.effectifs_entreprise,
    EQUIPE_SALES: data.equipe_sales,
    INTITULE_POSTE: data.intitule_poste === 'Autre' && data.intitule_poste_precision_autre
      ? `${data.intitule_poste} (${data.intitule_poste_precision_autre})`
      : data.intitule_poste,
    SENIORITE: data.seniorite,
    TYPE_CYCLE: data.type_cycle === 'Autre' && data.type_cycle_autre
      ? `${data.type_cycle} (${data.type_cycle_autre})`
      : data.type_cycle,
    MODALITE_TRAVAIL: data.modalite_travail,
    PACKAGE_FIXE: data.package_fixe.toLocaleString('fr-FR'),
    PACKAGE_OTE: data.package_ote.toLocaleString('fr-FR'),
    DESCRIPTION_MISSIONS: data.description_missions,
    UUID_DEFERRED: uuidDeferred,
    URL_JARVI: '' // À remplir si fiche Jarvi accessible via API
  };
  
  return sendBrevoEmail({
    to: process.env.BREVO_NOTIF_RECIPIENT!,
    templateId: parseInt(process.env.BREVO_TEMPLATE_NOTIF_INTERNE_DIFFEREE_ID!),
    params
  });
}
```

### Helper `getNiveauBgColor()` et `getNiveauTextColor()`

Mapping niveau d'attractivité → couleurs pour le bandeau dans la notification interne (Template 1 uniquement) :

```typescript
function getNiveauBgColor(niveauIndex: number): string {
  const map: Record<number, string> = {
    1: '#ffebee', // Fragile - rouge clair
    2: '#fff3e0', // Sous-positionnée - orange clair
    3: '#e3f2fd', // Attractive / alignée - bleu clair
    4: '#e8f5e9', // Très attractive - vert clair
    5: '#c8e6c9'  // Hyper attractive - vert moyen
  };
  return map[niveauIndex] ?? '#f5f5f5';
}

function getNiveauTextColor(niveauIndex: number): string {
  const map: Record<number, string> = {
    1: '#c62828', // rouge foncé
    2: '#e65100', // orange foncé
    3: '#1565c0', // bleu foncé
    4: '#1b5e20', // vert foncé
    5: '#0d3a14'  // vert très foncé
  };
  return map[niveauIndex] ?? '#666';
}
```

### Helper `buildSiteWebHtml()`

Construit le bloc HTML conditionnel pour le site web (vide si non renseigné) :

```typescript
function buildSiteWebHtml(siteWeb: string | undefined): string {
  if (!siteWeb || siteWeb.trim() === '') {
    return '<span style="color: #999; font-style: italic;">non renseigné</span>';
  }
  return `<a href="${siteWeb}" target="_blank" rel="noopener">${siteWeb}</a>`;
}
```

### Helper `buildBlocAlertesHtml()`

Construit le bloc HTML conditionnel pour les alertes et le brief flou (utilisé uniquement par Template 1 — livrée) :

```typescript
function buildBlocAlertesHtml(json: LlmOutputJson): string {
  const blocks: string[] = [];
  
  // Brief flou
  if (json.brief_flou) {
    blocks.push(`
      <div style="background-color: #fff8e1; padding: 12px 16px; border-radius: 4px; border-left: 3px solid #f9a825; margin: 8px 0;">
        <p style="font-size: 13px; color: #5d4037; margin: 0;"><strong>⚠ Brief signalé comme flou par le LLM</strong></p>
      </div>
    `);
  }
  
  // Alertes structurées
  if (json.alertes && json.alertes.length > 0) {
    const alertesList = json.alertes
      .map(a => `<li style="margin-bottom: 4px;">${a}</li>`)
      .join('');
    blocks.push(`
      <div style="background-color: #ffebee; padding: 12px 16px; border-radius: 4px; border-left: 3px solid #c62828; margin: 8px 0;">
        <p style="font-size: 13px; color: #b71c1c; margin: 0 0 8px 0;"><strong>Alertes</strong></p>
        <ul style="font-size: 13px; color: #5d4037; margin: 0; padding-left: 20px;">${alertesList}</ul>
      </div>
    `);
  }
  
  return blocks.join('');
}
```

### Helper `formatDateFr()`

Identique à l'outil 2 :

```typescript
function formatDateFr(date: Date): string {
  const dateStr = date.toLocaleDateString('fr-FR', { 
    day: '2-digit', month: '2-digit', year: 'numeric' 
  });
  const timeStr = date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', minute: '2-digit' 
  }).replace(':', 'h');
  return `${dateStr} à ${timeStr}`;
}
```

### Variables d'environnement à ajouter

À compléter par rapport à la spec Nitro (passage de 2 à 4 templates) :

```bash
# Templates Brevo outil 3 (4 IDs)
BREVO_TEMPLATE_NOTIF_INTERNE_LIVREE_ID=14      # Template 1 — Notif interne livrée
BREVO_TEMPLATE_NOTIF_INTERNE_DIFFEREE_ID=15    # Template 2 — Notif interne différée
BREVO_TEMPLATE_EVALUATION_DELIVERED_ID=16      # Template 3 — Livraison prospect
BREVO_TEMPLATE_EVALUATION_DEFERRED_ID=17       # Template 4 — Différée prospect

# Destinataire de la notification interne (mutualisé outil 1, 2, 3)
BREVO_NOTIF_RECIPIENT=hello@mariell.fr
```

> ⚠️ **Note pour le dev** : la spec Nitro V0 référence seulement 2 IDs Brevo (DELIVERED + DEFERRED). Avec ce passage à 4 templates, il faut maintenant ajouter les 2 IDs notif interne (LIVREE + DIFFEREE) et appeler `sendBrevoNotifInterneLivree()` ou `sendBrevoNotifInterneDifferee()` selon le cas dans la route principale `generate.post.ts`. Une mise à jour de la spec Nitro V0 → V1 sera nécessaire pour formaliser cet ajustement.

---

**Fin du document templates Brevo outil 3.**
