<template>
  <div>
    <div v-if="showCurrentFloorPrice" class="pt-4">
      {{ $t('listingCart.collectionFloorPrice') }}
      <span v-if="floorPricePercentAdjustment !== 1" class="has-text-grey"
        >{{ (floorPricePercentAdjustment * 100 - 100).toFixed(0) }}%</span
      >
    </div>
    <div class="py-2 is-flex is-justify-content-start is-flex-grow-1">
      <NeoButton
        class="mr-2"
        label="-5%"
        rounded
        :disabled="isDisabled"
        no-shadow
        @click="
          floorPricePercentAdjustment > 0.05 &&
            (floorPricePercentAdjustment -= 0.05)
        " />
      <NeoButton
        class="mr-2"
        :label="$t('statsOverview.floorPrice')"
        :disabled="isDisabled"
        rounded
        no-shadow
        @click="floorPricePercentAdjustment = 1" />
      <NeoButton
        label="+5%"
        :disabled="isDisabled"
        rounded
        no-shadow
        @click="floorPricePercentAdjustment += 0.05" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { useListingCartStore } from '@/stores/listingCart'

const emit = defineEmits(['input'])

const props = defineProps<{
  value: number
  showCurrentFloorPrice?: boolean
}>()

const listingCartStore = useListingCartStore()

const floorPricePercentAdjustment = useVModel(props, 'value', emit, {
  eventName: 'input',
})

const isDisabled = computed(
  () =>
    !listingCartStore.itemsInChain
      .map((item) => item.collection.floor || 0)
      .some(Boolean),
)
</script>
