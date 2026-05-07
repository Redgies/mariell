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
  const templateId = parseInt(process.env.BREVO_TEMPLATE_ID_STAGE_CONFIRMATION_PROSPECT || '0', 10)
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
