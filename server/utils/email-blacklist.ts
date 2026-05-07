const PERSONAL_EMAIL_DOMAINS = new Set([
  // Internationaux
  'gmail.com', 'googlemail.com',
  'hotmail.com', 'hotmail.fr', 'hotmail.co.uk',
  'outlook.com', 'outlook.fr',
  'yahoo.com', 'yahoo.fr', 'yahoo.co.uk',
  'icloud.com', 'me.com', 'mac.com',
  'live.com', 'live.fr',
  'protonmail.com', 'proton.me', 'protonmail.ch',
  'gmx.fr', 'gmx.com', 'gmx.net',
  'aol.com', 'aol.fr',
  'yandex.com', 'yandex.ru',
  'mail.com', 'tutanota.com',

  // FAI français
  'free.fr', 'orange.fr', 'sfr.fr', 'wanadoo.fr',
  'laposte.net', 'neuf.fr', 'bbox.fr', 'numericable.fr',
  'aliceadsl.fr', 'voila.fr', 'club-internet.fr',
  'noos.fr', 'cegetel.net', '9online.fr', 'tiscali.fr',
])

export function isPersonalEmail(email: string): boolean {
  const at = email.lastIndexOf('@')
  if (at < 0) return false
  const domain = email.slice(at + 1).toLowerCase().trim()
  return PERSONAL_EMAIL_DOMAINS.has(domain)
}
