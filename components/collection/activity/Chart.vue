<template>
  <PriceChart
    v-if="events.length > 0"
    :price-chart-data="chartData"
    chart-height="350px" />
</template>

<script setup lang="ts">
import { ActivityInteraction } from '@/components/rmrk/service/scheme'
import { Interaction } from '@kodadot1/minimark'
import PriceChart from '@/components/chart/PriceChart.vue'
import { DataPoint, bin } from './utils'

const props = withDefaults(
  defineProps<{
    events: ActivityInteraction[]
  }>(),
  {
    events: () => [],
  }
)

const toDataPoint = (e: ActivityInteraction): DataPoint => ({
  timestamp: e.timestamp,
  value: parseInt(e.meta),
})

const sortAsc = (events: DataPoint[]) =>
  events.sort((a, b) => a.timestamp - b.timestamp)

const displayValue = (val: number) =>
  Number((val * Math.pow(10, -12)).toFixed(4))

const buyEvents = computed(() =>
  sortAsc(
    props.events
      .filter((e) => e.interaction === Interaction.BUY)
      .map(toDataPoint)
  )
)
const listEvents = computed(() =>
  sortAsc(
    props.events
      .filter((e) => e.interaction === Interaction.LIST)
      .map(toDataPoint)
  )
)

const chartData = computed(() => {
  const buyBins = bin(buyEvents.value, { days: 1 })
  const listBins = bin(listEvents.value, { days: 1 })

  const binnedBuyEvents = buyBins.map(({ timestamp, value }) => [
    new Date(timestamp),
    displayValue(value),
  ]) as [Date, number][]
  const binnedListEvents = listBins.map(({ timestamp, value }) => [
    new Date(timestamp),
    displayValue(value),
  ]) as [Date, number][]

  return [binnedBuyEvents, binnedListEvents]
})
</script>
