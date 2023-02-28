<template>
  <div class="is-flex-grow-1">
    <!-- TODO: breadcrumbs filter here -->
    <p>total: {{ total }}</p>
    <hr />
    <DynamicGrid>
      <div v-for="(nft, index) in nfts" :key="`${nft.id}=${index}`">
        <ItemsGridImage :nft="nft" />
      </div>
    </DynamicGrid>
    <div ref="reachBottom">bottom</div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

import DynamicGrid from '@/components/shared/DynamicGrid.vue'
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
</script>
