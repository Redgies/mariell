<script setup lang="ts">
import { navLinks, labDropdown, siteConfig } from '~~/shared/config/site'

const route = useRoute()
const isHome = computed(() => route.path === '/')
const resolveHref = (href: string) =>
  href.startsWith('#') && !isHome.value ? `/${href}` : href

const isMobileMenuOpen = ref(false)
const isLabOpen = ref(false)
const isMobileLabOpen = ref(false)
const navRef = ref<HTMLElement | null>(null)

const closeMobile = () => {
  isMobileMenuOpen.value = false
  isMobileLabOpen.value = false
  isLabOpen.value = false
}

const onLinkClick = (href: string) => {
  closeMobile()
  // Native hash navigation + CSS smooth scroll will handle the rest.
  if (typeof window !== 'undefined' && href.startsWith('#')) {
    history.replaceState(null, '', href)
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeMobile()
}

const onDocClick = (e: MouseEvent) => {
  if (!navRef.value) return
  if (!navRef.value.contains(e.target as Node)) {
    isLabOpen.value = false
    isMobileMenuOpen.value = false
    isMobileLabOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onDocClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onDocClick)
})

watch(isMobileMenuOpen, (open) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})
</script>

<template>
  <header
    ref="navRef"
    class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl"
  >
    <nav
      class="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-10 lg:px-16"
      aria-label="Navigation principale"
    >
      <!-- Logo -->
      <a
        :href="resolveHref('#accueil')"
        class="font-serif-jp text-2xl tracking-tight text-white transition-colors hover:text-white/90 md:text-[1.75rem]"
        @click="onLinkClick(resolveHref('#accueil'))"
      >
        <img src="/logo_site.png" alt="Mariell" class="h-11 w-auto" />
      </a>

      <!-- Desktop nav -->
      <ul class="hidden items-center gap-8 md:flex">
        <li
          v-for="link in navLinks"
          :key="link.label"
          class="relative"
          @mouseenter="link.hasDropdown && (isLabOpen = true)"
          @mouseleave="link.hasDropdown && (isLabOpen = false)"
        >
          <!-- In-page anchor -->
          <a
            v-if="link.href.startsWith('#')"
            :href="resolveHref(link.href)"
            class="text-sm text-white/90 transition-colors hover:text-white"
            style="font-family: var(--font-grotesk); font-weight: 600;"
            @click="onLinkClick(resolveHref(link.href))"
          >
            {{ link.label }}
          </a>

          <!-- Route link (with optional dropdown / badge) -->
          <NuxtLink
            v-else
            :to="link.href"
            class="relative inline-flex items-center gap-1.5 text-sm text-white/90 transition-colors hover:text-white"
            style="font-family: var(--font-grotesk); font-weight: 600;"
            :aria-haspopup="link.hasDropdown ? 'true' : undefined"
            :aria-expanded="link.hasDropdown ? isLabOpen : undefined"
            @click="closeMobile"
          >
            {{ link.label }}
            <span
              v-if="link.badge"
              class="relative ml-0.5 inline-flex h-1.5 w-1.5"
              aria-label="Nouveau"
            >
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
              <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
            <svg
              v-if="link.hasDropdown"
              class="ml-0.5 h-3 w-3 transition-transform"
              :class="{ 'rotate-180': isLabOpen }"
              viewBox="0 0 10 6"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1l4 4 4-4"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </NuxtLink>

          <!-- Desktop dropdown panel -->
          <Transition
            v-if="link.hasDropdown"
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="isLabOpen"
              class="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl shadow-black/50"
            >
              <ul class="py-2">
                <li v-for="item in labDropdown" :key="item.label">
                  <NuxtLink
                    v-if="!item.disabled"
                    :to="item.href"
                    class="block px-4 py-2.5 text-sm text-white/85 transition-colors hover:bg-white/5 hover:text-white"
                    style="font-family: var(--font-grotesk); font-weight: 500;"
                    @click="closeMobile"
                  >
                    {{ item.label }}
                  </NuxtLink>
                  <span
                    v-else
                    class="block px-4 py-2.5 text-sm text-white/40"
                    style="font-family: var(--font-grotesk); font-weight: 300;"
                  >
                    {{ item.label }}
                  </span>
                </li>
              </ul>
            </div>
          </Transition>
        </li>
      </ul>

      <!-- Desktop CTA -->
      <a
        :href="siteConfig.calendlyUrl"
        class="gradient-cta hidden rounded-full px-5 py-2.5 text-sm text-black md:inline-flex"
        style="font-family: var(--font-grotesk); font-weight: 600;"
      >
        {{ siteConfig.ctaPrimary }}
      </a>

      <!-- Mobile hamburger -->
      <button
        type="button"
        class="relative z-[60] flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden"
        :aria-expanded="isMobileMenuOpen"
        aria-label="Ouvrir le menu"
        @click.stop="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <svg v-if="!isMobileMenuOpen" class="pointer-events-none" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <svg v-else class="pointer-events-none" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
    </nav>

    <!-- Mobile slide-in (teleported to body to escape header stacking context) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-x-0 top-20 bottom-0 z-[55] overflow-y-auto border-t border-white/10 bg-black/95 backdrop-blur-xl md:hidden"
        @click.stop
      >
        <ul class="flex flex-col gap-1 px-6 py-8">
          <li v-for="link in navLinks" :key="link.label">
            <!-- Hash link -->
            <a
              v-if="link.href.startsWith('#')"
              :href="resolveHref(link.href)"
              class="block rounded-lg px-4 py-4 text-lg text-white transition-colors hover:bg-white/5"
              style="font-family: var(--font-grotesk); font-weight: 600;"
              @click="onLinkClick(resolveHref(link.href))"
            >
              {{ link.label }}
            </a>

            <!-- Route link (with optional dropdown / badge) -->
            <div v-else>
              <div class="flex items-stretch">
                <NuxtLink
                  :to="link.href"
                  class="flex flex-1 items-center gap-2 rounded-lg px-4 py-4 text-lg text-white transition-colors hover:bg-white/5"
                  style="font-family: var(--font-grotesk); font-weight: 600;"
                  @click="closeMobile"
                >
                  {{ link.label }}
                  <span
                    v-if="link.badge"
                    class="relative ml-0.5 inline-flex h-2 w-2"
                    aria-label="Nouveau"
                  >
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
                    <span class="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                </NuxtLink>
                <button
                  v-if="link.hasDropdown"
                  type="button"
                  class="flex w-12 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  :aria-expanded="isMobileLabOpen"
                  aria-label="Voir le sous-menu"
                  @click="isMobileLabOpen = !isMobileLabOpen"
                >
                  <svg
                    class="h-4 w-4 transition-transform"
                    :class="{ 'rotate-180': isMobileLabOpen }"
                    viewBox="0 0 10 6"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 1l4 4 4-4"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div v-if="link.hasDropdown && isMobileLabOpen" class="mt-1 flex flex-col gap-0.5 pl-4">
                <template v-for="item in labDropdown" :key="item.label">
                  <NuxtLink
                    v-if="!item.disabled"
                    :to="item.href"
                    class="block rounded-md px-4 py-3 text-base text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                    style="font-family: var(--font-grotesk); font-weight: 500;"
                    @click="closeMobile"
                  >
                    {{ item.label }}
                  </NuxtLink>
                  <span
                    v-else
                    class="block rounded-md px-4 py-3 text-base text-white/40"
                    style="font-family: var(--font-grotesk); font-weight: 300;"
                  >
                    {{ item.label }}
                  </span>
                </template>
              </div>
            </div>
          </li>
          <li class="mt-6 px-2">
            <a
              :href="siteConfig.calendlyUrl"
              class="gradient-cta flex w-full items-center justify-center rounded-full px-5 py-4 text-base text-black"
              style="font-family: var(--font-grotesk); font-weight: 600;"
              @click="closeMobile"
            >
              {{ siteConfig.ctaPrimary }}
            </a>
          </li>
        </ul>
      </div>
      </Transition>
    </Teleport>
  </header>
</template>
