# Brevo Templates — Outil 2 (Plan de sourcing LinkedIn)

4 templates HTML à créer dans Brevo. Mêmes conventions que l'outil 1 (logo header dark + barre gradient cyan→magenta + carte blanche centrée).

## Setup côté Brevo

Pour chaque template :

1. **Templates** → **Create a new template**
2. **Choose a design** → **Code your own** → **Paste your code**
3. Renseigner les paramètres ci-dessous selon le tableau
4. Coller le HTML correspondant
5. **Save & Activate**
6. Récupérer l'**ID numérique**

### Paramètres par template

| | Template 1 | Template 2 | Template 3 | Template 4 |
|---|---|---|---|---|
| **Fichier** | `template-1-notif-interne.html` | `template-2-livraison-prospect.html` | `template-3-deferred-interne.html` | `template-4-deferred-prospect.html` |
| **Template name** | `Lab — Plan de sourcing — Notification interne` | `Lab — Plan de sourcing — Livraison prospect` | `Lab — Plan de sourcing — Demande différée (interne)` | `Lab — Plan de sourcing — Confirmation différée (prospect)` |
| **Subject** | `[Lab • Plan de sourcing] {{ params.PRENOM }} {{ params.NOM }} — {{ params.ENTREPRISE }} — {{ params.POSTE_RECHERCHE }}` | `Votre plan de sourcing LinkedIn — {{ params.POSTE_RECHERCHE }}` | `[Lab • DEMANDE DIFFÉRÉE] {{ params.PRENOM }} {{ params.NOM }} — {{ params.ENTREPRISE }}` | `Votre demande de plan de sourcing — traitement en cours` |
| **Preview text** | `Soumission Plan de sourcing — récap des inputs` | `Préparé par Mariell pour {{ params.ENTREPRISE }} — accessible 90 jours.` | `Demande à traiter manuellement sous 24h — {{ params.RAISON_DIFFERE }}` | `Notre équipe analyse votre demande et reviendra vers vous sous 24h ouvrées.` |
| **From name** | `Le Lab Mariell` | `Mariell` | `Le Lab Mariell` | `Mariell` |
| **From email** | `bonjour@mariell.fr` | `bonjour@mariell.fr` | `bonjour@mariell.fr` | `bonjour@mariell.fr` |
| **Reply-to** | `bonjour@mariell.fr` | `bonjour@mariell.fr` | `bonjour@mariell.fr` | `bonjour@mariell.fr` |

### Variables d'env à remplir

```bash
BREVO_TEMPLATE_ID_PLAN_SOURCING_NOTIF_INTERNE=<id_template_1>
BREVO_TEMPLATE_ID_PLAN_SOURCING_LIVRAISON_PROSPECT=<id_template_2>
BREVO_TEMPLATE_ID_PLAN_SOURCING_DEFERRED_INTERNE=<id_template_3>
BREVO_TEMPLATE_ID_PLAN_SOURCING_DEFERRED_PROSPECT=<id_template_4>
```

## Variables Brevo utilisées

### Template 1 — Notif interne (cas nominal)
| Variable | Source | Exemple |
|---|---|---|
| `DATE_SOUMISSION` | backend | `7 mai 2026 à 14h32` |
| `PRENOM` / `NOM` | formulaire | `Marie` / `Dupont` |
| `EMAIL` / `TELEPHONE` | formulaire | `marie@salesfit.com` / `+33 6 12 34 56 78` |
| `ENTREPRISE` | formulaire | `Salesfit` |
| `POSTE_RECHERCHE` | formulaire | `Account Executive — Mid-Market` |
| `SENIORITE` | formulaire | `Confirmé` |
| `OBJECTIF_POSTE` | formulaire | `Développement et chasse` |
| `LOCALISATION` | formulaire | `Paris, France` |
| `REMOTE_POSSIBLE` | formulaire | `Oui` / `Non` |
| `SECTEUR` | formulaire | `SaaS B2B` |
| `PACKAGE_FIXE` / `PACKAGE_OTE` / `PACKAGE_VARIABLE` / `PACKAGE_RATIO` | backend (formaté) | `55 000 €` / `100 000 €` / `45 000 €` / `55% fixe / 45% variable` |
| `SITE_ENTREPRISE` / `FICHE_POSTE_FOURNIE` | formulaire | `https://salesfit.com` / `Oui — extrait : "..."` |
| `URL_PLAN` | backend | `https://mariell.fr/lab/plan-de-sourcing/resultat/<uuid>` |
| `URL_JARVI` | backend | `https://app.jarvi.tech/projects/<id>` |
| `PLAN_UUID` | backend | `v9a3bx8k2p` |

### Template 2 — Livraison prospect
| Variable | Source | Exemple |
|---|---|---|
| `PRENOM` | formulaire | `Marie` |
| `POSTE_RECHERCHE` | formulaire | `Account Executive — Mid-Market` |
| `ENTREPRISE` | formulaire | `Salesfit` |
| `URL_PLAN` | backend | URL persistée 90j |
| `URL_CALENDLY` | env `NUXT_PUBLIC_CALENDLY_URL` | URL Calendly |

### Template 3 — Différé interne
Identique au Template 1, plus :
- `RAISON_DIFFERE` (string libellé)
- `DEFERRED_ID` (nanoid 10 caractères)

### Template 4 — Différé prospect
Identique au Template 2 mais sans `URL_PLAN` (pas de plan généré). Variables : `PRENOM`, `POSTE_RECHERCHE`, `URL_CALENDLY`.

## JSON de test

À coller dans **"Test sending"** côté Brevo pour valider le rendu avant connexion au code.

### Template 1 (notif interne)
```json
{
  "DATE_SOUMISSION": "7 mai 2026 à 14h32",
  "PRENOM": "Marie",
  "NOM": "Dupont",
  "EMAIL": "marie.dupont@salesfit.com",
  "TELEPHONE": "+33 6 12 34 56 78",
  "ENTREPRISE": "Salesfit",
  "POSTE_RECHERCHE": "Account Executive — Mid-Market",
  "SENIORITE": "Confirmé",
  "OBJECTIF_POSTE": "Développement et chasse",
  "LOCALISATION": "Paris, France",
  "REMOTE_POSSIBLE": "Oui",
  "SECTEUR": "SaaS B2B",
  "PACKAGE_FIXE": "55 000 €",
  "PACKAGE_OTE": "100 000 €",
  "PACKAGE_VARIABLE": "45 000 €",
  "PACKAGE_RATIO": "55% fixe / 45% variable",
  "SITE_ENTREPRISE": "https://salesfit.com",
  "FICHE_POSTE_FOURNIE": "Oui — extrait : \"Équipe Sales B2B SaaS, ...\"",
  "URL_PLAN": "https://mariell.fr/lab/plan-de-sourcing/resultat/abc123def4",
  "URL_JARVI": "https://app.jarvi.tech/projects/xyz-789",
  "PLAN_UUID": "abc123def4"
}
```

### Template 2 (livraison prospect)
```json
{
  "PRENOM": "Marie",
  "POSTE_RECHERCHE": "Account Executive — Mid-Market",
  "ENTREPRISE": "Salesfit",
  "URL_PLAN": "https://mariell.fr/lab/plan-de-sourcing/resultat/abc123def4",
  "URL_CALENDLY": "https://calendly.com/mariell/decouverte"
}
```

### Template 3 (différé interne)
Identique au JSON Template 1, plus :
```json
"RAISON_DIFFERE": "Rate limit atteint (IP ou domaine email)",
"DEFERRED_ID": "v9a3bx8k2p"
```

### Template 4 (différé prospect)
```json
{
  "PRENOM": "Marie",
  "POSTE_RECHERCHE": "Account Executive — Mid-Market",
  "URL_CALENDLY": "https://calendly.com/mariell/decouverte"
}
```

## Notes visuelles

- **Logo bandeau dark** (`#1a1a1a`, hauteur logo 40px) en tête de chaque template — cohérent outil 1.
- **Barre gradient** cyan→magenta de 4px sous le bandeau logo — signature Mariell.
- **Carte blanche** centrée sur fond gris clair (`#f5f5f7`) — meilleure lisibilité boîte mail.
- **Italique gradient** sur le mot accent dans les H1 (`<em>reçue.</em>`, `<em>est prêt.</em>`, etc.).
- **URL logo** : pointe sur `mariell-dusky.vercel.app` actuellement. À swap en production sur `mariell.fr` (recherche/remplace dans les 4 fichiers ou dans Brevo).
