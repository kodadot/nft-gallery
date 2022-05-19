<template>
  <div>
    <Loader :value="$fetchState.pending" />
    <b-table :data="data" hoverable class="series-sticky-header">
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="idx"
        label="N°">
        {{ props.row.idx }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        field="image"
        label=""
        header-class="front-stack-layer"
        cell-class="is-vcentered">
        <div class="image is-48x48">
          <nuxt-link :to="`/rmrk/gallery/${props.row.id}`">
            <BasicPopup placement="top">
              <template #trigger>
                <BasicImage
                  :src="props.row.image"
                  :alt="props.row.name"
                  :rounded="true" />
              </template>
              <template #content>
                <BasicImage
                  :src="props.row.image"
                  :alt="props.row.name"
                  class="popup-image" />
              </template>
            </BasicPopup>
          </nuxt-link>
        </div>
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="name"
        label="Name">
        <nuxt-link :to="`/rmrk/gallery/${props.row.id}`">
          {{ props.row.name }}
        </nuxt-link>
      </b-table-column>
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="collectionId"
        label="Collection">
        <nuxt-link :to="`/rmrk/collection/${props.row.collectionId}`">
          {{ props.row.collectionName }}
        </nuxt-link>
      </b-table-column>
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="buyer"
        label="Buyer">
        <nuxt-link :to="`/rmrk/u/${props.row.buyer}`">
          <Identity :address="props.row.buyer" inline noOverflow />
        </nuxt-link>
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="timestamp"
        label="Relative Date">
        <div>
          <b-tooltip :label="props.row.date">
            <a :href="getBlockUrl(props.row.blockNumber)" target="_blank">
              {{ props.row.relDate }}
            </a>
          </b-tooltip>
        </div>
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="salePrice"
        label="Price of sale">
        <Money :value="props.row.salePrice" inline />
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
import { RowSales } from './types'
import salesFeedGql from '@/queries/rmrk/subsquid/salesFeed.graphql'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { urlBuilderBlockNumber } from '@/utils/explorerGuide'

import PrefixMixin from '~/utils/mixins/prefixMixin'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  BasicPopup: () => import('@/components/shared/view/BasicPopup.vue'),
}

@Component({ components })
export default class SalesTable extends mixins(PrefixMixin) {
  protected data: RowSales[] = []

  async fetch() {
    await this.fetchSalesFeed()
  }

  protected parseDate(ts: number): string {
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

  public async fetchSalesFeed() {
    const {
      data: { salesFeed },
    } = await this.$apollo.query({
      query: salesFeedGql,
      client: this.client,
      variables: {},
    })

    salesFeed.forEach((nft, idx) => {
      nft.idx = idx + 1
      nft.image = sanitizeIpfsUrl(nft.image)
      nft.date = this.parseDate(Number(nft.timestamp))
      nft.relDate = formatDistanceToNow(Number(nft.timestamp), {
        addSuffix: true,
      })
    })

    this.data = salesFeed
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
