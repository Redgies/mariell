# Spécifications du formulaire — Évaluation d'attractivité d'offre Sales (Mariell)

**Version** : 1 (V2 actée)
**Audience** : ce document est destiné au dev qui implémentera le formulaire en Vue 3.
**Stack cible** : Nuxt 3, validation côté client + serveur (Zod).
**Outil** : Le Lab Mariell — Outil n°3 (Évaluation d'attractivité d'offre Sales)

---

## Vue d'ensemble

Le formulaire comporte **12 champs visibles** + **3 champs techniques** (RGPD, honeypot, Turnstile) :
- **12 champs visibles obligatoires**
- **0 champ optionnel**
- **3 champs techniques** (RGPD checkbox, honeypot caché, Turnstile invisible)

Friction estimée : 3-4 minutes de remplissage.

Structure visuelle en **3 blocs logiques** :
- Bloc 1 — Contact (4 champs obligatoires)
- Bloc 2 — Entreprise (3 champs obligatoires)
- Bloc 3 — Le poste (5 champs obligatoires)
- Bloc Conformité (1 case RGPD obligatoire)

Submission protégée par **Cloudflare Turnstile** (CAPTCHA invisible) + **honeypot** (champ caché anti-bot).

⚠️ **Différences clés avec les outils 1 et 2** :
- Email **personnel accepté** (pas de blacklist — cohérence outil 2)
- Pas d'anti-doublon Jarvi (un même prospect peut évaluer plusieurs offres)
- Pas de redirection : output streamé sur la même page (cf. outil 2)
- Champ "missions" textarea long (1000 caractères) pour copier-coller fiche de poste

---

## Bloc 1 — Contact

### Champ 1 — Prénom

| Propriété | Valeur |
|---|---|
| **Label** | Prénom |
| **Type** | Texte court (single-line input) |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `Marie` |
| **Validation client** | Min 1 caractère, max 50 |
| **Validation serveur (Zod)** | `z.string().min(1).max(50)` |
| **Helper text** | (aucun) |
| **Message d'erreur (vide)** | "Ce champ est requis." |

### Champ 2 — Nom

| Propriété | Valeur |
|---|---|
| **Label** | Nom |
| **Type** | Texte court (single-line input) |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `Dupont` |
| **Validation client** | Min 1 caractère, max 50 |
| **Validation serveur (Zod)** | `z.string().min(1).max(50)` |
| **Helper text** | (aucun) |
| **Message d'erreur (vide)** | "Ce champ est requis." |

### Champ 3 — Email

| Propriété | Valeur |
|---|---|
| **Label** | Email |
| **Type** | Email |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `marie@votre-entreprise.com` |
| **Validation client** | Format email standard (regex RFC) |
| **Validation serveur (Zod)** | `z.string().email()` |
| **Helper text** | (aucun) |
| **Message d'erreur (format)** | "Format d'email invalide." |
| **Message d'erreur (vide)** | "Ce champ est requis." |
| **Note importante** | ⚠️ Pas de blacklist domaines perso (différence avec outil 1, cohérence avec outil 2). Gmail, Outlook, etc. acceptés. |

### Champ 4 — Téléphone

| Propriété | Valeur |
|---|---|
| **Label** | Téléphone |
| **Type** | Tel (international) |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `+33 6 12 34 56 78` |
| **Validation client** | Format international, sélecteur pays (par défaut +33) |
| **Validation serveur (Zod)** | `z.string().min(8).max(20)` |
| **Helper text** | (aucun) |
| **Message d'erreur (format)** | "Numéro de téléphone invalide." |
| **Message d'erreur (vide)** | "Ce champ est requis." |
| **Composant suggéré** | `vue-tel-input` ou équivalent Vue 3 (idem outils 1 et 2) |

---

## Bloc 2 — Entreprise

### Champ 5 — Nom de l'entreprise

| Propriété | Valeur |
|---|---|
| **Label** | Nom de l'entreprise |
| **Type** | Texte court (single-line input) |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `Salesfit` |
| **Validation client** | Min 2 caractères, max 100 |
| **Validation serveur (Zod)** | `z.string().min(2).max(100)` |
| **Helper text** | (aucun) |
| **Message d'erreur (vide)** | "Ce champ est requis." |
| **Note importante** | Sert au lookup Jarvi (recherche Company existante par nom) ET au LLM comme premier vecteur d'identification pour la web search. |

### Champ 6 — Site web ou LinkedIn de l'entreprise

| Propriété | Valeur |
|---|---|
| **Label** | Site web ou LinkedIn de l'entreprise |
| **Type** | URL |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `https://salesfit.com ou linkedin.com/company/...` |
| **Validation client** | URL valide (avec ou sans protocole, le serveur normalise) |
| **Validation serveur (Zod)** | `z.string().url()` (le serveur ajoute `https://` si absent avant validation) |
| **Helper text** | (aucun) |
| **Message d'erreur (format)** | "Lien invalide. Saisissez un site web (https://...) ou une URL LinkedIn complète." |
| **Note importante** | Vecteur principal de la web search LLM — c'est à partir de ce lien que le LLM enrichit son analyse (signaux LinkedIn, Glassdoor, médiatiques, etc.). |

### Champ 7 — Composition actuelle de l'équipe Sales

| Propriété | Valeur |
|---|---|
| **Label** | Composition actuelle de l'équipe Sales |
| **Type** | Texte court (single-line input) |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `3 SDR + 4 AE + 1 VP Sales` |
| **Validation client** | Min 3 caractères, max 200 |
| **Validation serveur (Zod)** | `z.string().min(3).max(200)` |
| **Helper text** | (aucun) |
| **Message d'erreur (vide)** | "Ce champ est requis." |
| **Note importante** | Texte libre, pas de structuration imposée. Le prospect peut écrire `0 — premier recrutement Sales`, `équipe de 12, mix BDR/AE`, etc. Le LLM parse en NLP. |

---

## Bloc 3 — Le poste

### Champ 8 — Intitulé du poste

| Propriété | Valeur |
|---|---|
| **Label** | Intitulé du poste |
| **Type** | Texte court (single-line input) |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `Senior Account Executive Mid-Market` |
| **Validation client** | Min 3 caractères, max 100 |
| **Validation serveur (Zod)** | `z.string().min(3).max(100)` |
| **Helper text** | (aucun) |
| **Message d'erreur (vide)** | "Ce champ est requis." |
| **Note importante** | Texte libre. Le LLM peut y détecter implicitement le grade (ex: "Head of Sales", "VP Sales") même si la séniorité (champ 9) est limitée à 4 options. |

### Champ 9 — Niveau de séniorité

| Propriété | Valeur |
|---|---|
| **Label** | Niveau de séniorité |
| **Type** | Select (dropdown) |
| **Obligatoire** | ✅ Oui |
| **Options** | `Junior (0-2 ans)` / `Confirmé (2-5 ans)` / `Senior (5-8 ans)` / `Lead (8+ ans)` |
| **Validation client** | Une option doit être sélectionnée |
| **Validation serveur (Zod)** | `z.enum(['Junior (0-2 ans)', 'Confirmé (2-5 ans)', 'Senior (5-8 ans)', 'Lead (8+ ans)'])` |
| **Helper text** | (aucun) |
| **Message d'erreur (vide)** | "Ce champ est requis." |
| **Note importante** | Pas d'option Manager / Head / VP : ces grades sont signifiés dans l'intitulé (champ 8) et seront reconstruits par le LLM. |

### Champ 10 — Type de cycle

| Propriété | Valeur |
|---|---|
| **Label** | Type de cycle |
| **Type** | Select (dropdown) |
| **Obligatoire** | ✅ Oui |
| **Options** | `Outbound` / `Inbound` / `Mixte` / `Account Management` / `Sales Ops` / `Autre` |
| **Validation client** | Une option doit être sélectionnée. Si "Autre" → champ texte conditionnel apparaît |
| **Validation serveur (Zod)** | `z.enum([...])` + `typeCyclePrecisionAutre: z.string().max(60).optional()` |
| **Helper text** | (aucun) |
| **Message d'erreur (vide)** | "Ce champ est requis." |
| **Comportement conditionnel** | Si `Autre` sélectionné → afficher un champ texte avec placeholder "Précisez le type de cycle" (max 60 caractères, obligatoire) |

### Champ 11 — Package proposé

| Propriété | Valeur |
|---|---|
| **Label parent** | Package proposé |
| **Type** | Composé de 2 sous-champs |

#### Sous-champ 11a — Fixe annuel brut

| Propriété | Valeur |
|---|---|
| **Label** | Fixe annuel brut (€) |
| **Type** | Number |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `60000` |
| **Validation client** | Entier positif, min 15000, max 500000 |
| **Validation serveur (Zod)** | `z.number().int().min(15000).max(500000)` |
| **Helper text** | (aucun) |
| **Message d'erreur (vide)** | "Ce champ est requis." |
| **Message d'erreur (range)** | "Montant invalide (entre 15 000 € et 500 000 €)." |
| **Note importante** | Affichage avec formatage milliers (60 000 €) côté UI, valeur stockée en entier brut. |

#### Sous-champ 11b — Variable annuel brut on-target (OTE)

| Propriété | Valeur |
|---|---|
| **Label** | Variable annuel brut on-target (OTE) (€) |
| **Type** | Number |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `30000` |
| **Validation client** | Entier ≥ 0, max 500000 |
| **Validation serveur (Zod)** | `z.number().int().min(0).max(500000)` |
| **Helper text** | "Le variable atteint si l'objectif est réalisé à 100%." |
| **Message d'erreur (vide)** | "Ce champ est requis (saisir 0 si pas de variable)." |
| **Message d'erreur (range)** | "Montant invalide." |
| **Note importante** | 0 € est une valeur valide (postes sans variable, ex: certains Sales Ops). |

### Champ 12 — Localisation et politique remote

| Propriété | Valeur |
|---|---|
| **Label parent** | Localisation et politique remote |
| **Type** | Composé de 2 sous-champs |

#### Sous-champ 12a — Ville / zone géographique

| Propriété | Valeur |
|---|---|
| **Label** | Ville / zone |
| **Type** | Texte court (single-line input) |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `Paris` |
| **Validation client** | Min 2 caractères, max 100 |
| **Validation serveur (Zod)** | `z.string().min(2).max(100)` |
| **Helper text** | (aucun) |
| **Message d'erreur (vide)** | "Ce champ est requis." |

#### Sous-champ 12b — Politique remote

| Propriété | Valeur |
|---|---|
| **Label** | Politique remote |
| **Type** | Select (dropdown) |
| **Obligatoire** | ✅ Oui |
| **Options** | `Full remote` / `Hybride 2-3j bureau` / `Full bureau` / `Flexible` |
| **Validation client** | Une option doit être sélectionnée |
| **Validation serveur (Zod)** | `z.enum([...])` |
| **Helper text** | (aucun) |
| **Message d'erreur (vide)** | "Ce champ est requis." |

### Champ 13 — Missions principales

| Propriété | Valeur |
|---|---|
| **Label** | Missions principales |
| **Type** | Textarea (multi-line) |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | "Décrivez en quelques lignes ce que ce Sales fera concrètement : type de cycle, taille de comptes, périmètre géographique, ratios chasse/farming, contexte équipe… Vous pouvez aussi coller un extrait de votre fiche de poste. (1000 caractères max)" |
| **Validation client** | Min 30 caractères, max 1000 caractères |
| **Validation serveur (Zod)** | `z.string().min(30).max(1000)` |
| **Helper text** | Compteur de caractères affiché en bas à droite (ex. "127 / 1000") |
| **Message d'erreur (vide)** | "Ce champ est requis." |
| **Message d'erreur (trop court)** | "Description trop courte — 30 caractères minimum." |
| **Message d'erreur (trop long)** | "1000 caractères maximum (vous en avez X)." |
| **Note importante** | Champ ouvert volontairement large pour permettre un copier-coller depuis une fiche de poste. C'est la matière première principale du LLM pour évaluer les missions. |

---

## Bloc Conformité

### Champ 14 — Consentement RGPD

| Propriété | Valeur |
|---|---|
| **Label** | Consentement RGPD |
| **Type** | Checkbox |
| **Obligatoire** | ✅ Oui |
| **Texte** | "J'accepte que mes données soient utilisées par Mariell pour traiter ma demande, conformément à la politique de confidentialité." |
| **Validation client** | Doit être cochée |
| **Validation serveur (Zod)** | `z.literal(true)` |
| **Message d'erreur (non cochée)** | "Vous devez accepter la politique de confidentialité pour continuer." |
| **Note importante** | Le mot "politique de confidentialité" est un lien (#) vers la page mentions légales. |

---

## Champs techniques (cachés ou invisibles)

### Champ 15 — Honeypot (caché)

| Propriété | Valeur |
|---|---|
| **Type** | Texte caché |
| **Visible utilisateur** | ❌ Non — caché en CSS (`position: absolute; left: -9999px`) |
| **Visible bots** | ✅ Oui — les bots remplissent automatiquement tous les champs |
| **Validation client** | Doit rester vide |
| **Validation serveur (Zod)** | `z.string().max(0).optional()` |
| **Comportement si rempli** | Le serveur retourne **200 trompeur** (succès simulé) sans déclencher les side effects. Aucune erreur affichée au bot. |
| **Note importante** | Inclure `tabindex="-1"` (empêche d'arriver au clavier) + `aria-hidden="true"` (cache aux screen readers) |

### Champ 16 — Cloudflare Turnstile (invisible)

| Propriété | Valeur |
|---|---|
| **Type** | Widget invisible Cloudflare |
| **Visible utilisateur** | ❌ Non — exécution silencieuse |
| **Validation client** | Token généré au chargement de la page |
| **Validation serveur (Zod)** | `z.string().min(1)` (le token doit être présent) |
| **Vérification serveur** | Appel à `https://challenges.cloudflare.com/turnstile/v0/siteverify` |
| **Comportement en cas d'échec** | Erreur 403 + message "Vérification de sécurité échouée. Merci de rafraîchir la page et réessayer." |
| **Note importante** | Mention discrète "Protégé par Cloudflare Turnstile" affichée en footer du formulaire |

---

## Wording de la page formulaire

### Titre principal (H1)
*À DÉFINIR — chantier wording*

### Sous-titre
*À DÉFINIR — chantier wording*

### Mention de cadre (italique discret, sous le sous-titre)
*À DÉFINIR — chantier wording*

### Sous-titres des blocs
1. *Contact*
2. *Entreprise*
3. *Le poste*

### CTA principal (bouton de soumission)
*À DÉFINIR — chantier wording (suggestion : "Évaluer mon offre")*

### Mention RGPD sous le CTA (taille plus petite, gris atténué)
*Vos données ne sont jamais transmises à des tiers. Vous pouvez demander leur suppression à tout moment.*

---

## Comportement UX attendu

### Validation

- **Pas de validation pendant la saisie** (qui crierait à chaque touche)
- **Validation au blur du champ** (quand l'utilisateur quitte le champ)
- **Validation finale à la soumission** : le bouton CTA reste désactivé tant que tous les champs requis ne sont pas valides
- **État du bouton CTA** :
  - Désactivé (gris) : tant que tous les champs requis ne sont pas remplis et valides
  - Actif (couleur primaire) : tous les champs requis valides
  - Loading (spinner ou texte "Évaluation en cours...") : pendant l'appel API, avant le streaming
  - Désactivé pendant le streaming (le formulaire devient read-only ou disparaît au profit de la zone de résultat)

### Compteur de caractères du champ "Missions principales"

- Position : en bas à droite du textarea
- Format : `0 / 1000` (mise à jour en temps réel)
- Couleur :
  - Gris (0-800 caractères) — état normal
  - Orange (800-999 caractères) — approche de la limite
  - Rouge (1000+ caractères) — dépassement, soumission bloquée

### Champ conditionnel "Type de cycle — Autre"

Si l'utilisateur sélectionne "Autre" dans le dropdown :
- Un champ texte apparaît juste en-dessous (transition douce)
- Ce champ est obligatoire si "Autre" est sélectionné
- Si l'utilisateur change pour une autre option, le champ texte disparaît et sa valeur est réinitialisée

### Sélecteur de pays pour le téléphone

- Drapeau + indicatif (ex. 🇫🇷 +33) en début de champ
- Par défaut : France (+33)
- Au clic : liste déroulante des pays avec recherche
- Validation : le format doit correspondre au pays sélectionné

### Champs numériques (package fixe + variable)

- Affichage avec séparateur de milliers (espace en français : `60 000`)
- Pas de symbole € dans le champ (le label précise la devise)
- Saisie permissive : accepter `60000`, `60 000`, `60.000`, `60,000` → normaliser côté serveur

---

## Schéma Zod complet (référence)

Pour le dev backend, le schéma Zod complet sera défini dans `/server/schemas/evaluation-attractivite.ts` (à écrire dans la phase suivante : spec technique route Nitro).

---

## Tests UX recommandés avant lancement

1. ✅ Soumission valide → streaming de l'évaluation sur la même page
2. ✅ Soumission avec email gmail.com → acceptée (cohérence outil 2)
3. ✅ Soumission sans cocher RGPD → erreur inline + bouton CTA reste désactivé
4. ✅ Missions à 1001 caractères → compteur passe rouge + bouton CTA désactivé
5. ✅ Type de cycle "Autre" sans précision → erreur inline
6. ✅ Variable à 0 € → accepté (postes sans variable)
7. ✅ Test mobile (iPhone, Android) — sélecteur téléphone + saisie numérique fonctionnels
8. ✅ Test accessibilité clavier (Tab, Shift+Tab, Espace, Enter)
9. ✅ Test screen reader (le honeypot doit être ignoré)
10. ✅ Test sur navigateurs : Chrome, Firefox, Safari, Edge
11. ✅ Test rafraîchissement de page après soumission (Turnstile token doit se régénérer)
12. ✅ Test copier-coller fiche de poste dans le textarea (formatage doit être nettoyé)

---

**Fin des spécifications du formulaire outil 3.**
