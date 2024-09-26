<template>
  <div :class="{ 'fluid-padding-left': fluidPadding }">
    <div class="p-4">
      <NeoField>
        <NeoCheckbox
          v-model="artView"
          data-testid="filter-artview-checkbox"
        >
          <span>{{ $t('filters.artView') }}</span>
          <NeoIcon
            class="ml-2"
            size="small"
            icon="frame"
          />
        </NeoCheckbox>
      </NeoField>
      <NeoField v-if="artGenModeFeatureEnabled">
        <NeoCheckbox
          v-model="artGen"
          data-testid="filter-artgen-checkbox"
        >
          <span>{{ $t('filters.artGen') }}</span>
          <NeoIcon
            class="ml-2"
            size="small"
            icon="puzzle-piece"
            pack="fal"
          />
        </NeoCheckbox>
      </NeoField>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoCheckbox, NeoField, NeoIcon } from '@kodadot1/brick'
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
const { artGenModeFeatureEnabled } = useArtGenMode()
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

const artGen = props.dataModel === 'query'
  ? computed({
    get: () => route.query?.art_gen?.toString() === 'true',
    set: value => applyToUrl({ art_gen: String(value) }),
  })
  : computed({
    get: () => exploreFiltersStore.artGen,
    set: value => exploreFiltersStore.setArtGen(value),
  })

const applyToUrl = (queryCondition: Record<string, string>) => {
  replaceURL(queryCondition)
  emit('resetPage')
}
</script>
