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
  upsertProfile,
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
import { getSystemPrompt, buildUserPrompt } from '../../../utils/prompts/plan-de-sourcing'
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

    const systemPrompt = await getSystemPrompt()
    const userPrompt = buildUserPrompt(validated)
    let generatedContent: string
    try {
      generatedContent = await generatePlanWithAnthropic({
        systemPrompt,
        userPrompt,
      })
    } catch (firstErr) {
      console.warn('[plan-de-sourcing] Anthropic first attempt failed, retrying…', firstErr)
      try {
        generatedContent = await generatePlanWithAnthropic({
          systemPrompt,
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

    // Jarvi block : company → project → profile. Bloque sur l'attente pour
    // que la notif interne ait l'URL Jarvi à inclure.
    let jarviUrl = ''
    let companyId: string | null = null
    let projectId: string | null = null
    try {
      const existingCompany = await findCompanyByNameOrDomain({
        name: validated.entreprise,
        emailDomain,
        websiteUrl: validated.siteEntreprise || `https://${emailDomain}`,
      })

      const company = await upsertCompany(
        {
          existingCompany,
          name: validated.entreprise,
          websiteUrl: validated.siteEntreprise || `https://${emailDomain}`,
        },
        { retry: true },
      )
      companyId = company.id
      jarviUrl = jarviCompanyUrl(company.id)

      const isRecentDuplicate = await findRecentPlanSourcingProject({
        companyId: company.id,
        daysAgo: 30,
      })

      const statusId = process.env.JARVI_PROJECT_STATUS_ID_PLAN_SOURCING
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
        projectId = project.id
        jarviUrl = jarviProjectUrl(project.id)
      }
    } catch (err) {
      console.error('[plan-de-sourcing] Jarvi company/project failed', err)
      sendCriticalAlert('Jarvi company/project failed (Plan de sourcing)', err).catch(() => {})
    }

    // Profile (contact) — créé même si project a échoué tant qu'on a la company.
    // Jarvi auto-merge sur email existant.
    if (companyId) {
      try {
        const profileStatusId = process.env.JARVI_PROFILE_STATUS_ID_PLAN_SOURCING
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
        console.error('[plan-de-sourcing] Profile upsert failed', err)
        sendCriticalAlert('Jarvi Profile upsert failed (Plan de sourcing)', err).catch(() => {})
      }
    }

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

/**
 * Mode différé : rate_limit ou api_failure.
 *
 * **AUCUN appel Jarvi** ici par design — le lead est récupéré uniquement via
 * email interne. Le gérant traite la demande à la main et crée la fiche Jarvi
 * lui-même s'il décide de poursuivre.
 */
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

  // KV save (best-effort — pour audit)
  try {
    await saveDeferred(deferredId, {
      formData: input,
      reason,
      createdAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[plan-de-sourcing] saveDeferred failed (non-blocking)', err)
  }

  // 2 emails Brevo. Pas de jarviUrl puisqu'aucun project n'est créé côté Jarvi.
  await Promise.allSettled([
    sendBrevoPlanSourcingDeferredInterne({
      input,
      deferredId,
      raisonDiffere: raisonLibelle,
      jarviUrl: 'Aucun project Jarvi créé — à traiter manuellement',
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
): string {
  const variable = input.ote - input.fixe
  const ratio = input.ote > 0 ? Math.round((input.fixe / input.ote) * 100) : 100
  const posteAffiche =
    input.posteRecherche === 'Autre' ? input.posteRecherchePrecisionAutre || 'Autre' : input.posteRecherche
  const secteurAffiche =
    input.secteur === 'Autre' ? input.secteurPrecisionAutre || 'Autre' : input.secteur

  const lines: string[] = [
    '## Contact',
    `${input.prenom} ${input.nom}`,
    input.email,
    input.telephone,
    '',
    '## Entreprise',
    input.entreprise,
  ]
  if (input.siteEntreprise) lines.push(input.siteEntreprise)
  lines.push(
    '',
    '## Le poste',
    `**Intitulé** : ${posteAffiche}`,
    `**Séniorité** : ${input.seniorite}`,
    `**Objectif** : ${input.objectifPoste}`,
    `**Localisation** : ${input.localisation}${input.remotePossible ? ' (remote possible)' : ''}`,
    `**Secteur** : ${secteurAffiche}`,
    '',
    '## Package',
    `**Fixe** : ${input.fixe.toLocaleString('fr-FR')} €`,
    `**OTE** : ${input.ote.toLocaleString('fr-FR')} €`,
    `**Variable** : ${variable.toLocaleString('fr-FR')} € (ratio ${ratio}% fixe)`,
  )
  if (input.contenuFichePoste) {
    lines.push(
      '',
      '## Fiche de poste fournie',
      input.contenuFichePoste.slice(0, 1500) +
        (input.contenuFichePoste.length > 1500 ? '\n…(tronqué)' : ''),
    )
  }
  if (isDuplicate) {
    lines.push('', '⚠️ Doublon 30j détecté — cette entreprise a déjà soumis un plan dans le mois.')
  }
  lines.push(
    '',
    '---',
    'Source : Le Lab Mariell — Outil 2 (Plan de sourcing LinkedIn)',
    `Réf plan : ${refId}`,
  )
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
