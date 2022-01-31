<template>
  <div>
    <Loader v-model="isLoading" />

    <div class="columns is-vcentered">
      <div class="column is-four-fifths">
        <h1 class="title is-2">Latest sales</h1>
        <p class="subtitle is-size-5">Discover the most recent sales on rmrk</p>
      </div>
      <div class="column has-text-right">
        <b-button type="is-primary" inverted outlined icon-right="chevron-right"
          >See More</b-button
        >
      </div>
    </div>

    <CarouselList :nfts="nfts" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import lastSoldNft from '@/queries/unique/lastSoldNft.graphql'
import { NFTWithCollectionMeta } from 'components/unique/graphqlResponseTypes'
import {
  fetchMetadata,
  fetchNFTMetadata,
  getSanitizer,
} from '@/components/rmrk/utils'
import { getMany, update } from 'idb-keyval'

const components = {
  CarouselList: () => import('@/components/base/CarouselList.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component<test>({
  components,
  head() {
    const title = 'Low minting fees and carbonless NFTs'
    const metaData = {
      title,
      type: 'profile',
      description: 'Buy Carbonless NFTs on Kusama',
      url: '/rmrk/collections',
      image: `${this.$config.baseUrl}/k_card_collections.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class test extends Vue {
  private nfts: any[] = []
  private events: any[] = []

  get isLoading(): boolean {
    return this.$apollo.queries.nfts.loading
  }

  public async created() {
    this.$apollo.addSmartQuery('nfts', {
      query: lastSoldNft,
      manual: true,
      client: 'subsquid',
      loadingKey: 'isLoading',
      result: this.handleResult,
      // update: ({ collectionEntity }) => ({
      //   ...collectionEntity,
      //   nfts: collectionEntity.nfts.nodes,
      // }),
    })
  }

  protected async handleResult({ data }: any) {
    console.log(data)
    this.events = data.events
    this.nfts = data?.events.map((e: any) => ({
      price: e.meta,
      ...e.nft,
      image: getSanitizer(e.nft.meta.image)(e.nft.meta.image),
    }))

    // TODO: get cached data
  }
}
</script>
