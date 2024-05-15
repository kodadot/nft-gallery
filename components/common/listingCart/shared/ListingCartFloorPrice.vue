<template>
  <div>
    <div v-if="showCurrentFloorPrice" class="pt-4">
      {{ $t('listingCart.collectionFloorPrice') }}
      <span v-if="floorPricePercentAdjustment !== 1" class="text-k-grey"
        >{{ (floorPricePercentAdjustment * 100 - 100).toFixed(0) }}%</span
      >
    </div>
    <div class="py-2 flex justify-start flex-grow">
      <NeoButton
        class="mr-2"
        label="-5%"
        rounded
        :disabled="isDisabled"
        :active="activePlusBtn"
        no-shadow
        @click="
          floorPricePercentAdjustment > 0.05 &&
            (floorPricePercentAdjustment -= 0.05)
        "
        @mousedown="activePlusBtn = true"
        @mouseup="activePlusBtn = false"
        @mouseleave="activePlusBtn = false" />
      <NeoButton
        class="mr-2"
        :label="$t('statsOverview.floorPrice')"
        :disabled="isDisabled"
        :active="activeFloorPriceBtn"
        rounded
        no-shadow
        @click="floorPricePercentAdjustment = 1"
        @mousedown="activeFloorPriceBtn = true"
        @mouseup="activeFloorPriceBtn = false"
        @mouseleave="activeFloorPriceBtn = false" />
      <NeoButton
        label="+5%"
        :disabled="isDisabled"
        :active="activeMinusBtn"
        rounded
        no-shadow
        @click="floorPricePercentAdjustment += 0.05"
        @mousedown="activeMinusBtn = true"
        @mouseup="activeMinusBtn = false"
        @mouseleave="activeMinusBtn = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NeoButton } from '@kodadot1/brick'
import {
  DEFAULT_FLOOR_PRICE_RATE,
  useListingCartStore,
} from '@/stores/listingCart'

const props = withDefaults(
  defineProps<{
    modelValue: number
    showCurrentFloorPrice?: boolean
  }>(),
  {
    modelValue: DEFAULT_FLOOR_PRICE_RATE,
  },
)

const activePlusBtn = ref(false)
const activeFloorPriceBtn = ref(false)
const activeMinusBtn = ref(false)

const listingCartStore = useListingCartStore()

const floorPricePercentAdjustment = useVModel(props, 'modelValue')

const isDisabled = computed(
  () =>
    !listingCartStore.itemsInChain
      .map((item) => item.collection.floor || 0)
      .some(Boolean),
)
</script>
