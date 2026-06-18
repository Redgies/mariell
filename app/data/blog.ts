export interface BlogArticle {
  slug: string
  title: string
  excerpt: string
  date: string
  readingTime: string
  heroLabel: string
  tag: string
  bodyHtml: string
  faq?: { q: string; a: string }[]
  related?: { to: string; label: string }[]
  cta: { heading: string; primary: string }
  seo: { title: string; description: string }
}

export const articles: BlogArticle[] = [
  {
    slug: 'meilleurs-sales-annonces',
    title: 'Pourquoi les meilleurs Sales ne répondent jamais aux annonces',
    excerpt: 'Et ce que ça change dans la façon de les approcher.',
    date: '2026-02-03',
    readingTime: '5 min de lecture',
    heroLabel: 'Recrutement',
    tag: 'Recrutement',
    bodyHtml: `<p>Un bon commercial qui performe a trois choses. Un variable confortable. Un produit qu’il maîtrise. Un pipeline qui tourne. Aucune de ces trois ne le pousse à parcourir les offres d’emploi le dimanche soir. C’est l’angle mort de beaucoup de recrutements Sales. On publie une annonce, on attend les candidatures, et on s’étonne que les profils reçus ne soient pas à la hauteur. La réponse tient en une phrase. Les meilleurs ne répondent pas aux annonces. Voici pourquoi, et ce qu’il faut faire à la place.</p>
<h2>Le paradoxe : ceux qui répondent ne sont pas ceux que vous cherchez</h2>
<p>Les profils qui répondent à une annonce sont, par définition, ceux qui cherchent. Or les meilleurs ne cherchent pas. On vient les chercher.</p>
<p>Et le vivier de ceux qui cherchent rétrécit. Le nombre de candidatures sur les postes commerciaux a fortement chuté, divisé par deux environ depuis 2022. Le marché visible est donc à la fois plus petit, et ce n’est pas là que se trouvent les meilleurs profils.</p>
<p>France Travail le confirme par ailleurs. La vraie difficulté des entreprises n’est pas le nombre de candidats, c’est leur inadéquation. Une annonce maximise le volume, pas la pertinence.</p>
<p>C’est tout le paradoxe. Le canal qui apporte le plus de candidatures apporte le moins de profils que vous voulez vraiment. Et plus le poste est senior, plus c’est vrai. Un SDR junior peut répondre à une annonce. Un Head of Sales aguerri, presque jamais. C’est précisément ce qui rend le recrutement Sales différent des autres.</p>
<h2>Pourquoi les meilleurs ne cherchent pas</h2>
<p>Un top performer est en poste. Il tient ses objectifs, il est bien payé, et il est sollicité en permanence.</p>
<p>Rien ne le pousse vers les job boards. Il ne lit pas les annonces, tout simplement.</p>
<p>Quand il envisage de bouger, ce n’est pas parce qu’il a parcouru des offres un soir. C’est parce que quelqu’un est venu le chercher avec quelque chose de mieux. Ces profils sont aussi en position de force, comme on l’a vu pour <a href="/blog/marche-recrutement-sales-2026">le marché de 2026</a>. Ce sont eux qui choisissent, pas l’inverse. Les attirer demande de leur donner une vraie raison de bouger. Ils changent rarement, et toujours à leurs conditions. Quand l’opportunité est juste, ils écoutent. Encore faut-il la leur présenter, plutôt que d’attendre qu’ils la trouvent seuls.</p>
<h2>Ce qu’une annonce ne vous donnera jamais</h2>
<p>Une annonce ne touche que les candidats disponibles. Sur le marché Sales, disponible signifie rarement meilleur.</p>
<p>Elle vous donne aussi un CV optimisé, pas un track record vérifié. N’importe qui peut écrire qu’il a dépassé son quota. Peu peuvent le prouver quand on creuse.</p>
<p>Et les bons profils qui, par exception, répondent à une annonce se retrouvent noyés dans une pile. Très sollicités ailleurs, ils abandonnent vite un process lent ou impersonnel. Résultat, vous finissez par arbitrer entre des profils disponibles, en espérant que le moins faible fera l’affaire. Ce n’est pas comme ça qu’on recrute un top performer.</p>
<p>L’annonce n’est pas inutile. Elle est simplement le mauvais outil pour le haut du marché. Pour un poste où le niveau compte, elle vous coûtera surtout du temps et de fausses pistes.</p>
<h2>Ce que change l’approche directe</h2>
<p>Approcher un commercial en poste, c’est entrer en conversation avant qu’il ne soit sur le marché, au moment où personne d’autre ne lui parle.</p>
<p>C’est aussi pouvoir vérifier son track record réel. Ses chiffres, ses références, ce qu’il a vraiment fait, au lieu de se fier à un CV travaillé pour plaire.</p>
<p>C’est, surtout, accéder à un vivier que vos annonces ne toucheront jamais.</p>
<p>L’approche directe a aussi un avantage qu’on sous-estime : la discrétion. Une annonce affiche publiquement que vous recrutez, parfois pour un poste sensible, et le signale à vos concurrents. Approcher en direct permet de mener une recherche confidentielle, ce qui compte particulièrement pour une nomination de direction.</p>
<p>Mais cela a un prix. L’approche directe demande du temps, du réseau, et une vraie lecture du métier. On n’approche pas un excellent AE avec un message générique envoyé à la chaîne.</p>
<h2>L’approche directe, ce n’est pas du démarchage de masse</h2>
<p>Une nuance importante, parce que la confusion est fréquente. L’approche directe n’est pas l’envoi de deux cents messages LinkedIn identiques.</p>
<p>Les meilleurs profils sont sur-sollicités. Un message générique est ignoré, ou pire, il abîme votre marque employeur. Le bombardement ne marche pas, il use.</p>
<p>La vraie approche directe est ciblée. Les bons profils, une raison précise de discuter, une conversation et non un argumentaire. Elle respecte le temps de la personne et lit le poste avec justesse. C’est la différence entre chasser et spammer. Un bon message d’approche montre qu’on a compris le parcours de la personne et le poste qu’on propose. Il ouvre une discussion, il ne déroule pas un pitch. C’est ce travail de ciblage qui fait qu’un profil sur-sollicité accepte, exceptionnellement, de répondre.</p>
<h2>Comment Mariell s’y prend</h2>
<p>Pas d’annonce. On scanne le marché, on identifie, on qualifie avec exigence.</p>
<p>Puis une évaluation critique des soft et des hard skills, parce qu’un track record ne suffit pas à lui seul. Ce qui prédit la performance ne se lit pas toujours sur un parcours, comme on l’a détaillé sur <a href="/blog/soft-skills-hard-skills-performance-commerciale">les soft skills</a>.</p>
<p>Vient ensuite une médiation serrée jusqu’à la signature, puis un suivi de la performance une fois le commercial en poste. C’est notre <a href="/methode">méthode</a>, en cinq étapes, du brief au closing.</p>
<p>En résumé. Si vous cherchez un commercial moyen, disponible tout de suite, publiez une annonce. Si vous cherchez le meilleur pour le poste, il faudra aller le chercher là où il est, en poste, ailleurs. Ce n’est pas une préférence. C’est la façon dont le marché Sales fonctionne réellement.</p>`,
    faq: [
      {
        q: 'Pourquoi les bons commerciaux ne répondent-ils pas aux annonces ?',
        a: 'Parce qu’ils sont en poste, bien rémunérés et sollicités en permanence. Rien ne les pousse à consulter les offres d’emploi. Les candidats qui répondent à une annonce sont par définition ceux qui cherchent, et les meilleurs profils Sales ne cherchent pas, on vient les chercher.',
      },
      {
        q: 'L’approche directe prend-elle plus de temps qu’une annonce ?',
        a: 'Oui, et c’est normal. Identifier, approcher et convaincre un profil en poste demande du temps, du réseau et une bonne lecture du métier. Mais une annonce qui ne touche pas les bons profils fait perdre plus de temps encore, en process et en fausses pistes. L’approche directe vise juste, plutôt que large.',
      },
      {
        q: 'Quelle différence entre l’approche directe et du démarchage LinkedIn de masse ?',
        a: 'Le démarchage de masse envoie le même message à des centaines de profils. Il est ignoré, et il abîme la marque employeur. L’approche directe est ciblée : les bons profils, une raison précise de discuter, une vraie conversation. C’est la différence entre chasser et spammer.',
      },
    ],
    related: [
      { to: '/blog/marche-recrutement-sales-2026', label: 'l’état du marché Sales 2026' },
      { to: '/blog/soft-skills-hard-skills-performance-commerciale', label: 'ce qui prédit vraiment la performance' },
    ],
    cta: {
      heading: 'Vous cherchez un top profil, pas un candidat disponible ?',
      primary: 'Parler de votre besoin',
    },
    seo: {
      title: 'Les meilleurs Sales ne répondent pas aux annonces | Mariell',
      description:
        'Les meilleurs commerciaux sont en poste et ne lisent pas les annonces. Pourquoi l’approche directe est la seule façon de recruter un top Sales.',
    },
  },
  {
    slug: 'marche-recrutement-sales-2026',
    title: 'Le marché du recrutement Sales en 2026',
    excerpt: 'Tensions de recrutement, salaires, attentes des candidats.',
    date: '2026-06-04',
    readingTime: '6 min de lecture',
    heroLabel: 'État du marché',
    tag: 'Marché',
    bodyHtml: `<p>Il n’y a jamais eu autant de candidats commerciaux disponibles. Et il n’a jamais été aussi difficile de recruter un bon Sales. Ce paradoxe résume le marché de 2026. Le volume monte, la qualité reste rare, et l’écart entre les deux se creuse. Pour une entreprise qui doit faire grandir son chiffre d’affaires, comprendre ce décalage change tout. Voici notre lecture du marché, et ce qu’elle implique concrètement quand vient le moment de recruter.</p>
<h2>Un marché sous tension, mais pas pour tout le monde</h2>
<p>Le marché de l’emploi français s’est un peu détendu. France Travail recense 2,28 millions de projets de recrutement pour 2026, en baisse de 6,5 % sur un an. Mais près de la moitié de ces projets sont jugés difficiles à pourvoir. La tension ne disparaît pas, elle se déplace.</p>
<p>Sur les fonctions commerciales, elle reste vive. Le nombre de candidatures aux postes de vente a fortement chuté depuis 2022. Une part majoritaire des recruteurs du commerce déclare peiner à trouver les bons profils. En 2024, des dizaines de milliers de postes de vendeurs et de commerciaux sont restés vacants, faute de candidats adéquats selon France Travail.</p>
<p>Le mot important, c’est <strong>adéquat</strong>. Car le problème n’est pas le nombre. France Travail le confirme : la première difficulté citée par les entreprises n’est pas la pénurie brute, c’est l’inadéquation des candidats. Plus de candidatures ne veut pas dire plus de bons profils. Les entreprises pointent surtout un manque de compétences, un manque d’expérience, et parfois un manque de motivation chez les candidats qu’elles reçoivent.</p>
<p>À cela s’ajoute une réalité que tout dirigeant connaît. Les commerciaux vraiment performants sont rarement en recherche active. Ils sont en poste, ils tiennent leurs objectifs, et ils ne consultent pas les offres d’emploi. Le marché visible et le marché réel ne sont donc pas le même marché. C’est tout l’enjeu.</p>
<p>Conséquence directe. Sur ces profils rares, ce sont les candidats qui sont en position de force. C’est l’entreprise qui doit convaincre, pas l’inverse.</p>
<h2>Les salaires Sales en 2026 : ce qui monte, ce qui se stabilise</h2>
<p>Côté rémunération, le contexte général est calme. L’inflation est repassée sous les 2 %, et les augmentations de 2026 sont modérées, de l’ordre de 2 % en moyenne. Rien de spectaculaire à l’échelle macro.</p>
<p>Mais le marché Sales suit sa propre logique. Deux mouvements de fond se dégagent, que confirment à la fois les études de rémunération et notre observation terrain.</p>
<p>D’abord, le package se recompose. Les candidats privilégient la sécurité. Ils acceptent plus volontiers un fixe élevé et une part variable contenue. Les promesses de variable très ambitieuses convainquent moins qu’avant. Le commercial de 2026 veut savoir ce qu’il touche, pas ce qu’il pourrait toucher.</p>
<p>Ensuite, et c’est le point clé, les écarts se creusent à niveau égal. À responsabilité comparable, deux profils peuvent désormais afficher des packages très différents, selon leur rareté, leur expertise et le secteur. La moyenne de marché ne veut plus dire grand-chose. Concrètement, deux Account Executives au même titre, avec cinq ans d’expérience chacun, peuvent afficher un écart de package de l’ordre de trente pour cent. Tout dépend de ce qu’ils vendent, à qui, et de la rareté de leur profil. C’est exactement pour cette raison que nous publions une grille détaillée plutôt qu’un chiffre unique. Les fourchettes réelles, par poste, par séniorité et par contexte, sont dans notre <a href="/lab/guide-salaires-sales">grille des salaires Sales 2026</a>.</p>
<h2>Ce que les candidats Sales attendent vraiment en 2026</h2>
<p>Quand les bons profils sont rares, ce sont eux qui choisissent. Et leurs attentes ont changé.</p>
<p>La rémunération compte, évidemment. Mais elle n’est plus le seul levier. Les analyses du turnover commercial sont constantes sur un point : la première cause de départ est un management défaillant, devant la rémunération et le manque de perspectives. Un bon Sales ne part pas seulement pour de l’argent. Il part parce qu’il n’est pas bien managé, ou parce qu’il ne voit pas où il va.</p>
<p>Les candidats sont aussi mieux informés. Ils comparent, ils connaissent leur valeur, et ils n’acceptent plus un package hors marché. La transparence salariale, qui se renforce avec la nouvelle réglementation européenne, va accentuer ce mouvement.</p>
<p>S’ajoutent des attentes devenues structurelles. La flexibilité, et le télétravail au moins partiel. Le sens du produit, aussi. Un commercial défend mieux une offre qu’il comprend et qu’il juge utile.</p>
<p>Enfin, le métier souffre d’un déficit d’image, en hausse, notamment auprès des jeunes générations qui le perçoivent comme moins valorisant que la tech ou le produit. Pour attirer un performer, une entreprise ne vend donc plus un poste. Elle vend un projet, une qualité de management, et une trajectoire. Le salaire fait entrer en discussion. Il ne suffit pas à signer.</p>
<h2>Les profils les plus disputés</h2>
<p>La demande se concentre. Les services B2B portent l’essentiel des volumes, parce que c’est là que la force commerciale fait directement la croissance. Quelques profils cristallisent la tension.</p>
<p>Les Account Executives restent le cœur du marché, en particulier sur les cycles complexes. Savoir orchestrer un deal à plusieurs interlocuteurs est une compétence rare et chère. Voir nos fiches <a href="/expertises/account-executive-mid-market">Account Executive Mid-Market</a> et <a href="/expertises/account-executive-enterprise">Account Executive Enterprise</a>.</p>
<p>Les profils de direction commerciale sont très recherchés. Construire une machine de vente et la mettre à l’échelle ne s’improvise pas. C’est l’enjeu d’un <a href="/expertises/head-of-sales">Head of Sales</a> ou d’un <a href="/expertises/vp-sales">VP Sales</a>.</p>
<p>Deux fonctions montent vite. Le <a href="/expertises/sales-ops-revops">Sales Ops / RevOps</a>, qui industrialise la performance par la donnée et les process. Et le <a href="/expertises/customer-success-manager">Customer Success Manager</a>, devenu stratégique parce qu’il génère du revenu sur la base installée. Chacun de ces profils demande une grille d’évaluation différente. On ne juge pas un RevOps comme on juge un closer.</p>
<p>À l’entrée du métier, les <a href="/expertises/sdr">SDR et BDR</a> qui alimentent le pipeline sont eux aussi très disputés. Leur vivier se renouvelle vite, et les fidéliser est un enjeu à part entière.</p>
<h2>Ce que ça change pour recruter en 2026</h2>
<p>Trois conséquences pratiques, pour une entreprise qui veut recruter un bon Sales cette année.</p>
<p><strong>Anticipez.</strong> Un recrutement commercial sérieux prend du temps. Entre le lancement de la recherche, le préavis d’un profil en poste et la montée en puissance, comptez plutôt six à neuf mois avant le premier deal signé. Lancer une recherche quand le besoin est déjà urgent, c’est se condamner à recruter dans la précipitation.</p>
<p><strong>Approchez directement.</strong> Puisque les meilleurs profils ne sont pas sur les offres d’emploi, les attendre ne sert à rien. Il faut aller les chercher là où ils sont, en poste, et leur donner une raison de bouger. Une annonce ne touche que les profils disponibles. Sur le marché Sales, ce ne sont pas toujours les meilleurs. C’est la logique de notre <a href="/methode">méthode</a>, sans annonce, par approche directe.</p>
<p><strong>Évaluez sérieusement.</strong> Un recrutement commercial raté coûte cher, souvent estimé à plus de 150 000 euros entre la perte de business, le coût du remplacement et le temps perdu. Le turnover sur ces fonctions est l’un des plus élevés du marché. Une erreur de casting se paie longtemps. D’où l’importance d’évaluer autant les hard skills que les soft skills, la motivation réelle, la résilience face au refus et l’alignement avec la culture de l’entreprise. Ce sont souvent ces dimensions, plus que le CV, qui prédisent la réussite d’un commercial dans un contexte donné.</p>
<p>Le marché de 2026 récompense ceux qui recrutent avec méthode et pénalise ceux qui recrutent dans l’urgence. Recruter un bon Sales n’a jamais été un pari. C’est une discipline.</p>`,
    faq: [
      {
        q: 'Le marché du recrutement Sales est-il toujours en tension en 2026 ?',
        a: 'Oui. Même si le volume global de projets de recrutement baisse, les fonctions commerciales restent difficiles à pourvoir. La principale difficulté n’est pas le manque de candidats, mais leur inadéquation. Les profils réellement performants sont rares et le plus souvent déjà en poste.',
      },
      {
        q: 'Combien gagne un commercial en 2026 ?',
        a: 'Cela dépend fortement du poste, de la séniorité et du contexte. La tendance de fond est un fixe plus élevé et une part variable plus contenue. À niveau égal, les écarts se creusent selon la rareté et l’expertise du profil. Les fourchettes réelles par métier sont détaillées dans notre grille des salaires Sales 2026.',
      },
      {
        q: 'Pourquoi recruter par approche directe plutôt que par une annonce ?',
        a: 'Parce que les meilleurs commerciaux ne sont pas en recherche active. Ils sont en poste et ne consultent pas les offres d’emploi. Une annonce ne touche que les candidats disponibles, qui ne sont pas toujours les plus performants. L’approche directe permet d’aller chercher les profils qui ne postuleront jamais d’eux-mêmes.',
      },
    ],
    related: [
      { to: '/blog/meilleurs-sales-annonces', label: 'pourquoi les meilleurs Sales ne répondent pas aux annonces' },
      { to: '/blog/quand-recruter-premier-vp-sales', label: 'quand recruter votre premier VP Sales' },
    ],
    cta: {
      heading: 'Un recrutement Sales à venir en 2026 ?',
      primary: 'Prendre rendez-vous',
    },
    seo: {
      title: 'Recrutement Sales en 2026 : tensions, salaires, attentes | Mariell',
      description:
        'Marché tendu, salaires qui se recomposent, candidats exigeants. Notre lecture du recrutement Sales en 2026 et ce qu’elle change pour recruter.',
    },
  },
  {
    slug: 'onboarding-commercial-90-jours',
    title: 'Onboarder un commercial pour qu’il performe en 90 jours',
    excerpt: 'Le plan des premiers mois qui fait la différence.',
    date: '2026-06-04',
    readingTime: '6 min de lecture',
    heroLabel: 'Management',
    tag: 'Management',
    bodyHtml: `<p>Vous avez réussi votre recrutement. Le profil est bon, la motivation est là, la signature est actée. Et pourtant, trois mois plus tard, rien ne décolle. Dans la majorité des cas, ce n’est pas une erreur de casting. C’est un onboarding raté. Les 90 premiers jours décident de la trajectoire d’un commercial, parfois pour toujours. Voici le plan, phase par phase, pour transformer un bon recrutement en performance réelle.</p>
<h2>Pourquoi les 90 premiers jours décident de tout</h2>
<p>Recruter un bon commercial coûte du temps et de l’argent, surtout dans <a href="/blog/marche-recrutement-sales-2026">le marché tendu de 2026</a>. Mais la signature n’est pas la ligne d’arrivée. C’est le début d’une autre course.</p>
<p>Un commercial met en général trois à six mois pour devenir vraiment autonome et générer du revenu. Pendant cette période, il coûte sans encore produire. Plus cette montée en puissance, le ramp-up, est longue et désordonnée, plus la facture grimpe. Un ramp-up raté dépasse souvent 100 000 euros, entre la formation, les leads gâchés et le revenu non généré.</p>
<p>Le risque est même plus élevé que sur d’autres postes. Un commercial est face aux clients dès le départ. Une recrue mal préparée abîme votre crédibilité en rendez-vous, pas seulement ses propres chiffres. Si chaque commercial raconte une histoire différente devant un prospect, c’est toute votre image qui vacille.</p>
<p>Le premier indicateur à surveiller est la rétention à 90 jours. Un départ avant cette échéance signale presque toujours un échec d’intégration, pas un mauvais recrutement. Le problème n’est pas qui vous avez recruté, c’est comment vous l’avez accueilli.</p>
<p>À l’inverse, un onboarding structuré paie. Selon une étude ACERTA, 62 % des collaborateurs ayant suivi un vrai parcours d’intégration atteignent leurs objectifs dans l’année, contre 17 % sans. Les données Glassdoor montrent qu’un nouveau collaborateur bien intégré atteint la moitié de sa productivité cible en deux mois, contre cinq mois sans programme. Trois mois gagnés. Sur une force de vente, ça change tout.</p>
<p>Autrement dit, le plan des 90 jours n’est pas une formalité RH. C’est un levier de performance directe.</p>
<h2>Jours 1 à 30 : comprendre avant de vendre</h2>
<p>La pire erreur est de jeter une nouvelle recrue sur les leads dès le premier jour. Un bon commercial qui vend mal votre produit fait plus de dégâts qu’un poste vacant.</p>
<p>Le premier mois sert à une chose : comprendre. Le produit en profondeur. Le marché. Le client idéal et ses vraies douleurs. Le discours de vente qui marche chez vous. Le CRM, les outils, le pipeline.</p>
<p>Et surtout, écouter. La recrue assiste à des rendez-vous, écoute des appels, lit des deals gagnés et perdus. Elle observe avant d’agir. Un binôme accélère tout. Associez la recrue à un commercial expérimenté qui sert de référent, répond aux questions du quotidien et montre les bons réflexes sur le terrain.</p>
<p>L’objectif des 30 premiers jours n’est pas de closer. C’est de savoir ce qu’on vend, à qui, et pourquoi les gens achètent. Posez un point d’étape clair à J+30 : la recrue maîtrise-t-elle l’offre et le profil de client cible ? Si la réponse est floue, on consolide avant d’avancer.</p>
<h2>Jours 31 à 60 : produire sous accompagnement</h2>
<p>À partir du deuxième mois, la recrue produit, mais encadrée. Premiers appels, premières opportunités, avec un manager proche.</p>
<p>La clé de cette phase, c’est la boucle de feedback courte. Des revues de deals régulières. On corrige les mauvais réflexes tôt, avant qu’ils ne s’installent. C’est beaucoup plus efficace que d’attendre la fin de la période d’essai pour faire le bilan. Le bon rythme alterne deux postures. Le manager montre d’abord, puis observe la recrue en situation et débriefe. On passe de la démonstration à l’autonomie par étapes, pas d’un coup.</p>
<p>Deux pièges à éviter ici. Confier les leads les plus chauds à une recrue encore en rodage, qui va les brûler sur ses premières erreurs. Et exiger 100 % du quota dès le 31e jour. La montée en charge doit être progressive, avec des attentes qui montent par paliers.</p>
<p>Point d’étape à J+60 : la recrue est-elle autonome sur les fondamentaux ? Le pipeline se construit-il ? Les premiers signaux d’activité sont-ils là ?</p>
<h2>Jours 61 à 90 : autonomie et premiers résultats</h2>
<p>Le troisième mois, l’autonomie s’installe. On attend des premiers résultats mesurables. Pas forcément le quota plein, mais des signaux nets : des rendez-vous, du pipeline qualifié, et selon la longueur du cycle, parfois les premières signatures.</p>
<p>C’est un point important. Sur des cycles de vente longs, juger un commercial sur le chiffre d’affaires fermé à 90 jours n’a aucun sens, parce que ce chiffre n’arrivera mécaniquement pas encore. On juge les indicateurs avancés, ceux qui prédisent le revenu à venir, pas le revenu lui-même.</p>
<p>À J+90, vient la vraie revue. La trajectoire est-elle la bonne ? Les bases sont-elles solides ? Cette revue décide de la suite avec des faits : confirmer, ajuster le plan, ou, si les signaux restent mauvais malgré un accompagnement sérieux, en tirer les conséquences tôt plutôt que de laisser traîner. C’est le moment de décider, avec du recul, pas une impression.</p>
<h2>Les erreurs qui ruinent un bon recrutement</h2>
<p>Quelques erreurs reviennent systématiquement, et elles gâchent des recrutements pourtant réussis.</p>
<p><strong>L’onboarding improvisé, sans plan.</strong> Sans process structuré, le temps de formation peut doubler, jusqu’à six à huit mois avant d’être opérationnel. C’est autant de revenu perdu.</p>
<p><strong>Des objectifs flous.</strong> Une recrue qui ne sait pas précisément ce qu’on attend d’elle à 30, 60 et 90 jours avance à l’aveugle. Les attentes doivent être écrites, chiffrées, et partagées dès le premier jour.</p>
<p><strong>Le manager absent.</strong> L’intégration d’un commercial est le travail du manager, pas seulement des RH. Un onboarding qui repose uniquement sur des documents et des modules en ligne échoue.</p>
<p><strong>Mesurer les mauvaises choses.</strong> Un score à un quiz de formation ne paie pas les factures. Ce qui compte, c’est l’activité réelle, le pipeline, et l’atteinte des objectifs à 3, 6 et 12 mois.</p>
<p>Le signal d’alerte qui ne trompe pas, c’est un pic de départs dans les premiers mois. Quand ça arrive, le problème est presque toujours dans l’intégration, rarement dans le recrutement.</p>
<p>C’est pour cette raison que, chez Mariell, notre travail ne s’arrête pas à la signature. Notre <a href="/methode">méthode</a> intègre un suivi de la performance à 4 et 8 mois. Recruter le bon profil et l’intégrer correctement sont les deux moitiés du même travail. La seconde mérite autant d’attention que la première, en particulier pour un <a href="/expertises/sales-manager">Sales Manager</a>, dont une grande partie de la valeur tient à sa capacité à faire monter ses équipes.</p>
<p>Un bon recrutement est un point de départ. Le plan des 90 jours est ce qui le transforme en performance. Recruter n’est pas un pari. Intégrer non plus.</p>`,
    faq: [
      {
        q: 'Combien de temps faut-il pour qu’un commercial soit pleinement opérationnel ?',
        a: 'En général trois à six mois pour devenir autonome et générer du revenu, et davantage selon la longueur du cycle de vente. Un onboarding structuré raccourcit nettement cette montée en puissance. Sans plan, elle peut au contraire doubler.',
      },
      {
        q: 'Que faut-il mesurer pendant les 90 premiers jours ?',
        a: 'Les indicateurs avancés, pas seulement le chiffre d’affaires. L’activité, le pipeline qualifié, la maîtrise du discours et de l’offre, et l’atteinte des objectifs à 3, 6 et 12 mois. Sur les cycles longs, le revenu fermé n’est pas un bon juge à 90 jours.',
      },
      {
        q: 'Un départ avant 90 jours, c’est un recrutement raté ou un onboarding raté ?',
        a: 'Le plus souvent un onboarding raté. Un départ aussi précoce signale presque toujours un problème d’intégration, d’accompagnement ou d’attentes mal cadrées, plutôt qu’une erreur sur le profil recruté.',
      },
    ],
    related: [
      { to: '/blog/scaler-equipe-sales-sans-casser-culture', label: 'scaler une équipe sans casser la culture' },
      { to: '/blog/soft-skills-hard-skills-performance-commerciale', label: 'soft skills vs hard skills' },
    ],
    cta: {
      heading: 'Vous préparez un recrutement Sales ?',
      primary: 'Parler de votre besoin',
    },
    seo: {
      title: 'Onboarder un commercial : le plan des 90 premiers jours | Mariell',
      description:
        'Un bon recrutement Sales se gagne ou se perd dans les 90 premiers jours. Le plan d’onboarding, phase par phase, pour qu’un commercial performe vite.',
    },
  },
  {
    slug: 'soft-skills-hard-skills-performance-commerciale',
    title: 'Soft skills vs hard skills : ce qui prédit vraiment la performance',
    excerpt: 'Notre lecture, après des centaines d’évaluations.',
    date: '2026-06-04',
    readingTime: '6 min de lecture',
    heroLabel: 'Évaluation',
    tag: 'Évaluation',
    bodyHtml: `<p>Deux candidats. Le premier a le CV parfait. Le bon secteur, les bons logos, les bons outils. Le second a un parcours moins linéaire, mais il écoute, il lit la pièce, et un refus ne l’abat pas. Lequel va performer ? La plupart des recruteurs parient sur le premier. La recherche parie sur le second. Parce que le CV montre surtout ce qui s’apprend. Il dit peu de chose sur ce qui prédit réellement la performance. Séparons les deux.</p>
<h2>Le piège du CV : recruter sur ce qui se voit</h2>
<p>Les recruteurs s’appuient sur les hard skills et l’expérience, parce que c’est visible, vérifiable, rassurant. Un CRM maîtrisé. Un secteur connu. Un gros logo closé. On coche, on se rassure, on signe.</p>
<p>Le problème, c’est que ces éléments sont en grande partie la part transférable du profil. Et un CV décrit un passé, pas une performance future dans votre contexte à vous.</p>
<p>Le scénario classique est connu de tout dirigeant. On recrute sur le CV. Et six mois plus tard, on découvre que la personne n’écoute pas, ne rebondit pas après un échec, ou manque de mordant. Les compétences techniques étaient là. La performance, non.</p>
<p>Ce n’est pas un détail. Une erreur de casting commercial coûte cher, comme on l’a vu pour <a href="/blog/marche-recrutement-sales-2026">le marché de 2026</a>. Et elle se joue presque toujours sur la dimension comportementale, pas sur la technique.</p>
<h2>Ce que dit la recherche : l’intelligence émotionnelle prédit la performance</h2>
<p>Sur ce point, les travaux académiques sont solides et convergents.</p>
<p>Kidwell et ses coauteurs, dans le Journal of Marketing en 2011, ont mené trois études de terrain auprès d’agents immobiliers et d’assurance. Leur conclusion est nette. Une intelligence émotionnelle élevée est associée à une meilleure performance commerciale, et à une meilleure rétention des clients, même en contrôlant les capacités cognitives et d’autres variables. Les commerciaux à forte intelligence émotionnelle ne sont pas seulement de meilleurs closers. Ils gardent aussi leurs clients plus longtemps.</p>
<p>La méta-analyse d’O’Boyle et de ses coauteurs, publiée la même année, élargit le constat à l’ensemble des métiers. L’intelligence émotionnelle prédit la performance au travail, et elle apporte une valeur prédictive qui s’ajoute à celle du QI et des grands traits de personnalité. Autrement dit, elle explique une partie de la performance que l’intelligence et la personnalité seules n’expliquent pas.</p>
<p>Goleman, dès 1998, posait déjà l’idée. Les compétences émotionnelles distinguent les meilleurs, et leur poids augmente avec le niveau de responsabilité.</p>
<p>Une nuance importante. Il ne s’agit pas d’opposer le soft au hard. Kidwell montre justement que l’intelligence émotionnelle complète les capacités cognitives, son effet étant le plus fort quand les deux sont présentes. Les hard skills et l’intelligence restent nécessaires. La dimension comportementale est ce qui sépare le bon de l’excellent.</p>
<p>Et l’intelligence émotionnelle n’a rien d’un don mystérieux. En vente, c’est concret. Percevoir ce que ressent l’acheteur, le comprendre, gérer ses propres émotions, et ajuster sa réponse en temps réel. C’est une compétence observable, donc évaluable.</p>
<h2>Hard skills : nécessaires, mais transférables</h2>
<p>Les hard skills comptent, ne nous méprenons pas. La connaissance du produit, la maîtrise du process de vente, le CRM, les codes du secteur, la méthode. Un commercial qui ne connaît pas son produit ne le vendra pas.</p>
<p>Mais deux choses sont vraies sur les hard skills. Ils sont vérifiables, donc ils rassurent. Et ils s’apprennent. On forme à un CRM en quelques jours, à un produit en quelques semaines, à un secteur en quelques mois.</p>
<p>Les hard skills sont donc un ticket d’entrée, pas un facteur différenciant. Recruter d’abord sur eux, c’est se battre sur la partie la plus remplaçable du profil. Celle que n’importe quel concurrent peut former chez son propre candidat.</p>
<h2>Soft skills : ce qui ne s’apprend pas, ou mal</h2>
<p>Les dimensions qui prédisent la performance commerciale sont précisément les plus difficiles à développer.</p>
<p><strong>L’intelligence émotionnelle.</strong> Lire une situation, s’adapter à un interlocuteur, gérer ses propres émotions et celles de l’acheteur.</p>
<p><strong>La résilience.</strong> Un commercial entend non toute la journée. Ceux qui rebondissent performent. Ceux qui encaissent mal s’épuisent.</p>
<p><strong>L’écoute avant la vente.</strong> Les meilleurs posent des questions et écoutent plus qu’ils ne pitchent. Ils comprennent le besoin avant de proposer.</p>
<p><strong>Le mordant et la capacité à se faire coacher.</strong> L’envie de gagner, et l’ouverture à être corrigé pour progresser.</p>
<p>La rigueur, aussi. Tenir son pipeline, suivre ses relances, ne rien laisser filer. Et la curiosité, celle qui pousse à comprendre le métier du client plutôt qu’à dérouler un argumentaire tout fait.</p>
<p>Ces qualités peuvent s’améliorer à la marge. Mais on ne transforme pas un mauvais écouteur en empathe, ni un profil fragile en battant, le temps d’un onboarding. Comme on l’a vu sur <a href="/blog/onboarding-commercial-90-jours">les 90 premiers jours</a>, l’intégration affine, elle ne refonde pas un tempérament. Ces qualités, on les recrute, ou on ne les a pas.</p>
<h2>Comment évaluer ce qui ne se voit pas sur un CV</h2>
<p>Si les vrais prédicteurs ne sont pas sur le CV, le CV ne peut pas être le filtre principal. L’évaluation doit aller chercher l’invisible.</p>
<p><strong>L’entretien comportemental structuré.</strong> On interroge des situations passées concrètes, pas des hypothèses. Comment avez-vous géré un deal perdu, un client difficile, un trou d’air dans vos chiffres ? Le passé comportemental prédit mieux que les bonnes intentions. Et cette méthode protège de l’intuition. Un bon feeling en entretien n’a jamais prédit une performance. Une évaluation structurée, si.</p>
<p><strong>La mise en situation.</strong> On place le candidat dans un scénario de vente réel et on observe les soft skills en action. L’écoute, l’adaptation, le sang-froid sous pression.</p>
<p><strong>Les références sur le comportement</strong>, pas seulement sur les résultats. Comment travaillait la personne, comment réagissait-elle, comment s’intégrait-elle à une équipe.</p>
<p>Et un travail spécifique sur la motivation et la résilience, parce que ce sont elles qui prédisent qui tiendra dans la durée.</p>
<p>C’est exigeant. Cela demande plus de temps et de méthode que de lire des CV et de cocher des cases. C’est aussi la seule façon d’évaluer ce qui prédit vraiment la performance. C’est pour cette raison que, chez Mariell, notre évaluation est critique sur les soft skills autant que sur les hard skills. Nous ne validons pas un profil sur son CV. Nous évaluons ce que le CV ne montre pas. C’est le cœur de notre <a href="/methode">méthode</a>.</p>
<p>Recruter sur le CV, c’est recruter sur le passé. Recruter sur les soft skills, c’est recruter sur la performance future. Le premier rassure. Le second performe.</p>`,
    faq: [
      {
        q: 'Les soft skills sont-elles plus importantes que les hard skills pour un commercial ?',
        a: 'Ce n’est pas l’un contre l’autre. Les hard skills sont nécessaires, mais transférables et faciles à former. Les soft skills, comme l’intelligence émotionnelle ou la résilience, sont ce qui distingue les meilleurs et se développent beaucoup plus difficilement. La recherche montre qu’elles prédisent la performance au-delà des seules compétences techniques.',
      },
      {
        q: 'L’intelligence émotionnelle prédit-elle vraiment la performance commerciale ?',
        a: 'Oui, et c’est documenté. Une étude de référence parue dans le Journal of Marketing en 2011 montre qu’une intelligence émotionnelle élevée améliore la performance commerciale et la rétention client, même en tenant compte des capacités cognitives. Une méta-analyse de la même année confirme ce lien à l’échelle de l’ensemble des métiers.',
      },
      {
        q: 'Comment évaluer les soft skills d’un commercial en entretien ?',
        a: 'Par des entretiens comportementaux structurés portant sur des situations passées concrètes, par des mises en situation de vente, et par des prises de références centrées sur le comportement et pas seulement les résultats. L’objectif est d’observer l’écoute, l’adaptation, la résilience et la motivation, qui ne se lisent pas sur un CV.',
      },
    ],
    related: [
      { to: '/blog/meilleurs-sales-annonces', label: 'l’approche directe' },
      { to: '/blog/onboarding-commercial-90-jours', label: 'les 90 premiers jours' },
    ],
    cta: {
      heading: 'Vous voulez évaluer un profil au-delà du CV ?',
      primary: 'Parler de votre besoin',
    },
    seo: {
      title: 'Soft skills vs hard skills : ce qui prédit la performance | Mariell',
      description:
        'Le CV montre les hard skills. Mais ce sont les soft skills qui prédisent la performance d’un commercial. Ce que dit la recherche, et comment les évaluer.',
    },
  },
  {
    slug: 'scaler-equipe-sales-sans-casser-culture',
    title: 'Scaler une équipe Sales sans casser la culture',
    excerpt: 'Les arbitrages de la phase scale-up.',
    date: '2026-06-04',
    readingTime: '6 min de lecture',
    heroLabel: 'Hypercroissance',
    tag: 'Hypercroissance',
    bodyHtml: `<p>La croissance est l’objectif. Mais l’hypercroissance a une taxe cachée. Ce n’est pas le coût de recruter vite. C’est le coût de recruter vite et mal. La recherche est sans appel : le scaling prématuré est la cause la plus fréquente de mort des startups. Faites grandir une équipe commerciale sans méthode, et vous diluez la barre, l’onboarding, le management et la culture, une cohorte après l’autre. Jusqu’à ce que le moteur qui vous a menés ici cesse de tourner. Voici ce qui casse, et comment scaler sans casser.</p>
<h2>Le vrai danger de l’hypercroissance</h2>
<p>La croissance est un bon problème. Elle signifie que vous avez trouvé un début de product-market fit et que vous générez du revenu réel.</p>
<p>Mais quand des chercheurs de Berkeley et Stanford ont étudié plus de 3 000 startups, leur conclusion principale était nette. La cause d’échec la plus fréquente n’était pas le manque de marché ni le produit. C’était le scaling prématuré. Faire grossir les effectifs ou les dépenses plus vite que les fondations ne peuvent le supporter.</p>
<p>L’image est simple. Scaler un seau percé. Verser plus d’eau ne sert à rien si ça fuit. Pour une équipe commerciale, la fuite porte un nom double : la qualité et la culture. Chaque recrutement rapide et négligé dilue les deux. Le symptôme se lit dans les chiffres. Vous ajoutez des têtes, mais le revenu par commercial baisse. Vous courez plus vite pour avancer moins.</p>
<p>La question n’est donc pas de savoir s’il faut grandir. C’est de savoir si vos fondations peuvent absorber la croissance.</p>
<h2>Ce que « culture » veut dire dans une équipe Sales</h2>
<p>Soyons clairs, la culture dont on parle n’a rien à voir avec un baby-foot ou des valeurs affichées au mur.</p>
<p>C’est le standard partagé de la façon dont vous vendez. La barre pour entrer dans l’équipe. La manière de traiter un prospect et un client. Ce que veut dire « bon » chez vous. Les règles non écrites que tout le monde suit sans qu’on ait besoin de les rappeler. Concrètement, c’est comment on réagit à un deal perdu, si on gonfle ou non ses prévisions, la façon dont un AE traite le SDR qui lui passe un lead.</p>
<p>Une bonne façon de la voir. La culture est un livre de règles de décision partagé. Quand elle est forte et claire, les gens avancent vite sans demander d’autorisation. Quand elle est faible ou floue, chacun improvise, réinterprète, ou fait remonter chaque décision.</p>
<p>C’est le paradoxe. Vous avez recruté vite pour aller plus vite. Mais sans une culture forte pour aligner tout le monde, scaler peut au contraire vous ralentir. La culture commerciale n’est donc pas un sujet mou. C’est ce qui permet à une équipe qui grandit de rester rapide et cohérente.</p>
<h2>Ce qui casse quand on scale trop vite</h2>
<p>Quelques choses cassent, et toujours les mêmes.</p>
<p><strong>La barre baisse.</strong> Sous la pression de remplir un poste maintenant, vous dites oui à des profils que vous auriez écartés à tête reposée. Quelques recrutements médiocres suffisent à diluer le niveau de toute l’équipe.</p>
<p><strong>La dette d’onboarding s’accumule.</strong> Chaque nouvelle cohorte est intégrée un peu moins bien que la précédente, parce que ceux qui l’intègrent sont eux-mêmes nouveaux ou débordés. Comme on l’a vu sur <a href="/blog/onboarding-commercial-90-jours">les 90 premiers jours</a>, un onboarding bâclé ne se rattrape pas.</p>
<p><strong>Le message se dilue.</strong> À mesure que des strates de management apparaissent, l’intention de la direction est réinterprétée à chaque niveau. Le standard net de l’équipe fondatrice devient un écho lointain trois cohortes plus bas.</p>
<p><strong>Les managers sont improvisés.</strong> On promeut un top commercial manager du jour au lendemain, sans formation. Environ 60 % des nouveaux managers déclarent n’en avoir jamais reçu. Or un mauvais manager casse une équipe plus vite qu’un mauvais recrutement.</p>
<p><strong>Et les meilleurs partent.</strong> Vos commerciaux des débuts, ceux qui portaient le niveau, supportent mal de voir la barre baisser autour d’eux. Les A-players ne restent pas dans une équipe qui se dilue. Vous perdez donc les bons au moment précis où vous en avez le plus besoin.</p>
<p>Chacune de ces fissures est survivable seule. Ensemble, et à grande vitesse, elles vident de sa substance la culture qui vous faisait gagner.</p>
<h2>Garder la barre haute, même en urgence</h2>
<p>La première règle est simple. Ne jamais baisser la barre, même quand il vous faut quelqu’un pour hier.</p>
<p>Définissez ce qu’est un profil A dans votre équipe, concrètement, et partagez cette définition. Mettez-vous d’accord pour ne recruter personne en dessous.</p>
<p>Inspirez-vous du « bar-raiser » d’Amazon. Pour chaque recrutement, une personne extérieure à l’équipe qui recrute dispose d’un droit de veto, avec une seule mission : s’assurer que la nouvelle recrue est meilleure qu’au moins la moitié de l’équipe actuelle. Cela vous ralentit un peu. Cela vous évite beaucoup.</p>
<p>Et n’oubliez pas le contexte de marché. Les bons profils Sales sont rares, comme on l’a vu pour <a href="/blog/marche-recrutement-sales-2026">le marché de 2026</a>. La tentation de baisser la barre est la plus forte précisément quand le talent est le plus rare. C’est là que la discipline compte le plus. C’est aussi là qu’une <a href="/blog/soft-skills-hard-skills-performance-commerciale">évaluation qui va au-delà du CV</a> fait la différence.</p>
<p>Recruter vite et bien, sans diluer, n’est pas une contradiction. La vitesse et le niveau ne s’opposent pas si le process tient.</p>
<h2>Investir dans les managers et l’onboarding</h2>
<p>Deux investissements protègent la culture quand on grandit.</p>
<p><strong>Les managers de terrain.</strong> Ils influencent chaque deal, chaque commercial, chaque prévision. Ils sont la clé du scaling commercial, et la plus négligée. Ne promouvez pas un top commercial en croisant les doigts. Formez-le, ou recrutez des managers qui l’ont déjà fait. C’est tout l’enjeu d’un bon <a href="/expertises/sales-manager">Sales Manager</a>.</p>
<p><strong>Un onboarding structuré qui passe à l’échelle.</strong> Chaque cohorte reçoit la même intégration rigoureuse, pas une version dégradée. Documentez le playbook pour que le standard ne vive pas seulement dans la tête des fondateurs. Et calez le rythme d’embauche sur votre capacité à intégrer et à manager. Un manager de terrain n’encadre bien que six à huit commerciaux. Recruter plus vite que vous ne pouvez accompagner, c’est programmer la dilution.</p>
<p>Quelques leviers de plus. Spécialisez les rôles à mesure que vous grandissez, SDR, AE, CSM, pour que chacun aille en profondeur. Promouvez en interne quand vous le pouvez, parce que les promotions internes portent la culture vers l’avant. Et gardez votre équipe fondatrice proche des nouveaux, comme porteuse de cette culture.</p>
<p>La culture est le résultat de l’équipe que vous avez assemblée. Pour la faire grandir, vous vous appuyez sur cette équipe. Vous ne courez pas plus vite qu’elle.</p>
<p>Scaler vite n’est pas le problème. Scaler vite et mal, si. Tout l’enjeu est de recruter rapidement sans diluer la barre, l’onboarding, le management ni la culture. C’est exactement le défi des scale-up que nous accompagnons, que ce soit pour une <a href="/expertises/team-buildout">équipe entière à construire</a> ou une <a href="/expertises/recrutement-scale-up">montée en charge en hypercroissance</a>. Grandissez aussi vite que vos fondations peuvent le tenir. Pas plus vite.</p>`,
    faq: [
      {
        q: 'Comment scaler une équipe Sales sans perdre en qualité ?',
        a: 'En ne baissant jamais la barre de recrutement, même sous la pression. Définissez ce qu’est un profil A, et n’embauchez pas en dessous. Une pratique utile est le veto d’un évaluateur extérieur à l’équipe, chargé de garantir que chaque recrue est meilleure qu’au moins la moitié de l’équipe en place.',
      },
      {
        q: 'Pourquoi la culture d’une équipe commerciale se dilue-t-elle en hypercroissance ?',
        a: 'Parce que plusieurs fissures s’additionnent. La barre baisse sous la pression, l’onboarding se dégrade de cohorte en cohorte, le standard de l’équipe fondatrice se perd à travers les strates de management, et des managers sont promus sans formation. Séparément, c’est gérable. Ensemble et à vitesse rapide, la culture se vide.',
      },
      {
        q: 'Quel est le premier investissement pour scaler une équipe Sales ?',
        a: 'Les managers de terrain. Ils influencent chaque deal et chaque commercial, et ce sont eux qui maintiennent le standard quand l’équipe grandit. Les promouvoir sans formation est une erreur fréquente. Il faut les former, ou recruter des managers qui ont déjà construit et fait grandir une équipe.',
      },
    ],
    related: [
      { to: '/blog/quand-recruter-premier-vp-sales', label: 'quand recruter un premier VP Sales' },
      { to: '/blog/onboarding-commercial-90-jours', label: 'onboarder pour performer en 90 jours' },
    ],
    cta: {
      heading: 'Vous entrez en phase de scale-up ?',
      primary: 'Prendre rendez-vous',
    },
    seo: {
      title: 'Scaler une équipe Sales sans casser la culture | Mariell',
      description:
        'En hypercroissance, le danger n’est pas de recruter vite, mais de recruter mal. Comment scaler une équipe Sales sans diluer la barre ni la culture.',
    },
  },
  {
    slug: 'quand-recruter-premier-vp-sales',
    title: 'Quand recruter son premier VP Sales',
    excerpt: 'Les signaux qui disent qu’il est temps.',
    date: '2026-06-04',
    readingTime: '7 min de lecture',
    heroLabel: 'Leadership',
    tag: 'Leadership',
    bodyHtml: `<p>De tous les recrutements qu’un fondateur mène, le premier VP Sales est celui qui l’empêche de dormir. Réussi, il met le moteur de revenu à l’échelle. Raté, il brûle six chiffres de salaire, fait perdre deux trimestres de momentum, et démoralise les commerciaux déjà en place. Et la plupart des fondateurs le ratent, souvent des deux mêmes façons. Voici quand c’est vraiment le moment, et quel profil viser.</p>
<h2>Le recrutement que les fondateurs ratent le plus</h2>
<p>Peu de recrutements pèsent autant sur la trajectoire d’une entreprise que celui-ci. C’est précisément pour ça qu’il est risqué.</p>
<p>Le taux d’échec est élevé. Les retours du marché convergent : l’ancienneté d’un premier VP Sales en phase early-stage est courte, souvent de l’ordre de quinze mois, et une part importante ne passe même pas le cap de la première année. Un commercial qui échoue, on le remplace. Un dirigeant commercial qui échoue, on perd des trimestres. Et le coût ne s’arrête pas là. Un premier VP raté abîme l’équipe en place et rend le suivant plus dur à recruter, parce que les meilleurs profils se méfient d’une entreprise qui a déjà brûlé un dirigeant commercial.</p>
<p>C’est aussi un investissement lourd. En France, un VP Sales représente un package de plus de 200 000 euros, comme le montre notre <a href="/lab/guide-salaires-sales">grille des salaires</a>. Une erreur, c’est cette somme brûlée, plus le momentum perdu, plus les AE qui perdent confiance et commencent à regarder ailleurs.</p>
<p>Et les échecs se concentrent sur deux erreurs. Aucune des deux ne porte sur le candidat. Les deux portent sur le moment et la raison du recrutement.</p>
<h2>L’erreur numéro un : recruter trop tôt</h2>
<p>C’est de loin la plus fréquente. Recruter un VP Sales avant d’avoir un modèle de vente reproductible.</p>
<p>Une règle largement partagée résume bien la chose. Ne recrutez pas de VP Sales tant que vous n’avez pas deux commerciaux qui closent vraiment et tiennent leur quota. Si le fondateur n’a pas encore prouvé que la vente est reproductible, un VP ne pourra pas industrialiser ce qui n’existe pas.</p>
<p>La vente portée par le fondateur doit venir d’abord. Dans les premiers temps, le fondateur est souvent le meilleur vendeur de l’entreprise. Il a closé les premiers clients. Il connaît le client idéal, les objections, et la vraie raison pour laquelle les gens achètent. Une grande partie de ce savoir vit dans sa tête, souvent sans même être formalisée.</p>
<p>Recrutez un VP trop tôt, et il passera six mois à « construire la stratégie » pendant que le runway fond, à essayer de découvrir un modèle que le fondateur lui-même n’a pas encore verrouillé.</p>
<p>Trop tôt n’est pas une petite erreur. C’est l’erreur de timing la plus coûteuse en go-to-market.</p>
<h2>L’erreur numéro deux : recruter pour se décharger</h2>
<p>La seconde est plus subtile. Recruter un VP Sales pour s’en débarrasser, pour que le fondateur puisse sortir de la vente et retourner au produit.</p>
<p>Recruter un soulagement et recruter un leader ne sont pas la même chose.</p>
<p>Voici la vérité qui dérange. Même avec un excellent VP, le fondateur ne peut pas sortir complètement de la vente. L’intuition client, les signaux sur le client idéal, la raison pour laquelle les deals se signent, tout cela vit encore dans sa tête. Ce savoir est tribal. Le discours qui marche, les vrais signaux d’achat, l’instinct sur le bon client, rien n’est écrit. Le transférer à un VP est un travail délibéré, pas une délégation qu’on coche et qu’on oublie. Si le fondateur s’efface, le nouveau VP monte en puissance sans assez de contexte, et les ventes ne stagnent pas, elles déclinent.</p>
<p>Le temps que le fondateur passe sur la vente doit changer de nature, pas disparaître. Moins de closing en direct, plus de transmission et d’appui, mais une présence maintenue. Un VP recruté comme une porte de sortie échoue presque toujours.</p>
<h2>Les signaux que c’est le bon moment</h2>
<p>Alors, quand est-ce le moment ? Quelques signaux clairs.</p>
<p><strong>Le modèle de vente est reproductible.</strong> Pas une collection de coups gagnés isolés, mais un process qui fonctionne plus d’une fois, avec deux ou trois commerciaux qui tiennent leur quota.</p>
<p><strong>Le fondateur est devenu le goulot d’étranglement sur la mise à l’échelle</strong>, plus sur la découverte de ce qui marche. Il connaît le modèle. Il ne peut simplement plus piloter seul une équipe qui grandit.</p>
<p><strong>Vous êtes prêt à financer, construire et faire grandir une équipe</strong>, pas seulement à remplir une case sur un organigramme. Un signe concret : le fondateur ne suit plus la demande entrante, ou doit arbitrer entre des deals faute de temps. Le plafond n’est plus le modèle de vente. C’est lui.</p>
<p>Un mot sur l’erreur inverse. Recruter trop tard existe aussi. Un fondateur qui pilote seul la vente trop longtemps finit happé par cette tâche, au détriment du produit et de la marque, pendant que les concurrents avancent. Si vous avez un modèle reproductible et que vous passez tout votre temps à manager des commerciaux, vous avez sans doute déjà trop attendu.</p>
<h2>Quel VP recruter : le bâtisseur, pas le gestionnaire</h2>
<p>Même au bon moment, le profil compte. Et le titre « VP Sales » cache deux recrutements très différents.</p>
<p><strong>Le bâtisseur.</strong> Il a déjà fait passer une équipe de deux ou trois commerciaux à dix ou quinze. Il a construit le playbook, recruté l’équipe, créé le reporting, plutôt que d’en hériter. Il a opéré sans notoriété de marque, avec un marketing limité et un produit encore mouvant. Il vend avec de la donnée, il connaît ses taux de conversion et ses cycles de vente, pas seulement son charisme. Et il sait recruter. Un test simple en entretien : demandez-lui ses chiffres. Taux de conversion par étape, cycle moyen, coût d’acquisition. Un bâtisseur les a en tête. Un beau parleur vous racontera une histoire.</p>
<p><strong>Le gestionnaire.</strong> Un dirigeant pour un stade plus avancé, qui pilote des strates, des prévisions, du process à grande échelle. Excellent, mais pour un autre moment.</p>
<p>Au stade du premier VP, c’est le bâtisseur qu’il vous faut. Un manager venu d’un grand groupe, habitué à hériter d’une machine qui tourne, peinera dans une startup sans marque et au produit inachevé. C’est aussi la frontière, parfois floue, avec un <a href="/expertises/head-of-sales">Head of Sales</a>. C’est sur ce choix de profil que la plupart des fondateurs se trompent.</p>
<p>Le premier VP Sales est un recrutement stratégique. Une nomination qui pèse sur toute la trajectoire, et qui demande du timing, de la discrétion et une évaluation approfondie, pas une rustine pour se débarrasser de la vente. C’est exactement ainsi que nous le traitons, que ce soit pour un <a href="/expertises/vp-sales">VP Sales</a> ou dans le cadre d’un <a href="/expertises/recrutement-strategique">recrutement stratégique</a>. Recrutez-le au bon moment, pour la bonne raison, avec le bon profil, et le moteur passe à l’échelle. Trompez-vous sur l’un des trois, et il cale.</p>`,
    faq: [
      {
        q: 'À quel moment faut-il recruter son premier VP Sales ?',
        a: 'Quand le modèle de vente est reproductible, avec deux ou trois commerciaux qui tiennent leur quota, et que le fondateur est devenu le goulot d’étranglement sur la mise à l’échelle plutôt que sur la découverte de ce qui marche. Avant ce stade, le recrutement est presque toujours prématuré.',
      },
      {
        q: 'Pourquoi la plupart des premiers VP Sales échouent-ils ?',
        a: 'Pour deux raisons, rarement liées au candidat. Le recrutement est fait trop tôt, avant qu’un modèle de vente reproductible existe. Ou il est fait pour décharger le fondateur, qui sort de la vente alors qu’une grande partie du savoir client vit encore dans sa tête. Dans les deux cas, le VP avance sans les fondations nécessaires.',
      },
      {
        q: 'Quel profil de VP Sales recruter en startup ?',
        a: 'Un bâtisseur, pas un gestionnaire. Quelqu’un qui a déjà construit une équipe de zéro, créé le playbook et recruté ses commerciaux, et qui a performé sans notoriété de marque. Pas un manager de grand groupe habitué à hériter d’une machine déjà en place.',
      },
    ],
    related: [
      { to: '/blog/scaler-equipe-sales-sans-casser-culture', label: 'scaler sans casser la culture' },
      { to: '/blog/marche-recrutement-sales-2026', label: 'le marché Sales 2026' },
    ],
    cta: {
      heading: 'Vous vous posez la question du bon moment, ou du bon profil ?',
      primary: 'Prendre rendez-vous',
    },
    seo: {
      title: 'Quand recruter son premier VP Sales (et quel profil) | Mariell',
      description:
        'Le premier VP Sales est le recrutement que les fondateurs ratent le plus. Les signaux qu’il est temps, et le profil à viser pour ne pas se tromper.',
    },
  },
]

export function getArticle(slug: string): BlogArticle | undefined {
  return articles.find(a => a.slug === slug)
}
