<template>
  <div>
    <div class="level my-4 collection" v-if="nfts">
      <div class="level-item has-text-centered">
        <div>
          <b-skeleton :active="!collectionLength" size="is-small"></b-skeleton>
          <p class="title" v-if="collectionLength">
            {{ listedCount }} ⊆ {{ collectionLength }}
          </p>
          <p class="heading">Listed / Total Items</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <b-skeleton :active="!collectionFloorPrice" size="is-small"></b-skeleton>
          <p class="title" v-if="collectionFloorPrice">
            <Money :value="collectionFloorPrice" inline />
          </p>
          <p class="heading">Floor price</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <b-skeleton :active="!collectionTradedVolumeNumber" size="is-small"></b-skeleton>
          <p class="title" v-if="collectionTradedVolumeNumber">
            <Money :value="collectionTradedVolumeNumber" inline />
          </p>
          <p class="heading">Volume traded</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <b-skeleton :active="!differentOwnerCount" size="is-small"></b-skeleton>
          <p class="title" v-if="differentOwnerCount">{{ uniqueOwnerCount }} ⊆ {{ differentOwnerCount }}</p>
          <p class="heading">Unique / Owners</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <b-skeleton :active="!disributionCount" size="is-small"></b-skeleton>
          <p class="title" v-if="disributionCount">{{ disributionCount }}</p>
          <p class="heading">Distribution</p>
        </div>
      </div>

      <div class="level-item has-text-centered">
        <div>
          <b-skeleton :active="!collectionDailyTradedVolumeNumber" size="is-small"></b-skeleton>
          <p class="title" v-if="collectionDailyTradedVolumeNumber">
            <Money
              :value="collectionDailyTradedVolumeNumber"
              inline
            />
          </p>
          <p class="heading">24h Volume traded</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Interaction, NFT } from '@/components/rmrk/service/scheme'
import { after, getVolume, pairListBuyEvent, uniqueCount } from '@/utils/math'
import { subDays } from 'date-fns'

const components = {
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component({ components })
export default class extends Vue {
  @Prop() public nfts!: NFT[]
  public yesterdayDate: Date = subDays(Date.now(), 1)

  get saleEvents(): Interaction[] {
    return this.nfts
      .map((nft) => nft.events)
      .map(pairListBuyEvent)
      .flat()
  }

  get collectionLength(): number {
    return this.nfts.length
  }

  get listedCount(): number {
    return this.onlyListedNfts.length
  }

  get onlyListedNfts(): number[] {
    return this.nfts.map((nft) => Number(nft.price)).filter((price) => price > 0)
  }

  get collectionFloorPrice(): number {
    return Math.min(...this.onlyListedNfts)
  }

  get disributionCount(): number {
    return Number((this.differentOwnerCount / (this.uniqueOwnerCount || 1)).toFixed(4))
  }

  get uniqueOwnerCount(): number {
    return uniqueCount(this.tokensWithDifferentOwner.map(nft => nft.currentOwner))
  }

  get differentOwnerCount(): number {
    return this.tokensWithDifferentOwner.length
  }

  get tokensWithDifferentOwner(): NFT[] {
    return this.nfts.filter(this.differentOwner)
  }

  get collectionTradedVol(): number {
    return this.nfts
      .map((nft) =>
        nft.events.filter(
          (e: { interaction: string }) => e.interaction === 'BUY'
        )
      )
      .filter((arr) => arr.length).length
  }

  get collectionTradedVolumeNumber(): bigint {
    return getVolume(this.saleEvents)
  }

  get collectionDailyTradedVolumeNumber(): bigint {
    return getVolume(this.saleEvents.filter(after(this.yesterdayDate)))
  }

  protected differentOwner(nft: any): boolean {
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
