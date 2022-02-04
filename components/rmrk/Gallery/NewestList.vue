<template>
  <div>
    <Loader v-model="isLoading" />

    <div class="columns is-vcentered">
      <div class="column is-four-fifths">
        <h1 class="title is-2">Newest List</h1>
        <p class="subtitle is-size-5">Discover the latest items on sale</p>
      </div>
      <div class="column has-text-right">
        <b-button
          type="is-primary"
          inverted
          outlined
          icon-right="chevron-right"
          href="/rmrk/gallery?search=&sort=UPDATED_AT_DESC">
          {{ $t('See More') }}
        </b-button>
      </div>
    </div>

    <CarouselCardList :nfts="nfts" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { getMany, update } from 'idb-keyval'
import { getSanitizer } from '@/components/rmrk/utils'
import newestListNft from '@/queries/unique/newestListNft.graphql'

const components = {
  CarouselCardList: () => import('@/components/base/CarouselCardList.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component<NewestList>({
  components,
})
export default class NewestList extends Vue {
  private nfts: any[] = []
  private events: any[] = []

  get isLoading(): boolean {
    return this.$apollo.queries.nfts.loading
  }

  public async created() {
    this.$apollo.addSmartQuery('nfts', {
      query: newestListNft,
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
