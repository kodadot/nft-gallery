<template>
	<div>
		<div class="level mb-4" v-if="nfts">
			<div class="level-item has-text-centered">
				<div>
					<p class="heading">Items</p>
					<p class="title">{{ collectionLength }}</p>
				</div>
			</div>
			<div class="level-item has-text-centered">
				<div>
					<p class="heading">Owners</p>
					<p class="title">{{ collectionSoldedNFT }}</p>
				</div>
			</div>
			<div class="level-item has-text-centered">
				<div>
					<p class="heading">Floor price</p>
					<p class="title">
						<Money :value="collectionFloorPrice" inline />
					</p>
				</div>
			</div>
			<div class="level-item has-text-centered">
				<div>
					<p class="heading">Volume traded</p>
					<p class="title">
						<Money :value="collectionTradedVolumeNumber" inline />
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { NFT } from '@/components/rmrk/service/scheme'

const components = {
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component({components})
export default class extends Vue {
  @Prop() public nfts!: NFT[];

	get collectionLength() {
    return this.nfts.length;
  }

  get collectionFloorPrice() {
    return Math.min(
      ...this.nfts
        .map(nft => Number(nft.price))
        .filter(price => price > 0)
    );
  }

  get collectionSoldedNFT() {
    return this.nfts
      .map(nft => nft.price)
      .filter(price => price === '0').length;
  }

  get collectionTradedVol() {
    return this.nfts
      .map(nft => nft.events.filter((e: { interaction: string; }) => e.interaction === 'BUY'))
      .filter(arr => arr.length).length;
  }

  get collectionTradedVolumeNumber() {
    const nftsEvents = this.nfts.map(nft => nft.events);
    const sum = nftsEvents
      .map(event => event.filter((e: { interaction: string; }) => e.interaction === 'BUY'))
      .map((item, key) => {
        return (
          item.length &&
          nftsEvents[key].find((e: { interaction: string; }) => e.interaction === 'LIST').meta
        );
      })
      .reduce((a, b) => Number(a) + Number(b), 0);
    return sum;
  }
}
</script>
