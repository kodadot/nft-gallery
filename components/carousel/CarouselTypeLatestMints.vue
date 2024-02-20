<template>
  <div>
    <div class="flex justify-between">
      <h3 class="title is-3">{{ $t('drops.latestMints') }}</h3>
      <div class="flex gap-4">
        <OrderByDropdown class="ml-6" no-shadow no-count rounded />
        <FilterButton
          :label="$t('sort.listed')"
          url-param="buy_now"
          data-testid="profile-filter-button-buynow" />
      </div>
    </div>

    <DynamicGrid :id="scrollContainerId">
      <div
        v-for="(nft, index) in nfts"
        :key="nft.id"
        :data-testid="index"
        :class="scrollItemClassName">
        <NftCard
          :nft="nft"
          :prefix="urlPrefix"
          show-price
          variant="generative" />
      </div>
    </DynamicGrid>
  </div>
</template>

<script lang="ts" setup>
import { flattenNFT } from './utils/useCarouselEvents'
import OrderByDropdown from '../profile/OrderByDropdown.vue'
import FilterButton from '../profile/FilterButton.vue'
import NftCard from '../shared/nftCard/NftCard.vue'

const { urlPrefix } = usePrefix()

const props = withDefaults(
  defineProps<{
    collectionId: string
    interaction: string
    limit?: number
  }>(),
  {
    limit: 10,
  },
)

const route = useRoute()
const sortBy = computed(() => {
  if (!route.query?.sort) {
    return 'timestamp_DESC'
  }
  return typeof route.query?.sort === 'string'
    ? [route.query?.sort]
    : route.query?.sort
})
const buyNow = computed(() => route.query.buy_now?.toString() === 'true')

const nfts = ref([])

const fetchPageData = async (_page?: number, _loadDirection = 'down') => {
  const { data } = useGraphql({
    queryName: 'latestEvents',
    variables: {
      limit: props.limit,
      orderBy: sortBy.value,
      where: {
        interaction_eq: props.interaction,
        nft: {
          collection: {
            id_eq: props.collectionId,
          },
        },
      },
    },
  })

  watch(data, (result) => {
    console.log(result)
    nfts.value = flattenNFT(result?.events || [], urlPrefix.value)
  })
  return true
}

const resetPage = useDebounceFn(() => {
  gotoPage(1)
}, 500)

const isLoading = ref(false)

const gotoPage = async (page: number) => {
  currentPage.value = page
  startPage.value = page
  endPage.value = page
  isFetchingData.value = false
  isLoading.value = true
  nfts.value = []
  await fetchPageData()
}

onMounted(async () => {
  await fetchPageData()
})

const {
  startPage,
  endPage,
  currentPage,
  scrollItemClassName,
  isFetchingData,
  scrollContainerId,
} = useListInfiniteScroll({
  gotoPage,
  fetchPageData,
})

watch(
  [sortBy, buyNow],
  () => {
    resetPage()
  },
  {
    deep: true,
  },
)
</script>
