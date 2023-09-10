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
          setFloorPrice(floorPricePercentAdjustment)
        " />
      <NeoButton
        class="mr-2"
        :label="$t('statsOverview.floorPrice')"
        rounded
        no-shadow
        @click.native="
          floorPricePercentAdjustment = 1
          setFloorPrice(floorPricePercentAdjustment)
        " />
      <NeoButton
        label="+5%"
        rounded
        no-shadow
        @click.native="
          floorPricePercentAdjustment += 0.05
          setFloorPrice(floorPricePercentAdjustment)
        " />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const emit = defineEmits(['change'])

defineProps<{
  showCurrentFloorPrice?: boolean
}>()

const floorPricePercentAdjustment = ref(1)

const setFloorPrice = (value) => {
  emit('change', value)
}
</script>

<style scoped></style>
