export interface CasSection {
  heading: string
  paragraphs: string[]
}

export interface CasMetric {
  value: string
  label: string
}

export interface CasClient {
  slug: string
  client: string
  sector: string
  h1: string
  summary: string
  sections: CasSection[]
  metrics: CasMetric[]
  logo: string
  seo: {
    title: string
    description: string
  }
  articleDescription: string
}

export const casClients: CasClient[] = [
  {
    slug: 'dhala',
    client: 'Dhala',
    sector: 'Cybersécurité',
    h1: 'Un Sales Manager recruté pour structurer la vente d’une startup de la cybersécurité, et construire son premier playbook commercial.',
    summary: 'Un Sales Manager recruté pour bâtir le playbook d’une phase d’hypercroissance.',
    sections: [
      {
        heading: 'Le contexte',
        paragraphs: [
          'Dhala opère sur le marché tendu de la cybersécurité, où les profils commerciaux qui maîtrisent à la fois la technicité produit et la vente complexe sont rares. L’enjeu : passer d’une vente portée par les fondateurs à une machine commerciale structurée.',
        ],
      },
      {
        heading: 'La mission confiée à Mariell',
        paragraphs: [
          'Identifier un Sales Manager capable de bâtir le playbook, recruter et coacher une première équipe, tout en restant proche du terrain sur un cycle de vente technique.',
        ],
      },
      {
        heading: 'Notre approche',
        paragraphs: [
          'Le marché de la cybersécurité impose une double contrainte : trouver un profil qui maîtrise la technicité produit et la vente complexe, tout en sachant bâtir une organisation de zéro. Nous avons ciblé des Sales Managers ayant déjà construit un playbook en environnement technique exigeant, pas seulement managé une équipe existante. L’évaluation a porté sur la légitimité terrain (capacité à rester proche d’un cycle de vente technique) autant que sur les aptitudes de structuration et de coaching. Le profil retenu devait pouvoir recruter et faire monter une première équipe, tout en gardant la main sur les deals stratégiques.',
        ],
      },
    ],
    metrics: [
      { value: '1', label: 'Sales Manager recruté' },
      { value: 'A → Z', label: 'Playbook commercial construit' },
      { value: '1ère', label: 'Équipe commerciale fondée' },
    ],
    logo: '/assets/client-logos/dhala-logo.png',
    seo: {
      title: 'Dhala, cas client recrutement Sales | Mariell',
      description: 'Un Sales Manager recruté pour structurer la vente d’une startup cybersécurité et bâtir son premier playbook commercial. Cas client Mariell.',
    },
    articleDescription: 'Cas client Dhala, recrutement Sales par Mariell',
  },
  {
    slug: 'kraaft',
    client: 'Kraaft',
    sector: 'Contech · SaaS',
    h1: 'Deux Account Executives Mid-Market recrutés en parallèle pour couvrir les marchés français et britannique, et accompagner l’expansion internationale d’une scale-up de la construction.',
    summary: '2 Account Executives Mid-Market recrutés en France et au Royaume-Uni, en moins de 8 semaines.',
    sections: [
      {
        heading: 'Le contexte',
        paragraphs: [
          'Kraaft édite une application de coordination de chantier adoptée par les équipes terrain du BTP. Après une Série A, l’entreprise devait structurer sa vente Mid-Market sur deux marchés simultanément, le marché français et le marché britannique, sans diluer le niveau d’exigence commercial.',
        ],
      },
      {
        heading: 'La mission confiée à Mariell',
        paragraphs: [
          'Recruter deux AE Mid-Market capables de vendre un produit terrain à des décideurs construction, sur des cycles structurés, dans deux contextes linguistiques et culturels distincts.',
        ],
      },
      {
        heading: 'Notre approche',
        paragraphs: [
          'Le défi de cette mission tenait à la simultanéité : deux marchés, deux langues, deux cultures de vente, sans dilution du niveau d’exigence. Nous avons mené deux chasses en parallèle, l’une sur le vivier français, l’autre sur le marché britannique, avec des critères d’évaluation alignés mais des grilles de lecture adaptées à chaque contexte. L’évaluation a porté en priorité sur la capacité à vendre un produit terrain à des décideurs construction, sur des cycles Mid-Market structurés. Les deux profils ont été présentés, validés et signés en moins de huit semaines, sans compromis sur la qualité.',
        ],
      },
    ],
    metrics: [
      { value: '2', label: 'AE Mid-Market recrutés' },
      { value: 'FR + UK', label: 'Marchés couverts simultanément' },
      { value: '< 8 sem.', label: 'Délai de recrutement' },
    ],
    logo: '/assets/client-logos/kraaft-logo.png',
    seo: {
      title: 'Kraaft, cas client recrutement Sales | Mariell',
      description: 'Deux AE Mid-Market recrutés en parallèle pour les marchés français et britannique, pour l’expansion d’une scale-up contech. Cas client Mariell.',
    },
    articleDescription: 'Cas client Kraaft, recrutement Sales par Mariell',
  },
  {
    slug: 'reconomia',
    client: 'Reconomia',
    sector: 'Économie circulaire',
    h1: 'Une structuration commerciale complète (Field Sales, COO et CFO) pour une startup de l’économie circulaire adossée au groupe UnitedB (famille Mulliez).',
    summary: 'Une structuration complète, du Field Sales au comité de direction (COO, CFO).',
    sections: [
      {
        heading: 'Le contexte',
        paragraphs: [
          'Reconomia s’attaque au reconditionnement à l’échelle, portée par l’écosystème UnitedB. La structuration demandait à la fois des profils terrain et des dirigeants capables de poser les fondations opérationnelles et financières.',
        ],
      },
      {
        heading: 'La mission confiée à Mariell',
        paragraphs: [
          'Couvrir un spectre large en un seul build : du Field Sales au comité de direction (COO, CFO), avec une cohérence d’ensemble et un alignement sur le plan de structuration.',
        ],
      },
      {
        heading: 'Notre approche',
        paragraphs: [
          'Cette mission ne relevait pas d’un recrutement isolé mais d’une structuration coordonnée : poser en même temps le socle terrain et le comité de direction. Nous avons traité le build comme un ensemble cohérent, en séquençant les recherches pour que les profils dirigeants (COO, CFO) et les Field Sales s’articulent sur une vision commune, alignée avec l’écosystème UnitedB. Chaque profil a été évalué non seulement sur ses compétences propres, mais sur sa complémentarité avec les autres maillons de la structure. L’enjeu était la cohérence d’ensemble autant que la qualité individuelle.',
        ],
      },
    ],
    metrics: [
      { value: '2', label: 'Field Sales recrutés' },
      { value: '1 COO + 1 CFO', label: 'Direction recrutée' },
      { value: '1', label: 'Chasse coordonnée' },
    ],
    logo: '/assets/client-logos/reconomia-logo.png',
    seo: {
      title: 'Reconomia, cas client recrutement Sales | Mariell',
      description: 'Field Sales, COO et CFO recrutés en une chasse coordonnée pour une startup de l’économie circulaire (groupe UnitedB). Cas client Mariell.',
    },
    articleDescription: 'Cas client Reconomia, recrutement Sales par Mariell',
  },
  {
    slug: 'nextmotion',
    client: 'Nextmotion',
    sector: 'Medtech · SaaS',
    h1: 'Un BDR et un Head of Sales recrutés pour une medtech en phase seed, avec construction du sales process et du playbook.',
    summary: 'Un BDR et un Head of Sales pour poser les fondations commerciales d’une medtech en seed.',
    sections: [
      {
        heading: 'Le contexte',
        paragraphs: [
          'Nextmotion équipe les praticiens de l’esthétique d’une solution SaaS de suivi patient. En phase seed, tout était à construire : le process de vente, le playbook, et les premiers profils pour l’exécuter.',
        ],
      },
      {
        heading: 'La mission confiée à Mariell',
        paragraphs: [
          'Poser les fondations commerciales : un Head of Sales pour structurer et un BDR pour alimenter le pipeline, avec un sales process et un playbook conçus sur mesure.',
        ],
      },
      {
        heading: 'Notre approche',
        paragraphs: [
          'En phase seed, tout était à construire : il ne s’agissait pas de combler deux postes, mais de poser les fondations commerciales d’une medtech. Nous avons abordé la mission en pensant l’articulation entre les deux profils, un Head of Sales pour structurer le process et le playbook, un BDR pour alimenter le pipeline une fois les fondations posées. L’évaluation du Head of Sales a porté sur sa capacité à construire de zéro, pas à gérer un existant. Celle du BDR, sur sa résilience et son autonomie dans un environnement encore mouvant, où le process se définit en marchant.',
        ],
      },
    ],
    metrics: [
      { value: '1 BDR', label: 'Recruté' },
      { value: '1 HoS', label: 'Head of Sales recruté' },
      { value: '0 → 1', label: 'Sales process construit' },
    ],
    logo: '/assets/client-logos/nextmotion-logo.png',
    seo: {
      title: 'Nextmotion, cas client recrutement Sales | Mariell',
      description: 'Un BDR et un Head of Sales recrutés pour poser les fondations commerciales d’une medtech en phase seed. Cas client Mariell.',
    },
    articleDescription: 'Cas client Nextmotion, recrutement Sales par Mariell',
  },
  {
    slug: 'wikit',
    client: 'Wikit',
    sector: 'IA Chatbot',
    h1: 'Un Account Executive SMB & Mid-Market recruté pour une startup de l’IA conversationnelle, en transition seed vers Série A.',
    summary: 'Un Account Executive SMB & Mid-Market pour fiabiliser la vente d’une scale-up IA.',
    sections: [
      {
        heading: 'Le contexte',
        paragraphs: [
          'Wikit édite une plateforme d’agents conversationnels IA pour l’entreprise. En transition de seed vers Série A, l’enjeu était de fiabiliser la vente sur les segments SMB et Mid-Market avec un profil capable de tenir les deux.',
        ],
      },
      {
        heading: 'La mission confiée à Mariell',
        paragraphs: [
          'Recruter un Account Executive polyvalent SMB & Mid-Market, à l’aise sur des cycles variés et capable d’accompagner la montée en gamme de l’entreprise.',
        ],
      },
      {
        heading: 'Notre approche',
        paragraphs: [
          'La difficulté de cette mission tenait à la polyvalence demandée : un seul profil capable de tenir deux segments, SMB et Mid-Market, avec des cycles de vente différents. Nous avons cherché un Account Executive à l’aise sur cette double échelle, capable d’accompagner la montée en gamme de Wikit au fil de sa transition seed vers Série A. L’évaluation a porté sur la capacité à naviguer des cycles courts et plus longs sans se cantonner à l’un des deux, et sur le track record en contexte de produit IA encore en structuration commerciale.',
        ],
      },
    ],
    metrics: [
      { value: '1', label: 'AE SMB & Mid-Market recruté' },
      { value: 'SMB + MM', label: 'Deux segments fiabilisés' },
      { value: 'Seed → A', label: 'Transition accompagnée' },
    ],
    logo: '/assets/client-logos/wikit-logo.png',
    seo: {
      title: 'Wikit, cas client recrutement Sales | Mariell',
      description: 'Un AE SMB & Mid-Market recruté pour une startup de l’IA conversationnelle en transition seed vers Série A. Cas client Mariell.',
    },
    articleDescription: 'Cas client Wikit, recrutement Sales par Mariell',
  },
  {
    slug: 'sastec',
    client: 'SASTEC',
    sector: 'Agence SaaS Logiciel',
    h1: 'Un Partnership Manager recruté puis promu Director : une trajectoire d’évolution accompagnée pour une agence SaaS logiciel.',
    summary: 'Un Partnership Manager recruté puis promu Director.',
    sections: [
      {
        heading: 'Le contexte',
        paragraphs: [
          'SASTEC est une agence SaaS qui conçoit des solutions logicielles et développe sa croissance par les partenariats. Le revenu indirect demandait un profil capable d’activer un écosystème, puis de le diriger.',
        ],
      },
      {
        heading: 'La mission confiée à Mariell',
        paragraphs: [
          'Recruter un Partnership Manager à fort potentiel, avec une trajectoire d’évolution claire vers un rôle de Director au fur et à mesure de la montée en charge.',
        ],
      },
      {
        heading: 'Notre approche',
        paragraphs: [
          'Le revenu indirect, porté par les partenaires, demande un profil capable d’activer un écosystème puis de le diriger. La mission avait une dimension de trajectoire : recruter un Partnership Manager à fort potentiel, avec une évolution claire vers un rôle de Director au fil de la montée en charge. Nous avons évalué les candidats autant sur leur capacité à développer un réseau de partenaires que sur leur potentiel de leadership à moyen terme. Le profil retenu a confirmé cette trajectoire, en étant promu Director une fois l’écosystème partenaire installé.',
        ],
      },
    ],
    metrics: [
      { value: '1', label: 'Partnership Manager recruté' },
      { value: 'Director', label: 'Promotion concrétisée' },
      { value: '1', label: 'Stratégie partenaires activée' },
    ],
    logo: '/assets/client-logos/sastec-logo.png',
    seo: {
      title: 'SASTEC, cas client recrutement Sales | Mariell',
      description: 'Un Partnership Manager recruté puis promu Director pour une agence SaaS logiciel. Cas client Mariell.',
    },
    articleDescription: 'Cas client SASTEC, recrutement Sales par Mariell',
  },
  {
    slug: 'reality-academy',
    client: 'Reality Academy',
    sector: 'Edtech · SaaS VR',
    h1: 'Constitution d’une équipe d’Account Executives pour une startup edtech en réalité virtuelle, dans une phase de structuration commerciale.',
    summary: 'Une équipe d’Account Executives constituée pour évangéliser un produit nouveau.',
    sections: [
      {
        heading: 'Le contexte',
        paragraphs: [
          'Reality Academy combine pédagogie et VR sur un marché edtech en pleine définition. Vendre un produit innovant à des acheteurs encore en apprentissage du format exige des AE pédagogues autant que commerciaux.',
        ],
      },
      {
        heading: 'La mission confiée à Mariell',
        paragraphs: [
          'Constituer une équipe d’Account Executives capables d’évangéliser un produit nouveau, structurer le discours de vente et porter la croissance d’une startup French Tech.',
        ],
      },
      {
        heading: 'Notre approche',
        paragraphs: [
          'Vendre un produit nouveau à un marché encore en apprentissage de son format demande des profils particuliers : des Account Executives autant pédagogues que commerciaux, capables d’évangéliser avant de closer. Nous avons constitué l’équipe en cherchant des profils à l’aise dans la vente de rupture, là où le réflexe d’achat n’existe pas encore et où il faut construire le besoin. L’évaluation a intégré la capacité à structurer un discours de vente sur un produit sans référent direct sur le marché, et le fit avec une startup French Tech en pleine définition de son modèle commercial.',
        ],
      },
    ],
    metrics: [
      { value: '2 AE', label: 'Équipe constituée' },
      { value: '7 M€+', label: 'Valorisation accompagnée' },
      { value: '1', label: 'Discours de vente structuré' },
    ],
    logo: '/assets/client-logos/reality-academy-logo.png',
    seo: {
      title: 'Reality Academy, cas client recrutement Sales | Mariell',
      description: 'Une équipe d’Account Executives constituée pour une edtech en réalité virtuelle, en phase de structuration commerciale. Cas client Mariell.',
    },
    articleDescription: 'Cas client Reality Academy, recrutement Sales par Mariell',
  },
  {
    slug: 'kickmaker',
    client: 'Kickmaker',
    sector: 'Hardware · Industrie',
    h1: 'Deux Senior Sales recrutés sur deux régions différentes pour un acteur du conseil hardware en hypercroissance, soutenu par MML et BPIFrance.',
    summary: 'Deux Senior Sales pour porter une vente de conseil technique à cycle long.',
    sections: [
      {
        heading: 'Le contexte',
        paragraphs: [
          'Kickmaker accompagne l’industrialisation de produits hardware : une vente de conseil à cycle long, à fort contenu technique, auprès de directions industrielles. Les profils capables de vendre cette expertise sont rares.',
        ],
      },
      {
        heading: 'La mission confiée à Mariell',
        paragraphs: [
          'Recruter deux Senior Sales aguerris à la vente de conseil technique, capables de porter des cycles longs en environnement industriel exigeant, sur deux régions distinctes.',
        ],
      },
      {
        heading: 'Notre approche',
        paragraphs: [
          'La vente de conseil technique à cycle long, auprès de directions industrielles, repose sur un profil rare : des Senior Sales capables de porter une expertise complexe sur des cycles étendus, dans un secteur où la crédibilité technique précède la relation commerciale. Nous avons ciblé des profils aguerris à ce type de vente conseil, en écartant les commerciaux habitués aux cycles courts ou aux produits standardisés. L’évaluation a porté sur la maîtrise de la vente longue à fort contenu technique, et sur la capacité à dialoguer d’égal à égal avec des décideurs industriels exigeants.',
        ],
      },
    ],
    metrics: [
      { value: '2', label: 'Senior Sales recrutés' },
      { value: '2 régions', label: 'Couverture terrain' },
      { value: 'MML + BPI', label: 'Investisseurs' },
    ],
    logo: '/assets/client-logos/kickmaker-logo.png',
    seo: {
      title: 'Kickmaker, cas client recrutement Sales | Mariell',
      description: 'Deux Senior Sales recrutés sur deux régions différentes pour un acteur du conseil hardware soutenu par MML et BPIFrance. Cas client Mariell.',
    },
    articleDescription: 'Cas client Kickmaker, recrutement Sales par Mariell',
  },
]

export function getCas(slug: string): CasClient | undefined {
  return casClients.find((c) => c.slug === slug)
}
