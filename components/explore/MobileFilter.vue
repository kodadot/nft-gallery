<template>
  <b-modal
    :active="open"
    :on-cancel="closeFilterModal"
    :can-cancel="['escape']"
    class="is-hidden-tablet top background-white"
    full-screen>
    <div class="is-flex is-flex-direction-column is-fullheight is-fullwidth">
      <div class="is-flex-grow-1">
        <div
          class="is-flex is-justify-content-space-between px-4 py-3 border-bottom">
          <div>Filters</div>
          <div class="filters-close">
            <b-icon icon="x" @click.native="closeFilterModal"></b-icon>
          </div>
        </div>
        <div class="border-bottom">
          <PriceFilter />
        </div>
        <StatusFilter :is-immediate="false" />
      </div>

      <div
        class="is-flex is-flex-direction-row is-justify-content-space-between px-4 py-3 border-top">
        <NeoButton
          label="Reset All"
          variant="primary"
          size="large"
          @click.native="resetFilters" />
        <NeoButton
          label="Apply"
          variant="k-accent"
          size="large"
          @click.native="applyFilters" />
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
const emit = defineEmits(['resetPage'])

const { replaceUrl } = useReplaceUrl()

const open = computed(
  () => $store.getters['preferences/getSidebarfilterCollapse']
)

const closeFilterModal = () => {
  $store.dispatch('preferences/setSidebarfilterCollapse', false)
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
  border-bottom: 1px solid $black;
}
.border-top {
  border-top: 1px solid $black;
}
.top {
  z-index: 1000;
}
</style>

<style>
.modal-content {
  background-color: white !important;
}
</style>
