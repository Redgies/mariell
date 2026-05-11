import { Redis } from '@upstash/redis'

let redis: Redis | null = null
const memoryStore = new Map<string, { count: number; expires: number }>()

/**
 * Resolve Upstash credentials from either naming convention:
 *   - KV_REST_API_URL / KV_REST_API_TOKEN              (Vercel KV legacy)
 *   - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (Marketplace Upstash)
 */
function kvCreds(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return { url, token }
}

function getRedis(): Redis | null {
  const creds = kvCreds()
  if (!creds) return null
  if (!redis) {
    redis = new Redis({ url: creds.url, token: creds.token })
  }
  return redis
}

/**
 * Increment a counter; set TTL on first hit only.
 * Falls back to in-memory store when Upstash isn't configured (dev convenience).
 */
async function incrWithExpire(key: string, ttlSeconds: number): Promise<number> {
  const r = getRedis()
  if (r) {
    const count = await r.incr(key)
    if (count === 1) await r.expire(key, ttlSeconds)
    return count
  }

  const now = Date.now()
  const entry = memoryStore.get(key)
  if (!entry || entry.expires < now) {
    memoryStore.set(key, { count: 1, expires: now + ttlSeconds * 1000 })
    return 1
  }
  entry.count += 1
  return entry.count
}

function getDayKey(): string {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

function getWeekKey(): string {
  const now = new Date()
  const yearStart = new Date(now.getFullYear(), 0, 1)
  const weekNum = Math.ceil(((now.getTime() - yearStart.getTime()) / 86_400_000 + yearStart.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${weekNum}`
}

interface RateLimitResult {
  allowed: boolean
  dayCount: number
  weekCount: number
}

/** Generic per-IP rate limit, scoped by a tool prefix to avoid cross-tool collisions. */
export async function checkIpRateLimit(
  prefix: string,
  ip: string,
  limits: { perDay: number; perWeek: number },
): Promise<RateLimitResult> {
  const dayKey = `ratelimit:${prefix}:ip:${ip}:day:${getDayKey()}`
  const weekKey = `ratelimit:${prefix}:ip:${ip}:week:${getWeekKey()}`

  const [dayCount, weekCount] = await Promise.all([
    incrWithExpire(dayKey, 86_400),
    incrWithExpire(weekKey, 604_800),
  ])

  const allowed = dayCount <= limits.perDay && weekCount <= limits.perWeek
  return { allowed, dayCount, weekCount }
}

// ---------- Outil 1 — Stage / Alternance ----------

const STAGE_ALT_LIMITS = { perDay: 3, perWeek: 7 }

export async function checkStageAlternanceRateLimit(ip: string) {
  return checkIpRateLimit('stage-alt', ip, STAGE_ALT_LIMITS)
}

// ---------- Outil 2 — Plan de sourcing LinkedIn ----------
//
// 3 niveaux de rate limit (cumulatifs). Si UN seul est dépassé, on bascule
// en mode différé — pas de blocage hard, on capte le lead différemment.

const PLAN_SOURCING_LIMITS = {
  perDay: 3,
  perWeek: 7,
  perMonthEmailDomain: 5,
}

interface PlanSourcingRateResult {
  allowed: boolean
  reason?: 'ip_daily' | 'ip_weekly' | 'domain_monthly'
  dayCount: number
  weekCount: number
  monthDomainCount: number
}

function getMonthKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` // YYYY-MM
}

export async function checkPlanSourcingRateLimit(
  ip: string,
  emailDomain: string,
): Promise<PlanSourcingRateResult> {
  const dayKey = `ratelimit:plan-sourcing:ip:${ip}:day:${new Date().toISOString().slice(0, 10)}`
  const weekKey = `ratelimit:plan-sourcing:ip:${ip}:week:${getWeekKey()}`
  const domainKey = `ratelimit:plan-sourcing:email:${emailDomain.toLowerCase()}:month:${getMonthKey()}`

  const [dayCount, weekCount, monthDomainCount] = await Promise.all([
    incrWithExpire(dayKey, 86_400),
    incrWithExpire(weekKey, 604_800),
    incrWithExpire(domainKey, 30 * 86_400),
  ])

  if (dayCount > PLAN_SOURCING_LIMITS.perDay) {
    return { allowed: false, reason: 'ip_daily', dayCount, weekCount, monthDomainCount }
  }
  if (weekCount > PLAN_SOURCING_LIMITS.perWeek) {
    return { allowed: false, reason: 'ip_weekly', dayCount, weekCount, monthDomainCount }
  }
  if (monthDomainCount > PLAN_SOURCING_LIMITS.perMonthEmailDomain) {
    return { allowed: false, reason: 'domain_monthly', dayCount, weekCount, monthDomainCount }
  }
  return { allowed: true, dayCount, weekCount, monthDomainCount }
}

// ---------- Outil 3 — Évaluation d'attractivité ----------

const EVAL_ATTR_LIMITS = { perDay: 3, perWeek: 7 }

export async function checkEvaluationAttractiviteRateLimit(ip: string) {
  return checkIpRateLimit('eval-attr', ip, EVAL_ATTR_LIMITS)
}
