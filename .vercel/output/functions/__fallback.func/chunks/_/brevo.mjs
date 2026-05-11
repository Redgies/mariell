import { Redis } from '@upstash/redis';
import { a as getHeader } from '../nitro/nitro.mjs';

async function verifyTurnstile(token, ip) {
  const secret = process.env.NUXT_TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("[turnstile] secret key missing in production");
    return false;
  }
  if (!token) return false;
  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip) formData.append("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData
    });
    if (!res.ok) {
      console.error("[turnstile] siteverify HTTP", res.status);
      return false;
    }
    const data = await res.json();
    if (!data.success) {
      console.warn("[turnstile] failed", data["error-codes"]);
    }
    return data.success === true;
  } catch (err) {
    console.error("[turnstile] verify threw", err);
    return false;
  }
}

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
  if (!redis) {
    redis = new Redis({ url: creds.url, token: creds.token });
  }
  return redis;
}
async function incrWithExpire(key, ttlSeconds) {
  const r = getRedis();
  if (r) {
    const count = await r.incr(key);
    if (count === 1) await r.expire(key, ttlSeconds);
    return count;
  }
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || entry.expires < now) {
    memoryStore.set(key, { count: 1, expires: now + ttlSeconds * 1e3 });
    return 1;
  }
  entry.count += 1;
  return entry.count;
}
function getDayKey() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function getWeekKey() {
  const now = /* @__PURE__ */ new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now.getTime() - yearStart.getTime()) / 864e5 + yearStart.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNum}`;
}
async function checkIpRateLimit(prefix, ip, limits) {
  const dayKey = `ratelimit:${prefix}:ip:${ip}:day:${getDayKey()}`;
  const weekKey = `ratelimit:${prefix}:ip:${ip}:week:${getWeekKey()}`;
  const [dayCount, weekCount] = await Promise.all([
    incrWithExpire(dayKey, 86400),
    incrWithExpire(weekKey, 604800)
  ]);
  const allowed = dayCount <= limits.perDay && weekCount <= limits.perWeek;
  return { allowed, dayCount, weekCount };
}
const STAGE_ALT_LIMITS = { perDay: 3, perWeek: 7 };
async function checkStageAlternanceRateLimit(ip) {
  return checkIpRateLimit("stage-alt", ip, STAGE_ALT_LIMITS);
}
const PLAN_SOURCING_LIMITS = {
  perDay: 3,
  perWeek: 7,
  perMonthEmailDomain: 5
};
function getMonthKey() {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
async function checkPlanSourcingRateLimit(ip, emailDomain) {
  const dayKey = `ratelimit:plan-sourcing:ip:${ip}:day:${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`;
  const weekKey = `ratelimit:plan-sourcing:ip:${ip}:week:${getWeekKey()}`;
  const domainKey = `ratelimit:plan-sourcing:email:${emailDomain.toLowerCase()}:month:${getMonthKey()}`;
  const [dayCount, weekCount, monthDomainCount] = await Promise.all([
    incrWithExpire(dayKey, 86400),
    incrWithExpire(weekKey, 604800),
    incrWithExpire(domainKey, 30 * 86400)
  ]);
  if (dayCount > PLAN_SOURCING_LIMITS.perDay) {
    return { allowed: false, reason: "ip_daily", dayCount, weekCount, monthDomainCount };
  }
  if (weekCount > PLAN_SOURCING_LIMITS.perWeek) {
    return { allowed: false, reason: "ip_weekly", dayCount, weekCount, monthDomainCount };
  }
  if (monthDomainCount > PLAN_SOURCING_LIMITS.perMonthEmailDomain) {
    return { allowed: false, reason: "domain_monthly", dayCount, weekCount, monthDomainCount };
  }
  return { allowed: true, dayCount, weekCount, monthDomainCount };
}
const EVAL_ATTR_LIMITS = { perDay: 3, perWeek: 7 };
async function checkEvaluationAttractiviteRateLimit(ip) {
  return checkIpRateLimit("eval-attr", ip, EVAL_ATTR_LIMITS);
}

function getClientIp(event) {
  var _a;
  const forwarded = getHeader(event, "x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = getHeader(event, "x-real-ip");
  if (real) return real.trim();
  return ((_a = event.node.req.socket) == null ? void 0 : _a.remoteAddress) || "unknown";
}

function hasJarvi() {
  return Boolean(process.env.JARVI_API_KEY && process.env.JARVI_API_BASE_URL);
}
function jarviHeaders() {
  return {
    "X-API-KEY": process.env.JARVI_API_KEY,
    "content-type": "application/json",
    accept: "application/json"
  };
}
function jarviUrl(path, query) {
  const base = process.env.JARVI_API_BASE_URL.replace(/\/+$/, "");
  const url = new URL(`${base}${path.startsWith("/") ? path : `/${path}`}`);
  if (query) for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
  return url.toString();
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function extractDomain(url) {
  try {
    const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    return u.hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}
function isLinkedinUrl(url) {
  return /linkedin\.com/i.test(url);
}
async function findCompanyByNameOrDomain(params) {
  var _a;
  if (!hasJarvi()) {
    return null;
  }
  const websiteDomain = extractDomain(params.websiteUrl);
  const where = {
    _or: [
      { name: { _ilike: `%${params.name}%` } },
      { website: { _ilike: `%${websiteDomain}%` } },
      { linkedinUrl: { _ilike: `%${websiteDomain}%` } },
      { website: { _ilike: `%${params.emailDomain}%` } }
    ]
  };
  try {
    const res = await fetch(
      jarviUrl("/companies", { where: JSON.stringify(where), limit: "10" }),
      { headers: jarviHeaders() }
    );
    if (!res.ok) {
      console.warn("[jarvi] findCompany HTTP", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = await res.json();
    if (!data.companies || data.companies.length === 0) return null;
    return (_a = [...data.companies].sort((a, b) => {
      const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return tb - ta;
    })[0]) != null ? _a : null;
  } catch (err) {
    console.error("[jarvi] findCompany threw", err);
    return null;
  }
}
function resolveCompanyStatusLabel(company) {
  if (!company) return "Nouveau prospect";
  const clientStatusIds = (process.env.JARVI_CLIENT_STATUS_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (clientStatusIds.length > 0 && company.statusId && clientStatusIds.includes(company.statusId)) {
    return "Client / ancien client";
  }
  return "Contact connu";
}
async function hasActiveLabProject(params) {
  if (!hasJarvi()) return false;
  const activeStatusIds = (process.env.JARVI_LAB_ACTIVE_STATUS_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const fieldId = process.env.JARVI_FIELD_ID_TYPE_DEMANDE_LAB;
  if (activeStatusIds.length === 0) {
    console.warn("[jarvi] hasActiveLabProject \u2014 JARVI_LAB_ACTIVE_STATUS_IDS empty, allowing submission");
    return false;
  }
  const where = {
    companyId: { _eq: params.companyId },
    statusId: { _in: activeStatusIds }
  };
  try {
    const res = await fetch(
      jarviUrl("/projects", { where: JSON.stringify(where), limit: "20" }),
      { headers: jarviHeaders() }
    );
    if (!res.ok) {
      console.warn("[jarvi] hasActiveLabProject HTTP", res.status);
      return false;
    }
    const data = await res.json();
    if (!data.projects || data.projects.length === 0) return false;
    if (!fieldId) return true;
    return data.projects.some((p) => {
      const fv = p.fieldsValues;
      if (!Array.isArray(fv)) return false;
      return fv.some((v) => v.fieldId === fieldId && (v.value === "Stage/Alternance" || v.title === "Stage/Alternance"));
    });
  } catch (err) {
    console.error("[jarvi] hasActiveLabProject threw", err);
    return false;
  }
}
async function upsertCompany(params, options = {}) {
  if (params.existingCompany) return params.existingCompany;
  if (!hasJarvi()) {
    throw new Error("[jarvi] not configured in production");
  }
  const body = { name: params.name };
  if (isLinkedinUrl(params.websiteUrl)) {
    body.linkedinUrl = params.websiteUrl;
  } else {
    body.description = `Site web : ${params.websiteUrl}`;
  }
  const doRequest = async () => {
    const res = await fetch(jarviUrl("/companies"), {
      method: "POST",
      headers: jarviHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`[jarvi] upsertCompany failed: ${res.status} ${text}`);
    }
    const json = await res.json();
    if (!json.companyId) {
      throw new Error(`[jarvi] upsertCompany: no companyId in response: ${JSON.stringify(json)}`);
    }
    return { id: json.companyId, name: params.name };
  };
  try {
    return await doRequest();
  } catch (err) {
    if (options.retry) {
      console.warn("[jarvi] upsertCompany retrying once", err);
      await sleep(500);
      return await doRequest();
    }
    throw err;
  }
}
async function createProject(params, options = {}) {
  if (!hasJarvi()) {
    throw new Error("[jarvi] not configured in production");
  }
  const fieldId = process.env.JARVI_FIELD_ID_TYPE_DEMANDE_LAB;
  if (!fieldId) throw new Error("[jarvi] JARVI_FIELD_ID_TYPE_DEMANDE_LAB missing");
  const body = {
    name: params.name,
    statusId: params.statusId,
    companyId: params.companyId,
    customFieldsValues: {
      [fieldId]: params.typeDemandeLabValue
    }
  };
  if (params.description) body.description = params.description;
  const doRequest = async () => {
    const res = await fetch(jarviUrl("/projects"), {
      method: "POST",
      headers: jarviHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`[jarvi] createProject failed: ${res.status} ${text}`);
    }
    const json = await res.json();
    if (!json.projectId) {
      throw new Error(`[jarvi] createProject: no projectId in response: ${JSON.stringify(json)}`);
    }
    return { id: json.projectId };
  };
  try {
    return await doRequest();
  } catch (err) {
    if (options.retry) {
      console.warn("[jarvi] createProject retrying once", err);
      await sleep(500);
      return await doRequest();
    }
    throw err;
  }
}
async function findRecentPlanSourcingProject(params) {
  var _a;
  if (!hasJarvi()) return false;
  const fieldId = process.env.JARVI_FIELD_ID_TYPE_DEMANDE_LAB;
  if (!fieldId) return false;
  const daysAgo = (_a = params.daysAgo) != null ? _a : 30;
  const sinceIso = new Date(Date.now() - daysAgo * 864e5).toISOString();
  const where = {
    companyId: { _eq: params.companyId },
    createdAt: { _gte: sinceIso }
  };
  try {
    const res = await fetch(
      jarviUrl("/projects", { where: JSON.stringify(where), limit: "20" }),
      { headers: jarviHeaders() }
    );
    if (!res.ok) return false;
    const data = await res.json();
    if (!data.projects || data.projects.length === 0) return false;
    return data.projects.some((p) => {
      const fv = p.fieldsValues;
      if (!Array.isArray(fv)) return false;
      return fv.some((v) => v.fieldId === fieldId && (v.value === "Plan de sourcing" || v.title === "Plan de sourcing"));
    });
  } catch (err) {
    console.error("[jarvi] findRecentPlanSourcingProject threw", err);
    return false;
  }
}
async function createPlanSourcingProject(params, options = {}) {
  return createProject(
    {
      companyId: params.companyId,
      name: params.name,
      statusId: params.statusId,
      description: params.description,
      typeDemandeLabValue: "Plan de sourcing"
    },
    options
  );
}
async function createEvaluationAttractiviteProject(params, options = {}) {
  return createProject(
    {
      companyId: params.companyId,
      name: params.name,
      statusId: params.statusId,
      description: params.description,
      typeDemandeLabValue: "\xC9valuation attractivit\xE9"
    },
    options
  );
}
function jarviProjectUrl(projectId) {
  return `https://app.jarvi.tech/projects/${projectId}`;
}
function jarviCompanyUrl(companyId) {
  return `https://app.jarvi.tech/companies/${companyId}`;
}

const BREVO_API_BASE = "https://api.brevo.com/v3";
function hasBrevo() {
  return Boolean(process.env.BREVO_API_KEY);
}
async function sendBrevoEmail(opts) {
  if (!hasBrevo()) {
    console.warn("[brevo] BREVO_API_KEY missing \u2014 logging instead of sending", {
      templateId: opts.templateId,
      to: opts.to,
      params: opts.params
    });
    return { messageId: "dev-stub" };
  }
  if (!Number.isFinite(opts.templateId) || opts.templateId <= 0) {
    throw new Error(`[brevo] invalid templateId: ${opts.templateId}`);
  }
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!senderEmail) throw new Error("[brevo] BREVO_SENDER_EMAIL missing");
  const body = {
    sender: { email: senderEmail, name: "Mariell" },
    to: opts.to,
    templateId: opts.templateId,
    params: opts.params || {},
    ...opts.replyTo ? { replyTo: opts.replyTo } : {}
  };
  const res = await fetch(`${BREVO_API_BASE}/smtp/email`, {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[brevo] send failed: ${res.status} ${text}`);
  }
  return await res.json();
}
async function sendCriticalAlert(subject, error) {
  var _a;
  if (!hasBrevo()) {
    console.error("[brevo] CRITICAL ALERT (logged only \u2014 Brevo not configured):", subject, error);
    return;
  }
  const recipient = process.env.BREVO_ALERT_RECIPIENT || process.env.BREVO_NOTIF_RECIPIENT;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!recipient || !senderEmail) {
    console.error("[brevo] cannot send alert \u2014 missing BREVO_ALERT_RECIPIENT or BREVO_SENDER_EMAIL", subject, error);
    return;
  }
  const errMsg = error instanceof Error ? `${error.message}
${(_a = error.stack) != null ? _a : ""}` : String(error);
  const html = `<pre style="font-family: ui-monospace, monospace; font-size: 13px; white-space: pre-wrap;">${escapeHtml(errMsg)}</pre>`;
  try {
    await fetch(`${BREVO_API_BASE}/smtp/email`, {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: "Mariell \xB7 Lab \u2014 alerte technique" },
        to: [{ email: recipient }],
        subject: `[Lab Mariell \xB7 ALERTE] ${subject}`,
        htmlContent: html
      })
    });
  } catch (err) {
    console.error("[brevo] critical alert itself failed to send", err);
  }
}
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
async function sendBrevoStageNotifInterne(args) {
  const { input } = args;
  const profilDisplay = input.profilRecherche === "Autre" ? input.profilRecherchePrecisionAutre || "Profil personnalis\xE9" : input.profilRecherche;
  const recipient = process.env.BREVO_NOTIF_RECIPIENT;
  if (!recipient) {
    throw new Error("[brevo] BREVO_NOTIF_RECIPIENT missing");
  }
  const templateId = parseInt(process.env.BREVO_TEMPLATE_ID_STAGE_NOTIF_INTERNE || "0", 10);
  return sendBrevoEmail({
    templateId,
    to: [{ email: recipient }],
    replyTo: { email: input.email, name: `${input.prenom} ${input.nom}` },
    params: {
      DATE_SOUMISSION: args.dateSoumission,
      COMPANY_STATUS_LABEL: args.companyStatusLabel,
      PRENOM_NOM: `${input.prenom} ${input.nom}`,
      EMAIL: input.email,
      TELEPHONE: input.telephone,
      ENTREPRISE: input.entreprise,
      URL_ENTREPRISE: input.urlEntreprise,
      TYPE_CONTRAT: input.typeContrat,
      PROFIL_RECHERCHE: profilDisplay,
      DATE_DEMARRAGE: input.dateDemarrage,
      LOCALISATION: input.localisation,
      BRIEF_MISSION: input.briefMission,
      URL_JARVI_PROJECT: args.projectUrl,
      URL_JARVI_COMPANY: args.companyUrl
    }
  });
}
async function sendBrevoStageConfirmationProspect(args) {
  const { input } = args;
  const templateId = parseInt(process.env.BREVO_TEMPLATE_ID_STAGE_CONFIRMATION_PROSPECT || "0", 10);
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || "https://mariell.fr";
  return sendBrevoEmail({
    templateId,
    to: [{ email: input.email, name: `${input.prenom} ${input.nom}` }],
    params: {
      PRENOM: input.prenom,
      TYPE_CONTRAT_LOWER: input.typeContrat.toLowerCase(),
      ENTREPRISE: input.entreprise,
      URL_LAB: `${siteUrl.replace(/\/+$/, "")}/lab`
    }
  });
}
function formatPackage(fixe, ote) {
  const variable = ote - fixe;
  const ratio = ote > 0 ? Math.round(fixe / ote * 100) : 100;
  return {
    fixe: `${fixe.toLocaleString("fr-FR")} \u20AC`,
    ote: `${ote.toLocaleString("fr-FR")} \u20AC`,
    variable: `${variable.toLocaleString("fr-FR")} \u20AC`,
    ratio: `${ratio}% fixe / ${100 - ratio}% variable`
  };
}
function buildPlanSourcingInternalParams(input) {
  const pkg = formatPackage(input.fixe, input.ote);
  return {
    PRENOM: input.prenom,
    NOM: input.nom,
    EMAIL: input.email,
    TELEPHONE: input.telephone,
    ENTREPRISE: input.entreprise,
    POSTE_RECHERCHE: input.posteRecherche === "Autre" ? input.posteRecherchePrecisionAutre || "Autre" : input.posteRecherche,
    SENIORITE: input.seniorite,
    OBJECTIF_POSTE: input.objectifPoste,
    LOCALISATION: input.localisation,
    REMOTE_POSSIBLE: input.remotePossible ? "Oui" : "Non",
    SECTEUR: input.secteur === "Autre" ? input.secteurPrecisionAutre || "Autre" : input.secteur,
    PACKAGE_FIXE: pkg.fixe,
    PACKAGE_OTE: pkg.ote,
    PACKAGE_VARIABLE: pkg.variable,
    PACKAGE_RATIO: pkg.ratio,
    SITE_ENTREPRISE: input.siteEntreprise || "Non fourni",
    FICHE_POSTE_FOURNIE: input.contenuFichePoste ? `Oui \u2014 extrait : "${input.contenuFichePoste.slice(0, 200)}..."` : "Non fournie"
  };
}
async function sendBrevoPlanSourcingNotifInterne(args) {
  const recipient = process.env.BREVO_NOTIF_RECIPIENT;
  if (!recipient) {
    throw new Error("[brevo] BREVO_NOTIF_RECIPIENT missing");
  }
  const templateId = parseInt(process.env.BREVO_TEMPLATE_ID_PLAN_SOURCING_NOTIF_INTERNE || "0", 10);
  return sendBrevoEmail({
    templateId,
    to: [{ email: recipient }],
    replyTo: { email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` },
    params: {
      DATE_SOUMISSION: args.dateSoumission,
      ...buildPlanSourcingInternalParams(args.input),
      URL_PLAN: args.planUrl,
      URL_JARVI: args.jarviUrl,
      PLAN_UUID: args.planUuid
    }
  });
}
async function sendBrevoPlanSourcingLivraisonProspect(args) {
  const templateId = parseInt(process.env.BREVO_TEMPLATE_ID_PLAN_SOURCING_LIVRAISON_PROSPECT || "0", 10);
  const calendlyUrl = process.env.NUXT_PUBLIC_CALENDLY_URL || "#";
  const posteAffiche = args.input.posteRecherche === "Autre" ? args.input.posteRecherchePrecisionAutre || "Autre" : args.input.posteRecherche;
  return sendBrevoEmail({
    templateId,
    to: [{ email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` }],
    params: {
      PRENOM: args.input.prenom,
      POSTE_RECHERCHE: posteAffiche,
      ENTREPRISE: args.input.entreprise,
      URL_PLAN: args.planUrl,
      URL_CALENDLY: calendlyUrl
    }
  });
}
async function sendBrevoPlanSourcingDeferredInterne(args) {
  const recipient = process.env.BREVO_NOTIF_RECIPIENT;
  if (!recipient) {
    throw new Error("[brevo] BREVO_NOTIF_RECIPIENT missing");
  }
  const templateId = parseInt(process.env.BREVO_TEMPLATE_ID_PLAN_SOURCING_DEFERRED_INTERNE || "0", 10);
  return sendBrevoEmail({
    templateId,
    to: [{ email: recipient }],
    replyTo: { email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` },
    params: {
      DATE_SOUMISSION: args.dateSoumission,
      RAISON_DIFFERE: args.raisonDiffere,
      DEFERRED_ID: args.deferredId,
      ...buildPlanSourcingInternalParams(args.input),
      URL_JARVI: args.jarviUrl
    }
  });
}
async function sendBrevoPlanSourcingDeferredProspect(args) {
  const templateId = parseInt(process.env.BREVO_TEMPLATE_ID_PLAN_SOURCING_DEFERRED_PROSPECT || "0", 10);
  const calendlyUrl = process.env.NUXT_PUBLIC_CALENDLY_URL || "#";
  const posteAffiche = args.input.posteRecherche === "Autre" ? args.input.posteRecherchePrecisionAutre || "Autre" : args.input.posteRecherche;
  return sendBrevoEmail({
    templateId,
    to: [{ email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` }],
    params: {
      PRENOM: args.input.prenom,
      POSTE_RECHERCHE: posteAffiche,
      URL_CALENDLY: calendlyUrl
    }
  });
}
function buildEvaluationInternalParams(input, json) {
  var _a, _b, _c, _d, _e;
  const intituleAffiche = input.intitule_poste === "Autre" && input.intitule_poste_precision_autre ? `${input.intitule_poste} (${input.intitule_poste_precision_autre})` : input.intitule_poste;
  const secteurAffiche = input.secteur === "Autre" && input.secteur_precision_autre ? `${input.secteur} (${input.secteur_precision_autre})` : input.secteur;
  return {
    PRENOM: input.prenom,
    NOM: input.nom,
    EMAIL: input.email,
    TELEPHONE: input.telephone,
    ENTREPRISE: input.entreprise,
    SITE_WEB: input.site_web || "Non fourni",
    SECTEUR: secteurAffiche,
    LOCALISATION: input.localisation,
    EFFECTIFS: input.effectifs_entreprise,
    EQUIPE_SALES: input.equipe_sales,
    INTITULE_POSTE: intituleAffiche,
    SENIORITE: input.seniorite,
    TYPE_CYCLE: input.type_cycle === "Autre" && input.type_cycle_autre ? `${input.type_cycle} (${input.type_cycle_autre})` : input.type_cycle,
    MODALITE_TRAVAIL: input.modalite_travail,
    DESCRIPTION_MISSIONS: input.description_missions.slice(0, 500),
    PACKAGE_FIXE: `${input.package_fixe.toLocaleString("fr-FR")} \u20AC`,
    PACKAGE_OTE: `${input.package_ote.toLocaleString("fr-FR")} \u20AC`,
    NIVEAU_ATTRACTIVITE: (json == null ? void 0 : json.niveau_attractivite) || "En cours d'\xE9valuation",
    JAUGE_POSITION: ((_a = json == null ? void 0 : json.jauge_position) == null ? void 0 : _a.toString()) || "\u2014",
    DIMENSIONS_MARQUE: ((_b = json == null ? void 0 : json.dimensions) == null ? void 0 : _b.marque) || "\u2014",
    DIMENSIONS_SECTEUR: ((_c = json == null ? void 0 : json.dimensions) == null ? void 0 : _c.secteur) || "\u2014",
    DIMENSIONS_MISSION: ((_d = json == null ? void 0 : json.dimensions) == null ? void 0 : _d.mission) || "\u2014",
    DIMENSIONS_PACKAGE: ((_e = json == null ? void 0 : json.dimensions) == null ? void 0 : _e.package) || "\u2014",
    BRIEF_FLOU: (json == null ? void 0 : json.brief_flou) ? "Oui" : "Non"
  };
}
async function sendBrevoEvaluationNotifInterneLivree(args) {
  const recipient = process.env.BREVO_NOTIF_RECIPIENT;
  if (!recipient) {
    throw new Error("[brevo] BREVO_NOTIF_RECIPIENT missing");
  }
  const templateId = parseInt(
    process.env.BREVO_TEMPLATE_ID_EVALUATION_ATTRACTIVITE_NOTIF_INTERNE_LIVREE || "0",
    10
  );
  return sendBrevoEmail({
    templateId,
    to: [{ email: recipient }],
    replyTo: { email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` },
    params: {
      DATE_SOUMISSION: args.dateSoumission,
      ...buildEvaluationInternalParams(args.input, args.json),
      URL_RESULTAT: args.resultatUrl,
      URL_JARVI: args.jarviUrl,
      EVAL_UUID: args.uuid
    }
  });
}
async function sendBrevoEvaluationNotifInterneDifferee(args) {
  const recipient = process.env.BREVO_NOTIF_RECIPIENT;
  if (!recipient) {
    throw new Error("[brevo] BREVO_NOTIF_RECIPIENT missing");
  }
  const templateId = parseInt(
    process.env.BREVO_TEMPLATE_ID_EVALUATION_ATTRACTIVITE_NOTIF_INTERNE_DIFFEREE || "0",
    10
  );
  return sendBrevoEmail({
    templateId,
    to: [{ email: recipient }],
    replyTo: { email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` },
    params: {
      DATE_SOUMISSION: args.dateSoumission,
      RAISON_DIFFERE: args.raisonDiffere,
      DEFERRED_ID: args.deferredId,
      ...buildEvaluationInternalParams(args.input, null),
      URL_JARVI: args.jarviUrl
    }
  });
}
async function sendBrevoEvaluationConfirmationProspect(args) {
  var _a;
  const templateId = parseInt(
    process.env.BREVO_TEMPLATE_ID_EVALUATION_ATTRACTIVITE_CONFIRMATION_PROSPECT || "0",
    10
  );
  const calendlyUrl = process.env.NUXT_PUBLIC_CALENDLY_URL || "#";
  const intituleAffiche = args.input.intitule_poste === "Autre" && args.input.intitule_poste_precision_autre ? args.input.intitule_poste_precision_autre : args.input.intitule_poste;
  return sendBrevoEmail({
    templateId,
    to: [{ email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` }],
    params: {
      PRENOM: args.input.prenom,
      INTITULE_POSTE: intituleAffiche,
      ENTREPRISE: args.input.entreprise,
      NIVEAU_ATTRACTIVITE: ((_a = args.json) == null ? void 0 : _a.niveau_attractivite) || "",
      URL_RESULTAT: args.resultatUrl,
      URL_CALENDLY: calendlyUrl
    }
  });
}
async function sendBrevoEvaluationSuiviProspect(args) {
  const templateId = parseInt(
    process.env.BREVO_TEMPLATE_ID_EVALUATION_ATTRACTIVITE_SUIVI_PROSPECT || "0",
    10
  );
  const calendlyUrl = process.env.NUXT_PUBLIC_CALENDLY_URL || "#";
  return sendBrevoEmail({
    templateId,
    to: [{ email: args.input.email, name: `${args.input.prenom} ${args.input.nom}` }],
    params: {
      PRENOM: args.input.prenom,
      ENTREPRISE: args.input.entreprise,
      URL_CALENDLY: calendlyUrl
    }
  });
}

export { createEvaluationAttractiviteProject as a, jarviProjectUrl as b, checkEvaluationAttractiviteRateLimit as c, sendBrevoEvaluationNotifInterneLivree as d, sendBrevoEvaluationConfirmationProspect as e, findCompanyByNameOrDomain as f, getClientIp as g, sendBrevoEvaluationNotifInterneDifferee as h, sendBrevoEvaluationSuiviProspect as i, jarviCompanyUrl as j, checkPlanSourcingRateLimit as k, findRecentPlanSourcingProject as l, createPlanSourcingProject as m, sendBrevoPlanSourcingNotifInterne as n, sendBrevoPlanSourcingLivraisonProspect as o, sendBrevoPlanSourcingDeferredInterne as p, sendBrevoPlanSourcingDeferredProspect as q, resolveCompanyStatusLabel as r, sendCriticalAlert as s, checkStageAlternanceRateLimit as t, upsertCompany as u, verifyTurnstile as v, hasActiveLabProject as w, createProject as x, sendBrevoStageNotifInterne as y, sendBrevoStageConfirmationProspect as z };
//# sourceMappingURL=brevo.mjs.map
