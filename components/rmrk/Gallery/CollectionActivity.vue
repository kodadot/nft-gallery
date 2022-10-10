<template>
  <div>
    <div v-if="stats" class="level my-4 collection is-align-items-center">
      <div class="level-item has-text-centered">
        <div>
          <p class="title">{{ listedCount }} ⊆ {{ collectionLength }}</p>
          <p class="heading">
            {{ $t('activity.listed') }} / {{ $t('activity.totalItems') }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            <Money :value="collectionDailyTradedVolumeNumber" inline /> ⊆
            <Money :value="collectionTradedVolumeNumber" inline />
          </p>
          <p class="heading">
            {{ $t('activity.todayTraded') }} / {{ $t('activity.totalTraded') }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            <Money :value="highestBuyPrice" inline /> ⊆
            {{ totalPurchases }}
          </p>
          <p class="heading">
            {{ $t('activity.highestSale') }} /
            {{ $t('activity.totalBuys') }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            {{ uniqueOwnerCount }} ⊆ {{ differentOwnerCount }}
          </p>
          <p class="heading">
            {{ $t('activity.unique') }} / {{ $t('activity.owners') }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            {{ disributionCount }}
          </p>
          <p class="heading">{{ $t('activity.distribution') }}</p>
        </div>
      </div>

      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            <Money :value="collectionFloorPrice" inline />
          </p>
          <p class="heading">{{ $t('activity.floorPrice') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import {
  CollectionEventsStats,
  Interaction,
} from '@/components/rmrk/service/scheme'
import { after, getVolume } from '@/utils/math'
import { subDays } from 'date-fns'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import collectionStatsById from '@/queries/subsquid/rmrk/collectionStatsById.graphql'
import collectionBuyEventStatsById from '@/queries/rmrk/subsquid/collectionBuyEventStatsById.graphql'
import { notificationTypes, showNotification } from '@/utils/notification'

const components = {
  Money: () => import('@/components/shared/format/Money.vue'),
}
type Stats = {
  listedCount: number
  collectionLength: number
  collectionFloorPrice: number
  uniqueOwnerCount: number
  differentOwnerCount: number
  saleEvents: Interaction[]
}

@Component({ components })
export default class CollectionActivity extends mixins(PrefixMixin) {
  @Prop({ type: String, required: true }) public id!: string
  public yesterdayDate: Date = subDays(Date.now(), 1)

  protected stats: Stats = {
    listedCount: 0,
    collectionLength: 0,
    collectionFloorPrice: 0,
    uniqueOwnerCount: 0,
    differentOwnerCount: 0,
    saleEvents: [],
  }
  totalPurchases = 0
  highestBuyPrice = 0

  async fetch() {
    this.fetchBuyEvents()

    if (!this.id) {
      this.$consola.warn('CollectionActivity: id is not defined')
      return
    }

    const { data } = await this.$apollo
      .query({
        query: collectionStatsById,
        client: this.client,
        variables: {
          id: this.id,
        },
      })
      .catch((e) => {
        this.$consola.warn(e)
        return { data: null }
      })

    if (!data) {
      this.$consola.log('stats is null')
      return
    }
    const {
      stats: { listed, base, sales },
    } = data

    this.stats = {
      listedCount: data.stats.listed.length,
      collectionLength: data.stats.base.length,
      collectionFloorPrice: Math.min(
        ...listed.map((item) => parseInt(item.price))
      ),
      uniqueOwnerCount: [...new Set(base.map((item) => item.currentOwner))]
        .length,
      differentOwnerCount: base.filter(this.differentOwner).length,
      saleEvents: sales.map((nft) => nft.events).flat(),
    }
  }

  get saleEvents(): Interaction[] {
    return this.stats.saleEvents
  }

  get collectionLength(): number {
    return this.stats.collectionLength
  }

  get listedCount(): number {
    return this.stats.listedCount
  }

  get collectionFloorPrice(): number {
    return this.stats.collectionFloorPrice
  }

  get disributionCount(): string {
    return (this.differentOwnerCount / this.uniqueOwnerCount || 1).toFixed(4)
  }

  get uniqueOwnerCount(): number {
    return this.stats.uniqueOwnerCount
  }

  get differentOwnerCount(): number {
    return this.stats.differentOwnerCount
  }

  get collectionTradedVolumeNumber(): bigint {
    return getVolume(this.saleEvents)
  }

  get collectionDailyTradedVolumeNumber(): bigint {
    return getVolume(this.saleEvents.filter(after(this.yesterdayDate)))
  }

  protected async fetchBuyEvents() {
    try {
      const { data } = await this.$apollo.query<{
        stats: CollectionEventsStats[]
      }>({
        query: collectionBuyEventStatsById,
        client: this.client,
        variables: {
          id: this.id,
        },
      })
      console.log(data)
      if (data && data.stats && data.stats[0]) {
        const { max, count } = data.stats[0]
        this.totalPurchases = count
        this.highestBuyPrice = parseInt(max)
      }
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
    }
  }

  protected differentOwner(nft: {
    issuer: string
    currentOwner: string
  }): boolean {
    return nft.currentOwner !== nft.issuer
  }
}
</script>

<style lang="scss" scoped>
.collection {
  display: grid;
  grid-gap: 0.7rem;
  grid-template-columns: repeat(3, 1fr);
}

.title {
  font-size: 1.2rem;
}
</style>
