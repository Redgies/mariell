// ============================================================
// Jarvi (CRM) — generic helpers + outil 1 specifics
//
// Reference: https://api-docs.jarvi.tech/en/
//   POST /companies → returns { companyId, taskId, message }
//   GET  /companies → returns { companies: [...], total: N }
//   POST /projects  → returns { projectId, taskId, message }
//   GET  /projects  → returns { projects: [...], total: N }
//
// All calls return null/false in stub mode (no JARVI_API_KEY) so dev works
// without credentials. Real failures escalate to caller for fail-soft.
// ============================================================

interface JarviCompanyFieldValue {
  fieldId?: string
  value?: string
  title?: string
  [key: string]: unknown
}

export interface JarviCompany {
  id: string
  name?: string
  website?: string
  linkedinUrl?: string
  statusId?: string
  updatedAt?: string
  fieldsValues?: JarviCompanyFieldValue[]
  [key: string]: unknown
}

interface JarviProject {
  id: string
  name?: string
  companyId?: string
  statusId?: string
  fieldsValues?: JarviCompanyFieldValue[]
  [key: string]: unknown
}

function hasJarvi(): boolean {
  return Boolean(process.env.JARVI_API_KEY && process.env.JARVI_API_BASE_URL)
}

function jarviHeaders(): Record<string, string> {
  return {
    'X-API-KEY': process.env.JARVI_API_KEY!,
    'content-type': 'application/json',
    accept: 'application/json',
  }
}

function jarviUrl(path: string, query?: Record<string, string>): string {
  const base = process.env.JARVI_API_BASE_URL!.replace(/\/+$/, '')
  const url = new URL(`${base}${path.startsWith('/') ? path : `/${path}`}`)
  if (query) for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v)
  return url.toString()
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function extractDomain(url: string): string {
  try {
    const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`)
    return u.hostname.replace(/^www\./i, '').toLowerCase()
  } catch {
    return url.toLowerCase()
  }
}

function isLinkedinUrl(url: string): boolean {
  return /linkedin\.com/i.test(url)
}

// ============================================================
// Outil 1 — Stage / Alternance
// ============================================================

interface FindCompanyParams {
  name: string
  emailDomain: string
  websiteUrl: string
}

/**
 * Search a Company by name OR website domain OR LinkedIn URL OR email domain.
 * Returns the most-recently-updated match, or null.
 * Returns null in stub mode.
 */
export async function findCompanyByNameOrDomain(
  params: FindCompanyParams,
): Promise<JarviCompany | null> {
  if (!hasJarvi()) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[jarvi] stub mode — findCompany returns null', params)
    }
    return null
  }

  const websiteDomain = extractDomain(params.websiteUrl)
  const where = {
    _or: [
      { name: { _ilike: `%${params.name}%` } },
      { website: { _ilike: `%${websiteDomain}%` } },
      { linkedinUrl: { _ilike: `%${websiteDomain}%` } },
      { website: { _ilike: `%${params.emailDomain}%` } },
    ],
  }

  try {
    const res = await fetch(
      jarviUrl('/companies', { where: JSON.stringify(where), limit: '10' }),
      { headers: jarviHeaders() },
    )
    if (!res.ok) {
      console.warn('[jarvi] findCompany HTTP', res.status, await res.text().catch(() => ''))
      return null
    }
    const data = (await res.json()) as { companies?: JarviCompany[] }
    if (!data.companies || data.companies.length === 0) return null

    return [...data.companies].sort((a, b) => {
      const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
      const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
      return tb - ta
    })[0] ?? null
  } catch (err) {
    console.error('[jarvi] findCompany threw', err)
    return null
  }
}

/**
 * Resolve the human label shown in the notif email.
 * Fail-soft: if `JARVI_CLIENT_STATUS_IDS` is empty, every existing Company
 * shows up as "Contact connu" (intended).
 */
export function resolveCompanyStatusLabel(company: JarviCompany | null): string {
  if (!company) return 'Nouveau prospect'

  const clientStatusIds = (process.env.JARVI_CLIENT_STATUS_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (clientStatusIds.length > 0 && company.statusId && clientStatusIds.includes(company.statusId)) {
    return 'Client / ancien client'
  }
  return 'Contact connu'
}

interface HasActiveLabProjectParams {
  companyId: string
}

/**
 * True iff there's a Project on that Company with:
 *   - statusId in JARVI_LAB_ACTIVE_STATUS_IDS (typically Reçue + En traitement)
 *   - custom field "Type de demande Lab" = "Stage/Alternance"
 *
 * Status filter via where, custom field filter client-side (relation queries
 * are awkward and small N per Company makes this fine).
 */
export async function hasActiveLabProject(params: HasActiveLabProjectParams): Promise<boolean> {
  if (!hasJarvi()) return false

  const activeStatusIds = (process.env.JARVI_LAB_ACTIVE_STATUS_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const fieldId = process.env.JARVI_FIELD_ID_TYPE_DEMANDE_LAB

  if (activeStatusIds.length === 0) {
    console.warn('[jarvi] hasActiveLabProject — JARVI_LAB_ACTIVE_STATUS_IDS empty, allowing submission')
    return false
  }

  const where = {
    companyId: { _eq: params.companyId },
    statusId: { _in: activeStatusIds },
  }

  try {
    const res = await fetch(
      jarviUrl('/projects', { where: JSON.stringify(where), limit: '20' }),
      { headers: jarviHeaders() },
    )
    if (!res.ok) {
      console.warn('[jarvi] hasActiveLabProject HTTP', res.status)
      return false
    }
    const data = (await res.json()) as { projects?: JarviProject[] }
    if (!data.projects || data.projects.length === 0) return false

    // Without a field id configured, conservative: any active Lab project counts as duplicate
    if (!fieldId) return true

    return data.projects.some((p) => {
      const fv = p.fieldsValues
      if (!Array.isArray(fv)) return false
      return fv.some((v) => v.fieldId === fieldId && (v.value === 'Stage/Alternance' || v.title === 'Stage/Alternance'))
    })
  } catch (err) {
    console.error('[jarvi] hasActiveLabProject threw', err)
    return false
  }
}

interface UpsertCompanyParams {
  existingCompany: JarviCompany | null
  name: string
  websiteUrl: string
}

/**
 * Returns existing Company if found. Else creates one.
 * Jarvi POST /companies is upsert-by-name internally.
 *
 * Note: POST /companies has NO `website` field. The URL goes into:
 *   - `linkedinUrl` if it's a LinkedIn URL
 *   - `description` (prefixed) otherwise — we keep the trace somewhere visible
 */
export async function upsertCompany(
  params: UpsertCompanyParams,
  options: { retry?: boolean } = {},
): Promise<JarviCompany> {
  if (params.existingCompany) return params.existingCompany

  if (!hasJarvi()) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[jarvi] stub mode — upsertCompany returns fake id')
      return { id: 'stub-company-' + Date.now(), name: params.name }
    }
    throw new Error('[jarvi] not configured in production')
  }

  const body: Record<string, unknown> = { name: params.name }
  if (isLinkedinUrl(params.websiteUrl)) {
    body.linkedinUrl = params.websiteUrl
  } else {
    body.description = `Site web : ${params.websiteUrl}`
  }

  const doRequest = async (): Promise<JarviCompany> => {
    const res = await fetch(jarviUrl('/companies'), {
      method: 'POST',
      headers: jarviHeaders(),
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`[jarvi] upsertCompany failed: ${res.status} ${text}`)
    }
    const json = (await res.json()) as { companyId?: string; message?: string }
    if (!json.companyId) {
      throw new Error(`[jarvi] upsertCompany: no companyId in response: ${JSON.stringify(json)}`)
    }
    return { id: json.companyId, name: params.name }
  }

  try {
    return await doRequest()
  } catch (err) {
    if (options.retry) {
      console.warn('[jarvi] upsertCompany retrying once', err)
      await sleep(500)
      return await doRequest()
    }
    throw err
  }
}

interface CreateProjectParams {
  companyId: string
  name: string
  statusId: string
  description: string
  /** Label of the multi-choice value, e.g. "Stage/Alternance" */
  typeDemandeLabValue: string
}

/**
 * POST /projects with the "Type de demande Lab" custom field set.
 * Reads `JARVI_FIELD_ID_TYPE_DEMANDE_LAB` from env to know which field to set.
 *
 * customFieldsValues format per Jarvi docs:
 *   { [fieldId]: "<label string>" }   — multi-choice values pass as text labels
 */
export async function createProject(
  params: CreateProjectParams,
  options: { retry?: boolean } = {},
): Promise<{ id: string }> {
  if (!hasJarvi()) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[jarvi] stub mode — createProject returns fake id')
      return { id: 'stub-project-' + Date.now() }
    }
    throw new Error('[jarvi] not configured in production')
  }

  const fieldId = process.env.JARVI_FIELD_ID_TYPE_DEMANDE_LAB
  if (!fieldId) throw new Error('[jarvi] JARVI_FIELD_ID_TYPE_DEMANDE_LAB missing')

  const body: Record<string, unknown> = {
    name: params.name,
    statusId: params.statusId,
    companyId: params.companyId,
    customFieldsValues: {
      [fieldId]: params.typeDemandeLabValue,
    },
  }
  // Description: Jarvi accepts a description but we found no formal schema for it
  // on POST /projects. Pass through as a generic field — Jarvi will keep or ignore.
  if (params.description) body.description = params.description

  const doRequest = async (): Promise<{ id: string }> => {
    const res = await fetch(jarviUrl('/projects'), {
      method: 'POST',
      headers: jarviHeaders(),
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`[jarvi] createProject failed: ${res.status} ${text}`)
    }
    const json = (await res.json()) as { projectId?: string; message?: string }
    if (!json.projectId) {
      throw new Error(`[jarvi] createProject: no projectId in response: ${JSON.stringify(json)}`)
    }
    return { id: json.projectId }
  }

  try {
    return await doRequest()
  } catch (err) {
    if (options.retry) {
      console.warn('[jarvi] createProject retrying once', err)
      await sleep(500)
      return await doRequest()
    }
    throw err
  }
}

// ============================================================
// Outil 2 — Plan de sourcing LinkedIn
// ============================================================

interface FindRecentPlanSourcingProjectParams {
  companyId: string
  daysAgo?: number
}

/**
 * Returns true if a "Plan de sourcing" Project was created on this Company
 * within the last `daysAgo` days. NON-bloquant — used only to enrich the
 * Jarvi tag (e.g. "Lab — Plan de sourcing — Doublon 30j") so the gérant
 * can spot repeat submissions, but the prospect's submission goes through.
 */
export async function findRecentPlanSourcingProject(
  params: FindRecentPlanSourcingProjectParams,
): Promise<boolean> {
  if (!hasJarvi()) return false

  const fieldId = process.env.JARVI_FIELD_ID_TYPE_DEMANDE_LAB
  if (!fieldId) return false

  const daysAgo = params.daysAgo ?? 30
  const sinceIso = new Date(Date.now() - daysAgo * 86_400_000).toISOString()

  const where = {
    companyId: { _eq: params.companyId },
    createdAt: { _gte: sinceIso },
  }

  try {
    const res = await fetch(
      jarviUrl('/projects', { where: JSON.stringify(where), limit: '20' }),
      { headers: jarviHeaders() },
    )
    if (!res.ok) return false
    const data = (await res.json()) as { projects?: JarviProject[] }
    if (!data.projects || data.projects.length === 0) return false

    return data.projects.some((p) => {
      const fv = p.fieldsValues
      if (!Array.isArray(fv)) return false
      return fv.some((v) => v.fieldId === fieldId && (v.value === 'Plan de sourcing' || v.title === 'Plan de sourcing'))
    })
  } catch (err) {
    console.error('[jarvi] findRecentPlanSourcingProject threw', err)
    return false
  }
}

interface CreatePlanSourcingProjectParams {
  companyId: string
  name: string
  statusId: string
  description: string
}

/**
 * Creates a Project on the Company with custom field
 * "Type de demande Lab" = "Plan de sourcing".
 * Wraps `createProject` with the outil 2 specific value.
 */
export async function createPlanSourcingProject(
  params: CreatePlanSourcingProjectParams,
  options: { retry?: boolean } = {},
): Promise<{ id: string }> {
  return createProject(
    {
      companyId: params.companyId,
      name: params.name,
      statusId: params.statusId,
      description: params.description,
      typeDemandeLabValue: 'Plan de sourcing',
    },
    options,
  )
}

// ============================================================
// Outil 3 — Évaluation d'attractivité
// ============================================================

interface CreateEvaluationAttractiviteProjectParams {
  companyId: string
  name: string
  statusId: string
  description: string
}

/**
 * Creates a Project with custom field "Type de demande Lab" = "Évaluation attractivité".
 */
export async function createEvaluationAttractiviteProject(
  params: CreateEvaluationAttractiviteProjectParams,
  options: { retry?: boolean } = {},
): Promise<{ id: string }> {
  return createProject(
    {
      companyId: params.companyId,
      name: params.name,
      statusId: params.statusId,
      description: params.description,
      typeDemandeLabValue: 'Évaluation attractivité',
    },
    options,
  )
}

// ============================================================
// UI URL builders for email links
// Modern Jarvi UI uses non-hash routing.
// ============================================================
export function jarviProjectUrl(projectId: string): string {
  return `https://app.jarvi.tech/projects/${projectId}`
}
export function jarviCompanyUrl(companyId: string): string {
  return `https://app.jarvi.tech/companies/${companyId}`
}
