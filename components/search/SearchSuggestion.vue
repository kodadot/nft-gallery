<template>
  <div
    class="search-suggestion-container"
    @click="resetSelectedIndex"
    @keydown="onKeyDown">
    <NeoTabs
      v-show="name"
      v-model="activeSearchTab"
      expanded
      class="touch-mt-20"
      nav-tabs-class="pt-6 pl-6 pr-6"
      @input="resetSelectedIndex">
      <NeoTabItem
        label="Collections"
        value="Collections"
        data-testid="collection-tab"
        item-header-class="text-left is-block mb-0 pb-4 px-0 pt-0">
        <div v-if="isCollectionResultLoading">
          <SearchResultItem
            v-for="item in searchSuggestionEachTypeMaxNum"
            :key="item"
            is-loading />
        </div>
        <div v-else-if="!collectionSuggestion.length" class="mx-6 mt-4">
          {{ $t('search.collectionNotFound', [name]) }}
        </div>
        <div v-else>
          <div
            v-for="(item, idx) in collectionSuggestion"
            :key="item.id"
            :value="item"
            :class="`link-item ${idx === selectedIndex ? 'selected-item' : ''}`"
            @click="gotoCollectionItem(item)">
            <SearchResultItem :image="item.image">
              <template #content>
                <div class="flex flex-row justify-between pt-2 pr-2">
                  <span
                    class="font-bold max-w-[34ch] overflow-hidden text-ellipsis whitespace-nowrap"
                    >{{ item.name }}</span
                  >
                  <span class="text-k-grey">
                    {{ item.chain }}
                  </span>
                </div>
                <div class="flex justify-between pr-2">
                  <NeoSkeleton
                    v-if="item.floorPrice === undefined"
                    :count="1"
                    :width="100"
                    :height="22"
                    size="medium"
                    active />
                  <span v-else>
                    {{ $t('activity.floor') }}:
                    <span v-if="item.floorPrice === 0"> -- </span>
                    <Money
                      v-else
                      :value="item.floorPrice"
                      :prefix="item.chain"
                      inline />
                  </span>
                  <NeoSkeleton
                    v-if="item.totalCount === undefined"
                    :count="1"
                    :width="100"
                    :height="22"
                    size="medium"
                    active />
                  <span v-else class="text-k-grey">
                    {{ $t('search.units') }}:
                    {{ item.totalCount || 0 }}
                  </span>
                </div>
              </template>
            </SearchResultItem>
          </div>
        </div>
        <nuxt-link
          class="search-footer-link"
          :to="{
            path: `/${urlPrefix}/explore/collectibles`,
            query: { ...$route.query },
          }">
          <div :class="loadMoreItemClassName" @click="seeAllButtonHandler">
            {{ $t('search.seeAll') }}
            <svg
              class="ml-1"
              width="28"
              height="8"
              viewBox="0 0 28 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M27.3536 4.35355C27.5488 4.15829 27.5488 3.84171 27.3536 3.64645L24.1716 0.464466C23.9763 0.269204 23.6597 0.269204 23.4645 0.464466C23.2692 0.659728 23.2692 0.976311 23.4645 1.17157L26.2929 4L23.4645 6.82843C23.2692 7.02369 23.2692 7.34027 23.4645 7.53553C23.6597 7.7308 23.9763 7.7308 24.1716 7.53553L27.3536 4.35355ZM0 4.5H27V3.5H0V4.5Z"
                fill="currentColor" />
            </svg>
          </div>
        </nuxt-link>
      </NeoTabItem>
      <NeoTabItem
        label="NFTs"
        value="NFTs"
        item-header-class="text-left is-block mb-0 pb-4 px-0 pt-0"
        data-testid="nft-tab">
        <div v-if="isNFTResultLoading">
          <SearchResultItem
            v-for="item in searchSuggestionEachTypeMaxNum"
            :key="item"
            is-loading />
        </div>
        <div v-else-if="!nftSuggestion.length" class="mx-6 mt-4">
          {{ $t('search.nftNotFound', [name]) }}
        </div>
        <div v-else>
          <div
            v-for="(item, idx) in nftSuggestion"
            :key="item.id"
            :value="item"
            :class="`link-item ${idx === selectedIndex ? 'selected-item' : ''}`"
            @click="gotoGalleryItem(item)">
            <SearchResultItem :image="item.image">
              <template #content>
                <div class="flex flex-row justify-between pt-2 pr-2">
                  <span
                    class="font-bold max-w-[34ch] overflow-hidden text-ellipsis whitespace-nowrap"
                    >{{ item.name }}</span
                  >
                  <span class="capitalize">{{ urlPrefix }}</span>
                </div>
                <div class="flex flex-row justify-between pr-2">
                  <span
                    class="max-w-[34ch] overflow-hidden text-ellipsis whitespace-nowrap"
                    >{{ item.collection?.name }}</span
                  >
                  <span v-if="item.price && parseFloat(item.price) > 0">
                    {{ $t('price') }}:
                    <Money :value="item.price" :prefix="item.chain" inline />
                  </span>
                </div>
              </template>
            </SearchResultItem>
          </div>
        </div>
        <nuxt-link
          class="search-footer-link"
          :to="{
            path: `/${urlPrefix}/explore/items`,
            query: { ...$route.query },
          }">
          <div :class="loadMoreItemClassName" @click="seeAllButtonHandler">
            {{ $t('search.seeAll') }}
            <svg
              class="ml-1"
              width="28"
              height="8"
              viewBox="0 0 28 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M27.3536 4.35355C27.5488 4.15829 27.5488 3.84171 27.3536 3.64645L24.1716 0.464466C23.9763 0.269204 23.6597 0.269204 23.4645 0.464466C23.2692 0.659728 23.2692 0.976311 23.4645 1.17157L26.2929 4L23.4645 6.82843C23.2692 7.02369 23.2692 7.34027 23.4645 7.53553C23.6597 7.7308 23.9763 7.7308 24.1716 7.53553L27.3536 4.35355ZM0 4.5H27V3.5H0V4.5Z"
                fill="currentColor" />
            </svg>
          </div>
        </nuxt-link>
      </NeoTabItem>
      <NeoTabItem
        disabled
        value="User"
        item-header-class="text-left is-block mb-0 pb-4 px-0 pt-0">
        <template #header>
          {{ $t('user') }}
          <span class="small-soon-text">
            {{ $t('soon') }}
          </span>
        </template>
      </NeoTabItem>
    </NeoTabs>
    <div v-if="!name" class="search-history pt-5">
      <div
        v-for="item in filterSearch"
        :key="item.id"
        class="flex items-center justify-between mb-1 search-history-item"
        @click="goToExploreResults(item)">
        <div class="flex items-center">
          <NeoIcon icon="history" />
          <div class="ml-3 history-label">{{ item.name }}</div>
        </div>
        <div
          class="remove-search-history flex items-center"
          @click.stop.prevent="removeSearchHistory(item.name)">
          <svg
            width="12"
            height="12"
            viewBox="0 0 8 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.66644 8.0672L3.75229 5.14842L0.838143 8.0672L0.1875 7.41654L3.10623 4.50235L0.1875 1.58815L0.838143 0.9375L3.75229 3.85628L6.66644 0.942082L7.3125 1.58815L4.39835 4.50235L7.3125 7.41654L6.66644 8.0672Z"
              fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
    <NeoTabs
      v-show="!name"
      v-model="activeTrendingTab"
      expanded
      nav-tabs-class="pt-2 px-6"
      content-class="px-0 py-4">
      <NeoTabItem
        label="Trending"
        value="Trending"
        item-header-class="text-left is-block mb-0 pb-4 px-0 pt-0">
        <div
          v-for="(item, idx) in defaultCollectionSuggestions"
          :key="item.id"
          :value="item"
          :class="`link-item ${idx === selectedIndex ? 'selected-item' : ''}`"
          @click="gotoCollectionItem(item)">
          <SearchResultItem :image="item.image">
            <template #content>
              <div class="pr-2 pt-2">
                <span
                  class="font-bold max-w-[34ch] overflow-hidden text-ellipsis whitespace-nowrap"
                  >{{ item.name }}</span
                >
              </div>
              <div class="flex flex-row justify-between pr-2 secondary-info">
                <span v-if="item.nftCount"
                  >{{ $t('search.units') }}: {{ item.nftCount }}</span
                >
                <span>{{ $t('search.owners') }}: {{ item.owners }}</span>
                <span class="capitalize">{{ urlPrefix }}</span>
              </div>
            </template>
          </SearchResultItem>
        </div>
        <nuxt-link
          v-show="urlPrefix === 'rmrk'"
          class="search-footer-link"
          :to="{ name: 'series-insight' }"
          @click="$emit('close')">
          <div :class="loadMoreItemClassName">
            {{ $t('search.rankings') }}
            <svg
              class="ml-1"
              width="28"
              height="8"
              viewBox="0 0 28 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M27.3536 4.35355C27.5488 4.15829 27.5488 3.84171 27.3536 3.64645L24.1716 0.464466C23.9763 0.269204 23.6597 0.269204 23.4645 0.464466C23.2692 0.659728 23.2692 0.976311 23.4645 1.17157L26.2929 4L23.4645 6.82843C23.2692 7.02369 23.2692 7.34027 23.4645 7.53553C23.6597 7.7308 23.9763 7.7308 24.1716 7.53553L27.3536 4.35355ZM0 4.5H27V3.5H0V4.5Z"
                fill="currentColor" />
            </svg>
          </div>
        </nuxt-link>
      </NeoTabItem>
    </NeoTabs>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { denyList } from '@/utils/constants'
import {
  type CollectionWithMeta,
  type NFTWithMeta,
} from '@/components/rmrk/service/scheme'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { logError, mapNFTorCollectionMetadata } from '@/utils/mappers'
import { processMetadata } from '@/utils/cachingStrategy'
import resolveQueryPath from '@/utils/queryPathResolver'
import { unwrapSafe } from '@/utils/uniquery'
import { fetchCollectionSuggestion } from './utils/collectionSearch'
import { NeoIcon, NeoSkeleton, NeoTabItem, NeoTabs } from '@kodadot1/brick'
import Money from '@/components/shared/format/Money.vue'
import type { DefaultCollectionSuggestion, SearchQuery } from './types'
import { useTopCollections } from '../landing/topCollections/utils/useTopCollections'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  query: {
    type: Object,
    default: () => {
      return {} as SearchQuery
    },
  },
  showDefaultSuggestions: {
    type: Boolean,
    required: false,
  },
})

const query = toRef(props, 'query', {})

const searchSuggestionEachTypeMaxNum = 12
const activeSearchTab = ref('Collections')
const activeTrendingTab = ref('Trending')
const selectedIndex = ref(-1)
const isCollectionResultLoading = ref(false)
const nftResult = ref([] as NFTWithMeta[])
const collectionResult = ref([] as CollectionWithMeta[])
const searched = ref([] as NFTWithMeta[])
const searchString = ref('')
const defaultCollectionSuggestions = ref<DefaultCollectionSuggestion[]>([])

onMounted(() => {
  getSearchHistory()
})

const onKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowUp':
      onKeydownSelected(-1)
      break
    case 'ArrowDown':
      onKeydownSelected(+1)
      break
    case 'Enter':
      nativeSearch()
      break
  }
}

const totalItemsAtCurrentTab = computed(() => {
  if (!props.name) {
    return defaultCollectionSuggestions.value?.length
  }
  return activeSearchTab.value === 'NFTs'
    ? nftSuggestion.value.length
    : collectionSuggestion.value.length
})

const collectionSuggestion = computed(() =>
  collectionResult.value.slice(0, searchSuggestionEachTypeMaxNum),
)

const nftSuggestion = computed(() =>
  nftResult.value.slice(0, searchSuggestionEachTypeMaxNum),
)

const loadMoreItemClassName = computed(
  () =>
    `link-item${
      selectedIndex.value === totalItemsAtCurrentTab.value
        ? ' selected-item'
        : ''
    }`,
)

const queryVariables = computed(() => {
  return {
    first: searchSuggestionEachTypeMaxNum,
    offset: 0,
    denyList,
    orderBy: query.value.sortByMultiple?.length
      ? query.value.sortByMultiple
      : undefined,
    search: buildSearchParam(),
  }
})

const selectedItemListMap = computed(() => ({
  Trending: defaultCollectionSuggestions,
  Collections: collectionSuggestion,
  NFTs: nftSuggestion,
}))

const router = useRouter()
const route = useRoute()
const { $consola } = useNuxtApp()

const updateSearchUrl = () => {
  const { name } = props
  if (name) {
    router
      .replace({
        path: String(route.path),
        query: {
          search: name,
        },
      })
      .catch($consola.warn)
  }
}

const emit = defineEmits(['close', 'gotoGallery'])

const seeAllButtonHandler = () => {
  emit('close')
  updateSearchUrl()
}

const nativeSearch = () => {
  // not selected
  if (selectedIndex.value === -1) {
    return
  }

  const isSeeMore = selectedIndex.value >= totalItemsAtCurrentTab.value
  // trending collection
  if (!props.name) {
    if (isSeeMore) {
      router.push({ name: 'series-insight' })
    } else {
      gotoCollectionItem(selectedItemListMap['Trending'][selectedIndex.value])
    }
    return
  }

  // search result
  if (isSeeMore) {
    emit('gotoGallery')
  } else if (activeSearchTab.value === 'NFTs') {
    gotoGalleryItem(selectedItemListMap.value['NFTs'][selectedIndex.value])
  } else {
    gotoCollectionItem(
      selectedItemListMap.value['Collections'][selectedIndex.value],
    )
  }
}

const onKeydownSelected = (step: 1 | -1) => {
  const total = totalItemsAtCurrentTab.value + 1
  selectedIndex.value = (total + selectedIndex.value + step) % total
}

const resetSelectedIndex = () => {
  selectedIndex.value = -1
}

const { urlPrefix, client } = usePrefix()

const gotoGalleryItem = (item: NFTWithMeta) => {
  router.push(`/${urlPrefix.value}/gallery/${item.id}`)
  emit('close', item)
}

const gotoCollectionItem = (item: CollectionWithMeta) => {
  // if item is clicked when search term is there, insert to history
  if (searchString.value) {
    insertNewHistory()
  }
  const prefix = item.chain || urlPrefix.value
  router.push(`/${prefix}/collection/${item.collection_id || item.id}`)
  emit('close', item)
}

const buildSearchParam = (): Record<string, unknown>[] => {
  const params: { name_containsInsensitive?: string; price_gt?: string }[] = []
  if (query.value?.search) {
    params.push({ name_containsInsensitive: query.value?.search })
  }

  if (query.value?.listed) {
    params.push({ price_gt: '0' })
  }

  return params
}

const insertNewHistory = () => {
  for (const s of searched.value) {
    if (s.name === searchString.value) {
      return
    }
  }

  const newResult = {
    type: 'History',
    name: searchString.value,
  } as unknown as NFTWithMeta

  searched.value.push(newResult)

  if (searched.value.length > 3) {
    searched.value = searched.value.slice(-3)
  }

  localStorage.kodaDotSearchResult = JSON.stringify(searched.value)
}

const getSearchHistory = () => {
  const cacheResult = localStorage.kodaDotSearchResult
  if (cacheResult) {
    searched.value = JSON.parse(cacheResult)
  }
}

const removeSearchHistory = (value: string) => {
  searched.value = searched.value.filter((r) => r.name !== value)
  localStorage.kodaDotSearchResult = JSON.stringify(searched.value)
}

const filterSearch = computed((): NFTWithMeta[] => {
  // filter the history search which is not similar to searchString
  if (!searched.value.length) {
    return []
  }

  return searched.value.filter((option) => {
    if (!option.name.trim()) {
      return false
    }
    return (
      option.name
        .toString()
        .toLowerCase()
        .indexOf((searchString.value || '').toLowerCase()) >= 0
    )
  })
})

const goToExploreResults = (item) => {
  emit('gotoGallery', {
    search: item.name,
  })
}

const getFormattedDefaultSuggestions = (
  collections,
): DefaultCollectionSuggestion[] => {
  return collections.map((collection) => ({
    id: collection.id,
    name: collection.name,
    image: collection.image,
    nftCount: collection.nftCount,
    owners: collection.ownerCount || collection.uniqueCollectors,
  }))
}

const { data: topCollections, refresh: getTopCollection } = useTopCollections(
  searchSuggestionEachTypeMaxNum,
  props.showDefaultSuggestions,
)

watch(
  topCollections,
  (data) => {
    defaultCollectionSuggestions.value = getFormattedDefaultSuggestions(
      data,
    ).slice(0, searchSuggestionEachTypeMaxNum)
  },
  { immediate: true },
)

watch(
  () => props.showDefaultSuggestions,
  (showDefaultSuggestions) => {
    if (showDefaultSuggestions) {
      getTopCollection()
    }
  },
)

const {
  data: dataNFTs,
  loading: isNFTResultLoading,
  refetch: fetchSearchNFTs,
} = useSearchNfts({ ...queryVariables.value, immediate: false })

const updateSuggestion = useDebounceFn(async (value: string) => {
  //To handle empty string
  if (!value) {
    // reset query-based search results once searchString is empty
    collectionResult.value = []
    nftResult.value = []
    return
  }

  isCollectionResultLoading.value = true
  query.value.search = value
  searchString.value = value
  await fetchSearchNFTs(queryVariables.value)
  await updateCollectionSuggestion(value)
}, 200)

const updateNftSuggestion = async (nFTEntities) => {
  try {
    const nftList = unwrapSafe(
      nFTEntities.slice(0, searchSuggestionEachTypeMaxNum),
    )
    const metadataList: string[] = nftList.map(mapNFTorCollectionMetadata)
    const result: Ref<NFTWithMeta[]> = ref([])
    processMetadata<NFTWithMeta>(metadataList, (meta, i) => {
      result.value.push({
        ...nftList[i],
        ...meta,
        image: sanitizeIpfsUrl(
          meta.image || meta.animation_url || meta.mediaUri || '',
          'image',
        ),
      })
    })
    nftResult.value = result.value
  } catch (e) {
    logError(e, (msg) => $consola.warn('[PREFETCH] Unable fo fetch', msg))
  }
}

const updateCollectionSuggestion = async (value: string) => {
  try {
    const collections = await fetchCollectionSuggestion(
      value,
      searchSuggestionEachTypeMaxNum,
    )
    const metadataList: string[] = collections.map(mapNFTorCollectionMetadata)
    const collectionWithImagesList = ref<CollectionWithMeta[]>([])

    processMetadata<CollectionWithMeta>(metadataList, (meta, i) => {
      const initialCollectionStats = {
        totalCount: undefined,
        floorPrice: undefined,
      }
      const collectionWithImages = reactive({
        ...collections[i],
        ...meta,
        ...initialCollectionStats, // set initial stat fields to get reactivity
        image: sanitizeIpfsUrl(
          collections[i].image || collections[i].mediaUri || '',
          'image',
        ),
      })
      collectionWithImagesList.value.push(collectionWithImages)

      fetchCollectionStats(collectionWithImages, i)
    })
    collectionResult.value = collectionWithImagesList.value
  } catch (e) {
    logError(e, (msg) => $consola.warn('[PREFETCH] Unable fo fetch', msg))
  }
  isCollectionResultLoading.value = false
}

const fetchCollectionStats = async (
  collection: CollectionWithMeta,
  index: number,
) => {
  const _client = collection.chain || client.value
  const queryCollection = await resolveQueryPath(
    _client === 'ksm' ? 'chain-rmrk' : 'subsquid',
    'collectionStatsById',
  )
  const { data } = await useAsyncQuery({
    query: queryCollection.default,
    clientId: _client,
    variables: {
      id: collection.collection_id,
    },
  })

  collection.totalCount = data.value.stats.base.length
  collection.floorPrice = Math.min(
    ...data.value.stats.listed.map((item) => parseInt(item.price)),
  )

  if (
    collectionResult.value[index]?.collection_id === collection.collection_id
  ) {
    collectionResult.value[index] = collection
  }

  return collection
}

watch(dataNFTs, async (data) => {
  await updateNftSuggestion(data.nFTEntities || [])
})

watch(
  () => props.name,
  (value) => {
    updateSuggestion(value)
    resetSelectedIndex()
  },
)

// expose functions to parent component
defineExpose({
  insertNewHistory,
})
</script>
