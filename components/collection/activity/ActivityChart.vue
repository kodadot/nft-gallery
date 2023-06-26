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
  removeOutliers,
  sortAsc,
  toDataPoint,
} from './utils'

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
  const buyBins = bin(buyEvents.value, { days: 1 })
  const listBins = bin(listEvents.value, { days: 1 })

  const binnedBuyEvents = buyBins.map(({ timestamp, value }) => [
    new Date(timestamp),
    displayValue(value),
  ])
  const binnedListEvents = listBins.map(({ timestamp, value }) => [
    new Date(timestamp),
    displayValue(value),
  ])

  return [binnedBuyEvents, binnedListEvents]
})
</script>
