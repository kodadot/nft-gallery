<template>
  <div :class="{ 'fluid-padding-left': fluidPadding }">
    <div class="p-4">
      <NeoField>
        <NeoCheckbox
          v-model="artView"
          data-testid="filter-artview-checkbox"
        >
          <div class="inline-flex items-center">
            <span>{{ $t('filters.artView') }}</span>
            <KIcon
              class="ml-2"
              size="small"
              name="i-mdi:vector-square"
            />
          </div>
        </NeoCheckbox>
      </NeoField>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoCheckbox, NeoField } from '@kodadot1/brick'
import { useExploreFiltersStore } from '@/stores/exploreFilters'

const exploreFiltersStore = useExploreFiltersStore()
const route = useRoute()
const { replaceUrl: replaceURL } = useReplaceUrl()

type DataModel = 'query' | 'store'

const props = withDefaults(
  defineProps<{
    dataModel?: DataModel
    fluidPadding?: boolean
  }>(),
  {
    dataModel: 'query',
    fluidPadding: false,
  },
)

const emit = defineEmits(['resetPage'])

const artView
  = props.dataModel === 'query'
    ? computed({
      get: () => route.query?.art_view?.toString() === 'true',
      set: value => applyToUrl({ art_view: String(value) }),
    })
    : computed({
      get: () => exploreFiltersStore.artView,
      set: value => exploreFiltersStore.setArtView(value),
    })

const applyToUrl = (queryCondition: Record<string, string>) => {
  replaceURL(queryCondition)
  emit('resetPage')
}
</script>
