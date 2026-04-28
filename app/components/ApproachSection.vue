<script setup lang="ts"></script>

<template>
  <section id="approche" class="relative px-5 pt-12 md:px-10 md:pt-16 lg:px-16">
    <div class="mx-auto mb-12 max-w-7xl md:mb-16">
      <div class="reveal eyebrow-cyan">Notre approche</div>

      <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10 md:items-end">
        <h2 class="reveal headline-section text-white md:col-span-7" data-split>
          La chasse,<br />
          <span class="gradient-text italic">en temps réel.</span>
        </h2>

        <p
          class="reveal text-[1.05rem] leading-[1.65] text-white/65 md:col-span-5 md:col-start-8"
          style="font-family: var(--font-grotesk); font-weight: 300;"
        >
          Aucune annonce. On scanne le market, on identifie, on qualifie.<br />
          Voici ce que fait Mariell, jour après jour, avec exigence.
        </p>
      </div>
    </div>

    <PeopleHunt />
  </section>
</template>
