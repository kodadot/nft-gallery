<template>
  <div class="is-flex-grow-1">
    <LoadPreviousPage
      v-if="startPage > 1 && !isLoading && total > 0"
      @click="reachTopHandler" />

    <DynamicGrid
      v-if="total !== 0 && (!isLoading || !isFetchingData)"
      :id="scrollContainerId"
      v-slot="slotProps"
      class="my-5">
      <div
        v-for="(nft, index) in nfts"
        :key="`${nft.id}=${index}`"
        :data-testid="index"
        :class="scrollItemClassName">
        <ItemsGridImage
          :nft="nft"
          :variant="
            slotProps.isMobileVariant || slotProps.grid === 'small'
              ? 'minimal'
              : 'primary'
          " />
      </div>

      <!-- skeleton on fetching next page -->
      <template v-if="isLoading || isFetchingData">
        <NeoNftCardSkeleton v-for="n in skeletonCount" :key="n" />
      </template>

      <!-- intersection observer element -->
      <div v-else ref="target"></div>
    </DynamicGrid>

    <!-- skeleton on first load -->
    <DynamicGrid
      v-if="total === 0 && (isLoading || isFetchingData)"
      class="my-5">
      <NeoNftCardSkeleton v-for="n in skeletonCount" :key="n" />
    </DynamicGrid>

    <EmptyResult v-if="total === 0 && (!isLoading || !isFetchingData)" />
    <ScrollTopButton />
  </div>
</template>

<script setup lang="ts">
import { NeoNftCardSkeleton } from '@kodadot1/brick'
import DynamicGrid from '@/components/shared/DynamicGrid.vue'
import ItemsGridImage from './ItemsGridImage.vue'
import {
  updatePotentialNftsForListingCart,
  useFetchSearch,
} from './useItemsGrid'
import isEqual from 'lodash/isEqual'
import { useListingCartStore } from '@/stores/listingCart'

const { listingCartEnabled } = useListingCartConfig()
const listingCartStore = useListingCartStore()

const props = defineProps<{
  search?: Record<string, string | number>
}>()

const emit = defineEmits(['total', 'loading'])

const isLoading = ref(true)
const gotoPage = (page: number) => {
  currentPage.value = page
  startPage.value = page
  endPage.value = page
  isFetchingData.value = false
  isLoading.value = true

  clearFetchResults()
  fetchSearch({ page, search: parseSearch(props.search) })
}
const fetchPageData = async (page: number, loadDirection) => {
  return await fetchSearch({
    page,
    loadDirection,
    search: parseSearch(props.search),
  })
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
  fetchNextPage,
} = useListInfiniteScroll({
  gotoPage,
  fetchPageData,
})

const skeletonCount = first.value

const resetPage = useDebounceFn(() => {
  gotoPage(1)
}, 500)

const { nfts, fetchSearch, clearFetchResults } = useFetchSearch({
  first,
  total,
  isFetchingData,
  isLoading,
  resetSearch: resetPage,
})

watch(
  () => nfts.value.length,
  () => {
    if (listingCartEnabled.value) {
      updatePotentialNftsForListingCart(nfts.value)
    }
  },
  { immediate: true },
)

watch(total, () => {
  emit('total', total.value)
})

watch(isLoading, () => {
  emit('loading', isLoading.value)
})

const parseSearch = (
  search?: Record<string, string | number>,
): Record<string, string | number>[] =>
  Object.entries(search || {}).map(([key, value]) => ({ [key]: value }))

watch(
  () => props.search,
  (newSearch, oldSearch) => {
    if (newSearch === undefined || oldSearch === undefined) {
      return
    }
    if (!isEqual(newSearch, oldSearch)) {
      isLoading.value = true
      gotoPage(1)
    }
  },
  { deep: true },
)

onBeforeMount(() => {
  if (listingCartEnabled.value) {
    listingCartStore.clear()
  }

  fetchSearch({
    page: startPage.value,
    search: parseSearch(props.search),
  }).then(() => {
    isLoading.value = false
  })
})

// trigger intersection observer
const target = ref(null)
useIntersectionObserver(target, async ([{ isIntersecting }]) => {
  if (isIntersecting && !isFetchingData.value) {
    await fetchNextPage()
  }
})
</script>
