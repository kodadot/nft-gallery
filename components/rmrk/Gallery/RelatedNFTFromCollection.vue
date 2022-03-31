<template>
  <div>
    <div v-if="nfts.length >= MIN_NFTS">
      <p class="subtitle is-size-4">More From This Collection</p>
      <CarouselCardList :nfts="nfts" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { formatDistanceToNow } from 'date-fns'
import {
  getCloudflareImageLinks,
  getProperImageLink,
} from '~/utils/cachingStrategy'
import collectionEntityById from '@/queries/rmrk/subsquid/collectionEntityById.graphql'
import { CarouselNFTs } from '@/components/base/types'

@Component({
  components: {
    CarouselCardList: () => import('@/components/base/CarouselCardList.vue'),
  },
})
/**
 * class name
 */
export default class RelatedNFTFromCollection extends Vue {
  @Prop({ type: String, required: true }) nftId!: string
  @Prop({ type: String, required: true }) collectionId!: string

  MIN_NFTS = 3
  nfts: CarouselNFTs[] = []

  /**
   * Nuxt built-in data fetching
   * https://nuxtjs.org/docs/features/data-fetching/
   */
  async fetch() {
    const { data } = await this.$apollo.query({
      query: collectionEntityById,
      client: 'subsquid',
      variables: {
        id: this.collectionId,
        nftId: this.nftId,
      },
    })
    const nfts = data?.collectionEntityById?.nfts

    if (nfts?.length >= this.MIN_NFTS) {
      const images = await getCloudflareImageLinks(
        nfts.map((nft) => nft.meta.id)
      )
      const imageOf = getProperImageLink(images)

      this.nfts = nfts.map((nft) => ({
        ...nft,
        timestamp: formatDistanceToNow(new Date(nft.updatedAt), {
          addSuffix: true,
        }),
        image: imageOf(nft.meta.id, nft.meta.image),
      }))
    }
  }
}
</script>
