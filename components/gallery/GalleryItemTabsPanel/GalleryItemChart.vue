<template>
  <PriceChart
    class="mt-4"
    :price-chart-data="priceChartData"
    :chart-height="chartHeight" />
</template>

<script lang="ts" setup>
import { Interaction } from '@/components/rmrk/service/scheme'
import PriceChart from '@/components/chart/PriceChart.vue'
import { parseChartAmount } from '@/utils/historyEvent'

const props = defineProps<{
  nftEvents?: Interaction[]
  chartHeight?: string
}>()

const { decimals } = useChain()

function toEventItem(event: Interaction) {
  const rawAmount = event.meta ?? '-'
  const amount = parseChartAmount(rawAmount, decimals.value)
  const date = new Date(event.timestamp)
  return [date, amount]
}

const priceChartData = computed(() => {
  const nftEvents = props.nftEvents || []
  const buyEvents = nftEvents
    .filter((event) => event.interaction === 'BUY')
    .map(toEventItem)

  const listEvents = nftEvents
    .filter((event) => event.interaction === 'LIST')
    .map(toEventItem)

  return [buyEvents, listEvents]
})
</script>
