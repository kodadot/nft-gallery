<template>
  <div class="flex-grow">
    <LoadPreviousPage
      v-if="startPage > 1 && !isLoading && total > 0"
      @click="reachTopHandler" />

    <DynamicGrid
      v-if="total !== 0 && (!isLoading || !isFetchingData)"
      :id="scrollContainerId"
      v-slot="slotProps"
      :grid-section="gridSection"
      :grid-size="gridSize"
      :mobile-cols="2"
      class="my-5">
      <div
        v-for="(entity, index) in items"
        :key="`${entity.id}=${index}`"
        :data-testid="index"
        :class="scrollItemClassName">
        <ItemsGridImage
          v-if="!isTokenEntity(entity)"
          :nft="entity"
          :hide-media-info="hideMediaInfo"
          :hide-action="hideNFTHoverAction"
          :display-name-with-sn="displayNameWithSn"
          :show-timestamp="showTimestamp"
          :collection-popover-hide="collectionPopoverHide"
          hide-video-controls
          :variant="
            slotProps.isMobileVariant || slotProps.grid === 'small'
              ? 'minimal'
              : 'primary'
          " />
        <ItemsGridImageTokenEntity
          v-else
          :entity="entity"
          :hide-media-info="hideMediaInfo"
          :hide-action="hideNFTHoverAction"
          :display-name-with-sn="displayNameWithSn"
          hide-video-controls
          :variant="
            slotProps.isMobileVariant || slotProps.grid === 'small'
              ? 'minimal'
              : 'primary'
          " />
      </div>

      <!-- skeleton on fetching next page -->
      <template v-if="isLoading || isFetchingData">
        <NftCardSkeleton
          v-for="n in skeletonCount"
          :key="n"
          :hide-media-info="hideMediaInfo" />
      </template>

      <!-- intersection observer element -->
      <div v-else ref="target"></div>
    </DynamicGrid>

    <!-- skeleton on first load -->
    <DynamicGrid
      v-if="total === 0 && (isLoading || isFetchingData || loadingOtherNetwork)"
      :grid-section="gridSection"
      :grid-size="gridSize"
      class="my-5"
      :mobile-cols="2">
      <NftCardSkeleton
        v-for="n in skeletonCount"
        :key="n"
        :hide-media-info="hideMediaInfo"
        :slim-media-info="collectionPopoverHide" />
    </DynamicGrid>

    <template v-if="total === 0 && (!isLoading || !isFetchingData)">
      <slot v-if="slots['empty-result']" name="empty-result"></slot>
      <EmptyResult v-else />
    </template>

    <ScrollTopButton />
  </div>
</template>

<script setup lang="ts">
import DynamicGrid from '@/components/shared/DynamicGrid.vue'
import ItemsGridImage from './ItemsGridImage.vue'
import ItemsGridImageTokenEntity from './ItemsGridImageTokenEntity.vue'
import {
  updatePotentialNftsForListingCart,
  useFetchSearch,
} from './useItemsGrid'
import isEqual from 'lodash/isEqual'
import { useListingCartStore } from '@/stores/listingCart'
import { getTokensNfts } from './useNftActions'
import { NFT } from '@/components/rmrk/service/scheme'
import { GridSection } from '@/stores/preferences'
const slots = useSlots()

const { listingCartEnabled } = useListingCartConfig()
const listingCartStore = useListingCartStore()
const route = useRoute()

const props = defineProps<{
  search?: Record<string, string | number>
  resetSearchQueryParams?: string[]
  gridSection?: GridSection
  gridSize?: GridSize
  loadingOtherNetwork?: boolean
  displayNameWithSn?: boolean
  showTimestamp?: boolean
  hideHoverAction?: boolean
  collectionPopoverHide?: boolean
}>()

const emit = defineEmits(['total', 'loading'])

const isLoading = ref(true)

const hideMediaInfo = computed(() => route.query?.art_view === 'true')
const isTouchDevice = useMediaQuery('(hover: none)')
const hideNFTHoverAction = computed(
  () => isTouchDevice.value || props.hideHoverAction,
)

const gotoPage = (page: number) => {
  currentPage.value = page
  startPage.value = page
  endPage.value = page
  isFetchingData.value = false
  isLoading.value = true
  total.value = 0

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

const resetPage = () => {
  isLoading.value = true
  gotoPage(1)
}

const { items, fetchSearch, clearFetchResults, usingTokens } = useFetchSearch({
  first,
  total,
  isFetchingData,
  isLoading,
  resetSearch: resetPage,
  resetSearchQueryParams: props.resetSearchQueryParams,
})

watch(
  () => items.value.length,
  async () => {
    if (listingCartEnabled.value && items.value.length > 0) {
      if (usingTokens.value) {
        const nftsForPotentialList = await getTokensNfts(
          items.value as TokenEntity[],
        )
        updatePotentialNftsForListingCart(nftsForPotentialList as NFT[])
      } else {
        updatePotentialNftsForListingCart(items.value as NFT[])
      }
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
      resetPage()
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
