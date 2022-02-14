<template>
  <div>
    <div class="level m-1 column is-12">
      <div class="level-item has-text-centered">
        <div class="collection-title-class">
          <p class="collection-title">{{ name }}</p>
        </div>
      </div>
    </div>
    <div class="level m-1" v-if="nfts">
      <div class="level-item column is-6 has-text-centered">
        <div>
          <p class="heading--inline heading">
            {{ $t('Items') }} :
            <span class="money money--inline"> {{ collectionLength }} </span>
          </p>
        </div>
      </div>
      <div class="level-item column is-6 has-text-centered">
        <div>
          <p class="heading--inline heading">
            {{ $t('Owned') }} :
            <span class="money money--inline"> {{ collectionSoldedNFT }} </span>
          </p>
        </div>
      </div>
    </div>
    <div class="level m-1" v-if="nfts">
      <div class="level-item column is-6 has-text-centered">
        <div>
          <p class="heading--inline heading">
            {{ $t('Volume') }} :
            <Money :value="collectionTradedVolumeNumber" inline />
          </p>
        </div>
      </div>
      <div class="level-item column is-6 has-text-centered">
        <div>
          <p class="heading--inline heading">
            {{ $t('Floor') }} : <Money :value="collectionFloorPrice" inline />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Interaction, NFT } from '@/components/rmrk/service/scheme'
import { getVolume, pairListBuyEvent } from '@/utils/math'

const components = {
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component({ components })
export default class CollectionDetail extends Vue {
  @Prop() public nfts!: NFT[]
  @Prop() public name!: string

  get saleEvents(): Interaction[] {
    return this.nfts
      .map((nft) => nft.events)
      .map(pairListBuyEvent)
      .flat()
  }

  get collectionLength(): number {
    return this.nfts.length
  }

  get collectionFloorPrice(): number {
    return Math.min(
      ...this.nfts.map((nft) => Number(nft.price)).filter((price) => price > 0)
    )
  }

  get collectionSoldedNFT(): number {
    return this.nfts.filter(this.differentOwner).length
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

  protected differentOwner(nft: any): boolean {
    return nft.currentOwner !== nft.issuer
  }
}
</script>
