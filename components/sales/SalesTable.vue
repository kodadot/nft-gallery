<template>
  <div>
    <Loader :value="$fetchState.pending" />
    <NeoTable :data="data" hoverable>
      <NeoTableColumn v-slot="props" position="centered" field="idx" label="N°">
        {{ props.row.idx }}
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        field="image"
        label=""
        class="front-stack-layer"
        position="centered">
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
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="name"
        :label="$t('name')">
        <nuxt-link :to="`/rmrk/gallery/${props.row.id}`">
          {{ props.row.name }}
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="collectionId"
        label="Collection">
        <nuxt-link :to="`/rmrk/collection/${props.row.collectionId}`">
          {{ props.row.collectionName }}
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="buyer"
        :label="$t('sales.buyer')">
        <nuxt-link :to="`/rmrk/u/${props.row.buyer}`">
          <Identity :address="props.row.buyer" />
        </nuxt-link>
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="timestamp"
        :label="$t('sales.tableDate')">
        <div>
          <NeoTooltip :label="props.row.date" position="left">
            <BlockExplorerLink
              :text="props.row.relDate"
              :block-id="props.row.blockNumber" />
          </NeoTooltip>
        </div>
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="salePrice"
        :label="$t('sales.price')">
        <Money :value="props.row.salePrice" inline />
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
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {
  NeoSkeleton,
  NeoTable,
  NeoTableColumn,
  NeoTooltip,
} from '@kodadot1/brick'

import PrefixMixin from '@/utils/mixins/prefixMixin'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

import salesFeedGql from '@/queries/rmrk/subsquid/salesFeed.graphql'

import { RowSales } from './types'

const components = {
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  BasicPopup: () => import('@/components/shared/view/BasicPopup.vue'),
  BlockExplorerLink: () => import('@/components/shared/BlockExplorerLink.vue'),
  NeoSkeleton,
  NeoTable,
  NeoTableColumn,
  NeoTooltip,
}

@Component({ components })
export default class SalesTable extends mixins(PrefixMixin) {
  public data: RowSales[] = []

  async fetch() {
    await this.fetchSalesFeed()
  }

  protected parseDate(ts: number): string {
    return new Date(ts).toLocaleString('en-GB', {
      timeZone: 'UTC',
      timeZoneName: 'short',
    })
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
@import '@/styles/abstracts/variables';

.history {
  width: 200px;
  height: 100px;
}

.front-stack-layer {
  z-index: 1;
}
.popup-image {
  width: 300px;
  height: 300px;
}
</style>
