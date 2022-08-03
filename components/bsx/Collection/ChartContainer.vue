<template>
  <div>
    <CollectionPriceChart :priceData="priceData" />
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import format from 'date-fns/format'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import ChainMixin from '@/utils/mixins/chainMixin'
import formatBalance from '@/utils/formatBalance'

// queries
import allCollectionSaleEvents from '@/queries/subsquid/bsx/allCollectionSaleEvents.graphql'

// types
import type { CollectionChartData as ChartData } from '@/utils/chart'

@Component({
  components: {
    CollectionPriceChart: () =>
      import('@/components/shared/collection/PriceChart.vue'),
  },
})
export default class ChartContainer extends mixins(PrefixMixin, ChainMixin) {
  protected priceData: [ChartData[], ChartData[]] = [[], []]

  get id() {
    return this.$route.params.id
  }

  protected mounted() {
    this.fetchEvents()
  }

  protected queryAllCollectionSaleEvents({ interaction_eq }) {
    return this.$apollo.query({
      query: allCollectionSaleEvents,
      client: this.client,
      variables: {
        id: this.id,
        and: {
          interaction_eq,
        },
      },
    })
  }

  protected formatValue(value) {
    return parseFloat(
      formatBalance(value, this.decimals, false)
        .replace(/,/g, '')
        .replace('.0000', '')
    )
  }

  protected async fetchEvents() {
    const data = await Promise.all([
      this.queryAllCollectionSaleEvents({ interaction_eq: 'LIST' }),
      this.queryAllCollectionSaleEvents({ interaction_eq: 'BUY' }),
    ])

    for (const [index, element] of data.entries()) {
      const items = element.data.events
      const average = {}

      for (const item of items) {
        const value = this.formatValue(item.meta)
        const label = format(new Date(item.timestamp), 'dd MMM yy')

        if (!average[label]) {
          average[label] = {
            count: 0,
            value: 0,
          }
        }
        average[label] = {
          count: average[label].count + 1,
          value: average[label].value + value / (average[label].count || 1),
          date: new Date(item.timestamp),
        }
      }

      this.priceData[index].push(...(Object.values(average) as ChartData[]))
    }
  }
}
</script>
