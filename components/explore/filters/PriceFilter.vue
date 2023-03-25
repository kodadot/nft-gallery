<template>
  <b-collapse
    :open="expanded"
    animation="slide"
    class="border-bottom"
    :class="{ 'fluid-padding-left': fluidPadding }">
    <template #trigger="{ open }">
      <div class="is-flex" role="button" :aria-expanded="open">
        <p class="card-header-title has-text-weight-normal">
          {{ $t('tabs.tabActivity.price') }}
        </p>
        <a class="card-header-icon">
          <b-icon :icon="open ? 'minus' : 'plus'" />
        </a>
      </div>
    </template>
    <form class="p-4" @submit.prevent="apply">
      <div
        class="is-flex input-container mb-4"
        :class="[inputFocused ? 'input-focused' : '']">
        <b-input
          v-model="range.min"
          custom-class="input-sidebar"
          type="number"
          min="0"
          step="any"
          placeholder="MIN"
          data-cy="input-min"
          @focus="toggleInputFocused"
          @blur="toggleInputFocused" />
        <div class="is-flex is-align-items-center">
          <svg
            width="28"
            height="8"
            viewBox="0 0 28 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M27.3536 4.35355C27.5488 4.15829 27.5488 3.84171 27.3536 3.64645L24.1716 0.464466C23.9763 0.269204 23.6597 0.269204 23.4645 0.464466C23.2692 0.659728 23.2692 0.976311 23.4645 1.17157L26.2929 4L23.4645 6.82843C23.2692 7.02369 23.2692 7.34027 23.4645 7.53553C23.6597 7.7308 23.9763 7.7308 24.1716 7.53553L27.3536 4.35355ZM0 4.5H27V3.5H0V4.5Z"
              fill="currentColor" />
          </svg>
        </div>
        <b-input
          v-model="range.max"
          custom-class="input-sidebar"
          min="0"
          step="any"
          type="number"
          placeholder="MAX"
          data-cy="input-max"
          @focus="toggleInputFocused"
          @blur="toggleInputFocused" />
      </div>
      <div class="is-flex">
        <div class="unit mr-2 is-flex is-align-items-center py-1 px-3">
          {{ unit }}
        </div>
        <NeoButton
          data-cy="apply"
          :disabled="!isValidFilter(range.min, range.max)"
          no-shadow
          variant="k-accent"
          expanded
          @click.native="apply">
          {{ $t('general.apply') }}
        </NeoButton>
      </div>
    </form>
  </b-collapse>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import { fromDecimals, toDecimals } from '@/utils/math'
import useReplaceUrl from './useReplaceUrl'
import { useExploreFiltersStore } from '@/stores/exploreFilters'

const exploreFiltersStore = useExploreFiltersStore()
const { replaceUrl } = useReplaceUrl()
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

const route = useRoute()
const { decimals, unit } = useChain()

const range =
  props.dataModel === 'query'
    ? ref({
        min:
          fromDecimals(Number(route.query?.min), decimals.value) || undefined,
        max:
          fromDecimals(Number(route.query?.max), decimals.value) || undefined,
      })
    : ref({
        min: fromDecimals(Number(exploreFiltersStore.min), decimals.value),
        max: fromDecimals(Number(exploreFiltersStore.max), decimals.value),
      })

const emit = defineEmits(['resetPage'])
const apply = () => {
  if (props.dataModel === 'query') {
    applyToQuery()
  }
  if (props.dataModel === 'store') {
    applyToStore()
  }
}

const applyToStore = () => {
  const min = range.value.min
    ? toDecimals(range.value.min, decimals.value)
    : undefined
  const max = range.value.max
    ? toDecimals(range.value.max, decimals.value)
    : undefined
  exploreFiltersStore.setPriceRange({ min, max })
  exploreFiltersStore.setListed(true)
}

const applyToQuery = () => {
  const priceMin = range.value.min
    ? String(toDecimals(range.value.min, decimals.value))
    : undefined
  const priceMax = range.value.max
    ? String(toDecimals(range.value.max, decimals.value))
    : undefined

  replaceUrl({ listed: String(true), min: priceMin, max: priceMax })
  emit('resetPage')
}
const isValidFilter = (
  min: number | string | undefined,
  max: number | string | undefined
): boolean => {
  const minValue = typeof min === 'string' ? min.trim() : min
  const maxValue = typeof max === 'string' ? max.trim() : max
  return ((minValue || maxValue) &&
    (!minValue || !maxValue || Number(maxValue) > Number(minValue))) as boolean
}

const inputFocused = ref(false)

const toggleInputFocused = (): void => {
  inputFocused.value = !inputFocused.value
}
</script>

<style lang="scss">
@import '@/styles/abstracts/variables';

.input-container {
  @include ktheme() {
    border: 1px solid theme('text-color');
  }
  .input-sidebar {
    border: none !important;
    &:focus {
      border: none !important;
      box-shadow: none !important;
    }
  }
}

.unit {
  @include ktheme() {
    border: 1px solid theme('text-color');
  }
}

.input-focused {
  @include ktheme() {
    box-shadow: 0 0 0 1px theme('k-blue');
  }
}
</style>
