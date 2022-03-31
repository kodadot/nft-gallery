<template>
  <div>
    <div v-if="nfts.length >= MIN_NFTS">
      <p class="subtitle is-size-4">Visited NFTs</p>
      <CarouselCardList :nfts="nfts" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { formatDistanceToNow } from 'date-fns'
import {
  getCloudflareImageLinks,
  getProperImageLink,
} from '~/utils/cachingStrategy'
import nftEntitiesByIDs from '@/queries/rmrk/subsquid/nftEntitiesByIDs.graphql'
import { CarouselNFTs } from '@/components/base/types'

@Component({
  components: {
    CarouselCardList: () => import('@/components/base/CarouselCardList.vue'),
  },
})
/**
 * class name
 */
export default class VisitedNFT extends Vue {
  MIN_NFTS = 3
  nfts: CarouselNFTs[] = []

  /**
   * Nuxt built-in data fetching
   * https://nuxtjs.org/docs/features/data-fetching/
   */
  async fetch() {
    const getHistory = localStorage.getItem('history')
    const {
      history: { visitedNFTs },
    } = getHistory && JSON.parse(getHistory)
    const nfts = visitedNFTs.slice(0, 10)

    if (nfts.length > this.MIN_NFTS) {
      const ids = nfts.map((nft) => nft.id)
      const { data } = await this.$apollo.query({
        query: nftEntitiesByIDs,
        client: 'subsquid',
        variables: {
          ids,
        },
      })

      const images = await getCloudflareImageLinks(
        data.nftEntities.map((nft) => nft.meta.id)
      )
      const imageOf = getProperImageLink(images)

      this.nfts = data.nftEntities.map((nft) => ({
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
