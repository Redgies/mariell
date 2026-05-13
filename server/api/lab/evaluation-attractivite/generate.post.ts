import { nanoid } from 'nanoid'
import { formulaireOutil3SchemaRefined, type FormulaireOutil3 } from '../../../schemas/outil-3/formulaire'
import { llmOutputJsonSchemaRefined, type LlmOutputJson } from '../../../schemas/outil-3/llm-output-json'
import { verifyTurnstile } from '../../../utils/turnstile'
import { checkEvaluationAttractiviteRateLimit } from '../../../utils/ratelimit'
import { getClientIp } from '../../../utils/request'
import {
  findCompanyByNameOrDomain,
  upsertCompany,
  createEvaluationAttractiviteProject,
  upsertProfile,
  jarviProjectUrl,
  jarviCompanyUrl,
} from '../../../utils/jarvi'
import {
  sendBrevoEvaluationNotifInterneLivree,
  sendBrevoEvaluationNotifInterneDifferee,
  sendBrevoEvaluationConfirmationProspect,
  sendBrevoEvaluationSuiviProspect,
  sendCriticalAlert,
} from '../../../utils/brevo'
import { generateEvaluationWithAnthropic, hasAnthropic } from '../../../utils/anthropic'
import { buildSystemBlocks } from '../../../utils/outil-3/build-system-blocks'
import { buildEvaluationUserPrompt } from '../../../utils/outil-3/build-user-prompt'
import { parseLlmResponse } from '../../../utils/outil-3/parse-llm-response'
import { validateLlmOutput } from '../../../utils/outil-3/validate-output'
import {
  saveEvaluation,
  saveDeferredEvaluation,
  saveEvaluationStatus,
  anonymizeInputs,
} from '../../../utils/evaluation-storage'

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

  await saveEvaluationStatus(requestUuid, { status: 'pending', updatedAt: new Date().toISOString() }).catch((err) => {
    console.error('[evaluation-attractivite] saveEvaluationStatus(pending) failed', err)
  })

  try {
    // ============================================================
    // PHASE 1 — Validations bloquantes
    // ============================================================

    let validated: FormulaireOutil3
    try {
      validated = formulaireOutil3SchemaRefined.parse(body)
    } catch (zodErr: any) {
      const issues = zodErr?.issues || zodErr?.errors
      const message = issues?.[0]?.message || 'Champs invalides.'
      await saveEvaluationStatus(requestUuid, {
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

    // Cloudflare Turnstile
    const turnstileOk = await verifyTurnstile(validated.turnstile_token, ip)
    if (!turnstileOk) {
      const message = 'Vérification de sécurité échouée. Merci de rafraîchir la page et réessayer.'
      await saveEvaluationStatus(requestUuid, {
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
    // PHASE 2 — Rate limit (3/jour, 7/sem) → mode différé si dépassé
    // ============================================================

    const rateCheck = await checkEvaluationAttractiviteRateLimit(ip)
    if (!rateCheck.allowed) {
      console.warn('[evaluation-attractivite] rate limit hit, switching to deferred', rateCheck)
      const deferredResult = await handleDeferredProcessing(validated, 'rate_limit')
      await saveEvaluationStatus(requestUuid, {
        status: 'deferred',
        updatedAt: new Date().toISOString(),
        deferredId: deferredResult.deferredId,
      }).catch(() => {})
      return deferredResult
    }

    // ============================================================
    // PHASE 3 — Génération Anthropic avec retry
    // ============================================================

    if (!hasAnthropic()) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[evaluation-attractivite] ANTHROPIC_API_KEY missing — using stub in dev')
        return await buildStubResponse(validated, requestUuid)
      }
      console.error('[evaluation-attractivite] ANTHROPIC_API_KEY missing in production — switching to deferred')
      const deferredResult = await handleDeferredProcessing(validated, 'api_failure')
      await saveEvaluationStatus(requestUuid, {
        status: 'deferred',
        updatedAt: new Date().toISOString(),
        deferredId: deferredResult.deferredId,
      }).catch(() => {})
      return deferredResult
    }

    const systemBlocks = await buildSystemBlocks()
    const userPrompt = buildEvaluationUserPrompt(validated)

    let llmResult: { content: string; usage: any }
    try {
      llmResult = await generateEvaluationWithAnthropic({
        systemBlocks,
        userPrompt,
        maxTokens: 16000,
        temperature: 0.15,
        maxWebSearches: 3,
        prefill: '{',
      })
    } catch (firstErr) {
      console.warn('[evaluation-attractivite] Anthropic first attempt failed, retrying…', firstErr)
      try {
        llmResult = await generateEvaluationWithAnthropic({
          systemBlocks,
          userPrompt,
          maxTokens: 16000,
          temperature: 0.15,
          maxWebSearches: 3,
        })
      } catch (retryErr) {
        console.error('[evaluation-attractivite] Anthropic retry failed', retryErr)
        sendCriticalAlert('Anthropic API failed twice (Évaluation attractivité)', retryErr).catch(() => {})
        const deferredResult = await handleDeferredProcessing(validated, 'api_failure')
        await saveEvaluationStatus(requestUuid, {
          status: 'deferred',
          updatedAt: new Date().toISOString(),
          deferredId: deferredResult.deferredId,
        }).catch(() => {})
        return deferredResult
      }
    }

    if (!llmResult.content || llmResult.content.length < 200) {
      console.error('[evaluation-attractivite] Anthropic returned suspiciously short content')
      const deferredResult = await handleDeferredProcessing(validated, 'api_failure')
      await saveEvaluationStatus(requestUuid, {
        status: 'deferred',
        updatedAt: new Date().toISOString(),
        deferredId: deferredResult.deferredId,
      }).catch(() => {})
      return deferredResult
    }

    console.log('[evaluation-attractivite] cache stats', {
      cache_creation_tokens: llmResult.usage.cacheCreationTokens,
      cache_read_tokens: llmResult.usage.cacheReadTokens,
      input_tokens: llmResult.usage.inputTokens,
      output_tokens: llmResult.usage.outputTokens,
    })

    // ============================================================
    // PHASE 4 — Parse hybride + validation JSON + filtre output
    // ============================================================

    const parsed = parseLlmResponse(llmResult.content)
    let llmJson: LlmOutputJson | null = null
    let safeMarkdown = ''
    let degraded = false

    if (!parsed.success) {
      console.error('[evaluation-attractivite] Parse failed, fallback degraded', { error: parsed.error })
      safeMarkdown = parsed.markdownFallback || llmResult.content
      degraded = true
    } else {
      const jsonValidation = llmOutputJsonSchemaRefined.safeParse(parsed.data.json)
      if (!jsonValidation.success) {
        console.error('[evaluation-attractivite] JSON schema validation failed', jsonValidation.error)
        safeMarkdown = parsed.data.markdown
        degraded = true
      } else {
        llmJson = jsonValidation.data
        safeMarkdown = parsed.data.markdown
      }

      // Couche 2 sécurité — filtre mots-clés interdits
      const filterResult = validateLlmOutput(safeMarkdown)
      if (!filterResult.safe) {
        console.warn('[evaluation-attractivite] Output filter triggered', { matched: filterResult.matched })
        safeMarkdown = filterResult.sanitized
      }
    }

    // ============================================================
    // PHASE 5 — Persistance KV (BLOQUANT)
    // ============================================================

    const uuid = requestUuid
    try {
      await saveEvaluation(uuid, {
        uuid,
        json: llmJson,
        markdown: safeMarkdown,
        degraded,
        metadata: {
          prenom: validated.prenom,
          nom: validated.nom,
          entreprise: validated.entreprise,
          intitule_poste:
            validated.intitule_poste === 'Autre' && validated.intitule_poste_precision_autre
              ? validated.intitule_poste_precision_autre
              : validated.intitule_poste,
          createdAt: new Date().toISOString(),
        },
        inputs: anonymizeInputs(validated),
      })
    } catch (kvErr) {
      console.error('[evaluation-attractivite] KV save failed', kvErr)
      sendCriticalAlert('KV saveEvaluation failed', kvErr).catch(() => {})
      await saveEvaluationStatus(requestUuid, {
        status: 'error',
        updatedAt: new Date().toISOString(),
        errorCode: 'INTERNAL_ERROR',
        errorMessage: "Une erreur est survenue. Votre évaluation n'a pas pu être enregistrée.",
      }).catch(() => {})
      throw createError({
        statusCode: 500,
        statusMessage: 'INTERNAL_ERROR',
        message: "Une erreur est survenue. Votre évaluation n'a pas pu être enregistrée.",
      })
    }

    // Marque le statut 'done' avant les side effects — le polling peut afficher le résultat.
    await saveEvaluationStatus(requestUuid, {
      status: 'done',
      updatedAt: new Date().toISOString(),
    }).catch((err) => {
      console.error('[evaluation-attractivite] saveEvaluationStatus(done) failed (non-blocking)', err)
    })

    // ============================================================
    // PHASE 6 — Side effects en parallèle
    // ============================================================

    const resultatUrl = `${getSiteUrl()}/lab/evaluation-attractivite/resultat/${uuid}`
    const dateSoumission = formatDateFr(new Date())

    // Jarvi block : company → project → profile.
    let jarviUrl = ''
    let companyId: string | null = null
    let projectId: string | null = null
    try {
      const emailDomain = (validated.email.split('@')[1] || '').toLowerCase()
      const existing = await findCompanyByNameOrDomain({
        name: validated.entreprise,
        emailDomain,
        websiteUrl: validated.site_web || `https://${emailDomain}`,
      })
      const company = await upsertCompany(
        {
          existingCompany: existing,
          name: validated.entreprise,
          websiteUrl: validated.site_web || `https://${emailDomain}`,
          description: buildProjectDescription(validated, uuid, llmJson),
        },
        { retry: true },
      )
      companyId = company.id
      jarviUrl = jarviCompanyUrl(company.id)

      const statusId = process.env.JARVI_PROJECT_STATUS_ID_EVALUATION_ATTRACTIVITE
      if (statusId) {
        const project = await createEvaluationAttractiviteProject(
          {
            companyId: company.id,
            name: `Lab — Évaluation attractivité — ${validated.entreprise} — ${dateSoumission}`,
            statusId,
            description: buildProjectDescription(validated, uuid, llmJson),
          },
          { retry: true },
        )
        projectId = project.id
        jarviUrl = jarviProjectUrl(project.id)
      }
    } catch (err) {
      console.error('[evaluation-attractivite] Jarvi company/project failed', err)
      sendCriticalAlert('Jarvi company/project failed (Évaluation attractivité)', err).catch(() => {})
    }

    // Profile (contact) — auto-merge sur email existant côté Jarvi.
    if (companyId) {
      try {
        const profileStatusId = process.env.JARVI_PROFILE_STATUS_ID_EVALUATION_ATTRACTIVITE
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
        console.error('[evaluation-attractivite] Profile upsert failed', err)
        sendCriticalAlert('Jarvi Profile upsert failed (Évaluation attractivité)', err).catch(() => {})
      }
    }

    const emailResults = await Promise.allSettled([
      sendBrevoEvaluationNotifInterneLivree({
        input: validated,
        uuid,
        resultatUrl,
        jarviUrl: jarviUrl || 'Jarvi non créé (vérifier alerte)',
        json: llmJson,
        dateSoumission,
      }),
      sendBrevoEvaluationConfirmationProspect({
        input: validated,
        resultatUrl,
        json: llmJson,
      }),
    ])

    emailResults.forEach((result, idx) => {
      if (result.status === 'rejected') {
        const emailType = idx === 0 ? 'notif-interne-livrée' : 'confirmation-prospect'
        console.error(`[evaluation-attractivite] Brevo ${emailType} failed`, result.reason)
        sendCriticalAlert(`Brevo ${emailType} failed (Évaluation attractivité)`, result.reason).catch(() => {})
      }
    })

    const duration = Date.now() - startTime
    console.log(`[evaluation-attractivite] Evaluation generated in ${duration}ms — uuid: ${uuid}`)

    return {
      success: true,
      deferred: false,
      uuid,
      json: llmJson,
      markdown: safeMarkdown,
      degraded,
      redirectUrl: `/lab/evaluation-attractivite/resultat/${uuid}`,
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    console.error('[evaluation-attractivite] unexpected error', err)
    sendCriticalAlert('Évaluation attractivité route unexpected error', err).catch(() => {})
    await saveEvaluationStatus(requestUuid, {
      status: 'error',
      updatedAt: new Date().toISOString(),
      errorCode: 'INTERNAL_ERROR',
      errorMessage: "Une erreur technique s'est produite. Merci de réessayer dans quelques minutes.",
    }).catch(() => {})
    throw createError({
      statusCode: 500,
      statusMessage: 'INTERNAL_ERROR',
      message: "Une erreur technique s'est produite. Merci de réessayer dans quelques minutes.",
    })
  }
})

/**
 * Mode différé : rate_limit ou api_failure.
 *
 * **AUCUN appel Jarvi** ici par design — le lead est récupéré uniquement via
 * email interne. Le gérant traite la demande à la main et crée la fiche Jarvi
 * lui-même s'il décide de poursuivre.
 */
async function handleDeferredProcessing(
  input: FormulaireOutil3,
  reason: 'rate_limit' | 'api_failure',
) {
  const deferredId = nanoid(10)
  const dateSoumission = formatDateFr(new Date())
  const raisonLibelle =
    reason === 'rate_limit'
      ? 'Rate limit atteint (3/jour ou 7/semaine par IP)'
      : 'API Anthropic indisponible (2 tentatives échouées)'

  try {
    await saveDeferredEvaluation(deferredId, {
      formData: input,
      reason,
      createdAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[evaluation-attractivite] saveDeferred failed (non-blocking)', err)
  }

  await Promise.allSettled([
    sendBrevoEvaluationNotifInterneDifferee({
      input,
      deferredId,
      raisonDiffere: raisonLibelle,
      jarviUrl: 'Aucun project Jarvi créé — à traiter manuellement',
      dateSoumission,
    }).catch((err) => {
      console.error('[evaluation-attractivite] notif-interne-différée failed', err)
      sendCriticalAlert('Brevo eval notif-interne-différée failed', err).catch(() => {})
    }),
    sendBrevoEvaluationSuiviProspect({ input }).catch((err) => {
      console.error('[evaluation-attractivite] suivi-prospect failed', err)
      sendCriticalAlert('Brevo eval suivi-prospect failed', err).catch(() => {})
    }),
  ])

  return {
    success: true,
    deferred: true,
    deferredId,
    message: 'Votre évaluation sera traitée manuellement sous 24 à 48 heures ouvrées.',
  }
}

function buildProjectDescription(
  input: FormulaireOutil3,
  refId: string,
  json: LlmOutputJson | null,
): string {
  const intituleAffiche =
    input.intitule_poste === 'Autre' && input.intitule_poste_precision_autre
      ? `${input.intitule_poste} (${input.intitule_poste_precision_autre})`
      : input.intitule_poste
  const secteurAffiche =
    input.secteur === 'Autre' && input.secteur_precision_autre
      ? input.secteur_precision_autre
      : input.secteur
  const cycleAffiche =
    input.type_cycle === 'Autre' && input.type_cycle_autre
      ? input.type_cycle_autre
      : input.type_cycle

  const lines: string[] = [
    '## Contact',
    `${input.prenom} ${input.nom}`,
    input.email,
    input.telephone,
    '',
    '## Entreprise',
    input.entreprise,
  ]
  if (input.site_web) lines.push(input.site_web)
  lines.push(
    `**Secteur** : ${secteurAffiche}`,
    `**Localisation** : ${input.localisation}`,
    `**Effectifs** : ${input.effectifs_entreprise}`,
    `**Équipe Sales** : ${input.equipe_sales}`,
    '',
    '## Le poste',
    `**Intitulé** : ${intituleAffiche}`,
    `**Séniorité** : ${input.seniorite}`,
    `**Cycle** : ${cycleAffiche}`,
    `**Modalité** : ${input.modalite_travail}`,
    '',
    '## Package',
    `**Fixe** : ${input.package_fixe.toLocaleString('fr-FR')} €`,
    `**OTE** : ${input.package_ote.toLocaleString('fr-FR')} €`,
    '',
    '## Description missions',
    input.description_missions.slice(0, 1500) +
      (input.description_missions.length > 1500 ? '\n…(tronqué)' : ''),
  )

  if (json) {
    lines.push(
      '',
      '## Verdict LLM',
      `**Niveau** : ${json.niveau_attractivite} (${json.jauge_position}/10)`,
      `**Dimensions** : marque=${json.dimensions.marque} · secteur=${json.dimensions.secteur} · mission=${json.dimensions.mission} · package=${json.dimensions.package}`,
    )
  }

  lines.push(
    '',
    '---',
    "Source : Le Lab Mariell — Outil 3 (Évaluation d'attractivité)",
    `Réf évaluation : ${refId}`,
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

async function buildStubResponse(input: FormulaireOutil3, requestUuid: string) {
  const uuid = requestUuid
  await saveEvaluationStatus(uuid, { status: 'done', updatedAt: new Date().toISOString() }).catch(() => {})
  const intituleAffiche =
    input.intitule_poste === 'Autre' && input.intitule_poste_precision_autre
      ? input.intitule_poste_precision_autre
      : input.intitule_poste

  const stubJson: LlmOutputJson = {
    niveau_attractivite: 'Attractive / alignée',
    niveau_index: 3,
    jauge_position: 6,
    score_interne: 2,
    score_max: 9,
    dimensions: {
      marque: 'Reconnue',
      secteur: 'Stable',
      mission: 'Standard',
      package: 'Aligné',
    },
    alertes: [],
    brief_flou: false,
  }

  const stubMarkdown = `# Évaluation d'attractivité — ${intituleAffiche}

*Préparée par Mariell pour ${input.entreprise}*

---

Bonjour ${input.prenom},

**[STUB DEV — pas d'appel Anthropic réel]**

Configure \`ANTHROPIC_API_KEY\` dans \`.env\` pour générer une vraie évaluation via Claude Haiku 4.5.

## Lecture marque & secteur

Contenu placeholder.

## Lecture mission

Contenu placeholder.

## Lecture package

Contenu placeholder.

## Synthèse & leviers

Contenu placeholder.`

  return {
    success: true,
    deferred: false,
    uuid,
    json: stubJson,
    markdown: stubMarkdown,
    degraded: false,
    redirectUrl: `/lab/evaluation-attractivite/resultat/${uuid}`,
  }
}
