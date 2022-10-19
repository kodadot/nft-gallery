<template>
  <div>
    <div v-if="nfts.length">
      <h2 class="title is-2 has-text-dark">{{ title }}</h2>

      <CarouselList v-if="showCarousel" :nfts="nfts" />
    </div>
  </div>
</template>

<script lang="ts" setup>
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
}>()

const itemUrl = computed(() => props.itemUrl || 'gallery')
provide('itemUrl', itemUrl.value)

const showCarousel = computed(() => props.nfts.length)
</script>
