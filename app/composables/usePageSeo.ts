import seoMap from '~/data/seo-meta.json'

type SeoMeta = { name?: string; property?: string; content: string }
type SeoEntry = {
  title: string
  description: string
  canonical: string
  metas: SeoMeta[]
  jsonld: string[]
}

const MAP = seoMap as unknown as Record<string, SeoEntry>

function normalizePath(p: string): string {
  const path = (p || '/').split('?')[0].split('#')[0]
  if (path.length > 1 && path.endsWith('/')) return path.replace(/\/+$/, '')
  return path
}

/**
 * Applies the VERBATIM per-route SEO head extracted from the Claude Design
 * export (app/data/seo-meta.json): title, description, canonical, og/twitter,
 * and the raw JSON-LD blocks. Reactive on route changes — invoked once globally
 * in app.vue so every route gets its exact head, rendered in SSR.
 *
 * Routes absent from the map (tool result [uuid], confirmation) fall back to the
 * defaults in nuxt.config — they are noindex anyway.
 */
export function usePageSeo(pathOverride?: string) {
  const route = useRoute()
  const entry = computed<SeoEntry | undefined>(() => MAP[normalizePath(pathOverride ?? route.path)])

  useHead({
    title: () => entry.value?.title ?? undefined,
    link: () => entry.value ? [{ rel: 'canonical', href: entry.value.canonical }] : [],
    meta: () => {
      const e = entry.value
      if (!e) return []
      const list: Record<string, string>[] = []
      if (e.description) list.push({ name: 'description', content: e.description })
      for (const m of e.metas) {
        if (m.property) list.push({ property: m.property, content: m.content })
        else if (m.name) list.push({ name: m.name, content: m.content })
      }
      return list
    },
    script: () => (entry.value?.jsonld ?? []).map((json, i) => ({
      type: 'application/ld+json',
      key: `ld-${i}`,
      innerHTML: json,
    })),
  })
}
