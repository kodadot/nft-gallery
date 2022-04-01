<template>
  <div>
    <GalleryItemCarousel
      v-if="nftRelated.length >= MIN_NFTS"
      :data="nftRelated"
      :title="$t('nft.related')" />
    <GalleryItemCarousel
      v-if="nftVisited.length >= MIN_NFTS"
      :data="nftVisited"
      :title="$t('nft.visited')" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Provide } from 'nuxt-property-decorator'
import { formatNFT } from '~/utils/carousel'
import { visitedNFTs } from '~/utils/localStorage'

import collectionEntityById from '@/queries/rmrk/subsquid/collectionEntityById.graphql'
import nftEntitiesByIDs from '@/queries/rmrk/subsquid/nftEntitiesByIDs.graphql'

import { CarouselNFT } from '@/components/base/types'

@Component({
  components: {
    GalleryItemCarousel: () => import('./GalleryItemCarousel.vue'),
  },
})
/**
 * class name
 */
export default class GalleryItemRelated extends Vue {
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
    // get IDs from visitedNFTs()
    const ids = visitedNFTs()?.map((nft) => nft.id)

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
      ids?.length >= this.MIN_NFTS && (await queryVisited),
    ]

    const [dataRelated, dataVisited] = await Promise.all(queries)
    const [related, visited] = await Promise.all([
      dataRelated &&
        (await formatNFT(dataRelated.data?.collectionEntityById?.nfts)),
      dataVisited && (await formatNFT(dataVisited.data?.nftEntities)),
    ])

    this.nftRelated = related || []
    this.nftVisited = visited || []
  }
}
</script>
