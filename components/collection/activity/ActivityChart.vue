<template>
  <PriceChart
    v-if="events.length > 0"
    v-model:hide-outliers="hideOutliers"
    v-model:apply-smoothing="applySmoothing"
    :price-chart-data="chartData"
    chart-height="350px"
    data-testid="collection-activity-chart"
  />
  <div
    v-else-if="loading"
    class="relative h-[350px]"
  >
    <SkeletonLoader
      :title="$t('activity.generatingChart')"
      class="absolute"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  DataPoint } from './utils'
import {
  bin,
  displayValue,
  getBinSizeForRange,
  removeOutliers,
  sortAsc,
  toDataPoint,
} from './utils'
import { Interaction } from '@/utils/shoppingActions'
import type { ActivityInteraction } from '@/types'
import PriceChart from '@/components/chart/PriceChart.vue'

const { decimals } = useChain()

const props = withDefaults(
  defineProps<{
    events: ActivityInteraction[]
    loading?: boolean
  }>(),
  {
    events: () => [],
    loading: false,
  },
)
const hideOutliers = ref(true)
const applySmoothing = ref(true)

const buyEvents = computed(() =>
  sortAsc(
    props.events
      .filter(e => e.interaction === Interaction.BUY)
      .map(toDataPoint),
  ),
)
const listEvents = computed(() => {
  const listDataPoints = sortAsc(
    props.events
      .filter(e => e.interaction === Interaction.LIST)
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
    timestamps: buyEvents.value.map(e => e.timestamp),
  })
  const listBinSize = getBinSizeForRange({
    timestamps: listEvents.value.map(e => e.timestamp),
  })
  const buyBins = bin(buyEvents.value, buyBinSize)
  const listBins = bin(listEvents.value, listBinSize)

  return [toChartFormat(buyBins), toChartFormat(listBins)]
})
</script>
