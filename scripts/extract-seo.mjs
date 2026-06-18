// Deterministic SEO extractor — reads the Claude Design export HTML pages and
// emits app/data/seo-meta.json keyed by the production path (from each page's
// <link rel="canonical">). Captures title, description, all og:/twitter: metas,
// robots, and the raw JSON-LD blocks VERBATIM. The home ('/') is added from the
// validated brief head (the export home is a JS shell with no head).
//
// Usage: node scripts/extract-seo.mjs /abs/path/to/export/ui_kits/website

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = process.argv[2]
if (!SRC) { console.error('Pass the export website dir'); process.exit(1) }

const grabAll = (re, html) => { const out = []; let m; while ((m = re.exec(html))) out.push(m); return out }
const decode = (s) => s == null ? s : s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#0?39;/g, "'")

function pathFromCanonical(href) {
  try {
    const u = new URL(href)
    let p = u.pathname
    if (p.length > 1) p = p.replace(/\/$/, '')
    return p
  } catch { return null }
}

const files = readdirSync(SRC).filter(f => f.endsWith('.html') && f !== 'homepage-a-chromatic.html')
const map = {}

for (const f of files) {
  const html = readFileSync(join(SRC, f), 'utf-8')
  const head = (html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1]) || html

  const canonical = head.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0]
  const href = canonical?.match(/href=["']([^"']+)["']/i)?.[1]
  const path = href ? pathFromCanonical(href) : null
  if (!path) { console.warn('skip (no canonical):', f); continue }

  const title = decode(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '')
  const description = decode(head.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i)?.[1] || '')

  const metas = []
  for (const m of grabAll(/<meta\s+([^>]+?)\/?>/gi, head)) {
    const tag = m[1]
    const prop = tag.match(/property=["']([^"']+)["']/i)?.[1]
    const name = tag.match(/name=["']([^"']+)["']/i)?.[1]
    const content = decode(tag.match(/content=["']([\s\S]*?)["']/i)?.[1])
    if (content == null) continue
    if (prop && /^og:/i.test(prop)) metas.push({ property: prop, content })
    else if (name && /^twitter:/i.test(name)) metas.push({ name, content })
    else if (name && /^(robots|author|keywords)$/i.test(name)) metas.push({ name, content })
  }

  const jsonld = grabAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, head)
    .map(m => decode(m[1].trim()))
    .filter(Boolean)

  map[path] = { title, description, canonical: href, metas, jsonld, _src: f }
}

// Home — verbatim from the brief (export home is a content-less JS shell).
map['/'] = {
  title: 'Mariell, cabinet de recrutement commercial sélectif.',
  description: 'Cabinet de recrutement commercial sélectif pour start-ups et scale-ups tech. Du SDR au CRO, par approche directe. Mariell recrute les meilleurs profils.',
  canonical: 'https://mariell.fr/',
  metas: [
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://mariell.fr/' },
    { property: 'og:title', content: 'Mariell, cabinet de recrutement commercial sélectif.' },
    { property: 'og:description', content: 'Cabinet de recrutement commercial sélectif pour start-ups et scale-ups tech. Du SDR au CRO, par approche directe.' },
    { property: 'og:image', content: 'https://mariell.fr/og-home.png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'Mariell, cabinet de recrutement commercial sélectif' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: 'https://mariell.fr/og-home.png' },
  ],
  jsonld: [
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Mariell',
      url: 'https://mariell.fr',
      description: 'Cabinet de recrutement commercial sélectif pour start-ups et scale-ups tech. Du SDR au CRO, par approche directe.',
      sameAs: ['https://www.linkedin.com/company/chezmariell'],
    }),
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Mariell',
      url: 'https://mariell.fr',
      inLanguage: 'fr-FR',
    }),
  ],
  _src: 'brief',
}

const outPath = resolve(__dirname, '../app/data/seo-meta.json')
writeFileSync(outPath, JSON.stringify(map, null, 2), 'utf-8')

const keys = Object.keys(map).sort()
console.log(`Extracted ${keys.length} routes →`, outPath)
console.log('Routes:', keys.join(', '))
const noOg = keys.filter(k => !map[k].metas.some(m => m.property === 'og:image'))
console.log(`Pages WITHOUT og:image (${noOg.length}):`, noOg.join(', ') || 'none')
// sample og:image values
const sample = map['/expertises/cro']?.metas.find(m => m.property === 'og:image')?.content
console.log('Sample og:image (/expertises/cro):', sample)
