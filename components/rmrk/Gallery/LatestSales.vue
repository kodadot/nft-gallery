<template>
  <div>
    <Loader v-model="isLoading" />

    <div class="columns is-vcentered">
      <div class="column is-four-fifths">
        <h1 class="title is-2">{{ $t('Latest sales') }}</h1>
        <p class="subtitle is-size-5">Discover the most recent sales on rmrk</p>
      </div>
      <div class="column has-text-right">
        <!-- <b-button
          type="is-primary"
          inverted
          outlined
          icon-right="chevron-right"
          href="/rmrk/gallery?search=&sort=UPDATED_AT_DESC">
          {{ $t('See More') }}
        </b-button> -->
        <Pagination
          simple
          preserveScroll
          v-model="currentValue"
          :total="total"
          :perPage="1" />
      </div>
    </div>

    <CarouselCardList :nfts="nfts" :page="currentValue" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { getSanitizer } from '@/components/rmrk/utils'
import lastSoldNft from '@/queries/unique/lastSoldNft.graphql'
import {
  getCloudflareImageLinks,
  getProperImageLink,
} from '~/utils/cachingStrategy'

const components = {
  CarouselCardList: () => import('@/components/base/CarouselCardList.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component<LatestSales>({
  components,
})
export default class LatestSales extends Vue {
  private nfts: any[] = []
  private events: any[] = []
  private currentValue = 0
  private total = 0

  get isLoading(): boolean {
    return this.$apollo.queries.nfts.loading
  }

  public fetch() {
    this.$apollo.addSmartQuery<{
      events: { meta; nft: { meta: { id; image } } }
    }>('nfts', {
      query: lastSoldNft,
      manual: true,
      client: 'subsquid',
      loadingKey: 'isLoading',
      result: this.handleResult,
    })
  }

  protected async handleResult({ data }: any) {
    this.events = data.events
    this.total = data.events.length
    const images = await getCloudflareImageLinks(
      data.events.map(({ nft: { meta } }) => meta.id)
    )
    const imageOf = getProperImageLink(images)
    this.nfts = data.events.map((e: any) => ({
      price: e.meta,
      ...e.nft,
      image: imageOf(e.nft.meta.id, e.nft.meta.image),
    }))
    // TODO: get cached data
  }
}
</script>
