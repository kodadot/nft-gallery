<template>
  <div>
    <NeoField :class="searchColumnClass">
      <slot name="next-filter"></slot>
      <SearchBar
        v-if="!hideSearchInput"
        ref="searchRef"
        v-model="name"
        :query="query"
        data-testid="search-bar"
        @redirect="redirectToGalleryPageIfNeed"
        @enter="nativeSearch"
        @blur="onBlur" />
      <div v-if="!isVisible && hideSearchInput">
        <div v-if="priceRangeDirty" class="is-size-7">
          <PriceRange inline />
        </div>
      </div>
    </NeoField>
  </div>
</template>

<script lang="ts" setup>
import { exist, existArray } from '@/utils/exist'
import { SearchQuery } from './types'
import { NFT_SQUID_SORT_CONDITION_LIST } from '@/utils/constants'
import { NeoField } from '@kodadot1/brick'
import PriceRange from '@/components/shared/format/PriceRange.vue'
import SearchBar from '@/components/search/SearchBar.vue'
import { useCollectionSearch } from '@/components/search/utils/useCollectionSearch'

const searchPageRoutePathList = ['collectibles', 'items']

const props = withDefaults(
  defineProps<{
    search?: string
    sortByMultiple?: string[]
    searchColumnClass?: string
    listed?: boolean
    hideFilter?: boolean
    hideSearchInput?: boolean
  }>(),
  {
    search: '',
    sortByMultiple: () => [],
    searchColumnClass: '',
    listed: false,
    hideFilter: false,
    hideSearchInput: false,
  },
)

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:sortByMultiple', value: string[]): void
  (e: 'update:listed', listed: boolean): void
  (e: 'resetPage'): void
  (e: 'update:priceMin', value?: number): void
  (e: 'update:priceMax', value?: number): void
}>()

const { $consola } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { decimals } = useChain()
const route = useRoute()
const router = useRouter()

const searchRef = ref(null)
const isVisible = ref(false)
const name = ref('')
const priceRange = ref<
  [number | string | undefined, number | string | undefined]
>([undefined, undefined])
const priceRangeDirty = ref(false)

const query = reactive<SearchQuery>({
  search: route.query?.search?.toString() ?? '',
  type: route.query?.type?.toString() ?? '',
  sortByMultiple: props.sortByMultiple ?? [],
  listed: route.query?.listed?.toString() === 'true',
})

const urlSearchQuery = computed(() => route.query.search)
const routePathList = computed(() =>
  searchPageRoutePathList.map(
    (route) => `/${urlPrefix.value}/explore/${route}`,
  ),
)
const searchQuery = computed({
  get() {
    return props.search
  },
  set(value: string) {
    updateSearch(value)
  },
})
const isExplorePage = computed(() => routePathList.value.includes(route.path))

type Listed = boolean | { listed: boolean; min?: string; max?: string }
const vListed = computed({
  get() {
    query.listed = props.listed
    return props.listed
  },
  set(listed: Listed) {
    updateListed(listed)
  },
})

const updateListed = useDebounceFn((value: string | Listed): boolean => {
  let v: string
  if (typeof value === 'string' || typeof value === 'boolean') {
    v = String(value)
    replaceUrl({ listed: v })
  } else {
    const { listed, max, min } = value
    v = String(listed)
    replaceUrl({
      listed,
      max,
      min,
    })
  }

  const listed = v === 'true'

  emit('update:listed', listed)

  return listed
}, 50)

const replaceUrl = useDebounceFn(
  (queryCondition: Record<string, any>, pathName?: string) => {
    if (pathName && pathName !== route.path) {
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, ...restQuery } = route.query
    router
      .replace({
        query: {
          ...restQuery,
          search: searchQuery.value || route.query.search || undefined,
          ...queryCondition,
        },
      })
      .catch($consola.warn)
    // if a searchbar request or filter is set, pagination should always revert to page 1
    emit('resetPage')
  },
  100,
)

const updateSortBy = useDebounceFn((value: string[] | string) => {
  const final = (Array.isArray(value) ? value : [value]).filter((condition) =>
    NFT_SQUID_SORT_CONDITION_LIST.includes(condition),
  )
  const listed = final.some(
    (condition) => condition.toLowerCase().indexOf('price') > -1,
  )
  if (listed && !vListed.value) {
    vListed.value = true
  }

  replaceUrl({ sort: final })

  emit('update:sortByMultiple', final)

  return final
}, 400)

const updateSearch = (value: string): string => {
  if (value !== route.query.search && value !== searchQuery.value) {
    replaceUrl({ search: value ? value : undefined }, route.path)
  }
  emit('update:search', value)
  return value
}

function bindFilterEvents(event: KeyboardEvent) {
  switch (event.key) {
    case 'b':
      updateListed(!vListed.value)
      break
    case 'n':
      updateSortBy(['BLOCK_NUMBER_DESC'])
      break
    case 'o':
      updateSortBy(['BLOCK_NUMBER_ASC'])
      break
    case 'e':
      updateSortBy(['PRICE_DESC'])
      break
    case 'c':
      updateSortBy(['PRICE_ASC'])
      break
  }
}

function updatePriceRangeByQuery(minValue?: string, maxValue?: string) {
  const min = Number(minValue)
  const max = Number(maxValue)
  if (Number.isNaN(min) && Number.isNaN(max)) {
    return
  }
  priceRangeDirty.value = true
  if (minValue) {
    priceRange.value = [min, priceRange.value[1]]
    priceRangeChangeMin(min * 10 ** decimals.value)
  } else {
    priceRange.value = [priceRange.value[0], max]
    priceRangeChangeMax(max * 10 ** decimals.value)
  }
}

function nativeSearch() {
  redirectToGalleryPageIfNeed({ search: name.value })
  searchQuery.value = name.value
}

function redirectToGalleryPageIfNeed(params?: Record<string, string>) {
  const { isCollectionSearchMode } = useCollectionSearch()
  if (!isExplorePage.value && !isCollectionSearchMode.value) {
    router.push({
      path: `/${urlPrefix.value}/explore/items`,
      query: {
        ...route.query,
        ...params,
      },
    })
  }
}

function priceRangeChangeMin(min?: number): void {
  query.priceMin = min
  emit('update:priceMin', min)
}

function priceRangeChangeMax(max?: number): void {
  query.priceMax = max
  emit('update:priceMax', max)
}

function onBlur() {
  if (isExplorePage.value) {
    updateSearch(name.value)
  }
}

// clear search bar value when search is canceled via breadcrumbs
watch(urlSearchQuery, (urlSearchQuery) => {
  if (urlSearchQuery == undefined) {
    name.value = ''
  }
})

useKeyboardEvents({ f: bindFilterEvents })

onMounted(() => {
  if (!name.value && route.query.search) {
    name.value = Array.isArray(route.query.search) ? '' : route.query.search
  }

  exist(route.query.search, updateSearch)
  exist(route.query.min, (v) => updatePriceRangeByQuery(v))
  exist(route.query.max, (v) => updatePriceRangeByQuery(undefined, v))
  existArray(route.query.sort as string[], updateSortBy)
  exist(route.query.listed, updateListed)
})
</script>
