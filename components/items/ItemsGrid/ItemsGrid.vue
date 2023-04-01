<template>
  <div class="is-flex-grow-1">
    <div class="is-hidden-mobile">
      <div
        class="is-flex is-justify-content-space-between pb-4 pt-5 is-align-content-center">
        <BreadcrumbsFilter />
        <div v-show="total">{{ total }} {{ $t('items') }}</div>
      </div>
      <hr class="my-0" />
    </div>

    <LoadPreviousPage
      v-if="startPage > 1 && !isLoading && total > 0"
      @click="reachTopHandler" />

    <DynamicGrid :id="scrollContainerId" v-slot="slotProps" class="mt-5">
      <div
        v-for="(nft, index) in nfts"
        :key="`${nft.id}=${index}`"
        :class="scrollItemClassName">
        <ItemsGridImage
          :nft="nft"
          :variant="
            (slotProps.isMobileVariant || slotProps.grid === 'small') &&
            'minimal'
          " />
      </div>
    </DynamicGrid>
    <EmptyResult v-if="total === 0" />
  </div>
</template>

<script setup lang="ts">
import DynamicGrid from '@/components/shared/DynamicGrid.vue'
import ItemsGridImage from './ItemsGridImage.vue'
import { useFetchSearch } from './useItemsGrid'

const isLoading = ref(true)
const gotoPage = (page: number) => {
  currentPage.value = page
  startPage.value = page
  endPage.value = page
  nfts.value = []
  isFetchingData.value = false
  isLoading.value = true

  fetchSearch(page)
}
const fetchPageData = async (page: number, loadDirection) => {
  return await fetchSearch(page, loadDirection)
}
const {
  first,
  total,
  startPage,
  endPage,
  currentPage,
  scrollItemClassName,
  isFetchingData,
  scrollContainerId,
  reachTopHandler,
  prefetchNextPage,
} = useListInfiniteScroll({
  gotoPage,
  fetchPageData,
})

const resetPage = useDebounceFn(() => {
  gotoPage(1)
}, 500)

const { nfts, fetchSearch } = useFetchSearch({
  first,
  total,
  isFetchingData,
  isLoading,
  resetSearch: resetPage,
})

watch(total, () => {
  prefetchNextPage()
})

onBeforeMount(async () => {
  await fetchSearch(startPage.value)
  isLoading.value = false
})
</script>
