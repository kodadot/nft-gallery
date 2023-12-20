<template>
  <NeoCollapse
    :open="expanded"
    animation="slide"
    :class="{ 'fluid-padding-left': fluidPadding }">
    <template #trigger="{ open }">
      <div class="flex justify-between" role="button" :aria-expanded="open">
        <p class="py-3 px-4 is-size-7 has-text-grey">
          <span data-testid="advanced-filter-collapsible">{{
            $t('advancedFilters')
          }}</span>
          <span v-if="artView" class="ml-2 has-text-primary"
            >({{ $t('offer.active') }})</span
          >
        </p>
        <a class="card-header-icon mr-1 has-text-grey">
          <NeoIcon
            size="small"
            :icon="open ? 'chevron-down' : 'chevron-right'" />
        </a>
      </div>
    </template>
    <div class="px-4 pb-4">
      <NeoField>
        <NeoCheckbox v-model="artView" data-testid="filter-artview-checkbox">
          <span>{{ $t('filters.artView') }}</span>
          <NeoIcon class="ml-2" size="small" icon="frame" />
        </NeoCheckbox>
      </NeoField>
    </div>
  </NeoCollapse>
</template>

<script lang="ts" setup>
import { useExploreFiltersStore } from '@/stores/exploreFilters'
import { NeoCheckbox, NeoCollapse, NeoField, NeoIcon } from '@kodadot1/brick'

const exploreFiltersStore = useExploreFiltersStore()
const route = useRoute()
const { replaceUrl: replaceURL } = useReplaceUrl()

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

const artView =
  props.dataModel === 'query'
    ? computed({
        get: () => route.query?.art_view?.toString() === 'true',
        set: (value) => applyToUrl({ art_view: String(value) }),
      })
    : computed({
        get: () => exploreFiltersStore.artView,
        set: (value) => exploreFiltersStore.setArtView(value),
      })

const applyToUrl = (queryCondition: Record<string, string>) => {
  replaceURL(queryCondition)
  emit('resetPage')
}
</script>
