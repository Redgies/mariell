import { stageAlternanceSchema, type StageAlternanceInput } from '../../schemas/stage-alternance'
import { verifyTurnstile } from '../../utils/turnstile'
import { isPersonalEmail } from '../../utils/email-blacklist'
import { checkStageAlternanceRateLimit } from '../../utils/ratelimit'
import { getClientIp } from '../../utils/request'
import {
  findCompanyByNameOrDomain,
  resolveCompanyStatusLabel,
  hasActiveLabProject,
  upsertCompany,
  createProject,
  upsertProfile,
  jarviProjectUrl,
  jarviCompanyUrl,
} from '../../utils/jarvi'
import {
  sendBrevoStageNotifInterne,
  sendBrevoStageConfirmationProspect,
  sendCriticalAlert,
} from '../../utils/brevo'

export default defineEventHandler(async (event) => {
  try {
    // ============================================================
    // PHASE 1 — Validations bloquantes
    // ============================================================

    const body = await readBody(event)
    let validated: StageAlternanceInput
    try {
      validated = stageAlternanceSchema.parse(body)
    } catch (zodErr: any) {
      const issues = zodErr?.issues || zodErr?.errors
      throw createError({
        statusCode: 400,
        statusMessage: 'VALIDATION_FAILED',
        message: issues?.[0]?.message || 'Champs invalides.',
        data: { issues },
      })
    }

    // Honeypot — return faux 200 to not alert the bot
    if (validated.company_website && validated.company_website.length > 0) {
      console.warn('[stage-alternance] honeypot triggered', { ip: getClientIp(event) })
      return { success: true, redirectUrl: '/lab/demande-stage-alternance/confirmation' }
    }

    const ip = getClientIp(event)

    // Cloudflare Turnstile
    const turnstileOk = await verifyTurnstile(validated.turnstileToken, ip)
    if (!turnstileOk) {
      throw createError({
        statusCode: 403,
        statusMessage: 'TURNSTILE_FAILED',
        message: 'Vérification de sécurité échouée. Merci de rafraîchir la page et réessayer.',
      })
    }

    // Email pro
    if (isPersonalEmail(validated.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'PERSONAL_EMAIL',
        message: "Cet outil est réservé aux entreprises. Merci d'utiliser votre email professionnel.",
      })
    }

    // Rate limit
    const rateCheck = await checkStageAlternanceRateLimit(ip)
    if (!rateCheck.allowed) {
      throw createError({
        statusCode: 429,
        statusMessage: 'RATE_LIMIT',
        message:
          'Limite de soumissions atteinte. Vous avez déjà effectué plusieurs demandes récemment. Si votre demande est urgente, contactez-nous directement à bonjour@mariell.fr.',
      })
    }

    // ============================================================
    // PHASE 2 — Lookup + anti-doublon Jarvi
    // ============================================================

    const emailDomain = validated.email.split('@')[1] || ''
    const existingCompany = await findCompanyByNameOrDomain({
      name: validated.entreprise,
      emailDomain,
      websiteUrl: validated.urlEntreprise,
    })

    const companyStatusLabel = resolveCompanyStatusLabel(existingCompany)

    if (existingCompany) {
      const isDuplicate = await hasActiveLabProject({ companyId: existingCompany.id })
      if (isDuplicate) {
        throw createError({
          statusCode: 409,
          statusMessage: 'DUPLICATE_REQUEST',
          message:
            'Une demande est déjà en cours pour votre entreprise. Pour toute mise à jour ou information complémentaire, contactez-nous directement à bonjour@mariell.fr.',
        })
      }
    }

    // ============================================================
    // PHASE 3 — Side effects (fail-soft)
    // ============================================================

    let companyId: string | null = null
    let companyUrl = 'Company Jarvi non créée (vérifier alerte)'
    let projectUrl = 'Project Jarvi non créé (vérifier alerte)'

    try {
      const company = await upsertCompany(
        {
          existingCompany,
          name: validated.entreprise,
          websiteUrl: validated.urlEntreprise,
          description: buildProjectDescription(validated),
        },
        { retry: true },
      )
      companyId = company.id
      companyUrl = jarviCompanyUrl(company.id)
    } catch (err) {
      console.error('[stage-alternance] Company upsert failed after retry', err)
      sendCriticalAlert('Jarvi Company upsert failed (Stage/Alternance)', err).catch(() => {})
    }

    let projectId: string | null = null
    if (companyId) {
      try {
        const statusId = process.env.JARVI_PROJECT_STATUS_ID_STAGE_ALTERNANCE
        if (!statusId) throw new Error('Missing JARVI_PROJECT_STATUS_ID_STAGE_ALTERNANCE')

        const project = await createProject(
          {
            companyId,
            name: `Lab — Stage/Alternance — ${getDisplayProfil(validated)} — ${formatDateFr(new Date())}`,
            statusId,
            typeDemandeLabValue: 'Stage/Alternance',
            description: buildProjectDescription(validated),
          },
          { retry: true },
        )
        projectId = project.id
        projectUrl = jarviProjectUrl(project.id)
      } catch (err) {
        console.error('[stage-alternance] Project creation failed after retry', err)
        sendCriticalAlert('Jarvi Project creation failed (Stage/Alternance)', err).catch(() => {})
      }
    }

    // Profile (contact) — rattaché à la company ET au projet créés.
    // Jarvi auto-merge sur email existant → 1 seul profile mais N projets associés.
    if (companyId) {
      try {
        const profileStatusId = process.env.JARVI_PROFILE_STATUS_ID_STAGE_ALTERNANCE
        await upsertProfile(
          {
            firstName: validated.prenom,
            lastName: validated.nom,
            email: validated.email,
            phone: validated.telephone,
            companyName: validated.entreprise,
            companyId,
            ...(projectId ? { projectId } : {}),
            ...(profileStatusId ? { statusId: profileStatusId } : {}),
          },
          { retry: true },
        )
      } catch (err) {
        console.error('[stage-alternance] Profile upsert failed after retry', err)
        sendCriticalAlert('Jarvi Profile upsert failed (Stage/Alternance)', err).catch(() => {})
      }
    }

    // 2 emails Brevo en parallèle
    const dateSoumission = formatDateFr(new Date())
    const emailResults = await Promise.allSettled([
      sendBrevoStageNotifInterne({
        input: validated,
        companyStatusLabel,
        projectUrl,
        companyUrl,
        dateSoumission,
      }),
      sendBrevoStageConfirmationProspect({ input: validated }),
    ])

    emailResults.forEach((result, idx) => {
      if (result.status === 'rejected') {
        const emailType = idx === 0 ? 'notif-interne' : 'confirmation-prospect'
        console.error(`[stage-alternance] Brevo ${emailType} failed`, result.reason)
        sendCriticalAlert(`Brevo ${emailType} failed (Stage/Alternance)`, result.reason).catch(() => {})
      }
    })

    return {
      success: true,
      redirectUrl: '/lab/demande-stage-alternance/confirmation',
    }
  } catch (err: any) {
    if (err?.statusCode) throw err

    console.error('[stage-alternance] unexpected error', err)
    sendCriticalAlert('Stage/Alternance route unexpected error', err).catch(() => {})

    throw createError({
      statusCode: 500,
      statusMessage: 'INTERNAL_ERROR',
      message:
        "Une erreur technique s'est produite. Votre demande n'a pas pu être enregistrée. Merci de réessayer dans quelques minutes, ou de nous contacter directement à bonjour@mariell.fr.",
    })
  }
})

function getDisplayProfil(input: StageAlternanceInput): string {
  return input.profilRecherche === 'Autre'
    ? input.profilRecherchePrecisionAutre || 'Profil personnalisé'
    : input.profilRecherche
}

function buildProjectDescription(input: StageAlternanceInput): string {
  return [
    '## Contact',
    `${input.prenom} ${input.nom}`,
    input.email,
    input.telephone,
    '',
    '## Entreprise',
    input.entreprise,
    input.urlEntreprise,
    '',
    '## Besoin',
    `**Type de contrat** : ${input.typeContrat}`,
    `**Profil recherché** : ${getDisplayProfil(input)}`,
    `**Date de démarrage** : ${input.dateDemarrage}`,
    `**Localisation** : ${input.localisation}`,
    '',
    '## Brief de la mission',
    input.briefMission,
    '',
    '---',
    `Source : Le Lab Mariell — Outil 1 (Demande Stage/Alternance)`,
    `Soumis le ${formatDateFr(new Date())}`,
  ].join('\n')
}

function formatDateFr(d: Date): string {
  const fmt = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  })
  return fmt.format(d).replace(',', ' à').replace(' h ', 'h')
}
