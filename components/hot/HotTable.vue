<template>
  <div>
    <Loader :value="$fetchState.pending" />
    <NeoTable
      :data="data"
      hoverable
      class="hot-sticky-header"
      td-class="is-vcentered">
      <NeoTableColumn v-slot="props" label="N°">
        {{ props.row.id }}
      </NeoTableColumn>
      <NeoTableColumn v-slot="props" label="Series Name">
        <nuxt-link :to="`/rmrk/collection/${props.row.collectionId}`">
          {{ props.row.name }}
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn v-slot="props" label="Buys">
        {{ props.row.buys }}
      </NeoTableColumn>
      <NeoTableColumn v-slot="props" label="Total Volume(KSM)">
        {{ props.row.totalVolume }}
      </NeoTableColumn>
      <NeoTableColumn v-slot="props" label="Last Sale Size(KSM)">
        {{ props.row.latestSoldSize }}
      </NeoTableColumn>
      <NeoTableColumn v-slot="props" label="Time Since Last Sale">
        {{ props.row.latestSoldTime }}
      </NeoTableColumn>

      <NeoTableColumn v-slot="props" label="Median Time Between Sales">
        {{ props.row.medianDate }}
      </NeoTableColumn>

      <template #empty>
        <div v-if="!$fetchState.pending" class="w-100 has-text-centered">
          {{ $t('spotlight.empty') }}
        </div>
        <NeoSkeleton :active="$fetchState.pending" />
      </template>
    </NeoTable>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import hotNfts from '@/queries/rmrk/subsquid/hotNfts.graphql'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import { RowHot, SubsquidHotNft } from './types'
import { NeoSkeleton, NeoTable, NeoTableColumn } from '@kodadot1/brick'

import PrefixMixin from '~/utils/mixins/prefixMixin'
import ChainMixin from '@/utils/mixins/chainMixin'
import formatBalance from '@/utils/format/balance'
import { getVolume } from '@/utils/math'
import { lastweekDate } from '@/components/series/utils'

const components = {
  NeoSkeleton,
  NeoTable,
  NeoTableColumn,
}

@Component({
  components,
})
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
