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
const EVAL_TTL_SECONDS = 90 * 86400;
async function saveEvaluation(uuid, record) {
  await kvSet(`eval:${uuid}`, record, EVAL_TTL_SECONDS);
}
async function getEvaluation(uuid) {
  return kvGet(`eval:${uuid}`);
}
const DEFERRED_TTL_SECONDS = 7 * 86400;
async function saveDeferredEvaluation(deferredId, record) {
  await kvSet(`eval-deferred:${deferredId}`, record, DEFERRED_TTL_SECONDS);
}
function anonymizeInputs(input) {
  return {
    secteur: input.secteur === "Autre" && input.secteur_precision_autre ? `${input.secteur} (${input.secteur_precision_autre})` : input.secteur,
    seniorite: input.seniorite,
    type_cycle: input.type_cycle === "Autre" && input.type_cycle_autre ? `${input.type_cycle} (${input.type_cycle_autre})` : input.type_cycle,
    modalite_travail: input.modalite_travail,
    package_fixe: input.package_fixe,
    package_ote: input.package_ote
  };
}

export { anonymizeInputs as a, saveDeferredEvaluation as b, getEvaluation as g, saveEvaluation as s };
//# sourceMappingURL=evaluation-storage.mjs.map
