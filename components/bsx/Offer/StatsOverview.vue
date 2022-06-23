<template>
  <div>
    <div class="level my-4 collection is-align-items-center mb-5">
      <div class="level-item has-text-centered">
        <div>
          <p class="title">{{ buys }}</p>
          <p class="heading">
            {{ $t('statsOverview.buys') }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title">{{ listed }}</p>
          <p class="heading">
            {{ $t('statsOverview.listed') }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title">{{ minted }}</p>
          <p class="heading">
            {{ $t('statsOverview.minted') }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title">{{ createdCollections }}</p>
          <p class="heading">
            {{ $t('statsOverview.createdCollections') }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title">{{ activeWallets }}</p>
          <p class="heading">
            {{ $t('statsOverview.activeWallets') }}
          </p>
        </div>
      </div>
    </div>
    <div
      class="level-item has-text-centered"
      v-for="data in offerStats"
      v-bind:key="data.status">
      <div>
        <p class="heading text-bold">
          {{ data.status + ' ' + $t('statsOverview.offers') }}
        </p>
        <p class="title">
          {{ `${data.totalCount} / ` }}
          <Money :value="data.totalPrice" class="mb-5" inline hideUnit />
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { emptyObject } from '@kodadot1/minimark'
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { OfferStats, StatsResponse } from './types'
/// importing urlPrefix
import PrefixMixin from '~/utils/mixins/prefixMixin'
import statsForBsx from '~/queries/subsquid/bsx/statsForBsx.graphql'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component({ components })
export default class BsxStats extends mixins(PrefixMixin) {
  @Prop({ type: Object, default: () => emptyObject<StatsResponse>() })
  public statsResponse!: StatsResponse
  protected buys = 0
  protected listed = 0
  protected minted = 0
  protected createdCollections = 0
  protected activeWallets = 0
  protected offerStats: OfferStats[] = []

  fetch() {
    this.getOfferStats()
  }

  /// stats for bsx function
  protected async getOfferStats() {
    const response = await this.$apollo.query<StatsResponse>({
      client: this.urlPrefix,
      query: statsForBsx,
    })
    this.statsResponse = response.data
    this.buys = this.statsResponse.buys.totalCount
    this.listed = this.statsResponse.listed.count
    this.minted = this.statsResponse.minted.count
    this.createdCollections = this.statsResponse.createdCollections.totalCount
    this.activeWallets = this.statsResponse.activeWallets[0].totalCount
    this.offerStats = this.statsResponse.offerStats.filter(
      (offer: OfferStats) =>
        offer.status !== 'WITHDRAWN' && offer.status !== 'EXPIRED'
    )
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.collection {
  display: grid;
  grid-gap: 0.7rem;
  grid-template-columns: repeat(3, 1fr);
}

.title {
  font-size: 1.2rem;
}
</style>
