<template>
  <div>
    <Loader v-model="isLoading" />

    <div class="columns is-vcentered">
      <div class="column is-four-fifths">
        <h1 class="title is-2">
          {{ $t('general.popularCollectionsHeading') }}
        </h1>
        <p class="subtitle is-size-5">
          {{ $t('general.popularCollectionsDesc') }}
        </p>
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

    <CarouselCardList :nfts="nfts" :page="currentValue" :url="`collection`" />
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import popularCollectionList from '@/queries/rmrk/subsquid/popularCollectionList.graphql'
import { RowSeries } from '~/components/series/types'
import { sanitizeIpfsUrl } from '../utils'

const components = {
  CarouselCardList: () => import('@/components/base/CarouselCardList.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component<PopularCollections>({
  components,
})
export default class PopularCollections extends mixins(PrefixMixin) {
  private nfts: RowSeries[] = []
  private total = 0
  private currentValue = 1

  get isLoading(): boolean {
    return false
  }

  async created() {
    this.handleResult()
  }

  protected async handleResult() {
    const collections = await this.$apollo.query({
      query: popularCollectionList,
      client: 'subsquid',
      variables: {
        orderDirection: 'ASC',
        limit: 10,
        dateRange: '7 DAY',
        orderBy: 'volume',
      },
    })

    const {
      data: { seriesInsightTable },
    } = collections

    this.nfts = seriesInsightTable.map(
      (e: RowSeries): RowSeries => ({
        ...e,
        image: sanitizeIpfsUrl(e.image),
      })
    )
    this.total = this.nfts.length
  }
}
</script>
