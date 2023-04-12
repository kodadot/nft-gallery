<template>
  <b-collapse
    :open="expanded"
    animation="slide"
    class="border-bottom"
    :class="{ 'fluid-padding-left': fluidPadding }">
    <template #trigger="{ open }">
      <div class="is-flex" role="button" :aria-expanded="open">
        <p class="card-header-title has-text-weight-normal">
          Popular Collections
        </p>
        <a class="card-header-icon">
          <b-icon :icon="open ? 'minus' : 'plus'" />
        </a>
      </div>
    </template>
    <div class="p-4 width-320">
      <o-field v-for="collection in collections" :key="collection.id">
        <NeoCheckbox
          :value="checkedCollection.includes(collection.id)"
          class="mr-0"
          @input="toggleCollection(collection.id)">
        </NeoCheckbox>
        <div
          class="is-flex is-align-items-center filter-container pl-2 is-flex-grow-1 min-width-0">
          <img
            :src="sanitizeIpfsUrl(collection.meta.image)"
            class="image is-32x32 border mr-2" />
          <div
            class="is-flex is-flex-direction-column is-flex-grow-1 min-width-0">
            <NeoTooltip :label="collection.meta.name" :append-to-body="false">
              <div class="is-ellipsis">
                {{ collection.meta.name }}
              </div>
            </NeoTooltip>
            <div
              class="is-flex is-justify-content-space-between is-size-7 has-text-grey">
              <div>Owners: {{ collection.nftCount }}</div>
              <div>{{ collection.chain }}</div>
            </div>
          </div>
        </div>
      </o-field>
    </div>
  </b-collapse>
</template>

<script lang="ts" setup>
import { NeoCheckbox, NeoTooltip } from '@kodadot1/brick'
import { useExploreFiltersStore } from '@/stores/exploreFilters'
import { usePopularCollections } from './usePopularCollections'
import { OField } from '@oruga-ui/oruga'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

const exploreFiltersStore = useExploreFiltersStore()
const route = useRoute()
const { replaceUrl: replaceURL } = useReplaceUrl()

const { collections } = usePopularCollections()

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

const checkedCollection = ref<string[]>([])

const toggleCollection = (collectionId: string) => {
  const index = checkedCollection.value.indexOf(collectionId)
  if (index > -1) {
    checkedCollection.value.splice(index, 1)
  } else {
    checkedCollection.value.push(collectionId)
  }
  toggleSearchParam()
}

const getSearchParam = () => {
  if (props.dataModel === 'query') {
    checkedCollection.value = route.query?.collection?.split(',') || []
  } else {
    checkedCollection.value = exploreFiltersStore.collection || []
  }
}

const toggleSearchParam = () => {
  if (props.dataModel === 'query') {
    applyToUrl({ collection: checkedCollection.value.join(',') })
  } else {
    exploreFiltersStore.setCollection(checkedCollection.value)
  }
}

const applyToUrl = (queryCondition: { [key: string]: any }) => {
  replaceURL(queryCondition)
  emit('resetPage')
}

getSearchParam()
</script>
<style lang="scss" scoped>
.min-width-0 {
  min-width: 0;
}
</style>
