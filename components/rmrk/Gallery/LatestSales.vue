<template>
  <div>
    <Loader v-model="isLoading" />

    <div class="columns is-vcentered">
      <div class="column is-four-fifths">
        <h1 class="title is-2">Latest sales</h1>
        <p class="subtitle is-size-5">Discover the most recent sales on rmrk</p>
      </div>
      <div class="column has-text-right">
        <b-button
          type="is-primary"
          inverted
          outlined
          icon-right="chevron-right"
          href="/rmrk/gallery?search=&sort=UPDATED_AT_DESC"
          >See More</b-button
        >
      </div>
    </div>

    <CarouselCardList :nfts="nfts" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { getMany, update } from 'idb-keyval'
import { getSanitizer } from '@/components/rmrk/utils'
import lastSoldNft from '@/queries/unique/lastSoldNft.graphql'

const components = {
  CarouselCardList: () => import('@/components/base/CarouselCardList.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component<LatestSales>({
  components,
})
export default class LatestSales extends Vue {
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
    })
  }

  protected async handleResult({ data }: any) {
    this.events = data.events
    this.nfts = data?.events.map((e: any) => ({
      price: e.meta,
      ...e.nft,
      image: getSanitizer(e.nft.meta.image)(e.nft.meta.image),
    }))
    // TODO: cached data
  }
}
</script>
