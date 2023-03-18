<!--
 * @Description:
 * @Author: Floyd Li (floyd.li@outlook.com)
 * @Date: 2023-03-13 17:20:12
 * @LastEditors: Floyd Li (floyd.li@outlook.com)
 * @LastEditTime: 2023-03-18 16:21:22
-->
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
import type { RowSeries } from '@/components/series/types'

const CarouselList = defineAsyncComponent(
  () => import('./module/CarouselAgnostic.vue')
)

const props = defineProps<{
  title?: string
  subtitle?: string
  nfts: CarouselNFT[] | RowSeries[]
  loading?: boolean
  actionType?: 'pagination' | 'link'
  linkUrl?: string
  linkText?: string
  itemUrl?: string
  galleryItemCarousel?: boolean
}>()

const itemUrl = computed(() => props.itemUrl || 'gallery')
provide('itemUrl', itemUrl.value)

const showCarousel = computed(() => props.nfts.length)

const { width } = useWindowSize()
const steps = computed(() => {
  if (width.value > 1280) {
    return 6
  }
  if (width.value > 1024) {
    return 4
  }
  if (width.value > 768) {
    return 2
  }
  return 1
})
</script>
