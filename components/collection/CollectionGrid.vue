<template>
  <div class="collections">
    <LoadPreviousPage
      v-if="startPage > 1 && !isLoading && total > 0"
      @click="reachTopHandler" />

    <DynamicGrid
      v-if="!isLoading && total"
      :id="scrollContainerId"
      grid-size="medium"
      :default-width="GRID_DEFAULT_WIDTH"
      :mobile-variant="false">
      <div
        v-for="(collection, index) in collections"
        :key="collection.id"
        :class="scrollItemClassName"
        :data-testid="`collection-index-${index}`">
        <CollectionCard :collection="collection" />
      </div>
    </DynamicGrid>

    <DynamicGrid
      v-else-if="isLoading"
      :id="scrollContainerId"
      grid-size="medium"
      :default-width="GRID_DEFAULT_WIDTH"
      :mobile-variant="false">
      <CollectionCard v-for="n in skeletonCount" :key="n" is-loading />
    </DynamicGrid>

    <EmptyResult v-else />

    <ScrollTopButton />
  </div>
</template>

<script lang="ts" setup>
import { Collection } from '@/components/rmrk/service/scheme'
import { SearchQuery } from '@/components/search/types'
import 'lazysizes'
import collectionListWithSearch from '@/queries/subsquid/general/collectionListWithSearch.graphql'
import isEqual from 'lodash/isEqual'
import { getDenyList } from '~/utils/prefix'
import CollectionCard from '@/components/collection/CollectionCard.vue'
import { GRID_DEFAULT_WIDTH } from '@/components/collection/utils/constants'
import { usePreferencesStore } from '@/stores/preferences'

const props = defineProps<{
  id?: string
}>()

const route = useRoute()
const { $apollo } = useNuxtApp()
const { urlPrefix, client } = usePrefix()
const preferencesStore = usePreferencesStore()
const emit = defineEmits(['total', 'isLoading'])

const collections = ref<Collection[]>([])
const isLoading = ref(true)
const searchQuery = ref<SearchQuery>({
  search: route.query?.search?.toString() ?? '',
  type: route.query?.type?.toString() ?? '',
  sortBy:
    typeof route.query?.sort === 'string'
      ? [route.query?.sort]
      : route.query?.sort,
  listed: route.query?.listed?.toString() === 'true',
})

const resetPage = useDebounceFn(() => {
  gotoPage(1)
}, 500)

const buildSearchParam = (): Record<string, unknown>[] => {
  const params: any[] = []
  if (searchQuery.value.search) {
    params.push({
      name_containsInsensitive: searchQuery.value.search,
    })
  }

  if (searchQuery.value.listed) {
    params.push({ nfts_some: { price_gt: '0' } })
  }

  return params
}

onBeforeMount(() => {
  fetchPageData(startPage.value)
  // setting the default layout until redesign explorer menubar: YOLO
  preferencesStore.setLayoutClass('is-one-quarter-desktop is-one-third-tablet')
})

const fetchPageData = async (page: number, loadDirection = 'down') => {
  if (isFetchingData.value) {
    return false
  }
  isFetchingData.value = true

  const variables = props.id
    ? {
        search: [
          {
            issuer_eq: props.id,
          },
        ],
        first: first.value,
        offset: (page - 1) * first.value,
        orderBy: searchQuery.value.sortBy,
      }
    : {
        denyList: getDenyList(urlPrefix.value),
        orderBy: searchQuery.value.sortBy,
        search: buildSearchParam(),
        listed: searchQuery.value.listed
          ? [{ price: { greaterThan: '0' } }]
          : [],
        first: first.value,
        offset: (page - 1) * first.value,
      }
  const result = await $apollo.query({
    query: collectionListWithSearch,
    client: client.value,
    variables,
  })
  await handleResult(result, loadDirection)
  isFetchingData.value = false
  return true
}

const gotoPage = (page: number) => {
  currentPage.value = page
  startPage.value = page
  endPage.value = page
  collections.value = []
  isFetchingData.value = false
  isLoading.value = true
  fetchPageData(page)
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
} = useListInfiniteScroll({
  gotoPage,
  fetchPageData,
})

watch(total, (val) => emit('total', val))
watch(isLoading, (val) => emit('isLoading', val))

const skeletonCount = first.value

const handleResult = async ({ data }: any, loadDirection = 'down') => {
  total.value = data.stats.totalCount
  const newCollections = data.collectionEntities.map((e: any) => ({
    ...e,
  }))

  if (loadDirection === 'up') {
    collections.value = newCollections.concat(collections.value)
  } else {
    collections.value = collections.value.concat(newCollections)
  }

  isLoading.value = false
}

watch(
  () => route.query.search,
  (val, oldVal) => {
    if (val !== oldVal) {
      resetPage()
      searchQuery.value.search = val === undefined ? val : String(val)
    }
  }
)

watch(
  () => route.query.sort,
  (val, oldVal) => {
    if (!isEqual(val, oldVal)) {
      resetPage()
      searchQuery.value.sortBy = String(val) || undefined
    }
  }
)

watch(
  () => searchQuery.value,
  () => {
    resetPage()
  }
)
</script>

<style lang="scss" scoped>
.skeleton-container-fixed-width {
  width: 80px;
}
</style>
