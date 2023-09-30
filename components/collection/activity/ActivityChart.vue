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
  }
)

const buyEvents = computed(() =>
  sortAsc(
    props.events
      .filter((e) => e.interaction === Interaction.BUY)
      .map(toDataPoint)
  )
)
const listEvents = computed(() => {
  const listDataPoints = sortAsc(
    props.events
      .filter((e) => e.interaction === Interaction.LIST)
      .map(toDataPoint)
  )
  return removeOutliers(listDataPoints)
})

const chartData = computed(() => {
  const buyBinSize = getBinSizeForRange({
    firstTimestamp: buyEvents.value[0].timestamp,
    lastTimestamp: buyEvents.value[buyEvents.value.length - 1].timestamp,
    datasetLength: buyEvents.value.length,
  })
  const listBinSize = getBinSizeForRange({
    firstTimestamp: listEvents.value[0].timestamp,
    lastTimestamp: listEvents.value[listEvents.value.length - 1].timestamp,
    datasetLength: listEvents.value.length,
  })
  const buyBins = bin(buyEvents.value, buyBinSize)
  const listBins = bin(listEvents.value, listBinSize)

  const binnedBuyEvents = buyBins.map(({ timestamp, value }) => [
    new Date(timestamp),
    displayValue(value, decimals.value),
  ])
  const binnedListEvents = listBins.map(({ timestamp, value }) => [
    new Date(timestamp),
    displayValue(value, 10),
  ])

  return [binnedBuyEvents, binnedListEvents]
})
</script>
