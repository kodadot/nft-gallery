<template>
  <div class="is-flex-grow-1">
    <LoadPreviousPage
      v-if="startPage > 1 && !isLoading && total > 0"
      @click="reachTopHandler" />

    <DynamicGrid
      v-if="total !== 0 && (!isLoading || !isFetchingData)"
      :id="scrollContainerId"
      v-slot="slotProps"
      :grid-section="gridSection"
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
          hide-video-controls
          :variant="
            slotProps.isMobileVariant || slotProps.grid === 'small'
              ? 'minimal'
              : 'primary'
          " />
      </div>

      <!-- skeleton on fetching next page -->
      <template v-if="isLoading || isFetchingData">
        <NeoNftCardSkeleton
          v-for="n in skeletonCount"
          :key="n"
          :hide-media-info="hideMediaInfo" />
      </template>

      <!-- intersection observer element -->
      <div v-else ref="target"></div>
    </DynamicGrid>

    <!-- skeleton on first load -->
    <DynamicGrid
      v-if="total === 0 && (isLoading || isFetchingData)"
      :grid-section="gridSection"
      class="my-5"
      :mobile-cols="2">
      <NeoNftCardSkeleton
        v-for="n in skeletonCount"
        :key="n"
        :hide-media-info="hideMediaInfo" />
    </DynamicGrid>

    <EmptyResult v-if="total === 0 && (!isLoading || !isFetchingData)" />
    <ScrollTopButton />
  </div>
</template>

<script setup lang="ts">
import { NeoNftCardSkeleton } from '@kodadot1/brick'
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

const { listingCartEnabled } = useListingCartConfig()
const listingCartStore = useListingCartStore()
const route = useRoute()

const props = defineProps<{
  search?: Record<string, string | number>
  gridSection?: GridSection
}>()

const emit = defineEmits(['total', 'loading'])

const isLoading = ref(true)

const hideMediaInfo = computed(() => route.query?.art_view === 'true')
const isTouchDevice = useMediaQuery('(hover: none)')
const hideNFTHoverAction = computed(() => isTouchDevice.value)

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

const { items, fetchSearch, clearFetchResults, usingTokens } = useFetchSearch({
  first,
  total,
  isFetchingData,
  isLoading,
  resetSearch: resetPage,
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
