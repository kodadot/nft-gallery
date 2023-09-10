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
        no-shadow
        @click.native="
          floorPricePercentAdjustment > 0.05 &&
            (floorPricePercentAdjustment -= 0.05)
        " />
      <NeoButton
        class="mr-2"
        :label="$t('statsOverview.floorPrice')"
        rounded
        no-shadow
        @click.native="floorPricePercentAdjustment = 1" />
      <NeoButton
        label="+5%"
        rounded
        no-shadow
        @click.native="floorPricePercentAdjustment += 0.05" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const emit = defineEmits(['input'])

const props = defineProps<{
  value: number
  showCurrentFloorPrice?: boolean
}>()

const floorPricePercentAdjustment = useVModel(props, 'value', emit, {
  eventName: 'input',
})
</script>
