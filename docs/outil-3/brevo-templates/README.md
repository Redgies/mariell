# Brevo Templates — Outil 3 (Évaluation d'attractivité)

4 templates HTML alignés sur le visuel outils 1 et 2 (logo bandeau dark + barre gradient cyan→magenta + carte blanche centrée).

## Setup côté Brevo

Pour chaque template :

1. **Templates** → **Create a new template**
2. **Choose a design** → **Code your own** → **Paste your code**
3. Renseigner les paramètres ci-dessous
4. Coller le HTML correspondant
5. **Save & Activate**
6. Récupérer l'**ID numérique**

### Paramètres par template

| | Template 1 | Template 2 | Template 3 | Template 4 |
|---|---|---|---|---|
| **Fichier** | `template-1-notif-interne-livree.html` | `template-2-confirmation-prospect.html` | `template-3-notif-interne-differee.html` | `template-4-suivi-prospect.html` |
| **Template name** | `Lab — Évaluation — Notif interne livrée` | `Lab — Évaluation — Confirmation prospect` | `Lab — Évaluation — Demande différée (interne)` | `Lab — Évaluation — Suivi différée (prospect)` |
| **Subject** | `[Lab • Évaluation] {{ params.PRENOM }} {{ params.NOM }} — {{ params.ENTREPRISE }} — {{ params.NIVEAU_ATTRACTIVITE }}` | `Votre évaluation d'attractivité — {{ params.INTITULE_POSTE }}` | `[Lab • DEMANDE DIFFÉRÉE] {{ params.PRENOM }} {{ params.NOM }} — {{ params.ENTREPRISE }}` | `Votre demande d'évaluation — traitement en cours` |
| **Preview text** | `{{ params.NIVEAU_ATTRACTIVITE }} · {{ params.JAUGE_POSITION }}/10 · {{ params.INTITULE_POSTE }}` | `Préparée par Mariell — accessible 90 jours` | `Demande à traiter manuellement sous 24-48h — {{ params.RAISON_DIFFERE }}` | `Notre équipe analyse votre demande et reviendra vers vous sous 24-48h ouvrées.` |
| **From name** | `Le Lab Mariell` | `Mariell` | `Le Lab Mariell` | `Mariell` |
| **From email** | `bonjour@mariell.fr` | `bonjour@mariell.fr` | `bonjour@mariell.fr` | `bonjour@mariell.fr` |
| **Reply-to** | `bonjour@mariell.fr` | `bonjour@mariell.fr` | `bonjour@mariell.fr` | `bonjour@mariell.fr` |

### Variables d'env à remplir

```bash
BREVO_TEMPLATE_ID_EVALUATION_ATTRACTIVITE_NOTIF_INTERNE_LIVREE=<id_template_1>
BREVO_TEMPLATE_ID_EVALUATION_ATTRACTIVITE_CONFIRMATION_PROSPECT=<id_template_2>
BREVO_TEMPLATE_ID_EVALUATION_ATTRACTIVITE_NOTIF_INTERNE_DIFFEREE=<id_template_3>
BREVO_TEMPLATE_ID_EVALUATION_ATTRACTIVITE_SUIVI_PROSPECT=<id_template_4>
```

## Variables Brevo utilisées

### Template 1 — Notif interne livrée (cas nominal)

| Variable | Source | Exemple |
|---|---|---|
| `DATE_SOUMISSION` | backend | `8 mai 2026 à 14h32` |
| `PRENOM` / `NOM` / `EMAIL` / `TELEPHONE` | formulaire | `Marie` / `Dupont` / ... |
| `ENTREPRISE` / `SITE_WEB` | formulaire | `Pennylane` / `https://pennylane.com` |
| `SECTEUR` / `LOCALISATION` / `EFFECTIFS` / `EQUIPE_SALES` | formulaire | `Fintech` / `Paris` / `800` / `15 personnes...` |
| `INTITULE_POSTE` / `SENIORITE` / `TYPE_CYCLE` / `MODALITE_TRAVAIL` | formulaire | `Account Executive — Mid-Market` / `Confirmé 2-5 ans` / `Mixte` / `Hybride équilibré` |
| `PACKAGE_FIXE` / `PACKAGE_OTE` | backend (formaté) | `60 000 €` / `40 000 €` |
| `DESCRIPTION_MISSIONS` | formulaire (extrait 500 char) | `Vous prendrez en charge...` |
| `NIVEAU_ATTRACTIVITE` | LLM | `Très attractive` |
| `JAUGE_POSITION` | LLM | `8` |
| `DIMENSIONS_MARQUE` / `DIMENSIONS_SECTEUR` / `DIMENSIONS_MISSION` / `DIMENSIONS_PACKAGE` | LLM | `Référence` / `Dynamique` / `Premium` / `Aligné` |
| `BRIEF_FLOU` | LLM | `Oui` / `Non` |
| `URL_RESULTAT` | backend | URL persistée 90j |
| `URL_JARVI` | backend | URL Project Jarvi |
| `EVAL_UUID` | backend | nanoid 10 char |

### Template 2 — Confirmation prospect

| Variable | Source | Exemple |
|---|---|---|
| `PRENOM` | formulaire | `Marie` |
| `INTITULE_POSTE` | formulaire | `Account Executive — Mid-Market` |
| `ENTREPRISE` | formulaire | `Pennylane` |
| `NIVEAU_ATTRACTIVITE` | LLM | `Très attractive` |
| `URL_RESULTAT` | backend | URL persistée 90j |
| `URL_CALENDLY` | env `NUXT_PUBLIC_CALENDLY_URL` | URL Calendly |

### Template 3 — Notif interne différée

Toutes les variables du Template 1 (sauf NIVEAU_*, JAUGE_*, DIMENSIONS_*) plus :
- `RAISON_DIFFERE` (string libellé)
- `DEFERRED_ID` (nanoid 10 caractères)
- `URL_JARVI` (uniquement)

### Template 4 — Suivi prospect (différé)

| Variable | Source | Exemple |
|---|---|---|
| `PRENOM` | formulaire | `Marie` |
| `ENTREPRISE` | formulaire | `Pennylane` |
| `URL_CALENDLY` | env | URL Calendly |

## JSON de test

### Template 1
```json
{
  "DATE_SOUMISSION": "8 mai 2026 à 14h32",
  "PRENOM": "Marie",
  "NOM": "Dupont",
  "EMAIL": "marie.dupont@pennylane.com",
  "TELEPHONE": "+33 6 12 34 56 78",
  "ENTREPRISE": "Pennylane",
  "SITE_WEB": "https://pennylane.com",
  "SECTEUR": "Fintech",
  "LOCALISATION": "Paris, France",
  "EFFECTIFS": "800",
  "EQUIPE_SALES": "15 personnes (4 SDR, 8 AE, 2 Team Lead, 1 Head of Sales)",
  "INTITULE_POSTE": "Account Executive — Mid-Market",
  "SENIORITE": "Confirmé 2-5 ans",
  "TYPE_CYCLE": "Mixte",
  "MODALITE_TRAVAIL": "Hybride équilibré (3 jours bureau / sem)",
  "PACKAGE_FIXE": "60 000 €",
  "PACKAGE_OTE": "40 000 €",
  "DESCRIPTION_MISSIONS": "Vous prendrez en charge un portefeuille de cabinets comptables Mid-Market...",
  "NIVEAU_ATTRACTIVITE": "Très attractive",
  "JAUGE_POSITION": "8",
  "DIMENSIONS_MARQUE": "Référence",
  "DIMENSIONS_SECTEUR": "Dynamique",
  "DIMENSIONS_MISSION": "Premium",
  "DIMENSIONS_PACKAGE": "Aligné",
  "BRIEF_FLOU": "Non",
  "URL_RESULTAT": "https://mariell.fr/lab/evaluation-attractivite/resultat/abc123def4",
  "URL_JARVI": "https://app.jarvi.tech/projects/xyz-789",
  "EVAL_UUID": "abc123def4"
}
```

### Template 2
```json
{
  "PRENOM": "Marie",
  "INTITULE_POSTE": "Account Executive — Mid-Market",
  "ENTREPRISE": "Pennylane",
  "NIVEAU_ATTRACTIVITE": "Très attractive",
  "URL_RESULTAT": "https://mariell.fr/lab/evaluation-attractivite/resultat/abc123def4",
  "URL_CALENDLY": "https://calendly.com/chez-mariell/30min"
}
```

### Template 3
Identique au Template 1, plus :
```json
"RAISON_DIFFERE": "Rate limit atteint (3/jour ou 7/semaine par IP)",
"DEFERRED_ID": "v9a3bx8k2p"
```
(et sans les champs LLM `NIVEAU_*`, `JAUGE_*`, `DIMENSIONS_*`, `BRIEF_FLOU`)

### Template 4
```json
{
  "PRENOM": "Marie",
  "ENTREPRISE": "Pennylane",
  "URL_CALENDLY": "https://calendly.com/chez-mariell/30min"
}
```

## Notes visuelles

Mêmes conventions que les outils 1 et 2 :
- **Logo bandeau dark** (`#1a1a1a`, padding 32px 24px) en tête
- **Barre gradient** cyan→magenta (4px) sous le logo
- **Carte blanche** centrée sur fond gris clair (`#f5f5f7`)
- **Italique gradient** sur le mot accent dans les H1
- **Pill verdict colorée** (template 1) selon `niveau_index` 1→5 (red/orange/blue/green/dark-green)

⚠️ **URL logo** : pointe sur `mariell-dusky.vercel.app`. À swap en `https://mariell.fr/logo_site.png` quand tu publies sur le domaine final.
