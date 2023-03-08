<template>
  <v-tippy
    class="is-flex"
    interactive
    :animate-fill="false"
    placement="bottom"
    :delay="[showDelay, hideDelay]"
    data-cy="identity"
    :on-show="() => (show = true)">
    <template #trigger>
      <slot name="trigger" />
    </template>

    <div class="popover-container">
      <CollectionDetailsPopoverContent v-if="show" :nft="nft" />
    </div>
  </v-tippy>
</template>

<script lang="ts" setup>
import { CarouselNFT } from '../base/types'
import CollectionDetailsPopoverContent from './CollectionDetailsPopoverContent.vue'

withDefaults(
  defineProps<{
    nft: CarouselNFT
    showDelay?: number
    hideDelay?: number
  }>(),
  {
    showDelay: 0,
    hideDelay: 0,
  }
)

const show = ref(false)
</script>

<style lang="scss" scoped>
.popover-container {
  min-height: 12.5rem;
}
</style>
