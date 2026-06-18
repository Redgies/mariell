export interface ExpertiseFaq {
  q: string
  a: string
}

export interface ExpertiseMarche {
  heading: string
  paragraph: string
  ote?: string
  oteLabel?: string
}

export interface ExpertiseRelated {
  slug: string
  label: string
}

export interface ExpertiseSeo {
  title: string
  description: string
}

export interface Expertise {
  slug: string
  group: 'Representatives' | 'Managers' | 'Directors' | 'Par contexte'
  label: string
  h1: string
  heroLabel: string
  heroParagraph: string
  ctaLabel: string
  missions: string[]
  profil: string[]
  marche: ExpertiseMarche
  faq: ExpertiseFaq[]
  related: ExpertiseRelated[]
  serviceType: string
  serviceDescription: string
  seo: ExpertiseSeo
}

export const expertises: Expertise[] = [
  {
    slug: 'sdr',
    group: 'Representatives',
    label: 'SDR / BDR',
    h1: 'SDR & BDR : ouvrir le pipe, vite et bien.',
    heroLabel: 'Representatives',
    heroParagraph: 'Les SDR et BDR sont les commerciaux qui alimentent le pipeline en amont. Mariell recrute des chasseurs qui décrochent des rendez-vous qualifiés, pas des distributeurs d’e-mails.',
    ctaLabel: 'Recruter un SDR',
    missions: [
      'Génération de rendez-vous qualifiés (outbound & inbound)',
      'Qualification BANT / MEDDIC',
      'Séquences multicanal et copywriting',
      'Passation propre aux Account Executives',
    ],
    profil: [
      'Résilience et discipline d’activité',
      'Curiosité produit et marché',
      'Aisance écrite et orale',
      'Premier track record d’atteinte de quotas',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'Le poste de SDR est le plus volatil du commercial : turnover élevé, séniorité faible, et une vraie difficulté à distinguer un chasseur discipliné d’un simple émetteur d’e-mails. La performance se lit dans l’activité ET la qualité des rendez-vous générés.',
      ote: '45-65k€',
      oteLabel: 'France 2026',
    },
    faq: [
      {
        q: 'Quelle différence entre un SDR et un BDR ?',
        a: 'Les deux génèrent du pipeline. Le SDR traite plutôt l’inbound et la qualification, le BDR l’outbound et la création de comptes. Selon les organisations, les périmètres se recoupent.',
      },
      {
        q: 'Combien de temps pour recruter un bon SDR ?',
        a: 'Par approche directe, nous présentons les premiers profils qualifiés sous 7 à 10 jours. Voir le détail dans notre grille des salaires Sales 2026.',
      },
      {
        q: 'Combien coûte un SDR en 2026 ?',
        a: 'Le package OTE d’un SDR se situe autour de 45-65k€ en France, startups et scale-ups. Le détail par séniorité est dans notre grille des salaires Sales 2026.',
      },
    ],
    related: [
      { slug: 'business-developer-full-cycle', label: 'Business Developer Full Cycle' },
      { slug: 'account-executive-pme', label: 'Account Executive PME' },
      { slug: 'sales-manager', label: 'Sales Manager' },
    ],
    serviceType: 'Recrutement SDR / BDR',
    serviceDescription: 'Les SDR et BDR sont les commerciaux qui alimentent le pipeline en amont. Mariell recrute des chasseurs qui décrochent des rendez-vous qualifiés, pas des distributeurs d’e-mails.',
    seo: {
      title: 'Recrutement SDR / BDR | Mariell',
      description: 'Les SDR et BDR génèrent le pipeline. Mariell recrute des chasseurs qui décrochent des rendez-vous qualifiés, pas des distributeurs d’e-mails.',
    },
  },
  {
    slug: 'business-developer-full-cycle',
    group: 'Representatives',
    label: 'Business Developer Full Cycle',
    h1: 'Le profil full-cycle qui chasse et close.',
    heroLabel: 'Representatives',
    heroParagraph: 'Du premier contact à la signature, le Business Developer full-cycle est un commercial qui porte tout le cycle de vente. Idéal pour les startups early-stage qui ont besoin d’autonomie.',
    ctaLabel: 'Recruter un Business Developer Full Cycle',
    missions: [
      'Prospection et création de pipeline',
      'Démonstrations et négociation',
      'Closing et suivi de compte',
      'Remontée terrain produit',
    ],
    profil: [
      'Autonomie totale sur le cycle',
      'Polyvalence chasse / close',
      'Tempérament entrepreneurial',
      'Track record en environnement startup',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'Le profil full-cycle est rare car il cumule deux tempéraments rarement réunis : la ténacité du chasseur et le sang-froid du closer. Très recherché en early-stage, il exige une autonomie que peu savent assumer.',
      ote: '50-75k€',
      oteLabel: 'France 2026',
    },
    faq: [
      {
        q: 'Combien gagne un Business Developer Full Cycle ?',
        a: 'Le package se situe autour de 50-75k€ brut par an selon la séniorité et le contexte. Pour le détail, consultez notre grille des salaires Sales 2026.',
      },
      {
        q: 'Pour quelle taille d’entreprise ?',
        a: 'Surtout les startups early-stage qui n’ont pas encore segmenté chasse et closing, et veulent un commercial autonome de bout en bout.',
      },
      {
        q: 'Full-cycle ou équipe spécialisée ?',
        a: 'Le full-cycle est idéal au démarrage. Au-delà d’un certain volume, spécialiser SDR et AE devient plus efficace.',
      },
      {
        q: 'Quelle différence entre un Business Developer full-cycle et un Account Executive ?',
        a: 'Le full-cycle gère tout, de la prospection au closing. L’Account Executive intervient surtout sur le closing, une fois le pipeline généré par un SDR. Le full-cycle convient aux structures qui n’ont pas encore segmenté.',
      },
    ],
    related: [
      { slug: 'sdr', label: 'SDR / BDR' },
      { slug: 'account-executive-mid-market', label: 'Account Executive Mid-Market' },
      { slug: 'recrutement-seed', label: 'Recrutement seed' },
    ],
    serviceType: 'Recrutement Business Developer Full Cycle',
    serviceDescription: 'Du premier contact à la signature, le Business Developer full-cycle est un commercial qui porte tout le cycle de vente. Idéal pour les startups early-stage qui ont besoin d’autonomie.',
    seo: {
      title: 'Recrutement Business Developer Full Cycle | Mariell',
      description: 'Du premier contact à la signature, le Business Developer full-cycle est un commercial qui porte tout le cycle de vente. Idéal pour une startup early-stage en quête d’autonomie.',
    },
  },
  {
    slug: 'account-executive-pme',
    group: 'Representatives',
    label: 'Account Executive PME',
    h1: 'Closer des cycles courts, en volume.',
    heroLabel: 'Representatives',
    heroParagraph: 'L’AE PME est un commercial qui excelle sur des cycles courts et transactionnels. Mariell identifie les profils qui tiennent le rythme sans sacrifier la qualité.',
    ctaLabel: 'Recruter un Account Executive PME',
    missions: [
      'Closing de cycles courts (SMB)',
      'Gestion d’un volume élevé d’opportunités',
      'Démonstrations produit',
      'Upsell et renouvellement',
    ],
    profil: [
      'Vitesse d’exécution',
      'Rigueur CRM',
      'Sens du volume',
      'Régularité d’atteinte de quota',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'Sur le segment PME, le volume prime sans sacrifier le taux de closing. La difficulté : trouver des AE qui tiennent la cadence sur des cycles courts tout en gardant une rigueur CRM impeccable.',
      ote: '67-95k€',
      oteLabel: 'France 2026',
    },
    faq: [
      {
        q: 'Combien gagne un Account Executive PME ?',
        a: 'Le package se situe autour de 67-95k€ brut par an selon la séniorité et le contexte. Pour le détail, consultez nos fourchettes détaillées par séniorité.',
      },
      {
        q: 'Cycle court, quel profil ?',
        a: 'Un closer rapide, à l’aise avec un volume élevé d’opportunités et une exécution disciplinée.',
      },
      {
        q: 'Quels indicateurs regarder ?',
        a: 'Régularité d’atteinte de quota, taux de transformation et vélocité du pipe.',
      },
      {
        q: 'Combien de deals un AE PME doit-il closer par mois ?',
        a: 'Cela dépend du panier moyen et de la longueur du cycle, mais un AE PME performant traite un volume élevé d’opportunités avec une cadence régulière. Ce qui compte, c’est la régularité d’atteinte du quota, pas un pic isolé.',
      },
    ],
    related: [
      { slug: 'sdr', label: 'SDR / BDR' },
      { slug: 'account-executive-mid-market', label: 'Account Executive Mid-Market' },
      { slug: 'account-manager', label: 'Account Manager' },
    ],
    serviceType: 'Recrutement Account Executive PME',
    serviceDescription: 'L’AE PME est un commercial qui excelle sur des cycles courts et transactionnels. Mariell identifie les profils qui tiennent le rythme sans sacrifier la qualité.',
    seo: {
      title: 'Recrutement Account Executive PME | Mariell',
      description: 'L’AE PME excelle sur les cycles courts et transactionnels. Mariell identifie les profils qui tiennent le rythme sans sacrifier la qualité du closing.',
    },
  },
  {
    slug: 'account-executive-mid-market',
    group: 'Representatives',
    label: 'Account Executive Mid-Market',
    h1: 'Des deals mid-market, structurés et gagnés.',
    heroLabel: 'Representatives',
    heroParagraph: 'L’Account Executive Mid-Market est un commercial qui porte des cycles plus longs, multi-interlocuteurs. Mariell recrute des profils qui orchestrent la complexité sans la subir.',
    ctaLabel: 'Recruter un Account Executive Mid-Market',
    missions: [
      'Gestion de cycles mid-market multi-stakeholders',
      'Qualification avancée (MEDDIC / MEDDPICC)',
      'Construction de business cases',
      'Négociation et closing',
    ],
    profil: [
      'Maîtrise des méthodologies de vente',
      'Capacité à mapper un compte',
      'Aisance avec les décideurs',
      'Track record mid-market vérifiable',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'Le mid-market combine cycles plus longs et multiples interlocuteurs. On y cherche des AE qui maîtrisent une méthodologie (MEDDIC, MEDDPICC) et savent construire un business case, sans tomber dans l’over-engineering.',
      ote: '73-102k€',
      oteLabel: 'France 2026',
    },
    faq: [
      {
        q: 'Quelle méthodologie attendue ?',
        a: 'La plupart de nos clients mid-market travaillent avec MEDDIC ou MEDDPICC. Nous évaluons la maîtrise réelle, pas l’acronyme récité.',
      },
      {
        q: 'Différence avec l’Enterprise ?',
        a: 'Le mid-market a des comités d’achat plus légers et des cycles plus courts que l’Enterprise, mais plus structurés que la PME.',
      },
      {
        q: 'Combien gagne un Account Executive Mid-Market ?',
        a: 'Le package OTE d’un AE Mid-Market tourne autour de 73-102k€ en France. La répartition fixe/variable et les fourchettes par séniorité sont détaillées dans notre grille des salaires Sales 2026.',
      },
    ],
    related: [
      { slug: 'account-executive-pme', label: 'Account Executive PME' },
      { slug: 'account-executive-enterprise', label: 'Account Executive Enterprise' },
      { slug: 'head-of-sales', label: 'Head of Sales' },
    ],
    serviceType: 'Recrutement Account Executive Mid-Market',
    serviceDescription: 'L’Account Executive Mid-Market est un commercial qui porte des cycles plus longs, multi-interlocuteurs. Mariell recrute des profils qui orchestrent la complexité sans la subir.',
    seo: {
      title: 'Recrutement Account Executive Mid-Market | Mariell',
      description: 'L’AE Mid-Market gère des cycles longs et multi-interlocuteurs. Mariell recrute des profils qui orchestrent la complexité d’un deal sans la subir.',
    },
  },
  {
    slug: 'account-executive-enterprise',
    group: 'Representatives',
    label: 'Account Executive Enterprise',
    h1: 'Gagner les comptes Enterprise.',
    heroLabel: 'Representatives',
    heroParagraph: 'Cycles longs, comités d’achat, enjeux élevés. L’AE Enterprise est un commercial stratège de compte. Mariell sélectionne les profils qui closent les logos structurants.',
    ctaLabel: 'Recruter un Account Executive Enterprise',
    missions: [
      'Stratégie de compte Enterprise',
      'Gestion de comités d’achat complexes',
      'Co-construction de valeur sur cycles longs',
      'Closing de contrats stratégiques',
    ],
    profil: [
      'Vision stratégique du compte',
      'Patience et endurance commerciale',
      'Réseau décideurs',
      'Track record sur gros logos',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'L’AE Enterprise est un commercial stratège de compte : cycles de 6 à 18 mois, comités d’achat complexes, enjeux à fort montant. Les vrais profils se comptent sur les doigts d’une main sur un marché donné.',
      ote: '110-160k€',
      oteLabel: 'France 2026',
    },
    faq: [
      {
        q: 'Combien coûte un Account Executive Enterprise en 2026 ?',
        a: 'Le package se situe autour de 110-160k€ brut par an selon la séniorité et le contexte. Pour le détail, consultez notre guide des salaires Sales.',
      },
      {
        q: 'Combien de temps pour closer en Enterprise ?',
        a: 'Les cycles vont de 6 à 18 mois. Le rôle de l’AE est d’orchestrer la complexité et de maintenir l’élan.',
      },
      {
        q: 'Faut-il un réseau préexistant ?',
        a: 'Un réseau de décideurs accélère, mais c’est la rigueur stratégique de compte qui fait la différence dans la durée.',
      },
      {
        q: 'Quelle est la différence entre un AE Enterprise et un AE Mid-Market ?',
        a: 'L’Enterprise gère des cycles plus longs (6 à 18 mois), des comités d’achat complexes et des montants supérieurs. Le Mid-Market reste sur des cycles plus courts et des comités plus légers. Ce sont deux métiers, pas deux niveaux.',
      },
    ],
    related: [
      { slug: 'account-executive-mid-market', label: 'Account Executive Mid-Market' },
      { slug: 'vp-sales', label: 'VP Sales' },
      { slug: 'recrutement-strategique', label: 'Recrutement stratégique' },
    ],
    serviceType: 'Recrutement Account Executive Enterprise',
    serviceDescription: 'Cycles longs, comités d’achat, enjeux élevés. L’AE Enterprise est un commercial stratège de compte. Mariell sélectionne les profils qui closent les logos structurants.',
    seo: {
      title: 'Recrutement Account Executive Enterprise | Mariell',
      description: 'Cycles longs, comités d’achat, gros enjeux. Mariell sélectionne les AE Enterprise, stratèges de compte qui closent les logos structurants.',
    },
  },
  {
    slug: 'account-manager',
    group: 'Representatives',
    label: 'Account Manager',
    h1: 'Faire grandir les comptes existants.',
    heroLabel: 'Representatives',
    heroParagraph: 'L’Account Manager est un commercial qui sécurise et développe la base installée. Mariell recrute des profils orientés relation et expansion, pas seulement rétention.',
    ctaLabel: 'Recruter un Account Manager',
    missions: [
      'Rétention et renouvellement',
      'Upsell et cross-sell',
      'Relation de confiance long terme',
      'Pilotage de la santé des comptes',
    ],
    profil: [
      'Sens de la relation client',
      'Fibre commerciale sur l’expansion',
      'Rigueur de suivi',
      'Track record de net revenue retention',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'L’Account Manager porte le net revenue retention, métrique reine des modèles SaaS. Le piège : confondre rétention passive et expansion active. On cherche une fibre commerciale, pas un simple gestionnaire de comptes.',
      ote: '66-94k€',
      oteLabel: 'France 2026',
    },
    faq: [
      {
        q: 'Combien gagne un Account Manager ?',
        a: 'Le package se situe autour de 66-94k€ brut par an selon la séniorité et le contexte. Pour le détail, consultez notre grille des salaires Sales 2026.',
      },
      {
        q: 'AM ou CSM, quelle différence ?',
        a: 'L’AM est orienté revenu (upsell, renouvellement), le CSM orienté adoption et valeur. Les deux se complètent.',
      },
      {
        q: 'Comment mesurer un bon AM ?',
        a: 'Net revenue retention, taux de renouvellement et croissance de la base installée.',
      },
      {
        q: 'Quand recruter un Account Manager plutôt qu’un Account Executive ?',
        a: 'L’Account Executive acquiert de nouveaux clients, l’Account Manager développe ceux déjà signés. On recrute un AM quand la base installée devient assez large pour justifier un profil dédié à la rétention et à l’expansion.',
      },
    ],
    related: [
      { slug: 'customer-success-manager', label: 'Customer Success Manager' },
      { slug: 'account-executive-pme', label: 'Account Executive PME' },
      { slug: 'sales-manager', label: 'Sales Manager' },
    ],
    serviceType: 'Recrutement Account Manager',
    serviceDescription: 'L’Account Manager est un commercial qui sécurise et développe la base installée. Mariell recrute des profils orientés relation et expansion, pas seulement rétention.',
    seo: {
      title: 'Recrutement Account Manager | Mariell',
      description: 'L’Account Manager développe la base installée. Mariell recrute des profils orientés relation et expansion, pas seulement rétention.',
    },
  },
  {
    slug: 'customer-success-manager',
    group: 'Representatives',
    label: 'Customer Success Manager',
    h1: 'La réussite client comme moteur de revenu.',
    heroLabel: 'Representatives',
    heroParagraph: 'Le CSM transforme l’usage en valeur et la valeur en expansion commerciale. Mariell identifie les profils à la croisée du conseil et du commercial.',
    ctaLabel: 'Recruter un Customer Success Manager',
    missions: [
      'Onboarding et adoption',
      'Pilotage de la valeur livrée',
      'Identification des opportunités d’expansion',
      'Réduction du churn',
    ],
    profil: [
      'Empathie et pédagogie',
      'Sens du résultat business',
      'Capacité d’analyse d’usage',
      'Appétence commerciale',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'Le CSM est à la croisée du conseil et du commercial. La difficulté de recrutement : trouver l’équilibre entre empathie client et orientation résultat, sans verser dans le pur support.',
      ote: '48-72k€',
      oteLabel: 'France 2026',
    },
    faq: [
      {
        q: 'Combien gagne un Customer Success Manager ?',
        a: 'Le package se situe autour de 48-72k€ brut par an selon la séniorité et le contexte. Pour le détail, consultez nos fourchettes par séniorité et par segment.',
      },
      {
        q: 'Le CSM est-il un poste commercial ?',
        a: 'De plus en plus : il porte l’adoption, la valeur, et identifie les opportunités d’expansion. L’appétence commerciale est clé.',
      },
      {
        q: 'Quand recruter son premier CSM ?',
        a: 'Dès que la rétention et l’adoption deviennent stratégiques, généralement après les premiers clients signés.',
      },
      {
        q: 'Quelle différence entre un CSM et un Account Manager ?',
        a: 'Le CSM est orienté adoption et valeur d’usage, l’Account Manager est orienté revenu (renouvellement, upsell). Les deux se complètent. Dans certaines organisations, un seul profil porte les deux rôles au démarrage.',
      },
    ],
    related: [
      { slug: 'account-manager', label: 'Account Manager' },
      { slug: 'sales-ops-revops', label: 'Sales Ops / RevOps' },
      { slug: 'head-of-sales', label: 'Head of Sales' },
    ],
    serviceType: 'Recrutement Customer Success Manager',
    serviceDescription: 'Le CSM transforme l’usage en valeur et la valeur en expansion commerciale. Mariell identifie les profils à la croisée du conseil et du commercial.',
    seo: {
      title: 'Recrutement Customer Success Manager | Mariell',
      description: 'Le CSM transforme l’usage en valeur, puis en expansion. Mariell identifie les profils à la croisée du conseil et du commercial.',
    },
  },
  {
    slug: 'sales-ops-revops',
    group: 'Representatives',
    label: 'Sales Ops / RevOps',
    h1: 'La machine de revenus, huilée.',
    heroLabel: 'Representatives',
    heroParagraph: 'Sales Ops et RevOps structurent la donnée, les process et les outils qui développent la performance commerciale et font scaler la vente. Mariell recrute les architectes de la performance commerciale.',
    ctaLabel: 'Recruter un Sales Ops',
    missions: [
      'Structuration CRM et data',
      'Définition des process de vente',
      'Reporting et forecast',
      'Outillage et automatisation',
    ],
    profil: [
      'Rigueur analytique',
      'Maîtrise des outils (CRM, BI)',
      'Vision systémique',
      'Capacité à embarquer les équipes',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'Sales Ops et RevOps sont devenus stratégiques avec la maturité des organisations commerciales. Profils hybrides data / process / outils, ils sont très disputés et difficiles à évaluer pour qui ne maîtrise pas le sujet.',
      ote: '58-87k€',
      oteLabel: 'France 2026',
    },
    faq: [
      {
        q: 'Sales Ops ou RevOps ?',
        a: 'Sales Ops couvre la vente ; RevOps aligne Sales, Marketing et CS autour du revenu. RevOps est une vision plus large.',
      },
      {
        q: 'Quand structurer les Ops ?',
        a: 'Dès que la donnée et les process deviennent un frein à la scalabilité, souvent autour de 10-15 commerciaux.',
      },
      {
        q: 'Combien gagne un profil Sales Ops ou RevOps ?',
        a: 'Le package OTE se situe autour de 58-87k€ en France selon la séniorité et le périmètre. Les profils RevOps seniors, à la croisée data, process et outils, sont les plus disputés. Détail dans la grille des salaires Sales 2026.',
      },
    ],
    related: [
      { slug: 'cro', label: 'CRO' },
      { slug: 'head-of-sales', label: 'Head of Sales' },
      { slug: 'customer-success-manager', label: 'Customer Success Manager' },
    ],
    serviceType: 'Recrutement Sales Ops / RevOps',
    serviceDescription: 'Sales Ops et RevOps structurent la donnée, les process et les outils qui développent la performance commerciale et font scaler la vente. Mariell recrute les architectes de la performance commerciale.',
    seo: {
      title: 'Recrutement Sales Ops / RevOps | Mariell',
      description: 'Sales Ops et RevOps structurent data, process et outils pour scaler la vente. Mariell recrute les architectes de la performance commerciale.',
    },
  },
  {
    slug: 'sales-manager',
    group: 'Managers',
    label: 'Sales Manager',
    h1: 'Manager une équipe Sales à la performance.',
    heroLabel: 'Managers',
    heroParagraph: 'Le Sales Manager, aussi appelé Responsable Commercial, pilote, coache et fait grandir une équipe de commerciaux. Mariell recrute des leaders de terrain qui tiennent le nombre et développent les talents.',
    ctaLabel: 'Recruter un Sales Manager',
    missions: [
      'Management et coaching d’une équipe',
      'Pilotage du forecast et des KPIs',
      'Construction et exécution du playbook',
      'Recrutement et montée en compétence',
    ],
    profil: [
      'Leadership de terrain',
      'Capacité de coaching',
      'Rigueur de pilotage',
      'Track record de management commercial',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'Le Sales Manager est un point de bascule : excellent IC ne fait pas bon manager. On cherche un leader de terrain capable de coacher, tenir le forecast et recruter, sans cesser de comprendre la vente.',
      ote: '92-162k€',
      oteLabel: 'selon le segment managé',
    },
    faq: [
      {
        q: 'Combien gagne un Sales Manager ?',
        a: 'Le package se situe autour de 92-162k€ brut par an selon la séniorité et le contexte. Pour le détail, consultez nos fourchettes détaillées par séniorité.',
      },
      {
        q: 'Promouvoir en interne ou recruter ?',
        a: 'Les deux ont du sens. Recruter apporte des pratiques nouvelles ; promouvoir préserve la culture. Nous évaluons la capacité réelle de management.',
      },
      {
        q: 'Combien de commerciaux par manager ?',
        a: 'En général 5 à 8 pour permettre un vrai coaching individuel.',
      },
      {
        q: 'Quelle différence entre un Sales Manager et un Head of Sales ?',
        a: 'Le Sales Manager pilote et coache une équipe de commerciaux au quotidien. Le Head of Sales construit la stratégie commerciale et la structure d’ensemble. Le premier exécute et fait performer, le second bâtit.',
      },
    ],
    related: [
      { slug: 'head-of-sales', label: 'Head of Sales' },
      { slug: 'account-executive-mid-market', label: 'Account Executive Mid-Market' },
      { slug: 'sdr', label: 'SDR / BDR' },
    ],
    serviceType: 'Recrutement Sales Manager',
    serviceDescription: 'Le Sales Manager, aussi appelé Responsable Commercial, pilote, coache et fait grandir une équipe de commerciaux. Mariell recrute des leaders de terrain qui tiennent le nombre et développent les talents.',
    seo: {
      title: 'Recrutement Sales Manager, Responsable Commercial | Mariell',
      description: 'Recrutement de Sales Manager, aussi appelé Responsable Commercial. Mariell recrute des leaders de terrain qui font grandir une équipe commerciale.',
    },
  },
  {
    slug: 'channel-partner-manager',
    group: 'Managers',
    label: 'Channel / Partner Manager',
    h1: 'Développer le revenu par les partenaires.',
    heroLabel: 'Managers',
    heroParagraph: 'Le Channel / Partner Manager est un commercial qui construit un revenu indirect via revendeurs et partenaires. Mariell identifie les profils qui activent un écosystème.',
    ctaLabel: 'Recruter un Channel',
    missions: [
      'Recrutement et activation de partenaires',
      'Co-selling et co-marketing',
      'Pilotage de la performance partenaire',
      'Structuration du programme channel',
    ],
    profil: [
      'Sens de l’écosystème',
      'Diplomatie commerciale',
      'Vision long terme',
      'Track record de revenu indirect',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'Le revenu indirect demande un profil rare : commercial dans l’âme mais patient, capable d’activer un écosystème plutôt que de closer en direct. Peu de candidats ont un vrai track record channel.',
      ote: '72-113k€',
      oteLabel: 'selon la séniorité',
    },
    faq: [
      {
        q: 'Combien coûte un Channel Manager en 2026 ?',
        a: 'Le package se situe autour de 72-113k€ brut par an selon la séniorité et le contexte. Pour le détail, consultez notre grille des salaires Sales 2026.',
      },
      {
        q: 'Quand lancer une stratégie channel ?',
        a: 'Quand le produit est mûr et que des partenaires peuvent accélérer la distribution sans cannibaliser la vente directe.',
      },
      {
        q: 'Comment mesurer la performance ?',
        a: 'Revenu généré par les partenaires, nombre de partenaires actifs et pipeline co-construit.',
      },
      {
        q: 'Quand recruter son premier Channel Manager ?',
        a: 'Quand le produit est mûr et que des partenaires peuvent accélérer la distribution sans cannibaliser la vente directe. Trop tôt, l’écosystème n’existe pas encore et le profil tourne à vide.',
      },
    ],
    related: [
      { slug: 'sales-manager', label: 'Sales Manager' },
      { slug: 'head-of-sales', label: 'Head of Sales' },
      { slug: 'vp-sales', label: 'VP Sales' },
    ],
    serviceType: 'Recrutement Channel / Partner Manager',
    serviceDescription: 'Le Channel / Partner Manager est un commercial qui construit un revenu indirect via revendeurs et partenaires. Mariell identifie les profils qui activent un écosystème.',
    seo: {
      title: 'Recrutement Channel / Partner Manager | Mariell',
      description: 'Le Channel / Partner Manager construit un revenu indirect via partenaires. Mariell identifie les profils qui activent un écosystème.',
    },
  },
  {
    slug: 'head-of-sales',
    group: 'Directors',
    label: 'Head of Sales',
    h1: 'Structurer et scaler la vente.',
    heroLabel: 'Directors',
    heroParagraph: 'Le Head of Sales construit la machine commerciale et la met à l’échelle. Mariell recrute des bâtisseurs qui passent de l’artisanat à l’industrie.',
    ctaLabel: 'Recruter un Head of Sales',
    missions: [
      'Construction de la stratégie commerciale',
      'Structuration de l’équipe et du playbook',
      'Pilotage du forecast et de la performance',
      'Recrutement et développement des talents',
    ],
    profil: [
      'Vision stratégique et exécution',
      'Expérience de scaling',
      'Leadership d’équipe',
      'Track record de croissance du revenu',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'Le Head of Sales fait passer la vente de l’artisanat à l’industrie. C’est l’un des recrutements les plus structurants et les plus risqués : un mauvais choix coûte des trimestres de croissance.',
      ote: '140-280k€',
      oteLabel: 'selon le stade et la taille',
    },
    faq: [
      {
        q: 'Head of Sales ou VP Sales ?',
        a: 'Le Head of Sales pilote l’exécution et l’équipe ; le VP Sales opère à plus grande échelle, souvent multi-équipes.',
      },
      {
        q: 'Quand recruter un Head of Sales ?',
        a: 'Quand les fondateurs ne peuvent plus porter la vente seuls et qu’il faut structurer process, équipe et forecast.',
      },
      {
        q: 'Combien coûte un Head of Sales en 2026 ?',
        a: 'Le package OTE indicatif d’un Head of Sales se situe entre 140 et 280k€ en France, selon le stade de l’entreprise, de la startup à l’ETI. Les fourchettes complètes par contexte sont dans notre grille des salaires Sales 2026.',
      },
    ],
    related: [
      { slug: 'vp-sales', label: 'VP Sales' },
      { slug: 'sales-manager', label: 'Sales Manager' },
      { slug: 'recrutement-scale-up', label: 'Recrutement scale-up' },
    ],
    serviceType: 'Recrutement Head of Sales',
    serviceDescription: 'Le Head of Sales construit la machine commerciale et la met à l’échelle. Mariell recrute des bâtisseurs qui passent de l’artisanat à l’industrie.',
    seo: {
      title: 'Recrutement Head of Sales et Directeur Commercial | Mariell',
      description: 'Recrutement de Head of Sales, aussi appelé Directeur Commercial. Mariell recrute des bâtisseurs qui construisent et développent la machine commerciale.',
    },
  },
  {
    slug: 'vp-sales',
    group: 'Directors',
    label: 'VP Sales',
    h1: 'Le revenu à l’échelle, sous contrôle.',
    heroLabel: 'Directors',
    heroParagraph: 'Le VP Sales pilote une organisation commerciale multi-équipes. Mariell sélectionne des dirigeants commerciaux capables de tenir un plan ambitieux.',
    ctaLabel: 'Recruter un VP Sales',
    missions: [
      'Pilotage d’une organisation commerciale',
      'Définition de la go-to-market',
      'Construction du forecast et des objectifs',
      'Recrutement du middle management',
    ],
    profil: [
      'Leadership à l’échelle',
      'Maîtrise de la go-to-market',
      'Board-readiness',
      'Track record de scaling commercial',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'Le VP Sales, aussi appelé Directeur Commercial, pilote une organisation commerciale entière. Profil rare, souvent déjà en poste et très courtisé. Le recruter exige discrétion, réseau et une évaluation board-ready.',
      ote: '210-400k€',
      oteLabel: 'selon le stade',
    },
    faq: [
      {
        q: 'Quelle différence avec le CRO ?',
        a: 'Le VP Sales dirige la vente ; le CRO aligne l’ensemble des fonctions revenu (Sales, Marketing, CS).',
      },
      {
        q: 'Combien de temps pour ce type de recherche ?',
        a: 'Un poste de direction se chasse avec soin. Nous restons sur une approche directe, discrète et qualifiée.',
      },
      {
        q: 'Combien gagne un VP Sales ?',
        a: 'Le package OTE d’un VP Sales tourne autour de 210-400k€ en France selon la taille de l’organisation et le stade de l’entreprise. Profil rare, souvent déjà en poste.',
      },
    ],
    related: [
      { slug: 'cro', label: 'CRO' },
      { slug: 'head-of-sales', label: 'Head of Sales' },
      { slug: 'recrutement-strategique', label: 'Recrutement stratégique' },
    ],
    serviceType: 'Recrutement VP Sales',
    serviceDescription: 'Le VP Sales pilote une organisation commerciale multi-équipes. Mariell sélectionne des dirigeants commerciaux capables de tenir un plan ambitieux.',
    seo: {
      title: 'Recrutement VP Sales et Directeur Commercial | Mariell',
      description: 'Recrutement de VP Sales, aussi appelé Directeur Commercial. Mariell sélectionne des dirigeants commerciaux capables de tenir un plan ambitieux.',
    },
  },
  {
    slug: 'cro',
    group: 'Directors',
    label: 'CRO',
    h1: 'Toute la machine de revenus, alignée.',
    heroLabel: 'Directors',
    heroParagraph: 'Le CRO, plus haut dirigeant commercial, aligne Sales, Marketing et Customer Success autour du revenu. Mariell recrute les dirigeants qui pensent revenu de bout en bout.',
    ctaLabel: 'Recruter un CRO',
    missions: [
      'Alignement Sales / Marketing / CS',
      'Stratégie de revenu globale',
      'Pilotage du plan et du board',
      'Construction de l’équipe de direction commerciale',
    ],
    profil: [
      'Vision revenu de bout en bout',
      'Leadership exécutif',
      'Board-readiness',
      'Track record de direction des revenus',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'Le CRO est le recrutement revenu le plus stratégique. Il aligne Sales, Marketing et CS et rend des comptes au board. Le vivier est étroit, les enjeux maximaux, l’erreur très coûteuse.',
      ote: '220-420k€',
      oteLabel: 'selon le stade',
    },
    faq: [
      {
        q: 'Combien coûte un CRO en 2026 ?',
        a: 'Le package se situe autour de 220-420k€ brut par an selon la séniorité et le contexte. Pour le détail, consultez notre grille des salaires Sales 2026.',
      },
      {
        q: 'Quand une entreprise a-t-elle besoin d’un CRO ?',
        a: 'Quand le revenu devient multi-canal et qu’il faut aligner plusieurs fonctions sous une stratégie unique.',
      },
      {
        q: 'Comment sécuriser ce recrutement ?',
        a: 'Approche directe ciblée, évaluation approfondie et médiation board-ready jusqu’à la signature.',
      },
      {
        q: 'Quelle différence entre un CRO et un VP Sales ?',
        a: 'Le VP Sales dirige la vente. Le CRO aligne l’ensemble des fonctions revenu : Sales, Marketing et Customer Success. Le CRO est un rôle plus large, qui pense le revenu de bout en bout.',
      },
    ],
    related: [
      { slug: 'vp-sales', label: 'VP Sales' },
      { slug: 'head-of-sales', label: 'Head of Sales' },
      { slug: 'recrutement-strategique', label: 'Recrutement stratégique' },
    ],
    serviceType: 'Recrutement CRO',
    serviceDescription: 'Le CRO, plus haut dirigeant commercial, aligne Sales, Marketing et Customer Success autour du revenu. Mariell recrute les dirigeants qui pensent revenu de bout en bout.',
    seo: {
      title: 'Recrutement CRO | Mariell',
      description: 'Le CRO, plus haut dirigeant commercial, aligne Sales, Marketing et Customer Success autour du revenu. Mariell recrute les dirigeants qui pensent revenu de bout en bout.',
    },
  },
  {
    slug: 'recrutement-seed',
    group: 'Par contexte',
    label: 'Recrutement seed',
    h1: 'Les premiers Sales d’une startup seed.',
    heroLabel: 'Par contexte',
    heroParagraph: 'En seed, chaque recrutement commercial compte triple. Mariell aide les fondateurs à recruter leurs premiers commerciaux, ceux qui poseront les fondations.',
    ctaLabel: 'Discuter de votre recrutement seed',
    missions: [
      'Premiers profils commerciaux',
      'Construction du sales process initial',
      'Profils autonomes et polyvalents',
      'Alignement fort avec les fondateurs',
    ],
    profil: [
      'Tempérament early-stage',
      'Autonomie et débrouillardise',
      'Adhésion à la vision',
      'Capacité à construire from scratch',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'En seed, chaque recrutement pèse triple. Les premiers commerciaux posent les fondations culturelles et méthodologiques de toute la future équipe. L’erreur de casting y est particulièrement coûteuse.',
    },
    faq: [
      {
        q: 'Quel premier profil Sales recruter ?',
        a: 'Souvent un profil autonome et polyvalent (full-cycle) capable de construire le process en même temps qu’il vend.',
      },
      {
        q: 'Faut-il recruter avant ou après le product-market fit ?',
        a: 'Idéalement quand les premiers signaux de PMF sont là, pour ne pas brûler le runway en chasse prématurée.',
      },
      {
        q: 'Faut-il un commercial ou un fondateur qui vend en phase seed ?',
        a: 'Au tout début, les fondateurs portent la vente, c’est sain. On recrute un premier commercial quand le founder-led sales atteint ses limites de temps, et qu’il faut un profil autonome capable de construire le process en même temps qu’il vend.',
      },
    ],
    related: [
      { slug: 'business-developer-full-cycle', label: 'Business Developer Full Cycle' },
      { slug: 'recrutement-scale-up', label: 'Recrutement scale-up' },
      { slug: 'team-buildout', label: 'Team Buildout' },
    ],
    serviceType: 'Recrutement seed',
    serviceDescription: 'En seed, chaque recrutement commercial compte triple. Mariell aide les fondateurs à recruter leurs premiers commerciaux, ceux qui poseront les fondations.',
    seo: {
      title: 'Recruter ses premiers Sales en seed | Mariell',
      description: 'En seed, chaque recrutement commercial compte triple. Mariell aide les fondateurs à recruter leurs premiers commerciaux, ceux qui poseront les fondations.',
    },
  },
  {
    slug: 'recrutement-scale-up',
    group: 'Par contexte',
    label: 'Recrutement scale-up',
    h1: 'Passer à l’échelle sans casser la machine.',
    heroLabel: 'Par contexte',
    heroParagraph: 'En scale-up, il faut recruter vos commerciaux vite et bien, sans diluer la culture. Mariell sécurise les recrutements commerciaux de la phase d’hypercroissance.',
    ctaLabel: 'Discuter de votre recrutement scale-up',
    missions: [
      'Recrutements en volume maîtrisé',
      'Profils prêts pour l’échelle',
      'Préservation de la culture',
      'Structuration des équipes',
    ],
    profil: [
      'Expérience de l’hypercroissance',
      'Capacité d’intégration rapide',
      'Standard de performance élevé',
      'Fit culturel vérifié',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'En scale-up, il faut recruter vite et bien sans diluer la culture. Le rythme d’embauche met la barre de qualité sous tension : c’est là que beaucoup d’équipes commerciales se cassent.',
    },
    faq: [
      {
        q: 'Comment recruter en volume sans baisser la qualité ?',
        a: 'En gardant un standard d’évaluation constant et en chassant en parallèle plutôt qu’en réagissant poste par poste.',
      },
      {
        q: 'Comment préserver la culture ?',
        a: 'En intégrant le fit culturel à l’évaluation, au même titre que le track record.',
      },
      {
        q: 'À quel rythme recruter des commerciaux en scale-up ?',
        a: 'Le bon rythme est celui que votre onboarding peut absorber sans casser la qualité. Recruter dix commerciaux qu’on ne peut pas ramper correctement coûte plus cher que d’en recruter cinq qui performent. La cadence suit la capacité à faire monter en compétence.',
      },
    ],
    related: [
      { slug: 'team-buildout', label: 'Team Buildout' },
      { slug: 'head-of-sales', label: 'Head of Sales' },
      { slug: 'recrutement-seed', label: 'Recrutement seed' },
    ],
    serviceType: 'Recrutement scale-up',
    serviceDescription: 'En scale-up, il faut recruter vos commerciaux vite et bien, sans diluer la culture. Mariell sécurise les recrutements commerciaux de la phase d’hypercroissance.',
    seo: {
      title: 'Recrutement Sales en scale-up | Mariell',
      description: 'En scale-up, recruter vite et bien sans diluer la culture. Mariell sécurise les recrutements commerciaux de la phase d’hypercroissance.',
    },
  },
  {
    slug: 'team-buildout',
    group: 'Par contexte',
    label: 'Team Buildout',
    h1: 'Bâtir une équipe Sales complète, d’un coup.',
    heroLabel: 'Par contexte',
    heroParagraph: 'Plutôt qu’un poste après l’autre, Mariell orchestre la construction d’une équipe commerciale entière, du SDR au management, en une chasse coordonnée.',
    ctaLabel: 'Discuter d’un Team Buildout',
    missions: [
      'Construction d’une équipe complète',
      'Chasse coordonnée multi-postes',
      'Cohérence des profils entre eux',
      'Alignement sur le plan d’opération',
    ],
    profil: [
      'Vision d’équipe cohérente',
      'Profils complémentaires',
      'Calendrier de montée en charge',
      'Sur-mesure selon le contexte',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'Construire une équipe entière d’un coup évite l’effet puzzle des recrutements successifs. La difficulté : assurer la cohérence des profils entre eux et leur montée en charge coordonnée.',
    },
    faq: [
      {
        q: 'Pourquoi un buildout plutôt que poste par poste ?',
        a: 'Pour gagner du temps, garantir la cohérence de l’équipe et aligner les profils sur un même plan d’opération.',
      },
      {
        q: 'Combien de postes dans un buildout ?',
        a: 'De quelques recrutements à une équipe complète, du SDR au management, selon votre plan.',
      },
      {
        q: 'Combien de temps pour constituer une équipe Sales complète ?',
        a: 'Cela dépend du nombre de postes et de leur séniorité, mais une chasse coordonnée est plus rapide que des recrutements successifs lancés séparément. Les profils sont cherchés en parallèle, avec une vision d’équipe dès le départ.',
      },
    ],
    related: [
      { slug: 'recrutement-scale-up', label: 'Recrutement scale-up' },
      { slug: 'sales-manager', label: 'Sales Manager' },
      { slug: 'head-of-sales', label: 'Head of Sales' },
    ],
    serviceType: 'Recrutement Team Buildout',
    serviceDescription: 'Plutôt qu’un poste après l’autre, Mariell orchestre la construction d’une équipe commerciale entière, du SDR au management, en une chasse coordonnée.',
    seo: {
      title: 'Constituer une équipe Sales | Mariell',
      description: 'Plutôt qu’un poste après l’autre, Mariell construit une équipe commerciale entière, du SDR au management, en une chasse coordonnée.',
    },
  },
  {
    slug: 'recrutement-strategique',
    group: 'Par contexte',
    label: 'Recrutement stratégique',
    h1: 'Le hire qui change la trajectoire.',
    heroLabel: 'Par contexte',
    heroParagraph: 'Certains recrutements commerciaux pèsent sur toute la trajectoire de l’entreprise. Mariell sécurise ces nominations stratégiques avec un soin particulier.',
    ctaLabel: 'Discuter d’un recrutement stratégique',
    missions: [
      'Identification de profils rares',
      'Approche discrète et ciblée',
      'Évaluation approfondie',
      'Médiation jusqu’à la signature',
    ],
    profil: [
      'Profil rare et stratégique',
      'Confidentialité',
      'Alignement board et fondateurs',
      'Impact direct sur la trajectoire',
    ],
    marche: {
      heading: 'Le marché de ce profil',
      paragraph: 'Certaines nominations changent la trajectoire de l’entreprise. Elles exigent discrétion, ciblage fin et évaluation approfondie : on ne recrute pas un profil rare comme un poste courant.',
    },
    faq: [
      {
        q: 'Qu’est-ce qu’un recrutement stratégique ?',
        a: 'Une nomination à fort impact (direction, profil rare, enjeu confidentiel) qui pèse sur la trajectoire de l’entreprise.',
      },
      {
        q: 'Pourquoi une approche dédiée ?',
        a: 'Parce que la confidentialité, le ciblage et l’évaluation y sont bien plus exigeants qu’un recrutement standard.',
      },
      {
        q: 'Comment garantir la confidentialité d’un recrutement stratégique ?',
        a: 'Par une approche directe et discrète, sans annonce ni diffusion. Le profil est approché individuellement, l’entreprise n’est dévoilée qu’aux candidats sérieusement engagés. C’est indispensable quand le poste est sensible ou que le titulaire actuel n’est pas au courant.',
      },
    ],
    related: [
      { slug: 'cro', label: 'CRO' },
      { slug: 'vp-sales', label: 'VP Sales' },
      { slug: 'head-of-sales', label: 'Head of Sales' },
    ],
    serviceType: 'Recrutement stratégique',
    serviceDescription: 'Certains recrutements commerciaux pèsent sur toute la trajectoire de l’entreprise. Mariell sécurise ces nominations stratégiques avec un soin particulier.',
    seo: {
      title: 'Recrutement Sales stratégique | Mariell',
      description: 'Certains recrutements commerciaux pèsent sur toute la trajectoire de l’entreprise. Mariell sécurise ces nominations stratégiques avec un soin particulier.',
    },
  },
]

export function getExpertise(slug: string): Expertise | undefined {
  return expertises.find(e => e.slug === slug)
}
