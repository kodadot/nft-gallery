<template>
  <div data-cy="latest-sales">
    <Loader v-model="isLoading" />

    <div class="columns is-vcentered">
      <div class="column is-four-fifths">
        <h1 class="title is-2">{{ $t('general.latestSales') }}</h1>
        <p class="subtitle is-size-5">
          {{ $t('general.latestSalesheading') }} {{ urlPrefix }}
        </p>
      </div>
      <div class="column has-text-right">
        <Pagination
          v-model="currentValue"
          simple
          preserve-scroll
          :total="total"
          :per-page="1" />
      </div>
    </div>

    <CarouselCardList :nfts="nfts" :page="currentValue" />
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { formatDistanceToNow } from 'date-fns'

import { LastEvent } from '~/utils/types/types'

import { convertLastEventToNft, fallbackMetaByNftEvent } from '@/utils/carousel'
import {
  getCloudflareImageLinks,
  getProperImageLink,
} from '~/utils/cachingStrategy'
import lastNftListByEvent from '@/queries/rmrk/subsquid/lastNftListByEvent.graphql'

import AuthMixin from '@/utils/mixins/authMixin'
import PrefixMixin from '~/utils/mixins/prefixMixin'

const components = {
  CarouselCardList: () => import('@/components/base/CarouselCardList.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component<LatestSales>({
  components,
})
export default class LatestSales extends mixins(PrefixMixin, AuthMixin) {
  // @Prop({ required: false, type: Array, default: () => [] })
  // passionList?: string[]
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

  // @Watch('passionList')
  // private onPassionList() {
  //   this.fetchData()
  // }

  async fetchData() {
    const queryVars: { limit: number; event: string } = {
      limit: 10,
      event: 'BUY',
    }
    // if (this.isLogIn) {
    //   queryVars.passionAccount = this.accountId
    // }
    const result = await this.$apollo
      .query<{
        events: LastEvent[]
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

  protected async handleResult({ data }: { data: { events: LastEvent[] } }) {
    this.events = [...data.events].map(convertLastEventToNft)

    this.total = this.events.length

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
