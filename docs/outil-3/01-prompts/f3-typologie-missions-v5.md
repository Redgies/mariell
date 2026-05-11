# Typologie missions premium 2026 — Référentiel Mariell

**Statut** : V5 — ajustement scoring Dimension 7 : Full remote passe de `+1` à `0` (compromis safe entre cas où il est valorisé et cas où il pénalise selon contexte/poste)
**Usage** : injection dans le system prompt LLM de l'outil 3 (Évaluation d'attractivité)
**Mise à jour** : annuelle minimum, ad-hoc dès qu'un signal de marché majeur survient
**Confidentialité** : interne Mariell, jamais cité tel quel au prospect

---

## ⚙️ INSTRUCTION LLM — Comment lire ce document

> ⚠️ **PRINCIPE DIRECTEUR TRANSVERSAL — RESSOURCE D'AIDE, JAMAIS DE FREIN**
>
> Ce document (comme les Fichiers 1, 2 et 4) est une **ressource pour améliorer la précision de l'évaluation**, jamais pour la freiner.
>
> - Si le brief du prospect te permet d'évaluer une dimension → **applique le score** (`+1`, `0`, `−1`).
> - Si une dimension n'est pas évaluable (info absente, signal ambigu) → **score `0` neutre** sur cette dimension uniquement, et poursuis l'évaluation des autres dimensions.
> - Le LLM ne perd jamais ses moyens face à un brief incomplet. Il rend toujours une évaluation, même partielle. Il n'invente jamais un signal.
>
> **Spécificité du Fichier 3 — bonus, malus ou neutre par dimension** :  
> Le score global d'une mission peut être positif, négatif ou neutre. Une dimension non évaluable est neutre (0), pas un malus.

Ce document fonctionne en **lookup à deux niveaux** :

1. **Niveau rapide (défaut)** : Utilise le **tableau maître** ci-dessous pour scorer chaque dimension. Ce tableau couvre 70-80% des cas avec des signaux clairs.

2. **Niveau approfondi (cas ambigu)** : Si le signal du brief est ambigu (signal partiel, contradiction, terminologie non standard, doute sur la séniorité visée), consulte la **section détaillée** correspondante plus bas pour les exemples concrets et les cas particuliers.

**Brief flou** : Si une dimension n'est pas évaluable par manque de signal, attribue `0` (neutre, ni bonus ni malus) et continue l'évaluation. Ne jamais inventer un signal.

---

## 📊 TABLEAU MAÎTRE — Scoring des 7 dimensions

| # | Dimension | Question clé | Signal `+1` (positif fort) | Signal `0` (neutre) | Signal `−1` (négatif fort) |
|---|---|---|---|---|---|
| **1** | **Maturité du processus Sales** | Y a-t-il un cadre Sales structuré ? | Playbook, MEDDPICC/MEDDIC/BANT/SPICED/GAP Selling, onboarding formel, sales enablement, équipe Sales mature | Process implicite, équipe Sales établie sans détails méthodologiques | "Premier Sales", "à structurer", "définir le process", équipe Sales <3 pour Senior/Lead |
| **2** | **Qualité du pipeline / lead source** | D'où viennent les opportunités ? | SDR/BDR existant (ratio sain), inbound marketing actif, "leads qualifiés fournis", dispositif growth structuré | "Outbound + inbound" mixte standard, équipe Sales basique | 100% outbound froid, aucun SDR/BDR, aucun marketing inbound, équipe Sales sans support marketing |
| **3** | **Cycle et complexité de vente** | Quel niveau de complexité commerciale ? | Cycle 6+ mois, ticket >100k€, multi-stakeholders, RFP/ABM, grands comptes, Enterprise | Cycle 1-6 mois, ticket 20-100k€, Mid-Market standard, **OU** cycle court PME (sauf si poste AE Enterprise → `−1`) | AE Enterprise avec cycle court transactionnel = incohérence majeure (séniorité/cycle) |
| **4** | **Autonomie / périmètre / impact** | Quel niveau de liberté et d'impact ? | "Co-construire la stratégie", responsabilité géo/vertical, contribution feedback produit, autonomie pricing/négociation, impact ARR mesurable | "Atteindre les objectifs", "gérer un portefeuille", périmètre clair sans extension stratégique | "Suivre les scripts", micromanagement implicite, multiples couches managériales, "pas de négociation pricing" |
| **5** | **Stack outils et modernité** | Environnement Sales moderne ? | CRM propre (HubSpot/SF), Sales engagement (Outreach/Salesloft/lemlist), conversation intelligence (Modjo/Gong), IA intégrée, enrichissement data | CRM mentionné sans détails, outils de base, pas de signal négatif | Excel comme outil principal, "à mettre en place", CRM absent ou inadapté |
| **6** | **Trajectoire et évolution** | Que ouvre le poste comme suite ? | Promotion interne récente citée, grille d'évolution explicite, mentor/VP Sales/CRO crédible visible, accompagnement carrière | "Possibilités d'évolution", "perspectives selon performance", structure standard sans plan explicite | Pas de VP/CRO pour poste senior, équipe junior sans Lead identifié, "structure plate", trajectoire bloquée |
| **7** | **Modalité de travail** | Quelle flexibilité offerte ? | (aucune option ne donne `+1` — voir mapping détaillé Dimension 7) | Full remote / Hybride flexible / Hybride équilibré (les 3 modalités flexibles sont neutres) | Présentiel (4-5 jours bureau / sem) — significativement défavorable sur Senior/Lead, Tech/SaaS, et profils tendus |

### Demi-niveaux autorisés

`+0.5` ou `−0.5` quand le signal est partiel ou ambigu mais qu'un score complet serait excessif.

### Calcul du score global

> **Score Mission Premium** = somme des 7 dimensions, plafonné entre `−7` et `+6`
>
> Note : la borne haute est asymétrique (`+6` au lieu de `+7`) parce que la Dimension 7 ne produit pas de score positif (Full remote = `0` par compromis, voir Dimension 7 ci-dessous).

| Score | Lecture | Signal |
|---|---|---|
| **+5 à +6** | Mission exceptionnelle | Forte attractivité indépendamment de marque/secteur |
| **+3 à +4** | Mission premium | Bonne attractivité, candidat target solide |
| **+1 à +2** | Mission correcte | Standard, différenciation par autres dimensions |
| **0** | Mission moyenne | À compenser par marque ou package |
| **−1 à −2** | Mission tiède | Alerte modérée, à compenser fortement |
| **−3 à −5** | Mission faible | Alerte forte, exiger contre-pied (package +20%, marque très forte) |
| **−6 à −7** | Mission rebutante | Repoussera les Sales premium quel que soit le package |

---

## ⚠️ Points de vigilance — Cohérence séniorité × mission

> Ces points ne sont **pas des règles d'incohérence absolue**, mais des signaux que le LLM **suppose** plutôt qu'il **affirme**. Le LLM les remonte au prospect avec souplesse, comme une question à se poser, jamais comme un verdict.

| Séniorité visée | Signal de vigilance | Formulation suggérée pour le prospect |
|---|---|---|
| **Junior 0-2 ans** | Mission demandant fort impact stratégique (Dim. 4 = `+1`) ou cycle long enterprise (Dim. 3 = `+1`) | "La mission décrite suggère une complexité qui pourrait dépasser le cadre habituel d'un profil Junior. À considérer : la durée nécessaire de montée en puissance pourrait être plus longue qu'anticipée." |
| **Confirmé 2-5 ans** | Pas de signal de vigilance fort attendu (profil polyvalent) | — |
| **Senior 5-8 ans** | Mission demandant pure exécution (Dim. 4 = `−1`), pipeline 100% outbound froid (Dim. 2 = `−1`), stack obsolète (Dim. 5 = `−1`) | "Certains éléments du brief pourraient suggérer un cadre d'exécution plus restreint que ce qu'attend généralement un profil Senior. Question à se poser : la mission offre-t-elle bien la marge de manœuvre attendue à ce niveau ?" |
| **Lead 8+ ans** | Pas de VP/CRO visible (Dim. 6 = `−1`), équipe Sales très restreinte (<5), pas d'autonomie stratégique (Dim. 4 ≤ 0) | "À ce niveau de séniorité, les candidats sont particulièrement attentifs à la trajectoire et à la latitude stratégique offertes. Il pourrait être utile de clarifier ces dimensions dans la communication du poste." |

### Règle de communication des points de vigilance

Le LLM **n'affirme jamais** une incohérence. Il **suggère**, **pose une question**, **invite à clarifier**. Le but est d'aider le prospect à muscler son brief, pas de juger sa capacité à recruter.

---

# 📚 SECTIONS DÉTAILLÉES (consultation en cas d'ambiguïté)

> Les sections ci-dessous fournissent des exemples concrets et des cas particuliers pour chaque dimension. Le LLM les consulte uniquement quand le tableau maître ne suffit pas à trancher (signal partiel, terminologie non standard, contradiction interne au brief).

---

## DIMENSION 1 — Maturité du processus Sales

### Ce qu'on évalue

La présence d'un cadre Sales structuré qui réduit la charge cognitive du candidat et lui permet de performer rapidement. Plus le processus est mature, plus le Sales se concentre sur l'exécution plutôt que sur la construction du système.

### Exemples détaillés

**Signal `+1` — Process mature et structuré**
- Mention explicite d'un framework de qualification (MEDDPICC, MEDDIC, BANT, SPICED, GAP Selling, Challenger Sale)
- Onboarding formel >2 semaines documenté
- Sales enablement et formation continue
- Documentation Sales (playbook, battle cards, case studies)
- Équipe Sales >5 personnes avec hiérarchie claire (SDR, AE, Lead, Head)

**Signal `0` — Process correct mais standard**
- Process implicite (équipe en place, ça fonctionne, mais aucun framework cité)
- Équipe Sales établie sans détails sur la méthodologie
- Pas de mention spécifique mais structure visible (5-10 personnes Sales)

**Signal `−1` — Process à construire ou inexistant**
- "Vous serez le premier Sales"
- "À structurer", "Définir le process Sales"
- Équipe Sales <3 personnes pour un Senior/Lead
- Missions floues type "tout faire"
- Mention "from scratch" pour la fonction Sales

### Cas particuliers

- **Boîte early-stage qui revendique explicitement "process à construire" pour un Lead/VP** : cohérent avec le profil. Score `0` (signal correctement adressé) plutôt que `−1`.
- **Boîte mature qui ne décrit pas son process** : ne pas pénaliser injustement. Traiter comme **brief flou** (signal `0` par défaut), suggérer au prospect d'enrichir son brief.

---

## DIMENSION 2 — Qualité du pipeline / lead source

### Ce qu'on évalue

D'où viennent les opportunités qu'on confie au Sales. Un pipeline alimenté par marketing inbound + équipe SDR dédiée est radicalement différent d'un pipeline 100% outbound à construire à froid.

### Exemples détaillés

**Signal `+1` — Pipeline mixte qualifié et alimenté**
- Équipe SDR/BDR existante avec ratio sain (1 SDR pour 1-2 AE)
- Inbound marketing actif (mentions de "leads inbound", "MQL convertis en SQL")
- "Leads qualifiés fournis"
- Dispositif growth/marketing structuré
- Mention d'un Head of Marketing ou d'une équipe Demand Gen

**Signal `0` — Pipeline standard mixte**
- "Outbound + inbound" sans détails
- "Prospection et fidélisation" sans précision sur la source
- Équipe Sales basique sans dispositif growth précis

**Signal `−1` — Pipeline 100% outbound à froid**
- "Chasse pure", "100% outbound"
- Aucun SDR/BDR mentionné
- Aucun marketing inbound mentionné
- Équipe Sales sans support marketing visible

### Cas particuliers

- **Poste de SDR/BDR pur** : par nature, le métier consiste à faire l'outbound à froid. Ne pas appliquer le malus `−1`. Considérer score `0` neutre (c'est le métier).
- **Poste AE Senior avec score `−1`** : signal d'alerte fort. Le LLM doit le remonter explicitement comme point de vigilance (cohérence séniorité/lead source).

---

## DIMENSION 3 — Cycle et complexité de vente

### Ce qu'on évalue

La nature et la durée du cycle de vente. Un cycle court transactionnel (PME, ticket <30k€/an, signature en <30 jours) attire des profils énergiques. Un cycle long enterprise (ticket >100k€/an, multi-stakeholders, 6-18 mois) attire des profils stratégiques et signe des CV solides.

### Exemples détaillés

**Signal `+1` — Cycle long enterprise / Mid-Market complexe**
- Cycle 6+ mois mentionné
- Ticket >100k€/an
- Vente multi-stakeholders, comités d'achat
- RFP/RFI, stratégie ABM
- Grands comptes, segments Enterprise
- Mention de "deal complexes", "vente stratégique"

**Signal `0` — Cycle Mid-Market standard OU cycle court PME**
- Cycle 1-6 mois, ticket 20-100k€/an
- Vente bilatérale ou tri-latérale, segment Mid-Market classique
- **OU** cycle court PME / TPE (<30 jours, ticket <20k€) **sauf si AE Enterprise visé**

**Signal `−1` — Incohérence cycle court × poste AE Enterprise**
- AE Enterprise avec cycle court transactionnel = incohérence majeure
- "High velocity" + intitulé Senior/Lead Enterprise
- Selfserve avec inside sales pour un poste affiché comme stratégique

### Cas particuliers

- **AM (Account Manager)** : gère un portefeuille existant, pas un cycle de prospection. Lire la dimension sur la complexité de la relation (Enterprise stratégique vs PME volumique). Le score de cycle se lit alors sur la complexité du portefeuille géré, pas sur le cycle de signature.
- **CSM (Customer Success Manager)** : pas de cycle de prospection ni de signature. La dimension cycle se lit sur la **complexité du parcours client géré** (PME volumique vs Enterprise stratégique avec QBR, expansion, comités). Score `0` neutre par défaut, `+1` si Enterprise stratégique avec mission d'expansion / upsell, `−1` si pure rétention transactionnelle PME volumique.
- **Channel / Partner Manager** : pas de cycle de prospection direct. La dimension cycle se lit sur la **complexité du programme partenaires** (gestion d'un portefeuille restreint de partenaires stratégiques = `+1`, gestion volumique d'un grand nombre de petits partenaires sans levier = `0` à `−0.5`).
- **Sales Tech / Outbound Tools** (lemlist, Waalaxy, Pharow) : cycles courts par nature mais restent attractifs grâce à la dimension produit + stack moderne. Compense via Dim. 5.
- **Cycle court transactionnel hors AE Enterprise** : score `0`, c'est un cycle valide (SaaS PME, vélocité, inside sales). Ne pas pénaliser sauf incohérence avec la séniorité visée.

---

## DIMENSION 4 — Autonomie / périmètre / impact

### Ce qu'on évalue

Le niveau d'autonomie réel du Sales et l'impact mesurable de son action. Un Sales qui co-construit la stratégie commerciale, qui pèse dans les choix produit/pricing, qui voit son impact sur l'ARR vit une mission différente de l'exécutant pur.

### Exemples détaillés

**Signal `+1` — Forte autonomie, périmètre large, impact mesurable**
- "Co-construire la stratégie", "définir avec le VP Sales"
- "Ouvrir un nouveau marché"
- Responsabilité géo ou vertical
- Contribution feedback produit
- Accès aux données ARR/pipeline
- Autonomie sur le pricing/négociation

**Signal `0` — Autonomie standard, périmètre défini**
- "Atteindre les objectifs"
- "Gérer un portefeuille"
- Périmètre clair sans extension stratégique
- Exécution dans un cadre déjà posé

**Signal `−1` — Exécutant pur, périmètre restreint, faible impact**
- "Suivre les scripts", "respecter le process"
- Micromanagement implicite
- Équipe Sales très hiérarchique
- Multiples couches managériales pour un poste senior
- "Pas de négociation pricing autorisée"

### Cas particuliers

- **Junior/Confirmé** : peut légitimement avoir `0` sur cette dimension. On n'attend pas d'autonomie stratégique en début de carrière. Mais `−1` reste un signal négatif même pour un Junior (signe de micromanagement).
- **Lead/VP avec score `0`** : sous-régime caractérisé. Les profils Lead/VP attirés par cette mission seront ceux qui veulent se reposer, pas les meilleurs. Point de vigilance à remonter.

---

## DIMENSION 5 — Stack outils et modernité

### Ce qu'on évalue

La modernité de l'environnement Sales. Un Sales premium en 2026 attend un CRM propre, un outil de Sales engagement, un outil de conversation intelligence, un enrichissement data, et idéalement de l'IA intégrée dans le workflow.

### Exemples détaillés

**Signal `+1` — Stack moderne complète**
- CRM propre mentionné explicitement (HubSpot, Salesforce)
- Sales engagement : Outreach, Salesloft, lemlist, Waalaxy
- Conversation intelligence : Modjo, Gong
- IA intégrée : copilot Sales, scoring IA, génération automatisée
- Enrichissement data : FullEnrich, Pharow, Zeliq
- Dashboards live, BI Sales

**Signal `0` — Stack standard**
- CRM mentionné sans détails
- Outils de base
- Pas de signal négatif particulier

**Signal `−1` — Stack obsolète ou inexistante**
- Excel comme outil principal
- "À mettre en place"
- CRM inadapté ou absent
- Pas d'outil de prospection moderne
- Environnement digital non structuré

### Cas particuliers

- **Industrie / Industrial SaaS / Manufacturing tech** : stack souvent moins moderne par nature. Pondérer en fonction du secteur (cohérent avec Fichier 2). Score `0` acceptable pour secteur traditionnel ; `−1` reste négatif.
- **Sales Tech / Sales Ops** : `+1` quasi automatique car cohérent avec leur cœur de métier. Pas de bonus illégitime.

---

## DIMENSION 6 — Trajectoire et évolution

### Ce qu'on évalue

Ce que le poste ouvre comme suite. Un Sales premium ne pense pas à un job, il pense à une trajectoire. La présence d'un VP Sales / CRO crédible, d'un mentor identifié, d'une grille d'évolution claire change la perception du poste.

### Exemples détaillés

**Signal `+1` — Trajectoire claire avec preuves**
- Promotion interne récente citée ("notre VP Sales a commencé en SDR")
- Grille d'évolution explicite (AE → Senior AE → Team Lead → Head of)
- Mentorat formel
- Programmes de leadership
- VP/CRO visible et reconnu (LinkedIn, conférences, Top Voice)
- Accompagnement carrière

**Signal `0` — Trajectoire implicite ou standard**
- "Possibilités d'évolution"
- "Perspectives selon performance"
- Équipe Sales structurée sans plan d'évolution explicite

**Signal `−1` — Mission plafond ou trajectoire floue**
- Pour Senior/Lead 8+ ans : aucune mention d'évolution
- Équipe très junior sans Lead identifié pour mentorer un Senior
- "Structure plate"
- Absence de VP Sales / CRO pour un poste senior

### Cas particuliers

- **Lead/VP/CRO recruté pour structurer la fonction Sales** : en haut de l'organigramme par nature. Lire la trajectoire comme "construction d'une équipe + perspective vers Chief Revenue Officer / Board / equity meaningful". Score `+1` si ces signaux sont présents.
- **Boîte early-stage avec fondateurs Sales ex-licorne** : ouvre une trajectoire forte par signal indirect. Score `+1` même sans mention explicite, si le fondateur a un parcours Sales reconnu (vérifiable via LinkedIn).

---

## DIMENSION 7 — Modalité de travail

### Ce qu'on évalue

Le degré de flexibilité offert par le poste : full remote, hybride flexible, hybride équilibré, ou présentiel intégral. Cette dimension est saisie via un **champ structuré du formulaire** (4 options imposées), pas inférée. Le LLM applique le score directement selon la valeur sélectionnée.

**Logique du scoring** : sur le marché Sales français 2026, l'hybride (sous toutes ses formes) est devenu le **standard du marché**, donc neutre. Le présentiel intégral pénalise l'attractivité. Le full remote, contrairement à ce qu'on pourrait penser, est traité comme **neutre par compromis** : il peut être un atout sur certains profils (Senior+ Tech, secteurs tendus) mais aussi un frein sur d'autres (Junior, postes terrain, postes nécessitant de l'apprentissage par mimétisme). On évite donc la sur-valorisation systématique du remote.

### Mapping direct

| Valeur du champ "Modalité de travail" | Score Dimension 7 |
|---|---|
| **Full remote** | `0` (neutre par compromis : avantage pour certains profils, frein pour d'autres) |
| **Hybride flexible (1-2 jours bureau / sem)** | `0` (standard du marché) |
| **Hybride équilibré (3 jours bureau / sem)** | `0` (standard du marché) |
| **Présentiel (4-5 jours bureau / sem)** | `−1` |

### Modulation contextuelle (cas particuliers)

Le score de base est ajusté de `+0.5` ou `−0.5` selon les contextes suivants :

**Atténuation du présentiel à `−0.5`** (alerte modérée plutôt que forte) :
- Présentiel **+** poste Junior 0-2 ans : l'attente de remote est moindre → `−0.5` au lieu de `−1`
- Présentiel **+** secteur traditionnel (Industrie, Conseil IT, Services) : norme acceptable → `−0.5` au lieu de `−1`
- Présentiel **+** poste où la dimension terrain est légitime (Field Sales, Channel Manager, Strategic Account Manager) : présentiel cohérent avec la mission → `0` (neutre, pas de pénalisation)

**Aucun bonus possible** : la Dimension 7 ne peut jamais dépasser `0`. Pas de cas où le full remote ou un hybride donne `+0.5` ou `+1`.

**Aggravation à `−1.5` — non autorisé** : la dimension est plafonnée à `−1` même dans les cas extrêmes (présentiel intégral pour un Sales Tech Senior à Paris). Le malus se cumule alors avec ceux des autres dimensions naturellement.

### Cas particuliers

- **Full remote sans précision sur le siège** : si le prospect choisit "Full remote" mais ne précise pas la localisation du siège, c'est neutre — le LLM n'a pas de modulateur géo F4 à appliquer (ni Paris +5-10%, ni autre). C'est cohérent.
- **Full remote pour un poste Junior 0-2 ans** : score `0` quand même (neutre). Pas de pénalisation supplémentaire pour le Junior en remote, mais pas de bonus non plus.
- **Présentiel imposé "pour la culture d'équipe"** : ne change pas le score `−1`. Le marché Sales 2026 ne valorise pas cet argument autant qu'avant 2020.
- **Hybride avec jours imposés vs flexibles** : pour la simplicité du scoring, on ne distingue pas "hybride 2 jours imposés" de "hybride 2 jours libres". Si le prospect a coché "Hybride flexible (1-2 jours)", on applique `0`.

### Lien avec les autres dimensions

- **Cohérence Dimension 7 × F4 (modulateur géo)** : si Full remote, le LLM doit ignorer le modulateur géo F4 (pas de Paris +5-10% si le candidat ne mettra jamais les pieds au bureau). Cette règle est précisée dans F4.
- **Cohérence Dimension 7 × type de cycle** : Full remote pour un Field Sales / Outside Sales est une incohérence (le poste implique des RDV terrain). Le LLM peut signaler ce type d'incohérence en alerte sortie, sans pour autant changer le score de la dimension 7 (qui reste `0`).
- **Différenciation contextuelle** : si tu identifies dans le commentaire que le full remote est particulièrement valorisé pour ce poste précis (ex. Senior AE Tech IA Paris), tu peux le mentionner positivement dans la lecture mission, sans pour autant l'ajouter au score additif.

---

## Stats V1

| Élément | Compte |
|---|---|
| Dimensions transversales | 6 |
| Niveaux de scoring par dimension | 3 (`−1`, `0`, `+1`) + demi-niveaux |
| Score global possible | de `−6` à `+6` |
| Architecture | Hybride (tableau maître + sections détaillées) |
| Brief flou | Score `0` neutre par dimension non évaluable, on continue l'évaluation |
| Points de vigilance séniorité | Formulés en suggestions/questions, pas en affirmations |

---

## Différences V0 → V1

| Modification | Origine |
|---|---|
| **Architecture hybride** : tableau maître en tête + sections détaillées en bas + instruction lookup à 2 niveaux | Recommandation Claude validée |
| **Cycle court transactionnel volumique → score `0`** (sauf incohérence avec AE Enterprise → `−1`) | Correction Boss |
| **Brief flou** : on évalue ce qu'on peut, neutre `0` sur le reste, on continue l'évaluation | Clarification Boss |
| **Section "cohérence séniorité" reformulée en "Points de vigilance"** | Correction Boss |
| **Signaux séniorité formulés en suggestions/questions** plutôt qu'en affirmations | Correction Boss |

---

**Fin de la V1 — architecture hybride, scoring transversal sur 6 dimensions, échelle −1/0/+1 avec demi-niveaux, plafonnée à ±6, détection briefs flous, points de vigilance séniorité formulés avec souplesse.**
