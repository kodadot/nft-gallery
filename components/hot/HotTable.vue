<template>
  <div>
    <Loader :value="$fetchState.pending" />
    <b-table :data="data" hoverable class="hot-sticky-header">
      <b-table-column v-slot="props" label="N°">
        {{ props.row.id }}
      </b-table-column>
      <b-table-column v-slot="props" label="Series Name">
        <nuxt-link :to="`/rmrk/collection/${props.row.collectionId}`">
          {{ props.row.name }}
        </nuxt-link>
      </b-table-column>
      <b-table-column v-slot="props" cell-class="is-vcentered" label="Buys">
        {{ props.row.buys }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        label="Total Volume(KSM)">
        {{ props.row.totalVolume }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        label="Last Sale Size(KSM)">
        {{ props.row.latestSoldSize }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        label="Time Since Last Sale">
        {{ props.row.latestSoldTime }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        label="Median Time Between Sales">
        {{ props.row.medianDate }}
      </b-table-column>

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
import { RowHot, SubsquidHotNft } from './types'

import PrefixMixin from '~/utils/mixins/prefixMixin'
import ChainMixin from '@/utils/mixins/chainMixin'
import formatBalance from '@/utils/format/balance'
import { getVolume } from '@/utils/math'
import { lastweekDate } from '@/components/series/utils'

@Component({})
export default class HotTable extends mixins(PrefixMixin, ChainMixin) {
  protected data: RowHot[] = []
  private toKSM(amount) {
    return formatBalance(amount, this.decimals, '')
  }

  async fetch() {
    const data = await this.fetchHotNfts()
    const collectionMap = groupBy(data, 'nft.collection.id')
    const sortOrder = [...new Set(data.map((e) => e.nft.collection.id))]
    const result: RowHot[] = sortOrder.map((colId, idx) => {
      const collection = collectionMap[colId][0].nft.collection
      const nfts = sortBy(collectionMap[colId], 'timestamp').reverse()
      const totalVolume = this.toKSM(getVolume(nfts))
      const buys = nfts.length
      const latestSale = nfts[0]
      const medianIdx = Math.floor(buys / 2)
      return {
        id: idx + 1,
        collectionId: colId,
        name: collection.name,
        totalVolume,
        buys,
        latestSoldSize: this.toKSM(latestSale.meta),
        latestSoldTime: formatDistanceToNow(new Date(latestSale.timestamp)),
        medianDate: formatDistanceToNow(new Date(nfts[medianIdx].timestamp)),
        nfts,
      }
    })
    this.data = result
  }

  public async fetchHotNfts(): Promise<[SubsquidHotNft]> {
    const {
      data: { result },
    } = await this.$apollo.query({
      query: hotNfts,
      client: this.client,
      variables: {
        gte: lastweekDate,
      },
    })
    return result
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.hot-sticky-header th {
  top: 120px;
  position: sticky;
  background: $frosted-glass-background;
  backdrop-filter: $frosted-glass-backdrop-filter;
}

.front-stack-layer {
  z-index: 1;
}
</style>
