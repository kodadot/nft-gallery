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
      <o-field
        v-for="collection in collections"
        :key="collection.id"
        class="min-width-0 is-flex">
        <NeoCheckbox v-model="listed" class="mr-0"> </NeoCheckbox>
        <div class="is-flex is-align-items-center filter-container min-width-0">
          <img src="/placeholder.webp" class="image is-32x32 border mr-2" />
          <div class="is-flex is-flex-direction-column min-width-0">
            <NeoTooltip :label="collection.meta.name" :append-to-body="false">
              <div class="is-ellipsis no-wrap">
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
      <b-field>
        <NeoCheckbox v-model="owned" :disabled="!accountId">
          {{ $t('sort.own') }}</NeoCheckbox
        >
      </b-field>
    </div>
  </b-collapse>
</template>

<script lang="ts" setup>
import { NeoCheckbox, NeoTooltip } from '@kodadot1/brick'
import { useExploreFiltersStore } from '@/stores/exploreFilters'
import { usePopularCollections } from './usePopularCollections'
import { OField } from '@oruga-ui/oruga'

const exploreFiltersStore = useExploreFiltersStore()
const route = useRoute()
const { accountId } = useAuth()
const { replaceUrl: replaceURL } = useReplaceUrl()

const { collections } = usePopularCollections()
console.log('🚀 ~ file: PopularCollections.vue:60 ~ collections:', collections)

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

const applyToUrl = (queryCondition: { [key: string]: any }) => {
  replaceURL(queryCondition)
  emit('resetPage')
}
</script>
<style lang="scss">
.min-width-0 {
  min-width: 0;
}
.min-width-0 .o-field__body {
  min-width: 0;
}
</style>
