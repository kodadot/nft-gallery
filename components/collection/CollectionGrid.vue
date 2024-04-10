<template>
  <div class="collections">
    <LoadPreviousPage
      v-if="startPage > 1 && !isLoading && total > 0"
      @click="reachTopHandler" />

    <DynamicGrid
      v-if="!isLoading && total"
      :id="scrollContainerId"
      grid-size="medium"
      :default-width="GRID_DEFAULT_WIDTH">
      <div
        v-for="(collection, index) in collections"
        :key="collection.id"
        :class="scrollItemClassName"
        :data-testid="`collection-index-${index}`">
        <CollectionCard :collection="collection" />
      </div>
    </DynamicGrid>

    <DynamicGrid
      v-else-if="isLoading || loadingOtherNetwork"
      :id="scrollContainerId"
      grid-size="medium"
      :default-width="GRID_DEFAULT_WIDTH">
      <CollectionCard v-for="n in skeletonCount" :key="n" is-loading />
    </DynamicGrid>

    <template v-else>
      <slot v-if="slots['empty-result']" name="empty-result"></slot>
      <EmptyResult v-else />
    </template>

    <ScrollTopButton />
  </div>
</template>

<script lang="ts" setup>
import { Collection } from '@/components/rmrk/service/scheme'
import { SearchQuery } from '@/components/search/types'
import collectionListWithSearch from '@/queries/subsquid/general/collectionListWithSearch.graphql'
import collectionListWithSearchProfile from '@/queries/subsquid/general/collectionListWithSearchProfile.graphql'
import { getDenyList } from '@/utils/prefix'
import isEqual from 'lodash/isEqual'
import CollectionCard from '@/components/collection/CollectionCard.vue'
import { GRID_DEFAULT_WIDTH } from '@/components/collection/utils/constants'
import { usePreferencesStore } from '@/stores/preferences'
import DynamicGrid from '@/components/shared/DynamicGrid.vue'

const emit = defineEmits(['total', 'isLoading'])
const props = defineProps<{
  id?: string
  loadingOtherNetwork?: boolean
}>()

const slots = useSlots()
const route = useRoute()
const { accountId } = useAuth()
const { urlPrefix, client } = usePrefix()
const { isRemark } = useIsChain(urlPrefix)
const preferencesStore = usePreferencesStore()

const isProfilePage = route.name === 'prefix-u-id'
const collections = ref<Collection[]>([])
const loadedPages = ref<number[]>([])
const isLoading = ref(true)

const searchQuery = reactive<SearchQuery>({
  search: '',
  sortBy: undefined,
  type: route.query?.type?.toString() ?? '',
  listed: route.query?.listed?.toString() === 'true',
})

const resetPage = useDebounceFn(() => {
  gotoPage(1)
}, 1000)

const buildSearchParam = (): Record<string, unknown>[] => {
  const params: any[] = []
  if (searchQuery.search) {
    params.push({
      name_containsInsensitive: searchQuery.search,
    })
  }

  if (searchQuery.listed) {
    params.push({ nfts_some: { price_gt: '0' } })
  }

  return params
}

onBeforeMount(() => {
  fetchPageData(startPage.value)
  // setting the default layout until redesign explorer menubar: YOLO
  preferencesStore.setLayoutClass('is-one-quarter-desktop is-one-third-tablet')
})

const getQueryVariables = (page: number) => {
  const searchParams = isProfilePage
    ? { currentOwner_eq: props.id, burned_eq: false }
    : { issuer_eq: props.id }

  if (isProfilePage && accountId.value !== props.id) {
    Object.assign(searchParams, { nftCount_not_eq: 0 })
  }

  if (isRemark.value) {
    delete searchParams.burned_eq
  }

  return props.id
    ? {
        search: [searchParams],
        first: first.value,
        offset: (page - 1) * first.value,
        orderBy: searchQuery.sortBy,
      }
    : {
        denyList: getDenyList(urlPrefix.value),
        orderBy: searchQuery.sortBy,
        search: buildSearchParam(),
        listed: searchQuery.listed ? [{ price: { greaterThan: '0' } }] : [],
        first: first.value,
        offset: (page - 1) * first.value,
      }
}

const fetchPageData = async (page: number, loadDirection = 'down') => {
  if (isFetchingData.value) {
    return false
  }

  const variables = getQueryVariables(page)

  isFetchingData.value = true

  const { data: result } = await useAsyncQuery({
    query: isProfilePage
      ? collectionListWithSearchProfile
      : collectionListWithSearch,
    variables: variables,
    clientId: client.value,
  })

  handleResult(result.value, { page, loadDirection, variables })

  isFetchingData.value = false

  return true
}

const gotoPage = (page: number) => {
  currentPage.value = page
  startPage.value = page
  endPage.value = page
  collections.value = []
  loadedPages.value = []
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

const skeletonCount = first.value

const handleResult = (
  data,
  {
    loadDirection = 'down',
    page,
    variables,
  }: { loadDirection?: string; page: number; variables: object },
) => {
  total.value = data.stats.totalCount

  const isLatestPageResult = isEqual(variables, getQueryVariables(page))

  if (loadedPages.value.includes(page) || !isLatestPageResult) {
    return
  }

  const newCollections = data.collectionEntities.map((e: any) => ({
    ...e,
  }))

  if (loadDirection === 'up') {
    collections.value = newCollections.concat(collections.value)
  } else {
    collections.value = collections.value.concat(newCollections)
  }

  loadedPages.value.push(page)
  isLoading.value = false
}

watch(total, (val) => emit('total', val))
watch(isLoading, (val) => emit('isLoading', val))

watch(
  () => route.query.search,
  (search, prevSearch) => {
    if (!isEqual(search, prevSearch)) {
      searchQuery.search = search?.toString() ?? ''
    }
  },
  { immediate: true },
)

watch(
  () => route.query.sort,
  (sort, prevSort) => {
    if (!isEqual(sort, prevSort)) {
      searchQuery.sortBy = sort ? parseQueryParamToArray(sort) : undefined
    }
  },
  { immediate: true },
)

watch(searchQuery, () => resetPage())
</script>

<style lang="scss" scoped>
.skeleton-container-fixed-width {
  width: 80px;
}
</style>
