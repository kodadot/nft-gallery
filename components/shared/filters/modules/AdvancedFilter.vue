<template>
  <NeoCollapse
    :open="expanded"
    animation="slide"
    :class="{ 'fluid-padding-left': fluidPadding }">
    <template #trigger="{ open }">
      <div
        class="is-flex is-justify-content-space-between"
        role="button"
        :aria-expanded="open">
        <p class="filter-title">
          <span>{{ $t('advancedFilters') }}</span>
          <span v-if="artView" class="filter-title-active-status"
            >({{ $t('offer.active') }})</span
          >
        </p>
        <a class="filter-title-icon card-header-icon">
          <NeoIcon
            size="small"
            :icon="open ? 'chevron-down' : 'chevron-right'" />
        </a>
      </div>
    </template>
    <div class="px-4">
      <NeoField>
        <NeoCheckbox v-model="artView" data-testid="filter-checkbox-buynow">
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

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.filter-title {
  padding: 12px 16px;
  font-size: 0.75rem;

  @include ktheme() {
    color: theme('k-grey');
  }
}

.filter-title-icon {
  margin-right: 4px;

  @include ktheme() {
    color: theme('k-grey');
  }
}

.filter-title-active-status {
  padding-left: 10px;

  @include ktheme() {
    color: theme('k-primary');
  }
}
</style>
