<template>
  <div>
    <div class="my-5" v-if="showCarousel">
      <p class="subtitle is-size-4">{{ $t(`nft.${type}`) }}</p>
      <CarouselCardList :nfts="nfts" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { formatNFT } from '~/utils/carousel'
import { visitedNFT } from '~/utils/localStorage'
import { MIN_CAROUSEL_NFT } from '~/utils/constants'

import collectionEntityById from '@/queries/rmrk/subsquid/collectionEntityById.graphql'
import nftEntitiesByIDs from '@/queries/rmrk/subsquid/nftEntitiesByIDs.graphql'
import { sortItemListByIds } from '@/utils/sorting'
import { CarouselNFT } from '@/components/base/types'

@Component({
  components: {
    CarouselCardList: () => import('@/components/base/CarouselCardList.vue'),
  },
})
/**
 * class name
 */
export default class GalleryItemCarousel extends Vue {
  @Prop({ type: String, required: true }) type!: 'related' | 'visited'
  @Prop({ default: '' }) readonly collectionId!: string

  public nfts: CarouselNFT[] = []

  /**
   * Nuxt built-in data fetching
   * https://nuxtjs.org/docs/features/data-fetching/
   */
  public async fetch() {
    if (this.type === 'related' && this.collectionId) {
      const { data } = await this.$apollo.query({
        query: collectionEntityById,
        client: 'subsquid',
        variables: {
          id: this.collectionId,
          nftId: this.$route.params.id,
        },
      })

      this.nfts = await formatNFT(data?.collectionEntityById?.nfts)
    }

    if (this.type === 'visited' && visitedNFT().length >= MIN_CAROUSEL_NFT) {
      let ids = visitedNFT().map((nft) => nft.id)

      const { data } = await this.$apollo.query({
        query: nftEntitiesByIDs,
        client: 'subsquid',
        variables: {
          ids,
        },
      })

      const sortedNftList = sortItemListByIds(data?.nftEntities, ids, 10)
      this.nfts = await formatNFT(sortedNftList)
    }
  }

  get showCarousel(): boolean {
    return this.nfts.length >= MIN_CAROUSEL_NFT
  }
}
</script>
