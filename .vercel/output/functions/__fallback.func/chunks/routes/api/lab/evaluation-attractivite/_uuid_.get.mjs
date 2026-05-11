import { d as defineEventHandler, g as getRouterParam, c as createError } from '../../../../nitro/nitro.mjs';
import { g as getEvaluation } from '../../../../_/evaluation-storage.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@upstash/redis';

const _uuid__get = defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, "uuid");
  if (!uuid || !/^[a-zA-Z0-9_-]{1,16}$/.test(uuid)) {
    throw createError({
      statusCode: 400,
      statusMessage: "INVALID_UUID",
      message: "Identifiant invalide."
    });
  }
  if (uuid.startsWith("dev-")) {
    return {
      uuid,
      json: null,
      markdown: `# \xC9valuation d'attractivit\xE9 (stub dev)

*Mode d\xE9veloppement \u2014 pas de vraie \xE9valuation stock\xE9e.*`,
      degraded: false,
      metadata: {
        prenom: "Dev",
        nom: "Stub",
        entreprise: "Stub",
        intitule_poste: "Stub",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  }
  const data = await getEvaluation(uuid);
  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: "EVALUATION_NOT_FOUND",
      message: "\xC9valuation introuvable ou expir\xE9e (dur\xE9e de vie : 90 jours)."
    });
  }
  return {
    uuid: data.uuid,
    json: data.json,
    markdown: data.markdown,
    degraded: data.degraded || false,
    metadata: data.metadata
  };
});

export { _uuid__get as default };
//# sourceMappingURL=_uuid_.get.mjs.map
