<template>
  <PriceChart
    v-if="events.length > 0"
    v-model:hideOutliers="hideOutliers"
    v-model:applySmoothing="applySmoothing"
    :price-chart-data="chartData"
    chart-height="350px"
    data-testid="collection-activity-chart" />
</template>

<script setup lang="ts">
import { ActivityInteraction } from '@/components/rmrk/service/scheme'
import { Interaction } from '@kodadot1/minimark/v1'
import PriceChart from '@/components/chart/PriceChart.vue'
import {
  DataPoint,
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
const applySmoothing = ref(true)


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

const toChartFormat = (events: DataPoint[]) =>
  events.map(({ timestamp, value }) => [
    new Date(timestamp),
    displayValue(value, decimals.value),
  ])

const chartData = computed(() => {
  if (!applySmoothing.value) {
    return [toChartFormat(buyEvents.value), toChartFormat(listEvents.value)]
  }
  const buyBinSize = getBinSizeForRange({
    timestamps: buyEvents.value.map((e) => e.timestamp),
  })
  const listBinSize = getBinSizeForRange({
    timestamps: listEvents.value.map((e) => e.timestamp),
  })
  const buyBins = bin(buyEvents.value, buyBinSize)
  const listBins = bin(listEvents.value, listBinSize)

  return [toChartFormat(buyBins), toChartFormat(listBins)]
})
</script>
