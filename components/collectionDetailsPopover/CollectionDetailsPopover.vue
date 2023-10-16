<template>
  <tippy
    interactive
    :animate-fill="false"
    :append-to="body"
    placement="bottom"
    :delay="[showDelay, hideDelay]"
    data-testid="identity"
    :on-show="() => (show = true)">
    <slot name="content" />

    <template #content>
      <div class="popover-container">
        <CollectionDetailsPopoverContent v-if="show" :nft="nft" />
      </div>
    </template>
  </tippy>
</template>

<script lang="ts" setup>
import { CarouselNFT } from '../base/types'
import CollectionDetailsPopoverContent from './CollectionDetailsPopoverContent.vue'

const body = ref(document.body)

withDefaults(
  defineProps<{
    nft: CarouselNFT
    showDelay?: number
    hideDelay?: number
  }>(),
  {
    showDelay: 0,
    hideDelay: 0,
  },
)

const show = ref(false)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.popover-container {
  min-height: 12.5rem;
  @include ktheme() {
    background: theme('background-color');
  }
}
</style>
