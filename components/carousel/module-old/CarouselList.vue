<template>
  <b-carousel-list
    :value="current"
    has-drag
    :arrow="false"
    :arrow-hover="false"
    :data="nfts"
    :items-to-show="options.itemsToShow"
    :breakpoints="options.breakpoints"
    class="carousel-card-list">
    <template #item="list">
      <div class="card mx-2">
        <CarouselCardMedia :list="list" />
        <CarouselCardInfo :list="list" />
        <CarouselCardFooter :list="list" />
      </div>
    </template>
  </b-carousel-list>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import type { CarouselNFT } from '@/components/base/types'
import type { RowSeries } from '@/components/series/types'

import CarouselCardMedia from './CarouselCardMedia.vue'
import CarouselCardInfo from './CarouselCardInfo.vue'
import CarouselCardFooter from './CarouselCardFooter.vue'

const props = defineProps({
  nfts: {
    type: Array as PropType<CarouselNFT[] | RowSeries[]>,
    required: true,
  },
  page: {
    type: Number,
    default: 1,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})

const current = computed(() => props.page - 1) // 0-indexed
</script>

<style lang="scss">
// move to scss component
.carousel-card-list {
  overflow-x: auto;
  mask: linear-gradient(90deg, rgb(255, 255, 255) 75%, transparent);
  &::-webkit-scrollbar {
    /* Hide scrollbar for Chrome, Safari and Opera */
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  .card {
    background-color: #0e0e10;

    .media-content {
      width: 100%;
    }
  }
}
</style>
