import { Redis } from '@upstash/redis';

let redis = null;
const memoryStore = /* @__PURE__ */ new Map();
function kvCreds() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}
function getRedis() {
  const creds = kvCreds();
  if (!creds) return null;
  if (!redis) redis = new Redis({ url: creds.url, token: creds.token });
  return redis;
}
async function kvSet(key, value, ttlSeconds) {
  const r = getRedis();
  if (r) {
    await r.set(key, JSON.stringify(value), { ex: ttlSeconds });
    return;
  }
  memoryStore.set(key, { value, expires: Date.now() + ttlSeconds * 1e3 });
}
async function kvGet(key) {
  const r = getRedis();
  if (r) {
    const raw = await r.get(key);
    if (!raw) return null;
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    }
    return raw;
  }
  const entry = memoryStore.get(key);
  if (!entry || entry.expires < Date.now()) {
    memoryStore.delete(key);
    return null;
  }
  return entry.value;
}
const PLAN_TTL_SECONDS = 90 * 86400;
async function savePlan(uuid, record) {
  await kvSet(`plan:${uuid}`, record, PLAN_TTL_SECONDS);
}
async function getPlan(uuid) {
  return kvGet(`plan:${uuid}`);
}
const DEFERRED_TTL_SECONDS = 7 * 86400;
async function saveDeferred(deferredId, record) {
  await kvSet(`deferred:${deferredId}`, record, DEFERRED_TTL_SECONDS);
}

export { saveDeferred as a, getPlan as g, savePlan as s };
//# sourceMappingURL=plan-storage.mjs.map
