import type { StageAlternanceInput } from '../schemas/stage-alternance'

const BREVO_API_BASE = 'https://api.brevo.com/v3'

interface BrevoRecipient {
  email: string
  name?: string
}

interface SendBrevoOptions {
  templateId: number
  to: BrevoRecipient[]
  params?: Record<string, unknown>
  replyTo?: BrevoRecipient
}

interface BrevoSendResponse {
  messageId?: string
}

function hasBrevo(): boolean {
  return Boolean(process.env.BREVO_API_KEY)
}

/**
 * Generic Brevo send. No-op (logs only) if BREVO_API_KEY missing — dev convenience.
 * Throws on non-2xx in production so callers can fail-soft per-email.
 */
export async function sendBrevoEmail(opts: SendBrevoOptions): Promise<BrevoSendResponse> {
  if (!hasBrevo()) {
    console.warn('[brevo] BREVO_API_KEY missing — logging instead of sending', {
      templateId: opts.templateId,
      to: opts.to,
      params: opts.params,
    })
    return { messageId: 'dev-stub' }
  }

  if (!Number.isFinite(opts.templateId) || opts.templateId <= 0) {
    throw new Error(`[brevo] invalid templateId: ${opts.templateId}`)
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL
  if (!senderEmail) throw new Error('[brevo] BREVO_SENDER_EMAIL missing')

  const body = {
    sender: { email: senderEmail, name: 'Mariell' },
    to: opts.to,
    templateId: opts.templateId,
    params: opts.params || {},
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
  }

  const res = await fetch(`${BREVO_API_BASE}/smtp/email`, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`[brevo] send failed: ${res.status} ${text}`)
  }

  return (await res.json()) as BrevoSendResponse
}

/**
 * Resolve a Brevo template id from its env var, with an explicit, debuggable
 * error. When Brevo is configured (BREVO_API_KEY present) but the template env
 * var is missing/0, throw a NAMED message — which env var to set on Vercel and
 * which Brevo template to check — instead of a generic "invalid templateId".
 * The message surfaces in logs AND in the critical alert raised by the handlers.
 * In dev (no BREVO_API_KEY) we don't throw: sendBrevoEmail() logs a stub.
 */
function resolveTemplateId(envVar: string, label: string): number {
  const raw = process.env[envVar]
  const id = parseInt(raw || '0', 10)
  if (hasBrevo() && (!Number.isFinite(id) || id <= 0)) {
    throw new Error(
      `[brevo] ${label} NON ENVOYÉ — variable d'env ${envVar} non configurée ` +
        `(valeur actuelle : "${raw ?? 'undefined'}"). ` +
        `→ Définis ${envVar} sur Vercel avec l'ID numérique du template, ` +
        `et vérifie que ce template existe et est actif dans Brevo.`,
    )
  }
  return id
}

/**
 * Critical alert email to the gérant — used by fail-soft handlers.
 * Plain-text, no template required, so it works even before Brevo templates are setup.
 */
export async function sendCriticalAlert(subject: string, error: unknown): Promise<void> {
  if (!hasBrevo()) {
    console.error('[brevo] CRITICAL ALERT (logged only — Brevo not configured):', subject, error)
    return
  }

  const recipient = process.env.BREVO_ALERT_RECIPIENT || process.env.BREVO_NOTIF_RECIPIENT
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  if (!recipient || !senderEmail) {
    console.error('[brevo] cannot send alert — missing BREVO_ALERT_RECIPIENT or BREVO_SENDER_EMAIL', subject, error)
    return
  }

  const errMsg = error instanceof Error ? `${error.message}\n${error.stack ?? ''}` : String(error)
  const html = `<pre style="font-family: ui-monospace, monospace; font-size: 13px; white-space: pre-wrap;">${escapeHtml(errMsg)}</pre>`

  try {
    await fetch(`${BREVO_API_BASE}/smtp/email`, {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY!,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: 'Mariell · Lab — alerte technique' },
        to: [{ email: recipient }],
        subject: `[Lab Mariell · ALERTE] ${subject}`,
        htmlContent: html,
      }),
    })
  } catch (err) {
    console.error('[brevo] critical alert itself failed to send', err)
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// ============================================================
// Outil 1 — Stage / Alternance
// ============================================================

export async function sendBrevoStageNotifInterne(args: {
  input: StageAlternanceInput
  companyStatusLabel: string
  projectUrl: string
  companyUrl: string
  dateSoumission: string
}): Promise<BrevoSendResponse> {
  const { input } = args
  const profilDisplay =
    input.profilRecherche === 'Autre'
      ? input.profilRecherchePrecisionAutre || 'Profil personnalisé'
      : input.profilRecherche

  const recipient = process.env.BREVO_NOTIF_RECIPIENT
  if (!recipient) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[brevo] BREVO_NOTIF_RECIPIENT missing — skipping notif interne in dev')
      return { messageId: 'dev-stub-no-recipient' }
    }
    throw new Error('[brevo] BREVO_NOTIF_RECIPIENT missing')
  }

  const templateId = parseInt(process.env.BREVO_TEMPLATE_ID_STAGE_NOTIF_INTERNE || '0', 10)

  return sendBrevoEmail({
    templateId,
    to: [{ email: recipient }],
    replyTo: { email: input.email, name: `${input.prenom} ${input.nom}` },
    params: {
      DATE_SOUMISSION: args.dateSoumission,
      COMPANY_STATUS_LABEL: args.companyStatusLabel,
      PRENOM_NOM: `${input.prenom} ${input.nom}`,
      EMAIL: input.email,
      TELEPHONE: input.telephone,
      ENTREPRISE: input.entreprise,
      URL_ENTREPRISE: input.urlEntreprise,
      TYPE_CONTRAT: input.typeContrat,
      PROFIL_RECHERCHE: profilDisplay,
      DATE_DEMARRAGE: input.dateDemarrage,
      LOCALISATION: input.localisation,
      BRIEF_MISSION: input.briefMission,
      URL_JARVI_PROJECT: args.projectUrl,
      URL_JARVI_COMPANY: args.companyUrl,
    },
  })
}

export async function sendBrevoStageConfirmationProspect(args: {
  input: StageAlternanceInput
}): Promise<BrevoSendResponse> {
  const { input } = args
  const templateId = resolveTemplateId(
    'BREVO_TEMPLATE_ID_STAGE_CONFIRMATION_PROSPECT',
    'Stage/alternance — confirmation prospect',
  )
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://mariell.fr'

  return sendBrevoEmail({
    templateId,
    to: [{ email: input.email, name: `${input.prenom} ${input.nom}` }],
    params: {
      PRENOM: input.prenom,
      TYPE_CONTRAT_LOWER: input.typeContrat.toLowerCase(),
      ENTREPRISE: input.entreprise,
      URL_LAB: `${siteUrl.replace(/\/+$/, '')}/lab`,
    },
  })
}

// ============================================================
// Outil 2 — Plan de sourcing LinkedIn
// ============================================================

import type { PlanDeSourcingInput } from '../schemas/plan-de-sourcing'

interface PackageFormatted {
  fixe: string
  ote: string
  variable: string
  ratio: string
}

/** Formats Fixe/OTE for human display in emails (FR locale, narrow no-break space). */
export function formatPackage(fixe: number, ote: number): PackageFormatted {
  const variable = ote - fixe
  const ratio = ote > 0 ? Math.round((fixe / ote) * 100) : 100
  return {
    fixe: `${fixe.toLocaleString('fr-FR')} €`,
    ote: `${ote.toLocaleString('fr-FR')} €`,
    variable: `${variable.toLocaleString('fr-FR')} €`,
    ratio: `${ratio}% fixe / ${100 - ratio}% variable`,
  }
}

/** Build common params shared between notif-interne and deferred-interne templates. */
function buildPlanSourcingInternalParams(input: PlanDeSourcingInput) {
  const pkg = formatPackage(input.fixe, input.ote)
  return {
    PRENOM: input.prenom,
    NOM: input.nom,
    EMAIL: input.email,
    TELEPHONE: input.telephone,
    ENTREPRISE: input.entreprise,
    POSTE_RECHERCHE:
      input.posteRecherche === 'Autre'
        ? input.posteRecherchePrecisionAutre || 'Autre'
        : input.posteRecherche,
    SENIORITE: input.seniorite,
    OBJECTIF_POSTE: input.objectifPoste,
    LOCALISATION: input.localisation,
    REMOTE_POSSIBLE: input.remotePossible ? 'Oui' : 'Non',
    SECTEUR:
      input.secteur === 'Autre' ? input.secteurPrecisionAutre || 'Autre' : input.secteur,
    PACKAGE_FIXE: pkg.fixe,
    PACKAGE_OTE: pkg.ote,
    PACKAGE_VARIABLE: pkg.variable,
    PACKAGE_RATIO: pkg.ratio,
    SITE_ENTREPRISE: input.siteEntreprise || 'Non fourni',
    FICHE_POSTE_FOURNIE: input.contenuFichePoste
      ? `Oui — extrait : "${input.contenuFichePoste.slice(0, 200)}..."`
      : 'Non fournie',
  }
}

interface PlanSourcingNotifInterneArgs {
  input: PlanDeSourcingInput
  planUuid: string
  planUrl: string
  jarviUrl: string
  dateSoumission: string
}

export async function sendBrevoPlanSourcingNotifInterne(
  args: PlanSourcingNotifInterneArgs,
): Promise<BrevoSendResponse> {
  const recipient = process.env.BREVO_NOTIF_RECIPIENT
  if (!recipient) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[brevo] BREVO_NOTIF_RECIPIENT missing — skipping plan-sourcing notif interne')
      return { messageId: 'dev-stub-no-recipient' }
    }
    throw new Error('[brevo] BREVO_NOTIF_RECIPIENT missing')
  }
  const templateId = parseInt(process.env.BREVO_TEMPLATE_ID_PLAN_SOURCING_NOTIF_INTERNE || '0', 10)

  return sendBrevoEmail({
    templateId,
    to: [{ email: recipient }],
    replyTo: { email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` },
    params: {
      DATE_SOUMISSION: args.dateSoumission,
      ...buildPlanSourcingInternalParams(args.input),
      URL_PLAN: args.planUrl,
      URL_JARVI: args.jarviUrl,
      PLAN_UUID: args.planUuid,
    },
  })
}

interface PlanSourcingLivraisonProspectArgs {
  input: PlanDeSourcingInput
  planUrl: string
}

export async function sendBrevoPlanSourcingLivraisonProspect(
  args: PlanSourcingLivraisonProspectArgs,
): Promise<BrevoSendResponse> {
  const templateId = resolveTemplateId(
    'BREVO_TEMPLATE_ID_PLAN_SOURCING_LIVRAISON_PROSPECT',
    'Plan de sourcing — livraison prospect',
  )
  const calendlyUrl = process.env.NUXT_PUBLIC_CALENDLY_URL || '#'

  const posteAffiche =
    args.input.posteRecherche === 'Autre'
      ? args.input.posteRecherchePrecisionAutre || 'Autre'
      : args.input.posteRecherche

  return sendBrevoEmail({
    templateId,
    to: [{ email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` }],
    params: {
      PRENOM: args.input.prenom,
      POSTE_RECHERCHE: posteAffiche,
      ENTREPRISE: args.input.entreprise,
      URL_PLAN: args.planUrl,
      URL_CALENDLY: calendlyUrl,
    },
  })
}

interface PlanSourcingDeferredInterneArgs {
  input: PlanDeSourcingInput
  deferredId: string
  raisonDiffere: string
  jarviUrl: string
  dateSoumission: string
}

export async function sendBrevoPlanSourcingDeferredInterne(
  args: PlanSourcingDeferredInterneArgs,
): Promise<BrevoSendResponse> {
  const recipient = process.env.BREVO_NOTIF_RECIPIENT
  if (!recipient) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[brevo] BREVO_NOTIF_RECIPIENT missing — skipping plan-sourcing deferred interne')
      return { messageId: 'dev-stub-no-recipient' }
    }
    throw new Error('[brevo] BREVO_NOTIF_RECIPIENT missing')
  }
  const templateId = parseInt(process.env.BREVO_TEMPLATE_ID_PLAN_SOURCING_DEFERRED_INTERNE || '0', 10)

  return sendBrevoEmail({
    templateId,
    to: [{ email: recipient }],
    replyTo: { email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` },
    params: {
      DATE_SOUMISSION: args.dateSoumission,
      RAISON_DIFFERE: args.raisonDiffere,
      DEFERRED_ID: args.deferredId,
      ...buildPlanSourcingInternalParams(args.input),
      URL_JARVI: args.jarviUrl,
    },
  })
}

interface PlanSourcingDeferredProspectArgs {
  input: PlanDeSourcingInput
}

export async function sendBrevoPlanSourcingDeferredProspect(
  args: PlanSourcingDeferredProspectArgs,
): Promise<BrevoSendResponse> {
  const templateId = resolveTemplateId(
    'BREVO_TEMPLATE_ID_PLAN_SOURCING_DEFERRED_PROSPECT',
    'Plan de sourcing — différé prospect',
  )
  const calendlyUrl = process.env.NUXT_PUBLIC_CALENDLY_URL || '#'

  const posteAffiche =
    args.input.posteRecherche === 'Autre'
      ? args.input.posteRecherchePrecisionAutre || 'Autre'
      : args.input.posteRecherche

  return sendBrevoEmail({
    templateId,
    to: [{ email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` }],
    params: {
      PRENOM: args.input.prenom,
      POSTE_RECHERCHE: posteAffiche,
      URL_CALENDLY: calendlyUrl,
    },
  })
}

// ============================================================
// Outil 3 — Évaluation d'attractivité
// ============================================================

import type { FormulaireOutil3 } from '../schemas/outil-3/formulaire'
import { getDimensionFonctionLabel } from '../schemas/outil-3/formulaire'
import type { LlmOutputJson } from '../schemas/outil-3/llm-output-json'

function buildEvaluationInternalParams(input: FormulaireOutil3, json?: LlmOutputJson | null) {
  const intituleAffiche =
    input.intitule_poste === 'Autre' && input.intitule_poste_precision_autre
      ? `${input.intitule_poste} (${input.intitule_poste_precision_autre})`
      : input.intitule_poste
  const secteurAffiche =
    input.secteur === 'Autre' && input.secteur_precision_autre
      ? `${input.secteur} (${input.secteur_precision_autre})`
      : input.secteur

  return {
    PRENOM: input.prenom,
    NOM: input.nom,
    EMAIL: input.email,
    TELEPHONE: input.telephone,
    ENTREPRISE: input.entreprise,
    SITE_WEB: input.site_web || 'Non fourni',
    SECTEUR: secteurAffiche,
    LOCALISATION: input.localisation,
    EFFECTIFS: input.effectifs_entreprise,
    EQUIPE_SALES: input.equipe_sales,
    INTITULE_POSTE: intituleAffiche,
    SENIORITE: input.seniorite,
    TYPE_CYCLE: getDimensionFonctionLabel(input),
    MODALITE_TRAVAIL: input.modalite_travail,
    DESCRIPTION_MISSIONS: input.description_missions.slice(0, 500),
    PACKAGE_FIXE: `${input.package_fixe.toLocaleString('fr-FR')} €`,
    PACKAGE_OTE: `${input.package_ote.toLocaleString('fr-FR')} €`,
    NIVEAU_ATTRACTIVITE: json?.niveau_attractivite || 'En cours d\'évaluation',
    NIVEAU_INDEX: json?.niveau_index?.toString() || '0',
    JAUGE_POSITION: json?.jauge_position?.toString() || '—',
    DIMENSIONS_MARQUE: json?.dimensions?.marque || '—',
    DIMENSIONS_SECTEUR: json?.dimensions?.secteur || '—',
    DIMENSIONS_MISSION: json?.dimensions?.mission || '—',
    DIMENSIONS_PACKAGE: json?.dimensions?.package || '—',
    BRIEF_FLOU: json?.brief_flou ? 'Oui' : 'Non',
  }
}

interface EvaluationNotifInterneLivreeArgs {
  input: FormulaireOutil3
  uuid: string
  resultatUrl: string
  jarviUrl: string
  json: LlmOutputJson | null
  dateSoumission: string
}

export async function sendBrevoEvaluationNotifInterneLivree(
  args: EvaluationNotifInterneLivreeArgs,
): Promise<BrevoSendResponse> {
  const recipient = process.env.BREVO_NOTIF_RECIPIENT
  if (!recipient) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[brevo] BREVO_NOTIF_RECIPIENT missing — skipping eval notif interne livrée')
      return { messageId: 'dev-stub-no-recipient' }
    }
    throw new Error('[brevo] BREVO_NOTIF_RECIPIENT missing')
  }
  const templateId = parseInt(
    process.env.BREVO_TEMPLATE_ID_EVALUATION_ATTRACTIVITE_NOTIF_INTERNE_LIVREE || '0',
    10,
  )

  return sendBrevoEmail({
    templateId,
    to: [{ email: recipient }],
    replyTo: { email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` },
    params: {
      DATE_SOUMISSION: args.dateSoumission,
      ...buildEvaluationInternalParams(args.input, args.json),
      URL_RESULTAT: args.resultatUrl,
      URL_JARVI: args.jarviUrl,
      EVAL_UUID: args.uuid,
    },
  })
}

interface EvaluationNotifInterneDifféréeArgs {
  input: FormulaireOutil3
  deferredId: string
  raisonDiffere: string
  jarviUrl: string
  dateSoumission: string
}

export async function sendBrevoEvaluationNotifInterneDifferee(
  args: EvaluationNotifInterneDifféréeArgs,
): Promise<BrevoSendResponse> {
  const recipient = process.env.BREVO_NOTIF_RECIPIENT
  if (!recipient) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[brevo] BREVO_NOTIF_RECIPIENT missing — skipping eval notif interne différée')
      return { messageId: 'dev-stub-no-recipient' }
    }
    throw new Error('[brevo] BREVO_NOTIF_RECIPIENT missing')
  }
  const templateId = parseInt(
    process.env.BREVO_TEMPLATE_ID_EVALUATION_ATTRACTIVITE_NOTIF_INTERNE_DIFFEREE || '0',
    10,
  )

  return sendBrevoEmail({
    templateId,
    to: [{ email: recipient }],
    replyTo: { email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` },
    params: {
      DATE_SOUMISSION: args.dateSoumission,
      RAISON_DIFFERE: args.raisonDiffere,
      DEFERRED_ID: args.deferredId,
      ...buildEvaluationInternalParams(args.input, null),
      URL_JARVI: args.jarviUrl,
    },
  })
}

interface EvaluationConfirmationProspectArgs {
  input: FormulaireOutil3
  resultatUrl: string
  json: LlmOutputJson | null
}

export async function sendBrevoEvaluationConfirmationProspect(
  args: EvaluationConfirmationProspectArgs,
): Promise<BrevoSendResponse> {
  const templateId = resolveTemplateId(
    'BREVO_TEMPLATE_ID_EVALUATION_ATTRACTIVITE_CONFIRMATION_PROSPECT',
    'Évaluation — confirmation prospect',
  )
  const calendlyUrl = process.env.NUXT_PUBLIC_CALENDLY_URL || '#'

  const intituleAffiche =
    args.input.intitule_poste === 'Autre' && args.input.intitule_poste_precision_autre
      ? args.input.intitule_poste_precision_autre
      : args.input.intitule_poste

  return sendBrevoEmail({
    templateId,
    to: [{ email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` }],
    params: {
      PRENOM: args.input.prenom,
      INTITULE_POSTE: intituleAffiche,
      ENTREPRISE: args.input.entreprise,
      NIVEAU_ATTRACTIVITE: args.json?.niveau_attractivite || '',
      URL_RESULTAT: args.resultatUrl,
      URL_CALENDLY: calendlyUrl,
    },
  })
}

interface EvaluationSuiviProspectArgs {
  input: FormulaireOutil3
}

/** Email de "suivi" envoyé au prospect en cas de demande différée — pendant que l'équipe traite manuellement */
export async function sendBrevoEvaluationSuiviProspect(
  args: EvaluationSuiviProspectArgs,
): Promise<BrevoSendResponse> {
  const templateId = resolveTemplateId(
    'BREVO_TEMPLATE_ID_EVALUATION_ATTRACTIVITE_SUIVI_PROSPECT',
    'Évaluation — suivi prospect (différé)',
  )
  const calendlyUrl = process.env.NUXT_PUBLIC_CALENDLY_URL || '#'

  return sendBrevoEmail({
    templateId,
    to: [{ email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` }],
    params: {
      PRENOM: args.input.prenom,
      ENTREPRISE: args.input.entreprise,
      URL_CALENDLY: calendlyUrl,
    },
  })
}
