<template>
  <div>
    <WhyKodaHeroSection :sections="sections" />

    <div
      v-for="(chunckedSection, i) in chunckedSections"
      :key="`${i}-section`"
    >
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
    images: [
      'https://raw.githubusercontent.com/kodadot/nft-gallery/refs/heads/main/public/why-koda-1.webp',
      'https://raw.githubusercontent.com/kodadot/nft-gallery/refs/heads/main/public/why-koda-2.webp',
      'https://raw.githubusercontent.com/kodadot/nft-gallery/refs/heads/main/public/why-koda-3.webp',
      'https://raw.githubusercontent.com/kodadot/nft-gallery/refs/heads/main/public/why-koda-4.webp',
      'https://raw.githubusercontent.com/kodadot/nft-gallery/refs/heads/main/public/why-koda-5.webp',
    ],
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
