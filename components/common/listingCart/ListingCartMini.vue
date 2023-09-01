<template>
  <transition v-if="listingCartStore.count" name="slide">
    <div class="listing-container">
      <div class="is-inline-flex is-align-items-center">
        <div class="k-shadow theme-background-color border py-2">
          <div class="is-inline-flex is-align-items-center mx-5">
            <div>
              <b>{{ listingCartStore.count }}</b> items
            </div>
            <div class="bar mx-4" />
            <NeoButton
              :disabled="!listingCartStore.count"
              variant="text"
              no-shadow
              @click.native="listingCartStore.clear">
              Clear All
            </NeoButton>
            <div class="bar mx-4" />
            <NeoButton
              variant="text"
              no-shadow
              @click.native="listingCartStore.addAllToCart">
              Select All
            </NeoButton>
          </div>
        </div>
        <NeoButton
          class="height-100"
          :variant="'k-accent'"
          @click.native="list">
          List Items
        </NeoButton>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { useListingCartStore } from '@/stores/listingCart'
import { usePreferencesStore } from '~/stores/preferences'
const listingCartStore = useListingCartStore()
const preferencesStore = usePreferencesStore()

function list() {
  preferencesStore.listingCartModalOpen = true
}
</script>
<style scoped lang="scss">
.listing-container {
  position: fixed;
  right: 80px;
  bottom: 50px;
  z-index: 998;
}

.height-100 {
  height: 100%;
}
</style>
