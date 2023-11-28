<template>
  <PriceChart
    v-if="events.length > 0"
    v-model="hideOutliers"
    :price-chart-data="chartData"
    chart-height="350px"
    data-testid="collection-activity-chart" />
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
const hideOutliers = ref(true)

const buyEvents = computed(() =>
  sortAsc(
    props.events
      .filter((e) => e.interaction === Interaction.BUY)
      .map(toDataPoint),
  ),
)
const listEvents = computed(() => {
  const listDataPoints = sortAsc(
    props.events
      .filter((e) => e.interaction === Interaction.LIST)
      .map(toDataPoint),
  )
  return hideOutliers.value ? removeOutliers(listDataPoints) : listDataPoints
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
