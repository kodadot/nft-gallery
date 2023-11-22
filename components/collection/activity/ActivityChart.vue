<template>
  <PriceChart
    v-if="events.length > 0"
    :price-chart-data="chartData"
    chart-height="350px" />
</template>

<script setup lang="ts">
import { ActivityInteraction } from '@/components/rmrk/service/scheme'
import { Interaction } from '@kodadot1/minimark/v1'
import PriceChart from '@/components/chart/PriceChart.vue'
import {
  bin,
  displayValue,
  getBinSizeForRange,
  removeOutliers,
  sortAsc,
  toDataPoint,
} from './utils'

const { decimals } = useChain()

const props = withDefaults(
  defineProps<{
    events: ActivityInteraction[]
  }>(),
  {
    events: () => [],
  },
)

const buyEvents = computed(() =>
  sortAsc(
    props.events
      .filter((e) => e.interaction === Interaction.BUY)
      .map(toDataPoint),
  ),
)
const listEvents = computed(() => {
  const CUTOFF = 0.1 // 10% of the data is outliers
  const listDataPoints = sortAsc(
    props.events
      .filter((e) => e.interaction === Interaction.LIST)
      .map(toDataPoint),
  )
  const withoutOutliers = removeOutliers(listDataPoints)
  const ratio = withoutOutliers.length / listDataPoints.length
  return ratio < CUTOFF ? withoutOutliers : listDataPoints
})

const chartData = computed(() => {
  const buyBinSize = getBinSizeForRange({
    timestamps: buyEvents.value.map((e) => e.timestamp),
  })
  const listBinSize = getBinSizeForRange({
    timestamps: listEvents.value.map((e) => e.timestamp),
  })
  const buyBins = bin(buyEvents.value, buyBinSize)
  const listBins = bin(listEvents.value, listBinSize)

  const binnedBuyEvents = buyBins.map(({ timestamp, value }) => [
    new Date(timestamp),
    displayValue(value, decimals.value),
  ])
  const binnedListEvents = listBins.map(({ timestamp, value }) => [
    new Date(timestamp),
    displayValue(value, decimals.value),
  ])

  return [binnedBuyEvents, binnedListEvents]
})
</script>
