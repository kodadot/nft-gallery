<template>
  <div>
    <WhyKodaHeroSection :sections="sections" />

    <div v-for="(chunckedSection, i) in chunckedSections" :key="`${i}-section`">
      <WhyKodaSections :sections="chunckedSection" />
    </div>

    <WhyKodaCtaSection />
  </div>
</template>
<script lang="ts" setup>
import type { Section } from '@/components/why-koda/types'

definePageMeta({
  layout: 'full-width-no-footer',
})

const { $i18n } = useNuxtApp()

const glob = import.meta.glob('~/public/why-koda-*.webp', { eager: true })

const chunckByBlock = (items: Section[]) => {
  const blocks: Section[][] = []
  let block: Section[] = []

  for (const section of items) {
    block.push(section)
    if (section.images || section.tags) {
      blocks.push(block)
      block = []
    }
  }

  blocks.push(block)

  return blocks
}

const sections = [
  {
    id: 'team',
  },
  {
    id: 'community',
  },
  {
    id: 'generativeArt',
  },
  {
    id: 'koda',
  },
  {
    id: 'weeklyDrops',
  },
  {
    id: 'earnRewards',
  },
  {
    id: 'offlineExhibitions',
    images: Object.entries(glob).map(([, value]) => value.default),
    tags: [
      'visibilityRecognition',
      'digitalCreationsToPhysicalAudience',
      'increasedSales',
      'artistGrowth',
      'newSpaceForCollaborations',
    ],
  },
  {
    id: 'onboarding',
  },
].map((section, index) => ({
  number: index + 1,
  name: $i18n.t(`whyKoda.sections.${section.id}.name`),
  description: $i18n.t(`whyKoda.sections.${section.id}.description`),
  ...section,
})) as Section[]

const chunckedSections = chunckByBlock(sections)
</script>
