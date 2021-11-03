<template>
  <div>
    <div
      v-if="nfts"
      class="level m-4"
    >
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">
            Items
          </p>
          <p class="title">
            {{ collectionLength }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">
            Owned
          </p>
          <p class="title">
            {{ collectionSoldedNFT }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">
            Floor price
          </p>
          <p class="title">
            <Money
              :value="collectionFloorPrice"
              inline
            />
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">
            Volume traded
          </p>
          <p class="title">
            <Money
              :value="collectionTradedVolumeNumber"
              inline
            />
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">
            24h Volume traded
          </p>
          <p class="title">
            <Money
              :value="collectionDailyTradedVolumeNumber"
              inline
            />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Interaction, NFT } from '@/components/rmrk/service/scheme'
import { after, getVolume, pairListBuyEvent } from '@/utils/math'
import { subDays } from 'date-fns'

const components = {
  Money: () => import('@/components/shared/format/Money.vue')
}

@Component({ components })
export default class extends Vue {
  @Prop() public nfts!: NFT[];
  public yesterdayDate: Date = subDays(Date.now(), 1);

  get saleEvents(): Interaction[] {
    return this.nfts
      .map(nft => nft.events)
      .map(pairListBuyEvent)
      .flat()
  }

  get collectionLength() {
    return this.nfts.length
  }

  get collectionFloorPrice() {
    return Math.min(
      ...this.nfts.map(nft => Number(nft.price)).filter(price => price > 0)
    )
  }

  get collectionSoldedNFT() {
    return this.nfts.map(nft => nft.price).filter(price => price === '0')
      .length
  }

  get collectionTradedVol() {
    return this.nfts
      .map(nft =>
        nft.events.filter(
          (e: { interaction: string }) => e.interaction === 'BUY'
        )
      )
      .filter(arr => arr.length).length
  }

  get collectionTradedVolumeNumber(): bigint {
    return getVolume(this.saleEvents)
  }

  get collectionDailyTradedVolumeNumber(): bigint {
    return getVolume(this.saleEvents.filter(after(this.yesterdayDate)))
  }
}
</script>
