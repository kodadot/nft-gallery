<template>
  <b-collapse
    :open="expanded"
    animation="slide"
    class="border-bottom"
    :class="{ 'fluid-padding-left': fluidPadding }">
    <template #trigger="{ open }">
      <div class="is-flex" role="button" :aria-expanded="open">
        <p class="card-header-title has-text-weight-normal">
          {{ $t('general.popularCollectionsHeading') }}
        </p>
        <a class="card-header-icon">
          <b-icon :icon="open ? 'minus' : 'plus'" />
        </a>
      </div>
    </template>
    <div class="p-4">
      <o-field v-for="collection in collections" :key="collection.id">
        <NeoCheckbox
          :value="checkedCollections.includes(collection.id)"
          class="mr-0 w-100"
          label-class="is-flex-grow-1"
          @input="toggleCollection(collection)">
          <div
            class="is-flex is-align-items-center filter-container pl-2 is-flex-grow-1 min-width-0">
            <img
              :src="sanitizeIpfsUrl(collection.meta.image)"
              class="image is-32x32 border mr-2" />
            <div
              class="is-flex is-flex-direction-column is-flex-grow-1 min-width-0">
              <NeoTooltip
                :label="collection.meta.name || collection.id"
                append-to-body
                :delay="1000">
                <div class="is-ellipsis">
                  {{ collection.meta.name || collection.id }}
                </div>
              </NeoTooltip>
              <div
                class="is-flex is-justify-content-space-between is-size-7 has-text-grey">
                <div>{{ $t('search.owners') }}: {{ collection.owners }}</div>
                <div>{{ getChainName(collection.chain) }}</div>
              </div>
            </div>
          </div>
        </NeoCheckbox>
      </o-field>
    </div>
  </b-collapse>
</template>

<script lang="ts" setup>
import { NeoCheckbox, NeoTooltip } from '@kodadot1/brick'
import { useExploreFiltersStore } from '@/stores/exploreFilters'
import { Collection, usePopularCollections } from './usePopularCollections'
import { OField } from '@oruga-ui/oruga'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

const exploreFiltersStore = useExploreFiltersStore()
const route = useRoute()
const router = useRouter()
const { replaceUrl: replaceURL } = useReplaceUrl()
const { collections } = usePopularCollections()
const { availableChains } = useChain()
const { urlPrefix } = usePrefix()
const { $store } = useNuxtApp()

const getChainName = (chain: string): string => {
  return availableChains.value.find((x) => x.value === chain)?.text || ''
}

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
  }
)

const emit = defineEmits(['resetPage'])

const checkedCollections = ref<string[]>([])

const toggleCollection = (collection: Collection) => {
  const index = checkedCollections.value.indexOf(collection.id)
  if (index > -1) {
    checkedCollections.value.splice(index, 1)
  } else {
    checkedCollections.value.push(collection.id)
  }
  if (urlPrefix.value !== collection.chain) {
    $store.dispatch('setUrlPrefix', collection.chain)
    const { page, ...restQuery } = route.query
    router.push({
      params: {
        prefix: collection.chain,
      },
      query: {
        ...restQuery,
        collection: checkedCollections.value.join(','),
      },
    })
  } else {
    toggleSearchParam()
  }
}

const getSearchParam = () => {
  if (props.dataModel === 'query') {
    checkedCollections.value =
      (route.query?.collection as string)?.split(',').filter((x) => !!x) || []
  } else {
    checkedCollections.value = exploreFiltersStore.collections || []
  }
}

const toggleSearchParam = () => {
  if (props.dataModel === 'query') {
    applyToUrl()
  } else {
    exploreFiltersStore.setCollections(checkedCollections.value)
  }
}

const applyToUrl = () => {
  replaceURL({ collection: checkedCollections.value.join(',') })
  emit('resetPage')
}

watch(
  () => {
    if (props.dataModel === 'query') {
      return (route.query?.collection as string)?.split(',')
    } else {
      return exploreFiltersStore.collections
    }
  },
  getSearchParam,
  {
    immediate: true,
  }
)
</script>
<style lang="scss" scoped>
.min-width-0 {
  min-width: 0;
}
:deep .neo-checkbox > span {
  max-width: calc(100% - 1rem);
  .o-tip__trigger {
    max-width: 100%;
  }
}
</style>
