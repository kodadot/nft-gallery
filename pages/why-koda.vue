<template>
  <div>
    <WhyKodaHeroSection :sections="sections" />

    <WhyKodaSections :sections="sections" />

    <WhyKodaCtaSection />
  </div>
</template>
<script lang="ts" setup>
import type { Section } from '@/components/why-koda/types'

const sectionIds = [
  'team',
  'community',
  'generative_art',
  'koda',
  'weekly_drops',
  'earn_rewards',
  'offline_exhibitions',
  'onboarding',
]

definePageMeta({
  layout: 'full-width-no-footer',
})

const { $i18n } = useNuxtApp()

const sections = computed<Section[]>(() =>
  sectionIds.map((section, index) => {
    const number = index + 1
    return {
      id: section,
      number,
      name: $i18n.t(`whyKoda.sections.${section}.name`),
      description: $i18n.t(`whyKoda.sections.${section}.description`),
    }
  }),
)
</script>
