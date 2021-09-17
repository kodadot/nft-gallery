<template>
	<div>
		<div class="level m-4" v-if="nfts">
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
			<div class="level-item has-text-centered">
				<div>
					<p class="heading">24h Volume traded</p>
					<p class="title">
						<Money :value="collectionDailyTradedVolumeNumber" inline />
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { NFT } from '@/components/rmrk/service/scheme'

const components = {
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component({components})
export default class extends Vue {
  @Prop() public nfts!: NFT[];
  public yesterdayDate: Date = new Date(Date.now() - 86400000);

  get nftsEvents() {
    return this.nfts.map(nft => nft.events);
  }

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
    const sum = this.nftsEvents
      .map(event => event.filter((e: { interaction: string; }) => e.interaction === 'BUY'))
      .map((item, key) => {
        return (
          item.length &&
          this.nftsEvents[key].find((e: { interaction: string; }) => e.interaction === 'LIST').meta
        );
      })
      .reduce((a, b) => Number(a) + Number(b), 0);
    return sum;
  }

  get collectionDailyTradedVolumeNumber() {
    const sum = this.nftsEvents
      .map(event => event.filter((e: { interaction: string; timestamp: Date }) => {
        return (
          e.interaction === 'BUY' && new Date(e.timestamp) >= this.yesterdayDate
        );
      }))
      .map((item, key) => {
        return (
          item.length &&
          this.nftsEvents[key].find((e: { interaction: string; }) => e.interaction === 'LIST').meta
        );
      })
      .reduce((a, b) => Number(a) + Number(b), 0);
    return sum;
  }
}
</script>
