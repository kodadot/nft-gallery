<template>
  <div>
    <div class="level my-4 collection" v-if="stats">
      <div class="level-item has-text-centered">
        <div>
          <p class="title">{{ listedCount }} ⊆ {{ collectionLength }}</p>
          <p class="heading">Listed / Total Items</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            <Money :value="collectionFloorPrice" inline />
          </p>
          <p class="heading">Floor price</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            <Money :value="collectionTradedVolumeNumber" inline />
          </p>
          <p class="heading">Volume traded</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            {{ uniqueOwnerCount }} ⊆ {{ differentOwnerCount }}
          </p>
          <p class="heading">Unique / Owners</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            {{ disributionCount }}
          </p>
          <p class="heading">Distribution</p>
        </div>
      </div>

      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            <Money :value="collectionDailyTradedVolumeNumber" inline />
          </p>
          <p class="heading">24h Volume traded</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Prop, Vue } from 'nuxt-property-decorator'
import { Interaction, NFT } from '@/components/rmrk/service/scheme'
import { after, getVolume, pairListBuyEvent, uniqueCount } from '@/utils/math'
import { subDays } from 'date-fns'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import collectionStatsById from '@/queries/collectionStatsById.graphql'

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

  async fetch() {
    if (!this.id) {
      console.warn('CollectionActivity: id is not defined')
      return
    }

    const { data } = await this.$apollo
      .query({
        query: collectionStatsById,
        client: this.urlPrefix,
        variables: {
          id: this.id,
        },
      })
      .catch((e) => {
        console.warn(e)
        return { data: null }
      })

    if (!data) {
      console.log('stats is null')
      return
    }

    this.stats = {
      listedCount: data.stats.listed.count,
      collectionLength: data.stats.base.count,
      collectionFloorPrice: data.stats.listed.aggregates.floor.value,
      uniqueOwnerCount: data.stats.base.aggregates.distinctCount.currentOwner,
      differentOwnerCount: data.stats.base.nfts.filter(this.differentOwner)
        .length,
      saleEvents: data.stats.base.nfts
        .map((nft) => nft.events)
        .map(pairListBuyEvent)
        .flat(),
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

  protected differentOwner(nft: {
    issuer: string
    currentOwner: string
  }): boolean {
    return nft.currentOwner !== nft.issuer
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
