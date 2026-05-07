# Brevo Templates — Outil 1 (Stage / Alternance)

Deux templates HTML à créer dans Brevo. Une fois créés, récupère les **IDs numériques** et reporte-les dans `.env` / Vercel.

## Setup côté Brevo

### 1. Vérifier l'expéditeur

- Settings → **Senders, domains & dedicated IPs**
- Ajouter (ou vérifier) `bonjour@mariell.fr`
- Ajouter les enregistrements **SPF + DKIM** sur la zone DNS de `mariell.fr` chez ton registrar (Cloudflare / OVH / Gandi / etc.)
- Attendre la validation Brevo (souvent < 30 min)

### 2. Créer les 2 templates

Pour chacun :

1. **Templates** → **Create a new template**
2. **Choose a design** → **Code your own** → **Paste your code**
3. Renseigner les **paramètres du template** (champs en haut de l'éditeur) — voir tableau ci-dessous
4. Coller le HTML correspondant
5. **Save & Activate**
6. Récupérer l'**ID numérique** (visible dans la liste des templates ou dans l'URL `/templates/preview/<ID>`)

### Paramètres à renseigner par template

| Paramètre | Template 1 (notif interne) | Template 2 (confirmation prospect) |
|---|---|---|
| **Template name** | `Lab — Stage Alternance — Notification interne` | `Lab — Stage Alternance — Confirmation prospect` |
| **Subject** | `[Lab Mariell] Demande {{ params.TYPE_CONTRAT }} — {{ params.ENTREPRISE }}` | `Votre demande {{ params.TYPE_CONTRAT_LOWER }} — Mariell` |
| **Preview text** | `{{ params.COMPANY_STATUS_LABEL }} · {{ params.PRENOM_NOM }} · {{ params.PROFIL_RECHERCHE }}` | `Nous revenons vers vous sous 7 à 10 jours ouvrés.` |
| **From name** | `Le Lab Mariell` | `Mariell` |
| **From email** | `bonjour@mariell.fr` | `bonjour@mariell.fr` |
| **Reply-to** | `bonjour@mariell.fr` | `bonjour@mariell.fr` |

### 3. Variables IDs à reporter

Une fois les 2 templates sauvegardés et activés :

```bash
# Dans .env (local) et Vercel Project Settings (prod)
BREVO_TEMPLATE_ID_STAGE_NOTIF_INTERNE=<id_template_1>
BREVO_TEMPLATE_ID_STAGE_CONFIRMATION_PROSPECT=<id_template_2>
```

## Variables Brevo utilisées

### Template 1 — Notification interne

Variables que la route Nitro pousse dans `params` :

| Variable | Type | Exemple |
|---|---|---|
| `DATE_SOUMISSION` | string | `7 mai 2026 à 14h32` |
| `COMPANY_STATUS_LABEL` | enum string | `Nouveau prospect` / `Contact connu` / `Client / ancien client` |
| `PRENOM_NOM` | string | `Marie Dupont` |
| `EMAIL` | string | `marie.dupont@salesfit.com` |
| `TELEPHONE` | string | `+33 6 12 34 56 78` |
| `ENTREPRISE` | string | `Salesfit` |
| `URL_ENTREPRISE` | string (URL) | `https://salesfit.com` |
| `TYPE_CONTRAT` | enum | `Stage` / `Alternance` |
| `PROFIL_RECHERCHE` | string | `SDR / BDR` ou la précision libre si "Autre" |
| `DATE_DEMARRAGE` | enum | `ASAP` / `Sous 1 à 2 mois` / etc. |
| `LOCALISATION` | string | `Paris — remote partiel possible` |
| `BRIEF_MISSION` | string (long, multilignes) | brief libre du prospect, max 500 char |
| `URL_JARVI_PROJECT` | string (URL) | `https://app.jarvi.tech/#/projects/<uuid>` |
| `URL_JARVI_COMPANY` | string (URL) | `https://app.jarvi.tech/#/companies/<uuid>` |

⚠️ La pill "Status Company" change de couleur selon `COMPANY_STATUS_LABEL` :
- `Client / ancien client` → magenta
- `Contact connu` → neutre
- `Nouveau prospect` → cyan

Ces 3 valeurs sont les seules attendues — tout autre string fera fallback sur la pill cyan.

### Template 2 — Confirmation prospect

| Variable | Type | Exemple |
|---|---|---|
| `PRENOM` | string | `Marie` |
| `TYPE_CONTRAT_LOWER` | string | `stage` ou `alternance` (lowercase) |
| `ENTREPRISE` | string | `Salesfit` |
| `URL_LAB` | string (URL) | `https://mariell.fr/lab` |

## Test

Brevo a un onglet **"Test sending"** sur chaque template — tu peux y prévisualiser avec des valeurs de test pour valider le rendu avant de connecter le code.

Suggestions de valeurs de test pour le **Template 1** :

```json
{
  "DATE_SOUMISSION": "7 mai 2026 à 14h32",
  "COMPANY_STATUS_LABEL": "Nouveau prospect",
  "PRENOM_NOM": "Marie Dupont",
  "EMAIL": "marie.dupont@salesfit.com",
  "TELEPHONE": "+33 6 12 34 56 78",
  "ENTREPRISE": "Salesfit",
  "URL_ENTREPRISE": "https://salesfit.com",
  "TYPE_CONTRAT": "Alternance",
  "PROFIL_RECHERCHE": "SDR / BDR",
  "DATE_DEMARRAGE": "Sous 1 à 2 mois",
  "LOCALISATION": "Paris — remote partiel possible",
  "BRIEF_MISSION": "Équipe Sales de 8 (3 SDR, 4 AE, 1 Head of Sales). On scale notre outbound B2B SaaS. On cherche un alternant SDR pour épauler le top of funnel : prospection LinkedIn + cold call + qualification. Profil curieux, orienté résultats, à l'aise avec les outils modernes.",
  "URL_JARVI_PROJECT": "https://app.jarvi.tech/#/projects/abc-123",
  "URL_JARVI_COMPANY": "https://app.jarvi.tech/#/companies/xyz-789"
}
```

Suggestions pour le **Template 2** :

```json
{
  "PRENOM": "Marie",
  "TYPE_CONTRAT_LOWER": "alternance",
  "ENTREPRISE": "Salesfit",
  "URL_LAB": "https://mariell.fr/lab"
}
```

## Ajustements visuels

Les 2 templates utilisent un fond clair (`#f5f5f7`) avec une carte blanche centrée — choix délibéré pour la lisibilité en boîte mail (vs. l'identité dark du site). L'identité Mariell est portée par :

- la **barre gradient cyan→magenta** en tête de carte
- l'**italique gradient** sur le mot accent (« _reçue._ »)
- la **typo Inter** en weight 800 sur les titres
- l'**eyebrow cyan** mono uppercase
- la signature finale italique

Tu peux ajuster directement dans l'éditeur Brevo si tu veux du fine-tuning sans toucher au code (Brevo supporte le HTML inline).
