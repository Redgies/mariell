import { nanoid } from 'nanoid'
import { planDeSourcingSchema, type PlanDeSourcingInput } from '../../../schemas/plan-de-sourcing'
import { verifyTurnstile } from '../../../utils/turnstile'
import { checkPlanSourcingRateLimit } from '../../../utils/ratelimit'
import { getClientIp } from '../../../utils/request'
import {
  findCompanyByNameOrDomain,
  resolveCompanyStatusLabel,
  upsertCompany,
  findRecentPlanSourcingProject,
  createPlanSourcingProject,
  jarviProjectUrl,
  jarviCompanyUrl,
} from '../../../utils/jarvi'
import {
  sendBrevoPlanSourcingNotifInterne,
  sendBrevoPlanSourcingLivraisonProspect,
  sendBrevoPlanSourcingDeferredInterne,
  sendBrevoPlanSourcingDeferredProspect,
  sendCriticalAlert,
} from '../../../utils/brevo'
import { generatePlanWithAnthropic, hasAnthropic } from '../../../utils/anthropic'
import { SYSTEM_PROMPT, buildUserPrompt } from '../../../utils/prompts/plan-de-sourcing'
import { savePlan, saveDeferred, savePlanStatus } from '../../../utils/plan-storage'

const UUID_RE = /^[a-zA-Z0-9_-]{8,20}$/

function extractRequestUuid(body: unknown): string {
  if (body && typeof body === 'object' && 'request_uuid' in body) {
    const raw = (body as { request_uuid?: unknown }).request_uuid
    if (typeof raw === 'string' && UUID_RE.test(raw)) return raw
  }
  return nanoid(10)
}

export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  const body = await readBody(event)
  const requestUuid = extractRequestUuid(body)

  // Init status as 'pending' immédiatement — le polling front commence dès le navigateTo.
  await savePlanStatus(requestUuid, { status: 'pending', updatedAt: new Date().toISOString() }).catch((err) => {
    console.error('[plan-de-sourcing] savePlanStatus(pending) failed', err)
  })

  try {
    // ============================================================
    // PHASE 1 — Validations bloquantes
    // ============================================================

    let validated: PlanDeSourcingInput
    try {
      validated = planDeSourcingSchema.parse(body)
    } catch (zodErr: any) {
      const issues = zodErr?.issues || zodErr?.errors
      const message = issues?.[0]?.message || 'Champs invalides.'
      await savePlanStatus(requestUuid, {
        status: 'error',
        updatedAt: new Date().toISOString(),
        errorCode: 'VALIDATION_FAILED',
        errorMessage: message,
      }).catch(() => {})
      throw createError({
        statusCode: 400,
        statusMessage: 'VALIDATION_FAILED',
        message,
        data: { issues },
      })
    }

    const ip = getClientIp(event)
    const emailDomain = (validated.email.split('@')[1] || '').toLowerCase()

    // Cloudflare Turnstile
    const turnstileOk = await verifyTurnstile(validated.turnstileToken, ip)
    if (!turnstileOk) {
      const message = 'Vérification de sécurité échouée. Merci de rafraîchir la page et réessayer.'
      await savePlanStatus(requestUuid, {
        status: 'error',
        updatedAt: new Date().toISOString(),
        errorCode: 'TURNSTILE_FAILED',
        errorMessage: message,
      }).catch(() => {})
      throw createError({
        statusCode: 403,
        statusMessage: 'TURNSTILE_FAILED',
        message,
      })
    }

    // ============================================================
    // PHASE 2 — Rate limit (3 niveaux : IP/jour, IP/sem, domaine email/mois)
    // → Si dépassé : mode différé, pas de blocage
    // ============================================================

    const rateCheck = await checkPlanSourcingRateLimit(ip, emailDomain)
    if (!rateCheck.allowed) {
      console.warn('[plan-de-sourcing] rate limit hit, switching to deferred', rateCheck)
      const deferredResult = await handleDeferredProcessing(validated, 'rate_limit')
      await savePlanStatus(requestUuid, {
        status: 'deferred',
        updatedAt: new Date().toISOString(),
        deferredId: deferredResult.deferredId,
      }).catch(() => {})
      return deferredResult
    }

    // ============================================================
    // PHASE 3 — Génération Anthropic (avec retry 1 fois)
    // ============================================================

    if (!hasAnthropic()) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[plan-de-sourcing] ANTHROPIC_API_KEY missing — using stub plan in dev')
        return await buildStubResponse(validated, requestUuid)
      }
      console.error('[plan-de-sourcing] ANTHROPIC_API_KEY missing in production — switching to deferred')
      const deferredResult = await handleDeferredProcessing(validated, 'api_failure')
      await savePlanStatus(requestUuid, {
        status: 'deferred',
        updatedAt: new Date().toISOString(),
        deferredId: deferredResult.deferredId,
      }).catch(() => {})
      return deferredResult
    }

    const userPrompt = buildUserPrompt(validated)
    let generatedContent: string
    try {
      generatedContent = await generatePlanWithAnthropic({
        systemPrompt: SYSTEM_PROMPT,
        userPrompt,
      })
    } catch (firstErr) {
      console.warn('[plan-de-sourcing] Anthropic first attempt failed, retrying…', firstErr)
      try {
        generatedContent = await generatePlanWithAnthropic({
          systemPrompt: SYSTEM_PROMPT,
          userPrompt,
        })
      } catch (retryErr) {
        console.error('[plan-de-sourcing] Anthropic retry failed', retryErr)
        sendCriticalAlert('Anthropic API failed twice (Plan de sourcing)', retryErr).catch(() => {})
        const deferredResult = await handleDeferredProcessing(validated, 'api_failure')
        await savePlanStatus(requestUuid, {
          status: 'deferred',
          updatedAt: new Date().toISOString(),
          deferredId: deferredResult.deferredId,
        }).catch(() => {})
        return deferredResult
      }
    }

    if (!generatedContent || generatedContent.length < 200) {
      console.error('[plan-de-sourcing] Anthropic returned suspiciously short content', generatedContent.length)
      sendCriticalAlert('Anthropic returned empty/short content (Plan de sourcing)', { length: generatedContent.length }).catch(() => {})
      const deferredResult = await handleDeferredProcessing(validated, 'api_failure')
      await savePlanStatus(requestUuid, {
        status: 'deferred',
        updatedAt: new Date().toISOString(),
        deferredId: deferredResult.deferredId,
      }).catch(() => {})
      return deferredResult
    }

    // ============================================================
    // PHASE 4 — Sauvegarde KV (BLOQUANT)
    // ============================================================

    const uuid = requestUuid
    try {
      await savePlan(uuid, {
        content: generatedContent,
        metadata: {
          prenom: validated.prenom,
          nom: validated.nom,
          entreprise: validated.entreprise,
          posteRecherche:
            validated.posteRecherche === 'Autre'
              ? validated.posteRecherchePrecisionAutre || 'Autre'
              : validated.posteRecherche,
          createdAt: new Date().toISOString(),
        },
        formData: validated,
      })
    } catch (kvErr) {
      console.error('[plan-de-sourcing] KV save failed', kvErr)
      sendCriticalAlert('KV savePlan failed (Plan de sourcing)', kvErr).catch(() => {})
      await savePlanStatus(requestUuid, {
        status: 'error',
        updatedAt: new Date().toISOString(),
        errorCode: 'INTERNAL_ERROR',
        errorMessage: "Une erreur est survenue. Votre demande n'a pas pu être enregistrée.",
      }).catch(() => {})
      throw createError({
        statusCode: 500,
        statusMessage: 'INTERNAL_ERROR',
        message: 'Une erreur est survenue. Votre demande n\'a pas pu être enregistrée.',
      })
    }

    // Marque le statut 'done' AVANT les side effects — le front peut afficher le résultat
    // dès que la persistance est faite, sans attendre Brevo/Jarvi.
    await savePlanStatus(requestUuid, {
      status: 'done',
      updatedAt: new Date().toISOString(),
    }).catch((err) => {
      console.error('[plan-de-sourcing] savePlanStatus(done) failed (non-blocking)', err)
    })

    // ============================================================
    // PHASE 5 — Side effects en parallèle (Promise.allSettled)
    // ============================================================

    const planUrl = `${getSiteUrl()}/lab/plan-de-sourcing/resultat/${uuid}`
    const dateSoumission = formatDateFr(new Date())

    // Fire & forget Jarvi block — runs in parallel with emails, never blocks the response.
    const jarviSideEffect = (async () => {
      let jarviUrl = ''
      let companyStatusLabel = 'Nouveau prospect'
      try {
        const existingCompany = await findCompanyByNameOrDomain({
          name: validated.entreprise,
          emailDomain,
          websiteUrl: validated.siteEntreprise || `https://${emailDomain}`,
        })
        companyStatusLabel = resolveCompanyStatusLabel(existingCompany)

        const company = await upsertCompany(
          {
            existingCompany,
            name: validated.entreprise,
            websiteUrl: validated.siteEntreprise || `https://${emailDomain}`,
          },
          { retry: true },
        )
        jarviUrl = jarviCompanyUrl(company.id)

        const isRecentDuplicate = await findRecentPlanSourcingProject({
          companyId: company.id,
          daysAgo: 30,
        })

        const statusId = process.env.JARVI_STATUS_ID_LAB_RECUE
        if (statusId) {
          const projectName = isRecentDuplicate
            ? `Lab — Plan de sourcing (DOUBLON 30j) — ${validated.entreprise} — ${dateSoumission}`
            : `Lab — Plan de sourcing — ${validated.entreprise} — ${dateSoumission}`

          const project = await createPlanSourcingProject(
            {
              companyId: company.id,
              name: projectName,
              statusId,
              description: buildProjectDescription(validated, uuid, isRecentDuplicate),
            },
            { retry: true },
          )
          jarviUrl = jarviProjectUrl(project.id)
        }
      } catch (err) {
        console.error('[plan-de-sourcing] Jarvi side effect failed', err)
        sendCriticalAlert('Jarvi side effect failed (Plan de sourcing)', err).catch(() => {})
      }
      return { jarviUrl, companyStatusLabel }
    })()

    // Wait for Jarvi (it provides the url for the internal email)
    const { jarviUrl } = await jarviSideEffect

    const emailResults = await Promise.allSettled([
      sendBrevoPlanSourcingNotifInterne({
        input: validated,
        planUuid: uuid,
        planUrl,
        jarviUrl: jarviUrl || 'Jarvi non créé (vérifier alerte)',
        dateSoumission,
      }),
      sendBrevoPlanSourcingLivraisonProspect({
        input: validated,
        planUrl,
      }),
    ])

    emailResults.forEach((result, idx) => {
      if (result.status === 'rejected') {
        const emailType = idx === 0 ? 'notif-interne' : 'livraison-prospect'
        console.error(`[plan-de-sourcing] Brevo ${emailType} failed`, result.reason)
        sendCriticalAlert(`Brevo ${emailType} failed (Plan de sourcing)`, result.reason).catch(() => {})
      }
    })

    const duration = Date.now() - startTime
    console.log(`[plan-de-sourcing] Plan generated in ${duration}ms — uuid: ${uuid}`)

    return {
      success: true,
      deferred: false,
      uuid,
      plan: generatedContent,
      redirectUrl: `/lab/plan-de-sourcing/resultat/${uuid}`,
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    console.error('[plan-de-sourcing] unexpected error', err)
    sendCriticalAlert('Plan-de-sourcing route unexpected error', err).catch(() => {})
    await savePlanStatus(requestUuid, {
      status: 'error',
      updatedAt: new Date().toISOString(),
      errorCode: 'INTERNAL_ERROR',
      errorMessage: "Une erreur technique s'est produite. Merci de réessayer dans quelques minutes.",
    }).catch(() => {})
    throw createError({
      statusCode: 500,
      statusMessage: 'INTERNAL_ERROR',
      message: 'Une erreur technique s\'est produite. Merci de réessayer dans quelques minutes.',
    })
  }
})

// ============================================================
// Mode différé — appelé si rate limit OU API Anthropic indisponible
// ============================================================

async function handleDeferredProcessing(
  input: PlanDeSourcingInput,
  reason: 'rate_limit' | 'api_failure',
) {
  const deferredId = nanoid(10)
  const dateSoumission = formatDateFr(new Date())
  const raisonLibelle =
    reason === 'rate_limit'
      ? 'Rate limit atteint (IP ou domaine email)'
      : 'API Anthropic indisponible (2 tentatives échouées)'

  // KV save (best-effort — if it fails, the lead still gets through via emails)
  try {
    await saveDeferred(deferredId, {
      formData: input,
      reason,
      createdAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[plan-de-sourcing] saveDeferred failed (non-blocking)', err)
  }

  // Jarvi best-effort
  let jarviUrl = ''
  try {
    const emailDomain = (input.email.split('@')[1] || '').toLowerCase()
    const existing = await findCompanyByNameOrDomain({
      name: input.entreprise,
      emailDomain,
      websiteUrl: input.siteEntreprise || `https://${emailDomain}`,
    })
    const company = await upsertCompany(
      {
        existingCompany: existing,
        name: input.entreprise,
        websiteUrl: input.siteEntreprise || `https://${emailDomain}`,
      },
      { retry: true },
    )
    jarviUrl = jarviCompanyUrl(company.id)

    const statusId = process.env.JARVI_STATUS_ID_LAB_RECUE
    if (statusId) {
      const tagPrefix = reason === 'rate_limit' ? 'Lab — Manuel - Rate limit' : 'Lab — Manuel - API'
      const project = await createPlanSourcingProject(
        {
          companyId: company.id,
          name: `${tagPrefix} — ${input.entreprise} — ${dateSoumission}`,
          statusId,
          description: buildProjectDescription(input, deferredId, false, reason),
        },
        { retry: true },
      )
      jarviUrl = jarviProjectUrl(project.id)
    }
  } catch (err) {
    console.error('[plan-de-sourcing] Jarvi deferred side effect failed', err)
    sendCriticalAlert('Jarvi deferred side effect failed', err).catch(() => {})
  }

  // 2 emails Brevo
  await Promise.allSettled([
    sendBrevoPlanSourcingDeferredInterne({
      input,
      deferredId,
      raisonDiffere: raisonLibelle,
      jarviUrl: jarviUrl || 'Jarvi non créé (vérifier alerte)',
      dateSoumission,
    }).catch((err) => {
      console.error('[plan-de-sourcing] deferred-interne email failed', err)
      sendCriticalAlert('Brevo deferred-interne failed', err).catch(() => {})
    }),
    sendBrevoPlanSourcingDeferredProspect({ input }).catch((err) => {
      console.error('[plan-de-sourcing] deferred-prospect email failed', err)
      sendCriticalAlert('Brevo deferred-prospect failed', err).catch(() => {})
    }),
  ])

  return {
    success: true,
    deferred: true,
    deferredId,
    message: 'Votre demande sera traitée manuellement sous 24h ouvrées.',
  }
}

// ============================================================
// Helpers
// ============================================================

function buildProjectDescription(
  input: PlanDeSourcingInput,
  refId: string,
  isDuplicate = false,
  deferredReason?: 'rate_limit' | 'api_failure',
): string {
  const variable = input.ote - input.fixe
  const ratio = input.ote > 0 ? Math.round((input.fixe / input.ote) * 100) : 100
  const lines = [
    `**Identité** : ${input.prenom} ${input.nom} · ${input.email} · ${input.telephone}`,
    `**Entreprise** : ${input.entreprise}`,
    '',
    `**Poste recherché** : ${input.posteRecherche === 'Autre' ? input.posteRecherchePrecisionAutre || 'Autre' : input.posteRecherche}`,
    `**Séniorité** : ${input.seniorite}`,
    `**Objectif** : ${input.objectifPoste}`,
    `**Localisation** : ${input.localisation}${input.remotePossible ? ' (remote possible)' : ''}`,
    '',
    `**Secteur** : ${input.secteur === 'Autre' ? input.secteurPrecisionAutre || 'Autre' : input.secteur}`,
    `**Package** : ${input.fixe.toLocaleString('fr-FR')} € fixe / ${input.ote.toLocaleString('fr-FR')} € OTE (variable ${variable.toLocaleString('fr-FR')} €, ratio ${ratio}% fixe)`,
  ]
  if (input.siteEntreprise) lines.push(`**Site** : ${input.siteEntreprise}`)
  if (input.contenuFichePoste) {
    lines.push('', `**Fiche de poste** :\n${input.contenuFichePoste.slice(0, 1500)}${input.contenuFichePoste.length > 1500 ? '\n…(tronqué)' : ''}`)
  }
  if (isDuplicate) lines.push('', '⚠️ Doublon 30j détecté — cette entreprise a déjà soumis un plan dans le mois.')
  if (deferredReason) lines.push('', `🛑 Demande différée (raison : ${deferredReason}). Réf : ${refId}`)
  else lines.push('', `Réf plan : ${refId}`)
  return lines.join('\n')
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

function getSiteUrl(): string {
  return (process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')
}

/**
 * Dev-only stub: returns a fake plan when ANTHROPIC_API_KEY is missing.
 * Skips KV save, skips emails, skips Jarvi — just enough for the front-end
 * to render the result page without any external service.
 */
async function buildStubResponse(input: PlanDeSourcingInput, requestUuid: string) {
  const uuid = requestUuid
  await savePlanStatus(uuid, { status: 'done', updatedAt: new Date().toISOString() }).catch(() => {})
  const posteAffiche =
    input.posteRecherche === 'Autre'
      ? input.posteRecherchePrecisionAutre || 'Autre'
      : input.posteRecherche
  const stubPlan = `# Plan de sourcing LinkedIn — ${posteAffiche}

*Préparé par Mariell pour ${input.entreprise}*

---

Bonjour ${input.prenom},

**[STUB DEV — pas d'appel Anthropic réel]**

Ce contenu est un placeholder. Configure \`ANTHROPIC_API_KEY\` dans \`.env\` pour générer un vrai plan via Claude Haiku 4.5.

Voici votre plan de sourcing LinkedIn, en 7 livrables structurés. Entreprises cibles, intitulés à viser, requête booléenne, stratégie en 4 phases, scoring, points de vigilance, et un mot de conclusion.

## Entreprises cibles

- Vivier premium A
- Source adjacente B
- Opportuniste C

## Conclusion

*Ce plan marche, à condition de l'exécuter à temps.*

*On peut en parler. C'est ici.*

**[CTA Calendly]**`

  return {
    success: true,
    deferred: false,
    uuid,
    plan: stubPlan,
    redirectUrl: `/lab/plan-de-sourcing/resultat/${uuid}`,
  }
}
