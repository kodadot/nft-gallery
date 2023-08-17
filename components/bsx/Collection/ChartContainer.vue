<template>
  <div>
    <CollectionPriceChart :price-data="priceData" />
  </div>
</template>

<script lang="ts" setup>
import formatBalance from '@/utils/format/balance'

// queries
import allCollectionSaleEvents from '@/queries/subsquid/bsx/allCollectionSaleEvents.graphql'

// types
import type { CollectionChartData as ChartData } from '@/utils/chart'
import CollectionPriceChart from '@/components/shared/collection/PriceChart.vue'

const { $apollo, $route } = useNuxtApp()
const { decimals } = useChain()
const { client } = usePrefix()

const priceData = ref<[ChartData[], ChartData[]]>([[], []])
const id = computed(() => $route.params.id)

useLazyAsyncData('priceData', async () => {
  const data = await Promise.all([
    queryAllCollectionSaleEvents({ interaction_eq: 'LIST' }),
    queryAllCollectionSaleEvents({ interaction_eq: 'BUY' }),
  ])

  for (const [index, element] of data.entries()) {
    const items = element.data.events

    for (const item of items) {
      const value = formatValue(item.meta)

      priceData.value[index].push({
        count: 1,
        value,
        date: item.timestamp,
      })
    }
  }
})

const queryAllCollectionSaleEvents = ({ interaction_eq }) => {
  return $apollo.query({
    query: allCollectionSaleEvents,
    client: client.value,
    variables: {
      id: id.value,
      and: {
        interaction_eq,
      },
    },
  })
}

const formatValue = (value: string): number => {
  return parseFloat(
    formatBalance(value, decimals.value, false)
      .replace(/,/g, '')
      .replace('.0000', '')
  )
}
</script>
