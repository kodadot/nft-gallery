<template>
  <transition v-if="listingCartStore.count" name="slide">
    <div class="listing-container">
      <div class="is-inline-flex is-align-items-center">
        <div class="k-shadow theme-background-color border py-4 px-6">
          <div class="is-inline-flex is-align-items-center">
            <div>
              <b>{{ listingCartStore.count }}</b>
              {{ $tc('listingCart.item', listingCartStore.count) }}
            </div>
            <div class="mx-4" />
            <NeoButton
              :disabled="!listingCartStore.count"
              class="has-text-grey selection-button"
              variant="text"
              no-shadow
              @click.native="listingCartStore.clearListedItems">
              {{ $t('sort.clearAll') }}
            </NeoButton>
            <div class="mx-4 divider has-background-k-grey" />
            <NeoButton
              variant="text"
              class="has-text-grey selection-button"
              no-shadow
              @click.native="listingCartStore.addAllToCart">
              {{ $t('listingCart.selectAll') }}
            </NeoButton>
          </div>
        </div>
        <NeoButton
          class="h-full no-border-left py-4 px-7"
          :variant="'k-accent'"
          @click.native="preferencesStore.listingCartModalOpen = true">
          {{ $tc('listingCart.listItem', listingCartStore.count) }}
        </NeoButton>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { useListingCartStore } from '@/stores/listingCart'
import { usePreferencesStore } from '@/stores/preferences'
const listingCartStore = useListingCartStore()
const preferencesStore = usePreferencesStore()

onBeforeUnmount(() => {
  listingCartStore.clear()
})
</script>
<style scoped lang="scss">
@import '@/styles/abstracts/variables.scss';

.listing-container {
  position: fixed;
  right: 96px;
  bottom: 36px;
  z-index: 998;
  .selection-button:not([disabled='disabled']):hover {
    @include ktheme() {
      color: theme('text-color') !important;
    }
  }
  .divider {
    width: 1px;
    height: 1rem;
  }
}
</style>
