import type { FormulaireOutil3 } from '../../schemas/outil-3/formulaire'
import { calculatePackagePosition } from './calculate-package-position'

export function buildUserPrompt(data: FormulaireOutil3): string {
  const cycleLabel =
    data.type_cycle === 'Autre' && data.type_cycle_autre
      ? `${data.type_cycle} (${data.type_cycle_autre})`
      : data.type_cycle

  const intituleLabel =
    data.intitule_poste === 'Autre' && data.intitule_poste_precision_autre
      ? `${data.intitule_poste} (${data.intitule_poste_precision_autre})`
      : data.intitule_poste

  const secteurLabel =
    data.secteur === 'Autre' && data.secteur_precision_autre
      ? `${data.secteur} (${data.secteur_precision_autre})`
      : data.secteur

  const siteWebLine =
    data.site_web && data.site_web.trim() !== ''
      ? `- Site web : ${data.site_web}`
      : `- Site web : (non renseigné — utilise la web search sur le nom de l'entreprise si tu as besoin de plus d'infos)`

  const positionPackage = calculatePackagePosition(data)

  const blocPreCalculPackage = `
# 🔒 PRÉ-CALCUL PACKAGE (selon F4 V5 — déjà appliqué côté backend, NE PAS RECALCULER)

Le scoring de la position du package a été calculé en amont selon la grille terrain F4 V5. Tu utilises directement ces résultats pour rédiger la section "Lecture package" du markdown :

- **Profil F4 identifié** : ${positionPackage.profil}
- **Position du fixe (${data.package_fixe.toLocaleString('fr-FR')}€)** : ${positionPackage.positionFixe}
- **Position de l'OTE (${data.package_ote.toLocaleString('fr-FR')}€)** : ${positionPackage.positionOte}
- **Position globale du package** : ${positionPackage.positionGlobale}
- **Incohérence ratio fixe/OTE détectée** : ${positionPackage.incoherenceFixeOte ? 'Oui — à signaler dans les alertes' : 'Non'}

⚠️ Ces résultats sont **autoritaires**. Tu ne recalcules pas, tu ne contestes pas, tu ne mentionnes pas leur existence dans le markdown. Tu rédiges la section "Lecture package" sur la base de ces étiquettes qualitatives uniquement, en suivant les formulations imposées dans le system prompt.
`

  return `Voici les inputs du formulaire à évaluer :

# Identité prospect
- Prénom : ${data.prenom}
- Nom : ${data.nom}
- Email : ${data.email}
- Téléphone : ${data.telephone}

# Contexte entreprise
- Entreprise : ${data.entreprise}
${siteWebLine}
- Secteur : ${secteurLabel}
- Localisation : ${data.localisation}
- Effectifs : ${data.effectifs_entreprise}
- Composition équipe Sales : ${data.equipe_sales}

# Contexte poste
- Intitulé : ${intituleLabel}
- Séniorité visée : ${data.seniorite}
- Type de cycle : ${cycleLabel}
- Modalité de travail : ${data.modalite_travail}

# Description des missions (champ libre, max 1000 caractères)
${data.description_missions}

# Package proposé (en € brut annuel)
- Fixe : ${data.package_fixe.toLocaleString('fr-FR')} €
- OTE total cible : ${data.package_ote.toLocaleString('fr-FR')} €

${blocPreCalculPackage}

---

Génère maintenant l'évaluation complète selon le format strict défini dans le system prompt :
- Bloc JSON de méta-données
- Délimiteur \`---END_META---\` seul sur sa ligne
- Livrable Markdown des 8 sections (titre, intro, verdict, marque & secteur, mission, package, synthèse & leviers, twist, CTA)

Applique les référentiels F1 → F2 → F3 → F4 dans l'ordre, et respecte toutes les règles de confidentialité (pas de mention des Tiers, des fichiers, des grilles, du score chiffré dans le markdown).`
}
