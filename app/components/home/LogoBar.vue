<script setup lang="ts">
// Real client logos (recolored monochrome cream), per-logo display height tuned
// so wordmarks share an optical size. Each links to the client’s site.
const DIR = '/assets/client-logos/'
const clients = [
  { name: 'kraaft', h: 28, role: 'Account Executive Mid-Market', url: 'https://www.kraaft.com/' },
  { name: 'nextmotion', h: 18, role: 'BDR & Head of Sales', url: 'https://www.nextmotion.net/fr' },
  { name: 'reconomia', h: 17, role: 'Field Sales & COO', url: 'https://reconomia.framer.website/reconditionneur' },
  { name: 'reality-academy', h: 15, role: 'Account Executive Team', url: 'https://www.reality-academy.fr/' },
  { name: 'kickmaker', h: 22, role: 'Senior Sales', url: 'https://www.kickmaker.fr/' },
  { name: 'meeriad', h: 20, role: 'Account Executive SMB & Mid', url: 'https://www.meeriad.com/' },
  { name: 'sastec', h: 40, role: 'Partnership Director', url: 'https://www.sastec-group.com/' },
  { name: 'aviv-group', h: 20, role: 'Business Developer', url: 'https://www.aviv-group.com/' },
  { name: 'dhala', h: 26, role: 'Sales Manager', url: 'https://dhala.fr/' },
  { name: 'wikit', h: 24, role: 'Account Executive SMB & Mid', url: 'https://www.wikit.ai/' },
  { name: 'scaleplus', h: 26, role: 'Business Developer', url: 'https://scaleplus.fr/' },
]
</script>

<template>
  <section class="logo-bar">
    <div class="logo-marquee-mask">
      <div class="logo-marquee">
        <template v-for="pass in 2" :key="pass">
          <a
            v-for="c in clients"
            :key="pass + '-' + c.name"
            class="logo-cell"
            :href="c.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="logo-cell__mark">
              <img :src="DIR + c.name + '-logo.png'" :alt="c.name" :style="{ height: c.h + 'px', width: 'auto', display: 'block' }" loading="lazy" decoding="async">
            </div>
            <div class="logo-cell__role">{{ c.role }}</div>
          </a>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.logo-bar {
  background: var(--ink-1000);
  color: var(--fg-on-ink-1);
  padding: 46px 0 48px;
  border-top: 1px solid rgba(244, 239, 227, 0.06);
  border-bottom: 1px solid rgba(244, 239, 227, 0.06);
}
.logo-marquee-mask {
  overflow: hidden;
}
</style>
