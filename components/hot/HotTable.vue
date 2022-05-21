<template>
  <div>
    <Loader :value="$fetchState.pending" />
    <b-table :data="data" hoverable class="series-sticky-header">
      <template #empty>
        <div v-if="!$fetchState.pending" class="has-text-centered">
          {{ $t('spotlight.empty') }}
        </div>
        <b-skeleton :active="$fetchState.pending" />
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import hotNfts from '@/queries/rmrk/subsquid/hotNfts.graphql'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import formatBalance from '@/utils/formatBalance'

import PrefixMixin from '~/utils/mixins/prefixMixin'
import ChainMixin from '@/utils/mixins/chainMixin'

const components = {
  Money: () => import('@/components/shared/format/Money.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  BasicPopup: () => import('@/components/shared/view/BasicPopup.vue'),
}

@Component({ components })
export default class HotTable extends mixins(PrefixMixin, ChainMixin) {
  protected data = []

  private toKSM(amount) {
    return formatBalance(amount, this.decimals, this.unit)
  }

  async fetch() {
    const data = await this.fetchHotNfts()
    const collectionMap = groupBy(data, 'nft.collection.id')
    const sortOrder = [...new Set(data.map((e) => e.nft.collection.id))]
    const result = Object.keys(collectionMap).map((colId) => {
      const collection = collectionMap[colId][0].nft.collection
      const nfts = sortBy(collectionMap[colId], 'timestamp')
      const totalVolume = this.toKSM(
        nfts.reduce((res, nft) => {
          res += Number(nft.meta)
          return res
        }, 0)
      )
      const buys = nfts.length
      const latestSale = nfts[0]
      return {
        name: collection.name,
        totalVolume,
        buys,
        latestSoldSize: this.toKSM(latestSale.meta),
        latestSoldTime: formatDistanceToNow(new Date(latestSale.timestamp)),
      }
    })
    this.data = result
  }

  public async fetchHotNfts() {
    const {
      data: { result },
    } = await this.$apollo.query({
      query: hotNfts,
      client: this.client,
      variables: {
        gte: '2022-05-14T05:38:06.018000Z',
      },
    })
    return result
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables';

.series-sticky-header th {
  top: 120px;
  position: sticky;
  background: $frosted-glass-background;
  backdrop-filter: $frosted-glass-backdrop-filter;
}

.front-stack-layer {
  z-index: 1;
}
</style>
