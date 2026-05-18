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

  // Stratégie en cascade : on essaie d'abord la requête full _or, puis fallback
  // sur des requêtes simples si Jarvi 500 (bug serveur observé sur _or avec
  // plusieurs _ilike). Limite à 10 résultats par appel, max 3 appels.
  const queries: Array<Record<string, unknown>> = [
    {
      _or: [
        { name: { _ilike: `%${params.name}%` } },
        { website: { _ilike: `%${websiteDomain}%` } },
        { linkedinUrl: { _ilike: `%${websiteDomain}%` } },
        { website: { _ilike: `%${params.emailDomain}%` } },
      ],
    },
    { name: { _ilike: `%${params.name}%` } },
    { website: { _ilike: `%${websiteDomain}%` } },
  ]

  for (const where of queries) {
    try {
      const res = await fetch(
        jarviUrl('/companies', { where: JSON.stringify(where), limit: '10' }),
        { headers: jarviHeaders() },
      )
      if (!res.ok) {
        console.warn('[jarvi] findCompany HTTP', res.status, '— trying fallback query')
        continue
      }
      const data = (await res.json()) as { companies?: JarviCompany[] }
      if (!data.companies || data.companies.length === 0) continue

      return [...data.companies].sort((a, b) => {
        const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
        const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
        return tb - ta
      })[0] ?? null
    } catch (err) {
      console.error('[jarvi] findCompany threw, trying fallback', err)
    }
  }

  return null
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
  /**
   * Markdown libre stocké dans `Company.description` (Jarvi n'a pas de champ
   * description sur les Projects). Overwrite la description existante si la
   * company existe déjà.
   */
  description?: string
}

/**
 * Returns existing Company (mis à jour avec la nouvelle description si fournie)
 * ou crée une nouvelle company.
 *
 * Note: POST /companies n'a PAS de champ `website`. L'URL part dans :
 *   - `linkedinUrl` si c'est une URL LinkedIn
 *   - dans la description (préfixée "Site web : ...") sinon
 *
 * Si on appelle avec `companyId` (depuis existingCompany.id), Jarvi met à jour
 * la fiche existante. Permet d'overwrite la description avec le brief courant.
 */
export async function upsertCompany(
  params: UpsertCompanyParams,
  options: { retry?: boolean } = {},
): Promise<JarviCompany> {
  if (!hasJarvi()) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[jarvi] stub mode — upsertCompany returns fake id')
      return { id: 'stub-company-' + Date.now(), name: params.name }
    }
    throw new Error('[jarvi] not configured in production')
  }

  const body: Record<string, unknown> = { name: params.name }

  // Si company existante : on update via companyId.
  if (params.existingCompany?.id) {
    body.companyId = params.existingCompany.id
  }

  // LinkedIn URL → champ dédié. Site web autre → préfixé dans la description.
  let descriptionParts: string[] = []
  if (params.websiteUrl) {
    if (isLinkedinUrl(params.websiteUrl)) {
      body.linkedinUrl = params.websiteUrl
    } else {
      descriptionParts.push(`Site web : ${params.websiteUrl}`)
    }
  }
  if (params.description) {
    descriptionParts.push(params.description)
  }
  if (descriptionParts.length > 0) {
    body.description = descriptionParts.join('\n\n')
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

  // Custom field "Brief" sur Project (richtext / long text) — Jarvi n'a pas de
  // champ description natif sur Project, ce custom field reçoit le brief
  // complet du formulaire.
  const briefFieldId = process.env.JARVI_PROJECT_FIELD_ID_BRIEF

  const customFieldsValues: Record<string, string> = {
    [fieldId]: params.typeDemandeLabValue,
  }

  const body: Record<string, unknown> = {
    name: params.name,
    statusId: params.statusId,
    companyId: params.companyId,
    // Visible UNIQUEMENT en CRM. Avec les deux flags à true, Jarvi semble
    // forcer le routing vers ATS et le profile n'apparaît jamais dans
    // /crm/profiles. Quand Mariell démarre le vrai recrutement sur un
    // project, il flip `isMadeForRecruitment` à true côté UI Jarvi.
    isMadeForRecruitment: false,
    isMadeForSales: true,
    customFieldsValues,
  }
  // Custom field "Brief" : passé au top-level du body avec l'UUID comme clé
  // (format Jarvi pour les custom fields long-text), pas dans customFieldsValues.
  if (briefFieldId && params.description) {
    body[briefFieldId] = params.description
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
    const json = (await res.json()) as { projectId?: string; taskId?: string; message?: string }
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
// Profile (contact) — créé après company + project sur chaque outil Lab
// Auto-merge côté Jarvi sur email existant.
// ============================================================

interface UpsertProfileParams {
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
  companyId?: string
  projectId?: string
  /** UUID du statut Profile à appliquer (laisse vide pour le statut par défaut Jarvi) */
  statusId?: string
}

/**
 * POST /rest/v2/profiles.
 *
 * Jarvi auto-merge si l'email existe déjà (cf. doc API : id > externalId >
 * email/LinkedIn). Donc envoyer 2 fois pour le même email = 1 seul Profile,
 * mais avec plusieurs projets associés.
 *
 * Le champ `currentCompanyId` rattache le profil à la fiche Company.
 * Le champ `projectId` le rattache au projet courant.
 */
export async function upsertProfile(
  params: UpsertProfileParams,
  options: { retry?: boolean } = {},
): Promise<{ id: string }> {
  if (!hasJarvi()) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[jarvi] stub mode — upsertProfile returns fake id')
      return { id: 'stub-profile-' + Date.now() }
    }
    throw new Error('[jarvi] not configured in production')
  }

  // Nettoyer le téléphone (Jarvi peut être strict sur les espaces).
  const phoneClean = params.phone.replace(/\s+/g, ' ').trim()

  // Si on a déjà l'UUID de la company, NE PAS envoyer currentCompanyName
  // (évite que Jarvi tente un fuzzy-match en doublon de l'association directe).
  // isTalent/isContact : champs non documentés côté POST mais acceptés (confirmé
  // par dev Jarvi). On force isContact=true / isTalent=false pour que les
  // profils Lab apparaissent dans /crm/profiles et pas dans l'ATS.
  const body: Record<string, unknown> = {
    firstName: params.firstName,
    lastName: params.lastName,
    emailAddresses: params.email,
    phoneNumbers: phoneClean,
    isTalent: false,
    isContact: true,
  }
  if (params.companyId) {
    body.currentCompanyId = params.companyId
  } else {
    body.currentCompanyName = params.companyName
  }
  if (params.projectId) body.projectId = params.projectId
  if (params.statusId) body.statusId = params.statusId

  const doRequest = async (): Promise<{ id: string }> => {
    const res = await fetch(jarviUrl('/profiles'), {
      method: 'POST',
      headers: jarviHeaders(),
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`[jarvi] upsertProfile failed: ${res.status} ${text}`)
    }
    const json = (await res.json()) as { profileId?: string; taskId?: string; message?: string }
    if (!json.profileId) {
      throw new Error(`[jarvi] upsertProfile: no profileId in response: ${JSON.stringify(json)}`)
    }
    return { id: json.profileId }
  }

  try {
    return await doRequest()
  } catch (err) {
    if (options.retry) {
      console.warn('[jarvi] upsertProfile retrying once', err)
      await sleep(500)
      return await doRequest()
    }
    throw err
  }
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
export function jarviProfileUrl(profileId: string): string {
  return `https://app.jarvi.tech/profiles/${profileId}`
}
