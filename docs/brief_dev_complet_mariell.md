# Brief dev complet, implémentation du site Mariell

Ce brief couvre toute l'implémentation, desktop, mobile, SEO, fonctionnel, et opérationnel. La partie A, le SEO, est la plus sensible, un gros travail est déjà intégré dans le contenu et la structure et ne doit rien perdre. La partie B couvre le fonctionnel, le logo, le mobile, les intégrations, le déploiement. La partie C, la vérification.

## 0. Contexte et règle d'or

- Stack, Nuxt 3 et Vue 3, Nitro, Vercel, domaine OVH, mariell.fr, monolingue français.
- Source, un export statique issu de Claude Design, 47 fichiers, 46 pages de contenu plus la home. L'export est la référence desktop. Le mobile est à refaire proprement, voir section 12.
- Règle d'or, tu implémentes le contenu VERBATIM. Tu ne réécris ni les titres, ni les metas, ni les H1, ni le corps, ni les ancres, ni les schemas. Tu ne traduis pas les intitulés de poste anglais. Tu n'introduis aucun cadratin en prose.

---

# PARTIE A, le SEO, le plus sensible

## 1. Rendu, SSR ou prégénération, critique

- Le site doit être rendu côté serveur ou prégénéré. Google doit voir le HTML complet dès la première réponse, pas un shell JS vide.
- Pour un site de contenu, la prégénération statique convient bien, nuxt generate ou prerender Nitro.
- Chaque page livre dans le HTML initial le title, la meta, le H1, le corps, les liens internes, le JSON-LD.
- Vérification, le code source brut, pas le DOM rendu, doit montrer tout cela.

## 2. Head par route, titres, metas, og, canonical

- Chaque page a son title, sa meta, ses og et son canonical, déjà dans l'export. Gestion de head par route, useHead ou definePageMeta.
- Aucun head global ne doit écraser les valeurs par page.
- Zéro doublon de title sur le site, vérifié, à garder.
- Exemples critiques, hub des expertises, "Recrutement Sales par métier, du SDR au CRO | Mariell", page money, "Cabinet de recrutement commercial, du SDR au CRO | Mariell", Guide, "Guide des salaires Sales 2026 | Le Lab Mariell".
- 44 pages ont un og:image, préserve-les. Pas de hreflang, site en français.

## 3. URLs propres et canonical, point sensible

- L'export utilise des noms de fichiers en .html. La production utilise des URLs propres. La source de vérité de l'URL de chaque page, c'est sa balise canonical.
- Règle absolue, l'URL de production de chaque page égale son canonical.
- Motif, /expertises, puis /expertises/{rôle} et /expertises/{contexte}, /recrutement-commercial, /lab, puis /lab/{outil}, /blog, puis /blog/{article}, /cas-clients, puis /cas-clients/{client}, /mariell, /methode, /performances, /mentions-legales, /politique-confidentialite, et / pour la home.
- Cas particulier, le Guide, fichier lab-grille-salaires.html, URL /lab/guide-salaires-sales. Suis le canonical, pas le nom de fichier.
- Réconcilie tous les liens internes vers les URLs propres. Aucun lien en .html en production, aucun 404, aucune chaîne de redirection. Tous les liens vers lab-grille-salaires.html, environ 80, doivent résoudre vers /lab/guide-salaires-sales.
- www vers non-www, le canonical est en https://mariell.fr sans www. HTTPS partout. Cohérence du slash final.

## 4. Maillage interne, les cocons, critique, à préserver

- Un maillage contextuel a été construit, l'autorité converge vers les pages money.
- Structure, le Guide lie 12 fiches rôle plus la page money, la page money lie 13 fiches rôle, chaque fiche rôle lie la page money, les articles de blog s'interlient et lient la page money, les pages contexte s'interlient et lient la page money.
- Ces liens sont contextuels, dans le corps, en plus de la nav et du footer. Préserve-les tous, sur desktop ET sur mobile.
- Liens internes en vrais a href dans le HTML rendu, NuxtLink, suivables sans exécuter de JS.

## 5. Données structurées, JSON-LD, à préserver et rendre en SSR

- Schemas présents, Organization, BreadcrumbList, FAQPage, Service, Article, HowTo.
- Préserve tous les blocs tels quels, rendus dans le HTML.
- FAQPage, le schema correspond à la FAQ visible de chaque page, c'est synchronisé, à garder. Les 13 fiches rôle ont une question salaire en visible et en schema.
- BreadcrumbList, les URLs du fil d'ariane sont les URLs propres, pas les .html.

## 6. La home, cas particulier, head fourni ci-dessous

- La home est consolidée en un seul fichier, homepage-a-chromatic.html, c'est la home retenue. Sers-la sur la racine /, pas sur /homepage-a-chromatic.
- En l'état c'est un shell JS d'environ 3,8 ko, sans contenu, sans head, sans schema en HTML statique. Tu DOIS la rendre côté serveur avec son contenu, le head ci-dessous, et ses schemas.
- Head SEO à poser sur la home, validé :

```html
<title>Mariell, cabinet de recrutement commercial sélectif.</title>
<meta name="description" content="Cabinet de recrutement commercial sélectif pour start-ups et scale-ups tech. Du SDR au CRO, par approche directe. Mariell recrute les meilleurs profils.">
<link rel="canonical" href="https://mariell.fr/">
<meta property="og:type" content="website">
<meta property="og:url" content="https://mariell.fr/">
<meta property="og:title" content="Mariell, cabinet de recrutement commercial sélectif.">
<meta property="og:description" content="Cabinet de recrutement commercial sélectif pour start-ups et scale-ups tech. Du SDR au CRO, par approche directe.">
<meta property="og:image" content="https://mariell.fr/og-home.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Mariell, cabinet de recrutement commercial sélectif">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://mariell.fr/og-home.png">
```

- L'og:image est la carte sociale validée, 1200 par 630, PNG, fournie par Sean sous le nom og-home.png. Héberge-la dans le projet, à une URL absolue et stable en https://mariell.fr, et reporte ce chemin dans og:image et twitter:image.
- Tu ne touches pas au titre du Hero, c'est le H1 signature. La balise title est distincte du Hero, elle ne s'affiche que dans l'onglet et dans Google.

## 7. Artefacts de design, déjà nettoyés

- Les variantes homepage-a, b, c, Homepage Variations, et index.html, ont été supprimées. Rien de plus à exclure. Seule homepage-a-chromatic.html subsiste, c'est la home.

## 8. Hygiène SEO technique

- robots.txt plus sitemap XML auto-généré, toutes les URLs propres, soumis à Search Console et Bing.
- Accès des crawlers IA, autorise GPTBot, ClaudeBot, PerplexityBot, Google-Extended dans robots.txt.
- Page 404 avec vrai statut 404. Toutes les pages de contenu indexables.

---

# PARTIE B, le fonctionnel et l'opérationnel

## 9. Logo, à remplacer sur tout le site

Sean fournit le kit logo. Tu remplaces le logo partout, dans ces variantes.

- Logo animé dans la nav bar. Animation légère, SVG ou CSS, pas un GIF lourd. Respecte prefers-reduced-motion, l'animation se coupe pour qui désactive les animations.
- Logo sombre ou clair selon l'endroit, la variante qui contraste avec le fond. Les deux variantes sont dans le kit.
- Favicon sur l'onglet, décliné aux tailles usuelles, 16, 32, 180 Apple touch, 192 et 512 Android et PWA, plus une version SVG si le kit en a une.
- Le logo de la nav renvoie à la racine /.

## 10. Le Lab, formulaires, et automatismes Jarvi et Brevo

Le Lab a des outils interactifs propulsés par un LLM, Claude Haiku, plus la capture de lead. Calendly, Cloudflare Turnstile, Vercel KV. Rate limiting de 3 par jour et 7 par semaine par IP, avec capture de lead en repli.

Automatismes de lead, déjà en place en V1, à rétablir en V2.

- Toute soumission d'un outil du Lab, et toute capture d'email par le Guide, part vers deux systèmes. Vers Brevo, création du contact et déclenchement de l'email ou du nurture. Et vers Jarvi, le CRM, création du contact ou du lead.
- Tu réutilises la logique d'intégration de la V1, que tu as déjà en main, clés API Brevo et Jarvi, points d'appel, mapping des champs, webhooks éventuels. Tu repars de ce montage V1, à l'identique.
- Tout passe par des routes API Nitro côté serveur, Turnstile et rate limiting en amont.

États de chargement et d'erreur. Les outils appellent un LLM, il y a une latence. Affiche un état de chargement. En cas d'échec de l'API, dégrade proprement et bascule sur la capture de lead en repli, jamais d'écran cassé.

Vérification, une soumission test crée le contact dans Brevo ET dans Jarvi, et l'email part.

## 11. Fidélité du design, desktop

- Tu implémentes le desktop fidèlement à l'export, c'est la référence visuelle.
- Testé sur les navigateurs courants, Chrome, Safari, Firefox.

## 12. Version mobile, optimisée à tous les niveaux

Contexte, en V1 la sortie mobile de Claude Design était mauvaise, disposition et densité non pensées pour le mobile. Tu refais le mobile proprement, sur du vrai code, c'est ton chantier. Et c'est plus que de l'esthétique, Google indexe le site via sa version mobile en priorité, le mobile-first indexing, donc le mobile est une surface SEO de premier plan.

Approche. Du responsive, une seule base de code et une seule URL qui s'adapte. Pas de site mobile séparé, pas de sous-domaine m point. Balise viewport correcte.

Parité de contenu, règle SEO numéro un. Le mobile affiche le même contenu que le desktop, mêmes textes, titres, H1 et H2, liens internes, FAQ, et schema. Tu peux replier, réorganiser, mettre en accordéon, mais tu ne supprimes aucun contenu sur mobile. Un mobile amputé fait chuter le SEO.

Esthétique et disposition, pensées pour le mobile, pas un desktop compressé.
- Hiérarchie et densité adaptées, de l'air, pas de murs de texte.
- Texte lisible sans zoomer, corps autour de 16 pixels minimum.
- Aucun défilement horizontal.
- Les blocs multi-colonnes du desktop s'empilent proprement.
- La nav devient un menu mobile utilisable, et le méga-menu des expertises se décline en version mobile claire, tiroir ou accordéon, pas un menu desktop tassé.
- Le Hero adapté au format vertical.
- Le tableau du Guide, dur à lire sur mobile, se reformate ou défile proprement.

Tactile et ergonomie.
- Cibles tactiles d'au moins 44 pixels.
- Aucune interaction au survol seul, le survol n'existe pas au doigt.
- CTA atteignables au pouce.
- Formulaires au bon clavier, le champ email déclenche le clavier email.

Performance mobile, les Core Web Vitals se mesurent surtout sur mobile.
- Images responsives, srcset, dimensionnées pour le mobile, lazy-load sous la ligne de flottaison.
- JS non critique différé, CLS minimal, LCP et INP rapides sur un mobile milieu de gamme en 4G.
- Fonts critiques préchargées.

Fonctionnalités, tout marche sur mobile, le Lab et ses outils, les formulaires, Calendly, Turnstile, le logo animé, les accordéons FAQ.

Test, sur de vraies largeurs, 360, 390, 414 pixels, et tablette, sur Chrome Android et Safari iOS.

## 13. Accessibilité

- HTML sémantique, un seul H1 par page, hiérarchie de titres logique.
- Texte alternatif sur les images porteuses de sens.
- Contraste suffisant, navigation au clavier, états de focus visibles.
- Respect de prefers-reduced-motion.

## 14. RGPD et consentement

- Le site collecte de la donnée, formulaires, analytics, Brevo. Il faut un bandeau de consentement cookies conforme RGPD.
- L'analytics et tout traceur non essentiel ne se déclenchent qu'après consentement.
- Le bandeau renvoie à la page politique de confidentialité, déjà présente.

## 15. Déploiement et environnement

- Hébergement Vercel, domaine mariell.fr chez OVH, DNS pointé vers Vercel.
- Secrets en variables d'environnement, jamais en dur, clés API Brevo, Jarvi, le LLM du Lab, Turnstile.
- Un environnement de préproduction pour valider avant la prod.
- HTTPS et en-têtes de sécurité de base.

## 16. Analytics et mesure

- Search Console et Bing Webmaster, vérifier le domaine, soumettre le sitemap.
- Analytics avec un regroupement de canal dédié au trafic venu des IA, et déclenché après consentement.

---

# PARTIE C, vérification

## 17. Checklist post-déploiement, à faire avant de livrer

SEO.
- Le code source brut des pages clés montre title, meta, H1, corps, liens, JSON-LD. SSR ok.
- Le canonical de chaque page égale son URL de production. Le Guide est servi sur /lab/guide-salaires-sales.
- Zéro doublon de title.
- Tous les liens internes résolvent, aucun .html, aucun 404, aucune chaîne de redirection.
- FAQPage valide au test des résultats enrichis, et correspond à la FAQ visible.
- robots.txt autorise les crawlers IA et référence le sitemap.

Mobile.
- Contenu identique au desktop, rien d'amputé.
- Aucun défilement horizontal, nav mobile et méga-menu utilisables, tableau du Guide lisible.
- Cibles tactiles correctes, formulaires au bon clavier, CTA au pouce.
- Core Web Vitals au vert sur un vrai mobile.

Fonctionnel.
- Logo affiché partout, bonne variante selon le fond, favicon présent, animation coupée si reduced-motion.
- Une soumission test d'un outil du Lab crée le contact dans Brevo ET dans Jarvi, et l'email part. État de chargement présent, repli en cas d'échec.
- Calendly, Turnstile, rate limiting fonctionnent.
- Bandeau RGPD présent, analytics après consentement.
- Accessibilité, un H1 par page, alt sur images, focus visibles.

## 18. Garde-fous

- Tu implémentes le contenu verbatim, tu ne touches ni aux titres, ni aux metas, ni aux H1, ni au corps, ni aux ancres, ni aux schemas.
- Tu ne supprimes aucun lien interne, ni sur desktop ni sur mobile, le maillage est porteur.
- Parité de contenu desktop et mobile, le mobile n'ampute rien.
- Du responsive, une seule URL, pas de site mobile séparé.
- L'URL de production égale le canonical, pour chaque page.
- Tu ne traduis pas les intitulés anglais. Aucun cadratin en prose, mais tu préserves les cadratins décoratifs des labels, environ 519.
- Le nom du Guide coexiste sous deux formes, Guide des salaires en principal et grille de salaires en secondaire, voulu pour le SEO, tu ne normalises dans aucun sens.
- Secrets en variables d'environnement, design fidèle à l'export.
- Pour la home, tu utilises le head fourni, tu ne l'inventes pas.
