<template>
  <NeoCollapse
    :open="expanded"
    animation="slide"
    class="border-b"
    :class="{ 'fluid-padding-left': fluidPadding }">
    <template #trigger="{ open }">
      <div class="flex" role="button" :aria-expanded="open">
        <p class="card-header-title font-normal">
          {{ $t('general.popularCollectionsHeading') }}
        </p>
        <a class="card-header-icon">
          <NeoIcon :icon="open ? 'minus' : 'plus'" />
        </a>
      </div>
    </template>
    <div v-if="collections.length > 0" class="p-4">
      <NeoField
        v-for="(collection, index) in collections"
        :key="`${collection.id}-${isCutArray[index].value}`"
        class="mb-2">
        <NeoCheckbox
          :model-value="checkedCollections.includes(collection.id)"
          class="w-full"
          label-class="flex-grow"
          @update:modelValue="toggleCollection(collection)">
          <div
            class="flex items-center filter-container pl-2 flex-grow min-w-0">
            <img
              :src="sanitizeIpfsUrl(collection.meta.image)"
              class="image is-32x32 flex-shrink-0 border mr-2"
              :alt="collection.meta.name || collection.id" />
            <div class="flex flex-col flex-grow min-w-0">
              <NeoTooltip
                :active="isCutArray[index].value"
                :label="collection.meta.name || collection.id"
                multiline
                :delay="1000">
                <div
                  :ref="(el) => assignRefAndUpdateArray(el, index)"
                  class="is-ellipsis">
                  {{ collection.meta.name || collection.id }}
                </div>
              </NeoTooltip>
              <div class="flex justify-between text-xs text-k-grey">
                <div>{{ $t('search.owners') }}: {{ collection.owners }}</div>
                <div class="capitalize">{{ collection.chain }}</div>
              </div>
            </div>
          </div>
        </NeoCheckbox>
      </NeoField>
    </div>
    <div v-else class="p-4 text-base text-k-grey">
      {{ $t('general.noPopularCollections') }}
    </div>
  </NeoCollapse>
</template>

<script lang="ts" setup>
import {
  NeoCheckbox,
  NeoCollapse,
  NeoField,
  NeoIcon,
  NeoTooltip,
} from '@kodadot1/brick'
import { useExploreFiltersStore } from '@/stores/exploreFilters'
import {
  Collection,
  usePopularCollections,
} from '@/composables/popularCollections/usePopularCollections'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { getCollectionIds } from '@/utils/queryParams'
import { useTextOverflow } from '@/composables/useTextOverflow'

const exploreFiltersStore = useExploreFiltersStore()
const route = useRoute()
const router = useRouter()
const { replaceUrl: replaceURL } = useReplaceUrl()
const { urlPrefix, setUrlPrefix } = usePrefix()
const { collections } = usePopularCollections(urlPrefix.value)

const isCutArray = computed(() => collections.value.map(() => ref(false)))

const assignRefAndUpdateArray = (el, index) => {
  const { assignRef, isTextCut } = useTextOverflow()
  assignRef(el)
  watch(isTextCut, () => {
    isCutArray.value[index].value = isTextCut.value
  })
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
  },
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
    setUrlPrefix(collection.chain)
    const { ...restQuery } = route.query
    router.push({
      params: {
        prefix: collection.chain,
      },
      query: {
        ...restQuery,
        collections: checkedCollections.value.join(','),
      },
    })
  } else {
    toggleSearchParam()
  }
}

const getSearchParam = () => {
  if (props.dataModel === 'query') {
    checkedCollections.value = getCollectionIds().filter((id) => !!id) || []
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
  replaceURL({ collections: checkedCollections.value.join(',') })
  emit('resetPage')
}

watch(
  () => {
    if (props.dataModel === 'query') {
      return getCollectionIds()
    } else {
      return exploreFiltersStore.collections
    }
  },
  getSearchParam,
  {
    immediate: true,
  },
)
</script>
<style lang="scss" scoped>
:deep(.neo-checkbox > span) {
  max-width: calc(100% - 1rem);
  .o-tip__trigger {
    max-width: 100%;
  }
}
</style>
