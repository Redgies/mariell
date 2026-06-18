<script setup lang="ts">
import { articles } from '~/data/blog'

</script>

<template>
  <div class="chromatic-mode">
    <section class="page-hero">
      <div class="page-hero__inner">
        <Breadcrumb :items="[{ label: 'Blog' }]" />
        <h1 class="h-display h-display--l" style="max-width:880px;">Le blog Sales de Mariell.</h1>
        <p style="margin-top:24px;max-width:620px;font-size:18px;line-height:1.55;color:rgba(244,239,227,0.72);">Nos analyses sur le recrutement commercial, le management et la performance des équipes Sales. Écrites par une équipe de Sales, pour les dirigeants qui font grandir leur chiffre.</p>
      </div>
    </section>

    <section class="section-pad section--paper">
      <div class="container">
        <div class="grid-cards">
          <NuxtLink
            v-for="article in articles"
            :key="article.slug"
            class="ucard"
            :to="`/blog/${article.slug}`"
          >
            <div class="ucard__tag">{{ article.tag }}</div>
            <div class="ucard__title">{{ article.title }}</div>
            <div class="ucard__excerpt">{{ article.excerpt }}</div>
            <span class="ucard__read">Lire &rarr;</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ucard__read {
  font-size: 13px;
  color: var(--moss);
  border-bottom: 1px solid currentColor;
  align-self: flex-start;
  padding-bottom: 1px;
}
</style>
