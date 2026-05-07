// ============================================================
// Jarvi (CRM) — generic helpers + outil 1 specifics
// All calls return null/false in stub mode (no JARVI_API_KEY) so dev works
// without credentials. Real failures escalate to caller for fail-soft.
// ============================================================

export interface JarviCompany {
  id: string
  name?: string
  statusId?: string
  updatedAt?: string
  // Jarvi may nest public data under companyPublicData; keep loose typing
  [key: string]: unknown
}

interface JarviProject {
  id: string
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

// ============================================================
// Outil 1 — Stage / Alternance
// ============================================================

interface FindCompanyParams {
  name: string
  emailDomain: string
  websiteUrl: string
}

/**
 * Search a Company by exact-or-partial name match OR website domain match.
 * Returns the most-recently-updated match, or null.
 * Returns null in stub mode (no JARVI_API_KEY).
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
      { companyPublicData: { name: { _ilike: `%${params.name}%` } } },
      { companyPublicData: { website: { _ilike: `%${websiteDomain}%` } } },
      { companyPublicData: { website: { _ilike: `%${params.emailDomain}%` } } },
    ],
  }

  try {
    const res = await fetch(
      jarviUrl('/companies', { where: JSON.stringify(where), limit: '10' }),
      { headers: jarviHeaders() },
    )
    if (!res.ok) {
      console.warn('[jarvi] findCompany HTTP', res.status)
      return null
    }
    const data = (await res.json()) as { data?: JarviCompany[] }
    if (!data.data || data.data.length === 0) return null

    return [...data.data].sort((a, b) => {
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
 * shows up as "Contact connu" (intended — no false-positive "Client").
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
 * Returns true if there's already a Project on that Company with:
 *   - statusId in JARVI_LAB_ACTIVE_STATUS_IDS (typically Reçue + En traitement)
 *   - custom field "Type de demande Lab" = "Stage/Alternance"
 *
 * Fail-soft: returns false if Jarvi is unreachable (don't penalize the prospect).
 */
export async function hasActiveLabProject(params: HasActiveLabProjectParams): Promise<boolean> {
  if (!hasJarvi()) return false

  const activeStatusIds = (process.env.JARVI_LAB_ACTIVE_STATUS_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const fieldValueIdStageAlt = process.env.JARVI_FIELD_VALUE_STAGE_ALTERNANCE
  if (activeStatusIds.length === 0 || !fieldValueIdStageAlt) {
    console.warn('[jarvi] hasActiveLabProject — env vars missing, allowing submission')
    return false
  }

  const where = {
    companyId: { _eq: params.companyId },
    statusId: { _in: activeStatusIds },
    fieldsValues: { fieldValueId: { _eq: fieldValueIdStageAlt } },
  }

  try {
    const res = await fetch(
      jarviUrl('/projects', { where: JSON.stringify(where), limit: '1' }),
      { headers: jarviHeaders() },
    )
    if (!res.ok) {
      console.warn('[jarvi] hasActiveLabProject HTTP', res.status)
      return false
    }
    const data = (await res.json()) as { data?: JarviProject[] }
    return Array.isArray(data.data) && data.data.length > 0
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

/** If Company exists → return it. Else create it. Retries once on failure. */
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

  const body = { name: params.name, website: params.websiteUrl }

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
    const json = (await res.json()) as { data?: JarviCompany } | JarviCompany
    return ('data' in json && (json as { data?: JarviCompany }).data
      ? (json as { data: JarviCompany }).data
      : (json as JarviCompany))
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
  typeDemandeLabFieldValueId: string
  description: string
}

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

  const body = {
    companyId: params.companyId,
    name: params.name,
    statusId: params.statusId,
    description: params.description,
    fieldsValues: [
      { fieldId, fieldValueId: params.typeDemandeLabFieldValueId },
    ],
  }

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
    const json = (await res.json()) as { data?: { id: string } } | { id: string }
    const id =
      'data' in json && (json as { data?: { id: string } }).data
        ? (json as { data: { id: string } }).data.id
        : (json as { id: string }).id
    return { id }
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

export function jarviProjectUrl(projectId: string): string {
  return `https://app.jarvi.tech/#/projects/${projectId}`
}
export function jarviCompanyUrl(companyId: string): string {
  return `https://app.jarvi.tech/#/companies/${companyId}`
}
