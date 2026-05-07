# Spécifications du formulaire — Demande de stagiaire ou alternant Sales (Mariell)

**Version** : 1 (finale)
**Audience** : ce document est destiné au dev qui implémentera le formulaire en Vue 3.
**Stack cible** : Nuxt 3, validation côté client + serveur (Zod).
**Outil** : Le Lab Mariell — Outil n°1 (Demande de candidats stage/alternance)

---

## Vue d'ensemble

Le formulaire comporte **11 champs visibles** + **3 champs techniques** (RGPD, honeypot, Turnstile) :
- **11 champs visibles obligatoires**
- **0 champ optionnel**
- **3 champs techniques** (RGPD checkbox, honeypot caché, Turnstile invisible)

Friction estimée : 2-3 minutes de remplissage.

Structure visuelle en **3 blocs logiques** (cf. `brief-claude-design-outil-1-stage-alternance.md`) :
- Bloc 1 — Contact (4 champs obligatoires)
- Bloc 2 — Entreprise (2 champs obligatoires)
- Bloc 3 — Besoin (5 champs obligatoires)
- Bloc Conformité (1 case RGPD obligatoire)

Submission protégée par **Cloudflare Turnstile** (CAPTCHA invisible) + **honeypot** (champ caché anti-bot).

⚠️ **Différences clés avec l'outil 2** :
- Email professionnel **obligatoire** (blacklist domaines perso) — voir détail au champ 3
- Anti-doublon Jarvi (1 demande active par entreprise)
- Pas de champ optionnel (tous les champs sont requis)

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

### Champ 3 — Email professionnel

| Propriété | Valeur |
|---|---|
| **Label** | Email professionnel |
| **Type** | Email |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `marie@votre-entreprise.com` |
| **Validation client** | Format email standard (regex RFC) + vérification non-blacklist |
| **Validation serveur (Zod)** | `z.string().email()` + check `isPersonalEmail()` (blacklist) |
| **Helper text** | "Email d'entreprise requis (pas gmail, hotmail, etc.)" |
| **Message d'erreur (format)** | "Format d'email invalide." |
| **Message d'erreur (perso)** | "Cet outil est réservé aux entreprises. Merci d'utiliser votre email professionnel." |
| **Note importante** | ⚠️ Les emails libres (Gmail, Hotmail, Outlook, Yahoo, iCloud, FAI français...) sont **bloqués**. Voir blacklist complète dans `/server/utils/email-blacklist.ts` |

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
| **Composant suggéré** | `vue-tel-input` ou équivalent Vue 3 |

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
| **Note importante** | Sert au lookup Jarvi (recherche Company existante par nom) |

### Champ 6 — Site web ou LinkedIn de l'entreprise

| Propriété | Valeur |
|---|---|
| **Label** | Site web ou LinkedIn de l'entreprise |
| **Type** | URL |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `https://salesfit.com ou linkedin.com/company/...` |
| **Validation client** | URL valide (avec ou sans protocole, le serveur normalise) |
| **Validation serveur (Zod)** | `z.string().url()` (Zod accepte protocole obligatoire) |
| **Helper text** | (aucun) |
| **Message d'erreur (format)** | "Lien invalide. Saisissez un site web (https://...) ou une URL LinkedIn complète." |
| **Note importante** | Le serveur ajoute automatiquement `https://` si le prospect saisit `salesfit.com` sans protocole. Sert aussi au lookup Jarvi (matching par domaine). |

---

## Bloc 3 — Besoin

### Champ 7 — Type de contrat

| Propriété | Valeur |
|---|---|
| **Label** | Type de contrat |
| **Type** | Boutons radio (2 options) |
| **Obligatoire** | ✅ Oui |
| **Options** | `Stage` / `Alternance` |
| **Validation client** | Une option doit être sélectionnée |
| **Validation serveur (Zod)** | `z.enum(['Stage', 'Alternance'])` |
| **Helper text** | (aucun) |
| **Message d'erreur (vide)** | "Ce champ est requis." |
| **Note importante** | Choix unique, pas de "les deux" |

### Champ 8 — Profil recherché

| Propriété | Valeur |
|---|---|
| **Label** | Profil recherché |
| **Type** | Select (dropdown) |
| **Obligatoire** | ✅ Oui |
| **Options** | `SDR / BDR` / `Business Developer Junior` / `Account Executive Junior` / `Sales Ops Junior` / `Autre` |
| **Validation client** | Une option doit être sélectionnée. Si "Autre" → champ texte conditionnel apparaît |
| **Validation serveur (Zod)** | `z.enum([...])` + `profilRecherchePrecisionAutre: z.string().max(60).optional()` |
| **Helper text** | (aucun) |
| **Message d'erreur (vide)** | "Ce champ est requis." |
| **Comportement conditionnel** | Si `Autre` sélectionné → afficher un champ texte avec placeholder "Précisez le profil recherché" |
| **Note importante** | Si "Autre" sélectionné, la précision est obligatoire (max 60 caractères) |

### Champ 9 — Date de démarrage souhaitée

| Propriété | Valeur |
|---|---|
| **Label** | Date de démarrage souhaitée |
| **Type** | Select (dropdown) |
| **Obligatoire** | ✅ Oui |
| **Options** | `ASAP` / `Sous 1 à 2 mois` / `Sous 3 à 6 mois` / `Flexible` |
| **Validation client** | Une option doit être sélectionnée |
| **Validation serveur (Zod)** | `z.enum([...])` |
| **Helper text** | (aucun) |
| **Message d'erreur (vide)** | "Ce champ est requis." |
| **Note importante** | Tranches plutôt que date picker (UX plus rapide, info suffisante) |

### Champ 10 — Localisation

| Propriété | Valeur |
|---|---|
| **Label** | Localisation |
| **Type** | Texte court (single-line input) |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | `Paris — remote partiel possible` |
| **Validation client** | Min 2 caractères, max 150 |
| **Validation serveur (Zod)** | `z.string().min(2).max(150)` |
| **Helper text** | (aucun) |
| **Message d'erreur (vide)** | "Ce champ est requis." |
| **Note importante** | Texte libre — le prospect peut indiquer ville + remote/hybride en un seul champ |

### Champ 11 — Brief de la mission

| Propriété | Valeur |
|---|---|
| **Label** | Brief de la mission |
| **Type** | Textarea (multi-line) |
| **Obligatoire** | ✅ Oui |
| **Placeholder** | "Décrivez en quelques lignes le contexte de l'équipe Sales, la mission du futur stagiaire ou alternant, et ce qui rendrait le profil pertinent pour vous. (500 caractères max)" |
| **Validation client** | Min 20 caractères, max 500 caractères |
| **Validation serveur (Zod)** | `z.string().min(20).max(500)` |
| **Helper text** | Compteur de caractères affiché en bas à droite (ex. "127 / 500") |
| **Message d'erreur (vide)** | "Ce champ est requis." |
| **Message d'erreur (trop court)** | "Brief trop court — 20 caractères minimum." |
| **Message d'erreur (trop long)** | "500 caractères maximum (vous en avez X)." |
| **Note importante** | Le compteur de caractères doit changer de couleur dynamiquement : gris (0-400) → orange (400-499) → rouge (500+) |

---

## Bloc Conformité

### Champ 12 — Consentement RGPD

| Propriété | Valeur |
|---|---|
| **Label** | (case à cocher) |
| **Type** | Checkbox |
| **Obligatoire** | ✅ Oui |
| **Texte de la case** | "J'accepte que mes données soient utilisées par Mariell pour traiter ma demande, conformément à la [politique de confidentialité](#)." |
| **Validation client** | Doit être cochée |
| **Validation serveur (Zod)** | `z.literal(true)` |
| **Helper text** | (aucun) |
| **Message d'erreur (non cochée)** | "Vous devez accepter la politique de confidentialité pour continuer." |
| **Note importante** | Le mot "politique de confidentialité" est un lien cliquable vers `/legal/privacy` (ou équivalent à venir) |

---

## Champs techniques (cachés ou invisibles)

### Champ 13 — Honeypot (caché)

| Propriété | Valeur |
|---|---|
| **Type** | Texte caché |
| **Visible utilisateur** | ❌ Non — caché en CSS (`position: absolute; left: -9999px`) |
| **Visible bots** | ✅ Oui — les bots remplissent automatiquement tous les champs |
| **Validation client** | Doit rester vide |
| **Validation serveur (Zod)** | `z.string().max(0).optional()` |
| **Comportement si rempli** | Le serveur retourne **200 trompeur** (succès simulé) sans déclencher les side effects. Aucune erreur affichée au bot. |
| **Note importante** | Inclure `tabindex="-1"` (empêche d'arriver au clavier) + `aria-hidden="true"` (cache aux screen readers) |

### Champ 14 — Cloudflare Turnstile (invisible)

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
*Stagiaire ou alternant Sales : on s'en charge.*

### Sous-titre
*Vous nous décrivez votre besoin, nous activons notre vivier et vous présentons les profils pertinents. Sans frais — c'est notre manière de contribuer à l'écosystème Sales français.*

### Mention de cadre (italique discret, sous le sous-titre)
*Service proposé sous réserve de disponibilité de profils pertinents. Nos clients restent prioritaires. Réponse sous 7 à 10 jours ouvrés.*

### Sous-titres des blocs
1. *Contact*
2. *Entreprise*
3. *Besoin*

### CTA principal (bouton de soumission)
*Envoyer ma demande*

### Mention RGPD sous le CTA (taille plus petite, gris atténué)
*Vos données ne sont jamais transmises à des tiers. Vous pouvez demander leur suppression à tout moment.*

---

## Page de confirmation

URL : `/lab/demande-stage-alternance/confirmation`

### Wording exact

**Titre H1** : *Demande reçue.*

**Corps** : *Nous revenons vers vous sous 7 à 10 jours ouvrés.*

**Mention italique discrète** : *Service offert sous réserve de disponibilité de profils pertinents. Priorité accordée à nos clients.*

**Bouton CTA secondaire** : *Retour au Lab* (lien vers `/lab`)

### Comportement

- Page atteinte par redirection après soumission réussie (HTTP 200 retour de la route Nitro)
- Pas d'appel API supplémentaire
- Bouton secondaire en style outline/ghost (ne doit pas concurrencer visuellement le titre)
- Pas d'icône "checkmark vert" — la confirmation passe par le wording

---

## Messages d'erreur globaux (pleine largeur, au-dessus du formulaire)

Certaines erreurs s'affichent **en bloc au-dessus du formulaire** plutôt que sous un champ spécifique. Le formulaire reste rempli au cas où l'utilisateur souhaite ajuster.

### Erreur 1 — Doublon entreprise détecté

**Titre** : *Une demande est déjà en cours pour votre entreprise.*

**Corps** : *Pour toute mise à jour ou information complémentaire, contactez-nous directement à bonjour@mariell.fr.*

**Code HTTP** : 409 Conflict
**Code interne** : `DUPLICATE_REQUEST`

### Erreur 2 — Limite de soumissions atteinte (rate limit)

**Titre** : *Limite de soumissions atteinte.*

**Corps** : *Vous avez déjà effectué plusieurs demandes récemment. Pour garantir un traitement de qualité à chacun, nous limitons le nombre de soumissions par utilisateur. Si votre demande est urgente, contactez-nous directement à bonjour@mariell.fr.*

**Code HTTP** : 429 Too Many Requests
**Code interne** : `RATE_LIMIT`

### Erreur 3 — Erreur technique générique

**Titre** : *Une erreur technique s'est produite.*

**Corps** : *Votre demande n'a pas pu être enregistrée. Merci de réessayer dans quelques minutes, ou de nous contacter directement à bonjour@mariell.fr.*

**Code HTTP** : 500 Internal Server Error
**Code interne** : `INTERNAL_ERROR`

### Erreur 4 — Turnstile échoué

**Titre** : *Vérification de sécurité échouée.*

**Corps** : *Merci de rafraîchir la page et réessayer.*

**Code HTTP** : 403 Forbidden
**Code interne** : `TURNSTILE_FAILED`

---

## Messages d'erreur inline (sous chaque champ)

Affichés en rouge sous le champ concerné, après le blur ou à la soumission (pas pendant la saisie).

| Champ | Cas | Message |
|---|---|---|
| Tous (vide) | Champ requis non rempli | "Ce champ est requis." |
| Email | Format invalide | "Format d'email invalide." |
| Email | Domaine perso détecté | "Cet outil est réservé aux entreprises. Merci d'utiliser votre email professionnel." |
| Téléphone | Trop court ou format incorrect | "Numéro de téléphone invalide." |
| URL entreprise | Format invalide | "Lien invalide. Saisissez un site web (https://...) ou une URL LinkedIn complète." |
| Brief mission | < 20 caractères | "Brief trop court — 20 caractères minimum." |
| Brief mission | > 500 caractères | "500 caractères maximum (vous en avez X)." |
| Profil recherché | "Autre" sans précision | "Précisez le profil recherché (60 caractères max)." |
| RGPD | Non cochée | "Vous devez accepter la politique de confidentialité pour continuer." |

---

## Comportement UX attendu

### Validation

- **Pas de validation pendant la saisie** (qui crierait à chaque touche)
- **Validation au blur du champ** (quand l'utilisateur quitte le champ)
- **Validation finale à la soumission** : le bouton CTA reste désactivé tant que tous les champs requis ne sont pas valides
- **État du bouton CTA** (3 états) :
  - **Disabled** (désaturé/grisé) : libellé `Envoyer ma demande` — affiché tant que tous les champs requis ne sont pas remplis et valides
  - **Idle** (couleur primaire) : libellé `Envoyer ma demande` — cliquable, tous les champs requis sont valides
  - **Loading** (cliqué, désactivé) : libellé `Envoi en cours...` + spinner discret intégré dans le bouton — affiché pendant l'appel API (durée typique 1,5 à 4 secondes)

⚠️ **Pas de page de chargement intermédiaire** : la transition entre la soumission et l'arrivée sur la page de confirmation se fait uniquement via le changement d'état du bouton CTA. Pas de page de transition, pas de modal, pas de spinner plein écran.

### Compteur de caractères du brief mission

- Position : en bas à droite du textarea
- Format : `0 / 500` (mise à jour en temps réel)
- Couleur : 
  - Gris (0-400 caractères) — état normal
  - Orange (400-499 caractères) — approche de la limite
  - Rouge (500+ caractères) — dépassement, soumission bloquée

### Champ conditionnel "Profil recherché — Autre"

Si l'utilisateur sélectionne "Autre" dans le dropdown :
- Un champ texte apparaît juste en-dessous (transition douce)
- Ce champ est obligatoire si "Autre" est sélectionné
- Si l'utilisateur change pour une autre option, le champ texte disparaît et sa valeur est réinitialisée

### Sélecteur de pays pour le téléphone

- Drapeau + indicatif (ex. 🇫🇷 +33) en début de champ
- Par défaut : France (+33)
- Au clic : liste déroulante des pays avec recherche
- Validation : le format doit correspondre au pays sélectionné

---

## Schéma Zod complet (référence)

Pour le dev backend, le schéma Zod complet est défini dans `/server/schemas/stage-alternance.ts`. Voir `spec-technique-route-nitro-outil-1.md`, section 5.

---

## Tests UX recommandés avant lancement

1. ✅ Soumission valide → redirection vers page de confirmation
2. ✅ Soumission avec email gmail.com → erreur inline sous le champ email
3. ✅ Soumission sans cocher RGPD → erreur inline + bouton CTA reste désactivé
4. ✅ Brief mission à 501 caractères → compteur passe rouge + bouton CTA désactivé
5. ✅ Profil recherché "Autre" sans précision → erreur inline
6. ✅ Test mobile (iPhone, Android) — sélecteur téléphone fonctionnel
7. ✅ Test accessibilité clavier (Tab, Shift+Tab, Espace, Enter)
8. ✅ Test screen reader (le honeypot doit être ignoré)
9. ✅ Test sur navigateurs : Chrome, Firefox, Safari, Edge
10. ✅ Test rafraîchissement de page après soumission (Turnstile token doit se régénérer)

---

**Fin des spécifications du formulaire outil 1.**
