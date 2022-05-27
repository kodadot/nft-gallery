<template>
  <div>
    <Loader v-model="isLoading" />

    <div class="columns is-vcentered">
      <div class="column is-four-fifths">
        <h1 class="title is-2">{{ $t('general.latestSales') }}</h1>
        <p class="subtitle is-size-5">Discover the most recent sales on rmrk</p>
      </div>
      <div class="column has-text-right">
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
import { Component, mixins, Prop, Watch } from 'nuxt-property-decorator'
import lastNftListByEvent from '@/queries/rmrk/subsquid/lastNftListByEvent.graphql'
import { formatDistanceToNow } from 'date-fns'
import { fallbackMetaByNftEvent } from '@/utils/carousel'
import {
  getCloudflareImageLinks,
  getProperImageLink,
} from '~/utils/cachingStrategy'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import AuthMixin from '@/utils/mixins/authMixin'

const components = {
  CarouselCardList: () => import('@/components/base/CarouselCardList.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component<LatestSales>({
  components,
})
export default class LatestSales extends mixins(PrefixMixin, AuthMixin) {
  @Prop({ required: false, type: Array, default: () => [] })
  passionList?: string[]

  private nfts: any[] = []
  private events: any[] = []
  private currentValue = 1
  private total = 0

  get isLoading(): boolean {
    return false
  }

  async fetch() {
    this.fetchData()
  }

  @Watch('passionList')
  private onPassionList() {
    this.fetchData()
  }

  async fetchData() {
    const queryVars = {
      limit: 10,
      event: 'BUY',
      and: {},
    }
    if (this.isLogIn) {
      queryVars.and.nft = {
        issuer_in: this.passionList,
      }
    }
    const result = await this.$apollo
      .query<{
        events: { meta; nft: { meta: { id; image } } }
      }>({
        query: lastNftListByEvent,
        client: this.client,
        variables: queryVars,
      })
      .catch((e) => {
        this.$consola.error(e)
        return { data: null }
      })

    if (result.data) {
      await this.handleResult(result)
    }
  }

  protected async handleResult({ data }: any) {
    this.events = [...data.events]
    this.total = data.events.length

    await fallbackMetaByNftEvent(this.events)
    const images = await getCloudflareImageLinks(
      this.events.map(({ nft: { meta } }) => meta.id)
    )
    const imageOf = getProperImageLink(images)
    this.nfts = this.events.map((e: any) => ({
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
