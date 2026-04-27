// TODO: remplacer calendlyUrl par l'URL Calendly réelle (ex: "https://calendly.com/mariell/intro")
export const siteConfig = {
  calendlyUrl: '#',
  ctaPrimary: 'Contact Mariell',
  ctaHero: 'Rencontrer Mariell',
  ctaPricing: 'Rencontre avec Mariell',
  ctaFinal: 'Partager son besoin à Mariell',
} as const

export interface NavLink {
  label: string
  href: string
  hasDropdown?: boolean
  badge?: boolean
}

export const navLinks: NavLink[] = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Who is Mariell ?', href: '#who' },
  { label: 'Process', href: '#process' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Le Lab Mariell', href: '/lab', hasDropdown: true, badge: true },
]

export const labDropdown = [
  { label: 'Découvrir le Lab', href: '/lab', disabled: false },
  { label: 'Guides — bientôt', href: '#', disabled: true },
  { label: 'Outils — bientôt', href: '#', disabled: true },
  { label: 'Études — bientôt', href: '#', disabled: true },
] as const

export const clients = Array.from({ length: 11 }, (_, i) => ({
  name: `Client ${i + 1}`,
  logo: `/logo_${i + 1}.png`,
}))

export interface Testimonial {
  name: string
  role: string
  quote: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Julien Moreau',
    role: 'Head of Sales, SaaS B2B',
    quote:
      "Mariell nous a trouvé un AE senior en 18 jours après 4 mois de recherche interne. Le profil était top-tier, closing dès le premier trimestre.",
  },
  {
    name: 'Sophie Leclerc',
    role: 'CEO, Scale-up Fintech',
    quote:
      "On a testé 3 cabinets avant Mariell. La différence saute aux yeux : ils comprennent le métier Sales parce qu'ils l'ont fait.",
  },
  {
    name: 'Antoine Dubois',
    role: 'VP Sales, Cybersécurité',
    quote:
      "Recrutement d'un Sales Director. Shortlist de 4 candidats, 3 étaient excellents. On a embauché celui qui a déjà dépassé ses quotas Q1.",
  },
  {
    name: 'Émilie Roux',
    role: 'COO, MarTech',
    quote:
      "La transparence sur le pricing et le suivi à 4 et 8 mois change tout. Pas de 'place and forget', vraie partnership.",
  },
  {
    name: 'Nicolas Perrin',
    role: 'Founder, PropTech',
    quote:
      "Premier SDR recruté via Mariell. En 6 mois il a généré plus de pipeline que mes 2 seniors précédents.",
  },
]

export const benefits = [
  {
    icon: '📈',
    title: 'Résultats',
    text: "60+ Tops profils recrutés, qui drive la croissance de nos partenaires.\n\nDu SDR (Sales Development Representative) au Head of Sales.\nDes performances mesurables, un impact vérifié.\n\nUn Track record, un investissement devenu anecdotique. 94% de succès",
  },
  {
    icon: '🤝',
    title: 'Proximité',
    text: "Une compréhension du market, de ses règles et de ses failles.\n\nVotre besoin devient le nôtre. Une proximité sans conditions avec vos enjeux.\n\nOn acquiesce quand il le faut, on challenge tout autant.\n\nVotre satisfaction est un impératif, notre exigence envers nous-mêmes également.",
  },
  {
    icon: '⏱',
    title: 'Réactivité',
    text: "Un poste vacant en Sales ? Du CA de perdu.\nUne recherche qui dure ? Du CA de perdu.\n\nUn mauvais recrutement ? Du CA de perdu, beaucoup.\n\nLe temps c'est de l'argent, personne ne veut en perdre. Cash is king.",
  },
  {
    icon: '🔍',
    title: 'Performance',
    text: "Tous les Sales ne se valent pas. Les recruteurs non plus.\nNotre expérience personnelle du métier Sales nous permet une évaluation critique. Chez Mariell, on parle performance.\n\nUn bon Sales c'est un CV attrayant et un discours captivant.\nLes meilleurs Sales c'est : un Track record impactant et exploitable sur des cycles de ventes pertinents, une intelligence cognitive et émotionnelle (surtout, cf. étude Harvard) remarquable à tous les niveaux.",
  },
]

export const processSteps = [
  {
    number: '1',
    title: 'Brief',
    description:
      'Évaluation de la recherche : Attractivité entreprise et poste, profil recherché, market adressé, spécificités et frictions.',
  },
  {
    number: '2',
    title: 'Chasse & Screening',
    description:
      "Phase de sourcing : recherche de candidats via chasse, réseau et talent pool premium. Screening : Call évaluation soft skills, Visio évaluation hard skills + tests spécifiques à la recherche.",
  },
  {
    number: '3',
    title: 'Push Pool de Candidats',
    description:
      'Envoi des candidatures détaillées : CV, brief et récapitulatif profil, description dernière expérience, ressenti candidature et éventuels freins.',
  },
  {
    number: '4',
    title: 'Suivi des entretiens',
    description:
      "Accompagnement du candidat et de l'entreprise dans le processus de recrutement. Aide à la planification des entretiens, et médiation.",
  },
]

export const pricingBadges = [
  '94% Success rate',
  "Garantie période d'essai",
  '100% Chasse sur-mesure',
]
