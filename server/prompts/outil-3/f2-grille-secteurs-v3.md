# Grille secteurs cœur de cible 2026 — Référentiel Mariell

**Statut** : V3 — note traitement postes hors secteur (CSM, Channel Manager, Sales Ops, AM) ajoutée
**Usage** : injection dans le system prompt LLM de l'outil 3 (Évaluation d'attractivité)
**Mise à jour** : annuelle minimum, ad-hoc dès qu'un signal de marché majeur survient
**Confidentialité** : interne Mariell, jamais cité tel quel au prospect (ni les niveaux, ni la grille)

---

## Cadre méthodologique

### Définition

La grille secteurs attribue à chaque secteur d'activité un **modificateur d'attractivité** qui reflète la désirabilité spontanée du secteur du point de vue d'un Sales français en 2026. Un secteur "chaud" (IA, cyber souveraine, fintech B2B, GreenTech) attire les candidats Sales naturellement et peut compenser une marque moins forte. Un secteur "tiède" ou en déclin (intérim traditionnel, Mobilité B2B, AgriTech, FoodTech) doit compenser par d'autres dimensions (package, mission, équipe, évolution).

### Principe économique sous-jacent

À package, équipe et mission équivalents, un Sales préférera spontanément un secteur en croissance, à forte tension marché, ou à fort signal sociétal. Cette préférence n'est pas indifférente à l'évaluation d'une offre : un secteur attractif "tire" l'offre vers le haut, un secteur peu attractif "lest" l'offre vers le bas.

### Différence avec le Fichier 1 (Boîtes intouchables)

> **Le Fichier 1 ne sait pas pénaliser, le Fichier 2 le peut.**
>
> - Fichier 1 (Boîtes intouchables) : **bonus uniquement**, l'absence n'est jamais un malus
> - Fichier 2 (Grille secteurs) : **bonus, malus, ou neutre** selon le secteur d'appartenance
>
> Une boîte du Tier S dans un secteur en `−1` reste très attractive (Tier S l'emporte largement). Une boîte absente du Fichier 1 dans un secteur en `+2` voit son attractivité significativement renforcée. Les deux fichiers se combinent.

### Les 5 niveaux du modificateur sectoriel

| Niveau | Effet | Signification |
|---|---|---|
| **+2** | Bonus fort | Secteur très tendu, croissance forte, packages tirés à la hausse, désirabilité Sales élevée |
| **+1** | Bonus modéré | Secteur dynamique, croissance soutenue, candidats Sales intéressés spontanément |
| **0** | Neutre | Secteur stable, ni tendance positive ni négative marquée |
| **−1** | Malus modéré | Secteur peu désirable côté Sales, packages plats, croissance faible |
| **−2** | Malus fort | Secteur en déclin, image dégradée auprès des Sales, fuite des talents |

**Demi-niveaux autorisés** (`+0.5`, `−0.5`, `+1.5`, `−1.5`) pour les secteurs hybrides ou en transition.

### Comment le LLM utilise cette grille

**Match direct** — Le LLM identifie le secteur de l'entreprise du prospect à partir du nom de l'entreprise, du site web, et de la description des missions. Il applique le modificateur correspondant.

**Cas hybride** — Si l'entreprise du prospect chevauche plusieurs secteurs, le LLM applique le **modificateur le plus élevé pertinent**, sans cumuler. Exception : Tech US implantés FR (voir section dédiée).

**Cas ambigu** — Si le secteur est difficile à déterminer, le LLM choisit le secteur dominant en chiffre d'affaires ou en effort Sales, et applique le modificateur correspondant.

### Cas particulier — Postes "hors secteur" (CSM, Channel Manager, Sales Ops, AM)

Certains postes Sales ne sont pas eux-mêmes liés à un secteur d'activité spécifique : Customer Success Manager, Channel / Partner Manager, Sales Ops / RevOps, Account Manager. Ces postes existent **dans tous les secteurs**.

**Règle d'application** :
- Le LLM applique le modificateur sectoriel **du secteur de l'entreprise du prospect**, pas du poste.
- Exemple : un CSM chez Doctolib (HealthTech B2B) → modificateur HealthTech B2B (`+1`). Un CSM chez une boîte cyber → modificateur Cyber (`+2`).
- Le poste lui-même n'a pas de modificateur sectoriel propre.

Cette règle est cohérente avec la logique "le secteur de la boîte porte l'attractivité, pas le poste".

### ⚠️ Règle de prudence (cas d'incertitude)

> ⚠️ **PRINCIPE DIRECTEUR TRANSVERSAL — RESSOURCE D'AIDE, JAMAIS DE FREIN**
>
> Ce document (comme les Fichiers 1, 3 et 4) est une **ressource pour améliorer la précision de l'évaluation**, jamais pour la freiner.
>
> - Si le secteur de l'entreprise du prospect est identifiable avec certitude → **applique le modificateur** correspondant.
> - Si le secteur n'est pas identifiable avec certitude (signaux ambigus, terminologie non standard, absence d'info) → **applique le modificateur neutre (0)** et poursuis l'évaluation normalement.
> - Le LLM ne perd jamais ses moyens face à un secteur incertain. Il rend toujours une évaluation, même partielle.
>
> **Spécificité du Fichier 2 — bonus, malus ou neutre** :  
> Contrairement au Fichier 1 (bonus uniquement), ce fichier peut attribuer un malus quand le secteur est clairement identifié comme peu désirable. Mais en cas de doute, on neutralise (0), on ne pénalise pas.
>
> **Ne jamais inventer un secteur sur des bases minces.** Mieux vaut un signal neutre qu'un signal erroné.

### Règle absolue de communication

Le LLM ne mentionne **jamais** la grille, ni les niveaux, ni les modificateurs au prospect. Il les utilise comme signal interne pour pondérer son évaluation. La justification du LLM auprès du prospect porte toujours sur des éléments observables (tension du marché, croissance du secteur, comportement des candidats), jamais sur l'existence d'un référentiel chiffré.

---

## GRILLE SECTORIELLE

### Secteurs en bonus fort (+1.5 à +2)

| Secteur | Modificateur | Justification | Lecture LLM |
|---|---|---|---|
| **IA / LLM / IA applicative** | **+2** | Marché ultra-tendu, packages tirés à la hausse 15-20% sur 12 mois, désirabilité maximale chez les Sales | Bonus fort. Si package en-dessous médiane terrain : alerter prospect que le marché ne pardonne pas l'écart. Si package aligné : Sales attiré naturellement. |
| **Cyber / Sécurité (souveraineté + EU AI Act)** | **+2** | Pénurie sévère de Sales cyber qualifiés, budgets entreprises en hausse, secteur stratégique soutenu | Bonus fort. Sales cyber expérimenté peut négocier 10-15% au-dessus de la médiane générale Sales. Senior/Lead obligatoire sur Enterprise. |
| **SaaS B2B mainstream — gros SaaS établis** *(effectifs >150, réputation forte)* | **+2** | Sales dense, marché actif, packages alignés, références nombreuses, marques aspirantes | Bonus fort. Candidats nombreux mais sélectifs. La différenciation se fait sur la maturité de l'équipe Sales et la traction produit. |
| **Sales Tech / Outbound — leaders établis** *(lemlist, Waalaxy, top références)* | **+2** | Marché en explosion, Sales fascinés car ils utilisent les outils qu'ils vendent | Bonus fort. Forte fluidité du marché candidat. Profils souvent jeunes (25-32 ans) avec growth mindset. |
| **Defense Tech** | **+1.5** | Réveil européen post-Ukraine, financements explosent, marque forte (souveraineté + sens), profils Sales spécialisés rares. Niche qui fascine mais projection de carrière incertaine | Bonus modéré-fort. Attire des Sales seniors hors secteur traditionnel. Sensibilité au sens et à la mission souvent supérieure au pur package. |
| **Fintech / Banking B2B** | **+1.5** | Secteur mature mais toujours dynamique (facturation électronique 2026, néobanques pro, paiements B2B), Sales valorisés | Bonus modéré-fort. Marché prévisible, candidats nombreux. Différenciation par la verticale (PME / Mid-Market / Enterprise). |
| **SaaS B2B mainstream — SaaS standard** *(effectifs 30-150)* | **+1.5** | Sales dense, candidats motivés, références correctes mais sans aspiration massive | Bonus modéré-fort. Marché candidat actif. Différenciation par la maturité Sales et la traction. |
| **Sales Tech / Outbound — acteurs établis** *(Pharow, Zeliq, FullEnrich, etc.)* | **+1.5** | Marché en explosion mais acteurs plus petits que les leaders, signaux Sales positifs | Bonus modéré-fort. Profils growth-oriented attirés par les outils Sales modernes. |

### Secteurs en bonus modéré (+1)

| Secteur | Modificateur | Justification | Lecture LLM |
|---|---|---|---|
| **HealthTech / MedTech B2B** | **+1** | Secteur en structuration, financements stables, sens du métier valorisé | Bonus modéré. Sales avec affinité santé recherchés mais pas pénuriques. Cycles longs à anticiper. |
| **HR Tech / RecruitTech** *(effectifs >20)* | **+1** | Secteur très présent sur LinkedIn, donc inscrit dans l'esprit des Sales (boucle vertueuse de visibilité) | Bonus modéré. Profils Sales HR Tech valorisés via la visibilité réseau du secteur. |
| **PropTech / Construction Tech** | **+1** | L'immobilier et le BTP sont des secteurs vieillissants où il y a beaucoup de Sales : le vent de modernité y attire les profils en quête de modernité | Bonus modéré. Sales avec affinité immo / BTP recherchés. La modernité tech séduit les Sales lassés des modèles classiques. |
| **MarTech / AdTech** | **+1** | Sujets marketing obsessionnels sur LinkedIn, hyper présents dans la tête des Sales (très liés à leur travail) | Bonus modéré. Sales MarTech expérimentés disponibles, marché fluide. Forte appétence des Sales pour le sujet. |
| **GreenTech / Climate Tech B2B** | **+1** | Mission en lien avec les enjeux sociétaux actuels qui séduisent beaucoup de profils | Bonus modéré. Attire des candidats motivés par la mission. Attention aux signaux financiers (run rate, levée). |
| **DeepTech / Quantique / Spatial — scale-ups établies** *(Pasqal, Loft Orbital, Verkor, Exotec...)* | **+1** | Niche mais ambition mondiale, levées massives, équipes Sales internationales, packages au-dessus du marché Sales SaaS classique | Bonus modéré. Profil Sales pénurique car peu de Sales ont l'expérience deeptech. Trajectoires concrètes vers licornes décacornables. |
| **ESN top établies** *(Capgemini, Sopra Steria, Atos, Devoteam top, Wavestone, ALTEN, taille >5000)* | **+1 à +1.5** | Références dans leur écosystème, marques connues, image consulting+tech valorisée pour ceux qui aiment l'écosystème ESN | Bonus modéré dans l'écosystème ESN uniquement. À hors écosystème : neutre voire répulsif. Différenciation forte du SaaS/éditeur. |

### Secteurs en bonus léger (+0.5)

| Secteur | Modificateur | Justification | Lecture LLM |
|---|---|---|---|
| **Insurtech B2B** | **+0.5** | Secteur stable porté par quelques belles références (Alan, Shift Technology), reconnaissance partielle | Bonus léger. La marque de la boîte fait beaucoup. Différenciation par la verticale. |
| **HR Tech / RecruitTech — petites structures** *(effectifs ≤20)* | **+0.5** | Visibilité LinkedIn moindre que les acteurs établis, marque encore peu installée chez les Sales | Bonus léger. La marque doit se construire. Différenciation par le produit et la mission. |
| **DeepTech / Quantique / Spatial — early stage / labs** | **+0.5** | Niche extrême, projection de carrière incertaine, mais secteur fascinant | Bonus léger. Sales expérimentés en deeptech sont quasi-introuvables. Profil à former côté entreprise. |
| **GamingTech B2B** | **+0.5** | Niche, lifestyle attractif, fascine certains profils Sales | Bonus léger. Segment B2B publishing réduit. Profils Sales gaming très spécifiques. |
| **SportTech B2B** | **+0.5** | Niche, lifestyle attractif, fascine mais marché candidat très réduit | Bonus léger. Quelques scale-ups (Scoreplay) mais peu d'aspiration sectorielle massive. |

### Secteurs neutres (0)

| Secteur | Modificateur | Justification | Lecture LLM |
|---|---|---|---|
| **Industrie / Industrial SaaS** | **0** | Secteur moins attractif que les autres, profils candidats Sales niches et rares | Neutre. Sales industriels hybrides (compréhension métier + tech) sont rares. La rareté du profil compense la faible désirabilité. |
| **EventTech B2B** | **0** | Marché stable, pas de tension forte, quelques belles références (Naboo, Weezevent) sans aspirateur sectoriel | Neutre. Différenciation par la qualité du produit et la signature client. |
| **TravelTech B2B** | **0** | Secteur stable post-COVID, croissance modérée, image neutre côté Sales | Neutre. Différenciation par la verticale (corporate travel, agences, etc.). |
| **Logistique / Supply Chain Tech** | **0** | Secteur technique, croissance modérée, pas de signal fort positif ou négatif | Neutre. Sales avec compréhension supply chain rares mais pas pénuriques. |
| **LegalTech / RegTech / Compliance** | **0** | Secteur en structuration, intégration IA en cours, dynamique mais pas explosive | Neutre. Sales avec affinité juridique / compliance rares mais marché stable. |
| **ESN récentes / petites** *(<5000 collab, sans rayonnement de marque)* | **0** | Écosystème à part avec son vivier de talents propres : ceux qui y sont restent, ceux qui n'y sont pas n'y vont pas. Milieu clivant mais pas malus en absolu | Neutre dans l'écosystème ESN. Signal différent du SaaS/éditeur. Le LLM doit traiter la cohérence "candidat ESN cherche poste ESN" comme acquis. |

### Secteurs en malus modéré (−0.5)

| Secteur | Modificateur | Justification | Lecture LLM |
|---|---|---|---|
| **MarketPlaces verticales B2B** | **−0.5** | Plus loin de la "Tech" qui séduit les profils Sales, image business plus traditionnelle | Malus léger. Différenciation par la modernité de la stack et la mission. |
| **EdTech B2B** | **−0.5** | Secteur qui intéresse peu, peu de belles références Sales, marges faibles | Malus léger. Sales avec affinité éducation rares mais marché peu désirable. |

### Secteurs en malus fort (−1)

| Secteur | Modificateur | Justification | Lecture LLM |
|---|---|---|---|
| **AgriTech / Agri-biotech** | **−1** | Secteur peu désirable côté Sales (image rurale, packages plus bas, compréhension métier exigée), faible bassin de candidats Sales spécialisés | Malus modéré. Sales agri-tech rares mais marché tendu côté entreprises. Peut nécessiter d'élargir le profil ou former. |
| **FoodTech B2B** | **−1** | Marges fines, restauration en consolidation, peu de signaux Sales positifs récents | Malus modéré. Sales FoodTech B2B avec carnet HCR valorisés mais marché difficile. |
| **Mobilité / AutoTech / Recharge VE B2B** | **−1** | Secteurs qui intéressent peu et qui ont mauvaise image (consolidation, faillites micro-mobilité) | Malus modéré. Bien différencier les acteurs solides (Zeplug, Verkor) des startups fragiles. La marque de la boîte peut compenser le malus. |
| **RetailTech** | **−1** | Image business traditionnelle, marges fines, peu de belles références Sales aspirantes | Malus modéré. Différenciation par la verticale (retail media, in-store tech, etc.). |

---

## CATÉGORIE TRANSVERSE — Tech US implantés en France

| Catégorie | Modificateur | Justification | Lecture LLM |
|---|---|---|---|
| **Tech US en France** *(Salesforce, AWS, Google, Microsoft, Snowflake, Datadog, Adobe, Oracle, ServiceNow, etc.)* | **+1 (additionnel)** | Modificateur **additionnel** au secteur sous-jacent. Marque US tech = signal fort de structure Sales mature, packages compétitifs, formations world-class | Bonus modéré **cumulable** avec le modificateur sectoriel. Ex : Salesforce France = SaaS B2B gros (+2) + Tech US (+1) = **+3**, **plafonné à +2 final**. |

⚠️ **Plafond absolu** : le score sectoriel total ne dépasse jamais `+2`, même avec cumul Tech US. Le bonus Tech US ne sert qu'à hisser un secteur initialement neutre ou faible.

⚠️ **Règle de prudence** : ne pas appliquer ce bonus aux Tech US implantés FR avec faible présence Sales locale (équipes basées Dublin / Londres). Vérifier au cas par cas via la description des missions et la localisation indiquée.

---

## Cas particuliers — Règles tranchées

### 1. Hybrides IA × secteur traditionnel

**Règle** : si l'IA est une **verticale dominante mise en avant** par l'entreprise (positionnement marketing, levée labellisée IA, branding "AI-first"), appliquer le modificateur IA (`+2`). Sinon, appliquer le secteur traditionnel.

*Exemple* : Nabla = "AI for healthcare" mis en avant → IA (`+2`). Hublo = "RH santé" mis en avant, IA discrète → HealthTech B2B (`+1`).

### 2. Defense Tech × Industrie

**Règle** : si le **contrat dominant n'est pas militaire**, appliquer Industrie. Si le contrat dominant est militaire, appliquer Defense Tech.

*Exemple* : Verkor (gigafactory batteries, segment EV majoritaire) → Industrie (`0`). Helsing (IA défense, contrats DGA) → Defense Tech (`+1.5`).

### 3. ESN — pas de différenciation par modernité

**Règle** : une ESN est une ESN. Pas de différenciation entre ESN modernes (Onepoint, Wavestone) et ESN traditionnelles (Capgemini, Sopra Steria, Atos). La différenciation se fait via la **taille / réputation** :
- ESN top établies (>5000 collab, marque forte) → `+1 à +1.5`
- ESN récentes / petites → `0`

La distinction de qualité Sales se fait via le **Fichier 1 (Boîtes bonus)**, pas via cette grille.

### 4. SaaS — pas de différenciation par verticale

**Règle** : un SaaS est un SaaS, et c'est compris comme tel par les candidats. Pas de modificateur spécifique pour SaaS Sales (Modjo), SaaS Legal (Doctrine), SaaS RH (Lucca), etc. Ils sont tous SaaS B2B mainstream.

La différenciation se fait via la **taille / réputation** (gros SaaS établis vs SaaS standard) et via le **Fichier 1 (Boîtes bonus)**.

---

## Stats V1

| Niveau | Compte | Secteurs |
|---|---|---|
| **+2** | 4 | IA, Cyber, SaaS gros, Sales Tech leaders |
| **+1.5** | 4 | Defense Tech, Fintech B2B, SaaS standard, Sales Tech établis |
| **+1** | 7 | HealthTech B2B, HR Tech (>20), PropTech, MarTech/AdTech, GreenTech, DeepTech établi, ESN top |
| **+0.5** | 5 | Insurtech B2B, HR Tech (≤20), DeepTech early, GamingTech, SportTech |
| **0** | 6 | Industrie, EventTech, TravelTech, Logistique, LegalTech, ESN récentes |
| **−0.5** | 2 | MarketPlaces B2B, EdTech B2B |
| **−1** | 4 | AgriTech, FoodTech B2B, Mobilité, RetailTech |
| **Total secteurs** | **32** | (vs 23 en V0) |
| Catégorie transverse (Tech US) | 1 | +1 additionnel cumulable, plafonné à +2 |

---

## Demandes explicites pour ta correction V2

**1. Échelle SaaS B2B — gros vs standard**  
J'ai défini "gros SaaS" comme >150 collab + réputation forte. Tu valides ce seuil ou tu ajustes (>100, >200) ? Idem pour HR Tech (>20 vs ≤20).

**2. ESN top vs ESN récentes**  
J'ai défini "ESN top" comme >5000 collab + marque forte. Capgemini (340k collab), Sopra (50k), Atos (90k), Devoteam (11k), Wavestone (5k+), ALTEN (60k) tombent dedans. Tu valides ce seuil ou tu préfères une liste explicite (Top 10 ESN nommées) ?

**3. Plafond +2 absolu**  
J'ai mis un plafond `+2` même avec cumul Tech US. Cohérent avec ta logique de modificateurs ou tu veux autoriser un `+2.5` voire `+3` pour Salesforce France ?

**4. Distinction GamingTech B2B vs B2C**  
GamingTech B2B (publishing, tools devs) à `+0.5`. Mais Voodoo / HOMA sont gaming hyper-casual → exclus du Fichier 1 car B2C. Tu confirmes que GamingTech B2B ne couvre que le segment B2B (Unity, outils devs, publishing), pas l'éditeur de jeux mainstream ?

**5. Secteurs encore manquants ?**  
J'ai 32 secteurs + Tech US. Tu vois encore des manques ou on fige la V1 comme version stabilisée ?

---

**Fin de la V1 — toutes corrections Boss intégrées + règle de prudence + 4 nouveaux secteurs + cas particuliers tranchés.**
