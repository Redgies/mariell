# INSTRUCTIONS DEV — Outil n°1 : Demande de stagiaire ou alternant Sales

**Projet** : Le Lab Mariell — Outil n°1 (Demande de candidats stage/alternance)
**Version dossier** : 1.0 — finale, prête pour développement
**Date livraison cadrage** : 7 mai 2026

---

## 📋 Avant de commencer — Lis ce fichier en entier

Ce document est ton **point d'entrée**. Il référence tous les autres livrables et explique dans quel ordre les utiliser. Lis-le entièrement avant d'ouvrir le moindre autre fichier ou de toucher au code.

---

## 1. Vue d'ensemble de l'outil

### Ce que c'est

L'outil 1 est une **page web Nuxt 3** qui permet à un dirigeant ou DRH d'une PME (30-300 personnes) de soumettre une demande de stagiaire ou alternant Sales auprès du cabinet Mariell. C'est un **service offert** (sans frais) positionné comme un partenariat avec l'écosystème Sales français.

### Ce que ça fait techniquement

1. Affiche un formulaire de 11 champs requis sur `/lab/demande-stage-alternance`
2. À la soumission, valide tous les inputs (Zod, Cloudflare Turnstile, blacklist email perso, rate limit, anti-doublon Jarvi)
3. Crée ou retrouve une fiche Company dans Jarvi (CRM)
4. Crée un Project Jarvi rattaché à cette Company avec un statut "Lab — Reçue"
5. Envoie 2 emails Brevo en parallèle :
   - Notification interne au gérant Mariell (récap complet de la demande)
   - Confirmation de réception au prospect
6. Redirige vers `/lab/demande-stage-alternance/confirmation`

### Ce que ça **NE fait PAS**

- ❌ Pas de LLM, pas de génération IA
- ❌ Pas de Calendly
- ❌ Pas de paiement
- ❌ Pas de candidat côté front (l'outil est destiné aux recruteurs, pas aux candidats)
- ❌ Pas de stockage persistant des soumissions (Brevo + Jarvi sont la source de vérité)

---

## 2. Stack & contraintes techniques

### Stack imposée (non négociable)

- **Frontend & Backend** : Nuxt 3 (Vue 3, Composition API, `<script setup>`)
- **Routes serveur** : Nitro (intégré Nuxt) — fichiers dans `/server/api/`
- **Hébergement** : Vercel Pro
- **CAPTCHA** : Cloudflare Turnstile (invisible)
- **Emails transactionnels** : Brevo (templates côté Brevo, appels API côté Nitro)
- **CRM** : Jarvi (API REST documentée sur `https://api-docs.jarvi.tech/`)
- **Rate limiting** : Vercel KV
- **Validation** : Zod (côté serveur)

### Contraintes critiques

⚠️ **PAS de React, PAS de Next.js, PAS de JSX**. Tout est en Vue 3 Composition API.

⚠️ **Composables Vue** (useState... → `ref`/`reactive`, useEffect → `watchEffect`/`watch`) — pas de hooks React.

⚠️ **Cohérence visuelle stricte** avec l'outil 2 (Plan de sourcing LinkedIn). Réutiliser les mêmes patterns de composants, typographie, palette.

⚠️ **Mutualisation des utils avec l'outil 2** : les fichiers `/server/utils/brevo.ts`, `jarvi.ts`, `ratelimit.ts`, `turnstile.ts` sont **partagés**. On les **étend**, on ne les réécrit pas. Cf. `spec-technique-route-nitro-outil-1.md` section 2.

---

## 3. Roadmap d'implémentation (ordre suggéré)

L'ordre ci-dessous est optimisé pour **minimiser les blocages** : on configure les services externes en parallèle des premières étapes de code, et on intègre le design en dernier (quand il sera disponible).

| Phase | Tâches | Effort | Dépendances |
|---|---|---|---|
| **0 — Setup** | Création comptes API (Jarvi, Brevo, Cloudflare Turnstile, Vercel KV) | 0,5 j | Accès comptes admin |
| **1 — Setup Jarvi** | Création des 4 statuts Project + custom field "Type de demande Lab" + récupération des UUIDs | 0,25 j | Compte Jarvi |
| **2 — Setup Brevo** | Création des 2 templates Brevo depuis HTML fourni + récupération IDs | 0,25 j | Compte Brevo |
| **3 — Variables env** | Configuration des variables d'environnement Vercel (toutes celles listées section 5) | 0,25 j | Phases 0, 1, 2 terminées |
| **4 — Schéma + utils** | Schéma Zod + email-blacklist + extensions Brevo/Jarvi/ratelimit | 0,5 j | Phase 3 |
| **5 — Route Nitro** | Implémentation de la route `/server/api/lab/stage-alternance.post.ts` | 0,5 j | Phase 4 |
| **6 — Composable Vue** | `useStageAlternance` (wrapper d'appel API + gestion des erreurs) | 0,25 j | Phase 5 |
| **7 — Pages Vue** | Intégration du HTML/CSS Claude Design dans 2 composants Vue | 1 j | Phase 6 + design Claude Design disponible |
| **8 — Tests + debugging** | Tests bout-en-bout + edge cases + déploiement preview | 0,5 j | Phase 7 |
| **TOTAL** | | **~3,75 jours** | |

### Notes sur l'ordre

- **Phases 0-3 peuvent être faites en parallèle** par le client Mariell (création des comptes + setup) pendant que tu attaques les phases 4-6 avec des valeurs en dur temporaires.
- **Phase 7 dépend du design Claude Design** : si le design n'est pas encore disponible, tu peux faire 1-6 sans bloquer, et intégrer en bout de chaîne.
- **Le test bout-en-bout (Phase 8)** doit être fait sur un environnement preview Vercel, pas en local (pour vérifier les variables d'env, le rate limit KV, et les appels externes en conditions réelles).

---

## 4. Pré-requis avant de coder

### Comptes nécessaires

1. **Compte Jarvi** (déjà existant côté Mariell) — accès admin pour créer statuts/custom fields
2. **Compte Brevo** (déjà existant côté Mariell) — accès admin pour créer templates
3. **Compte Cloudflare** — pour Turnstile (gratuit)
4. **Compte Vercel Pro** (déjà existant côté Mariell) — pour hosting + KV

### Setup Jarvi à faire AVANT de coder

Voir `spec-technique-route-nitro-outil-1.md`, **section 4** pour le détail. En résumé :

1. Dans Jarvi, créer **4 statuts Project** :
   - `Lab — Reçue` (statut par défaut à la création)
   - `Lab — En traitement`
   - `Lab — Servi`
   - `Lab — Refusé`

2. Dans Jarvi, créer **1 custom field Project** :
   - **Nom** : `Type de demande Lab`
   - **Type** : `multiplechoice`
   - **Valeurs** : `Stage/Alternance`, `Plan de sourcing`, `Évaluation attractivité`

3. Récupérer tous les UUIDs (visibles dans l'URL des pages de paramètres Jarvi) — à mettre dans les variables d'environnement.

### Setup Brevo à faire AVANT de coder

Voir `templates-brevo-outil-1.md`, **section "Configuration Brevo — Checklist setup"**. En résumé :

1. Vérifier l'expéditeur `bonjour@mariell.fr` (DNS SPF + DKIM sur `mariell.fr`)
2. Créer le Template 1 (Notification interne) depuis le HTML fourni
3. Créer le Template 2 (Confirmation prospect) depuis le HTML fourni
4. Récupérer les 2 IDs de templates

### Setup Cloudflare Turnstile

1. Créer une "site" sur Cloudflare Turnstile pour le domaine `mariell.fr`
2. Mode : Invisible (pas de challenge visible utilisateur)
3. Récupérer la **Site Key** (publique) et la **Secret Key** (privée)

---

## 5. Variables d'environnement complètes

À configurer dans **Vercel Project Settings → Environment Variables** (Production + Preview + Development).

⚠️ Variables marquées 🔁 sont **partagées avec l'outil 2** — vérifier qu'elles sont déjà configurées avant de les ajouter en doublon.

```bash
# === BREVO === (🔁 partagé outil 2)
BREVO_API_KEY=xkeysib-...
BREVO_SENDER_EMAIL=bonjour@mariell.fr
BREVO_NOTIF_RECIPIENT=[email-gerant]@mariell.fr
BREVO_ALERT_RECIPIENT=[email-gerant]@mariell.fr

# === BREVO TEMPLATES OUTIL 1 === (🆕 spécifique outil 1)
BREVO_TEMPLATE_ID_STAGE_NOTIF_INTERNE=...
BREVO_TEMPLATE_ID_STAGE_CONFIRMATION_PROSPECT=...

# === JARVI === (🔁 partagé outil 2)
JARVI_API_KEY=...
JARVI_API_BASE_URL=https://functions.prod.jarvi.tech/v1/public-api/rest/v2

# === JARVI OUTIL 1 === (🆕 spécifique outil 1)
JARVI_FIELD_ID_TYPE_DEMANDE_LAB=...
JARVI_FIELD_VALUE_STAGE_ALTERNANCE=...
JARVI_STATUS_ID_LAB_RECUE=...
JARVI_CLIENT_STATUS_IDS=uuid1,uuid2,uuid3
JARVI_LAB_ACTIVE_STATUS_IDS=uuid_recue,uuid_en_traitement

# === CLOUDFLARE TURNSTILE === (🔁 partagé outil 2)
TURNSTILE_SECRET_KEY=0x...
NUXT_PUBLIC_TURNSTILE_SITE_KEY=0x...

# === VERCEL KV === (🔁 partagé outil 2, auto-injecté)
KV_REST_API_URL=...
KV_REST_API_TOKEN=...

# === URL PUBLIQUE === (🔁 partagé outil 2)
NUXT_PUBLIC_SITE_URL=https://mariell.fr
```

---

## 6. Index des livrables — Quel fichier lire pour quoi

Tu as **5 fichiers de cadrage** pour cet outil. Voici l'ordre de lecture recommandé et le rôle de chacun.

### Ordre de lecture recommandé

| # | Fichier | Quand le lire | Pourquoi |
|---|---|---|---|
| 1 | **`INSTRUCTIONS-DEV-outil-1.md`** *(ce fichier)* | EN PREMIER | Vue d'ensemble + roadmap + setup |
| 2 | `recap-global-projet-mariell.md` | Avant de commencer | Contexte stratégique global du projet |
| 3 | `formulaire-specs-outil-1.md` | Avant de coder le frontend | Détail technique des 11 champs (validation, regex, messages d'erreur, UX) |
| 4 | `templates-brevo-outil-1.md` | Avant de configurer Brevo | HTML complet des 2 templates + variables + checklist setup |
| 5 | `spec-technique-route-nitro-outil-1.md` | Avant de coder le backend | Architecture complète, code Nitro, logique Jarvi détaillée |
| 6 | `brief-claude-design-outil-1-stage-alternance.md` | Référence design uniquement | Brief utilisé pour produire le HTML/CSS via Claude Design |

### Rôle de chaque fichier

#### 📘 `INSTRUCTIONS-DEV-outil-1.md` *(ce fichier)*

**Rôle** : Point d'entrée. Roadmap, setup, variables d'env, critères de validation.
**À utiliser quand** : Au démarrage du projet, et comme checklist de pilotage tout au long de l'implémentation.

#### 📗 `formulaire-specs-outil-1.md`

**Rôle** : Spec exhaustive du formulaire côté UX/frontend.
**À utiliser pour** :
- Connaître la liste exacte des 11 champs avec leur type, validation, messages d'erreur
- Implémenter la validation côté client (Vue)
- Comprendre le comportement UX attendu (compteur de caractères, état du bouton CTA, validation au blur, champ conditionnel "Profil — Autre")

#### 📕 `templates-brevo-outil-1.md`

**Rôle** : Tout ce qui touche aux emails Brevo.
**À utiliser pour** :
- Créer les 2 templates Brevo (HTML complet fourni, prêt à coller)
- Connaître les variables Brevo à passer côté Nitro
- Suivre la checklist de setup Brevo
- Comprendre le mapping `params` → variables HTML

#### 📙 `spec-technique-route-nitro-outil-1.md`

**Rôle** : Spec backend complète. Le document le plus dense (15 sections).
**À utiliser pour** :
- Comprendre l'architecture des fichiers (mutualisation avec outil 2)
- Implémenter la route Nitro principale (pseudocode TypeScript fourni)
- Implémenter les fonctions Jarvi (lookup, anti-doublon, upsert Company, création Project)
- Connaître la logique de rate limiting
- Implémenter le honeypot et la vérification Turnstile
- Connaître les helpers à mutualiser avec l'outil 2

#### 📓 `brief-claude-design-outil-1-stage-alternance.md`

**Rôle** : Brief envoyé à Claude Design pour produire le HTML/CSS des 2 pages (formulaire + confirmation).
**À utiliser pour** : Référence uniquement. Tu ne dois PAS utiliser ce brief directement — tu utilises l'**output HTML/CSS** produit par Claude Design à partir de ce brief, qui sera à intégrer dans 2 composants Vue.

---

## 7. Critères de validation

L'outil est considéré comme **livré** quand les 3 catégories de tests ci-dessous passent.

### Tests fonctionnels (à automatiser ou tester manuellement)

Liste détaillée dans `spec-technique-route-nitro-outil-1.md`, **section 14**. Résumé :

| # | Test | Résultat attendu |
|---|---|---|
| 1 | Soumission valide complète | Redirection vers confirmation + 2 emails reçus + Project Jarvi créé |
| 2 | Email perso (gmail.com) | Erreur 400 avec message "Cet outil est réservé aux entreprises..." |
| 3 | Honeypot rempli (simulation bot) | 200 trompeur, aucun side effect |
| 4 | Turnstile invalid | Erreur 403 |
| 5 | 4e soumission depuis même IP en 24h | Erreur 429 (rate limit) |
| 6 | Doublon entreprise (Project Lab actif existe) | Erreur 409 avec message dédié |
| 7 | Jarvi en panne | Fail-soft : soumission acceptée + alerte critique envoyée au gérant |
| 8 | Brevo en panne sur 1 des 2 emails | Fail-soft : autre email envoyé + alerte critique |
| 9 | Brief mission < 20 caractères | Erreur 400 (Zod) |
| 10 | Brief mission > 500 caractères | Erreur 400 (Zod) |
| 11 | Company existante avec statusId client | Email notif affiche "Client / ancien client" |
| 12 | Company existante avec autre statut | Email notif affiche "Contact connu" |
| 13 | Company nouvelle | Email notif affiche "Nouveau prospect" |

### Tests UX (manuels avant déploiement prod)

Liste détaillée dans `formulaire-specs-outil-1.md`, **section "Tests UX recommandés"**. Résumé :

- ✅ Test sur mobile (iPhone, Android) — sélecteur téléphone fonctionnel
- ✅ Test accessibilité clavier (Tab, Shift+Tab, Espace, Enter)
- ✅ Test screen reader (le honeypot doit être ignoré grâce à `aria-hidden`)
- ✅ Test sur navigateurs : Chrome, Firefox, Safari, Edge
- ✅ Compteur de caractères du textarea : couleurs gris/orange/rouge correctes
- ✅ Champ conditionnel "Profil — Autre" : apparaît/disparaît correctement
- ✅ État du bouton CTA : transitions Disabled → Idle → Loading → Redirection

### Tests cohérence visuelle

- ✅ Page formulaire visuellement cohérente avec le formulaire de l'outil 2 (typographie, palette, composants)
- ✅ Page de confirmation cohérente avec l'identité Mariell (sobre, premium)
- ✅ Bouton CTA principal avec 3 états distincts (Disabled / Idle / Loading "Envoi en cours...")
- ✅ Aucune page de chargement intermédiaire entre soumission et page de confirmation

---

## 8. Points de vigilance

### 8.1 — Mutualisation avec l'outil 2

⚠️ Plusieurs utils sont **partagés** entre les outils 1 et 2 (Brevo, Jarvi, ratelimit, turnstile). **Étendre l'existant, ne pas réécrire.** Vérifier l'état du code outil 2 avant de toucher à ces fichiers — risque de casser l'outil 2 sinon.

Fichiers concernés :
- `/server/utils/brevo.ts` → ajouter les fonctions `sendBrevoStageNotifInterne` et `sendBrevoStageConfirmationProspect`
- `/server/utils/jarvi.ts` → ajouter les fonctions `findCompanyByNameOrDomain`, `resolveCompanyStatusLabel`, `hasActiveLabProject`, `upsertCompany`, `createProject`
- `/server/utils/ratelimit.ts` → ajouter `checkStageAlternanceRateLimit` (avec préfixe KV `stage-alt:`)
- `/server/utils/turnstile.ts` → réutiliser la fonction existante `verifyTurnstile` sans modification

### 8.2 — Architecture fail-soft

L'outil est conçu pour être **résilient aux pannes externes**. Une panne Jarvi ou Brevo ne doit pas bloquer la soumission utilisateur — elle doit déclencher une alerte critique au gérant Mariell mais permettre au prospect de soumettre.

Cas fail-soft :
- Jarvi en panne sur lookup → on continue avec `existingCompany = null` (Company traitée comme "Nouveau prospect")
- Jarvi en panne sur création Company → on log + alerte, mais on continue (companyId à null)
- Jarvi en panne sur création Project → on log + alerte, mais les emails partent quand même
- 1 des 2 emails Brevo échoue → l'autre part quand même + alerte sur celui qui a échoué
- Variable `JARVI_CLIENT_STATUS_IDS` vide → toutes les Companies existantes apparaissent comme "Contact connu"

### 8.3 — Anti-doublon Jarvi : nuance importante

Le check anti-doublon NE doit PAS bloquer un client ou utilisateur existant qui a une fiche Jarvi pour autre chose. Il doit **uniquement** bloquer s'il existe déjà un Project Jarvi avec :
- `statusId` IN (`Lab — Reçue`, `Lab — En traitement`)
- ET custom field "Type de demande Lab" = `Stage/Alternance`
- ET rattaché à la même Company

Détail dans `spec-technique-route-nitro-outil-1.md`, **section 9.3**.

### 8.4 — Rate limit en mode blocage simple

Contrairement à l'outil 2, **pas de mode "traitement différé"** sur l'outil 1. Si rate limit dépassé → blocage simple avec message d'erreur. Pas de capture de lead, pas de side effect.

### 8.5 — API Jarvi : changements possibles

⚠️ La doc API Jarvi mentionnait des changements prévus été 2025. Au moment du dev, **vérifier** que la structure des payloads `POST /companies` et `POST /projects` correspond toujours à ce qui est dans la spec. URL : `https://api-docs.jarvi.tech/`.

### 8.6 — Pages Vue : pas de page de chargement

⚠️ **Aucune page de chargement intermédiaire** entre la soumission et la page de confirmation. La transition se fait uniquement via le changement d'état du bouton CTA (`Idle` → `Loading` "Envoi en cours..." → redirection).

---

## 9. Estimation effort & planning

### Estimation totale : ~3,75 jours

Détail par phase dans la **section 3** ci-dessus.

### Planning suggéré (sur 1 semaine)

| Jour | Phases couvertes | Livrables |
|---|---|---|
| **Jour 1 matin** | 0 + 1 + 2 + 3 (setup) | Tous les comptes + variables d'env configurés |
| **Jour 1 après-midi** | 4 (schémas + utils) | Schéma Zod + email-blacklist + extensions utils |
| **Jour 2** | 5 + 6 (route Nitro + composable) | Route fonctionnelle testée en local avec Postman/Bruno |
| **Jour 3** | 7 (pages Vue) | 2 composants Vue intégrant le HTML/CSS Claude Design |
| **Jour 4 matin** | 8 (tests + debug) | Tous les tests fonctionnels passent |
| **Jour 4 après-midi** | Déploiement preview Vercel + tests UAT | URL preview validée par le client |
| **Jour 5** | Buffer / corrections / déploiement prod | Mise en prod sur `mariell.fr/lab/demande-stage-alternance` |

### Buffer recommandé

+0,5 à 1 jour pour les imprévus (bugs Jarvi, problèmes DNS Brevo, ajustements design).

---

## 10. Questions fréquentes / blocages potentiels

### Q1 — Le HTML/CSS Claude Design n'est pas disponible, je peux commencer ?

**Oui.** Tu peux faire les phases 0 à 6 sans le design. Pour la phase 7 (pages Vue), tu peux soit attendre, soit créer un design temporaire fonctionnel basé sur les wirings du brief design (à remplacer ensuite).

### Q2 — La variable `JARVI_CLIENT_STATUS_IDS` est vide au démarrage, c'est bloquant ?

**Non.** Mode fail-soft : si la variable est vide, toutes les Companies existantes apparaissent comme "Contact connu" dans les emails de notification. Le client Mariell pourra remplir la variable plus tard sans redéployer.

### Q3 — Comment tester le rate limit en local ?

Vercel KV est cloud-hosted. Tu peux soit pointer vers le KV de prod (mais attention aux clés) soit mocker `kv.incr` côté local. Recommandation : tester le rate limit uniquement sur l'environnement preview Vercel.

### Q4 — Les UUIDs Jarvi sont introuvables dans l'app, où les chercher ?

Ils apparaissent dans l'URL quand tu cliques sur un statut ou custom field dans les paramètres Jarvi. Format : `https://app.jarvi.tech/#/settings/.../<UUID>`. Si pas trouvable, contacter le support Jarvi.

### Q5 — L'API Jarvi répond avec une structure différente de la spec, que faire ?

La doc Jarvi mentionnait des changements été 2025. Si la structure réelle diverge :
1. Consulter la doc à jour : `https://api-docs.jarvi.tech/`
2. Adapter les types et le mapping côté `/server/utils/jarvi.ts`
3. Mettre à jour la spec en conséquence (ou alerter le client Mariell pour qu'il la mette à jour)

### Q6 — Faut-il intégrer l'outil 1 à la page vitrine `/lab` ?

**Pas dans le périmètre de cet outil.** La carte d'entrée pour l'outil 1 sur la page `/lab` sera intégrée dans une mission séparée (page vitrine du Lab). Mais le wording de la carte est déjà défini si besoin (voir conversation de cadrage du projet).

---

## 11. Contact / questions

Tout blocage, doute ou ambiguïté → contacter le client Mariell directement. Ne pas faire de suppositions sur le wording, l'UX, ou l'identité visuelle sans confirmation.

Wording du formulaire, messages d'erreur, et ton des emails sont **figés et validés**. Ne pas modifier sans accord explicite.

---

## ✅ Checklist de démarrage

Avant ton premier commit, vérifie que :

- [ ] J'ai lu ce fichier en entier
- [ ] J'ai lu `recap-global-projet-mariell.md` pour le contexte stratégique
- [ ] J'ai lu `spec-technique-route-nitro-outil-1.md` (au moins en diagonale)
- [ ] J'ai accès aux comptes Jarvi, Brevo, Cloudflare, Vercel
- [ ] Les statuts Project Jarvi et le custom field sont créés
- [ ] Les 2 templates Brevo sont créés et leurs IDs récupérés
- [ ] Les variables d'environnement Vercel sont toutes configurées
- [ ] Je comprends la stack (Vue 3 + Nitro, pas de React)
- [ ] Je comprends la mutualisation des utils avec l'outil 2
- [ ] Je connais les critères de validation (section 7)

Une fois tous ces points cochés, tu peux commencer à coder.

---

**Bonne implémentation. — L'équipe de cadrage Mariell**
