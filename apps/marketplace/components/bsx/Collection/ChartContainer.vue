<template>
  <div>
    <CollectionPriceChart :price-data="priceData" />
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
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

  get id(): string {
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

  protected formatValue(value: string): number {
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

      for (const item of items) {
        const value = this.formatValue(item.meta)

        this.priceData[index].push({
          count: 1,
          value,
          date: item.timestamp,
        })
      }
    }
  }
}
</script>
