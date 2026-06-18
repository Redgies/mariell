<script setup lang="ts">
import { getArticle } from '~/data/blog'

const route = useRoute()
const slug = route.params.slug as string
const article = getArticle(slug)

if (!article) {
  throw createError({ statusCode: 404, statusMessage: 'Article introuvable' })
}

const config = useRuntimeConfig()
const calendlyUrl = config.public.calendlyUrl as string
</script>

<template>
  <div class="chromatic-mode">
    <article>
      <section class="page-hero">
        <div class="page-hero__inner">
          <Breadcrumb
            :items="[
              { label: 'Blog', to: '/blog' },
              { label: article.title },
            ]"
          />
          <div class="eyebrow-m" style="color:rgba(244,239,227,0.45);margin-bottom:14px;">
            — {{ article.heroLabel }} &middot; {{ article.readingTime }}
          </div>
          <h1 class="h-display h-display--l" style="max-width:920px;">{{ article.title }}.</h1>
        </div>
      </section>

      <section class="section-pad section--paper">
        <div class="container">
          <div class="prose" v-html="article.bodyHtml" />

          <div v-if="article.faq && article.faq.length" class="prose">
            <h2>Questions fréquentes</h2>
            <div v-for="(item, i) in article.faq" :key="i" class="faq-item">
              <h3 v-html="item.q" />
              <p v-html="item.a" />
            </div>
          </div>

          <p v-if="article.related && article.related.length" class="article-related">
            <template v-for="(rel, i) in article.related" :key="rel.to">
              <NuxtLink :to="rel.to">{{ rel.label }}</NuxtLink><template v-if="i < article.related.length - 1">, </template>
            </template>
          </p>

          <div class="cta-strip" style="margin-top:48px;">
            <div class="cta-strip__heading" v-html="article.cta.heading" />
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <a class="btn-pill btn-cyan" :href="calendlyUrl">{{ article.cta.primary }}</a>
              <NuxtLink class="btn-pill btn-ghost" to="/blog">Tous les articles</NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<style scoped>
.faq-item {
  border-top: 1px solid var(--border-on-paper);
  padding: 22px 0;
}

.faq-item h3 {
  font-family: var(--font-text);
  font-weight: 600;
  font-size: 17px;
  margin: 0 0 8px;
  color: var(--fg-on-paper-1);
}

.faq-item p {
  margin: 0;
}

.article-related {
  font-size: 15px;
  color: var(--fg-on-paper-3);
  margin-top: 32px;
}

.article-related a {
  color: var(--moss);
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}

.cta-strip__heading {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 28px;
  letter-spacing: -0.02em;
  line-height: 1.15;
  max-width: 560px;
}

@media (max-width: 560px) {
  .cta-strip__heading {
    font-size: 22px;
  }

  .article-related {
    font-size: 14px;
  }
}
</style>
