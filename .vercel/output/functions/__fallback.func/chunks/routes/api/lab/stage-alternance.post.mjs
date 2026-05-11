import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { z } from 'zod';
import { g as getClientIp, v as verifyTurnstile, t as checkStageAlternanceRateLimit, f as findCompanyByNameOrDomain, r as resolveCompanyStatusLabel, w as hasActiveLabProject, u as upsertCompany, j as jarviCompanyUrl, s as sendCriticalAlert, x as createProject, b as jarviProjectUrl, y as sendBrevoStageNotifInterne, z as sendBrevoStageConfirmationProspect } from '../../../_/brevo.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@upstash/redis';

const profilOptions = [
  "SDR / BDR",
  "Business Developer Junior",
  "Account Executive Junior",
  "Sales Ops Junior",
  "Autre"
];
const dateDemarrageOptions = [
  "ASAP",
  "Sous 1 \xE0 2 mois",
  "Sous 3 \xE0 6 mois",
  "Flexible"
];
const stageAlternanceSchema = z.object({
  // --- Bloc Contact ---
  prenom: z.string().trim().min(1, "Ce champ est requis.").max(50),
  nom: z.string().trim().min(1, "Ce champ est requis.").max(50),
  email: z.string().trim().toLowerCase().email("Format d'email invalide."),
  telephone: z.string().trim().min(8, "Num\xE9ro de t\xE9l\xE9phone invalide.").max(20),
  // --- Bloc Entreprise ---
  entreprise: z.string().trim().min(2, "Ce champ est requis.").max(100),
  urlEntreprise: z.string().trim().min(3).max(300).transform((v) => /^https?:\/\//i.test(v) ? v : `https://${v}`).pipe(z.string().url("Lien invalide.")),
  // --- Bloc Besoin ---
  typeContrat: z.enum(["Stage", "Alternance"]),
  profilRecherche: z.enum(profilOptions),
  profilRecherchePrecisionAutre: z.string().trim().max(60).optional(),
  dateDemarrage: z.enum(dateDemarrageOptions),
  localisation: z.string().trim().min(2).max(150),
  briefMission: z.string().trim().min(20, "Brief trop court \u2014 20 caract\xE8res minimum.").max(500, "500 caract\xE8res maximum."),
  // --- Conformité ---
  consentementRgpd: z.literal(true, {
    error: () => "Vous devez accepter la politique de confidentialit\xE9 pour continuer."
  }),
  // --- Anti-bot ---
  company_website: z.string().max(0).optional(),
  // honeypot — must stay empty
  turnstileToken: z.string().min(1)
}).refine(
  (data) => {
    var _a, _b;
    return data.profilRecherche !== "Autre" || ((_b = (_a = data.profilRecherchePrecisionAutre) == null ? void 0 : _a.length) != null ? _b : 0) >= 1;
  },
  {
    message: "Pr\xE9cisez le profil recherch\xE9 (60 caract\xE8res max).",
    path: ["profilRecherchePrecisionAutre"]
  }
);

const PERSONAL_EMAIL_DOMAINS = /* @__PURE__ */ new Set([
  // Internationaux
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.fr",
  "hotmail.co.uk",
  "outlook.com",
  "outlook.fr",
  "yahoo.com",
  "yahoo.fr",
  "yahoo.co.uk",
  "icloud.com",
  "me.com",
  "mac.com",
  "live.com",
  "live.fr",
  "protonmail.com",
  "proton.me",
  "protonmail.ch",
  "gmx.fr",
  "gmx.com",
  "gmx.net",
  "aol.com",
  "aol.fr",
  "yandex.com",
  "yandex.ru",
  "mail.com",
  "tutanota.com",
  // FAI français
  "free.fr",
  "orange.fr",
  "sfr.fr",
  "wanadoo.fr",
  "laposte.net",
  "neuf.fr",
  "bbox.fr",
  "numericable.fr",
  "aliceadsl.fr",
  "voila.fr",
  "club-internet.fr",
  "noos.fr",
  "cegetel.net",
  "9online.fr",
  "tiscali.fr"
]);
function isPersonalEmail(email) {
  const at = email.lastIndexOf("@");
  if (at < 0) return false;
  const domain = email.slice(at + 1).toLowerCase().trim();
  return PERSONAL_EMAIL_DOMAINS.has(domain);
}

const stageAlternance_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const body = await readBody(event);
    let validated;
    try {
      validated = stageAlternanceSchema.parse(body);
    } catch (zodErr) {
      const issues = (zodErr == null ? void 0 : zodErr.issues) || (zodErr == null ? void 0 : zodErr.errors);
      throw createError({
        statusCode: 400,
        statusMessage: "VALIDATION_FAILED",
        message: ((_a = issues == null ? void 0 : issues[0]) == null ? void 0 : _a.message) || "Champs invalides.",
        data: { issues }
      });
    }
    if (validated.company_website && validated.company_website.length > 0) {
      console.warn("[stage-alternance] honeypot triggered", { ip: getClientIp(event) });
      return { success: true, redirectUrl: "/lab/demande-stage-alternance/confirmation" };
    }
    const ip = getClientIp(event);
    const turnstileOk = await verifyTurnstile(validated.turnstileToken, ip);
    if (!turnstileOk) {
      throw createError({
        statusCode: 403,
        statusMessage: "TURNSTILE_FAILED",
        message: "V\xE9rification de s\xE9curit\xE9 \xE9chou\xE9e. Merci de rafra\xEEchir la page et r\xE9essayer."
      });
    }
    if (isPersonalEmail(validated.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: "PERSONAL_EMAIL",
        message: "Cet outil est r\xE9serv\xE9 aux entreprises. Merci d'utiliser votre email professionnel."
      });
    }
    const rateCheck = await checkStageAlternanceRateLimit(ip);
    if (!rateCheck.allowed) {
      throw createError({
        statusCode: 429,
        statusMessage: "RATE_LIMIT",
        message: "Limite de soumissions atteinte. Vous avez d\xE9j\xE0 effectu\xE9 plusieurs demandes r\xE9cemment. Si votre demande est urgente, contactez-nous directement \xE0 bonjour@mariell.fr."
      });
    }
    const emailDomain = validated.email.split("@")[1] || "";
    const existingCompany = await findCompanyByNameOrDomain({
      name: validated.entreprise,
      emailDomain,
      websiteUrl: validated.urlEntreprise
    });
    const companyStatusLabel = resolveCompanyStatusLabel(existingCompany);
    if (existingCompany) {
      const isDuplicate = await hasActiveLabProject({ companyId: existingCompany.id });
      if (isDuplicate) {
        throw createError({
          statusCode: 409,
          statusMessage: "DUPLICATE_REQUEST",
          message: "Une demande est d\xE9j\xE0 en cours pour votre entreprise. Pour toute mise \xE0 jour ou information compl\xE9mentaire, contactez-nous directement \xE0 bonjour@mariell.fr."
        });
      }
    }
    let companyId = null;
    let companyUrl = "Company Jarvi non cr\xE9\xE9e (v\xE9rifier alerte)";
    let projectUrl = "Project Jarvi non cr\xE9\xE9 (v\xE9rifier alerte)";
    try {
      const company = await upsertCompany(
        {
          existingCompany,
          name: validated.entreprise,
          websiteUrl: validated.urlEntreprise
        },
        { retry: true }
      );
      companyId = company.id;
      companyUrl = jarviCompanyUrl(company.id);
    } catch (err) {
      console.error("[stage-alternance] Company upsert failed after retry", err);
      sendCriticalAlert("Jarvi Company upsert failed (Stage/Alternance)", err).catch(() => {
      });
    }
    if (companyId) {
      try {
        const statusId = process.env.JARVI_STATUS_ID_LAB_RECUE;
        if (!statusId) throw new Error("Missing JARVI_STATUS_ID_LAB_RECUE");
        const project = await createProject(
          {
            companyId,
            name: `Lab \u2014 Stage/Alternance \u2014 ${getDisplayProfil(validated)} \u2014 ${formatDateFr(/* @__PURE__ */ new Date())}`,
            statusId,
            typeDemandeLabValue: "Stage/Alternance",
            description: buildProjectDescription(validated)
          },
          { retry: true }
        );
        projectUrl = jarviProjectUrl(project.id);
      } catch (err) {
        console.error("[stage-alternance] Project creation failed after retry", err);
        sendCriticalAlert("Jarvi Project creation failed (Stage/Alternance)", err).catch(() => {
        });
      }
    }
    const dateSoumission = formatDateFr(/* @__PURE__ */ new Date());
    const emailResults = await Promise.allSettled([
      sendBrevoStageNotifInterne({
        input: validated,
        companyStatusLabel,
        projectUrl,
        companyUrl,
        dateSoumission
      }),
      sendBrevoStageConfirmationProspect({ input: validated })
    ]);
    emailResults.forEach((result, idx) => {
      if (result.status === "rejected") {
        const emailType = idx === 0 ? "notif-interne" : "confirmation-prospect";
        console.error(`[stage-alternance] Brevo ${emailType} failed`, result.reason);
        sendCriticalAlert(`Brevo ${emailType} failed (Stage/Alternance)`, result.reason).catch(() => {
        });
      }
    });
    return {
      success: true,
      redirectUrl: "/lab/demande-stage-alternance/confirmation"
    };
  } catch (err) {
    if (err == null ? void 0 : err.statusCode) throw err;
    console.error("[stage-alternance] unexpected error", err);
    sendCriticalAlert("Stage/Alternance route unexpected error", err).catch(() => {
    });
    throw createError({
      statusCode: 500,
      statusMessage: "INTERNAL_ERROR",
      message: "Une erreur technique s'est produite. Votre demande n'a pas pu \xEAtre enregistr\xE9e. Merci de r\xE9essayer dans quelques minutes, ou de nous contacter directement \xE0 bonjour@mariell.fr."
    });
  }
});
function getDisplayProfil(input) {
  return input.profilRecherche === "Autre" ? input.profilRecherchePrecisionAutre || "Profil personnalis\xE9" : input.profilRecherche;
}
function buildProjectDescription(input) {
  return [
    `**Type de contrat** : ${input.typeContrat}`,
    `**Profil recherch\xE9** : ${getDisplayProfil(input)}`,
    `**Date de d\xE9marrage** : ${input.dateDemarrage}`,
    `**Localisation** : ${input.localisation}`,
    "",
    "**Brief de la mission** :",
    input.briefMission,
    "",
    "---",
    `Soumis via Le Lab Mariell \u2014 ${formatDateFr(/* @__PURE__ */ new Date())}`,
    `Contact : ${input.prenom} ${input.nom} \xB7 ${input.email} \xB7 ${input.telephone}`
  ].join("\n");
}
function formatDateFr(d) {
  const fmt = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris"
  });
  return fmt.format(d).replace(",", " \xE0").replace(" h ", "h");
}

export { stageAlternance_post as default };
//# sourceMappingURL=stage-alternance.post.mjs.map
