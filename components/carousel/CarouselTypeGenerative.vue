<template>
  <div ref="carouselDrop">
    <CarouselIndex
      data-testid="generative-activity"
      :title="$t('general.generativeArt')"
      :nfts="nfts.value"
      action-type="pagination"
    />
  </div>
</template>

<script lang="ts" setup>
import { useElementVisibility } from '@vueuse/core'
import { useCarouselGenerativeNftEvents } from './utils/useCarouselEvents'
import { useProfileOnboardingStore } from '@/stores/profileOnboarding'

const nfts = useCarouselGenerativeNftEvents()
const carouselDrop = ref()

watch([useElementVisibility(carouselDrop)], ([isVisible]) => {
  if (isVisible) {
    useProfileOnboardingStore().setCarouselVisited()
  }
})
</script>
