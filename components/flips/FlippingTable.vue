<template>
  <div>
    <Loader :value="$fetchState.pending" />
    <b-table :data="data" hoverable class="series-sticky-header">
      <b-table-column v-slot="props" cell-class="is-vcentered" label="Author">
        <nuxt-link :to="`/rmrk/u/${props.row.author}`">
          <Identity :address="props.row.author" inline noOverflow />
        </nuxt-link>
      </b-table-column>
      <b-table-column v-slot="props" cell-class="is-vcentered" label="Date">
        {{ props.row.fromNow }}
      </b-table-column>
      <b-table-column v-slot="props" cell-class="is-vcentered" label="Prev">
        {{ props.row.previous }}
      </b-table-column>
      <b-table-column v-slot="props" cell-class="is-vcentered" label="Current">
        {{ props.row.current }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        label="%"
        field="percent">
        {{ props.row.percent }}
      </b-table-column>
      <b-table-column v-slot="props" cell-class="is-vcentered" label="Floor">
        <Money :value="props.row.floorPrice" hideUnit />
      </b-table-column>
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        label="Prev Owners">
        {{ props.row.prevOwners }}
      </b-table-column>
      <b-table-column v-slot="props" cell-class="is-vcentered" label="Assets">
        {{ props.row.total }}
      </b-table-column>
      <b-table-column v-slot="props" cell-class="is-vcentered" label="Owners">
        {{ props.row.owners }}
      </b-table-column>
      <b-table-column v-slot="props" cell-class="is-vcentered" label="Emotes">
        {{ props.row.emotes }}
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
import flippingNFTs from '@/queries/rmrk/subsquid/flippingNFTs.graphql'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { urlBuilderBlockNumber } from '@/utils/explorerGuide'
import formatBalance from '@/utils/formatBalance'

import PrefixMixin from '~/utils/mixins/prefixMixin'
import ChainMixin from '~/utils/mixins/chainMixin'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  BasicPopup: () => import('@/components/shared/view/BasicPopup.vue'),
}

type FlippingNFT = ResNFT & {
  nftId: string
  percent: string
  fromNow: string
}

type ResNFT = {
  current: string
  previous: string
  author: string
  owners: number
  floorPrice: null | string
  emotes: number
  date: string
  total: number
  prevOwners: number
}

@Component({ components })
export default class FlippingTable extends mixins(PrefixMixin, ChainMixin) {
  protected data: FlippingNFT[] = []

  async fetch() {
    const res: ResNFT[] = await this.fetchData()
    this.data = res.map((nft, index) => {
      const { date } = nft
      return {
        ...nft,
        idx: index + 1,
        fromNow: formatDistanceToNow(new Date(date)),
        createdDate: this.parseDate(date),
        percent: this.calcPercent(nft),
        previous: formatBalance(parseInt(nft.previous), this.decimals, ''),
        current: formatBalance(parseInt(nft.current), this.decimals, ''),
      }
    })
  }

  private calcPercent(nft: ResNFT): string {
    const previous = Number(nft.previous)
    const current = Number(nft.current)
    if (!(previous && current)) {
      return '-'
    }

    const result = Math.round((current / previous) * 100)
    return String(result) + '%'
  }

  protected parseDate(ts: number | string): string {
    return new Date(ts).toLocaleString('en-GB', {
      timeZone: 'UTC',
      timeZoneName: 'short',
    })
  }

  protected getBlockUrl(block: string): string {
    return urlBuilderBlockNumber(
      block,
      this.$store.getters['explorer/getCurrentChain'],
      'subscan'
    )
  }

  public async fetchData(): Promise<[FlippingNFT]> {
    const {
      data: { result },
    } = await this.$apollo.query({
      query: flippingNFTs,
      client: this.client,
      variables: {},
    })

    return result
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables';

.b-radio.is-selected {
  color: #000;
  background-color: $primary;
}

.history {
  width: 200px;
  height: 100px;
}

.series-sticky-header th {
  top: 120px;
  position: sticky;
  background: $frosted-glass-background;
  backdrop-filter: $frosted-glass-backdrop-filter;
}

.front-stack-layer {
  z-index: 1;
}
.popup-image {
  width: 300px;
  height: 300px;
}
</style>
