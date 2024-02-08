<template>
  <tippy
    :append-to="body"
    placement="bottom"
    class="hidden md:block"
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

  <nuxt-link
    :to="`/${urlPrefix}/collection/${collection?.id}`"
    class="has-text-link block md:hidden">
    {{ collection?.name || collection?.id }}
  </nuxt-link>
</template>

<script lang="ts" setup>
import type { CarouselNFT } from '../base/types'
import { Collection } from '../unique/types'
import CollectionDetailsPopoverContent from './CollectionDetailsPopoverContent.vue'

const body = ref(document.body)
const triggered = ref(false)
const { urlPrefix } = usePrefix()

withDefaults(
  defineProps<{
    collection: Collection
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
