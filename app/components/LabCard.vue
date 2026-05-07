<script setup lang="ts">
export type LabCardIcon = 'target' | 'gauge' | 'team' | 'bars' | 'check'

interface Props {
  tag: string
  titleLead: string
  titleEm: string
  titleTrail?: string
  description: string
  cta: string
  href: string
  icon: LabCardIcon
}

defineProps<Props>()
</script>

<template>
  <NuxtLink :to="href" class="lab-card">
    <span class="lab-card__icon" aria-hidden="true">
      <svg v-if="icon === 'target'" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
      </svg>
      <svg v-else-if="icon === 'gauge'" viewBox="0 0 24 24">
        <path d="M3.5 16a8.5 8.5 0 0 1 17 0" />
        <path d="M12 16l5-5" />
        <circle cx="12" cy="16" r="1.4" fill="currentColor" stroke="none" />
        <path d="M3.5 16h2M18.5 16h2M12 6.5v2" />
      </svg>
      <svg v-else-if="icon === 'team'" viewBox="0 0 24 24">
        <circle cx="8.5" cy="8" r="2.6" />
        <circle cx="16" cy="9.5" r="2.2" />
        <path d="M3.5 19c.6-3 2.6-4.6 5-4.6s4.4 1.6 5 4.6" />
        <path d="M14 19c.4-2.4 2-3.6 3.8-3.6s3.4 1.2 3.8 3.6" />
      </svg>
      <svg v-else-if="icon === 'bars'" viewBox="0 0 24 24">
        <path d="M3.5 20.5h17" />
        <rect x="5.5" y="13" width="3" height="6" rx="0.5" />
        <rect x="10.5" y="9" width="3" height="10" rx="0.5" />
        <rect x="15.5" y="5" width="3" height="14" rx="0.5" />
        <path d="M5.5 5.5l4-2 4 2 5-3.5" />
      </svg>
      <svg v-else-if="icon === 'check'" viewBox="0 0 24 24">
        <rect x="4" y="3.5" width="16" height="17" rx="2" />
        <path d="M8 9l1.6 1.6L13 7.2" />
        <path d="M15.5 9.2h2" />
        <path d="M8 14l1.6 1.6L13 12.2" />
        <path d="M15.5 14.2h2" />
      </svg>
    </span>

    <span class="lab-card__tag">{{ tag }}</span>

    <div class="lab-card__body">
      <h3 class="lab-card__title">
        {{ titleLead }}<span class="gradient-text italic">{{ titleEm }}</span><template v-if="titleTrail">{{ titleTrail }}</template>
      </h3>
      <p class="lab-card__desc">{{ description }}</p>
    </div>

    <span class="lab-card__cta">
      {{ cta }}
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  </NuxtLink>
</template>

<style scoped>
.lab-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 36px 32px 32px;
  min-height: 320px;

  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;

  color: inherit;
  text-decoration: none;
  cursor: pointer;
  isolation: isolate;
  overflow: hidden;

  transition:
    border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
@media (min-width: 1024px) {
  .lab-card { padding: 40px 36px 36px; }
}

.lab-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #5ee7e7, #e85eff, transparent);
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.lab-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(60% 50% at 100% 0%,
                rgba(232, 94, 255, 0.08),
                transparent 70%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.lab-card:hover,
.lab-card:focus-visible {
  border-color: rgba(94, 231, 231, 0.28);
  background: rgba(255, 255, 255, 0.035);
  transform: translateY(-4px);
  box-shadow:
    0 24px 60px -30px rgba(94, 231, 231, 0.35),
    0 12px 40px -20px rgba(232, 94, 255, 0.25);
}
.lab-card:hover::before,
.lab-card:focus-visible::before { opacity: 1; }
.lab-card:hover::after,
.lab-card:focus-visible::after  { opacity: 1; }

.lab-card:focus-visible {
  outline: 1px solid #5ee7e7;
  outline-offset: 4px;
}

.lab-card:active {
  transform: translateY(-2px);
  transition-duration: 0.1s;
}

.lab-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(135deg,
                rgba(94, 231, 231, 0.06),
                rgba(232, 94, 255, 0.06));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1),
              background 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.lab-card__icon svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.lab-card:hover .lab-card__icon,
.lab-card:focus-visible .lab-card__icon {
  border-color: rgba(94, 231, 231, 0.4);
  background: linear-gradient(135deg,
                rgba(94, 231, 231, 0.12),
                rgba(232, 94, 255, 0.10));
}

.lab-card__tag {
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  margin-top: -8px;
}

.lab-card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1 0 auto;
}

.lab-card__title {
  font-family: var(--font-grotesk);
  font-weight: 800;
  font-size: clamp(19px, 1.35vw, 22px);
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #fff;
  margin: 0;
  text-wrap: balance;
  hyphens: manual;
  word-break: normal;
  overflow-wrap: normal;
}
.lab-card__title :deep(.gradient-text) {
  display: inline-block;
  padding-right: 0.12em;
}

.lab-card__desc {
  font-family: var(--font-grotesk);
  font-weight: 300;
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
  text-wrap: pretty;
}

.lab-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-grotesk);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.01em;
  color: #fff;
  margin-top: 8px;
}
.lab-card__cta svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
              color 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.lab-card:hover .lab-card__cta,
.lab-card:focus-visible .lab-card__cta { color: #5ee7e7; }
.lab-card:hover .lab-card__cta svg,
.lab-card:focus-visible .lab-card__cta svg {
  transform: translateX(4px);
  color: #5ee7e7;
}

@media (prefers-reduced-motion: reduce) {
  .lab-card,
  .lab-card__cta svg {
    transition: none;
  }
  .lab-card:hover,
  .lab-card:focus-visible {
    transform: none;
  }
}
</style>
