import { d as defineEventHandler, g as getRouterParam, c as createError } from '../../../../nitro/nitro.mjs';
import { g as getPlan } from '../../../../_/plan-storage.mjs';
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
    throw createError({ statusCode: 400, statusMessage: "INVALID_UUID", message: "Identifiant invalide." });
  }
  if (uuid.startsWith("dev-")) {
    return {
      content: `# Plan de sourcing LinkedIn (stub dev)

*Mode d\xE9veloppement \u2014 pas de vrai plan stock\xE9.*`,
      metadata: {
        prenom: "Dev",
        nom: "Stub",
        entreprise: "Stub",
        posteRecherche: "Stub",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  }
  const planData = await getPlan(uuid);
  if (!planData) {
    throw createError({
      statusCode: 404,
      statusMessage: "PLAN_NOT_FOUND",
      message: "Plan introuvable ou expir\xE9 (dur\xE9e de vie : 90 jours)."
    });
  }
  return {
    content: planData.content,
    metadata: planData.metadata
  };
});

export { _uuid__get as default };
//# sourceMappingURL=_uuid_.get.mjs.map
