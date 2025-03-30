<template>
  <div ref="carouselDrop">
    <CarouselIndex
      v-if="data.value.length"
      data-testid="generative-activity"
      :title="$t('general.generativeArt')"
      :nfts="data.value"
      action-type="pagination"
    />
  </div>
</template>

<script lang="ts" setup>
import { useElementVisibility } from '@vueuse/core'
import { unionBy } from 'lodash'
import { useEvents, sortNfts } from './utils/useCarouselEvents'
import { useProfileOnboardingStore } from '@/stores/profileOnboarding'

const props = defineProps<{
  collectionIds: string[]
}>()

const carouselDrop = ref()

watch([useElementVisibility(carouselDrop)], ([isVisible]) => {
  if (isVisible) {
    useProfileOnboardingStore().setCarouselVisited()
  }
})

const LIMIT = 12
const { data: ahpEventsNewestList } = useEvents('ahp', 'newestList', LIMIT, props.collectionIds)
const { data: ahpEventsLatestSales } = useEvents('ahp', 'latestSales', LIMIT, props.collectionIds)

const data = computed(() => {
  const ahpEvents = [...ahpEventsNewestList.value, ...ahpEventsLatestSales.value]

  return sortNfts(unionBy(ahpEvents, 'id')).nfts
})
</script>
