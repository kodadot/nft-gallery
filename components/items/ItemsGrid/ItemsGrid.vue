<template>
  <div class="is-flex-grow-1">
    <div class="is-hidden-mobile">
      <div
        class="is-flex is-justify-content-space-between pb-4 pt-5 is-align-content-center">
        <BreadcrumbsFilter />

        <div v-if="total">{{ total }} {{ $t('items') }}</div>
        <div v-else-if="isLoading" class="skeleton-container-fixed-width">
          <NeoSkeleton no-margin />
        </div>
      </div>
      <hr class="my-0" />
    </div>

    <LoadPreviousPage
      v-if="startPage > 1 && !isLoading && total > 0"
      @click="reachTopHandler" />

    <DynamicGrid
      v-if="total !== 0 && !isLoading"
      :id="scrollContainerId"
      v-slot="slotProps"
      class="my-5">
      <div
        v-for="(nft, index) in nfts"
        :key="`${nft.id}=${index}`"
        :data-cy="index"
        :class="scrollItemClassName">
        <ItemsGridImage
          :nft="nft"
          :variant="
            (slotProps.isMobileVariant || slotProps.grid === 'small') &&
            'minimal'
          " />
      </div>
    </DynamicGrid>

    <DynamicGrid
      v-else-if="isLoading"
      :id="scrollContainerId"
      v-slot="slotProps"
      class="my-5">
      <NeoNftCard
        v-for="n in skeletonCount"
        :key="n"
        is-loading
        :variant="
          (slotProps.isMobileVariant || slotProps.grid === 'small') && 'minimal'
        " />
    </DynamicGrid>

    <EmptyResult v-else />
    <ScrollTopButton />
  </div>
</template>

<script setup lang="ts">
import { NeoNftCard, NeoSkeleton } from '@kodadot1/brick'
import DynamicGrid from '@/components/shared/DynamicGrid.vue'
import ItemsGridImage from './ItemsGridImage.vue'
import { useFetchSearch } from './useItemsGrid'

const isLoading = ref(true)

const { setDefaultUrl } = useReplaceUrl()
setDefaultUrl({ listed: true })

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

const skeletonCount = first.value

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

<style lang="scss" scoped>
.skeleton-container-fixed-width {
  width: 80px;
}
</style>
