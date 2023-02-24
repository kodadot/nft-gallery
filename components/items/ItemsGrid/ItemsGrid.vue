<template>
  <div class="is-flex-grow-1">
    <!-- TODO: breadcrumbs filter here -->
    <p>total: {{ total }}</p>
    <hr />
    <div ref="container" :style="gridCols">
      <div v-for="(nft, index) in nfts" :key="`${nft.id}=${index}`">
        <ItemsGridImage :nft="nft" />
      </div>
    </div>
    <div ref="reachBottom">bottom</div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

import ItemsGridImage from './ItemsGridImage.vue'
import { useFetchSearch } from './useItemsGrid'

const { nfts, total, nextPage } = useFetchSearch()

const reachBottom = ref<HTMLElement | null>(null)
useIntersectionObserver(
  reachBottom,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      nextPage()
    }
  },
  { rootMargin: '1000px' }
)

// dynamic grids
const container = ref<HTMLDivElement | null>(null)
const { gridCols } = useDynamicGrid(container)
</script>
