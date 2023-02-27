<template>
  <div class="is-flex-grow-1">
    <div
      class="is-flex is-justify-content-space-between pt-5 is-align-content-center">
      <BreadcrumbsFilter />
      <p>total: {{ total }}</p>
    </div>

    <hr />
    <div
      class="columns is-multiline is-align-content-flex-start"
      style="min-height: 100vh">
      <div
        v-for="(nft, index) in nfts"
        :key="`${nft.id}=${index}`"
        class="column is-3">
        <ItemsGridImage :nft="nft" />
      </div>
    </div>
    <div ref="reachBottom">bottom</div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import BreadcrumbsFilter from '~~/components/shared/gallery/BreadcrumbsFilter.vue'

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
