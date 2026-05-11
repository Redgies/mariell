import type { PlanDeSourcingInput } from '../../schemas/plan-de-sourcing'
import { loadOutil2Prompts } from '../outil-2/load-prompts'

/**
 * V12 system prompt — source de vérité : `server/prompts/outil-2/system-prompt-v12.md`.
 * Calibré pour `claude-haiku-4-5`, max_tokens 12000, temperature 0.2.
 *
 * Pour modifier le prompt : éditer le fichier .md directement, sans toucher au .ts.
 * Toute évolution doit être un bump de version (system-prompt-v13.md, v14…).
 */
export async function getSystemPrompt(): Promise<string> {
  const { systemPromptV12 } = await loadOutil2Prompts()
  return systemPromptV12
}

/**
 * Builds the user prompt with form inputs interpolated.
 * Calculates Variable (OTE - Fixe) and Ratio Fixe/OTE — the V10 prompt
 * relies on these derived values (directive 8).
 *
 * Site web et fiche de poste sont optionnels et inclus uniquement si fournis.
 */
export function buildUserPrompt(input: PlanDeSourcingInput): string {
  const blocSiteWeb = input.siteEntreprise
    ? `\n<contexte_supplementaire>\nLe site de l'entreprise du destinataire : ${input.siteEntreprise}\nTu peux t'appuyer sur ce site pour contextualiser certaines sections (notamment la section 1 et la section 2), sans pour autant chercher à le scraper. Reste sur des inférences sobres.\n</contexte_supplementaire>`
    : ''

  const blocFichePoste = input.contenuFichePoste
    ? `\n<fiche_de_poste>\nVoici le contenu de la fiche de poste fournie par le destinataire. Tu peux UNIQUEMENT t'en servir pour enrichir et préciser certaines sections (notamment 3, 4, 5 et 7). Tu ne dois jamais reproduire la fiche de poste verbatim, ni la résumer dans une section dédiée.\n\n${input.contenuFichePoste}\n</fiche_de_poste>`
    : ''

  const variable = input.ote - input.fixe
  const ratioFixeOte = input.ote > 0 ? Math.round((input.fixe / input.ote) * 100) : 100

  const posteAffiche =
    input.posteRecherche === 'Autre' ? input.posteRecherchePrecisionAutre || 'Autre' : input.posteRecherche
  const secteurAffiche =
    input.secteur === 'Autre' ? input.secteurPrecisionAutre || 'Autre' : input.secteur

  return `Voici les informations transmises via formulaire. Génère le plan de sourcing LinkedIn complet selon les règles fixées.

<formulaire>
Prénom du destinataire : ${input.prenom}
Nom du destinataire : ${input.nom}
Entreprise du destinataire : ${input.entreprise}
Secteur de l'entreprise : ${secteurAffiche}
Poste recherché : ${posteAffiche}
Séniorité visée : ${input.seniorite}
Objectif principal du poste : ${input.objectifPoste}
Localisation principale : ${input.localisation}
Remote possible : ${input.remotePossible ? 'Oui' : 'Non'}
Package proposé :
  - Fixe annuel brut : ${input.fixe.toLocaleString('fr-FR')} €
  - OTE total cible : ${input.ote.toLocaleString('fr-FR')} €
  - Variable cible (calculé) : ${variable.toLocaleString('fr-FR')} €
  - Ratio fixe / OTE : ${ratioFixeOte}%
</formulaire>
${blocSiteWeb}${blocFichePoste}

Génère maintenant le plan complet en suivant strictement la structure des 8 sections définie dans le system prompt.`
}
