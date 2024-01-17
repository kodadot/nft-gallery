<template>
  <transition name="slide">
    <div v-if="listingCartStore.count" class="listing-container">
      <div class="inline-flex items-center">
        <div class="k-shadow bg-background-color border py-4 px-6">
          <div class="inline-flex items-center">
            <div>
              <b>{{ listingCartStore.count }}</b>
              {{ $t('listingCart.item', listingCartStore.count) }}
            </div>
            <div class="mx-4" />
            <NeoButton
              :disabled="!listingCartStore.count"
              class="text-k-grey selection-button"
              variant="text"
              no-shadow
              @click="listingCartStore.clearListedItems">
              {{ $t('sort.clearAll') }}
            </NeoButton>
            <div class="mx-4 divider bg-k-grey" />
            <NeoButton
              variant="text"
              class="text-k-grey selection-button"
              no-shadow
              @click="listingCartStore.addAllToCart">
              {{ $t('listingCart.selectAll') }}
            </NeoButton>
          </div>
        </div>
        <NeoButton
          class="h-full border-l-0 py-4 px-7"
          :variant="'k-accent'"
          @click="preferencesStore.listingCartModalOpen = true">
          {{ $t('listingCart.listItem', listingCartStore.count) }}
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
@import '@/assets/styles/abstracts/variables.scss';

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
