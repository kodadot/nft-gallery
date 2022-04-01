<template>
  <div>
    <div class="my-5" v-if="nftRelated.length >= MIN_NFTS">
      <p class="subtitle is-size-4">More From This Collection</p>
      <CarouselCardList :nfts="nftRelated" />
    </div>
    <div class="my-5" v-if="nftVisited.length >= MIN_NFTS">
      <p class="subtitle is-size-4">Visited NFTs</p>
      <CarouselCardList :nfts="nftVisited" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Provide } from 'nuxt-property-decorator'
import { formatDistanceToNow } from 'date-fns'
import {
  getCloudflareImageLinks,
  getProperImageLink,
} from '~/utils/cachingStrategy'
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
export default class RelatedNFTFromCollection extends Vue {
  @Prop({ type: String, required: true }) nftId!: string
  @Prop({ type: String, required: true }) collectionId!: string
  @Prop({ type: Number, required: true }) collectionLength!: number
  @Provide() MIN_NFTS = 3

  public nftRelated: CarouselNFT[] = []
  public nftVisited: CarouselNFT[] = []

  /**
   * Nuxt built-in data fetching
   * https://nuxtjs.org/docs/features/data-fetching/
   */
  async fetch() {
    // check visited NFT from localStorage.history
    const getHistory = localStorage.getItem('history')
    const {
      history: { visitedNFTs },
    } = getHistory && JSON.parse(getHistory)
    const ids = visitedNFTs?.map((nft) => nft.id)

    const queryRelated = this.$apollo.query({
      query: collectionEntityById,
      client: 'subsquid',
      variables: {
        id: this.collectionId,
        nftId: this.nftId,
      },
    })
    const queryVisited = this.$apollo.query({
      query: nftEntitiesByIDs,
      client: 'subsquid',
      variables: {
        ids,
      },
    })

    const queries = [
      this.collectionLength > this.MIN_NFTS && (await queryRelated),
      visitedNFTs.length >= this.MIN_NFTS && (await queryVisited),
    ]

    const [dataRelated, dataVisited] = await Promise.all(queries)
    const [related, visited] = await Promise.all([
      dataRelated &&
        (await this.formatNFT(dataRelated?.data?.collectionEntityById?.nfts)),
      dataVisited && (await this.formatNFT(dataVisited?.data?.nftEntities)),
    ])

    this.nftRelated = related || []
    this.nftVisited = visited || []
  }

  /**
   * Format the data to fit with CarouselNFT[]
   * Get cloudflare images
   * Update timestamp
   */
  public async formatNFT(data) {
    const images = await getCloudflareImageLinks(data.map((nft) => nft.meta.id))
    const imageOf = getProperImageLink(images)

    return data.map((nft) => ({
      ...nft,
      timestamp: formatDistanceToNow(new Date(nft.updatedAt), {
        addSuffix: true,
      }),
      image: imageOf(nft.meta.id, nft.meta.image),
    }))
  }
}
</script>
