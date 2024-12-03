<template>
  <transition name="slide">
    <div
      v-if="listingCartStore.count"
      class="listing-container"
    >
      <div class="inline-flex items-center">
        <div
          class="k-shadow bg-background-color border flex items-center !py-[0.875rem] px-6 gap-8"
        >
          <div class="inline-flex items-center">
            <div>
              <b>{{ listingCartStore.count }}</b>
              {{ $t('listingCart.item', listingCartStore.count) }}
            </div>
            <div class="mx-4" />
            <NeoButton
              :disabled="!listingCartStore.count"
              class="!text-k-grey selection-button"
              variant="text"
              no-shadow
              @click="listingCartStore.clearListedItems"
            >
              {{ $t('sort.clearAll') }}
            </NeoButton>
            <div class="mx-4 divider bg-k-grey" />
            <NeoButton
              variant="text"
              class="!text-k-grey selection-button"
              no-shadow
              @click="listingCartStore.addAllToCart"
            >
              {{ $t('listingCart.selectAll') }}
            </NeoButton>
          </div>

          <div class="flex gap-4">
            <NeoTooltip
              class="cursor-pointer"
              position="top"
              :active="isItemTransferDisabled"
              :label="$t('toast.unsupportedOperation')"
            >
              <NeoButton
                variant="outlined-rounded"
                icon="fire-flame-simple"
                :disabled="isItemTransferDisabled"
                @click="preferencesStore.userCartModal = undefined"
              >
                {{ $t('burn') }}
              </NeoButton>
            </NeoTooltip>

            <NeoTooltip
              class="cursor-pointer"
              position="top"
              :active="isItemTransferDisabled"
              :label="$t('toast.unsupportedOperation')"
            >
              <NeoButton
                variant="outlined-rounded"
                icon="paper-plane-top"
                :disabled="isItemTransferDisabled"
                @click="preferencesStore.userCartModal = { open: true, mode: 'transfer' }"
              >
                {{ $t('transfer') }}
              </NeoButton>
            </NeoTooltip>

            <NeoTooltip
              class="cursor-pointer"
              position="top"
              :active="isListingDisabled"
              :label="$t('toast.unsupportedOperation')"
            >
              <NeoButton
                variant="primary-rounded"
                :disabled="isListingDisabled"
                @click="preferencesStore.listingCartModalOpen = true"
              >
                {{ $t('listingCart.listItem', listingCartStore.count) }}
              </NeoButton>
            </NeoTooltip>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { NeoButton, NeoTooltip } from '@kodadot1/brick'
import { useListingCartStore } from '@/stores/listingCart'
import { usePreferencesStore } from '@/stores/preferences'
import { listVisible } from '@/utils/config/permission.config'

const listingCartStore = useListingCartStore()
const preferencesStore = usePreferencesStore()
const { urlPrefix } = usePrefix()

const isItemTransferDisabled = computed(() => isSub(urlPrefix.value) ? false : listingCartStore.count > 1)
const isListingDisabled = computed(() => !listVisible(urlPrefix.value))

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
  @apply z-[998];
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
