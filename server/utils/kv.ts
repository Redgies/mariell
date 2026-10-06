import Redis from 'ioredis'

/**
 * Stockage clé/valeur partagé par les outils du Lab (résultats, statuts,
 * demandes différées, compteurs de rate limit).
 *
 * - `REDIS_URL` défini (ex. base Redis Coolify) → Redis via ioredis.
 * - Sinon → `Map` en mémoire du process (dev local). Vidée à chaque redémarrage.
 */

let redis: Redis | null = null
const memoryStore = new Map<string, { value: unknown; expires: number }>()

function getRedis(): Redis | null {
  const url = process.env.REDIS_URL
  if (!url) return null
  if (!redis) {
    redis = new Redis(url, { maxRetriesPerRequest: 2 })
    redis.on('error', (err) => console.error('[kv] redis error', err.message))
  }
  return redis
}

function memoryGet(key: string) {
  const entry = memoryStore.get(key)
  if (!entry || entry.expires < Date.now()) {
    memoryStore.delete(key)
    return null
  }
  return entry
}

export async function kvSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const r = getRedis()
  if (r) {
    await r.set(key, JSON.stringify(value), 'EX', ttlSeconds)
    return
  }
  memoryStore.set(key, { value, expires: Date.now() + ttlSeconds * 1000 })
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const r = getRedis()
  if (r) {
    const raw = await r.get(key)
    if (!raw) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return raw as unknown as T
    }
  }
  return (memoryGet(key)?.value as T) ?? null
}

/** Incrémente un compteur ; le TTL n'est posé qu'au premier hit. */
export async function kvIncrWithExpire(key: string, ttlSeconds: number): Promise<number> {
  const r = getRedis()
  if (r) {
    const count = await r.incr(key)
    if (count === 1) await r.expire(key, ttlSeconds)
    return count
  }
  const entry = memoryGet(key)
  if (!entry) {
    memoryStore.set(key, { value: 1, expires: Date.now() + ttlSeconds * 1000 })
    return 1
  }
  entry.value = (entry.value as number) + 1
  return entry.value as number
}
