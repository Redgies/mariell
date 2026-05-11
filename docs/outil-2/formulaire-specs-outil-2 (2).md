# Spécifications du formulaire — Plan de sourcing LinkedIn (Mariell — Outil 2)

**Version** : 4 (alignement conventions outil n°3 — Prénom/Nom séparés, Package Fixe/OTE, séniorité avec années, suppression International)
**Audience** : ce document est destiné au dev qui implémentera le formulaire en Vue 3.
**Stack cible** : Nuxt 3, validation côté client + serveur (Zod).

---

## Vue d'ensemble

Le formulaire comporte **15 champs** :
- **13 obligatoires** (dont 1 case RGPD obligatoire)
- **2 optionnels**

Friction estimée : 3-4 minutes de remplissage.

Structure visuelle en **5 blocs logiques** (cf. brief Claude Design) :
- Bloc 01 — Identité (5 champs obligatoires)
- Bloc 02 — Le poste à pourvoir (4 champs obligatoires)
- Bloc 03 — Le contexte (3 champs obligatoires)
- Bloc 04 — Pour aller plus loin (2 champs optionnels)
- Bloc RGPD — sans numéro (1 case obligatoire)

Submission protégée par **Cloudflare Turnstile** (CAPTCHA invisible).

**Convention visuelle** : étoile magenta `*` à côté du label de chaque champ obligatoire (style `.req` outil n°3). Aucune mention "Optionnel" sur les champs non-obligatoires (l'absence d'étoile suffit).

---

## Bloc 01 — Identité

### Champ 1 — Prénom

| Propriété | Valeur |
|---|---|
| **Label** | Prénom |
| **Type** | Texte court (single-line input) |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `Marie` |
| **Validation client** | Min 2 caractères, max 40, regex `^.*[a-zA-Zà-ÿÀ-Ÿ].*$` (au moins une lettre) |
| **Validation serveur (Zod)** | `z.string().min(2).max(40)` |
| **Helper text** | (aucun) |
| **Autocomplete** | `given-name` |

### Champ 2 — Nom

| Propriété | Valeur |
|---|---|
| **Label** | Nom |
| **Type** | Texte court (single-line input) |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `Dupont` |
| **Validation client** | Min 2 caractères, max 40, regex `^.*[a-zA-Zà-ÿÀ-Ÿ].*$` (au moins une lettre) |
| **Validation serveur (Zod)** | `z.string().min(2).max(40)` |
| **Helper text** | (aucun) |
| **Autocomplete** | `family-name` |
| **Layout** | Champs Prénom + Nom côte à côte en grid 2 colonnes (desktop) |

### Champ 3 — Adresse mail

| Propriété | Valeur |
|---|---|
| **Label** | Adresse mail |
| **Type** | Email |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `marie.dupont@entreprise.com` |
| **Validation client** | Format email standard (regex RFC) |
| **Validation serveur (Zod)** | `z.string().email()` |
| **Helper text** | (aucun) |
| **Note importante** | Les emails libres (Gmail, Yahoo, Hotmail, Outlook, Proton...) sont **acceptés**. Pas de blocage |

### Champ 4 — Numéro de téléphone

| Propriété | Valeur |
|---|---|
| **Label** | Numéro de téléphone |
| **Type** | Tel (international) |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `06 12 34 56 78` |
| **UI** | Sélecteur d'indicatif pays (par défaut +33). Indicatifs disponibles : FR +33, BE +32, CH +41, UK +44, DE +49, ES +34, IT +39, NL +31, LU +352, PT +351, IE +353 |
| **Validation client** | Format international, min 8 chiffres |
| **Validation serveur (Zod)** | `z.string().min(8).max(20)` |
| **Helper text** | (aucun) |

### Champ 5 — Entreprise

| Propriété | Valeur |
|---|---|
| **Label** | Entreprise |
| **Type** | Texte court |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `Nom de votre entreprise` |
| **Validation client** | Min 2 caractères, max 100 |
| **Validation serveur (Zod)** | `z.string().min(2).max(100)` |
| **Helper text** | (aucun) |
| **Note backend** | Vérification doublon Jarvi non bloquante : si l'entreprise a soumis dans les 30 derniers jours, ajouter un flag dans le tag Jarvi (sans bloquer la soumission) |

---

## Bloc 02 — Le poste à pourvoir

### Champ 6 — Poste recherché

| Propriété | Valeur |
|---|---|
| **Label** | Poste recherché |
| **Type** | Combobox avec recherche (searchable dropdown, classes `.combo` outil n°3) |
| **Obligatoire** | ✅ Oui |
| **Options (17)** | Liste ordonnée par séniorité/famille croissante. Voir détail ci-dessous. |
| **Comportement "Autre"** | Sélectionner "Autre" fait apparaître un champ texte de précision (max 60 caractères, obligatoire si "Autre" sélectionné) |
| **Validation serveur (Zod)** | `z.enum([...])` + champ optionnel `posteRecherchePrecisionAutre: z.string().max(60).optional()` |
| **Helper text** | (aucun) |

**Liste exacte des 17 options dans l'ordre d'affichage :**

```
1.  SDR / BDR
2.  Inside Sales
3.  Field Sales / Outside Sales
4.  Business Developer Full Cycle
5.  Account Executive — PME / SMB
6.  Account Executive — Mid-Market
7.  Account Executive — Enterprise
8.  Sales Engineer / Pre-Sales
9.  Account Manager
10. Strategic Account Manager / Key Account Manager
11. Customer Success Manager
12. Sales Ops / RevOps
13. Channel / Partner Manager
14. Sales Manager / Team Lead
15. Head of Sales
16. VP Sales / CRO
17. Autre
```

### Champ 7 — Séniorité visée

| Propriété | Valeur |
|---|---|
| **Label** | Séniorité visée |
| **Type** | Radio cards (classes `.radio-group`, `.radio` outil n°3) |
| **Obligatoire** | ✅ Oui |
| **Options (4)** | 4 options avec libellé principal + sous-libellé années |
| **Validation serveur (Zod)** | `z.enum(['Junior', 'Confirmé', 'Senior', 'Lead-Manager'])` |

**Détail des 4 options :**

| Libellé principal (`.radio__main`) | Sous-libellé années (`.radio__sub`) | Valeur Zod |
|---|---|---|
| Junior | 0–2 ans | `Junior` |
| Confirmé | 2–5 ans | `Confirmé` |
| Senior | 5–8 ans | `Senior` |
| Lead-Manager | 8+ ans | `Lead-Manager` |

**Layout** : grid 2 colonnes mobile, 4 colonnes desktop (à partir de 720px).

### Champ 8 — Objectifs du poste

| Propriété | Valeur |
|---|---|
| **Label** | Objectifs du poste |
| **Type** | Radio cards (mêmes classes que champ 7) |
| **Obligatoire** | ✅ Oui |
| **Options (4)** | `Gestion portefeuille clients` ; `Développement et chasse` ; `Ouverture de nouvelle verticale` ; `Création et management d'équipe` |
| **Validation serveur (Zod)** | `z.enum([...])` |
| **Helper text** | (aucun) |
| **Note** | Le choix unique est volontaire : il force le prospect à hiérarchiser et permet au LLM d'adapter sa stratégie de sourcing |

### Champ 9 — Localisation principale

| Propriété | Valeur |
|---|---|
| **Label** | Localisation principale |
| **Type** | Champ texte + 1 checkbox |
| **Obligatoire** | ✅ Oui (le champ texte) |
| **Placeholder champ texte** | `Paris, France` |
| **Checkbox unique** | `Remote possible` (non obligatoire) |
| **Validation client champ texte** | Min 2 caractères, max 100 |
| **Validation serveur (Zod)** | `localisation: z.string().min(2).max(100)`, `remotePossible: z.boolean()` |
| **Helper text** | (aucun) |
| **Note importante** | La case "International possible" présente dans la v3 a été **retirée** (cette information n'apportait rien au sourcing). Seule la case "Remote possible" est conservée car elle change réellement la stratégie de sourcing (vivier élargi à toute la France/Europe vs zone géographique précise). |

---

## Bloc 03 — Le contexte

### Champ 10 — Secteur de votre entreprise

| Propriété | Valeur |
|---|---|
| **Label** | Secteur de votre entreprise |
| **Type** | Select |
| **Obligatoire** | ✅ Oui |
| **Options (8)** | `SaaS B2B` ; `Conseil IT / ESN` ; `Industrie / B2B classique` ; `Cyber / Sécurité` ; `Fintech` ; `Healthtech` ; `Services` ; `Autre` |
| **Comportement "Autre"** | Sélectionner "Autre" fait apparaître un champ texte de précision (max 60 caractères, obligatoire si "Autre" sélectionné) |
| **Validation serveur (Zod)** | `z.enum([...])` + champ optionnel `secteurPrecisionAutre: z.string().max(60).optional()` |
| **Helper text** | (aucun) |

### Champ 11 — Fixe annuel brut (€)

| Propriété | Valeur |
|---|---|
| **Label** | Fixe annuel brut (€) |
| **Type** | Texte numérique avec suffixe € (classes `.num-wrap` + `.num-wrap__suffix` outil n°3) |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `55000` |
| **Suffixe visuel** | `€` (à droite du champ, non éditable) |
| **Validation client** | Min 15000, Max 500000 (`data-num-min="15000"` `data-num-max="500000"`) |
| **Validation serveur (Zod)** | `z.number().int().min(15000).max(500000)` |
| **Helper text** | (aucun — helper text partagé avec champ OTE en bas du grid) |

### Champ 12 — OTE total cible (€)

| Propriété | Valeur |
|---|---|
| **Label** | OTE total cible (€) |
| **Type** | Texte numérique avec suffixe € |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `100000` |
| **Suffixe visuel** | `€` |
| **Validation client** | Min 0, Max 800000 (`data-num-min="0"` `data-num-max="800000"`) |
| **Validation serveur (Zod)** | `z.number().int().min(0).max(800000)` |
| **Helper text partagé** | `OTE = Fixe + Variable cible à 100% d'atteinte des objectifs.` (en pleine largeur sous les 2 champs Fixe + OTE) |
| **Layout** | Champs Fixe + OTE en grid 2 colonnes desktop |
| **Note importante** | Remplace l'ancien select fourchettes (5 options) de la v3. Le format Fixe + OTE séparés permet au LLM de calibrer plus finement les viviers (ratio fixe/variable + précision exacte du package). |

**Validation cohérence Fixe vs OTE (côté serveur)** :
```typescript
// L'OTE doit être >= au Fixe (sinon incohérence)
.refine(data => data.ote >= data.fixe, {
  message: "L'OTE doit être supérieur ou égal au fixe.",
  path: ['ote']
})
```

---

## Bloc 04 — Pour aller plus loin

**Note** : ce bloc s'appelait *"Optionnel — pour aller plus loin"* en v3. Renommé en *"Pour aller plus loin"* pour cohérence avec la convention outil n°3 (pas de mention "Optionnel" — l'absence d'étoile sur les champs suffit à signaler le caractère optionnel).

Le helper text *"Plus le contexte est riche, plus le plan sera précis."* reste affiché sous le bloc.

### Champ 13 — Site de l'entreprise

| Propriété | Valeur |
|---|---|
| **Label** | Site de l'entreprise |
| **Type** | URL |
| **Obligatoire** | ❌ Non |
| **Placeholder** | `https://votre-entreprise.com` |
| **Validation client** | Si rempli, doit être une URL valide (regex http/https) |
| **Validation serveur (Zod)** | `z.string().url().optional()` |
| **Helper text** | (aucun — la mention "Optionnel" en helper text de la v3 est retirée) |
| **Note UX** | Si possible, pré-remplissage automatique du placeholder à partir du domaine de l'email (champ 3) |

### Champ 14 — Contenu fiche de poste

| Propriété | Valeur |
|---|---|
| **Label** | Contenu de la fiche de poste |
| **Type** | Textarea (multi-lignes) |
| **Obligatoire** | ❌ Non |
| **Placeholder** | `Collez ici le contenu de votre fiche de poste, si vous l'avez` |
| **Limite caractères** | 5000 max |
| **Validation serveur (Zod)** | `z.string().max(5000).optional()` |
| **Helper text** | `Plus le contenu est riche, plus le plan sera précis. Maximum 5000 caractères.` |
| **Compteur visuel** | Compteur de caractères affiché en bas à droite (classe `.counter` outil n°3) |
| **V1 vs V2** | En V1, c'est un textarea pour collage manuel. En V2, on prévoit l'ajout d'un upload PDF avec extraction texte côté serveur |

---

## Bloc RGPD (sans numéro)

### Champ 15 — Acceptation politique de confidentialité

| Propriété | Valeur |
|---|---|
| **Label** | (pas de label séparé — la phrase de la case fait office de label) |
| **Type** | Checkbox unique (classes `.rgpd`, `.rgpd__row`, `.rgpd__check`, `.rgpd__box`, `.rgpd__text` outil n°3) |
| **Obligatoire** | ✅ Oui |
| **Wording exact de la case** | `J'accepte la politique de confidentialité et le traitement de mes données personnelles par Mariell.` |
| **État par défaut** | **Non cochée** (RGPD : consentement actif obligatoire — interdiction de pré-cocher) |
| **Lien intégré** | Le mot "politique de confidentialité" doit être un lien cliquable vers `/politique-de-confidentialite` (ouvre dans un nouvel onglet) |
| **Validation client** | Doit être cochée pour que le bouton CTA principal soit activé |
| **Validation serveur (Zod)** | `z.literal(true)` (force la valeur `true`, refuse `false` et `undefined`) |
| **Helper text** | (aucun) |
| **Note importante** | Standard Mariell : ce wording est utilisé identique sur les 3 outils du Lab. |

---

## Cloudflare Turnstile — Anti-bot

| Propriété | Valeur |
|---|---|
| **Type** | CAPTCHA invisible |
| **Position UI** | Slot réservé dans le `.form-foot` (footer du formulaire) |
| **Mention discrète** | `Protégé par Cloudflare Turnstile` (avec icône bouclier SVG) |
| **Site key** | Variable d'env `NUXT_PUBLIC_TURNSTILE_SITE_KEY` (côté client) |
| **Secret key** | Variable d'env `TURNSTILE_SECRET_KEY` (côté serveur) |
| **Validation serveur** | Call à `https://challenges.cloudflare.com/turnstile/v0/siteverify` avant tout traitement |

---

## Soumission — bouton CTA principal

| Propriété | Valeur |
|---|---|
| **Label par défaut** | `Générer mon plan de sourcing` |
| **Label loader** | `Génération en cours…` |
| **Format visuel** | Bouton pill gradient cyan→magenta (classe `.cta-submit` outil n°3) avec flèche SVG à droite |
| **Comportement** | Désactivé tant que tous les champs obligatoires ne sont pas valides |
| **Comportement RGPD** | Désactivé spécifiquement tant que la case RGPD n'est pas cochée |
| **État loading** | Pendant la soumission : spinner SVG + texte "Génération en cours…", bouton désactivé |
| **Hint dynamique sous le bouton** | `Renseignez tous les champs obligatoires pour activer la génération.` (visible quand bouton désactivé, masqué via `.submit.is-ready` quand actif) |
| **Loading note sous le bouton** | `Notre IA construit votre stratégie de sourcing sur les 8 livrables clés. Cela peut prendre jusqu'à 60 secondes — merci de ne pas fermer cette page.` (visible uniquement pendant submission via `.submit.is-loading`. Le segment "8 livrables clés" en italique gradient via `<em>`) |

---

## Form footer (signature visuelle)

3 éléments empilés et centrés (classe `.form-foot` outil n°3) :

1. **Slot Turnstile invisible** : `<div id="cf-turnstile" data-sitekey="" data-size="invisible"></div>` (caché en CSS)
2. **Caption "Protégé par Cloudflare Turnstile"** avec icône bouclier SVG
3. **Signature italique** : *Recruter n'est pas un pari.*

---

## Schéma Zod consolidé — Backend

```typescript
import { z } from 'zod';

export const planDeSourcingSchema = z.object({
  // Bloc 01 — Identité
  prenom: z.string().min(2).max(40),
  nom: z.string().min(2).max(40),
  email: z.string().email(),
  telephone: z.string().min(8).max(20),
  entreprise: z.string().min(2).max(100),

  // Bloc 02 — Le poste (17 options dans l'ordre d'affichage)
  posteRecherche: z.enum([
    'SDR / BDR',
    'Inside Sales',
    'Field Sales / Outside Sales',
    'Business Developer Full Cycle',
    'Account Executive — PME / SMB',
    'Account Executive — Mid-Market',
    'Account Executive — Enterprise',
    'Sales Engineer / Pre-Sales',
    'Account Manager',
    'Strategic Account Manager / Key Account Manager',
    'Customer Success Manager',
    'Sales Ops / RevOps',
    'Channel / Partner Manager',
    'Sales Manager / Team Lead',
    'Head of Sales',
    'VP Sales / CRO',
    'Autre'
  ]),
  posteRecherchePrecisionAutre: z.string().max(60).optional(),
  seniorite: z.enum(['Junior', 'Confirmé', 'Senior', 'Lead-Manager']),
  objectifPoste: z.enum([
    'Gestion portefeuille clients',
    'Développement et chasse',
    'Ouverture de nouvelle verticale',
    'Création et management d\'équipe'
  ]),
  localisation: z.string().min(2).max(100),
  remotePossible: z.boolean(),

  // Bloc 03 — Le contexte
  secteur: z.enum([
    'SaaS B2B',
    'Conseil IT / ESN',
    'Industrie / B2B classique',
    'Cyber / Sécurité',
    'Fintech',
    'Healthtech',
    'Services',
    'Autre'
  ]),
  secteurPrecisionAutre: z.string().max(60).optional(),
  fixe: z.number().int().min(15000).max(500000),
  ote: z.number().int().min(0).max(800000),

  // Bloc 04 — Pour aller plus loin
  siteEntreprise: z.string().url().optional(),
  contenuFichePoste: z.string().max(5000).optional(),

  // Bloc RGPD
  consentementRgpd: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter la politique de confidentialité.' })
  }),

  // Cloudflare Turnstile
  turnstileToken: z.string().min(1)
}).refine(
  data => data.ote >= data.fixe,
  {
    message: "L'OTE doit être supérieur ou égal au fixe.",
    path: ['ote']
  }
);

export type PlanDeSourcingInput = z.infer<typeof planDeSourcingSchema>;
```

---

## Comportements UX globaux

### Validation côté client

- Validation **au blur** des champs (pas pendant la frappe — évite l'effet "validation agressive")
- Validation à la soumission (re-check de tous les champs obligatoires)
- Messages d'erreur courts et clairs sous chaque champ (ex. `Email invalide`, `Champ obligatoire`)
- Le bouton CTA principal reste désactivé tant qu'il manque un champ obligatoire ou qu'un champ est invalide ET tant que la case RGPD n'est pas cochée
- Le hint dynamique sous le CTA disparaît quand tous les champs sont valides (`.submit.is-ready`)

### Validation côté serveur

- Toujours re-valider avec le schéma Zod côté Nitro (jamais faire confiance au client)
- Les messages d'erreur côté serveur reviennent au format `{ field: 'email', message: 'Email invalide' }` pour affichage UI

### Champs conditionnels

| Trigger | Champ qui apparaît |
|---|---|
| Sélection "Autre" dans **Poste recherché** | Champ texte `posteRecherchePrecisionAutre` (max 60 char, obligatoire) |
| Sélection "Autre" dans **Secteur de votre entreprise** | Champ texte `secteurPrecisionAutre` (max 60 char, obligatoire) |

### Persistance temporaire (optionnel V1)

Pour éviter qu'un prospect perde sa saisie en cas de refresh accidentel, possibilité de stocker en `sessionStorage` les valeurs au fur et à mesure de la saisie. À effacer après soumission réussie. **Optionnel** — peut être ajouté en V2 si retours utilisateurs le justifient.

**Note RGPD** : ne pas stocker la case `consentementRgpd` en sessionStorage. À chaque chargement, le prospect doit re-cocher activement.

---

## Récapitulatif

| # | Champ | Bloc | Obligatoire | Type |
|---|---|---|---|---|
| 1 | Prénom | 01 Identité | ✅ | Texte court |
| 2 | Nom | 01 Identité | ✅ | Texte court |
| 3 | Adresse mail | 01 Identité | ✅ | Email |
| 4 | Numéro de téléphone | 01 Identité | ✅ | Tel international |
| 5 | Entreprise | 01 Identité | ✅ | Texte court |
| 6 | Poste recherché | 02 Le poste | ✅ | Combobox 17 options |
| 7 | Séniorité visée | 02 Le poste | ✅ | Radio cards 4 options + sous-libellé années |
| 8 | Objectifs du poste | 02 Le poste | ✅ | Radio cards 4 options |
| 9 | Localisation principale | 02 Le poste | ✅ | Texte + checkbox Remote possible |
| 10 | Secteur de votre entreprise | 03 Le contexte | ✅ | Select 8 options |
| 11 | Fixe annuel brut (€) | 03 Le contexte | ✅ | Texte numérique + suffixe € |
| 12 | OTE total cible (€) | 03 Le contexte | ✅ | Texte numérique + suffixe € |
| 13 | Site de l'entreprise | 04 Pour aller plus loin | ❌ | URL |
| 14 | Contenu fiche de poste | 04 Pour aller plus loin | ❌ | Textarea |
| 15 | Acceptation politique de confidentialité | (sans bloc) | ✅ | Checkbox unique |

**Total** : 15 champs (13 obligatoires + 2 optionnels).

---

## Changelog v3 → v4

| # | Changement | Impact |
|---|---|---|
| 1 | Séparation champ "Prénom et Nom" en 2 champs (Prénom + Nom) | Nouveau champ + emails Brevo + Jarvi |
| 2 | Ajout sous-libellé années aux radios séniorité | Cosmétique uniquement, pas d'impact backend |
| 3 | Suppression case "International possible" | Schéma Zod allégé d'1 champ |
| 4 | Conservation case "Remote possible" | Inchangé |
| 5 | Remplacement select Package fourchettes par 2 champs Fixe + OTE | Schéma Zod refondu, calibrage LLM mis à jour, Brevo mis à jour |
| 6 | Ajout `.refine()` Zod pour cohérence OTE >= Fixe | Validation supplémentaire |
| 7 | Renommage Bloc 04 "Optionnel — pour aller plus loin" → "Pour aller plus loin" | Cosmétique |
| 8 | Convention visuelle : étoile magenta sur obligatoires, suppression mentions "Optionnel" | Cosmétique brief design |
