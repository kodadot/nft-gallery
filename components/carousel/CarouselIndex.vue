<template>
  <div v-if="nfts.length">
    <h2 class="title is-2">
      {{ title }}
    </h2>

    <CarouselList
      v-if="showCarousel"
      :nfts="nfts"
      :gallery-item-carousel="galleryItemCarousel"
      :step="steps" />
  </div>
</template>

<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
import type { CarouselNFT } from '@/components/base/types'

const CarouselList = defineAsyncComponent(
  () => import('./module/CarouselAgnostic.vue'),
)

const props = defineProps<{
  title?: string
  subtitle?: string
  nfts: CarouselNFT[]
  loading?: boolean
  actionType?: 'pagination' | 'link'
  linkUrl?: string
  linkText?: string
  itemUrl?: string
  galleryItemCarousel?: boolean
}>()

const itemUrl = computed(() => props.itemUrl || 'gallery')
const steps = ref()
provide('itemUrl', itemUrl.value)

const showCarousel = computed(() => props.nfts.length)

const { width } = useWindowSize()

watchPostEffect(() => {
  if (width.value > 1540) {
    steps.value = 6
  }
  if (width.value > 1280) {
    steps.value = 5
  }
  if (width.value > 1024) {
    steps.value = 4
  }
  if (width.value > 768) {
    steps.value = 2
  }
  steps.value = 1
})
</script>
