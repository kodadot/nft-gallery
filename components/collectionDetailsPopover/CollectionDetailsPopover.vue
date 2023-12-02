<template>
  <tippy
    :append-to="body"
    placement="bottom"
    :delay="[showDelay, hideDelay]"
    data-testid="identity"
    @show="triggered = true">
    <slot name="content" />

    <template #content>
      <div class="popover-container">
        <CollectionDetailsPopoverContent v-if="triggered" :nft="nft" />
      </div>
    </template>
  </tippy>
</template>

<script lang="ts" setup>
import type { CarouselNFT } from '../base/types'
import CollectionDetailsPopoverContent from './CollectionDetailsPopoverContent.vue'

const body = ref()
const triggered = ref(false)

onMounted(() => {
  body.value = document.body
})

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
