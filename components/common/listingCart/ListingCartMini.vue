<template>
  <transition v-if="listingCartStore.count" name="slide">
    <div class="listing-container">
      <div class="is-inline-flex is-align-items-center">
        <div class="k-shadow theme-background-color border py-4 px-6">
          <div class="is-inline-flex is-align-items-center">
            <div>
              <b>{{ listingCartStore.count }}</b> {{ $t('items') }}
            </div>
            <div class="mx-4" />
            <NeoButton
              :disabled="!listingCartStore.count"
              class="has-text-grey"
              variant="text"
              no-shadow
              @click.native="listingCartStore.clear">
              {{ $t('sort.clearAll') }}
            </NeoButton>
            <div class="mx-4" />
            <NeoButton
              variant="text"
              class="has-text-grey"
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
          {{ $t('listingCart.listItem') }}
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
</script>
<style scoped lang="scss">
.listing-container {
  position: fixed;
  right: 96px;
  bottom: 36px;
  z-index: 998;
}
</style>
