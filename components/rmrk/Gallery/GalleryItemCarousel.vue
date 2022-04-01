<template>
  <div>
    <div class="my-5" v-if="nfts.length >= MIN_NFTS">
      <p class="subtitle is-size-4">{{ $t(`nft.${type}`) }}</p>
      <CarouselCardList :nfts="nfts" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Provide } from 'nuxt-property-decorator'
import { formatNFT } from '~/utils/carousel'
import { visitedNFT } from '~/utils/localStorage'

import collectionEntityById from '@/queries/rmrk/subsquid/collectionEntityById.graphql'
import nftEntitiesByIDs from '@/queries/rmrk/subsquid/nftEntitiesByIDs.graphql'

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
  @Provide() MIN_NFTS = 3

  public nfts: CarouselNFT[] = []

  /**
   * Nuxt built-in data fetching
   * https://nuxtjs.org/docs/features/data-fetching/
   */
  public async fetch() {
    if (this.type === 'related') {
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

    if (this.type === 'visited' && visitedNFT().length >= this.MIN_NFTS) {
      let ids = visitedNFT().map((nft) => nft.id)

      const { data } = await this.$apollo.query({
        query: nftEntitiesByIDs,
        client: 'subsquid',
        variables: {
          ids,
        },
      })

      this.nfts = await formatNFT(data?.nftEntities)
    }
  }
}
</script>
