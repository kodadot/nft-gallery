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
          tag="nuxt-link"
          type="is-primary"
          inverted
          outlined
          icon-right="chevron-right"
          to="/rmrk/gallery?search=&sort=UPDATED_AT_DESC">
          {{ $t('See More') }}
        </b-button>
      </div>
    </div>

    <CarouselCardList :nfts="nfts" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import {
  getCloudflareImageLinks,
  getProperImageLink,
} from '~/utils/cachingStrategy'
import { formatDistanceToNow } from 'date-fns'
import lastNftListByEvent from '@/queries/rmrk/subsquid/lastNftListByEvent.graphql'

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
  private total = 0

  get isLoading(): boolean {
    return false
  }

  async mounted() {
    const result = await this.$apollo
      .query<{
        events: { meta; nft: { meta: { id; image } } }
      }>({
        query: lastNftListByEvent,
        client: 'subsquid',
        variables: {
          limit: 10,
          event: 'LIST',
        },
      })
      .catch((e) => {
        console.error(e)
        return { data: null }
      })

    if (result.data) {
      this.handleResult(result)
    }
  }

  protected async handleResult({ data }: any) {
    this.events = data.events
    const images = await getCloudflareImageLinks(
      data.events.map(({ nft: { meta } }) => meta.id)
    )
    const imageOf = getProperImageLink(images)
    this.nfts = data.events.map((e: any) => ({
      price: e.meta,
      ...e.nft,
      timestamp: formatDistanceToNow(new Date(e.timestamp), {
        addSuffix: true,
      }),
      image: imageOf(e.nft.meta.id, e.nft.meta.image),
    }))
  }
}
</script>
