<template>
  <b-modal
    v-if="isMobile"
    :active="open"
    :on-cancel="closeFilterModal"
    :can-cancel="['escape']"
    class="top"
    full-screen>
    <div class="is-flex is-flex-direction-column is-fullheight is-fullwidth">
      <div class="is-flex-grow-1">
        <div
          class="is-flex is-justify-content-space-between px-4 py-3 border-bottom">
          <div>{{ $t('general.filters') }}</div>
          <div class="filters-close">
            <b-icon icon="x" @click.native="closeFilterModal"></b-icon>
          </div>
        </div>
        <div class="border-bottom">
          <StatusFilter :is-immediate="false" :expanded="true" />
        </div>
        <PriceFilter :expanded="true" />
      </div>

      <div
        class="is-flex is-flex-direction-row is-justify-content-space-between px-4 py-3 border-top">
        <NeoButton
          label="Reset All"
          variant="primary"
          class="w-9 h-3_5"
          @click.native="resetFilters">
          {{ $t('general.resetAll') }}
        </NeoButton>
        <NeoButton
          variant="k-accent"
          class="w-9 h-3_5"
          @click.native="applyFilters">
          {{ $t('general.apply') }}
        </NeoButton>
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import PriceFilter from './filters/PriceFilter.vue'
import StatusFilter from './filters/StatusFilter.vue'
import useReplaceUrl from './filters/useReplaceUrl'

const { $store } = useNuxtApp()
const { replaceUrl } = useReplaceUrl()
const width = ref(window.innerWidth)

onMounted(() =>
  window.addEventListener('resize', () => {
    width.value = window.innerWidth
  })
)

const emit = defineEmits(['resetPage'])

const isMobile = computed(() => width.value <= 768)

const open = computed(
  () => $store.getters['preferences/getExploreFilterCollapse']
)

const closeFilterModal = () => {
  $store.dispatch('preferences/setExploreFilterCollapse', false)
}

const resetFilters = () => {
  // set store to defaults
  $store.dispatch('exploreFilters/setListed', false)
  $store.dispatch('exploreFilters/setOwned', false)
  // price
  const priceDefaults = {
    min: undefined,
    max: undefined,
  }

  replaceUrl({
    ...$store.getters['exploreFilters/getStatusFilters'],
    ...priceDefaults,
  })
  emit('resetPage')
  closeFilterModal()
}

const applyFilters = () => {
  // status filters
  const statusFilters = $store.getters['exploreFilters/getStatusFilters']

  // apply to URL
  replaceUrl(statusFilters)
  emit('resetPage')
  closeFilterModal()
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
.is-fullwidth {
  width: 100%;
}
.is-fullheight {
  height: 100%;
}
.border-bottom {
  @include ktheme() {
    border-bottom: 1px solid theme('border-color');
  }
}
.border-top {
  @include ktheme() {
    border-top: 1px solid theme('border-color');
  }
}
.top {
  z-index: 1000;
}
.h-3_5 {
  height: 3.5rem !important;
}
.w-9 {
  width: 9rem;
}
</style>

<style lang="scss">
@import '@/styles/abstracts/variables';

.modal-content {
  @include ktheme() {
    background-color: theme('background-color') !important;
  }
}
</style>
