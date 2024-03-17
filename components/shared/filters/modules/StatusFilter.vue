<template>
  <NeoCollapse
    :open="expanded"
    animation="slide"
    class="border-b"
    :class="{ 'fluid-padding-left': fluidPadding }">
    <template #trigger="{ open }">
      <div class="flex" role="button" :aria-expanded="open">
        <p class="card-header-title font-normal">
          {{ $t('massmint.status') }}
        </p>
        <a class="card-header-icon">
          <NeoIcon :icon="open ? 'minus' : 'plus'" />
        </a>
      </div>
    </template>
    <div class="p-4">
      <NeoField>
        <NeoCheckbox v-model="listed" data-testid="filter-checkbox-buynow">
          {{ $t(ListedOrBuynow) }}</NeoCheckbox
        >
      </NeoField>
      <NeoField v-if="!isCollectibles">
        <NeoCheckbox v-model="owned" :disabled="!accountId">
          {{ $t('sort.own') }}
        </NeoCheckbox>
      </NeoField>
      <NeoField v-if="isCollectibles">
        <div>More than {{ moreThanItems }} nfts</div>
        <NeoInput
          v-model="moreThanItems"
          type="number"
          min="0"
          step="any"
          placeholder="0" />
      </NeoField>
    </div>
  </NeoCollapse>
</template>

<script lang="ts" setup>
import { useExploreFiltersStore } from '@/stores/exploreFilters'
import {
  NeoCheckbox,
  NeoCollapse,
  NeoField,
  NeoIcon,
  NeoInput,
} from '@kodadot1/brick'

const exploreFiltersStore = useExploreFiltersStore()
const route = useRoute()
const { accountId } = useAuth()
const { replaceUrl: replaceURL } = useReplaceUrl()
const { urlPrefix } = usePrefix()
const { isRemark } = useIsChain(urlPrefix)
const isCollectibles = computed(
  () => route.name === 'prefix-explore-collectibles',
)

type DataModel = 'query' | 'store'

const props = withDefaults(
  defineProps<{
    expanded?: boolean
    dataModel?: DataModel
    fluidPadding?: boolean
  }>(),
  {
    expanded: false,
    dataModel: 'query',
    fluidPadding: false,
  },
)

const ListedOrBuynow = computed(() =>
  isRemark.value ? 'sort.listed_RMRK' : 'sort.listed',
)

const emit = defineEmits(['resetPage'])

const listed =
  props.dataModel === 'query'
    ? computed({
        get: () => route.query?.listed?.toString() === 'true',
        set: (value) => applyToUrl({ listed: String(value) }),
      })
    : computed({
        get: () => exploreFiltersStore.listed,
        set: (value) => exploreFiltersStore.setListed(value),
      })

const owned =
  props.dataModel === 'query'
    ? computed({
        get: () => route.query?.owned?.toString() === 'true',
        set: (value) => applyToUrl({ owned: String(value) }),
      })
    : computed({
        get: () => exploreFiltersStore.owned,
        set: (value) => exploreFiltersStore.setOwned(value),
      })

const moreThanItems =
  props.dataModel === 'query'
    ? computed({
        get: () => route.query?.moreThanItems,
        set: (value) => applyToUrl({ moreThanItems: value }),
      })
    : computed({
        get: () => exploreFiltersStore.moreThanItems,
        set: (value) => exploreFiltersStore.setMoreThanItems(value),
      })

const applyToUrl = (queryCondition: { [key: string]: any }) => {
  replaceURL(queryCondition)
  emit('resetPage')
}
</script>
