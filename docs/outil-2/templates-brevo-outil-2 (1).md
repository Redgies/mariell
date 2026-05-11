# Templates Brevo — Plan de sourcing LinkedIn (Mariell — Outil 2)

**Projet** : Le Lab Mariell — Outil n°2 (Plan de sourcing LinkedIn personnalisé)
**Version** : 3.0 (alignement formulaire v4 — Prénom/Nom séparés, Package détaillé Fixe/OTE/Variable/Ratio)
**Service** : Brevo (transactional email)

---

## Vue d'ensemble

L'outil 2 utilise **4 templates Brevo**, répartis en 2 scénarios :

### Scénario A — Génération réussie (cas nominal)

| Email | Destinataire | Déclencheur | Contenu |
|---|---|---|---|
| **Template 1** | Le gérant Mariell | Soumission formulaire valide + plan généré avec succès | Notification interne avec récap des inputs |
| **Template 2** | Le prospect | Soumission formulaire valide + plan généré avec succès | Confirmation + livraison du plan généré |

### Scénario B — Mode différé (rate limit ou échec API)

| Email | Destinataire | Déclencheur | Contenu |
|---|---|---|---|
| **Template 3** | Le gérant Mariell | Bascule mode différé | Alerte interne "demande à traiter manuellement sous 24h" |
| **Template 4** | Le prospect | Bascule mode différé | Confirmation premium "votre demande va être traitée manuellement" |

---

## TEMPLATE 1 — Notification interne (gérant Mariell, génération réussie)

### Métadonnées

| Propriété | Valeur |
|---|---|
| **Nom du template Brevo** | `Lab — Plan de sourcing — Notification interne` |
| **Sujet** | `[Lab • Plan de sourcing] {{params.PRENOM}} {{params.NOM}} — {{params.ENTREPRISE}} — {{params.POSTE_RECHERCHE}}` |
| **Pré-header** | `Soumission Plan de sourcing LinkedIn — récap des inputs` |
| **Email expéditeur** | `bonjour@mariell.fr` (nom : "Mariell") |
| **Destinataire** | Email du gérant (variable env `BREVO_NOTIF_RECIPIENT`) |

### Corps HTML

```html
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #1a1a1a; line-height: 1.5; padding: 24px;">

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">Nouvelle soumission — Plan de sourcing LinkedIn</h2>
  <p style="font-size: 13px; color: #666; margin: 0 0 24px 0;">Reçue le {{params.DATE_SOUMISSION}}</p>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">

  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Identité</h3>
  <table cellpadding="6" cellspacing="0" style="width: 100%; font-size: 14px;">
    <tr><td style="width: 30%; color: #666;">Prénom</td><td><strong>{{params.PRENOM}}</strong></td></tr>
    <tr><td style="color: #666;">Nom</td><td><strong>{{params.NOM}}</strong></td></tr>
    <tr><td style="color: #666;">Email</td><td><a href="mailto:{{params.EMAIL}}">{{params.EMAIL}}</a></td></tr>
    <tr><td style="color: #666;">Téléphone</td><td>{{params.TELEPHONE}}</td></tr>
    <tr><td style="color: #666;">Entreprise</td><td><strong>{{params.ENTREPRISE}}</strong></td></tr>
  </table>

  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Le poste à pourvoir</h3>
  <table cellpadding="6" cellspacing="0" style="width: 100%; font-size: 14px;">
    <tr><td style="width: 30%; color: #666;">Poste recherché</td><td><strong>{{params.POSTE_RECHERCHE}}</strong></td></tr>
    <tr><td style="color: #666;">Séniorité visée</td><td>{{params.SENIORITE}}</td></tr>
    <tr><td style="color: #666;">Objectif principal</td><td>{{params.OBJECTIF_POSTE}}</td></tr>
    <tr><td style="color: #666;">Localisation</td><td>{{params.LOCALISATION}}</td></tr>
    <tr><td style="color: #666;">Remote possible</td><td>{{params.REMOTE_POSSIBLE}}</td></tr>
  </table>

  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Contexte</h3>
  <table cellpadding="6" cellspacing="0" style="width: 100%; font-size: 14px;">
    <tr><td style="width: 30%; color: #666;">Secteur entreprise</td><td>{{params.SECTEUR}}</td></tr>
    <tr><td style="color: #666;">Fixe annuel brut</td><td><strong>{{params.PACKAGE_FIXE}}</strong></td></tr>
    <tr><td style="color: #666;">OTE total cible</td><td><strong>{{params.PACKAGE_OTE}}</strong></td></tr>
    <tr><td style="color: #666;">Variable cible</td><td>{{params.PACKAGE_VARIABLE}}</td></tr>
    <tr><td style="color: #666;">Ratio</td><td>{{params.PACKAGE_RATIO}}</td></tr>
    <tr><td style="color: #666;">Site de l'entreprise</td><td>{{params.SITE_ENTREPRISE}}</td></tr>
    <tr><td style="color: #666;">Fiche de poste fournie</td><td>{{params.FICHE_POSTE_FOURNIE}}</td></tr>
  </table>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 32px 0 24px 0;">

  <h3 style="font-size: 15px; font-weight: 600; margin: 0 0 12px 0; color: #1a1a1a;">Liens utiles</h3>
  <p style="font-size: 14px; margin: 8px 0;"><strong>Plan généré :</strong><br><a href="{{params.URL_PLAN}}" style="color: #1a1a1a;">{{params.URL_PLAN}}</a></p>
  <p style="font-size: 14px; margin: 8px 0;"><strong>Fiche Jarvi :</strong><br><a href="{{params.URL_JARVI}}" style="color: #1a1a1a;">{{params.URL_JARVI}}</a></p>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 32px 0 16px 0;">

  <p style="font-size: 12px; color: #999; margin: 0;">Notification automatique — Le Lab Mariell</p>

</div>
```

### Variables Brevo

| Variable | Source | Format / valeur exemple |
|---|---|---|
| `{{params.DATE_SOUMISSION}}` | Backend Nitro (`new Date()`) | "02/05/2026 à 14h32" |
| `{{params.PRENOM}}` | Formulaire (champ Prénom) | "Marie" |
| `{{params.NOM}}` | Formulaire (champ Nom) | "Dupont" |
| `{{params.EMAIL}}` | Formulaire | "marie@salesfit.com" |
| `{{params.TELEPHONE}}` | Formulaire | "+33 6 12 34 56 78" |
| `{{params.ENTREPRISE}}` | Formulaire | "Salesfit" |
| `{{params.POSTE_RECHERCHE}}` | Formulaire | "Account Executive — Mid-Market" |
| `{{params.SENIORITE}}` | Formulaire | "Confirmé" |
| `{{params.OBJECTIF_POSTE}}` | Formulaire | "Développement et chasse" |
| `{{params.LOCALISATION}}` | Formulaire | "Paris, France" |
| `{{params.REMOTE_POSSIBLE}}` | Formulaire | "Oui" / "Non" |
| `{{params.SECTEUR}}` | Formulaire | "SaaS B2B" |
| `{{params.PACKAGE_FIXE}}` | Backend (formaté) | "55 000 €" |
| `{{params.PACKAGE_OTE}}` | Backend (formaté) | "100 000 €" |
| `{{params.PACKAGE_VARIABLE}}` | Backend (calculé OTE - Fixe) | "45 000 €" |
| `{{params.PACKAGE_RATIO}}` | Backend (calculé) | "55% fixe / 45% variable" |
| `{{params.SITE_ENTREPRISE}}` | Formulaire (optionnel) | URL ou "Non fourni" |
| `{{params.FICHE_POSTE_FOURNIE}}` | Formulaire (optionnel) | "Oui — extrait : ..." ou "Non fournie" |
| `{{params.URL_PLAN}}` | Backend | URL complète |
| `{{params.URL_JARVI}}` | Backend (URL fiche Jarvi) | URL ou vide en V1 |

---

## TEMPLATE 2 — Livraison prospect (génération réussie)

### Métadonnées

| Propriété | Valeur |
|---|---|
| **Nom du template Brevo** | `Lab — Plan de sourcing — Livraison prospect` |
| **Sujet** | `Votre plan de sourcing LinkedIn — {{params.POSTE_RECHERCHE}}` |
| **Pré-header** | `Préparé par Mariell pour {{params.ENTREPRISE}} — accessible 90 jours.` |
| **Email expéditeur** | `bonjour@mariell.fr` (nom : "Mariell") |
| **Destinataire** | `{{params.EMAIL}}` (renseigné par le formulaire) |

### Corps HTML

```html
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">

  <div style="padding: 32px 0 24px 0; border-bottom: 1px solid #e0e0e0;">
    <p style="font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0;">Mariell</p>
  </div>

  <div style="padding: 32px 0;">

    <p style="font-size: 18px; font-weight: 500; margin: 0 0 24px 0;">Bonjour {{params.PRENOM}},</p>

    <p>Votre plan de sourcing LinkedIn pour le poste de <strong>{{params.POSTE_RECHERCHE}}</strong> est prêt.</p>

    <p>Il a été conçu pour vous donner une stratégie de chasse complète, calibrée sur votre contexte : entreprises cibles, intitulés à viser, requête booléenne enrichie, stratégie en 4 phases, tableau de scoring, et points de vigilance.</p>

    <div style="margin: 40px 0; text-align: center;">
      <a href="{{params.URL_PLAN}}" style="display: inline-block; padding: 14px 32px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-weight: 500; font-size: 15px; border-radius: 4px;">Consulter mon plan</a>
    </div>

    <p style="font-size: 14px; color: #666; text-align: center;">Votre plan reste accessible via ce lien pendant 90 jours.</p>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">

    <p>Ce plan marche, à condition de l'exécuter à temps. Pour ça, il faut quelqu'un dont c'est le métier — qui lit un comp plan en 5 minutes, détecte un top performer dans une conversation, et tient le timing face à des profils qui signent en 10 jours.</p>

    <p>On peut en parler. C'est ici.</p>

    <div style="margin: 24px 0 32px 0;">
      <a href="{{params.URL_CALENDLY}}" style="display: inline-block; padding: 12px 28px; background-color: #ffffff; color: #1a1a1a; text-decoration: none; font-weight: 500; font-size: 14px; border: 1px solid #1a1a1a; border-radius: 4px;">Prendre rendez-vous</a>
    </div>

  </div>

  <div style="padding: 24px 0; border-top: 1px solid #e0e0e0;">
    <p style="margin: 0 0 4px 0; font-weight: 600; color: #1a1a1a;">— Mariell</p>
    <p style="margin: 0; font-size: 13px; color: #666;">Cabinet de recrutement Sales, sur-mesure.</p>
  </div>

  <div style="padding: 16px 0; font-size: 11px; color: #999; text-align: center; line-height: 1.5;">
    <p style="margin: 0 0 8px 0;">Vous recevez cet email car vous avez utilisé l'outil Plan de sourcing du Lab Mariell.</p>
    <p style="margin: 0;">{{ unsubscribe }}</p>
  </div>

</div>
```

### Variables Brevo

| Variable | Source | Format / valeur exemple |
|---|---|---|
| `{{params.PRENOM}}` | Formulaire | "Marie" |
| `{{params.POSTE_RECHERCHE}}` | Formulaire | "Account Executive — Mid-Market" |
| `{{params.ENTREPRISE}}` | Formulaire | "Salesfit" |
| `{{params.URL_PLAN}}` | Backend | URL complète |
| `{{params.URL_CALENDLY}}` | Variable env | URL Calendly |
| `{{ unsubscribe }}` | Brevo natif | Lien désinscription auto-généré |

---

## TEMPLATE 3 — Notification interne (gérant Mariell, mode différé)

### Métadonnées

| Propriété | Valeur |
|---|---|
| **Nom du template Brevo** | `Lab — Plan de sourcing — Demande différée (interne)` |
| **Sujet** | `[Lab • DEMANDE DIFFÉRÉE] {{params.PRENOM}} {{params.NOM}} — {{params.ENTREPRISE}} — {{params.POSTE_RECHERCHE}}` |
| **Pré-header** | `Demande à traiter manuellement sous 24h — {{params.RAISON_DIFFERE}}` |
| **Email expéditeur** | `bonjour@mariell.fr` (nom : "Mariell") |
| **Destinataire** | Email du gérant |

### Corps HTML

```html
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #1a1a1a; line-height: 1.5; padding: 24px;">

  <div style="background-color: #fff8e6; border-left: 4px solid #d97706; padding: 16px 20px; margin: 0 0 24px 0; border-radius: 4px;">
    <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #92400e;">⚠ DEMANDE DIFFÉRÉE — À TRAITER MANUELLEMENT SOUS 24H</p>
    <p style="margin: 0; font-size: 13px; color: #92400e;">Raison : {{params.RAISON_DIFFERE}}</p>
  </div>

  <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">Nouvelle demande — Plan de sourcing LinkedIn</h2>
  <p style="font-size: 13px; color: #666; margin: 0 0 24px 0;">Reçue le {{params.DATE_SOUMISSION}}</p>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">

  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Identité</h3>
  <table cellpadding="6" cellspacing="0" style="width: 100%; font-size: 14px;">
    <tr><td style="width: 30%; color: #666;">Prénom</td><td><strong>{{params.PRENOM}}</strong></td></tr>
    <tr><td style="color: #666;">Nom</td><td><strong>{{params.NOM}}</strong></td></tr>
    <tr><td style="color: #666;">Email</td><td><a href="mailto:{{params.EMAIL}}">{{params.EMAIL}}</a></td></tr>
    <tr><td style="color: #666;">Téléphone</td><td>{{params.TELEPHONE}}</td></tr>
    <tr><td style="color: #666;">Entreprise</td><td><strong>{{params.ENTREPRISE}}</strong></td></tr>
  </table>

  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Le poste à pourvoir</h3>
  <table cellpadding="6" cellspacing="0" style="width: 100%; font-size: 14px;">
    <tr><td style="width: 30%; color: #666;">Poste recherché</td><td><strong>{{params.POSTE_RECHERCHE}}</strong></td></tr>
    <tr><td style="color: #666;">Séniorité visée</td><td>{{params.SENIORITE}}</td></tr>
    <tr><td style="color: #666;">Objectif principal</td><td>{{params.OBJECTIF_POSTE}}</td></tr>
    <tr><td style="color: #666;">Localisation</td><td>{{params.LOCALISATION}}</td></tr>
    <tr><td style="color: #666;">Remote possible</td><td>{{params.REMOTE_POSSIBLE}}</td></tr>
  </table>

  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Contexte</h3>
  <table cellpadding="6" cellspacing="0" style="width: 100%; font-size: 14px;">
    <tr><td style="width: 30%; color: #666;">Secteur entreprise</td><td>{{params.SECTEUR}}</td></tr>
    <tr><td style="color: #666;">Fixe annuel brut</td><td><strong>{{params.PACKAGE_FIXE}}</strong></td></tr>
    <tr><td style="color: #666;">OTE total cible</td><td><strong>{{params.PACKAGE_OTE}}</strong></td></tr>
    <tr><td style="color: #666;">Variable cible</td><td>{{params.PACKAGE_VARIABLE}}</td></tr>
    <tr><td style="color: #666;">Ratio</td><td>{{params.PACKAGE_RATIO}}</td></tr>
    <tr><td style="color: #666;">Site de l'entreprise</td><td>{{params.SITE_ENTREPRISE}}</td></tr>
    <tr><td style="color: #666;">Fiche de poste fournie</td><td>{{params.FICHE_POSTE_FOURNIE}}</td></tr>
  </table>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 32px 0 24px 0;">

  <h3 style="font-size: 15px; font-weight: 600; margin: 0 0 12px 0; color: #1a1a1a;">Action attendue</h3>
  <p style="font-size: 14px; line-height: 1.6;">Le prospect a été informé que sa demande sera traitée manuellement sous 24h ouvrées. Il faut générer un plan de sourcing manuellement (ou via outil interne) puis le lui envoyer en répondant à son email.</p>

  <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px 0; color: #1a1a1a;">Liens utiles</h3>
  <p style="font-size: 14px; margin: 8px 0;"><strong>ID interne (référence) :</strong> {{params.DEFERRED_ID}}</p>
  <p style="font-size: 14px; margin: 8px 0;"><strong>Fiche Jarvi :</strong><br><a href="{{params.URL_JARVI}}" style="color: #1a1a1a;">{{params.URL_JARVI}}</a></p>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 32px 0 16px 0;">

  <p style="font-size: 12px; color: #999; margin: 0;">Notification automatique — Le Lab Mariell</p>

</div>
```

### Variables Brevo

Toutes les variables du Template 1, plus :

| Variable | Source | Format / valeur exemple |
|---|---|---|
| `{{params.RAISON_DIFFERE}}` | Backend Nitro | "Rate limit atteint (IP ou domaine email)" / "API Anthropic indisponible (2 tentatives échouées)" |
| `{{params.DEFERRED_ID}}` | Backend Nitro (nanoid) | "v9a3bx8k2p" |

---

## TEMPLATE 4 — Confirmation prospect (mode différé)

### Métadonnées

| Propriété | Valeur |
|---|---|
| **Nom du template Brevo** | `Lab — Plan de sourcing — Confirmation différée (prospect)` |
| **Sujet** | `Votre demande de plan de sourcing — traitement en cours` |
| **Pré-header** | `Notre équipe analyse votre demande et reviendra vers vous sous 24h ouvrées.` |
| **Email expéditeur** | `bonjour@mariell.fr` (nom : "Mariell") |
| **Destinataire** | `{{params.EMAIL}}` |

### Corps HTML

```html
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">

  <div style="padding: 32px 0 24px 0; border-bottom: 1px solid #e0e0e0;">
    <p style="font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0;">Mariell</p>
  </div>

  <div style="padding: 32px 0;">

    <p style="font-size: 18px; font-weight: 500; margin: 0 0 24px 0;">Bonjour {{params.PRENOM}},</p>

    <p>Votre demande de plan de sourcing LinkedIn pour le poste de <strong>{{params.POSTE_RECHERCHE}}</strong> a bien été reçue.</p>

    <p>Votre demande mérite un regard humain. Notre équipe l'analyse et reviendra vers vous <strong>sous 24h ouvrées</strong> avec un plan calibré sur votre contexte.</p>

    <p style="font-size: 14px; color: #666; margin: 32px 0;">Vous recevrez votre plan directement par email à cette adresse, accompagné d'un lien permanent pour le consulter pendant 90 jours.</p>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">

    <p>Si vous souhaitez aller plus vite ou échanger directement sur votre recrutement en cours, c'est ici.</p>

    <div style="margin: 24px 0 32px 0;">
      <a href="{{params.URL_CALENDLY}}" style="display: inline-block; padding: 12px 28px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-weight: 500; font-size: 14px; border-radius: 4px;">Prendre rendez-vous</a>
    </div>

  </div>

  <div style="padding: 24px 0; border-top: 1px solid #e0e0e0;">
    <p style="margin: 0 0 4px 0; font-weight: 600; color: #1a1a1a;">— Mariell</p>
    <p style="margin: 0; font-size: 13px; color: #666;">Cabinet de recrutement Sales, sur-mesure.</p>
  </div>

  <div style="padding: 16px 0; font-size: 11px; color: #999; text-align: center; line-height: 1.5;">
    <p style="margin: 0 0 8px 0;">Vous recevez cet email car vous avez utilisé l'outil Plan de sourcing du Lab Mariell.</p>
    <p style="margin: 0;">{{ unsubscribe }}</p>
  </div>

</div>
```

### Variables Brevo

| Variable | Source | Format / valeur exemple |
|---|---|---|
| `{{params.PRENOM}}` | Formulaire | "Marie" |
| `{{params.POSTE_RECHERCHE}}` | Formulaire | "Account Executive — Mid-Market" |
| `{{params.URL_CALENDLY}}` | Variable env | URL Calendly |
| `{{ unsubscribe }}` | Brevo natif | Lien désinscription auto-généré |

---

## Variables d'environnement Brevo

```bash
BREVO_API_KEY=xkeysib-...
BREVO_TEMPLATE_ID_NOTIF_INTERNE=1
BREVO_TEMPLATE_ID_LIVRAISON_PROSPECT=2
BREVO_TEMPLATE_ID_DEFERRED_INTERNE=3
BREVO_TEMPLATE_ID_DEFERRED_PROSPECT=4
BREVO_SENDER_EMAIL=bonjour@mariell.fr
BREVO_NOTIF_RECIPIENT=[email-gerant]@mariell.fr
BREVO_ALERT_RECIPIENT=[email-gerant]@mariell.fr
```

---

## Configuration Brevo — Checklist setup

| # | Action | Détail |
|---|---|---|
| 1 | Configurer l'expéditeur `bonjour@mariell.fr` | Brevo → Senders & IP → Add a new sender. Vérification DNS (SPF + DKIM) |
| 2 | Créer le Template 1 (génération réussie — interne) | Templates → Create → coller le HTML |
| 3 | Créer le Template 2 (génération réussie — prospect) | Idem |
| 4 | Créer le Template 3 (mode différé — interne) | Idem |
| 5 | Créer le Template 4 (mode différé — prospect) | Idem |
| 6 | Récupérer les 4 IDs | À passer dans les variables env |
| 7 | Tester avec valeurs en dur | Brevo permet de tester avec params manuels |
| 8 | Configurer la clé API Brevo | Variable d'env Vercel `BREVO_API_KEY` |

---

## Helpers backend (référence)

Voir `spec-technique-route-nitro-outil-2.md` section 9 pour le code complet des fonctions :
- `formatPackage(fixe, ote)` → retourne `{ fixe, ote, variable, ratio }` formatés
- `sendBrevoNotifInterne(input, uuid)` → Template 1
- `sendBrevoLivraisonProspect(input, uuid)` → Template 2
- `sendBrevoDeferredInterne(input, deferredId, raisonDiffere)` → Template 3
- `sendBrevoDeferredProspect(input)` → Template 4

---

## Helper `formatDateFr()`

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

---

## Changelog v2 → v3

| # | Changement | Templates impactés |
|---|---|---|
| 1 | Variable `PRENOM_NOM` (champ unique) → `PRENOM` + `NOM` séparées | Templates 1 et 3 (sujet + corps) |
| 2 | Variable `PACKAGE` (fourchette) → `PACKAGE_FIXE` + `PACKAGE_OTE` + `PACKAGE_VARIABLE` + `PACKAGE_RATIO` | Templates 1 et 3 |
| 3 | Suppression variable `INTERNATIONAL_POSSIBLE` | Templates 1 et 3 |
| 4 | Variable `REMOTE_POSSIBLE` conservée | Templates 1 et 3 |

---

**Fin du document templates Brevo.**
